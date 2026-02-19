
import React from 'react';
import { Link } from 'react-router-dom';
import { Hammer, HardHat, ArrowLeft, Building2, Layers, AlertTriangle } from 'lucide-react';

const BuildersRiskPage: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-6 py-12 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-32">
      <Link to="/products" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-8 group">
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Products
      </Link>

      <div className="text-center space-y-6 mb-16">
        <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full glass border-orange-500/20 text-orange-400 text-[10px] font-bold uppercase tracking-widest">
          <Hammer className="w-3 h-3" /> Construction Risk
        </div>
        <h1 className="text-5xl md:text-7xl font-heading font-bold text-white leading-tight">
          Builders <span className="text-orange-400">Risk.</span>
        </h1>
        <p className="text-slate-400 text-lg leading-relaxed max-w-2xl mx-auto">
          Specialized property insurance for buildings under construction or renovation. Protects materials, fixtures, and the structure itself during the build.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-16">
         <div className="space-y-8">
            <h3 className="text-2xl font-bold text-white">Coverage Includes:</h3>
            <ul className="space-y-4">
                {[
                    { title: 'Structure in Progress', desc: 'The building itself as it is being constructed.', icon: Building2 },
                    { title: 'Materials on Site', desc: 'Lumber, copper, fixtures stored at the job site.', icon: Layers },
                    { title: 'Theft & Vandalism', desc: 'Protection against job site theft and damage.', icon: AlertTriangle },
                    { title: 'In Transit', desc: 'Materials being transported to the construction site.', icon: HardHat }
                ].map((item, i) => (
                    <li key={i} className="flex gap-4 p-4 bg-white/5 rounded-2xl border border-white/5">
                        <div className="p-3 bg-orange-500/10 rounded-xl text-orange-400 h-fit"><item.icon className="w-5 h-5"/></div>
                        <div>
                            <div className="font-bold text-white">{item.title}</div>
                            <p className="text-xs text-slate-400">{item.desc}</p>
                        </div>
                    </li>
                ))}
            </ul>
         </div>
         <div className="glass-card p-10 rounded-[3rem] border-white/10 bg-slate-900/50 flex flex-col justify-center text-center space-y-6">
            <h3 className="text-xl font-bold text-white">Who needs this?</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
                General Contractors, Property Owners, Developers, and House Flippers need Builders Risk for any ground-up construction or major renovation project.
            </p>
            <Link 
                to="/apply"
                state={{ preSelected: 'Builders Risk' }}
                className="w-full py-4 bg-orange-600 hover:bg-orange-500 text-white rounded-xl font-bold transition-all shadow-lg active:scale-95"
            >
                Start Project Quote
            </Link>
         </div>
      </div>
    </div>
  );
};

export default BuildersRiskPage;
