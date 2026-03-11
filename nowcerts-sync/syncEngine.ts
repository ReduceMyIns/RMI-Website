// ============================================================
// NowCerts <-> Firebase Sync Engine
// Bidirectional sync between NowCerts CRM and Firebase Firestore
//
// Collections written to Firestore:
//   nowcerts_insureds   - NowCerts insured records
//   nowcerts_policies   - NowCerts policy records
//   nowcerts_vehicles   - NowCerts vehicle records per policy
//   nowcerts_drivers    - NowCerts driver records per policy
//   sync_metadata       - Single doc tracking sync state
//
// Leads pushed to NowCerts:
//   Reads from 'leads' collection where nowcertsSynced != true
//   Marks synced leads with nowcertsSynced=true + nowcertsId
// ============================================================

import admin from 'firebase-admin';
import {
  fetchAllInsureds,
  fetchAllPolicies,
  fetchPolicyVehicles,
  fetchPolicyDrivers,
  pushLeadToNowCerts
} from './nowcertsClient.ts';
import type {
  SyncOptions,
  SyncResult,
  SyncError,
  SyncMetadata,
  FirebaseLead
} from './syncTypes.ts';

const SYNC_META_DOC = 'nowcerts_firebase_sync';
const BATCH_SIZE = 400; // Firestore batch limit is 500; keep headroom

// ---- Firestore helpers ----

function getDb(): FirebaseFirestore.Firestore {
  return admin.firestore();
}

async function getSyncMeta(): Promise<SyncMetadata> {
  const db = getDb();
  const snap = await db.collection('sync_metadata').doc(SYNC_META_DOC).get();
  if (snap.exists) return snap.data() as SyncMetadata;
  return {
    lastSyncedAt: null,
    lastSyncDuration: null,
    lastSyncStatus: null,
    lastError: null,
    totalInsuredsSynced: 0,
    totalPoliciesSynced: 0,
    totalVehiclesSynced: 0,
    totalDriversSynced: 0,
    totalLeadsPushed: 0,
    syncVersion: 0
  };
}

async function setSyncMeta(data: Partial<SyncMetadata>) {
  const db = getDb();
  await db.collection('sync_metadata').doc(SYNC_META_DOC).set(data, { merge: true });
}

/**
 * Write an array of records to a Firestore collection using batched writes.
 * Each record must have a `databaseId` used as the Firestore document ID.
 * Extra fields (_syncedAt, _syncVersion, _source) are added automatically.
 */
async function batchWrite(
  collectionName: string,
  records: any[],
  syncVersion: number
): Promise<number> {
  if (records.length === 0) return 0;
  const db = getDb();
  const now = new Date().toISOString();
  let written = 0;

  for (let i = 0; i < records.length; i += BATCH_SIZE) {
    const chunk = records.slice(i, i + BATCH_SIZE);
    const batch = db.batch();

    for (const record of chunk) {
      const docId = record.databaseId || record.id;
      if (!docId) {
        console.warn(`[SyncEngine] Skipping record with no databaseId in ${collectionName}`);
        continue;
      }
      const ref = db.collection(collectionName).doc(String(docId));
      batch.set(ref, {
        ...record,
        _syncedAt: now,
        _syncVersion: syncVersion,
        _source: 'nowcerts'
      }, { merge: true });
      written++;
    }

    await batch.commit();
  }

  return written;
}

// ---- NowCerts → Firebase ----

async function syncInsuredsToFirebase(opts: SyncOptions, syncVersion: number): Promise<{
  insuredsSynced: number;
  errors: SyncError[];
}> {
  const errors: SyncError[] = [];

  const meta = await getSyncMeta();
  const modifiedSince = (!opts.fullSync && meta.lastSyncedAt) ? meta.lastSyncedAt : undefined;

  console.log(`[SyncEngine] Fetching insureds${modifiedSince ? ` modified since ${modifiedSince}` : ' (full sync)'}...`);

  const insureds = await fetchAllInsureds({
    modifiedSince,
    pageSize: opts.pageSize || 50,
    maxPages: opts.maxPages
  });

  const insuredsSynced = await batchWrite('nowcerts_insureds', insureds, syncVersion);
  console.log(`[SyncEngine] Wrote ${insuredsSynced} insureds to Firestore.`);

  return { insuredsSynced, errors };
}

async function syncPoliciesToFirebase(opts: SyncOptions, syncVersion: number): Promise<{
  policiesSynced: number;
  vehiclesSynced: number;
  driversSynced: number;
  errors: SyncError[];
}> {
  const errors: SyncError[] = [];
  const meta = await getSyncMeta();
  const modifiedSince = (!opts.fullSync && meta.lastSyncedAt) ? meta.lastSyncedAt : undefined;

  console.log(`[SyncEngine] Fetching policies${modifiedSince ? ` modified since ${modifiedSince}` : ' (full sync)'}...`);

  const policies = await fetchAllPolicies({
    modifiedSince,
    pageSize: opts.pageSize || 50,
    maxPages: opts.maxPages
  });

  const policiesSynced = await batchWrite('nowcerts_policies', policies, syncVersion);
  console.log(`[SyncEngine] Wrote ${policiesSynced} policies to Firestore.`);

  // For each policy, fetch vehicles and drivers
  let vehiclesSynced = 0;
  let driversSynced = 0;
  const allVehicles: any[] = [];
  const allDrivers: any[] = [];

  for (const policy of policies) {
    const policyId = policy.databaseId;
    if (!policyId) continue;

    try {
      const [vehicles, drivers] = await Promise.all([
        fetchPolicyVehicles(policyId),
        fetchPolicyDrivers(policyId)
      ]);

      // Tag with policyDatabaseId for querying
      for (const v of vehicles) {
        allVehicles.push({ ...v, policyDatabaseId: policyId, insuredDatabaseId: policy.insuredDatabaseId });
      }
      for (const d of drivers) {
        allDrivers.push({ ...d, policyDatabaseId: policyId, insuredDatabaseId: policy.insuredDatabaseId });
      }
    } catch (e: any) {
      errors.push({
        entityType: 'policy',
        entityId: policyId,
        message: `Failed fetching vehicles/drivers: ${e.message}`,
        timestamp: new Date().toISOString()
      });
    }
  }

  vehiclesSynced = await batchWrite('nowcerts_vehicles', allVehicles, syncVersion);
  driversSynced = await batchWrite('nowcerts_drivers', allDrivers, syncVersion);

  console.log(`[SyncEngine] Wrote ${vehiclesSynced} vehicles, ${driversSynced} drivers to Firestore.`);

  return { policiesSynced, vehiclesSynced, driversSynced, errors };
}

// ---- Firebase → NowCerts ----

async function syncLeadsToNowCerts(): Promise<{
  leadsPushed: number;
  errors: SyncError[];
}> {
  const db = getDb();
  const errors: SyncError[] = [];
  let leadsPushed = 0;

  // Query leads that have not been synced yet
  const snap = await db.collection('leads')
    .where('nowcertsSynced', '!=', true)
    .limit(100)
    .get();

  // Also catch leads where the field doesn't exist
  const snapMissing = await db.collection('leads')
    .orderBy('createdAt', 'desc')
    .limit(200)
    .get();

  // Merge and deduplicate
  const docMap = new Map<string, FirebaseFirestore.QueryDocumentSnapshot>();
  for (const doc of [...snap.docs, ...snapMissing.docs]) {
    if (!docMap.has(doc.id)) docMap.set(doc.id, doc);
  }

  const unsynced: Array<{ id: string; data: FirebaseLead }> = [];
  for (const [id, doc] of docMap) {
    const data = doc.data() as FirebaseLead;
    if (!data.nowcertsSynced) {
      unsynced.push({ id, data });
    }
  }

  console.log(`[SyncEngine] Found ${unsynced.length} unsynced leads to push to NowCerts.`);

  for (const { id, data } of unsynced) {
    try {
      const payload = mapLeadToNCPayload(data);
      const result = await pushLeadToNowCerts(payload);

      await db.collection('leads').doc(id).update({
        nowcertsSynced: true,
        nowcertsId: result.ncInsuredId || null,
        nowcertsPolicyId: result.ncPolicyId || null,
        nowcertsSyncedAt: new Date().toISOString()
      });

      leadsPushed++;
      console.log(`[SyncEngine] Lead ${id} pushed → NC insured ${result.ncInsuredId}`);
    } catch (e: any) {
      console.error(`[SyncEngine] Failed to push lead ${id}:`, e.message);

      // Mark the error on the lead so we don't retry infinitely on bad data
      try {
        await db.collection('leads').doc(id).update({
          nowcertsSyncError: e.message,
          nowcertsSyncAttemptedAt: new Date().toISOString()
        });
      } catch {/* ignore update failure */}

      errors.push({
        entityType: 'lead',
        entityId: id,
        message: e.message,
        timestamp: new Date().toISOString()
      });
    }
  }

  return { leadsPushed, errors };
}

function mapLeadToNCPayload(lead: FirebaseLead) {
  return {
    firstName: lead.firstName || '',
    lastName: lead.lastName || '',
    commercialName: lead.commercialName,
    dba: lead.dba,
    type: lead.type === 'Commercial' ? 'Prospect' : 'Prospect',
    insuredType: lead.type || 'Personal',
    email: lead.email || '',
    phone: lead.phone || '',
    addressLine1: lead.address || '',
    city: lead.city || '',
    state: lead.state || '',
    zipCode: lead.zip || '',
    dateOfBirth: lead.dob,
    insuredContacts: (lead.residents || []).map((r: any) => ({
      firstName: r.firstName || '',
      lastName: r.lastName || '',
      type: r.relationship === 'Self' ? 'Insured' : (r.relationship || 'Contact'),
      birthday: r.dob ? new Date(r.dob).toISOString() : null,
      isDriver: r.status === 'rated',
      dlNumber: r.licenseNumber,
      dlStateName: r.licenseState,
      maritalStatus: r.maritalStatus,
      email: r.email,
      phone: r.phone
    })),
    Vehicles: (lead.vehicles || []).map((v: any) => ({
      year: v.year,
      make: v.make,
      model: v.model,
      vin: v.vin || '',
      type_of_use: v.usage === 'business' ? 1 : 2,
      active: v.active !== false,
      estimated_annual_distance: v.annualMileage?.toString() || '12000'
    })),
    FenrisData: lead.fenrisData || null,
    policies: [
      {
        isQuote: true,
        linesOfBusiness: lead.bundledLines || [],
        effectiveDate: new Date().toISOString(),
        expirationDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString(),
        description: `Web Lead - ${lead.source || 'Firebase'}`,
        active: true
      }
    ]
  };
}

// ---- Main Sync Orchestrator ----

export async function runSync(options: SyncOptions = {}): Promise<SyncResult> {
  const startedAt = new Date().toISOString();
  const startMs = Date.now();
  const direction = options.direction || 'both';
  const allErrors: SyncError[] = [];

  console.log(`[SyncEngine] Starting sync (direction=${direction}, fullSync=${!!options.fullSync})...`);

  // Mark as running
  await setSyncMeta({ lastSyncStatus: 'running' });

  const result: SyncResult = {
    success: false,
    durationMs: 0,
    insuredsSynced: 0,
    policiesSynced: 0,
    vehiclesSynced: 0,
    driversSynced: 0,
    leadsPushed: 0,
    errors: [],
    startedAt,
    completedAt: ''
  };

  try {
    const meta = await getSyncMeta();
    const syncVersion = (meta.syncVersion || 0) + 1;

    // ---- NowCerts → Firebase ----
    if (direction === 'ncToFirebase' || direction === 'both') {
      const [insuredResult, policyResult] = await Promise.all([
        syncInsuredsToFirebase(options, syncVersion),
        syncPoliciesToFirebase(options, syncVersion)
      ]);

      result.insuredsSynced = insuredResult.insuredsSynced;
      result.policiesSynced = policyResult.policiesSynced;
      result.vehiclesSynced = policyResult.vehiclesSynced;
      result.driversSynced = policyResult.driversSynced;
      allErrors.push(...insuredResult.errors, ...policyResult.errors);
    }

    // ---- Firebase → NowCerts ----
    if (direction === 'firebaseToNC' || direction === 'both') {
      const leadsResult = await syncLeadsToNowCerts();
      result.leadsPushed = leadsResult.leadsPushed;
      allErrors.push(...leadsResult.errors);
    }

    result.errors = allErrors;
    result.success = allErrors.length === 0;
    result.durationMs = Date.now() - startMs;
    result.completedAt = new Date().toISOString();

    const status = allErrors.length === 0 ? 'success' : 'partial';

    await setSyncMeta({
      lastSyncedAt: result.completedAt,
      lastSyncDuration: result.durationMs,
      lastSyncStatus: status,
      lastError: allErrors.length > 0 ? allErrors[0].message : null,
      totalInsuredsSynced: result.insuredsSynced,
      totalPoliciesSynced: result.policiesSynced,
      totalVehiclesSynced: result.vehiclesSynced,
      totalDriversSynced: result.driversSynced,
      totalLeadsPushed: result.leadsPushed,
      syncVersion: (meta.syncVersion || 0) + 1
    });

    console.log(`[SyncEngine] Sync complete in ${result.durationMs}ms. Status: ${status}`);
    return result;

  } catch (e: any) {
    console.error('[SyncEngine] Fatal sync error:', e);
    result.durationMs = Date.now() - startMs;
    result.completedAt = new Date().toISOString();
    result.errors = [{
      entityType: 'insured',
      entityId: 'N/A',
      message: e.message,
      timestamp: result.completedAt
    }];

    await setSyncMeta({
      lastSyncStatus: 'failed',
      lastError: e.message,
      lastSyncDuration: result.durationMs
    });

    return result;
  }
}

export { getSyncMeta };
