
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
    logo: "https://lh3.googleusercontent.com/d/1-w8RRkeqR4lNIssou_3_26GYEDryxbaJ",
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
    logo: "https://lh3.googleusercontent.com/d/1pFX8tKOrMDo7TvtICJZCd0w4H9FE0DJd",
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
    logo: "https://lh3.googleusercontent.com/d/108j3zJ9oJnyDjUmn367u6De_E_9-OV6E",
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
    logo: "https://lh3.googleusercontent.com/d/1-uyrdfvxZoxRE-OtyONaSulL7NjDqMAY",
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
    logo: "https://lh3.googleusercontent.com/d/1thzzv3tTGjA09YHOZCVBGoQ7hCCxPYob",
    serviceLevel: "Full Service", 
    types: ['Personal', 'Commercial'], 
    phone: "877-538-1920", 
    loginUrl: "https://login-business.libertymutual.com/", 
    email: "businessservice@libertymutual.com" 
  },
  { 
    name: "Safeco", 
    logo: "https://lh3.googleusercontent.com/d/1ovIXtgaXnlq6gkCupQRNO2Rft9ufUGr9",
    serviceLevel: "Full Service", 
    types: ['Personal'], 
    phone: "866-472-3326", 
    loginUrl: "https://customer.safeco.com/accountmanager/", 
    androidApp: "https://bit.ly/SafeCoMobile", 
    iosApp: "https://bit.ly/SafeCoMobile", 
    email: "documents@safeco.com" 
  },
  { 
    name: "State Auto", 
    logo: "https://lh3.googleusercontent.com/d/1Nf7t2DntOVVt_EPln0K4JC2YVrwR5u-Y",
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
    logo: "https://lh3.googleusercontent.com/d/1PBHx125Ip3jRlIVrkIYrW9ZzVzBVwYgi",
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
    logo: "https://lh3.googleusercontent.com/d/1Oag9bI3vntEnwxRo6Jk1KZHio_8vDYPb",
    serviceLevel: "Full Service", 
    types: ['Personal'], 
    phone: "800-543-2644", 
    loginUrl: "https://amsuite.amig.com/eidp/Authn/UserPassword", 
    email: "servicecenter@amig.com" 
  },
  { 
    name: "Hagerty", 
    logo: "https://lh3.googleusercontent.com/d/1NBnLhDE1qlMr3_pQaACgXJI_574-xiMH",
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
    logo: "https://lh3.googleusercontent.com/d/1NDpTCIlaBOdOkyPnmI7SVqNt6cDJ2axl",
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
    logo: "https://storage.googleapis.com/glide-prod.appspot.com/uploads-v2/afXkvWnriydq7v7818N6/pub/pfRH5aDG7B08YA3esyQh.png",
    serviceLevel: "Billing & Claim Service", 
    types: ['Commercial'], 
    phone: "855-275-9884", 
    loginUrl: "https://partner.pieinsurance.com/sign-in", 
    email: "agencyservice@pieinsurance.com" 
  },
  { 
    name: "CNA", 
    logo: "https://lh3.googleusercontent.com/d/1O8-oKUzAFH8Yni4gCrlyhCbCSJOC3bBS",
    serviceLevel: "Billing & Claim Service", 
    types: ['Commercial'], 
    phone: "800-262-2000", 
    loginUrl: "https://www.cnacentral.com/", 
    email: "cna_help@cna.com" 
  },
  { 
    name: "Lemonade", 
    logo: "https://lh3.googleusercontent.com/d/1tSWhtRVHFg9AI9PpuR_5dLmCVkupbhuZ",
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
    serviceLevel: "Full Service", 
    types: ['Personal'], 
    phone: "800-585-0705", 
    loginUrl: "https://my.hippo.com/login", 
    email: "support@hippo.com" 
  },
  { 
    name: "Branch", 
    logo: "https://storage.googleapis.com/glide-prod.appspot.com/uploads-v2/afXkvWnriydq7v7818N6/pub/ZkLfvF3lK9OPbmfLGIE7.png",
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
    logo: "https://lh3.googleusercontent.com/d/1zpIqcvn1eBdiJieLsIwnt3QhebwHQe1g",
    serviceLevel: "Full Service", 
    types: ['Personal'], 
    phone: "857-990-9080", 
    loginUrl: "https://bit.ly/3vzLWBR", 
    email: "service@openly.com" 
  },
  { name: "Attune", serviceLevel: "Partial Service", types: ['Commercial'], phone: "888-530-4650", loginUrl: "https://app.attuneinsurance.com/login", email: "help@attuneinsurance.com" },
  { name: "Berkshire Hathaway (biBERK)", serviceLevel: "Full Service", types: ['Commercial'], phone: "844-472-0967", loginUrl: "https://www.biberk.com/policyholders", email: "partneragentservice@biberk.com" },
  { 
    name: "Coterie", 
    logo: "https://lh3.googleusercontent.com/d/1Nrk3k0OiNoWoeEXzBgxjxcszcL5Ho3Zt",
    serviceLevel: "Full Service", 
    types: ['Commercial'], 
    phone: "855-566-1011", 
    loginUrl: "https://dashboard.coterieinsurance.com/login", 
    email: "support@coterieinsurance.com" 
  },
  { name: "Dairyland", serviceLevel: "Full Service", types: ['Personal'], phone: "800-334-0090", loginUrl: "https://bit.ly/3joUiqO", email: "help@dairylandinsurance.com" },
  { name: "Employers", serviceLevel: "Agency Serviced", types: ['Commercial'], phone: "888-682-6671", email: "customersupport@employers.com" },
  { name: "Encompass", serviceLevel: "Full Service", types: ['Personal'], phone: "800-897-9678", loginUrl: "https://bit.ly/RIMEncompass", email: "Service@encompassins.com" },
  { name: "Grange", serviceLevel: "Full Service", types: ['Personal', 'Commercial'], phone: "855-299-2040", loginUrl: "https://bit.ly/GrangeLogin", androidApp: "https://play.google.com/store/apps/details?id=com.GrangeInsurance.Mobileapp", iosApp: "https://apps.apple.com/us/app/grange-mobile/id1202329486", email: "mypolicy@grangeinsurance.com" },
  { name: "Guard", serviceLevel: "Full Service", types: ['Personal', 'Commercial'], phone: "800-969-5454", loginUrl: "https://bit.ly/3psJqfJ", email: "servicecenter@guard.com" },
  { 
    name: "Hiscox", 
    logo: "https://lh3.googleusercontent.com/d/1O2GT1E8zpGQj8584zk44D_an9xrT37xY",
    serviceLevel: "Full Service", 
    types: ['Commercial'], 
    phone: "866-283-7545", 
    loginUrl: "https://bit.ly/HiscoxOnline", 
    email: "agencyusa@hiscox.com" 
  },
  { name: "Kemper", serviceLevel: "Full Service", types: ['Personal'], phone: "800-327-1500", loginUrl: "https://bit.ly/3vD7zkH", email: "specialtyservice@kemper.com" },
  { name: "Markel", serviceLevel: "Full Service", types: ['Commercial'], phone: "888-500-3344", loginUrl: "https://account.markel.com/", email: "customerservice2@markel.com" },
  { name: "Mercury", serviceLevel: "Full Service", types: ['Personal'], phone: "866-539-2075", email: "service@mercuryinsurance.com" },
  { name: "MetLife", serviceLevel: "Full Service", types: ['Personal'], phone: "800-422-4272", loginUrl: "https://bit.ly/2Zd9Uap", email: "policyupdate@metlife.com" },
  { name: "National General", serviceLevel: "Full Service", types: ['Personal', 'Commercial'], phone: "877-468-3466", loginUrl: "https://bit.ly/3E3rhsY", email: "service@ngic.com" },
  { name: "Stillwater", serviceLevel: "Full Service", types: ['Personal', 'Commercial'], phone: "855-712-4092", loginUrl: "https://stillwaterinsurance.com/SalesPortal/login", email: "ins@stillwater.com" },
  { name: "The General", serviceLevel: "Full Service", types: ['Personal'], phone: "800-280-1466", loginUrl: "https://bit.ly/3niYzgK", email: "customersupport@thegeneral.com" },
  { 
    name: "Thimble", 
    logo: "https://lh3.googleusercontent.com/d/1O69jXSP5qENzJ3QUyKpj23_R1jgXZvhr",
    serviceLevel: "Full Service", 
    types: ['Commercial'], 
    phone: "855-940-4525", 
    loginUrl: "https://bit.ly/ThimbleOnline", 
    email: "broker@thimbel.com" 
  },
  { name: "Trexis", serviceLevel: "Partial Service", types: ['Personal'], phone: "877-384-7466", loginUrl: "https://trexis.com/", email: "customerservice@trexis.com" },
  { name: "USLI", serviceLevel: "Partial Service", types: ['Commercial'], phone: "800-523-5545", loginUrl: "https://bit.ly/3jrn9ep", email: "support@usli.com" }
];
