
import React from 'react';
import { Link } from 'react-router-dom';
import { Home, ShieldCheck, ArrowLeft, Umbrella, Wind, Flame, Droplets, Zap } from 'lucide-react';

const HomePage: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-6 py-12 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-32">
      <Link to="/products" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-8 group">
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Products
      </Link>

      <div className="relative glass-card rounded-[3rem] p-10 md:p-16 border-white/10 overflow-hidden mb-16">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-emerald-600/10 blur-[120px] rounded-full pointer-events-none"></div>
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1 space-y-6">
            <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full glass border-emerald-500/20 text-emerald-400 text-[10px] font-bold uppercase tracking-widest">
              <Home className="w-3 h-3" /> Homeowners (HO-3 / HO-5)
            </div>
            <h1 className="text-5xl md:text-7xl font-heading font-bold text-white leading-tight">
              Sanctuary <span className="text-emerald-400">Secured.</span>
            </h1>
            <p className="text-slate-300 text-lg leading-relaxed max-w-xl">
              AI-driven replacement cost analysis ensures you are never underinsured. We protect your home from fire, theft, wind, and liability.
            </p>
            <div className="flex flex-wrap gap-4 pt-4">
              <Link 
                to="/apply"
                state={{ preSelected: 'Homeowners' }}
                className="px-10 py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl font-bold text-lg shadow-xl shadow-emerald-500/20 flex items-center justify-center gap-2 transition-all active:scale-95"
              >
                Analyze Home Risk <ShieldCheck className="w-5 h-5" />
              </Link>
            </div>
          </div>
          <div className="flex-1 w-full">
             <div className="bg-slate-900/50 p-8 rounded-3xl border border-white/10 grid grid-cols-2 gap-4">
                <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                    <Flame className="w-8 h-8 text-orange-500 mb-3" />
                    <div className="font-bold text-white">Fire & Smoke</div>
                    <p className="text-xs text-slate-400 mt-1">100% Replacement Cost</p>
                </div>
                <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                    <Wind className="w-8 h-8 text-blue-400 mb-3" />
                    <div className="font-bold text-white">Wind & Hail</div>
                    <p className="text-xs text-slate-400 mt-1">Roof Replacement</p>
                </div>
                <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                    <Droplets className="w-8 h-8 text-cyan-400 mb-3" />
                    <div className="font-bold text-white">Water Damage</div>
                    <p className="text-xs text-slate-400 mt-1">Internal leaks & bursts</p>
                </div>
                <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                    <Umbrella className="w-8 h-8 text-purple-400 mb-3" />
                    <div className="font-bold text-white">Liability</div>
                    <p className="text-xs text-slate-400 mt-1">Lawsuit Protection</p>
                </div>
             </div>
          </div>
        </div>
      </div>

      <div className="bg-blue-600/10 border border-blue-500/20 p-8 rounded-[2rem] flex flex-col md:flex-row items-center gap-8">
         <div className="p-4 bg-blue-500/20 rounded-full text-blue-400">
            <Zap className="w-8 h-8" />
         </div>
         <div className="flex-grow">
            <h3 className="text-xl font-bold text-white mb-2">Bundle & Save</h3>
            <p className="text-slate-300 text-sm">Combine your Home and Auto insurance to unlock the "Multi-Policy Discount," saving you up to 20% on both premiums.</p>
         </div>
         <Link to="/apply" className="px-8 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold text-sm">Bundle Now</Link>
      </div>
    </div>
  );
};

export default HomePage;
