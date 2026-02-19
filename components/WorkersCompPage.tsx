
import React, { useState } from 'react';
import { ArrowLeft, HardHat, HeartPulse, Scale, Activity } from 'lucide-react';
import { Link } from 'react-router-dom';
import NowCertsIframe from './NowCertsIframe';

const WorkersCompPage: React.FC = () => {
  const [showQuote, setShowQuote] = useState(false);

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-32">
      <Link to="/products" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-8 group">
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Products
      </Link>

      <div className="text-center space-y-6 mb-16">
        <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full glass border-blue-500/20 text-blue-400 text-[10px] font-bold uppercase tracking-widest">
          <HardHat className="w-3 h-3" /> Employee Protection
        </div>
        <h1 className="text-4xl md:text-6xl font-heading font-bold tracking-tight text-white leading-tight">
          Workers' <span className="text-blue-400">Compensation</span>
        </h1>
        <p className="text-slate-400 text-lg leading-relaxed max-w-2xl mx-auto">
          Mandatory coverage that protects your business from lawsuits and your employees from lost wages due to work-related injuries.
        </p>
      </div>

      {!showQuote ? (
        <div className="space-y-16">
           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="glass-card p-8 rounded-[2.5rem] border-white/5 hover:bg-white/[0.05] transition-all">
                  <div className="w-12 h-12 bg-red-500/10 rounded-xl flex items-center justify-center text-red-400 mb-6"><HeartPulse className="w-6 h-6"/></div>
                  <h3 className="text-xl font-bold text-white mb-3">Medical Expenses</h3>
                  <p className="text-slate-400 text-sm">Pays for hospital visits, surgeries, and rehabilitation for employees injured on the job.</p>
              </div>
              <div className="glass-card p-8 rounded-[2.5rem] border-white/5 hover:bg-white/[0.05] transition-all">
                  <div className="w-12 h-12 bg-green-500/10 rounded-xl flex items-center justify-center text-green-400 mb-6"><Activity className="w-6 h-6"/></div>
                  <h3 className="text-xl font-bold text-white mb-3">Lost Wages</h3>
                  <p className="text-slate-400 text-sm">Provides partial income replacement to employees while they are recovering and unable to work.</p>
              </div>
              <div className="glass-card p-8 rounded-[2.5rem] border-white/5 hover:bg-white/[0.05] transition-all">
                  <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-400 mb-6"><Scale className="w-6 h-6"/></div>
                  <h3 className="text-xl font-bold text-white mb-3">Legal Defense</h3>
                  <p className="text-slate-400 text-sm">Covers legal costs if an employee sues your business over a workplace injury.</p>
              </div>
           </div>

           <div className="bg-slate-900 border border-white/10 rounded-[3rem] p-10 text-center space-y-6">
              <h3 className="text-2xl font-bold text-white">Compare Top Carriers</h3>
              <p className="text-slate-400 max-w-xl mx-auto">
                 We shop your class code with carriers like Travelers, The Hartford, AmTrust, and Berkshire Hathaway to find the lowest rate.
              </p>
              <button 
                  onClick={() => setShowQuote(true)}
                  className="px-12 py-5 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-bold text-lg shadow-xl shadow-blue-500/20 transition-all hover:scale-105 active:scale-95"
              >
                  Get Workers' Comp Quote
              </button>
           </div>
        </div>
      ) : (
        <div className="animate-in fade-in zoom-in-95 duration-500">
            <div className="glass-card rounded-[2rem] p-4 md:p-8 border-white/5 bg-white/5">
                <NowCertsIframe 
                url="https://www1.nowcerts.com/Pages/QuoteRequests/WorkersCompensation.aspx?AgencyId=7b9d101f-6a6c-40a6-b256-bfd8a901c277" 
                height="1200" 
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

export default WorkersCompPage;
