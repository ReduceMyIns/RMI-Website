import React from 'react';
import { ArrowLeft, Shield, Lock, CheckCircle, ArrowRight, ExternalLink, Wifi, Wrench, FileText, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

const HomeSecurityPage: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-6 py-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <SEOHead 
        title="Home Security Systems | ADT & Cove Smart Security"
        description="Secure your home with top-rated security systems. Compare professional installation from ADT with flexible DIY options from Cove Smart."
        canonicalUrl="https://www.reducemyinsurance.net/home-security"
        keywords={['home security', 'ADT security', 'Cove smart', 'DIY security', 'professional monitoring']}
      />
      <Link to="/products" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-8 group">
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Products
      </Link>

      {/* Hero Section */}
      <div className="text-center space-y-6 mb-16">
        <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full glass border-blue-500/20 text-blue-400 text-[10px] font-bold uppercase tracking-widest">
          <Shield className="w-3 h-3" /> 24/7 Protection
        </div>
        <h1 className="text-5xl md:text-7xl font-heading font-bold tracking-tight text-white leading-tight">
          Secure Your <span className="text-blue-400">Sanctuary</span>
        </h1>
        <p className="text-slate-400 text-lg max-w-2xl mx-auto leading-relaxed">
          Choose the perfect security solution for your home. Whether you prefer professional installation or a flexible DIY system, we have partnered with the best in the industry.
        </p>
      </div>

      {/* Partners Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
        
        {/* ADT CARD */}
        <div className="glass-card p-10 rounded-[2.5rem] border-white/5 hover:bg-white/[0.05] transition-all group flex flex-col relative overflow-hidden ring-1 ring-white/5 hover:ring-blue-600/50">
            <div className="absolute top-0 right-0 w-40 h-40 bg-blue-600/10 blur-[60px] rounded-full group-hover:bg-blue-600/20 transition-all"></div>
            
            <div className="relative z-10 flex flex-col h-full">
                <div className="flex justify-between items-start mb-8">
                    <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                        <Shield className="w-10 h-10 text-white" />
                    </div>
                    <div className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-400 text-[10px] font-bold uppercase tracking-widest border border-blue-500/20">
                        Professional Install
                    </div>
                </div>
                
                <h3 className="text-3xl font-heading font-bold text-white mb-4">ADT Security</h3>
                <p className="text-slate-400 text-sm mb-8 leading-relaxed">
                    America's #1 Home Security Provider. Get professional installation, 24/7 monitoring, and smart home automation.
                </p>

                <div className="space-y-4 mb-10 flex-grow">
                    {[
                        { text: 'Professional Installation', icon: Wrench },
                        { text: '24/7 Professional Monitoring', icon: Shield },
                        { text: 'Smart Home Integration', icon: Wifi },
                        { text: '6-Month Money-Back Guarantee', icon: CheckCircle }
                    ].map((item, i) => (
                        <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5">
                            <item.icon className="w-5 h-5 text-blue-400 shrink-0" />
                            <span className="text-sm text-slate-300 font-medium">{item.text}</span>
                        </div>
                    ))}
                </div>

                <a 
                    href="https://secure24promos.com/reducemyinsurance" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="mt-auto w-full py-5 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-bold flex items-center justify-center gap-2 transition-all shadow-xl shadow-blue-500/20 active:scale-95 text-lg"
                >
                    Get ADT Offer <ExternalLink className="w-5 h-5" />
                </a>
                <p className="text-center text-[10px] text-slate-500 mt-4">Exclusive offer for ReduceMyInsurance customers.</p>
            </div>
        </div>

        {/* COVE CARD */}
        <div className="glass-card p-10 rounded-[2.5rem] border-white/5 hover:bg-white/[0.05] transition-all group flex flex-col relative overflow-hidden ring-1 ring-white/5 hover:ring-emerald-500/50">
            <div className="absolute top-0 right-0 w-40 h-40 bg-emerald-500/10 blur-[60px] rounded-full group-hover:bg-emerald-500/20 transition-all"></div>
            
            <div className="relative z-10 flex flex-col h-full">
                <div className="flex justify-between items-start mb-8">
                    <div className="w-16 h-16 bg-emerald-500 rounded-2xl flex items-center justify-center shadow-lg">
                        <Lock className="w-10 h-10 text-white" />
                    </div>
                    <div className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold uppercase tracking-widest border border-emerald-500/20">
                        DIY & Flexible
                    </div>
                </div>
                
                <h3 className="text-3xl font-heading font-bold text-white mb-4">Cove Smart</h3>
                <p className="text-slate-400 text-sm mb-8 leading-relaxed">
                    The easiest DIY security system. Affordable, no contracts, and sets up in minutes. Perfect for renters and homeowners.
                </p>

                <div className="space-y-4 mb-10 flex-grow">
                    {[
                        { text: 'Easy DIY Installation', icon: Wrench },
                        { text: 'No Contracts Required', icon: FileText },
                        { text: 'Rapid SOS Response', icon: Zap },
                        { text: 'Lifetime Equipment Warranty', icon: Shield }
                    ].map((item, i) => (
                        <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5">
                            <item.icon className="w-5 h-5 text-emerald-400 shrink-0" />
                            <span className="text-sm text-slate-300 font-medium">{item.text}</span>
                        </div>
                    ))}
                </div>

                <a 
                    href="https://www.covesmart.com/r/105035/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="mt-auto w-full py-5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl font-bold flex items-center justify-center gap-2 transition-all shadow-xl shadow-emerald-500/20 active:scale-95 text-lg"
                >
                    Shop Cove Deals <ExternalLink className="w-5 h-5" />
                </a>
                <p className="text-center text-[10px] text-slate-500 mt-4">Up to 60% off equipment + free camera.</p>
            </div>
        </div>

      </div>
    </div>
  );
};

export default HomeSecurityPage;
