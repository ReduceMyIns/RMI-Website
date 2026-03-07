
import React, { useState, useRef } from 'react';
import SEOHead from './SEOHead';
import { 
  Camera, Search, Home, CheckCircle2, AlertTriangle, X, Upload, 
  ChevronRight, Loader2, ClipboardCheck, ArrowLeft, Scan, Video, FileText, Download, PlayCircle, Save, Edit3, MapPin, AlertCircle
} from 'lucide-react';
import { researchProperty, analyzeInspectionPhoto } from '../services/geminiService';
import { dbService } from '../services/dbService';
import { UnderwritingData, PhotoRequirement, AIAnalysisResult } from '../types';
import LiveInspection from './LiveInspection';
import { auth } from '../services/firebase';

const US_STATES = [
  'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
  'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
  'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
  'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
  'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'
];

interface UserInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  addressLine1: string;
  unit: string;
  city: string;
  state: string;
  zip: string;
}

const AIHomeInspection: React.FC = () => {
  const [mode, setMode] = useState<'INTAKE' | 'REVIEW' | 'INSPECTION' | 'LIVE' | 'REPORT'>('INTAKE');
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  // Intake Form State
  const [userInfo, setUserInfo] = useState<UserInfo>({
    firstName: '', lastName: '', email: '', phone: '',
    addressLine1: '', unit: '', city: '', state: 'TN', zip: ''
  });

  const [data, setData] = useState<Partial<UnderwritingData>>({});
  const [requirements, setRequirements] = useState<PhotoRequirement[]>([]);
  const [activeReqId, setActiveReqId] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fullAddress = `${userInfo.addressLine1} ${userInfo.unit} ${userInfo.city}, ${userInfo.state} ${userInfo.zip}`;

  const handleIntakeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInfo.addressLine1 || !userInfo.city || !userInfo.zip) return;
    
    setIsLoading(true);
    try {
      const result = await researchProperty(fullAddress);
      
      // Merge AI result with existing data structure defaults to ensure editing works
      setData({
        numberOfBathrooms: 2, // Default fallback
        hasPool: false,
        hasDetachedStructures: false,
        detachedStructureCount: 0,
        ...result
      });
      
      setMode('REVIEW');
    } catch (err) {
      console.error(err);
      alert("Research failed. Please verify details manually.");
      setMode('REVIEW');
    } finally {
      setIsLoading(false);
    }
  };

  const generateSmartRequirements = () => {
    const reqs: Partial<PhotoRequirement>[] = [];
    const clientId = auth.currentUser?.uid || 'guest';

    // 1. Identity & Location
    reqs.push({ group: 'Verification', category: 'House Number / Mailbox', description: 'Clear photo verifying address identity.' });

    // 2. Exterior - Flow: Front -> Rear -> Roof -> Structures
    reqs.push({ group: 'Exterior', category: 'Front Elevation', description: 'Full view of the home from the street.' });
    reqs.push({ group: 'Exterior', category: 'Roof Condition', description: 'Close-up of shingles/tiles to show wear.' });
    reqs.push({ group: 'Exterior', category: 'Rear Elevation', description: 'Full view of the back yard and home.' });

    // Detached Structures Logic
    if (data.hasDetachedStructures) {
       const count = data.detachedStructureCount || 1;
       for (let i = 1; i <= count; i++) {
          const suffix = count > 1 ? ` #${i}` : '';
          reqs.push({ group: 'Exterior', category: `Detached Structure${suffix} - Front`, description: `Front view of outbuilding/garage${suffix}.` });
          reqs.push({ group: 'Exterior', category: `Detached Structure${suffix} - Rear`, description: `Rear view of outbuilding/garage${suffix}.` });
          reqs.push({ group: 'Exterior', category: `Detached Structure${suffix} - Roof`, description: `Roof condition of outbuilding${suffix}.` });
       }
    }

    // Pool Logic
    if (data.hasPool) {
       reqs.push({ group: 'Exterior', category: 'Swimming Pool', description: 'Wide shot showing pool and any fencing.' });
       reqs.push({ group: 'Exterior', category: 'Pool Equipment', description: 'Photo of pump, heater, and filter system.' });
    }

    // 3. Systems (Garage/Utility)
    reqs.push({ group: 'Systems', category: 'Garage Interior', description: 'Wide shot of garage interior.' });
    reqs.push({ group: 'Systems', category: 'HVAC Unit', description: 'Data plate of heating/cooling unit.' });
    reqs.push({ group: 'Systems', category: 'Water Heater', description: 'Full view showing straps and relief valve.' });

    // 4. Interior - Flow: Kitchen -> Bathrooms
    reqs.push({ group: 'Interior', category: 'Kitchen Sink Plumbing', description: 'Under-sink piping in kitchen.' });

    // Bathroom Logic
    const baths = data.numberOfBathrooms || 1;
    for (let i = 1; i <= baths; i++) {
        reqs.push({ group: 'Interior', category: `Bathroom ${i} - Plumbing`, description: `Under-sink piping for bathroom ${i}.` });
        reqs.push({ group: 'Interior', category: `Bathroom ${i} - Shower/Tub`, description: `Condition of shower/tub surround in bathroom ${i}.` });
    }

    return reqs.map((r, idx) => ({ ...r, id: `req-${idx}`, clientId, status: 'Required' as const } as PhotoRequirement));
  };

  const handleStartInspection = () => {
    const smartReqs = generateSmartRequirements();
    setRequirements(smartReqs);
    setMode('INSPECTION');
  };

  const confirmClutteredPhoto = (reqId: string) => {
    setRequirements(prev => prev.map(r => 
      r.id === reqId ? { ...r, status: 'Verified' } : r
    ));
  };

  const retakePhoto = (reqId: string) => {
    setRequirements(prev => prev.map(r => 
      r.id === reqId ? { ...r, status: 'Required', photoUrl: undefined, aiAnalysis: undefined } : r
    ));
  };

  const processPhoto = async (base64Data: string, req: PhotoRequirement, mimeType: string) => {
    try {
        const analysis = await analyzeInspectionPhoto(
          { data: base64Data, mimeType: mimeType }, 
          req.category, 
          req.description
        );

        if (analysis) {
          // Upload immediately to get the URL
          let photoUrl = '';
          try {
             const dataUri = base64Data.startsWith('data:') ? base64Data : `data:${mimeType};base64,${base64Data}`;
             photoUrl = await dbService.uploadBase64(dataUri, `inspections/${auth.currentUser?.uid || 'guest'}/${req.id}.jpg`);
          } catch (uploadErr) {
             console.error("Failed to upload photo", uploadErr);
             photoUrl = URL.createObjectURL(new Blob([Uint8Array.from(atob(base64Data).split('').map(c => c.charCodeAt(0)))], { type: mimeType }));
          }

          let newStatus: PhotoRequirement['status'] = 'Verified';
          
          if (!analysis.matches) {
             newStatus = 'Rejected';
          } else if (!analysis.presentationCheck.isClean) {
             newStatus = 'Review';
          }

          setRequirements(prev => prev.map(r => 
            r.id === req.id 
              ? { 
                  ...r, 
                  status: newStatus, 
                  aiAnalysis: analysis,
                  photoUrl: photoUrl
                } 
              : r
          ));
        }
    } catch (err) {
        console.error(err);
    }
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !activeReqId) return;

    const req = requirements.find(r => r.id === activeReqId);
    if (!req) return;

    setIsLoading(true);
    const reader = new FileReader();
    reader.onload = async () => {
      const base64 = (reader.result as string).split(',')[1];
      await processPhoto(base64, req, file.type);
      setIsLoading(false);
      setActiveReqId(null);
    };
    reader.readAsDataURL(file);
  };

  const handleLiveCapture = async (reqId: string, photoData: string, analysis: AIAnalysisResult) => {
    let photoUrl = photoData;
    try {
        photoUrl = await dbService.uploadBase64(photoData, `inspections/${auth.currentUser?.uid || 'guest'}/${reqId}_live.jpg`);
    } catch (e) { console.error(e); }

    setRequirements(prev => prev.map(r => 
        r.id === reqId 
          ? { ...r, status: 'Verified', aiAnalysis: analysis, photoUrl: photoUrl } : r
    ));
  };

  const handleSaveReport = async () => {
    setIsSaving(true);
    try {
        const reportData = {
            userInfo,
            underwritingData: data,
            requirements,
            completionScore: Math.round((requirements.filter(r => r.status === 'Verified').length / requirements.length) * 100),
            generatedBy: 'AI-Inspector-v2'
        };
        await dbService.saveInspection(reportData, auth.currentUser?.uid);
        alert("Report securely saved!");
    } catch (e) {
        console.error(e);
        alert("Failed to save report.");
    } finally {
        setIsSaving(false);
    }
  };

  const progress = requirements.length > 0 
    ? Math.round((requirements.filter(r => r.status === 'Verified').length / requirements.length) * 100) 
    : 0;

  if (mode === 'LIVE') {
    return (
      <>
        <SEOHead 
          title="AI Home Inspection Tool | Instant Underwriting Photos"
          description="Use our AI-powered tool to complete your home insurance inspection in minutes. Upload photos and get instant feedback for underwriting."
          canonicalUrl="https://www.reducemyinsurance.net/ai-home-inspection"
          keywords={['ai home inspection', 'underwriting photos', 'insurance inspection', 'home insurance tool']}
        />
        <LiveInspection 
          requirements={requirements} 
          onCapture={handleLiveCapture} 
          onClose={() => setMode('INSPECTION')} 
        />
      </>
    );
  }

  // --- REPORT VIEW ---
  if (mode === 'REPORT') {
      return (
          <>
            <SEOHead 
              title="AI Home Inspection Tool | Instant Underwriting Photos"
              description="Use our AI-powered tool to complete your home insurance inspection in minutes. Upload photos and get instant feedback for underwriting."
              canonicalUrl="https://www.reducemyinsurance.net/ai-home-inspection"
              keywords={['ai home inspection', 'underwriting photos', 'insurance inspection', 'home insurance tool']}
            />
            <div className="max-w-5xl mx-auto px-6 py-12 animate-in fade-in">
              <div className="flex justify-between items-center mb-8">
                  <h2 className="text-3xl font-heading font-bold text-white">Final Report</h2>
                  <button onClick={() => setMode('INSPECTION')} className="text-sm text-slate-400 hover:text-white">Close</button>
              </div>
              
              <div className="glass-card p-10 rounded-[2rem] border-white/10 space-y-8 bg-white text-slate-900">
                  <div className="flex justify-between border-b-2 border-slate-900 pb-6">
                      <div>
                          <h1 className="text-2xl font-bold uppercase tracking-tight">Underwriting Inspection</h1>
                          <div className="text-slate-600 mt-2">{fullAddress}</div>
                          <div className="text-xs font-bold text-slate-500 uppercase mt-1">Applicant: {userInfo.firstName} {userInfo.lastName}</div>
                      </div>
                      <div className="text-right">
                          <div className="text-4xl font-bold text-green-600">{progress}%</div>
                          <div className="text-xs font-bold uppercase text-slate-400">Score</div>
                      </div>
                  </div>

                  <div className="grid grid-cols-1 gap-8">
                      {requirements.filter(r => r.status === 'Verified').map(req => (
                          <div key={req.id} className="flex gap-6 border-b border-slate-200 pb-6">
                              <div className="w-48 h-32 flex-shrink-0 bg-slate-100 rounded-xl overflow-hidden border border-slate-300">
                                  {req.photoUrl && <img src={req.photoUrl} className="w-full h-full object-cover" alt={req.category} />}
                              </div>
                              <div className="space-y-2 flex-grow">
                                  <div className="flex justify-between">
                                      <h3 className="font-bold text-lg">{req.category}</h3>
                                      <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold uppercase">Verified</span>
                                  </div>
                                  <p className="text-sm text-slate-600">{req.description}</p>
                                  {req.aiAnalysis && (
                                      <div className="bg-slate-50 p-3 rounded-lg text-xs text-slate-700 border border-slate-200 mt-2">
                                          <strong>AI Analysis:</strong> {req.aiAnalysis.detailedSummary}
                                      </div>
                                  )}
                              </div>
                          </div>
                      ))}
                  </div>

                  <div className="flex justify-center pt-8 gap-4">
                      <button onClick={handleSaveReport} disabled={isSaving} className="bg-slate-900 hover:bg-slate-800 text-white px-8 py-4 rounded-xl font-bold flex items-center gap-2 shadow-lg disabled:opacity-50">
                          {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />} Save
                      </button>
                  </div>
              </div>
          </div>
          </>
      );
  }

  // --- INTAKE FORM (STEP 1) ---
  if (mode === 'INTAKE') {
    return (
      <>
        <SEOHead 
          title="AI Home Inspection Tool | Instant Underwriting Photos"
          description="Use our AI-powered tool to complete your home insurance inspection in minutes. Upload photos and get instant feedback for underwriting."
          canonicalUrl="https://www.reducemyinsurance.net/ai-home-inspection"
          keywords={['ai home inspection', 'underwriting photos', 'insurance inspection', 'home insurance tool']}
        />
        <div className="max-w-4xl mx-auto px-6 py-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="glass-card rounded-[3rem] p-10 md:p-16 border-white/10 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 blur-[80px] rounded-full pointer-events-none"></div>
          
          <div className="text-center space-y-6 relative z-10 mb-8">
            <div className="w-20 h-20 bg-emerald-500/10 rounded-3xl flex items-center justify-center mx-auto text-emerald-400 mb-6 border border-emerald-500/20">
              <Scan className="w-10 h-10" />
            </div>
            <h1 className="text-4xl md:text-5xl font-heading font-bold text-white">Inspection Setup</h1>
            <p className="text-slate-400 max-w-lg mx-auto text-lg">
              Provide applicant details to initialize AI property research.
            </p>
          </div>

          <form onSubmit={handleIntakeSubmit} className="space-y-6 max-w-2xl mx-auto relative z-10">
             <div className="grid grid-cols-2 gap-4">
               <input required placeholder="First Name" value={userInfo.firstName} onChange={e => setUserInfo({...userInfo, firstName: e.target.value})} className="bg-white/5 border border-white/10 p-4 rounded-xl text-white outline-none focus:border-emerald-500" />
               <input required placeholder="Last Name" value={userInfo.lastName} onChange={e => setUserInfo({...userInfo, lastName: e.target.value})} className="bg-white/5 border border-white/10 p-4 rounded-xl text-white outline-none focus:border-emerald-500" />
             </div>
             
             <div className="grid grid-cols-2 gap-4">
               <input required type="email" placeholder="Email" value={userInfo.email} onChange={e => setUserInfo({...userInfo, email: e.target.value})} className="bg-white/5 border border-white/10 p-4 rounded-xl text-white outline-none focus:border-emerald-500" />
               <input required type="tel" placeholder="Phone" value={userInfo.phone} onChange={e => setUserInfo({...userInfo, phone: e.target.value})} className="bg-white/5 border border-white/10 p-4 rounded-xl text-white outline-none focus:border-emerald-500" />
             </div>

             <div className="space-y-4 pt-4 border-t border-white/5">
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Property Location</h3>
                <div className="grid grid-cols-3 gap-4">
                   <input required placeholder="Address Line 1" value={userInfo.addressLine1} onChange={e => setUserInfo({...userInfo, addressLine1: e.target.value})} className="col-span-2 bg-white/5 border border-white/10 p-4 rounded-xl text-white outline-none focus:border-emerald-500" />
                   <input placeholder="Unit/Apt" value={userInfo.unit} onChange={e => setUserInfo({...userInfo, unit: e.target.value})} className="bg-white/5 border border-white/10 p-4 rounded-xl text-white outline-none focus:border-emerald-500" />
                </div>
                <div className="grid grid-cols-3 gap-4">
                   <input required placeholder="City" value={userInfo.city} onChange={e => setUserInfo({...userInfo, city: e.target.value})} className="bg-white/5 border border-white/10 p-4 rounded-xl text-white outline-none focus:border-emerald-500" />
                   <select value={userInfo.state} onChange={e => setUserInfo({...userInfo, state: e.target.value})} className="bg-white/5 border border-white/10 p-4 rounded-xl text-white outline-none focus:border-emerald-500 bg-slate-900">
                      {US_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                   </select>
                   <input required placeholder="Zip" value={userInfo.zip} onChange={e => setUserInfo({...userInfo, zip: e.target.value})} className="bg-white/5 border border-white/10 p-4 rounded-xl text-white outline-none focus:border-emerald-500" />
                </div>
             </div>

             <button type="submit" disabled={isLoading} className="w-full py-5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl font-bold text-lg shadow-xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3">
               {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Search className="w-6 h-6" />}
               Start Research
             </button>
          </form>
        </div>
      </div>
      </>
    );
  }

  // --- REVIEW & EDIT (STEP 2) ---
  if (mode === 'REVIEW') {
     return (
        <>
          <SEOHead 
            title="AI Home Inspection Tool | Instant Underwriting Photos"
            description="Use our AI-powered tool to complete your home insurance inspection in minutes. Upload photos and get instant feedback for underwriting."
            canonicalUrl="https://www.reducemyinsurance.net/ai-home-inspection"
            keywords={['ai home inspection', 'underwriting photos', 'insurance inspection', 'home insurance tool']}
          />
          <div className="max-w-4xl mx-auto px-6 py-12 animate-in fade-in">
           <div className="glass-card rounded-[3rem] p-10 border-white/10 space-y-8">
              <div className="flex items-center justify-between">
                 <div>
                    <h2 className="text-3xl font-heading font-bold text-white">Review Data</h2>
                    <p className="text-slate-400 text-sm">Verify AI findings to generate the correct photo list.</p>
                 </div>
                 <div className="p-3 bg-emerald-500/10 rounded-full text-emerald-400"><Edit3 className="w-6 h-6"/></div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white/5 p-6 rounded-3xl border border-white/5">
                 <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Year Built</label>
                    <input type="number" value={data.yearBuilt || ''} onChange={e => setData({...data, yearBuilt: parseInt(e.target.value)})} className="w-full bg-slate-900 border border-white/10 p-3 rounded-xl text-white outline-none focus:border-emerald-500" />
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Est. Replacement Cost</label>
                    <input type="number" value={data.replacementCost || ''} onChange={e => setData({...data, replacementCost: parseFloat(e.target.value)})} className="w-full bg-slate-900 border border-white/10 p-3 rounded-xl text-white outline-none focus:border-emerald-500" />
                 </div>
                 
                 {/* Logic Drivers */}
                 <div className="space-y-2">
                    <label className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">Number of Bathrooms</label>
                    <input type="number" min="1" value={data.numberOfBathrooms || 1} onChange={e => setData({...data, numberOfBathrooms: parseInt(e.target.value)})} className="w-full bg-slate-900 border border-white/10 p-3 rounded-xl text-white outline-none focus:border-emerald-500" />
                    <p className="text-[9px] text-slate-500">Determines bathroom photo count.</p>
                 </div>

                 <div className="space-y-2">
                    <label className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">Detached Structures</label>
                    <div className="flex gap-4 items-center h-12">
                       <label className="flex items-center gap-2 cursor-pointer text-white">
                          <input type="checkbox" checked={data.hasDetachedStructures || false} onChange={e => setData({...data, hasDetachedStructures: e.target.checked})} className="w-4 h-4 rounded border-slate-600 bg-slate-900 text-emerald-500" />
                          Yes/No
                       </label>
                       {data.hasDetachedStructures && (
                          <input type="number" min="1" placeholder="Count" value={data.detachedStructureCount || 1} onChange={e => setData({...data, detachedStructureCount: parseInt(e.target.value)})} className="w-20 bg-slate-900 border border-white/10 p-2 rounded-xl text-white outline-none" />
                       )}
                    </div>
                 </div>

                 <div className="space-y-2">
                    <label className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">Swimming Pool</label>
                    <label className="flex items-center gap-2 cursor-pointer text-white h-12 bg-slate-900 border border-white/10 px-4 rounded-xl">
                       <input type="checkbox" checked={data.hasPool || false} onChange={e => setData({...data, hasPool: e.target.checked})} className="w-4 h-4 rounded border-slate-600 bg-slate-900 text-emerald-500" />
                       Property has a pool
                    </label>
                 </div>
              </div>

              <div className="flex gap-4">
                 <button onClick={() => setMode('INTAKE')} className="px-6 py-4 rounded-2xl font-bold text-slate-400 hover:text-white transition-all">Back</button>
                 <button onClick={handleStartInspection} className="flex-grow py-5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl font-bold text-lg shadow-xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3">
                    Confirm & Start Inspection <ChevronRight className="w-5 h-5" />
                 </button>
              </div>
           </div>
        </div>
        </>
     );
  }

  // --- INSPECTION (STEP 3) ---
  return (
    <>
      <SEOHead 
        title="AI Home Inspection Tool | Instant Underwriting Photos"
        description="Use our AI-powered tool to complete your home insurance inspection in minutes. Upload photos and get instant feedback for underwriting."
        canonicalUrl="https://www.reducemyinsurance.net/ai-home-inspection"
        keywords={['ai home inspection', 'underwriting photos', 'insurance inspection', 'home insurance tool']}
      />
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 space-y-8 animate-in fade-in">
      <div className="flex flex-col md:flex-row gap-6 items-start justify-between">
        <div className="space-y-1">
          <button onClick={() => setMode('REVIEW')} className="text-xs font-bold text-slate-500 hover:text-white uppercase tracking-widest flex items-center gap-2 mb-2">
            <ArrowLeft className="w-3 h-3" /> Edit Data
          </button>
          <h2 className="text-3xl font-heading font-bold text-white">{fullAddress}</h2>
          <div className="flex gap-4 text-xs font-bold uppercase tracking-wider text-emerald-400">
            <span>Baths: {data.numberOfBathrooms}</span>
            <span>•</span>
            <span>Pool: {data.hasPool ? 'Yes' : 'No'}</span>
            <span>•</span>
            <span>Structures: {data.hasDetachedStructures ? data.detachedStructureCount : 0}</span>
          </div>
        </div>
        <div className="w-full md:w-64 space-y-2">
          <div className="flex justify-between text-xs font-bold text-white uppercase tracking-widest">
            <span>Progress</span>
            <span>{progress}%</span>
          </div>
          <div className="h-2 bg-white/10 rounded-full overflow-hidden">
            <div className="h-full bg-emerald-500 transition-all duration-1000" style={{ width: `${progress}%` }}></div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          
          <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-[2rem] p-8 text-white relative overflow-hidden shadow-2xl">
             <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 blur-[60px] rounded-full"></div>
             <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                <div>
                   <h3 className="text-2xl font-bold mb-2 font-heading">Start Live Video Session</h3>
                   <p className="text-emerald-100 text-sm max-w-sm">
                      Walk through the property with our conversational AI.
                   </p>
                </div>
                <div className="flex gap-2">
                    <button 
                    onClick={() => setMode('LIVE')}
                    className="bg-white text-emerald-700 px-8 py-4 rounded-xl font-bold shadow-lg hover:scale-105 active:scale-95 transition-all flex items-center gap-3"
                    >
                        <Video className="w-5 h-5" /> Launch Active Vision
                    </button>
                    {progress === 100 && (
                        <button 
                        onClick={() => setMode('REPORT')}
                        className="bg-black/20 text-white border border-white/20 px-6 py-4 rounded-xl font-bold hover:bg-black/30 transition-all flex items-center gap-2"
                        >
                            <FileText className="w-5 h-5" /> Report
                        </button>
                    )}
                </div>
             </div>
          </div>

          {['Verification', 'Exterior', 'Systems', 'Interior'].map(group => {
            const groupReqs = requirements.filter(r => r.group === group);
            if (groupReqs.length === 0) return null;

            return (
              <div key={group} className="space-y-4">
                <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest px-2">{group}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {groupReqs.map(req => (
                    <div 
                      key={req.id} 
                      className={`p-4 rounded-2xl border transition-all ${
                        req.status === 'Verified' ? 'bg-emerald-500/10 border-emerald-500/20' : 
                        req.status === 'Rejected' ? 'bg-red-500/10 border-red-500/20' :
                        req.status === 'Review' ? 'bg-yellow-500/5 border-yellow-500/10' :
                        'bg-white/5 border-white/5 hover:bg-white/10'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div className="font-bold text-white">{req.category}</div>
                        {req.status === 'Verified' && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
                        {req.status === 'Rejected' && <AlertTriangle className="w-5 h-5 text-red-400" />}
                        {req.status === 'Review' && <AlertCircle className="w-5 h-5 text-yellow-400" />}
                        {req.status === 'Required' && <div className="w-5 h-5 rounded-full border-2 border-slate-600"></div>}
                      </div>
                      
                      <p className="text-xs text-slate-400 mb-4 h-8">{req.description}</p>
                      
                      {(req.status === 'Verified' || req.status === 'Review' || req.status === 'Rejected') && req.photoUrl && (
                        <div className="w-full h-32 rounded-xl overflow-hidden mb-3 relative group">
                           <img src={req.photoUrl} className={`w-full h-full object-cover ${req.status === 'Rejected' ? 'grayscale opacity-50' : ''}`} alt="Inspection" />
                           {req.status === 'Verified' && (
                             <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <span className="text-xs font-bold text-white">AI Verified</span>
                             </div>
                           )}
                        </div>
                      )}

                      {/* CLUTTER WARNING / REVIEW STATE */}
                      {req.status === 'Review' && (
                        <div className="mt-3 bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4 space-y-3">
                           <div className="flex items-start gap-3">
                              <AlertTriangle className="w-5 h-5 text-yellow-400 flex-shrink-0" />
                              <div className="space-y-1">
                                 <div className="font-bold text-yellow-400 text-sm">Clutter Detected</div>
                                 <p className="text-xs text-yellow-200/80 leading-relaxed">
                                    The AI identified items that might block the view: 
                                    <span className="text-white"> {req.aiAnalysis?.presentationCheck.clutterDetected.join(', ')}</span>.
                                    We recommend clearing the area.
                                 </p>
                              </div>
                           </div>
                           <div className="flex gap-2 pt-1">
                              <button 
                                onClick={() => retakePhoto(req.id)}
                                className="flex-1 py-2 bg-black/20 hover:bg-black/40 text-yellow-200 text-xs font-bold rounded-lg transition-colors uppercase tracking-wider"
                              >
                                Retake
                              </button>
                              <button 
                                onClick={() => confirmClutteredPhoto(req.id)}
                                className="flex-1 py-2 bg-yellow-500 hover:bg-yellow-400 text-black text-xs font-bold rounded-lg transition-colors uppercase tracking-wider"
                              >
                                Use Anyway
                              </button>
                           </div>
                        </div>
                      )}

                      {/* REJECTED STATE */}
                      {req.status === 'Rejected' && (
                        <div className="mt-3 bg-red-500/10 border border-red-500/20 rounded-xl p-3">
                           <div className="flex items-start gap-2 mb-2">
                              <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                              <div>
                                 <div className="font-bold text-red-400 text-xs uppercase tracking-wider">Mismatch</div>
                                 <p className="text-[10px] text-red-300 leading-relaxed">
                                    We requested <strong>{req.category}</strong> but analysis suggests this is something else.
                                 </p>
                              </div>
                           </div>
                           <button 
                              onClick={() => { setActiveReqId(req.id); fileInputRef.current?.click(); }}
                              className="w-full py-2 bg-red-500 hover:bg-red-400 text-white rounded-lg text-xs font-bold uppercase tracking-wider transition-colors"
                           >
                              Retake Photo
                           </button>
                        </div>
                      )}

                      {/* DEFAULT CAPTURE BUTTON */}
                      {req.status === 'Required' && (
                        <button 
                          onClick={() => { setActiveReqId(req.id); fileInputRef.current?.click(); }}
                          disabled={isLoading}
                          className="w-full py-3 bg-white/5 hover:bg-white/10 rounded-xl text-xs font-bold text-white uppercase tracking-wider flex items-center justify-center gap-2 transition-all border border-white/10"
                        >
                          {isLoading && activeReqId === req.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Camera className="w-4 h-4" />}
                          Capture Manual
                        </button>
                      )}

                      {/* SUCCESS MESSAGE */}
                      {req.status === 'Verified' && req.aiAnalysis && (
                        <div className="mt-3 p-3 rounded-xl text-[10px] leading-relaxed bg-emerald-500/10 text-emerald-300">
                           <strong>AI Feedback:</strong> {req.aiAnalysis.detailedSummary}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        <div className="space-y-6">
           <div className="glass-card p-6 rounded-3xl border-white/5 space-y-6 sticky top-24">
              <div className="flex items-center gap-3 text-emerald-400 font-bold uppercase tracking-widest text-xs">
                 <Home className="w-4 h-4" /> Validated Data
              </div>
              
              <div className="space-y-4 text-sm">
                 <div className="flex justify-between border-b border-white/5 pb-2">
                    <span className="text-slate-500">Foundation</span>
                    <span className="text-white font-medium">{data?.foundationType || 'Unknown'}</span>
                 </div>
                 <div className="flex justify-between border-b border-white/5 pb-2">
                    <span className="text-slate-500">Exterior</span>
                    <span className="text-white font-medium">{data?.exteriorMaterials || 'Unknown'}</span>
                 </div>
                 <div className="flex justify-between border-b border-white/5 pb-2">
                    <span className="text-slate-500">Fire Class</span>
                    <span className="text-white font-medium">{data?.fireProtectionClass || 'Unrated'}</span>
                 </div>
              </div>
           </div>
        </div>
      </div>

      <input type="file" ref={fileInputRef} accept="image/*" capture="environment" className="hidden" onChange={handlePhotoUpload} />
    </div>
    </>
  );
};

export default AIHomeInspection;
