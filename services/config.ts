export const APP_CONFIG = {
  agency: {
    name: "ReduceMyInsurance.Net",
    address: "1500 Medical Center Pkwy STE 3A-26, Murfreesboro, TN 37129",
    phone: "615-900-0288",
    email: "service@ReduceMyInsurance.Net",
    website: "https://www.ReduceMyInsurance.Net"
  },
  
  apis: {
    nowCerts: {
      baseUrl: "https://api.nowcerts.com",
      endpoints: {
        insuredList: "/api/InsuredList",
        policyList: "/api/PolicyDetailList",
        carrierList: "/api/CarrierList",
        taskInsert: "/api/Task/Insert"
      }
    },
    gemini: {
      model: "gemini-3-pro-preview"
    }
  },
  
  carriers: {
    "Progressive": { number: "800-876-5581", service: "Full Service", claim: "800-274-4499" },
    "Allstate": { number: "800-669-1552", service: "Full Service", claim: "800-255-7828" },
    "Nationwide": { number: "800-282-1446", service: "Full Service", claim: "800-421-3535" },
    "Travelers": { number: "877-872-8737", service: "Full Service", claim: "800-252-4633" },
    "Liberty Mutual": { number: "877-538-1920", service: "Full Service", claim: "800-225-2467" },
    "SafeCo": { number: "866-472-3326", service: "Full Service", claim: "800-332-3226" },
    "State Auto": { number: "800-288-4425", service: "Billing & Claim Service", claim: "800-766-1853" },
    "Foremost": { number: "800-527-3905", service: "Full Service", claim: "800-527-3907" },
    "American Modern": { number: "800-543-2644", service: "Full Service", claim: "800-543-2644" },
    "Hagerty": { number: "877-922-9701", service: "Full Service", claim: "800-922-4050" },
    "Chubb": { number: "833-550-9660", service: "Full Service", claim: "800-252-4670" },
    "Next Insurance": { number: "855-222-5919", service: "Full Service", claim: "855-222-5919" },
    "Pie Insurance": { number: "855-275-9884", service: "Billing & Claim Service", claim: "855-275-9884" },
    "CNA": { number: "800-262-2000", service: "Billing & Claim Service", claim: "877-262-2727" },
    "Lemonade": { number: "844-733-8666", service: "Full Service", claim: "844-733-8666" },
    "Hippo": { number: "800-585-0705", service: "Full Service", claim: "800-585-0705" },
    "Branch": { number: "855-438-5411", service: "Full Service", claim: "855-438-5411" },
    "Openly": { number: "857-990-9080", service: "Full Service", claim: "857-990-9080" }
  }
};

export function getCarrierServiceLevel(carrierName: string | null | undefined) {
  if (!carrierName) return { number: APP_CONFIG.agency.phone, service: "Agency Serviced", claim: APP_CONFIG.agency.phone };
  
  const normalized = carrierName.trim().toLowerCase();
  const keys = Object.keys(APP_CONFIG.carriers);
  
  // Robust matching: Find the key that is contained within the carrierName or vice-versa
  const matchKey = keys.find(k => 
    normalized.includes(k.toLowerCase()) || 
    k.toLowerCase().includes(normalized)
  );

  if (matchKey) {
    return (APP_CONFIG.carriers as any)[matchKey];
  }

  // Fallback to Agency contact if no carrier specific data is found
  return { 
    number: APP_CONFIG.agency.phone, 
    service: "Agency Direct Support", 
    claim: APP_CONFIG.agency.phone 
  };
}