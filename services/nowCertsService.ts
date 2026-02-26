
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
      const email = query.email?.trim();
      const rawPhone = query.phone?.replace(/\D/g, '') || '';
      
      // Format phone as ###-###-#### for API search if possible, or just search raw if API supports it. 
      // The prompt example uses ###-###-####.
      const formattedPhone = rawPhone.length === 10 
        ? `${rawPhone.slice(0, 3)}-${rawPhone.slice(3, 6)}-${rawPhone.slice(6)}` 
        : rawPhone;

      if (email && formattedPhone) {
         filter = `$filter=(contains(phone, '${formattedPhone}') or contains(cellPhone, '${formattedPhone}') or contains(smsPhone, '${formattedPhone}')) or (contains(eMail, '${email}') or contains(eMail2, '${email}') or contains(eMail3, '${email}'))`;
      } else if (email) {
        filter = `$filter=(contains(eMail, '${email}') or contains(eMail2, '${email}') or contains(eMail3, '${email}'))`;
      } else if (formattedPhone) {
        filter = `$filter=(contains(phone, '${formattedPhone}') or contains(cellPhone, '${formattedPhone}') or contains(smsPhone, '${formattedPhone}'))`;
      }

      const endpoint = "/api/InsuredList";
      // The prompt example uses InsuredList() but the standard is usually without () or with. Let's try to match the prompt's style if needed, but usually query params are appended.
      // Prompt: https://api.nowcerts.com/api/InsuredList()?$orderby=...
      const url = `${BASE_URL}${endpoint}()?${encodeURI(filter)}&$orderby=type asc&$count=true`;
      
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

  async updateInsured(data: any) {
    try {
      const token = await this.getAccessToken();
      const response = await fetch(`${BASE_URL}/api/Insured/Insert`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Update Failed: ${errorText}`);
      }
      return await response.json();
    } catch (e) {
      console.error("Update Insured Error", e);
      throw e;
    }
  },

  async insertVehicle(vehicleData: any) {
    try {
      const token = await this.getAccessToken();
      const response = await fetch(`${BASE_URL}/api/Vehicle/InsertVehicle`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(vehicleData)
      });

      if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Insert Vehicle Failed: ${errorText}`);
      }
      return await response.json();
    } catch (e) {
      console.error("Insert Vehicle Error", e);
      throw e;
    }
  },

  async insertDriver(driverData: any) {
    try {
      const token = await this.getAccessToken();
      const response = await fetch(`${BASE_URL}/api/Driver/InsertDriver`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(driverData)
      });

      if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Insert Driver Failed: ${errorText}`);
      }
      return await response.json();
    } catch (e) {
      console.error("Insert Driver Error", e);
      throw e;
    }
  },

  async insertTask(task: any) {
    try {
      const token = await this.getAccessToken();
      const response = await fetch(`${BASE_URL}/api/Zapier/InsertTask`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(task)
      });

      if (!response.ok) {
         const errorText = await response.text();
         throw new Error(`Task Insert Failed: ${errorText}`);
      }
      return await response.json();
    } catch (e) {
      console.error("Insert Task Error", e);
      throw e;
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

  async getPolicyCoverages(policyDatabaseId: string) {
    try {
      const token = await this.getAccessToken();
      const response = await fetch(`${BASE_URL}/api/Policy/Coverages`, {
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

  async getPolicyFiles(policyId: string, insuredId: string) {
    try {
      const token = await this.getAccessToken();
      const response = await fetch(`${BASE_URL}/api/Policy/GetPolicyFilesList?insuredId=${insuredId}&policyid=${policyId}`, {
        method: 'GET',
        headers: { 
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) throw new Error("Fetch failed");
      return await response.json();
    } catch (e) {
      return null;
    }
  },

  async getFileDirectUrl(fileId: string) {
    try {
      const token = await this.getAccessToken();
      const response = await fetch(`${BASE_URL}/api/Files/GetFileDirectUrl/${fileId}`, {
        method: 'GET',
        headers: { 
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) throw new Error("Fetch failed");
      return await response.json();
    } catch (e) {
      return null;
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
  }
};
