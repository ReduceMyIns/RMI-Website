import { 
  Briefcase, Hammer, Stethoscope, Utensils, Truck, Building, Laptop, ShoppingBag, 
  Shield, Wrench, Zap, Factory, HardHat, Tractor, Microscope, Ship, Plane, 
  Music, Camera, Heart, Scale, Gavel, BookOpen, Trash2, Droplets, Flame, 
  Construction, Warehouse, Phone, Radio, Globe, Landmark, Coins, Home, 
  Scissors, Dumbbell, PawPrint, CarFront, Trophy, GraduationCap, Baby, 
  WashingMachine, Brush, Crosshair, Hotel, UtensilsCrossed, Gem, Store, 
  TreePine, Package, Mail, Glasses, Beer, Pizza, UserCheck, Fence, Paintbrush, 
  Smartphone, Video, Pickaxe
} from 'lucide-react';

export interface SICIndustry {
  name: string;
  sicCode: string;
  slug: string;
  category: string;
}

export const SIC_INDUSTRIES: SICIndustry[] = [
  { name: "Wheat Farming", sicCode: "0111", slug: "wheat-farming", category: "Agriculture" },
  { name: "Rice Farming", sicCode: "0112", slug: "rice-farming", category: "Agriculture" },
  { name: "Corn Farming", sicCode: "0115", slug: "corn-farming", category: "Agriculture" },
  { name: "Soybean Farming", sicCode: "0116", slug: "soybean-farming", category: "Agriculture" },
  { name: "Dry Pea and Bean Farming", sicCode: "0119", slug: "dry-pea-bean-farming", category: "Agriculture" },
  { name: "Cotton Farming", sicCode: "0131", slug: "cotton-farming", category: "Agriculture" },
  { name: "Tobacco Farming", sicCode: "0132", slug: "tobacco-farming", category: "Agriculture" },
  { name: "Sugar Beet Farming", sicCode: "0133", slug: "sugar-beet-farming", category: "Agriculture" },
  { name: "Potato Farming", sicCode: "0134", slug: "potato-farming", category: "Agriculture" },
  { name: "Hay Farming", sicCode: "0139", slug: "hay-farming", category: "Agriculture" },
  { name: "Peanut Farming", sicCode: "0139", slug: "peanut-farming", category: "Agriculture" },
  { name: "Vegetable and Melon Farming", sicCode: "0161", slug: "vegetable-melon-farming", category: "Agriculture" },
  { name: "Berry Farming", sicCode: "0171", slug: "berry-farming", category: "Agriculture" },
  { name: "Grape Vineyards", sicCode: "0172", slug: "grape-vineyards", category: "Agriculture" },
  { name: "Tree Nut Farming", sicCode: "0173", slug: "tree-nut-farming", category: "Agriculture" },
  { name: "Citrus Groves", sicCode: "0174", slug: "citrus-groves", category: "Agriculture" },
  { name: "Apple Orchards", sicCode: "0175", slug: "apple-orchards", category: "Agriculture" },
  { name: "Nursery and Tree Production", sicCode: "0181", slug: "nursery-tree-production", category: "Agriculture" },
  { name: "Floriculture Production", sicCode: "0181", slug: "floriculture-production", category: "Agriculture" },
  { name: "Mushroom Production", sicCode: "0182", slug: "mushroom-production", category: "Agriculture" },
  { name: "Cattle Feedlots", sicCode: "0211", slug: "cattle-feedlots", category: "Agriculture" },
  { name: "Beef Cattle Ranching", sicCode: "0212", slug: "beef-cattle-ranching", category: "Agriculture" },
  { name: "Hog and Pig Farming", sicCode: "0213", slug: "hog-pig-farming", category: "Agriculture" },
  { name: "Goat Farming", sicCode: "0214", slug: "goat-farming", category: "Agriculture" },
  { name: "Sheep Farming", sicCode: "0214", slug: "sheep-farming", category: "Agriculture" },
  { name: "Dairy Cattle and Milk Production", sicCode: "0241", slug: "dairy-cattle-milk-production", category: "Agriculture" },
  { name: "Poultry Production", sicCode: "0251", slug: "poultry-production", category: "Agriculture" },
  { name: "Chicken Egg Production", sicCode: "0252", slug: "chicken-egg-production", category: "Agriculture" },
  { name: "Turkey Production", sicCode: "0253", slug: "turkey-production", category: "Agriculture" },
  { name: "Veterinary Services", sicCode: "0741", slug: "veterinary-services", category: "Services" },
  { name: "Pet Care Services", sicCode: "0752", slug: "pet-care-services", category: "Services" },
  { name: "Landscape Architectural Services", sicCode: "0781", slug: "landscape-architectural-services", category: "Services" },
  { name: "Landscaping Services", sicCode: "0782", slug: "landscaping-services", category: "Services" },
  { name: "Timber Tract Operations", sicCode: "0811", slug: "timber-tract-operations", category: "Agriculture" },
  { name: "Finfish Fishing", sicCode: "0912", slug: "finfish-fishing", category: "Agriculture" },
  { name: "Shellfish Fishing", sicCode: "0913", slug: "shellfish-fishing", category: "Agriculture" },
  { name: "Iron Ore Mining", sicCode: "1011", slug: "iron-ore-mining", category: "Mining" },
  { name: "Copper Ore Mining", sicCode: "1021", slug: "copper-ore-mining", category: "Mining" },
  { name: "Gold Ore Mining", sicCode: "1041", slug: "gold-ore-mining", category: "Mining" },
  { name: "Silver Ore Mining", sicCode: "1044", slug: "silver-ore-mining", category: "Mining" },
  { name: "Bituminous Coal Mining", sicCode: "1221", slug: "bituminous-coal-mining", category: "Mining" },
  { name: "Crude Petroleum Extraction", sicCode: "1311", slug: "crude-petroleum-extraction", category: "Mining" },
  { name: "Drilling Oil and Gas Wells", sicCode: "1381", slug: "drilling-oil-gas-wells", category: "Mining" },
  { name: "Residential Remodelers", sicCode: "1521", slug: "residential-remodelers", category: "Construction" },
  { name: "New Single-Family Housing Construction", sicCode: "1521", slug: "new-single-family-housing-construction", category: "Construction" },
  { name: "New Multifamily Housing Construction", sicCode: "1522", slug: "new-multifamily-housing-construction", category: "Construction" },
  { name: "Highway, Street, and Bridge Construction", sicCode: "1611", slug: "highway-street-bridge-construction", category: "Construction" },
  { name: "Power and Communication Line Construction", sicCode: "1623", slug: "power-communication-line-construction", category: "Construction" },
  { name: "Plumbing, Heating, and Air Conditioning Contractors", sicCode: "1711", slug: "plumbing-heating-ac-contractors", category: "Construction" },
  { name: "Painting and Wall Covering Contractors", sicCode: "1721", slug: "painting-wall-covering-contractors", category: "Construction" },
  { name: "Electrical Contractors", sicCode: "1731", slug: "electrical-contractors", category: "Construction" },
  { name: "Masonry Contractors", sicCode: "1741", slug: "masonry-contractors", category: "Construction" },
  { name: "Drywall and Insulation Contractors", sicCode: "1742", slug: "drywall-insulation-contractors", category: "Construction" },
  { name: "Tile and Terrazzo Contractors", sicCode: "1743", slug: "tile-terrazzo-contractors", category: "Construction" },
  { name: "Framing Contractors", sicCode: "1751", slug: "framing-contractors", category: "Construction" },
  { name: "Flooring Contractors", sicCode: "1752", slug: "flooring-contractors", category: "Construction" },
  { name: "Roofing Contractors", sicCode: "1761", slug: "roofing-contractors", category: "Construction" },
  { name: "Glass and Glazing Contractors", sicCode: "1793", slug: "glass-glazing-contractors", category: "Construction" },
  { name: "Meat Processing", sicCode: "2013", slug: "meat-processing", category: "Manufacturing" },
  { name: "Dairy Product Mfg.", sicCode: "2023", slug: "dairy-product-mfg", category: "Manufacturing" },
  { name: "Ice Cream Mfg.", sicCode: "2024", slug: "ice-cream-mfg", category: "Manufacturing" },
  { name: "Commercial Bakeries", sicCode: "2051", slug: "commercial-bakeries", category: "Manufacturing" },
  { name: "Breweries", sicCode: "2082", slug: "breweries", category: "Manufacturing" },
  { name: "Wineries", sicCode: "2084", slug: "wineries", category: "Manufacturing" },
  { name: "Distilleries", sicCode: "2085", slug: "distilleries", category: "Manufacturing" },
  { name: "Soft Drink Mfg.", sicCode: "2086", slug: "soft-drink-mfg", category: "Manufacturing" },
  { name: "Logging", sicCode: "2411", slug: "logging", category: "Manufacturing" },
  { name: "Sawmills", sicCode: "2421", slug: "sawmills", category: "Manufacturing" },
  { name: "Wood Kitchen Cabinet Mfg.", sicCode: "2434", slug: "wood-kitchen-cabinet-mfg", category: "Manufacturing" },
  { name: "Manufactured Home Mfg.", sicCode: "2451", slug: "manufactured-home-mfg", category: "Manufacturing" },
  { name: "Pulp Mills", sicCode: "2611", slug: "pulp-mills", category: "Manufacturing" },
  { name: "Newspaper Publishers", sicCode: "2711", slug: "newspaper-publishers", category: "Manufacturing" },
  { name: "Pharmaceutical Preparation Mfg.", sicCode: "2834", slug: "pharmaceutical-preparation-mfg", category: "Manufacturing" },
  { name: "Petroleum Refineries", sicCode: "2911", slug: "petroleum-refineries", category: "Manufacturing" },
  { name: "Tire Mfg.", sicCode: "3011", slug: "tire-mfg", category: "Manufacturing" },
  { name: "Footwear Mfg.", sicCode: "3143", slug: "footwear-mfg", category: "Manufacturing" },
  { name: "Cement Mfg.", sicCode: "3241", slug: "cement-mfg", category: "Manufacturing" },
  { name: "Ready-Mix Concrete Mfg.", sicCode: "3273", slug: "ready-mix-concrete-mfg", category: "Manufacturing" },
  { name: "Iron and Steel Mills", sicCode: "3312", slug: "iron-steel-mills", category: "Manufacturing" },
  { name: "Automobile Mfg.", sicCode: "3711", slug: "automobile-mfg", category: "Manufacturing" },
  { name: "Ship Building and Repairing", sicCode: "3731", slug: "ship-building-repairing", category: "Manufacturing" },
  { name: "Boat Building", sicCode: "3732", slug: "boat-building", category: "Manufacturing" },
  { name: "Jewelry Mfg.", sicCode: "3911", slug: "jewelry-mfg", category: "Manufacturing" },
  { name: "Musical Instrument Mfg.", sicCode: "3931", slug: "musical-instrument-mfg", category: "Manufacturing" },
  { name: "Doll, Toy, and Game Mfg.", sicCode: "3944", slug: "doll-toy-game-mfg", category: "Manufacturing" },
  { name: "Sign Mfg.", sicCode: "3993", slug: "sign-mfg", category: "Manufacturing" },
  { name: "Railroads", sicCode: "4011", slug: "railroads", category: "Transportation" },
  { name: "Taxi Service", sicCode: "4121", slug: "taxi-service", category: "Transportation" },
  { name: "Ambulance Services", sicCode: "4119", slug: "ambulance-services", category: "Transportation" },
  { name: "General Freight Trucking", sicCode: "4212", slug: "general-freight-trucking", category: "Transportation" },
  { name: "Courier Services", sicCode: "4215", slug: "courier-services", category: "Transportation" },
  { name: "Deep Sea Freight Transportation", sicCode: "4412", slug: "deep-sea-freight-transportation", category: "Transportation" },
  { name: "Scheduled Passenger Air Transportation", sicCode: "4512", slug: "scheduled-passenger-air-transportation", category: "Transportation" },
  { name: "Travel Agencies", sicCode: "4724", slug: "travel-agencies", category: "Transportation" },
  { name: "Radio Stations", sicCode: "4832", slug: "radio-stations", category: "Communications" },
  { name: "Television Broadcasting", sicCode: "4833", slug: "television-broadcasting", category: "Communications" },
  { name: "Water Supply Systems", sicCode: "4941", slug: "water-supply-systems", category: "Utilities" },
  { name: "Furniture Merchant Wholesalers", sicCode: "5021", slug: "furniture-merchant-wholesalers", category: "Wholesale" },
  { name: "Hardware Merchant Wholesalers", sicCode: "5072", slug: "hardware-merchant-wholesalers", category: "Wholesale" },
  { name: "Department Stores", sicCode: "5311", slug: "department-stores", category: "Retail" },
  { name: "Supermarkets", sicCode: "5411", slug: "supermarkets", category: "Retail" },
  { name: "New Car Dealers", sicCode: "5511", slug: "new-car-dealers", category: "Retail" },
  { name: "Used Car Dealers", sicCode: "5521", slug: "used-car-dealers", category: "Retail" },
  { name: "Gasoline Stations", sicCode: "5541", slug: "gasoline-stations", category: "Retail" },
  { name: "Boat Dealers", sicCode: "5551", slug: "boat-dealers", category: "Retail" },
  { name: "Clothing Stores", sicCode: "5651", slug: "clothing-stores", category: "Retail" },
  { name: "Shoe Stores", sicCode: "5661", slug: "shoe-stores", category: "Retail" },
  { name: "Full-Service Restaurants", sicCode: "5812", slug: "full-service-restaurants", category: "Food & Bev" },
  { name: "Drinking Places", sicCode: "5813", slug: "drinking-places", category: "Food & Bev" },
  { name: "Pharmacies", sicCode: "5912", slug: "pharmacies", category: "Retail" },
  { name: "Jewelry Stores", sicCode: "5944", slug: "jewelry-stores", category: "Retail" },
  { name: "Florists", sicCode: "5992", slug: "florists", category: "Retail" },
  { name: "Commercial Banking", sicCode: "6029", slug: "commercial-banking", category: "Finance" },
  { name: "Credit Unions", sicCode: "6061", slug: "credit-unions", category: "Finance" },
  { name: "Insurance Agencies", sicCode: "6411", slug: "insurance-agencies", category: "Finance" },
  { name: "Real Estate Agents", sicCode: "6531", slug: "real-estate-agents", category: "Real Estate" },
  { name: "Hotels and Motels", sicCode: "7011", slug: "hotels-motels", category: "Hospitality" },
  { name: "Beauty Salons", sicCode: "7231", slug: "beauty-salons", category: "Beauty" },
  { name: "Barber Shops", sicCode: "7241", slug: "barber-shops", category: "Beauty" },
  { name: "Funeral Services", sicCode: "7261", slug: "funeral-services", category: "Services" },
  { name: "Advertising Agencies", sicCode: "7311", slug: "advertising-agencies", category: "Professional" },
  { name: "Janitorial Services", sicCode: "7349", slug: "janitorial-services", category: "Services" },
  { name: "Custom Computer Programming", sicCode: "7371", slug: "custom-computer-programming", category: "Professional" },
  { name: "Software Publishers", sicCode: "7372", slug: "software-publishers", category: "Professional" },
  { name: "Security Guards", sicCode: "7381", slug: "security-guards", category: "Services" },
  { name: "Car Washes", sicCode: "7542", slug: "car-washes", category: "Automotive" },
  { name: "General Automotive Repair", sicCode: "7538", slug: "general-automotive-repair", category: "Automotive" },
  { name: "Motion Picture Production", sicCode: "7812", slug: "motion-picture-production", category: "Entertainment" },
  { name: "Bowling Centers", sicCode: "7933", slug: "bowling-centers", category: "Entertainment" },
  { name: "Golf Courses", sicCode: "7992", slug: "golf-courses", category: "Entertainment" },
  { name: "Offices of Physicians", sicCode: "8011", slug: "offices-physicians", category: "Medical" },
  { name: "Offices of Dentists", sicCode: "8021", slug: "offices-dentists", category: "Medical" },
  { name: "Hospitals", sicCode: "8062", slug: "hospitals", category: "Medical" },
  { name: "Legal Services", sicCode: "8111", slug: "legal-services", category: "Professional" },
  { name: "Elementary Schools", sicCode: "8211", slug: "elementary-schools", category: "Education" },
  { name: "Colleges and Universities", sicCode: "8221", slug: "colleges-universities", category: "Education" },
  { name: "Child Day Care Services", sicCode: "8351", slug: "child-day-care-services", category: "Services" },
  { name: "Museums", sicCode: "8412", slug: "museums", category: "Entertainment" },
  { name: "Religious Organizations", sicCode: "8661", slug: "religious-organizations", category: "Services" },
  { name: "Engineering Services", sicCode: "8711", slug: "engineering-services", category: "Professional" },
  { name: "Architectural Services", sicCode: "8712", slug: "architectural-services", category: "Professional" },
  { name: "Accounting Services", sicCode: "8721", slug: "accounting-services", category: "Professional" },
  { name: "Police Protection", sicCode: "9221", slug: "police-protection", category: "Government" },
  { name: "Fire Protection", sicCode: "9224", slug: "fire-protection", category: "Government" }
];

export const getSICIndustryBySlug = (slug: string) => SIC_INDUSTRIES.find(i => i.slug === slug);

export const getIconForCategory = (category: string) => {
  switch (category) {
    case 'Agriculture': return Tractor;
    case 'Mining': return Pickaxe;
    case 'Construction': return HardHat;
    case 'Manufacturing': return Factory;
    case 'Transportation': return Truck;
    case 'Communications': return Radio;
    case 'Utilities': return Droplets;
    case 'Wholesale': return Warehouse;
    case 'Retail': return ShoppingBag;
    case 'Food & Bev': return Utensils;
    case 'Finance': return Landmark;
    case 'Real Estate': return Building;
    case 'Hospitality': return Hotel;
    case 'Beauty': return Scissors;
    case 'Professional': return Briefcase;
    case 'Entertainment': return Music;
    case 'Medical': return Stethoscope;
    case 'Education': return GraduationCap;
    case 'Government': return Shield;
    default: return Globe;
  }
};
