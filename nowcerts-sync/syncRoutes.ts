// ============================================================
// NowCerts <-> Firebase Sync: Express API Routes
// Mount at /api/sync in server.ts
// ============================================================

import { Router } from 'express';
import { runSync, getSyncMeta } from './syncEngine.ts';
import {
  fetchInsuredPage,
  fetchPoliciesForInsured,
  fetchPolicyVehicles,
  fetchPolicyDrivers,
  pushLeadToNowCerts,
  zapierSubscribe,
  zapierUnsubscribe,
  ZapierEventType,
  findPolicies,
  zapierInsertTask,
  zapierInsertOpportunity
} from './nowcertsClient.ts';
import type { SyncOptions } from './syncTypes.ts';
import admin from 'firebase-admin';

const router = Router();

// Simple API key guard for sync endpoints (set SYNC_API_KEY env var)
function requireApiKey(req: any, res: any, next: any) {
  const apiKey = process.env.SYNC_API_KEY;
  if (!apiKey) {
    // No key configured → open for internal use (warn in logs)
    console.warn('[SyncRoutes] SYNC_API_KEY not set. Sync endpoints are unprotected.');
    return next();
  }
  const provided = req.headers['x-sync-api-key'] || req.query.apiKey;
  if (provided !== apiKey) {
    return res.status(401).json({ error: 'Unauthorized: invalid or missing X-Sync-Api-Key header' });
  }
  next();
}

// ---- GET /api/sync/status ----
// Returns current sync metadata from Firestore
router.get('/status', async (req, res) => {
  try {
    const meta = await getSyncMeta();
    res.json({ ok: true, sync: meta });
  } catch (e: any) {
    console.error('[SyncRoutes] status error:', e);
    res.status(500).json({ error: e.message });
  }
});

// ---- POST /api/sync/run ----
// Trigger a full or incremental bidirectional sync
// Body: { fullSync?: boolean, direction?: 'both'|'ncToFirebase'|'firebaseToNC', pageSize?: number }
router.post('/run', requireApiKey, async (req, res) => {
  try {
    const opts: SyncOptions = {
      fullSync: req.body.fullSync === true,
      direction: req.body.direction || 'both',
      pageSize: req.body.pageSize || 50,
      maxPages: req.body.maxPages || 0
    };

    console.log('[SyncRoutes] Manual sync triggered:', opts);
    // Run sync asynchronously so we can respond immediately if the request might time out
    const shouldAwait = req.query.wait !== 'false';

    if (shouldAwait) {
      const result = await runSync(opts);
      res.json({ ok: result.success, result });
    } else {
      // Fire-and-forget with a jobId
      const jobId = `sync-${Date.now()}`;
      res.json({ ok: true, jobId, message: 'Sync started in background. Check /api/sync/status for progress.' });
      runSync(opts).catch(e => console.error('[SyncRoutes] Background sync error:', e));
    }
  } catch (e: any) {
    console.error('[SyncRoutes] run error:', e);
    res.status(500).json({ error: e.message });
  }
});

// ---- POST /api/sync/nowcerts-to-firebase ----
// Convenience alias: pull-only direction
router.post('/nowcerts-to-firebase', requireApiKey, async (req, res) => {
  try {
    const opts: SyncOptions = {
      fullSync: req.body.fullSync === true,
      direction: 'ncToFirebase',
      pageSize: req.body.pageSize || 50
    };
    const result = await runSync(opts);
    res.json({ ok: result.success, result });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

// ---- POST /api/sync/firebase-to-nowcerts ----
// Convenience alias: push-only direction (unsynced leads → NowCerts)
router.post('/firebase-to-nowcerts', requireApiKey, async (req, res) => {
  try {
    const opts: SyncOptions = {
      direction: 'firebaseToNC'
    };
    const result = await runSync(opts);
    res.json({ ok: result.success, result });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

// ---- GET /api/sync/insureds ----
// Query synced insureds from Firestore with optional search
router.get('/insureds', async (req, res) => {
  try {
    const db = admin.firestore();
    const { email, name, phone, limit: lim } = req.query as Record<string, string>;
    let q: any = db.collection('nowcerts_insureds');

    if (email) {
      q = q.where('eMail', '==', email);
    } else if (phone) {
      q = q.where('phone', '==', phone);
    } else if (name) {
      // Prefix search via orderBy is limited; for now return all and filter in memory
      q = q.orderBy('lastName').startAt(name).endAt(name + '\uf8ff');
    } else {
      q = q.orderBy('_syncedAt', 'desc');
    }

    q = q.limit(Number(lim) || 50);
    const snap = await q.get();
    const docs = snap.docs.map((d: any) => ({ id: d.id, ...d.data() }));
    res.json({ ok: true, count: docs.length, insureds: docs });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

// ---- GET /api/sync/insureds/:id ----
// Get a single synced insured + their policies
router.get('/insureds/:id', async (req, res) => {
  try {
    const db = admin.firestore();
    const insuredDoc = await db.collection('nowcerts_insureds').doc(req.params.id).get();
    if (!insuredDoc.exists) {
      return res.status(404).json({ error: 'Insured not found in Firebase cache' });
    }

    const policies = await db.collection('nowcerts_policies')
      .where('insuredDatabaseId', '==', req.params.id)
      .get();

    res.json({
      ok: true,
      insured: { id: insuredDoc.id, ...insuredDoc.data() },
      policies: policies.docs.map(d => ({ id: d.id, ...d.data() }))
    });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

// ---- GET /api/sync/policies ----
// Query synced policies from Firestore
router.get('/policies', async (req, res) => {
  try {
    const db = admin.firestore();
    const { insuredId, policyNumber, active, limit: lim } = req.query as Record<string, string>;
    let q: any = db.collection('nowcerts_policies');

    if (insuredId) {
      q = q.where('insuredDatabaseId', '==', insuredId);
    } else if (policyNumber) {
      q = q.where('policyNumber', '==', policyNumber);
    } else if (active !== undefined) {
      q = q.where('active', '==', active === 'true');
    } else {
      q = q.orderBy('_syncedAt', 'desc');
    }

    q = q.limit(Number(lim) || 50);
    const snap = await q.get();
    const docs = snap.docs.map((d: any) => ({ id: d.id, ...d.data() }));
    res.json({ ok: true, count: docs.length, policies: docs });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

// ---- GET /api/sync/policies/:id/vehicles ----
router.get('/policies/:id/vehicles', async (req, res) => {
  try {
    const db = admin.firestore();
    const snap = await db.collection('nowcerts_vehicles')
      .where('policyDatabaseId', '==', req.params.id)
      .get();
    res.json({ ok: true, vehicles: snap.docs.map(d => ({ id: d.id, ...d.data() })) });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

// ---- GET /api/sync/policies/:id/drivers ----
router.get('/policies/:id/drivers', async (req, res) => {
  try {
    const db = admin.firestore();
    const snap = await db.collection('nowcerts_drivers')
      .where('policyDatabaseId', '==', req.params.id)
      .get();
    res.json({ ok: true, drivers: snap.docs.map(d => ({ id: d.id, ...d.data() })) });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

// ---- GET /api/sync/leads/unsynced ----
// List leads not yet pushed to NowCerts
router.get('/leads/unsynced', requireApiKey, async (req, res) => {
  try {
    const db = admin.firestore();
    const snap = await db.collection('leads')
      .where('nowcertsSynced', '!=', true)
      .limit(100)
      .get();
    res.json({ ok: true, count: snap.size, leads: snap.docs.map(d => ({ id: d.id, ...d.data() })) });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

// ---- POST /api/sync/leads/:id/push ----
// Manually push a single lead to NowCerts
router.post('/leads/:id/push', requireApiKey, async (req, res) => {
  try {
    const db = admin.firestore();
    const docSnap = await db.collection('leads').doc(req.params.id).get();
    if (!docSnap.exists) {
      return res.status(404).json({ error: 'Lead not found' });
    }

    const lead = docSnap.data() as any;
    const result = await pushLeadToNowCerts({
      firstName: lead.firstName,
      lastName: lead.lastName,
      commercialName: lead.commercialName,
      dba: lead.dba,
      type: lead.type === 'Commercial' ? 'Prospect' : 'Prospect',
      insuredType: lead.type || 'Personal',
      email: lead.email,
      phone: lead.phone,
      addressLine1: lead.address,
      city: lead.city,
      state: lead.state,
      zipCode: lead.zip,
      dateOfBirth: lead.dob
    });

    await db.collection('leads').doc(req.params.id).update({
      nowcertsSynced: true,
      nowcertsId: result.ncInsuredId || null,
      nowcertsPolicyId: result.ncPolicyId || null,
      nowcertsSyncedAt: new Date().toISOString()
    });

    res.json({ ok: true, result });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

// ---- POST /api/sync/webhook ----
// NowCerts webhook receiver (configure in NowCerts portal → Zapier/Webhooks)
// Payload varies by event type; we re-sync the relevant entity on receipt
router.post('/webhook', async (req, res) => {
  try {
    const payload = req.body;
    console.log('[SyncRoutes] Webhook received:', JSON.stringify(payload).slice(0, 200));

    const db = admin.firestore();
    const now = new Date().toISOString();

    // NowCerts webhook typically sends: { EventType, InsuredDatabaseId, PolicyDatabaseId, ... }
    const eventType = payload?.EventType || payload?.eventType || 'unknown';
    const insuredId = payload?.InsuredDatabaseId || payload?.insuredDatabaseId;
    const policyId = payload?.PolicyDatabaseId || payload?.policyDatabaseId;

    // Log the webhook event
    await db.collection('sync_webhooks').add({
      eventType,
      insuredId: insuredId || null,
      policyId: policyId || null,
      payload,
      receivedAt: now
    });

    // Trigger targeted re-sync for the affected entity
    if (insuredId) {
      // Re-fetch and update the specific insured
      try {
        const insuredRes = await fetchInsuredPage(0, 1, `databaseId eq '${insuredId}'`);
        const insured = insuredRes.value?.[0];
        if (insured) {
          await db.collection('nowcerts_insureds').doc(insuredId).set({
            ...insured,
            _syncedAt: now,
            _syncVersion: -1, // webhook update
            _source: 'nowcerts'
          }, { merge: true });
          console.log(`[SyncRoutes] Webhook: updated insured ${insuredId}`);
        }
      } catch (e) {
        console.warn(`[SyncRoutes] Webhook: failed to refresh insured ${insuredId}:`, e);
      }
    }

    if (policyId) {
      // Re-fetch vehicles and drivers for the affected policy
      try {
        const [vehicles, drivers] = await Promise.all([
          fetchPolicyVehicles(policyId),
          fetchPolicyDrivers(policyId)
        ]);

        const batch = db.batch();
        for (const v of vehicles) {
          if (!v.databaseId) continue;
          batch.set(db.collection('nowcerts_vehicles').doc(String(v.databaseId)), {
            ...v, policyDatabaseId: policyId, _syncedAt: now, _syncVersion: -1, _source: 'nowcerts'
          }, { merge: true });
        }
        for (const d of drivers) {
          if (!d.databaseId) continue;
          batch.set(db.collection('nowcerts_drivers').doc(String(d.databaseId)), {
            ...d, policyDatabaseId: policyId, _syncedAt: now, _syncVersion: -1, _source: 'nowcerts'
          }, { merge: true });
        }
        await batch.commit();
        console.log(`[SyncRoutes] Webhook: updated vehicles/drivers for policy ${policyId}`);
      } catch (e) {
        console.warn(`[SyncRoutes] Webhook: failed to refresh policy ${policyId}:`, e);
      }
    }

    res.json({ ok: true, received: eventType });
  } catch (e: any) {
    console.error('[SyncRoutes] Webhook error:', e);
    res.status(500).json({ error: e.message });
  }
});

// ---- GET /api/sync/nowcerts/insureds ----
// Live query directly from NowCerts API (bypasses cache)
router.get('/nowcerts/insureds', requireApiKey, async (req, res) => {
  try {
    const { email, phone, name, skip, top } = req.query as Record<string, string>;
    let filter: string | undefined;

    if (email) filter = `contains(eMail, '${email}') or contains(eMail2, '${email}')`;
    else if (phone) {
      const clean = phone.replace(/\D/g, '');
      const fmt = clean.length === 10 ? `${clean.slice(0,3)}-${clean.slice(3,6)}-${clean.slice(6)}` : clean;
      filter = `contains(phone, '${fmt}') or contains(cellPhone, '${fmt}')`;
    } else if (name) {
      filter = `contains(firstName, '${name}') or contains(lastName, '${name}') or contains(commercialName, '${name}')`;
    }

    const result = await fetchInsuredPage(
      Number(skip) || 0,
      Number(top) || 20,
      filter
    );
    res.json({ ok: true, ...result });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

// ---- GET /api/sync/nowcerts/insureds/:id/policies ----
// Live policy lookup from NowCerts for a specific insured
router.get('/nowcerts/insureds/:id/policies', requireApiKey, async (req, res) => {
  try {
    const policies = await fetchPoliciesForInsured(req.params.id);
    res.json({ ok: true, count: policies.length, policies });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

// ---- POST /api/sync/webhooks/register ----
// Register a NowCerts webhook to auto-sync on data changes
// Body: { webhookUrl: string, events?: number[] }
// If webhookUrl not provided, uses this server's own /api/sync/webhook endpoint
router.post('/webhooks/register', requireApiKey, async (req, res) => {
  try {
    const protocol = req.headers['x-forwarded-proto'] || req.protocol;
    const host = req.headers['x-forwarded-host'] || req.get('host');
    const defaultUrl = `${protocol}://${host}/api/sync/webhook`;

    const targetUrl: string = req.body.webhookUrl || defaultUrl;
    const events: number[] = req.body.events || Object.values(ZapierEventType);

    const results: any[] = [];
    for (const event of events) {
      try {
        const r = await zapierSubscribe(targetUrl, event);
        results.push({ event, success: true, response: r });
      } catch (e: any) {
        results.push({ event, success: false, error: e.message });
      }
    }

    res.json({ ok: true, targetUrl, results });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

// ---- POST /api/sync/webhooks/unregister ----
router.post('/webhooks/unregister', requireApiKey, async (req, res) => {
  try {
    const protocol = req.headers['x-forwarded-proto'] || req.protocol;
    const host = req.headers['x-forwarded-host'] || req.get('host');
    const defaultUrl = `${protocol}://${host}/api/sync/webhook`;

    const targetUrl: string = req.body.webhookUrl || defaultUrl;
    const events: number[] = req.body.events || Object.values(ZapierEventType);

    const results: any[] = [];
    for (const event of events) {
      try {
        const r = await zapierUnsubscribe(targetUrl, event);
        results.push({ event, success: true, response: r });
      } catch (e: any) {
        results.push({ event, success: false, error: e.message });
      }
    }

    res.json({ ok: true, targetUrl, results });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

// ---- GET /api/sync/webhooks/events ----
// List available NowCerts event types for webhook registration
router.get('/webhooks/events', (req, res) => {
  res.json({ ok: true, events: ZapierEventType });
});

// ---- POST /api/sync/nowcerts/tasks ----
// Insert a task in NowCerts for a specific insured
router.post('/nowcerts/tasks', requireApiKey, async (req, res) => {
  try {
    const { insuredDatabaseId, title, dueDate, priority, notes, assignedToAgent } = req.body;
    if (!insuredDatabaseId || !title) {
      return res.status(400).json({ error: 'insuredDatabaseId and title are required' });
    }
    const result = await zapierInsertTask({
      insuredDatabaseId,
      title,
      dueDate,
      priority: priority || 'Normal',
      notes,
      assignedToAgent
    });
    res.json({ ok: true, result });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

// ---- POST /api/sync/nowcerts/opportunities ----
// Insert an opportunity in NowCerts
router.post('/nowcerts/opportunities', requireApiKey, async (req, res) => {
  try {
    const { insuredDatabaseId, stage, lineOfBusiness, probability, estimatedPremium, notes } = req.body;
    if (!insuredDatabaseId) {
      return res.status(400).json({ error: 'insuredDatabaseId is required' });
    }
    const result = await zapierInsertOpportunity({
      insuredDatabaseId,
      stage: stage || 'New',
      lineOfBusiness,
      probability,
      estimatedPremium,
      notes
    });
    res.json({ ok: true, result });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

// ---- GET /api/sync/nowcerts/policies/search ----
// Search NowCerts policies directly
router.get('/nowcerts/policies/search', requireApiKey, async (req, res) => {
  try {
    const { policyNumber, insuredName, isQuote } = req.query as Record<string, string>;
    const results = await findPolicies({
      policyNumber,
      insuredName,
      isQuote: isQuote !== undefined ? isQuote === 'true' : undefined
    });
    res.json({ ok: true, count: results.length, policies: results });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

export default router;
