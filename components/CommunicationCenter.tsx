import React, { useState, useEffect, useRef } from 'react';
import { 
  MessageSquare, Mail, Phone, MessageCircle, Calendar, 
  User, FileText, Search, Plus, Send, Bot, Clock, 
  CheckCircle2, AlertCircle, RefreshCw, Paperclip, 
  MoreVertical, Shield, Briefcase, Lock, Network, Folder, Download, Upload, Tag, Filter, Play, Loader2
} from 'lucide-react';
import { GoogleGenAI, Type } from '@google/genai';
import { communicationService, Message, Thread } from '../services/communicationService';
import { nowCertsApi } from '../services/nowCertsService';

type Channel = 'PORTAL' | 'EMAIL' | 'SMS' | 'VOICE' | 'INTERNAL';

interface Ticket {
  id: string;
  clientId: string;
  clientName: string;
  clientEmail: string;
  subject: string;
  snippet: string;
  updatedAt: string;
  channel: Channel;
  status: 'NEW' | 'OPEN' | 'PENDING' | 'RESOLVED';
  labels: string[];
  policyNumber?: string;
  carrier?: string;
  actionItems: string[];
  aiTasks: string[];
  messages: Message[];
  nowCertsProfileId?: string;
}

export default function CommunicationCenter() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [activeTicketId, setActiveTicketId] = useState<string | null>(null);
  const [inputMessage, setInputMessage] = useState('');
  const [selectedChannel, setSelectedChannel] = useState<Channel>('EMAIL');
  const [isSyncing, setIsSyncing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterLabel, setFilterLabel] = useState<string | null>(null);
  const [isGmailConnected, setIsGmailConnected] = useState(false);
  
  // Reply fields
  const [replyTo, setReplyTo] = useState('');
  const [replyCc, setReplyCc] = useState('');
  const [replyBcc, setReplyBcc] = useState('');
  const [isGeneratingDraft, setIsGeneratingDraft] = useState(false);

  // Manual NowCerts Search
  const [ncSearchQuery, setNcSearchQuery] = useState('');
  const [ncSearchResults, setNcSearchResults] = useState<any[]>([]);
  const [isSearchingNC, setIsSearchingNC] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const ticketsRef = useRef<Ticket[]>([]);
  const activeTicketIdRef = useRef<string | null>(null);
  const isSyncingRef = useRef(false);

  const activeTicket = tickets.find(t => t.id === activeTicketId);

  useEffect(() => {
    ticketsRef.current = tickets;
  }, [tickets]);

  useEffect(() => {
    activeTicketIdRef.current = activeTicketId;
  }, [activeTicketId]);

  useEffect(() => {
    if (activeTicket) {
      setReplyTo(activeTicket.clientEmail || '');
      setReplyCc('');
      setReplyBcc('');
    }
  }, [activeTicketId]);

  useEffect(() => {
    checkGmailConnection();
    
    const unsubscribe = communicationService.subscribeToTickets((fetchedTickets) => {
      setTickets(fetchedTickets);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (activeTicketId) {
      setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
    }
  }, [activeTicketId, activeTicket?.messages]);

  const checkGmailConnection = async () => {
    const connected = await communicationService.checkGmailStatus();
    setIsGmailConnected(connected);
  };

  const handleConnectGmail = async () => {
    try {
      const url = await communicationService.getGmailAuthUrl();
      if (!url) {
        alert("Failed to get Gmail auth URL. Please check your configuration.");
        return;
      }
      
      const popup = window.open(url, 'Gmail Auth', 'width=600,height=600');
      
      if (!popup) {
        alert("Popup blocked! Please allow popups for this site.");
        return;
      }

      const checkPopup = setInterval(() => {
        if (popup?.closed) {
          clearInterval(checkPopup);
          checkGmailConnection();
        }
      }, 1000);

      window.addEventListener('message', (event) => {
        if (event.data.type === 'GMAIL_AUTH_SUCCESS') {
          checkGmailConnection();
          if (popup) popup.close();
        }
      });
    } catch (e: any) {
      console.error("Failed to initiate Gmail auth", e);
      alert(`Failed to connect to Gmail: ${e.message}`);
    }
  };

  const analyzeThreadWithAI = async (messagesText: string, subject: string, sender: string): Promise<any> => {
    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) throw new Error("Gemini API key not found");

      const ai = new GoogleGenAI({ apiKey });
      
      const prompt = `
        Analyze the following email thread. Extract the following information:
        1. Client Name
        2. Policy Number (if mentioned)
        3. Carrier (if mentioned)
        4. A list of manual Action Items for the agent.
        5. A list of AI Tasks that can be automated (e.g., "Draft a reply", "Update NowCerts profile", "Generate Dec Page").
        6. A list of 1-3 labels (e.g., "Urgent", "Renewal", "Claim", "Question", "Endorsement").

        Sender: ${sender}
        Subject: ${subject}
        Thread Content:
        ${messagesText}
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              clientName: { type: Type.STRING },
              policyNumber: { type: Type.STRING },
              carrier: { type: Type.STRING },
              actionItems: { type: Type.ARRAY, items: { type: Type.STRING } },
              aiTasks: { type: Type.ARRAY, items: { type: Type.STRING } },
              labels: { type: Type.ARRAY, items: { type: Type.STRING } }
            }
          }
        }
      });

      return JSON.parse(response.text || '{}');
    } catch (e) {
      console.error("AI Analysis failed", e);
      return {
        clientName: sender,
        actionItems: [],
        aiTasks: [],
        labels: ['Uncategorized']
      };
    }
  };

  const syncEmailsAndAnalyze = async () => {
    if (!isGmailConnected || isSyncingRef.current) {
      return;
    }

    isSyncingRef.current = true;
    setIsSyncing(true);
    try {
      // Fetch threads from the last 30 days
      const gThreads = await communicationService.getGmailThreads('newer_than:30d');
      
      const newTickets: Ticket[] = [];

      // Process a subset to avoid rate limits/long waits in demo
      const threadsToProcess = gThreads.slice(0, 100); 

      for (const gt of threadsToProcess) {
        // Skip if we already have this ticket in our local state (which is synced from Firestore)
        if (ticketsRef.current.find(t => t.id === gt.id)) continue;

        const details = await communicationService.getGmailMessage(gt.id);
        if (!details) continue;

        const headers = details.payload.headers;
        const subject = headers.find((h: any) => h.name === 'Subject')?.value || '(No Subject)';
        const from = headers.find((h: any) => h.name === 'From')?.value || '';
        const date = headers.find((h: any) => h.name === 'Date')?.value;
        
        const nameMatch = from.match(/^"?([^"<]+)"?\s*<(.+)>$/);
        const senderName = nameMatch ? nameMatch[1].trim() : from;
        const senderEmail = nameMatch ? nameMatch[2].trim() : from;

        // Extract body text (simplified for demo)
        let bodyText = details.snippet;
        let isHtml = false;
        
        const getPartData = (parts: any[], mimeType: string) => {
            if (!parts) return null;
            for (const part of parts) {
                if (part.mimeType === mimeType && part.body && part.body.data) {
                    return atob(part.body.data.replace(/-/g, '+').replace(/_/g, '/'));
                }
                if (part.parts) {
                    const nested = getPartData(part.parts, mimeType);
                    if (nested) return nested;
                }
            }
            return null;
        };

        const htmlData = getPartData(details.payload.parts, 'text/html');
        const textData = getPartData(details.payload.parts, 'text/plain');

        if (htmlData) {
            bodyText = htmlData;
            isHtml = true;
        } else if (textData) {
            bodyText = textData;
        } else if (details.payload.body && details.payload.body.data) {
            bodyText = atob(details.payload.body.data.replace(/-/g, '+').replace(/_/g, '/'));
            isHtml = details.payload.mimeType === 'text/html';
        }

        // AI Analysis (use snippet or textData for AI to avoid HTML tags confusing it)
        const textForAI = textData || details.snippet || bodyText.replace(/<[^>]*>?/gm, '');
        const analysis = await analyzeThreadWithAI(textForAI, subject, senderName);

        // Try to match with NowCerts
        let ncProfileId = undefined;
        try {
            const searchResult = await nowCertsApi.searchInsured({ email: senderEmail });
            if (searchResult && searchResult.value && searchResult.value.length > 0) {
                ncProfileId = searchResult.value[0].databaseId || searchResult.value[0].id;
            }
        } catch (e) {
            console.warn("NowCerts match failed", e);
        }

        const newTicket: Ticket = {
          id: gt.id,
          clientId: senderEmail,
          clientName: analysis.clientName || senderName,
          clientEmail: senderEmail,
          subject: subject,
          snippet: details.snippet,
          updatedAt: date ? new Date(date).toISOString() : new Date().toISOString(),
          channel: 'EMAIL',
          status: 'NEW',
          labels: analysis.labels || [],
          policyNumber: analysis.policyNumber,
          carrier: analysis.carrier,
          actionItems: analysis.actionItems || [],
          aiTasks: analysis.aiTasks || [],
          nowCertsProfileId: ncProfileId,
          messages: [{
            id: details.id,
            threadId: gt.id,
            senderId: senderEmail,
            senderName: senderName,
            senderRole: 'CLIENT',
            content: bodyText,
            timestamp: date ? new Date(date).toISOString() : new Date().toISOString(),
            channel: 'EMAIL',
            isHtml: isHtml
          }]
        };

        // Optimistic update for each new ticket
        setTickets(prev => {
          const updated = [newTicket, ...prev];
          updated.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
          return updated;
        });

        await communicationService.saveTicket(newTicket);
        newTickets.push(newTicket);
      }

      if (newTickets.length > 0 && !activeTicketIdRef.current) {
        setActiveTicketId(newTickets[0].id);
      }

    } catch (e) {
      console.error("Failed to sync emails", e);
    } finally {
      isSyncingRef.current = false;
      setIsSyncing(false);
    }
  };

  useEffect(() => {
    if (!isGmailConnected) return;
    
    // Initial sync
    syncEmailsAndAnalyze();

    // Schedule updates every 5 minutes
    const interval = setInterval(() => {
      syncEmailsAndAnalyze();
    }, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, [isGmailConnected]);

  const handleManualNCSearch = async () => {
    if (!ncSearchQuery.trim()) return;
    setIsSearchingNC(true);
    try {
      const res = await nowCertsApi.searchInsured({ email: ncSearchQuery, name: ncSearchQuery });
      setNcSearchResults(res.value || []);
    } catch (e) {
      console.error("Manual NC Search failed", e);
    } finally {
      setIsSearchingNC(false);
    }
  };

  const linkNcProfile = async (profileId: string) => {
    if (!activeTicketId) return;
    const ticketToUpdate = tickets.find(t => t.id === activeTicketId);
    if (!ticketToUpdate) return;
    
    const updatedTicket = { ...ticketToUpdate, nowCertsProfileId: profileId };
    
    // Optimistic update
    setTickets(prev => prev.map(t => t.id === activeTicketId ? updatedTicket : t));
    
    await communicationService.saveTicket(updatedTicket);
    
    setNcSearchResults([]);
    setNcSearchQuery('');
  };

  const generateDraft = async () => {
    if (!inputMessage.trim() || !activeTicket) return;
    setIsGeneratingDraft(true);
    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) throw new Error("Gemini API key not found");
      const ai = new GoogleGenAI({ apiKey });
      const prompt = `You are an insurance agent. The client sent this email:
"${activeTicket.snippet}"

Write a professional, polite, and helpful email reply based on this short instruction from the agent: "${inputMessage}"

Return ONLY the email body text. Do not include the subject line or placeholder brackets unless necessary.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.1-pro-preview',
        contents: prompt,
      });

      if (response.text) {
        setInputMessage(response.text.trim());
      }
    } catch (e) {
      console.error("Failed to generate draft", e);
      alert("Failed to generate draft. Please try again.");
    } finally {
      setIsGeneratingDraft(false);
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || !activeTicketId || !activeTicket) return;

    try {
      if (selectedChannel === 'EMAIL') {
        if (!isGmailConnected) {
          alert("Please connect Gmail to send emails.");
          return;
        }

        await communicationService.sendGmail(
          replyTo || activeTicket.clientEmail,
          `Re: ${activeTicket.subject}`,
          inputMessage,
          replyCc,
          replyBcc
        );
      }

      const newMessage: Message = {
        id: Date.now().toString(),
        threadId: activeTicketId,
        senderId: 'agent',
        senderName: 'Agent',
        senderRole: selectedChannel === 'INTERNAL' ? 'SYSTEM' : 'AGENT',
        content: inputMessage,
        timestamp: new Date().toISOString(),
        channel: selectedChannel
      };

      const updatedTicket = {
        ...activeTicket,
        messages: [...activeTicket.messages, newMessage],
        updatedAt: newMessage.timestamp,
        status: 'OPEN' as const
      };

      // Optimistic update
      setTickets(prev => prev.map(t => t.id === activeTicketId ? updatedTicket : t));

      await communicationService.saveTicket(updatedTicket);
      setInputMessage('');
    } catch (e: any) {
      console.error("Failed to send message", e);
      alert(`Failed to send message: ${e.message}`);
    }
  };

  const executeAITask = async (task: string) => {
    if (!activeTicket) return;
    
    // Simulate AI task execution
    const systemMsg: Message = {
        id: Date.now().toString(),
        threadId: activeTicket.id,
        senderId: 'system',
        senderName: 'AI Agent',
        senderRole: 'SYSTEM',
        content: `Executed AI Task: "${task}". Data synced to NowCerts.`,
        timestamp: new Date().toISOString(),
        channel: 'INTERNAL'
    };

    const updatedTicket = {
        ...activeTicket,
        messages: [...activeTicket.messages, systemMsg],
        aiTasks: activeTicket.aiTasks.filter(t => t !== task)
    };

    // Optimistic update
    setTickets(prev => prev.map(t => t.id === activeTicket.id ? updatedTicket : t));

    await communicationService.saveTicket(updatedTicket);
  };

  const filteredTickets = tickets.filter(t => {
    const matchesSearch = t.clientName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          t.subject.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLabel = filterLabel ? t.labels.includes(filterLabel) : true;
    return matchesSearch && matchesLabel;
  });

  const allLabels = Array.from(new Set(tickets.flatMap(t => t.labels)));

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 flex flex-col pt-24 pb-8 px-4 lg:px-8">
      <div className="max-w-[1600px] w-full mx-auto flex-1 flex flex-col">
        
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
              <Network className="w-8 h-8 text-blue-400" />
              AI Automation Ticket System
            </h1>
            <p className="text-slate-400 mt-1">Omnichannel inbox, AI analysis, and NowCerts synchronization.</p>
          </div>
          <div className="flex gap-3">
            {!isGmailConnected ? (
              <button 
                onClick={handleConnectGmail}
                className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl transition-colors font-medium"
              >
                <Mail className="w-4 h-4" /> Connect Gmail
              </button>
            ) : (
              <div className="flex items-center gap-2 bg-emerald-500/10 text-emerald-400 px-4 py-2 rounded-xl border border-emerald-500/20">
                <CheckCircle2 className="w-4 h-4" /> Gmail Connected
              </div>
            )}
            <button 
                onClick={syncEmailsAndAnalyze}
                disabled={isSyncing || !isGmailConnected}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-xl transition-all font-bold shadow-lg shadow-blue-500/20 disabled:opacity-50"
            >
                {isSyncing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Bot className="w-4 h-4" />}
                {isSyncing ? 'Syncing & Analyzing...' : 'Sync Last 30 Days'}
            </button>
          </div>
        </div>

        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[700px]">
          
          {/* Left Sidebar: Tickets List */}
          <div className="lg:col-span-3 glass rounded-2xl border border-white/10 flex flex-col overflow-hidden">
            <div className="p-4 border-b border-white/10 bg-white/5 space-y-3">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search tickets..." 
                  className="w-full bg-slate-900 border border-white/10 rounded-xl pl-9 pr-4 py-2 text-sm text-white focus:border-blue-500 outline-none"
                />
              </div>
              <div className="flex gap-2 overflow-x-auto pb-1 custom-scrollbar">
                <button 
                    onClick={() => setFilterLabel(null)}
                    className={`px-3 py-1 rounded-full text-[10px] font-bold whitespace-nowrap transition-colors ${!filterLabel ? 'bg-blue-500 text-white' : 'bg-white/5 text-slate-400 hover:bg-white/10'}`}
                >
                    All
                </button>
                {allLabels.map(label => (
                    <button 
                        key={label}
                        onClick={() => setFilterLabel(label)}
                        className={`px-3 py-1 rounded-full text-[10px] font-bold whitespace-nowrap transition-colors ${filterLabel === label ? 'bg-blue-500 text-white' : 'bg-white/5 text-slate-400 hover:bg-white/10'}`}
                    >
                        {label}
                    </button>
                ))}
              </div>
            </div>
            <div className="flex-1 overflow-y-auto">
              {filteredTickets.length === 0 ? (
                  <div className="p-8 text-center text-slate-500 text-sm">No tickets found. Click "Sync Last 30 Days" to pull emails.</div>
              ) : (
                  filteredTickets.map(ticket => (
                    <button
                      key={ticket.id}
                      onClick={() => setActiveTicketId(ticket.id)}
                      className={`w-full text-left p-4 border-b border-white/5 transition-colors ${
                        activeTicketId === ticket.id ? 'bg-blue-500/10 border-l-2 border-l-blue-500' : 'hover:bg-white/5'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-1">
                        <span className="font-bold text-white truncate pr-2">{ticket.clientName}</span>
                        <span className="text-[10px] text-slate-400 whitespace-nowrap">
                          {new Date(ticket.updatedAt).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="text-xs font-medium text-slate-300 mb-1 truncate">{ticket.subject}</div>
                      <p className="text-[10px] text-slate-500 truncate mb-2">{ticket.snippet}</p>
                      <div className="flex gap-1 flex-wrap">
                          {ticket.labels.slice(0, 2).map(l => (
                              <span key={l} className="px-1.5 py-0.5 bg-white/10 rounded text-[8px] font-bold text-slate-300 uppercase">{l}</span>
                          ))}
                          {ticket.labels.length > 2 && <span className="px-1.5 py-0.5 bg-white/10 rounded text-[8px] font-bold text-slate-300">+{ticket.labels.length - 2}</span>}
                      </div>
                    </button>
                  ))
              )}
            </div>
          </div>

          {/* Main Chat Area */}
          <div className="lg:col-span-6 glass rounded-2xl border border-white/10 flex flex-col overflow-hidden">
            {activeTicket ? (
              <>
                {/* Chat Header */}
                <div className="p-4 border-b border-white/10 bg-white/5 flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-white">{activeTicket.subject}</h2>
                    <div className="flex items-center gap-3 text-sm text-slate-400 mt-1">
                      <span className="flex items-center gap-1"><User className="w-4 h-4" /> {activeTicket.clientName} ({activeTicket.clientEmail})</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <span className={`px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-widest border ${
                        activeTicket.status === 'NEW' ? 'bg-blue-500/20 text-blue-400 border-blue-500/30' :
                        activeTicket.status === 'OPEN' ? 'bg-amber-500/20 text-amber-400 border-amber-500/30' :
                        'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                    }`}>
                        {activeTicket.status}
                    </span>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-950/50">
                  {activeTicket.messages.map(msg => (
                    <div key={msg.id} className={`flex flex-col ${msg.senderRole === 'AGENT' || msg.senderRole === 'SYSTEM' ? 'items-end' : 'items-start'}`}>
                      <div className="flex items-center gap-2 mb-1 px-1">
                        <span className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-1">
                          {msg.channel === 'EMAIL' ? <Mail className="w-3 h-3"/> : msg.channel === 'INTERNAL' ? <Lock className="w-3 h-3"/> : <MessageSquare className="w-3 h-3"/>} 
                          {msg.senderName} • {new Date(msg.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                      <div className={`max-w-[85%] p-4 rounded-2xl text-sm shadow-lg overflow-hidden ${
                        msg.senderRole === 'AGENT' 
                          ? msg.channel === 'INTERNAL' ? 'bg-amber-500/20 text-amber-100 border border-amber-500/30 rounded-tr-sm' : 'bg-blue-600 text-white rounded-tr-sm'
                          : msg.senderRole === 'SYSTEM'
                            ? 'bg-slate-800 text-slate-300 border border-white/10 rounded-tl-sm w-full text-center text-xs italic'
                            : 'bg-slate-800 text-slate-200 border border-white/10 rounded-tl-sm'
                      }`}>
                        {msg.isHtml ? (
                          <div dangerouslySetInnerHTML={{ __html: msg.content }} className="prose prose-invert max-w-none text-sm prose-p:my-1 prose-a:text-blue-400" />
                        ) : (
                          <div className="whitespace-pre-wrap">{msg.content}</div>
                        )}
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="p-4 border-t border-white/10 bg-slate-900/80">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      {(['EMAIL', 'INTERNAL'] as Channel[]).map(ch => (
                        <button
                          key={ch}
                          onClick={() => setSelectedChannel(ch)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors ${
                            selectedChannel === ch 
                              ? ch === 'INTERNAL' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' : 'bg-blue-500 text-white'
                              : 'bg-slate-800 text-slate-400 hover:bg-slate-700 border border-white/5'
                          }`}
                        >
                          {ch === 'EMAIL' ? <Mail className="w-3 h-3"/> : <Lock className="w-3 h-3"/>} {ch}
                        </button>
                      ))}
                    </div>
                    {selectedChannel === 'EMAIL' && (
                      <button
                        onClick={generateDraft}
                        disabled={isGeneratingDraft || !inputMessage.trim()}
                        className="px-3 py-1.5 bg-indigo-500/20 text-indigo-400 hover:bg-indigo-500/30 border border-indigo-500/30 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-colors flex items-center gap-1 disabled:opacity-50"
                      >
                        {isGeneratingDraft ? <Loader2 className="w-3 h-3 animate-spin" /> : <Bot className="w-3 h-3" />}
                        Expand with AI
                      </button>
                    )}
                  </div>

                  {selectedChannel === 'EMAIL' && (
                    <div className="mb-3 space-y-2 text-xs">
                      <div className="flex items-center gap-2">
                        <span className="text-slate-500 w-8 font-bold">To:</span>
                        <input type="text" value={replyTo} onChange={e => setReplyTo(e.target.value)} className="flex-1 bg-transparent border-b border-white/10 focus:border-blue-500 outline-none text-slate-300 py-1" />
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-slate-500 w-8 font-bold">Cc:</span>
                        <input type="text" value={replyCc} onChange={e => setReplyCc(e.target.value)} className="flex-1 bg-transparent border-b border-white/10 focus:border-blue-500 outline-none text-slate-300 py-1" placeholder="Optional" />
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-slate-500 w-8 font-bold">Bcc:</span>
                        <input type="text" value={replyBcc} onChange={e => setReplyBcc(e.target.value)} className="flex-1 bg-transparent border-b border-white/10 focus:border-blue-500 outline-none text-slate-300 py-1" placeholder="Optional" />
                      </div>
                    </div>
                  )}

                  <div className="flex gap-2">
                    <textarea
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendMessage(); } }}
                      placeholder={selectedChannel === 'INTERNAL' ? "Add an internal note..." : "Type your reply or a short phrase for AI to expand..."}
                      className="flex-1 bg-slate-950 border border-white/10 rounded-xl p-3 text-sm text-white focus:border-blue-500 outline-none resize-none h-24 custom-scrollbar"
                    />
                    <button 
                      onClick={handleSendMessage}
                      className="bg-blue-600 hover:bg-blue-500 text-white p-3 rounded-xl transition-colors flex items-center justify-center h-24 w-20 shadow-lg shadow-blue-500/20"
                    >
                      <Send className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-slate-500 gap-4">
                <MessageSquare className="w-12 h-12 opacity-20" />
                <p>Select a ticket to view details</p>
              </div>
            )}
          </div>

          {/* Right Sidebar: Context & Tasks */}
          <div className="lg:col-span-3 glass rounded-2xl border border-white/10 flex flex-col overflow-hidden">
            <div className="p-4 border-b border-white/10 bg-white/5">
              <h3 className="font-bold text-white flex items-center gap-2">
                <Bot className="w-4 h-4 text-blue-400" /> AI Analysis & Sync
              </h3>
            </div>
            
            {activeTicket ? (
                <div className="p-4 overflow-y-auto flex-1 space-y-6 custom-scrollbar">
                
                {/* NowCerts Sync Status */}
                <div>
                    <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">NowCerts Integration</h4>
                    <div className="bg-slate-800/50 border border-white/5 rounded-xl p-4 space-y-3">
                        {activeTicket.nowCertsProfileId ? (
                            <>
                                <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold">
                                    <CheckCircle2 className="w-4 h-4" /> Profile Matched
                                </div>
                                <div className="text-xs text-slate-400 font-mono break-all">{activeTicket.nowCertsProfileId}</div>
                            </>
                        ) : (
                            <>
                                <div className="flex items-center gap-2 text-amber-400 text-xs font-bold">
                                    <AlertCircle className="w-4 h-4" /> No Profile Match
                                </div>
                                <div className="flex gap-2">
                                  <input 
                                    type="text" 
                                    value={ncSearchQuery} 
                                    onChange={e => setNcSearchQuery(e.target.value)} 
                                    placeholder="Search name or email..." 
                                    className="flex-1 bg-slate-950 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:border-blue-500 outline-none"
                                  />
                                  <button 
                                    onClick={handleManualNCSearch} 
                                    disabled={isSearchingNC || !ncSearchQuery.trim()}
                                    className="px-3 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold transition-colors disabled:opacity-50"
                                  >
                                    {isSearchingNC ? <Loader2 className="w-3 h-3 animate-spin" /> : 'Search'}
                                  </button>
                                </div>
                                {ncSearchResults.length > 0 && (
                                  <div className="mt-2 space-y-2 max-h-40 overflow-y-auto custom-scrollbar">
                                    {ncSearchResults.map(res => (
                                      <div key={res.databaseId || res.id} className="p-2 bg-white/5 border border-white/10 rounded-lg flex justify-between items-center gap-2">
                                        <div className="min-w-0">
                                          <div className="text-xs font-bold text-white truncate">{res.firstName} {res.lastName}</div>
                                          <div className="text-[10px] text-slate-400 truncate">{res.eMail || res.email}</div>
                                        </div>
                                        <button 
                                          onClick={() => linkNcProfile(res.databaseId || res.id)}
                                          className="px-2 py-1 bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 rounded text-[10px] font-bold uppercase tracking-widest transition-colors shrink-0"
                                        >
                                          Link
                                        </button>
                                      </div>
                                    ))}
                                  </div>
                                )}
                                <button 
                                  onClick={() => alert("This would open a modal to create a new NowCerts profile.")}
                                  className="w-full py-2 bg-white/5 hover:bg-white/10 rounded-lg text-xs font-bold text-white transition-colors border border-white/10 mt-2"
                                >
                                  + Create New Profile
                                </button>
                            </>
                        )}
                        
                        {activeTicket.policyNumber && (
                            <div className="pt-3 border-t border-white/10">
                                <div className="text-[10px] text-slate-500 uppercase mb-1">Detected Policy</div>
                                <div className="text-sm font-bold text-white">{activeTicket.policyNumber}</div>
                                <div className="text-xs text-slate-400">{activeTicket.carrier || 'Unknown Carrier'}</div>
                            </div>
                        )}
                    </div>
                </div>

                {/* AI Automated Tasks */}
                <div>
                    <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                        <Bot className="w-3 h-3" /> AI Automations
                    </h4>
                    <div className="space-y-2">
                        {activeTicket.aiTasks.length > 0 ? activeTicket.aiTasks.map((task, i) => (
                            <div key={i} className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-3 flex items-start justify-between gap-3 group">
                                <span className="text-xs text-blue-200 leading-relaxed">{task}</span>
                                <button 
                                    onClick={() => executeAITask(task)}
                                    className="p-1.5 bg-blue-500/20 hover:bg-blue-500 text-blue-400 hover:text-white rounded-lg transition-colors shrink-0"
                                    title="Execute Task"
                                >
                                    <Play className="w-3 h-3" />
                                </button>
                            </div>
                        )) : (
                            <div className="text-xs text-slate-500 italic p-3 bg-white/5 rounded-xl border border-white/5">No automated tasks identified.</div>
                        )}
                    </div>
                </div>

                {/* Manual Action Items */}
                <div>
                    <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                        <CheckCircle2 className="w-3 h-3" /> Manual Action Items
                    </h4>
                    <div className="space-y-2">
                        {activeTicket.actionItems.length > 0 ? activeTicket.actionItems.map((item, i) => (
                            <div key={i} className="bg-slate-800/50 border border-white/5 rounded-xl p-3 flex items-start gap-3">
                                <input type="checkbox" className="mt-0.5 rounded border-white/20 bg-slate-900 text-blue-500 focus:ring-blue-500/50" />
                                <span className="text-xs text-slate-300 leading-relaxed">{item}</span>
                            </div>
                        )) : (
                            <div className="text-xs text-slate-500 italic p-3 bg-white/5 rounded-xl border border-white/5">No manual actions required.</div>
                        )}
                    </div>
                </div>

                {/* Extracted Labels */}
                <div>
                    <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                        <Tag className="w-3 h-3" /> Tags & Labels
                    </h4>
                    <div className="flex flex-wrap gap-2">
                        {activeTicket.labels.map(label => (
                            <span key={label} className="px-2 py-1 bg-white/5 border border-white/10 rounded-lg text-[10px] font-bold text-slate-300 uppercase">
                                {label}
                            </span>
                        ))}
                    </div>
                </div>

                </div>
            ) : (
                <div className="flex-1 flex items-center justify-center text-slate-500 p-6 text-center text-sm">
                    Select a ticket to view AI analysis, tasks, and NowCerts sync status.
                </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
