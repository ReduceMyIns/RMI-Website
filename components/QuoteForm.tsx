
import React, { useState, useEffect, useRef } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { 
  Send, Sparkles, Shield, User, ChevronRight, CheckCircle2, 
  Zap, Loader2, Bot, Car, Home, Edit3, Trash2, Plus, AlertCircle,
  CreditCard, Sliders, Check, Building, Briefcase, ExternalLink, ArrowRight,
  ChevronDown, ChevronUp, AlertTriangle, Search, DollarSign, Users, Factory, HelpCircle,
  Calendar, Mail, Calculator, Ban, Undo2, Bike, FileText, Upload, GraduationCap, Lock, Truck, Activity
} from 'lucide-react';
import { jsPDF } from "jspdf"; 
import { createUserWithEmailAndPassword, signInAnonymously } from "firebase/auth";
import { auth } from '../services/firebase';
import { researchProperty, searchIndustryCodes, findLienholderAddress, decodeVin, checkVehicleRecalls, extractPolicyData } from '../services/geminiService';
import { fenrisApi } from '../services/fenrisService';
import { dbService } from '../services/dbService';
import { nowCertsApi } from '../services/nowCertsService';
import { QuoteRequest, Resident, Vehicle, LeadData, CommercialRatingData } from '../types';
import { getIndustryBySlug, IndustryProfile } from '../data/industryData';
import { SIC_INDUSTRIES, SICIndustry } from '../data/sicIndustries';

import PortalAuth from './PortalAuth';
import SEOHead from './SEOHead';

const US_STATES = ['AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA', 'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'];

const STANDARD_OCCUPATIONS = [
  "Accountant", "Actor", "Administrator", "Architect", "Artist", "Attorney", "Banker", "Barber", "Biologist", "Broker",
  "Carpenter", "Cashier", "Chef", "Chemist", "Clergy", "Clerk", "Coach", "Computer Programmer", "Construction Worker", "Consultant",
  "Counselor", "Dentist", "Designer", "Doctor", "Driver", "Editor", "Electrician", "Engineer", "Farmer", "Firefighter",
  "Flight Attendant", "Homemaker", "Insurance Agent", "Journalist", "Judge", "Laborer", "Lawyer", "Librarian", "Manager", "Mechanic",
  "Military", "Musician", "Nurse", "Pharmacist", "Photographer", "Physician", "Pilot", "Plumber", "Police Officer", "Professor",
  "Real Estate Agent", "Receptionist", "Reporter", "Retired", "Salesperson", "Scientist", "Secretary", "Social Worker", "Student", "Teacher",
  "Technician", "Therapist", "Truck Driver", "Unemployed", "Veterinarian", "Waiter/Waitress", "Writer", "Other"
];

const RELATIONSHIP_TYPES = [
  "Self", "Spouse", "Child", "Parent", "Sibling", "Grandparent", "Grandchild", "Employee", "Partner", "Other"
];

type FlowStep = 'LANDING' | 'LEAD_CAPTURE' | 'REFINEMENT' | 'COVERAGE' | 'SUMMARY' | 'COMMERCIAL_RISK' | 'COMMERCIAL_DETAILS' | 'COMMERCIAL_COVERAGE' | 'COMMERCIAL_SUMMARY';

const formatPhoneNumber = (value: string) => {
  const numbers = value.replace(/\D/g, '');
  if (numbers.length <= 3) return numbers;
  if (numbers.length <= 6) return `${numbers.slice(0, 3)}-${numbers.slice(3)}`;
  return `${numbers.slice(0, 3)}-${numbers.slice(3, 6)}-${numbers.slice(6, 10)}`;
};

const calculateAge = (dob: string) => {
    if (!dob) return 0;
    const diff = Date.now() - new Date(dob).getTime();
    const ageDate = new Date(diff); 
    return Math.abs(ageDate.getUTCFullYear() - 1970);
};

const QuoteForm: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const addressInputRef = useRef<HTMLInputElement>(null);
  
  const [step, setStep] = useState<FlowStep>('LANDING');
  const [isProcessing, setIsProcessing] = useState(false);
  const [aiStatus, setAiStatus] = useState('');
  const [activeIndustry, setActiveIndustry] = useState<IndustryProfile | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);

  // Address Autocomplete for LEAD_CAPTURE
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    const initAutocomplete = () => {
      if (step === 'LEAD_CAPTURE' && addressInputRef.current && (window as any).google) {
        const autocomplete = new (window as any).google.maps.places.Autocomplete(addressInputRef.current, {
          types: ['address'],
          componentRestrictions: { country: 'us' },
        });
        
        autocomplete.addListener('place_changed', () => {
          const place = autocomplete.getPlace();
          if (place.formatted_address) {
            // Parse components
            let street = '';
            let city = '';
            let state = '';
            let zip = '';
            
            if (place.address_components) {
              for (const component of place.address_components) {
                const type = component.types[0];
                if (type === 'street_number') {
                  street = component.long_name + ' ' + street;
                }
                if (type === 'route') {
                  street += component.long_name;
                }
                if (type === 'locality') {
                  city = component.long_name;
                }
                if (type === 'administrative_area_level_1') {
                  state = component.short_name;
                }
                if (type === 'postal_code') {
                  zip = component.long_name;
                }
              }
            }
            
            setLeadData(prev => ({
              ...prev,
              address: street.trim() || place.formatted_address,
              city: city || prev.city,
              state: state || prev.state,
              zip: zip || prev.zip
            }));
          }
        });
        return true;
      }
      return false;
    };

    if (step === 'LEAD_CAPTURE') {
      if (!initAutocomplete()) {
        interval = setInterval(() => {
          if (initAutocomplete()) {
            clearInterval(interval);
          }
        }, 500);
      }
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [step]);

  // Check for existing auth on mount
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user && step === 'LANDING') {
         // Prefill from profile
         let profile = await dbService.getUserProfile(user.uid);
         
         // If no profile found, try to find existing lead by email to prefill
         if (!profile && user.email) {
             const existingLead = await dbService.findExistingLead(user.email, '');
             if (existingLead) {
                 profile = existingLead;
             } else {
                 // Try NowCerts as last resort
                 try {
                     const ncResults = await nowCertsApi.searchInsured({ email: user.email });
                     if (ncResults && ncResults.value && ncResults.value.length > 0) {
                         const insured = ncResults.value[0];
                         profile = {
                             firstName: insured.firstName,
                             lastName: insured.lastName,
                             email: insured.eMail,
                             phone: insured.cellPhone || insured.phone,
                             address: insured.addressLine1,
                             city: insured.city,
                             state: insured.state,
                             zip: insured.zipCode
                         };
                     }
                 } catch (e) {
                     console.warn("NowCerts search failed", e);
                 }
             }
         }

         if (profile) {
             setLeadData(prev => ({ 
               ...prev, 
               ...profile,
               firstName: profile.firstName || prev.firstName,
               lastName: profile.lastName || prev.lastName,
               email: profile.email || profile.eMail || prev.email,
               phone: profile.phone || profile.cellPhone || prev.phone,
               dob: profile.dob || prev.dob,
               // Ensure address mapping is correct
               address: profile.street || profile.address || profile.addressLine1 || prev.address,
               city: profile.city || prev.city,
               state: profile.state || prev.state,
               zip: profile.zip || profile.zipCode || prev.zip,
               type: location.state?.defaultType || 'Personal'
             }));
             
             if (location.state?.defaultLine) {
                 setFormData(prev => ({
                     ...prev,
                     bundledLines: [location.state.defaultLine]
                 }));
             }
         }
         setStep('LEAD_CAPTURE');
      }
    });
    return () => unsubscribe();
  }, [step, location.state]);
  
  // UI State for Refinement Step
  const [expandedDriverId, setExpandedDriverId] = useState<string | null>(null);
  const [expandedVehicleId, setExpandedVehicleId] = useState<string | null>(null);
  const [searchingLienholderId, setSearchingLienholderId] = useState<string | null>(null);
  const [expandedRecalls, setExpandedRecalls] = useState<Set<string>>(new Set());
  
  // Mileage Calc State
  const [mileageCalcVehicleId, setMileageCalcVehicleId] = useState<string | null>(null);
  const [tempWeeklyMiles, setTempWeeklyMiles] = useState<string>('');

  // Lead Data State
  const [leadData, setLeadData] = useState<LeadData>({
    type: 'Personal', firstName: '', lastName: '', address: '', city: '', state: 'TN', zip: '', email: '', phone: '', dob: '', commercialName: ''
  });

  const [currentPremium, setCurrentPremium] = useState('');

  // Commercial Rating Data
  const [commercialData, setCommercialData] = useState<CommercialRatingData>({
    yearBizStarted: new Date().getFullYear(),
    yearsOfOperation: 0,
    numberOfOwners: 1,
    numberOfFullTimeEmployees: 0,
    numberOfPartTimeEmployees: 0,
    totalPayroll: 0,
    annualSales: 0,
    naic: '',
    sic: '',
    description: '',
    numberOfLocations: 1,
    numberOfVehiclesUsedForBusiness: 0,
    professionalExposure: false,
    highRisk: false,
    usesSubcontractors: false,
    subcontractorCost: 0
  });

  const [sicSearchTerm, setSicSearchTerm] = useState('');
  const [sicResults, setSicResults] = useState<any[]>([]);
  
  // Occupation Search State
  const [activeOccupationId, setActiveOccupationId] = useState<string | null>(null);
  const [occupationSuggestions, setOccupationSuggestions] = useState<SICIndustry[]>([]);

  const handleOccupationChange = (residentId: string, value: string) => {
      updateResident(residentId, 'occupation', value);
      setActiveOccupationId(residentId);
      if (value.length > 1) {
          const lower = value.toLowerCase();
          const filtered = SIC_INDUSTRIES.filter(ind => 
              ind.name.toLowerCase().includes(lower) || ind.sicCode.includes(lower)
          ).slice(0, 20);
          setOccupationSuggestions(filtered);
      } else {
          setOccupationSuggestions([]);
      }
  };

  const selectOccupation = (residentId: string, industry: SICIndustry) => {
      updateResident(residentId, 'occupation', industry.name);
      updateResident(residentId, 'sicCode', industry.sicCode);
      setActiveOccupationId(null);
      setOccupationSuggestions([]);
  };

  // Full Application State (Personal)
  const [formData, setFormData] = useState<QuoteRequest>({
    applicationId: `RMI-${Math.floor(Math.random() * 1000000)}`,
    type: 'Personal', firstName: '', lastName: '', address: '', city: '', state: 'TN', zip: '', email: '', phone: '', dob: '',
    residents: [], vehicles: [], properties: [], bundledLines: ['Auto'],
    fenrisData: null,
    policyCoverage: { autoLimits: '100/300/100', uninsuredMotorist: true, medicalPayments: '5000' }
  });

  const [commercialRecommendedLines, setCommercialRecommendedLines] = useState<string[]>([]);
  const [commercialSelectedLines, setCommercialSelectedLines] = useState<string[]>([]);

  // Initialize from navigation state (Industry Workflow)
  useEffect(() => {
    if (location.state?.preSelected) {
       const ind = getIndustryBySlug(location.state.preSelected);
       if (ind) {
         setActiveIndustry(ind);
         setLeadData(prev => ({ ...prev, type: 'Commercial' }));
         setFormData(prev => ({ ...prev, type: 'Commercial' }));
       }
    }

    if (location.state?.prefillData) {
        const pd = location.state.prefillData;
        setLeadData(prev => ({ ...prev, ...pd }));
    }

    if (location.state?.defaultType) {
        setLeadData(prev => ({ ...prev, type: location.state.defaultType }));
        setFormData(prev => ({ ...prev, type: location.state.defaultType }));
    }

    if (location.state?.defaultLine) {
        setFormData(prev => ({ ...prev, bundledLines: [location.state.defaultLine] }));
    }
  }, [location.state]);

  // AUTO-ENRICH VEHICLE DATA
  useEffect(() => {
    if (step === 'REFINEMENT' && leadData.type === 'Personal') {
        const enrichVehicles = async () => {
            let updatesNeeded = false;
            const updatedVehicles = await Promise.all(formData.vehicles.map(async (v) => {
                if (v.vin && !v.nhtsaValidated) {
                    updatesNeeded = true;
                    try {
                        const decoded = await decodeVin(v.vin);
                        if (decoded) {
                            const recalls = await checkVehicleRecalls(decoded.year, decoded.make, decoded.model, v.vin);
                            return {
                                ...v,
                                year: decoded.year,
                                make: decoded.make,
                                model: decoded.model,
                                nhtsaValidated: true,
                                recalls: recalls
                            };
                        }
                    } catch (e) {
                        console.error("Auto-enrichment failed", e);
                    }
                }
                return v;
            }));

            if (updatesNeeded) {
                setFormData(prev => ({ ...prev, vehicles: updatedVehicles }));
                
                // Save enriched vehicle data to Firestore
                if (formData.applicationId && !formData.applicationId.startsWith('RMI-')) {
                    await dbService.updateLead(formData.applicationId, { vehicles: updatedVehicles });
                }
            }
        };
        enrichVehicles();
    }
  }, [step, formData.vehicles]);

  const handlePolicyUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    setAiStatus('Parsing Policy Data...');

    const reader = new FileReader();
    reader.onload = async () => {
        const base64 = (reader.result as string).split(',')[1];
        try {
            const data = await extractPolicyData({ data: base64, mimeType: file.type });
            if (data.firstName) {
                setLeadData(prev => ({
                    ...prev,
                    firstName: data.firstName || prev.firstName,
                    lastName: data.lastName || prev.lastName,
                    address: data.address || prev.address,
                    city: data.city || prev.city,
                    state: data.state || prev.state,
                    zip: data.zip || prev.zip
                }));
                if (data.currentPremium) setCurrentPremium(data.currentPremium.toString());
                
                // Merge Vehicles
                if (data.vehicles && data.vehicles.length > 0) {
                    const extractedVehicles: Vehicle[] = data.vehicles.map((v: any, idx: number) => ({
                        id: `extracted-${idx}`,
                        year: v.year, make: v.make, model: v.model, vin: v.vin,
                        type: 'Car', usage: 'commute', lien: false, status: 'included', annualMileage: 12000
                    }));
                    setFormData(prev => ({ ...prev, vehicles: extractedVehicles }));
                }
                alert("Policy data extracted successfully! Please review the details.");
            }
        } catch (err) {
            console.error("Policy extraction error", err);
            alert("Could not extract data automatically. Please enter details.");
        } finally {
            setIsProcessing(false);
            setAiStatus('');
        }
    };
    reader.readAsDataURL(file);
  };

  const processLeadSubmission = async () => {
    setIsProcessing(true);
    setAiStatus('Initializing Session...');
    
    try {
      // 1. Check Existing Lead in Firestore
      let existingLead = await dbService.findExistingLead(leadData.email, leadData.phone);
      
      let currentFormData = { ...formData, ...leadData };
      let prefilled = false;

      if (existingLead && existingLead.vehicles && existingLead.vehicles.length > 0) {
          setAiStatus('Syncing Profile...');
          currentFormData = {
              ...currentFormData,
              vehicles: existingLead.vehicles || [],
              residents: existingLead.residents || [],
              fenrisData: existingLead.fenrisData || null,
              properties: existingLead.properties || []
          };
          setFormData(currentFormData);
          prefilled = true;
      }

      // 2. Save Lead
      // Ensure authenticated (anonymously if needed)
      if (!auth.currentUser) {
          try {
              await signInAnonymously(auth);
          } catch (authErr: any) {
              if (authErr.code === 'auth/admin-restricted-operation' || authErr.message?.includes('admin-restricted-operation')) {
                  console.warn("Anonymous Auth Restricted: Proceeding in restricted mode.");
              } else {
                  console.error("Anonymous Auth Failed:", authErr);
              }
              // Continue anyway, dbService might have fallback or rules might allow public write (unlikely but possible)
          }
      }

      const leadId = await dbService.saveQuoteRequest({ 
        ...leadData, 
        industry: activeIndustry?.name || 'General',
        status: 'New', 
        source: 'Web-App',
        isReturning: prefilled,
        currentPremium: currentPremium
      });
      currentFormData.applicationId = leadId;

      if (leadData.type === 'Personal') {
          if (!prefilled && currentFormData.vehicles.length === 0) {
              setAiStatus('Querying Fenris Data Exchange...');
              const prefill = await fenrisApi.prefillAuto(leadData);
              currentFormData = {
                ...currentFormData,
                residents: prefill.residents || [],
                vehicles: (prefill.vehicles || []).map((v: any) => ({ 
                    ...v, type: 'Car', usage: 'commute', status: 'included', annualMileage: 12000, 
                    coverages: { comp: '1000', coll: '1000', rental: 'None', towing: 'None' }
                })),
                fenrisData: prefill 
              };

              // Save enriched data to Firestore
              await dbService.updateLead(leadId, {
                  residents: currentFormData.residents,
                  vehicles: currentFormData.vehicles,
                  fenrisData: currentFormData.fenrisData
              });
          }
          // Property Research
          const isHomeowner = currentFormData.fenrisData?.homeownerStatus === 'Homeowner' || currentFormData.fenrisData?.homeownerStatus === 'Renter';
          if (currentFormData.bundledLines.includes('Home') || isHomeowner) {
             setAiStatus('Analyzing Property...');
             const homeResearch = await researchProperty(`${leadData.address}, ${leadData.city}, ${leadData.state} ${leadData.zip}`);
             if (homeResearch && homeResearch.yearBuilt) {
                currentFormData.properties = [{
                   id: 'prop-1', type: currentFormData.fenrisData?.homeownerStatus === 'Renter' ? 'Renters' : 'Home', address: leadData.address,
                   yearBuilt: homeResearch.yearBuilt, sqft: homeResearch.sqft || 2000,
                   constructionType: homeResearch.exteriorMaterials || 'Frame',
                   roofType: homeResearch.roofType || 'Asphalt Shingle',
                   roofAge: homeResearch.estimatedRoofAge || 5, hasPool: homeResearch.hasPool || false,
                   isGated: false, occupancy: 'Primary'
                }];
                // Add Home/Renters to bundled lines if not there
                const lineToAdd = currentFormData.fenrisData?.homeownerStatus === 'Renter' ? 'Renters' : 'Home';
                if (!currentFormData.bundledLines.includes(lineToAdd)) {
                   currentFormData.bundledLines.push(lineToAdd);
                }
             }
          }
          
          setFormData(currentFormData);
          
          // PUSH TO NOWCERTS HERE (Initial Lead)
          setAiStatus('Syncing with Agency Management...');
          await nowCertsApi.pushQuoteApplication(currentFormData);

          setStep('REFINEMENT');
      } else {
          // Commercial Flow
          setAiStatus('Commercial Matrix...');
          await new Promise(r => setTimeout(r, 1000));
          if (activeIndustry) {
             setSicSearchTerm(activeIndustry.name);
             setCommercialData(prev => ({ ...prev, description: activeIndustry.shortDesc }));
          }
          setStep('COMMERCIAL_RISK');
      }
    } catch (err: any) {
      console.error("Workflow Error:", err);
      
      if (err.message && err.message.includes("Permission denied")) {
          alert("Error: Your application data could not be saved to the database due to a permission issue. Please ensure you are signed in and try again.");
          return;
      }

      // Fallback: Proceed to next step even if backend save failed (UI resilience)
      if (leadData.type === 'Commercial') setStep('COMMERCIAL_RISK');
      else setStep('REFINEMENT');
    } finally {
      setIsProcessing(false);
      setAiStatus('');
    }
  };

  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!auth.currentUser) {
        setShowAuthModal(true);
        return;
    }
    
    await processLeadSubmission();
  };

  const handleAuthSuccess = async (user: any) => {
    setShowAuthModal(false);
    if (user) {
         setLeadData(prev => ({
             ...prev,
             firstName: user.firstName || prev.firstName,
             lastName: user.lastName || prev.lastName,
             email: user.email || prev.email,
             phone: user.phone || prev.phone,
             address: user.address || prev.address,
             city: user.city || prev.city,
             state: user.state || prev.state,
             zip: user.zip || prev.zip,
             dob: user.dob || prev.dob
         }));
    }
    await processLeadSubmission();
  };

  const handleCommercialDetailsSubmit = (e: React.FormEvent) => {
     e.preventDefault();
     // ... logic
     setStep('COMMERCIAL_COVERAGE');
  };

  // --- PERSONAL LOGIC ---

  // ... (addDriver, excludeDriver, etc. remain the same) ...
  const addDriver = () => {
    const newDriver: Resident = {
      id: `new-dr-${Date.now()}`, firstName: '', lastName: '', dob: '', relationship: 'Other', status: 'rated', licenseState: leadData.state
    };
    setFormData(prev => ({ ...prev, residents: [...prev.residents, newDriver] }));
    setExpandedDriverId(newDriver.id);
  };

  const excludeDriver = (id: string) => {
    setFormData(prev => ({ ...prev, residents: prev.residents.map(r => r.id === id ? { ...r, status: 'excluded', exclusionReason: '' } : r) }));
    setExpandedDriverId(id);
  };

  const restoreDriver = (id: string) => {
    setFormData(prev => ({ ...prev, residents: prev.residents.map(r => r.id === id ? { ...r, status: 'rated', exclusionReason: undefined } : r) }));
  };

  const addVehicle = () => {
    const newVehicle: Vehicle = {
      id: `new-veh-${Date.now()}`, year: new Date().getFullYear(), make: '', model: '', type: 'Car', usage: 'commute', lien: false, status: 'included', annualMileage: 12000,
      coverages: { comp: '1000', coll: '1000', rental: 'None', towing: 'None' },
      active: true
    };
    setFormData(prev => ({ ...prev, vehicles: [...prev.vehicles, newVehicle] }));
    setExpandedVehicleId(newVehicle.id);
  };

  const deleteVehicle = (id: string) => {
    const reason = window.prompt("Please provide a reason for removing this vehicle:");
    if (reason) {
        setFormData(prev => ({ ...prev, vehicles: prev.vehicles.map(v => v.id === id ? { ...v, active: false, deletionReason: reason } : v) }));
    }
  };

  const excludeVehicle = (id: string) => {
    setFormData(prev => ({ ...prev, vehicles: prev.vehicles.map(v => v.id === id ? { ...v, status: 'excluded', exclusionReason: '' } : v) }));
    setExpandedVehicleId(id);
  };

  const restoreVehicle = (id: string) => {
    setFormData(prev => ({ ...prev, vehicles: prev.vehicles.map(v => v.id === id ? { ...v, status: 'included', exclusionReason: undefined } : v) }));
  };

  const updateVehicle = (id: string, field: string, val: any) => {
    setFormData(prev => ({ ...prev, vehicles: prev.vehicles.map(v => v.id !== id ? v : { ...v, [field]: val, ...(field === 'vin' ? { nhtsaValidated: false, recalls: undefined } : {}) }) }));
  };

  const calculateWeeklyMiles = (id: string) => {
    const weekly = parseInt(tempWeeklyMiles);
    if (!isNaN(weekly)) { updateVehicle(id, 'annualMileage', weekly * 52); setMileageCalcVehicleId(null); setTempWeeklyMiles(''); }
  };

  const updateVehicleCoverage = (id: string, coverageField: keyof NonNullable<Vehicle['coverages']>, val: string) => {
    setFormData(prev => ({ ...prev, vehicles: prev.vehicles.map(v => v.id === id ? { ...v, coverages: { ...v.coverages, [coverageField]: val } as any } : v) }));
  };

  const updateResident = (id: string, field: string, val: any) => {
    setFormData(prev => ({ ...prev, residents: prev.residents.map(r => r.id === id ? { ...r, [field]: val } : r) }));
  };

  const toggleDriverExpansion = (id: string) => setExpandedDriverId(expandedDriverId === id ? null : id);
  const toggleVehicleExpansion = (id: string) => setExpandedVehicleId(expandedVehicleId === id ? null : id);

  const handlePhoneChange = (val: string) => setLeadData(prev => ({...prev, phone: formatPhoneNumber(val)}));

  const handleLienholderSearch = async (vehicleId: string, name: string) => {
    if (!name) return;
    setSearchingLienholderId(vehicleId);
    try {
      const addressData = await findLienholderAddress(name);
      if (addressData) {
        setFormData(prev => ({ ...prev, vehicles: prev.vehicles.map(v => v.id === vehicleId ? { ...v, lienholderAddress: addressData.address, lienholderCity: addressData.city, lienholderState: addressData.state, lienholderZip: addressData.zip } : v) }));
      }
    } catch (e) { console.error(e); } finally { setSearchingLienholderId(null); }
  };

  const handleNextToCoverage = () => {
    // Basic validation logic
    if (leadData.type === 'Personal') {
        const hasMarriedDriver = formData.residents.some(r => r.maritalStatus === 'Married' && r.status !== 'excluded');
        if (hasMarriedDriver) {
            const hasSpouse = formData.residents.some(r => r.relationship === 'Spouse' && r.status !== 'excluded');
            if (!hasSpouse) {
                alert("A driver is listed as Married. Please add their Spouse to the policy, even if they are excluded from driving.");
                return;
            }
        }
    }
    setStep('COVERAGE');
  };

  // --- FINAL SUBMISSION HANDLER ---
  const handleFinalSubmission = async () => {
      setIsProcessing(true);
      try {
          // 1. Final Update to NowCerts with all refined data
          await nowCertsApi.pushQuoteApplication(formData);
          
          // 2. Update Firestore
          // Ensure we have an ID to update, if not create new
          if (formData.applicationId) {
             // We can only update if we created it. If saveQuoteRequest failed earlier, we create now.
             // But simpler: just call saveQuoteRequest again with status submitted, it's fine to have duplicates in edge cases vs losing data.
             await dbService.saveQuoteRequest({
                ...formData,
                status: 'Submitted'
             });
          } else {
             await dbService.saveQuoteRequest({
                ...formData,
                status: 'Submitted'
             });
          }

          // 3. Redirect to Dashboard
          // Persist user to session if created
          const user = auth.currentUser;
          if (user) {
              const profile = await dbService.getUserProfile(user.uid);
              // Fallback if profile doesn't exist yet (e.g. anon user)
              const sessionData = profile || { uid: user.uid, ...leadData };
              sessionStorage.setItem('rmi_user', JSON.stringify(sessionData));
              navigate('/dashboard');
          } else {
              // Should likely not happen if we forced creation, but fallback:
              alert("Application Submitted! An agent will contact you shortly.");
              navigate('/');
          }

      } catch (e) {
          console.error("Submission Error", e);
          alert("Error submitting application. Please try again.");
      } finally {
          setIsProcessing(false);
      }
  };

  // --- RENDER STEPS ---
  
  if (step === 'LANDING') {
      return (
          <div className="max-w-4xl mx-auto py-12">
              <SEOHead 
                title="Get an Insurance Quote | AI-Powered Risk Analysis"
                description="Start your insurance application today. Our AI-powered platform analyzes your risk profile to find the best coverage at the lowest rates."
                canonicalUrl="https://www.reducemyinsurance.net/apply"
                keywords={['insurance quote', 'apply for insurance', 'risk analysis', 'Murfreesboro TN']}
              />
              <PortalAuth defaultIsRegistering={true} onAuthenticated={(user) => {
                  setLeadData(prev => ({ 
                      ...prev, 
                      ...user,
                      firstName: user.firstName || prev.firstName,
                      lastName: user.lastName || prev.lastName,
                      email: user.email || user.eMail || prev.email,
                      phone: user.phone || user.cellPhone || prev.phone,
                      dob: user.dob || prev.dob,
                      address: user.street || user.address || user.addressLine1 || prev.address,
                      city: user.city || prev.city,
                      state: user.state || prev.state,
                      zip: user.zip || user.zipCode || prev.zip
                  }));
                  setStep('LEAD_CAPTURE');
              }} />
          </div>
      );
  }

  if (step === 'LEAD_CAPTURE') {
    return (
      <div className="max-w-4xl mx-auto py-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="glass-card p-10 md:p-14 rounded-[3rem] border border-white/10 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 blur-[80px] rounded-full pointer-events-none"></div>
          
          <div className="relative z-10 space-y-8">
            <div className="text-center space-y-4">
               {activeIndustry ? (
                 <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-widest">
                    <activeIndustry.icon className="w-3 h-3" /> {activeIndustry.name} Quote
                 </div>
               ) : (
                 <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-slate-400 text-xs font-bold uppercase tracking-widest">
                    <Sparkles className="w-3 h-3" /> AI-Powered Intake
                 </div>
               )}
               <h1 className="text-4xl md:text-5xl font-heading font-bold text-white">Applicant Information</h1>
               <p className="text-slate-400 max-w-md mx-auto">
                 Please verify your details below. We've pre-filled what we could from your profile.
               </p>
            </div>

            {/* POLICY UPLOAD SHORTCUT */}
            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-6 text-center space-y-4">
                <h3 className="text-emerald-400 font-bold flex items-center justify-center gap-2">
                    <Zap className="w-5 h-5" /> Fast-Track: Have a current policy?
                </h3>
                <p className="text-xs text-emerald-100/70">Upload your declaration page and let AI auto-fill this entire form for you.</p>
                <button 
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isProcessing}
                    className="mx-auto px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold text-sm flex items-center gap-2 transition-all shadow-lg shadow-emerald-500/20 active:scale-95"
                >
                    {isProcessing ? <Loader2 className="w-4 h-4 animate-spin"/> : <Upload className="w-4 h-4" />}
                    Upload & Auto-Fill
                </button>
                <input type="file" ref={fileInputRef} className="hidden" accept=".pdf,image/*" onChange={handlePolicyUpload} />
            </div>

            <form onSubmit={handleLeadSubmit} className="space-y-6 max-w-2xl mx-auto">
               <div className="grid grid-cols-2 gap-2 bg-white/5 p-1 rounded-2xl border border-white/10">
                  <button type="button" onClick={() => { setLeadData(prev => ({...prev, type: 'Personal'})); setActiveIndustry(null); }} className={`py-3 rounded-xl text-sm font-bold transition-all ${leadData.type === 'Personal' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}>Personal</button>
                  <button type="button" onClick={() => setLeadData(prev => ({...prev, type: 'Commercial'}))} className={`py-3 rounded-xl text-sm font-bold transition-all ${leadData.type === 'Commercial' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}>Commercial</button>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col justify-end">
                    <label className="text-xs font-bold text-slate-400 mb-2 ml-1 uppercase tracking-wider">First Name</label>
                    <input required placeholder="First Name" value={leadData.firstName} onChange={e => setLeadData({...leadData, firstName: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white outline-none focus:border-blue-500 transition-colors" />
                  </div>
                  <div className="flex flex-col justify-end">
                    <label className="text-xs font-bold text-slate-400 mb-2 ml-1 uppercase tracking-wider">Last Name</label>
                    <input required placeholder="Last Name" value={leadData.lastName} onChange={e => setLeadData({...leadData, lastName: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white outline-none focus:border-blue-500 transition-colors" />
                  </div>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col justify-end">
                    <label className="text-xs font-bold text-slate-400 mb-2 ml-1 uppercase tracking-wider">Date of Birth</label>
                    <input type="date" required value={leadData.dob} onChange={e => setLeadData({...leadData, dob: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white outline-none focus:border-blue-500 transition-colors" />
                  </div>
                  <div className="flex flex-col justify-end">
                    <label className="text-xs font-bold text-slate-400 mb-2 ml-1 uppercase tracking-wider">Phone Number</label>
                    <input type="tel" required placeholder="Phone Number" value={leadData.phone} onChange={e => handlePhoneChange(e.target.value)} maxLength={12} className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white outline-none focus:border-blue-500 transition-colors" />
                  </div>
               </div>

               <div className="flex flex-col justify-end">
                 <label className="text-xs font-bold text-slate-400 mb-2 ml-1 uppercase tracking-wider">Email Address</label>
                 <input type="email" required placeholder="Email Address" value={leadData.email} onChange={e => setLeadData({...leadData, email: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white outline-none focus:border-blue-500 transition-colors" />
               </div>

               <div className="space-y-4 pt-4 border-t border-white/10">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Risk Location</span>
                  <input 
                    ref={addressInputRef}
                    required 
                    placeholder="Street Address" 
                    value={leadData.address} 
                    onChange={e => setLeadData({...leadData, address: e.target.value})} 
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white outline-none focus:border-blue-500 transition-colors" 
                  />
                  <div className="grid grid-cols-3 gap-4">
                     <input required placeholder="City" value={leadData.city} onChange={e => setLeadData({...leadData, city: e.target.value})} className="bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white outline-none focus:border-blue-500 transition-colors" />
                     <select value={leadData.state} onChange={e => setLeadData({...leadData, state: e.target.value})} className="bg-slate-900 border border-white/10 rounded-xl px-5 py-4 text-white outline-none focus:border-blue-500 transition-colors">
                        {US_STATES.map(s => <option key={s} value={s} className="bg-slate-900 text-white">{s}</option>)}
                     </select>
                     <input required placeholder="Zip" value={leadData.zip} onChange={e => setLeadData({...leadData, zip: e.target.value})} className="bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white outline-none focus:border-blue-500 transition-colors" />
                  </div>
               </div>

                <button type="submit" disabled={isProcessing} className="w-full py-5 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-bold text-lg shadow-[0_0_30px_rgba(37,99,235,0.3)] hover:shadow-[0_0_50px_rgba(37,99,235,0.5)] transition-all flex items-center justify-center gap-3 disabled:opacity-50 active:scale-95">
                  {isProcessing ? <Loader2 className="w-6 h-6 animate-spin" /> : <Sparkles className="w-6 h-6" />}
                  {isProcessing ? aiStatus : "Analyze Risk Profile"}
                </button>
            </form>
          </div>
        </div>
        
        {/* AUTH MODAL */}
        {showAuthModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in">
            <div className="relative w-full max-w-xl">
                <button 
                    onClick={() => setShowAuthModal(false)}
                    className="absolute top-4 right-4 z-50 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
                >
                    <Trash2 className="w-5 h-5 rotate-45" />
                </button>
                <PortalAuth 
                    defaultIsRegistering={true} 
                    initialData={leadData}
                    onAuthenticated={handleAuthSuccess} 
                />
            </div>
            </div>
        )}
      </div>
    );
  }

  // Refinement Step (Personal)
  if (step === 'REFINEMENT' && leadData.type === 'Personal') {
    return (
      <div className="max-w-5xl mx-auto py-12 animate-in fade-in slide-in-from-right-8 duration-700">
         {/* ... (Existing Header and Grid Layout) ... */}
         <div className="flex justify-between items-center mb-8">
            <div>
               <h2 className="text-3xl font-heading font-bold text-white">Review Detected Assets</h2>
               <p className="text-slate-400">Please verify details. Excluded items will appear on the final report as "Not Covered".</p>
            </div>
            <button onClick={handleNextToCoverage} className="px-8 py-3 bg-blue-600 rounded-xl text-white font-bold hover:bg-blue-500 transition-all flex items-center gap-2">
               Next Step <ChevronRight className="w-4 h-4" />
            </button>
         </div>

         <div className="grid grid-cols-1 gap-8">
            <div className="space-y-4">
               {/* ... (Existing Residents Loop) ... */}
               {formData.residents.map((resident, idx) => {
                  const age = calculateAge(resident.dob);
                  const isStudent = age > 15 && age < 25;

                  return (
                  <div key={resident.id} className={`glass-card rounded-2xl border overflow-hidden transition-all ${resident.status === 'excluded' ? 'border-red-500/20 bg-red-500/5' : 'border-white/5'}`}>
                     <div className={`p-5 flex items-center justify-between cursor-pointer hover:bg-white/5 ${expandedDriverId === resident.id ? 'bg-white/5 border-b border-white/5' : ''}`} onClick={() => toggleDriverExpansion(resident.id)}>
                        <div className="flex items-center gap-4">
                           <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white ${resident.status === 'rated' ? 'bg-blue-600' : 'bg-slate-700'}`}>{resident.firstName?.[0] || 'U'}</div>
                           <div>
                              <div className={`font-bold text-lg ${resident.status === 'excluded' ? 'text-slate-400 line-through decoration-red-500' : 'text-white'}`}>{resident.firstName} {resident.lastName}</div>
                              <div className="text-xs text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                 {resident.relationship} 
                                 {resident.status === 'excluded' && <span className="text-red-400 font-bold flex items-center gap-1"><Ban className="w-3 h-3" /> EXCLUDED</span>}
                                 {isStudent && resident.status === 'rated' && <span className="text-blue-400 font-bold flex items-center gap-1"><GraduationCap className="w-3 h-3" /> Student Driver</span>}
                              </div>
                           </div>
                        </div>
                        {/* ... (Existing Exclude/Restore Buttons) ... */}
                        <div className="flex items-center gap-4">
                           {resident.status !== 'excluded' ? (
                                <button onClick={(e) => { e.stopPropagation(); excludeDriver(resident.id); }} className="p-2 bg-white/5 hover:bg-red-500/20 text-slate-400 hover:text-red-400 rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button>
                           ) : (
                                <button onClick={(e) => { e.stopPropagation(); restoreDriver(resident.id); }} className="p-2 bg-white/5 hover:bg-green-500/20 text-slate-400 hover:text-green-400 rounded-lg transition-colors"><Undo2 className="w-4 h-4" /></button>
                           )}
                           {expandedDriverId === resident.id ? <ChevronUp className="w-5 h-5 text-slate-500" /> : <ChevronDown className="w-5 h-5 text-slate-500" />}
                        </div>
                     </div>

                     {expandedDriverId === resident.id && (
                        <div className="p-6 bg-slate-900/30 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in slide-in-from-top-2">
                           {/* ... (Existing Edit Fields) ... */}
                           {resident.status === 'excluded' && (
                             <div className="col-span-full bg-red-500/10 border border-red-500/30 p-4 rounded-xl mb-2">
                                <label className="text-xs font-bold text-red-400 uppercase flex items-center gap-2 mb-2"><AlertTriangle className="w-4 h-4" /> Exclusion Reason</label>
                                <select value={resident.exclusionReason || ''} onChange={e => updateResident(resident.id, 'exclusionReason', e.target.value)} className="w-full bg-slate-950 border border-red-500/30 rounded-lg px-3 py-3 text-white text-sm outline-none focus:border-red-500">
                                   <option value="">Select Exclusion Reason...</option>
                                   <option value="Own Insurance">Has Own Insurance Policy</option>
                                   <option value="Deceased">Deceased</option>
                                   <option value="Moved Out">No Longer Resides Here</option>
                                   <option value="Never Licensed">Never Licensed / No Permit</option>
                                   <option value="Suspended">License Suspended/Revoked</option>
                                   <option value="Unknown Individual">Unknown Individual</option>
                                </select>
                             </div>
                           )}
                           
                           <div className="space-y-2"><label className="text-[10px] font-bold text-slate-500 uppercase">First Name</label><input value={resident.firstName} onChange={e => updateResident(resident.id, 'firstName', e.target.value)} className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-white text-sm outline-none focus:border-blue-500" /></div>
                           <div className="space-y-2"><label className="text-[10px] font-bold text-slate-500 uppercase">Last Name</label><input value={resident.lastName} onChange={e => updateResident(resident.id, 'lastName', e.target.value)} className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-white text-sm outline-none focus:border-blue-500" /></div>
                           <div className="space-y-2"><label className="text-[10px] font-bold text-slate-500 uppercase">DOB</label><input type="date" value={resident.dob} onChange={e => updateResident(resident.id, 'dob', e.target.value)} className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-white text-sm outline-none focus:border-blue-500" /></div>
                           <div className="space-y-2"><label className="text-[10px] font-bold text-slate-500 uppercase">License #</label><input value={resident.licenseNumber || ''} onChange={e => updateResident(resident.id, 'licenseNumber', e.target.value)} className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-white text-sm outline-none focus:border-blue-500" /></div>
                           <div className="space-y-2"><label className="text-[10px] font-bold text-slate-500 uppercase">State</label><select value={resident.licenseState || leadData.state} onChange={e => updateResident(resident.id, 'licenseState', e.target.value)} className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-white text-sm outline-none focus:border-blue-500">{US_STATES.map(s => <option key={s} value={s}>{s}</option>)}</select></div>
                           
                           <div className="space-y-2"><label className="text-[10px] font-bold text-slate-500 uppercase">Relationship</label>
                              <select value={resident.relationship || 'Other'} onChange={e => updateResident(resident.id, 'relationship', e.target.value)} className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-white text-sm outline-none focus:border-blue-500">
                                 {RELATIONSHIP_TYPES.map(r => <option key={r} value={r}>{r}</option>)}
                              </select>
                           </div>

                           <div className="space-y-2 relative">
                              <label className="text-[10px] font-bold text-slate-500 uppercase">Occupation</label>
                              <input 
                                  value={resident.occupation || ''} 
                                  onChange={e => updateResident(resident.id, 'occupation', e.target.value)} 
                                  list={`occupations-${resident.id}`}
                                  className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-white text-sm outline-none focus:border-blue-500" 
                                  placeholder="Type to search..."
                              />
                              <datalist id={`occupations-${resident.id}`}>
                                  {STANDARD_OCCUPATIONS.map(occ => <option key={occ} value={occ} />)}
                              </datalist>
                           </div>

                           <div className="space-y-2"><label className="text-[10px] font-bold text-slate-500 uppercase">Marital Status</label>
                              <select value={resident.maritalStatus || ''} onChange={e => updateResident(resident.id, 'maritalStatus', e.target.value)} className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-white text-sm outline-none focus:border-blue-500">
                                 <option value="">Select...</option>
                                 <option value="Single">Single</option>
                                 <option value="Married">Married</option>
                                 <option value="Divorced">Divorced</option>
                                 <option value="Widowed">Widowed</option>
                                 <option value="Separated">Separated</option>
                              </select>
                           </div>



                           <div className="space-y-2"><label className="text-[10px] font-bold text-slate-500 uppercase">Email</label><input type="email" value={resident.email || ''} onChange={e => updateResident(resident.id, 'email', e.target.value)} className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-white text-sm outline-none focus:border-blue-500" /></div>
                           <div className="space-y-2"><label className="text-[10px] font-bold text-slate-500 uppercase">Phone</label><input type="tel" value={resident.phone || ''} onChange={e => updateResident(resident.id, 'phone', formatPhoneNumber(e.target.value))} className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-white text-sm outline-none focus:border-blue-500" /></div>

                           {/* YOUNG DRIVER LOGIC */}
                           {isStudent && resident.status === 'rated' && (
                               <div className="col-span-full mt-2 p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl">
                                   <h4 className="text-xs font-bold text-blue-300 uppercase tracking-widest mb-3 flex items-center gap-2">
                                       <GraduationCap className="w-4 h-4" /> Student Status
                                   </h4>
                                   <div className="flex items-center justify-between gap-4 mb-4">
                                       <div className="text-xs text-slate-300">Is {resident.firstName} a full-time student?</div>
                                       <div className="flex gap-4">
                                           <label className="flex items-center gap-2 text-white text-xs font-bold"><input type="radio" name={`student-${resident.id}`} checked={resident.isStudent === true} onChange={() => updateResident(resident.id, 'isStudent', true)} /> Yes</label>
                                           <label className="flex items-center gap-2 text-white text-xs font-bold"><input type="radio" name={`student-${resident.id}`} checked={resident.isStudent === false} onChange={() => updateResident(resident.id, 'isStudent', false)} /> No</label>
                                       </div>
                                   </div>
                                   
                                   {resident.isStudent && (
                                      <>
                                       <div className="flex items-center justify-between gap-4">
                                           <div className="text-xs text-slate-300">Does {resident.firstName} have a 3.0 GPA or better (B Average for any one semester, or cumulative)?</div>
                                           <div className="flex gap-4">
                                               <label className="flex items-center gap-2 text-white text-xs font-bold"><input type="radio" name={`gpa-${resident.id}`} checked={resident.goodStudentDiscount === true} onChange={() => updateResident(resident.id, 'goodStudentDiscount', true)} /> Yes</label>
                                               <label className="flex items-center gap-2 text-white text-xs font-bold"><input type="radio" name={`gpa-${resident.id}`} checked={resident.goodStudentDiscount === false} onChange={() => updateResident(resident.id, 'goodStudentDiscount', false)} /> No</label>
                                           </div>
                                       </div>
                                       
                                       <div className="flex items-center justify-between gap-4 mt-2">
                                           <div className="text-xs text-slate-300">Has {resident.firstName} completed a driver training course?</div>
                                           <div className="flex gap-4">
                                               <label className="flex items-center gap-2 text-white text-xs font-bold"><input type="radio" name={`training-${resident.id}`} checked={resident.driverTrainingDiscount === true} onChange={() => updateResident(resident.id, 'driverTrainingDiscount', true)} /> Yes</label>
                                               <label className="flex items-center gap-2 text-white text-xs font-bold"><input type="radio" name={`training-${resident.id}`} checked={resident.driverTrainingDiscount === false} onChange={() => updateResident(resident.id, 'driverTrainingDiscount', false)} /> No</label>
                                           </div>
                                       </div>

                                       <div className="mt-3">
                                           <label className="block text-[10px] text-blue-300/70 mb-1">Upload Transcript (Latest Report Card)</label>
                                           <input type="file" className="text-xs text-slate-400" />
                                       </div>
                                      </>
                                   )}
                               </div>
                           )}
                        </div>
                     )}
                  </div>
               )})}
               
               <button onClick={addDriver} className="w-full py-4 border border-dashed border-white/10 rounded-2xl text-slate-500 hover:text-white hover:bg-white/10 transition-all flex items-center justify-center gap-2 font-bold text-sm cursor-pointer"><Plus className="w-4 h-4" /> Add Another Driver</button>
            </div>

            {/* ... (Existing Vehicles Section) ... */}
            <div className="space-y-4">
               {/* ... vehicle mapping ... */}
               {formData.vehicles.filter(v => v.active !== false).map((vehicle, idx) => (
                  // ... (Existing Vehicle Card Code - Keeping it brief for this response) ...
                  <div key={vehicle.id} className="glass-card p-6 rounded-2xl border border-white/5 transition-all group space-y-4 relative">
                      <div className="flex justify-between items-start cursor-pointer" onClick={() => toggleVehicleExpansion(vehicle.id)}>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 flex-grow mr-10">
                              <div className="text-xl font-bold text-white">{vehicle.year} {vehicle.make} {vehicle.model}</div>
                              <div className="col-span-3 text-xs text-slate-500 font-mono tracking-widest uppercase flex gap-2 items-center">
                                  {vehicle.vin || 'VIN Missing'}
                                  {vehicle.recalls && vehicle.recalls.length > 0 && <span className="flex items-center gap-1 text-red-400 font-bold bg-red-500/10 px-2 py-0.5 rounded"><AlertTriangle className="w-3 h-3" /> {vehicle.recalls.length} Recalls</span>}
                              </div>
                          </div>
                          <div className="absolute top-6 right-6 flex items-center gap-2">
                              <button onClick={() => deleteVehicle(vehicle.id)} className="p-2 hover:bg-red-500/20 rounded-lg text-slate-400 hover:text-red-400 transition-all"><Trash2 className="w-4 h-4" /></button>
                          </div>
                      </div>
                      
                      {expandedVehicleId === vehicle.id && (
                          <div className="animate-in slide-in-from-top-2 pt-4 border-t border-white/5 mt-4 space-y-6">
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-white/5 p-4 rounded-xl border border-white/10">
                                  <div className="space-y-1"><label className="text-[9px] font-bold text-slate-500 uppercase">Year</label><input type="number" value={vehicle.year} onChange={e => updateVehicle(vehicle.id, 'year', e.target.value)} className="w-full bg-slate-900 border border-white/10 rounded-lg px-2 py-1 text-white text-sm" /></div>
                                  <div className="space-y-1"><label className="text-[9px] font-bold text-slate-500 uppercase">Make</label><input value={vehicle.make} onChange={e => updateVehicle(vehicle.id, 'make', e.target.value)} className="w-full bg-slate-900 border border-white/10 rounded-lg px-2 py-1 text-white text-sm" /></div>
                                  <div className="space-y-1"><label className="text-[9px] font-bold text-slate-500 uppercase">Model</label><input value={vehicle.model} onChange={e => updateVehicle(vehicle.id, 'model', e.target.value)} className="w-full bg-slate-900 border border-white/10 rounded-lg px-2 py-1 text-white text-sm" /></div>
                                  <div className="space-y-1"><label className="text-[9px] font-bold text-slate-500 uppercase">VIN</label><input value={vehicle.vin || ''} onChange={e => updateVehicle(vehicle.id, 'vin', e.target.value)} className="w-full bg-slate-900 border border-white/10 rounded-lg px-2 py-1 text-white text-sm font-mono" /></div>
                              </div>
                              
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                 <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-slate-500 uppercase">Primary Usage</label>
                                    <select value={vehicle.usage} onChange={e => updateVehicle(vehicle.id, 'usage', e.target.value)} className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-white text-sm outline-none focus:border-blue-500">
                                       <option value="commute">To/From Work or School</option>
                                       <option value="pleasure">Pleasure / Weekend Only</option>
                                       <option value="business">Business Use</option>
                                       <option value="farm">Farm Use</option>
                                       <option value="collector">Collector / Antique</option>
                                    </select>
                                 </div>
                                 <div className="space-y-2 relative">
                                    <label className="text-[10px] font-bold text-slate-500 uppercase flex justify-between">
                                        Annual Mileage
                                        <button onClick={() => { setMileageCalcVehicleId(vehicle.id); setTempWeeklyMiles(''); }} className="text-blue-400 hover:text-blue-300 flex items-center gap-1">
                                            <Calculator className="w-3 h-3" /> Calc
                                        </button>
                                    </label>
                                    <input type="number" placeholder="e.g. 12000" value={vehicle.annualMileage || ''} onChange={e => updateVehicle(vehicle.id, 'annualMileage', parseInt(e.target.value))} className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-white text-sm outline-none focus:border-blue-500" />
                                    
                                    {mileageCalcVehicleId === vehicle.id && (
                                        <div className="absolute top-full right-0 mt-2 w-64 bg-slate-900 border border-white/10 rounded-xl p-4 shadow-xl z-50">
                                            <h4 className="text-xs font-bold text-white mb-2 flex items-center gap-2"><Calculator className="w-3 h-3 text-blue-400"/> Weekly Mileage Calc</h4>
                                            <div className="space-y-3">
                                                <div>
                                                    <label className="text-[10px] text-slate-500 uppercase">Miles per Week</label>
                                                    <input 
                                                        type="number" 
                                                        value={tempWeeklyMiles} 
                                                        onChange={(e) => setTempWeeklyMiles(e.target.value)}
                                                        className="w-full bg-black/30 border border-white/10 rounded-lg px-2 py-1 text-white text-sm"
                                                        placeholder="e.g. 200"
                                                        autoFocus
                                                    />
                                                </div>
                                                <div className="text-xs text-slate-400">
                                                    ≈ {parseInt(tempWeeklyMiles || '0') * 52} miles/year
                                                </div>
                                                <div className="flex justify-end gap-2">
                                                    <button onClick={() => setMileageCalcVehicleId(null)} className="px-3 py-1 text-xs text-slate-400 hover:text-white">Cancel</button>
                                                    <button onClick={() => calculateWeeklyMiles(vehicle.id)} className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-lg">Apply</button>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                 </div>
                              </div>

                              {/* TELEMATICS OPT-IN */}
                              <div className="bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-xl flex items-start gap-4">
                                 <div className="mt-1">
                                    <input 
                                       type="checkbox" 
                                       checked={vehicle.telematicsOptIn || false}
                                       onChange={e => updateVehicle(vehicle.id, 'telematicsOptIn', e.target.checked)}
                                       className="w-5 h-5 accent-emerald-500 rounded cursor-pointer"
                                    />
                                 </div>
                                 <div>
                                    <h4 className="text-emerald-400 font-bold text-sm flex items-center gap-2">
                                       <Activity className="w-4 h-4" /> Safe Driving Discount (Telematics)
                                    </h4>
                                    <p className="text-xs text-emerald-200/70 mt-1">
                                       Opt-in to a safe driving program (like Snapshot or DriveSafe) to save up to 30%. 
                                       This uses a mobile app to track driving habits like hard braking and late-night driving.
                                    </p>
                                 </div>
                              </div>

                              {/* RIDESHARE QUESTION */}
                              <div className="bg-slate-800/50 border border-white/10 p-4 rounded-xl">
                                 <div className="flex items-center justify-between gap-4">
                                    <div className="text-sm text-white font-medium">Is this vehicle used for delivery or ride-sharing?</div>
                                    <div className="flex gap-4">
                                       <label className="flex items-center gap-2 text-white text-xs font-bold cursor-pointer">
                                          <input type="radio" name={`rideshare-${vehicle.id}`} checked={vehicle.isRideshare === true} onChange={() => updateVehicle(vehicle.id, 'isRideshare', true)} className="accent-blue-500" /> Yes
                                       </label>
                                       <label className="flex items-center gap-2 text-white text-xs font-bold cursor-pointer">
                                          <input type="radio" name={`rideshare-${vehicle.id}`} checked={vehicle.isRideshare === false} onChange={() => updateVehicle(vehicle.id, 'isRideshare', false)} className="accent-blue-500" /> No
                                       </label>
                                    </div>
                                 </div>
                                 {vehicle.isRideshare && (
                                    <div className="mt-4 pt-4 border-t border-white/10 space-y-3">
                                       <p className="text-xs text-slate-400">Select all that apply:</p>
                                       <div className="grid grid-cols-2 gap-2">
                                          <label className="flex items-center gap-2 text-xs text-white"><input type="checkbox" checked={vehicle.ridesharepassenger} onChange={e => updateVehicle(vehicle.id, 'ridesharepassenger', e.target.checked)} /> Passengers (Uber/Lyft)</label>
                                          <label className="flex items-center gap-2 text-xs text-white"><input type="checkbox" checked={vehicle.ridesharedelivery} onChange={e => updateVehicle(vehicle.id, 'ridesharedelivery', e.target.checked)} /> Food/Grocery (DoorDash/Instacart)</label>
                                          <label className="flex items-center gap-2 text-xs text-white"><input type="checkbox" checked={vehicle.rideshareother} onChange={e => updateVehicle(vehicle.id, 'rideshareother', e.target.checked)} /> Package Delivery (Amazon Flex)</label>
                                       </div>
                                    </div>
                                 )}
                              </div>

                              {/* RECALLS SECTION */}
                              {vehicle.recalls && vehicle.recalls.length > 0 && (
                                 <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-xl">
                                    <details className="group">
                                       <summary className="flex items-center justify-between cursor-pointer list-none">
                                          <h4 className="text-red-400 font-bold text-sm flex items-center gap-2">
                                             <AlertTriangle className="w-4 h-4" /> {vehicle.recalls.length} Safety Recalls Found
                                          </h4>
                                          <ChevronDown className="w-4 h-4 text-red-400 group-open:rotate-180 transition-transform" />
                                       </summary>
                                       <div className="mt-4 space-y-4">
                                          <p className="text-[10px] text-red-300/70 italic">
                                             Disclaimer: This list may not be complete and is not vehicle-specific. The recall may have already been fixed. Please check with a dealer for specific details. For informational purposes only.
                                          </p>
                                          {vehicle.recalls.map((recall, i) => (
                                             <div key={i} className="bg-slate-950/50 p-3 rounded-lg border border-red-500/10">
                                                <div className="text-xs font-bold text-white mb-1">{recall.Component}</div>
                                                <div className="text-[10px] text-slate-400 mb-2">{recall.Summary}</div>
                                                <div className="text-[10px] text-emerald-400/80"><span className="font-bold">Remedy:</span> {recall.Remedy}</div>
                                             </div>
                                          ))}
                                       </div>
                                    </details>
                                 </div>
                              )}

                              {/* COVERAGE SECTION */}
                              <div className="bg-slate-800/50 border border-white/10 p-4 rounded-xl space-y-4">
                              <div className="col-span-full mt-4 border-t border-white/10 pt-4">
                                  <label className="flex items-center gap-2 text-sm text-slate-300 cursor-pointer">
                                      <input type="checkbox" checked={vehicle.lien} onChange={e => updateVehicle(vehicle.id, 'lien', e.target.checked)} className="rounded border-white/20 bg-white/5 text-blue-600 focus:ring-blue-500" />
                                      Is this vehicle financed or leased?
                                  </label>
                                  
                                  {vehicle.lien && (
                                      <div className="mt-4 space-y-4 animate-in fade-in slide-in-from-top-2">
                                          <div className="relative">
                                              <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Lienholder Name (Search)</label>
                                              <div className="relative">
                                                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                                  <input 
                                                      value={vehicle.lienholderName || ''} 
                                                      onChange={e => {
                                                          updateVehicle(vehicle.id, 'lienholderName', e.target.value);
                                                          if (e.target.value.length > 2) handleLienholderSearch(vehicle.id, e.target.value);
                                                      }}
                                                      className="w-full bg-slate-950 border border-white/10 rounded-xl pl-10 pr-3 py-2 text-white text-sm outline-none focus:border-blue-500" 
                                                      placeholder="Start typing bank name..."
                                                  />
                                                  {searchingLienholderId === vehicle.id && <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 animate-spin text-blue-500" />}
                                              </div>
                                          </div>
                                          
                                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                              <div className="space-y-1"><label className="text-[9px] font-bold text-slate-500 uppercase">Address</label><input value={vehicle.lienholderAddress || ''} onChange={e => updateVehicle(vehicle.id, 'lienholderAddress', e.target.value)} className="w-full bg-slate-900 border border-white/10 rounded-lg px-2 py-1 text-white text-sm" /></div>
                                              <div className="grid grid-cols-3 gap-2">
                                                  <div className="space-y-1"><label className="text-[9px] font-bold text-slate-500 uppercase">City</label><input value={vehicle.lienholderCity || ''} onChange={e => updateVehicle(vehicle.id, 'lienholderCity', e.target.value)} className="w-full bg-slate-900 border border-white/10 rounded-lg px-2 py-1 text-white text-sm" /></div>
                                                  <div className="space-y-1"><label className="text-[9px] font-bold text-slate-500 uppercase">State</label><input value={vehicle.lienholderState || ''} onChange={e => updateVehicle(vehicle.id, 'lienholderState', e.target.value)} className="w-full bg-slate-900 border border-white/10 rounded-lg px-2 py-1 text-white text-sm" /></div>
                                                  <div className="space-y-1"><label className="text-[9px] font-bold text-slate-500 uppercase">Zip</label><input value={vehicle.lienholderZip || ''} onChange={e => updateVehicle(vehicle.id, 'lienholderZip', e.target.value)} className="w-full bg-slate-900 border border-white/10 rounded-lg px-2 py-1 text-white text-sm" /></div>
                                              </div>
                                          </div>
                                      </div>
                                  )}
                              </div>
                              </div>
                          </div>
                      )}
                  </div>
               ))}
               <button onClick={addVehicle} className="w-full py-4 border border-dashed border-white/10 rounded-2xl text-slate-500 hover:text-white hover:bg-white/10 transition-all flex items-center justify-center gap-2 font-bold text-sm cursor-pointer"><Plus className="w-4 h-4" /> Add Another Vehicle</button>
               
               <button onClick={handleNextToCoverage} className="w-full mt-4 py-5 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-bold text-lg shadow-xl transition-all flex items-center justify-center gap-3 active:scale-95">Continue to Coverage <ChevronRight className="w-5 h-5" /></button>
            </div>
         </div>
      </div>
    );
  }

  // --- SUMMARY STEP (Submission) ---
  if (step === 'SUMMARY' && leadData.type === 'Personal') {
     return (
        <div className="max-w-5xl mx-auto py-12 px-6 animate-in fade-in slide-in-from-bottom-8 duration-700">
           {/* ... (Existing Summary Header/Options) ... */}
           
           <div className="space-y-12">
              {/* Agency Brokered Options */}
              <div className="space-y-6">
                 <h3 className="text-lg font-bold text-white uppercase tracking-widest border-b border-white/10 pb-4 flex items-center gap-2"><Shield className="w-5 h-5 text-blue-400" /> Agency Brokered Options</h3>
                 <div className="glass-card p-8 md:p-12 rounded-[2.5rem] border border-white/10 bg-slate-900/50 text-center space-y-8">
                    <div className="max-w-2xl mx-auto space-y-4">
                       <h4 className="text-2xl font-bold text-white">Comparing 15+ Additional Carriers...</h4>
                       <p className="text-slate-400 text-sm leading-relaxed">Our agents are currently running your risk profile through carriers like Progressive, Travelers, Liberty Mutual, and Hartford.</p>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
                       <button onClick={handleFinalSubmission} disabled={isProcessing} className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold transition-all shadow-lg flex items-center gap-2 justify-center">
                          {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileText className="w-4 h-4" />} Submit & View Dashboard
                       </button>
                    </div>
                 </div>
              </div>
           </div>
        </div>
     );
  }

  // Fallback for Coverage Step (minimal change needed here, just ensuring flow)
  if (step === 'COVERAGE' && leadData.type === 'Personal') {
      return (
          <div className="max-w-4xl mx-auto py-12 animate-in fade-in">
              <div className="glass-card p-8 md:p-12 rounded-[3rem] border border-white/10 space-y-8">
                  <div className="text-center space-y-4">
                     <h2 className="text-4xl font-heading font-bold text-white">Coverage Selection</h2>
                     <p className="text-slate-400 max-w-md mx-auto">
                       Customize your policy limits and vehicle-specific coverages.
                     </p>
                  </div>

                  <div className="space-y-6">
                     <h3 className="text-lg font-bold text-white uppercase tracking-widest border-b border-white/10 pb-4">Policy Level Coverages</h3>
                     
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                           <label className="text-xs font-bold text-slate-500 uppercase">Bodily Injury Liability</label>
                           <select 
                              value={formData.policyCoverage?.autoLimits || '100/300'} 
                              onChange={e => setFormData({...formData, policyCoverage: {...formData.policyCoverage, autoLimits: e.target.value} as any})}
                              className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-blue-500"
                           >
                              <option value="25/50">State Minimum (25/50)</option>
                              <option value="50/100">50/100</option>
                              <option value="100/300">100/300 (Recommended)</option>
                              <option value="250/500">250/500</option>
                           </select>
                        </div>
                        
                        <div className="space-y-2">
                           <label className="text-xs font-bold text-slate-500 uppercase">Medical Payments</label>
                           <select 
                              value={formData.policyCoverage?.medicalPayments || '5000'} 
                              onChange={e => setFormData({...formData, policyCoverage: {...formData.policyCoverage, medicalPayments: e.target.value} as any})}
                              className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-blue-500"
                           >
                              <option value="0">None</option>
                              <option value="1000">$1,000</option>
                              <option value="5000">$5,000</option>
                              <option value="10000">$10,000</option>
                           </select>
                        </div>

                        <div className="col-span-full flex items-center justify-between bg-white/5 p-4 rounded-xl border border-white/10">
                           <div>
                              <div className="text-sm font-bold text-white">Uninsured Motorist Coverage</div>
                              <div className="text-xs text-slate-400">Matches Bodily Injury Limits</div>
                           </div>
                           <label className="relative inline-flex items-center cursor-pointer">
                              <input 
                                 type="checkbox" 
                                 checked={formData.policyCoverage?.uninsuredMotorist !== false} 
                                 onChange={e => setFormData({...formData, policyCoverage: {...formData.policyCoverage, uninsuredMotorist: e.target.checked} as any})}
                                 className="sr-only peer" 
                              />
                              <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                           </label>
                        </div>
                     </div>
                  </div>

                  <div className="space-y-6 pt-6 border-t border-white/10">
                     <h3 className="text-lg font-bold text-white uppercase tracking-widest border-b border-white/10 pb-4">Vehicle Coverages</h3>
                     
                     {formData.vehicles.map(vehicle => (
                        <div key={vehicle.id} className="bg-slate-900/50 p-6 rounded-2xl border border-white/5 space-y-4">
                           <div className="flex items-center justify-between">
                              <h4 className="font-bold text-white text-lg">{vehicle.year} {vehicle.make} {vehicle.model}</h4>
                              {vehicle.lien && <span className="text-xs font-bold px-2 py-1 bg-amber-500/10 text-amber-400 rounded uppercase tracking-widest">Financed/Leased</span>}
                           </div>
                           
                           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="space-y-2">
                                 <label className="text-xs font-bold text-slate-500 uppercase">Comprehensive Deductible</label>
                                 <select 
                                    value={vehicle.coverages?.comp || (vehicle.lien ? '500' : 'None')} 
                                    onChange={e => {
                                       const newCoverages = {...(vehicle.coverages || {}), comp: e.target.value};
                                       updateVehicle(vehicle.id, 'coverages', newCoverages);
                                    }}
                                    className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-blue-500"
                                 >
                                    {!vehicle.lien && <option value="None">No Coverage</option>}
                                    <option value="250">$250</option>
                                    <option value="500">$500</option>
                                    <option value="1000">$1,000</option>
                                 </select>
                              </div>
                              
                              <div className="space-y-2">
                                 <label className="text-xs font-bold text-slate-500 uppercase">Collision Deductible</label>
                                 <select 
                                    value={vehicle.coverages?.coll || (vehicle.lien ? '500' : 'None')} 
                                    onChange={e => {
                                       const newCoverages = {...(vehicle.coverages || {}), coll: e.target.value};
                                       updateVehicle(vehicle.id, 'coverages', newCoverages);
                                    }}
                                    className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-blue-500"
                                 >
                                    {!vehicle.lien && <option value="None">No Coverage</option>}
                                    <option value="250">$250</option>
                                    <option value="500">$500</option>
                                    <option value="1000">$1,000</option>
                                 </select>
                              </div>
                              
                              <div className="space-y-2">
                                 <label className="text-xs font-bold text-slate-500 uppercase">Rental Reimbursement</label>
                                 <select 
                                    value={vehicle.coverages?.rental || 'None'} 
                                    onChange={e => {
                                       const newCoverages = {...(vehicle.coverages || {}), rental: e.target.value};
                                       updateVehicle(vehicle.id, 'coverages', newCoverages);
                                    }}
                                    className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-blue-500"
                                 >
                                    <option value="None">None</option>
                                    <option value="30/900">$30 / $900</option>
                                    <option value="40/1200">$40 / $1200</option>
                                    <option value="50/1500">$50 / $1500</option>
                                 </select>
                              </div>
                              
                              <div className="space-y-2">
                                 <label className="text-xs font-bold text-slate-500 uppercase">Roadside Assistance</label>
                                 <select 
                                    value={vehicle.coverages?.towing || 'None'} 
                                    onChange={e => {
                                       const newCoverages = {...(vehicle.coverages || {}), towing: e.target.value};
                                       updateVehicle(vehicle.id, 'coverages', newCoverages);
                                    }}
                                    className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-blue-500"
                                 >
                                    <option value="None">None</option>
                                    <option value="Included">Included</option>
                                 </select>
                              </div>
                           </div>
                        </div>
                     ))}
                  </div>

                  <button onClick={() => setStep('SUMMARY')} className="w-full py-5 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-bold text-lg shadow-xl transition-all flex items-center justify-center gap-3 active:scale-95 mt-8">Get Final Quotes <ChevronRight className="w-5 h-5" /></button>
              </div>
          </div>
      );
  }

  // --- COMMERCIAL STEPS ---
  if (step === 'COMMERCIAL_RISK') {
    return (
      <div className="max-w-4xl mx-auto py-12 animate-in fade-in slide-in-from-right-8 duration-700">
        <div className="glass-card p-10 md:p-14 rounded-[3rem] border border-white/10 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 blur-[80px] rounded-full pointer-events-none"></div>
          
          <div className="relative z-10 space-y-8">
            <div className="text-center space-y-4">
               <h2 className="text-4xl font-heading font-bold text-white">Business Details</h2>
               <p className="text-slate-400 max-w-md mx-auto">
                 Tell us about your business so we can match you with the right commercial carriers.
               </p>
            </div>

            <form onSubmit={(e) => { e.preventDefault(); setStep('COMMERCIAL_DETAILS'); }} className="space-y-6 max-w-2xl mx-auto">
               <div className="space-y-4">
                  <div className="space-y-1">
                     <label className="text-xs text-slate-400 font-medium ml-1">Legal Business Name</label>
                     <input required placeholder="Legal Business Name" value={leadData.commercialName} onChange={e => setLeadData({...leadData, commercialName: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white outline-none focus:border-blue-500 transition-colors" />
                  </div>
                  
                  <div className="space-y-1 relative">
                     <label className="text-xs text-slate-400 font-medium ml-1">Industry / SIC Code</label>
                     <input 
                       required 
                       placeholder="Search your industry (e.g., Plumbing, Retail)" 
                       value={sicSearchTerm} 
                       onChange={e => {
                         setSicSearchTerm(e.target.value);
                         if (e.target.value.length > 2) {
                           const results = SIC_INDUSTRIES.filter(ind => 
                             ind.name.toLowerCase().includes(e.target.value.toLowerCase()) || 
                             ind.sicCode.includes(e.target.value)
                           ).slice(0, 5);
                           setSicResults(results);
                         } else {
                           setSicResults([]);
                         }
                       }} 
                       className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white outline-none focus:border-blue-500 transition-colors" 
                     />
                     {sicResults.length > 0 && (
                       <div className="absolute z-20 w-full mt-1 bg-slate-800 border border-white/10 rounded-xl shadow-xl overflow-hidden">
                         {sicResults.map((result, idx) => (
                           <div 
                             key={idx} 
                             className="px-4 py-3 hover:bg-white/5 cursor-pointer text-sm text-white flex justify-between items-center"
                             onClick={() => {
                               setSicSearchTerm(result.name);
                               setCommercialData({...commercialData, sic: result.sicCode, description: result.name});
                               setSicResults([]);
                             }}
                           >
                             <span>{result.name}</span>
                             <span className="text-xs text-slate-400 font-mono">SIC: {result.sicCode}</span>
                           </div>
                         ))}
                       </div>
                     )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <div className="space-y-1">
                        <label className="text-xs text-slate-400 font-medium ml-1">Year Started</label>
                        <input type="number" required placeholder="YYYY" value={commercialData.yearBizStarted} onChange={e => setCommercialData({...commercialData, yearBizStarted: parseInt(e.target.value)})} className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white outline-none focus:border-blue-500 transition-colors" />
                     </div>
                     <div className="space-y-1">
                        <label className="text-xs text-slate-400 font-medium ml-1">Annual Sales ($)</label>
                        <input type="number" required placeholder="e.g., 500000" value={commercialData.annualSales || ''} onChange={e => setCommercialData({...commercialData, annualSales: parseInt(e.target.value)})} className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white outline-none focus:border-blue-500 transition-colors" />
                     </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <div className="space-y-1">
                        <label className="text-xs text-slate-400 font-medium ml-1">Full-Time Employees</label>
                        <input type="number" required placeholder="0" value={commercialData.numberOfFullTimeEmployees || ''} onChange={e => setCommercialData({...commercialData, numberOfFullTimeEmployees: parseInt(e.target.value)})} className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white outline-none focus:border-blue-500 transition-colors" />
                     </div>
                     <div className="space-y-1">
                        <label className="text-xs text-slate-400 font-medium ml-1">Total Payroll ($)</label>
                        <input type="number" required placeholder="e.g., 150000" value={commercialData.totalPayroll || ''} onChange={e => setCommercialData({...commercialData, totalPayroll: parseInt(e.target.value)})} className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white outline-none focus:border-blue-500 transition-colors" />
                     </div>
                  </div>
               </div>

               <button type="submit" className="w-full py-5 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-bold text-lg shadow-[0_0_30px_rgba(37,99,235,0.3)] hover:shadow-[0_0_50px_rgba(37,99,235,0.5)] transition-all flex items-center justify-center gap-3 active:scale-95">
                 Continue to Coverage <ChevronRight className="w-5 h-5" />
               </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  if (step === 'COMMERCIAL_DETAILS') {
    return (
      <div className="max-w-4xl mx-auto py-12 animate-in fade-in slide-in-from-right-8 duration-700">
        <div className="glass-card p-10 md:p-14 rounded-[3rem] border border-white/10 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 blur-[80px] rounded-full pointer-events-none"></div>
          
          <div className="relative z-10 space-y-8">
            <div className="text-center space-y-4">
               <h2 className="text-4xl font-heading font-bold text-white">Coverage Needs</h2>
               <p className="text-slate-400 max-w-md mx-auto">
                 Select the types of insurance you need for your business.
               </p>
            </div>

            <form onSubmit={(e) => { e.preventDefault(); setStep('COMMERCIAL_SUMMARY'); }} className="space-y-6 max-w-2xl mx-auto">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { id: 'General Liability', label: 'General Liability', icon: Shield },
                    { id: 'Workers Comp', label: 'Workers Compensation', icon: Users },
                    { id: 'Commercial Auto', label: 'Commercial Auto', icon: Truck },
                    { id: 'BOP', label: 'Business Owners Policy', icon: Building },
                    { id: 'Cyber', label: 'Cyber Liability', icon: Zap },
                    { id: 'Professional', label: 'Professional Liability (E&O)', icon: Briefcase }
                  ].map(line => (
                    <label key={line.id} className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all ${formData.bundledLines.includes(line.id) ? 'bg-blue-500/10 border-blue-500/50 text-white' : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10'}`}>
                      <input 
                        type="checkbox" 
                        className="hidden"
                        checked={formData.bundledLines.includes(line.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFormData({...formData, bundledLines: [...formData.bundledLines, line.id]});
                          } else {
                            setFormData({...formData, bundledLines: formData.bundledLines.filter(l => l !== line.id)});
                          }
                        }}
                      />
                      <line.icon className={`w-5 h-5 ${formData.bundledLines.includes(line.id) ? 'text-blue-400' : ''}`} />
                      <span className="font-bold text-sm">{line.label}</span>
                    </label>
                  ))}
               </div>

               <button type="submit" className="w-full py-5 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-bold text-lg shadow-[0_0_30px_rgba(37,99,235,0.3)] hover:shadow-[0_0_50px_rgba(37,99,235,0.5)] transition-all flex items-center justify-center gap-3 active:scale-95">
                 Get Commercial Quotes <ChevronRight className="w-5 h-5" />
               </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  if (step === 'COMMERCIAL_SUMMARY') {
     return (
        <div className="max-w-5xl mx-auto py-12 px-6 animate-in fade-in slide-in-from-bottom-8 duration-700">
           <div className="space-y-12">
              <div className="space-y-6">
                 <h3 className="text-lg font-bold text-white uppercase tracking-widest border-b border-white/10 pb-4 flex items-center gap-2"><Briefcase className="w-5 h-5 text-blue-400" /> Commercial Quote Options</h3>
                 <div className="glass-card p-8 md:p-12 rounded-[2.5rem] border border-white/10 bg-slate-900/50 text-center space-y-8">
                    <div className="max-w-2xl mx-auto space-y-4">
                       <h4 className="text-2xl font-bold text-white">Analyzing Appetite Guides...</h4>
                       <p className="text-slate-400 text-sm leading-relaxed">We are matching your SIC code ({commercialData.sic}) and business profile with carriers like NEXT, Thimble, Coterie, and more.</p>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
                       <button onClick={handleFinalSubmission} disabled={isProcessing} className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold transition-all shadow-lg flex items-center gap-2 justify-center">
                          {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileText className="w-4 h-4" />} Submit to Agency & View Dashboard
                       </button>
                    </div>
                 </div>
              </div>
           </div>
        </div>
     );
  }

  return <div>Loading...</div>;
};

export default QuoteForm;
