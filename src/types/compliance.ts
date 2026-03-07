export interface Organization {
  id: string;
  name: string;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
}

export interface InsuranceRequirementSet {
  id: string;
  projectId: string;
  generalLiability: {
    required: boolean;
    perOccurrenceLimit: number;
    aggregateLimit: number;
    requireAdditionalInsured: boolean; // Enforced for GL
  };
  autoLiability: {
    required: boolean;
    combinedSingleLimit: number;
  };
  workersComp: {
    required: boolean;
    statutoryLimits: boolean;
    employersLiabilityLimit: number;
  };
  umbrella: {
    required: boolean;
    limit: number;
  };
  endorsements: {
    additionalInsured: boolean;
    waiverOfSubrogation: boolean;
    primaryAndNonContributory: boolean;
  };
  descriptionOfOperations: {
    required: boolean;
    mustContain: string; // e.g., "additional insured for roofing work"
  };
  acceptableAMBestRating: string; // e.g., "A-"
}

export interface Project {
  id: string;
  organizationId: string;
  name: string;
  description: string;
  location: string;
  status: 'Active' | 'Completed' | 'Archived';
  requirements: InsuranceRequirementSet;
  createdAt: string;
  updatedAt: string;
}

export interface Vendor {
  id: string;
  projectId: string;
  organizationId: string;
  companyName: string; // Renamed from name
  contactName: string; // Owner/Primary Contact
  address: {
    street: string;
    city: string;
    state: string;
    zip: string;
  };
  email: string;
  phone: string;
  industry: {
    sicCode: string;
    description: string;
  };
  financials?: {
    estimatedRevenue: number;
    annualPayroll: number;
    employeeCount: number;
  };
  trade: string; // Kept for backward compatibility/display
  status: 'Compliant' | 'Non-compliant' | 'Expired' | 'Missing COI' | 'Pending Review';
  inviteStatus: 'Not Sent' | 'Sent' | 'Opened' | 'Uploaded';
  lastUploadDate?: string;
  createdAt: string;
  updatedAt: string;
  nowCertsProspectId?: string; // Link to NowCerts
}

export interface ParsedCertificateData {
  namedInsured: string;
  carriers: string[];
  policies: {
    type: 'GL' | 'Auto' | 'WC' | 'Umbrella' | 'Other';
    policyNumber: string;
    effectiveDate: string;
    expirationDate: string;
    limits: Record<string, number>; // e.g., { perOccurrence: 1000000, aggregate: 2000000 }
  }[];
  endorsements: {
    additionalInsured: boolean;
    waiverOfSubrogation: boolean;
  };
}

export interface Certificate {
  id: string;
  vendorId: string;
  projectId: string;
  fileUrl: string;
  uploadDate: string;
  parsedData?: ParsedCertificateData;
  status: 'Pending Review' | 'Verified' | 'Rejected';
  auditNote?: string;
}

export interface CarrierLink {
  id: string;
  name: string; // e.g., NEXT, Thimble
  productTypes: string[]; // e.g., ['GL', 'BOP', 'WC']
  utmBaseUrl: string;
  isActive: boolean;
  logoUrl?: string;
}

export interface CarrierClickLog {
  id: string;
  vendorId: string;
  projectId: string;
  carrierId: string;
  timestamp: string;
  outboundUrl: string;
}
