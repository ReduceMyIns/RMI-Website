
import React, { useState } from 'react';
import { Search, BookOpen, Clock, ChevronRight, PlayCircle, Globe, Shield, Zap, Sparkles, ArrowUpRight } from 'lucide-react';

const categories = ["Basics", "Savings Tips", "Auto", "Homeowners", "Life & Wealth"];

const articles = [
  {
    title: "How AI is Revolutionizing Insurance Underwriting",
    category: "Basics",
    readTime: "5 min",
    excerpt: "Traditional underwriting takes weeks. Learn how our automated systems can assess risk in milliseconds.",
    image: "https://picsum.photos/seed/ai-ins/800/500"
  },
  {
    title: "10 Hidden Car Insurance Discounts You Aren't Using",
    category: "Savings Tips",
    readTime: "8 min",
    excerpt: "From telematics to academic excellence, find out how to stack discounts like a pro.",
    image: "https://picsum.photos/seed/save/800/500"
  },
  {
    title: "Understanding Deductibles vs. Premiums",
    category: "Basics",
    readTime: "4 min",
    excerpt: "The ultimate guide to balancing your out-of-pocket costs with your monthly budget.",
    image: "https://picsum.photos/seed/money/800/500"
  },
  {
    title: "Do You Need Life Insurance in Your 20s?",
    category: "Life & Wealth",
    readTime: "6 min",
    excerpt: "Why starting early might be the smartest financial move you ever make.",
    image: "https://picsum.photos/seed/life/800/500"
  }
];

const KnowledgeBase: React.FC = () => {
  const [activeCat, setActiveCat] = useState("Basics");
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      <div className="text-center max-w-3xl mx-auto space-y-10">
        <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full glass border-blue-500/20 text-blue-400 text-[10px] font-bold uppercase tracking-widest">
          <Sparkles className="w-3 h-3" /> Neural Academy Hub
        </div>
        <h1 className="text-5xl md:text-7xl font-heading font-bold tracking-tight text-white leading-tight">
          Master Your <span className="text-blue-400">Security.</span>
        </h1>
        <p className="text-slate-400 text-lg leading-relaxed">
          The central knowledge repository for automated risk management and portfolio optimization.
        </p>
        <div className="relative group max-w-2xl mx-auto">
          <div className="absolute inset-0 bg-blue-500 blur-2xl opacity-5 group-focus-within:opacity-10 transition-opacity"></div>
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
          <input
            type="text"
            placeholder="Query the database..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-14 pr-6 py-6 bg-white/5 border border-white/10 rounded-[2rem] outline-none focus:bg-white/[0.08] focus:border-blue-500/50 text-white transition-all text-lg placeholder:text-slate-600"
          />
        </div>
      </div>

      <div className="flex flex-wrap justify-center gap-3">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCat(cat)}
            className={`px-8 py-3 rounded-2xl text-sm font-bold transition-all border ${
              activeCat === cat 
              ? 'bg-blue-600 text-white border-blue-500 shadow-xl shadow-blue-500/20' 
              : 'bg-white/5 text-slate-400 border-white/10 hover:border-white/20 hover:text-white'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 pt-10">
        {articles.map((article, i) => (
          <div key={i} className="glass-card rounded-[3rem] overflow-hidden border-white/5 group cursor-pointer hover:bg-white/[0.05] transition-all duration-500">
            <div className="relative h-64 overflow-hidden">
              <div className="absolute inset-0 bg-blue-500/10 mix-blend-overlay group-hover:opacity-0 transition-opacity"></div>
              <img src={article.image} alt={article.title} className="w-full h-full object-cover grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-110 transition-all duration-1000" />
              <div className="absolute top-6 left-6 glass px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest text-blue-400 border-white/20">
                {article.category}
              </div>
            </div>
            <div className="p-10 space-y-6">
              <div className="flex items-center gap-4 text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> {article.readTime}</span>
                <span className="flex items-center gap-1.5"><BookOpen className="w-3.5 h-3.5" /> Intelligence Pack</span>
              </div>
              <h3 className="text-2xl font-bold leading-tight text-white group-hover:text-blue-400 transition-colors font-heading">{article.title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed">{article.excerpt}</p>
              <div className="pt-4 flex items-center text-blue-400 font-bold text-xs uppercase tracking-[0.2em] gap-2 group-hover:gap-4 transition-all">
                Access Data <ArrowUpRight className="w-4 h-4" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <section className="glass-card rounded-[4rem] p-12 md:p-20 border-white/5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/5 blur-[100px] rounded-full"></div>
        <div className="max-w-4xl mx-auto space-y-16 relative">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="space-y-4 text-center md:text-left">
              <h2 className="text-4xl font-heading font-bold text-white">Advanced Learning</h2>
              <p className="text-slate-400">Deep dive into complex risk models with our lead engineers.</p>
            </div>
            <button className="bg-white text-slate-900 px-10 py-5 rounded-2xl font-bold hover:bg-slate-100 transition-all flex items-center gap-3">
              <PlayCircle className="w-5 h-5" /> Start Course
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
             {[
               { icon: Globe, label: 'Global Market Dynamics' },
               { icon: Shield, label: 'Asset Protection Layering' },
               { icon: Zap, label: 'Fast-Track Underwriting' },
               { icon: Sparkles, label: 'Neural Rate Optimization' }
             ].map((item, i) => (
               <div key={i} className="flex items-center gap-6 p-6 bg-white/5 rounded-3xl border border-white/5 hover:border-white/10 transition-colors">
                 <item.icon className="w-8 h-8 text-blue-400" />
                 <span className="font-bold text-white">{item.label}</span>
               </div>
             ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default KnowledgeBase;
