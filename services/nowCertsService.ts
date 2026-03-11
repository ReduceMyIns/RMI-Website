
import { APP_CONFIG } from './config.ts';
import type { LeadData, CommercialRatingData, QuoteRequest } from '../types.ts';

const BASE_URL = '/api/nowcerts';
const AGENCY_ID = "7b9d101f-6a6c-40a6-b256-bfd8a901c277";

export const nowCertsApi = {
  /**
   * Get Access Token for NowCerts API
   */
  async getAccessToken() {
    // The backend Express server now handles token rotation and injection securely.
    return "proxy-handles-token";
  },

  /**
   * Pushes full quote application structure to NowCerts (Prospect, Quote, Vehicles, Drivers)
   */
  async pushQuoteApplication(formData: QuoteRequest) {
    try {
      // Mapping Data to NowCerts Schema
      // databaseId fields are omitted to ensure creation of new items
      const payload: any = {
        AgencyId: AGENCY_ID, // PascalCase required
        Form_Name: "AI Quote Application", // Required field
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
            type: r.relationship === 'Self' ? 'Insured' : (r.relationship || 'Contact'),
            birthday: r.dob ? new Date(r.dob).toISOString() : null,
            socialSecurityNumber: null, 
            isDriver: r.status === 'rated',
            dlNumber: r.licenseNumber,
            dlStateName: r.licenseState,
            occupation: r.occupation,
            maritalStatus: r.maritalStatus,
            email: r.email,
            phone: r.phone,
            goodStudentDiscount: r.goodStudentDiscount,
            driverTrainingDiscount: r.driverTrainingDiscount
        })),

        // Vehicles Mapping
        Vehicles: formData.vehicles.map(v => ({
            year: v.year,
            make: v.make,
            model: v.model,
            vin: v.vin || "",
            type_of_use: v.usage === 'business' ? 1 : 2, // 1=Commercial, 2=Personal
            usageType: v.usage, // Pass raw usage string
            active: v.active !== false,
            deletionReason: v.active === false ? v.deletionReason : null,
            vehicleLienHolders: v.lien ? [{ 
                natureOfInterest: 1, // 1 = Lienholder
                name: v.lienholderName,
                addressLine1: v.lienholderAddress,
                city: v.lienholderCity,
                state: v.lienholderState,
                zipCode: v.lienholderZip
            }] : [],
            estimated_annual_distance: v.annualMileage?.toString() || "12000",
            telematicsOptIn: v.telematicsOptIn,
            isRideshare: v.isRideshare,
            rideshareType: v.rideshareType,
            recalls: v.recalls // Pass NHTSA recalls
        })),
        
        // Fenris Data
        FenrisData: formData.fenrisData,

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
        },
        cache: 'no-store'
      });
      
      if (!response.ok) {
          const errText = await response.text();
          console.error(`searchInsured Status ${response.status}: ${errText}`);
          throw new Error(`Status ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (err) {
      console.warn("Search Failed:", err);
      throw err;
    }
  },

  async updateInsured(data: any) {
    try {
      const token = await this.getAccessToken();
      
      // Validate GUID format
      const id = data.databaseId || data.id;
      const isGuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
      
      const payload: any = {
        firstName: data.firstName,
        middleName: data.middleName,
        lastName: data.lastName,
        dateOfBirth: data.dob || data.dateOfBirth,
        addressLine1: data.addressLine1,
        addressLine2: data.addressLine2,
        state: data.state,
        city: data.city,
        zipCode: data.zipCode,
        eMail: data.email,
        phone: data.phone,
        cellPhone: data.cellPhone,
        smsPhone: data.smsPhone,
        insuredType: data.insuredType
      };

      if (isGuid) {
        payload.databaseId = id;
      }

      if (data.commercialName) payload.commercialName = data.commercialName;
      if (data.dba) payload.dba = data.dba;
      if (data.fein) payload.fein = data.fein;
      if (data.website) payload.website = data.website;

      const response = await fetch(`${BASE_URL}/api/Insured/Insert`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
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

  async searchCertificateHolders(query: string) {
    try {
      const token = await this.getAccessToken();
      // Using the filter provided by the user: (contains(eMail, 'query') or contains(name, 'query') ...)
      // We'll simplify to search name and email for now as a common use case
      const filter = `$filter=(contains(name, '${query}') or contains(eMail, '${query}'))`;
      const url = `${BASE_URL}/api/CertificateHolderList()?$count=true&$orderby=name asc&$skip=0&$top=5&${encodeURI(filter)}`;
      
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
      console.warn("Certificate Holder Search Failed:", err);
      return { value: [], '@odata.count': 0 };
    }
  },

  async insertCertificateHolder(holderData: any) {
    try {
      const token = await this.getAccessToken();
      const response = await fetch(`${BASE_URL}/api/CertificateHolder/Insert`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(holderData)
      });

      if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Insert Certificate Holder Failed: ${errorText}`);
      }
      return await response.json();
    } catch (e) {
      console.error("Insert Certificate Holder Error", e);
      throw e;
    }
  },

  async getPolicies(user: any) {
    // Check if user object has pre-loaded policies (e.g. from mock or previous fetch)
    if (user.policies && Array.isArray(user.policies) && user.policies.length > 0) {
      const mapped = user.policies.map((p: any) => ({
        ...p,
        lineOfBusinesses: p.linesOfBusiness?.map((l: string) => ({ lineOfBusinessName: l })) || []
      }));
      return { value: mapped };
    }

    try {
      const token = await this.getAccessToken();
      let insuredId = user.insuredDatabaseId || user.databaseId || user.id;
      const isGuid = (id: string) => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);

      const endpoint = APP_CONFIG.apis.nowCerts.endpoints.policyList || "/api/PolicyDetailList";

      // Always try to find the insured by email first to catch all policies across duplicate records
      const email = user.eMail || user.email || '';
      if (email) {
          const searchResult = await this.searchInsured({ email });
          if (searchResult && searchResult.value && searchResult.value.length > 0) {
              // Try to find policies for all matching insureds
              let allPolicies: any[] = [];
              for (const insured of searchResult.value) {
                  const id = insured.id || insured.databaseId;
                  if (!id) continue;
                  const query = `$filter=insuredDatabaseId eq ${id}&$top=100&$skip=0&$orderby=effectiveDate desc`;
                  const url = `${BASE_URL}${endpoint}?${encodeURI(query)}`;
                  const response = await fetch(url, {
                    method: 'GET',
                    headers: { 
                      'Accept': 'application/json',
                      'Authorization': `Bearer ${token}`
                    },
                    cache: 'no-store'
                  });
                  if (response.ok) {
                      const data = await response.json();
                      if (data && data.value && Array.isArray(data.value)) {
                          allPolicies = allPolicies.concat(data.value);
                      }
                  }
              }
              
              // If we found policies, return them. If not, maybe fall back to insuredId if we have one.
              if (allPolicies.length > 0) {
                  return { value: allPolicies };
              }
          }
      }

      // Fallback to insuredId if email search didn't yield policies or email is missing
      if (!insuredId || insuredId === "SIM-FORCE-01" || !isGuid(insuredId)) {
          console.warn("getPolicies: No valid user ID or email to fetch policies.");
          return { value: [] };
      }

      const query = `$filter=insuredDatabaseId eq ${insuredId}&$top=100&$skip=0&$orderby=effectiveDate desc`;
      const url = `${BASE_URL}${endpoint}?${encodeURI(query)}`;

      const response = await fetch(url, {
        method: 'GET',
        headers: { 
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        cache: 'no-store'
      });

      if (!response.ok) {
         const errText = await response.text();
         console.warn(`getPolicies failed with status: ${response.status}, text: ${errText}`);
         return { value: [] };
      }
      return await response.json();
    } catch (e: any) {
      console.error("Policy Fetch Error", e);
      return { value: [], error: e.message || "Unknown error" };
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
       const query = `$filter=policyIds/any(p: p eq '${policyId}')`;
       const response = await fetch(`${BASE_URL}/api/VehicleList?${encodeURI(query)}`, {
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
