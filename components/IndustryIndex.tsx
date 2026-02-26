import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { INDUSTRIES } from '../data/industryData';
import { SIC_INDUSTRIES, getIconForCategory } from '../data/sicIndustries';
import { Search, ArrowRight, Shield, Globe, FilterX, Sparkles, Hash } from 'lucide-react';
import SEOHead from './SEOHead';

const IndustryIndex: React.FC = () => {
  const [filter, setFilter] = useState('');

  const allIndustries = useMemo(() => {
    // Combine existing INDUSTRIES with SIC_INDUSTRIES
    // Map SIC_INDUSTRIES to match the display format
    const mappedSic = SIC_INDUSTRIES.map(sic => ({
      slug: sic.slug,
      name: sic.name,
      category: sic.category,
      icon: getIconForCategory(sic.category),
      shortDesc: `SIC Code: ${sic.sicCode}. Specialized risk assessment for ${sic.name}.`,
      sicCode: sic.sicCode
    }));

    // Filter out duplicates if any (by slug)
    const existingSlugs = new Set(INDUSTRIES.map(i => i.slug));
    const uniqueSic = mappedSic.filter(s => !existingSlugs.has(s.slug));

    return [...INDUSTRIES, ...uniqueSic];
  }, []);

  const filteredIndustries = useMemo(() => {
    const term = filter.toLowerCase().trim();
    if (!term) return allIndustries;
    return allIndustries.filter(i => {
      return (
        i.name.toLowerCase().includes(term) || 
        i.category.toLowerCase().includes(term) ||
        (i as any).sicCode?.includes(term) ||
        (i as any).keywords?.some((k: string) => k.toLowerCase().includes(term)) ||
        i.shortDesc.toLowerCase().includes(term)
      );
    });
  }, [filter, allIndustries]);

  const categories = useMemo(() => {
    const cats = Array.from(new Set(filteredIndustries.map(i => i.category)));
    return cats.sort();
  }, [filteredIndustries]);

  return (
    <div className="max-w-7xl mx-auto px-6 py-16 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      <SEOHead 
        title="Browse Insurance by Industry & SIC Code"
        description="Search our comprehensive database of insurance risk profiles by industry and SIC code. Find tailored coverage for your specific business."
        canonicalUrl="https://www.reducemyinsurance.net/industries"
        keywords={['industry insurance', 'SIC codes', 'business insurance', 'risk profiles', 'commercial insurance']}
      />
      <div className="text-center max-w-3xl mx-auto space-y-8 mb-16">
        <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full glass border-blue-500/20 text-blue-400 text-[10px] font-bold uppercase tracking-widest">
          <Globe className="w-3 h-3" /> Comprehensive SIC Directory
        </div>
        <h1 className="text-5xl md:text-6xl font-heading font-bold text-white tracking-tight">
          Risk Profiles by <span className="text-blue-400">Industry</span>
        </h1>
        <p className="text-slate-400 text-lg">
          Browse our autonomous risk database covering {allIndustries.length}+ professions across the major SIC groups. Find your specific niche for tailored AI underwriting.
        </p>
        
        <div className="relative max-w-xl mx-auto group">
          <div className="absolute inset-0 bg-blue-600/5 blur-2xl rounded-full opacity-0 group-focus-within:opacity-100 transition-opacity"></div>
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5 group-focus-within:text-blue-400 transition-colors" />
          <input 
            type="text" 
            placeholder="Search by profession, SIC code, or keyword..." 
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="relative w-full pl-14 pr-6 py-5 bg-white/5 border border-white/10 rounded-3xl text-white outline-none focus:border-blue-500/50 transition-all text-lg placeholder:text-slate-600 shadow-2xl"
          />
          
          {/* Prefill / Suggestions Overlay */}
          {filter && filteredIndustries.length > 0 && filteredIndustries.length < 10 && (
            <div className="absolute top-full left-0 right-0 mt-2 glass rounded-2xl border border-white/10 overflow-hidden z-50 shadow-2xl">
              {filteredIndustries.slice(0, 5).map(ind => (
                <Link 
                  key={ind.slug} 
                  to={`/insurance/${ind.slug}`}
                  className="flex items-center gap-4 p-4 hover:bg-white/5 transition-colors border-b border-white/5 last:border-0"
                >
                  <div className="w-8 h-8 bg-blue-500/10 rounded-lg flex items-center justify-center text-blue-400">
                    <ind.icon className="w-4 h-4" />
                  </div>
                  <div className="text-left">
                    <div className="text-sm font-bold text-white">{ind.name}</div>
                    <div className="text-[10px] text-slate-500 uppercase tracking-widest">{ind.category} {(ind as any).sicCode ? `• SIC ${ind.sicCode}` : ''}</div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="space-y-20 min-h-[40vh]">
        {categories.length > 0 ? categories.map(cat => {
          const catIndustries = filteredIndustries.filter(i => i.category === cat);
          
          return (
            <div key={cat} className="space-y-8">
              <div className="flex items-center gap-6">
                <h2 className="text-xl font-bold text-white uppercase tracking-[0.3em] shrink-0">{cat}</h2>
                <div className="h-px flex-grow bg-gradient-to-r from-white/10 to-transparent"></div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {catIndustries.map(ind => (
                  <Link 
                    key={ind.slug} 
                    to={`/insurance/${ind.slug}`}
                    className="group glass-card p-6 rounded-2xl border-white/5 hover:bg-white/[0.05] hover:border-blue-500/30 transition-all duration-300 flex flex-col h-full"
                  >
                    <div className="flex items-start justify-between mb-4">
                        <div className="w-10 h-10 bg-blue-600/10 rounded-xl flex items-center justify-center text-blue-400 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all">
                        <ind.icon className="w-5 h-5" />
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-700 group-hover:text-blue-400 group-hover:translate-x-1 transition-all" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">
                        {ind.name}
                      </h3>
                      <p className="text-slate-500 text-xs leading-relaxed line-clamp-2">
                        {ind.shortDesc}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          );
        }) : (
            <div className="text-center py-20 flex flex-col items-center gap-4">
                <FilterX className="w-16 h-16 text-slate-800" />
                <h3 className="text-xl font-bold text-slate-500">No matching industries found</h3>
                <button 
                    onClick={() => setFilter('')}
                    className="text-blue-400 font-bold uppercase tracking-widest text-xs hover:text-blue-300"
                >
                    Clear Filter
                </button>
            </div>
        )}
      </div>

      <div className="mt-32 p-12 glass-card rounded-[3rem] border-white/5 bg-blue-600/5 text-center space-y-6">
         <h2 className="text-3xl font-heading font-bold text-white">Profession Not Found?</h2>
         <p className="text-slate-400 max-w-2xl mx-auto">
            Our AI engine can dynamically underwrite virtually any business category or special asset. Launch a custom scan to build your specific risk profile.
         </p>
         <Link to="/apply" className="inline-flex px-10 py-4 bg-white text-slate-900 rounded-2xl font-bold hover:bg-blue-50 transition-colors shadow-xl items-center gap-3 active:scale-95">
            Start Custom AI Market Scan <Sparkles className="w-5 h-5 text-blue-500" />
         </Link>
      </div>
    </div>
  );
};

export default IndustryIndex;