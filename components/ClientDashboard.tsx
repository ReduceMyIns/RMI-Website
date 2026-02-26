
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Plus, Shield, AlertCircle, X, Phone, Car, Home, ChevronRight, Loader2, Info, ChevronDown, CheckCircle2, TrendingDown, FileQuestion, Settings, Users, Umbrella, UserPlus, UserMinus, UserCog, MapPin, FileText, HelpCircle, MessageSquare, Brain, Upload, Download, File
} from 'lucide-react';
import { nowCertsApi } from '../services/nowCertsService';
import { getCarrierServiceLevel } from '../services/config';
import { dbService } from '../services/dbService';
import { extractPolicyData } from '../services/geminiService';
import { generateDecPage, generateAutoIdCard } from '../services/pdfGenerator';
import NowCertsIframe from './NowCertsIframe';
import { AddVehicleModal } from './AddVehicleModal';
import { AddDriverModal } from './AddDriverModal';

// ... (Existing SERVICES array and helper functions remain same) ...
const SERVICES = [
  { id: 'add-driver', label: 'Add Driver', icon: UserPlus, url: 'https://www1.nowcerts.com/ServiceRequests_AddDrivers/Insert.aspx?InsuranceAgencyId=7b9d101f-6a6c-40a6-b256-bfd8a901c277&IsPopup=true' },
  { id: 'replace-driver', label: 'Replace Driver', icon: UserCog, url: 'https://www1.nowcerts.com/ServiceRequests_ReplaceDrivers/Insert.aspx?InsuranceAgencyId=7b9d101f-6a6c-40a6-b256-bfd8a901c277&IsPopup=true' },
  { id: 'remove-driver', label: 'Remove Driver', icon: UserMinus, url: 'https://www1.nowcerts.com/ServiceRequests_RemoveDrivers/Insert.aspx?InsuranceAgencyId=7b9d101f-6a6c-40a6-b256-bfd8a901c277&IsPopup=true' },
  { id: 'add-vehicle', label: 'Add Vehicle', icon: Car, url: 'https://www1.nowcerts.com/ServiceRequests_AddVehicles/Insert.aspx?InsuranceAgencyId=7b9d101f-6a6c-40a6-b256-bfd8a901c277&IsPopup=true' },
  { id: 'address-change', label: 'Address Change', icon: MapPin, url: 'https://www1.nowcerts.com/ServiceRequests_AddressChanges/Insert.aspx?InsuranceAgencyId=7b9d101f-6a6c-40a6-b256-bfd8a901c277&IsPopup=true' },
  { id: 'coi', label: 'Get COI', icon: FileText, url: 'https://www1.nowcerts.com/ServiceRequests_CertificateofInsurances/Insert.aspx?InsuranceAgencyId=7b9d101f-6a6c-40a6-b256-bfd8a901c277&IsPopup=true' },
  { id: 'other', label: 'Policy Change', icon: HelpCircle, url: 'https://www1.nowcerts.com/Request/Insert.aspx?Type=1&InsuranceAgencyId=7b9d101f-6a6c-40a6-b256-bfd8a901c277&IsPopup=true' },
  { id: 'general', label: 'General Request', icon: MessageSquare, url: 'https://www1.nowcerts.com/ServiceRequests_GeneralNews/Insert.aspx?InsuranceAgencyId=7b9d101f-6a6c-40a6-b256-bfd8a901c277&IsPopup=true' }
];

const isPolicyActive = (p: any) => {
    if (p.isQuote) return false;
    if (p.status) {
        const status = p.status.toString().toLowerCase();
        if (status.includes('cancel') || status.includes('expire') || status.includes('non-renew')) {
            return false;
        }
    }
    return !!p.active;
};

// ... (StatCard, CoverageItem components remain same) ...
const StatCard: React.FC<{ icon: any, label: string, val: string, sub: string, color: string }> = ({ icon: Icon, label, val, sub, color }) => (
  <div className="glass-card p-8 rounded-[2.5rem] border-white/5 relative overflow-hidden group hover:bg-white/[0.05] transition-all duration-500">
    <div className={`absolute top-0 right-0 w-32 h-32 opacity-10 blur-[60px] rounded-full group-hover:opacity-20 transition-all ${
      color === 'blue' ? 'bg-blue-500' : color === 'indigo' ? 'bg-indigo-500' : 'bg-emerald-500'
    }`}></div>
    <div className="relative z-10 flex flex-col gap-6">
      <div className={`w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 group-hover:border-white/20 transition-colors`}>
        <Icon className={`w-7 h-7 ${
          color === 'blue' ? 'text-blue-400' : color === 'indigo' ? 'text-indigo-400' : 'text-emerald-400'
        }`} />
      </div>
      <div>
        <div className="text-[10px] uppercase tracking-[0.2em] font-bold text-slate-500 mb-1">{label}</div>
        <div className="text-3xl font-heading font-bold text-white mb-2 tracking-tight">{val}</div>
        <div className="flex items-center gap-1 text-xs font-medium text-slate-400">
           {sub}
        </div>
      </div>
    </div>
  </div>
);

// ... (PolicyDetailModal remains same) ...
// (Omitting PolicyDetailModal re-paste for brevity, assumes it exists from original file)
const PolicyDetailModal: React.FC<{ policy: any; onClose: () => void }> = ({ policy, onClose }) => {
    const [details, setDetails] = useState<{ vehicles: any[], drivers: any[], properties: any[], coverages: any[], files: any[] }>({
        vehicles: [],
        drivers: [],
        properties: [],
        coverages: [],
        files: []
    });
    const [loading, setLoading] = useState(true);
    const [downloading, setDownloading] = useState(false);
    const [showAddVehicle, setShowAddVehicle] = useState(false);
    const [showAddDriver, setShowAddDriver] = useState(false);

    const fetchDetails = async () => {
        setLoading(true);
        try {
            const [v, d, p, c, f] = await Promise.all([
                nowCertsApi.getPolicyVehicles(policy.databaseId),
                nowCertsApi.getPolicyDrivers(policy.databaseId),
                nowCertsApi.getPolicyProperties(policy.databaseId),
                nowCertsApi.getPolicyCoverages(policy.databaseId),
                nowCertsApi.getPolicyFiles(policy.databaseId, policy.insuredDatabaseId)
            ]);
            setDetails({ 
                vehicles: v || [], 
                drivers: d || [], 
                properties: p || [],
                coverages: c || [],
                files: f?.data?.files || []
            });
        } catch (e) {
            console.error("Error fetching policy details", e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDetails();
    }, [policy.databaseId, policy.insuredDatabaseId]);

    const handleDownloadDecPage = async () => {
        setDownloading(true);
        try {
            // Generate PDF from API data
            generateDecPage(policy, details);
        } catch (e) {
            console.error("Download failed", e);
            alert("Failed to generate document.");
        } finally {
            setDownloading(false);
        }
    };

    const handleDownloadIdCards = async () => {
        setDownloading(true);
        try {
            generateAutoIdCard(policy, details);
        } catch (e) {
            console.error("ID Card generation failed", e);
            alert("Failed to generate ID Cards.");
        } finally {
            setDownloading(false);
        }
    };

    const showIdCardButton = () => {
        const type = (policy.lineOfBusinesses?.[0]?.lineOfBusinessName || '').toLowerCase();
        return type.includes('auto') || type.includes('vehicle') || type.includes('water') || type.includes('boat') || type.includes('rv') || type.includes('recreation');
    };

    const handleRemoveDriver = async (driver: any) => {
        if (!confirm(`Are you sure you want to remove ${driver.firstName} ${driver.lastName} from this policy? This will create a removal request task.`)) return;
        
        try {
            await nowCertsApi.insertTask({
                CreatorName: "Client Portal",
                title: `Remove Driver Request: ${driver.firstName} ${driver.lastName}`,
                description: `Client requested removal of driver from policy ${policy.number}.\nDriver: ${driver.firstName} ${driver.lastName}\nLicense: ${driver.dlNumber || 'N/A'}`,
                category_name: "Policy Change",
                status: "New",
                priority: "High",
                due_date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
                assigned_to: ["Chase Henderson"],
                insured_database_id: policy.insuredDatabaseId,
                work_group_name: "Service Group"
            });
            alert("Removal request submitted successfully.");
        } catch (e) {
            console.error("Remove driver error", e);
            alert("Failed to submit removal request.");
        }
    };

    return (
        <div className="fixed inset-0 z-[400] flex items-center justify-center bg-slate-950/90 backdrop-blur-md p-4 animate-in fade-in duration-200">
            <div className="w-full max-w-4xl glass-card rounded-[2.5rem] border-white/10 overflow-hidden flex flex-col max-h-[90vh] shadow-2xl animate-in zoom-in-95 duration-300">
                {/* Header */}
                <div className="p-8 border-b border-white/10 flex justify-between items-start bg-white/5">
                    <div className="space-y-1">
                        <div className="flex items-center gap-3">
                            <h2 className="text-3xl font-heading font-bold text-white tracking-tight">
                                {policy.lineOfBusinesses?.[0]?.lineOfBusinessName || 'Policy Detail'}
                            </h2>
                            <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                                isPolicyActive(policy) ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-red-500/20 text-red-400 border border-red-500/30'
                            }`}>
                                {policy.status || (isPolicyActive(policy) ? 'Active' : 'Inactive')}
                            </span>
                        </div>
                        <p className="text-slate-400 font-medium">{policy.carrierName} • <span className="font-mono">{policy.number}</span></p>
                    </div>
                    <button onClick={onClose} className="p-2 bg-white/5 hover:bg-white/10 rounded-full text-slate-400 transition-colors">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-grow overflow-y-auto p-8 space-y-10 custom-scrollbar">
                    {/* Quick Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        <div className="space-y-1">
                            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Premium</div>
                            <div className="text-2xl font-bold text-white">${policy.totalPremium?.toFixed(2)}</div>
                        </div>
                        <div className="space-y-1">
                            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Effective</div>
                            <div className="text-xl font-bold text-slate-200">{new Date(policy.effectiveDate).toLocaleDateString()}</div>
                        </div>
                        <div className="space-y-1">
                            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Expiration</div>
                            <div className="text-xl font-bold text-slate-200">{new Date(policy.expirationDate).toLocaleDateString()}</div>
                        </div>
                        <div className="space-y-1">
                            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Term</div>
                            <div className="text-xl font-bold text-slate-200">12 Months</div>
                        </div>
                    </div>

                    {loading ? (
                        <div className="py-20 flex flex-col items-center justify-center gap-4">
                            <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
                            <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Retrieving Asset Data...</p>
                        </div>
                    ) : (
                        <div className="space-y-10">
                            {/* Coverages Section */}
                            {(details.coverages.length > 0 || (details.vehicles.length > 0 && details.vehicles[0].policyLevelCoverages?.length > 0)) && (
                                <div className="space-y-4">
                                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                        <Shield className="w-5 h-5 text-emerald-400" /> Coverage Details
                                    </h3>
                                    <div className="grid grid-cols-1 gap-4">
                                        {details.coverages.length > 0 ? details.coverages.map((covGroup: any, i: number) => (
                                            <div key={i} className="space-y-2">
                                                {Object.keys(covGroup).map(key => {
                                                    if (Array.isArray(covGroup[key]) && covGroup[key].length > 0) {
                                                        return covGroup[key].map((c: any, idx: number) => (
                                                            <div key={idx} className="p-4 bg-white/5 border border-white/5 rounded-xl flex justify-between items-center">
                                                                <div>
                                                                    <div className="font-bold text-white text-sm">{c.coverageDescriptionFirst || c.name || key.replace(/([A-Z])/g, ' $1').trim()}</div>
                                                                    <div className="text-xs text-slate-500">{c.limitAmountFirst || c.limit || c.limitFormatted || 'Included'}</div>
                                                                </div>
                                                                {(c.deductible || c.deductibleAmountFirst) && (
                                                                    <div className="text-right">
                                                                        <div className="text-[10px] text-slate-500 uppercase">Deductible</div>
                                                                        <div className="font-mono text-white text-sm">{c.deductible || c.deductibleAmountFirst}</div>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        ));
                                                    }
                                                    return null;
                                                })}
                                            </div>
                                        )) : (
                                            /* Fallback for Auto Policy Level Coverages from Vehicle */
                                            details.vehicles[0].policyLevelCoverages.map((c: any, idx: number) => (
                                                <div key={idx} className="p-4 bg-white/5 border border-white/5 rounded-xl flex justify-between items-center">
                                                    <div>
                                                        <div className="font-bold text-white text-sm">{c.name}</div>
                                                        <div className="text-xs text-slate-500">{c.limitFormatted || 'Included'}</div>
                                                    </div>
                                                    {c.deductiblesFormatted && (
                                                        <div className="text-right">
                                                            <div className="text-[10px] text-slate-500 uppercase">Deductible</div>
                                                            <div className="font-mono text-white text-sm">{c.deductiblesFormatted}</div>
                                                        </div>
                                                    )}
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Properties with Construction Details */}
                            {details.properties.length > 0 && (
                                <div className="space-y-4">
                                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                        <Home className="w-5 h-5 text-emerald-400" /> Insured Properties
                                    </h3>
                                    <div className="grid grid-cols-1 gap-4">
                                        {details.properties.map((p: any, i: number) => (
                                            <div key={i} className="p-5 bg-white/5 border border-white/5 rounded-2xl space-y-4">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-400">
                                                        <Home className="w-6 h-6" />
                                                    </div>
                                                    <div>
                                                        <div className="font-bold text-white">{p.addressLine1}</div>
                                                        <div className="text-xs text-slate-500">{p.city}, {p.state} {p.zipCode}</div>
                                                    </div>
                                                </div>
                                                
                                                {/* Construction Details from XML or fields if available */}
                                                {p.coverages && p.coverages.length > 0 && (
                                                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/5">
                                                        {p.coverages.map((c: any, idx: number) => (
                                                            <div key={idx} className="flex justify-between text-xs">
                                                                <span className="text-slate-500">{c.name}</span>
                                                                <span className="text-white font-mono">{c.limitFormatted || c.limits?.[0]}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}

                                                {/* Lienholders */}
                                                {p.lienHolders && p.lienHolders.length > 0 && (
                                                    <div className="pt-2 border-t border-white/5">
                                                        <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Lienholders</div>
                                                        {p.lienHolders.map((lh: any, idx: number) => (
                                                            <div key={idx} className="text-xs text-slate-300 mb-1">
                                                                {lh.name} <span className="text-slate-600">({lh.natureOfInterestDescriptionValue || 'Lienholder'})</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Coverages */}
                            {details.coverages.length > 0 && (
                                <div className="space-y-4">
                                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                        <Shield className="w-5 h-5 text-emerald-400" /> Policy Coverages
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {details.coverages.map((c: any, i: number) => (
                                            <div key={i} className="p-4 bg-white/5 border border-white/5 rounded-xl flex justify-between items-center">
                                                <span className="text-slate-400">{c.name || c.coverageDesc || c.coverageCd}</span>
                                                <span className="text-white font-mono font-bold">
                                                    {c.limitFormatted || (c.deductiblesFormatted ? `Ded: ${c.deductiblesFormatted}` : 'Included')}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Vehicles */}
                            {(details.vehicles.length > 0 || showIdCardButton()) && (
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center">
                                        <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                            <Car className="w-5 h-5 text-blue-400" /> Insured Vehicles
                                        </h3>
                                        {showIdCardButton() && (
                                            <button 
                                                onClick={() => setShowAddVehicle(true)}
                                                className="px-4 py-2 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 rounded-lg text-xs font-bold transition-all flex items-center gap-2"
                                            >
                                                <Plus className="w-4 h-4" /> Add Vehicle
                                            </button>
                                        )}
                                    </div>
                                    <div className="grid grid-cols-1 gap-4">
                                        {details.vehicles.map((v: any, i: number) => (
                                            <div key={i} className="p-5 bg-white/5 border border-white/5 rounded-2xl space-y-4">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-400">
                                                        <Car className="w-6 h-6" />
                                                    </div>
                                                    <div>
                                                        <div className="font-bold text-white">{v.year} {v.make} {v.model}</div>
                                                        <div className="text-xs text-slate-500 uppercase tracking-widest">VIN: {v.vin}</div>
                                                    </div>
                                                </div>

                                                {/* Vehicle Specific Coverages */}
                                                {v.coverages && v.coverages.length > 0 && (
                                                    <div className="pl-16 space-y-2">
                                                        <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Vehicle Coverages</div>
                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                                            {v.coverages.map((vc: any, j: number) => (
                                                                <div key={j} className="flex justify-between items-center p-2 bg-black/20 rounded-lg border border-white/5">
                                                                    <span className="text-xs text-slate-400">{vc.name || vc.coverageDesc || vc.coverageCd}</span>
                                                                    <span className="text-xs text-white font-mono">
                                                                        {vc.limitFormatted || (vc.deductiblesFormatted ? `Ded: ${vc.deductiblesFormatted}` : 'Included')}
                                                                    </span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                        {details.vehicles.length === 0 && (
                                            <div className="py-8 text-center text-slate-500 italic bg-white/5 rounded-2xl border border-dashed border-white/10">
                                                No vehicles listed on this policy yet.
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Drivers */}
                            {(details.drivers.length > 0 || showIdCardButton()) && (
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center">
                                        <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                            <Users className="w-5 h-5 text-indigo-400" /> Rated Drivers
                                        </h3>
                                        {showIdCardButton() && (
                                            <button 
                                                onClick={() => setShowAddDriver(true)}
                                                className="px-4 py-2 bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-400 rounded-lg text-xs font-bold transition-all flex items-center gap-2"
                                            >
                                                <Plus className="w-4 h-4" /> Add Driver
                                            </button>
                                        )}
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {details.drivers.map((d: any, i: number) => (
                                            <div key={i} className="p-5 bg-white/5 border border-white/5 rounded-2xl flex items-center justify-between gap-4 group">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 bg-indigo-500/10 rounded-xl flex items-center justify-center text-indigo-400">
                                                        <Users className="w-6 h-6" />
                                                    </div>
                                                    <div>
                                                        <div className="font-bold text-white">{d.firstName} {d.lastName}</div>
                                                        <div className="text-xs text-slate-500 uppercase tracking-widest">Driver License: {d.dlNumber || 'Pending'}</div>
                                                    </div>
                                                </div>
                                                <button 
                                                    onClick={() => handleRemoveDriver(d)}
                                                    className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                                                    title="Remove Driver"
                                                >
                                                    <UserMinus className="w-4 h-4" />
                                                </button>
                                            </div>
                                        ))}
                                        {details.drivers.length === 0 && (
                                            <div className="col-span-2 py-8 text-center text-slate-500 italic bg-white/5 rounded-2xl border border-dashed border-white/10">
                                                No drivers listed on this policy yet.
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {details.vehicles.length === 0 && details.drivers.length === 0 && details.properties.length === 0 && details.coverages.length === 0 && (
                                <div className="py-10 text-center glass-card rounded-2xl border-dashed border-white/10 text-slate-500 italic">
                                    No specific asset details found for this policy.
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-8 border-t border-white/10 bg-white/5 flex gap-4">
                    <button 
                        onClick={handleDownloadDecPage} 
                        disabled={downloading}
                        className="flex-1 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-bold transition-all shadow-lg shadow-blue-500/20 active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                        {downloading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Download className="w-5 h-5" />}
                        Download Dec Page
                    </button>
                    
                    {showIdCardButton() && (
                        <button 
                            onClick={handleDownloadIdCards}
                            disabled={downloading}
                            className="flex-1 py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl font-bold transition-all shadow-lg shadow-emerald-500/20 active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                            {downloading ? <Loader2 className="w-5 h-5 animate-spin" /> : <FileText className="w-5 h-5" />}
                            Download ID Cards
                        </button>
                    )}

                    <button 
                        onClick={onClose}
                        className="px-8 py-4 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-2xl font-bold transition-all"
                    >
                        Close
                    </button>
                </div>

                {/* Add Vehicle Modal */}
                {showAddVehicle && (
                    <AddVehicleModal 
                        policyId={policy.number}
                        policyDatabaseId={policy.databaseId}
                        insuredDatabaseId={policy.insuredDatabaseId}
                        onClose={() => setShowAddVehicle(false)}
                        onSuccess={() => {
                            fetchDetails();
                        }}
                    />
                )}

                {/* Add Driver Modal */}
                {showAddDriver && (
                    <AddDriverModal 
                        policyId={policy.number}
                        policyDatabaseId={policy.databaseId}
                        insuredDatabaseId={policy.insuredDatabaseId}
                        onClose={() => setShowAddDriver(false)}
                        onSuccess={() => {
                            fetchDetails();
                        }}
                    />
                )}
            </div>
        </div>
    );
};

const ClientDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [policies, setPolicies] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'ACTIVE' | 'QUOTES' | 'HISTORY'>('ACTIVE');
  const [selectedPolicy, setSelectedPolicy] = useState<any>(null);
  const [serviceModalUrl, setServiceModalUrl] = useState<string | null>(null);
  
  // New: Active Proposal from Agent
  const [activeProposal, setActiveProposal] = useState<any>(null);
  
  // Policy Upload State
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    const saved = sessionStorage.getItem('rmi_user');
    if (saved) {
      const u = JSON.parse(saved);
      setUser(u);
      
      // Auto-set session for AI tools access
      sessionStorage.setItem('rmi_tool_user', JSON.stringify({
          firstName: u.firstName,
          lastName: u.lastName,
          email: u.email || u.eMail,
          phone: u.phone || u.cellPhone
      }));
      
      loadData(u);
    } else {
        setIsLoading(false); // No user, show empty or redirect
    }
  }, []);

  const loadData = async (u: any) => {
    try {
      // 1. Load NowCerts Policies
      const data = await nowCertsApi.getPolicies(u);
      setPolicies(data.value || []);

      // 2. Load Firestore Lead/Quote Status
      const lead = await dbService.findExistingLead(u.email || u.eMail, u.phone || u.cellPhone);
      if (lead && (lead.proposalUrl || lead.status === 'Quoted')) {
          setActiveProposal(lead);
      }

    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExternalPolicyUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file || !user) return;
      
      setIsUploading(true);
      const reader = new FileReader();
      reader.onload = async () => {
          const base64 = (reader.result as string).split(',')[1];
          try {
              // 1. Extract Data
              const extracted = await extractPolicyData({ data: base64, mimeType: file.type });
              
              // 2. Create Lead Record in Firestore for Agent Review
              await dbService.saveQuoteRequest({
                  type: 'Personal', // Assumption, AI could refine
                  firstName: user.firstName,
                  lastName: user.lastName,
                  email: user.email || user.eMail,
                  phone: user.phone || user.cellPhone,
                  address: user.addressLine1 || user.address,
                  status: 'New - External Policy Upload',
                  source: 'Client Portal',
                  uploadedPolicyData: extracted,
                  notes: "User uploaded external policy for review/quote comparison."
              });
              
              alert("Policy uploaded successfully! Our agents will review it and generate a comparison quote.");
          } catch (err) {
              console.error(err);
              alert("Failed to process policy. Please try again.");
          } finally {
              setIsUploading(false);
          }
      };
      reader.readAsDataURL(file);
  };

  const handleNewCoverage = () => {
    if (user) {
        navigate('/apply', { 
            state: { 
                prefillData: {
                    firstName: user.firstName || user.FirstName || '',
                    lastName: user.lastName || user.LastName || '',
                    email: user.email || user.eMail || user.Email || '',
                    phone: user.phone || user.cellPhone || user.smsPhone || user.Phone || '',
                    address: user.addressLine1 || user.address || user.AddressLine1 || '',
                    city: user.city || user.City || '',
                    state: user.state || user.State || '',
                    zip: user.zipCode || user.zip || user.ZipCode || '',
                    dob: user.dob || user.DOB || user.DateOfBirth || user.birthDate || user.dateOfBirth || ''
                }
            } 
        });
    } else {
        navigate('/apply');
    }
  };

  const activePolicies = policies.filter(p => !p.isQuote && isPolicyActive(p));
  const quotes = policies.filter(p => p.isQuote);
  const history = policies.filter(p => !isPolicyActive(p) && !p.isQuote);

  const totalPremium = activePolicies.reduce((acc, p) => acc + (p.totalPremium || 0), 0) / 12;

  const getDisplayedList = () => {
      switch(viewMode) {
          case 'ACTIVE': return activePolicies;
          case 'QUOTES': return quotes;
          case 'HISTORY': return history;
          default: return [];
      }
  };

  if (isLoading) return (
    <div className="h-[60vh] flex flex-col items-center justify-center gap-6">
      <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
      <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Loading your secure portfolio...</p>
    </div>
  );

  return (
    <div className="space-y-12 pb-24 animate-in fade-in slide-in-from-bottom-6 duration-1000">
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-10">
        <div className="space-y-3">
          <button onClick={() => window.dispatchEvent(new CustomEvent('edit-profile'))} className="flex items-center gap-3 text-blue-400 text-[10px] font-bold uppercase tracking-[0.3em] hover:text-white transition-colors group">
             <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(59,130,246,0.5)]"></div>
             Active Profile: {user?.firstName} {user?.lastName}
             <Settings className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>
          <h1 className="text-6xl font-heading font-bold text-white tracking-tighter">Command <span className="neural-text">Center</span></h1>
          <p className="text-slate-400 text-lg">Predictive monitoring for {activePolicies.length} active insurance lines.</p>
        </div>
        <div className="flex flex-wrap gap-4">
          <button onClick={handleNewCoverage} className="group bg-blue-600 hover:bg-blue-500 text-white px-10 py-4 rounded-2xl font-bold transition-all shadow-xl shadow-blue-500/20 flex items-center gap-3 active:scale-95">
            <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
            New Coverage
          </button>
          <button onClick={() => fileInputRef.current?.click()} disabled={isUploading} className="group bg-white/5 hover:bg-white/10 text-white border border-white/10 px-8 py-4 rounded-2xl font-bold transition-all flex items-center gap-3">
             {isUploading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Upload className="w-5 h-5" />}
             Compare Policy
          </button>
          <input type="file" ref={fileInputRef} className="hidden" accept=".pdf,image/*" onChange={handleExternalPolicyUpload} />
        </div>
      </div>

      {/* ACTIVE AGENT PROPOSAL CARD */}
      {activeProposal && activeProposal.proposalUrl && (
          <div className="bg-gradient-to-r from-blue-600/20 to-indigo-600/20 border border-blue-500/30 rounded-[2rem] p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-[0_0_50px_rgba(37,99,235,0.1)]">
              <div className="flex items-center gap-6">
                  <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg">
                      <FileText className="w-8 h-8" />
                  </div>
                  <div>
                      <div className="flex items-center gap-3 mb-1">
                          <h3 className="text-xl font-bold text-white">Proposal Ready</h3>
                          <span className="bg-blue-500 text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                              Status: {activeProposal.status}
                          </span>
                      </div>
                      <p className="text-blue-200 text-sm">
                          Your agent has prepared a new quote proposal: <span className="font-bold text-white">{activeProposal.proposalName || 'Proposal.pdf'}</span>
                      </p>
                  </div>
              </div>
              <a 
                  href={activeProposal.proposalUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-white text-blue-900 px-8 py-4 rounded-xl font-bold flex items-center gap-2 hover:scale-105 transition-all shadow-xl"
              >
                  <Download className="w-5 h-5" /> Download Proposal
              </a>
          </div>
      )}

      {/* AI TOOLS ACCESS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gradient-to-r from-blue-900/20 to-indigo-900/20 p-8 rounded-[2.5rem] border border-blue-500/20 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 blur-[80px] rounded-full pointer-events-none"></div>
          <div className="relative z-10 space-y-4">
              <h3 className="text-2xl font-bold text-white flex items-center gap-3">
                  <Brain className="w-8 h-8 text-blue-400" /> AI Toolkit Access
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed max-w-md">
                  Use our suite of AI tools to inspect vehicles, analyze safety risks, or generate business plans. Your account grants full access.
              </p>
              <Link to="/tools" className="inline-flex items-center gap-2 text-blue-400 font-bold uppercase tracking-widest text-xs hover:text-white transition-colors">
                  Launch Tools <ChevronRight className="w-4 h-4" />
              </Link>
          </div>
          <div className="relative z-10 flex flex-wrap gap-3 items-center">
              {['Vehicle Inspector', 'Safety Plans', 'Recall Check', 'Business Plan'].map((tool, i) => (
                  <Link key={i} to="/tools" className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-xl border border-white/5 text-xs font-bold text-slate-300 transition-all">
                      {tool}
                  </Link>
              ))}
          </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <StatCard icon={TrendingDown} label="Average Monthly" val={`$${totalPremium.toFixed(2)}`} sub="Market-Matched Premium" color="blue" />
        <StatCard icon={Shield} label="Active Policies" val={activePolicies.length.toString()} sub="Verified Assets" color="indigo" />
        <StatCard icon={FileQuestion} label="Open Quotes" val={quotes.length.toString()} sub="Pending Review" color="emerald" />
      </div>
      
      {/* Quick Service Actions */}
      <div className="space-y-4">
         <h3 className="text-xs font-bold text-slate-500 uppercase tracking-[0.2em] px-1">Policy Services</h3>
         <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
            {SERVICES.map((srv) => (
                <button 
                   key={srv.id}
                   onClick={() => setServiceModalUrl(srv.url)}
                   className="p-4 bg-white/5 border border-white/5 rounded-2xl flex flex-col items-center gap-2 hover:bg-white/10 hover:border-blue-500/30 transition-all group"
                >
                   <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform">
                      <srv.icon className="w-4 h-4" />
                   </div>
                   <div className="text-[10px] font-bold text-slate-300 text-center uppercase tracking-tight">{srv.label}</div>
                </button>
            ))}
         </div>
      </div>

      <div className="space-y-6">
         <div className="flex items-center gap-6 border-b border-white/10 pb-1">
            {['ACTIVE', 'QUOTES', 'HISTORY'].map((mode) => (
                <button
                   key={mode}
                   onClick={() => setViewMode(mode as any)}
                   className={`pb-3 px-2 text-xs font-bold tracking-widest transition-all relative ${
                       viewMode === mode ? 'text-blue-400' : 'text-slate-500 hover:text-white'
                   }`}
                >
                   {mode === 'ACTIVE' && `Active (${activePolicies.length})`}
                   {mode === 'QUOTES' && `Quotes (${quotes.length})`}
                   {mode === 'HISTORY' && `History (${history.length})`}
                   {viewMode === mode && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-400 rounded-full"></div>}
                </button>
            ))}
         </div>
         
         <div className="space-y-4">
            {getDisplayedList().map((policy) => (
                <div key={policy.databaseId} className="glass-card p-8 rounded-[2rem] border border-white/5 hover:border-blue-500/30 transition-all group">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="flex items-center gap-6">
                            <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center text-2xl font-bold text-slate-500 group-hover:bg-blue-500/10 group-hover:text-blue-400 transition-colors">
                                {policy.lineOfBusinesses?.[0]?.lineOfBusinessName?.[0] || 'P'}
                            </div>
                            <div>
                                <h3 className="font-heading font-bold text-white text-xl mb-1">{policy.lineOfBusinesses?.[0]?.lineOfBusinessName || 'Insurance Policy'}</h3>
                                <div className="text-sm text-slate-400 font-medium mb-1">{policy.carrierName} • <span className="font-mono text-slate-500">{policy.number}</span></div>
                                <div className="text-xs text-slate-500">Expires: {new Date(policy.expirationDate).toLocaleDateString()}</div>
                            </div>
                        </div>
                        <div className="text-right">
                             <div className="text-2xl font-bold text-white mb-1">${policy.totalPremium?.toFixed(2)}</div>
                             <button 
                                onClick={() => setSelectedPolicy(policy)}
                                className="mt-4 px-6 py-2 bg-white/5 hover:bg-white/10 rounded-xl text-xs font-bold text-white transition-all flex items-center gap-2 ml-auto"
                             >
                                Details <ChevronRight className="w-3 h-3" />
                             </button>
                        </div>
                    </div>
                </div>
            ))}
            {getDisplayedList().length === 0 && (
                <div className="text-center py-20 glass-card rounded-[2rem] border border-dashed border-white/10 text-slate-500 italic">
                    No insurance data found for this selection.
                </div>
            )}
         </div>
      </div>

      {selectedPolicy && (
          <PolicyDetailModal policy={selectedPolicy} onClose={() => setSelectedPolicy(null)} />
      )}

      {/* Service Request Modal */}
      {serviceModalUrl && (
         <div className="fixed inset-0 z-[300] flex items-center justify-center bg-slate-950/90 backdrop-blur-md p-4 animate-in fade-in duration-200">
            <div className="w-full max-w-4xl bg-white rounded-[2rem] overflow-hidden flex flex-col max-h-[90vh] shadow-2xl animate-in zoom-in-95 duration-300 relative">
               <button 
                  onClick={() => setServiceModalUrl(null)}
                  className="absolute top-4 right-4 p-2 bg-slate-100 hover:bg-slate-200 rounded-full z-50 text-slate-500 transition-colors"
               >
                  <X className="w-6 h-6" />
               </button>
               <div className="flex-grow overflow-y-auto custom-scrollbar">
                  <NowCertsIframe url={serviceModalUrl} height="1100" />
               </div>
            </div>
         </div>
      )}
    </div>
  );
};

export default ClientDashboard;
