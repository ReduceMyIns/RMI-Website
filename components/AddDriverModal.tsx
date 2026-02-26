import React, { useState, useEffect } from 'react';
import { X, Loader2, Users, CheckCircle2, AlertCircle } from 'lucide-react';
import { nowCertsApi } from '../services/nowCertsService';
import { GENDER_CODES, MARITAL_STATUS_CODES, DRIVER_LICENSE_STATUS_CODES, US_STATES } from '../services/enums';

interface AddDriverModalProps {
  policyId: string;
  policyDatabaseId: string;
  insuredDatabaseId: string;
  onClose: () => void;
  onSuccess: () => void;
}

export const AddDriverModal: React.FC<AddDriverModalProps> = ({ 
  policyId, 
  policyDatabaseId, 
  insuredDatabaseId, 
  onClose, 
  onSuccess 
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    firstName: '',
    middleName: '',
    lastName: '',
    dob: '',
    gender: '0', // Male
    maritalStatus: '0', // Single
    licenseNumber: '',
    licenseState: 'TN',
    licenseStatus: '0', // Active
    relation: 'Other',
    excluded: false,
    goodStudent: false,
    matureDriver: false
  });

  const [age, setAge] = useState<number | null>(null);

  useEffect(() => {
    if (formData.dob) {
      const birthDate = new Date(formData.dob);
      const today = new Date();
      let calculatedAge = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        calculatedAge--;
      }
      setAge(calculatedAge);
    } else {
      setAge(null);
    }
  }, [formData.dob]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // 1. Insert Driver
      const driverPayload = {
        database_id: crypto.randomUUID(),
        first_name: formData.firstName,
        middle_name: formData.middleName,
        last_name: formData.lastName,
        date_of_birth: new Date(formData.dob).toISOString(),
        gender: formData.gender === '0' ? 'M' : 'F',
        marital_status: MARITAL_STATUS_CODES.find(m => m.value.toString() === formData.maritalStatus)?.label?.charAt(0) || 'S',
        license_number: formData.licenseNumber,
        license_state: formData.licenseState,
        driver_license_status_code: parseInt(formData.licenseStatus),
        active: !formData.excluded,
        excluded: formData.excluded,
        driver_type_code: formData.excluded ? 1 : 0, // 1 = Excluded
        driver_training_indicator: formData.goodStudent ? 'Yes' : 'No',
        defensive_driver_code: formData.matureDriver ? 'Yes' : 'No',
        policy_numbers: [policyId],
        insured_database_id: insuredDatabaseId,
        policy_database_id: policyDatabaseId,
        policies: [policyId]
      };

      await nowCertsApi.insertDriver(driverPayload);

      // 2. Create Task
      let description = `Client added a new driver to policy ${policyId}.\nDriver: ${formData.firstName} ${formData.lastName}\nDOB: ${formData.dob}\nLicense: ${formData.licenseNumber} (${formData.licenseState})`;
      
      if (formData.excluded) description += '\nStatus: EXCLUDED DRIVER';
      if (formData.goodStudent) description += '\nDiscount Requested: Good Student Driver Training';
      if (formData.matureDriver) description += '\nDiscount Requested: Mature Driver Discount';

      await nowCertsApi.insertTask({
        CreatorName: "Client Portal",
        title: `Add Driver Request: ${formData.firstName} ${formData.lastName}`,
        description: description,
        category_name: "Policy Change",
        status: "New",
        priority: "High",
        due_date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        assigned_to: ["Chase Henderson"],
        insured_database_id: insuredDatabaseId,
        work_group_name: "Service Group"
      });

      onSuccess();
      onClose();
    } catch (err: any) {
      console.error("Add Driver Error", err);
      setError(err.message || "Failed to add driver. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="glass-card w-full max-w-lg rounded-2xl border border-white/10 overflow-hidden flex flex-col animate-in zoom-in-95 duration-300 shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/[0.02] sticky top-0 backdrop-blur-md z-10">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-500/10 rounded-xl"><Users className="w-5 h-5 text-indigo-400"/></div>
            <h3 className="text-xl font-bold text-white font-heading">Add Driver</h3>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors"><X className="text-slate-400 hover:text-white" /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-2 text-red-400 text-xs font-bold">
              <AlertCircle className="w-4 h-4" />
              {error}
            </div>
          )}

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase">First Name</label>
              <input name="firstName" required value={formData.firstName} onChange={handleChange} className="w-full bg-white/5 border border-white/10 p-3 rounded-xl text-white text-sm outline-none focus:border-blue-500" />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase">Middle</label>
              <input name="middleName" value={formData.middleName} onChange={handleChange} className="w-full bg-white/5 border border-white/10 p-3 rounded-xl text-white text-sm outline-none focus:border-blue-500" />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase">Last Name</label>
              <input name="lastName" required value={formData.lastName} onChange={handleChange} className="w-full bg-white/5 border border-white/10 p-3 rounded-xl text-white text-sm outline-none focus:border-blue-500" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase">Date of Birth</label>
              <input name="dob" type="date" required value={formData.dob} onChange={handleChange} className="w-full bg-white/5 border border-white/10 p-3 rounded-xl text-white text-sm outline-none focus:border-blue-500" />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase">Gender</label>
              <select name="gender" value={formData.gender} onChange={handleChange} className="w-full bg-[#0f172a] border border-white/10 p-3 rounded-xl text-white text-sm outline-none focus:border-blue-500">
                {GENDER_CODES.map(g => (
                    <option key={g.value} value={g.value}>{g.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
             <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase">Marital Status</label>
              <select name="maritalStatus" value={formData.maritalStatus} onChange={handleChange} className="w-full bg-[#0f172a] border border-white/10 p-3 rounded-xl text-white text-sm outline-none focus:border-blue-500">
                {MARITAL_STATUS_CODES.map(m => (
                    <option key={m.value} value={m.value}>{m.label}</option>
                ))}
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase">License Status</label>
              <select name="licenseStatus" value={formData.licenseStatus} onChange={handleChange} className="w-full bg-[#0f172a] border border-white/10 p-3 rounded-xl text-white text-sm outline-none focus:border-blue-500">
                {DRIVER_LICENSE_STATUS_CODES.map(s => (
                    <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase">License Number</label>
              <input name="licenseNumber" required value={formData.licenseNumber} onChange={handleChange} className="w-full bg-white/5 border border-white/10 p-3 rounded-xl text-white text-sm outline-none focus:border-blue-500" />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase">License State</label>
              <select name="licenseState" value={formData.licenseState} onChange={handleChange} className="w-full bg-[#0f172a] border border-white/10 p-3 rounded-xl text-white text-sm outline-none focus:border-blue-500">
                  {US_STATES.map(state => (
                      <option key={state} value={state}>{state}</option>
                  ))}
              </select>
            </div>
          </div>

          <div className="space-y-3 pt-2 border-t border-white/10">
            <label className="flex items-center gap-3 p-3 bg-white/5 rounded-xl cursor-pointer hover:bg-white/10 transition-colors">
                <input type="checkbox" name="excluded" checked={formData.excluded} onChange={handleChange} className="w-5 h-5 rounded border-white/20 bg-white/5 text-indigo-500 focus:ring-indigo-500 focus:ring-offset-0" />
                <div>
                    <div className="text-sm font-bold text-white">Excluded Driver</div>
                    <div className="text-xs text-slate-400">Driver will be excluded from coverage on this policy</div>
                </div>
            </label>

            {age !== null && age < 25 && (
                <label className="flex items-center gap-3 p-3 bg-white/5 rounded-xl cursor-pointer hover:bg-white/10 transition-colors animate-in fade-in slide-in-from-top-2">
                    <input type="checkbox" name="goodStudent" checked={formData.goodStudent} onChange={handleChange} className="w-5 h-5 rounded border-white/20 bg-white/5 text-indigo-500 focus:ring-indigo-500 focus:ring-offset-0" />
                    <div>
                        <div className="text-sm font-bold text-white">Good Student Driver Training</div>
                        <div className="text-xs text-slate-400">Apply discount for good student driver training</div>
                    </div>
                </label>
            )}

            {age !== null && age > 60 && (
                <label className="flex items-center gap-3 p-3 bg-white/5 rounded-xl cursor-pointer hover:bg-white/10 transition-colors animate-in fade-in slide-in-from-top-2">
                    <input type="checkbox" name="matureDriver" checked={formData.matureDriver} onChange={handleChange} className="w-5 h-5 rounded border-white/20 bg-white/5 text-indigo-500 focus:ring-indigo-500 focus:ring-offset-0" />
                    <div>
                        <div className="text-sm font-bold text-white">Mature Driver Discount</div>
                        <div className="text-xs text-slate-400">Apply discount for mature driver course completion</div>
                    </div>
                </label>
            )}
          </div>

          <button type="submit" disabled={loading} className="w-full py-4 bg-indigo-600 rounded-xl text-white font-bold flex items-center justify-center gap-2 hover:bg-indigo-500 transition-all shadow-xl shadow-indigo-500/20 active:scale-95 disabled:opacity-50 mt-4">
            {loading ? <Loader2 className="animate-spin w-5 h-5" /> : <CheckCircle2 className="w-5 h-5" />}
            Add Driver
          </button>
        </form>
      </div>
    </div>
  );
};
