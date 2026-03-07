
import React, { useState, useRef, useEffect } from 'react';
import { 
  Upload, Search, FileText, Shield, Zap, Loader2, CheckCircle2, 
  AlertTriangle, ArrowLeft, Brain, FileCheck, LifeBuoy, Camera, Car, AlertOctagon, RotateCcw, User, Mail, Phone, Lock, Award, FileSignature, Briefcase, TrendingUp, DollarSign, Send, MessageSquare
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { jsPDF } from "jspdf";
import { analyzeMedia, getAIResponse, decodeVin, checkVehicleRecalls, fetchRecallMakes, fetchRecallModels, generateBillOfSaleTerms, generateSafetyPlanContent, getBusinessCoachResponse, generateFinalBusinessPlan } from '../services/geminiService';
import { dbService } from '../services/dbService';
import AIHomeInspection from './AIHomeInspection';
import AIVehicleInspection from './AIVehicleInspection';
import SEOHead from './SEOHead';

// Helper for multi-page PDF text
const addTextToPdf = (doc: jsPDF, text: string, x: number, initialY: number, maxWidth: number, lineHeight: number) => {
    const lines = doc.splitTextToSize(text, maxWidth);
    const pageHeight = doc.internal.pageSize.height;
    let cursorY = initialY;

    lines.forEach((line: string) => {
        if (cursorY > pageHeight - 20) { // 20mm bottom margin
            doc.addPage();
            cursorY = 20; // 20mm top margin
        }
        doc.text(line, x, cursorY);
        cursorY += lineHeight;
    });
    return cursorY;
};

const ToolCard: React.FC<{ 
  title: string; 
  desc: string; 
  icon: any; 
  color: string; 
  onClick: () => void 
}> = ({ title, desc, icon: Icon, color, onClick }) => (
  <button 
    onClick={onClick}
    className="group relative p-8 glass-card rounded-[2.5rem] border-white/5 hover:bg-white/10 transition-all text-left flex flex-col gap-6 overflow-hidden h-full"
  >
    <div className={`absolute top-0 right-0 w-32 h-32 opacity-10 blur-[50px] rounded-full transition-all group-hover:opacity-20 ${color}`}></div>
    <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 group-hover:scale-110 transition-transform">
      <Icon className="w-7 h-7 text-white" />
    </div>
    <div>
      <h3 className="text-2xl font-heading font-bold text-white mb-2">{title}</h3>
      <p className="text-slate-400 text-sm leading-relaxed">{desc}</p>
    </div>
    <div className="mt-auto pt-4 flex items-center text-xs font-bold uppercase tracking-widest text-slate-500 group-hover:text-white transition-colors gap-2">
      Launch Tool <ArrowLeft className="w-4 h-4 rotate-180" />
    </div>
  </button>
);

const UserCaptureModal: React.FC<{ onSubmit: (data: any) => void }> = ({ onSubmit }) => {
  const [data, setData] = useState({ firstName: '', lastName: '', email: '', phone: '' });
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (data.firstName && data.lastName && data.email && data.phone) {
      onSubmit(data);
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-950/90 backdrop-blur-md p-4">
      <div className="glass-card w-full max-w-md p-8 rounded-[2rem] border border-white/10 animate-in zoom-in-95">
        <div className="text-center mb-6">
          <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4 text-white">
            <Lock className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-white">Secure Access Required</h3>
          <p className="text-slate-400 text-sm mt-1">Please provide your contact details to access the AI Toolkit.</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <input 
              required
              placeholder="First Name"
              value={data.firstName}
              onChange={e => setData({...data, firstName: e.target.value})}
              className="bg-white/5 border border-white/10 p-3 rounded-xl text-white outline-none focus:border-blue-500"
            />
            <input 
              required
              placeholder="Last Name"
              value={data.lastName}
              onChange={e => setData({...data, lastName: e.target.value})}
              className="bg-white/5 border border-white/10 p-3 rounded-xl text-white outline-none focus:border-blue-500"
            />
          </div>
          <input 
            required
            type="email"
            placeholder="Email Address"
            value={data.email}
            onChange={e => setData({...data, email: e.target.value})}
            className="w-full bg-white/5 border border-white/10 p-3 rounded-xl text-white outline-none focus:border-blue-500"
          />
          <input 
            required
            type="tel"
            placeholder="Phone Number"
            value={data.phone}
            onChange={e => setData({...data, phone: e.target.value})}
            className="w-full bg-white/5 border border-white/10 p-3 rounded-xl text-white outline-none focus:border-blue-500"
          />
          <button type="submit" className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold transition-all shadow-lg mt-2">
            Unlock Tools
          </button>
        </form>
      </div>
    </div>
  );
};

const AIToolsPage: React.FC<{ user?: any }> = ({ user }) => {
  const [activeTool, setActiveTool] = useState<'policy' | 'claim' | 'inspection' | 'vehicle' | 'safety' | 'bill_of_sale' | 'safety_plan' | 'business_plan' | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const navigate = useNavigate();
  
  // User Session for Tool Use
  const [sessionUser, setSessionUser] = useState<any>(user);
  
  // Policy Decoder State
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState('');

  // Claim Drafter State
  const [claimText, setClaimText] = useState('');

  // Safety Checker State
  const [searchMethod, setSearchMethod] = useState<'VIN' | 'MANUAL'>('VIN');
  const [vinInput, setVinInput] = useState('');
  
  // Manual Selector State
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const [selectedMake, setSelectedMake] = useState('');
  const [selectedModel, setSelectedModel] = useState('');
  const [availableMakes, setAvailableMakes] = useState<string[]>([]);
  const [availableModels, setAvailableModels] = useState<string[]>([]);
  const [recallData, setRecallData] = useState<any>(null);

  // Bill of Sale State
  const [bosData, setBosData] = useState({ seller: '', buyer: '', make: '', model: '', year: '', vin: '', price: '', conditions: '' });

  // Safety Plan State
  const [safetyData, setSafetyData] = useState({ businessName: '', industry: '', employees: '', hazards: [] as string[], contactPerson: '' });
  const HAZARD_OPTIONS = ["Heavy Machinery", "Chemical Exposure", "Working at Heights", "Slip/Trip/Fall", "Electrical Hazards", "Vehicle Operations", "Lifting/Ergonomics", "Noise Exposure"];

  // Business Plan Chat State
  const [bpStage, setBpStage] = useState<'INIT' | 'CHAT' | 'GENERATING' | 'DONE'>('INIT');
  const [bpInitData, setBpInitData] = useState({ name: '', industry: '' });
  const [bpInput, setBpInput] = useState('');
  const [bpMessages, setBpMessages] = useState<{role: 'user' | 'model', text: string}[]>([]);
  const bpScrollRef = useRef<HTMLDivElement>(null);

  // Check storage on mount
  useEffect(() => {
    if (user) {
      setSessionUser(user);
    } else {
      const saved = sessionStorage.getItem('rmi_tool_user');
      if (saved) setSessionUser(JSON.parse(saved));
    }
  }, [user]);

  const initiateTool = (tool: any) => {
    setActiveTool(tool);
  };

  // Scroll Chat to Bottom
  useEffect(() => {
    if (bpScrollRef.current) {
        bpScrollRef.current.scrollTop = bpScrollRef.current.scrollHeight;
    }
  }, [bpMessages]);

  // Fetch Makes when Year changes
  useEffect(() => {
    if (activeTool === 'safety' && searchMethod === 'MANUAL') {
        const loadMakes = async () => {
            const makes = await fetchRecallMakes(selectedYear);
            setAvailableMakes(makes);
            setSelectedMake('');
            setSelectedModel('');
            setAvailableModels([]);
        };
        loadMakes();
    }
  }, [selectedYear, activeTool, searchMethod]);

  // Fetch Models when Make changes
  useEffect(() => {
    if (selectedMake && activeTool === 'safety') {
        const loadModels = async () => {
            const models = await fetchRecallModels(selectedYear, selectedMake);
            setAvailableModels(models);
            setSelectedModel('');
        };
        loadModels();
    }
  }, [selectedMake, selectedYear, activeTool]);

  const reset = () => {
    setActiveTool(null);
    setResult(null);
    setFileName('');
    setClaimText('');
    setRecallData(null);
    setVinInput('');
    setIsLoading(false);
    setSelectedMake('');
    setSelectedModel('');
    // Reset BP State
    setBpStage('INIT');
    setBpInitData({ name: '', industry: '' });
    setBpMessages([]);
  };

  // --- BUSINESS PLAN LOGIC ---
  const startBusinessPlanChat = async () => {
    if (!bpInitData.name || !bpInitData.industry) return;
    setBpStage('CHAT');
    setIsLoading(true);
    try {
        const history: any[] = []; // Initial empty history
        const initialQuestion = await getBusinessCoachResponse(history, bpInitData);
        setBpMessages([{ role: 'model', text: initialQuestion }]);
    } catch (e) {
        console.error(e);
        setBpMessages([{ role: 'model', text: "I'm ready to help. Please tell me more about your business revenue goals." }]);
    } finally {
        setIsLoading(false);
    }
  };

  const sendBusinessPlanMessage = async () => {
    if (!bpInput.trim()) return;
    const newMsg = { role: 'user' as const, text: bpInput };
    const updatedHistory = [...bpMessages, newMsg];
    setBpMessages(updatedHistory);
    setBpInput('');
    setIsLoading(true);

    try {
        // Convert to Gemini API format
        const apiHistory = updatedHistory.map(m => ({
            role: m.role,
            parts: [{ text: m.text }]
        }));
        
        const response = await getBusinessCoachResponse(apiHistory, bpInitData);
        setBpMessages(prev => [...prev, { role: 'model', text: response }]);
    } catch (e) {
        console.error(e);
    } finally {
        setIsLoading(false);
    }
  };

  const generateFinalPlan = async () => {
    setBpStage('GENERATING');
    setIsLoading(true);
    try {
        const apiHistory = bpMessages.map(m => ({
            role: m.role,
            parts: [{ text: m.text }]
        }));
        
        const finalText = await generateFinalBusinessPlan(apiHistory, bpInitData);
        
        // Generate PDF
        const doc = new jsPDF();
        doc.setFontSize(24);
        doc.setTextColor(0, 51, 102);
        doc.text(bpInitData.name, 105, 40, { align: 'center' });
        doc.setFontSize(16);
        doc.setTextColor(100);
        doc.text("Strategic Business Plan", 105, 50, { align: 'center' });
        
        doc.setFontSize(12);
        doc.setTextColor(0);
        
        // Paginated Content
        addTextToPdf(doc, finalText || "", 20, 70, 170, 5);
        
        doc.save(`Business_Plan_${bpInitData.name}.pdf`);
        setResult("Plan Generated Successfully! Check your downloads.");
        setBpStage('DONE');
        await dbService.saveToolInteraction(sessionUser, 'Business Plan', { business: bpInitData.name }, { success: true });

    } catch (e) {
        console.error(e);
        alert("Failed to generate plan");
        setBpStage('CHAT'); // Revert on error
    } finally {
        setIsLoading(false);
    }
  };

  const handlePolicyUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setFileName(file.name);
    setIsLoading(true);
    setResult(null);

    const reader = new FileReader();
    reader.onload = async () => {
      const base64 = (reader.result as string).split(',')[1];
      try {
        const prompt = `Analyze this insurance policy document. Output clear markdown. Headers: 1. Overview 2. Coverage 3. Recommendations.`;
        const response = await analyzeMedia(prompt, { data: base64, mimeType: file.type });
        setResult(response);
        await dbService.saveToolInteraction(sessionUser, 'Policy Decoder', { fileName: file.name }, { analysis: response });
      } catch (err) {
        setResult("Error analyzing document.");
      } finally {
        setIsLoading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleClaimDraft = async () => {
    if (!claimText) return;
    setIsLoading(true);
    setResult(null);
    try {
      const prompt = `Act as a public adjuster. Draft a formal claim for: "${claimText}". Include opening, loss description, damages, closing.`;
      const response = await getAIResponse(prompt, []);
      setResult(response.text);
      await dbService.saveToolInteraction(sessionUser, 'Claim Assistant', { input: claimText }, { draft: response.text });
    } catch (err) {
      setResult("Failed to generate claim draft.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSafetyCheck = async () => {
    setIsLoading(true);
    setRecallData(null);
    try {
      let recalls: any[] = [];
      let specs = { year: selectedYear, make: selectedMake, model: selectedModel };

      if (searchMethod === 'VIN') {
        if (vinInput.length < 17) {
            alert("Please enter a full 17-digit VIN");
            setIsLoading(false);
            return;
        }
        // Decode first to get specs for display
        const decoded = await decodeVin(vinInput);
        if (decoded) specs = { year: decoded.year, make: decoded.make, model: decoded.model };
        
        recalls = await checkVehicleRecalls(specs.year, specs.make, specs.model, vinInput);
      } else {
        if (!selectedYear || !selectedMake || !selectedModel) {
            alert("Please select all vehicle details");
            setIsLoading(false);
            return;
        }
        recalls = await checkVehicleRecalls(selectedYear, selectedMake, selectedModel);
      }
      
      setRecallData({ specs, recalls });
      await dbService.saveToolInteraction(sessionUser, 'Recall Checker', { searchMethod, input: searchMethod === 'VIN' ? vinInput : specs }, { resultCount: recalls.length });

    } catch (e) {
      console.error(e);
      alert("Failed to check recalls. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const generateBillOfSalePDF = async () => {
    if (!bosData.seller || !bosData.buyer || !bosData.make || !bosData.price) {
        alert("Please fill in required fields (Seller, Buyer, Vehicle, Price)");
        return;
    }
    
    setIsLoading(true);
    try {
        const terms = await generateBillOfSaleTerms(bosData.conditions);
        
        const doc = new jsPDF();
        doc.setFontSize(22);
        doc.setFont("helvetica", "bold");
        doc.text("Vehicle Bill of Sale", 105, 20, { align: "center" });
        
        doc.setFontSize(12);
        doc.setFont("helvetica", "normal");
        
        let y = 40;
        const addLine = (label: string, val: string) => {
            doc.setFont("helvetica", "bold");
            doc.text(label, 20, y);
            doc.setFont("helvetica", "normal");
            doc.text(val, 60, y);
            y += 10;
        };

        addLine("Date:", new Date().toLocaleDateString());
        addLine("Seller:", bosData.seller);
        addLine("Buyer:", bosData.buyer);
        addLine("Amount:", `$${bosData.price}`);
        
        y += 5;
        doc.setFont("helvetica", "bold");
        doc.text("Vehicle Information", 20, y);
        y += 10;
        
        doc.setFont("helvetica", "normal");
        doc.text(`${bosData.year} ${bosData.make} ${bosData.model}`, 20, y);
        y += 7;
        doc.text(`VIN: ${bosData.vin}`, 20, y);
        
        y += 20;
        doc.setFont("helvetica", "bold");
        doc.text("Terms and Conditions", 20, y);
        y += 7;
        
        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);
        
        const splitTerms = doc.splitTextToSize(terms || "Sold as-is.", 170);
        doc.text(splitTerms, 20, y);
        
        y += splitTerms.length * 5 + 20;
        
        // Signatures
        if (y > 250) {
            doc.addPage();
            y = 40;
        }
        
        doc.line(20, y, 90, y);
        doc.line(110, y, 180, y);
        y += 5;
        doc.text("Seller Signature", 20, y);
        doc.text("Buyer Signature", 110, y);
        
        doc.save("Bill_of_Sale.pdf");
        await dbService.saveToolInteraction(sessionUser, 'Bill of Sale', bosData, { success: true });

    } catch (e) {
        console.error(e);
        alert("Generation failed.");
    } finally {
        setIsLoading(false);
    }
  };

  const generateSafetyPlanPDF = async () => {
    if (!safetyData.businessName || !safetyData.industry) return;
    
    setIsLoading(true);
    try {
        const content = await generateSafetyPlanContent(safetyData.businessName, safetyData.industry, safetyData.hazards);
        
        const doc = new jsPDF();
        doc.setFontSize(20);
        doc.text("Health & Safety Plan", 105, 20, { align: "center" });
        doc.setFontSize(14);
        doc.text(safetyData.businessName, 105, 30, { align: "center" });
        
        doc.setFontSize(10);
        addTextToPdf(doc, content || "", 20, 50, 170, 5);
        
        doc.save(`${safetyData.businessName.replace(/\s/g, '_')}_Safety_Plan.pdf`);
        await dbService.saveToolInteraction(sessionUser, 'Safety Plan', safetyData, { success: true });

    } catch (e) {
        console.error(e);
        alert("Generation failed.");
    } finally {
        setIsLoading(false);
    }
  };

  // --- SUB-COMPONENT ROUTING ---
  if (activeTool === 'inspection') {
    return (
      <div className="max-w-7xl mx-auto px-6 py-8">
        <button onClick={reset} className="flex items-center gap-2 mb-6 text-slate-400 hover:text-white transition-colors"><ArrowLeft className="w-4 h-4" /> Back to Toolkit</button>
        <AIHomeInspection />
      </div>
    );
  }

  if (activeTool === 'vehicle') {
    return (
      <div className="max-w-7xl mx-auto px-6 py-8">
        <button onClick={reset} className="flex items-center gap-2 mb-6 text-slate-400 hover:text-white transition-colors"><ArrowLeft className="w-4 h-4" /> Back to Toolkit</button>
        <AIVehicleInspection />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      <SEOHead 
        title="AI Insurance Tools | Policy Decoder & Risk Analysis"
        description="Access our suite of AI-powered insurance tools. Decode policies, check vehicle recalls, generate bills of sale, and create safety plans instantly."
        canonicalUrl="https://www.reducemyinsurance.net/tools"
        keywords={['AI insurance tools', 'policy decoder', 'recall checker', 'bill of sale generator', 'safety plan generator', 'business plan AI']}
      />
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full glass border-blue-500/20 text-blue-400 text-[10px] font-bold uppercase tracking-widest">
            <Brain className="w-3 h-3" /> Neural Utilities
          </div>
          <h1 className="text-4xl md:text-5xl font-heading font-bold text-white">AI <span className="text-blue-400">Toolkit</span></h1>
          <p className="text-slate-400 max-w-xl">Advanced standalone tools for policy analysis, risk assessment, and claims assistance.</p>
        </div>
        {activeTool && (
          <button onClick={reset} className="flex items-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 rounded-xl text-sm font-bold text-white transition-all border border-white/10">
            <ArrowLeft className="w-4 h-4" /> Back to Tools
          </button>
        )}
      </div>

      {!activeTool ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <ToolCard title="Compliance Manager" desc="Track vendor COIs, set requirements, and manage risk." icon={Shield} color="bg-blue-500" onClick={() => navigate('/compliance')} />
          <ToolCard title="Vehicle Recall Checker" desc="Instant recall check using live NHTSA databases." icon={AlertOctagon} color="bg-red-500" onClick={() => initiateTool('safety')} />
          <ToolCard title="File TN Owner Report" desc="Mandatory filing for accidents involving injury, death, or >$400 gov property damage. Must be filed within 20 days." icon={FileSignature} color="bg-indigo-500" onClick={() => window.open('https://dl.safety.tn.gov/_/#2', '_blank')} />
          <ToolCard title="TN Crash Report Purchase" desc="Access the official Tennessee portal to purchase collision reports." icon={FileText} color="bg-slate-500" onClick={() => window.open('https://apps.tn.gov/purchasetncrash/crashreport.jsp', '_blank')} />
          <ToolCard title="Bill of Sale Generator" desc="Create a legal vehicle bill of sale instantly with AI terms." icon={FileSignature} color="bg-emerald-500" onClick={() => initiateTool('bill_of_sale')} />
          <ToolCard title="Safety Plan Generator" desc="Custom OSHA-compliant safety manuals for your business." icon={Shield} color="bg-orange-500" onClick={() => initiateTool('safety_plan')} />
          <ToolCard title="Business Plan Wizard" desc="Interactive AI consultant for custom business planning." icon={TrendingUp} color="bg-indigo-500" onClick={() => initiateTool('business_plan')} />
          <ToolCard title="Vehicle Inspector" desc="Verify vehicle condition for coverage." icon={Car} color="bg-blue-600" onClick={() => initiateTool('vehicle')} />
          <ToolCard title="Home Inspector" desc="AI-guided photo inspection for homeowners." icon={Camera} color="bg-orange-500" onClick={() => initiateTool('inspection')} />
          <ToolCard title="Policy Decoder" desc="Upload any policy to get a clear breakdown." icon={FileCheck} color="bg-emerald-500" onClick={() => initiateTool('policy')} />
          <ToolCard title="AI Claim Assistant" desc="Generate professional statements for adjusters." icon={LifeBuoy} color="bg-purple-600" onClick={() => initiateTool('claim')} />
          <ToolCard title="Defensive Driving" desc="Interactive safety course for discounts." icon={Award} color="bg-green-600" onClick={() => navigate('/safety-course')} />
        </div>
      ) : (
        <div className="glass-card rounded-[3rem] p-8 md:p-12 border-white/10 min-h-[60vh] relative animate-in zoom-in-95">
          
          {/* BILL OF SALE TOOL */}
          {activeTool === 'bill_of_sale' && (
             <div className="max-w-2xl mx-auto space-y-8">
                <h2 className="text-3xl font-heading font-bold text-white text-center">Vehicle Bill of Sale</h2>
                <div className="grid grid-cols-2 gap-4">
                   <input placeholder="Seller Name" value={bosData.seller} onChange={e => setBosData({...bosData, seller: e.target.value})} className="bg-slate-900 border border-white/10 p-3 rounded-xl text-white outline-none" />
                   <input placeholder="Buyer Name" value={bosData.buyer} onChange={e => setBosData({...bosData, buyer: e.target.value})} className="bg-slate-900 border border-white/10 p-3 rounded-xl text-white outline-none" />
                </div>
                <div className="grid grid-cols-3 gap-4">
                   <input placeholder="Year" value={bosData.year} onChange={e => setBosData({...bosData, year: e.target.value})} className="bg-slate-900 border border-white/10 p-3 rounded-xl text-white outline-none" />
                   <input placeholder="Make" value={bosData.make} onChange={e => setBosData({...bosData, make: e.target.value})} className="bg-slate-900 border border-white/10 p-3 rounded-xl text-white outline-none" />
                   <input placeholder="Model" value={bosData.model} onChange={e => setBosData({...bosData, model: e.target.value})} className="bg-slate-900 border border-white/10 p-3 rounded-xl text-white outline-none" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                   <input placeholder="VIN" value={bosData.vin} onChange={e => setBosData({...bosData, vin: e.target.value})} className="bg-slate-900 border border-white/10 p-3 rounded-xl text-white outline-none" />
                   <input placeholder="Sale Price ($)" type="number" value={bosData.price} onChange={e => setBosData({...bosData, price: e.target.value})} className="bg-slate-900 border border-white/10 p-3 rounded-xl text-white outline-none" />
                </div>
                <textarea placeholder="Special Conditions (e.g. Sold As-Is, Warranty...)" value={bosData.conditions} onChange={e => setBosData({...bosData, conditions: e.target.value})} className="w-full h-24 bg-slate-900 border border-white/10 p-3 rounded-xl text-white outline-none" />
                
                <button onClick={generateBillOfSalePDF} disabled={isLoading} className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold transition-all shadow-lg flex items-center justify-center gap-2">
                   {isLoading ? <Loader2 className="animate-spin" /> : <FileText />} Generate Official PDF
                </button>
             </div>
          )}

          {/* SAFETY PLAN TOOL */}
          {activeTool === 'safety_plan' && (
             <div className="max-w-2xl mx-auto space-y-8">
                <h2 className="text-3xl font-heading font-bold text-white text-center">Safety Plan Generator</h2>
                <input placeholder="Business Name" value={safetyData.businessName} onChange={e => setSafetyData({...safetyData, businessName: e.target.value})} className="w-full bg-slate-900 border border-white/10 p-4 rounded-xl text-white outline-none" />
                <input placeholder="Industry (e.g. Construction, Retail)" value={safetyData.industry} onChange={e => setSafetyData({...safetyData, industry: e.target.value})} className="w-full bg-slate-900 border border-white/10 p-4 rounded-xl text-white outline-none" />
                
                <div>
                   <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 block">Select Hazards Present:</label>
                   <div className="grid grid-cols-2 gap-3">
                      {HAZARD_OPTIONS.map(h => (
                         <button 
                            key={h} 
                            onClick={() => {
                               const newH = safetyData.hazards.includes(h) ? safetyData.hazards.filter(i => i !== h) : [...safetyData.hazards, h];
                               setSafetyData({...safetyData, hazards: newH});
                            }}
                            className={`p-3 rounded-lg text-sm text-left transition-all ${safetyData.hazards.includes(h) ? 'bg-orange-500 text-white' : 'bg-slate-900 text-slate-400 border border-white/10'}`}
                         >
                            {h}
                         </button>
                      ))}
                   </div>
                </div>
                
                <button onClick={generateSafetyPlanPDF} disabled={isLoading || !safetyData.businessName} className="w-full py-4 bg-orange-600 hover:bg-orange-500 text-white rounded-xl font-bold transition-all shadow-lg flex items-center justify-center gap-2">
                   {isLoading ? <Loader2 className="animate-spin" /> : <Shield />} Generate OSHA-Compliant Plan
                </button>
             </div>
          )}

          {/* BUSINESS PLAN TOOL (CHAT UPGRADE) */}
          {activeTool === 'business_plan' && (
             <div className="max-w-4xl mx-auto h-full flex flex-col">
                <div className="text-center mb-6">
                    <h2 className="text-3xl font-heading font-bold text-white">Business Architect</h2>
                    <p className="text-slate-400 text-sm">Interactive planning to structure your goals and finances.</p>
                </div>

                {bpStage === 'INIT' && (
                    <div className="max-w-md mx-auto space-y-6 animate-in zoom-in-95 w-full">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Business Name</label>
                            <input 
                                placeholder="e.g. Summit Insurance Agency" 
                                value={bpInitData.name}
                                onChange={e => setBpInitData({...bpInitData, name: e.target.value})}
                                className="w-full bg-slate-900 border border-white/10 p-4 rounded-xl text-white outline-none focus:border-indigo-500"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Industry / Type</label>
                            <input 
                                placeholder="e.g. Insurance, Restaurant, Tech Startup" 
                                value={bpInitData.industry}
                                onChange={e => setBpInitData({...bpInitData, industry: e.target.value})}
                                className="w-full bg-slate-900 border border-white/10 p-4 rounded-xl text-white outline-none focus:border-indigo-500"
                            />
                        </div>
                        <button 
                            onClick={startBusinessPlanChat}
                            disabled={!bpInitData.name || !bpInitData.industry || isLoading}
                            className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg disabled:opacity-50"
                        >
                            {isLoading ? <Loader2 className="animate-spin" /> : <MessageSquare className="w-5 h-5" />} Start Interview
                        </button>
                    </div>
                )}

                {(bpStage === 'CHAT' || bpStage === 'GENERATING') && (
                    <div className="flex-grow flex flex-col h-[600px] bg-slate-950/50 rounded-3xl border border-white/10 overflow-hidden">
                        {/* Chat History */}
                        <div className="flex-grow overflow-y-auto p-6 space-y-4 custom-scrollbar" ref={bpScrollRef}>
                            {bpMessages.map((msg, idx) => (
                                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[80%] p-4 rounded-2xl text-sm leading-relaxed ${
                                        msg.role === 'user' 
                                        ? 'bg-indigo-600 text-white rounded-tr-none' 
                                        : 'bg-white/10 text-slate-300 rounded-tl-none'
                                    }`}>
                                        {msg.text}
                                    </div>
                                </div>
                            ))}
                            {isLoading && (
                                <div className="flex justify-start">
                                    <div className="bg-white/5 p-4 rounded-2xl rounded-tl-none flex items-center gap-2">
                                        <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce"></div>
                                        <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce delay-100"></div>
                                        <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce delay-200"></div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Input Area */}
                        {bpStage === 'CHAT' && (
                            <div className="p-4 bg-slate-900 border-t border-white/10 space-y-3">
                                <form 
                                    onSubmit={(e) => { e.preventDefault(); sendBusinessPlanMessage(); }}
                                    className="flex gap-3"
                                >
                                    <input 
                                        value={bpInput}
                                        onChange={e => setBpInput(e.target.value)}
                                        placeholder="Type your answer..."
                                        className="flex-grow bg-white/5 border border-white/10 rounded-xl px-4 text-white outline-none focus:border-indigo-500"
                                        autoFocus
                                    />
                                    <button 
                                        type="submit"
                                        disabled={!bpInput.trim() || isLoading}
                                        className="p-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl disabled:opacity-50"
                                    >
                                        <Send className="w-5 h-5" />
                                    </button>
                                </form>
                                <div className="flex justify-center">
                                    <button 
                                        onClick={generateFinalPlan}
                                        className="text-xs font-bold text-indigo-400 uppercase tracking-widest hover:text-white transition-colors border-b border-indigo-500/30 pb-1"
                                    >
                                        I have enough info - Generate Plan Now
                                    </button>
                                </div>
                            </div>
                        )}
                        
                        {bpStage === 'GENERATING' && (
                            <div className="p-8 text-center bg-slate-900 border-t border-white/10">
                                <div className="flex flex-col items-center gap-4">
                                    <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
                                    <p className="text-slate-400 text-sm">Compiling your financial strategy and operational roadmap...</p>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {bpStage === 'DONE' && (
                    <div className="text-center py-20 space-y-6 animate-in zoom-in-95">
                        <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto text-green-400 mb-4">
                            <CheckCircle2 className="w-10 h-10" />
                        </div>
                        <h3 className="text-2xl font-bold text-white">Plan Created!</h3>
                        <p className="text-slate-400">Your comprehensive business plan has been generated and downloaded.</p>
                        <button 
                            onClick={reset}
                            className="px-8 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-bold transition-all"
                        >
                            Start New Plan
                        </button>
                    </div>
                )}
             </div>
          )}

          {/* EXISTING TOOLS (Checkers, Decoders, etc) */}
          {activeTool === 'safety' && (
            <div className="max-w-3xl mx-auto space-y-8">
              <div className="text-center space-y-4">
                <h2 className="text-3xl font-heading font-bold text-white">Vehicle Recall Checker</h2>
                <div className="flex justify-center gap-2">
                   <button onClick={() => setSearchMethod('VIN')} className={`px-4 py-2 rounded-lg text-xs font-bold ${searchMethod === 'VIN' ? 'bg-red-600' : 'bg-slate-800'}`}>VIN Search</button>
                   <button onClick={() => setSearchMethod('MANUAL')} className={`px-4 py-2 rounded-lg text-xs font-bold ${searchMethod === 'MANUAL' ? 'bg-red-600' : 'bg-slate-800'}`}>Manual Search</button>
                </div>
              </div>
              <div className="bg-slate-900/80 p-8 rounded-3xl border border-white/10 space-y-6">
                   {searchMethod === 'VIN' ? (
                      <input placeholder="Enter 17-Digit VIN" value={vinInput} onChange={e => setVinInput(e.target.value.toUpperCase())} maxLength={17} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white outline-none focus:border-red-500 text-center font-mono tracking-widest text-lg" />
                   ) : (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <select value={selectedYear} onChange={e => setSelectedYear(parseInt(e.target.value))} className="bg-slate-900 border border-white/10 rounded-2xl p-4 text-white outline-none">{Array.from({length: 30}, (_, i) => new Date().getFullYear() - i + 1).map(y => <option key={y} value={y}>{y}</option>)}</select>
                          <select value={selectedMake} onChange={e => setSelectedMake(e.target.value)} className="bg-slate-900 border border-white/10 rounded-2xl p-4 text-white outline-none"><option value="">Make</option>{availableMakes.map(m => <option key={m} value={m}>{m}</option>)}</select>
                          <select value={selectedModel} onChange={e => setSelectedModel(e.target.value)} className="bg-slate-900 border border-white/10 rounded-2xl p-4 text-white outline-none"><option value="">Model</option>{availableModels.map(m => <option key={m} value={m}>{m}</option>)}</select>
                      </div>
                   )}
                   <button onClick={handleSafetyCheck} disabled={isLoading} className="w-full bg-red-600 hover:bg-red-500 text-white font-bold px-8 py-4 rounded-2xl transition-all shadow-lg flex items-center justify-center gap-2">
                      {isLoading ? <Loader2 className="animate-spin" /> : <Search />} Check Recalls
                   </button>
              </div>
              {recallData && (
                  <div className="space-y-4">
                    <div className="text-white font-bold text-center text-xl">{recallData.specs.year} {recallData.specs.make} {recallData.specs.model}</div>
                    {recallData.recalls.length === 0 ? <div className="text-green-400 text-center font-bold">No Open Recalls Found</div> : recallData.recalls.map((r: any, i: number) => (
                        <div key={i} className="bg-slate-900 p-4 rounded-xl border border-white/10">
                            <div className="text-red-400 font-bold text-xs uppercase">{r.Component}</div>
                            <div className="text-white text-sm mt-1">{r.Summary}</div>
                        </div>
                    ))}
                  </div>
              )}
            </div>
          )}

          {activeTool === 'policy' && (
            <div className="max-w-3xl mx-auto space-y-8">
              <h2 className="text-3xl font-heading font-bold text-white text-center">Policy Decoder</h2>
              <div onClick={() => fileInputRef.current?.click()} className="border-2 border-dashed border-white/10 rounded-3xl p-12 text-center hover:bg-white/5 cursor-pointer">
                <input type="file" ref={fileInputRef} className="hidden" onChange={handlePolicyUpload} />
                <Upload className="w-12 h-12 text-emerald-400 mx-auto mb-4" />
                <div className="text-white font-bold">{fileName || "Upload Policy PDF/Image"}</div>
              </div>
              {isLoading && <div className="text-center text-emerald-400"><Loader2 className="inline animate-spin mr-2"/> Analyzing...</div>}
              {result && <div className="bg-slate-900 p-6 rounded-2xl text-slate-300 text-sm whitespace-pre-wrap">{result}</div>}
            </div>
          )}

          {activeTool === 'claim' && (
            <div className="max-w-3xl mx-auto space-y-8">
              <h2 className="text-3xl font-heading font-bold text-white text-center">Claim Assistant</h2>
              <textarea placeholder="Describe the incident..." value={claimText} onChange={e => setClaimText(e.target.value)} className="w-full h-40 bg-white/5 border border-white/10 rounded-2xl p-6 text-white outline-none" />
              <button onClick={handleClaimDraft} disabled={isLoading} className="w-full bg-purple-600 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2">
                  {isLoading ? <Loader2 className="animate-spin" /> : <Zap />} Generate Claim
              </button>
              {result && <div className="bg-slate-900 p-6 rounded-2xl text-slate-300 text-sm whitespace-pre-wrap">{result}</div>}
            </div>
          )}

        </div>
      )}
    </div>
  );
};

export default AIToolsPage;
