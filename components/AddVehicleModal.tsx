import React, { useState } from 'react';
import { X, Loader2, Car, CheckCircle2, AlertCircle, Search } from 'lucide-react';
import { nowCertsApi } from '../services/nowCertsService';
import { nhtsaService } from '../services/nhtsaService';
import { VEHICLE_CODE_USE, VEHICLE_TYPES } from '../services/enums';

interface AddVehicleModalProps {
  policyId: string;
  policyDatabaseId: string;
  insuredDatabaseId: string;
  onClose: () => void;
  onSuccess: () => void;
}

export const AddVehicleModal: React.FC<AddVehicleModalProps> = ({ 
  policyId, 
  policyDatabaseId, 
  insuredDatabaseId, 
  onClose, 
  onSuccess 
}) => {
  const [loading, setLoading] = useState(false);
  const [decoding, setDecoding] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    year: new Date().getFullYear(),
    make: '',
    model: '',
    vin: '',
    usage: '2', // Default to Commute (2)
    vehicleType: '2', // Default to Car (2)
    annualMileage: '12000',
    costNew: '',
    purchaseDate: new Date().toISOString().split('T')[0]
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleVinDecode = async () => {
      if (!formData.vin || formData.vin.length < 17) {
          setError("Please enter a valid 17-character VIN.");
          return;
      }
      setDecoding(true);
      setError('');
      try {
          const data = await nhtsaService.decodeVin(formData.vin);
          if (data.year && data.make && data.model) {
              setFormData(prev => ({
                  ...prev,
                  year: parseInt(data.year),
                  make: data.make,
                  model: data.model
              }));
          } else {
              setError("Could not decode VIN details. Please enter manually.");
          }
      } catch (err) {
          setError("Failed to decode VIN.");
      } finally {
          setDecoding(false);
      }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // 1. Insert Vehicle
      const vehiclePayload = {
        database_id: crypto.randomUUID(),
        year: parseInt(formData.year.toString()),
        make: formData.make,
        model: formData.model,
        vin: formData.vin,
        type_of_use: VEHICLE_CODE_USE.find(u => u.value.toString() === formData.usage)?.label || 'Commute',
        typeOfUseAsFlag: parseInt(formData.usage),
        value: formData.costNew,
        visible: true,
        policy_numbers: [policyId],
        insured_database_id: insuredDatabaseId,
        policy_database_id: policyDatabaseId,
        active: true,
        estimated_annual_distance: formData.annualMileage,
        vehicleEditAdditional4: {
            purchase_date: new Date(formData.purchaseDate).toISOString()
        },
        vehicleEditAdditional3: {
            body_type: parseInt(formData.vehicleType)
        }
      };

      await nowCertsApi.insertVehicle(vehiclePayload);

      // 2. Create Task
      await nowCertsApi.insertTask({
        CreatorName: "Client Portal",
        title: `Add Vehicle Request: ${formData.year} ${formData.make} ${formData.model}`,
        description: `Client added a new vehicle to policy ${policyId}.\nVehicle: ${formData.year} ${formData.make} ${formData.model}\nVIN: ${formData.vin}\nUsage: ${VEHICLE_CODE_USE.find(u => u.value.toString() === formData.usage)?.label}`,
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
      console.error("Add Vehicle Error", err);
      setError(err.message || "Failed to add vehicle. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="glass-card w-full max-w-lg rounded-2xl border border-white/10 overflow-hidden flex flex-col animate-in zoom-in-95 duration-300 shadow-2xl">
        <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/10 rounded-xl"><Car className="w-5 h-5 text-blue-400"/></div>
            <h3 className="text-xl font-bold text-white font-heading">Add Vehicle</h3>
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

          <div className="space-y-1">
             <label className="text-[10px] font-bold text-slate-500 uppercase">VIN (Vehicle Identification Number)</label>
             <div className="flex gap-2">
                 <input 
                    name="vin" 
                    required 
                    value={formData.vin} 
                    onChange={handleChange} 
                    className="flex-1 bg-white/5 border border-white/10 p-3 rounded-xl text-white text-sm outline-none focus:border-blue-500 uppercase" 
                    placeholder="Enter 17-digit VIN"
                 />
                 <button 
                    type="button" 
                    onClick={handleVinDecode}
                    disabled={decoding || !formData.vin}
                    className="px-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold text-xs transition-colors disabled:opacity-50 flex items-center gap-2"
                 >
                    {decoding ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                    Decode
                 </button>
             </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase">Year</label>
              <input name="year" type="number" required value={formData.year} onChange={handleChange} className="w-full bg-white/5 border border-white/10 p-3 rounded-xl text-white text-sm outline-none focus:border-blue-500" />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase">Make</label>
              <input name="make" required value={formData.make} onChange={handleChange} className="w-full bg-white/5 border border-white/10 p-3 rounded-xl text-white text-sm outline-none focus:border-blue-500" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase">Model</label>
              <input name="model" required value={formData.model} onChange={handleChange} className="w-full bg-white/5 border border-white/10 p-3 rounded-xl text-white text-sm outline-none focus:border-blue-500" />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase">Vehicle Type</label>
              <select name="vehicleType" value={formData.vehicleType} onChange={handleChange} className="w-full bg-[#0f172a] border border-white/10 p-3 rounded-xl text-white text-sm outline-none focus:border-blue-500">
                {VEHICLE_TYPES.map(t => (
                    <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase">Usage</label>
              <select name="usage" value={formData.usage} onChange={handleChange} className="w-full bg-[#0f172a] border border-white/10 p-3 rounded-xl text-white text-sm outline-none focus:border-blue-500">
                {VEHICLE_CODE_USE.map(u => (
                    <option key={u.value} value={u.value}>{u.label}</option>
                ))}
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase">Annual Mileage</label>
              <input name="annualMileage" type="number" value={formData.annualMileage} onChange={handleChange} className="w-full bg-white/5 border border-white/10 p-3 rounded-xl text-white text-sm outline-none focus:border-blue-500" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
             <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase">Cost New ($)</label>
              <input name="costNew" type="number" value={formData.costNew} onChange={handleChange} className="w-full bg-white/5 border border-white/10 p-3 rounded-xl text-white text-sm outline-none focus:border-blue-500" />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase">Purchase Date</label>
              <input name="purchaseDate" type="date" value={formData.purchaseDate} onChange={handleChange} className="w-full bg-white/5 border border-white/10 p-3 rounded-xl text-white text-sm outline-none focus:border-blue-500" />
            </div>
          </div>

          <button type="submit" disabled={loading} className="w-full py-4 bg-blue-600 rounded-xl text-white font-bold flex items-center justify-center gap-2 hover:bg-blue-500 transition-all shadow-xl shadow-blue-500/20 active:scale-95 disabled:opacity-50 mt-4">
            {loading ? <Loader2 className="animate-spin w-5 h-5" /> : <CheckCircle2 className="w-5 h-5" />}
            Add Vehicle
          </button>
        </form>
      </div>
    </div>
  );
};
