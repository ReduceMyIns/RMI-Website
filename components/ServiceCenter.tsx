
import React, { useState, useMemo } from 'react';
import { 
  UserPlus, UserMinus, UserCog, Car, MapPin, FileText, 
  HelpCircle, MessageSquare, ArrowLeft, Shield, Search, Phone, ExternalLink, Smartphone,
  AlertTriangle, DollarSign, RefreshCw, X, FileCheck
} from 'lucide-react';
import NowCertsIframe from './NowCertsIframe';
import { SERVICE_CARRIERS, ServiceCarrier } from '../data/serviceCarriers';
import SEOHead from './SEOHead';

type RequestType = 'BILLING' | 'CLAIMS' | 'DOCS' | 'CHANGES' | 'CANCEL' | 'COI' | 'RESHOP';

const REQUEST_OPTIONS = [
  { id: 'BILLING', label: 'Billing & Payments', icon: DollarSign, desc: 'Pay bill, update payment method' },
  { id: 'CLAIMS', label: 'Report a Claim', icon: AlertTriangle, desc: 'File new claim or check status' },
  { id: 'DOCS', label: 'Policy Documents', icon: FileText, desc: 'Get ID cards, dec pages, and copies' },
  { id: 'CHANGES', label: 'Policy Changes', icon: UserCog, desc: 'Add driver, vehicle, or address' },
  { id: 'COI', label: 'Certificate (COI)', icon: Shield, desc: 'Request commercial certificate' },
  { id: 'RESHOP', label: 'Re-Shop Rate', icon: RefreshCw, desc: 'Look for a better price' },
  { id: 'CANCEL', label: 'Cancel Policy', icon: X, desc: 'Request policy cancellation' },
];

const ServiceCenter: React.FC = () => {
  const [selectedCarrier, setSelectedCarrier] = useState<ServiceCarrier | null>(null);
  const [carrierSearch, setCarrierSearch] = useState('');
  const [requestType, setRequestType] = useState<RequestType | null>(null);

  const filteredCarriers = useMemo(() => {
    if (!carrierSearch) return SERVICE_CARRIERS;
    return SERVICE_CARRIERS.filter(c => c.name.toLowerCase().includes(carrierSearch.toLowerCase()));
  }, [carrierSearch]);

  const handleReset = () => {
    setSelectedCarrier(null);
    setRequestType(null);
    setCarrierSearch('');
  };

  const availableOptions = useMemo(() => {
      if (!selectedCarrier) return [];
      return REQUEST_OPTIONS.filter(opt => {
          // Hide COI if carrier doesn't support Commercial
          if (opt.id === 'COI' && !selectedCarrier.types.includes('Commercial')) return false;
          return true;
      });
  }, [selectedCarrier]);

  const getAction = () => {
    if (!selectedCarrier || !requestType) return null;

    // EXCEPTIONS: Specific carriers allow direct COI issuance
    if (requestType === 'COI') {
        const selfServiceCoiCarriers = ['Next Insurance', 'Thimble', 'Coterie'];
        if (selfServiceCoiCarriers.includes(selectedCarrier.name)) {
            return 'CARRIER';
        }
        return 'AGENCY';
    }

    // AGENCY ALWAYS HANDLES THESE
    if (['CANCEL', 'RESHOP'].includes(requestType)) {
      return 'AGENCY';
    }

    // FULL SERVICE CARRIER
    if (selectedCarrier.serviceLevel === 'Full Service') {
      // Full service handles Billing, Claims, Docs, Changes directly
      return 'CARRIER';
    }

    // BILLING & CLAIM SERVICE
    if (selectedCarrier.serviceLevel === 'Billing & Claim Service' || selectedCarrier.serviceLevel === 'Partial Service') {
      // Handles Billing and Claims directly
      if (['BILLING', 'CLAIMS'].includes(requestType)) return 'CARRIER';
      // Changes and Docs go to Agency
      return 'AGENCY';
    }

    // AGENCY SERVICED
    return 'AGENCY';
  };

  const renderCarrierAction = () => {
    if (!selectedCarrier) return null;
    return (
      <div className="space-y-6 animate-in slide-in-from-bottom-4">
        <div className="bg-blue-600/10 border border-blue-500/20 p-6 rounded-2xl text-center space-y-4">
          <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center mx-auto shadow-lg mb-2 p-2">
             {selectedCarrier.logo ? (
                 <img src={selectedCarrier.logo} alt={selectedCarrier.name} className="max-w-full max-h-full object-contain" />
             ) : (
                 <Shield className="w-10 h-10 text-blue-500" />
             )}
          </div>
          <h3 className="text-xl font-bold text-white">Contact {selectedCarrier.name} Directly</h3>
          <p className="text-slate-400 text-sm">
            {selectedCarrier.name} handles {requestType?.toLowerCase().replace('_', ' ')} requests directly for the fastest service.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
            <a href={`tel:${selectedCarrier.phone}`} className="flex items-center justify-center gap-3 p-4 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 transition-all group">
              <div className="p-2 bg-blue-500 rounded-full text-white"><Phone className="w-5 h-5" /></div>
              <div className="text-left">
                <div className="text-[10px] uppercase text-slate-500 font-bold">Call Support</div>
                <div className="text-white font-bold group-hover:text-blue-400">{selectedCarrier.phone}</div>
              </div>
            </a>
            
            {selectedCarrier.loginUrl && (
              <a href={selectedCarrier.loginUrl} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-3 p-4 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 transition-all group">
                <div className="p-2 bg-emerald-500 rounded-full text-white"><ExternalLink className="w-5 h-5" /></div>
                <div className="text-left">
                  <div className="text-[10px] uppercase text-slate-500 font-bold">Online Portal</div>
                  <div className="text-white font-bold group-hover:text-emerald-400">Login to Account</div>
                </div>
              </a>
            )}
          </div>

          {(selectedCarrier.iosApp || selectedCarrier.androidApp) && (
             <div className="pt-4 border-t border-white/10">
                <div className="text-xs text-slate-500 mb-3 uppercase tracking-widest font-bold">Download Mobile App</div>
                <div className="flex justify-center gap-4">
                   {selectedCarrier.iosApp && <a href={selectedCarrier.iosApp} target="_blank" rel="noreferrer" className="text-white hover:text-blue-400"><Smartphone className="w-6 h-6" /> iOS</a>}
                   {selectedCarrier.androidApp && <a href={selectedCarrier.androidApp} target="_blank" rel="noreferrer" className="text-white hover:text-green-400"><Smartphone className="w-6 h-6" /> Android</a>}
                </div>
             </div>
          )}
        </div>
      </div>
    );
  };

  const renderAgencyAction = () => {
    let url = '';
    let title = 'Submit Request';
    let message = 'Our agency team will process your request shortly.';

    // Map request types to NowCerts URLs and Messages
    switch (requestType) {
        case 'BILLING': 
            url = 'https://www1.nowcerts.com/ServiceRequests_GeneralNews/Insert.aspx?InsuranceAgencyId=7b9d101f-6a6c-40a6-b256-bfd8a901c277&IsPopup=true'; 
            title = 'Billing Inquiry';
            break;
        case 'CLAIMS': 
            url = 'https://www1.nowcerts.com/ServiceRequests_GeneralNews/Insert.aspx?InsuranceAgencyId=7b9d101f-6a6c-40a6-b256-bfd8a901c277&IsPopup=true'; 
            title = 'File a Claim';
            break;
        case 'DOCS': 
            url = 'https://www1.nowcerts.com/ServiceRequests_CertificateofInsurances/Insert.aspx?InsuranceAgencyId=7b9d101f-6a6c-40a6-b256-bfd8a901c277&IsPopup=true'; 
            title = 'Request Documents';
            message = 'Request policy declarations, ID cards, or copies of your policy.';
            break; 
        case 'CHANGES': 
            // Switched to General News Request per user instruction for reliable fallback
            url = 'https://www1.nowcerts.com/ServiceRequests_GeneralNews/Insert.aspx?InsuranceAgencyId=7b9d101f-6a6c-40a6-b256-bfd8a901c277&IsPopup=true'; 
            title = 'Policy Change Request';
            message = 'Please detail the changes you need (e.g. Add vehicle VIN, Add driver Name/DOB).';
            break;
        case 'COI': 
            url = 'https://www1.nowcerts.com/ServiceRequests_CertificateofInsurances/Insert.aspx?InsuranceAgencyId=7b9d101f-6a6c-40a6-b256-bfd8a901c277&IsPopup=true'; 
            title = 'Certificate Request';
            break;
        case 'CANCEL': 
            url = 'https://www1.nowcerts.com/ServiceRequests_GeneralNews/Insert.aspx?InsuranceAgencyId=7b9d101f-6a6c-40a6-b256-bfd8a901c277&IsPopup=true'; 
            title = 'Cancellation Request';
            message = 'Please note that cancellations require a signed request. Our team will contact you.';
            break;
        case 'RESHOP': 
            url = 'https://www1.nowcerts.com/ServiceRequests_GeneralNews/Insert.aspx?InsuranceAgencyId=7b9d101f-6a6c-40a6-b256-bfd8a901c277&IsPopup=true'; 
            title = 'Rate Review Request';
            message = 'Our agents will review your current policy and shop the market for better rates.';
            break;
        default: 
            url = 'https://www1.nowcerts.com/ServiceRequests_GeneralNews/Insert.aspx?InsuranceAgencyId=7b9d101f-6a6c-40a6-b256-bfd8a901c277&IsPopup=true';
    }

    if (requestType === 'CANCEL' || requestType === 'RESHOP') {
         return (
             <div className="bg-slate-900 border border-white/10 p-8 rounded-2xl text-center space-y-6">
                 <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto text-white shadow-lg shadow-blue-500/30">
                     <Shield className="w-8 h-8" />
                 </div>
                 <div>
                     <h3 className="text-2xl font-bold text-white mb-2">{title}</h3>
                     <p className="text-slate-400 leading-relaxed max-w-md mx-auto">
                        {message}
                     </p>
                 </div>
                 <div className="flex flex-col sm:flex-row gap-4 justify-center">
                     <a href="tel:615-900-0288" className="px-8 py-4 bg-white text-slate-900 font-bold rounded-xl hover:bg-slate-200 transition-colors">Call (615) 900-0288</a>
                     <button onClick={() => window.open('mailto:service@reducemyinsurance.net')} className="px-8 py-4 bg-white/10 text-white font-bold rounded-xl hover:bg-white/20 transition-colors">Email Service Team</button>
                 </div>
                 <div className="pt-6 border-t border-white/5">
                    <p className="text-xs text-slate-500 mb-4">Or submit a written request below:</p>
                    <NowCertsIframe url={url} height="800" />
                 </div>
             </div>
         )
    }

    return (
        <div className="space-y-4">
            <div className="bg-slate-800/50 p-4 rounded-xl border border-white/5 text-center mb-4">
                <p className="text-slate-300 text-sm">
                    {selectedCarrier?.name} requests of this type are handled by our agency team. {message}
                </p>
            </div>
            <NowCertsIframe url={url} height="1200" />
        </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <SEOHead 
        title="Policy Service Center | Manage Your Insurance"
        description="Access your insurance carrier's service portal, report claims, pay bills, or request policy changes through our centralized service center."
        canonicalUrl="https://www.reducemyinsurance.net/service"
        keywords={['insurance service', 'report claim', 'pay insurance bill', 'policy changes', 'certificate of insurance']}
      />
      
      {/* Header */}
      <div className="text-center space-y-6 mb-12">
        <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full glass border-blue-500/20 text-blue-400 text-[10px] font-bold uppercase tracking-widest">
          <Shield className="w-3 h-3" /> Policy Service Center
        </div>
        <h1 className="text-4xl md:text-6xl font-heading font-bold tracking-tight text-white leading-tight">
          How can we <span className="text-blue-400">help you</span> today?
        </h1>
      </div>

      {/* Step 1: Select Carrier */}
      {!selectedCarrier && (
         <div className="glass-card p-8 rounded-[2rem] border-white/5 space-y-6 max-w-2xl mx-auto">
             <h3 className="text-xl font-bold text-white text-center">First, select your insurance carrier</h3>
             <div className="relative">
                 <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5" />
                 <input 
                    autoFocus
                    type="text" 
                    placeholder="Search Carrier (e.g. Progressive, Travelers)..." 
                    value={carrierSearch}
                    onChange={(e) => setCarrierSearch(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-slate-900/80 border border-white/10 rounded-xl text-white outline-none focus:border-blue-500 transition-all"
                 />
             </div>
             <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 max-h-[600px] overflow-y-auto custom-scrollbar pr-2">
                 {filteredCarriers.map(carrier => (
                     <button 
                        key={carrier.name}
                        onClick={() => setSelectedCarrier(carrier)}
                        className="p-4 bg-white/5 hover:bg-white/10 rounded-2xl text-center transition-all border border-white/5 hover:border-blue-500/50 group flex flex-col items-center gap-3"
                     >
                        <div className="w-full aspect-square bg-white rounded-xl p-3 flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
                            {carrier.logo ? (
                                <img src={carrier.logo} alt={carrier.name} className="max-w-full max-h-full object-contain" />
                            ) : (
                                <Shield className="w-8 h-8 text-blue-500" />
                            )}
                        </div>
                        <span className="text-xs font-bold text-slate-300 group-hover:text-white transition-colors line-clamp-1">{carrier.name}</span>
                     </button>
                 ))}
             </div>
         </div>
      )}

      {/* Step 2: Select Request Type */}
      {selectedCarrier && !requestType && (
          <div className="space-y-6">
              <button onClick={handleReset} className="flex items-center gap-2 text-slate-400 hover:text-white text-sm font-bold mb-4">
                  <ArrowLeft className="w-4 h-4" /> Change Carrier ({selectedCarrier.name})
              </button>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {availableOptions.map(opt => (
                      <button 
                        key={opt.id}
                        onClick={() => setRequestType(opt.id as any)}
                        className="glass-card p-6 rounded-2xl border-white/5 hover:border-blue-500/50 hover:bg-white/10 transition-all text-left group"
                      >
                          <div className="flex items-center gap-4 mb-2">
                              <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-400 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                  <opt.icon className="w-5 h-5" />
                              </div>
                              <h3 className="text-lg font-bold text-white">{opt.label}</h3>
                          </div>
                          <p className="text-xs text-slate-400 pl-[3.5rem]">{opt.desc}</p>
                      </button>
                  ))}
              </div>
          </div>
      )}

      {/* Step 3: Action */}
      {selectedCarrier && requestType && (
          <div className="space-y-6 animate-in fade-in zoom-in-95">
             <button onClick={() => setRequestType(null)} className="flex items-center gap-2 text-slate-400 hover:text-white text-sm font-bold mb-4">
                  <ArrowLeft className="w-4 h-4" /> Back to Options
              </button>
             
             {getAction() === 'CARRIER' ? renderCarrierAction() : renderAgencyAction()}
          </div>
      )}

    </div>
  );
};

export default ServiceCenter;
