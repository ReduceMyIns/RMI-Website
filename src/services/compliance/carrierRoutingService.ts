import type { CarrierLink, Vendor, InsuranceRequirementSet } from '../../types/compliance.ts';

export const carrierRoutingService = {
  /**
   * Recommends carriers based on vendor profile and project requirements.
   */
  getRecommendedCarrierLinks(
    vendorProfile: Vendor,
    projectRequirements: InsuranceRequirementSet
  ): CarrierLink[] {
    const allCarriers: CarrierLink[] = [
      {
        id: 'next',
        name: 'NEXT Insurance',
        productTypes: ['GL', 'BOP', 'WC', 'Auto'],
        utmBaseUrl: 'https://www.nextinsurance.com/quote/?utm_source=rmi&utm_medium=partner',
        isActive: true,
        logoUrl: '/logos/next.png'
      },
      {
        id: 'thimble',
        name: 'Thimble',
        productTypes: ['GL', 'Prof Liab', 'ShortTerm'],
        utmBaseUrl: 'https://www.thimble.com/quote/?utm_source=rmi&utm_medium=partner',
        isActive: true,
        logoUrl: '/logos/thimble.png'
      },
      {
        id: 'coterie',
        name: 'Coterie',
        productTypes: ['GL', 'BOP', 'Prof Liab'],
        utmBaseUrl: 'https://coterieinsurance.com/quote/?utm_source=rmi&utm_medium=partner',
        isActive: true,
        logoUrl: '/logos/coterie.png'
      },
      {
        id: 'foxquilt',
        name: 'FoxQuilt',
        productTypes: ['GL', 'BOP', 'WC'],
        utmBaseUrl: 'https://www.foxquilt.com/quote?utm_source=rmi',
        isActive: true,
        logoUrl: '/logos/foxquilt.png'
      },
      {
        id: 'stillwater',
        name: 'Stillwater',
        productTypes: ['GL', 'BOP'],
        utmBaseUrl: 'https://stillwater.com/quote?utm_source=rmi',
        isActive: true,
        logoUrl: '/logos/stillwater.png'
      }
    ];

    // Filter by active carriers and required coverages
    return allCarriers.filter(carrier => {
      if (!carrier.isActive) return false;
      
      // Basic matching logic
      if (projectRequirements.generalLiability.required && !carrier.productTypes.includes('GL')) {
        return false;
      }
      
      // Thimble Logic: Good for short term or small projects
      if (carrier.id === 'thimble') {
         // Prioritize if project duration is short or vendor revenue is low (mock logic)
         if (vendorProfile.financials.estimatedRevenue < 100000) return true;
      }

      // NEXT Logic: Good for most trades
      if (carrier.id === 'next') return true;

      return true;
    }).slice(0, 3); // Return top 3
  },

  /**
   * Logs a carrier click event for tracking conversions.
   */
  async logCarrierClick(
    vendorId: string,
    projectId: string,
    carrierId: string,
    outboundUrl: string
  ): Promise<void> {
    // TODO: Save to database (Firestore/Postgres)
    console.log(`Logged click: Vendor ${vendorId} clicked ${carrierId} for Project ${projectId}. URL: ${outboundUrl}`);
  }
};
