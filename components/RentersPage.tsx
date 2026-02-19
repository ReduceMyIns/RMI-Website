
import React from 'react';
import { Link } from 'react-router-dom';
import { Key, Laptop, ArrowLeft, DollarSign, Sofa, Dog } from 'lucide-react';

const RentersPage: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-6 py-12 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-32">
      <Link to="/products" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-8 group">
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Products
      </Link>

      <div className="text-center space-y-6 mb-16">
        <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full glass border-indigo-500/20 text-indigo-400 text-[10px] font-bold uppercase tracking-widest">
          <Key className="w-3 h-3" /> Renters (HO-4)
        </div>
        <h1 className="text-5xl md:text-7xl font-heading font-bold text-white leading-tight">
          Protect Your <span className="text-indigo-400">Stuff.</span>
        </h1>
        <p className="text-slate-400 text-lg leading-relaxed max-w-2xl mx-auto">
          Your landlord's insurance covers the building, not your belongings. For as little as $15/month, protect your electronics, furniture, and liability.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-16">
         <div className="glass-card p-8 rounded-[2rem] text-center space-y-4 hover:bg-white/[0.05] transition-all">
            <div className="w-16 h-16 bg-indigo-500/10 rounded-full flex items-center justify-center mx-auto text-indigo-400">
               <Laptop className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-white">Personal Property</h3>
            <p className="text-slate-400 text-sm">Replacement cost for your phone, laptop, clothes, and furniture if stolen or damaged.</p>
         </div>
         <div className="glass-card p-8 rounded-[2rem] text-center space-y-4 hover:bg-white/[0.05] transition-all">
            <div className="w-16 h-16 bg-indigo-500/10 rounded-full flex items-center justify-center mx-auto text-indigo-400">
               <Sofa className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-white">Loss of Use</h3>
            <p className="text-slate-400 text-sm">Pays for a hotel and food if your apartment becomes unlivable due to fire or water damage.</p>
         </div>
         <div className="glass-card p-8 rounded-[2rem] text-center space-y-4 hover:bg-white/[0.05] transition-all">
            <div className="w-16 h-16 bg-indigo-500/10 rounded-full flex items-center justify-center mx-auto text-indigo-400">
               <Dog className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-white">Personal Liability</h3>
            <p className="text-slate-400 text-sm">Coverage if a guest is injured in your home or if your dog accidentally bites someone.</p>
         </div>
      </div>

      <div className="text-center">
         <Link 
            to="/apply"
            state={{ preSelected: 'Renters' }}
            className="px-12 py-5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-bold text-lg shadow-xl shadow-indigo-500/20 inline-flex items-center gap-3 transition-all active:scale-95"
         >
            Get Covered ($15/mo avg) <DollarSign className="w-5 h-5" />
         </Link>
      </div>
    </div>
  );
};

export default RentersPage;
