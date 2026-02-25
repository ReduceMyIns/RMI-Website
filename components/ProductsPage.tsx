
import React, { useState } from 'react';
import { 
  ArrowRight, Shield, Car, Home, Briefcase, Zap, Heart, Umbrella, Anchor, Truck, Hammer, 
  Search, ExternalLink, Sparkles, Building, Info, FileText, Layout, Stethoscope, Eye, Activity, Users, Waves, PawPrint, FileSignature, Bike, TreePine, Trophy, TrendingUp, DollarSign, Award, Wind, Calculator, Lock
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { INDUSTRIES } from '../data/industryData';

const PRODUCTS = {
  Personal: [
    { name: "Auto Insurance", icon: Car, desc: "Coverage for personal vehicles, classic cars, and motorcycles.", slug: 'auto', customRoute: '/auto' },
    { name: "Homeowners", icon: Home, desc: "Protection for your home, condo, or mobile home against disasters.", slug: 'home', customRoute: '/home' },
    { name: "Renters", icon: Home, desc: "Affordable coverage for your personal belongings and liability.", slug: 'renters', customRoute: '/renters' },
    { 
        name: "Motorcycle", 
        icon: Bike, 
        desc: "Coverage for cruisers, sport bikes, touring, and custom rides.", 
        slug: 'motorcycle',
        customRoute: '/powersports'
    },
    { 
        name: "ATV / UTV", 
        icon: TreePine, 
        desc: "Off-road vehicle protection for work or play.", 
        slug: 'atv-utv',
        customRoute: '/powersports'
    },
    { 
        name: "Life Insurance", 
        icon: Heart, 
        desc: "Term and whole life policies to secure your family's future.", 
        slug: 'life',
        customRoute: '/life'
    },
    { 
        name: "Health & Medicare", 
        icon: Stethoscope, 
        desc: "Individual health plans, Medicare supplements, and gap medical coverage.", 
        slug: 'health',
        customRoute: '/health'
    },
    { 
        name: "Dental & Vision", 
        icon: Eye, 
        desc: "Comprehensive dental and vision care plans for individuals.", 
        slug: 'dental-vision',
        customRoute: '/dental-vision'
    },
    { 
        name: "Disability & Accident", 
        icon: Activity, 
        desc: "Income protection, accidental medical, and critical care coverage.", 
        slug: 'disability',
        customRoute: '/disability'
    },
    { name: "Umbrella", icon: Umbrella, desc: "Extra liability coverage that goes beyond your standard policies.", slug: 'umbrella', customRoute: '/umbrella' },
    { 
        name: "Watercraft", 
        icon: Anchor, 
        desc: "Specialized insurance for boats, yachts, and jet skis.", 
        slug: 'watercraft',
        customRoute: '/watercraft'
    },
    { 
        name: "Flood Insurance", 
        icon: Waves, 
        desc: "AI-powered flood protection for your home and belongings.", 
        slug: 'flood',
        customRoute: '/flood'
    },
    { 
        name: "Sola Wind/Hail", 
        icon: Wind, 
        desc: "Supplemental coverage for wind, hail, and tornadoes. Covers deductibles and depreciated roof gaps.", 
        slug: 'sola',
        customRoute: "/sola"
    },
    { 
        name: "Pet Insurance", 
        icon: PawPrint, 
        desc: "Comprehensive coverage for vet bills, accidents, and wellness for your furry friends.", 
        slug: 'pet',
        customRoute: '/pet-insurance'
    },
    {
        name: "Sell Your Car",
        icon: DollarSign,
        desc: "Get an instant cash offer for your junk or unwanted car with free pickup.",
        slug: 'sell-car',
        customRoute: '/sell-car'
    },
    {
        name: "Insure Tax",
        icon: Calculator,
        desc: "Integrated tax planning and preparation services.",
        slug: 'insure-tax',
        customRoute: '/insure-tax'
    },
    {
        name: "Home Warranty",
        icon: Home,
        desc: "Comprehensive home warranty plans for your appliances and systems.",
        slug: 'choice-home-warranty',
        customRoute: '/choice-warranty'
    },
    {
        name: "Auto Warranty",
        icon: Shield,
        desc: "Extended warranty protection for your car, truck, or RV.",
        slug: 'arkay-warranty',
        customRoute: '/arkay-warranty'
    },
    {
        name: "Home Security",
        icon: Lock,
        desc: "Protect your home with top-rated security systems from ADT and Cove.",
        slug: 'home-security',
        customRoute: '/home-security'
    }
  ],
  Commercial: [
    { name: "General Liability", icon: Shield, desc: "Fundamental protection against third-party claims and lawsuits.", slug: 'commercial', customRoute: '/general-liability' },
    { name: "Commercial Auto", icon: Truck, desc: "Coverage for business vehicles, fleets, and trucking operations.", slug: 'commercial-auto', customRoute: '/commercial-auto' },
    { name: "Workers' Comp", icon: Briefcase, desc: "Mandatory coverage for employee injuries and lost wages.", slug: 'workers-comp', customRoute: '/workers-comp' },
    { name: "Business Owners", icon: Briefcase, desc: "Bundled BOP policies for small to medium-sized businesses.", slug: 'bop', customRoute: '/bop' },
    { 
        name: "Group Health", 
        icon: Users, 
        desc: "Health insurance plans for employees and small business groups.", 
        slug: 'group-health',
        customRoute: '/health'
    },
    { name: "Cyber Liability", icon: Zap, desc: "Protection against data breaches and cyber attacks.", slug: 'cyber', customRoute: '/cyber' },
    { name: "Builders Risk", icon: Hammer, desc: "Coverage for buildings under construction or renovation.", slug: 'builders-risk', customRoute: '/builders-risk' },
    { 
        name: "Surety Bonds", 
        icon: FileSignature, 
        desc: "Contract, license, and permit bonds issued instantly online.", 
        slug: 'bonds',
        customRoute: '/bonds'
    },
    { 
        name: "Sports & Events", 
        icon: Trophy, 
        desc: "Leagues, tournaments, facilities, and special event coverage.", 
        slug: 'sports',
        customRoute: '/sports'
    },
    {
        name: "Insure Tax",
        icon: Calculator,
        desc: "Business tax preparation, bookkeeping, and strategic planning.",
        slug: 'insure-tax',
        customRoute: '/insure-tax'
    }
  ],
  Financial: [
    {
        name: "Wealth Management",
        icon: TrendingUp,
        desc: "Investment platforms and financial growth tools including Webull and Robinhood.",
        slug: 'financial',
        customRoute: '/financial'
    },
    {
        name: "Insure Tax",
        icon: Calculator,
        desc: "Comprehensive tax services for individuals and businesses.",
        slug: 'insure-tax',
        customRoute: '/insure-tax'
    }
  ]
};

const ProductsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'Personal' | 'Commercial' | 'Financial'>('Personal');

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 space-y-24 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      {/* Hero Header */}
      <div className="text-center space-y-6">
        <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full glass border-blue-500/20 text-blue-400 text-[10px] font-bold uppercase tracking-widest">
          <Shield className="w-3 h-3" /> Comprehensive Solutions
        </div>
        <h1 className="text-5xl md:text-7xl font-heading font-bold tracking-tight text-white leading-tight">
          Protection for <span className="text-blue-400">Every Aspect</span> <br /> of Your Life & Business.
        </h1>
        <p className="text-slate-400 text-lg max-w-2xl mx-auto leading-relaxed">
          We combine cutting-edge AI technology with a vast network of 80+ carriers to find you the perfect coverage at the lowest possible rate.
        </p>
      </div>

      {/* Product Tabs */}
      <div className="space-y-12">
        <div className="flex justify-center">
            <div className="bg-white/5 p-1.5 rounded-2xl border border-white/10 flex gap-2">
            {['Personal', 'Commercial', 'Financial'].map((tab) => (
                <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`px-8 py-3 rounded-xl text-sm font-bold transition-all ${
                    activeTab === tab 
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' 
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
                >
                {tab} Insurance
                </button>
            ))}
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {PRODUCTS[activeTab].map((product, idx) => (
            <div key={idx} className="glass-card p-8 rounded-[2rem] border-white/5 hover:border-blue-500/30 transition-all group hover:bg-white/[0.05] flex flex-col">
                <div className="w-14 h-14 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-400 mb-6 group-hover:scale-110 transition-transform">
                <product.icon className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{product.name}</h3>
                <p className="text-slate-400 text-sm leading-relaxed mb-6">
                {product.desc}
                </p>
                <div className="mt-auto pt-4 flex items-center justify-between">
                    {(product as any).externalLink ? (
                        <a 
                            href={(product as any).externalLink} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 text-white font-bold text-xs uppercase tracking-widest bg-white/5 px-6 py-3 rounded-xl hover:bg-blue-600 transition-all"
                        >
                            Get A Quote <ArrowRight className="w-4 h-4" />
                        </a>
                    ) : (product as any).customRoute ? (
                        <Link 
                            to={(product as any).customRoute}
                            className="inline-flex items-center gap-2 text-white font-bold text-xs uppercase tracking-widest bg-white/5 px-6 py-3 rounded-xl hover:bg-blue-600 transition-all"
                        >
                            View Options <ArrowRight className="w-4 h-4" />
                        </Link>
                    ) : (
                        <Link 
                            to="/apply" 
                            state={{ preSelected: product.name }}
                            className="inline-flex items-center gap-2 text-white font-bold text-xs uppercase tracking-widest bg-white/5 px-6 py-3 rounded-xl hover:bg-blue-600 transition-all"
                        >
                            Analyze Rates <ArrowRight className="w-4 h-4" />
                        </Link>
                    )}
                </div>
            </div>
            ))}
        </div>
      </div>

      {/* NEW: Shop by Industry Bridge Section */}
      <section className="space-y-12 pt-12 border-t border-white/5">
         <div className="flex flex-col md:flex-row justify-between items-end gap-6">
            <div className="space-y-4">
               <div className="flex items-center gap-3 text-blue-400 font-bold uppercase tracking-widest text-[10px]">
                  <Layout className="w-4 h-4" /> Neural Risk Profiles
               </div>
               <h2 className="text-3xl md:text-5xl font-heading font-bold text-white tracking-tight">Shop by <span className="text-indigo-400">Industry</span></h2>
               <p className="text-slate-400 max-w-xl">We've pre-mapped specialized coverages for over 60 professions to ensure accuracy and speed.</p>
            </div>
            <Link to="/industries" className="px-8 py-4 bg-white/5 hover:bg-white/10 text-white rounded-2xl font-bold transition-all border border-white/10 flex items-center gap-3">
               Browse Full Industry Catalog <ArrowRight className="w-5 h-5" />
            </Link>
         </div>

         <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {INDUSTRIES.slice(0, 12).map((ind) => (
               <Link 
                  key={ind.slug}
                  to={`/insurance/${ind.slug}`}
                  className="glass-card p-6 rounded-2xl border-white/5 hover:border-blue-500/30 transition-all text-center group"
               >
                  <ind.icon className="w-8 h-8 text-slate-500 group-hover:text-blue-400 mx-auto mb-3 transition-colors" />
                  <div className="text-[10px] font-bold text-slate-400 group-hover:text-white uppercase tracking-wider line-clamp-1">{ind.name}</div>
               </Link>
            ))}
         </div>
      </section>

      {/* Custom Quote CTA */}
      <div className="glass-card p-12 rounded-[3rem] border-white/5 relative overflow-hidden text-center space-y-8">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-500/5 blur-[120px] rounded-full pointer-events-none"></div>
        <div className="relative z-10 max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-white mb-6">Can't find your specific risk?</h2>
          <p className="text-slate-400 mb-8">
            Our AI engine utilizes live market search to quote almost any asset or liability. From special events to exotic vehicles, we have a digital bridge for it.
          </p>
          <Link to="/apply" className="inline-flex px-10 py-4 bg-white text-slate-900 rounded-2xl font-bold hover:bg-blue-50 transition-colors shadow-xl items-center gap-3 active:scale-95">
            Launch Dynamic AI Quote <Sparkles className="w-5 h-5 text-blue-500" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;
