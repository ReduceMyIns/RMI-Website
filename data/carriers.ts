
export interface Carrier {
  slug: string;
  name: string;
  logo: string;
  phone: string;
  serviceLevel: string;
  loginUrl?: string;
  quoteUrl?: string;
  products?: string[];
  billingAddress?: string;
  email?: string;
  apps?: { android?: string; ios?: string };
  description?: string;
}

export const CARRIERS_DATA: Carrier[] = [
  {
    slug: "progressive",
    name: "Progressive",
    logo: "/Carrier Logos/Progressive Mobile.png",
    phone: "800-876-5581",
    serviceLevel: "Full Service",
    loginUrl: "https://account.apps.progressive.com/access/login",
    products: ["Transportation", "Trucking", "Towing", "Mobile Homeowners", "ATV / Side-By-Side", "Boat", "Business Owners", "Commercial Auto", "Classic Car", "Dwelling Fire", "Commercial Package", "Commercial Property", "Condo owners - Personal", "Earthquake", "Homeowners", "General Liability", "Motorcycle", "Non-Owners", "Motor Truck Cargo", "Personal Package", "Recreational Vehicles", "Watercraft (Small Boat)", "SR-22", "Personal Auto", "Renters (HO-4)", "Garage And Dealers", "Contractors Equipment", "Yacht", "Roadside Assistance", "Flood", "Modular Homes", "Snowmobile", "Directors and Officers Liability"],
    billingAddress: "P.O. Box 0561, Carol Stream, IL 60132",
    email: "customerservice@e.progressive.com",
    apps: {
      android: "https://goo.gl/XG9emn",
      ios: "https://goo.gl/XG9emn"
    },
    description: "Progressive Insurance is one of the largest auto insurers in the United States, providing a wide range of insurance products including auto, home, and commercial. Known for innovation and competitive rates."
  },
  {
    slug: "allstate",
    name: "Allstate",
    logo: "/Carrier Logos/allstate-mobile-logo.png",
    phone: "800-669-1552",
    serviceLevel: "Full Service",
    loginUrl: "https://myaccountrwd.allstate.com/anon/account/login",
    products: ["Personal Auto", "Dwelling Fire", "Commercial Auto", "Homeowners", "Business Owners", "Personal Umbrella", "Commercial Umbrella", "Vacant Dwelling", "Commercial Package", "Commercial Property", "Worker's Compensation", "General Liability", "Watercraft (Small Boat)", "Boat", "Commercial Inland Marine", "Personal Inland Marine", "Garage And Dealers", "Recreational Vehicles", "ATV / Side-By-Side", "Liquor Liability", "Classic Car", "Renters (HO-4)", "Motorcycle", "Earthquake", "Condo owners - Personal", "Contractors Equipment", "Mobile Homeowners"],
    billingAddress: "P.O. Box 660598, Dallas, TX 75266",
    email: "service@allstate.com",
    apps: {
      android: "https://bit.ly/AllstateAndroid",
      ios: "https://bit.ly/AllstateIphoneapp"
    },
    description: "Allstate Insurance Company is one of the largest insurance providers in the United States, offering a wide range of insurance products and financial services to its customers. Founded in 1931, Allstate has grown to become a well-known and respected name in the insurance industry."
  },
  {
    slug: "nationwide",
    name: "Nationwide",
    logo: "/Carrier Logos/Nationwide Mobile.jpg",
    phone: "800-282-1446",
    serviceLevel: "Full Service",
    loginUrl: "https://www.nationwide.com/personal/login",
    products: ["Personal Auto", "Commercial Auto", "Homeowners", "Dwelling Fire", "Renters (HO-4)", "Boat", "Motorcycle"],
    billingAddress: "P.O. Box 742522, Cincinnati, OH 45274",
    email: "plpc@nationwide.com",
    apps: {
      android: "http://bit.ly/2FLDN6v",
      ios: "http://bit.ly/2FLDN6v"
    },
    description: "Nationwide is a Fortune 100 company that offers a full range of insurance and financial services across the country. They provide peace of mind and protection for what matters most."
  },
  {
    slug: "travelers",
    name: "Travelers",
    logo: "/Carrier Logos/Travelers Mobile.jpg",
    phone: "877-872-8737",
    serviceLevel: "Full Service",
    loginUrl: "https://www.travelers.com/login/#/",
    products: ["Homeowners", "Personal Auto", "Dwelling Fire", "Boat", "Watercraft (Small Boat)", "Personal Umbrella", "Renters (HO-4)", "Personal Inland Marine"],
    billingAddress: "P. O. Box 660307, Dallas, TX 75266-0307",
    email: "plserv@travelers.com",
    apps: {
      android: "https://bit.ly/TravelersDroid",
      ios: "https://bit.ly/TravelersiOS"
    },
    description: "Travelers is a leading provider of property casualty insurance for auto, home and business. The company is known for its comprehensive coverage options and efficient claim services."
  },
  {
    slug: "liberty-mutual",
    name: "Liberty Mutual",
    logo: "/Carrier Logos/Liberty Mutual.jpg",
    phone: "877-538-1920",
    serviceLevel: "Full Service",
    loginUrl: "https://www.mybusinessonline.libertymutual.com/",
    products: ["Worker's Compensation", "General Liability", "Business Owners", "Commercial Auto", "Commercial Inland Marine", "Commercial Package", "Commercial Property", "Commercial Umbrella"],
    billingAddress: "P.O Box 2839, New York, NY 10116-2839",
    email: "businessservice@libertymutual.com",
    description: "Liberty Mutual Insurance helps people preserve and protect what they earn, build, own and cherish. Keeping this promise means we are there when our customers need us most."
  },
  {
    slug: "chubb",
    name: "Chubb",
    logo: "https://storage.googleapis.com/glide-prod.appspot.com/uploads-v2/afXkvWnriydq7v7818N6/pub/Aimjq0w6T4SQR1QUIIEV.jpg",
    phone: "833-550-9660",
    serviceLevel: "Full Service",
    loginUrl: "https://www.chubb.com/us-en/log-in.html",
    products: ["Builders Risk", "Homeowners", "Commercial Package", "High Net Worth"],
    email: "smallbizbilling@chubb.com",
    description: "Chubb is the world's largest publicly traded property and casualty insurance company. Known for its extensive product and service offerings, broad distribution capabilities, and exceptional financial strength."
  },
  {
    slug: "hiscox",
    name: "Hiscox",
    logo: "/Carrier Logos/Hiscox.png",
    phone: "866-283-7545",
    serviceLevel: "Full Service",
    loginUrl: "https://bit.ly/HiscoxOnline",
    products: ["General Liability", "Business Owners", "Miscellaneous Professional Liability", "Errors And Omissions"],
    email: "agencyusa@hiscox.com",
    description: "Hiscox specializes in flexible business insurance for small businesses, tailored to specific risks. They are experts in niche markets and provide customized coverage."
  },
  {
    slug: "safeco",
    name: "SafeCo",
    logo: "/Carrier Logos/SafeCo Mobile.jpg",
    phone: "866-472-3326",
    serviceLevel: "Full Service",
    loginUrl: "https://customer.safeco.com/accountmanager/homepage",
    products: ["Personal Auto", "Homeowners", "Dwelling Fire", "Personal Umbrella", "Condo owners - Personal", "Motor Truck Cargo", "ATV / Side-By-Side", "Recreational Vehicles", "Renters (HO-4)", "Pet Insurance", "Home Warranty", "Classic Car", "Boat", "Watercraft (Small Boat)", "SR-22", "Non-Owners", "Motorcycle"],
    billingAddress: "P.O Box 91016, Chicago, IL 60680",
    email: "documents@safeco.com",
    apps: {
      android: "https://www.safeco.com/customer-resources/mobile-voice-apps/safeco-mobile-app",
      ios: "https://www.safeco.com/customer-resources/mobile-voice-apps/safeco-mobile-app"
    },
    description: "Safeco Insurance, a Liberty Mutual company, focuses on selling personal insurance through a network of independent agents. They offer a comprehensive mix of personal insurance products."
  },
  {
    slug: "state-auto",
    name: "State Auto",
    logo: "/Carrier Logos/State Auto Mobile.png",
    phone: "800-288-4425",
    serviceLevel: "Billing & Claim Service",
    loginUrl: "https://empidn.stateauto.com/WebIdPForms/Login/Portal",
    products: ["Personal Auto", "Commercial Auto", "Homeowners", "Dwelling Fire", "Renters (HO-4)", "Condo owners - Personal", "Business Owners", "Commercial Inland Marine", "Commercial Package", "Commercial Property", "Commercial Umbrella", "Worker's Compensation", "ATV / Side-By-Side", "Directors and Officers Liability", "Cyber Liability", "Watercraft (Small Boat)"],
    billingAddress: "P.O Box 776721, Chicago, IL 60677",
    email: "customerservice@stateauto.com",
    apps: {
      android: "https://play.google.com/store/apps/details?id=com.stateauto.mobile.insured&hl=en_US&gl=US",
      ios: "https://apps.apple.com/us/app/state-auto/id1567426169"
    },
    description: "State Auto Insurance has been in business for over 100 years. The company offers a variety of insurance types, including auto, home, business, farm and ranch insurance in 33 states."
  },
  {
    slug: "next-insurance",
    name: "Next Insurance",
    logo: "/Carrier Logos/Next Insurance.png",
    phone: "855-222-5919",
    serviceLevel: "Full Service",
    loginUrl: "https://bit.ly/NEXTportal",
    products: ["Worker's Compensation", "Business Owners", "General Liability", "Garage And Dealers", "Commercial Auto", "Miscellaneous Professional Liability", "Contractors Equipment", "Commercial Property", "Errors And Omissions"],
    billingAddress: "P.O. Box 60787, Palo Alto, CA 94306",
    email: "support@nextinsurance.com",
    apps: {
        android: "https://play.google.com/store/apps/details?id=com.nextinsurance",
        ios: "https://apps.apple.com/us/app/next-insurance/id1580721755"
    },
    description: "NEXT Insurance is 100% dedicated to small business. They offer tailored, easy-to-understand coverage that's affordable and completely online. We've made getting insurance as easy as pie."
  },
  {
    slug: "coterie",
    name: "Coterie",
    logo: "/Carrier Logos/Coterie Transparent.png",
    phone: "855-566-1011",
    serviceLevel: "Full Service",
    loginUrl: "https://dashboard.coterieinsurance.com/login",
    quoteUrl: "https://quote.coterieinsurance.com/agency/7cb52e32-a1a3-44c0-bd7b-0a68b967bd70/98bde2a0-dce9-4f4a-8491-3d152b3238c2",
    products: ["General Liability", "Business Owners", "Miscellaneous Professional Liability", "Errors And Omissions"],
    email: "support@coterieinsurance.com",
    description: "Coterie Insurance simplifies small business insurance, delivering speed, simplicity, and service through technology. Partners include Spinnaker Insurance."
  },
  {
    slug: "cna",
    name: "CNA",
    logo: "/Carrier Logos/CNA.jpg",
    phone: "800-262-2000",
    serviceLevel: "Billing & Claim Service",
    loginUrl: "https://bit.ly/CNALogin",
    products: ["Business Owners", "Worker's Compensation", "Commercial Auto", "Errors And Omissions"],
    billingAddress: "PO Box 74007619, Chicago, IL 60674-7619",
    email: "cna_help@cna.com",
    description: "CNA is one of the largest U.S. commercial property and casualty insurance companies, providing broad coverage for businesses and professionals."
  },
  {
    slug: "pie-insurance",
    name: "Pie Insurance",
    logo: "/Carrier Logos/Pie.png",
    phone: "855-275-9884",
    serviceLevel: "Billing & Claim Service",
    loginUrl: "https://partner.pieinsurance.com/sign-in",
    products: ["Worker's Compensation", "Commercial Auto"],
    email: "agencyservice@pieinsurance.com",
    description: "Pie Insurance provides workers compensation insurance directly to small businesses. We’ve designed everything from quote to claim with small business owners in mind."
  },
  {
    slug: "thimble",
    name: "Thimble",
    logo: "/Carrier Logos/Thimble Agent.jpg",
    phone: "855-940-4525",
    serviceLevel: "Full Service",
    loginUrl: "https://bit.ly/ThimbleOnline",
    quoteUrl: "https://link.thimble.com/broker/FKLZKGK9F",
    products: ["Worker's Compensation", "Business Owners", "Miscellaneous Professional Liability", "Errors And Omissions", "General Liability", "Short Term General Liability", "Special Event policies", "Special Events", "Commercial Inland Marine"],
    email: "broker@thimbel.com",
    apps: {
        android: "https://bit.ly/ThimbleDroid",
        ios: "https://bit.ly/ThimbleiPhone"
    },
    description: "Thimble offers flexible, short-term insurance for small businesses and freelancers, by the hour, day, or month. Perfect for gig economy workers and contractors."
  },
  {
    slug: "foremost",
    name: "Foremost",
    logo: "/Carrier Logos/Foremost Agent.jpg",
    phone: "800-527-3905",
    serviceLevel: "Full Service",
    loginUrl: "https://bit.ly/ForemostLogin",
    products: ["Homeowners", "Mobile Homeowners", "Recreational Vehicles", "Dwelling Fire", "Watercraft (Small Boat)", "Motorcycle", "ATV / Side-By-Side", "Boat", "Classic Car", "Vacant Dwelling", "Mobile Device", "SR-22", "Non-Owners"],
    billingAddress: "P.O. Box 0915, Carol Stream, IL 60132-0915",
    email: "imaging@foremost.com",
    apps: {
      android: "https://bit.ly/ForemostDroid",
      ios: "https://bit.ly/ForemostiOS"
    },
    description: "As a specialty insurance company, Foremost provides insurance choices that may not be offered by other companies. We've spent the last 65 years getting to know the markets we serve exceptionally well."
  },
  {
    slug: "american-modern",
    name: "American Modern",
    logo: "/Carrier Logos/American Modern Agent.png",
    phone: "800-543-2644",
    serviceLevel: "Full Service",
    loginUrl: "https://bit.ly/AMIGLogin",
    products: ["Mobile Homeowners", "Classic Car", "Dwelling Fire", "Vacant Dwelling", "Boat", "Watercraft (Small Boat)", "Condo owners - Personal", "Vacation Rentals", "Modular Homes", "Homeowners", "Motorcycle", "ATV / Side-By-Side", "Pet Insurance", "Golf Cart", "Snowmobile", "Yacht"],
    billingAddress: "PO Box 740167, Cincinnati OH 45274-0167",
    email: "servicecenter@amig.com",
    description: "American Modern Insurance Company is a specialty insurance provider offering products for owners of specialty or unique types of properties and assets like collector cars and manufactured homes."
  },
  {
    slug: "hagerty",
    name: "Hagerty",
    logo: "/Carrier Logos/Hagerty.jpg",
    phone: "877-922-9701",
    serviceLevel: "Full Service",
    loginUrl: "https://bit.ly/HagertyLogin",
    products: ["Classic Car"],
    email: "auto@hagerty.com",
    description: "Hagerty is the world's leading insurance provider for collector vehicles and an automotive lifestyle brand. They are passionate about cars and preserving the hobby."
  },
  {
    slug: "lemonade",
    name: "Lemonade",
    logo: "/Carrier Logos/Lemonade Agent.png",
    phone: "844-733-8666",
    serviceLevel: "Full Service",
    loginUrl: "https://bit.ly/LemonadeOnline",
    products: ["Renters (HO-4)", "Homeowners", "Pet Insurance", "Term Life", "Car"],
    email: "help@lemonade.com",
    apps: {
        android: "https://bit.ly/LemonadeDroid",
        ios: "https://bit.ly/lemonadeiphone"
    },
    description: "Lemonade offers a tech-forward approach to insurance, powered by AI and behavioral economics, with a focus on social impact and instant everything."
  },
  {
    slug: "openly",
    name: "Openly",
    logo: "/Carrier Logos/Openly transparent logo.png",
    phone: "857-990-9080",
    serviceLevel: "Full Service",
    loginUrl: "https://bit.ly/3vzLWBR",
    products: ["Homeowners", "Dwelling Fire", "FarmOwner", "Vacation Rentals", "Builders Risk", "Installation/builders risk"],
    billingAddress: "Dept. CH 17209, Palatine, IL 60055",
    email: "service@openly.com",
    description: "Openly provides premium homeowners insurance through independent agents. They offer broad coverage, competitive pricing, and a seamless claims process."
  },
  {
    slug: "branch",
    name: "Branch",
    logo: "/Carrier Logos/Branch.png",
    phone: "855-438-5411",
    serviceLevel: "Full Service",
    loginUrl: "https://account.ourbranch.com/",
    products: ["Homeowners", "Personal Auto"],
    billingAddress: "PO Box 15010, Worcester, MA 01615",
    email: "support@ourbranch.com",
    apps: {
        android: "https://play.google.com/store/apps/details?id=com.branch.accountmobile&hl=en_US&gl=US",
        ios: "https://apps.apple.com/us/app/branch-insurance/id1437502167"
    },
    description: "Branch Insurance utilizes data and technology to make insurance easier to buy and more affordable for everyone, restoring insurance to its original intent: a force for communal good."
  },
  {
    slug: "hippo",
    name: "Hippo",
    logo: "/Carrier Logos/Hippo Agent.jpg",
    phone: "800-585-0705",
    serviceLevel: "Full Service",
    loginUrl: "https://my.hippo.com/login",
    products: ["Homeowners", "Condo owners - Personal"],
    email: "support@hippo.com",
    description: "Hippo is a modern home insurance company that uses technology to provide smarter coverage and proactive home maintenance tools."
  },
  {
    slug: "attune",
    name: "Attune",
    logo: "/Carrier Logos/Attune Logo.png",
    phone: "888-530-4650",
    serviceLevel: "Partial Service",
    loginUrl: "https://app.attuneinsurance.com/login",
    products: ["Business Owners", "General Liability", "Professional Liability"],
    email: "help@attuneinsurance.com",
    description: "Attune uses data and technology to provide small business insurance quickly and efficiently."
  },
  {
    slug: "biberk",
    name: "Berkshire Hathaway (biBERK)",
    logo: "/Carrier Logos/biBERKtile.jpg",
    phone: "844-472-0967",
    serviceLevel: "Full Service",
    loginUrl: "https://www.biberk.com/policyholders",
    products: ["Worker's Compensation", "General Liability", "Business Owners", "Commercial Auto"],
    email: "partneragentservice@biberk.com",
    description: "biBERK, part of the Berkshire Hathaway group, provides simple and affordable insurance directly to small businesses."
  },
  {
    slug: "dairyland",
    name: "Dairyland",
    logo: "/Carrier Logos/Dairyland Logo.png",
    phone: "800-334-0090",
    serviceLevel: "Full Service",
    loginUrl: "https://bit.ly/3joUiqO",
    products: ["Personal Auto", "Motorcycle", "SR-22", "Non-Owners"],
    email: "help@dairylandinsurance.com",
    description: "Dairyland provides affordable auto and motorcycle insurance, specializing in non-standard risks and SR-22 filings."
  },
  {
    slug: "employers",
    name: "Employers",
    logo: "/Carrier Logos/Employers.png",
    phone: "888-682-6671",
    serviceLevel: "Agency Serviced",
    products: ["Worker's Compensation"],
    email: "customersupport@employers.com",
    description: "Employers specializes in workers' compensation insurance for small businesses, with a focus on safety and cost-effective coverage."
  },
  {
    slug: "encompass",
    name: "Encompass",
    logo: "/Carrier Logos/Encompass.png",
    phone: "800-897-9678",
    serviceLevel: "Full Service",
    loginUrl: "https://bit.ly/RIMEncompass",
    products: ["Homeowners", "Personal Auto", "Personal Umbrella"],
    email: "Service@encompassins.com",
    description: "Encompass Insurance, an Allstate company, provides high-quality personal insurance products through independent agents."
  },
  {
    slug: "grange",
    name: "Grange",
    logo: "/Carrier Logos/Grange Agent.jpg",
    phone: "855-299-2040",
    serviceLevel: "Full Service",
    loginUrl: "https://bit.ly/GrangeLogin",
    products: ["Homeowners", "Personal Auto", "Business Owners", "Commercial Auto"],
    email: "mypolicy@grangeinsurance.com",
    description: "Grange Insurance provides a wide range of personal and commercial insurance products through independent agents in the Midwest and Southeast."
  },
  {
    slug: "guard",
    name: "Guard",
    logo: "/Carrier Logos/GUARD Agent.png",
    phone: "800-969-5454",
    serviceLevel: "Full Service",
    loginUrl: "https://bit.ly/3psJqfJ",
    products: ["Business Owners", "Worker's Compensation", "Commercial Auto", "Personal Auto", "Homeowners"],
    email: "servicecenter@guard.com",
    description: "Berkshire Hathaway GUARD Insurance Companies provide a variety of insurance products for small to medium-sized businesses and individuals."
  },
  {
    slug: "kemper",
    name: "Kemper",
    logo: "/Carrier Logos/Kemper mobile logo.png",
    phone: "800-327-1500",
    serviceLevel: "Full Service",
    loginUrl: "https://bit.ly/3vD7zkH",
    products: ["Personal Auto", "Homeowners", "Life Insurance"],
    email: "specialtyservice@kemper.com",
    description: "Kemper provides a range of insurance products, including auto, home, and life, with a focus on the non-standard auto market."
  },
  {
    slug: "markel",
    name: "Markel",
    logo: "/Carrier Logos/Markel Firstcomp Agent.jpg",
    phone: "888-500-3344",
    serviceLevel: "Full Service",
    loginUrl: "https://account.markel.com/",
    products: ["General Liability", "Worker's Compensation", "Professional Liability", "Specialty Programs"],
    email: "customerservice2@markel.com",
    description: "Markel is a diverse financial holding company that provides specialty insurance products and programs for niche markets."
  },
  {
    slug: "mercury",
    name: "Mercury",
    logo: "/Carrier Logos/Mercury.png",
    phone: "866-539-2075",
    serviceLevel: "Full Service",
    products: ["Personal Auto", "Homeowners", "Business Owners"],
    email: "service@mercuryinsurance.com",
    description: "Mercury Insurance provides affordable auto, home, and business insurance through a network of independent agents."
  },
  {
    slug: "metlife",
    name: "MetLife",
    logo: "/Carrier Logos/Metlife Logo.jfif",
    phone: "800-422-4272",
    serviceLevel: "Full Service",
    loginUrl: "https://bit.ly/2Zd9Uap",
    products: ["Auto", "Home", "Life", "Dental", "Vision"],
    email: "policyupdate@metlife.com",
    description: "MetLife is a global provider of insurance, annuities, and employee benefit programs, serving millions of customers worldwide."
  },
  {
    slug: "national-general",
    name: "National General",
    logo: "/Carrier Logos/National General.jpg",
    phone: "877-468-3466",
    serviceLevel: "Full Service",
    loginUrl: "https://bit.ly/3E3rhsY",
    products: ["Personal Auto", "Commercial Auto", "Homeowners", "Health Insurance"],
    email: "service@ngic.com",
    description: "National General Insurance, an Allstate company, provides a variety of insurance products, specializing in non-standard auto and health insurance."
  },
  {
    slug: "stillwater",
    name: "Stillwater",
    logo: "/Carrier Logos/Stillwater.png",
    phone: "855-712-4092",
    serviceLevel: "Full Service",
    loginUrl: "https://stillwaterinsurance.com/SalesPortal/login",
    products: ["Homeowners", "Personal Auto", "Business Owners", "Commercial Auto"],
    email: "ins@stillwater.com",
    description: "Stillwater Insurance provides a suite of personal and commercial insurance products, with a focus on ease of use and competitive pricing."
  },
  {
    slug: "the-general",
    name: "The General",
    logo: "/Carrier Logos/The General Mobile.png",
    phone: "800-280-1466",
    serviceLevel: "Full Service",
    loginUrl: "https://bit.ly/3niYzgK",
    products: ["Personal Auto", "SR-22"],
    email: "customersupport@thegeneral.com",
    description: "The General specializes in providing affordable auto insurance to drivers who may have difficulty obtaining coverage elsewhere."
  },
  {
    slug: "trexis",
    name: "Trexis",
    logo: "/Carrier Logos/Trexis Mobile.png",
    phone: "877-384-7466",
    serviceLevel: "Partial Service",
    loginUrl: "https://trexis.com/",
    products: ["Personal Auto"],
    email: "customerservice@trexis.com",
    description: "Trexis provides affordable auto insurance products through independent agents, with a focus on the non-standard market."
  },
  {
    slug: "the-hartford",
    name: "The Hartford",
    logo: "/Carrier Logos/The Hartford.png",
    phone: "800-624-5578",
    serviceLevel: "Full Service",
    loginUrl: "https://www.thehartford.com/login",
    products: ["Business Owners", "Worker's Compensation", "General Liability", "Commercial Auto", "Homeowners", "Personal Auto"],
    description: "The Hartford is a leader in property and casualty insurance, group benefits and mutual funds. With more than 200 years of expertise, The Hartford is widely recognized for its service excellence, sustainability practices, trust and integrity."
  },
  {
    slug: "geico",
    name: "Geico",
    logo: "/Carrier Logos/geico-logo.png",
    phone: "800-207-7847",
    serviceLevel: "Full Service",
    loginUrl: "https://www.geico.com/login/",
    products: ["Personal Auto", "Motorcycle", "Boat", "Recreational Vehicles"],
    description: "GEICO (Government Employees Insurance Company) is a private American auto insurance company. It is the second largest auto insurer in the United States, after State Farm."
  },
  {
    slug: "usli",
    name: "USLI",
    logo: "/Carrier Logos/USLI Agent.png",
    phone: "800-523-5545",
    serviceLevel: "Partial Service",
    loginUrl: "https://bit.ly/3jrn9ep",
    products: ["General Liability", "Professional Liability", "Business Owners", "Special Events"],
    email: "support@usli.com",
    description: "USLI specializes in providing insurance for small businesses, non-profits, and professionals through a wide range of specialty programs."
  },
  {
    slug: "insure-tax",
    name: "Insure Tax",
    logo: "https://ui-avatars.com/api/?name=Insure+Tax&background=0D8ABC&color=fff",
    phone: "615-900-0288",
    serviceLevel: "Full Service",
    loginUrl: "https://partner.insuretax.com/auth/login-taxpayer",
    products: ["Tax Preparation", "Bookkeeping", "Strategic Planning"],
    email: "service@ReduceMyInsurance.Net",
    description: "Insure Tax provides comprehensive tax planning and preparation services integrated with your insurance strategy."
  }
];
