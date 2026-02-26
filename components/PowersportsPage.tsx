
import React, { useState } from 'react';
import { Bike, ArrowLeft, Shield, Mountain, Zap, CheckCircle2, HelpCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import NowCertsIframe from './NowCertsIframe';
import SEOHead from './SEOHead';

const PowersportsPage: React.FC = () => {
  const [showQuote, setShowQuote] = useState(false);

  return (
    <div className="max-w-6xl mx-auto px-6 py-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <SEOHead 
        title="Motorcycle & Powersports Insurance | Off-Road Quotes"
        description="Get customized insurance for your motorcycle, ATV, UTV, or dirt bike. Specialized coverage for Murfreesboro riders from top powersports carriers."
        canonicalUrl="https://www.reducemyinsurance.net/powersports"
        keywords={['motorcycle insurance', 'ATV insurance', 'UTV insurance', 'powersports insurance', 'Murfreesboro TN']}
      />
      <Link to="/products" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-8 group">
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Products
      </Link>

      <div className="text-center space-y-6 mb-12">
        <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full glass border-blue-500/20 text-blue-400 text-[10px] font-bold uppercase tracking-widest">
          <Bike className="w-3 h-3" /> Powersports Division
        </div>
        <h1 className="text-4xl md:text-6xl font-heading font-bold tracking-tight text-white leading-tight">
          Motorcycle & <span className="text-blue-400">Off-Road</span>
        </h1>
        <p className="text-slate-400 text-lg leading-relaxed max-w-2xl mx-auto">
          Get customized coverage for your motorcycle, ATV, UTV, or side-by-side. We compare specialized carriers to find the best rate for your ride.
        </p>
      </div>

      {!showQuote ? (
          <div className="space-y-12">
             <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="glass-card p-8 rounded-[2.5rem] border-white/5 space-y-4">
                    <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center text-purple-400"><Shield className="w-6 h-6"/></div>
                    <h3 className="text-xl font-bold text-white">Full Protection</h3>
                    <p className="text-slate-400 text-sm">Comprehensive and Collision coverage to repair or replace your bike after an accident.</p>
                </div>
                <div className="glass-card p-8 rounded-[2.5rem] border-white/5 space-y-4">
                    <div className="w-12 h-12 bg-orange-500/10 rounded-xl flex items-center justify-center text-orange-400"><Mountain className="w-6 h-6"/></div>
                    <h3 className="text-xl font-bold text-white">Off-Road Ready</h3>
                    <p className="text-slate-400 text-sm">Specialized coverage for ATVs and UTVs, including trail riding and transport.</p>
                </div>
                <div className="glass-card p-8 rounded-[2.5rem] border-white/5 space-y-4">
                    <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-400"><Zap className="w-6 h-6"/></div>
                    <h3 className="text-xl font-bold text-white">Custom Accessories</h3>
                    <p className="text-slate-400 text-sm">Coverage for upgrades, sidecars, custom paint, and riding gear.</p>
                </div>
             </div>

             {/* FAQ Section */}
             <div className="space-y-6">
                <h3 className="text-2xl font-bold text-white text-center">Rider FAQ</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white/5 p-6 rounded-2xl border border-white/5">
                        <div className="font-bold text-white mb-2 flex items-center gap-2"><HelpCircle className="w-4 h-4 text-purple-400"/> Does this cover my passenger?</div>
                        <p className="text-sm text-slate-400">Yes, Guest Passenger Liability is available to cover medical expenses if a passenger is injured on your bike.</p>
                    </div>
                    <div className="bg-white/5 p-6 rounded-2xl border border-white/5">
                        <div className="font-bold text-white mb-2 flex items-center gap-2"><HelpCircle className="w-4 h-4 text-purple-400"/> Is my helmet covered?</div>
                        <p className="text-sm text-slate-400">Most policies include coverage for safety apparel like helmets, jackets, and boots up to a certain limit.</p>
                    </div>
                    <div className="bg-white/5 p-6 rounded-2xl border border-white/5">
                        <div className="font-bold text-white mb-2 flex items-center gap-2"><HelpCircle className="w-4 h-4 text-purple-400"/> Do you insure custom choppers?</div>
                        <p className="text-sm text-slate-400">Absolutely. We offer Agreed Value coverage for custom builds to ensure you get the full value of your investment.</p>
                    </div>
                    <div className="bg-white/5 p-6 rounded-2xl border border-white/5">
                        <div className="font-bold text-white mb-2 flex items-center gap-2"><HelpCircle className="w-4 h-4 text-purple-400"/> What about lay-up periods?</div>
                        <p className="text-sm text-slate-400">Save money during the off-season with lay-up options that reduce premiums while the bike is stored.</p>
                    </div>
                </div>
             </div>

             <div className="glass-card p-10 rounded-[3rem] border-white/10 bg-slate-900/50 flex flex-col md:flex-row items-center gap-10">
                <div className="flex-1 space-y-6">
                    <h3 className="text-2xl font-heading font-bold text-white">We Cover It All</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="flex items-center gap-3 text-slate-300"><CheckCircle2 className="w-4 h-4 text-purple-500"/> Cruisers & Tourers</div>
                        <div className="flex items-center gap-3 text-slate-300"><CheckCircle2 className="w-4 h-4 text-purple-500"/> Sport Bikes</div>
                        <div className="flex items-center gap-3 text-slate-300"><CheckCircle2 className="w-4 h-4 text-purple-500"/> ATVs & Side-by-Sides</div>
                        <div className="flex items-center gap-3 text-slate-300"><CheckCircle2 className="w-4 h-4 text-purple-500"/> Scooters & Mopeds</div>
                        <div className="flex items-center gap-3 text-slate-300"><CheckCircle2 className="w-4 h-4 text-purple-500"/> Dirt Bikes</div>
                        <div className="flex items-center gap-3 text-slate-300"><CheckCircle2 className="w-4 h-4 text-purple-500"/> Golf Carts</div>
                    </div>
                </div>
                <div className="flex-1 text-center">
                    <button 
                        onClick={() => setShowQuote(true)}
                        className="px-12 py-6 bg-purple-600 hover:bg-purple-500 text-white rounded-2xl font-bold text-lg shadow-xl shadow-purple-500/20 transition-all hover:scale-105 active:scale-95"
                    >
                        Start Your Quote
                    </button>
                    <p className="text-xs text-slate-500 mt-4">Takes about 3 minutes.</p>
                </div>
             </div>
          </div>
      ) : (
        <div className="animate-in fade-in zoom-in-95 duration-500">
            <div className="glass-card rounded-[2rem] p-4 md:p-8 border-white/5 bg-white/5">
                <NowCertsIframe 
                url="https://www1.nowcerts.com/Pages/QuoteRequests/Motorcycle.aspx?AgencyId=7b9d101f-6a6c-40a6-b256-bfd8a901c277" 
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

export default PowersportsPage;
