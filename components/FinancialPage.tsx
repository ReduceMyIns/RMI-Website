
import React from 'react';
import { ArrowLeft, TrendingUp, DollarSign, Smartphone, Shield, ExternalLink, PieChart, Wallet, Clock, ArrowRight, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';
import SEOHead from './SEOHead';

const FinancialPage: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-6 py-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <SEOHead 
        title="Financial Services & Wealth Management | Murfreesboro TN"
        description="Grow and protect your wealth with our trusted financial partners. Commission-free trading, credit building, and tax liability insurance."
        canonicalUrl="https://www.reducemyinsurance.net/financial"
        keywords={['financial services', 'wealth management', 'investing', 'credit building', 'Murfreesboro TN']}
      />
      <Link to="/products" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-8 group">
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Products
      </Link>

      <div className="text-center space-y-6 mb-16">
        <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full glass border-blue-500/20 text-blue-400 text-[10px] font-bold uppercase tracking-widest">
          <TrendingUp className="w-3 h-3" /> Wealth Management
        </div>
        <h1 className="text-4xl md:text-6xl font-heading font-bold tracking-tight text-white leading-tight">
          Grow & Protect <span className="text-blue-400">Your Wealth</span>
        </h1>
        <p className="text-slate-400 text-lg leading-relaxed max-w-2xl mx-auto">
          Secure your financial future with our trusted investment partners. Start trading with zero commissions and get free stocks when you sign up.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
        
        {/* WEBULL CARD */}
        <div className="glass-card p-10 rounded-[2.5rem] border-white/5 hover:bg-white/[0.05] transition-all group flex flex-col relative overflow-hidden ring-1 ring-white/5 hover:ring-blue-500/50">
            <div className="absolute top-0 right-0 w-40 h-40 bg-blue-500/10 blur-[60px] rounded-full group-hover:bg-blue-500/20 transition-all"></div>
            
            <div className="relative z-10 flex flex-col h-full">
                <div className="flex justify-between items-start mb-8">
                    <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-lg">
                        <img src="https://upload.wikimedia.org/wikipedia/commons/9/90/Webull_logo.png" alt="Webull" className="w-10 h-10 object-contain" />
                    </div>
                    <div className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-400 text-[10px] font-bold uppercase tracking-widest border border-blue-500/20">
                        Advanced Trading
                    </div>
                </div>
                
                <h3 className="text-3xl font-heading font-bold text-white mb-4">Webull</h3>
                <p className="text-slate-400 text-sm mb-8 leading-relaxed">
                    A powerful trading platform for savvy investors. Enjoy extended trading hours, in-depth analysis tools, and zero commissions.
                </p>

                <div className="space-y-4 mb-10 flex-grow">
                    {[
                        { text: '0 Commission Trading', icon: DollarSign },
                        { text: 'Full Extended Hours Trading', icon: Clock },
                        { text: 'In-Depth Analysis Tools', icon: PieChart },
                        { text: 'Get Fractional Shares', icon: PieChart }
                    ].map((item, i) => (
                        <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5">
                            <item.icon className="w-5 h-5 text-blue-400 shrink-0" />
                            <span className="text-sm text-slate-300 font-medium">{item.text}</span>
                        </div>
                    ))}
                </div>

                <a 
                    href="https://a.webull.com/3DbuGYjKXW4eC4ejG6" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="mt-auto w-full py-5 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-bold flex items-center justify-center gap-2 transition-all shadow-xl shadow-blue-500/20 active:scale-95 text-lg"
                >
                    Claim Free Stocks <ExternalLink className="w-5 h-5" />
                </a>
                <p className="text-center text-[10px] text-slate-500 mt-4">Terms and conditions apply. Investing involves risk.</p>
            </div>
        </div>

        {/* ROBINHOOD CARD */}
        <div className="glass-card p-10 rounded-[2.5rem] border-white/5 hover:bg-white/[0.05] transition-all group flex flex-col relative overflow-hidden ring-1 ring-white/5 hover:ring-green-500/50">
            <div className="absolute top-0 right-0 w-40 h-40 bg-green-500/10 blur-[60px] rounded-full group-hover:bg-green-500/20 transition-all"></div>
            
            <div className="relative z-10 flex flex-col h-full">
                <div className="flex justify-between items-start mb-8">
                    <div className="w-16 h-16 bg-[#00c805] rounded-2xl flex items-center justify-center shadow-lg">
                        <Wallet className="w-10 h-10 text-white" />
                    </div>
                    <div className="px-3 py-1 rounded-full bg-green-500/20 text-green-400 text-[10px] font-bold uppercase tracking-widest border border-green-500/20">
                        Beginner Friendly
                    </div>
                </div>
                
                <h3 className="text-3xl font-heading font-bold text-white mb-4">Robinhood</h3>
                <p className="text-slate-400 text-sm mb-8 leading-relaxed">
                    Investing for everyone. Commission-free investing, plus the tools you need to put your money in motion.
                </p>

                <div className="space-y-4 mb-10 flex-grow">
                    {[
                        { text: 'Commission-free investing', icon: DollarSign },
                        { text: 'Intuitive Mobile App', icon: Smartphone },
                        { text: 'IPO Access', icon: Shield },
                        { text: 'Retirement with 1% Match', icon: TrendingUp }
                    ].map((item, i) => (
                        <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5">
                            <item.icon className="w-5 h-5 text-green-400 shrink-0" />
                            <span className="text-sm text-slate-300 font-medium">{item.text}</span>
                        </div>
                    ))}
                </div>

                <a 
                    href="https://join.robinhood.com/chaseh213" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="mt-auto w-full py-5 bg-[#00c805] hover:brightness-110 text-slate-900 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all shadow-xl shadow-green-500/20 active:scale-95 text-lg"
                >
                    Get Your Free Stock <ExternalLink className="w-5 h-5" />
                </a>
                <p className="text-center text-[10px] text-slate-500 mt-4">Terms and conditions apply. Investing involves risk.</p>
            </div>
        </div>

        {/* INSURE TAX CARD */}
        <div className="glass-card p-10 rounded-[2.5rem] border-white/5 hover:bg-white/[0.05] transition-all group flex flex-col relative overflow-hidden ring-1 ring-white/5 hover:ring-blue-500/50">
            <div className="absolute top-0 right-0 w-40 h-40 bg-blue-500/10 blur-[60px] rounded-full group-hover:bg-blue-500/20 transition-all"></div>
            
            <div className="relative z-10 flex flex-col h-full">
                <div className="flex justify-between items-start mb-8">
                    <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                        <Shield className="w-10 h-10 text-white" />
                    </div>
                    <div className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-400 text-[10px] font-bold uppercase tracking-widest border border-blue-500/20">
                        Tax & Insurance
                    </div>
                </div>
                
                <h3 className="text-3xl font-heading font-bold text-white mb-4">InsureTax</h3>
                <p className="text-slate-400 text-sm mb-8 leading-relaxed">
                    Institutional-grade IRS Audit Insurance. Protect your wealth from the financial burden of audits, including penalties, interest, and defense costs.
                </p>

                <div className="space-y-4 mb-10 flex-grow">
                    {[
                        { text: 'IRS Audit Insurance', icon: Shield },
                        { text: 'Penalty & Interest Coverage', icon: DollarSign },
                        { text: 'Professional Tax Prep', icon: FileText },
                        { text: 'Strategic Planning', icon: TrendingUp }
                    ].map((item, i) => (
                        <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5">
                            <item.icon className="w-5 h-5 text-blue-400 shrink-0" />
                            <span className="text-sm text-slate-300 font-medium">{item.text}</span>
                        </div>
                    ))}
                </div>

                <Link 
                    to="/insure-tax"
                    className="mt-auto w-full py-5 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-bold flex items-center justify-center gap-2 transition-all shadow-xl shadow-blue-500/20 active:scale-95 text-lg"
                >
                    Learn More <ArrowRight className="w-5 h-5" />
                </Link>
                <p className="text-center text-[10px] text-slate-500 mt-4">Tax services provided by Insure Tax partners.</p>
            </div>
        </div>

        {/* KICKOFF CARD */}
        <div className="glass-card p-10 rounded-[2.5rem] border-white/5 hover:bg-white/[0.05] transition-all group flex flex-col relative overflow-hidden ring-1 ring-white/5 hover:ring-green-500/50">
            <div className="absolute top-0 right-0 w-40 h-40 bg-green-500/10 blur-[60px] rounded-full group-hover:bg-green-500/20 transition-all"></div>
            
            <div className="relative z-10 flex flex-col h-full">
                <div className="flex justify-between items-start mb-8">
                    <div className="w-16 h-16 bg-green-600 rounded-2xl flex items-center justify-center shadow-lg">
                        <TrendingUp className="w-10 h-10 text-white" />
                    </div>
                    <div className="px-3 py-1 rounded-full bg-green-500/20 text-green-400 text-[10px] font-bold uppercase tracking-widest border border-green-500/20">
                        Credit Building
                    </div>
                </div>
                
                <h3 className="text-3xl font-heading font-bold text-white mb-4">Kikoff</h3>
                <p className="text-slate-400 text-sm mb-8 leading-relaxed">
                    Build credit safely & responsibly. No credit check, no interest, and no fees. Start building your credit score today.
                </p>

                <div className="space-y-4 mb-10 flex-grow">
                    {[
                        { text: 'No Credit Check', icon: Shield },
                        { text: '0% Interest', icon: DollarSign },
                        { text: 'Reports to Bureaus', icon: FileText },
                        { text: 'Instant Approval', icon: Clock }
                    ].map((item, i) => (
                        <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5">
                            <item.icon className="w-5 h-5 text-green-400 shrink-0" />
                            <span className="text-sm text-slate-300 font-medium">{item.text}</span>
                        </div>
                    ))}
                </div>

                <Link 
                    to="/kickoff"
                    className="mt-auto w-full py-5 bg-green-600 hover:bg-green-500 text-white rounded-2xl font-bold flex items-center justify-center gap-2 transition-all shadow-xl shadow-green-500/20 active:scale-95 text-lg"
                >
                    Start Building <ArrowRight className="w-5 h-5" />
                </Link>
                <p className="text-center text-[10px] text-slate-500 mt-4">Terms and conditions apply.</p>
            </div>
        </div>

      </div>
    </div>
  );
};

export default FinancialPage;
