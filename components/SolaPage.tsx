
import React from 'react';
import SEOHead from './SEOHead';
import { Link } from 'react-router-dom';
import { 
  Wind, CloudHail, ShieldCheck, DollarSign, ArrowLeft, 
  ExternalLink, AlertTriangle, TrendingDown, Home, CheckCircle2 
} from 'lucide-react';

const SolaPage: React.FC = () => {
  const quoteUrl = "https://www.solainsurance.com/get-quote/service@reducemyinsurance.net";

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-32">
      <SEOHead 
        title="Sola Wind & Hail Insurance | Supplemental Coverage"
        description="Bridge the gap in your home insurance with Sola Wind & Hail. Get fast payouts for deductibles and depreciated roof costs with no adjusters."
        canonicalUrl="https://www.reducemyinsurance.net/sola"
        keywords={['wind insurance', 'hail insurance', 'Sola insurance', 'supplemental homeowners', 'deductible coverage']}
      />
      <Link to="/products" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-8 group">
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Products
      </Link>

      {/* Hero Section */}
      <div className="relative glass-card rounded-[3rem] p-10 md:p-16 border-white/10 overflow-hidden mb-16">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-red-500/10 blur-[120px] rounded-full pointer-events-none"></div>
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1 space-y-6">
            <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full glass border-red-500/20 text-red-400 text-[10px] font-bold uppercase tracking-widest">
              <Wind className="w-3 h-3" /> Supplemental Coverage
            </div>
            <h1 className="text-5xl md:text-7xl font-heading font-bold text-white leading-tight">
              Wind & Hail. <br />
              <span className="text-red-400">Reimagined.</span>
            </h1>
            <p className="text-slate-300 text-lg leading-relaxed max-w-xl">
              Fair prices, Fast payouts, Full peace of mind. Sola covers your deductible and depreciated roof costs when standard insurance falls short.
            </p>
            <div className="flex flex-wrap gap-4 pt-4">
              <a 
                href={quoteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-10 py-4 bg-red-600 hover:bg-red-500 text-white rounded-2xl font-bold text-lg shadow-xl shadow-red-500/20 flex items-center justify-center gap-2 transition-all active:scale-95"
              >
                Get A Quote <ExternalLink className="w-5 h-5" />
              </a>
            </div>
          </div>
          <div className="flex-1 w-full">
             <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-8 rounded-3xl border border-white/10 shadow-2xl relative">
                <div className="absolute -top-6 -right-6 bg-white text-slate-900 p-4 rounded-2xl font-bold shadow-lg transform rotate-6">
                   <div className="text-xs uppercase tracking-wider mb-1 text-slate-500">Fast Payouts</div>
                   <div className="text-2xl">No Adjusters</div>
                </div>
                <div className="space-y-6">
                   <div className="flex items-center gap-4">
                      <div className="p-3 bg-red-500/20 rounded-xl text-red-400"><DollarSign className="w-6 h-6" /></div>
                      <div>
                         <h4 className="font-bold text-white">A Payout for You</h4>
                         <p className="text-slate-400 text-xs">Use funds for repairs, deductibles, or any other expense.</p>
                      </div>
                   </div>
                   <div className="flex items-center gap-4">
                      <div className="p-3 bg-red-500/20 rounded-xl text-red-400"><ShieldCheck className="w-6 h-6" /></div>
                      <div>
                         <h4 className="font-bold text-white">Reinsured & Secure</h4>
                         <p className="text-slate-400 text-xs">Backed by an A-rated reinsurer out of Lloyd's of London.</p>
                      </div>
                   </div>
                   <div className="flex items-center gap-4">
                      <div className="p-3 bg-red-500/20 rounded-xl text-red-400"><Wind className="w-6 h-6" /></div>
                      <div>
                         <h4 className="font-bold text-white">Data-Driven Claims</h4>
                         <p className="text-slate-400 text-xs">We use National Weather Service data to verify events instantly.</p>
                      </div>
                   </div>
                </div>
             </div>
          </div>
        </div>
      </div>

      {/* Problem / Solution Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
         <div className="glass-card p-8 rounded-[2rem] border-white/5 hover:bg-white/[0.05] transition-all">
            <div className="w-12 h-12 bg-red-500/10 rounded-2xl flex items-center justify-center text-red-400 mb-6">
               <TrendingDown className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">High Deductibles?</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
               Sola helps offset higher wind/hail deductible costs by matching your coverage to your home policy.
            </p>
         </div>
         <div className="glass-card p-8 rounded-[2rem] border-white/5 hover:bg-white/[0.05] transition-all">
            <div className="w-12 h-12 bg-red-500/10 rounded-2xl flex items-center justify-center text-red-400 mb-6">
               <Home className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Depreciated Roof?</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
               Sola helps cover your roof in case of wind/hail damage, filling the gap left by roof depreciation (ACV).
            </p>
         </div>
         <div className="glass-card p-8 rounded-[2rem] border-white/5 hover:bg-white/[0.05] transition-all">
            <div className="w-12 h-12 bg-red-500/10 rounded-2xl flex items-center justify-center text-red-400 mb-6">
               <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Increased Premiums?</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
               Lower your primary home premiums by raising your wind/hail deductible, then bridge the gap with Sola.
            </p>
         </div>
      </div>

      {/* Payout Table Section */}
      <div className="max-w-4xl mx-auto space-y-12">
         <div className="text-center space-y-4">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-white">Understanding Policy Payouts</h2>
            <p className="text-slate-400">
               With Sola, you get paid a full dollar amount based on storm intensity, with <span className="text-white font-bold">no deductibles</span>.
            </p>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Wind/Tornado Table */}
            <div className="glass-card rounded-3xl overflow-hidden border-white/10">
               <div className="bg-red-600/20 p-6 border-b border-red-500/20">
                  <h3 className="text-xl font-bold text-white flex items-center gap-2">
                     <Wind className="w-5 h-5 text-red-400" /> Wind / Tornado
                  </h3>
                  <p className="text-xs text-red-200 mt-1">Example based on $25,000 Limit</p>
               </div>
               <div className="p-6 space-y-4">
                  {[
                     { speed: "200+ MPH / EF5", pay: "$25,000.00" },
                     { speed: "165 - 200 MPH / EF4", pay: "$15,000.00" },
                     { speed: "136 - 165 MPH / EF3", pay: "$10,000.00" },
                     { speed: "111 - 135 MPH / EF2", pay: "$5,000.00" },
                     { speed: "86 - 110 MPH / EF1 & EF0", pay: "$3,000.00" },
                  ].map((row, i) => (
                     <div key={i} className="flex justify-between items-center border-b border-white/5 pb-2 last:border-0 last:pb-0">
                        <span className="text-slate-400 font-medium text-sm">{row.speed}</span>
                        <span className="text-white font-bold font-mono">{row.pay}</span>
                     </div>
                  ))}
               </div>
            </div>

            {/* Hail Section */}
            <div className="glass-card rounded-3xl overflow-hidden border-white/10 flex flex-col">
               <div className="bg-blue-600/20 p-6 border-b border-blue-500/20">
                  <h3 className="text-xl font-bold text-white flex items-center gap-2">
                     <CloudHail className="w-5 h-5 text-blue-400" /> Hail
                  </h3>
                  <p className="text-xs text-blue-200 mt-1">Single Tier Trigger</p>
               </div>
               <div className="p-8 flex-grow flex flex-col justify-center items-center text-center space-y-6">
                  <div className="w-32 h-32 rounded-full border-4 border-blue-500/30 flex items-center justify-center relative">
                     <span className="text-3xl font-bold text-white">65%</span>
                     <span className="absolute -bottom-8 text-xs font-bold text-blue-400 uppercase tracking-widest">Hail Score</span>
                  </div>
                  <div className="space-y-2">
                     <h4 className="text-xl font-bold text-white">Pays Your Desired Limit</h4>
                     <p className="text-slate-400 text-sm leading-relaxed">
                        The Hail Score is determined using National Weather Service data, measuring hail size and duration. A score of 65% indicates significant impact.
                     </p>
                  </div>
               </div>
            </div>
         </div>

         {/* Final CTA */}
         <div className="text-center pt-8">
            <a 
                href={quoteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex px-12 py-5 bg-white text-slate-950 rounded-2xl font-bold text-lg hover:bg-slate-100 transition-all shadow-xl items-center gap-3 active:scale-95"
            >
                Get Covered Now <CheckCircle2 className="w-5 h-5 text-green-600" />
            </a>
         </div>
      </div>
    </div>
  );
};

export default SolaPage;
