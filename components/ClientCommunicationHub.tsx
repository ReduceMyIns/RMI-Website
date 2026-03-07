import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, Send, Paperclip, FileText, Download, Upload, Loader2, Folder } from 'lucide-react';
import { communicationService, Message, Thread } from '../services/communicationService';

interface ClientCommunicationHubProps {
  user: any;
}

export const ClientCommunicationHub: React.FC<ClientCommunicationHubProps> = ({ user }) => {
  const [threads, setThreads] = useState<Thread[]>([]);
  const [activeThreadId, setActiveThreadId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  
  // Google Drive (Simulated)
  const [driveFiles, setDriveFiles] = useState<{name: string, url: string}[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const commercialName = user.commercialName || `${user.firstName} ${user.lastName}`;

  useEffect(() => {
    loadThreads();
    loadDriveFiles();
  }, [user]);

  useEffect(() => {
    if (activeThreadId) {
      const unsubscribe = communicationService.subscribeToMessages(activeThreadId, (msgs) => {
        setMessages(msgs);
        setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
      });
      return () => unsubscribe();
    }
  }, [activeThreadId]);

  const loadThreads = async () => {
    setIsLoading(true);
    try {
      const data = await communicationService.getClientThreads(user.uid || user.email);
      setThreads(data);
      if (data.length > 0) {
        setActiveThreadId(data[0].id);
      } else {
        // Create a default thread if none exists
        const newThreadId = await communicationService.createThread({
          clientId: user.uid || user.email,
          clientName: `${user.firstName} ${user.lastName}`,
          commercialName: user.commercialName
        });
        setThreads([{
          id: newThreadId,
          clientId: user.uid || user.email,
          clientName: `${user.firstName} ${user.lastName}`,
          commercialName: user.commercialName,
          lastMessage: 'Thread created',
          updatedAt: new Date().toISOString(),
          unreadCount: 0
        }]);
        setActiveThreadId(newThreadId);
      }
    } catch (e) {
      console.error("Failed to load threads", e);
    } finally {
      setIsLoading(false);
    }
  };

  const loadDriveFiles = async () => {
    try {
      const files = await communicationService.getDriveFiles(commercialName);
      setDriveFiles(files);
    } catch (e) {
      console.error("Failed to load drive files", e);
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || !activeThreadId) return;
    setIsSending(true);
    try {
      await communicationService.sendMessage(activeThreadId, {
        threadId: activeThreadId,
        senderId: user.uid || user.email,
        senderName: `${user.firstName} ${user.lastName}`,
        senderRole: 'CLIENT',
        content: inputMessage,
        channel: 'PORTAL'
      });
      setInputMessage('');
    } catch (e) {
      console.error("Failed to send message", e);
    } finally {
      setIsSending(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setIsUploading(true);
    try {
      const url = await communicationService.uploadDriveFile(commercialName, file);
      
      // Also send a message about the upload
      if (activeThreadId) {
        await communicationService.sendMessage(activeThreadId, {
          threadId: activeThreadId,
          senderId: user.uid || user.email,
          senderName: `${user.firstName} ${user.lastName}`,
          senderRole: 'CLIENT',
          content: `Uploaded file to Google Drive: ${file.name}`,
          channel: 'PORTAL'
        });
      }
      
      loadDriveFiles();
      alert("File uploaded to Google Drive successfully!");
    } catch (e) {
      console.error("Upload failed", e);
      alert("Failed to upload file.");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  if (isLoading) {
    return <div className="flex justify-center p-12"><Loader2 className="w-8 h-8 animate-spin text-blue-500" /></div>;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-[600px]">
      {/* Chat Area */}
      <div className="lg:col-span-2 glass-card border border-white/5 rounded-3xl flex flex-col overflow-hidden">
        <div className="p-6 border-b border-white/10 bg-white/5">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-blue-400" />
            Agency Communication
          </h2>
          <p className="text-sm text-slate-400">Chat directly with your agent or AI assistant.</p>
        </div>
        
        <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex flex-col ${msg.senderRole === 'CLIENT' ? 'items-end' : 'items-start'}`}>
              <div className="flex items-center gap-2 mb-1 px-1">
                <span className="text-[10px] font-bold text-slate-500 uppercase">{msg.senderName}</span>
                <span className="text-[10px] text-slate-500">{new Date(msg.timestamp).toLocaleTimeString()}</span>
              </div>
              <div className={`max-w-[80%] p-4 rounded-2xl text-sm ${
                msg.senderRole === 'CLIENT' 
                  ? 'bg-blue-600 text-white rounded-tr-sm'
                  : 'bg-slate-800 text-slate-200 border border-white/10 rounded-tl-sm'
              }`}>
                {msg.content}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <div className="p-4 border-t border-white/10 bg-slate-900/50">
          <div className="flex gap-2">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') handleSendMessage(); }}
              placeholder="Type your message..."
              className="flex-1 bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-blue-500 outline-none"
            />
            <button 
              onClick={handleSendMessage}
              disabled={isSending || !inputMessage.trim()}
              className="bg-blue-600 hover:bg-blue-500 text-white px-6 rounded-xl transition-colors flex items-center justify-center disabled:opacity-50"
            >
              {isSending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Google Drive Area */}
      <div className="glass-card border border-white/5 rounded-3xl flex flex-col overflow-hidden">
        <div className="p-6 border-b border-white/10 bg-white/5 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Folder className="w-5 h-5 text-emerald-400" />
              Google Drive
            </h2>
            <p className="text-xs text-slate-400 mt-1">Folder: {commercialName}</p>
          </div>
          <button 
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="p-2 bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 rounded-lg transition-colors"
            title="Upload File"
          >
            {isUploading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Upload className="w-5 h-5" />}
          </button>
          <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileUpload} />
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
          {driveFiles.length === 0 ? (
            <div className="text-center py-12 text-slate-500 text-sm">
              No files in your Google Drive folder yet.
            </div>
          ) : (
            driveFiles.map((file, idx) => (
              <a 
                key={idx}
                href={file.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 bg-white/5 hover:bg-white/10 border border-white/5 rounded-xl transition-colors group"
              >
                <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-400">
                  <FileText className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-white truncate">{file.name}</div>
                </div>
                <Download className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 transition-colors" />
              </a>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
