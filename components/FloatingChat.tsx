
import React, { useState, useRef, useEffect } from 'react';
import { 
  MessageSquare, X, Send, Loader2, Sparkles, User, Brain, 
  Image as ImageIcon, Globe, MapPin, Layers, Maximize2, Minimize2,
  Scaling, Search, Navigation, Mic, Zap
} from 'lucide-react';
import { 
  getAIResponse, 
  getMarketSearchResponse, 
  getMapsResponse, 
  analyzeMedia, 
  generateSpeech, 
  generatePolicyImage,
  getLiteResponse 
} from '../services/geminiService';
import { Message } from '../types';
import { LiveAssistant } from './LiveAssistant';
import { APP_CONFIG } from '../services/config';

interface FloatingChatProps {
  client?: any;
}

const FloatingChat: React.FC<FloatingChatProps> = ({ client }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const [isVoiceOpen, setIsVoiceOpen] = useState(false);
  const [input, setInput] = useState('');
  
  const [mode, setMode] = useState<'STANDARD' | 'SEARCH' | 'MAPS' | 'LITE'>('STANDARD');
  const [useThinking, setUseThinking] = useState(true);
  const [aspectRatio, setAspectRatio] = useState('1:1');
  
  const [messages, setMessages] = useState<(Message & { grounding?: any[], imageUrl?: string })[]>([
    { 
      role: 'assistant', 
      content: `System initialized. I am your RMI Neural Advisor${client ? `, ${client.firstName}` : ''}. How can I help you today?`, 
      timestamp: new Date() 
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  // Update greeting when client data becomes available
  useEffect(() => {
    if (client?.firstName && messages.length === 1 && messages[0].role === 'assistant') {
       setMessages([{ 
          role: 'assistant', 
          content: `System initialized. I am your RMI Neural Advisor, ${client.firstName}. How can I help you today?`, 
          timestamp: new Date() 
        }]);
    }
  }, [client?.firstName]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async () => {
      const base64 = (reader.result as string).split(',')[1];
      const mimeType = file.type;
      
      setMessages(prev => [...prev, { 
        role: 'user', 
        content: `Document for review: ${file.name}`, 
        timestamp: new Date() 
      }]);
      setIsLoading(true);

      try {
        const analysis = await analyzeMedia("Extract key insurance details or policy information from this document. If it's a driver's license, extract personal details.", { data: base64, mimeType });
        setMessages(prev => [...prev, { role: 'assistant', content: analysis || '', timestamp: new Date() }]);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const currentInput = input;
    setMessages(prev => [...prev, { role: 'user', content: currentInput, timestamp: new Date() }]);
    setInput('');
    setIsLoading(true);

    // Inject Client Context for Gemini - Robust Property Access
    const contextPrompt = client ? `
      ACTIVE CLIENT SESSION DATA:
      - First Name: ${client.firstName || 'Unknown'}
      - Last Name: ${client.lastName || 'Unknown'}
      - Client ID: ${client.insuredDatabaseId || client.id || 'N/A'}
      - Email: ${client.email || client.eMail || 'N/A'}
      - Phone: ${client.phone || client.cellPhone || 'N/A'}
      - Address: ${client.address || client.addressLine1 || ''}, ${client.city || ''}, ${client.state || ''} ${client.zip || client.zipCode || ''}
    ` : "";

    try {
      let result;
      if (mode === 'SEARCH') {
        result = await getMarketSearchResponse(currentInput);
      } else if (mode === 'MAPS') {
        result = await getMapsResponse(currentInput);
      } else if (mode === 'LITE') {
        const text = await getLiteResponse(contextPrompt + "\n\n" + currentInput);
        result = { text, grounding: [] };
      } else {
        const history = messages.map(m => ({
          role: m.role === 'user' ? 'user' : 'model',
          parts: [{ text: m.content }]
        }));
        // Pass context as 4th argument to inject into system instructions
        result = await getAIResponse(currentInput, history, useThinking, contextPrompt);
      }
      
      setMessages(prev => [...prev, { role: 'assistant', content: result.text || '', grounding: result.grounding, timestamp: new Date() }]);

      if (result.text && result.text.length < 250) {
        const audioData = await generateSpeech(result.text);
        if (audioData) {
          const audio = new Audio(`data:audio/mp3;base64,${audioData}`);
          audio.play().catch(() => {});
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageGen = async () => {
    if (!input.trim() || isLoading) return;
    setIsLoading(true);
    setMessages(prev => [...prev, { role: 'user', content: `Visual Synthesis: ${input}`, timestamp: new Date() }]);
    
    try {
      const url = await generatePolicyImage(input, aspectRatio);
      if (url) {
        setMessages(prev => [...prev, { role: 'assistant', content: 'Visual synthesis complete:', imageUrl: url, timestamp: new Date() }]);
      } else {
        setMessages(prev => [...prev, { role: 'assistant', content: 'Synthesis failed.', timestamp: new Date() }]);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
      setInput('');
    }
  };

  if (isVoiceOpen) return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-950/90 backdrop-blur-xl p-8">
      <div className="w-full max-w-2xl h-[80vh]">
        <LiveAssistant onClose={() => setIsVoiceOpen(false)} />
      </div>
    </div>
  );

  return (
    <div className={`fixed transition-all duration-500 z-[150] ${
      isOpen 
        ? (isMaximized ? 'inset-0 p-4 md:p-8' : 'bottom-6 right-6 w-[95vw] sm:w-[500px] h-[80vh] max-h-[900px]') 
        : 'bottom-10 right-10'
    }`}>
      {isOpen ? (
        <div className="glass-card w-full h-full rounded-[2.5rem] flex flex-col overflow-hidden animate-in zoom-in-95 duration-300 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.6)]">
          <div className="flex-shrink-0 p-6 md:p-8 flex items-center justify-between border-b border-white/10 bg-white/[0.03]">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-blue-600 rounded-2xl flex items-center justify-center shadow-[0_0_20px_rgba(59,130,246,0.3)]">
                <Sparkles className="w-5 h-5 md:w-6 md:h-6 text-white" />
              </div>
              <div>
                <h3 className="font-heading font-bold text-base md:text-lg text-white">Neural Hub</h3>
                <div className="flex items-center gap-2 text-[10px] font-bold tracking-widest text-slate-500 uppercase">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                  {mode} Mode active
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1 md:gap-2">
              <button onClick={() => setIsVoiceOpen(true)} className="p-2 md:p-3 hover:bg-white/5 rounded-xl transition-all text-slate-400 hover:text-blue-400">
                <Mic className="w-5 h-5" />
              </button>
              <button onClick={() => setIsMaximized(!isMaximized)} className="p-2 md:p-3 hover:bg-white/5 rounded-xl transition-all text-slate-400 hover:text-white hidden sm:block">
                {isMaximized ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
              </button>
              <button onClick={() => setIsOpen(false)} className="p-2 md:p-3 hover:bg-white/5 rounded-xl transition-all text-slate-400 hover:text-red-400">
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div ref={scrollRef} className="flex-grow overflow-y-auto p-6 md:p-10 space-y-8 scroll-smooth custom-scrollbar">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2 duration-300 w-full`}>
                <div className={`max-w-[85%] space-y-2 ${m.role === 'user' ? 'text-right' : 'text-left'}`}>
                  <div className={`flex items-center gap-2 mb-1 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
                    <div className="w-6 h-6 rounded-lg bg-white/5 flex items-center justify-center border border-white/10">
                      {m.role === 'user' ? <User className="w-3 h-3 text-blue-400" /> : <Sparkles className="w-3 h-3 text-purple-400" />}
                    </div>
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                      {m.role === 'user' ? (client ? client.firstName : 'Client') : 'Neural Agent'}
                    </span>
                  </div>
                  <div className={`inline-block p-4 md:p-5 rounded-[1.8rem] text-sm leading-relaxed break-words w-full ${
                    m.role === 'user' 
                    ? 'bg-blue-600 text-white rounded-tr-none shadow-lg' 
                    : 'bg-white/5 text-slate-300 border border-white/10 rounded-tl-none'
                  }`}>
                    <p className="whitespace-pre-wrap">{m.content}</p>
                    {m.imageUrl && (
                      <div className="mt-4 rounded-xl overflow-hidden border border-white/20 bg-slate-900/50">
                        <img src={m.imageUrl} alt="Generated" className="w-full h-auto object-contain max-h-[300px]" />
                      </div>
                    )}
                  </div>
                  {m.grounding && m.grounding.length > 0 && (
                    <div className={`flex flex-wrap gap-2 pt-2 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      {m.grounding.map((chunk, idx) => (chunk.web || chunk.maps) && (
                        <a key={idx} href={chunk.web?.uri || chunk.maps?.uri} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-[10px] font-bold text-blue-400 hover:bg-blue-500/20 transition-all">
                          {chunk.web ? <Globe className="w-3 h-3" /> : <MapPin className="w-3 h-3" />}
                          {chunk.web?.title || 'Map Source'}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white/5 p-4 rounded-2xl border border-white/10 flex items-center gap-3">
                  <div className="flex gap-1.5">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce"></div>
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                  </div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Underwriting Logic Active...</span>
                </div>
              </div>
            )}
          </div>

          <div className="flex-shrink-0 p-6 md:p-8 border-t border-white/10 space-y-6 bg-white/[0.02]">
            <div className="flex flex-wrap items-center justify-between text-[10px] font-bold text-slate-500 tracking-widest uppercase gap-y-4">
              <div className="flex flex-wrap gap-3">
                <button 
                  onClick={() => setMode(mode === 'SEARCH' ? 'STANDARD' : 'SEARCH')} 
                  className={`flex items-center gap-1.5 transition-all px-2 py-1 rounded-lg ${mode === 'SEARCH' ? 'bg-blue-500/20 text-blue-400' : 'hover:text-white'}`}
                >
                  <Search className="w-3 h-3" /> Carrier Search
                </button>
                <button 
                  onClick={() => setMode(mode === 'MAPS' ? 'STANDARD' : 'MAPS')} 
                  className={`flex items-center gap-1.5 transition-all px-2 py-1 rounded-lg ${mode === 'MAPS' ? 'bg-indigo-500/20 text-indigo-400' : 'hover:text-white'}`}
                >
                  <Navigation className="w-3 h-3" /> Hazards
                </button>
                <button 
                  onClick={() => setMode(mode === 'LITE' ? 'STANDARD' : 'LITE')} 
                  className={`flex items-center gap-1.5 transition-all px-2 py-1 rounded-lg ${mode === 'LITE' ? 'bg-yellow-500/20 text-yellow-400' : 'hover:text-white'}`}
                >
                  <Zap className="w-3 h-3" /> Quick Answer
                </button>
                <button 
                  onClick={() => setUseThinking(!useThinking)} 
                  className={`flex items-center gap-1.5 transition-all px-2 py-1 rounded-lg ${useThinking ? 'bg-purple-500/20 text-purple-400' : 'hover:text-white'}`}
                >
                  <Brain className="w-3 h-3" /> Multi-Step logic
                </button>
              </div>
              <div className="flex items-center gap-4 ml-auto">
                <button onClick={() => fileInputRef.current?.click()} className="flex items-center gap-1.5 hover:text-white transition-colors">
                  <Layers className="w-3 h-3" /> Upload Doc
                </button>
              </div>
            </div>

            <form onSubmit={handleSend} className="relative flex items-center gap-3">
              <div className="flex-grow group relative">
                <input
                  type="text"
                  placeholder={
                    mode === 'SEARCH' ? "Compare market rates..." :
                    mode === 'MAPS' ? "Check regional risks..." :
                    mode === 'LITE' ? "Quick quote info..." :
                    "Describe your insurance need..."
                  }
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="w-full px-6 md:px-8 py-4 md:py-5 bg-white/5 border border-white/10 rounded-[1.8rem] outline-none focus:border-blue-500/50 focus:bg-white/[0.08] transition-all text-white placeholder:text-slate-600 text-sm md:text-base"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
                   <button 
                    type="button" 
                    onClick={handleImageGen} 
                    className={`p-2 transition-colors ${input.trim() ? 'text-blue-400 hover:text-blue-300' : 'text-slate-600 opacity-50 cursor-not-allowed'}`}
                    title="Generate Policy Visual"
                   >
                    <ImageIcon className="w-5 h-5" />
                   </button>
                </div>
              </div>
              <button 
                type="submit" 
                disabled={isLoading || !input.trim()}
                className="bg-blue-600 hover:bg-blue-500 disabled:opacity-30 p-4 md:p-5 rounded-[1.8rem] transition-all shadow-[0_0_20px_rgba(37,99,235,0.2)] active:scale-95 flex-shrink-0"
              >
                <Send className="w-5 h-5 md:w-6 md:h-6 text-white" />
              </button>
            </form>
            <input type="file" ref={fileInputRef} className="hidden" accept="image/*,application/pdf" onChange={handleFileUpload} />
          </div>
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="group relative w-16 h-16 md:w-20 md:h-20 bg-blue-600 rounded-[2rem] flex items-center justify-center shadow-[0_20px_40px_rgba(37,99,235,0.4)] hover:scale-110 active:scale-95 transition-all"
        >
          <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity"></div>
          <div className="absolute inset-[-4px] border border-blue-500/20 rounded-[2.2rem] animate-ping opacity-30"></div>
          <Sparkles className="w-8 h-8 md:w-10 md:h-10 text-white" />
          <span className="absolute -top-1 -right-1 w-4 h-4 md:w-5 md:h-5 bg-blue-400 border-4 border-slate-900 rounded-full"></span>
        </button>
      )}
    </div>
  );
};

export default FloatingChat;
