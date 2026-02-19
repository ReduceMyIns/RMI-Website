
import React from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, Truck, Users, Building, ArrowLeft, ShieldCheck, FileText, CheckCircle2 } from 'lucide-react';

const CommercialLinesPage: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-6 py-12 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-32">
      <Link to="/products" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-8 group">
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Products
      </Link>

      <div className="text-center space-y-6 mb-16">
        <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full glass border-indigo-500/20 text-indigo-400 text-[10px] font-bold uppercase tracking-widest">
          <Briefcase className="w-3 h-3" /> Commercial Division
        </div>
        <h1 className="text-5xl md:text-7xl font-heading font-bold text-white leading-tight">
          Business <span className="text-indigo-400">Resilience.</span>
        </h1>
        <p className="text-slate-400 text-lg leading-relaxed max-w-2xl mx-auto">
          From General Liability to Fleet Auto, we shop 40+ commercial carriers like Travelers, Liberty Mutual, and Next to secure your operations.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
         {/* General Liability */}
         <div className="glass-card p-8 rounded-[2.5rem] border-white/5 hover:bg-white/[0.05] transition-all group">
            <div className="w-14 h-14 bg-indigo-500/10 rounded-2xl flex items-center justify-center text-indigo-400 mb-6">
               <ShieldCheck className="w-7 h-7" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">General Liability</h3>
            <p className="text-slate-400 text-sm mb-6">
               The foundation of business protection. Covers third-party bodily injury, property damage, and advertising injury lawsuits.
            </p>
            <ul className="space-y-2 mb-6 text-sm text-slate-300">
               <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-500" /> Slip & Fall Coverage</li>
               <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-500" /> Property Damage Liability</li>
               <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-500" /> Instant COI Generation</li>
            </ul>
            <Link to="/apply" state={{ preSelected: 'General Liability' }} className="text-indigo-400 font-bold uppercase text-xs tracking-widest hover:text-white transition-colors">Start Quote &rarr;</Link>
         </div>

         {/* Workers Comp */}
         <div className="glass-card p-8 rounded-[2.5rem] border-white/5 hover:bg-white/[0.05] transition-all group">
            <div className="w-14 h-14 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-400 mb-6">
               <Users className="w-7 h-7" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">Workers' Comp</h3>
            <p className="text-slate-400 text-sm mb-6">
               Mandatory for most businesses with employees. Covers medical costs and lost wages for work-related injuries.
            </p>
            <ul className="space-y-2 mb-6 text-sm text-slate-300">
               <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-500" /> Medical Expenses</li>
               <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-500" /> Lost Wages Protection</li>
               <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-500" /> Employer's Liability</li>
            </ul>
            <Link to="/apply" state={{ preSelected: 'Workers Comp' }} className="text-blue-400 font-bold uppercase text-xs tracking-widest hover:text-white transition-colors">Start Quote &rarr;</Link>
         </div>

         {/* Commercial Auto */}
         <div className="glass-card p-8 rounded-[2.5rem] border-white/5 hover:bg-white/[0.05] transition-all group">
            <div className="w-14 h-14 bg-orange-500/10 rounded-2xl flex items-center justify-center text-orange-400 mb-6">
               <Truck className="w-7 h-7" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">Commercial Auto</h3>
            <p className="text-slate-400 text-sm mb-6">
               For contractors, fleets, and delivery. Covers vehicles owned by the business and employee-operated risks.
            </p>
            <Link to="/apply" state={{ preSelected: 'Commercial Auto' }} className="text-orange-400 font-bold uppercase text-xs tracking-widest hover:text-white transition-colors">Start Quote &rarr;</Link>
         </div>

         {/* BOP */}
         <div className="glass-card p-8 rounded-[2.5rem] border-white/5 hover:bg-white/[0.05] transition-all group">
            <div className="w-14 h-14 bg-purple-500/10 rounded-2xl flex items-center justify-center text-purple-400 mb-6">
               <Building className="w-7 h-7" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">Business Owners (BOP)</h3>
            <p className="text-slate-400 text-sm mb-6">
               A bundled policy that combines General Liability with Property/Equipment coverage for comprehensive protection.
            </p>
            <Link to="/apply" state={{ preSelected: 'Business Owners Policy' }} className="text-purple-400 font-bold uppercase text-xs tracking-widest hover:text-white transition-colors">Start Quote &rarr;</Link>
         </div>
      </div>
    </div>
  );
};

export default CommercialLinesPage;
