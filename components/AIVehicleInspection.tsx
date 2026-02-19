
import React, { useState, useRef } from 'react';
import { 
  Camera, Car, Search, FileText, CheckCircle2, AlertTriangle, AlertCircle, X, 
  ChevronRight, Loader2, ArrowLeft, Save, Edit3, MapPin, Scan, Trash2, Smartphone, Mail, User, Check, Plus, Download
} from 'lucide-react';
import { jsPDF } from "jspdf";
import { analyzeVehiclePhoto, extractRegistrationData, decodeVin } from '../services/geminiService';
import { dbService } from '../services/dbService';
import { PhotoRequirement, AIAnalysisResult } from '../types';
import { auth } from '../services/firebase';

interface VehicleInfo {
  id: string;
  year: number;
  make: string;
  model: string;
  vin: string;
  plate: string;
  state: string;
}

interface OwnerInfo {
  firstName: string;
  lastName: string;
  address: string;
  email: string;
}

const AIVehicleInspection: React.FC = () => {
  const [mode, setMode] = useState<'INTAKE' | 'INSPECTION' | 'REPORT'>('INTAKE');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  // Multi-vehicle State
  const [vehicles, setVehicles] = useState<VehicleInfo[]>([]);
  const [currentEntry, setCurrentEntry] = useState<VehicleInfo>({
    id: 'temp', year: 2025, make: '', model: '', vin: '', plate: '', state: 'TN'
  });
  
  // Inspection State
  const [activeVehicleId, setActiveVehicleId] = useState<string>('');
  const [requirementsMap, setRequirementsMap] = useState<Record<string, (PhotoRequirement & { photoBase64?: string })[]>>({});

  const [owner, setOwner] = useState<OwnerInfo>({
    firstName: '', lastName: '', address: '', email: ''
  });

  const [activeReqId, setActiveReqId] = useState<string | null>(null);
  
  // Refs
  const activeReqIdRef = useRef<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const regInputRef = useRef<HTMLInputElement>(null);

  // Helper to read file as Base64 Promise
  const readFileAsBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        const base64 = result.includes(',') ? result.split(',')[1] : result;
        resolve(base64);
      };
      reader.onerror = (e) => reject(new Error("File read error"));
      reader.readAsDataURL(file);
    });
  };

  const handleRegScan = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const base64 = await readFileAsBase64(file);
      const data = await extractRegistrationData({ data: base64, mimeType: file.type });
      if (data) {
        setCurrentEntry(prev => ({
          ...prev,
          year: data.year || prev.year,
          make: data.make || prev.make,
          model: data.model || prev.model,
          vin: data.vin || prev.vin,
          plate: data.plate || prev.plate,
          state: data.state || prev.state
        }));
        
        // Only update owner if it's the first scan or empty
        if (!owner.email) {
            setOwner(prev => ({
            ...prev,
            firstName: data.ownerFirstName || prev.firstName,
            lastName: data.ownerLastName || prev.lastName,
            address: `${data.address || ''} ${data.city || ''} ${data.zip || ''}`.trim() || prev.address
            }));
        }
      }
    } catch (err) {
      setErrorMessage("Failed to scan registration. Please enter details manually.");
    } finally {
      setIsLoading(false);
      e.target.value = '';
    }
  };

  const handleVinDecode = async () => {
    if (currentEntry.vin.length < 11) return;
    setIsLoading(true);
    try {
      const data = await decodeVin(currentEntry.vin);
      if (data) {
        setCurrentEntry(prev => ({ ...prev, year: data.year, make: data.make, model: data.model }));
      }
    } catch (err) {
      setErrorMessage("VIN decoding failed. Please enter specs manually.");
    } finally {
      setIsLoading(false);
    }
  };

  const addVehicleToList = () => {
    if (!currentEntry.make || !currentEntry.model) {
        setErrorMessage("Please enter at least a Make and Model.");
        return;
    }
    const newVehicle = { ...currentEntry, id: `veh-${Date.now()}` };
    setVehicles(prev => [...prev, newVehicle]);
    
    // Reset entry form
    setCurrentEntry({
        id: 'temp', year: new Date().getFullYear(), make: '', model: '', vin: '', plate: '', state: 'TN'
    });
    setErrorMessage(null);
  };

  const removeVehicleFromList = (id: string) => {
      setVehicles(prev => prev.filter(v => v.id !== id));
  };

  const initializeInspection = () => {
    const clientId = auth.currentUser?.uid || 'guest';
    const newReqMap: Record<string, (PhotoRequirement & { photoBase64?: string })[]> = {};

    vehicles.forEach(veh => {
        const reqs: Partial<PhotoRequirement>[] = [
            { group: 'Exterior', category: 'Front View', description: 'Straight-on shot of the entire front of the car.' },
            { 
              group: 'Exterior', 
              category: 'Rear View & License Plate', 
              description: `Straight-on shot of rear. Ensure License Plate ${veh.plate ? `(${veh.plate}) ` : ''}is clearly legible.` 
            },
            { group: 'Exterior', category: 'Driver Side', description: 'Profile shot of the driver side (full length).' },
            { group: 'Exterior', category: 'Passenger Side', description: 'Profile shot of the passenger side (full length).' },
            { group: 'Systems', category: 'Dashboard / Odometer', description: 'Photo of the cluster showing current mileage.' }
        ];

        newReqMap[veh.id] = reqs.map((r, idx) => ({ 
            ...r, 
            id: `${veh.id}-req-${idx}`, 
            clientId, 
            status: 'Required' as const 
        } as PhotoRequirement));
    });

    setRequirementsMap(newReqMap);
    setActiveVehicleId(vehicles[0].id);
    setMode('INSPECTION');
  };

  const processPhoto = async (base64Data: string, req: PhotoRequirement, mimeType: string) => {
    const currentVeh = vehicles.find(v => v.id === activeVehicleId);
    let enhancedDescription = req.description;
    
    if (currentVeh && req.category.includes('License Plate') && currentVeh.plate) {
        enhancedDescription += ` Verify that the license plate number visible is exactly "${currentVeh.plate}".`;
    }

    // Wrap AI call with timeout
    const aiPromise = analyzeVehiclePhoto(
      { data: base64Data, mimeType: mimeType }, 
      req.category, 
      enhancedDescription
    );
    
    const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error("AI Analysis timed out")), 25000));

    const analysis: any = await Promise.race([aiPromise, timeoutPromise]);

    if (analysis) {
      let photoUrl = '';
      const dataUri = base64Data.startsWith('data:') ? base64Data : `data:${mimeType};base64,${base64Data}`;
      
      try {
         // Only wait 10 seconds for upload
         const uploadPromise = dbService.uploadBase64(dataUri, `inspections/vehicles/${auth.currentUser?.uid || 'guest'}/${req.id}.jpg`);
         const uploadTimeout = new Promise<string>((_, reject) => setTimeout(() => reject(new Error("Upload timed out")), 10000));
         
         photoUrl = await Promise.race([uploadPromise, uploadTimeout]);
         
      } catch (uploadErr) {
         console.warn("Storage upload skipped/failed, using local preview", uploadErr);
         photoUrl = dataUri;
      }

      let newStatus: PhotoRequirement['status'] = 'Verified';
      if (!analysis.matches) {
         newStatus = 'Rejected';
      } else if (analysis.presentationCheck && !analysis.presentationCheck.isClean) {
         newStatus = 'Review';
      }

      setRequirementsMap(prev => ({
          ...prev,
          [activeVehicleId]: prev[activeVehicleId].map(r => 
            r.id === req.id 
              ? { ...r, status: newStatus, aiAnalysis: analysis as any, photoUrl, photoBase64: dataUri } : r
          )
      }));
    } else {
      throw new Error("AI returned empty result");
    }
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    const currentReqId = activeReqIdRef.current;

    if (!file || !currentReqId) return;

    const currentReqs = requirementsMap[activeVehicleId] || [];
    const req = currentReqs.find(r => r.id === currentReqId);
    if (!req) return;

    setIsLoading(true);
    setErrorMessage(null);
    
    try {
      const base64 = await readFileAsBase64(file);
      await processPhoto(base64, req, file.type);
    } catch (err: any) {
      console.error("Processing failed", err);
      setErrorMessage(err.message || "Failed to process photo. Please retry.");
    } finally {
      setIsLoading(false);
      setActiveReqId(null);
      activeReqIdRef.current = null;
      if (e.target) e.target.value = ''; 
    }
  };

  const triggerUpload = (reqId: string) => {
    if (isLoading) return; 
    setActiveReqId(reqId);
    activeReqIdRef.current = reqId;
    setTimeout(() => {
        fileInputRef.current?.click();
    }, 100);
  };

  const generateReport = async () => {
      setIsLoading(true);
      try {
        const doc = new jsPDF();
        const pageWidth = doc.internal.pageSize.getWidth();
        let yPos = 20;

        // --- TITLE PAGE ---
        doc.setFontSize(22);
        doc.setFont("helvetica", "bold");
        doc.text("Vehicle Inspection Report", 105, yPos, { align: "center" });
        yPos += 15;

        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        doc.text(`Generated: ${new Date().toLocaleString()}`, 105, yPos, { align: "center" });
        doc.text(`Agency: ReduceMyInsurance.Net`, 105, yPos + 5, { align: "center" });
        yPos += 20;

        doc.setDrawColor(200);
        doc.line(20, yPos, pageWidth - 20, yPos);
        yPos += 10;

        // OWNER INFO
        doc.setFontSize(14);
        doc.setFont("helvetica", "bold");
        doc.text("Owner Information", 20, yPos);
        yPos += 8;
        doc.setFontSize(11);
        doc.setFont("helvetica", "normal");
        doc.text(`Name: ${owner.firstName} ${owner.lastName}`, 20, yPos);
        yPos += 6;
        doc.text(`Email: ${owner.email}`, 20, yPos);
        yPos += 6;
        doc.text(`Address: ${owner.address}`, 20, yPos);
        yPos += 20;

        // --- VEHICLE SECTIONS ---
        vehicles.forEach((veh, index) => {
            const reqs = requirementsMap[veh.id] || [];
            
            // New Page for each vehicle if not the first, or if running out of space
            if (index > 0 || yPos > 250) {
                doc.addPage();
                yPos = 20;
            }

            // Header for Vehicle
            doc.setFillColor(240, 240, 240); // Light gray background
            doc.rect(10, yPos - 5, pageWidth - 20, 25, 'F');
            doc.setFontSize(16);
            doc.setFont("helvetica", "bold");
            doc.setTextColor(0, 51, 102); // Navy Blue
            doc.text(`${veh.year} ${veh.make} ${veh.model}`, 15, yPos + 5);
            
            doc.setFontSize(10);
            doc.setTextColor(50);
            doc.text(`VIN: ${veh.vin}  |  Plate: ${veh.plate}`, 15, yPos + 12);
            yPos += 30;

            // Photos Grid
            reqs.forEach((req: any) => {
                if (yPos > 260) {
                    doc.addPage();
                    yPos = 20;
                }

                // Status Badge logic
                const isVerified = req.status === 'Verified';
                const statusColor = isVerified ? [0, 150, 0] : [200, 0, 0];

                doc.setFontSize(11);
                doc.setFont("helvetica", "bold");
                doc.setTextColor(0);
                doc.text(req.category, 20, yPos);
                
                // Status Text
                doc.setFontSize(9);
                doc.setTextColor(statusColor[0], statusColor[1], statusColor[2]);
                doc.text(req.status.toUpperCase(), 150, yPos);
                yPos += 5;

                // Description
                doc.setFont("helvetica", "normal");
                doc.setTextColor(80);
                doc.text(req.description, 20, yPos);
                yPos += 5;

                // Image
                if (req.photoBase64 || req.photoUrl) {
                    try {
                        const imgData = req.photoBase64 || req.photoUrl;
                        doc.addImage(imgData, 'JPEG', 20, yPos + 2, 60, 45);
                    } catch (e) {
                        doc.text("[Image Error]", 20, yPos + 20);
                    }
                } else {
                    doc.rect(20, yPos + 2, 60, 45); // Placeholder box
                    doc.text("No Photo", 35, yPos + 25);
                }

                // AI Analysis Details (Right side of image)
                if (req.aiAnalysis) {
                    doc.setFontSize(9);
                    doc.setTextColor(0);
                    const analysisText = doc.splitTextToSize(`Analysis: ${req.aiAnalysis.detailedSummary}`, 90);
                    doc.text(analysisText, 90, yPos + 10);
                }

                yPos += 55; // Move down for next item
                doc.setDrawColor(230);
                doc.line(20, yPos - 5, pageWidth - 20, yPos - 5); // Divider
            });
            
            yPos += 10;
        });

        // 1. Convert PDF to Blob for Upload
        const pdfBlob = doc.output('blob');
        
        // 2. Upload to Firestore
        const reader = new FileReader();
        reader.readAsDataURL(pdfBlob);
        reader.onloadend = async () => {
            const base64data = reader.result as string;
            let pdfUrl = '';
            try {
                const uid = auth.currentUser?.uid || 'guest';
                pdfUrl = await dbService.uploadBase64(base64data, `inspection-reports/${uid}/${Date.now()}_report.pdf`);
            } catch (e) {
                console.error("PDF Upload Failed", e);
            }

            // 3. Save Record to Database
            const flatReqs = Object.values(requirementsMap).flat().map((r: any) => {
                // Strip large base64 strings from DB record to save space/cost
                const { photoBase64, ...rest } = r;
                return rest;
            });

            const reportData = {
                type: 'Vehicle',
                owner: owner,
                vehicles: vehicles,
                requirements: flatReqs,
                completionScore: 100,
                pdfUrl: pdfUrl,
                generatedBy: 'Vehicle-AI-Inspector',
                createdAt: new Date().toISOString()
            };

            await dbService.saveInspection(reportData, auth.currentUser?.uid);

            // 4. Download Local Copy
            doc.save(`${owner.lastName}_Inspection_Report.pdf`);
            alert("Report generated, uploaded, and submitted successfully!");
        };

      } catch (err) {
          console.error("PDF Generation Error", err);
          alert("Error creating report.");
      } finally {
          setIsLoading(false);
      }
  };

  // --- DERIVED STATE ---
  const currentReqs = requirementsMap[activeVehicleId] || [];
  
  // Calculate Global Progress
  const totalReqs = Object.values(requirementsMap).flat().length;
  const verifiedReqs = Object.values(requirementsMap).flat().filter((r: any) => r.status === 'Verified').length;
  const progress = totalReqs > 0 ? Math.round((verifiedReqs / totalReqs) * 100) : 0;

  if (mode === 'INTAKE') {
    return (
      <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="glass-card rounded-[3rem] p-10 md:p-16 border-white/10 relative">
          {errorMessage && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-sm flex items-center gap-3">
              <AlertCircle className="w-5 h-5" /> {errorMessage}
            </div>
          )}
          
          <div className="text-center space-y-6 mb-8">
            <div className="w-20 h-20 bg-blue-500/10 rounded-3xl flex items-center justify-center mx-auto text-blue-400 mb-6 border border-blue-500/20">
              <Car className="w-10 h-10" />
            </div>
            <h1 className="text-4xl md:text-5xl font-heading font-bold text-white">Vehicle Intake</h1>
            <p className="text-slate-400 max-w-lg mx-auto">Add all vehicles requiring inspection to generate a single consolidated report.</p>
          </div>

          <div className="space-y-8 max-w-2xl mx-auto">
             {/* OWNER INFO SECTION */}
             <div className="space-y-4">
               <h4 className="text-xs font-bold text-blue-400 uppercase tracking-widest flex items-center gap-2 mb-2">
                  <User className="w-4 h-4" /> Owner & Contact
               </h4>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input value={owner.firstName} onChange={e => setOwner({...owner, firstName: e.target.value})} className="w-full bg-white/5 border border-white/10 p-4 rounded-xl text-white outline-none focus:border-blue-500" placeholder="First Name" />
                  <input value={owner.lastName} onChange={e => setOwner({...owner, lastName: e.target.value})} className="w-full bg-white/5 border border-white/10 p-4 rounded-xl text-white outline-none focus:border-blue-500" placeholder="Last Name" />
               </div>
               <input type="email" value={owner.email} onChange={e => setOwner({...owner, email: e.target.value})} className="w-full bg-white/5 border border-white/10 p-4 rounded-xl text-white outline-none focus:border-blue-500" placeholder="insured@email.com" />
             </div>

             {/* VEHICLE ADDITION SECTION */}
             <div className="bg-slate-900/50 p-6 rounded-3xl border border-white/10 space-y-4">
                <div className="flex justify-between items-center">
                    <h4 className="text-xs font-bold text-blue-400 uppercase tracking-widest flex items-center gap-2">
                        <Car className="w-4 h-4" /> Add Vehicle
                    </h4>
                    <button 
                        onClick={() => regInputRef.current?.click()}
                        disabled={isLoading}
                        className="text-xs text-blue-400 hover:text-white font-bold flex items-center gap-2 transition-colors disabled:opacity-50"
                    >
                        {isLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Scan className="w-3 h-3" />} Scan Registration
                    </button>
                    <input type="file" ref={regInputRef} className="hidden" accept="image/*,application/pdf" onChange={handleRegScan} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-500 uppercase px-1">VIN Number</label>
                        <div className="flex gap-2">
                            <input value={currentEntry.vin} onChange={e => setCurrentEntry({...currentEntry, vin: e.target.value.toUpperCase()})} className="flex-grow bg-white/5 border border-white/10 p-4 rounded-xl text-white outline-none focus:border-blue-500 font-mono text-sm" placeholder="17 Digit VIN" />
                            <button onClick={handleVinDecode} disabled={isLoading || currentEntry.vin.length < 11} className="bg-white/5 p-3 rounded-xl text-blue-400 hover:text-white transition-colors border border-white/10">
                                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Smartphone className="w-5 h-5" />}
                            </button>
                        </div>
                    </div>
                    <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-500 uppercase px-1">Plate #</label>
                        <input value={currentEntry.plate} onChange={e => setCurrentEntry({...currentEntry, plate: e.target.value.toUpperCase()})} className="w-full bg-white/5 border border-white/10 p-4 rounded-xl text-white outline-none focus:border-blue-500 text-sm" placeholder="ABC-1234" />
                    </div>
                    <input value={currentEntry.year} onChange={e => setCurrentEntry({...currentEntry, year: parseInt(e.target.value)})} type="number" className="bg-white/5 border border-white/10 p-4 rounded-xl text-white outline-none focus:border-blue-500 text-sm" placeholder="Year" />
                    <input value={currentEntry.make} onChange={e => setCurrentEntry({...currentEntry, make: e.target.value})} className="bg-white/5 border border-white/10 p-4 rounded-xl text-white outline-none focus:border-blue-500 text-sm" placeholder="Make" />
                    <input value={currentEntry.model} onChange={e => setCurrentEntry({...currentEntry, model: e.target.value})} className="md:col-span-2 bg-white/5 border border-white/10 p-4 rounded-xl text-white outline-none focus:border-blue-500 text-sm" placeholder="Model" />
                </div>

                <button 
                    onClick={addVehicleToList}
                    className="w-full py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 border border-white/10"
                >
                    <Plus className="w-4 h-4" /> Add to List
                </button>
             </div>

             {/* ADDED VEHICLES LIST */}
             {vehicles.length > 0 && (
                 <div className="space-y-2">
                     <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest px-1">Ready for Inspection</h4>
                     {vehicles.map((v) => (
                         <div key={v.id} className="flex items-center justify-between p-4 bg-blue-600/10 border border-blue-500/20 rounded-2xl">
                             <div className="flex items-center gap-4">
                                 <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-xs">
                                     {v.year.toString().slice(2)}
                                 </div>
                                 <div>
                                     <div className="font-bold text-white text-sm">{v.make} {v.model}</div>
                                     <div className="text-[10px] text-blue-300 font-mono">{v.vin}</div>
                                 </div>
                             </div>
                             <button onClick={() => removeVehicleFromList(v.id)} className="p-2 hover:bg-red-500/20 rounded-lg text-slate-400 hover:text-red-400 transition-colors">
                                 <Trash2 className="w-4 h-4" />
                             </button>
                         </div>
                     ))}
                 </div>
             )}

             <button 
                onClick={initializeInspection}
                disabled={vehicles.length === 0 || !owner.email}
                className="w-full py-5 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-bold text-lg shadow-xl transition-all flex items-center justify-center gap-3 disabled:opacity-50"
             >
                Start Inspection ({vehicles.length}) <ChevronRight className="w-5 h-5" />
             </button>
          </div>
        </div>
      </div>
    );
  }

  // --- INSPECTION MODE ---
  const activeVehicle = vehicles.find(v => v.id === activeVehicleId) || vehicles[0];

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in pb-24">
       
       <div className="flex justify-between items-center">
            <button onClick={() => setMode('INTAKE')} className="text-sm font-bold text-slate-400 hover:text-white transition-colors flex items-center gap-2 mb-6">
                <ArrowLeft className="w-4 h-4" /> Back to Intake
            </button>
            
            {/* Global Progress */}
            <div className="flex items-center gap-4">
                <div className="text-right">
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total Progress</div>
                    <div className="text-xl font-bold text-white">{progress}%</div>
                </div>
                <div className="w-12 h-12 rounded-full border-4 border-slate-800 flex items-center justify-center relative">
                    <svg className="w-full h-full absolute inset-0 transform -rotate-90" viewBox="0 0 36 36">
                        <path className="text-slate-800" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="4" />
                        <path className="text-blue-500 transition-all duration-1000" strokeDasharray={`${progress}, 100`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="4" />
                    </svg>
                </div>
            </div>
       </div>

       {/* Dashed Inspection Container */}
       <div className="border-2 border-dashed border-blue-500/30 rounded-[3rem] p-8 md:p-12 relative bg-[#060B16]">
          
          {/* Vehicle Tabs */}
          <div className="flex gap-2 overflow-x-auto pb-4 mb-8 border-b border-white/5">
              {vehicles.map(v => (
                  <button
                    key={v.id}
                    onClick={() => setActiveVehicleId(v.id)}
                    className={`flex items-center gap-3 px-6 py-3 rounded-xl border transition-all whitespace-nowrap ${
                        activeVehicleId === v.id 
                        ? 'bg-blue-600 border-blue-500 text-white shadow-lg' 
                        : 'bg-white/5 border-white/5 text-slate-400 hover:text-white'
                    }`}
                  >
                      <div className={`w-2 h-2 rounded-full ${requirementsMap[v.id]?.every((r: any) => r.status === 'Verified') ? 'bg-green-400' : 'bg-slate-400'}`}></div>
                      <span className="font-bold text-sm">{v.year} {v.make}</span>
                  </button>
              ))}
          </div>

          {/* Header Row for Active Vehicle */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
             <div className="space-y-2">
                <h2 className="text-4xl font-heading font-black italic text-white uppercase tracking-tighter leading-none">
                   {activeVehicle.year} {activeVehicle.make} {activeVehicle.model}
                </h2>
                <div className="text-xs font-bold text-blue-500 font-mono tracking-widest flex items-center gap-4">
                   <span>{activeVehicle.vin}</span>
                   <span className="text-slate-600">•</span>
                   <span>PLATE: {activeVehicle.plate}</span>
                </div>
             </div>
          </div>

          {errorMessage && (
              <div className="mb-8 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-sm flex items-center gap-3">
                <AlertCircle className="w-5 h-5" /> {errorMessage}
                <button onClick={() => setErrorMessage(null)} className="ml-auto p-1 hover:bg-white/5 rounded-lg"><X className="w-4 h-4" /></button>
              </div>
          )}

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentReqs.map(req => {
                const isProcessing = isLoading && activeReqId === req.id;
                const isVerified = req.status === 'Verified';
                const isRejected = req.status === 'Rejected';
                const isReview = req.status === 'Review';
                
                const isActiveCard = isProcessing || activeReqId === req.id;
                
                return (
                  <div 
                      key={req.id} 
                      className={`p-8 rounded-[2rem] border transition-all relative overflow-hidden group ${
                          isActiveCard 
                            ? 'bg-slate-200 border-transparent text-slate-900 scale-[1.02] shadow-2xl' 
                            : 'bg-[#0B1221] border-white/5 text-white hover:border-white/10'
                      }`}
                  >
                      {/* Top Row */}
                      <div className="flex justify-between items-start mb-6">
                          <div>
                              <div className={`text-[9px] font-bold uppercase tracking-widest mb-1 ${isActiveCard ? 'text-slate-500' : 'text-slate-500'}`}>
                                {req.group}
                              </div>
                              <div className="font-bold text-lg leading-tight">{req.category}</div>
                          </div>
                          <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                             isVerified 
                               ? 'border-green-500 bg-green-500 text-slate-900' 
                               : isActiveCard ? 'border-slate-400' : 'border-slate-700'
                          }`}>
                             {isVerified && <Check className="w-3 h-3 stroke-[4]" />}
                          </div>
                      </div>
                      
                      <p className={`text-xs mb-8 leading-relaxed min-h-[40px] ${isActiveCard ? 'text-slate-600' : 'text-slate-400'}`}>
                        {req.description}
                      </p>
                      
                      {/* Photo Preview / Action Area */}
                      {(isVerified || isRejected || isReview) && (req.photoUrl || req.photoBase64) ? (
                          <div className="w-full h-32 rounded-2xl overflow-hidden mb-4 relative group/img bg-black/40">
                              <img src={req.photoBase64 || req.photoUrl} className={`w-full h-full object-cover ${isRejected ? 'grayscale opacity-50' : ''}`} alt="Vehicle" />
                              {isVerified && (
                                  <div className="absolute inset-0 bg-blue-600/30 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover/img:opacity-100 transition-opacity">
                                      <CheckCircle2 className="w-10 h-10 text-white" />
                                  </div>
                              )}
                          </div>
                      ) : (
                          <button 
                              onClick={() => triggerUpload(req.id)}
                              disabled={isLoading}
                              className={`w-full py-4 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
                                  isActiveCard 
                                    ? 'bg-slate-900 text-white shadow-xl' 
                                    : 'bg-transparent border border-white/20 text-white hover:bg-white/5'
                              }`}
                          >
                              {isProcessing ? (
                                 <>
                                   <Loader2 className="w-4 h-4 animate-spin" />
                                   Processing...
                                 </>
                              ) : (
                                 <>
                                   <Camera className="w-4 h-4" />
                                   Capture Photo
                                 </>
                              )}
                          </button>
                      )}

                      {/* Error / Warning Messages */}
                      {req.status === 'Rejected' && (
                          <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-xl flex flex-col gap-2">
                              <div className="flex gap-2 items-center text-red-400 text-xs font-bold">
                                <AlertCircle className="w-4 h-4" /> Mismatch Detected
                              </div>
                              <button onClick={() => triggerUpload(req.id)} className="w-full py-2 bg-red-500 text-white text-[10px] font-bold uppercase rounded-lg">Retake</button>
                          </div>
                      )}
                  </div>
                );
              })}
          </div>
       </div>

       {/* Completion Area */}
       {progress === 100 && (
         <div className="p-12 glass-card rounded-[3rem] text-center space-y-6 animate-in slide-in-from-bottom-4">
            <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto text-green-400 shadow-[0_0_40px_rgba(34,197,94,0.3)]">
                <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="text-3xl font-heading font-bold text-white">Inspection Complete</h3>
            <p className="text-slate-400 max-w-md mx-auto">
                All {vehicles.length} vehicles have been successfully verified. 
            </p>
            <button 
                onClick={generateReport}
                disabled={isLoading}
                className="bg-white text-slate-950 px-12 py-5 rounded-2xl font-bold text-lg shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3 mx-auto"
            >
                {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Download className="w-6 h-6" />}
                Generate & Submit Report
            </button>
         </div>
       )}

       <input type="file" ref={fileInputRef} accept="image/*" capture="environment" className="hidden" onChange={handlePhotoUpload} />
    </div>
  );
};

export default AIVehicleInspection;
