import React from 'react';
import { ArrowLeft, Shield, Home, Wrench, CheckCircle, ArrowRight, ExternalLink, Zap, Droplets, Snowflake } from 'lucide-react';
import { Link } from 'react-router-dom';

const ChoiceWarrantyPage: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-6 py-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <SEOHead 
        title="Choice Home Warranty | Protect Your Home Systems"
        description="Get the #1 rated home warranty from Choice Home Warranty. Protect your major home systems and appliances from unexpected breakdowns."
        canonicalUrl="https://www.reducemyinsurance.net/choice-warranty"
        keywords={['home warranty', 'Choice Home Warranty', 'appliance protection', 'home system coverage']}
      />
      <Link to="/products" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-8 group">
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Products
      </Link>

      {/* Hero Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
        <div className="space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 text-indigo-400 text-xs font-bold uppercase tracking-widest border border-indigo-500/20">
            <Shield className="w-3 h-3" /> #1 Rated Home Warranty
          </div>
          
          <h1 className="text-5xl md:text-7xl font-heading font-bold text-white leading-tight">
            Protect Your <br />
            <span className="text-indigo-400">Home Systems</span>
          </h1>
          
          <p className="text-lg text-slate-400 leading-relaxed max-w-xl">
            Choice Home Warranty covers your major systems and appliances when they break down. Don't let a broken AC or refrigerator drain your savings.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <a 
              href="https://www.anrdoezrs.net/click-7936082-12343542" 
              target="_blank" 
              rel="noopener noreferrer"
              className="px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-indigo-500/20 active:scale-95"
            >
              Get A Free Quote <ArrowRight className="w-5 h-5" />
            </a>
            <div className="flex items-center gap-2 px-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-slate-300 font-medium">
              <Wrench className="w-5 h-5 text-indigo-400" /> 24/7 Service Requests
            </div>
          </div>
        </div>
        
        <div className="relative">
          <div className="absolute inset-0 bg-indigo-500/20 blur-[100px] rounded-full"></div>
          <div className="relative glass-card p-8 rounded-[2.5rem] border-white/10 overflow-hidden">
             {/* Abstract Home Systems Graphic */}
             <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/5 p-6 rounded-2xl border border-white/5 flex flex-col items-center text-center gap-4">
                    <Zap className="w-12 h-12 text-yellow-400" />
                    <div className="font-bold text-white">Electrical</div>
                    <p className="text-xs text-slate-400">Circuit breakers, wiring, and panels.</p>
                </div>
                <div className="bg-white/5 p-6 rounded-2xl border border-white/5 flex flex-col items-center text-center gap-4">
                    <Snowflake className="w-12 h-12 text-blue-400" />
                    <div className="font-bold text-white">HVAC</div>
                    <p className="text-xs text-slate-400">Air conditioning, heating, and ductwork.</p>
                </div>
                <div className="bg-white/5 p-6 rounded-2xl border border-white/5 flex flex-col items-center text-center gap-4">
                    <Droplets className="w-12 h-12 text-cyan-400" />
                    <div className="font-bold text-white">Plumbing</div>
                    <p className="text-xs text-slate-400">Stoppages, leaks, and water heaters.</p>
                </div>
                <div className="bg-white/5 p-6 rounded-2xl border border-white/5 flex flex-col items-center text-center gap-4">
                    <Home className="w-12 h-12 text-indigo-400" />
                    <div className="font-bold text-white">Appliances</div>
                    <p className="text-xs text-slate-400">Refrigerator, oven, washer, and dryer.</p>
                </div>
             </div>
             
             <div className="mt-6 p-6 bg-indigo-500/10 rounded-2xl border border-indigo-500/20">
                <div className="flex items-center gap-3 mb-2">
                    <CheckCircle className="w-5 h-5 text-indigo-400" />
                    <span className="font-bold text-white">First Month Free</span>
                </div>
                <p className="text-sm text-slate-400 pl-8">Get your first month free when you purchase a single payment plan.</p>
             </div>
          </div>
        </div>
      </div>

      {/* Why Choice */}
      <div className="mb-20">
        <h2 className="text-3xl font-heading font-bold text-white mb-10 text-center">Why Choice Home Warranty?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
            { title: "Comprehensive Coverage", desc: "Covers all major systems and appliances regardless of age, make, or model." },
            { title: "Network of Pros", desc: "We have a nationwide network of over 25,000 pre-screened service technicians." },
            { title: "Time & Money Saver", desc: "One call does it all. Save time finding a contractor and money on expensive repairs." }
            ].map((item, i) => (
            <div key={i} className="glass-card p-8 rounded-3xl border-white/5 hover:bg-white/[0.05] transition-all">
                <div className="w-10 h-10 bg-indigo-500/10 rounded-full flex items-center justify-center text-indigo-400 mb-4 font-bold text-lg">
                    {i + 1}
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{item.desc}</p>
            </div>
            ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="glass-card p-12 rounded-[3rem] border-white/5 relative overflow-hidden text-center space-y-8">
        <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-l from-indigo-500/5 to-transparent pointer-events-none"></div>
        <div className="relative z-10 max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-white mb-6">Never Pay Full Price for Repairs</h2>
          <p className="text-slate-400 mb-8">
            Get a free quote today and see how affordable peace of mind can be.
          </p>
          <a 
            href="https://www.anrdoezrs.net/click-7936082-12343542" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex px-10 py-4 bg-white text-slate-900 rounded-2xl font-bold hover:bg-indigo-50 transition-colors shadow-xl items-center gap-3 active:scale-95"
          >
            Get Your Free Quote <ExternalLink className="w-5 h-5 text-indigo-600" />
          </a>
        </div>
      </div>
    </div>
  );
};

export default ChoiceWarrantyPage;
