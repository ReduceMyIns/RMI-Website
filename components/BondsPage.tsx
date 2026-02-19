
import React, { useState, useMemo } from 'react';
import { ArrowLeft, FileSignature, Search, MapPin, ExternalLink, ShieldCheck, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import { BONDS_DATA, Bond } from '../data/bondsData';

const STATES = ['ALL', 'TN', 'KY', 'GA', 'AL', 'FL', 'VA'];

const BondsPage: React.FC = () => {
  const [activeState, setActiveState] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredBonds = useMemo(() => {
    const term = searchTerm.toLowerCase().trim();
    
    // Base filter function
    const matchesFilters = (bond: Bond) => {
      const matchesState = activeState === 'ALL' || bond.state === activeState;
      
      if (!term) return matchesState;

      let searchableText = bond.name.toLowerCase();
      
      // --- FUZZY LOOKUP / KEYWORD INJECTION ---
      // This allows users to find bonds using common terms even if not in the official name
      if (searchableText.includes('motor vehicle dealer')) searchableText += ' car lot auto dealer used car dealership sales';
      if (searchableText.includes('auto') && searchableText.includes('dealer')) searchableText += ' car lot motor vehicle';
      if (searchableText.includes('heating') || searchableText.includes('cooling')) searchableText += ' hvac air conditioning';
      if (searchableText.includes('hvac')) searchableText += ' heating cooling air conditioning';
      if (searchableText.includes('plumber') || searchableText.includes('plumbing')) searchableText += ' gas fitter pipe';
      if (searchableText.includes('alcohol') || searchableText.includes('liquor') || searchableText.includes('beer') || searchableText.includes('wine')) searchableText += ' beverage spirits dram shop';
      if (searchableText.includes('home inspector')) searchableText += ' inspection property inspector';
      if (searchableText.includes('investigator')) searchableText += ' detective private eye';
      if (searchableText.includes('contractor')) searchableText += ' construction builder tradesman';
      if (searchableText.includes('appraisal')) searchableText += ' appraiser real estate';
      if (searchableText.includes('notary')) searchableText += ' signing agent public official e & o';
      if (searchableText.includes('title')) searchableText += ' tag agency registration';
      if (searchableText.includes('davidson') || searchableText.includes('nashville')) searchableText += ' davidson nashville';
      if (searchableText.includes('home improvement')) searchableText += ' remodeling renovation';
      
      const matchesSearch = searchableText.includes(term);
      return matchesState && matchesSearch;
    };

    return BONDS_DATA.filter(matchesFilters);
  }, [activeState, searchTerm]);

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <Link to="/products" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-8 group">
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Products
      </Link>

      {/* Hero Section */}
      <div className="text-center space-y-6 mb-16">
        <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full glass border-blue-500/20 text-blue-400 text-[10px] font-bold uppercase tracking-widest">
          <FileSignature className="w-3 h-3" /> Surety Division
        </div>
        <h1 className="text-4xl md:text-6xl font-heading font-bold tracking-tight text-white leading-tight">
          Instant <span className="text-blue-400">Surety Bonds</span>
        </h1>
        <p className="text-slate-400 text-lg leading-relaxed max-w-2xl mx-auto">
          Secure the bonds you need to stay compliant. From license and permit bonds to utility deposits, get issued instantly online.
        </p>
      </div>

      {/* Controls */}
      <div className="space-y-8 mb-12">
         {/* Search */}
         <div className="relative max-w-2xl mx-auto">
            <div className="absolute inset-0 bg-blue-500/5 blur-xl rounded-full"></div>
            <div className="relative group">
               <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
               <input 
                  type="text" 
                  placeholder="Search by keyword (e.g., 'Car Lot', 'Nashville', 'Notary')..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-14 pr-6 py-5 bg-white/5 border border-white/10 rounded-2xl text-white outline-none focus:border-blue-500/50 transition-all placeholder:text-slate-600 shadow-xl"
               />
            </div>
         </div>

         {/* State Filter */}
         <div className="flex flex-wrap justify-center gap-2">
            {STATES.map(state => (
               <button
                  key={state}
                  onClick={() => setActiveState(state)}
                  className={`px-6 py-2 rounded-xl text-sm font-bold transition-all border ${
                     activeState === state 
                     ? 'bg-blue-600 text-white border-blue-500 shadow-lg shadow-blue-500/20' 
                     : 'bg-white/5 text-slate-400 border-white/5 hover:bg-white/10 hover:text-white'
                  }`}
               >
                  {state === 'ALL' ? 'All States' : state}
               </button>
            ))}
         </div>
      </div>

      {/* Results Grid */}
      {filteredBonds.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
           {filteredBonds.map((bond, idx) => (
              <div key={idx} className="glass-card p-6 rounded-3xl border-white/5 hover:border-blue-500/30 transition-all group flex flex-col hover:bg-white/[0.05]">
                 <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-2 px-3 py-1 bg-white/5 rounded-lg border border-white/5 text-[10px] font-bold text-slate-300 uppercase tracking-wider">
                       <MapPin className="w-3 h-3 text-blue-400" /> {bond.state}
                    </div>
                    <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity">
                       <ShieldCheck className="w-4 h-4" />
                    </div>
                 </div>
                 
                 <h3 className="text-lg font-bold text-white mb-6 leading-snug line-clamp-2" title={bond.name}>
                    {bond.name}
                 </h3>
                 
                 <a 
                    href={bond.url}
                    target="_blank"
                    rel="noopener noreferrer" 
                    className="mt-auto w-full py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-lg active:scale-95"
                 >
                    Apply Now <ExternalLink className="w-3 h-3" />
                 </a>
              </div>
           ))}
        </div>
      ) : (
         <div className="text-center py-20 max-w-2xl mx-auto">
            <div className="w-20 h-20 bg-blue-500/10 rounded-3xl flex items-center justify-center mx-auto text-blue-400 mb-6 border border-blue-500/20">
               <Search className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">No exact matches found</h3>
            <p className="text-slate-400 mb-8 leading-relaxed text-lg">
               We couldn't find a specific bond matching "{searchTerm}" in {activeState === 'ALL' ? 'our database' : activeState}. 
               However, you can still search our full general bond catalog directly.
            </p>
            
            <a 
              href="https://reducemyinsurance.propeller.insure/axelerator-public"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-8 py-5 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-bold text-lg transition-all shadow-xl shadow-blue-500/20 active:scale-95"
            >
              Launch General Bond Search <ExternalLink className="w-5 h-5" />
            </a>
         </div>
      )}

      {/* Info Section - Updated per Screenshot */}
      <div className="mt-20 glass-card rounded-[3rem] p-12 border-white/10 bg-[#0A101F] overflow-hidden relative">
         {/* Background Glow */}
         <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/5 blur-[120px] rounded-full pointer-events-none"></div>
         
         <div className="relative z-10 flex flex-col md:flex-row items-center gap-8 md:gap-12">
            <div className="w-24 h-24 bg-blue-500 rounded-3xl flex items-center justify-center shadow-2xl shadow-blue-500/20 flex-shrink-0">
               <Zap className="w-10 h-10 text-white" />
            </div>
            
            <div className="flex-grow text-center md:text-left space-y-3">
               <h2 className="text-3xl md:text-4xl font-heading font-bold text-white">Need a specialty bond?</h2>
               <p className="text-slate-400 text-lg leading-relaxed max-w-2xl">
                  If you don't see the specific bond you need listed here, our agents can issue almost any commercial surety bond manually.
               </p>
            </div>
            
            <div className="flex-shrink-0">
               <a 
                  href="https://reducemyinsurance.propeller.insure/axelerator-public" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-10 py-5 bg-white text-slate-950 rounded-2xl font-bold text-lg hover:bg-slate-100 transition-all shadow-xl hover:scale-105 active:scale-95 flex items-center gap-2"
               >
                  Contact Us
               </a>
            </div>
         </div>
      </div>
    </div>
  );
};

export default BondsPage;
