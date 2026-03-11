
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { Shield, LayoutDashboard, FileText, HelpCircle, Menu, X, ArrowRight, Sparkles, User, Settings, Bell, LogOut, Mail, Network, Box, Lock, PenTool, Briefcase, Wrench } from 'lucide-react';
import { onAuthStateChanged, signOut } from "firebase/auth";
import { motion, AnimatePresence } from 'motion/react';
import { auth } from './services/firebase';
import { dbService } from './services/dbService';
import ScrollToTop from './components/ScrollToTop';
import LandingPage from './components/LandingPage';
import QuoteForm from './components/QuoteForm';
import ClientDashboard from './components/ClientDashboard';
import KnowledgeBase from './components/KnowledgeBase';
import CarrierNetwork from './components/CarrierNetwork';
import CarrierPage from './components/CarrierPage';
import OpenlyCarrierPage from './components/OpenlyCarrierPage';
import ProductsPage from './components/ProductsPage';
import PrivacyPolicy from './components/PrivacyPolicy';
import FloatingChat from './components/FloatingChat';
import PortalAuth from './components/PortalAuth';
import AgentAcademy from './components/AgentAcademy';
import SitemapPage from './components/SitemapPage';
import AIToolsPage from './components/AIToolsPage';
import AIHomeInspection from './components/AIHomeInspection';
import AIVehicleInspection from './components/AIVehicleInspection';
import IndustryLandingPage from './components/IndustryLandingPage';
import IndustryIndex from './components/IndustryIndex';
import AdminDashboard from './components/AdminDashboard';
import WatercraftPage from './components/WatercraftPage';
import PowersportsPage from './components/PowersportsPage';
import PetInsurancePage from './components/PetInsurancePage';
import BondsPage from './components/BondsPage';
import SportsInsurancePage from './components/SportsInsurancePage';
import FinancialPage from './components/FinancialPage';
import SellCarPage from './components/SellCarPage';
import ServiceCenter from './components/ServiceCenter';
import SafetyCoursePage from './components/SafetyCoursePage';
import SolaPage from './components/SolaPage';
import AutoPage from './components/AutoPage';
import HomePage from './components/HomePage';
import RentersPage from './components/RentersPage';
import UmbrellaPage from './components/UmbrellaPage';
import CommercialLinesPage from './components/CommercialLinesPage';
import CyberPage from './components/CyberPage';
import BuildersRiskPage from './components/BuildersRiskPage';
import HealthPage from './components/HealthPage';
import DentalPage from './components/DentalPage';
import DisabilityPage from './components/DisabilityPage';
import LifePage from './components/LifePage';
import FloodPage from './components/FloodPage';
import GeneralLiabilityPage from './components/GeneralLiabilityPage';
import WorkersCompPage from './components/WorkersCompPage';
import CommercialAutoPage from './components/CommercialAutoPage';
import BusinessOwnersPage from './components/BusinessOwnersPage';
import InsureTaxPage from './components/InsureTaxPage';
import { ProfileEditModal } from './components/ProfileEditModal';

import KickoffPage from './components/KickoffPage';
import ArkayWarrantyPage from './components/ArkayWarrantyPage';
import ChoiceWarrantyPage from './components/ChoiceWarrantyPage';
import HomeSecurityPage from './components/HomeSecurityPage';
import CommunicationCenter from './components/CommunicationCenter';

import { ComplianceDashboard } from './components/compliance/ComplianceDashboard';
import { VendorCOIUpload } from './components/compliance/VendorCOIUpload';
import { VendorDirectory } from './components/compliance/VendorDirectory';

const NavItem: React.FC<{ to: string, icon: any, label: string, active: boolean }> = ({ to, icon: Icon, label, active }) => (
  <Link 
    to={to} 
    className={`flex items-center gap-2 px-3 py-2 rounded-xl transition-all duration-300 ${
      active 
      ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20 shadow-[0_0_15px_rgba(59,130,246,0.1)]' 
      : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'
    }`}
  >
    <Icon className={`w-4 h-4 ${active ? 'animate-pulse' : ''}`} />
    <span className="font-medium text-xs lg:text-sm">{label}</span>
  </Link>
);

const Header: React.FC<{ user: any; onLogout: () => void; onEditProfile: () => void }> = ({ user, onLogout, onEditProfile }) => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: 'Home', path: '/', icon: Shield },
    { name: 'Industries', path: '/industries', icon: Briefcase },
    { name: 'Products', path: '/products', icon: Box },
    { name: 'Service', path: '/service', icon: Wrench },
    { name: 'Get Quotes', path: '/apply', icon: Sparkles },
    { name: 'AI Tools', path: '/tools', icon: PenTool },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="fixed top-0 left-0 right-0 z-[100] p-4 lg:p-6">
      <nav className="max-w-7xl mx-auto glass rounded-3xl px-6 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 group shrink-0">
          <div className="flex items-center gap-2 bg-blue-500/10 p-2 rounded-xl border border-blue-500/20 group-hover:bg-blue-500/20 transition-all">
            <Shield className="w-6 h-6 text-blue-500 fill-blue-500/20" />
          </div>
          <div className="flex items-baseline gap-0.5 whitespace-nowrap">
            <span className="font-heading font-bold text-white text-lg tracking-tight hidden sm:inline">ReduceMyInsurance</span>
            <span className="font-heading font-bold text-white text-lg tracking-tight sm:hidden">RMI</span>
            <span className="text-sm text-blue-400 font-bold tracking-widest">.Net</span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden xl:flex items-center gap-1">
          {navLinks.map((link) => (
            <NavItem 
              key={link.name} 
              to={link.path} 
              icon={link.icon} 
              label={link.name} 
              active={isActive(link.path)} 
            />
          ))}
        </div>

        <div className="hidden xl:flex items-center gap-4">
          <div className="h-8 w-[1px] bg-white/10 mx-1"></div>
          {user ? (
            <div className="flex items-center gap-4">
               <button 
                onClick={onEditProfile}
                className="flex items-center gap-3 bg-blue-500/10 border border-blue-500/20 px-4 py-2 rounded-2xl hover:bg-blue-500/20 transition-all cursor-pointer group"
               >
                  <User className="w-4 h-4 text-blue-400 group-hover:scale-110 transition-transform" />
                  <span className="text-xs font-bold text-white uppercase">{user.firstName}</span>
               </button>
               <button onClick={onLogout} className="p-2 text-slate-500 hover:text-red-400 transition-colors">
                  <LogOut className="w-5 h-5" />
               </button>
            </div>
          ) : (
            <Link to="/dashboard" className="flex items-center gap-3 bg-white/5 hover:bg-white/10 px-4 py-2 rounded-2xl border border-white/10 transition-all">
              <User className="w-4 h-4 text-blue-400" />
              <span className="text-xs font-bold uppercase tracking-wider text-white">Client Login</span>
            </Link>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button className="xl:hidden p-2 text-white" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X /> : <Menu />}
        </button>
      </nav>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="xl:hidden absolute top-24 left-6 right-6 glass rounded-3xl shadow-2xl p-6 space-y-4 animate-in fade-in slide-in-from-top-4">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              onClick={() => setIsOpen(false)}
              className={`flex items-center space-x-4 p-4 rounded-2xl ${
                isActive(link.path) ? 'bg-blue-500/10 text-blue-400' : 'text-slate-300'
              }`}
            >
              <link.icon className="w-5 h-5" />
              <span className="font-bold">{link.name}</span>
            </Link>
          ))}
          
          <div className="h-px bg-white/10 my-2" />
          
          {user ? (
            <div className="space-y-2">
              <button 
                onClick={() => { onEditProfile(); setIsOpen(false); }}
                className="w-full flex items-center space-x-4 p-4 text-blue-400 rounded-2xl bg-blue-500/5 hover:bg-blue-500/10 transition-colors"
              >
                 <User className="w-5 h-5" />
                 <span className="font-bold uppercase tracking-wider">{user.firstName} (Edit Profile)</span>
              </button>
              <button 
                onClick={() => { onLogout(); setIsOpen(false); }}
                className="w-full flex items-center space-x-4 p-4 rounded-2xl text-slate-300 hover:bg-white/5 hover:text-red-400 transition-colors"
              >
                <LogOut className="w-5 h-5" />
                <span className="font-bold">Logout</span>
              </button>
            </div>
          ) : (
            <Link
              to="/dashboard"
              onClick={() => setIsOpen(false)}
              className="flex items-center space-x-4 p-4 rounded-2xl text-slate-300 hover:bg-white/5 transition-colors"
            >
              <User className="w-5 h-5" />
              <span className="font-bold">Client Login</span>
            </Link>
          )}
        </div>
      )}
    </header>
  );
};

const ProtectedRoute: React.FC<{ user: any; children: React.ReactNode }> = ({ user, children }) => {
  if (!user) return <PortalAuth onAuthenticated={(u) => window.dispatchEvent(new CustomEvent('auth-success', { detail: u }))} />;
  return <>{children}</>;
};

// --- ANALYTICS TRACKER ---
const AnalyticsTracker = () => {
  const location = useLocation();
  
  useEffect(() => {
    // Check if gtag is available (injected in index.html)
    if ((window as any).gtag) {
      (window as any).gtag('config', 'G-QT7ERLS3DL', {
        page_path: location.pathname + location.search
      });
    }
  }, [location]);

  return null;
};

const PageRoutes: React.FC<{ user: any; setShowProfileEdit: (show: boolean) => void }> = ({ user, setShowProfileEdit }) => {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.3 }}
      >
        <Routes location={location}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/apply" element={<QuoteForm />} />
          <Route path="/tools" element={<ProtectedRoute user={user}><AIToolsPage /></ProtectedRoute>} />
          <Route path="/tools/inspection" element={<ProtectedRoute user={user}><AIHomeInspection /></ProtectedRoute>} />
          <Route path="/tools/vehicle-inspection" element={<ProtectedRoute user={user}><AIVehicleInspection /></ProtectedRoute>} />
          <Route path="/compliance" element={<ProtectedRoute user={user}><ComplianceDashboard /></ProtectedRoute>} />
          <Route path="/compliance/vendors" element={<ProtectedRoute user={user}><VendorDirectory /></ProtectedRoute>} />
          <Route path="/compliance/upload/:vendorId" element={<VendorCOIUpload />} />
          <Route path="/carriers" element={<CarrierNetwork />} />
          <Route path="/carrier/openly" element={<OpenlyCarrierPage />} />
          <Route path="/carrier/:slug" element={<CarrierPage />} />
          
          {/* Dedicated Product Pages */}
          <Route path="/auto" element={<AutoPage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/renters" element={<RentersPage />} />
          <Route path="/umbrella" element={<UmbrellaPage />} />
          <Route path="/commercial" element={<CommercialLinesPage />} />
          <Route path="/general-liability" element={<GeneralLiabilityPage />} />
          <Route path="/workers-comp" element={<WorkersCompPage />} />
          <Route path="/commercial-auto" element={<CommercialAutoPage />} />
          <Route path="/bop" element={<BusinessOwnersPage />} />
          <Route path="/cyber" element={<CyberPage />} />
          <Route path="/builders-risk" element={<BuildersRiskPage />} />
          <Route path="/watercraft" element={<WatercraftPage />} />
          <Route path="/flood" element={<FloodPage />} />
          <Route path="/powersports" element={<PowersportsPage />} />
          <Route path="/pet-insurance" element={<PetInsurancePage />} />
          <Route path="/bonds" element={<BondsPage />} />
          <Route path="/sports" element={<SportsInsurancePage />} />
          <Route path="/financial" element={<FinancialPage />} />
          <Route path="/insure-tax" element={<InsureTaxPage />} />
          <Route path="/sell-car" element={<SellCarPage />} />
          <Route path="/safety-course" element={<SafetyCoursePage />} />
          <Route path="/service" element={<ServiceCenter />} />
          <Route path="/sola" element={<SolaPage />} />
          <Route path="/health" element={<HealthPage />} />
          <Route path="/dental-vision" element={<DentalPage />} />
          <Route path="/disability" element={<DisabilityPage />} />
          <Route path="/life" element={<LifePage />} />
          <Route path="/kickoff" element={<KickoffPage />} />
          <Route path="/arkay-warranty" element={<ArkayWarrantyPage />} />
          <Route path="/choice-warranty" element={<ChoiceWarrantyPage />} />
          <Route path="/home-security" element={<HomeSecurityPage />} />
          
          {/* New Industry Routes */}
          <Route path="/industries" element={<IndustryIndex />} />
          <Route path="/insurance/:slug" element={<IndustryLandingPage />} />
          
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute user={user}>
                <ClientDashboard />
              </ProtectedRoute>
            } 
          />
          
          {/* Admin Dashboard Route */}
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/communications" element={<CommunicationCenter />} />
          
          <Route path="/knowledge" element={<KnowledgeBase />} />
          <Route path="/agent/academy" element={<AgentAcademy />} />
          <Route path="/sitemap" element={<SitemapPage />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
};

const App: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [showProfileEdit, setShowProfileEdit] = useState(false);

  useEffect(() => {
    // Check session storage for dev bypass user
    const storedUser = sessionStorage.getItem('rmi_user');
    if (storedUser) {
        try {
            setUser(JSON.parse(storedUser));
        } catch (e) {
            console.error("Failed to parse stored user", e);
        }
    }

    // Listen for Firebase Auth State Changes
    const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
      if (authUser) {
        const profile = await dbService.getUserProfile(authUser.uid);
        setUser({ ...profile, uid: authUser.uid, email: authUser.email });
        // Clear session storage if real auth succeeds to avoid conflicts
        sessionStorage.removeItem('rmi_user');
      } else {
        // Only clear user if not in dev bypass mode
        if (!sessionStorage.getItem('rmi_user')) {
            setUser(null);
        }
      }
    });

    // Custom Event listener for compatibility with existing components
    const handleAuthEvent = (e: any) => {
      setUser(e.detail);
    };

    const handleEditProfileEvent = () => setShowProfileEdit(true);

    window.addEventListener('auth-success', handleAuthEvent);
    window.addEventListener('edit-profile', handleEditProfileEvent);
    
    return () => {
      unsubscribe();
      window.removeEventListener('auth-success', handleAuthEvent);
      window.removeEventListener('edit-profile', handleEditProfileEvent);
    };
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    sessionStorage.removeItem('rmi_user');
    setUser(null);
  };

  const handleProfileUpdate = (updatedUser: any) => {
    setUser(updatedUser);
    // ProfileEditModal handles the DB save now to ensure better error handling
  };

  return (
    <HelmetProvider>
      <Router>
        <ScrollToTop />
        <AnalyticsTracker />
        <div className="min-h-screen flex flex-col pt-28">
        <Header user={user} onLogout={handleLogout} onEditProfile={() => setShowProfileEdit(true)} />
        <main className="flex-grow max-w-7xl mx-auto w-full px-6">
          <PageRoutes user={user} setShowProfileEdit={setShowProfileEdit} />
        </main>
        
        {showProfileEdit && user && (
          <ProfileEditModal 
            user={user} 
            onClose={() => setShowProfileEdit(false)} 
            onUpdate={handleProfileUpdate} 
          />
        )}

        <footer className="py-20 mt-20 border-t border-white/5 bg-slate-950/50 backdrop-blur-lg">
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 text-slate-400">
            <div className="space-y-6">
              <div className="flex items-center space-x-3">
                <Shield className="text-blue-400 w-8 h-8" />
                <span className="font-heading font-bold text-white text-2xl">RMI.Net</span>
              </div>
              <p className="text-sm leading-relaxed">
                Advanced AI modeling for risk assessment and premium optimization. The world's first autonomous insurance advisor for Murfreesboro and beyond.
              </p>
              <div className="text-xs font-bold text-slate-500 space-y-1">
                <div>(615) 900-0288</div>
                <div>1500 Medical Center Pkwy STE 3A-26</div>
                <div>Murfreesboro, TN 37129</div>
                <div className="flex items-center gap-2 pt-2 text-blue-400">
                  <Mail className="w-3 h-3" />
                  <a href="mailto:service@ReduceMyInsurance.Net">service@ReduceMyInsurance.Net</a>
                </div>
              </div>
            </div>
            
            {/* Services */}
            <div>
              <h4 className="text-white font-bold mb-6 font-heading tracking-widest text-xs uppercase">Services</h4>
              <ul className="space-y-4 text-sm">
                <li><Link to="/products" className="hover:text-blue-400 transition-colors">All Products</Link></li>
                <li><Link to="/industries" className="hover:text-blue-400 transition-colors">By Industry</Link></li>
                <li><Link to="/apply" className="hover:text-blue-400 transition-colors">Risk Analysis</Link></li>
                <li><Link to="/carriers" className="hover:text-blue-400 transition-colors">Carrier Network</Link></li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <h4 className="text-white font-bold mb-6 font-heading tracking-widest text-xs uppercase">Company</h4>
              <ul className="space-y-4 text-sm">
                <li><Link to="/knowledge" className="hover:text-blue-400 transition-colors">Academy</Link></li>
                <li><Link to="/apply" className="hover:text-blue-400 transition-colors">Get A Quote</Link></li>
                <li>
                   <Link to="/admin" className="flex items-center gap-2 text-slate-600 hover:text-white transition-colors group">
                      <Lock className="w-3 h-3" /> 
                      <span className="opacity-0 group-hover:opacity-100 transition-opacity">Agent Dashboard</span>
                   </Link>
                </li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className="text-white font-bold mb-6 font-heading tracking-widest text-xs uppercase">Legal</h4>
              <ul className="space-y-4 text-sm">
                <li><Link to="/privacy" className="hover:text-blue-400 transition-colors">Privacy Policy</Link></li>
                <li><Link to="/privacy" className="hover:text-blue-400 transition-colors">Terms of Service</Link></li>
                <li><Link to="/sitemap" className="hover:text-blue-400 transition-colors">Sitemap</Link></li>
              </ul>
            </div>
          </div>
        </footer>
        <FloatingChat client={user} />
      </div>
      </Router>
    </HelmetProvider>
  );
};

export default App;
