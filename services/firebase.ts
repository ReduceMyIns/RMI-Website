// @ts-ignore
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, initializeAuth, browserLocalPersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// @ts-ignore
import { getAnalytics, isSupported } from "firebase/analytics";

// --- CONFIGURATION ---
// Updated credentials for 'rmiaiapp'.

const firebaseConfig = {
  apiKey: "AIzaSyByfq7_z91fLfjisZk_vv07BsCDuCAnlcU",
  authDomain: "rmiaiapp.firebaseapp.com",
  projectId: "rmiaiapp",
  storageBucket: "rmiaiapp.firebasestorage.app",
  messagingSenderId: "482798010001",
  appId: "1:482798010001:web:7af50f79e003a409eac930",
  measurementId: "G-ZWC0PJ75KR"
};

// Initialize Firebase (Singleton Pattern)
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Use initializeAuth for more control over persistence, especially in iframes
export const auth = getApps().length > 0 
  ? getAuth(app) 
  : initializeAuth(app, {
      persistence: browserLocalPersistence,
    });

export const db = getFirestore(app);
export const storage = getStorage(app);

// Initialize Analytics conditionally to handle environment differences safely
let analytics: any = null;
isSupported().then(yes => {
  if (yes) {
    analytics = getAnalytics(app);
  }
}).catch(console.error);

export { analytics };