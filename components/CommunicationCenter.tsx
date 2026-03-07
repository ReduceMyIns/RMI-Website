import React, { useState, useEffect, useRef } from 'react';
import { 
  MessageSquare, Mail, Phone, MessageCircle, Calendar, 
  User, FileText, Search, Plus, Send, Bot, Clock, 
  CheckCircle2, AlertCircle, RefreshCw, Paperclip, 
  MoreVertical, Shield, Briefcase, Lock, Network, Folder, Download, Upload
} from 'lucide-react';
import { GoogleGenAI } from '@google/genai';
import { communicationService, Message, Thread } from '../services/communicationService';
import { dbService } from '../services/dbService';

type Channel = 'PORTAL' | 'EMAIL' | 'SMS' | 'VOICE' | 'INTERNAL';
type TaskType = 'SERVICE' | 'MANAGEMENT';

interface Task {
  id: string;
  title: string;
  assignee: string;
  calendar: string;
  date: Date;
  status: 'PENDING' | 'COMPLETED';
}

export default function CommunicationCenter() {
  const [threads, setThreads] = useState<Thread[]>([]);
  const [activeThreadId, setActiveThreadId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [selectedChannel, setSelectedChannel] = useState<Channel>('PORTAL');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [driveFiles, setDriveFiles] = useState<{name: string, url: string}[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  
  const [isGmailConnected, setIsGmailConnected] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const activeThread = threads.find(t => t.id === activeThreadId);

  useEffect(() => {
    loadThreads();
    checkGmailConnection();
  }, []);

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

  useEffect(() => {
    if (activeThreadId) {
      const thread = threads.find(t => t.id === activeThreadId);
      if (thread && thread.id.length > 16) { // Heuristic: Gmail IDs are long hex strings, DB IDs are usually UUIDs or shorter
         // It's likely a Gmail thread
         loadGmailMessages(thread.id);
      } else {
         // It's a DB thread
         const unsubscribe = communicationService.subscribeToMessages(activeThreadId, (msgs) => {
           setMessages(msgs);
           setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
         });
         return () => unsubscribe();
      }
    }
  }, [activeThreadId]);

  const loadGmailMessages = async (threadId: string) => {
    try {
      // Fetch full thread details from Gmail
      // We need a new service method for getGmailThreadDetails because getGmailMessage gets a single message
      // But for now, let's assume we fetch the latest message content or list messages in thread
      // Actually, the Gmail API 'threads.get' returns all messages in the thread.
      // Let's update communicationService to support this better, but for now we can reuse getGmailMessage if it was actually fetching thread details?
      // Wait, getGmailMessage fetches 'users.messages.get'. We need 'users.threads.get'.
      
      // Let's implement a quick fetch here or update service.
      // Updating service is cleaner.
      const threadDetails = await communicationService.getGmailThread(threadId);
      
      if (threadDetails && threadDetails.messages) {
        const mappedMessages: Message[] = threadDetails.messages.map((m: any) => {
           const headers = m.payload.headers;
           const from = headers.find((h: any) => h.name === 'From')?.value || '';
           const isMe = from.includes('service@reducemyinsurance.net') || from.includes('me'); // Simplified check
           
           return {
             id: m.id,
             threadId: threadId,
             senderId: isMe ? 'agent' : 'client',
             senderName: from.split('<')[0].trim(),
             senderRole: isMe ? 'AGENT' : 'CLIENT',
             content: m.snippet, // Full body parsing is complex (multipart), using snippet for now
             timestamp: new Date(parseInt(m.internalDate)).toISOString(),
             channel: 'EMAIL'
           };
        });
        setMessages(mappedMessages);
      }
    } catch (e) {
      console.error("Failed to load Gmail messages", e);
    }
  };

  useEffect(() => {
    if (activeThread) {
      loadDriveFiles(activeThread.commercialName || activeThread.clientName);
    }
  }, [activeThread]);

  const loadThreads = async () => {
    setIsLoading(true);
    try {
      // 1. Fetch DB Threads
      const dbThreads = await communicationService.getAllThreads();
      
      // 2. Fetch Gmail Threads (if connected)
      let gmailThreads: Thread[] = [];
      if (isGmailConnected) {
        try {
          const gThreads = await communicationService.getGmailThreads();
          // Map Gmail threads to our Thread interface
          gmailThreads = await Promise.all(gThreads.map(async (gt: any) => {
            // Fetch full message to get details
            const details = await communicationService.getGmailMessage(gt.id);
            const headers = details.payload.headers;
            const subject = headers.find((h: any) => h.name === 'Subject')?.value || '(No Subject)';
            const from = headers.find((h: any) => h.name === 'From')?.value || '';
            const date = headers.find((h: any) => h.name === 'Date')?.value;
            
            // Extract name/email from "From" header
            const nameMatch = from.match(/^"?([^"<]+)"?\s*<(.+)>$/);
            const clientName = nameMatch ? nameMatch[1].trim() : from;
            const clientId = nameMatch ? nameMatch[2].trim() : from; // Use email as ID

            return {
              id: gt.id,
              clientId: clientId,
              clientName: clientName,
              commercialName: '', // Gmail threads don't have this context initially
              lastMessage: `📧 ${subject} - ${details.snippet}`,
              updatedAt: date ? new Date(date).toISOString() : new Date().toISOString(),
              unreadCount: 0 // Could calculate from labels 'UNREAD'
            };
          }));
        } catch (e) {
          console.error("Failed to load Gmail threads", e);
        }
      }

      // 3. Merge and Sort
      const allThreads = [...dbThreads, ...gmailThreads];
      allThreads.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
      
      setThreads(allThreads);
      
      if (allThreads.length > 0 && !activeThreadId) {
        setActiveThreadId(allThreads[0].id);
      }
    } catch (e) {
      console.error("Failed to load threads", e);
    } finally {
      setIsLoading(false);
    }
  };

  const loadDriveFiles = async (folderName: string) => {
    try {
      const files = await communicationService.getDriveFiles(folderName);
      setDriveFiles(files);
    } catch (e) {
      console.error("Failed to load drive files", e);
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || !activeThreadId || !activeThread) return;

    try {
      // If sending via EMAIL, use Gmail API
      if (selectedChannel === 'EMAIL') {
        if (!isGmailConnected) {
          alert("Please connect Gmail to send emails.");
          return;
        }

        // Try to find client email
        let clientEmail = '';
        // Check if clientId looks like an email
        if (activeThread.clientId.includes('@')) {
          clientEmail = activeThread.clientId;
        } else {
          // Try to fetch lead/user details
          try {
            const leads = await dbService.getAllLeads();
            const lead = leads.find((l: any) => l.id === activeThread.clientId);
            if (lead && lead.email) {
              clientEmail = lead.email;
            } else {
              // Fallback: Check users collection
              const user = await dbService.getUserProfile(activeThread.clientId);
              if (user && user.email) {
                clientEmail = user.email;
              }
            }
          } catch (e) {
            console.warn("Failed to lookup client email", e);
          }
        }

        if (!clientEmail) {
          // Prompt for email if not found
          const manualEmail = prompt("Client email not found. Please enter email address:");
          if (!manualEmail) return;
          clientEmail = manualEmail;
        }

        await communicationService.sendGmail(
          clientEmail,
          `Message from ReduceMyInsurance.Net regarding ${activeThread.commercialName || 'your policy'}`,
          inputMessage
        );
      }

      await communicationService.sendMessage(activeThreadId, {
        threadId: activeThreadId,
        senderId: 'agent',
        senderName: 'Agent',
        senderRole: selectedChannel === 'INTERNAL' ? 'SYSTEM' : 'AGENT',
        content: inputMessage,
        channel: selectedChannel
      });
      setInputMessage('');
      loadThreads(); // Refresh threads to update lastMessage and updatedAt
    } catch (e: any) {
      console.error("Failed to send message", e);
      alert(`Failed to send message: ${e.message}`);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !activeThread) return;
    
    setIsUploading(true);
    try {
      const folderName = activeThread.commercialName || activeThread.clientName;
      const url = await communicationService.uploadDriveFile(folderName, file);
      
      // Also send a message about the upload
      await communicationService.sendMessage(activeThreadId!, {
        threadId: activeThreadId!,
        senderId: 'agent',
        senderName: 'Agent',
        senderRole: 'AGENT',
        content: `Uploaded file to Google Drive: ${file.name}`,
        channel: 'PORTAL'
      });
      
      loadDriveFiles(folderName);
      alert("File uploaded to Google Drive successfully!");
    } catch (e) {
      console.error("Upload failed", e);
      alert("Failed to upload file.");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleGenerateAIResponse = async () => {
    if (!activeThread) return;
    setIsGenerating(true);
    
    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) throw new Error("Gemini API key not found");

      const ai = new GoogleGenAI({ apiKey });
      
      const context = messages.map(m => `${m.senderRole} (${m.channel}): ${m.content}`).join('\n');
      const prompt = `
        You are an AI assistant for ReduceMyInsurance.Net. 
        Research the following conversation history and draft a contextual, helpful response to the client.
        Consider past preferences, NowCerts data, and Google Drive files (simulated).
        
        Conversation History:
        ${context}
        
        Draft a professional response:
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
      });

      setInputMessage(response.text || '');
      setSelectedChannel('PORTAL'); // Default to portal for AI drafts
    } catch (error) {
      console.error("AI Generation Error:", error);
      alert("Failed to generate AI response.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCreateTask = async (type: TaskType) => {
    const title = prompt("Enter task description:");
    if (!title) return;

    const assignee = type === 'SERVICE' ? 'sherry@reducemyinsurance.net' : 'chenderson@reducemyinsurance.net';
    
    const newTask: Task = {
      id: Date.now().toString(),
      title,
      assignee,
      calendar: 'service@reducemyinsurance.net',
      date: new Date(Date.now() + 86400000), // Tomorrow
      status: 'PENDING'
    };

    setTasks([...tasks, newTask]);
    
    // Add system message to thread
    if (activeThreadId) {
      await communicationService.sendMessage(activeThreadId, {
        threadId: activeThreadId,
        senderId: 'system',
        senderName: 'System',
        senderRole: 'SYSTEM',
        content: `Task Created: "${title}". Scheduled on Google Calendar for ${assignee} via service@reducemyinsurance.net.`,
        channel: 'INTERNAL'
      });
    }
  };

  const getChannelIcon = (channel: Channel) => {
    switch (channel) {
      case 'PORTAL': return <MessageSquare className="w-4 h-4" />;
      case 'EMAIL': return <Mail className="w-4 h-4" />;
      case 'SMS': return <MessageCircle className="w-4 h-4" />;
      case 'VOICE': return <Phone className="w-4 h-4" />;
      case 'INTERNAL': return <Lock className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 flex flex-col pt-24 pb-8 px-4 lg:px-8">
      <div className="max-w-7xl w-full mx-auto flex-1 flex flex-col">
        
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
              <Network className="w-8 h-8 text-blue-400" />
              Agency Hub: Communication Center
            </h1>
            <p className="text-slate-400 mt-1">Omnichannel client communications, AI research, and automated task scheduling.</p>
          </div>
          <div>
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
          </div>
        </div>

        <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-6 min-h-[600px]">
          
          {/* Left Sidebar: Threads */}
          <div className="glass rounded-2xl border border-white/10 flex flex-col overflow-hidden">
            <div className="p-4 border-b border-white/10 bg-white/5">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Search clients, policies..." 
                  className="w-full bg-slate-900 border border-white/10 rounded-xl pl-9 pr-4 py-2 text-sm text-white focus:border-blue-500 outline-none"
                />
              </div>
            </div>
            <div className="flex-1 overflow-y-auto">
              {threads.map(thread => (
                <button
                  key={thread.id}
                  onClick={() => setActiveThreadId(thread.id)}
                  className={`w-full text-left p-4 border-b border-white/5 transition-colors ${
                    activeThreadId === thread.id ? 'bg-blue-500/10 border-l-2 border-l-blue-500' : 'hover:bg-white/5'
                  }`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <span className="font-semibold text-white">{thread.clientName}</span>
                    <span className="text-[10px] text-slate-400">
                      {new Date(thread.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <div className="text-xs text-blue-400 mb-2">{thread.commercialName || 'Personal'}</div>
                  <p className="text-sm text-slate-400 truncate">{thread.lastMessage}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Main Chat Area */}
          <div className="lg:col-span-2 glass rounded-2xl border border-white/10 flex flex-col overflow-hidden">
            {activeThread ? (
              <>
                {/* Chat Header */}
                <div className="p-4 border-b border-white/10 bg-white/5 flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-bold text-white">{activeThread.clientName}</h2>
                    <div className="flex items-center gap-3 text-sm text-slate-400 mt-1">
                      <span className="flex items-center gap-1"><Briefcase className="w-3 h-3" /> {activeThread.commercialName || 'Personal'}</span>
                      <button className="text-blue-400 hover:text-blue-300 text-xs flex items-center gap-1">
                        <RefreshCw className="w-3 h-3" /> Re-assign
                      </button>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => handleCreateTask('SERVICE')} className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white text-xs rounded-lg border border-white/10 transition-colors flex items-center gap-1">
                      <Calendar className="w-3 h-3" /> Service Task
                    </button>
                    <button onClick={() => handleCreateTask('MANAGEMENT')} className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white text-xs rounded-lg border border-white/10 transition-colors flex items-center gap-1">
                      <Calendar className="w-3 h-3" /> Mgmt Task
                    </button>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages.map(msg => (
                    <div key={msg.id} className={`flex flex-col ${msg.senderRole === 'AGENT' || msg.senderRole === 'SYSTEM' ? 'items-end' : 'items-start'}`}>
                      <div className="flex items-center gap-2 mb-1 px-1">
                        <span className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-1">
                          {getChannelIcon(msg.channel)} {msg.channel} • {msg.senderRole}
                        </span>
                        <span className="text-[10px] text-slate-500">
                          {new Date(msg.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                      <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                        msg.senderRole === 'AGENT' 
                          ? msg.channel === 'INTERNAL' ? 'bg-amber-500/20 text-amber-100 border border-amber-500/30 rounded-tr-sm' : 'bg-blue-600 text-white rounded-tr-sm'
                          : msg.senderRole === 'SYSTEM'
                            ? 'bg-slate-800 text-slate-300 border border-white/10 rounded-tl-sm w-full text-center text-xs italic'
                            : 'bg-slate-800 text-slate-200 border border-white/10 rounded-tl-sm'
                      }`}>
                        {msg.content}
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="p-4 border-t border-white/10 bg-slate-900/50">
                  <div className="flex items-center gap-2 mb-3">
                    {(['PORTAL', 'EMAIL', 'SMS', 'INTERNAL'] as Channel[]).map(ch => (
                      <button
                        key={ch}
                        onClick={() => setSelectedChannel(ch)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors ${
                          selectedChannel === ch 
                            ? ch === 'INTERNAL' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' : 'bg-blue-500 text-white'
                            : 'bg-slate-800 text-slate-400 hover:bg-slate-700 border border-white/5'
                        }`}
                      >
                        {getChannelIcon(ch)} {ch}
                      </button>
                    ))}
                    <div className="flex-1" />
                    <button 
                      onClick={handleGenerateAIResponse}
                      disabled={isGenerating}
                      className="px-3 py-1.5 bg-purple-500/20 hover:bg-purple-500/30 text-purple-400 border border-purple-500/30 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors disabled:opacity-50"
                    >
                      {isGenerating ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Bot className="w-3 h-3" />}
                      AI Research & Draft
                    </button>
                  </div>
                  <div className="flex gap-2">
                    <textarea
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendMessage(); } }}
                      placeholder={`Type a ${selectedChannel.toLowerCase()} message...`}
                      className="flex-1 bg-slate-950 border border-white/10 rounded-xl p-3 text-sm text-white focus:border-blue-500 outline-none resize-none h-20"
                    />
                    <button 
                      onClick={handleSendMessage}
                      className="bg-blue-600 hover:bg-blue-500 text-white p-3 rounded-xl transition-colors flex items-center justify-center h-20 w-20"
                    >
                      <Send className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-slate-500">
                Select a conversation to start
              </div>
            )}
          </div>

          {/* Right Sidebar: Context & Tasks */}
          <div className="glass rounded-2xl border border-white/10 flex flex-col overflow-hidden">
            <div className="p-4 border-b border-white/10 bg-white/5">
              <h3 className="font-bold text-white flex items-center gap-2">
                <Bot className="w-4 h-4 text-blue-400" /> AI Context & Tasks
              </h3>
            </div>
            
            <div className="p-4 overflow-y-auto flex-1 space-y-6">
              {/* AI Insights */}
              <div>
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">NowCerts Auto-Match</h4>
                <div className="bg-slate-800/50 border border-white/5 rounded-xl p-3 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Client ID:</span>
                    <span className="text-white font-mono">{activeThread?.clientId || '--'}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Active Policies:</span>
                    <span className="text-white">2 (Auto, Home)</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Risk Score:</span>
                    <span className="text-emerald-400">Low</span>
                  </div>
                </div>
              </div>

              {/* Scheduled Tasks */}
              <div>
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center justify-between">
                  Scheduled Tasks
                  <span className="bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded-full text-[10px]">Google Calendar</span>
                </h4>
                <div className="space-y-3">
                  {tasks.map(task => (
                    <div key={task.id} className="bg-slate-800/50 border border-white/5 rounded-xl p-3">
                      <div className="font-medium text-sm text-white mb-1">{task.title}</div>
                      <div className="text-xs text-slate-400 flex items-center gap-1 mb-1">
                        <User className="w-3 h-3" /> {task.assignee.split('@')[0]}
                      </div>
                      <div className="text-xs text-slate-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {task.date.toLocaleDateString()}
                      </div>
                    </div>
                  ))}
                  {tasks.length === 0 && (
                    <div className="text-sm text-slate-500 text-center py-4">No pending tasks</div>
                  )}
                </div>
              </div>

              {/* Google Drive Files */}
              <div>
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center justify-between">
                  Google Drive Files
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                    className="bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 px-2 py-0.5 rounded-full text-[10px] transition-colors flex items-center gap-1"
                  >
                    {isUploading ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Upload className="w-3 h-3" />} Upload
                  </button>
                  <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileUpload} />
                </h4>
                <div className="space-y-2">
                  {driveFiles.length === 0 ? (
                    <div className="text-xs text-slate-500 text-center py-4">No files found</div>
                  ) : (
                    driveFiles.map((file, idx) => (
                      <a 
                        key={idx}
                        href={file.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 p-2 bg-slate-800/50 hover:bg-slate-800 border border-white/5 rounded-xl transition-colors group"
                      >
                        <FileText className="w-4 h-4 text-emerald-400" />
                        <span className="text-xs text-white truncate flex-1">{file.name}</span>
                        <Download className="w-3 h-3 text-slate-500 group-hover:text-emerald-400" />
                      </a>
                    ))
                  )}
                </div>
              </div>

              {/* Long Term Memory */}
              <div>
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Long Term Memory</h4>
                <div className="bg-slate-800/50 border border-white/5 rounded-xl p-3 text-xs text-slate-300 space-y-2">
                  <p>• Prefers email communication.</p>
                  <p>• Has a teenage driver (added 2023).</p>
                  <p>• Renewals typically handled in August.</p>
                  <p className="text-blue-400 mt-2">All chats synced to Drive & NowCerts.</p>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
