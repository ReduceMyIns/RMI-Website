
import React from 'react';
import { Link } from 'react-router-dom';
import { Umbrella, Shield, ArrowLeft, TrendingUp, AlertOctagon, Scale } from 'lucide-react';

const UmbrellaPage: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-6 py-12 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-32">
      <Link to="/products" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-8 group">
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Products
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-20">
         <div className="space-y-8">
            <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full glass border-yellow-500/20 text-yellow-400 text-[10px] font-bold uppercase tracking-widest">
              <Umbrella className="w-3 h-3" /> Excess Liability
            </div>
            <h1 className="text-5xl md:text-7xl font-heading font-bold text-white leading-tight">
              The Ultimate <span className="text-yellow-400">Safety Net.</span>
            </h1>
            <p className="text-slate-400 text-lg leading-relaxed">
              Standard auto and home policies have limits. Umbrella insurance provides an extra $1M to $5M of liability coverage to protect your future earnings and assets from major lawsuits.
            </p>
            <div className="flex flex-wrap gap-4 pt-4">
              <Link 
                to="/apply"
                state={{ preSelected: 'Umbrella' }}
                className="px-10 py-4 bg-yellow-600 hover:bg-yellow-500 text-white rounded-2xl font-bold text-lg shadow-xl shadow-yellow-500/20 flex items-center justify-center gap-2 transition-all active:scale-95"
              >
                Get Umbrella Quote <Shield className="w-5 h-5" />
              </Link>
            </div>
         </div>
         <div className="glass-card p-10 rounded-[3rem] border-white/10 relative overflow-hidden bg-gradient-to-br from-slate-900 to-slate-800">
            <div className="space-y-6 relative z-10">
               <h3 className="text-2xl font-bold text-white border-b border-white/10 pb-4">Why do I need this?</h3>
               <div className="flex gap-4">
                  <div className="p-3 bg-red-500/20 rounded-xl text-red-400 h-fit"><AlertOctagon className="w-6 h-6" /></div>
                  <div>
                     <h4 className="font-bold text-white">Serious Accidents</h4>
                     <p className="text-sm text-slate-400">If you cause a multi-car accident, medical bills can easily exceed your $250k or $500k auto limits.</p>
                  </div>
               </div>
               <div className="flex gap-4">
                  <div className="p-3 bg-red-500/20 rounded-xl text-red-400 h-fit"><Scale className="w-6 h-6" /></div>
                  <div>
                     <h4 className="font-bold text-white">Legal Defense</h4>
                     <p className="text-sm text-slate-400">Umbrella policies often cover legal defense costs outside of the policy limit.</p>
                  </div>
               </div>
               <div className="flex gap-4">
                  <div className="p-3 bg-red-500/20 rounded-xl text-red-400 h-fit"><TrendingUp className="w-6 h-6" /></div>
                  <div>
                     <h4 className="font-bold text-white">Asset Protection</h4>
                     <p className="text-sm text-slate-400">Protects your home equity, retirement savings, and future wages from garnishment.</p>
                  </div>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};

export default UmbrellaPage;
