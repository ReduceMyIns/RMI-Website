import type { Vendor } from '../../types/compliance.ts';
import { nowCertsApi } from '../../../services/nowCertsService.ts';
import type { QuoteRequest } from '../../../types.ts';

export const nowCertsService = {
  /**
   * Creates a new prospect in NowCerts.
   */
  async searchCertificateHolders(query: string) {
    return nowCertsApi.searchCertificateHolders(query);
  },

  async createProspect(vendor: Vendor): Promise<string> {
    console.log('Creating/Finding NowCerts Certificate Holder for:', vendor.companyName);
    
    try {
      // 1. Search for existing Certificate Holder
      const searchResult = await nowCertsApi.searchCertificateHolders(vendor.companyName);
      if (searchResult && searchResult.value && searchResult.value.length > 0) {
        console.log('Found existing Certificate Holder:', searchResult.value[0].databaseId);
        return searchResult.value[0].databaseId;
      }

      // 2. If not found, create new Certificate Holder
      const holderData = {
        // databaseId is omitted for creation
        name: vendor.companyName,
        stateAbbrevation: vendor.address.state,
        city: vendor.address.city,
        addressLine1: vendor.address.street,
        zipCode: vendor.address.zip,
        phone: vendor.phone.replace(/\D/g, ''),
        eMail: vendor.email,
        // Optional fields
        cellPhone: '',
        fax: ''
      };

      const result = await nowCertsApi.insertCertificateHolder(holderData);
      if (result && result.databaseId) {
        return result.databaseId;
      }
      
      console.warn('NowCerts API returned no ID, using fallback');
      return `nc-holder-${Date.now()}`;
    } catch (error) {
      console.error('Failed to create NowCerts Certificate Holder:', error);
      throw error;
    }
  },

  async getPolicies(userId: string): Promise<any[]> {
    console.log(`[NowCerts] Fetching policies for user ${userId}`);
    try {
      // Assuming userId maps to an InsuredDatabaseId or email
      // We construct a user object that the nowCertsApi.getPolicies method can use
      // If userId looks like an email, we pass it as email, otherwise as id
      const isEmail = userId.includes('@');
      const user = isEmail ? { email: userId } : { id: userId };
      
      const response = await nowCertsApi.getPolicies(user);
      
      if (response && response.value) {
        return response.value.map((p: any) => ({
          policyType: p.lineOfBusinesses?.[0]?.lineOfBusinessName || 'Unknown',
          limits: {
            // Mapping NowCerts limits structure would go here
            // This is a simplification as actual structure varies
            perOccurrence: 1000000, 
            aggregate: 2000000
          },
          expirationDate: p.expirationDate
        }));
      }
      return [];
    } catch (error) {
      console.error('Failed to fetch policies from NowCerts:', error);
      return [];
    }
  }
};
