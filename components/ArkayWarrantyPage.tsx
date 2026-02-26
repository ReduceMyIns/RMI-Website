import React from 'react';
import { ArrowLeft, Shield, Wrench, Car, CheckCircle, ArrowRight, ExternalLink, Truck } from 'lucide-react';
import { Link } from 'react-router-dom';

const ArkayWarrantyPage: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-6 py-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <SEOHead 
        title="Arkay Auto & RV Warranty | Extended Vehicle Protection"
        description="Protect your vehicle from unexpected repair costs with Arkay Auto Warranty. Comprehensive coverage for cars, trucks, and RVs with 24/7 roadside assistance."
        canonicalUrl="https://www.reducemyinsurance.net/arkay-warranty"
        keywords={['auto warranty', 'RV warranty', 'extended vehicle protection', 'Arkay warranty', 'car repair insurance']}
      />
      <Link to="/products" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-8 group">
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Products
      </Link>

      {/* Hero Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
        <div className="space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 text-blue-400 text-xs font-bold uppercase tracking-widest border border-blue-500/20">
            <Shield className="w-3 h-3" /> Premier Vehicle Protection
          </div>
          
          <h1 className="text-5xl md:text-7xl font-heading font-bold text-white leading-tight">
            Extended Warranty <br />
            <span className="text-blue-400">For Auto & RV</span>
          </h1>
          
          <p className="text-lg text-slate-400 leading-relaxed max-w-xl">
            Don't let unexpected repairs drain your savings. Arkay Auto Warranty provides comprehensive coverage for your car, truck, or RV, giving you peace of mind on every mile.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <a 
              href="https://arkay.info/FC98684" 
              target="_blank" 
              rel="noopener noreferrer"
              className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-500/20 active:scale-95"
            >
              Get A Free Quote <ArrowRight className="w-5 h-5" />
            </a>
            <div className="flex items-center gap-2 px-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-slate-300 font-medium">
              <Wrench className="w-5 h-5 text-blue-400" /> 24/7 Roadside Assistance
            </div>
          </div>
        </div>
        
        <div className="relative">
          <div className="absolute inset-0 bg-blue-500/20 blur-[100px] rounded-full"></div>
          <div className="relative glass-card p-8 rounded-[2.5rem] border-white/10 overflow-hidden">
             {/* Abstract Car/RV Graphic */}
             <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/5 p-6 rounded-2xl border border-white/5 flex flex-col items-center text-center gap-4">
                    <Car className="w-12 h-12 text-blue-400" />
                    <div className="font-bold text-white">Auto Coverage</div>
                    <p className="text-xs text-slate-400">Engine, Transmission, Electrical, AC, and more.</p>
                </div>
                <div className="bg-white/5 p-6 rounded-2xl border border-white/5 flex flex-col items-center text-center gap-4">
                    <Truck className="w-12 h-12 text-blue-400" />
                    <div className="font-bold text-white">RV Protection</div>
                    <p className="text-xs text-slate-400">Coach components, slide-outs, leveling systems.</p>
                </div>
             </div>
             
             <div className="mt-6 p-6 bg-blue-500/10 rounded-2xl border border-blue-500/20">
                <div className="flex items-center gap-3 mb-2">
                    <CheckCircle className="w-5 h-5 text-blue-400" />
                    <span className="font-bold text-white">Nationwide Coverage</span>
                </div>
                <p className="text-sm text-slate-400 pl-8">Use any ASE certified mechanic in the US or Canada.</p>
             </div>
          </div>
        </div>
      </div>

      {/* Why Arkay */}
      <div className="mb-20">
        <h2 className="text-3xl font-heading font-bold text-white mb-10 text-center">Why Choose Arkay?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
            { title: "Comprehensive Plans", desc: "From powertrain to bumper-to-bumper exclusionary coverage, we have a plan that fits your budget." },
            { title: "Claims Paid Directly", desc: "We pay the repair facility directly so you don't have to pay out of pocket and wait for reimbursement." },
            { title: "Transferable Coverage", desc: "If you sell your vehicle, your warranty can be transferred to the new owner, increasing resale value." }
            ].map((item, i) => (
            <div key={i} className="glass-card p-8 rounded-3xl border-white/5 hover:bg-white/[0.05] transition-all">
                <div className="w-10 h-10 bg-blue-500/10 rounded-full flex items-center justify-center text-blue-400 mb-4 font-bold text-lg">
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
        <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-l from-blue-500/5 to-transparent pointer-events-none"></div>
        <div className="relative z-10 max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-white mb-6">Protect Your Ride Today</h2>
          <p className="text-slate-400 mb-8">
            Get a free, no-obligation quote in seconds. See how much you can save on vehicle repairs.
          </p>
          <a 
            href="https://arkay.info/FC98684" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex px-10 py-4 bg-white text-slate-900 rounded-2xl font-bold hover:bg-blue-50 transition-colors shadow-xl items-center gap-3 active:scale-95"
          >
            Get Your Quote <ExternalLink className="w-5 h-5 text-blue-600" />
          </a>
        </div>
      </div>
    </div>
  );
};

export default ArkayWarrantyPage;
