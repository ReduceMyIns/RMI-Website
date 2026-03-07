import React, { useState, useEffect } from 'react';
import { Search, Building2, MapPin, Phone, Mail, ArrowRight, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Vendor } from '../../src/types/compliance';

export const VendorDirectory: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/compliance/vendors?q=${encodeURIComponent(searchQuery)}`);
      if (res.ok) {
        const data = await res.json();
        setVendors(data);
      }
    } catch (e) {
      console.error('Search failed', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Initial load
    handleSearch();
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 p-6 md:p-12">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white font-heading">Vendor Directory</h1>
            <p className="text-slate-400">Network with verified vendors and subcontractors.</p>
          </div>
          <Link to="/dashboard" className="text-blue-400 hover:text-blue-300 flex items-center gap-2">
            <ArrowRight className="w-4 h-4 rotate-180" /> Back to Dashboard
          </Link>
        </div>

        {/* Search Bar */}
        <div className="relative max-w-2xl">
          <input 
            type="text" 
            placeholder="Search by company name, email, or trade..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white outline-none focus:border-blue-500/50 transition-colors"
          />
          <Search className="absolute left-4 top-4.5 w-5 h-5 text-slate-400" />
          <button 
            onClick={handleSearch}
            className="absolute right-2 top-2 bottom-2 px-6 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-colors"
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Search'}
          </button>
        </div>

        {/* Results Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {vendors.map(vendor => (
            <div key={vendor.id} className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-blue-500/30 transition-colors group">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-blue-400" />
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                  vendor.status === 'Compliant' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-slate-500/10 text-slate-400'
                }`}>
                  {vendor.status}
                </span>
              </div>
              
              <h3 className="text-xl font-bold text-white mb-1 group-hover:text-blue-400 transition-colors">{vendor.companyName}</h3>
              <p className="text-slate-400 text-sm mb-4">{vendor.trade || vendor.industry?.description || 'General Contractor'}</p>
              
              <div className="space-y-2 text-sm text-slate-300">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-slate-500" />
                  {vendor.address.city}, {vendor.address.state}
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-slate-500" />
                  {vendor.phone}
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-slate-500" />
                  {vendor.email}
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-white/5 flex justify-between items-center">
                 <span className="text-xs text-slate-500">ID: {vendor.id}</span>
                 <Link to={`/compliance/upload/${vendor.id}`} className="text-blue-400 hover:text-blue-300 text-sm font-bold flex items-center gap-1">
                    View Profile <ArrowRight className="w-4 h-4" />
                 </Link>
              </div>
            </div>
          ))}

          {!isLoading && vendors.length === 0 && (
            <div className="col-span-full text-center py-12 text-slate-500">
              No vendors found matching your search.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
