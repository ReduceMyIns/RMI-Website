
import React, { useState } from 'react';
import { ArrowLeft, Eye, Smile, CheckCircle2, ShieldPlus, Sparkles, DollarSign } from 'lucide-react';
import { Link } from 'react-router-dom';

const DentalPage: React.FC = () => {
  const [showForm, setShowForm] = useState(false);
  const PIPEDRIVE_URL = "https://webforms.pipedrive.com/f/1FOlkAaSbp1v7b14AOReTY5vxVamElFwZ4gPVY5wxJ6HAWpZQac3RvRNt5FRleCVd";

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-32">
      <SEOHead 
        title="Dental & Vision Insurance | Affordable Family Plans"
        description="Compare dental and vision insurance plans. Coverage for cleanings, major dental work, eye exams, and eyewear starting at $30/month."
        canonicalUrl="https://www.reducemyinsurance.net/dental-vision"
        keywords={['dental insurance', 'vision insurance', 'family dental plans', 'eye exams', 'affordable dental']}
      />
      <Link to="/products" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-8 group">
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Products
      </Link>

      <div className="text-center space-y-6 mb-16">
        <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full glass border-cyan-500/20 text-cyan-400 text-[10px] font-bold uppercase tracking-widest">
          <Smile className="w-3 h-3" /> Dental & Vision
        </div>
        <h1 className="text-4xl md:text-6xl font-heading font-bold tracking-tight text-white leading-tight">
          Protect Your <span className="text-cyan-400">Smile & Sight.</span>
        </h1>
        <p className="text-slate-400 text-lg leading-relaxed max-w-2xl mx-auto">
          Essential coverage for routine cleanings, major dental work, eye exams, and prescription eyewear.
        </p>
      </div>

      {!showForm ? (
        <div className="space-y-16">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <div className="glass-card p-10 rounded-[2.5rem] border-white/5 hover:bg-white/[0.05] transition-all">
                  <div className="w-14 h-14 bg-cyan-500/10 rounded-2xl flex items-center justify-center text-cyan-400 mb-6"><Smile className="w-7 h-7"/></div>
                  <h3 className="text-2xl font-bold text-white mb-4">Dental Coverage</h3>
                  <ul className="space-y-3 text-slate-300">
                    <li className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-cyan-500 shrink-0 mt-0.5"/> 100% coverage for cleanings & x-rays</li>
                    <li className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-cyan-500 shrink-0 mt-0.5"/> Coverage for fillings, crowns, & root canals</li>
                    <li className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-cyan-500 shrink-0 mt-0.5"/> Orthodontics options for children & adults</li>
                  </ul>
              </div>
              <div className="glass-card p-10 rounded-[2.5rem] border-white/5 hover:bg-white/[0.05] transition-all">
                  <div className="w-14 h-14 bg-indigo-500/10 rounded-2xl flex items-center justify-center text-indigo-400 mb-6"><Eye className="w-7 h-7"/></div>
                  <h3 className="text-2xl font-bold text-white mb-4">Vision Plans</h3>
                  <ul className="space-y-3 text-slate-300">
                    <li className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-indigo-500 shrink-0 mt-0.5"/> Annual eye exams with low copays</li>
                    <li className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-indigo-500 shrink-0 mt-0.5"/> Allowances for frames and contact lenses</li>
                    <li className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-indigo-500 shrink-0 mt-0.5"/> Discounts on laser vision correction</li>
                  </ul>
              </div>
           </div>

           <div className="bg-slate-900/50 border border-white/10 rounded-[3rem] p-10 text-center space-y-8">
              <div className="max-w-2xl mx-auto space-y-4">
                 <h3 className="text-2xl font-heading font-bold text-white">Why pay out of pocket?</h3>
                 <p className="text-slate-400">
                    A single crown can cost $1,000+. Dental insurance plans start as low as $30/month. 
                    Lock in your rates and access a massive network of providers.
                 </p>
              </div>
              
              <button 
                  onClick={() => setShowForm(true)}
                  className="px-12 py-5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-2xl font-bold text-lg shadow-xl shadow-cyan-500/20 transition-all hover:scale-105 active:scale-95 inline-flex items-center gap-3"
              >
                  Get Dental/Vision Quote <ShieldPlus className="w-5 h-5" />
              </button>
           </div>
        </div>
      ) : (
        <div className="animate-in fade-in zoom-in-95 duration-500">
            <div className="glass-card rounded-[2rem] overflow-hidden bg-white relative min-h-[850px] shadow-2xl">
               <iframe 
                 src={PIPEDRIVE_URL}
                 className="w-full h-[1200px] border-none"
                 title="Dental Vision Quote"
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

export default DentalPage;
