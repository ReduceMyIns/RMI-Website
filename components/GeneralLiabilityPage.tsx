
import React, { useState } from 'react';
import { ArrowLeft, ShieldCheck, Briefcase, Users, AlertCircle, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';
import NowCertsIframe from './NowCertsIframe';
import SEOHead from './SEOHead';

const GeneralLiabilityPage: React.FC = () => {
  const [showQuote, setShowQuote] = useState(false);

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-32">
      <SEOHead 
        title="General Liability Insurance | Murfreesboro Business"
        description="Protect your business from lawsuits with General Liability insurance. Covers bodily injury, property damage, and advertising injury for Murfreesboro businesses."
        canonicalUrl="https://www.reducemyinsurance.net/general-liability"
        keywords={['general liability insurance', 'business liability', 'commercial liability', 'Murfreesboro business insurance']}
      />
      <Link to="/products" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-8 group">
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Products
      </Link>

      <div className="text-center space-y-6 mb-16">
        <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full glass border-indigo-500/20 text-indigo-400 text-[10px] font-bold uppercase tracking-widest">
          <ShieldCheck className="w-3 h-3" /> Business Protection
        </div>
        <h1 className="text-4xl md:text-6xl font-heading font-bold tracking-tight text-white leading-tight">
          General <span className="text-indigo-400">Liability</span>
        </h1>
        <p className="text-slate-400 text-lg leading-relaxed max-w-2xl mx-auto">
          The foundation of your business insurance. Protects against lawsuits for bodily injury, property damage, and advertising injury.
        </p>
      </div>

      {!showQuote ? (
        <div className="space-y-16">
           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="glass-card p-8 rounded-[2.5rem] border-white/5 hover:bg-white/[0.05] transition-all">
                  <div className="w-12 h-12 bg-indigo-500/10 rounded-xl flex items-center justify-center text-indigo-400 mb-6"><Users className="w-6 h-6"/></div>
                  <h3 className="text-xl font-bold text-white mb-3">Bodily Injury</h3>
                  <p className="text-slate-400 text-sm">Covers medical costs and legal fees if a customer slips, falls, or gets hurt on your property.</p>
              </div>
              <div className="glass-card p-8 rounded-[2.5rem] border-white/5 hover:bg-white/[0.05] transition-all">
                  <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center text-purple-400 mb-6"><Briefcase className="w-6 h-6"/></div>
                  <h3 className="text-xl font-bold text-white mb-3">Property Damage</h3>
                  <p className="text-slate-400 text-sm">Pays for repairs if you or your employees accidentally damage a client's property while working.</p>
              </div>
              <div className="glass-card p-8 rounded-[2.5rem] border-white/5 hover:bg-white/[0.05] transition-all">
                  <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-400 mb-6"><FileText className="w-6 h-6"/></div>
                  <h3 className="text-xl font-bold text-white mb-3">Instant COIs</h3>
                  <p className="text-slate-400 text-sm">Get Certificates of Insurance instantly to satisfy landlord or client contract requirements.</p>
              </div>
           </div>

           <div className="glass-card p-10 rounded-[3rem] border-white/10 bg-slate-900/50 text-center space-y-6">
              <h3 className="text-2xl font-bold text-white">Who needs General Liability?</h3>
              <div className="flex flex-wrap justify-center gap-3 text-sm text-slate-300">
                 {['Contractors', 'Retail Stores', 'Restaurants', 'Consultants', 'Landscapers', 'Handymen'].map(tag => (
                    <span key={tag} className="px-4 py-2 bg-white/5 rounded-xl border border-white/5">{tag}</span>
                 ))}
              </div>
              <button 
                  onClick={() => setShowQuote(true)}
                  className="w-full md:w-auto px-12 py-5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-bold text-lg shadow-xl shadow-indigo-500/20 transition-all hover:scale-105 active:scale-95 mt-4"
              >
                  Start GL Quote
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

export default GeneralLiabilityPage;
