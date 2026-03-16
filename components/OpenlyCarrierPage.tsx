
import React from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft, Phone, Globe, Mail, MapPin, Shield,
  ExternalLink, ArrowRight, CheckCircle2, MessageSquare,
  FileText, Settings
} from 'lucide-react';
import SEOHead from './SEOHead';

function openOpenlyChat() {
  window.open('https://openly.com/contact-us', '_blank', 'noopener');
}

const carrier = {
  name: 'Openly',
  logo: 'https://raw.githubusercontent.com/ReduceMyIns/RMI-Website/main/public/carrier-logos/Openly-transparent-logo.png',
  phone: '857-990-9080',
  serviceLevel: 'Full Service',
  loginUrl: 'https://bit.ly/3vzLWBR',
  products: [
    'Homeowners',
    'Dwelling Fire',
    'FarmOwner',
    'Vacation Rentals',
    'Builders Risk',
    'Installation/Builders Risk',
  ],
  billingAddress: 'Dept. CH 17209, Palatine, IL 60055',
  email: 'service@openly.com',
  description:
    'Openly provides premium homeowners insurance through independent agents. They offer broad coverage, competitive pricing, and a seamless claims process.',
};

const OpenlyCarrierPage: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto py-12 px-6 animate-in fade-in slide-in-from-bottom-8 duration-700">
      <SEOHead
        title="Openly Insurance | Coverage & Policy Service"
        description="Manage your Openly homeowners insurance policy. Access documents, request policy changes, and get support through ReduceMyInsurance.Net."
        canonicalUrl="https://www.reducemyinsurance.net/carrier/openly"
        keywords={['Openly insurance', 'homeowners insurance', 'Openly policy service', 'Openly documents']}
      />

      <Link
        to="/carriers"
        className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-8 group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Network
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* ── Main Content ─────────────────────────────────────────────────── */}
        <div className="lg:col-span-8 space-y-12">

          {/* Header */}
          <div className="glass-card p-10 rounded-[3rem] border-white/5 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 blur-[80px] rounded-full pointer-events-none" />
            <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
              <div className="w-32 h-32 bg-white rounded-3xl p-4 flex items-center justify-center shadow-xl">
                <img
                  src={carrier.logo}
                  alt="Openly Logo"
                  className="max-w-full max-h-full object-contain"
                />
              </div>
              <div className="text-center md:text-left space-y-4">
                <h1 className="text-4xl md:text-5xl font-heading font-bold text-white">Openly</h1>
                <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-widest">
                  <Shield className="w-3 h-3" /> Full Service Partner
                </div>
                <p className="text-slate-400 leading-relaxed max-w-xl">{carrier.description}</p>
              </div>
            </div>

            <div className="mt-10 pt-10 border-t border-white/10 flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <Link
                to="/apply"
                className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-bold transition-all shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 active:scale-95"
              >
                Get an Openly Quote <ArrowRight className="w-5 h-5" />
              </Link>
              <a
                href={carrier.loginUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-2xl font-bold transition-all flex items-center justify-center gap-2"
              >
                Client Login <ExternalLink className="w-4 h-4 text-slate-400" />
              </a>
            </div>
          </div>

          {/* ── Document & Policy Service ─────────────────────────────────── */}
          <div className="glass-card p-8 rounded-3xl border border-blue-500/20 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500/5 blur-[60px] rounded-full pointer-events-none" />
            <div className="relative z-10 space-y-6">
              <h2 className="text-2xl font-bold text-white font-heading flex items-center gap-3">
                <Settings className="w-6 h-6 text-blue-400" /> Document &amp; Policy Service
              </h2>
              <p className="text-slate-400 leading-relaxed">
                Need to request policy documents, make a coverage change, or get help with your
                Openly policy? Chat directly with Openly's team using the button below — they
                typically respond in minutes.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 bg-white/5 border border-white/5 rounded-2xl flex items-start gap-3">
                  <FileText className="w-5 h-5 text-blue-400 mt-0.5 shrink-0" />
                  <div>
                    <div className="font-bold text-slate-200 text-sm">Document Requests</div>
                    <div className="text-slate-500 text-xs mt-1">
                      Dec pages, ID cards, proof of insurance, loss runs
                    </div>
                  </div>
                </div>
                <div className="p-4 bg-white/5 border border-white/5 rounded-2xl flex items-start gap-3">
                  <Settings className="w-5 h-5 text-indigo-400 mt-0.5 shrink-0" />
                  <div>
                    <div className="font-bold text-slate-200 text-sm">Policy Changes</div>
                    <div className="text-slate-500 text-xs mt-1">
                      Coverage updates, endorsements, mortgagee changes
                    </div>
                  </div>
                </div>
              </div>

              <button
                onClick={openOpenlyChat}
                className="inline-flex items-center gap-3 px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-bold transition-all shadow-lg shadow-blue-500/25 active:scale-95"
              >
                <MessageSquare className="w-5 h-5" />
                Chat with Openly Now
              </button>

              <p className="text-slate-600 text-xs">
                Prefer email?{' '}
                <a href={`mailto:${carrier.email}`} className="text-blue-400 hover:underline">
                  {carrier.email}
                </a>{' '}
                · Phone:{' '}
                <a href={`tel:${carrier.phone}`} className="text-blue-400 hover:underline">
                  {carrier.phone}
                </a>
              </p>
            </div>
          </div>

          {/* Products */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white font-heading flex items-center gap-3">
              <Shield className="w-6 h-6 text-indigo-400" /> Coverage Products
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {carrier.products.map((product) => (
                <div
                  key={product}
                  className="p-4 bg-white/5 border border-white/5 rounded-2xl flex items-center gap-3 hover:bg-white/10 transition-colors group"
                >
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
            <h3 className="text-xl font-bold text-white font-heading mb-4">About Openly</h3>
            <p className="text-slate-400 leading-relaxed">
              We shop Openly alongside 175+ other top-rated carriers to ensure you get the best
              possible coverage at the lowest price. As an independent agency,
              ReduceMyInsurance.Net works for you, not the insurance company.
            </p>
          </div>
        </div>

        {/* ── Sidebar ──────────────────────────────────────────────────────── */}
        <div className="lg:col-span-4 space-y-6">
          <div className="glass-card p-8 rounded-[2.5rem] border-white/5 space-y-8 sticky top-32">
            <div>
              <h3 className="text-lg font-bold text-white uppercase tracking-widest mb-6 border-b border-white/10 pb-4">
                Contact &amp; Support
              </h3>
              <ul className="space-y-5">
                <li className="flex items-start gap-4">
                  <div className="p-2 bg-white/5 rounded-xl">
                    <Phone className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Phone</div>
                    <a
                      href={`tel:${carrier.phone}`}
                      className="text-white font-bold hover:text-blue-400 transition-colors"
                    >
                      {carrier.phone}
                    </a>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="p-2 bg-white/5 rounded-xl">
                    <Mail className="w-5 h-5 text-indigo-400" />
                  </div>
                  <div>
                    <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                      Processing Email
                    </div>
                    <a
                      href={`mailto:${carrier.email}`}
                      className="text-white font-bold hover:text-indigo-400 transition-colors break-all"
                    >
                      {carrier.email}
                    </a>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="p-2 bg-white/5 rounded-xl">
                    <Globe className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div>
                    <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Website</div>
                    <a
                      href={carrier.loginUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-white font-bold hover:text-emerald-400 transition-colors"
                    >
                      Official Portal
                    </a>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="p-2 bg-white/5 rounded-xl">
                    <MessageSquare className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                      Live Chat
                    </div>
                    <button
                      onClick={openOpenlyChat}
                      className="text-white font-bold hover:text-blue-400 transition-colors text-left"
                    >
                      Chat with Openly →
                    </button>
                  </div>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-bold text-white uppercase tracking-widest mb-6 border-b border-white/10 pb-4">
                Billing Address
              </h3>
              <div className="flex items-start gap-4">
                <div className="p-2 bg-white/5 rounded-xl">
                  <MapPin className="w-5 h-5 text-red-400" />
                </div>
                <div className="text-slate-300 text-sm font-medium leading-relaxed">
                  {carrier.billingAddress}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OpenlyCarrierPage;
