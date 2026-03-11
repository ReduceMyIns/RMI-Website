// ============================================================
// NowCerts <-> Firebase Sync: Shared TypeScript Types
// ============================================================

export interface SyncMetadata {
  lastSyncedAt: string | null;
  lastSyncDuration: number | null; // ms
  lastSyncStatus: 'success' | 'partial' | 'failed' | 'running' | null;
  lastError: string | null;
  totalInsuredsSynced: number;
  totalPoliciesSynced: number;
  totalVehiclesSynced: number;
  totalDriversSynced: number;
  totalLeadsPushed: number;
  syncVersion: number; // increments on each full sync
}

export interface SyncOptions {
  /** If true, fetch ALL records regardless of lastSyncedAt (default: false) */
  fullSync?: boolean;
  /** Which directions to run */
  direction?: 'ncToFirebase' | 'firebaseToNC' | 'both';
  /** Max insureds to fetch per page (NowCerts default 20, max 100) */
  pageSize?: number;
  /** Max pages to fetch (safety cap). 0 = unlimited */
  maxPages?: number;
}

export interface SyncResult {
  success: boolean;
  durationMs: number;
  insuredsSynced: number;
  policiesSynced: number;
  vehiclesSynced: number;
  driversSynced: number;
  leadsPushed: number;
  errors: SyncError[];
  startedAt: string;
  completedAt: string;
}

export interface SyncError {
  entityType: 'insured' | 'policy' | 'vehicle' | 'driver' | 'lead';
  entityId: string;
  message: string;
  timestamp: string;
}

// ---- NowCerts API shapes ----

export interface NCInsured {
  databaseId: string;
  firstName: string;
  lastName: string;
  commercialName?: string;
  dba?: string;
  type: string;             // "Prospect" | "Insured" | etc.
  insuredType?: string;     // "Personal" | "Commercial"
  eMail?: string;
  eMail2?: string;
  phone?: string;
  cellPhone?: string;
  smsPhone?: string;
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  dateOfBirth?: string;
  active?: boolean;
  fein?: string;
  website?: string;
  maritalStatus?: string;
  modifiedOn?: string;
  createdOn?: string;
}

export interface NCPolicy {
  databaseId: string;
  policyNumber?: string;
  insuredDatabaseId?: string;
  insuredName?: string;
  insuredEmail?: string;
  lineOfBusiness?: string;
  linesOfBusiness?: string[];
  effectiveDate?: string;
  expirationDate?: string;
  premium?: number;
  carrierName?: string;
  status?: string;
  isQuote?: boolean;
  active?: boolean;
  description?: string;
  modifiedOn?: string;
  createdOn?: string;
}

export interface NCVehicle {
  databaseId: string;
  policyDatabaseId?: string;
  insuredDatabaseId?: string;
  year?: number | string;
  make?: string;
  model?: string;
  vin?: string;
  usageType?: string;
  annualMileage?: number | string;
  active?: boolean;
}

export interface NCDriver {
  databaseId: string;
  policyDatabaseId?: string;
  insuredDatabaseId?: string;
  firstName?: string;
  lastName?: string;
  dateOfBirth?: string;
  dlNumber?: string;
  dlStateName?: string;
  isDriver?: boolean;
  maritalStatus?: string;
  active?: boolean;
}

// ---- Firebase Lead shape (as stored in Firestore 'leads' collection) ----

export interface FirebaseLead {
  id?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
  dob?: string;
  type?: string; // "Personal" | "Commercial"
  commercialName?: string;
  dba?: string;
  vehicles?: any[];
  residents?: any[];
  bundledLines?: string[];
  fenrisData?: any;
  source?: string;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
  // Sync tracking fields
  nowcertsSynced?: boolean;
  nowcertsId?: string;     // NCInsured.databaseId if pushed
  nowcertsSyncedAt?: string;
  nowcertsSyncError?: string;
}

// ---- Firestore synced document shapes ----

export interface FirestoreInsured extends NCInsured {
  _syncedAt: string;
  _syncVersion: number;
  _source: 'nowcerts';
}

export interface FirestorePolicy extends NCPolicy {
  _syncedAt: string;
  _syncVersion: number;
  _source: 'nowcerts';
}

export interface FirestoreVehicle extends NCVehicle {
  _syncedAt: string;
  _syncVersion: number;
  _source: 'nowcerts';
}

export interface FirestoreDriver extends NCDriver {
  _syncedAt: string;
  _syncVersion: number;
  _source: 'nowcerts';
}
