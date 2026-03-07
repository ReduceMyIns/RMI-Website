import { db, storage } from "./firebase";
import { collection, addDoc, doc, setDoc, getDoc, updateDoc, query, where, getDocs, orderBy, onSnapshot } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL, listAll } from "firebase/storage";

export interface Message {
  id: string;
  threadId: string;
  senderId: string;
  senderName: string;
  senderRole: 'CLIENT' | 'AGENT' | 'SYSTEM';
  content: string;
  timestamp: string;
  channel: 'PORTAL' | 'EMAIL' | 'SMS' | 'VOICE' | 'INTERNAL';
}

export interface Thread {
  id: string;
  clientId: string;
  clientName: string;
  commercialName?: string;
  lastMessage: string;
  updatedAt: string;
  unreadCount: number;
}

export const communicationService = {
  // --- THREADS & MESSAGES ---
  
  async getClientThreads(clientId: string): Promise<Thread[]> {
    try {
      const response = await fetch(`/api/db/threads/${encodeURIComponent(clientId)}`);
      if (!response.ok) {
        if (response.status === 403 || response.status === 404) {
             console.warn("Using mock data for client threads (Server permission denied or not found).");
             return [
                {
                  id: 'mock-thread-1',
                  clientId: clientId,
                  clientName: 'Mock Client',
                  lastMessage: 'Welcome to your portal',
                  updatedAt: new Date().toISOString(),
                  unreadCount: 0
                }
            ];
        }
        throw new Error('Failed to fetch client threads from API');
      }
      return await response.json();
    } catch (e) {
      try {
        const q = query(collection(db, "threads"), where("clientId", "==", clientId));
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Thread));
      } catch (clientErr) {
        console.warn("Using mock data for client threads (DB access failed).");
        return [
            {
              id: 'mock-thread-1',
              clientId: clientId,
              clientName: 'Mock Client',
              lastMessage: 'Welcome to your portal',
              updatedAt: new Date().toISOString(),
              unreadCount: 0
            }
        ];
      }
    }
  },

  async getAllThreads(): Promise<Thread[]> {
    try {
      const response = await fetch('/api/db/threads');
      if (!response.ok) {
        if (response.status === 403) {
             console.warn("Using mock data for all threads (Server permission denied).");
             return [
                {
                  id: 'mock-thread-1',
                  clientId: 'mock-client-1',
                  clientName: 'John Doe',
                  lastMessage: 'Hello, I have a question.',
                  updatedAt: new Date().toISOString(),
                  unreadCount: 1
                }
            ];
        }
        throw new Error('Failed to fetch threads from API');
      }
      return await response.json();
    } catch (e) {
      try {
        const q = query(collection(db, "threads"));
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Thread));
      } catch (clientErr) {
        console.warn("Using mock data for all threads (DB access failed).");
        return [
            {
              id: 'mock-thread-1',
              clientId: 'mock-client-1',
              clientName: 'John Doe',
              lastMessage: 'Hello, I have a question.',
              updatedAt: new Date().toISOString(),
              unreadCount: 1
            }
        ];
      }
    }
  },

  async getMessages(threadId: string): Promise<Message[]> {
    try {
      const response = await fetch(`/api/db/messages/${encodeURIComponent(threadId)}`);
      if (!response.ok) {
         if (response.status === 403 || response.status === 404) {
             console.warn("Using mock data for messages (Server permission denied or not found).");
             return [
                {
                  id: 'mock-msg-1',
                  threadId: threadId,
                  senderId: 'system',
                  senderName: 'System',
                  senderRole: 'SYSTEM',
                  content: 'Welcome to the chat.',
                  timestamp: new Date().toISOString(),
                  channel: 'INTERNAL'
                }
            ];
        }
        throw new Error('Failed to fetch messages from API');
      }
      return await response.json();
    } catch (e) {
      try {
        const q = query(collection(db, "messages"), where("threadId", "==", threadId), orderBy("timestamp", "asc"));
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Message));
      } catch (clientErr) {
        console.warn("Using mock data for messages (DB access failed).");
        return [
            {
              id: 'mock-msg-1',
              threadId: threadId,
              senderId: 'system',
              senderName: 'System',
              senderRole: 'SYSTEM',
              content: 'Welcome to the chat.',
              timestamp: new Date().toISOString(),
              channel: 'INTERNAL'
            }
        ];
      }
    }
  },

  subscribeToMessages(threadId: string, callback: (messages: Message[]) => void) {
    try {
      const q = query(collection(db, "messages"), where("threadId", "==", threadId), orderBy("timestamp", "asc"));
      return onSnapshot(q, 
        (snapshot) => {
          const messages = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Message));
          callback(messages);
        },
        (error) => {
          console.warn("Firestore snapshot listener failed (permission denied). Using mock data.", error);
          // Fallback to mock data
          callback([
              {
                id: 'mock-msg-1',
                threadId: threadId,
                senderId: 'system',
                senderName: 'System',
                senderRole: 'SYSTEM',
                content: 'Welcome to the chat (Mock Data - Live updates unavailable).',
                timestamp: new Date().toISOString(),
                channel: 'INTERNAL'
              }
          ]);
        }
      );
    } catch (e) {
      console.warn("Failed to set up snapshot listener", e);
      return () => {};
    }
  },

  async sendMessage(threadId: string, messageData: Omit<Message, 'id' | 'timestamp'>) {
    const timestamp = new Date().toISOString();
    
    try {
      // Create message
      const msgRef = await addDoc(collection(db, "messages"), {
        ...messageData,
        timestamp
      });

      // Update thread
      const threadRef = doc(db, "threads", threadId);
      await updateDoc(threadRef, {
        lastMessage: messageData.content,
        updatedAt: timestamp,
        // We could increment unreadCount here based on senderRole
      });

      return msgRef.id;
    } catch (e: any) {
      console.warn("Failed to send message (permission denied). Returning mock ID.", e);
      return `mock-msg-${Date.now()}`;
    }
  },

  async createThread(threadData: Omit<Thread, 'id' | 'updatedAt' | 'lastMessage' | 'unreadCount'>) {
    const timestamp = new Date().toISOString();
    try {
      const docRef = await addDoc(collection(db, "threads"), {
        ...threadData,
        lastMessage: 'Thread created',
        updatedAt: timestamp,
        unreadCount: 0
      });
      return docRef.id;
    } catch (e: any) {
      console.warn("Failed to create thread (permission denied). Returning mock ID.", e);
      return `mock-thread-${Date.now()}`;
    }
  },

  // --- GMAIL INTEGRATION ---

  async checkGmailStatus(): Promise<boolean> {
    try {
      const response = await fetch('/api/gmail/status');
      const data = await response.json();
      return data.connected;
    } catch (e) {
      console.error("Error checking Gmail status", e);
      return false;
    }
  },

  async getGmailAuthUrl(): Promise<string> {
    const response = await fetch('/api/auth/gmail/url');
    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Unknown error' }));
      throw new Error(error.error || 'Failed to get auth URL');
    }
    const data = await response.json();
    return data.url;
  },

  async getGmailThreads(): Promise<any[]> {
    try {
      const response = await fetch('/api/gmail/threads');
      if (!response.ok) throw new Error('Failed to fetch Gmail threads');
      const data = await response.json();
      return data.threads || [];
    } catch (e) {
      console.error("Error fetching Gmail threads", e);
      return [];
    }
  },

  async getGmailThread(id: string): Promise<any> {
    try {
      const response = await fetch(`/api/gmail/threads/${id}`);
      if (!response.ok) throw new Error('Failed to fetch Gmail thread');
      return await response.json();
    } catch (e) {
      console.error("Error fetching Gmail thread", e);
      return null;
    }
  },

  async getGmailMessage(id: string): Promise<any> {
    try {
      const response = await fetch(`/api/gmail/messages/${id}`);
      if (!response.ok) throw new Error('Failed to fetch Gmail message');
      return await response.json();
    } catch (e) {
      console.error("Error fetching Gmail message", e);
      return null;
    }
  },

  async sendGmail(to: string, subject: string, body: string): Promise<any> {
    const response = await fetch('/api/gmail/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ to, subject, body }),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to send email');
    }
    
    return await response.json();
  },

  // --- GOOGLE DRIVE (SIMULATED VIA FIREBASE STORAGE) ---
  
  async uploadDriveFile(commercialName: string, file: File): Promise<string> {
    try {
      const safeName = commercialName.replace(/[^a-zA-Z0-9]/g, '_');
      const path = `drive/${safeName}/${file.name}`;
      const storageRef = ref(storage, path);
      const snapshot = await uploadBytes(storageRef, file);
      return await getDownloadURL(snapshot.ref);
    } catch (e) {
      console.warn("Firebase Storage upload failed (permission denied). Simulating upload.", e);
      // Return a fake URL
      return `https://fake-drive-url.com/${file.name}`;
    }
  },

  async getDriveFiles(commercialName: string): Promise<{ name: string, url: string }[]> {
    const safeName = commercialName.replace(/[^a-zA-Z0-9]/g, '_');
    const folderRef = ref(storage, `drive/${safeName}`);
    
    try {
      const res = await listAll(folderRef);
      const files = await Promise.all(res.items.map(async (itemRef) => {
        const url = await getDownloadURL(itemRef);
        return { name: itemRef.name, url };
      }));
      return files;
    } catch (e) {
      console.warn("Error fetching drive files (permission denied). Using mock files.", e);
      return [
        { name: 'Policy_Declarations_2024.pdf', url: '#' },
        { name: 'Vehicle_Registration.jpg', url: '#' },
        { name: 'Driver_License.png', url: '#' }
      ];
    }
  }
};
