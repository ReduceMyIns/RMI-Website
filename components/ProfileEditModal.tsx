
import React, { useState } from 'react';
import { User, Home, Shield, X, Loader2, CheckCircle2, Phone, Mail, Globe, Briefcase, Calendar, Info } from 'lucide-react';

export const ProfileEditModal: React.FC<{ user: any; onClose: () => void; onUpdate: (u: any) => void }> = ({ user, onClose, onUpdate }) => {
  // Mapping comprehensive fields from InsuredList object (user)
  const [formData, setFormData] = useState({
    firstName: user.firstName || '',
    middleName: user.middleName || '',
    lastName: user.lastName || '',
    dob: user.dob ? new Date(user.dob).toISOString().split('T')[0] : '',
    gender: user.gender || '',
    maritalStatus: user.maritalStatus || '',
    ssn: user.ssn || '', // SSN/EIN
    ein: user.ein || '',
    
    email: user.eMail || user.email || '',
    email2: user.eMail2 || '',
    email3: user.eMail3 || '',
    
    phone: user.phone || '',
    cellPhone: user.cellPhone || '',
    smsPhone: user.smsPhone || '',
    
    address: user.addressLine1 || user.address || '',
    address2: user.addressLine2 || '',
    city: user.city || '',
    state: user.state || '',
    zip: user.zipCode || user.zip || '',
    
    website: user.website || '',
    businessType: user.businessType || ''
  });
  
  const [isSaving, setIsSaving] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate API update delay for UI feedback
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const updatedUser = {
      ...user,
      firstName: formData.firstName,
      middleName: formData.middleName,
      lastName: formData.lastName,
      dob: formData.dob,
      gender: formData.gender,
      maritalStatus: formData.maritalStatus,
      ssn: formData.ssn,
      ein: formData.ein,
      eMail: formData.email,
      eMail2: formData.email2,
      eMail3: formData.email3,
      phone: formData.phone,
      cellPhone: formData.cellPhone,
      smsPhone: formData.smsPhone,
      addressLine1: formData.address,
      addressLine2: formData.address2,
      city: formData.city,
      state: formData.state,
      zipCode: formData.zip,
      website: formData.website,
      businessType: formData.businessType
    };
    
    // Persist to local storage
    sessionStorage.setItem('rmi_user', JSON.stringify(updatedUser));
    onUpdate(updatedUser);
    setIsSaving(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[250] flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
       <div className="glass-card w-full max-w-4xl rounded-[2.5rem] border border-white/10 overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-300 shadow-2xl">
          {/* Header */}
          <div className="p-8 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
             <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-500/10 rounded-xl"><User className="w-5 h-5 text-blue-400"/></div>
                <div>
                   <h3 className="text-2xl font-bold text-white font-heading">Complete Profile</h3>
                   <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Synchronized with NowCerts™ Registry</p>
                </div>
             </div>
             <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors"><X className="text-slate-400 hover:text-white" /></button>
          </div>
          
          <div className="p-8 overflow-y-auto space-y-10 custom-scrollbar">
             
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
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                   <div className="space-y-1">
                      <label className="text-[9px] font-bold text-slate-500 uppercase px-1">Date of Birth</label>
                      <input type="date" name="dob" value={formData.dob} onChange={handleChange} className="w-full bg-white/5 border border-white/10 p-3 rounded-xl text-white text-sm outline-none focus:border-blue-500" />
                   </div>
                   <div className="space-y-1">
                      <label className="text-[9px] font-bold text-slate-500 uppercase px-1">Gender</label>
                      <select name="gender" value={formData.gender} onChange={handleChange} className="w-full bg-[#0f172a] border border-white/10 p-3 rounded-xl text-white text-sm outline-none focus:border-blue-500">
                         <option value="">Select</option>
                         <option value="Male">Male</option>
                         <option value="Female">Female</option>
                         <option value="Other">Other</option>
                      </select>
                   </div>
                   <div className="space-y-1">
                      <label className="text-[9px] font-bold text-slate-500 uppercase px-1">Marital Status</label>
                      <select name="maritalStatus" value={formData.maritalStatus} onChange={handleChange} className="w-full bg-[#0f172a] border border-white/10 p-3 rounded-xl text-white text-sm outline-none focus:border-blue-500">
                         <option value="">Select</option>
                         <option value="Single">Single</option>
                         <option value="Married">Married</option>
                         <option value="Divorced">Divorced</option>
                         <option value="Widowed">Widowed</option>
                      </select>
                   </div>
                   <div className="space-y-1">
                      <label className="text-[9px] font-bold text-slate-500 uppercase px-1">SSN (Masked)</label>
                      <input name="ssn" value={formData.ssn} onChange={handleChange} placeholder="***-**-****" className="w-full bg-white/5 border border-white/10 p-3 rounded-xl text-white text-sm outline-none focus:border-blue-500" />
                   </div>
                </div>
             </div>

             {/* Contact Information Section */}
             <div className="space-y-6">
                <h4 className="text-[10px] font-bold text-blue-400 uppercase tracking-widest flex items-center gap-2"><Phone className="w-3 h-3"/> Multi-Channel Contact</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                   <div className="space-y-1">
                      <label className="text-[9px] font-bold text-slate-500 uppercase px-1">Primary Phone</label>
                      <input name="phone" value={formData.phone} onChange={handleChange} className="w-full bg-white/5 border border-white/10 p-3 rounded-xl text-white text-sm outline-none focus:border-blue-500" />
                   </div>
                   <div className="space-y-1">
                      <label className="text-[9px] font-bold text-slate-500 uppercase px-1">Cell Phone</label>
                      <input name="cellPhone" value={formData.cellPhone} onChange={handleChange} className="w-full bg-white/5 border border-white/10 p-3 rounded-xl text-white text-sm outline-none focus:border-blue-500" />
                   </div>
                   <div className="space-y-1">
                      <label className="text-[9px] font-bold text-slate-500 uppercase px-1">SMS Opt-In Phone</label>
                      <input name="smsPhone" value={formData.smsPhone} onChange={handleChange} className="w-full bg-white/5 border border-white/10 p-3 rounded-xl text-white text-sm outline-none focus:border-blue-500" />
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
                      <input name="address" value={formData.address} onChange={handleChange} className="w-full bg-white/5 border border-white/10 p-3 rounded-xl text-white text-sm outline-none focus:border-blue-500" />
                   </div>
                   <div className="space-y-1">
                      <label className="text-[9px] font-bold text-slate-500 uppercase px-1">Unit / Suite (Line 2)</label>
                      <input name="address2" value={formData.address2} onChange={handleChange} className="w-full bg-white/5 border border-white/10 p-3 rounded-xl text-white text-sm outline-none focus:border-blue-500" />
                   </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                   <div className="space-y-1">
                      <label className="text-[9px] font-bold text-slate-500 uppercase px-1">City</label>
                      <input name="city" value={formData.city} onChange={handleChange} className="w-full bg-white/5 border border-white/10 p-3 rounded-xl text-white text-sm outline-none focus:border-blue-500" />
                   </div>
                   <div className="space-y-1">
                      <label className="text-[9px] font-bold text-slate-500 uppercase px-1">State</label>
                      <input name="state" value={formData.state} onChange={handleChange} className="w-full bg-white/5 border border-white/10 p-3 rounded-xl text-white text-sm outline-none focus:border-blue-500" />
                   </div>
                   <div className="space-y-1">
                      <label className="text-[9px] font-bold text-slate-500 uppercase px-1">Zip Code</label>
                      <input name="zip" value={formData.zip} onChange={handleChange} className="w-full bg-white/5 border border-white/10 p-3 rounded-xl text-white text-sm outline-none focus:border-blue-500" />
                   </div>
                </div>
             </div>

             {/* Professional & Business Section */}
             <div className="space-y-6">
                <h4 className="text-[10px] font-bold text-blue-400 uppercase tracking-widest flex items-center gap-2"><Briefcase className="w-3 h-3"/> Business & Web Presence</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                   <div className="space-y-1">
                      <label className="text-[9px] font-bold text-slate-500 uppercase px-1">Business Type</label>
                      <input name="businessType" value={formData.businessType} onChange={handleChange} placeholder="e.g. Individual, LLC" className="w-full bg-white/5 border border-white/10 p-3 rounded-xl text-white text-sm outline-none focus:border-blue-500" />
                   </div>
                   <div className="space-y-1">
                      <label className="text-[9px] font-bold text-slate-500 uppercase px-1">EIN (if applicable)</label>
                      <input name="ein" value={formData.ein} onChange={handleChange} className="w-full bg-white/5 border border-white/10 p-3 rounded-xl text-white text-sm outline-none focus:border-blue-500" />
                   </div>
                   <div className="space-y-1">
                      <label className="text-[9px] font-bold text-slate-500 uppercase px-1">Website URL</label>
                      <input name="website" value={formData.website} onChange={handleChange} placeholder="https://..." className="w-full bg-white/5 border border-white/10 p-3 rounded-xl text-white text-sm outline-none focus:border-blue-500" />
                   </div>
                </div>
             </div>

             {/* Team Assignment */}
             {((user.Agents && user.Agents.length > 0) || (user.CSRs && user.CSRs.length > 0)) && (
               <div className="space-y-4 pt-6 border-t border-white/5">
                  <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2"><Shield className="w-3 h-3"/> Assigned Agency Team</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                     {[...(user.Agents || []), ...(user.CSRs || [])]
                        .filter((v,i,a)=>a.findIndex(t=>(t.DatabaseId === v.DatabaseId))===i) 
                        .map((agent: any, idx: number) => (
                       <div key={idx} className="flex items-center gap-3 p-4 bg-blue-500/5 rounded-2xl border border-blue-500/10">
                          <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-blue-500/20">
                             {agent.FirstName?.[0]}{agent.LastName?.[0]}
                          </div>
                          <div>
                             <div className="text-sm font-bold text-white">{agent.FirstName} {agent.LastName}</div>
                             <div className="text-[10px] text-blue-400 font-medium uppercase tracking-wider">Dedicated Service Professional</div>
                          </div>
                       </div>
                     ))}
                  </div>
               </div>
             )}
          </div>

          <div className="p-6 border-t border-white/5 bg-white/[0.02] flex items-center justify-between">
             <div className="flex items-center gap-2 text-slate-500">
                <Info className="w-4 h-4" />
                <span className="text-[10px] font-medium">Changes may require underwriting review before syncing.</span>
             </div>
             <button onClick={handleSave} disabled={isSaving} className="px-10 py-4 bg-blue-600 rounded-xl text-white font-bold flex items-center justify-center gap-2 hover:bg-blue-500 transition-all shadow-xl shadow-blue-500/20 active:scale-95 disabled:opacity-50">
                {isSaving ? <Loader2 className="animate-spin w-5 h-5" /> : <CheckCircle2 className="w-5 h-5" />}
                Sync Changes
             </button>
          </div>
       </div>
    </div>
  )
};
