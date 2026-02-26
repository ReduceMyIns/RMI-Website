
import React, { useState } from 'react';
import { ArrowLeft, Building, Layers, Zap, Package } from 'lucide-react';
import { Link } from 'react-router-dom';
import NowCertsIframe from './NowCertsIframe';
import SEOHead from './SEOHead';

const BusinessOwnersPage: React.FC = () => {
  const [showQuote, setShowQuote] = useState(false);

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-32">
      <SEOHead 
        title="Business Owners Policy (BOP) | Bundled Insurance"
        description="Save on business insurance with a BOP. Combines General Liability, Property, and Business Income coverage for Murfreesboro small businesses."
        canonicalUrl="https://www.reducemyinsurance.net/bop"
        keywords={['business owners policy', 'BOP insurance', 'bundled business insurance', 'small business insurance', 'Murfreesboro TN']}
      />
      <Link to="/products" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-8 group">
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Products
      </Link>

      <div className="text-center space-y-6 mb-16">
        <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full glass border-purple-500/20 text-purple-400 text-[10px] font-bold uppercase tracking-widest">
          <Building className="w-3 h-3" /> Bundled Coverage
        </div>
        <h1 className="text-4xl md:text-6xl font-heading font-bold tracking-tight text-white leading-tight">
          Business Owners <span className="text-purple-400">Policy (BOP)</span>
        </h1>
        <p className="text-slate-400 text-lg leading-relaxed max-w-2xl mx-auto">
          The ultimate bundle for small businesses. Combines General Liability, Commercial Property, and Business Income insurance into one affordable package.
        </p>
      </div>

      {!showQuote ? (
        <div className="space-y-16">
           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="glass-card p-8 rounded-[2.5rem] border-white/5 hover:bg-white/[0.05] transition-all">
                  <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center text-purple-400 mb-6"><Layers className="w-6 h-6"/></div>
                  <h3 className="text-xl font-bold text-white mb-3">All-in-One</h3>
                  <p className="text-slate-400 text-sm">Get Liability, Property, and Equipment Breakdown coverage in a single policy.</p>
              </div>
              <div className="glass-card p-8 rounded-[2.5rem] border-white/5 hover:bg-white/[0.05] transition-all">
                  <div className="w-12 h-12 bg-indigo-500/10 rounded-xl flex items-center justify-center text-indigo-400 mb-6"><Zap className="w-6 h-6"/></div>
                  <h3 className="text-xl font-bold text-white mb-3">Business Income</h3>
                  <p className="text-slate-400 text-sm">Replaces lost revenue if your business is forced to close temporarily due to a covered loss (like a fire).</p>
              </div>
              <div className="glass-card p-8 rounded-[2.5rem] border-white/5 hover:bg-white/[0.05] transition-all">
                  <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-400 mb-6"><Package className="w-6 h-6"/></div>
                  <h3 className="text-xl font-bold text-white mb-3">Inventory</h3>
                  <p className="text-slate-400 text-sm">Protects your stock, raw materials, and goods against theft, fire, or damage.</p>
              </div>
           </div>

           <div className="bg-gradient-to-br from-purple-900/50 to-indigo-900/50 border border-white/10 rounded-[3rem] p-10 text-center space-y-6">
              <h3 className="text-2xl font-bold text-white">Ideal for Small Business</h3>
              <p className="text-slate-300 max-w-xl mx-auto">
                 Perfect for retail stores, restaurants, offices, and service providers who need comprehensive coverage without buying separate policies.
              </p>
              <button 
                  onClick={() => setShowQuote(true)}
                  className="px-12 py-5 bg-purple-600 hover:bg-purple-500 text-white rounded-2xl font-bold text-lg shadow-xl shadow-purple-500/20 transition-all hover:scale-105 active:scale-95"
              >
                  Start BOP Quote
              </button>
           </div>
        </div>
      ) : (
        <div className="animate-in fade-in zoom-in-95 duration-500">
            <div className="glass-card rounded-[2rem] p-4 md:p-8 border-white/5 bg-white/5">
                <NowCertsIframe 
                url="https://www1.nowcerts.com/Pages/QuoteRequests/CommercialPackage.aspx?AgencyId=7b9d101f-6a6c-40a6-b256-bfd8a901c277" 
                height="1200" 
                />
            </div>
            <div className="text-center mt-6">
                <button onClick={() => setShowQuote(false)} className="text-sm text-slate-500 hover:text-white underline">Cancel Quote</button>
            </div>
        </div>
      )}
    </div>
  );
};

export default BusinessOwnersPage;
