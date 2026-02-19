import React, { useState } from 'react';
import { useParams, Navigate, Link } from 'react-router-dom';
import { getIndustryBySlug } from '../data/industryData';
import { 
  Shield, CheckCircle2, ArrowRight, Zap, Bot, Sparkles, Check
} from 'lucide-react';

const IndustryLandingPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const industry = getIndustryBySlug(slug || '');

  if (!industry) {
    return <Navigate to="/industries" replace />;
  }

  return (
    <div className="min-h-screen bg-[#020617] animate-in fade-in duration-700 pb-32">
      {/* Sticky Mobile CTA */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-slate-900/90 backdrop-blur-xl border-t border-white/10 z-50 md:hidden">
          <Link 
            to="/apply"
            state={{ preSelected: industry.slug }}
            className="flex items-center justify-center w-full text-white font-bold py-4 rounded-xl shadow-lg bg-blue-600 active:scale-95"
          >
            Get {industry.name} Quote
          </Link>
      </div>

      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-widest">
              <industry.icon className="w-3 h-3" /> {industry.category} Insurance
            </div>
            
            <h1 className="text-5xl md:text-7xl font-heading font-bold text-white leading-[1.1]">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">{industry.name}</span> Insurance.
            </h1>
            
            <p className="text-xl text-slate-400 leading-relaxed max-w-xl">
              {industry.shortDesc} Our AI automatically bundles this with your core policies for maximum savings and gap-free protection.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link
                to="/apply"
                state={{ preSelected: industry.slug }}
                className="px-10 py-5 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-bold text-lg shadow-xl shadow-blue-500/20 flex items-center justify-center gap-3 transition-all hover:scale-105 active:scale-95"
              >
                Launch AI Risk Analysis
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
            
            <div className="p-6 bg-emerald-500/5 border border-emerald-500/20 rounded-3xl flex items-start gap-4">
               <Zap className="w-6 h-6 text-emerald-400 shrink-0 mt-1" />
               <div>
                  <div className="font-bold text-white text-sm">Multi-Policy Discount Applied</div>
                  <p className="text-xs text-slate-400 mt-1">Bundling {industry.name} with your primary portfolio typically reduces total annual premium by 12-18%.</p>
               </div>
            </div>
          </div>

          <div className="relative hidden lg:block">
            <div className="glass-card p-10 rounded-[3rem] border-white/10 relative z-10">
              <div className="space-y-6">
                <h3 className="font-heading font-bold text-2xl text-white">Coverage Recommendations</h3>
                <div className="grid grid-cols-1 gap-3">
                  {industry.coverages.map((cov, i) => (
                    <div key={i} className="flex items-center gap-3 p-4 bg-white/5 rounded-2xl border border-white/5">
                      <CheckCircle2 className="w-5 h-5 text-blue-400 flex-shrink-0" />
                      <span className="font-bold text-slate-200">{cov}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* RISK ANALYSIS SECTION */}
      <section className="max-w-7xl mx-auto px-6 py-20 border-t border-white/5">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
           <div className="space-y-8">
              <h2 className="text-4xl font-heading font-bold text-white">Niche Risk Profile: <span className="text-blue-400">{industry.name}</span></h2>
              <div className="grid grid-cols-1 gap-4">
                 {industry.riskFactors.map((risk, i) => (
                    <div key={i} className="flex gap-4 p-5 bg-white/5 rounded-2xl border border-white/5 group hover:bg-white/10 transition-all">
                       <div className="w-10 h-10 bg-red-500/10 rounded-xl flex items-center justify-center text-red-400 shrink-0 group-hover:scale-110 transition-transform">
                          <Check className="w-5 h-5" />
                       </div>
                       <div>
                          <div className="font-bold text-white text-base">{risk}</div>
                          <p className="text-xs text-slate-500 mt-1">Our neural engine monitors live claims data for the {industry.name} sector to adjust risk weightings.</p>
                       </div>
                    </div>
                 ))}
              </div>
           </div>
           <div className="relative">
              <div className="glass-card p-10 rounded-[3rem] border-white/10 bg-blue-600/5 space-y-6">
                 <div className="flex items-center gap-3 text-blue-400 font-bold uppercase tracking-widest text-xs">
                    <Bot className="w-4 h-4" /> Underwriter Intelligence
                 </div>
                 <p className="text-white text-lg leading-relaxed italic">
                    "I have pre-mapped the top {industry.riskFactors.length} liability exposure points for {industry.name}. My market scan will prioritize carriers with specialized endorsements for these specific risk factors."
                 </p>
                 <div className="flex items-center gap-4 pt-6 border-t border-white/10">
                    <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center font-bold text-blue-400">99.4%</div>
                    <div className="text-xs font-bold text-slate-500 uppercase tracking-widest leading-none">Intake Accuracy Score</div>
                 </div>
              </div>
           </div>
        </div>
      </section>

      {/* FINAL CTA SECTION */}
      <section className="px-6 py-20 bg-slate-950/50">
        <div className="max-w-3xl mx-auto text-center space-y-10">
           <h2 className="text-3xl md:text-5xl font-heading font-bold text-white">Ready for a <span className="text-blue-400">Custom Quote</span>?</h2>
           <p className="text-slate-400 text-lg">
             Stop guessing your limits. Let our AI analyze your specific {industry.name} business or asset and find the lowest rates across our 80+ carrier network.
           </p>
           <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link 
                  to="/apply"
                  state={{ preSelected: industry.slug }}
                  className="w-full sm:w-auto px-12 py-5 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-bold text-lg transition-all shadow-xl shadow-blue-500/20 flex items-center justify-center gap-3 active:scale-95"
              >
                  Start Automated Quote <ArrowRight className="w-5 h-5" />
              </Link>
              <Link to="/products" className="w-full sm:w-auto px-10 py-5 bg-white/5 hover:bg-white/10 text-white rounded-2xl font-bold text-lg transition-all border border-white/10 text-center">
                  Explore All Products
              </Link>
           </div>
        </div>
      </section>
    </div>
  );
};

export default IndustryLandingPage;
