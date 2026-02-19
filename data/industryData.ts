
import { 
  Car, Scissors, Sparkles, Briefcase, Hammer, Palette, Calculator, Coffee, ShoppingBag, 
  Dumbbell, Home, Music, HardHat, Camera, PenTool, Truck, Stethoscope, Utensils, 
  Monitor, Plane, Dog, Zap, Trophy, ScrollText, FileSignature, Scale, Flame, Waves, 
  Shield, Anchor, Bike, Tent, Wrench, HeartPulse, Building, Wind, Zap as SegwayIcon,
  ShoppingBasket, Laptop, GraduationCap, Gavel, Microscope, Warehouse, Radio,
  Truck as FreightIcon, Heart, LifeBuoy, Flower2, Thermometer, Construction, 
  Baby, WashingMachine, Brush, Crosshair, Hotel, UtensilsCrossed, Gem, Store,
  TreePine, Droplets, Trash2, Speaker, CarFront, Key, HardDrive, Package, Mail,
  Glasses, PawPrint, Beer, Pizza, Utensils as ForkIcon, UserCheck, HardHat as SafetyIcon,
  Fence, Paintbrush, Hammer as HammerIcon, Pickaxe, BookOpen, Smartphone, Video
} from 'lucide-react';

export type LineOfBusiness = 'GL' | 'PL' | 'WC' | 'BOP' | 'Auto' | 'Bond' | 'Property' | 'Equipment' | 'Cyber' | 'Excess' | 'Accident' | 'Liquor' | 'Watercraft' | 'Motorcycle' | 'Inland Marine';

export interface CarrierOffer {
  name: string;
  url: string;
  color: string;
  logoText: string;
  lines: LineOfBusiness[];
}

const NOWCERTS_AGENCY_ID = "7b9d101f-6a6c-40a6-b256-bfd8a901c277";

const CARRIERS = {
  NEXT: {
    name: 'Next Insurance',
    url: 'https://track.nextinsurance.com/links?agent_affiliation=QKdZVLARWgQwb081&serial=992855993&channel=affiliation',
    color: 'bg-blue-600 hover:bg-blue-500',
    logoText: 'NEXT'
  },
  COTERIE: {
    name: 'Coterie',
    url: 'https://app.coterieinsurance.com/quote?p=service%40reducemyinsurance.net',
    color: 'bg-indigo-600 hover:bg-indigo-500',
    logoText: 'Coterie'
  },
  THIMBLE: {
    name: 'Thimble',
    url: 'https://link.thimble.com/broker/FKLZKGK9F',
    color: 'bg-emerald-500 hover:bg-emerald-400',
    logoText: 'Thimble'
  },
  FOXQUILT: {
    name: 'Foxquilt',
    url: 'https://join.foxquilt.com/2022-06-30/?brokerCode=FQAGT&agencyBrokerId=63642ccfff2322532cf71f8f&agencyId=63642bf77e21cdaacb338211&partnercode=reducemyins',
    color: 'bg-cyan-600 hover:bg-cyan-500',
    logoText: 'Foxquilt'
  }
};

export interface IndustryProfile {
  slug: string;
  name: string;
  category: string;
  icon: any;
  shortDesc: string;
  longDesc: string;
  coverages: string[];
  keywords: string[];
  riskFactors: string[];
  carriers: CarrierOffer[];
  nowCertsUrl?: string;
}

const URLS = {
  COMMERCIAL: `https://www1.nowcerts.com/Pages/QuoteRequests/CommercialPackage.aspx?AgencyId=${NOWCERTS_AGENCY_ID}`,
  WORK_COMP: `https://www1.nowcerts.com/Pages/QuoteRequests/WorkersCompensation.aspx?AgencyId=${NOWCERTS_AGENCY_ID}`,
  WATERCRAFT: `https://www1.nowcerts.com/Pages/QuoteRequests/WaterCraft.aspx?AgencyId=${NOWCERTS_AGENCY_ID}`,
  MOTORCYCLE: `https://www1.nowcerts.com/Pages/QuoteRequests/Motorcycle.aspx?AgencyId=${NOWCERTS_AGENCY_ID}`,
  TOOLS: `https://www1.nowcerts.com/Pages/QuoteRequests/Tools.aspx?AgencyId=${NOWCERTS_AGENCY_ID}`
};

export const INDUSTRIES: IndustryProfile[] = [
  // ==========================================================================================
  // CONSTRUCTION & TRADES
  // ==========================================================================================
  {
    slug: 'handyman',
    name: 'Handyman',
    category: 'Construction',
    icon: HammerIcon,
    shortDesc: "Small repairs, maintenance, and installation.",
    longDesc: "Broad coverage for jack-of-all-trades doing residential and light commercial work.",
    coverages: ["GL", "Inland Marine", "Workers Comp", "Surety Bond"],
    keywords: ["handyperson", "repair", "maintenance", "fixer"],
    riskFactors: ["Property damage", "Third-party injury", "Tool theft"],
    carriers: [
      { ...CARRIERS.NEXT, lines: ['GL', 'WC', 'Inland Marine', 'Auto'] },
      { ...CARRIERS.THIMBLE, lines: ['GL', 'Inland Marine'] },
      { ...CARRIERS.FOXQUILT, lines: ['GL', 'PL', 'Cyber'] },
      { ...CARRIERS.COTERIE, lines: ['BOP', 'GL'] }
    ],
    nowCertsUrl: URLS.COMMERCIAL
  },
  {
    slug: 'general-contractor',
    name: 'General Contractor',
    category: 'Construction',
    icon: HardHat,
    shortDesc: "Project management and sub-contracting.",
    longDesc: "Coverage for GCs managing construction projects, including insured sub-contractors.",
    coverages: ["GL", "Workers Comp", "Excess Liability", "Surety Bond"],
    keywords: ["gc", "builder", "developer", "remodeler"],
    riskFactors: ["Subcontractor default", "Site injury", "Completed operations"],
    carriers: [
      { ...CARRIERS.NEXT, lines: ['GL', 'WC', 'Auto'] },
      { ...CARRIERS.THIMBLE, lines: ['GL', 'Inland Marine'] },
      { ...CARRIERS.FOXQUILT, lines: ['GL', 'Excess'] }
    ],
    nowCertsUrl: URLS.COMMERCIAL
  },
  {
    slug: 'electrician',
    name: 'Electrician',
    category: 'Construction',
    icon: Zap,
    shortDesc: "Wiring, lighting, and electrical install.",
    longDesc: "Specialized liability for electrical contractors including fire risk coverage.",
    coverages: ["GL", "Workers Comp", "Inland Marine", "Surety Bond"],
    keywords: ["electrical", "wiring", "lighting"],
    riskFactors: ["Fire hazard", "Electrocution", "Code compliance"],
    carriers: [
      { ...CARRIERS.NEXT, lines: ['GL', 'WC', 'Auto'] },
      { ...CARRIERS.COTERIE, lines: ['BOP', 'GL'] },
      { ...CARRIERS.FOXQUILT, lines: ['GL'] },
      { ...CARRIERS.THIMBLE, lines: ['GL', 'Inland Marine'] }
    ],
    nowCertsUrl: URLS.COMMERCIAL
  },
  {
    slug: 'plumbing',
    name: 'Plumbing',
    category: 'Construction',
    icon: Wrench,
    shortDesc: "Pipe installation, septic, and repair.",
    longDesc: "Coverage for water damage liability and system installation.",
    coverages: ["GL", "Workers Comp", "Inland Marine", "Surety Bond"],
    keywords: ["plumber", "pipe", "septic", "water"],
    riskFactors: ["Water damage", "Mold", "Leak liability"],
    carriers: [
      { ...CARRIERS.NEXT, lines: ['GL', 'WC', 'Auto'] },
      { ...CARRIERS.COTERIE, lines: ['BOP', 'GL'] },
      { ...CARRIERS.FOXQUILT, lines: ['GL'] },
      { ...CARRIERS.THIMBLE, lines: ['GL', 'Inland Marine'] }
    ],
    nowCertsUrl: URLS.COMMERCIAL
  },
  {
    slug: 'hvac',
    name: 'HVAC Contractor',
    category: 'Construction',
    icon: Thermometer,
    shortDesc: "Heating, cooling, and ventilation.",
    longDesc: "Liability for mechanical failure, installation, and repair.",
    coverages: ["GL", "Workers Comp", "Inland Marine", "Surety Bond"],
    keywords: ["ac", "heating", "cooling", "ventilation"],
    riskFactors: ["Fire risk", "Water damage", "System failure"],
    carriers: [
      { ...CARRIERS.NEXT, lines: ['GL', 'WC', 'Auto'] },
      { ...CARRIERS.COTERIE, lines: ['BOP', 'GL'] },
      { ...CARRIERS.FOXQUILT, lines: ['GL'] },
      { ...CARRIERS.THIMBLE, lines: ['GL', 'Inland Marine'] }
    ],
    nowCertsUrl: URLS.COMMERCIAL
  },
  {
    slug: 'carpentry',
    name: 'Carpentry',
    category: 'Construction',
    icon: HammerIcon,
    shortDesc: "Framing, cabinetry, and finish work.",
    longDesc: "Woodworking liability for interior and exterior projects.",
    coverages: ["GL", "Workers Comp", "Inland Marine", "Surety Bond"],
    keywords: ["wood", "framing", "cabinet", "deck"],
    riskFactors: ["Saw injuries", "Structural issues", "Fire"],
    carriers: [
      { ...CARRIERS.NEXT, lines: ['GL', 'WC'] },
      { ...CARRIERS.COTERIE, lines: ['BOP', 'GL'] },
      { ...CARRIERS.FOXQUILT, lines: ['GL'] },
      { ...CARRIERS.THIMBLE, lines: ['GL', 'Inland Marine'] }
    ],
    nowCertsUrl: URLS.COMMERCIAL
  },
  {
    slug: 'landscaping',
    name: 'Landscaping',
    category: 'Construction',
    icon: TreePine,
    shortDesc: "Lawn care, tree trimming, and design.",
    longDesc: "Coverage for exterior maintenance, mowing, and planting.",
    coverages: ["GL", "Workers Comp", "Commercial Auto", "Inland Marine"],
    keywords: ["lawn", "garden", "tree", "mowing"],
    riskFactors: ["Property damage", "Utility strike", "Chemical use"],
    carriers: [
      { ...CARRIERS.NEXT, lines: ['GL', 'WC', 'Auto'] },
      { ...CARRIERS.COTERIE, lines: ['BOP', 'GL'] },
      { ...CARRIERS.FOXQUILT, lines: ['GL'] },
      { ...CARRIERS.THIMBLE, lines: ['GL', 'Inland Marine'] }
    ],
    nowCertsUrl: URLS.COMMERCIAL
  },
  {
    slug: 'painting',
    name: 'Painting',
    category: 'Construction',
    icon: Paintbrush,
    shortDesc: "Interior and exterior painting.",
    longDesc: "Liability for paint spills, ladder work, and property protection.",
    coverages: ["GL", "Workers Comp", "Surety Bond"],
    keywords: ["painter", "interior", "exterior", "wall"],
    riskFactors: ["Spills", "Fumes", "Fall from height"],
    carriers: [
      { ...CARRIERS.NEXT, lines: ['GL', 'WC'] },
      { ...CARRIERS.COTERIE, lines: ['BOP', 'GL'] },
      { ...CARRIERS.FOXQUILT, lines: ['GL'] },
      { ...CARRIERS.THIMBLE, lines: ['GL', 'Inland Marine'] }
    ],
    nowCertsUrl: URLS.COMMERCIAL
  },
  {
    slug: 'cleaning',
    name: 'Cleaning & Janitorial',
    category: 'Services',
    icon: WashingMachine,
    shortDesc: "Residential and commercial cleaning.",
    longDesc: "Coverage for janitors, maids, and carpet cleaners including bonds.",
    coverages: ["GL", "Janitorial Bond", "Workers Comp", "Lost Key Coverage"],
    keywords: ["maid", "janitor", "carpet", "window"],
    riskFactors: ["Slip and fall", "Theft allegation", "Chemical damage"],
    carriers: [
      { ...CARRIERS.NEXT, lines: ['GL', 'WC'] },
      { ...CARRIERS.COTERIE, lines: ['BOP', 'GL'] },
      { ...CARRIERS.FOXQUILT, lines: ['GL'] },
      { ...CARRIERS.THIMBLE, lines: ['GL'] }
    ],
    nowCertsUrl: URLS.COMMERCIAL
  },
  {
    slug: 'roofing',
    name: 'Roofing',
    category: 'Construction',
    icon: Home,
    shortDesc: "Residential roofing installation/repair.",
    longDesc: "High-risk coverage specifically for roofers.",
    coverages: ["GL", "Workers Comp", "Surety Bond"],
    keywords: ["roof", "shingle", "gutter"],
    riskFactors: ["Fall from height", "Water intrusion", "Fire"],
    carriers: [
      { ...CARRIERS.THIMBLE, lines: ['GL'] },
      { ...CARRIERS.COTERIE, lines: ['BOP', 'GL'] } // Note: Foxquilt excludes roofing
    ],
    nowCertsUrl: URLS.COMMERCIAL
  },

  // ==========================================================================================
  // PROFESSIONAL SERVICES
  // ==========================================================================================
  {
    slug: 'consulting',
    name: 'Business Consulting',
    category: 'Professional',
    icon: Briefcase,
    shortDesc: "Management, HR, and marketing consultants.",
    longDesc: "Professional liability (E&O) for advice and business services.",
    coverages: ["Professional Liability", "GL", "Cyber"],
    keywords: ["consultant", "management", "marketing", "hr"],
    riskFactors: ["Bad advice", "Financial loss", "Breach of contract"],
    carriers: [
      { ...CARRIERS.NEXT, lines: ['PL', 'GL'] },
      { ...CARRIERS.COTERIE, lines: ['BOP', 'PL', 'GL'] },
      { ...CARRIERS.THIMBLE, lines: ['PL', 'GL'] },
      { ...CARRIERS.FOXQUILT, lines: ['GL', 'PL'] }
    ],
    nowCertsUrl: URLS.COMMERCIAL
  },
  {
    slug: 'accounting',
    name: 'Accounting & Tax',
    category: 'Professional',
    icon: Calculator,
    shortDesc: "CPAs, bookkeepers, and tax preparers.",
    longDesc: "E&O and Cyber liability for financial professionals.",
    coverages: ["Professional Liability", "Cyber", "Tax Preparer Bond"],
    keywords: ["cpa", "tax", "bookkeeper", "audit"],
    riskFactors: ["Calculation error", "Missed deadline", "Data breach"],
    carriers: [
      { ...CARRIERS.NEXT, lines: ['PL', 'GL'] },
      { ...CARRIERS.COTERIE, lines: ['BOP', 'PL'] },
      { ...CARRIERS.THIMBLE, lines: ['PL', 'GL'] }
    ],
    nowCertsUrl: URLS.COMMERCIAL
  },
  {
    slug: 'real-estate',
    name: 'Real Estate',
    category: 'Professional',
    icon: Building,
    shortDesc: "Agents, brokers, and property managers.",
    longDesc: "E&O for real estate transactions and property management.",
    coverages: ["Professional Liability", "GL"],
    keywords: ["realtor", "agent", "broker", "property manager"],
    riskFactors: ["Failure to disclose", "Discrimination", "Lock box liability"],
    carriers: [
      { ...CARRIERS.NEXT, lines: ['PL', 'GL'] },
      { ...CARRIERS.COTERIE, lines: ['BOP', 'PL'] },
      { ...CARRIERS.THIMBLE, lines: ['PL', 'GL'] }
    ],
    nowCertsUrl: URLS.COMMERCIAL
  },
  {
    slug: 'technology',
    name: 'IT & Technology',
    category: 'Professional',
    icon: Laptop,
    shortDesc: "Developers, IT support, and web design.",
    longDesc: "Tech E&O and Cyber coverage for digital professions.",
    coverages: ["Tech E&O", "Cyber Liability", "GL"],
    keywords: ["software", "developer", "it", "web"],
    riskFactors: ["Data loss", "System failure", "Copyright infringement"],
    carriers: [
      { ...CARRIERS.NEXT, lines: ['PL', 'GL'] },
      { ...CARRIERS.COTERIE, lines: ['BOP', 'PL'] },
      { ...CARRIERS.FOXQUILT, lines: ['GL', 'Cyber'] }
    ],
    nowCertsUrl: URLS.COMMERCIAL
  },
  {
    slug: 'notary',
    name: 'Notary Public',
    category: 'Professional',
    icon: FileSignature,
    shortDesc: "Notary services and signing agents.",
    longDesc: "E&O and required surety bonds for notaries.",
    coverages: ["Notary E&O", "Notary Bond", "GL"],
    keywords: ["notary", "signing agent", "legal"],
    riskFactors: ["Improper notarization", "Identity fraud"],
    carriers: [
      { ...CARRIERS.NEXT, lines: ['PL'] },
      { ...CARRIERS.THIMBLE, lines: ['PL', 'GL'] }
    ],
    nowCertsUrl: URLS.COMMERCIAL
  },

  // ==========================================================================================
  // RETAIL & ECOMMERCE
  // ==========================================================================================
  {
    slug: 'retail',
    name: 'Retail Store',
    category: 'Retail',
    icon: ShoppingBag,
    shortDesc: "Brick and mortar shops and boutiques.",
    longDesc: "BOP coverage for inventory, property, and slip-and-fall.",
    coverages: ["BOP", "GL", "Workers Comp"],
    keywords: ["store", "shop", "boutique", "clothing"],
    riskFactors: ["Theft", "Customer injury", "Inventory damage"],
    carriers: [
      { ...CARRIERS.NEXT, lines: ['BOP', 'GL', 'WC'] },
      { ...CARRIERS.COTERIE, lines: ['BOP', 'GL'] },
      { ...CARRIERS.THIMBLE, lines: ['GL', 'BOP'] }
    ],
    nowCertsUrl: URLS.COMMERCIAL
  },
  {
    slug: 'ecommerce',
    name: 'eCommerce & Online',
    category: 'Retail',
    icon: ShoppingBasket,
    shortDesc: "Amazon, Etsy, and Shopify sellers.",
    longDesc: "Product liability for online sellers and dropshippers.",
    coverages: ["Product Liability", "GL", "Cyber"],
    keywords: ["online", "amazon", "etsy", "dropship"],
    riskFactors: ["Product defect", "Cyber attack", "Shipping loss"],
    carriers: [
      { ...CARRIERS.FOXQUILT, lines: ['GL'] },
      { ...CARRIERS.THIMBLE, lines: ['GL', 'BOP'] },
      { ...CARRIERS.NEXT, lines: ['GL', 'BOP'] }
    ],
    nowCertsUrl: URLS.COMMERCIAL
  },

  // ==========================================================================================
  // FOOD & BEVERAGE
  // ==========================================================================================
  {
    slug: 'restaurant',
    name: 'Restaurant',
    category: 'Food & Bev',
    icon: UtensilsCrossed,
    shortDesc: "Full service, fast food, and cafes.",
    longDesc: "Comprehensive BOP with spoilage and liquor liability.",
    coverages: ["BOP", "Liquor Liability", "Workers Comp", "Spoilage"],
    keywords: ["cafe", "diner", "bistro", "food"],
    riskFactors: ["Food poisoning", "Slip and fall", "Kitchen fire"],
    carriers: [
      { ...CARRIERS.NEXT, lines: ['BOP', 'GL', 'WC', 'Liquor'] },
      { ...CARRIERS.COTERIE, lines: ['BOP', 'GL'] },
      { ...CARRIERS.THIMBLE, lines: ['GL', 'BOP'] }
    ],
    nowCertsUrl: URLS.COMMERCIAL
  },
  {
    slug: 'food-truck',
    name: 'Food Truck',
    category: 'Food & Bev',
    icon: Truck,
    shortDesc: "Mobile food vendors and trailers.",
    longDesc: "Auto and GL coverage for mobile kitchens.",
    coverages: ["Commercial Auto", "GL", "Inland Marine"],
    keywords: ["truck", "mobile food", "vendor"],
    riskFactors: ["Auto accident", "Propane fire", "Food safety"],
    carriers: [
      { ...CARRIERS.NEXT, lines: ['Auto', 'GL'] },
      { ...CARRIERS.THIMBLE, lines: ['GL'] }
    ],
    nowCertsUrl: URLS.COMMERCIAL
  },

  // ==========================================================================================
  // HEALTH, BEAUTY & FITNESS
  // ==========================================================================================
  {
    slug: 'beauty',
    name: 'Beauty & Salon',
    category: 'Beauty',
    icon: Scissors,
    shortDesc: "Hair, nails, spa, and estheticians.",
    longDesc: "Professional liability for beauty treatments and shop coverage.",
    coverages: ["Professional Liability", "GL", "BOP"],
    keywords: ["hair", "nail", "barber", "makeup"],
    riskFactors: ["Chemical burn", "Customer injury", "Property theft"],
    carriers: [
      { ...CARRIERS.NEXT, lines: ['PL', 'GL', 'BOP'] },
      { ...CARRIERS.COTERIE, lines: ['BOP', 'GL', 'PL'] },
      { ...CARRIERS.THIMBLE, lines: ['PL', 'GL'] },
      { ...CARRIERS.FOXQUILT, lines: ['GL'] }
    ],
    nowCertsUrl: URLS.COMMERCIAL
  },
  {
    slug: 'fitness',
    name: 'Fitness & Yoga',
    category: 'Wellness',
    icon: Dumbbell,
    shortDesc: "Trainers, gyms, and yoga instructors.",
    longDesc: "Liability for training injuries and gym facilities.",
    coverages: ["Professional Liability", "GL", "Accident Medical"],
    keywords: ["gym", "yoga", "trainer", "pilates"],
    riskFactors: ["client injury", "equipment failure", "alleged negligence"],
    carriers: [
      { ...CARRIERS.NEXT, lines: ['PL', 'GL'] },
      { ...CARRIERS.THIMBLE, lines: ['PL', 'GL'] },
      { ...CARRIERS.COTERIE, lines: ['GL', 'PL'] },
      { ...CARRIERS.FOXQUILT, lines: ['GL'] }
    ],
    nowCertsUrl: URLS.COMMERCIAL
  },
  {
    slug: 'medical',
    name: 'Medical Office',
    category: 'Medical',
    icon: Stethoscope,
    shortDesc: "Dentists, optometrists, and clinics.",
    longDesc: "BOP and liability for medical office premises.",
    coverages: ["BOP", "GL", "Professional Liability"],
    keywords: ["doctor", "dentist", "clinic", "medical"],
    riskFactors: ["Malpractice", "HIPAA", "Slip and fall"],
    carriers: [
      { ...CARRIERS.COTERIE, lines: ['BOP', 'PL'] },
      { ...CARRIERS.NEXT, lines: ['GL'] } // Next has Allied Health
    ],
    nowCertsUrl: URLS.COMMERCIAL
  },

  // ==========================================================================================
  // OTHER SERVICES
  // ==========================================================================================
  {
    slug: 'pet',
    name: 'Pet Services',
    category: 'Services',
    icon: PawPrint,
    shortDesc: "Grooming, walking, and boarding.",
    longDesc: "Animal bailee and liability for pet professionals.",
    coverages: ["GL", "Animal Bailee", "Professional Liability"],
    keywords: ["dog", "cat", "groomer", "walker"],
    riskFactors: ["Bite", "Lost pet", "Vet bills"],
    carriers: [
      { ...CARRIERS.NEXT, lines: ['GL', 'PL'] },
      { ...CARRIERS.THIMBLE, lines: ['GL', 'Inland Marine'] },
      { ...CARRIERS.COTERIE, lines: ['BOP', 'GL'] },
      { ...CARRIERS.FOXQUILT, lines: ['GL'] }
    ],
    nowCertsUrl: URLS.COMMERCIAL
  },
  {
    slug: 'auto-service',
    name: 'Auto Service & Repair',
    category: 'Automotive',
    icon: CarFront,
    shortDesc: "Mechanics, body shops, and detailers.",
    longDesc: "Garagekeepers liability and property coverage.",
    coverages: ["Garagekeepers", "GL", "Workers Comp"],
    keywords: ["mechanic", "body shop", "detailer", "towing"],
    riskFactors: ["Damage to customer car", "Shop fire", "Test drive accident"],
    carriers: [
      { ...CARRIERS.NEXT, lines: ['GL', 'WC'] }, // Next lists Auto Service in GL
      { ...CARRIERS.THIMBLE, lines: ['GL'] } // Thimble lists Auto Detailing
    ],
    nowCertsUrl: URLS.COMMERCIAL
  },
  {
    slug: 'trucking',
    name: 'Trucking & Logistics',
    category: 'Transportation',
    icon: FreightIcon,
    shortDesc: "Owner operators and freight.",
    longDesc: "Commercial auto and motor truck cargo.",
    coverages: ["Auto Liability", "Motor Truck Cargo", "GL"],
    keywords: ["trucker", "freight", "hauling"],
    riskFactors: ["Accident", "Cargo theft", "DOT compliance"],
    carriers: [
      { ...CARRIERS.NEXT, lines: ['Auto', 'GL'] } // Next lists Motor Truck Cargo
    ],
    nowCertsUrl: URLS.COMMERCIAL
  },
  {
    slug: 'events',
    name: 'Events & Entertainment',
    category: 'Entertainment',
    icon: Music,
    shortDesc: "DJs, photographers, and event planners.",
    longDesc: "Short-term or annual coverage for event pros.",
    coverages: ["GL", "Inland Marine", "Event Liability"],
    keywords: ["dj", "wedding", "photographer", "event"],
    riskFactors: ["Guest injury", "Equipment damage", "Cancellation"],
    carriers: [
      { ...CARRIERS.THIMBLE, lines: ['GL', 'Inland Marine'] },
      { ...CARRIERS.NEXT, lines: ['GL', 'PL'] },
      { ...CARRIERS.FOXQUILT, lines: ['GL'] }
    ],
    nowCertsUrl: URLS.COMMERCIAL
  },
  {
    slug: 'sports',
    name: 'Sports & Recreation',
    category: 'Entertainment',
    icon: Trophy,
    shortDesc: "Leagues, teams, facilities, and camps.",
    longDesc: "Participant liability and accident coverage for sports organizations.",
    coverages: ["GL", "Participant Accident", "Equipment", "Facility Liability"],
    keywords: ["league", "team", "tournament", "coach", "camp", "gym"],
    riskFactors: ["Player injury", "Spectator injury", "Abuse & Molestation"],
    carriers: [
      { ...CARRIERS.THIMBLE, lines: ['GL', 'Inland Marine'] },
      { ...CARRIERS.NEXT, lines: ['GL', 'PL'] }
    ],
    nowCertsUrl: URLS.COMMERCIAL
  }
];

export const getIndustryBySlug = (slug: string) => INDUSTRIES.find(i => i.slug === slug);
