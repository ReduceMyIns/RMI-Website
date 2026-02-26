
import React, { useState } from 'react';
import { ArrowLeft, Heart, Users, Clock, ShieldCheck, CheckCircle2, Anchor, Baby, Scale } from 'lucide-react';
import { Link } from 'react-router-dom';

const LifePage: React.FC = () => {
  const [showForm, setShowForm] = useState(false);
  const PIPEDRIVE_URL = "https://webforms.pipedrive.com/f/1FOlkAaSbp1v7b14AOReTY5vxVamElFwZ4gPVY5wxJ6HAWpZQac3RvRNt5FRleCVd";

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-32">
      <SEOHead 
        title="Life Insurance Plans | Term, Whole & Universal Life"
        description="Secure your family's future with affordable life insurance. Compare term, whole, and universal life policies from top-rated carriers."
        canonicalUrl="https://www.reducemyinsurance.net/life"
        keywords={['life insurance', 'term life', 'whole life', 'universal life', 'family security']}
      />
      <Link to="/products" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-8 group">
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Products
      </Link>

      <div className="text-center space-y-6 mb-16">
        <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full glass border-pink-500/20 text-pink-400 text-[10px] font-bold uppercase tracking-widest">
          <Heart className="w-3 h-3" /> Family Security
        </div>
        <h1 className="text-4xl md:text-6xl font-heading font-bold tracking-tight text-white leading-tight">
          Life Insurance <span className="text-pink-400">Made Simple.</span>
        </h1>
        <p className="text-slate-400 text-lg leading-relaxed max-w-2xl mx-auto">
          Affordable Term, Whole, and Universal Life policies to ensure your loved ones are financially secure, no matter what happens.
        </p>
      </div>

      {!showForm ? (
        <div className="space-y-16">
           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="glass-card p-8 rounded-[2.5rem] border-white/5 hover:bg-white/[0.05] transition-all relative overflow-hidden">
                  <div className="w-12 h-12 bg-pink-500/10 rounded-xl flex items-center justify-center text-pink-400 mb-6"><Clock className="w-6 h-6"/></div>
                  <h3 className="text-xl font-bold text-white mb-3">Term Life</h3>
                  <p className="text-slate-400 text-sm mb-4">Coverage for a specific period (10, 20, 30 years). Most affordable option, ideal for families covering a mortgage or raising kids.</p>
                  <span className="text-xs font-bold text-pink-400 uppercase tracking-wider">Most Popular</span>
              </div>
              <div className="glass-card p-8 rounded-[2.5rem] border-white/5 hover:bg-white/[0.05] transition-all">
                  <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center text-purple-400 mb-6"><Anchor className="w-6 h-6"/></div>
                  <h3 className="text-xl font-bold text-white mb-3">Whole Life</h3>
                  <p className="text-slate-400 text-sm">Permanent coverage that lasts your entire life and builds cash value over time. Great for final expenses and estate planning.</p>
              </div>
              <div className="glass-card p-8 rounded-[2.5rem] border-white/5 hover:bg-white/[0.05] transition-all">
                  <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-400 mb-6"><Scale className="w-6 h-6"/></div>
                  <h3 className="text-xl font-bold text-white mb-3">Universal Life</h3>
                  <p className="text-slate-400 text-sm">Flexible permanent coverage that allows you to adjust premiums and death benefits as your financial needs change.</p>
              </div>
           </div>

           <div className="glass-card p-12 rounded-[3rem] border-white/10 bg-gradient-to-br from-slate-900 to-slate-800">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                  <div className="space-y-6">
                      <h3 className="text-3xl font-heading font-bold text-white">Who needs life insurance?</h3>
                      <div className="space-y-4">
                         <div className="flex gap-4">
                            <div className="p-2 bg-white/5 rounded-lg h-fit"><Baby className="w-5 h-5 text-pink-300"/></div>
                            <div>
                               <h4 className="text-white font-bold text-sm">Parents</h4>
                               <p className="text-xs text-slate-400">To cover childcare, tuition, and daily expenses.</p>
                            </div>
                         </div>
                         <div className="flex gap-4">
                            <div className="p-2 bg-white/5 rounded-lg h-fit"><Users className="w-5 h-5 text-pink-300"/></div>
                            <div>
                               <h4 className="text-white font-bold text-sm">Spouses & Partners</h4>
                               <p className="text-xs text-slate-400">To pay off the mortgage and maintain lifestyle.</p>
                            </div>
                         </div>
                         <div className="flex gap-4">
                            <div className="p-2 bg-white/5 rounded-lg h-fit"><ShieldCheck className="w-5 h-5 text-pink-300"/></div>
                            <div>
                               <h4 className="text-white font-bold text-sm">Business Owners</h4>
                               <p className="text-xs text-slate-400">To fund buy-sell agreements or key person insurance.</p>
                            </div>
                         </div>
                      </div>
                  </div>
                  <div className="text-center space-y-6">
                      <p className="text-lg text-slate-300 leading-relaxed">
                          "The best time to buy life insurance is when you are young and healthy. Rates are at their absolute lowest."
                      </p>
                      <button 
                          onClick={() => setShowForm(true)}
                          className="px-12 py-5 bg-pink-600 hover:bg-pink-500 text-white rounded-2xl font-bold text-lg shadow-xl shadow-pink-500/20 transition-all hover:scale-105 active:scale-95 inline-flex items-center gap-3"
                      >
                          Get Free Life Quote <Heart className="w-5 h-5" />
                      </button>
                  </div>
               </div>
           </div>
        </div>
      ) : (
        <div className="animate-in fade-in zoom-in-95 duration-500">
            <div className="glass-card rounded-[2rem] overflow-hidden bg-white relative min-h-[850px] shadow-2xl">
               <iframe 
                 src={PIPEDRIVE_URL}
                 className="w-full h-[1200px] border-none"
                 title="Life Insurance Quote"
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

export default LifePage;
