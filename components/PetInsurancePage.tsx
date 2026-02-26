
import React, { useState } from 'react';
import { ArrowLeft, PawPrint, ExternalLink, Heart, Shield, CheckCircle2, Zap, Stethoscope, Bone, Languages, Syringe, Percent, Clock, Sliders } from 'lucide-react';
import { Link } from 'react-router-dom';
import SEOHead from './SEOHead';

const PetInsurancePage: React.FC = () => {
  const [showKanguro, setShowKanguro] = useState(false);

  const fetchUrl = "https://www.fetchpet.com/mypet?a=FC98684&utm_source=firstconnect&utm_medium=brokerportal&utm_campaign=firstconnect_email&c=firstconnect&p=firstconnect";
  const kanguroUrl = "https://embedd.kanguroseguro.com/widget/pricing/one?primary=nice&roundness=0.5rem&embedded_payment=true&hide_kanguro_link_out=false&enable_multi_pet=true&enable_customization=true&out=true&utm_campaign=fc_fc98684";
  const safecoUrl = "https://widgets.safeco.com/offers/pets?id=RBq5ijsjS";

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <SEOHead 
        title="Pet Insurance Quotes | Protect Your Best Friend"
        description="Comprehensive pet insurance for dogs and cats in Murfreesboro. Coverage for vet bills, wellness exams, and emergencies with top-rated insurers."
        canonicalUrl="https://www.reducemyinsurance.net/pet-insurance"
        keywords={['pet insurance', 'dog insurance', 'cat insurance', 'vet bill coverage', 'Murfreesboro TN']}
      />
      <Link to="/products" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-8 group">
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Products
      </Link>

      <div className="text-center space-y-6 mb-16">
        <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full glass border-blue-500/20 text-blue-400 text-[10px] font-bold uppercase tracking-widest">
          <PawPrint className="w-3 h-3" /> Pet Protection
        </div>
        <h1 className="text-4xl md:text-6xl font-heading font-bold tracking-tight text-white leading-tight">
          Insurance for your <span className="text-blue-400">Best Friend</span>
        </h1>
        <p className="text-slate-400 text-lg leading-relaxed max-w-2xl mx-auto">
          We've partnered with top-rated pet insurers to cover veterinary bills, wellness exams, and emergencies. 
          <span className="block mt-2 text-white font-bold">We accept all vets in the U.S. and Canada.</span>
        </p>
      </div>

      {!showKanguro ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mx-auto">
          {/* FETCH OPTION */}
          <div className="glass-card p-8 rounded-[2.5rem] border-white/5 hover:bg-white/[0.05] transition-all group flex flex-col relative overflow-hidden ring-1 ring-white/5 hover:ring-orange-500/50">
            <div className="absolute top-0 right-0 w-40 h-40 bg-orange-500/10 blur-[60px] rounded-full group-hover:bg-orange-500/20 transition-all"></div>
            
            <div className="relative z-10 flex flex-col h-full">
              <div className="flex justify-between items-start mb-6">
                 <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-lg">
                    <span className="font-heading font-bold text-slate-900 text-lg tracking-tight">Fetch</span>
                 </div>
                 <div className="px-3 py-1 rounded-full bg-orange-500/20 text-orange-400 text-[10px] font-bold uppercase tracking-widest border border-orange-500/20">
                    Comprehensive
                 </div>
              </div>
              
              <h3 className="text-2xl font-bold text-white mb-2">Fetch by The Dodo</h3>
              <p className="text-slate-400 text-xs mb-6 leading-relaxed min-h-[48px]">
                Superior coverage for accidents & illnesses. Covers exam fees and breed-specific issues.
              </p>

              <div className="space-y-3 mb-8 flex-grow">
                {[
                  { text: 'Sick-visit exam fees included', icon: Stethoscope },
                  { text: 'Every adult tooth covered', icon: Bone },
                  { text: 'Breed-specific hereditary conditions', icon: PawPrint },
                  { text: 'Holistic care & behavioral therapy', icon: Heart }
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3 p-2.5 rounded-xl bg-white/5 border border-white/5">
                    <item.icon className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
                    <span className="text-xs text-slate-300 font-medium">{item.text}</span>
                  </div>
                ))}
              </div>

              <a 
                href={fetchUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="mt-auto w-full py-4 bg-orange-600 hover:bg-orange-500 text-white rounded-2xl font-bold flex items-center justify-center gap-2 transition-all shadow-xl shadow-orange-500/20 active:scale-95 group/btn"
              >
                Get Quote <ExternalLink className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
              </a>
            </div>
          </div>

          {/* SAFECO OPTION */}
          <div className="glass-card p-8 rounded-[2.5rem] border-white/5 hover:bg-white/[0.05] transition-all group flex flex-col relative overflow-hidden ring-1 ring-white/5 hover:ring-yellow-500/50">
            <div className="absolute top-0 right-0 w-40 h-40 bg-yellow-500/10 blur-[60px] rounded-full group-hover:bg-yellow-500/20 transition-all"></div>
            
            <div className="relative z-10 flex flex-col h-full">
              <div className="flex justify-between items-start mb-6">
                 <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-lg">
                    <Shield className="w-8 h-8 text-yellow-500" />
                 </div>
                 <div className="px-3 py-1 rounded-full bg-yellow-500/20 text-yellow-400 text-[10px] font-bold uppercase tracking-widest border border-yellow-500/20">
                    Trusted & Flexible
                 </div>
              </div>
              
              <h3 className="text-2xl font-bold text-white mb-2">Safeco Pet</h3>
              <p className="text-slate-400 text-xs mb-6 leading-relaxed min-h-[48px]">
                Backed by 100+ years of experience. Customizable plans with stackable discounts.
              </p>

              <div className="space-y-3 mb-8 flex-grow">
                {[
                  { text: 'Stackable discounts (up to 20%)', icon: Percent },
                  { text: 'No cancellation due to age', icon: Clock },
                  { text: 'Customizable reimbursement (70-90%)', icon: Sliders },
                  { text: 'Preventative wellness add-ons', icon: CheckCircle2 }
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3 p-2.5 rounded-xl bg-white/5 border border-white/5">
                    <item.icon className="w-4 h-4 text-yellow-400 shrink-0 mt-0.5" />
                    <span className="text-xs text-slate-300 font-medium">{item.text}</span>
                  </div>
                ))}
              </div>

              <a 
                href={safecoUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="mt-auto w-full py-4 bg-yellow-600 hover:bg-yellow-500 text-white rounded-2xl font-bold flex items-center justify-center gap-2 transition-all shadow-xl shadow-yellow-500/20 active:scale-95 group/btn"
              >
                Get Quote <ExternalLink className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
              </a>
            </div>
          </div>

          {/* KANGURO OPTION */}
          <div className="glass-card p-8 rounded-[2.5rem] border-white/5 hover:bg-white/[0.05] transition-all group flex flex-col relative overflow-hidden ring-1 ring-white/5 hover:ring-blue-500/50">
            <div className="absolute top-0 right-0 w-40 h-40 bg-blue-500/10 blur-[60px] rounded-full group-hover:bg-blue-500/20 transition-all"></div>
            
            <div className="relative z-10 flex flex-col h-full">
              <div className="flex justify-between items-start mb-6">
                 <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg text-white">
                    <Shield className="w-8 h-8" />
                 </div>
                 <div className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-400 text-[10px] font-bold uppercase tracking-widest border border-blue-500/20">
                    Wellness & App
                 </div>
              </div>
              
              <h3 className="text-2xl font-bold text-white mb-2">Kanguro</h3>
              <p className="text-slate-400 text-xs mb-6 leading-relaxed min-h-[48px]">
                100% Bilingual (English/Spanish) app-based experience with focus on preventative care.
              </p>

              <div className="space-y-3 mb-8 flex-grow">
                {[
                  { text: '100% Bilingual (Español/English) App', icon: Languages },
                  { text: 'Preventive & Wellness plans available', icon: Syringe },
                  { text: 'Dental illness up to $1,000/year', icon: Bone },
                  { text: 'Covers diagnosis, surgery & fast claims', icon: Zap }
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3 p-2.5 rounded-xl bg-white/5 border border-white/5">
                    <item.icon className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                    <span className="text-xs text-slate-300 font-medium">{item.text}</span>
                  </div>
                ))}
              </div>

              <button 
                onClick={() => setShowKanguro(true)}
                className="mt-auto w-full py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-bold flex items-center justify-center gap-2 transition-all shadow-xl shadow-blue-500/20 active:scale-95 group/btn"
              >
                Instant Quote <Zap className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* KANGURO WIDGET VIEW */
        <div className="max-w-5xl mx-auto animate-in zoom-in-95 duration-500">
           <button 
             onClick={() => setShowKanguro(false)}
             className="mb-6 flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-white transition-colors pl-2"
           >
             <ArrowLeft className="w-4 h-4" /> Compare Providers
           </button>
           
           <div className="glass-card rounded-[3rem] overflow-hidden bg-white relative min-h-[850px] shadow-2xl">
              <div className="absolute inset-0 flex flex-col items-center justify-center z-0 bg-slate-50">
                 <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
                 <p className="text-slate-400 text-sm font-bold uppercase tracking-widest">Loading Kanguro Engine...</p>
              </div>
              <iframe 
                src={kanguroUrl}
                className="w-full h-[1200px] border-none relative z-10 bg-transparent"
                title="Kanguro Pet Insurance Quote"
                allow="payment"
              />
           </div>
        </div>
      )}
    </div>
  );
};

export default PetInsurancePage;
