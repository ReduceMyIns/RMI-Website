
import React from 'react';
import SEOHead from './SEOHead';
import { ArrowRight, Sparkles, Shield, Zap, TrendingDown, Users, Play, Globe, CheckCircle2, Bot, Server, Box, Umbrella, Briefcase } from 'lucide-react';
import { Link } from 'react-router-dom';
import CarrierSlider from './CarrierSlider';

const LandingPage: React.FC = () => {
  return (
        <div className="space-y-32 pb-32">
      <SEOHead 
        title="AI-Powered Insurance Comparison | ReduceMyInsurance.Net"
        description="Compare rates from 175+ carriers instantly with our AI-powered insurance engine. Save on Auto, Home, and Business insurance in Murfreesboro, TN."
        canonicalUrl="https://www.reducemyinsurance.net/"
        keywords={['insurance', 'AI insurance', 'compare rates', 'auto insurance', 'home insurance', 'business insurance', 'Murfreesboro', 'Tennessee']}
      />
      {/* Hero Section */}
      <section className="relative min-h-[80vh] flex items-center justify-center pt-12">
        {/* Animated Background Elements */}
        <div className="absolute top-10 left-10 w-20 h-20 bg-blue-500/20 rounded-full blur-xl animate-float"></div>
        <div className="absolute bottom-20 right-20 w-32 h-32 bg-indigo-500/20 rounded-full blur-xl animate-pulse-slow"></div>
        <div className="absolute top-1/2 left-1/4 w-4 h-4 bg-white/20 rounded-full animate-ping"></div>

        <div className="text-center max-w-4xl mx-auto space-y-12 relative z-10">
          <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full glass border-blue-500/20 text-blue-400 text-sm font-bold tracking-wide animate-in fade-in slide-in-from-bottom-4 duration-700">
            <Sparkles className="w-4 h-4 fill-blue-500/50" />
            <span>AI-Powered Insurance Engine Active</span>
          </div>

          <h1 className="text-6xl md:text-8xl font-heading font-bold tracking-tight leading-[0.9] text-white animate-in fade-in slide-in-from-bottom-8 duration-1000">
            Insurance <span className="text-blue-400">Imagined</span> <br />
            by Intelligence.
          </h1>

          <p className="text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-200">
            Experience true market transparency with AI-driven rate comparison across 175+ carriers, supported by 24/7 intelligent customer service and self-service tools.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-6 animate-in fade-in slide-in-from-bottom-16 duration-1000 delay-300">
            <Link
              to="/apply"
              className="group relative bg-blue-600 hover:bg-blue-500 text-white px-10 py-5 rounded-2xl font-bold text-lg transition-all shadow-[0_0_40px_rgba(37,99,235,0.25)] hover:shadow-[0_0_60px_rgba(37,99,235,0.4)] flex items-center gap-3"
            >
              Analyze My Rates
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <button 
              onClick={() => document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' })}
              className="flex items-center gap-3 px-8 py-5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all text-white font-bold text-lg"
            >
              <Box className="w-5 h-5" />
              Explore Products
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-20 animate-in fade-in zoom-in duration-1000 delay-500 opacity-60">
            {[
              { label: 'Carrier Match', val: '99.9%' },
              { label: 'Monthly Savings', val: '$85+' },
              { label: 'Processing', val: '2.4ms' },
              { label: 'Insurance Companies', val: '175+' },
            ].map((stat, i) => (
              <div key={i} className="space-y-1">
                <div className="text-3xl font-heading font-bold text-white">{stat.val}</div>
                <div className="text-[10px] uppercase tracking-[0.2em] font-bold text-slate-500">{stat.label}</div>
              </div>
            ))}
          </div>
          
          <div className="pt-8">
             <Link to="/carriers" className="text-blue-400 hover:text-blue-300 text-xs font-bold uppercase tracking-widest border-b border-blue-500/30 pb-1 hover:border-blue-400 transition-all">
                View Our Full Carrier Network
             </Link>
          </div>
        </div>
      </section>

      <CarrierSlider />

      {/* Products & Solutions Hero */}
      <section className="px-6" id="products">
         <div className="max-w-7xl mx-auto space-y-12">
            <div className="text-center space-y-4">
              <h2 className="text-4xl md:text-5xl font-heading font-bold text-white">Coverage for <span className="text-indigo-400">Everything.</span></h2>
              <p className="text-slate-400 max-w-2xl mx-auto">
                Whether it's your car, your home, or your business, our AI matches you with the perfect policy from our 80+ carrier network.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
               <div className="glass-card p-8 rounded-[2.5rem] border-white/5 hover:bg-white/[0.05] transition-all group">
                  <div className="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                     <Shield className="w-8 h-8 text-blue-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">Personal Lines</h3>
                  <p className="text-slate-400 text-sm mb-8 leading-relaxed">
                     Protect your family and assets with AI-optimized policies for Auto, Home, Life, and Umbrella coverage.
                  </p>
                  <Link to="/products" className="inline-flex items-center gap-2 text-white font-bold text-sm bg-blue-600 hover:bg-blue-500 px-6 py-3 rounded-xl transition-all shadow-lg shadow-blue-500/20">
                     View Personal <ArrowRight className="w-4 h-4" />
                  </Link>
               </div>

               <div className="glass-card p-8 rounded-[2.5rem] border-white/5 hover:bg-white/[0.05] transition-all group">
                  <div className="w-16 h-16 bg-indigo-500/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                     <Briefcase className="w-8 h-8 text-indigo-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">Commercial</h3>
                  <p className="text-slate-400 text-sm mb-8 leading-relaxed">
                     Comprehensive business solutions including General Liability, Workers' Comp, and Commercial Auto.
                  </p>
                  <Link to="/products" className="inline-flex items-center gap-2 text-white font-bold text-sm bg-indigo-600 hover:bg-indigo-500 px-6 py-3 rounded-xl transition-all shadow-lg shadow-indigo-500/20">
                     View Commercial <ArrowRight className="w-4 h-4" />
                  </Link>
               </div>

               <div className="glass-card p-8 rounded-[2.5rem] border-white/5 hover:bg-white/[0.05] transition-all group">
                  <div className="w-16 h-16 bg-emerald-500/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                     <Umbrella className="w-8 h-8 text-emerald-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">Specialty</h3>
                  <p className="text-slate-400 text-sm mb-8 leading-relaxed">
                     Unique coverage for specific needs like Flood, Cyber Liability, Special Events, and Classic Cars.
                  </p>
                  <Link to="/products" className="inline-flex items-center gap-2 text-white font-bold text-sm bg-emerald-600 hover:bg-emerald-500 px-6 py-3 rounded-xl transition-all shadow-lg shadow-emerald-500/20">
                     View Specialty <ArrowRight className="w-4 h-4" />
                  </Link>
               </div>
            </div>
         </div>
      </section>

      {/* Feature Command Center */}
      <section className="px-6 relative" id="features">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-blue-500/5 blur-[120px] rounded-full pointer-events-none"></div>
        
        <div className="max-w-6xl mx-auto glass-card rounded-[3rem] p-12 md:p-20 relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="space-y-10">
              <div className="space-y-4">
                <h2 className="text-4xl md:text-5xl font-heading font-bold text-white leading-tight">
                  One Hub. <br />
                  <span className="text-blue-400">Total Control.</span>
                </h2>
                <p className="text-slate-400 text-lg leading-relaxed">
                  Our Command Center interface gives you a bird's-eye view of your entire insurance portfolio, powered by AI.
                </p>
              </div>

              <div className="space-y-6">
                {[
                  { title: 'Neural Quote Match', desc: 'AI analyzes 5,000+ data points for precision.', icon: Zap },
                  { title: 'Grounding Verification', desc: 'Live search ensures market rates are current.', icon: Globe },
                  { title: 'Risk Vision', desc: 'Upload photos for instant property risk reports.', icon: Shield },
                ].map((item, i) => (
                  <div key={i} className="flex gap-5 group">
                    <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 group-hover:border-blue-500/50 transition-colors">
                      <item.icon className="w-6 h-6 text-blue-400" />
                    </div>
                    <div>
                      <h4 className="font-bold text-white mb-1">{item.title}</h4>
                      <p className="text-sm text-slate-500">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="glass-card p-4 rounded-3xl rotate-2 hover:rotate-0 transition-transform duration-500 shadow-2xl">
                <div className="bg-slate-950 rounded-2xl overflow-hidden aspect-video relative group flex items-center justify-center border border-white/10">
                  {/* Illustration of AI Agent Comparing Rates */}
                  <div className="absolute inset-0 bg-grid-slate-800/50 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))]"></div>
                  
                  <div className="relative flex items-center gap-8 z-10">
                     {/* Left Card */}
                     <div className="w-32 h-40 bg-slate-800 rounded-xl border border-slate-700 p-4 shadow-lg transform -rotate-6 translate-y-4 opacity-60">
                        <div className="w-8 h-8 rounded-full bg-red-500/20 mb-3"></div>
                        <div className="h-2 w-16 bg-slate-700 rounded mb-2"></div>
                        <div className="h-2 w-20 bg-slate-700 rounded"></div>
                     </div>
                     
                     {/* Center AI Agent */}
                     <div className="relative">
                        <div className="w-24 h-24 rounded-full bg-blue-600/20 border border-blue-500/50 flex items-center justify-center animate-pulse">
                           <Bot className="w-12 h-12 text-blue-400" />
                        </div>
                        <div className="absolute -top-4 -right-4 bg-green-500 text-slate-900 text-[10px] font-bold px-3 py-1 rounded-full shadow-lg">
                           MATCH FOUND
                        </div>
                     </div>

                     {/* Right Card (Winner) */}
                     <div className="w-32 h-40 bg-slate-800 rounded-xl border-2 border-green-500/50 p-4 shadow-green-500/20 shadow-2xl transform rotate-6 -translate-y-2">
                        <div className="w-8 h-8 rounded-full bg-green-500/20 mb-3 flex items-center justify-center">
                           <CheckCircle2 className="w-5 h-5 text-green-400" />
                        </div>
                        <div className="h-2 w-16 bg-slate-700 rounded mb-2"></div>
                        <div className="text-xl font-bold text-white">$85<span className="text-xs text-slate-500">/mo</span></div>
                     </div>
                  </div>

                  <div className="absolute bottom-6 left-6 right-6 glass p-6 rounded-2xl border border-white/20">
                     <div className="flex items-center justify-between mb-2">
                        <div className="text-xs font-bold text-blue-400 uppercase tracking-widest flex items-center gap-2">
                           <Server className="w-3 h-3" />
                           Comparing 175+ Carriers
                        </div>
                        <div className="flex gap-1">
                          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce"></div>
                          <div className="w-1.5 h-1.5 bg-blue-500/50 rounded-full animate-bounce delay-100"></div>
                          <div className="w-1.5 h-1.5 bg-blue-500/20 rounded-full animate-bounce delay-200"></div>
                        </div>
                     </div>
                  </div>
                </div>
              </div>
              
              {/* Floating Elements */}
              <div className="absolute -top-10 -right-10 glass p-6 rounded-3xl border-white/20 shadow-xl hidden md:block animate-bounce">
                <CheckCircle2 className="w-10 h-10 text-green-400" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing/Action Section */}
      <section className="text-center space-y-12">
        <h2 className="text-4xl md:text-5xl font-heading font-bold text-white">Ready for a better experience?</h2>
        <div className="flex items-center justify-center gap-4">
          <Link to="/apply" className="bg-white text-slate-900 px-12 py-5 rounded-2xl font-bold text-lg hover:bg-slate-100 transition-all shadow-xl hover:scale-105 active:scale-95">
            Get My AI Quote
          </Link>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
