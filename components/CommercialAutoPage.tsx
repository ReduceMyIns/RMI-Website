
import React, { useState } from 'react';
import { ArrowLeft, Truck, Hammer, ShieldAlert, Route } from 'lucide-react';
import { Link } from 'react-router-dom';
import NowCertsIframe from './NowCertsIframe';
import SEOHead from './SEOHead';

const CommercialAutoPage: React.FC = () => {
  const [showQuote, setShowQuote] = useState(false);

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-32">
      <SEOHead 
        title="Commercial Auto Insurance | Fleet & Truck Quotes"
        description="Specialized commercial auto insurance for Murfreesboro businesses. Coverage for work trucks, delivery vans, and employee-operated fleets."
        canonicalUrl="https://www.reducemyinsurance.net/commercial-auto"
        keywords={['commercial auto insurance', 'fleet insurance', 'truck insurance', 'business vehicle insurance', 'Murfreesboro TN']}
      />
      <Link to="/products" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-8 group">
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Products
      </Link>

      <div className="text-center space-y-6 mb-16">
        <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full glass border-orange-500/20 text-orange-400 text-[10px] font-bold uppercase tracking-widest">
          <Truck className="w-3 h-3" /> Fleet & Logistics
        </div>
        <h1 className="text-4xl md:text-6xl font-heading font-bold tracking-tight text-white leading-tight">
          Commercial <span className="text-orange-400">Auto</span>
        </h1>
        <p className="text-slate-400 text-lg leading-relaxed max-w-2xl mx-auto">
          Whether you have one work truck or a fleet of delivery vans, protect your business vehicles with specialized commercial coverage.
        </p>
      </div>

      {!showQuote ? (
        <div className="space-y-16">
           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="glass-card p-8 rounded-[2.5rem] border-white/5 hover:bg-white/[0.05] transition-all">
                  <div className="w-12 h-12 bg-orange-500/10 rounded-xl flex items-center justify-center text-orange-400 mb-6"><Truck className="w-6 h-6"/></div>
                  <h3 className="text-xl font-bold text-white mb-3">Any Vehicle</h3>
                  <p className="text-slate-400 text-sm">Pickup trucks, box trucks, vans, dump trucks, and private passenger vehicles titled to the business.</p>
              </div>
              <div className="glass-card p-8 rounded-[2.5rem] border-white/5 hover:bg-white/[0.05] transition-all">
                  <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-400 mb-6"><Hammer className="w-6 h-6"/></div>
                  <h3 className="text-xl font-bold text-white mb-3">Tools & Equipment</h3>
                  <p className="text-slate-400 text-sm">Optional coverage for tools and materials stored inside your vehicle or attached to it.</p>
              </div>
              <div className="glass-card p-8 rounded-[2.5rem] border-white/5 hover:bg-white/[0.05] transition-all">
                  <div className="w-12 h-12 bg-red-500/10 rounded-xl flex items-center justify-center text-red-400 mb-6"><ShieldAlert className="w-6 h-6"/></div>
                  <h3 className="text-xl font-bold text-white mb-3">Higher Limits</h3>
                  <p className="text-slate-400 text-sm">Commercial policies offer liability limits up to $1M or more (CSL) to protect your company assets.</p>
              </div>
           </div>

           <div className="glass-card p-10 rounded-[3rem] border-white/10 bg-slate-900/50 flex flex-col md:flex-row items-center gap-12">
              <div className="flex-1 space-y-6">
                  <h3 className="text-2xl font-heading font-bold text-white">Coverage for all uses:</h3>
                  <ul className="space-y-4">
                      <li className="flex items-center gap-3 text-slate-300"><Route className="w-5 h-5 text-orange-500"/> Delivery & Logistics</li>
                      <li className="flex items-center gap-3 text-slate-300"><Route className="w-5 h-5 text-orange-500"/> Contractors & Tradesmen</li>
                      <li className="flex items-center gap-3 text-slate-300"><Route className="w-5 h-5 text-orange-500"/> Sales & Real Estate</li>
                      <li className="flex items-center gap-3 text-slate-300"><Route className="w-5 h-5 text-orange-500"/> Non-Owned Auto (Employees driving own cars)</li>
                  </ul>
              </div>
              <div className="flex-1 text-center">
                  <button 
                      onClick={() => setShowQuote(true)}
                      className="w-full py-5 bg-orange-600 hover:bg-orange-500 text-white rounded-2xl font-bold text-lg shadow-xl shadow-orange-500/20 transition-all hover:scale-105 active:scale-95"
                  >
                      Start Commercial Auto Quote
                  </button>
              </div>
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

export default CommercialAutoPage;
