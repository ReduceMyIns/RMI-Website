import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Shield, FileText, Briefcase, Box, Wrench, Sparkles, PenTool, Lock, BookOpen, GraduationCap, Globe } from 'lucide-react';
import SEOHead from './SEOHead';
import { INDUSTRIES } from '../data/industryData';
import { SIC_INDUSTRIES } from '../data/sicIndustries';

const SitemapPage: React.FC = () => {
  const allIndustries = useMemo(() => {
    const mappedSic = SIC_INDUSTRIES.map(sic => ({
      slug: sic.slug,
      name: sic.name,
    }));
    const existingSlugs = new Set(INDUSTRIES.map(i => i.slug));
    const uniqueSic = mappedSic.filter(s => !existingSlugs.has(s.slug));
    
    return [...INDUSTRIES.map(i => ({ slug: i.slug, name: i.name })), ...uniqueSic].sort((a, b) => a.name.localeCompare(b.name));
  }, []);

  const sections = [
    {
      title: "Main",
      icon: Shield,
      links: [
        { name: "Home", path: "/" },
        { name: "Get Quotes", path: "/apply" },
        { name: "Client Dashboard", path: "/dashboard" },
        { name: "Carrier Network", path: "/carriers" },
        { name: "Service Center", path: "/service" },
        { name: "Contact Us", path: "/apply" }, // Assuming apply/contact share intent or add contact page if exists
      ]
    },
    {
      title: "Personal Insurance",
      icon: Box,
      links: [
        { name: "Auto Insurance", path: "/auto" },
        { name: "Home Insurance", path: "/home" },
        { name: "Renters Insurance", path: "/renters" },
        { name: "Umbrella Insurance", path: "/umbrella" },
        { name: "Watercraft / Boat", path: "/watercraft" },
        { name: "Flood Insurance", path: "/flood" },
        { name: "Powersports / RV", path: "/powersports" },
        { name: "Pet Insurance", path: "/pet-insurance" },
        { name: "Sell Your Car", path: "/sell-car" },
        { name: "Safety Course", path: "/safety-course" },
        { name: "Home Security", path: "/home-security" },
        { name: "Arkay Warranty", path: "/arkay-warranty" },
        { name: "Choice Warranty", path: "/choice-warranty" },
      ]
    },
    {
      title: "Commercial Insurance",
      icon: Briefcase,
      links: [
        { name: "Commercial Lines Overview", path: "/commercial" },
        { name: "General Liability", path: "/general-liability" },
        { name: "Workers Compensation", path: "/workers-comp" },
        { name: "Commercial Auto", path: "/commercial-auto" },
        { name: "Business Owners Policy (BOP)", path: "/bop" },
        { name: "Cyber Liability", path: "/cyber" },
        { name: "Builders Risk", path: "/builders-risk" },
        { name: "Surety Bonds", path: "/bonds" },
        { name: "Sports Insurance", path: "/sports" },
        { name: "Sola", path: "/sola" },
        { name: "Insure Tax", path: "/insure-tax" },
        { name: "Industries", path: "/industries" },
      ]
    },
    {
      title: "Life & Health",
      icon: Sparkles,
      links: [
        { name: "Health Insurance", path: "/health" },
        { name: "Dental & Vision", path: "/dental-vision" },
        { name: "Disability Insurance", path: "/disability" },
        { name: "Life Insurance", path: "/life" },
        { name: "Financial Services", path: "/financial" },
        { name: "Kickoff", path: "/kickoff" },
      ]
    },
    {
      title: "Tools & Resources",
      icon: PenTool,
      links: [
        { name: "AI Tools", path: "/tools" },
        { name: "AI Home Inspection", path: "/tools/inspection" },
        { name: "Knowledge Base", path: "/knowledge" },
        { name: "Agent Academy", path: "/agent/academy" },
        { name: "Privacy Policy", path: "/privacy" },
      ]
    },
    {
      title: "Agent Access",
      icon: Lock,
      links: [
        { name: "Agent Dashboard", path: "/admin" },
      ]
    },
    {
      title: "Industries A-Z",
      icon: Globe,
      links: allIndustries.map(ind => ({
        name: ind.name,
        path: `/insurance/${ind.slug}`
      }))
    }
  ];

  return (
    <div className="min-h-screen bg-slate-950 pt-24 pb-12 px-6">
      <SEOHead 
        title="Sitemap | Explore Our Insurance Services"
        description="Navigate through all the pages and resources available on ReduceMyInsurance.Net. Find auto, home, business, and life insurance options easily."
        canonicalUrl="https://www.reducemyinsurance.net/sitemap"
        keywords={['sitemap', 'insurance services', 'site map', 'navigation']}
      />
      <div className="max-w-7xl mx-auto space-y-12">
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-heading font-bold text-white">Sitemap</h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            Explore all pages and resources available on ReduceMyInsurance.Net
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {sections.map((section, index) => (
            <div key={index} className={`glass-card p-8 rounded-3xl border border-white/10 hover:border-blue-500/30 transition-all duration-300 group ${section.title === 'Industries A-Z' ? 'md:col-span-2 lg:col-span-3' : ''}`}>
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-blue-500/10 rounded-xl group-hover:bg-blue-500/20 transition-colors">
                  <section.icon className="w-6 h-6 text-blue-400" />
                </div>
                <h2 className="text-xl font-bold text-white font-heading">{section.title}</h2>
              </div>
              <ul className={`space-y-3 ${section.title === 'Industries A-Z' ? 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-2 space-y-0' : ''}`}>
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <Link 
                      to={link.path} 
                      className="flex items-center gap-2 text-slate-400 hover:text-blue-400 transition-colors text-sm group/link"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-white/10 group-hover/link:bg-blue-400 transition-colors shrink-0" />
                      <span className="truncate">{link.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SitemapPage;
