
import React, { useState, useRef } from 'react';
import { dbService } from '../services/dbService';
import { auth } from '../services/firebase'; 
import { signOut, signInAnonymously } from "firebase/auth";
import { 
  Shield, Users, FileText, Camera, Lock, Loader2, RefreshCw, 
  ChevronDown, Database, BookOpen, Download, AlertTriangle, Car, FileJson, Upload, Briefcase, LogOut,
  Phone, Mail, MapPin, CheckCircle2
} from 'lucide-react';
import { Link } from 'react-router-dom';

type AdminTab = 'LEADS' | 'INSPECTIONS' | 'USERS';

const AdminDashboard: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  
  const [activeTab, setActiveTab] = useState<AdminTab>('LEADS');
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<any[]>([]);
  const [selectedItem, setSelectedItem] = useState<any | null>(null);
  const [showRawJson, setShowRawJson] = useState(false);

  // Status/Proposal Update State
  const [isUpdating, setIsUpdating] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (pin === 'admin123') {
      setIsLoading(true);
      setError('');
      try {
          // If not authenticated, we might not be able to read from Firestore depending on rules.
          // We will try to fetch data anyway. If it fails, the catch block in fetchData will handle it.
          setIsAuthenticated(true);
          await fetchData('LEADS');
      } catch (err: any) {
          console.error("Admin Auth Error", err);
          setError(`Access Denied: ${err.message || "Connection Error"}`);
      } finally {
          setIsLoading(false);
      }
    } else {
      setError('Invalid Access PIN');
    }
  };

  const handleSignOut = async () => {
      await signOut(auth);
      setIsAuthenticated(false);
      setPin('');
      setData([]);
  };

  const fetchData = async (tab: AdminTab) => {
    setIsLoading(true);
    setActiveTab(tab);
    setSelectedItem(null);
    try {
      let result: any[] = [];
      if (tab === 'LEADS') {
        result = await dbService.getAllLeads();
      } else if (tab === 'INSPECTIONS') {
        result = await dbService.getAllInspections();
      } else if (tab === 'USERS') {
        result = await dbService.getAllUsers();
      }
      setData(result);
    } catch (e: any) {
      console.error(e);
      setError('Failed to fetch data. Database rules may require authentication.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusUpdate = async (newStatus: string) => {
    if (!selectedItem) return;
    setIsUpdating(true);
    try {
        await dbService.updateLead(selectedItem.id, { status: newStatus });
        
        // Update local state to reflect change immediately
        const updatedItem = { ...selectedItem, status: newStatus };
        setSelectedItem(updatedItem);
        setData(prev => prev.map(item => item.id === selectedItem.id ? updatedItem : item));
    } catch (e) {
        console.error(e);
        alert("Failed to update status");
    } finally {
        setIsUpdating(false);
    }
  };

  const handleProposalUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !selectedItem) return;
    
    setIsUpdating(true);
    try {
        const reader = new FileReader();
        reader.onload = async () => {
            const base64 = (reader.result as string);
            const path = `proposals/${selectedItem.id}/${file.name}`;
            const url = await dbService.uploadBase64(base64, path);
            
            const updates = { 
                proposalUrl: url,
                proposalName: file.name,
                status: 'Quoted' // Auto-move to Quoted status
            };

            await dbService.updateLead(selectedItem.id, updates);
            
            const updatedItem = { ...selectedItem, ...updates };
            setSelectedItem(updatedItem);
            setData(prev => prev.map(item => item.id === selectedItem.id ? updatedItem : item));
            
            alert("Proposal attached successfully!");
        };
        reader.readAsDataURL(file);
    } catch (e) {
        console.error(e);
        alert("Upload failed");
    } finally {
        setIsUpdating(false);
        if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  // ... (Render Helpers like renderVehicles, renderDrivers remain unchanged) ...
  const renderVehicles = (vehicles: any[]) => {
    if (!vehicles || vehicles.length === 0) return <div className="text-slate-500 text-sm">No vehicles listed.</div>;
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {vehicles.map((v: any, i: number) => (
          <div key={i} className="p-4 bg-white/5 rounded-xl border border-white/10 space-y-2">
            <div className="font-bold text-white flex items-center gap-2">
              <Car className="w-4 h-4 text-blue-400" />
              {v.year} {v.make} {v.model}
            </div>
            <div className="text-xs text-slate-400 font-mono">VIN: {v.vin || 'N/A'}</div>
            {v.recalls && v.recalls.length > 0 && (
              <div className="mt-2 bg-red-500/10 p-2 rounded text-red-300 text-xs border border-red-500/20">
                <div className="font-bold flex items-center gap-1 mb-1"><AlertTriangle className="w-3 h-3"/> {v.recalls.length} NHTSA Recalls</div>
                <ul className="list-disc pl-4 space-y-1">
                  {v.recalls.slice(0, 3).map((r: any, idx: number) => (
                    <li key={idx} className="truncate">{r.Component}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  const renderDrivers = (drivers: any[]) => {
    if (!drivers || drivers.length === 0) return <div className="text-slate-500 text-sm">No drivers listed.</div>;
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {drivers.map((d: any, i: number) => (
          <div key={i} className="p-4 bg-white/5 rounded-xl border border-white/10 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-white font-bold">
              {d.firstName?.[0] || 'U'}
            </div>
            <div>
              <div className="font-bold text-white">{d.firstName} {d.lastName}</div>
              <div className="text-xs text-slate-400">{d.relationship} • {d.status}</div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderFenrisData = (fenris: any) => {
    if (!fenris) return null;
    return (
      <div className="bg-emerald-900/10 border border-emerald-500/20 rounded-xl p-6 space-y-4">
        <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-widest flex items-center gap-2">
          <Database className="w-4 h-4" /> Fenris Intelligence
        </h4>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-slate-500 block text-xs">Prefill Score</span>
            <span className="text-white font-mono">{fenris.confidenceScore || 'N/A'}</span>
          </div>
          <div>
            <span className="text-slate-500 block text-xs">Household Members</span>
            <span className="text-white font-mono">{fenris.residents?.length || 0}</span>
          </div>
          <div>
            <span className="text-slate-500 block text-xs">Vehicles Found</span>
            <span className="text-white font-mono">{fenris.vehicles?.length || 0}</span>
          </div>
          <div>
            <span className="text-slate-500 block text-xs">Property Owner</span>
            <span className="text-white font-mono">{fenris.homeOwnerStatus || 'Unknown'}</span>
          </div>
        </div>
      </div>
    );
  };

  const renderToolInteraction = (item: any) => {
    return (
      <div className="space-y-6">
        <div className="bg-purple-500/10 border border-purple-500/20 rounded-xl p-6">
          <div className="flex justify-between items-start mb-4">
             <h3 className="text-lg font-bold text-purple-400">{item.type}</h3>
             {item.outputData?.pdfUrl && (
                 <a href={item.outputData.pdfUrl} target="_blank" rel="noopener noreferrer" className="bg-purple-600 hover:bg-purple-500 text-white px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-colors shadow-lg">
                     <Download className="w-4 h-4" /> Download PDF
                 </a>
             )}
          </div>
          <div className="space-y-4">
            <div>
              <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">User Input</div>
              <div className="p-4 bg-black/30 rounded-lg text-sm text-slate-300 font-mono whitespace-pre-wrap">
                {typeof item.inputData === 'object' ? JSON.stringify(item.inputData, null, 2) : item.inputData}
              </div>
            </div>
            <div>
              <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">AI Output</div>
              <div className="p-4 bg-black/30 rounded-lg text-sm text-white font-mono whitespace-pre-wrap">
                {typeof item.outputData === 'object' ? JSON.stringify(item.outputData, null, 2) : item.outputData}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-4">
        <div className="glass-card p-8 rounded-3xl border border-white/10 w-full max-w-md text-center space-y-6">
          <div className="w-16 h-16 bg-red-500/10 rounded-2xl flex items-center justify-center mx-auto">
            <Lock className="w-8 h-8 text-red-500" />
          </div>
          <h2 className="text-2xl font-heading font-bold text-white">Restricted Access</h2>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <p className="text-slate-400 text-sm">Enter Agency Administrator PIN.</p>
            <input 
                type="password" 
                placeholder="Enter PIN (admin123)" 
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-center text-white outline-none focus:border-red-500 tracking-widest text-lg"
            />
            {error && <div className="text-red-400 text-xs font-bold">{error}</div>}
            <button disabled={isLoading} className="w-full bg-red-600 hover:bg-red-500 text-white font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50">
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Unlock Database'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 space-y-8 animate-in fade-in">
      <div className="flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-red-500/10 rounded-xl border border-red-500/20">
            <Database className="w-6 h-6 text-red-500" />
          </div>
          <div>
            <h1 className="text-3xl font-heading font-bold text-white">Admin Console</h1>
            <p className="text-slate-400 text-sm">Live Firestore Data View</p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2 bg-white/5 p-1 rounded-xl border border-white/10">
          <button 
            onClick={() => fetchData('LEADS')}
            className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 ${activeTab === 'LEADS' ? 'bg-red-600 text-white' : 'text-slate-400 hover:text-white'}`}
          >
            <FileText className="w-4 h-4" /> Quotes/Tools
          </button>
          <button 
            onClick={() => fetchData('INSPECTIONS')}
            className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 ${activeTab === 'INSPECTIONS' ? 'bg-red-600 text-white' : 'text-slate-400 hover:text-white'}`}
          >
            <Camera className="w-4 h-4" /> Inspections
          </button>
          <button 
            onClick={() => fetchData('USERS')}
            className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 ${activeTab === 'USERS' ? 'bg-red-600 text-white' : 'text-slate-400 hover:text-white'}`}
          >
            <Users className="w-4 h-4" /> Users
          </button>
          <div className="w-px h-6 bg-white/10 mx-1"></div>
          <Link 
            to="/agent/academy"
            className="px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 text-slate-400 hover:text-blue-400 hover:bg-white/5"
          >
            <BookOpen className="w-4 h-4" /> Academy
          </Link>
          <button 
            onClick={handleSignOut}
            className="px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 text-slate-400 hover:text-red-400 hover:bg-white/5 ml-1"
            title="Log Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* List View */}
        <div className="lg:col-span-1 glass-card border border-white/5 rounded-3xl overflow-hidden h-[80vh] flex flex-col">
          <div className="p-4 border-b border-white/10 flex justify-between items-center bg-white/[0.02]">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">{data.length} Records</span>
            <button onClick={() => fetchData(activeTab)} disabled={isLoading} className="p-2 hover:bg-white/10 rounded-full text-slate-400 hover:text-white">
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
          </div>
          <div className="flex-grow overflow-y-auto p-2 space-y-2 custom-scrollbar">
            {data.map((item) => (
              <button
                key={item.id}
                onClick={() => setSelectedItem(item)}
                className={`w-full text-left p-4 rounded-xl transition-all border ${
                  selectedItem?.id === item.id 
                  ? 'bg-red-500/10 border-red-500/30' 
                  : 'bg-white/5 border-transparent hover:bg-white/10'
                }`}
              >
                <div className="flex justify-between mb-1">
                  <span className="font-bold text-white text-sm truncate">
                    {activeTab === 'LEADS' 
                        ? (item.type?.startsWith('AI Tool') 
                            ? `AI Tool: ${item.type.replace('AI Tool', '').replace('-', '').trim()}` 
                            : `${item.firstName} ${item.lastName || item.commercialName}`)
                        : activeTab === 'INSPECTIONS' 
                            ? (item.type === 'Vehicle' ? `${item.owner?.firstName} ${item.owner?.lastName} - Vehicle` : item.userInfo?.addressLine1)
                            : `${item.firstName} ${item.lastName}`
                    }
                  </span>
                  <span className="text-[10px] text-slate-500">
                    {new Date(item.createdAt || item.updatedAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-slate-400 truncate w-32">
                    {item.email || item.owner?.email || item.userInfo?.email || 'No Email'}
                  </span>
                  {activeTab === 'LEADS' && item.status && (
                      <span className={`text-[10px] px-2 py-0.5 rounded ${item.status === 'Quoted' ? 'bg-green-500/20 text-green-400' : 'bg-slate-700 text-slate-300'}`}>
                          {item.status}
                      </span>
                  )}
                  <ChevronDown className={`w-4 h-4 text-slate-600 transition-transform ${selectedItem?.id === item.id ? '-rotate-90 text-red-400' : ''}`} />
                </div>
              </button>
            ))}
            {data.length === 0 && !isLoading && (
              <div className="text-center py-12 text-slate-500 text-sm">No records found.</div>
            )}
          </div>
        </div>

        {/* Detail View */}
        <div className="lg:col-span-2 glass-card border border-white/5 rounded-3xl overflow-hidden h-[80vh] flex flex-col relative">
          {selectedItem ? (
            <div className="flex-grow overflow-y-auto p-8 custom-scrollbar space-y-8">
              {/* Header */}
              <div className="flex justify-between items-start border-b border-white/10 pb-6">
                <div>
                  <div className="text-[10px] font-bold text-red-400 uppercase tracking-widest mb-2">Record ID: {selectedItem.id}</div>
                  <h2 className="text-3xl font-heading font-bold text-white">
                    {activeTab === 'LEADS' 
                        ? (selectedItem.firstName ? `${selectedItem.firstName} ${selectedItem.lastName}` : (selectedItem.type.startsWith('AI Tool') ? selectedItem.type : 'Anonymous User'))
                        : activeTab === 'INSPECTIONS' 
                            ? (selectedItem.type === 'Vehicle' ? 'Vehicle Inspection' : 'Property Inspection')
                            : `${selectedItem.firstName} ${selectedItem.lastName}`}
                  </h2>
                  <div className="text-sm text-slate-400 mt-1">{selectedItem.email || selectedItem.owner?.email}</div>
                </div>
                <div className="flex gap-3 items-center">
                    {activeTab === 'INSPECTIONS' && selectedItem.pdfUrl && (
                        <a href={selectedItem.pdfUrl} target="_blank" rel="noopener noreferrer" className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-colors">
                            <Download className="w-4 h-4" /> Report
                        </a>
                    )}
                    <div className="bg-white/5 px-4 py-2 rounded-lg text-xs font-mono text-slate-300 border border-white/10">
                        {new Date(selectedItem.createdAt || selectedItem.updatedAt).toLocaleString()}
                    </div>
                </div>
              </div>

              {/* Body Content */}
              {selectedItem.type?.startsWith('AI Tool') ? (
                  renderToolInteraction(selectedItem)
              ) : activeTab === 'LEADS' ? (
                <>
                  {/* AGENT CONTROLS */}
                  <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 mb-6">
                        <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-4 flex items-center gap-2">
                            <Briefcase className="w-4 h-4 text-blue-400" /> Agent Actions
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="text-xs text-slate-500 font-bold uppercase mb-2 block">Application Status</label>
                                <div className="flex gap-2">
                                    <select 
                                        value={selectedItem.status || 'New'} 
                                        onChange={(e) => handleStatusUpdate(e.target.value)}
                                        disabled={isUpdating}
                                        className="bg-black/20 border border-white/10 text-white text-sm rounded-lg px-3 py-2 flex-grow outline-none focus:border-blue-500 cursor-pointer"
                                    >
                                        <option value="New">New</option>
                                        <option value="Reviewing">Reviewing</option>
                                        <option value="Quoted">Quoted</option>
                                        <option value="Bound">Bound</option>
                                        <option value="Closed Lost">Closed Lost</option>
                                    </select>
                                    {isUpdating && <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />}
                                </div>
                            </div>
                            <div>
                                <label className="text-xs text-slate-500 font-bold uppercase mb-2 block">Quote Proposal</label>
                                <div className="flex items-center gap-3">
                                    <button 
                                        onClick={() => fileInputRef.current?.click()}
                                        disabled={isUpdating}
                                        className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-4 py-2 rounded-lg transition-colors flex items-center gap-2 shadow-lg active:scale-95"
                                    >
                                        <Upload className="w-3 h-3" /> {selectedItem.proposalUrl ? 'Replace PDF' : 'Attach PDF'}
                                    </button>
                                    {selectedItem.proposalUrl && (
                                        <a 
                                            href={selectedItem.proposalUrl} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="text-blue-400 hover:text-white text-xs underline truncate max-w-[150px]"
                                        >
                                            {selectedItem.proposalName || 'View Proposal'}
                                        </a>
                                    )}
                                    <input type="file" ref={fileInputRef} className="hidden" accept="application/pdf" onChange={handleProposalUpload} />
                                </div>
                            </div>
                        </div>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">Contact Info</div>
                      <div className="text-white flex items-center gap-2"><Phone className="w-3 h-3 text-blue-400"/> {selectedItem.phone}</div>
                      <div className="text-white flex items-center gap-2"><Mail className="w-3 h-3 text-blue-400"/> {selectedItem.email}</div>
                      <div className="text-white flex items-center gap-2"><MapPin className="w-3 h-3 text-blue-400"/> {selectedItem.address}, {selectedItem.city}, {selectedItem.state} {selectedItem.zip}</div>
                    </div>
                    {selectedItem.isReturning && (
                       <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl flex items-center gap-3">
                          <CheckCircle2 className="w-5 h-5 text-blue-400" />
                          <div>
                             <div className="font-bold text-white text-sm">Returning Client</div>
                             <div className="text-[10px] text-blue-200">Data pre-filled from history.</div>
                          </div>
                       </div>
                    )}
                  </div>

                  {renderFenrisData(selectedItem.fenrisData)}

                  <div className="space-y-4">
                    <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest border-b border-white/10 pb-2">Assets & Risks</h3>
                    {renderVehicles(selectedItem.vehicles)}
                    {renderDrivers(selectedItem.residents)}
                  </div>
                </>
              ) : activeTab === 'INSPECTIONS' ? (
                <div className="space-y-8">
                   <div className="flex items-center gap-4 p-4 bg-white/5 rounded-xl border border-white/10">
                      <div className="text-center">
                         <div className="text-3xl font-bold text-white">{selectedItem.completionScore}%</div>
                         <div className="text-[9px] text-slate-500 uppercase tracking-widest">Score</div>
                      </div>
                      <div className="h-10 w-[1px] bg-white/10"></div>
                      <div>
                         <div className="text-sm font-bold text-white">
                            {selectedItem.type === 'Vehicle' ? `${selectedItem.owner?.firstName} ${selectedItem.owner?.lastName}` : `${selectedItem.userInfo?.firstName} ${selectedItem.userInfo?.lastName}`}
                         </div>
                         <div className="text-xs text-slate-400">
                            {selectedItem.type === 'Vehicle' ? selectedItem.owner?.email : selectedItem.userInfo?.email}
                         </div>
                      </div>
                   </div>

                   {/* Vehicle List Section (If Vehicle Type) */}
                   {selectedItem.type === 'Vehicle' && selectedItem.vehicles && (
                       <div className="space-y-2">
                           <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Inspected Vehicles</h3>
                           {selectedItem.vehicles.map((veh: any, idx: number) => (
                               <div key={idx} className="p-3 bg-blue-500/10 rounded-lg text-sm text-blue-200 border border-blue-500/20">
                                   {veh.year} {veh.make} {veh.model} <span className="text-slate-500 text-xs">({veh.vin})</span>
                               </div>
                           ))}
                       </div>
                   )}

                   <div className="space-y-4">
                      <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Photos & Analysis</h3>
                      <div className="grid grid-cols-2 gap-4">
                         {selectedItem.requirements?.filter((r: any) => r.status === 'Verified').map((req: any, i: number) => (
                            <div key={i} className="group relative rounded-xl overflow-hidden border border-white/10 aspect-video bg-slate-900">
                               <img src={req.photoUrl} alt={req.category} className="w-full h-full object-cover" />
                               <div className="absolute inset-0 bg-black/60 flex flex-col justify-end p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <div className="font-bold text-white text-xs">{req.category}</div>
                                  <div className="text-[10px] text-slate-300 truncate">{req.aiAnalysis?.detailedSummary}</div>
                               </div>
                            </div>
                         ))}
                      </div>
                   </div>
                </div>
              ) : (
                 <div className="bg-slate-950 p-6 rounded-2xl border border-white/10 overflow-x-auto">
                    <pre className="text-xs text-blue-400 font-mono">
                      {JSON.stringify(selectedItem, null, 2)}
                    </pre>
                 </div>
              )}

              {/* Raw JSON Toggle */}
              <div className="pt-8 border-t border-white/10">
                <button 
                  onClick={() => setShowRawJson(!showRawJson)}
                  className="text-xs font-bold text-slate-500 hover:text-white uppercase tracking-widest flex items-center gap-2 mb-4 transition-colors"
                >
                  <FileJson className="w-4 h-4" /> {showRawJson ? 'Hide' : 'Show'} Raw JSON Data
                </button>
                {showRawJson && (
                  <div className="bg-slate-950 p-6 rounded-2xl border border-white/10 overflow-x-auto animate-in slide-in-from-top-2">
                    <pre className="text-xs text-green-400 font-mono">
                      {JSON.stringify(selectedItem, null, 2)}
                    </pre>
                  </div>
                )}
              </div>

            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-slate-600 flex-col gap-4">
               <Shield className="w-16 h-16 opacity-20" />
               <p className="text-sm uppercase tracking-widest font-bold opacity-50">Select a record to inspect</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
