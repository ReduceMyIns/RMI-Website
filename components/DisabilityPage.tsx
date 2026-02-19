
import React, { useState } from 'react';
import { ArrowLeft, Activity, Heart, ShieldAlert, CheckCircle2, Wallet, Umbrella, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';

const DisabilityPage: React.FC = () => {
  const [showForm, setShowForm] = useState(false);
  const PIPEDRIVE_URL = "https://webforms.pipedrive.com/f/1FOlkAaSbp1v7b14AOReTY5vxVamElFwZ4gPVY5wxJ6HAWpZQac3RvRNt5FRleCVd";

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-32">
      <Link to="/products" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-8 group">
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Products
      </Link>

      <div className="text-center space-y-6 mb-16">
        <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full glass border-orange-500/20 text-orange-400 text-[10px] font-bold uppercase tracking-widest">
          <Activity className="w-3 h-3" /> Income Protection
        </div>
        <h1 className="text-4xl md:text-6xl font-heading font-bold tracking-tight text-white leading-tight">
          Protect Your <span className="text-orange-400">Livelihood.</span>
        </h1>
        <p className="text-slate-400 text-lg leading-relaxed max-w-2xl mx-auto">
          Your ability to earn an income is your greatest asset. Disability and accident insurance ensures your bills get paid even if you can't work.
        </p>
      </div>

      {!showForm ? (
        <div className="space-y-16">
           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="glass-card p-8 rounded-[2.5rem] border-white/5 hover:bg-white/[0.05] transition-all">
                  <div className="w-12 h-12 bg-orange-500/10 rounded-xl flex items-center justify-center text-orange-400 mb-6"><Wallet className="w-6 h-6"/></div>
                  <h3 className="text-xl font-bold text-white mb-3">Short-Term Disability</h3>
                  <p className="text-slate-400 text-sm">Replaces a portion of your income for temporary injuries, illnesses, or recovery from surgery.</p>
              </div>
              <div className="glass-card p-8 rounded-[2.5rem] border-white/5 hover:bg-white/[0.05] transition-all">
                  <div className="w-12 h-12 bg-red-500/10 rounded-xl flex items-center justify-center text-red-400 mb-6"><Umbrella className="w-6 h-6"/></div>
                  <h3 className="text-xl font-bold text-white mb-3">Long-Term Disability</h3>
                  <p className="text-slate-400 text-sm">Vital protection that provides income for extended periods (years or until retirement) due to serious conditions.</p>
              </div>
              <div className="glass-card p-8 rounded-[2.5rem] border-white/5 hover:bg-white/[0.05] transition-all">
                  <div className="w-12 h-12 bg-yellow-500/10 rounded-xl flex items-center justify-center text-yellow-400 mb-6"><AlertTriangle className="w-6 h-6"/></div>
                  <h3 className="text-xl font-bold text-white mb-3">Accident Indemnity</h3>
                  <p className="text-slate-400 text-sm">Lump-sum cash payouts for specific injuries (broken bones, ER visits) to help cover out-of-pocket costs.</p>
              </div>
           </div>

           <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-8">
                 <h3 className="text-3xl font-heading font-bold text-white">Did you know?</h3>
                 <div className="space-y-6">
                    <div className="flex gap-4 p-4 bg-white/5 rounded-2xl border border-white/5">
                        <div className="p-3 bg-slate-800 rounded-xl h-fit font-bold text-orange-500">1 in 4</div>
                        <div>
                            <p className="text-white font-bold">20-year-olds will become disabled before retiring.</p>
                            <p className="text-xs text-slate-500 mt-1">Source: Social Security Administration</p>
                        </div>
                    </div>
                    <div className="flex gap-4 p-4 bg-white/5 rounded-2xl border border-white/5">
                        <div className="p-3 bg-slate-800 rounded-xl h-fit font-bold text-orange-500">90%</div>
                        <div>
                            <p className="text-white font-bold">Of disabilities are caused by illness, not accidents.</p>
                            <p className="text-xs text-slate-500 mt-1">Most people assume it's just work accidents.</p>
                        </div>
                    </div>
                 </div>
              </div>

              <div className="glass-card p-10 rounded-[3rem] border-white/10 bg-slate-900/50 text-center space-y-6">
                  <ShieldAlert className="w-16 h-16 text-orange-500 mx-auto" />
                  <h3 className="text-2xl font-bold text-white">Gap Protection</h3>
                  <p className="text-slate-400 text-sm">
                    Health insurance pays the doctors. Disability insurance pays <strong>you</strong> so you can pay your mortgage and groceries.
                  </p>
                  <button 
                      onClick={() => setShowForm(true)}
                      className="w-full py-5 bg-orange-600 hover:bg-orange-500 text-white rounded-2xl font-bold text-lg shadow-xl shadow-orange-500/20 transition-all hover:scale-105 active:scale-95"
                  >
                      Get Income Protection Quote
                  </button>
              </div>
           </div>
        </div>
      ) : (
        <div className="animate-in fade-in zoom-in-95 duration-500">
            <div className="glass-card rounded-[2rem] overflow-hidden bg-white relative min-h-[850px] shadow-2xl">
               <iframe 
                 src={PIPEDRIVE_URL}
                 className="w-full h-[1200px] border-none"
                 title="Disability Insurance Quote"
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

export default DisabilityPage;
