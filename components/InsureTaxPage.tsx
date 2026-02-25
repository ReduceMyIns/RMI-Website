import React from 'react';
import { Shield, CheckCircle2, ArrowRight, Calculator, FileText, PieChart, DollarSign, Users, AlertTriangle, Zap, Building2, Scale } from 'lucide-react';

const InsureTaxPage: React.FC = () => {
  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-6">
        {/* Hero Section */}
        <div className="glass-card rounded-[3rem] p-8 md:p-16 relative overflow-hidden mb-12 border border-blue-500/20">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none"></div>
          <div className="absolute -bottom-20 -left-20 w-[400px] h-[400px] bg-indigo-600/10 blur-[100px] rounded-full pointer-events-none"></div>
          
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-bold uppercase tracking-widest">
                <Shield className="w-3 h-3" /> Lloyd's of London Backed (AA- Rated)
              </div>
              
              <h1 className="text-5xl md:text-7xl font-heading font-bold text-white leading-[1.1] tracking-tight">
                Your CPA doesn't cover <span className="text-blue-500 italic">IRS Penalties</span>—We Do.
              </h1>
              
              <p className="text-xl text-slate-300 leading-relaxed max-w-xl">
                Even when filed perfectly, audits happen. InsureTax provides institutional-grade protection that covers the actual money owed, penalties, interest, and professional defense costs.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <a 
                  href="https://partner.insuretax.com/initial-assessment?rid=chasehenderson" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="px-8 py-5 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-bold text-lg shadow-xl shadow-blue-500/25 transition-all flex items-center justify-center gap-2 group"
                >
                  Get a Free Quote <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </a>
                <a 
                  href="https://partner.insuretax.com/auth/login-taxpayer" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="px-8 py-5 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-2xl font-bold text-lg transition-all flex items-center justify-center gap-2"
                >
                  Client Login
                </a>
              </div>

              <div className="flex items-center gap-6 pt-4 border-t border-white/5">
                <div className="flex -space-x-3">
                    {[1,2,3,4].map(i => (
                        <div key={i} className="w-10 h-10 rounded-full border-2 border-slate-900 bg-slate-800 flex items-center justify-center overflow-hidden">
                            <img src={`https://picsum.photos/seed/user${i}/100/100`} alt="User" className="w-full h-full object-cover" />
                        </div>
                    ))}
                </div>
                <p className="text-sm text-slate-400 font-medium">Trusted by 5,000+ SMBs & CPAs</p>
              </div>
            </div>

            <div className="relative">
              <div className="glass-card p-8 rounded-[2.5rem] border-white/10 bg-slate-900/40 backdrop-blur-xl relative z-10">
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <div className="text-xs font-bold text-blue-400 uppercase tracking-widest">Audit Risk Analysis</div>
                        <div className="px-2 py-1 rounded bg-red-500/20 text-red-400 text-[10px] font-bold">HIGH RISK</div>
                    </div>
                    
                    <div className="space-y-4">
                        <div className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-2">
                            <div className="flex justify-between text-xs text-slate-400">
                                <span>Defense Costs</span>
                                <span className="text-white font-bold">$10k - $30k</span>
                            </div>
                            <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                                <div className="w-[70%] h-full bg-blue-500"></div>
                            </div>
                        </div>
                        <div className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-2">
                            <div className="flex justify-between text-xs text-slate-400">
                                <span>Tax Adjustments</span>
                                <span className="text-white font-bold">$14k - $18k</span>
                            </div>
                            <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                                <div className="w-[45%] h-full bg-indigo-500"></div>
                            </div>
                        </div>
                        <div className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-2">
                            <div className="flex justify-between text-xs text-slate-400">
                                <span>Penalties & Interest</span>
                                <span className="text-white font-bold">20% - 40%</span>
                            </div>
                            <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                                <div className="w-[90%] h-full bg-red-500"></div>
                            </div>
                        </div>
                    </div>

                    <div className="pt-4 border-t border-white/5 text-center">
                        <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-2">Potential Audit Cost</p>
                        <div className="text-3xl font-heading font-bold text-white">$45,000+</div>
                    </div>
                </div>
              </div>
              {/* Decorative elements */}
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-500/20 blur-[60px] rounded-full"></div>
              <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-indigo-500/20 blur-[60px] rounded-full"></div>
            </div>
          </div>
        </div>

        {/* Value Props */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
          <div className="glass-card p-10 rounded-[2.5rem] border-white/5 hover:bg-white/[0.05] transition-all group">
            <div className="w-14 h-14 bg-blue-500/10 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
              <DollarSign className="w-7 h-7 text-blue-400" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">Financial Payout</h3>
            <p className="text-slate-400 leading-relaxed">
              Unlike "Audit Protection" which only offers representation, InsureTax provides an immediate cash payout for additional taxes, penalties, and interest owed.
            </p>
          </div>

          <div className="glass-card p-10 rounded-[2.5rem] border-white/5 hover:bg-white/[0.05] transition-all group">
            <div className="w-14 h-14 bg-indigo-500/10 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
              <Scale className="w-7 h-7 text-indigo-400" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">Defense Coverage</h3>
            <p className="text-slate-400 leading-relaxed">
              We cover the cost of hiring CPAs, tax attorneys, and professional representation. If your case escalates to Tax Court, we're there to cover the legal fees.
            </p>
          </div>

          <div className="glass-card p-10 rounded-[2.5rem] border-white/5 hover:bg-white/[0.05] transition-all group">
            <div className="w-14 h-14 bg-emerald-500/10 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
              <Zap className="w-7 h-7 text-emerald-400" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">AI-Driven Speed</h3>
            <p className="text-slate-400 leading-relaxed">
              Our proprietary AI platform streamlines risk assessment and underwriting, delivering quotes and same-day coverage faster than traditional insurers.
            </p>
          </div>
        </div>

        {/* Detailed Coverage Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center mb-24">
            <div className="space-y-10">
                <div className="space-y-4">
                    <h2 className="text-4xl md:text-5xl font-heading font-bold text-white leading-tight">Comprehensive Protection Against IRS Scrutiny</h2>
                    <p className="text-lg text-slate-400">Even if your tax return is 100% accurate, you can still be audited due to random selection or enforcement priorities.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {[
                        { title: "Random Selection", desc: "Audits triggered purely at random by IRS algorithms." },
                        { title: "ERC & R&D Credits", desc: "High-priority enforcement areas for the IRS." },
                        { title: "Contractor Audits", desc: "Disputes over employee vs contractor classification." },
                        { title: "Comparative Analysis", desc: "Flags for industry-specific deduction variances." }
                    ].map((item, i) => (
                        <div key={i} className="flex gap-4">
                            <div className="mt-1 flex-shrink-0">
                                <CheckCircle2 className="w-5 h-5 text-blue-500" />
                            </div>
                            <div>
                                <h4 className="font-bold text-white mb-1">{item.title}</h4>
                                <p className="text-sm text-slate-500">{item.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="glass-card p-10 rounded-[3rem] border-white/10 bg-gradient-to-br from-slate-900 to-blue-950/30">
                <div className="space-y-8">
                    <div className="text-center">
                        <h3 className="text-2xl font-bold text-white mb-2">Audit Protection vs. Insurance</h3>
                        <p className="text-sm text-slate-400">Know the difference before you're audited.</p>
                    </div>

                    <div className="space-y-4">
                        <div className="p-6 rounded-2xl bg-white/5 border border-white/5">
                            <h4 className="font-bold text-slate-400 mb-2">Audit Protection (Service)</h4>
                            <ul className="space-y-2 text-sm text-slate-500">
                                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-slate-600" /> Paperwork Assistance</li>
                                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-slate-600" /> IRS Correspondence</li>
                                <li className="flex items-center gap-2 text-red-400/70 font-medium">✕ No coverage for penalties</li>
                                <li className="flex items-center gap-2 text-red-400/70 font-medium">✕ No coverage for taxes owed</li>
                            </ul>
                        </div>
                        <div className="p-6 rounded-2xl bg-blue-600/10 border border-blue-500/30 ring-1 ring-blue-500/20">
                            <h4 className="font-bold text-blue-400 mb-2">InsureTax (True Insurance)</h4>
                            <ul className="space-y-2 text-sm text-slate-300">
                                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-blue-500" /> Professional Defense Costs</li>
                                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-blue-500" /> Covers Penalties & Interest</li>
                                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-blue-500" /> Covers Tax Adjustments</li>
                                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-blue-500" /> Lloyd's of London Backed</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {/* Final CTA */}
        <div className="glass-card p-12 md:p-20 rounded-[4rem] border-white/10 bg-slate-900/50 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-blue-600/5 to-transparent"></div>
            <div className="relative z-10 max-w-3xl mx-auto space-y-8">
                <h2 className="text-4xl md:text-6xl font-heading font-bold text-white tracking-tight">Don't let an audit become a financial setback.</h2>
                <p className="text-xl text-slate-400">Join thousands of businesses who sleep better knowing their tax liability is insured.</p>
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                    <a 
                      href="https://partner.insuretax.com/initial-assessment?rid=chasehenderson" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="px-12 py-5 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-bold text-lg shadow-2xl shadow-blue-500/40 transition-all flex items-center justify-center gap-3"
                    >
                      Start Assessment <ArrowRight className="w-6 h-6" />
                    </a>
                </div>
                <p className="text-xs text-slate-500 uppercase tracking-widest font-bold">Institutional-grade protection for the modern SMB</p>
            </div>
        </div>

      </div>
    </div>
  );
};

export default InsureTaxPage;
