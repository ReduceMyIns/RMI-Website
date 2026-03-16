
export interface ServiceCarrier {
  name: string;
  serviceLevel: 'Full Service' | 'Billing & Claim Service' | 'Agency Serviced' | 'Partial Service';
  types: ('Personal' | 'Commercial')[];
  phone: string;
  loginUrl?: string;
  iosApp?: string;
  androidApp?: string;
  email?: string;
  claimsPhone?: string; 
  logo?: string;
}

export const SERVICE_CARRIERS: ServiceCarrier[] = [
  { 
    name: "Progressive", 
    logo: "https://raw.githubusercontent.com/ReduceMyIns/RMI-Website/main/public/carrier-logos/Progressive-Mobile.png",
    serviceLevel: "Full Service", 
    types: ['Personal', 'Commercial'], 
    phone: "800-876-5581", 
    loginUrl: "https://account.apps.progressive.com/access/login", 
    androidApp: "https://goo.gl/XG9emn", 
    iosApp: "https://goo.gl/XG9emn", 
    email: "customerservice@e.progressive.com" 
  },
  { 
    name: "Allstate", 
    logo: "https://raw.githubusercontent.com/ReduceMyIns/RMI-Website/main/public/carrier-logos/allstate-mobile-logo.png",
    serviceLevel: "Full Service", 
    types: ['Personal', 'Commercial'], 
    phone: "800-669-1552", 
    loginUrl: "https://myaccountrwd.allstate.com/anon/account/login", 
    androidApp: "https://bit.ly/AllstateAndroid", 
    iosApp: "https://bit.ly/AllstateIphoneapp", 
    email: "service@allstate.com" 
  },
  { 
    name: "Nationwide", 
    logo: "https://raw.githubusercontent.com/ReduceMyIns/RMI-Website/main/public/carrier-logos/Nationwide-Mobile.jpg",
    serviceLevel: "Full Service", 
    types: ['Personal', 'Commercial'], 
    phone: "800-282-1446", 
    loginUrl: "https://bit.ly/NationwidePersonal", 
    androidApp: "http://bit.ly/2FLDN6v", 
    iosApp: "http://bit.ly/2FLDN6v", 
    email: "plpc@nationwide.com" 
  },
  { 
    name: "Travelers", 
    logo: "https://raw.githubusercontent.com/ReduceMyIns/RMI-Website/main/public/carrier-logos/Travelers-Mobile.jpg",
    serviceLevel: "Full Service", 
    types: ['Personal', 'Commercial'], 
    phone: "877-872-8737", 
    loginUrl: "https://www.travelers.com/login/#/", 
    androidApp: "https://bit.ly/TravelersDroid", 
    iosApp: "https://bit.ly/TravelersiOS", 
    email: "plserv@travelers.com" 
  },
  { 
    name: "Liberty Mutual", 
    logo: "https://raw.githubusercontent.com/ReduceMyIns/RMI-Website/main/public/carrier-logos/Liberty-Mutual.jpg",
    serviceLevel: "Full Service", 
    types: ['Personal', 'Commercial'], 
    phone: "877-538-1920", 
    loginUrl: "https://login-business.libertymutual.com/", 
    email: "businessservice@libertymutual.com" 
  },
  { 
    name: "Safeco", 
    logo: "https://raw.githubusercontent.com/ReduceMyIns/RMI-Website/main/public/carrier-logos/SafeCo-Mobile.jpg",
    serviceLevel: "Full Service", 
    types: ['Personal'], 
    phone: "866-472-3326", 
    loginUrl: "https://customer.safeco.com/accountmanager/homepage", 
    androidApp: "https://www.safeco.com/customer-resources/mobile-voice-apps/safeco-mobile-app", 
    iosApp: "https://www.safeco.com/customer-resources/mobile-voice-apps/safeco-mobile-app", 
    email: "documents@safeco.com" 
  },
  { 
    name: "State Auto", 
    logo: "https://raw.githubusercontent.com/ReduceMyIns/RMI-Website/main/public/carrier-logos/State-Auto-Mobile.png",
    serviceLevel: "Billing & Claim Service", 
    types: ['Personal', 'Commercial'], 
    phone: "800-288-4425", 
    loginUrl: "https://empidn.stateauto.com/WebIdPForms/Login/Portal", 
    androidApp: "https://play.google.com/store/apps/details?id=com.stateauto.mobile.insured", 
    iosApp: "https://apps.apple.com/us/app/state-auto/id1567426169", 
    email: "customerservice@stateauto.com" 
  },
  { 
    name: "Foremost", 
    logo: "https://raw.githubusercontent.com/ReduceMyIns/RMI-Website/main/public/carrier-logos/Foremost-Agent.jpg",
    serviceLevel: "Full Service", 
    types: ['Personal'], 
    phone: "800-527-3905", 
    loginUrl: "https://www.foremost.com/login", 
    androidApp: "https://bit.ly/ForemostDroid", 
    iosApp: "https://bit.ly/ForemostiOS", 
    email: "imaging@foremost.com" 
  },
  { 
    name: "American Modern", 
    logo: "https://raw.githubusercontent.com/ReduceMyIns/RMI-Website/main/public/carrier-logos/American-Modern-Agent.png",
    serviceLevel: "Full Service", 
    types: ['Personal'], 
    phone: "800-543-2644", 
    loginUrl: "https://amsuite.amig.com/eidp/Authn/UserPassword", 
    email: "servicecenter@amig.com" 
  },
  { 
    name: "Hagerty", 
    logo: "https://raw.githubusercontent.com/ReduceMyIns/RMI-Website/main/public/carrier-logos/Hagerty.jpg",
    serviceLevel: "Full Service", 
    types: ['Personal'], 
    phone: "877-922-9701", 
    loginUrl: "https://login.hagerty.com/identity/Login", 
    email: "auto@hagerty.com" 
  },
  { 
    name: "Chubb", 
    logo: "https://storage.googleapis.com/glide-prod.appspot.com/uploads-v2/afXkvWnriydq7v7818N6/pub/Aimjq0w6T4SQR1QUIIEV.jpg",
    serviceLevel: "Full Service", 
    types: ['Commercial', 'Personal'], 
    phone: "833-550-9660", 
    loginUrl: "https://www.chubb.com/us-en/log-in.html", 
    email: "smallbizbilling@chubb.com" 
  },
  { 
    name: "Next Insurance", 
    logo: "https://raw.githubusercontent.com/ReduceMyIns/RMI-Website/main/public/carrier-logos/Next-Insurance.png",
    serviceLevel: "Full Service", 
    types: ['Commercial'], 
    phone: "855-222-5919", 
    loginUrl: "https://bit.ly/NEXTportal", 
    androidApp: "https://play.google.com/store/apps/details?id=com.nextinsurance", 
    iosApp: "https://apps.apple.com/us/app/next-insurance/id1580721755", 
    email: "support@nextinsurance.com" 
  },
  { 
    name: "Pie Insurance", 
    logo: "https://raw.githubusercontent.com/ReduceMyIns/RMI-Website/main/public/carrier-logos/Pie.png",
    serviceLevel: "Billing & Claim Service", 
    types: ['Commercial'], 
    phone: "855-275-9884", 
    loginUrl: "https://partner.pieinsurance.com/sign-in", 
    email: "agencyservice@pieinsurance.com" 
  },
  { 
    name: "CNA", 
    logo: "https://raw.githubusercontent.com/ReduceMyIns/RMI-Website/main/public/carrier-logos/CNA.jpg",
    serviceLevel: "Billing & Claim Service", 
    types: ['Commercial'], 
    phone: "800-262-2000", 
    loginUrl: "https://www.cnacentral.com/", 
    email: "cna_help@cna.com" 
  },
  { 
    name: "Lemonade", 
    logo: "https://raw.githubusercontent.com/ReduceMyIns/RMI-Website/main/public/carrier-logos/Lemonade-Agent.png",
    serviceLevel: "Full Service", 
    types: ['Personal'], 
    phone: "844-733-8666", 
    loginUrl: "https://bit.ly/LemonadeOnline", 
    androidApp: "https://bit.ly/LemonadeDroid", 
    iosApp: "https://bit.ly/lemonadeiphone", 
    email: "help@lemonade.com" 
  },
  { 
    name: "Hippo", 
    logo: "https://raw.githubusercontent.com/ReduceMyIns/RMI-Website/main/public/carrier-logos/Hippo-Agent.jpg",
    serviceLevel: "Full Service", 
    types: ['Personal'], 
    phone: "800-585-0705", 
    loginUrl: "https://my.hippo.com/login", 
    email: "support@hippo.com" 
  },
  { 
    name: "Branch", 
    logo: "https://raw.githubusercontent.com/ReduceMyIns/RMI-Website/main/public/carrier-logos/Branch.png",
    serviceLevel: "Full Service", 
    types: ['Personal'], 
    phone: "855-438-5411", 
    loginUrl: "https://account.ourbranch.com/", 
    androidApp: "https://play.google.com/store/apps/details?id=com.branch.accountmobile", 
    iosApp: "https://apps.apple.com/us/app/branch-insurance/id1437502167", 
    email: "support@ourbranch.com" 
  },
  { 
    name: "Openly", 
    logo: "https://raw.githubusercontent.com/ReduceMyIns/RMI-Website/main/public/carrier-logos/Openly-transparent-logo.png",
    serviceLevel: "Full Service", 
    types: ['Personal'], 
    phone: "857-990-9080", 
    loginUrl: "https://bit.ly/3vzLWBR", 
    email: "service@openly.com" 
  },
  { name: "Attune", logo: "https://raw.githubusercontent.com/ReduceMyIns/RMI-Website/main/public/carrier-logos/Attune-Logo.png", serviceLevel: "Partial Service", types: ['Commercial'], phone: "888-530-4650", loginUrl: "https://app.attuneinsurance.com/login", email: "help@attuneinsurance.com" },
  { name: "Berkshire Hathaway (biBERK)", logo: "https://raw.githubusercontent.com/ReduceMyIns/RMI-Website/main/public/carrier-logos/biBERKtile.jpg", serviceLevel: "Full Service", types: ['Commercial'], phone: "844-472-0967", loginUrl: "https://www.biberk.com/policyholders", email: "partneragentservice@biberk.com" },
  { 
    name: "Coterie", 
    logo: "https://raw.githubusercontent.com/ReduceMyIns/RMI-Website/main/public/carrier-logos/Coterie-Transparent.png",
    serviceLevel: "Full Service", 
    types: ['Commercial'], 
    phone: "855-566-1011", 
    loginUrl: "https://dashboard.coterieinsurance.com/login", 
    email: "support@coterieinsurance.com" 
  },
  { name: "Dairyland", logo: "https://raw.githubusercontent.com/ReduceMyIns/RMI-Website/main/public/carrier-logos/Dairyland-Logo.png", serviceLevel: "Full Service", types: ['Personal'], phone: "800-334-0090", loginUrl: "https://bit.ly/3joUiqO", email: "help@dairylandinsurance.com" },
  { name: "Employers", logo: "https://raw.githubusercontent.com/ReduceMyIns/RMI-Website/main/public/carrier-logos/Employers.png", serviceLevel: "Agency Serviced", types: ['Commercial'], phone: "888-682-6671", email: "customersupport@employers.com" },
  { name: "Encompass", logo: "https://raw.githubusercontent.com/ReduceMyIns/RMI-Website/main/public/carrier-logos/Encompass.png", serviceLevel: "Full Service", types: ['Personal'], phone: "800-897-9678", loginUrl: "https://bit.ly/RIMEncompass", email: "Service@encompassins.com" },
  { name: "Grange", logo: "https://raw.githubusercontent.com/ReduceMyIns/RMI-Website/main/public/carrier-logos/Grange-Agent.jpg", serviceLevel: "Full Service", types: ['Personal', 'Commercial'], phone: "855-299-2040", loginUrl: "https://bit.ly/GrangeLogin", androidApp: "https://play.google.com/store/apps/details?id=com.GrangeInsurance.Mobileapp", iosApp: "https://apps.apple.com/us/app/grange-mobile/id1202329486", email: "mypolicy@grangeinsurance.com" },
  { name: "Guard", logo: "https://raw.githubusercontent.com/ReduceMyIns/RMI-Website/main/public/carrier-logos/GUARD-Agent.png", serviceLevel: "Full Service", types: ['Personal', 'Commercial'], phone: "800-969-5454", loginUrl: "https://bit.ly/3psJqfJ", email: "servicecenter@guard.com" },
  { 
    name: "Hiscox", 
    logo: "https://raw.githubusercontent.com/ReduceMyIns/RMI-Website/main/public/carrier-logos/Hiscox.png",
    serviceLevel: "Full Service", 
    types: ['Commercial'], 
    phone: "866-283-7545", 
    loginUrl: "https://bit.ly/HiscoxOnline", 
    email: "agencyusa@hiscox.com" 
  },
  { name: "Kemper", logo: "https://raw.githubusercontent.com/ReduceMyIns/RMI-Website/main/public/carrier-logos/Kemper-mobile-logo.png", serviceLevel: "Full Service", types: ['Personal'], phone: "800-327-1500", loginUrl: "https://bit.ly/3vD7zkH", email: "specialtyservice@kemper.com" },
  { name: "Markel", logo: "https://raw.githubusercontent.com/ReduceMyIns/RMI-Website/main/public/carrier-logos/Markel-Firstcomp-Agent.jpg", serviceLevel: "Full Service", types: ['Commercial'], phone: "888-500-3344", loginUrl: "https://account.markel.com/", email: "customerservice2@markel.com" },
  { name: "Mercury", logo: "https://raw.githubusercontent.com/ReduceMyIns/RMI-Website/main/public/carrier-logos/Mercury.png", serviceLevel: "Full Service", types: ['Personal'], phone: "866-539-2075", email: "service@mercuryinsurance.com" },
  { name: "MetLife", logo: "https://raw.githubusercontent.com/ReduceMyIns/RMI-Website/main/public/carrier-logos/Metlife-Logo.jfif", serviceLevel: "Full Service", types: ['Personal'], phone: "800-422-4272", loginUrl: "https://bit.ly/2Zd9Uap", email: "policyupdate@metlife.com" },
  { name: "National General", logo: "https://raw.githubusercontent.com/ReduceMyIns/RMI-Website/main/public/carrier-logos/National-General.jpg", serviceLevel: "Full Service", types: ['Personal', 'Commercial'], phone: "877-468-3466", loginUrl: "https://bit.ly/3E3rhsY", email: "service@ngic.com" },
  { name: "Stillwater", logo: "https://raw.githubusercontent.com/ReduceMyIns/RMI-Website/main/public/carrier-logos/Stillwater.png", serviceLevel: "Full Service", types: ['Personal', 'Commercial'], phone: "855-712-4092", loginUrl: "https://stillwaterinsurance.com/SalesPortal/login", email: "ins@stillwater.com" },
  { name: "The General", logo: "https://raw.githubusercontent.com/ReduceMyIns/RMI-Website/main/public/carrier-logos/The-General-Mobile.png", serviceLevel: "Full Service", types: ['Personal'], phone: "800-280-1466", loginUrl: "https://bit.ly/3niYzgK", email: "customersupport@thegeneral.com" },
  { 
    name: "Thimble", 
    logo: "https://raw.githubusercontent.com/ReduceMyIns/RMI-Website/main/public/carrier-logos/Thimble-Agent.jpg",
    serviceLevel: "Full Service", 
    types: ['Commercial'], 
    phone: "855-940-4525", 
    loginUrl: "https://bit.ly/ThimbleOnline", 
    email: "broker@thimbel.com" 
  },
  { name: "Trexis", logo: "https://raw.githubusercontent.com/ReduceMyIns/RMI-Website/main/public/carrier-logos/Trexis-Mobile.png", serviceLevel: "Partial Service", types: ['Personal'], phone: "877-384-7466", loginUrl: "https://trexis.com/", email: "customerservice@trexis.com" },
  { name: "USLI", logo: "https://raw.githubusercontent.com/ReduceMyIns/RMI-Website/main/public/carrier-logos/USLI-Agent.png", serviceLevel: "Partial Service", types: ['Commercial'], phone: "800-523-5545", loginUrl: "https://bit.ly/3jrn9ep", email: "support@usli.com" }
];
