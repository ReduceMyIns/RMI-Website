// ============================================================
// NowCerts <-> Firebase Sync: Server-side NowCerts API Client
// Handles authentication and direct API calls (no Express proxy)
// ============================================================

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import type { NCInsured, NCPolicy, NCVehicle, NCDriver } from './syncTypes.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const NC_API_BASE = 'https://api.nowcerts.com';
const NC_CLIENT_ID = 'ngAuthApp';
const AGENCY_ID = '7b9d101f-6a6c-40a6-b256-bfd8a901c277';

const TOKEN_FILE_PATH = process.env.NODE_ENV === 'production'
  ? '/tmp/nowcerts-token.json'
  : path.join(__dirname, '..', 'nowcerts-token.json');

// ---- Token Management ----

interface TokenData {
  access_token: string;
  refresh_token: string;
  expires_at: number;
}

let _token: TokenData | null = null;

function readToken(): TokenData | null {
  try {
    if (fs.existsSync(TOKEN_FILE_PATH)) {
      const raw = fs.readFileSync(TOKEN_FILE_PATH, 'utf-8');
      const parsed = JSON.parse(raw);
      if (parsed.access_token) return parsed;
    }
  } catch {/* ignore */}
  return null;
}

function writeToken(data: TokenData) {
  try {
    fs.writeFileSync(TOKEN_FILE_PATH, JSON.stringify(data), 'utf-8');
  } catch (e) {
    console.warn('[NowCertsClient] Could not write token file:', e);
  }
}

async function getAccessToken(): Promise<string> {
  // Load from disk if not in memory
  if (!_token) {
    _token = readToken();
  }

  // Return cached token if still valid
  if (_token && _token.access_token && Date.now() < _token.expires_at) {
    return _token.access_token;
  }

  // Try refresh token flow
  if (_token?.refresh_token) {
    try {
      const res = await fetch(`${NC_API_BASE}/api/token`, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
        body: `grant_type=refresh_token&refresh_token=${_token.refresh_token}&client_id=${NC_CLIENT_ID}`
      });
      if (res.ok) {
        const data = await res.json();
        _token = {
          access_token: data.access_token,
          refresh_token: data.refresh_token || _token.refresh_token,
          expires_at: Date.now() + (data.expires_in * 1000) - 60000
        };
        writeToken(_token);
        console.log('[NowCertsClient] Token refreshed successfully.');
        return _token.access_token;
      }
      console.warn('[NowCertsClient] Refresh failed, falling back to password grant.');
      _token = null;
    } catch (e) {
      console.warn('[NowCertsClient] Refresh error:', e);
      _token = null;
    }
  }

  // Password grant fallback
  const username = process.env.NOWCERTS_USERNAME || 'chase@reducemyinsurance.net';
  const password = process.env.NOWCERTS_PASSWORD || 'TempPassword!1';

  const res = await fetch(`${NC_API_BASE}/api/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain' },
    body: `grant_type=password&username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}&client_id=${NC_CLIENT_ID}`
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`[NowCertsClient] Authentication failed: ${err}`);
  }

  const data = await res.json();
  _token = {
    access_token: data.access_token,
    refresh_token: data.refresh_token || '',
    expires_at: Date.now() + (data.expires_in * 1000) - 60000
  };
  writeToken(_token);
  console.log('[NowCertsClient] Authenticated via password grant.');
  return _token.access_token;
}

// ---- Generic Request Helper ----

async function ncRequest<T>(
  endpoint: string,
  options: { method?: string; body?: any } = {}
): Promise<T> {
  const token = await getAccessToken();
  const method = options.method || 'GET';

  const fetchOptions: RequestInit = {
    method,
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  };

  if (options.body && method !== 'GET') {
    fetchOptions.body = JSON.stringify(options.body);
  }

  const url = endpoint.startsWith('http') ? endpoint : `${NC_API_BASE}${endpoint}`;
  let res = await fetch(url, fetchOptions);

  // Auto re-auth on 401
  if (res.status === 401) {
    console.warn('[NowCertsClient] 401 received, forcing re-auth...');
    _token = null;
    const freshToken = await getAccessToken();
    (fetchOptions.headers as any)['Authorization'] = `Bearer ${freshToken}`;
    res = await fetch(url, fetchOptions);
  }

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`[NowCertsClient] ${method} ${endpoint} → ${res.status}: ${body}`);
  }

  const text = await res.text();
  if (!text) return {} as T;
  return JSON.parse(text) as T;
}

// ---- Insured API ----

export interface InsuredListResponse {
  value: NCInsured[];
  '@odata.count'?: number;
  '@odata.nextLink'?: string;
}

/**
 * Fetch a page of insureds from NowCerts.
 * @param skip   OData $skip offset
 * @param top    OData $top page size (max 100)
 * @param filter Optional OData $filter expression (without the $filter= prefix)
 */
export async function fetchInsuredPage(
  skip = 0,
  top = 50,
  filter?: string
): Promise<InsuredListResponse> {
  const params = new URLSearchParams({
    '$skip': skip.toString(),
    '$top': top.toString(),
    '$count': 'true',
    '$orderby': 'modifiedOn desc'
  });
  if (filter) params.append('$filter', filter);

  return ncRequest<InsuredListResponse>(`/api/InsuredList()?${params.toString()}`);
}

/**
 * Fetch ALL insureds, paginating automatically.
 * Optionally filter by modifiedSince date to enable incremental sync.
 */
export async function fetchAllInsureds(options: {
  modifiedSince?: string; // ISO date string
  pageSize?: number;
  maxPages?: number;
} = {}): Promise<NCInsured[]> {
  const pageSize = options.pageSize || 50;
  const maxPages = options.maxPages || 0; // 0 = unlimited

  let filter: string | undefined;
  if (options.modifiedSince) {
    filter = `modifiedOn gt ${options.modifiedSince}`;
  }

  const all: NCInsured[] = [];
  let skip = 0;
  let page = 0;
  let total: number | undefined;

  while (true) {
    page++;
    if (maxPages > 0 && page > maxPages) {
      console.log(`[NowCertsClient] Hit maxPages cap (${maxPages}), stopping.`);
      break;
    }

    console.log(`[NowCertsClient] Fetching insureds page ${page} (skip=${skip})...`);
    const res = await fetchInsuredPage(skip, pageSize, filter);
    const records = res.value || [];
    all.push(...records);

    if (total === undefined && res['@odata.count'] !== undefined) {
      total = res['@odata.count'];
    }

    if (records.length < pageSize) break; // Last page
    if (total !== undefined && all.length >= total) break;
    skip += pageSize;
  }

  console.log(`[NowCertsClient] Fetched ${all.length} insureds total.`);
  return all;
}

// ---- Policy API ----

export interface PolicyListResponse {
  value: NCPolicy[];
  '@odata.count'?: number;
}

export async function fetchPoliciesForInsured(insuredDatabaseId: string): Promise<NCPolicy[]> {
  try {
    const res = await ncRequest<PolicyListResponse>(
      `/api/PolicyDetailList?$filter=InsuredDatabaseId eq '${insuredDatabaseId}'`
    );
    return res.value || [];
  } catch (e) {
    console.warn(`[NowCertsClient] fetchPolicies failed for ${insuredDatabaseId}:`, e);
    return [];
  }
}

export async function fetchAllPolicies(options: {
  modifiedSince?: string;
  pageSize?: number;
  maxPages?: number;
} = {}): Promise<NCPolicy[]> {
  const pageSize = options.pageSize || 50;
  const maxPages = options.maxPages || 0;

  const params = new URLSearchParams({
    '$skip': '0',
    '$top': pageSize.toString(),
    '$count': 'true',
    '$orderby': 'modifiedOn desc'
  });

  if (options.modifiedSince) {
    params.append('$filter', `modifiedOn gt ${options.modifiedSince}`);
  }

  const all: NCPolicy[] = [];
  let skip = 0;
  let page = 0;
  let total: number | undefined;

  while (true) {
    page++;
    if (maxPages > 0 && page > maxPages) break;

    params.set('$skip', skip.toString());
    console.log(`[NowCertsClient] Fetching policies page ${page} (skip=${skip})...`);
    const res = await ncRequest<PolicyListResponse>(`/api/PolicyDetailList?${params.toString()}`);
    const records = res.value || [];
    all.push(...records);

    if (total === undefined && res['@odata.count'] !== undefined) {
      total = res['@odata.count'];
    }

    if (records.length < pageSize) break;
    if (total !== undefined && all.length >= total) break;
    skip += pageSize;
  }

  console.log(`[NowCertsClient] Fetched ${all.length} policies total.`);
  return all;
}

// ---- Policy Detail: Vehicles & Drivers ----

export async function fetchPolicyVehicles(policyDatabaseId: string): Promise<NCVehicle[]> {
  try {
    const res = await ncRequest<NCVehicle[]>('/api/Policy/PolicyVehicles', {
      method: 'POST',
      body: { PolicyDataBaseId: [policyDatabaseId] }
    });
    return Array.isArray(res) ? res : [];
  } catch (e) {
    console.warn(`[NowCertsClient] fetchPolicyVehicles failed for ${policyDatabaseId}:`, e);
    return [];
  }
}

export async function fetchPolicyDrivers(policyDatabaseId: string): Promise<NCDriver[]> {
  try {
    const res = await ncRequest<NCDriver[]>('/api/Policy/PolicyDrivers', {
      method: 'POST',
      body: { PolicyDataBaseId: [policyDatabaseId] }
    });
    return Array.isArray(res) ? res : [];
  } catch (e) {
    console.warn(`[NowCertsClient] fetchPolicyDrivers failed for ${policyDatabaseId}:`, e);
    return [];
  }
}

// ---- Push (Firebase Lead → NowCerts) ----

export interface PushLeadPayload {
  firstName?: string;
  lastName?: string;
  commercialName?: string;
  dba?: string;
  type?: string;
  insuredType?: string;
  email?: string;
  phone?: string;
  cellPhone?: string;
  addressLine1?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  dateOfBirth?: string;
  insuredContacts?: any[];
  Vehicles?: any[];
  policies?: any[];
  FenrisData?: any;
}

export interface PushLeadResult {
  ncInsuredId?: string;
  ncPolicyId?: string;
  rawResponse?: any;
}

export async function pushLeadToNowCerts(leadData: PushLeadPayload): Promise<PushLeadResult> {
  const payload: any = {
    AgencyId: AGENCY_ID,
    Form_Name: 'Web Lead - Firebase Sync',
    firstName: leadData.firstName || '',
    lastName: leadData.lastName || '',
    type: leadData.type || 'Prospect',
    insuredType: leadData.insuredType || 'Personal',
    eMail: leadData.email || '',
    phone: leadData.phone || '',
    cellPhone: leadData.cellPhone || leadData.phone || '',
    addressLine1: leadData.addressLine1 || '',
    city: leadData.city || '',
    state: leadData.state || '',
    zipCode: leadData.zipCode || '',
    dateOfBirth: leadData.dateOfBirth ? new Date(leadData.dateOfBirth).toISOString() : null,
    active: true,
    insuredContacts: leadData.insuredContacts || [],
    Vehicles: leadData.Vehicles || [],
    FenrisData: leadData.FenrisData || null,
    policies: leadData.policies || [
      {
        isQuote: true,
        effectiveDate: new Date().toISOString(),
        expirationDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString(),
        description: 'Web Lead - Firebase Sync',
        active: true
      }
    ]
  };

  if (leadData.insuredType === 'Commercial' || leadData.type === 'Commercial') {
    payload.commercialName = leadData.commercialName || `${leadData.lastName}, ${leadData.firstName}`;
    if (leadData.dba) payload.dba = leadData.dba;
  }

  const res = await ncRequest<any>('/api/PushJsonQuoteApplications', {
    method: 'POST',
    body: payload
  });

  return {
    ncInsuredId: res?.insuredDatabaseId || res?.databaseId || res?.InsuredDatabaseId,
    ncPolicyId: res?.policyDatabaseId || res?.PolicyDatabaseId,
    rawResponse: res
  };
}

// ---- Additional List Endpoints ----

export async function fetchDriverList(filter?: string): Promise<any[]> {
  try {
    const params = new URLSearchParams({ '$top': '100', '$count': 'true' });
    if (filter) params.append('$filter', filter);
    const res = await ncRequest<any>(`/api/DriverList()?${params.toString()}`);
    return res?.value || [];
  } catch (e) {
    console.warn('[NowCertsClient] fetchDriverList failed:', e);
    return [];
  }
}

export async function fetchClaimList(filter?: string): Promise<any[]> {
  try {
    const params = new URLSearchParams({ '$top': '100', '$count': 'true' });
    if (filter) params.append('$filter', filter);
    const res = await ncRequest<any>(`/api/ClaimList()?${params.toString()}`);
    return res?.value || [];
  } catch (e) {
    console.warn('[NowCertsClient] fetchClaimList failed:', e);
    return [];
  }
}

export async function fetchCustomersList(): Promise<any[]> {
  try {
    const res = await ncRequest<any>('/api/CustomersList');
    return res?.value || [];
  } catch (e) {
    console.warn('[NowCertsClient] fetchCustomersList failed:', e);
    return [];
  }
}

// ---- Zapier Integration Endpoints ----

export async function zapierInsertInsured(data: {
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
  agentId?: string;
}): Promise<any> {
  return ncRequest<any>('/api/Zapier/InsertInsured', {
    method: 'POST',
    body: {
      AgencyId: AGENCY_ID,
      firstName: data.firstName,
      lastName: data.lastName,
      eMail: data.email,
      phone: data.phone,
      addressLine1: data.address,
      city: data.city,
      state: data.state,
      zipCode: data.zip,
      agentDatabaseId: data.agentId
    }
  });
}

export async function zapierInsertProspect(data: {
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  leadSource?: string;
  notes?: string;
}): Promise<any> {
  return ncRequest<any>('/api/Zapier/InsertProspect', {
    method: 'POST',
    body: {
      AgencyId: AGENCY_ID,
      firstName: data.firstName,
      lastName: data.lastName,
      eMail: data.email,
      phone: data.phone,
      leadSource: data.leadSource || 'Web',
      notes: data.notes
    }
  });
}

export async function zapierInsertPolicy(data: {
  insuredDatabaseId: string;
  policyNumber: string;
  carrierId?: string;
  premium?: number;
  effectiveDate?: string;
  expirationDate?: string;
  lineOfBusiness?: string;
}): Promise<any> {
  return ncRequest<any>('/api/Zapier/InsertPolicy', {
    method: 'POST',
    body: {
      AgencyId: AGENCY_ID,
      insuredDatabaseId: data.insuredDatabaseId,
      policyNumber: data.policyNumber,
      carrierId: data.carrierId,
      premium: data.premium,
      effectiveDate: data.effectiveDate,
      expirationDate: data.expirationDate,
      lineOfBusiness: data.lineOfBusiness
    }
  });
}

export async function zapierInsertTask(data: {
  insuredDatabaseId: string;
  title: string;
  dueDate?: string;
  priority?: string;
  notes?: string;
  assignedToAgent?: string;
}): Promise<any> {
  return ncRequest<any>('/api/Zapier/InsertTask', {
    method: 'POST',
    body: {
      AgencyId: AGENCY_ID,
      insuredDatabaseId: data.insuredDatabaseId,
      subject: data.title,
      dueDate: data.dueDate,
      priority: data.priority || 'Normal',
      notes: data.notes,
      assignedToAgentId: data.assignedToAgent
    }
  });
}

export async function zapierInsertOpportunity(data: {
  insuredDatabaseId: string;
  stage?: string;
  lineOfBusiness?: string;
  probability?: number;
  estimatedPremium?: number;
  notes?: string;
}): Promise<any> {
  return ncRequest<any>('/api/Zapier/InsertOpportunity', {
    method: 'POST',
    body: {
      AgencyId: AGENCY_ID,
      insuredDatabaseId: data.insuredDatabaseId,
      stage: data.stage || 'New',
      lineOfBusiness: data.lineOfBusiness,
      probability: data.probability,
      estimatedPremium: data.estimatedPremium,
      notes: data.notes
    }
  });
}

export async function zapierInsertClaim(data: {
  insuredDatabaseId: string;
  policyDatabaseId?: string;
  claimNumber?: string;
  lossDate?: string;
  lossLocation?: string;
  lossDescription?: string;
  claimAmount?: number;
}): Promise<any> {
  return ncRequest<any>('/api/Zapier/InsertClaim', {
    method: 'POST',
    body: {
      AgencyId: AGENCY_ID,
      insuredDatabaseId: data.insuredDatabaseId,
      policyDatabaseId: data.policyDatabaseId,
      claimNumber: data.claimNumber,
      lossDate: data.lossDate,
      lossLocation: data.lossLocation,
      lossDescription: data.lossDescription,
      claimAmount: data.claimAmount
    }
  });
}

// ---- Service Request Endpoints ----

export async function zapierInsertServiceRequest(type:
  'AddDriver' | 'AddressChange' | 'RemoveDriver' | 'VehicleTransfer' | 'General',
  data: any
): Promise<any> {
  const endpointMap: Record<string, string> = {
    AddDriver: '/api/Zapier/InsertServiceRequestsAddDriver',
    AddressChange: '/api/Zapier/InsertServiceRequestsAddressChanges',
    RemoveDriver: '/api/Zapier/InsertServiceRequestsRemoveDriver',
    VehicleTransfer: '/api/Zapier/InsertServiceRequestsVehicleTransfer',
    General: '/api/Zapier/InsertServiceRequestsGeneral'
  };
  return ncRequest<any>(endpointMap[type], {
    method: 'POST',
    body: { AgencyId: AGENCY_ID, ...data }
  });
}

// ---- Webhook (Zapier Subscribe / Unsubscribe) ----

/**
 * Register a webhook URL with NowCerts for a specific event type.
 * @param targetUrl  The URL NowCerts will POST to when the event fires
 * @param eventType  NowCerts ZapierEventType integer (see below)
 */
export async function zapierSubscribe(targetUrl: string, eventType: number): Promise<any> {
  return ncRequest<any>('/api/Zapier/Subscribe', {
    method: 'POST',
    body: { target_url: targetUrl, event: eventType }
  });
}

export async function zapierUnsubscribe(targetUrl: string, eventType: number): Promise<any> {
  return ncRequest<any>('/api/Zapier/Unsubscribe', {
    method: 'POST',
    body: { target_url: targetUrl, event: eventType }
  });
}

/**
 * NowCerts Zapier Event Types (from ZapierEventType.php)
 * Use these with zapierSubscribe/zapierUnsubscribe.
 */
export const ZapierEventType = {
  InsuredCreated: 1,
  InsuredUpdated: 2,
  PolicyCreated: 3,
  PolicyUpdated: 4,
  PolicyCancelled: 5,
  TaskCreated: 6,
  OpportunityCreated: 7,
  ClaimCreated: 8,
  ServiceRequestCreated: 9,
  ProspectCreated: 10,
  RenewalDue: 11
} as const;

// ---- Policy List Endpoints ----

export async function fetchPolicyList(filter?: string, skip = 0, top = 50): Promise<any[]> {
  try {
    const params = new URLSearchParams({
      '$skip': skip.toString(),
      '$top': top.toString(),
      '$count': 'true',
      '$orderby': 'effectiveDate desc'
    });
    if (filter) params.append('$filter', filter);
    const res = await ncRequest<any>(`/api/PolicyList()?${params.toString()}`);
    return res?.value || [];
  } catch (e) {
    console.warn('[NowCertsClient] fetchPolicyList failed:', e);
    return [];
  }
}

export async function findPolicies(criteria: {
  policyNumber?: string;
  insuredName?: string;
  isQuote?: boolean;
}): Promise<any[]> {
  try {
    const params = new URLSearchParams();
    if (criteria.policyNumber) params.append('policyNumber', criteria.policyNumber);
    if (criteria.insuredName) params.append('insuredName', criteria.insuredName);
    if (criteria.isQuote !== undefined) params.append('isQuote', String(criteria.isQuote));
    const res = await ncRequest<any>(`/api/Policy/FindPolicies?${params.toString()}`);
    return Array.isArray(res) ? res : (res?.value || []);
  } catch (e) {
    console.warn('[NowCertsClient] findPolicies failed:', e);
    return [];
  }
}

// ---- Certificate Sending ----

export async function sendCertificate(data: {
  certificateId: string;
  recipientEmails: string[];
  insuredDatabaseId: string;
  message?: string;
}): Promise<any> {
  return ncRequest<any>('/api/SendCertificate/SendCertificate', {
    method: 'POST',
    body: {
      AgencyId: AGENCY_ID,
      certificateId: data.certificateId,
      recipientEmails: data.recipientEmails,
      insuredDatabaseId: data.insuredDatabaseId,
      message: data.message || ''
    }
  });
}

// ---- Bulk Driver Insert ----

export async function bulkInsertDrivers(drivers: any[]): Promise<any> {
  return ncRequest<any>('/api/Driver/BulkInsertDriver', {
    method: 'POST',
    body: { AgencyId: AGENCY_ID, drivers }
  });
}

export { AGENCY_ID, getAccessToken };
