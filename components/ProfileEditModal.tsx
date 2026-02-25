
import React, { useState, useEffect, useRef } from 'react';
import { User, Home, Shield, X, Loader2, CheckCircle2, Phone, Mail, Globe, Briefcase, Calendar, Info, MapPin, AlertCircle } from 'lucide-react';
import { nowCertsApi } from '../services/nowCertsService';
import { auth } from '../services/firebase';

const US_STATES = ['AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA', 'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'];

// Enumerations from NowCerts
const INSURED_TYPES = [
    { value: 0, label: 'Commercial' },
    { value: 1, label: 'Personal' },
    { value: 2, label: 'Life-Health Group' },
    { value: 3, label: 'Life-Health Individual' },
    { value: 4, label: 'Medicare' }
];

const BUSINESS_TYPES = [
    { value: 0, label: 'Corporation' },
    { value: 1, label: 'Individual' },
    { value: 2, label: 'Joint Venture' },
    { value: 3, label: 'LLC' },
    { value: 4, label: 'Not For Profit Org' },
    { value: 5, label: 'Partnership' },
    { value: 6, label: 'Subchapter Corp' },
    { value: 7, label: 'Trust' },
    { value: 8, label: 'Other' }
];

export const ProfileEditModal: React.FC<{ user: any; onClose: () => void; onUpdate: (u: any) => void }> = ({ user, onClose, onUpdate }) => {
  const [profiles, setProfiles] = useState<any[]>([]);
  const [selectedProfileId, setSelectedProfileId] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState<any>({});
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  
  const addressInputRef = useRef<HTMLInputElement>(null);

  const formatPhoneNumber = (value: string) => {
    if (!value) return '';
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 3) return numbers;
    if (numbers.length <= 6) return `${numbers.slice(0, 3)}-${numbers.slice(3)}`;
    return `${numbers.slice(0, 3)}-${numbers.slice(3, 6)}-${numbers.slice(6, 10)}`;
  };

  // Fetch profiles from NowCerts on mount
  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        setLoading(true);
        // Search by email and phone from the current user context
        const searchResult = await nowCertsApi.searchInsured({
            email: user.email || user.eMail,
            phone: user.phone || user.cellPhone
        });

        if (searchResult && searchResult.value && searchResult.value.length > 0) {
            setProfiles(searchResult.value);
            // Default to the first profile or the one matching the current ID if possible
            const match = searchResult.value.find((p: any) => p.databaseId === user.databaseId || p.id === user.databaseId) || searchResult.value[0];
            const id = match.databaseId || match.id;
            setSelectedProfileId(id);
            mapProfileToForm(match);
        } else {
            // Fallback to existing user data if no API result
            setProfiles([user]);
            const id = user.databaseId || user.id || 'default';
            setSelectedProfileId(id);
            mapProfileToForm(user);
        }
      } catch (err) {
        console.error("Failed to fetch NowCerts profiles", err);
        // Fallback
        setProfiles([user]);
        const id = user.databaseId || user.id || 'default';
        setSelectedProfileId(id);
        mapProfileToForm(user);
      } finally {
        setLoading(false);
      }
    };
    fetchProfiles();
  }, [user]);

  const mapProfileToForm = (profile: any) => {
    setFormData({
        // Identity
        databaseId: profile.databaseId || profile.id,
        firstName: profile.firstName || '',
        middleName: profile.middleName || '',
        lastName: profile.lastName || '',
        commercialName: profile.commercialName || '',
        dob: profile.dateOfBirth ? new Date(profile.dateOfBirth).toISOString().split('T')[0] : '',
        
        // Contact
        email: profile.eMail || profile.email || '',
        email2: profile.eMail2 || '',
        email3: profile.eMail3 || '',
        phone: formatPhoneNumber(profile.phone || ''),
        cellPhone: formatPhoneNumber(profile.cellPhone || ''),
        smsPhone: formatPhoneNumber(profile.smsPhone || ''),
        fax: formatPhoneNumber(profile.fax || ''),
        
        // Address
        addressLine1: profile.addressLine1 || profile.address || '',
        addressLine2: profile.addressLine2 || '',
        city: profile.city || '',
        state: profile.state || '',
        zipCode: profile.zipCode || profile.zip || '',
        
        // Business / Classification
        insuredType: profile.insuredType !== undefined ? profile.insuredType : 1, // Default to Personal (1)
        typeOfBusiness: profile.typeOfBusiness !== undefined ? profile.typeOfBusiness : 8, // Default to Other (8)
        fein: profile.fein || '',
        website: profile.website || '',
        dba: profile.dba || '',
        
        // Read-only / Hidden but preserved
        active: profile.active !== undefined ? profile.active : true,
        type: profile.type !== undefined ? profile.type : 0, // 0=Insured
        customerId: profile.customerId,
        insuredId: profile.insuredId,
        description: profile.description,
        greetingName: profile.greetingName,
        preferredLanguage: profile.preferredLanguage,
        isSuperVisior: profile.isSuperVisior,
        userDisplayName: profile.userDisplayName,
        referralSourceCompanyName: profile.referralSourceCompanyName,
        createDate: profile.createDate,
        insuredSubType: profile.insuredSubType,
        origin: profile.origin,
        sicCode: profile.sicCode,
        sicDescription: profile.sicDescription,
        agents: profile.agents,
        csRs: profile.csRs,
        xDatesAndLinesOfBusiness: profile.xDatesAndLinesOfBusiness,
        customFields: profile.customFields,
        customFieldsSimple: profile.customFieldsSimple
    });
  };

  const handleProfileSwitch = (id: string) => {
      const profile = profiles.find(p => (p.databaseId || p.id) === id);
      if (profile) {
          setSelectedProfileId(id);
          mapProfileToForm(profile);
      }
  };

  // Google Autocomplete Effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    const initAutocomplete = () => {
      if (addressInputRef.current && (window as any).google) {
        const autocomplete = new (window as any).google.maps.places.Autocomplete(addressInputRef.current, {
          types: ['address'],
          componentRestrictions: { country: 'us' },
        });
        
        autocomplete.addListener('place_changed', () => {
          const place = autocomplete.getPlace();
          if (place.formatted_address) {
            // Parse components
            let street = '';
            let city = '';
            let state = '';
            let zip = '';
            
            if (place.address_components) {
              for (const component of place.address_components) {
                const type = component.types[0];
                if (type === 'street_number') {
                  street = component.long_name + ' ' + street;
                }
                if (type === 'route') {
                  street += component.long_name;
                }
                if (type === 'locality') {
                  city = component.long_name;
                }
                if (type === 'administrative_area_level_1') {
                  state = component.short_name;
                }
                if (type === 'postal_code') {
                  zip = component.long_name;
                }
              }
            }
            
            setFormData((prev: any) => ({
              ...prev,
              addressLine1: street.trim() || place.formatted_address || '',
              city: city || prev.city,
              state: state || prev.state,
              zipCode: zip || prev.zipCode
            }));
          }
        });
        return true;
      }
      return false;
    };

    if (!initAutocomplete()) {
      interval = setInterval(() => {
        if (initAutocomplete()) {
          clearInterval(interval);
        }
      }, 500);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [selectedProfileId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (['phone', 'cellPhone', 'smsPhone', 'fax'].includes(name)) {
      const formatted = formatPhoneNumber(value);
      if (formatted.length <= 12) {
        setFormData({ ...formData, [name]: formatted });
      }
    } else if (['insuredType', 'typeOfBusiness'].includes(name)) {
        setFormData({ ...formData, [name]: parseInt(value, 10) });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    setError('');
    
    try {
        // Construct the payload exactly as requested
        const payload = {
            ...formData,
            // Ensure date format is correct (ISO)
            dateOfBirth: formData.dob ? new Date(formData.dob).toISOString() : null,
            // Ensure ID is present
            databaseId: selectedProfileId,
            id: selectedProfileId
        };

        // Remove UI-only fields if any (none currently, we mapped directly to API fields)
        delete payload.dob; // We used 'dob' for the date input, mapped to dateOfBirth in payload

        // Call NowCerts Update
        await nowCertsApi.updateInsured(payload);

        // Create Task for Agency
        await nowCertsApi.insertTask({
            CreatorName: "Client Portal",
            title: `Profile Update: ${formData.firstName} ${formData.lastName}`,
            description: `Client updated profile information via portal. Please review changes for policy impacts.`,
            category_name: "Policy Change",
            status: "New",
            completion: 0,
            priority: "medium",
            due_date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
            assigned_to: ["Chase Henderson"],
            insured_database_id: selectedProfileId,
            work_group_name: "Service Group"
        });
        
        // Update local session storage
        const updatedUser = {
            ...user,
            ...payload,
            uid: auth.currentUser?.uid || user.uid
        };
        sessionStorage.setItem('rmi_user', JSON.stringify(updatedUser));
        
        onUpdate(updatedUser);
        onClose();
    } catch (err: any) {
        console.error("Failed to save profile", err);
        setError(err.message || "Failed to save profile changes. Please try again.");
    } finally {
        setIsSaving(false);
    }
  };

  const isCommercial = formData.insuredType === 0;

  return (
    <div className="fixed inset-0 z-[250] flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
       <div className="glass-card w-full max-w-4xl rounded-[2.5rem] border border-white/10 overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-300 shadow-2xl">
          {/* Header */}
          <div className="p-8 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
             <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-500/10 rounded-xl"><User className="w-5 h-5 text-blue-400"/></div>
                <div>
                   <h3 className="text-2xl font-bold text-white font-heading">Edit Profile</h3>
                   <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Synchronized with NowCerts™ Registry</p>
                   {error && (
                     <div className="mt-2 p-2 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-[10px] font-bold animate-in shake-in">
                       {error}
                     </div>
                   )}
                </div>
             </div>
             <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors"><X className="text-slate-400 hover:text-white" /></button>
          </div>
          
          <div className="p-8 overflow-y-auto space-y-10 custom-scrollbar">
             
             {loading ? (
                 <div className="flex flex-col items-center justify-center py-10 gap-4">
                     <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
                     <p className="text-slate-500 text-xs font-bold uppercase">Syncing with Agency Records...</p>
                 </div>
             ) : (
                 <>
                    {/* Profile Selector if multiple found */}
                    {profiles.length > 1 && (
                        <div className="bg-blue-500/10 border border-blue-500/20 p-4 rounded-xl mb-6">
                            <div className="flex items-center gap-2 mb-3">
                                <AlertCircle className="w-4 h-4 text-blue-400" />
                                <span className="text-xs font-bold text-blue-300 uppercase tracking-wide">Multiple Profiles Found</span>
                            </div>
                            <div className="flex gap-2 overflow-x-auto pb-2">
                                {profiles.map((p: any) => (
                                    <button
                                        key={p.databaseId || p.id}
                                        onClick={() => handleProfileSwitch(p.databaseId || p.id)}
                                        className={`px-4 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                                            (selectedProfileId === (p.databaseId || p.id))
                                            ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/20'
                                            : 'bg-white/5 text-slate-400 hover:bg-white/10'
                                        }`}
                                    >
                                        {p.firstName} {p.lastName} ({p.insuredType === 0 ? 'Commercial' : 'Personal'})
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Personal Identity Section */}
                    <div className="space-y-6">
                        <h4 className="text-[10px] font-bold text-blue-400 uppercase tracking-widest flex items-center gap-2"><User className="w-3 h-3"/> Personal Identity</h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="space-y-1">
                                <label className="text-[9px] font-bold text-slate-500 uppercase px-1">First Name</label>
                                <input name="firstName" value={formData.firstName} onChange={handleChange} className="w-full bg-white/5 border border-white/10 p-3 rounded-xl text-white text-sm outline-none focus:border-blue-500" />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[9px] font-bold text-slate-500 uppercase px-1">Middle</label>
                                <input name="middleName" value={formData.middleName} onChange={handleChange} className="w-full bg-white/5 border border-white/10 p-3 rounded-xl text-white text-sm outline-none focus:border-blue-500" />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[9px] font-bold text-slate-500 uppercase px-1">Last Name</label>
                                <input name="lastName" value={formData.lastName} onChange={handleChange} className="w-full bg-white/5 border border-white/10 p-3 rounded-xl text-white text-sm outline-none focus:border-blue-500" />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="text-[9px] font-bold text-slate-500 uppercase px-1">Date of Birth</label>
                                <input type="date" name="dob" value={formData.dob} onChange={handleChange} className="w-full bg-white/5 border border-white/10 p-3 rounded-xl text-white text-sm outline-none focus:border-blue-500" />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[9px] font-bold text-slate-500 uppercase px-1">Profile Type</label>
                                <select name="insuredType" value={formData.insuredType} onChange={handleChange} className="w-full bg-[#0f172a] border border-white/10 p-3 rounded-xl text-white text-sm outline-none focus:border-blue-500">
                                    {INSURED_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Contact Information Section */}
                    <div className="space-y-6">
                        <h4 className="text-[10px] font-bold text-blue-400 uppercase tracking-widest flex items-center gap-2"><Phone className="w-3 h-3"/> Multi-Channel Contact</h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="space-y-1">
                                <label className="text-[9px] font-bold text-slate-500 uppercase px-1">Primary Phone</label>
                                <input name="phone" value={formData.phone} onChange={handleChange} placeholder="###-###-####" className="w-full bg-white/5 border border-white/10 p-3 rounded-xl text-white text-sm outline-none focus:border-blue-500" />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[9px] font-bold text-slate-500 uppercase px-1">Cell Phone</label>
                                <input name="cellPhone" value={formData.cellPhone} onChange={handleChange} placeholder="###-###-####" className="w-full bg-white/5 border border-white/10 p-3 rounded-xl text-white text-sm outline-none focus:border-blue-500" />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[9px] font-bold text-slate-500 uppercase px-1">SMS Opt-In Phone</label>
                                <input name="smsPhone" value={formData.smsPhone} onChange={handleChange} placeholder="###-###-####" className="w-full bg-white/5 border border-white/10 p-3 rounded-xl text-white text-sm outline-none focus:border-blue-500" />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="space-y-1">
                                <label className="text-[9px] font-bold text-slate-500 uppercase px-1">Primary Email</label>
                                <input name="email" value={formData.email} onChange={handleChange} className="w-full bg-white/5 border border-white/10 p-3 rounded-xl text-white text-sm outline-none focus:border-blue-500" />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[9px] font-bold text-slate-500 uppercase px-1">Secondary Email</label>
                                <input name="email2" value={formData.email2} onChange={handleChange} className="w-full bg-white/5 border border-white/10 p-3 rounded-xl text-white text-sm outline-none focus:border-blue-500" />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[9px] font-bold text-slate-500 uppercase px-1">Alt Email</label>
                                <input name="email3" value={formData.email3} onChange={handleChange} className="w-full bg-white/5 border border-white/10 p-3 rounded-xl text-white text-sm outline-none focus:border-blue-500" />
                            </div>
                        </div>
                    </div>

                    {/* Residence / Location Section */}
                    <div className="space-y-6">
                        <h4 className="text-[10px] font-bold text-blue-400 uppercase tracking-widest flex items-center gap-2"><Home className="w-3 h-3"/> Address & Location</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="text-[9px] font-bold text-slate-500 uppercase px-1">Address Line 1</label>
                                <div className="relative group">
                                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-400 transition-colors">
                                        <MapPin className="w-4 h-4" />
                                    </div>
                                    <input 
                                        ref={addressInputRef}
                                        name="addressLine1" 
                                        value={formData.addressLine1} 
                                        onChange={handleChange} 
                                        className="w-full bg-white/5 border border-white/10 pl-10 pr-3 py-3 rounded-xl text-white text-sm outline-none focus:border-blue-500" 
                                    />
                                </div>
                            </div>
                            <div className="space-y-1">
                                <label className="text-[9px] font-bold text-slate-500 uppercase px-1">Unit / Suite (Line 2)</label>
                                <input name="addressLine2" value={formData.addressLine2} onChange={handleChange} className="w-full bg-white/5 border border-white/10 p-3 rounded-xl text-white text-sm outline-none focus:border-blue-500" />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="space-y-1">
                                <label className="text-[9px] font-bold text-slate-500 uppercase px-1">City</label>
                                <input name="city" value={formData.city} onChange={handleChange} className="w-full bg-white/5 border border-white/10 p-3 rounded-xl text-white text-sm outline-none focus:border-blue-500" />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[9px] font-bold text-slate-500 uppercase px-1">State</label>
                                <select name="state" value={formData.state} onChange={handleChange} className="w-full bg-[#0f172a] border border-white/10 p-3 rounded-xl text-white text-sm outline-none focus:border-blue-500">
                                    <option value="">Select</option>
                                    {US_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                                </select>
                            </div>
                            <div className="space-y-1">
                                <label className="text-[9px] font-bold text-slate-500 uppercase px-1">Zip Code</label>
                                <input name="zipCode" value={formData.zipCode} onChange={handleChange} className="w-full bg-white/5 border border-white/10 p-3 rounded-xl text-white text-sm outline-none focus:border-blue-500" />
                            </div>
                        </div>
                    </div>

                    {/* Professional & Business Section - Only for Commercial */}
                    {isCommercial && (
                        <div className="space-y-6">
                            <h4 className="text-[10px] font-bold text-blue-400 uppercase tracking-widest flex items-center gap-2"><Briefcase className="w-3 h-3"/> Business & Web Presence</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-[9px] font-bold text-slate-500 uppercase px-1">Commercial Name</label>
                                    <input name="commercialName" value={formData.commercialName} onChange={handleChange} className="w-full bg-white/5 border border-white/10 p-3 rounded-xl text-white text-sm outline-none focus:border-blue-500" />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[9px] font-bold text-slate-500 uppercase px-1">DBA</label>
                                    <input name="dba" value={formData.dba} onChange={handleChange} className="w-full bg-white/5 border border-white/10 p-3 rounded-xl text-white text-sm outline-none focus:border-blue-500" />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="space-y-1">
                                    <label className="text-[9px] font-bold text-slate-500 uppercase px-1">Business Type</label>
                                    <select name="typeOfBusiness" value={formData.typeOfBusiness} onChange={handleChange} className="w-full bg-[#0f172a] border border-white/10 p-3 rounded-xl text-white text-sm outline-none focus:border-blue-500">
                                        {BUSINESS_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                                    </select>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[9px] font-bold text-slate-500 uppercase px-1">FEIN</label>
                                    <input name="fein" value={formData.fein} onChange={handleChange} className="w-full bg-white/5 border border-white/10 p-3 rounded-xl text-white text-sm outline-none focus:border-blue-500" />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[9px] font-bold text-slate-500 uppercase px-1">Website URL</label>
                                    <input name="website" value={formData.website} onChange={handleChange} placeholder="https://..." className="w-full bg-white/5 border border-white/10 p-3 rounded-xl text-white text-sm outline-none focus:border-blue-500" />
                                </div>
                            </div>
                        </div>
                    )}
                 </>
             )}
          </div>

          <div className="p-6 border-t border-white/5 bg-white/[0.02] flex items-center justify-between">
             <div className="flex items-center gap-2 text-slate-500">
                <Info className="w-4 h-4" />
                <span className="text-[10px] font-medium">Changes will be synced to agency records and may require review.</span>
             </div>
             <button onClick={handleSave} disabled={isSaving || loading} className="px-10 py-4 bg-blue-600 rounded-xl text-white font-bold flex items-center justify-center gap-2 hover:bg-blue-500 transition-all shadow-xl shadow-blue-500/20 active:scale-95 disabled:opacity-50">
                {isSaving ? <Loader2 className="animate-spin w-5 h-5" /> : <CheckCircle2 className="w-5 h-5" />}
                Sync Changes
             </button>
          </div>
       </div>
    </div>
  )
};
