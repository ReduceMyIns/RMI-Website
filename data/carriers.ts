
export interface Carrier {
  slug: string;
  name: string;
  logo: string;
  phone: string;
  serviceLevel: string;
  loginUrl?: string;
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
    logo: "https://lh3.googleusercontent.com/d/1-w8RRkeqR4lNIssou_3_26GYEDryxbaJ",
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
    logo: "https://lh3.googleusercontent.com/d/1pFX8tKOrMDo7TvtICJZCd0w4H9FE0DJd",
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
    logo: "https://lh3.googleusercontent.com/d/108j3zJ9oJnyDjUmn367u6De_E_9-OV6E",
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
    logo: "https://lh3.googleusercontent.com/d/1-uyrdfvxZoxRE-OtyONaSulL7NjDqMAY",
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
    logo: "https://lh3.googleusercontent.com/d/1thzzv3tTGjA09YHOZCVBGoQ7hCCxPYob",
    phone: "877-538-1920",
    serviceLevel: "Full Service",
    loginUrl: "https://login-business.libertymutual.com/",
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
    logo: "https://lh3.googleusercontent.com/d/1O2GT1E8zpGQj8584zk44D_an9xrT37xY",
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
    logo: "https://lh3.googleusercontent.com/d/1ovIXtgaXnlq6gkCupQRNO2Rft9ufUGr9",
    phone: "866-472-3326",
    serviceLevel: "Full Service",
    loginUrl: "https://bit.ly/3niQ2dB",
    products: ["Personal Auto", "Homeowners", "Dwelling Fire", "Personal Umbrella", "Condo owners - Personal", "Motor Truck Cargo", "ATV / Side-By-Side", "Recreational Vehicles", "Renters (HO-4)", "Pet Insurance", "Home Warranty", "Classic Car", "Boat", "Watercraft (Small Boat)", "SR-22", "Non-Owners", "Motorcycle"],
    billingAddress: "P.O Box 91016, Chicago, IL 60680",
    email: "documents@safeco.com",
    apps: {
      android: "https://bit.ly/SafeCoMobile",
      ios: "https://bit.ly/SafeCoMobile"
    },
    description: "Safeco Insurance, a Liberty Mutual company, focuses on selling personal insurance through a network of independent agents. They offer a comprehensive mix of personal insurance products."
  },
  {
    slug: "state-auto",
    name: "State Auto",
    logo: "https://lh3.googleusercontent.com/d/1Nf7t2DntOVVt_EPln0K4JC2YVrwR5u-Y",
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
    logo: "https://lh3.googleusercontent.com/d/1NDpTCIlaBOdOkyPnmI7SVqNt6cDJ2axl",
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
    logo: "https://lh3.googleusercontent.com/d/1Nrk3k0OiNoWoeEXzBgxjxcszcL5Ho3Zt",
    phone: "855-566-1011",
    serviceLevel: "Full Service",
    loginUrl: "https://dashboard.coterieinsurance.com/login",
    products: ["General Liability", "Business Owners", "Miscellaneous Professional Liability", "Errors And Omissions"],
    email: "support@coterieinsurance.com",
    description: "Coterie Insurance simplifies small business insurance, delivering speed, simplicity, and service through technology. Partners include Spinnaker Insurance."
  },
  {
    slug: "cna",
    name: "CNA",
    logo: "https://lh3.googleusercontent.com/d/1O8-oKUzAFH8Yni4gCrlyhCbCSJOC3bBS",
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
    logo: "https://storage.googleapis.com/glide-prod.appspot.com/uploads-v2/afXkvWnriydq7v7818N6/pub/pfRH5aDG7B08YA3esyQh.png",
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
    logo: "https://lh3.googleusercontent.com/d/1O69jXSP5qENzJ3QUyKpj23_R1jgXZvhr",
    phone: "855-940-4525",
    serviceLevel: "Full Service",
    loginUrl: "https://bit.ly/ThimbleOnline",
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
    logo: "https://lh3.googleusercontent.com/d/1PBHx125Ip3jRlIVrkIYrW9ZzVzBVwYgi",
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
    logo: "https://lh3.googleusercontent.com/d/1Oag9bI3vntEnwxRo6Jk1KZHio_8vDYPb",
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
    logo: "https://lh3.googleusercontent.com/d/1NBnLhDE1qlMr3_pQaACgXJI_574-xiMH",
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
    logo: "https://lh3.googleusercontent.com/d/1tSWhtRVHFg9AI9PpuR_5dLmCVkupbhuZ",
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
    logo: "https://lh3.googleusercontent.com/d/1zpIqcvn1eBdiJieLsIwnt3QhebwHQe1g",
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
    logo: "https://storage.googleapis.com/glide-prod.appspot.com/uploads-v2/afXkvWnriydq7v7818N6/pub/ZkLfvF3lK9OPbmfLGIE7.png",
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
  }
];
