
import React, { useState } from 'react';
import { Anchor, ArrowLeft, Shield, Waves, Ship, CheckCircle2, HelpCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import NowCertsIframe from './NowCertsIframe';

const WatercraftPage: React.FC = () => {
  const [showQuote, setShowQuote] = useState(false);

  return (
    <div className="max-w-6xl mx-auto px-6 py-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <Link to="/products" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-8 group">
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Products
      </Link>

      <div className="text-center space-y-6 mb-12">
        <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full glass border-blue-500/20 text-blue-400 text-[10px] font-bold uppercase tracking-widest">
          <Anchor className="w-3 h-3" /> Marine Division
        </div>
        <h1 className="text-4xl md:text-6xl font-heading font-bold tracking-tight text-white leading-tight">
          Watercraft <span className="text-blue-400">Protection</span>
        </h1>
        <p className="text-slate-400 text-lg leading-relaxed max-w-2xl mx-auto">
          Secure your boat, yacht, or personal watercraft with comprehensive coverage from our top marine carriers.
        </p>
      </div>

      {!showQuote ? (
          <div className="space-y-12">
             {/* Hero / Benefits */}
             <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="glass-card p-8 rounded-[2.5rem] border-white/5 space-y-4">
                    <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-400"><Ship className="w-6 h-6"/></div>
                    <h3 className="text-xl font-bold text-white">Physical Damage</h3>
                    <p className="text-slate-400 text-sm">Coverage for your boat, motor, and trailer against collision, fire, theft, and storms.</p>
                </div>
                <div className="glass-card p-8 rounded-[2.5rem] border-white/5 space-y-4">
                    <div className="w-12 h-12 bg-indigo-500/10 rounded-xl flex items-center justify-center text-indigo-400"><Shield className="w-6 h-6"/></div>
                    <h3 className="text-xl font-bold text-white">Liability Protection</h3>
                    <p className="text-slate-400 text-sm">Coverage for bodily injury or damage to others' property while operating your watercraft.</p>
                </div>
                <div className="glass-card p-8 rounded-[2.5rem] border-white/5 space-y-4">
                    <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-400"><Waves className="w-6 h-6"/></div>
                    <h3 className="text-xl font-bold text-white">Wreck Removal</h3>
                    <p className="text-slate-400 text-sm">Covers the cost of raising, removing, or destroying the wreckage if your boat sinks.</p>
                </div>
             </div>
             
             {/* FAQ Section */}
             <div className="space-y-6">
                <h3 className="text-2xl font-bold text-white text-center">Common Questions</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white/5 p-6 rounded-2xl border border-white/5">
                        <div className="font-bold text-white mb-2 flex items-center gap-2"><HelpCircle className="w-4 h-4 text-blue-400"/> Does this cover my fishing gear?</div>
                        <p className="text-sm text-slate-400">Yes, most of our marine policies offer optional endorsements to cover fishing equipment, personal effects, and accessories.</p>
                    </div>
                    <div className="bg-white/5 p-6 rounded-2xl border border-white/5">
                        <div className="font-bold text-white mb-2 flex items-center gap-2"><HelpCircle className="w-4 h-4 text-blue-400"/> Is towing included?</div>
                        <p className="text-sm text-slate-400">We offer on-water towing and emergency assistance coverage to ensure you're never stranded.</p>
                    </div>
                    <div className="bg-white/5 p-6 rounded-2xl border border-white/5">
                        <div className="font-bold text-white mb-2 flex items-center gap-2"><HelpCircle className="w-4 h-4 text-blue-400"/> What about winter storage?</div>
                        <p className="text-sm text-slate-400">Coverage continues during lay-up periods, protecting your boat while it's in storage or dry dock.</p>
                    </div>
                    <div className="bg-white/5 p-6 rounded-2xl border border-white/5">
                        <div className="font-bold text-white mb-2 flex items-center gap-2"><HelpCircle className="w-4 h-4 text-blue-400"/> Do I need insurance for a Jet Ski?</div>
                        <p className="text-sm text-slate-400">While not always legally required, PWC insurance is highly recommended for liability and theft protection.</p>
                    </div>
                </div>
             </div>

             <div className="glass-card p-10 rounded-[3rem] border-white/10 bg-slate-900/50 flex flex-col md:flex-row items-center gap-10">
                <div className="flex-1 space-y-6">
                    <h3 className="text-2xl font-heading font-bold text-white">Why insure with us?</h3>
                    <ul className="space-y-3">
                        <li className="flex items-center gap-3 text-slate-300"><CheckCircle2 className="w-5 h-5 text-blue-500"/> Agreed Value coverage options</li>
                        <li className="flex items-center gap-3 text-slate-300"><CheckCircle2 className="w-5 h-5 text-blue-500"/> Emergency towing and assistance</li>
                        <li className="flex items-center gap-3 text-slate-300"><CheckCircle2 className="w-5 h-5 text-blue-500"/> Fishing equipment coverage</li>
                        <li className="flex items-center gap-3 text-slate-300"><CheckCircle2 className="w-5 h-5 text-blue-500"/> Uninsured boater protection</li>
                    </ul>
                </div>
                <div className="flex-1 text-center">
                    <button 
                        onClick={() => setShowQuote(true)}
                        className="px-12 py-6 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-bold text-lg shadow-xl shadow-blue-500/20 transition-all hover:scale-105 active:scale-95"
                    >
                        Start Your Quote
                    </button>
                    <p className="text-xs text-slate-500 mt-4">Compare rates from Progressive, Foremost, and more.</p>
                </div>
             </div>
          </div>
      ) : (
        <div className="animate-in fade-in zoom-in-95 duration-500">
            <div className="glass-card rounded-[2rem] p-4 md:p-8 border-white/5 bg-white/5">
                <NowCertsIframe 
                url="https://www1.nowcerts.com/Pages/QuoteRequests/WaterCraft.aspx?AgencyId=7b9d101f-6a6c-40a6-b256-bfd8a901c277" 
                height="1100" 
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

export default WatercraftPage;
