import { Router } from 'express';
import type { Request, Response } from 'express';
import { coiParsingService } from '../src/services/compliance/coiParsingService.ts';
import { complianceEngineService } from '../src/services/compliance/complianceEngineService.ts';
import { carrierRoutingService } from '../src/services/compliance/carrierRoutingService.ts';
import { notificationService } from '../src/services/compliance/notificationService.ts';
import { nowCertsService } from '../src/services/compliance/nowCertsService.ts';
import type { InsuranceRequirementSet, Vendor, Project, ParsedCertificateData } from '../src/types/compliance.ts';

const router = Router();

// --- Project & Requirements Management ---

router.post('/organizations', (req: Request, res: Response) => {
  // TODO: Create Organization in DB
  res.status(201).json({ id: 'org-123', ...req.body });
});

router.post('/projects', (req: Request, res: Response) => {
  // TODO: Create Project in DB
  res.status(201).json({ id: 'proj-123', ...req.body });
});

router.get('/projects/:id/requirements', async (req: Request, res: Response) => {
  try {
    // In a real app, get the authenticated user's ID or email from the request context
    // For now, we'll check for a query param or header, otherwise fallback to a mock/test user
    const userId = (req.query.userId as string) || 'user-123'; 
    
    const policies = await nowCertsService.getPolicies(userId);
    
    // Map policies to requirements
    const requirements: Partial<InsuranceRequirementSet> = {
      generalLiability: {
        required: policies.some((p: any) => p.policyType === 'General Liability'),
        perOccurrenceLimit: policies.find((p: any) => p.policyType === 'General Liability')?.limits.perOccurrence || 1000000,
        aggregateLimit: policies.find((p: any) => p.policyType === 'General Liability')?.limits.aggregate || 2000000,
        requireAdditionalInsured: true
      },
      workersComp: {
        required: policies.some((p: any) => p.policyType === 'Workers Compensation'),
        statutoryLimits: true,
        employersLiabilityLimit: policies.find((p: any) => p.policyType === 'Workers Compensation')?.limits.employersLiability || 500000
      },
      autoLiability: {
        required: false,
        combinedSingleLimit: 1000000
      },
      umbrella: {
        required: false,
        limit: 1000000
      },
      endorsements: {
        additionalInsured: true,
        waiverOfSubrogation: false,
        primaryAndNonContributory: false
      },
      descriptionOfOperations: {
        required: true,
        mustContain: 'Additional Insured'
      },
      acceptableAMBestRating: 'A-'
    };
    
    res.json(requirements);
  } catch (e) {
    console.error("Failed to fetch requirements:", e);
    res.status(500).json({ error: 'Failed to fetch requirements' });
  }
});

router.put('/vendors/:id', (req: Request, res: Response) => {
  // Mock update vendor
  const { financials, email, phone, address } = req.body;
  
  // In a real implementation, you would update the database here
  // and potentially sync with NowCerts if needed
  
  res.json({ 
    id: req.params.id,
    financials,
    email,
    phone,
    address,
    message: 'Vendor updated successfully' 
  });
});

// --- Vendor Management & Invites ---

router.get('/vendors', async (req: Request, res: Response) => {
  const query = req.query.q as string;
  if (!query) {
    return res.json([]);
  }

  try {
    const searchResult = await nowCertsService.searchCertificateHolders(query);
    
    // Map NowCerts Certificate Holders to Vendor type
    const vendors: Vendor[] = (searchResult.value || []).map((holder: any) => ({
      id: holder.databaseId,
      projectId: 'unknown', // Not available from search
      organizationId: 'org-1',
      companyName: holder.name,
      contactName: holder.name, // Placeholder as contact name might not be separate
      address: {
        street: holder.addressLine1,
        city: holder.city,
        state: holder.stateAbbrevation,
        zip: holder.zipCode
      },
      email: holder.eMail,
      phone: holder.phone,
      industry: { sicCode: '', description: '' }, // Not in search result
      trade: '',
      status: 'Unknown', // Status would need to be determined
      inviteStatus: 'Unknown',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }));

    res.json(vendors);
  } catch (e) {
    console.error("Vendor search failed:", e);
    res.status(500).json({ error: "Search failed" });
  }
});

router.get('/vendors/:id', (req: Request, res: Response) => {
  // Mock fetching vendor
  const vendor: Vendor = {
    id: req.params.id as string,
    projectId: 'proj-1',
    organizationId: 'org-1',
    companyName: 'Apex Plumbing', // Mock
    contactName: 'John Doe',
    address: { street: '123 Main St', city: 'Seattle', state: 'WA', zip: '98101' },
    email: 'contact@apexplumbing.com',
    phone: '555-123-4567',
    industry: { sicCode: '1711', description: 'Plumbing' },
    // financials: undefined, // Simulate missing financials for new vendors
    trade: 'Plumbing',
    status: 'Missing COI', // Default for now
    inviteStatus: 'Sent',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  res.json(vendor);
});

router.post('/projects/:id/vendors', async (req: Request, res: Response) => {
  const { 
    companyName, contactName, address, email, phone, 
    industry, trade 
  } = req.body;

  // TODO: Create Vendor in DB
  const vendor: Vendor = {
    id: `ven-${Date.now()}`,
    projectId: req.params.id as string,
    organizationId: 'org-123',
    companyName,
    contactName,
    address,
    email,
    phone,
    industry,
    trade,
    status: 'Missing COI',
    inviteStatus: 'Sent',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  try {
    // 1. Create Prospect in NowCerts
    const prospectId = await nowCertsService.createProspect(vendor);
    vendor.nowCertsProspectId = prospectId;

    // 2. Send Invite Email (Mocked)
    // In reality, this would use Gmail API to send from service@reducemyinsurance.net
    const project: Project = {
        id: req.params.id as string,
        organizationId: 'org-123',
        name: 'Sample Project',
        description: '',
        location: '',
        status: 'Active',
        requirements: {} as any, // Mock
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };
    
    await notificationService.sendVendorInvite(vendor, project, `https://reducemyinsurance.net/compliance/upload/${vendor.id}`);
    
    res.status(201).json(vendor);
  } catch (e) {
    console.error("Failed to create vendor:", e);
    res.status(500).json({ error: "Failed to create vendor" });
  }
});

// --- COI Intake & Parsing ---

router.post('/vendors/:id/coi', async (req: Request, res: Response) => {
  // In a real app, use multer to handle file uploads
  // const fileBuffer = req.file.buffer;
  const fileBuffer = Buffer.from('mock-file-content');

  try {
    const parsedData = await coiParsingService.parseCOI(fileBuffer);

    // TODO: Fetch actual project requirements from DB
    const mockRequirements: InsuranceRequirementSet = {
      id: 'req-123',
      projectId: 'proj-123',
      generalLiability: { required: true, perOccurrenceLimit: 1000000, aggregateLimit: 2000000, requireAdditionalInsured: true },
      autoLiability: { required: false, combinedSingleLimit: 0 },
      workersComp: { required: false, statutoryLimits: false, employersLiabilityLimit: 0 },
      umbrella: { required: false, limit: 0 },
      endorsements: { additionalInsured: true, waiverOfSubrogation: false, primaryAndNonContributory: false },
      descriptionOfOperations: { required: true, mustContain: 'Additional Insured' },
      acceptableAMBestRating: 'A-'
    };

    const complianceResult = complianceEngineService.evaluateCompliance(mockRequirements, parsedData);

    // TODO: Save Certificate, ParsedData, and ComplianceResult to DB
    // Update Vendor status

    res.json({
      parsedData,
      complianceResult
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to parse COI' });
  }
});

// --- Carrier Routing ---

router.get('/vendors/:id/recommended-carriers', (req: Request, res: Response) => {
  // TODO: Fetch vendor and project requirements from DB
  const mockVendor: Vendor = { id: req.params.id as string, trade: 'Plumbing' } as Vendor;
  const mockRequirements: InsuranceRequirementSet = {
    generalLiability: { required: true },
    autoLiability: { required: false },
    workersComp: { required: false }
  } as InsuranceRequirementSet;

  const carriers = carrierRoutingService.getRecommendedCarrierLinks(mockVendor, mockRequirements);
  res.json(carriers);
});

router.post('/vendors/:id/carrier-clicks', async (req: Request, res: Response) => {
  const { projectId, carrierId, outboundUrl } = req.body;
  await carrierRoutingService.logCarrierClick(req.params.id as string, projectId, carrierId, outboundUrl);
  res.status(201).json({ message: 'Click logged' });
});

export default router;
