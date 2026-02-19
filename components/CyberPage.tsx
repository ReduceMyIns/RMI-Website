
import React from 'react';
import { Link } from 'react-router-dom';
import { Lock, Server, ArrowLeft, ShieldAlert, Fingerprint, Database } from 'lucide-react';

const CyberPage: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-6 py-12 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-32">
      <Link to="/products" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-8 group">
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Products
      </Link>

      <div className="text-center space-y-6 mb-16">
        <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full glass border-cyan-500/20 text-cyan-400 text-[10px] font-bold uppercase tracking-widest">
          <Lock className="w-3 h-3" /> Data Protection
        </div>
        <h1 className="text-5xl md:text-7xl font-heading font-bold text-white leading-tight">
          Cyber <span className="text-cyan-400">Security.</span>
        </h1>
        <p className="text-slate-400 text-lg leading-relaxed max-w-2xl mx-auto">
          Protect your business from data breaches, ransomware, and phishing attacks. Cyber Liability covers notification costs, legal fees, and data recovery.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
         <div className="glass-card p-8 rounded-[2rem] text-center space-y-4 hover:bg-white/[0.05] transition-all">
            <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto text-red-400">
               <ShieldAlert className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-white">Ransomware</h3>
            <p className="text-slate-400 text-sm">Covers extortion payments and expert negotiation if your systems are held hostage.</p>
         </div>
         <div className="glass-card p-8 rounded-[2rem] text-center space-y-4 hover:bg-white/[0.05] transition-all">
            <div className="w-16 h-16 bg-cyan-500/10 rounded-full flex items-center justify-center mx-auto text-cyan-400">
               <Database className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-white">Data Breach</h3>
            <p className="text-slate-400 text-sm">Pays for mandatory client notifications, credit monitoring, and forensic IT investigations.</p>
         </div>
         <div className="glass-card p-8 rounded-[2rem] text-center space-y-4 hover:bg-white/[0.05] transition-all">
            <div className="w-16 h-16 bg-purple-500/10 rounded-full flex items-center justify-center mx-auto text-purple-400">
               <Fingerprint className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-white">Social Engineering</h3>
            <p className="text-slate-400 text-sm">Coverage for funds lost due to phishing scams or fraudulent wire transfer instructions.</p>
         </div>
      </div>

      <div className="text-center">
         <Link 
            to="/apply"
            state={{ preSelected: 'Cyber Liability' }}
            className="px-12 py-5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-2xl font-bold text-lg shadow-xl shadow-cyan-500/20 inline-flex items-center gap-3 transition-all active:scale-95"
         >
            Get Cyber Quote <Server className="w-5 h-5" />
         </Link>
      </div>
    </div>
  );
};

export default CyberPage;
