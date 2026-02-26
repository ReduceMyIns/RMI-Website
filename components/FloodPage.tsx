
import React from 'react';
import { Link } from 'react-router-dom';
import { Waves, Umbrella, Home, ArrowLeft, ExternalLink, MapPin, AlertTriangle, Droplets } from 'lucide-react';
import SEOHead from './SEOHead';

const FloodPage: React.FC = () => {
  const neptuneUrl = "https://neptuneflood.com/consumer-app/?source=ZcIJr8qT61%2BJOOeTqKXcTlY%2FXoRDT%2ByYz8ojIB7LpqhcMkJYbf%2BwDu6BNYEjIbK4cUvCbL4HKk8GRHpKzL90wV4dheppAvwXvJCvUHbU4v0%3D";

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-32">
      <SEOHead 
        title="Flood Insurance Quotes | Private Flood Options"
        description="Protect your home from flood damage with private flood insurance. Higher limits and better coverage than NFIP for Murfreesboro residents."
        canonicalUrl="https://www.reducemyinsurance.net/flood"
        keywords={['flood insurance', 'private flood insurance', 'Neptune flood', 'NFIP alternative', 'Murfreesboro TN']}
      />
      <Link to="/products" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-8 group">
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Products
      </Link>

      {/* Hero Section */}
      <div className="relative glass-card rounded-[3rem] p-10 md:p-16 border-white/10 overflow-hidden mb-16">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-500/10 blur-[120px] rounded-full pointer-events-none"></div>
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1 space-y-6">
            <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full glass border-blue-500/20 text-blue-400 text-[10px] font-bold uppercase tracking-widest">
              <Waves className="w-3 h-3" /> Private Flood Insurance
            </div>
            <h1 className="text-5xl md:text-7xl font-heading font-bold text-white leading-tight">
              Don't Get <br/><span className="text-blue-400">Underwater.</span>
            </h1>
            <p className="text-slate-300 text-lg leading-relaxed max-w-xl">
              Homeowners insurance <span className="text-white font-bold">does not</span> cover flood damage. We partner with Neptune to offer higher limits and better coverage than the government NFIP plan.
            </p>
            <div className="flex flex-wrap gap-4 pt-4">
              <a 
                href={neptuneUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-10 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-bold text-lg shadow-xl shadow-blue-500/20 flex items-center justify-center gap-2 transition-all active:scale-95"
              >
                Instant Neptune Quote <ExternalLink className="w-5 h-5" />
              </a>
            </div>
          </div>
          <div className="flex-1 w-full">
             <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-8 rounded-3xl border border-white/10 shadow-2xl relative">
                <div className="space-y-6">
                   <div className="flex items-center gap-4">
                      <div className="p-3 bg-blue-500/20 rounded-xl text-blue-400"><MapPin className="w-6 h-6" /></div>
                      <div>
                         <h4 className="font-bold text-white">Maps are Changing</h4>
                         <p className="text-slate-400 text-xs">25% of all flood claims come from low-to-moderate risk zones.</p>
                      </div>
                   </div>
                   <div className="flex items-center gap-4">
                      <div className="p-3 bg-blue-500/20 rounded-xl text-blue-400"><Home className="w-6 h-6" /></div>
                      <div>
                         <h4 className="font-bold text-white">Higher Limits</h4>
                         <p className="text-slate-400 text-xs">Up to $4M in building coverage (NFIP caps at $250k).</p>
                      </div>
                   </div>
                   <div className="flex items-center gap-4">
                      <div className="p-3 bg-blue-500/20 rounded-xl text-blue-400"><Umbrella className="w-6 h-6" /></div>
                      <div>
                         <h4 className="font-bold text-white">No Wait Period*</h4>
                         <p className="text-slate-400 text-xs">Coverage can often start immediately for loan closings.</p>
                      </div>
                   </div>
                </div>
             </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
         <div className="glass-card p-8 rounded-[2rem] border-white/5 hover:bg-white/[0.05] transition-all">
            <div className="w-12 h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-400 mb-6">
               <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Just 1 Inch</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
               Just one inch of water in your home can cause over $25,000 in damage to flooring, drywall, and furniture.
            </p>
         </div>
         <div className="glass-card p-8 rounded-[2rem] border-white/5 hover:bg-white/[0.05] transition-all">
            <div className="w-12 h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-400 mb-6">
               <Droplets className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Basement Coverage</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
               Unlike the NFIP, our private flood options can provide broader coverage for basement contents and improvements.
            </p>
         </div>
         <div className="glass-card p-8 rounded-[2rem] border-white/5 hover:bg-white/[0.05] transition-all">
            <div className="w-12 h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-400 mb-6">
               <Home className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Loss of Use</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
               We offer optional coverage for temporary housing if your home is uninhabitable during repairs.
            </p>
         </div>
      </div>

      {/* Final CTA */}
      <div className="text-center pt-8">
        <h2 className="text-3xl font-heading font-bold text-white mb-6">Protect your home today.</h2>
        <a 
            href={neptuneUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex px-12 py-5 bg-white text-slate-950 rounded-2xl font-bold text-lg hover:bg-slate-100 transition-all shadow-xl items-center gap-3 active:scale-95"
        >
            Launch Neptune Quote Engine <Waves className="w-5 h-5 text-blue-600" />
        </a>
      </div>
    </div>
  );
};

export default FloodPage;
