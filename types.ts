
import React from 'react';

export interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  component?: React.ReactNode;
}

export interface Resident {
  id: string;
  firstName: string;
  lastName: string;
  dob: string;
  relationship: string;
  status: 'pending' | 'rated' | 'excluded';
  licenseNumber?: string;
  licenseState?: string;
  licenseStatus?: 'Active' | 'Suspended' | 'Revoked' | 'Expired' | 'Foreign' | 'Permit';
  sr22?: boolean;
  exclusionReason?: string;
  maritalStatus?: string;
  occupation?: string;
  sicCode?: string;
  isStudent?: boolean;
  education?: string;
  goodStudentDiscount?: boolean;
  driverTrainingDiscount?: boolean;
  email?: string;
  phone?: string;
  hasViolations?: boolean;
  violationDescription?: string;
}

export interface Vehicle {
  id: string;
  year: number;
  make: string;
  model: string;
  vin?: string;
  type: 'Car' | 'Motorcycle' | 'RV' | 'Boat' | 'Collector';
  usage: 'pleasure' | 'commute' | 'business' | 'collector' | 'farm';
  lien: boolean;
  lienholderName?: string;
  lienholderAddress?: string;
  lienholderCity?: string;
  lienholderState?: string;
  lienholderZip?: string;
  status: 'pending' | 'included' | 'ignored' | 'excluded';
  exclusionReason?: string;
  annualMileage?: number;
  telematicsOptIn?: boolean;
  isRideshare?: boolean;
  rideshareType?: string; // e.g. Uber, Lyft, DoorDash
  rideshareFrequency?: 'Daily' | 'Weekly' | 'Occasional';
  ridesharecompany?: string;
  rideshareprogram?: string;
  rideshareapp?: boolean;
  ridesharedelivery?: boolean;
  ridesharepassenger?: boolean;
  rideshareother?: boolean;
  rideshareotherdesc?: string;
  rideshareusage?: string;
  recalls?: any[]; // Array of recall objects from NHTSA
  nhtsaValidated?: boolean;
  active?: boolean;
  deletionReason?: string;
  coverages?: {
    comp: string;
    coll: string;
    rental: string;
    towing: string;
  };
}

export interface PropertyDetails {
  id: string;
  type: 'Home' | 'Rental' | 'Condo' | 'Mobile';
  address: string;
  yearBuilt: number;
  sqft: number;
  constructionType: string;
  roofType: string;
  roofAge: number;
  hasPool: boolean;
  isGated: boolean;
  occupancy: 'Primary' | 'Secondary' | 'Tenant' | 'Vacant';
  estimatedValue?: number;
}

export interface LeadData {
  type: 'Personal' | 'Commercial';
  firstName: string;
  lastName: string;
  commercialName?: string;
  dba?: string;
  fein?: string;
  naic?: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  email: string;
  phone: string;
  dob: string;
}

export interface QuoteRequest {
  applicationId: string;
  applicationDate?: string;
  type: 'Personal' | 'Commercial';
  firstName: string;
  lastName: string;
  commercialName?: string;
  dba?: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  email: string;
  phone: string;
  dob: string;
  residents: Resident[];
  vehicles: Vehicle[];
  properties: PropertyDetails[];
  bundledLines: string[];
  termsAccepted?: boolean;
  fenrisData?: any; // Raw Fenris response storage
  policyCoverage?: {
    autoLimits: string;
    homeLimit?: number;
    umbrellaLimit?: string;
    uninsuredMotorist: boolean;
    medicalPayments: string;
  };
}

export interface UnderwritingData {
  yearBuilt: number;
  foundationType: 'Slab' | 'Crawl Space' | 'Basement';
  exteriorMaterials: string;
  roofType: string;
  roofUpdateYear: number | null;
  county: string;
  fireProtectionClass: string;
  distToFireStation: string;
  distToHydrant: string;
  numberOfRooms: number;
  numberOfBathrooms: number;
  estimatedRoofAge: number;
  floodZone: string;
  replacementCost: number;
  hasPool: boolean;
  hasDetachedStructures: boolean;
  detachedStructureCount?: number;
  hasSolidFuelStove: boolean;
  isMobileHome: boolean;
  hasAttic: boolean;
  sqft?: number;
}

export interface AIAnalysisResult {
  matches: boolean;
  matchReason: string;
  confidenceScore: number;
  qualityCheck: {
    clarity: 'excellent' | 'good' | 'acceptable' | 'poor';
    lighting: 'excellent' | 'good' | 'acceptable' | 'poor';
    framing: 'excellent' | 'good' | 'acceptable' | 'poor';
  };
  presentationCheck: {
    isClean: boolean;
    clutterDetected: string[];
    improvementSuggestions: string[];
  };
  conditionAssessment: {
    overall: 'excellent' | 'good' | 'fair' | 'poor';
    rating: number;
    strengths: string[];
    concerns: string[];
  };
  inspectorNotes: string;
  detailedSummary: string;
}

export interface PhotoRequirement {
  id: string;
  clientId: string;
  group: string;
  category: string;
  description: string;
  status: 'Required' | 'Uploaded' | 'Verified' | 'Rejected' | 'Review';
  photoUrl?: string;
  aiAnalysis?: AIAnalysisResult;
}

export interface CommercialRatingData {
  yearBizStarted: number;
  yearsOfOperation: number;
  numberOfOwners: number;
  numberOfFullTimeEmployees: number;
  numberOfPartTimeEmployees: number;
  totalPayroll: number;
  annualSales: number;
  naic: string;
  sic: string;
  description: string;
  numberOfLocations?: number;
  numberOfVehiclesUsedForBusiness?: number;
  professionalExposure?: boolean; // Internal flag for logic
  highRisk?: boolean; // Internal flag for logic
  usesSubcontractors?: boolean;
  subcontractorCost?: number;
}

export interface KnowledgeArticle {
  id: string;
  title: string;
  category: string;
  tags: string[];
  content: string; // Markdown
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
  readTime?: string;
  excerpt?: string;
}

export interface CourseCompletion {
  courseId: string;
  courseTitle: string;
  userId: string;
  userName: string;
  score: number;
  completedAt: string;
  certificateId: string;
}
