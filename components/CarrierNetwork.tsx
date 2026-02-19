
import React, { useState } from 'react';
import { Shield } from 'lucide-react';
import { Link } from 'react-router-dom';
import { CARRIERS_DATA } from '../data/carriers';

const CarrierCard: React.FC<{ name: string; logo: string; slug: string }> = ({ name, logo, slug }) => {
  const [imgError, setImgError] = useState(false);

  return (
    <Link to={`/carrier/${slug}`} className="block">
      <div className="glass-card p-6 rounded-3xl flex flex-col items-center justify-center border border-white/5 hover:border-blue-500/30 hover:bg-white/5 transition-all duration-300 group h-32 relative overflow-hidden">
        {!imgError ? (
          <div className="p-2 bg-white/5 rounded-xl group-hover:bg-white/10 transition-colors w-full h-full flex items-center justify-center">
              <img 
                src={logo} 
                alt={name} 
                referrerPolicy="no-referrer"
                className="max-h-full max-w-full object-contain filter grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500"
                onError={() => setImgError(true)}
              />
          </div>
        ) : (
          <div className="text-center z-10 flex flex-col items-center justify-center h-full w-full">
             <Shield className="w-8 h-8 text-blue-500/50 mx-auto mb-2 group-hover:text-blue-400 transition-colors" />
             <span className="font-bold text-white text-xs text-center px-2 uppercase tracking-wide">{name}</span>
          </div>
        )}
      </div>
    </Link>
  );
};

const CarrierNetwork: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-6 py-12 space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      <div className="text-center max-w-3xl mx-auto space-y-6">
        <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full glass border-blue-500/20 text-blue-400 text-[10px] font-bold uppercase tracking-widest">
          <Shield className="w-3 h-3" /> Carrier Network
        </div>
        <h1 className="text-5xl md:text-6xl font-heading font-bold tracking-tight text-white leading-tight">
          Trusted <span className="text-blue-400">Partners.</span>
        </h1>
        <p className="text-slate-400 text-lg leading-relaxed">
          We shop over 175+ insurance carriers to find you the best coverage at the best price.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {CARRIERS_DATA.map((carrier) => (
          <CarrierCard key={carrier.slug} name={carrier.name} logo={carrier.logo} slug={carrier.slug} />
        ))}
      </div>
      
      <div className="p-8 text-center text-slate-500 text-sm">
        And many more specialty carriers for unique risks...
      </div>
    </div>
  );
};

export default CarrierNetwork;
