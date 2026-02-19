
import React, { useState } from 'react';
import { Mail, Lock, User, Shield, Loader2, ArrowRight, Zap, Info, LogIn } from 'lucide-react';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { auth } from '../services/firebase';
import { dbService } from '../services/dbService';

interface PortalAuthProps {
  onAuthenticated: (client: any) => void;
}

const PortalAuth: React.FC<PortalAuthProps> = ({ onAuthenticated }) => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const formatPhoneNumber = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 3) return numbers;
    if (numbers.length <= 6) return `${numbers.slice(0, 3)}-${numbers.slice(3)}`;
    return `${numbers.slice(0, 3)}-${numbers.slice(3, 6)}-${numbers.slice(6, 10)}`;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    if (formatted.length <= 12) setPhone(formatted);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    
    setIsLoading(true);
    setError('');

    try {
      let userCredential;
      let profile;

      if (isRegistering) {
        userCredential = await createUserWithEmailAndPassword(auth, email, password);
        
        const newProfile = {
          firstName,
          lastName,
          email,
          phone,
          role: 'client'
        };

        // Create initial profile in Firestore
        await dbService.saveUserProfile(userCredential.user.uid, newProfile);
        
        // Use local data for immediate feedback (Optimistic Update)
        profile = newProfile;
      } else {
        userCredential = await signInWithEmailAndPassword(auth, email, password);
        // Fetch profile data from DB for existing users
        profile = await dbService.getUserProfile(userCredential.user.uid);
      }
      
      const userData = {
        ...profile,
        uid: userCredential.user.uid,
        email: userCredential.user.email
      };

      // Persist to session storage for ClientDashboard to pick up immediately
      sessionStorage.setItem('rmi_user', JSON.stringify(userData));
      
      onAuthenticated(userData);

    } catch (err: any) {
      if (err.code === 'auth/email-already-in-use') {
        setError("Account already exists. Please switch to 'Sign In'.");
      } else if (err.code === 'auth/invalid-credential' || err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
        setError("Invalid email or password.");
      } else if (err.code === 'auth/weak-password') {
        setError("Password should be at least 6 characters.");
      } else {
        console.error("Auth Error", err);
        setError(err.message || "Authentication failed. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto py-12 md:py-20 px-4 md:px-6 animate-in fade-in slide-in-from-bottom-8 duration-700">
      <div className="glass-card rounded-[2.5rem] md:rounded-[3.5rem] p-6 md:p-14 space-y-8 md:space-y-10 border-blue-500/20 shadow-[0_0_80px_rgba(37,99,235,0.15)] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 blur-[60px] rounded-full"></div>
        
        <div className="text-center space-y-4 relative z-10">
          <div className="inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20 bg-blue-600 rounded-[1.5rem] md:rounded-[2rem] shadow-xl shadow-blue-500/30 mb-2">
            <Shield className="w-8 h-8 md:w-10 md:h-10 text-white" />
          </div>
          <h2 className="text-2xl md:text-3xl font-heading font-bold text-white tracking-tight leading-tight">Secure Portal Access</h2>
          <p className="text-xs md:text-sm text-slate-400 max-w-xs mx-auto">Manage policies, view inspections, and connect with agents.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
          <div className="flex bg-white/5 p-1 rounded-xl border border-white/10 mb-6">
             <button
               type="button"
               onClick={() => { setIsRegistering(false); setError(''); }}
               className={`flex-1 py-3 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${!isRegistering ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}
             >
               Sign In
             </button>
             <button
               type="button"
               onClick={() => { setIsRegistering(true); setError(''); }}
               className={`flex-1 py-3 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${isRegistering ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}
             >
               Register
             </button>
          </div>

          {isRegistering && (
            <div className="grid grid-cols-2 gap-4 animate-in slide-in-from-right">
               <div className="space-y-1">
                  <input 
                    placeholder="First Name" 
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl outline-none focus:border-blue-500 text-white text-sm"
                  />
               </div>
               <div className="space-y-1">
                  <input 
                    placeholder="Last Name" 
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl outline-none focus:border-blue-500 text-white text-sm"
                  />
               </div>
               <div className="col-span-2">
                  <input 
                    type="tel"
                    placeholder="Phone (###-###-####)" 
                    value={phone}
                    onChange={handlePhoneChange}
                    maxLength={12}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl outline-none focus:border-blue-500 text-white text-sm"
                  />
               </div>
            </div>
          )}

          <div className="relative group">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-blue-400 transition-colors">
              <Mail className="w-5 h-5" />
            </div>
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl outline-none focus:bg-white/[0.08] focus:border-blue-500/50 text-white transition-all"
            />
          </div>

          <div className="relative group">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-blue-400 transition-colors">
              <Lock className="w-5 h-5" />
            </div>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl outline-none focus:bg-white/[0.08] focus:border-blue-500/50 text-white transition-all"
            />
          </div>

          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-xs text-center font-bold animate-in shake-in">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-4 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 rounded-2xl font-bold text-white transition-all shadow-xl shadow-blue-500/20 active:scale-95 flex items-center justify-center gap-2 mt-4"
          >
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : isRegistering ? "Create Account" : "Access Portal"}
            {!isLoading && <ArrowRight className="w-5 h-5" />}
          </button>
        </form>

        <div className="text-center pt-2 space-y-4 relative z-10">
          <div className="flex items-center justify-center gap-2 text-slate-500">
             <Info className="w-3 h-3" />
             <span className="text-[9px] font-medium">Secured by Firebase Auth & Firestore</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PortalAuth;
