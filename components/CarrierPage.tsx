
import React from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { CARRIERS_DATA } from '../data/carriers';
import { ArrowLeft, Phone, Globe, Mail, MapPin, Smartphone, Shield, ExternalLink, ArrowRight, CheckCircle2 } from 'lucide-react';

const CarrierPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const carrier = CARRIERS_DATA.find(c => c.slug === slug);

  if (!carrier) {
    return <Navigate to="/carriers" replace />;
  }

  return (
    <div className="max-w-6xl mx-auto py-12 px-6 animate-in fade-in slide-in-from-bottom-8 duration-700">
      <Link to="/carriers" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-8 group">
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Network
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* Main Content */}
        <div className="lg:col-span-8 space-y-12">
          {/* Header */}
          <div className="glass-card p-10 rounded-[3rem] border-white/5 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 blur-[80px] rounded-full pointer-events-none"></div>
            <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
              <div className="w-32 h-32 bg-white rounded-3xl p-4 flex items-center justify-center shadow-xl">
                <img src={carrier.logo} alt={`${carrier.name} Logo`} className="max-w-full max-h-full object-contain" />
              </div>
              <div className="text-center md:text-left space-y-4">
                <h1 className="text-4xl md:text-5xl font-heading font-bold text-white">{carrier.name}</h1>
                <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-widest">
                  <Shield className="w-3 h-3" /> {carrier.serviceLevel} Partner
                </div>
                <p className="text-slate-400 leading-relaxed max-w-xl">
                  {carrier.description}
                </p>
              </div>
            </div>
            
            <div className="mt-10 pt-10 border-t border-white/10 flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <Link 
                to="/apply"
                className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-bold transition-all shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 active:scale-95"
              >
                Get a {carrier.name} Quote <ArrowRight className="w-5 h-5" />
              </Link>
              {carrier.loginUrl && (
                <a 
                  href={carrier.loginUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-2xl font-bold transition-all flex items-center justify-center gap-2"
                >
                  Client Login <ExternalLink className="w-4 h-4 text-slate-400" />
                </a>
              )}
            </div>
          </div>

          {/* Products */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white font-heading flex items-center gap-3">
              <Shield className="w-6 h-6 text-indigo-400" /> Coverage Products
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {carrier.products?.map((product) => (
                <div key={product} className="p-4 bg-white/5 border border-white/5 rounded-2xl flex items-center gap-3 hover:bg-white/10 transition-colors group">
                  <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <CheckCircle2 className="w-4 h-4 text-blue-400" />
                  </div>
                  <span className="font-bold text-slate-200">{product}</span>
                </div>
              ))}
            </div>
          </div>

          {/* About */}
          <div className="glass-card p-8 rounded-3xl border-white/5">
            <h3 className="text-xl font-bold text-white font-heading mb-4">About {carrier.name}</h3>
            <p className="text-slate-400 leading-relaxed">
              We shop {carrier.name} alongside 175+ other top-rated carriers to ensure you get the best possible coverage at the lowest price. 
              As an independent agency, ReduceMyInsurance.Net works for you, not the insurance company. We can help you compare 
              {carrier.name}'s offerings with other market leaders to find your perfect match.
            </p>
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-4 space-y-6">
          <div className="glass-card p-8 rounded-[2.5rem] border-white/5 space-y-8 sticky top-32">
            <div>
              <h3 className="text-lg font-bold text-white uppercase tracking-widest mb-6 border-b border-white/10 pb-4">Contact & Support</h3>
              <ul className="space-y-5">
                <li className="flex items-start gap-4">
                  <div className="p-2 bg-white/5 rounded-xl"><Phone className="w-5 h-5 text-blue-400" /></div>
                  <div>
                    <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Phone</div>
                    <a href={`tel:${carrier.phone}`} className="text-white font-bold hover:text-blue-400 transition-colors">{carrier.phone}</a>
                  </div>
                </li>
                {carrier.email && (
                  <li className="flex items-start gap-4">
                    <div className="p-2 bg-white/5 rounded-xl"><Mail className="w-5 h-5 text-indigo-400" /></div>
                    <div>
                      <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Processing Email</div>
                      <a href={`mailto:${carrier.email}`} className="text-white font-bold hover:text-indigo-400 transition-colors break-all">{carrier.email}</a>
                    </div>
                  </li>
                )}
                <li className="flex items-start gap-4">
                  <div className="p-2 bg-white/5 rounded-xl"><Globe className="w-5 h-5 text-emerald-400" /></div>
                  <div>
                    <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Website</div>
                    <a href={carrier.loginUrl} target="_blank" rel="noreferrer" className="text-white font-bold hover:text-emerald-400 transition-colors">Official Portal</a>
                  </div>
                </li>
              </ul>
            </div>

            {carrier.billingAddress && (
              <div>
                <h3 className="text-lg font-bold text-white uppercase tracking-widest mb-6 border-b border-white/10 pb-4">Billing Address</h3>
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-white/5 rounded-xl"><MapPin className="w-5 h-5 text-red-400" /></div>
                  <div className="text-slate-300 text-sm font-medium leading-relaxed">
                    {carrier.billingAddress}
                  </div>
                </div>
              </div>
            )}

            {carrier.apps && (
              <div>
                <h3 className="text-lg font-bold text-white uppercase tracking-widest mb-6 border-b border-white/10 pb-4">Mobile App</h3>
                <div className="grid grid-cols-2 gap-3">
                  {carrier.apps.ios && (
                    <a href={carrier.apps.ios} target="_blank" rel="noreferrer" className="p-3 bg-white/5 hover:bg-white/10 rounded-xl border border-white/5 text-center transition-all group">
                      <Smartphone className="w-6 h-6 text-white mx-auto mb-2 group-hover:scale-110 transition-transform" />
                      <div className="text-[10px] font-bold text-slate-400">iOS</div>
                    </a>
                  )}
                  {carrier.apps.android && (
                    <a href={carrier.apps.android} target="_blank" rel="noreferrer" className="p-3 bg-white/5 hover:bg-white/10 rounded-xl border border-white/5 text-center transition-all group">
                      <Smartphone className="w-6 h-6 text-green-400 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                      <div className="text-[10px] font-bold text-slate-400">Android</div>
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarrierPage;
