
import { APP_CONFIG } from './config';
import { LeadData, CommercialRatingData, QuoteRequest } from '../types';

const BASE_URL = APP_CONFIG.apis.nowCerts.baseUrl.replace(/\/$/, '');
const AGENCY_ID = "7b9d101f-6a6c-40a6-b256-bfd8a901c277";

export const nowCertsApi = {
  /**
   * Get Access Token for NowCerts API
   */
  async getAccessToken() {
    try {
      const response = await fetch(`${BASE_URL}/api/token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain' 
        },
        body: 'grant_type=password&username=chase@reducemyinsurance.net&password=TempPassword!1&client_id=ngAuthApp'
      });

      if (!response.ok) throw new Error("Token Fetch Failed");
      const data = await response.json();
      return data.access_token;
    } catch (e) {
      console.error("NowCerts Auth Error", e);
      throw e;
    }
  },

  /**
   * Pushes full quote application structure to NowCerts (Prospect, Quote, Vehicles, Drivers)
   */
  async pushQuoteApplication(formData: QuoteRequest) {
    try {
      // Mapping Data to NowCerts Schema
      // databaseId fields are omitted to ensure creation of new items
      const payload: any = {
        agencyid: AGENCY_ID,
        firstName: formData.firstName,
        middleName: "",
        lastName: formData.lastName,
        dateOfBirth: formData.dob ? new Date(formData.dob).toISOString() : null,
        type: "Prospect",
        addressLine1: formData.address,
        addressLine2: "",
        state: formData.state,
        city: formData.city,
        zipCode: formData.zip,
        eMail: formData.email,
        phone: formData.phone,
        cellPhone: formData.phone,
        active: true,
        insuredType: formData.type,
        
        // Drivers Mapping
        insuredContacts: formData.residents.map(r => ({
            firstName: r.firstName,
            lastName: r.lastName,
            type: r.relationship === 'Self' ? 'Owner' : 'Contact',
            birthday: r.dob ? new Date(r.dob).toISOString() : null,
            socialSecurityNumber: null, 
            isDriver: r.status === 'rated',
            dlNumber: r.licenseNumber,
            dlStateName: r.licenseState
        })),

        // Vehicles Mapping
        Vehicles: formData.vehicles.map(v => ({
            year: v.year,
            make: v.make,
            model: v.model,
            vin: v.vin || "",
            type_of_use: v.usage === 'commute' ? 2 : 1, // 2=Personal, 1=Commercial (Approximation)
            active: v.status === 'included',
            vehicleLienHolders: v.lien ? [{ natureOfInterest: 0 }] : [],
            estimated_annual_distance: v.annualMileage?.toString() || "12000"
        })),
        
        // Quote / Policy placeholder
        policies: [
            {
                isQuote: true,
                linesOfBusiness: formData.bundledLines,
                effectiveDate: new Date().toISOString(),
                expirationDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString(), // 1 Year Term
                description: "AI Web Application Quote",
                active: true
            }
        ]
      };

      // Only include commercialName if it is a commercial prospect
      if (formData.type === 'Commercial') {
          payload.commercialName = formData.commercialName || (formData.firstName ? `${formData.lastName}, ${formData.firstName}` : formData.lastName);
          if (formData.dba) payload.dba = formData.dba;
      }

      const response = await fetch(`${BASE_URL}/api/PushJsonQuoteApplications`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
         console.warn("NowCerts Push Warning:", await response.text());
         return null; 
      }

      return await response.json();

    } catch (e) {
      console.error("Push Quote Error", e);
      // Return null so flow continues
      return null;
    }
  },

  /**
   * Search for an insured by email, phone, or name using comprehensive OData filters on InsuredList.
   */
  async searchInsured(query: { email?: string; phone?: string; name?: string }) {
    try {
      const token = await this.getAccessToken();
      let filter = "";
      const email = query.email?.trim().toLowerCase();
      const rawPhone = query.phone?.replace(/\D/g, '') || '';
      const name = query.name?.trim();
      
      if (email) {
        filter = `$filter=(contains(tolower(eMail), '${email}') or contains(tolower(eMail2), '${email}') or contains(tolower(eMail3), '${email}'))`;
      } else if (rawPhone) {
        const formatted = rawPhone.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3');
        filter = `$filter=(contains(phone, '${formatted}') or contains(cellPhone, '${formatted}') or contains(smsPhone, '${formatted}') or contains(phone, '${rawPhone}') or contains(cellPhone, '${rawPhone}') or contains(smsPhone, '${rawPhone}'))`;
      } else if (name) {
        // Advanced Name Matching: Split full name into First/Last for accurate OData filtering
        const parts = name.split(/\s+/).filter(part => part.length > 0);
        
        if (parts.length >= 2) {
          const firstName = parts[0].replace(/'/g, "''").toLowerCase();
          // Join the remaining parts for Last Name to handle multi-word surnames
          const lastName = parts.slice(1).join(' ').replace(/'/g, "''").toLowerCase();
          
          // Require matches in BOTH fields
          filter = `$filter=(contains(tolower(firstName), '${firstName}') and contains(tolower(lastName), '${lastName}'))`;
        } else {
          // Single word input: search in either First OR Last
          const safeName = name.replace(/'/g, "''").toLowerCase();
          filter = `$filter=contains(tolower(firstName), '${safeName}') or contains(tolower(lastName), '${safeName}')`;
        }
      }

      const endpoint = "/api/InsuredList";
      const url = `${BASE_URL}${endpoint}?${encodeURI(filter)}&$orderby=type asc&$count=true&$top=10`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: { 
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) throw new Error(`Status ${response.status}`);
      return await response.json();
    } catch (err) {
      console.warn("Search Failed:", err);
      throw err;
    }
  },

  async getPolicies(user: any) {
    if (user.policies && Array.isArray(user.policies) && user.policies.length > 0) {
      const mapped = user.policies.map((p: any) => ({
        ...p,
        lineOfBusinesses: p.linesOfBusiness?.map((l: string) => ({ lineOfBusinessName: l })) || []
      }));
      return { value: mapped };
    }

    try {
      const token = await this.getAccessToken();
      let filter = "";
      const insuredId = user.id || user.insuredDatabaseId;

      if (insuredId && insuredId !== "SIM-FORCE-01") {
        filter = `$filter=InsuredDatabaseId eq '${insuredId}'`;
      } else {
        const email = user.eMail || user.email || '';
        filter = `$filter=contains(InsuredEmail, '${email}')`;
      }

      const url = `${BASE_URL}/api/PolicyDetailList?${encodeURI(filter)}`;

      const response = await fetch(url, {
        method: 'GET',
        headers: { 
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
         return { value: [] };
      }
      return await response.json();
    } catch (e) {
      console.error("Policy Fetch Error", e);
      return { value: [] };
    }
  },

  async getPolicyVehicles(policyDatabaseId: string) {
    try {
      const token = await this.getAccessToken();
      const response = await fetch(`${BASE_URL}/api/Policy/PolicyVehicles`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          PolicyDataBaseId: [policyDatabaseId]
        })
      });
      if (!response.ok) throw new Error("Fetch failed");
      return await response.json();
    } catch (e) {
      return [];
    }
  },

  async getPolicyDrivers(policyDatabaseId: string) {
    try {
      const token = await this.getAccessToken();
      const response = await fetch(`${BASE_URL}/api/Policy/PolicyDrivers`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          PolicyDataBaseId: [policyDatabaseId]
        })
      });
      if (!response.ok) throw new Error("Fetch failed");
      return await response.json();
    } catch (e) {
      return [];
    }
  },

  async getPolicyProperties(policyDatabaseId: string) {
    try {
      const token = await this.getAccessToken();
      const response = await fetch(`${BASE_URL}/api/Policy/PolicyProperties`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          PolicyDataBaseId: [policyDatabaseId]
        })
      });
      if (!response.ok) throw new Error("Fetch failed");
      return await response.json();
    } catch (e) {
      return [];
    }
  },

  async getVehicles(policyId: string) {
    try {
       const token = await this.getAccessToken();
       const response = await fetch(`${BASE_URL}/api/VehicleList?$filter=policyIds/any(p: p eq '${policyId}')`, {
        method: 'GET',
        headers: { 
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) throw new Error("Fetch failed");
      return await response.json();
    } catch (e) {
      return { value: [] };
    }
  },

  async insertTask(task: any) {
    try {
      const token = await this.getAccessToken();
      const response = await fetch(`${BASE_URL}/api/Task/Insert`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ ...task, dueDate: new Date().toISOString() })
      });
      if (!response.ok) throw new Error("Insert failed");
      return await response.json();
    } catch (e) {
      console.error(e);
      throw e;
    }
  }
};
