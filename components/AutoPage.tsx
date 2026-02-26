
import React from 'react';
import { Link } from 'react-router-dom';
import { Car, Shield, Zap, ArrowLeft, CheckCircle2, Navigation, AlertTriangle, DollarSign } from 'lucide-react';
import SEOHead from './SEOHead';

const AutoPage: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-6 py-12 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-32">
      <SEOHead 
        title="Auto Insurance Quotes | Compare 80+ Carriers"
        description="Get the best auto insurance rates in Murfreesboro, TN. We compare Progressive, Travelers, Safeco and more to find you the lowest premiums."
        canonicalUrl="https://www.reducemyinsurance.net/auto"
        keywords={['auto insurance', 'car insurance quotes', 'Progressive insurance', 'Travelers insurance', 'Safeco insurance', 'Murfreesboro TN']}
      />
      <Link to="/products" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-8 group">
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Products
      </Link>

      {/* Hero */}
      <div className="relative glass-card rounded-[3rem] p-10 md:p-16 border-white/10 overflow-hidden mb-16">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none"></div>
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1 space-y-6">
            <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full glass border-blue-500/20 text-blue-400 text-[10px] font-bold uppercase tracking-widest">
              <Car className="w-3 h-3" /> Personal Auto
            </div>
            <h1 className="text-5xl md:text-7xl font-heading font-bold text-white leading-tight">
              Drive <span className="text-blue-400">Smarter.</span>
            </h1>
            <p className="text-slate-300 text-lg leading-relaxed max-w-xl">
              We compare 80+ top-rated carriers including Progressive, Travelers, and Safeco to find you the lowest rate without sacrificing coverage.
            </p>
            <div className="flex flex-wrap gap-4 pt-4">
              <Link 
                to="/apply"
                state={{ preSelected: 'Auto Insurance' }}
                className="px-10 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-bold text-lg shadow-xl shadow-blue-500/20 flex items-center justify-center gap-2 transition-all active:scale-95"
              >
                Start Auto Quote <Zap className="w-5 h-5" />
              </Link>
            </div>
          </div>
          <div className="flex-1 w-full">
             <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-8 rounded-3xl border border-white/10 shadow-2xl space-y-6">
                <div className="flex items-center gap-4">
                   <div className="p-3 bg-blue-500/20 rounded-xl text-blue-400"><DollarSign className="w-6 h-6" /></div>
                   <div>
                      <h4 className="font-bold text-white">Compare & Save</h4>
                      <p className="text-slate-400 text-xs">Our clients save an average of $600/year by switching.</p>
                   </div>
                </div>
                <div className="flex items-center gap-4">
                   <div className="p-3 bg-blue-500/20 rounded-xl text-blue-400"><Shield className="w-6 h-6" /></div>
                   <div>
                      <h4 className="font-bold text-white">Gap & New Car Replacement</h4>
                      <p className="text-slate-400 text-xs">Protect your investment from depreciation in a total loss.</p>
                   </div>
                </div>
                <div className="flex items-center gap-4">
                   <div className="p-3 bg-blue-500/20 rounded-xl text-blue-400"><Navigation className="w-6 h-6" /></div>
                   <div>
                      <h4 className="font-bold text-white">Telematics Discounts</h4>
                      <p className="text-slate-400 text-xs">Option to use driving data for up to 30% additional savings.</p>
                   </div>
                </div>
             </div>
          </div>
        </div>
      </div>

      {/* Coverage Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <div className="glass-card p-8 rounded-[2rem] border-white/5 hover:bg-white/[0.05] transition-all">
            <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2"><Shield className="w-5 h-5 text-blue-400"/> Liability</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
               Covers bodily injury and property damage you cause to others. We recommend at least 100/300/100 limits for asset protection.
            </p>
         </div>
         <div className="glass-card p-8 rounded-[2rem] border-white/5 hover:bg-white/[0.05] transition-all">
            <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2"><Car className="w-5 h-5 text-blue-400"/> Comp & Collision</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
               Covers damage to <em>your</em> vehicle from accidents, theft, vandalism, weather, and animal strikes.
            </p>
         </div>
         <div className="glass-card p-8 rounded-[2rem] border-white/5 hover:bg-white/[0.05] transition-all">
            <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2"><AlertTriangle className="w-5 h-5 text-blue-400"/> Uninsured Motorist</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
               Essential protection that pays for your injuries and damages if you are hit by a driver with no insurance or insufficient coverage.
            </p>
         </div>
      </div>
    </div>
  );
};

export default AutoPage;
