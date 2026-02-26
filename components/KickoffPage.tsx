import React from 'react';
import { ArrowLeft, CheckCircle, Shield, Star, CreditCard, TrendingUp, ArrowRight, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import SEOHead from './SEOHead';

const KickoffPage: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-6 py-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <SEOHead 
        title="Build Credit Fast with Kickoff | Murfreesboro Financial Tools"
        description="The easiest way to build credit. No credit check, no interest, and no fees. Start building your credit score today for just $5/month with Kickoff."
        canonicalUrl="https://www.reducemyinsurance.net/kickoff"
        keywords={['build credit', 'credit builder', 'Kickoff', 'credit score', 'Murfreesboro TN']}
      />
      <Link to="/financial" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-8 group">
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Financial Products
      </Link>

      {/* Hero Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
        <div className="space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 text-green-400 text-xs font-bold uppercase tracking-widest border border-green-500/20">
            <TrendingUp className="w-3 h-3" /> Credit Building Made Simple
          </div>
          
          <h1 className="text-5xl md:text-7xl font-heading font-bold text-white leading-tight">
            Build Credit <br />
            <span className="text-green-400">Safely & Fast</span>
          </h1>
          
          <p className="text-lg text-slate-400 leading-relaxed max-w-xl">
            Kikoff is the easiest way to build credit. No credit check, no interest, and no fees. Start building your credit score today for just $5/month.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <a 
              href="https://kikoff.pxf.io/Qj34o6" 
              target="_blank" 
              rel="noopener noreferrer"
              className="px-8 py-4 bg-green-500 hover:bg-green-400 text-slate-900 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-green-500/20 active:scale-95"
            >
              Start Building Credit <ArrowRight className="w-5 h-5" />
            </a>
            <div className="flex items-center gap-2 px-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-slate-300 font-medium">
              <Shield className="w-5 h-5 text-green-400" /> No Credit Check Required
            </div>
          </div>
        </div>
        
        <div className="relative">
          <div className="absolute inset-0 bg-green-500/20 blur-[100px] rounded-full"></div>
          <div className="relative glass-card p-8 rounded-[2.5rem] border-white/10">
             <div className="flex items-center justify-between mb-8">
                <div className="space-y-1">
                   <div className="text-sm text-slate-400 font-medium uppercase tracking-wider">Credit Score</div>
                   <div className="text-4xl font-bold text-white">750</div>
                </div>
                <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center">
                   <TrendingUp className="w-6 h-6 text-green-400" />
                </div>
             </div>
             
             <div className="space-y-4">
                {[
                   { label: "Payment History", val: "100%", status: "Excellent" },
                   { label: "Credit Utilization", val: "4%", status: "Excellent" },
                   { label: "Account Age", val: "2 Yrs", status: "Good" }
                ].map((item, i) => (
                   <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5">
                      <span className="text-slate-300 font-medium">{item.label}</span>
                      <div className="text-right">
                         <div className="text-white font-bold">{item.val}</div>
                         <div className="text-[10px] text-green-400 uppercase font-bold tracking-wider">{item.status}</div>
                      </div>
                   </div>
                ))}
             </div>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
        {[
          { icon: Shield, title: "No Hard Pull", desc: "Applying for Kikoff does not affect your credit score. We do not perform a hard inquiry." },
          { icon: CreditCard, title: "0% Interest", desc: "Kikoff charges 0% interest and has no hidden fees. Just a flat $5/month membership." },
          { icon: Star, title: "Report to Bureaus", desc: "We report your on-time payments to Equifax and Experian every month to build your history." }
        ].map((feature, i) => (
          <div key={i} className="glass-card p-8 rounded-3xl border-white/5 hover:bg-white/[0.05] transition-all">
            <div className="w-12 h-12 bg-green-500/10 rounded-xl flex items-center justify-center text-green-400 mb-6">
              <feature.icon className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
            <p className="text-slate-400 text-sm leading-relaxed">{feature.desc}</p>
          </div>
        ))}
      </div>

      {/* How It Works */}
      <div className="glass-card p-12 rounded-[3rem] border-white/5 relative overflow-hidden text-center space-y-8">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-green-500/5 to-transparent pointer-events-none"></div>
        <div className="relative z-10 max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-white mb-6">How Kikoff Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
             <div className="space-y-4">
                <div className="text-5xl font-heading font-bold text-white/10">01</div>
                <h3 className="text-xl font-bold text-white">Sign Up Instantly</h3>
                <p className="text-slate-400 text-sm">Create your account in minutes. No credit check required to get started.</p>
             </div>
             <div className="space-y-4">
                <div className="text-5xl font-heading font-bold text-white/10">02</div>
                <h3 className="text-xl font-bold text-white">Open Credit Line</h3>
                <p className="text-slate-400 text-sm">You get a $750 line of credit reported to the bureaus. Use it to buy small items from the Kikoff store.</p>
             </div>
             <div className="space-y-4">
                <div className="text-5xl font-heading font-bold text-white/10">03</div>
                <h3 className="text-xl font-bold text-white">Build History</h3>
                <p className="text-slate-400 text-sm">Make small monthly payments. We report your positive payment history to the credit bureaus.</p>
             </div>
          </div>
          
          <div className="pt-8">
            <a 
                href="https://kikoff.pxf.io/Qj34o6" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex px-10 py-4 bg-white text-slate-900 rounded-2xl font-bold hover:bg-green-50 transition-colors shadow-xl items-center gap-3 active:scale-95"
            >
                Get Started Now <ExternalLink className="w-5 h-5 text-green-600" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KickoffPage;
