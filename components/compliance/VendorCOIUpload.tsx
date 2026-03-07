import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { UploadCloud, CheckCircle2, AlertTriangle, ShieldAlert, ArrowRight, Loader2, Building2, Pencil, X, Save } from 'lucide-react';
import { CarrierLink, Vendor } from '../../src/types/compliance';

export const VendorCOIUpload: React.FC = () => {
  const { vendorId } = useParams<{ vendorId: string }>();
  const [vendor, setVendor] = useState<Vendor | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [recommendedCarriers, setRecommendedCarriers] = useState<CarrierLink[]>([]);
  const [hasInsurance, setHasInsurance] = useState<boolean | null>(null);
  const [showProfileForm, setShowProfileForm] = useState(false);
  
  // Edit Details State
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    email: '',
    phone: '',
    address: { street: '', city: '', state: '', zip: '' }
  });

  const [financials, setFinancials] = useState({
    estimatedRevenue: 0,
    annualPayroll: 0,
    employeeCount: 0
  });

  useEffect(() => {
    const fetchData = async () => {
      if (!vendorId) return;
      try {
        // Fetch Vendor
        const vendorRes = await fetch(`/api/compliance/vendors/${vendorId}`);
        if (vendorRes.ok) {
           const v = await vendorRes.json();
           setVendor(v);
           setEditForm({
             email: v.email || '',
             phone: v.phone || '',
             address: v.address || { street: '', city: '', state: '', zip: '' }
           });
        }

        // Fetch Carriers
        const carriersRes = await fetch(`/api/compliance/vendors/${vendorId}/recommended-carriers`);
        if (carriersRes.ok) {
          const data = await carriersRes.json();
          setRecommendedCarriers(data);
        }
      } catch (e) {
        console.error('Failed to fetch data', e);
      }
    };
    fetchData();
  }, [vendorId]);

  const handleUpdateDetails = async () => {
    try {
      const res = await fetch(`/api/compliance/vendors/${vendorId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
            email: editForm.email,
            phone: editForm.phone,
            address: editForm.address
        })
      });
      
      if (res.ok) {
        setVendor(prev => prev ? { 
            ...prev, 
            email: editForm.email,
            phone: editForm.phone,
            address: editForm.address
        } : null);
        setIsEditing(false);
      }
    } catch (e) {
      console.error('Failed to update details', e);
    }
  };

  useEffect(() => {
    if (vendor && !vendor.financials) {
      setShowProfileForm(true);
    }
  }, [vendor]);

  const handleProfileSubmit = async () => {
    try {
      const res = await fetch(`/api/compliance/vendors/${vendorId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ financials })
      });
      
      if (res.ok) {
        // Update local vendor state with new financials
        setVendor(prev => prev ? { ...prev, financials } : null);
        setShowProfileForm(false);
      }
    } catch (e) {
      console.error('Failed to update profile', e);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setIsUploading(true);
    
    try {
      const formData = new FormData();
      formData.append('coi', file);

      const res = await fetch(`/api/compliance/vendors/${vendorId}/coi`, {
        method: 'POST',
        // body: formData // In real app
      });
      
      if (res.ok) {
        const data = await res.json();
        setResult(data.complianceResult);
      }
    } catch (e) {
      console.error('Upload failed', e);
    } finally {
      setIsUploading(false);
    }
  };

  const handleCarrierClick = async (carrier: CarrierLink) => {
    try {
      await fetch(`/api/compliance/vendors/${vendorId}/carrier-clicks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId: 'proj-1', // Mock project ID
          carrierId: carrier.id,
          outboundUrl: carrier.utmBaseUrl
        })
      });
      window.location.href = carrier.utmBaseUrl;
    } catch (e) {
      console.error('Failed to log click', e);
      window.location.href = carrier.utmBaseUrl;
    }
  };

  const getCarrierTag = (carrierId: string) => {
    switch (carrierId) {
      case 'thimble': return 'Best for Short-Term Projects';
      case 'next': return 'Instant Certificate';
      case 'coterie': return 'Fast Bind';
      default: return 'Instant Quote';
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6">
      <div className="max-w-2xl w-full space-y-8">
        <div className="text-center space-y-4">
          <ShieldAlert className="w-12 h-12 text-blue-500 mx-auto" />
          <h1 className="text-3xl font-bold text-white font-heading">Insurance Verification</h1>
          {vendor && (
            <div className="flex flex-col items-center gap-4">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full border border-white/10">
                <Building2 className="w-4 h-4 text-slate-400" />
                <span className="text-slate-200 font-medium">{vendor.companyName}</span>
              </div>
              
              {!isEditing ? (
                <div className="text-sm text-slate-400 flex items-center gap-4">
                  <span>{vendor.email}</span>
                  <span>•</span>
                  <span>{vendor.phone}</span>
                  <button onClick={() => setIsEditing(true)} className="p-1 hover:bg-white/10 rounded-full transition-colors">
                    <Pencil className="w-3 h-3 text-blue-400" />
                  </button>
                </div>
              ) : (
                <div className="bg-slate-900/50 border border-white/10 rounded-xl p-4 w-full max-w-md space-y-3">
                    <div className="grid grid-cols-2 gap-2">
                        <input 
                            value={editForm.email}
                            onChange={e => setEditForm({...editForm, email: e.target.value})}
                            className="bg-white/5 border border-white/10 rounded-lg p-2 text-xs text-white"
                            placeholder="Email"
                        />
                        <input 
                            value={editForm.phone}
                            onChange={e => setEditForm({...editForm, phone: e.target.value})}
                            className="bg-white/5 border border-white/10 rounded-lg p-2 text-xs text-white"
                            placeholder="Phone"
                        />
                    </div>
                    <input 
                        value={editForm.address.street}
                        onChange={e => setEditForm({...editForm, address: {...editForm.address, street: e.target.value}})}
                        className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-xs text-white"
                        placeholder="Street Address"
                    />
                    <div className="grid grid-cols-3 gap-2">
                        <input 
                            value={editForm.address.city}
                            onChange={e => setEditForm({...editForm, address: {...editForm.address, city: e.target.value}})}
                            className="bg-white/5 border border-white/10 rounded-lg p-2 text-xs text-white"
                            placeholder="City"
                        />
                        <input 
                            value={editForm.address.state}
                            onChange={e => setEditForm({...editForm, address: {...editForm.address, state: e.target.value}})}
                            className="bg-white/5 border border-white/10 rounded-lg p-2 text-xs text-white"
                            placeholder="State"
                        />
                        <input 
                            value={editForm.address.zip}
                            onChange={e => setEditForm({...editForm, address: {...editForm.address, zip: e.target.value}})}
                            className="bg-white/5 border border-white/10 rounded-lg p-2 text-xs text-white"
                            placeholder="Zip"
                        />
                    </div>
                    <div className="flex justify-end gap-2 pt-2">
                        <button onClick={() => setIsEditing(false)} className="p-2 hover:bg-white/10 rounded-lg text-slate-400">
                            <X className="w-4 h-4" />
                        </button>
                        <button onClick={handleUpdateDetails} className="p-2 bg-blue-600 hover:bg-blue-500 rounded-lg text-white">
                            <Save className="w-4 h-4" />
                        </button>
                    </div>
                </div>
              )}
            </div>
          )}
          <p className="text-slate-400">Please provide proof of insurance for the Downtown Highrise Renovation project.</p>
        </div>

        {/* Profile Form */}
        {showProfileForm && (
          <div className="bg-white/5 border border-white/10 rounded-2xl p-8 space-y-6">
            <h2 className="text-xl font-bold text-white">Complete Your Profile</h2>
            <p className="text-slate-400">Please provide your business details to proceed.</p>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase">Est. Annual Revenue</label>
                <input 
                  type="number"
                  value={financials.estimatedRevenue}
                  onChange={e => setFinancials({...financials, estimatedRevenue: parseInt(e.target.value) || 0})}
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white outline-none"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase">Annual Payroll</label>
                <input 
                  type="number"
                  value={financials.annualPayroll}
                  onChange={e => setFinancials({...financials, annualPayroll: parseInt(e.target.value) || 0})}
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white outline-none"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase">Employee Count</label>
                <input 
                  type="number"
                  value={financials.employeeCount}
                  onChange={e => setFinancials({...financials, employeeCount: parseInt(e.target.value) || 0})}
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white outline-none"
                />
              </div>
              <button 
                onClick={handleProfileSubmit}
                className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-colors"
              >
                Save & Continue
              </button>
            </div>
          </div>
        )}

        {!showProfileForm && hasInsurance === null && !result && (
          <div className="bg-white/5 border border-white/10 rounded-2xl p-8 text-center space-y-6">
            <h2 className="text-xl font-bold text-white">Do you currently have commercial insurance?</h2>
            <div className="flex gap-4 justify-center">
              <button onClick={() => setHasInsurance(true)} className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-colors">
                Yes, I have a COI
              </button>
              <button onClick={() => setHasInsurance(false)} className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl transition-colors">
                No, I need insurance
              </button>
            </div>
          </div>
        )}

        {hasInsurance === true && !result && (
          <div className="bg-white/5 border border-white/10 rounded-2xl p-8 space-y-6">
            <h2 className="text-xl font-bold text-white">Upload Certificate of Insurance</h2>
            <div className="border-2 border-dashed border-white/20 rounded-xl p-12 text-center hover:border-blue-500/50 transition-colors cursor-pointer relative group">
              <input type="file" onChange={handleFileChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" accept=".pdf,.jpg,.jpeg,.png" />
              <div className="pointer-events-none">
                <UploadCloud className="w-10 h-10 text-blue-400 mx-auto mb-4 group-hover:scale-110 transition-transform" />
                <p className="text-white font-medium">{file ? file.name : 'Click or drag file to upload'}</p>
                <p className="text-slate-500 text-sm mt-2">PDF, JPEG, or PNG up to 10MB</p>
              </div>
            </div>
            
            <button 
              onClick={handleUpload} 
              disabled={!file || isUploading}
              className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl flex items-center justify-center gap-2 disabled:opacity-50 transition-colors"
            >
              {isUploading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Verify Insurance'}
            </button>
          </div>
        )}

        {/* Compliance Result */}
        {result && (
          <div className={`border rounded-2xl p-8 space-y-6 ${result.isCompliant ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-red-500/10 border-red-500/20'}`}>
            <div className="flex items-center gap-4">
              {result.isCompliant ? (
                <CheckCircle2 className="w-8 h-8 text-emerald-500" />
              ) : (
                <AlertTriangle className="w-8 h-8 text-red-500" />
              )}
              <div>
                <h2 className={`text-xl font-bold ${result.isCompliant ? 'text-emerald-400' : 'text-red-400'}`}>
                  {result.isCompliant ? 'Verification Successful' : 'Action Required'}
                </h2>
                <p className="text-slate-300 mt-1">
                  {result.isCompliant ? 'Your insurance meets all project requirements.' : 'Your insurance does not meet the project requirements.'}
                </p>
              </div>
            </div>

            {!result.isCompliant && (
              <div className="space-y-4 bg-slate-950/50 rounded-xl p-6 border border-red-500/10">
                <h3 className="text-sm font-bold text-red-400 uppercase tracking-wider flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4" />
                    Missing Requirements
                </h3>
                <ul className="space-y-3">
                  {result.failures.map((f: any, i: number) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-slate-300 bg-red-500/5 p-3 rounded-lg border border-red-500/10">
                      <span className="mt-1 block w-2 h-2 rounded-full bg-red-500 shrink-0" />
                      <div>
                        <strong className="text-red-200 block mb-1">{f.requirement}</strong>
                        {f.reason}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            {result.isCompliant && (
                <div className="flex justify-center pt-4">
                    <button onClick={() => window.location.reload()} className="text-slate-400 hover:text-white text-sm underline">Upload Another Document</button>
                </div>
            )}
          </div>
        )}

        {/* Get Insured Panel */}
        {(hasInsurance === false || (result && !result.isCompliant)) && (
          <div className="bg-gradient-to-br from-blue-900/40 to-indigo-900/40 border border-blue-500/30 rounded-2xl p-8 space-y-6 shadow-2xl shadow-blue-900/20">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold text-white font-heading">Need Coverage Fast?</h2>
              <p className="text-blue-200">Get a quote and bind online in minutes to meet project requirements.</p>
            </div>

            <div className="grid gap-4">
              {recommendedCarriers.map(carrier => (
                <button 
                  key={carrier.id}
                  onClick={() => handleCarrierClick(carrier)}
                  className="w-full bg-white/10 hover:bg-white/20 border border-white/10 p-4 rounded-xl flex items-center justify-between group transition-all hover:border-blue-500/50 relative overflow-hidden"
                >
                  <div className="flex items-center gap-4 relative z-10">
                    <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center p-2 shrink-0">
                      {/* Mock Logo */}
                      <span className="text-slate-900 font-bold text-xs uppercase text-center leading-tight">{carrier.name}</span>
                    </div>
                    <div className="text-left">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-white font-bold">Get insured with {carrier.name}</h3>
                        <span className="text-[10px] font-bold uppercase tracking-wider bg-blue-500 text-white px-2 py-0.5 rounded-full">
                            {getCarrierTag(carrier.id)}
                        </span>
                      </div>
                      <p className="text-blue-300 text-sm">Instant online quote & bind</p>
                    </div>
                  </div>
                  <ArrowRight className="w-5 h-5 text-blue-400 group-hover:translate-x-1 transition-transform relative z-10" />
                </button>
              ))}
            </div>
            <p className="text-center text-xs text-slate-500">
              By clicking a link above, you will be redirected to our partner's secure website to complete your purchase.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
