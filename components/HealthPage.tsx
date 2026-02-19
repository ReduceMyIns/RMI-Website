
import React, { useState } from 'react';
import { ArrowLeft, Stethoscope, HeartPulse, ShieldCheck, CheckCircle2, Users, Activity } from 'lucide-react';
import { Link } from 'react-router-dom';

const HealthPage: React.FC = () => {
  const [showForm, setShowForm] = useState(false);
  const PIPEDRIVE_URL = "https://webforms.pipedrive.com/f/1FOlkAaSbp1v7b14AOReTY5vxVamElFwZ4gPVY5wxJ6HAWpZQac3RvRNt5FRleCVd";

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-32">
      <Link to="/products" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-8 group">
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Products
      </Link>

      <div className="text-center space-y-6 mb-16">
        <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full glass border-emerald-500/20 text-emerald-400 text-[10px] font-bold uppercase tracking-widest">
          <Stethoscope className="w-3 h-3" /> Health & Wellness
        </div>
        <h1 className="text-4xl md:text-6xl font-heading font-bold tracking-tight text-white leading-tight">
          Comprehensive <span className="text-emerald-400">Healthcare.</span>
        </h1>
        <p className="text-slate-400 text-lg leading-relaxed max-w-2xl mx-auto">
          From Individual & Family plans to Medicare Supplements, we guide you through the complex world of healthcare to find the coverage you deserve.
        </p>
      </div>

      {!showForm ? (
        <div className="space-y-16">
           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="glass-card p-8 rounded-[2.5rem] border-white/5 hover:bg-white/[0.05] transition-all">
                  <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-400 mb-6"><HeartPulse className="w-6 h-6"/></div>
                  <h3 className="text-xl font-bold text-white mb-3">Individual & Family</h3>
                  <p className="text-slate-400 text-sm">ACA-compliant plans and private options tailored to your family's specific medical needs and budget.</p>
              </div>
              <div className="glass-card p-8 rounded-[2.5rem] border-white/5 hover:bg-white/[0.05] transition-all">
                  <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-400 mb-6"><ShieldCheck className="w-6 h-6"/></div>
                  <h3 className="text-xl font-bold text-white mb-3">Medicare Solutions</h3>
                  <p className="text-slate-400 text-sm">Navigate Medicare Advantage, Part D, and Supplement plans with expert guidance to fill coverage gaps.</p>
              </div>
              <div className="glass-card p-8 rounded-[2.5rem] border-white/5 hover:bg-white/[0.05] transition-all">
                  <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center text-purple-400 mb-6"><Users className="w-6 h-6"/></div>
                  <h3 className="text-xl font-bold text-white mb-3">Short-Term Medical</h3>
                  <p className="text-slate-400 text-sm">Flexible, temporary coverage for those between jobs, waiting for benefits, or needing immediate protection.</p>
              </div>
           </div>

           <div className="glass-card p-10 rounded-[3rem] border-white/10 bg-slate-900/50 flex flex-col md:flex-row items-center gap-12">
              <div className="flex-1 space-y-6">
                  <h3 className="text-2xl font-heading font-bold text-white">Why Use a Broker?</h3>
                  <ul className="space-y-4">
                      <li className="flex items-center gap-3 text-slate-300"><CheckCircle2 className="w-5 h-5 text-emerald-500"/> We compare multiple carriers, not just one.</li>
                      <li className="flex items-center gap-3 text-slate-300"><CheckCircle2 className="w-5 h-5 text-emerald-500"/> Expert assistance with subsidies and tax credits.</li>
                      <li className="flex items-center gap-3 text-slate-300"><CheckCircle2 className="w-5 h-5 text-emerald-500"/> Annual enrollment review to ensure continued value.</li>
                      <li className="flex items-center gap-3 text-slate-300"><CheckCircle2 className="w-5 h-5 text-emerald-500"/> Support for claims and network questions.</li>
                  </ul>
              </div>
              <div className="flex-1 text-center">
                  <div className="inline-block p-1 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 mb-6">
                      <div className="bg-slate-900 rounded-xl p-6">
                          <Activity className="w-10 h-10 text-emerald-400 mx-auto mb-2" />
                          <div className="font-bold text-white text-lg">Free Assessment</div>
                      </div>
                  </div>
                  <button 
                      onClick={() => setShowForm(true)}
                      className="w-full py-5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl font-bold text-lg shadow-xl shadow-emerald-500/20 transition-all hover:scale-105 active:scale-95"
                  >
                      Start Health Quote
                  </button>
                  <p className="text-xs text-slate-500 mt-4">Secure HIPAA-compliant form.</p>
              </div>
           </div>
        </div>
      ) : (
        <div className="animate-in fade-in zoom-in-95 duration-500">
            <div className="glass-card rounded-[2rem] overflow-hidden bg-white relative min-h-[850px] shadow-2xl">
               <iframe 
                 src={PIPEDRIVE_URL}
                 className="w-full h-[1200px] border-none"
                 title="Health Insurance Quote"
               />
            </div>
            <div className="text-center mt-6">
                <button onClick={() => setShowForm(false)} className="text-sm text-slate-500 hover:text-white underline">Cancel Request</button>
            </div>
        </div>
      )}
    </div>
  );
};

export default HealthPage;
