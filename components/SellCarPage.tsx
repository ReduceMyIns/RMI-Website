
import React from 'react';
import { ArrowLeft, Car, DollarSign, Truck, CheckCircle2, ExternalLink, Clock, FileCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import SEOHead from './SEOHead';

const SellCarPage: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-6 py-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <SEOHead 
        title="Sell Your Car Instantly | Cash for Cars Murfreesboro"
        description="Turn your unwanted vehicle into cash today. We buy cars in any condition with free towing and instant payment in Murfreesboro TN."
        canonicalUrl="https://www.reducemyinsurance.net/sell-car"
        keywords={['sell my car', 'cash for cars', 'junk car removal', 'instant car offer', 'Murfreesboro TN']}
      />
      <Link to="/products" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-8 group">
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Products
      </Link>

      <div className="text-center space-y-6 mb-16">
        <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full glass border-green-500/20 text-green-400 text-[10px] font-bold uppercase tracking-widest">
          <DollarSign className="w-3 h-3" /> Cash for Cars
        </div>
        <h1 className="text-4xl md:text-6xl font-heading font-bold tracking-tight text-white leading-tight">
          Sell Your Car <span className="text-green-400">Instantly</span>
        </h1>
        <p className="text-slate-400 text-lg leading-relaxed max-w-2xl mx-auto">
          Turn your unwanted vehicle into cash today. We accept cars in any condition—running or not. 
          Get an instant offer and enjoy free pickup.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
         <div className="space-y-8">
            <div className="glass-card p-10 rounded-[2.5rem] border-white/5 space-y-8 relative overflow-hidden ring-1 ring-white/10 hover:ring-green-500/30 transition-all">
                <div className="absolute top-0 right-0 w-64 h-64 bg-green-500/10 blur-[80px] rounded-full pointer-events-none"></div>
                
                <div className="flex items-center gap-6 relative z-10">
                    <div className="w-20 h-20 bg-green-500/20 rounded-3xl flex items-center justify-center text-green-400 shadow-lg shadow-green-500/10">
                        <DollarSign className="w-10 h-10" />
                    </div>
                    <div>
                        <h3 className="text-3xl font-heading font-bold text-white">Instant Offer</h3>
                        <p className="text-slate-400 mt-1">No haggling. See your price in seconds.</p>
                    </div>
                </div>

                <div className="space-y-4 pt-4 border-t border-white/5 relative z-10">
                    {[
                        "We buy cars in any condition (Junk, Damaged, Old)",
                        "Free towing & pickup included nationwide",
                        "Payment issued on the spot",
                        "No paperwork headaches"
                    ].map((item, i) => (
                        <div key={i} className="flex items-center gap-4 text-slate-300">
                            <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0">
                                <CheckCircle2 className="w-3.5 h-3.5 text-green-400" />
                            </div>
                            <span className="font-medium">{item}</span>
                        </div>
                    ))}
                </div>

                <a 
                    href="https://sell.peddle.com/offer?pub_id=5173053" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-full py-5 bg-green-600 hover:bg-green-500 text-white rounded-2xl font-bold text-xl shadow-xl shadow-green-500/20 flex items-center justify-center gap-3 transition-all active:scale-95 relative z-10"
                >
                    Get My Instant Offer <ExternalLink className="w-5 h-5" />
                </a>
            </div>
         </div>

         <div className="grid grid-cols-1 gap-6">
            <div className="glass-card p-8 rounded-[2rem] border-white/5 flex items-center gap-6 hover:bg-white/[0.05] transition-colors">
                <div className="w-14 h-14 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-400 shrink-0">
                    <Truck className="w-7 h-7" />
                </div>
                <div>
                    <h4 className="font-bold text-white text-xl mb-1">Free Towing</h4>
                    <p className="text-slate-400 text-sm leading-relaxed">We come to you. Schedule a pickup time that fits your busy life, anywhere in the USA.</p>
                </div>
            </div>
            
            <div className="glass-card p-8 rounded-[2rem] border-white/5 flex items-center gap-6 hover:bg-white/[0.05] transition-colors">
                <div className="w-14 h-14 bg-purple-500/10 rounded-2xl flex items-center justify-center text-purple-400 shrink-0">
                    <Car className="w-7 h-7" />
                </div>
                <div>
                    <h4 className="font-bold text-white text-xl mb-1">Any Condition</h4>
                    <p className="text-slate-400 text-sm leading-relaxed">Wrecked, broken, or just unwanted. Even if it doesn't run, we'll buy it from you.</p>
                </div>
            </div>
            
            <div className="glass-card p-8 rounded-[2rem] border-white/5 flex items-center gap-6 hover:bg-white/[0.05] transition-colors">
                <div className="w-14 h-14 bg-orange-500/10 rounded-2xl flex items-center justify-center text-orange-400 shrink-0">
                    <FileCheck className="w-7 h-7" />
                </div>
                <div>
                    <h4 className="font-bold text-white text-xl mb-1">Title Transfer</h4>
                    <p className="text-slate-400 text-sm leading-relaxed">We handle the ownership transfer paperwork so you don't have to worry about a thing.</p>
                </div>
            </div>
         </div>
      </div>
    </div>
  );
};

export default SellCarPage;
