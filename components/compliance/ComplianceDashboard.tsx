import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Shield, Plus, Building2, AlertCircle, CheckCircle2, Clock, FileWarning, X, Mail, Search, MapPin, Network } from 'lucide-react';
import { Project, Vendor } from '../../src/types/compliance';
import { SIC_CODES } from '../../src/data/reference/sicCodes';

// Mock Address Suggestions removed - using Google Autocomplete

declare global {
  interface Window {
    google: any;
  }
}

export const ComplianceDashboard: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [showNewProjectModal, setShowNewProjectModal] = useState(false);
  const [showInviteVendorModal, setShowInviteVendorModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  // New Vendor Form State
  const [newVendor, setNewVendor] = useState({
    companyName: '',
    contactName: '',
    email: '',
    phone: '',
    address: { street: '', city: '', state: '', zip: '' },
    industry: { sicCode: '', description: '' },
    trade: ''
  });

  // Autocomplete States
  const [sicSearch, setSicSearch] = useState('');
  const [showSicSuggestions, setShowSicSuggestions] = useState(false);
  
  // Google Autocomplete Ref
  const addressInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (showInviteVendorModal && addressInputRef.current && window.google) {
      const autocomplete = new window.google.maps.places.Autocomplete(addressInputRef.current, {
        types: ['address'],
        componentRestrictions: { country: 'us' }
      });

      autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace();
        if (place.address_components) {
          let street = '';
          let streetNum = '';
          let city = '';
          let state = '';
          let zip = '';

          place.address_components.forEach(component => {
            const types = component.types;
            if (types.includes('street_number')) streetNum = component.long_name;
            if (types.includes('route')) street = component.long_name;
            if (types.includes('locality')) city = component.long_name;
            if (types.includes('administrative_area_level_1')) state = component.short_name;
            if (types.includes('postal_code')) zip = component.long_name;
          });

          setNewVendor(prev => ({
            ...prev,
            address: {
              street: `${streetNum} ${street}`.trim(),
              city,
              state,
              zip
            }
          }));
        }
      });
    }
  }, [showInviteVendorModal]);

  useEffect(() => {
    // TODO: Fetch projects and vendors from API
    setProjects([
      {
        id: 'proj-1',
        organizationId: 'org-1',
        name: 'Downtown Highrise Renovation',
        description: 'Full interior renovation of 40-story building',
        location: 'Seattle, WA',
        status: 'Active',
        requirements: {} as any,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ]);
    
    // Mock Vendors
    setVendors([
      {
        id: 'ven-1',
        projectId: 'proj-1',
        organizationId: 'org-1',
        companyName: 'Apex Plumbing',
        contactName: 'John Doe',
        address: { street: '123 Main St', city: 'Seattle', state: 'WA', zip: '98101' },
        email: 'contact@apexplumbing.com',
        phone: '555-123-4567',
        industry: { sicCode: '1711', description: 'Plumbing, Heating and Air-Conditioning' },
        financials: { estimatedRevenue: 500000, annualPayroll: 200000, employeeCount: 5 },
        trade: 'Plumbing',
        status: 'Compliant',
        inviteStatus: 'Uploaded',
        lastUploadDate: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ]);
  }, []);

  const handleCreateProject = () => {
    // TODO: Call API
    setShowNewProjectModal(false);
    alert("Project Created (Mock)");
  };

  const handleInviteVendor = async () => {
    if (!selectedProject) return;

    // Duplicate Check
    const isDuplicate = vendors.some(v => 
        v.companyName.toLowerCase() === newVendor.companyName.toLowerCase() || 
        v.email.toLowerCase() === newVendor.email.toLowerCase()
    );

    if (isDuplicate) {
        alert("This vendor already exists in the project.");
        return;
    }
    
    try {
      const response = await fetch(`/api/compliance/projects/${selectedProject.id}/vendors`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
           ...newVendor,
           projectId: selectedProject.id
        })
      });
      
      if (response.ok) {
        const createdVendor = await response.json();
        alert("Vendor Invited & NowCerts Prospect Created!");
        setShowInviteVendorModal(false);
        // Add the new vendor to the list
        setVendors(prev => [...prev, createdVendor]);
        // Reset form
        setNewVendor({
            companyName: '',
            contactName: '',
            email: '',
            phone: '',
            address: { street: '', city: '', state: '', zip: '' },
            industry: { sicCode: '', description: '' },
            trade: ''
        });
      } else {
        const errorData = await response.json();
        alert(`Failed to invite vendor: ${errorData.error || 'Unknown error'}`);
      }
    } catch (e) {
      console.error(e);
      alert("Error inviting vendor");
    }
  };

  const handleSicSelect = (sic: typeof SIC_CODES[0]) => {
    setNewVendor({ ...newVendor, industry: { sicCode: sic.code, description: sic.description } });
    setSicSearch(`${sic.code} - ${sic.description}`);
    setShowSicSuggestions(false);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Compliant': return <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
      case 'Non-compliant': return <AlertCircle className="w-4 h-4 text-red-500" />;
      case 'Expired': return <Clock className="w-4 h-4 text-orange-500" />;
      case 'Missing COI': return <FileWarning className="w-4 h-4 text-slate-400" />;
      case 'Pending Review': return <Clock className="w-4 h-4 text-blue-500" />;
      default: return null;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Compliant': return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
      case 'Non-compliant': return 'bg-red-500/10 text-red-500 border-red-500/20';
      case 'Expired': return 'bg-orange-500/10 text-orange-500 border-orange-500/20';
      case 'Missing COI': return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
      case 'Pending Review': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      default: return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white font-heading flex items-center gap-3">
            <Shield className="w-8 h-8 text-blue-500" />
            Compliance Manager
          </h1>
          <p className="text-slate-400 mt-2">Manage insurance requirements and track vendor compliance.</p>
        </div>
        <div className="flex gap-4">
            <Link to="/compliance/vendors" className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white font-bold transition-colors">
                <Network className="w-4 h-4 text-blue-400" />
                Vendor Directory
            </Link>
            <button 
              onClick={() => setShowNewProjectModal(true)}
              className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-xl font-medium flex items-center gap-2 transition-colors"
            >
              <Plus className="w-4 h-4" />
              New Project
            </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Projects Sidebar */}
        <div className="lg:col-span-1 space-y-4">
          <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider">Projects</h2>
          {projects.map(project => (
            <div 
              key={project.id} 
              onClick={() => setSelectedProject(project)}
              className={`bg-white/5 border rounded-xl p-4 cursor-pointer transition-colors ${selectedProject?.id === project.id ? 'border-blue-500 bg-blue-500/10' : 'border-white/10 hover:bg-white/10'}`}
            >
              <div className="flex items-start gap-3">
                <Building2 className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-white font-medium">{project.name}</h3>
                  <p className="text-xs text-slate-400 mt-1">{project.location}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Vendors Table */}
        <div className="lg:col-span-3">
          <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
            <div className="p-4 border-b border-white/10 flex justify-between items-center bg-white/[0.02]">
              <h2 className="text-lg font-bold text-white">Vendors & Contractors</h2>
              <div className="flex gap-2">
                <button className="px-3 py-1.5 bg-white/5 hover:bg-white/10 text-white text-sm rounded-lg transition-colors">Filter</button>
                <button 
                  onClick={() => {
                    if (!selectedProject) {
                        alert("Please select a project first.");
                        return;
                    }
                    setShowInviteVendorModal(true);
                  }}
                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-sm rounded-lg transition-colors flex items-center gap-2"
                >
                    <Mail className="w-4 h-4" /> Invite Vendor
                </button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-300">
                <thead className="text-xs text-slate-500 uppercase bg-white/[0.02] border-b border-white/10">
                  <tr>
                    <th className="px-6 py-4 font-medium">Vendor</th>
                    <th className="px-6 py-4 font-medium">Trade</th>
                    <th className="px-6 py-4 font-medium">Status</th>
                    <th className="px-6 py-4 font-medium">Last Upload</th>
                    <th className="px-6 py-4 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {vendors.map(vendor => (
                    <tr key={vendor.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-medium text-white">{vendor.companyName}</div>
                        <div className="text-xs text-slate-500">{vendor.email}</div>
                      </td>
                      <td className="px-6 py-4">{vendor.trade}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusBadge(vendor.status)}`}>
                          {getStatusIcon(vendor.status)}
                          {vendor.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-400">
                        {vendor.lastUploadDate ? new Date(vendor.lastUploadDate).toLocaleDateString() : '-'}
                      </td>
                      <td className="px-6 py-4">
                        <Link to={`/compliance/upload/${vendor.id}`} className="text-blue-400 hover:text-blue-300 font-medium">View Details</Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* New Project Modal */}
      {showNewProjectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="bg-slate-900 border border-white/10 rounded-2xl w-full max-w-md p-6 space-y-4">
                <div className="flex justify-between items-center">
                    <h3 className="text-xl font-bold text-white">Create New Project</h3>
                    <button onClick={() => setShowNewProjectModal(false)} className="text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
                </div>
                <input placeholder="Project Name" className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white outline-none" />
                <input placeholder="Location" className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white outline-none" />
                <textarea placeholder="Description" className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white outline-none h-24" />
                <button onClick={handleCreateProject} className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-xl">Create Project</button>
            </div>
        </div>
      )}

      {/* Invite Vendor Modal */}
      {showInviteVendorModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
            <div className="bg-slate-900 border border-white/10 rounded-2xl w-full max-w-2xl p-6 space-y-6 my-8">
                <div className="flex justify-between items-center">
                    <h3 className="text-xl font-bold text-white">Invite Vendor</h3>
                    <button onClick={() => setShowInviteVendorModal(false)} className="text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase">Company Name</label>
                        <input 
                            value={newVendor.companyName} 
                            onChange={e => setNewVendor({...newVendor, companyName: e.target.value})}
                            className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white outline-none" 
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase">Primary Contact</label>
                        <input 
                            value={newVendor.contactName} 
                            onChange={e => setNewVendor({...newVendor, contactName: e.target.value})}
                            className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white outline-none" 
                        />
                    </div>
                    
                    <div className="space-y-2 md:col-span-2 relative">
                        <label className="text-xs font-bold text-slate-500 uppercase">Address (Google Autocomplete)</label>
                        <div className="relative">
                            <input 
                                ref={addressInputRef}
                                placeholder="Start typing address..."
                                value={newVendor.address.street} 
                                onChange={e => {
                                    setNewVendor({...newVendor, address: {...newVendor.address, street: e.target.value}});
                                }}
                                className="w-full bg-white/5 border border-white/10 rounded-xl p-3 pl-10 text-white outline-none mb-2" 
                            />
                            <MapPin className="absolute left-3 top-3.5 w-4 h-4 text-slate-400" />
                        </div>

                        <div className="grid grid-cols-3 gap-2">
                            <input 
                                placeholder="City"
                                value={newVendor.address.city} 
                                onChange={e => setNewVendor({...newVendor, address: {...newVendor.address, city: e.target.value}})}
                                className="bg-white/5 border border-white/10 rounded-xl p-3 text-white outline-none" 
                            />
                            <select 
                                value={newVendor.address.state}
                                onChange={e => setNewVendor({...newVendor, address: {...newVendor.address, state: e.target.value}})}
                                className="bg-slate-900 border border-white/10 rounded-xl p-3 text-white outline-none"
                            >
                                <option value="">State</option>
                                <option value="TN">TN</option>
                                <option value="AL">AL</option>
                                <option value="KY">KY</option>
                                <option value="WA">WA</option>
                                <option value="OR">OR</option>
                                <option value="CA">CA</option>
                                <option value="TX">TX</option>
                            </select>
                            <input 
                                placeholder="Zip"
                                value={newVendor.address.zip} 
                                onChange={e => setNewVendor({...newVendor, address: {...newVendor.address, zip: e.target.value}})}
                                className="bg-white/5 border border-white/10 rounded-xl p-3 text-white outline-none" 
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase">Email</label>
                        <input 
                            type="email"
                            value={newVendor.email} 
                            onChange={e => setNewVendor({...newVendor, email: e.target.value})}
                            className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white outline-none" 
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase">Phone</label>
                        <input 
                            type="tel"
                            value={newVendor.phone} 
                            onChange={e => setNewVendor({...newVendor, phone: e.target.value})}
                            className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white outline-none" 
                        />
                    </div>

                    <div className="space-y-2 relative">
                        <label className="text-xs font-bold text-slate-500 uppercase">Industry (SIC Search)</label>
                        <div className="relative">
                            <input 
                                placeholder="Search SIC Code..."
                                value={sicSearch || newVendor.industry.sicCode} 
                                onChange={e => {
                                    setSicSearch(e.target.value);
                                    setShowSicSuggestions(true);
                                }}
                                className="w-full bg-white/5 border border-white/10 rounded-xl p-3 pl-10 text-white outline-none" 
                            />
                            <Search className="absolute left-3 top-3.5 w-4 h-4 text-slate-400" />
                        </div>
                        {showSicSuggestions && sicSearch.length > 0 && (
                            <div className="absolute z-10 w-full bg-slate-800 border border-white/10 rounded-xl mt-1 shadow-xl max-h-48 overflow-y-auto">
                                {SIC_CODES.filter(s => s.code.includes(sicSearch) || s.description.toLowerCase().includes(sicSearch.toLowerCase())).map((sic, i) => (
                                    <div 
                                        key={i} 
                                        onClick={() => handleSicSelect(sic)}
                                        className="p-3 hover:bg-white/5 cursor-pointer text-sm text-slate-300"
                                    >
                                        <span className="font-bold text-white">{sic.code}</span> - {sic.description}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase">Trade</label>
                        <input 
                            value={newVendor.trade} 
                            onChange={e => setNewVendor({...newVendor, trade: e.target.value})}
                            className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white outline-none" 
                        />
                    </div>
                </div>

                <div className="pt-4 border-t border-white/10">
                    <button onClick={handleInviteVendor} className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2">
                        <Mail className="w-5 h-5" /> Send Invitation & Create Prospect
                    </button>
                    <p className="text-center text-xs text-slate-500 mt-3">
                        This will create a prospect in NowCerts and email the vendor an invite link.
                    </p>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};
