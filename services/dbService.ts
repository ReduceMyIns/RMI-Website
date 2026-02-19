
import { db, storage } from "./firebase";
import { collection, addDoc, doc, setDoc, getDoc, updateDoc, query, where, getDocs, orderBy, deleteDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { KnowledgeArticle } from "../types";

export const dbService = {
  /**
   * Upload a base64 image/video string to Firebase Storage
   */
  async uploadBase64(base64Data: string, path: string): Promise<string> {
    try {
      // Robust Base64 to Blob conversion
      const dataUri = base64Data.startsWith('data:') ? base64Data : `data:image/jpeg;base64,${base64Data}`;
      const response = await fetch(dataUri);
      const blob = await response.blob();
      
      const storageRef = ref(storage, path);
      const snapshot = await uploadBytes(storageRef, blob);
      return await getDownloadURL(snapshot.ref);
    } catch (error) {
      console.error("Upload failed", error);
      throw error;
    }
  },

  /**
   * Save User Profile linked to Auth UID
   */
  async saveUserProfile(uid: string, data: any) {
    try {
      await setDoc(doc(db, "users", uid), {
        ...data,
        updatedAt: new Date().toISOString()
      }, { merge: true });
    } catch (e) {
      // Log warning instead of error for permission issues to avoid alarming users/logs
      // This happens if security rules prevent users from writing to their own profile doc in certain states
      console.warn("Error saving user profile (likely permission issue):", e);
    }
  },

  /**
   * Get User Profile
   */
  async getUserProfile(uid: string): Promise<any> {
    try {
      const docRef = doc(db, "users", uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return docSnap.data();
      }
      return null;
    } catch (e) {
      return null;
    }
  },

  /**
   * Save a new Quote Request (Lead)
   */
  async saveQuoteRequest(data: any) {
    try {
      // Attempt to save. If rules require auth, this will fail if not logged in.
      // The frontend should handle anonymous login before calling this.
      const docRef = await addDoc(collection(db, "leads"), {
        ...data,
        createdAt: new Date().toISOString()
      });
      return docRef.id;
    } catch (e) {
      console.error("Error saving quote", e);
      throw e;
    }
  },

  /**
   * Update an existing Lead
   */
  async updateLead(leadId: string, updates: any) {
    try {
      const docRef = doc(db, "leads", leadId);
      await updateDoc(docRef, updates);
    } catch (e) {
      console.error("Error updating lead", e);
      throw e;
    }
  },

  /**
   * Find an existing lead to pre-fill data
   */
  async findExistingLead(email: string, phone: string): Promise<any> {
    try {
      const leadsRef = collection(db, "leads");
      
      let q = query(leadsRef, where("email", "==", email), orderBy("createdAt", "desc"));
      let snapshot = await getDocs(q);

      if (snapshot.empty && phone) {
         const cleanPhone = phone.replace(/\D/g, '');
         q = query(leadsRef, where("phone", "==", phone), orderBy("createdAt", "desc"));
         snapshot = await getDocs(q);
      }

      if (!snapshot.empty) {
        return { id: snapshot.docs[0].id, ...snapshot.docs[0].data() };
      }
      return null;
    } catch (e: any) {
      // Suppress permission-denied errors.
      if (e.code === 'permission-denied') {
          console.warn("Skipping lead search: Insufficient permissions (expected for guest users).");
      } else {
          console.error("Error searching existing leads", e);
      }
      return null;
    }
  },

  /**
   * Save AI Tool Interaction as a Lead/Log
   */
  async saveToolInteraction(userData: any, toolName: string, inputData: any, outputData: any) {
    try {
      await addDoc(collection(db, "leads"), {
        ...userData,
        type: `AI Tool - ${toolName}`,
        source: 'AI Toolkit',
        inputData: inputData,
        outputData: outputData,
        createdAt: new Date().toISOString()
      });
    } catch (e) {
      console.error("Error saving tool interaction", e);
    }
  },

  /**
   * Save Inspection Report
   */
  async saveInspection(data: any, userId?: string) {
    try {
      const docRef = await addDoc(collection(db, "inspections"), {
        ...data,
        userId: userId || 'anonymous',
        createdAt: new Date().toISOString()
      });
      return docRef.id;
    } catch (e) {
      console.error("Error saving inspection", e);
      throw e;
    }
  },

  /**
   * Save Course Completion for Discount
   */
  async saveCourseCompletion(data: any) {
    try {
      const docRef = await addDoc(collection(db, "course_completions"), {
        ...data,
        createdAt: new Date().toISOString()
      });
      return docRef.id;
    } catch (e) {
      console.error("Error saving course completion", e);
      throw e;
    }
  },

  // --- KNOWLEDGE BASE FUNCTIONS ---

  async saveKnowledgeArticle(article: Partial<KnowledgeArticle>) {
    try {
        const cleanArticle = Object.fromEntries(
            Object.entries(article).filter(([_, v]) => v !== undefined)
        );

        const payload = {
            ...cleanArticle,
            updatedAt: new Date().toISOString()
        };
        
        if (article.id) {
            await setDoc(doc(db, "knowledge_base", article.id), payload, { merge: true });
            return article.id;
        } else {
            const docRef = await addDoc(collection(db, "knowledge_base"), {
                ...payload,
                createdAt: new Date().toISOString()
            });
            return docRef.id;
        }
    } catch (e) {
        console.error("Save Article Error", e);
        throw e;
    }
  },

  async getKnowledgeArticles() {
    try {
        const q = query(collection(db, "knowledge_base"), orderBy("createdAt", "desc"));
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as KnowledgeArticle));
    } catch (e) {
        console.error("Get Articles Error", e);
        return [];
    }
  },

  async deleteKnowledgeArticle(id: string) {
      try {
          await deleteDoc(doc(db, "knowledge_base", id));
      } catch (e) {
          console.error("Delete Article Error", e);
      }
  },

  // --- ADMIN FUNCTIONS ---

  async getAllLeads() {
    try {
        const q = query(collection(db, "leads"), orderBy("createdAt", "desc"));
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (e: any) {
        if (e.code === 'permission-denied') {
            console.warn("Get Leads: Permission denied. Ensure you are authenticated as admin.");
            return [];
        }
        console.error("Get Leads Error", e);
        return [];
    }
  },

  async getAllInspections() {
    try {
        const q = query(collection(db, "inspections"), orderBy("createdAt", "desc"));
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (e: any) {
        if (e.code === 'permission-denied') {
            console.warn("Get Inspections: Permission denied.");
            return [];
        }
        console.error("Get Inspections Error", e);
        return [];
    }
  },

  async getAllUsers() {
    try {
        const snapshot = await getDocs(collection(db, "users"));
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (e: any) {
        if (e.code === 'permission-denied') {
            console.warn("Get Users: Permission denied.");
            return [];
        }
        console.error("Get Users Error", e);
        return [];
    }
  }
};
