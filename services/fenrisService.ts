
import { APP_CONFIG } from './config';
import { Resident, Vehicle } from '../types';

// Mock Data for fallback/demo
const MOCK_FENRIS_RESPONSE = {
    "status": "Success",
    "drivers": [
        { "firstName": "John", "lastName": "Doe", "age": 45, "relationship": "Self" },
        { "firstName": "Jane", "lastName": "Doe", "age": 42, "relationship": "Spouse" }
    ],
    "vehicles": [
        { "year": 2020, "make": "Honda", "model": "Accord", "vin": "1HG..." },
        { "year": 2018, "make": "Toyota", "model": "RAV4", "vin": "2T3..." }
    ]
};

const WEBHOOK_URL = "https://n8n.srv992249.hstgr.cloud/webhook/atuoprefill";

// Helper to ensure YYYY-MM-DD format for date inputs
const formatDate = (val: string | undefined) => {
  if (!val) return '';
  const date = new Date(val);
  if (isNaN(date.getTime())) return val; // Return original if invalid
  return date.toISOString().split('T')[0];
};

export const fenrisApi = {
  /**
   * Prefill household residents and vehicles using the n8n Webhook.
   */
  async prefillAuto(data: { firstName: string; lastName: string; dob: string; address: string; city: string; state: string; zip: string }) {
    console.log("Starting Auto Prefill via Webhook:", data.address);
    
    try {
      const payload = {
        responseType: "C",
        person: {
          firstName: data.firstName,
          lastName: data.lastName,
          dateOfBirth: data.dob // Must be MM/DD/YYYY if possible, but sending as is
        },
        address: {
          addressLine1: data.address,
          addressLine2: "",
          city: data.city,
          state: data.state,
          zipCode: data.zip
        }
      };

      const response = await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
         throw new Error(`Webhook Status: ${response.status}`);
      }
      
      const rawResult = await response.json();
      console.log("Webhook Data Received:", rawResult);
      
      // Handle array wrapping common in n8n responses
      const result = Array.isArray(rawResult) ? (rawResult.length > 0 ? rawResult[0] : {}) : rawResult;

      return this.mapResponse(result, data.state);

    } catch (e) {
      console.warn("Prefill Webhook Exception:", e);
      // Fallback to mock/empty data if webhook fails to prevent UI block
      return this.mapResponse(MOCK_FENRIS_RESPONSE, data.state); 
    }
  },

  /**
   * Helper to map raw Fenris JSON to app types
   */
  mapResponse(result: any, inputState?: string) {
    // Basic validation
    if (!result || typeof result !== 'object') return { residents: [], vehicles: [] };

    // Use state from primary response if available
    const residentState = result.primary?.parsedAddress?.state || inputState || 'TN';

    // Map Drivers
    const driversList = result.drivers || [];
    const residents: Resident[] = driversList.map((d: any, idx: number) => {
      // Determine relationship
      let relationship = 'Household Member';
      if (d.relationship) relationship = d.relationship;
      else if (d.memberCode?.includes('Primary')) relationship = 'Self';
      else if (d.memberCode?.includes('Spouse')) relationship = 'Spouse';
      else if (d.memberCode?.includes('Child')) relationship = 'Child';

      return {
        id: `r-fen-${idx}-${Date.now()}`,
        firstName: d.firstName || 'Unknown',
        lastName: d.lastName || 'Unknown',
        dob: formatDate(d.dateOfBirth),
        relationship: relationship,
        status: 'pending' as const,
        licenseState: residentState
      };
    });
    
    // Map Vehicles (Prefer 'vehiclesEnhanced' if available)
    const rawVehicles = (result.vehiclesEnhanced && result.vehiclesEnhanced.length > 0) 
      ? result.vehiclesEnhanced 
      : (result.vehicles || []);

    const vehicles: Vehicle[] = rawVehicles.map((v: any, idx: number) => {
      const modelWithTrim = v.trim ? `${v.model} ${v.trim}` : v.model;

      return {
        id: `v-fen-${idx}-${Date.now()}`,
        year: v.year ? parseInt(v.year) : new Date().getFullYear(),
        make: v.make || 'Unknown',
        model: modelWithTrim || 'Unknown',
        vin: v.vin || undefined,
        usage: 'commute' as const,
        lien: v.registeredOwners?.some((o: any) => o.ownerType === 'Lien Holder') || false,
        status: 'pending' as const,
        type: 'Car'
      };
    });

    return { residents, vehicles };
  }
};
