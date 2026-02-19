
import React from 'react';
import { ArrowLeft, Users, Building, Dumbbell, Ticket, ExternalLink, Shield, CheckCircle2, AlertCircle, Trophy, Medal, Activity } from 'lucide-react';
import { Link } from 'react-router-dom';

const PROGRAMS = [
  {
    title: "Teams & Leagues",
    icon: Users,
    desc: "Participant accident & liability coverage for teams, leagues, camps, and clinics.",
    features: ["General Liability", "Accident Medical", "Abuse & Molestation", "Equipment Coverage"],
    url: "https://onlinesportsapplication.com/ProgramSportManagement/Application/ContactInformation?CreatedBy=YTAxMzNhM2QtZmI3ZC00YTY1LWE4NDQtNmQ3YmU5YjczZjc2&uniqueid=&agencyuniqueid=OTY0OTc3MmEtMDZiMi00YTM4LTgwNDQtZjBiYmNjM2NmOTYy",
    color: "bg-blue-600",
    textColor: "text-blue-400",
    borderColor: "border-blue-500/20",
    examples: "Youth Soccer, Baseball Leagues, Basketball Camps"
  },
  {
    title: "Spectator Events",
    icon: Ticket,
    desc: "Short-term liability for tournaments and sporting events (spectator only).",
    features: ["Premises Liability", "Spectator Injury", "Property Damage", "Host Liquor Liability"],
    url: "https://onlinesportsapplication.com/ProgramSpecialEventManagement/Application/ContactInformation?CreatedBy=YTAxMzNhM2QtZmI3ZC00YTY1LWE4NDQtNmQ3YmU5YjczZjc2&uniqueid=&agencyuniqueid=OTY0OTc3MmEtMDZiMi00YTM4LTgwNDQtZjBiYmNjM2NmOTYy",
    color: "bg-purple-600",
    textColor: "text-purple-400",
    borderColor: "border-purple-500/20",
    examples: "5K Runs, Golf Tournaments, Festivals"
  },
  {
    title: "Facilities & Complexes",
    icon: Building,
    desc: "Comprehensive coverage for sports complexes, gyms, and training facilities.",
    features: ["Facility Liability", "Participant Coverage", "Equipment Breakdown", "Cyber Liability"],
    url: "https://onlinesportsapplication.com/ProgramFacilityManagement/Application/ContactInformation?CreatedBy=YTAxMzNhM2QtZmI3ZC00YTY1LWE4NDQtNmQ3YmU5YjczZjc2&uniqueid=&agencyuniqueid=OTY0OTc3MmEtMDZiMi00YTM4LTgwNDQtZjBiYmNjM2NmOTYy",
    color: "bg-emerald-600",
    textColor: "text-emerald-400",
    borderColor: "border-emerald-500/20",
    examples: "Gyms, Yoga Studios, Batting Cages"
  },
  {
    title: "Equipment & Property",
    icon: Dumbbell,
    desc: "Inland Marine coverage for athletic gear, uniforms, and field equipment.",
    features: ["Theft & Damage", "Transit Coverage", "Storage Locations", "Replacement Cost"],
    url: "https://onlinesportsapplication.com/ProgramInlandMarineManagement/Application/ContactInformation?CreatedBy=YTAxMzNhM2QtZmI3ZC00YTY1LWE4NDQtNmQ3YmU5YjczZjc2&uniqueid=&agencyuniqueid=OTY0OTc3MmEtMDZiMi00YTM4LTgwNDQtZjBiYmNjM2NmOTYy",
    color: "bg-orange-600",
    textColor: "text-orange-400",
    borderColor: "border-orange-500/20",
    examples: "Team Uniforms, Scoreboards, Portable Goals"
  }
];

const SCENARIOS = [
    {
        title: "The Injured Player",
        desc: "During a youth soccer game, a player collides with another and breaks their arm. The parents' health insurance has a high deductible.",
        solution: "Accident Medical coverage steps in to pay out-of-pocket medical costs, protecting the family and reducing the likelihood of a lawsuit against the league."
    },
    {
        title: "The Spectator Trip",
        desc: "At a charity 5K, a spectator trips over a power cord running to the sound system and suffers a severe injury.",
        solution: "General Liability coverage handles the claim for bodily injury and provides legal defense for the event organizers if sued."
    },
    {
        title: "The Storm Damage",
        desc: "A severe storm damages the roof of a gymnastics training center and ruins the mats and equipment inside.",
        solution: "Property & Equipment coverage pays for repairs to the building and replacement of the specialized athletic equipment."
    }
];

const SportsInsurancePage: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-6 py-12 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-32">
      <Link to="/products" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-8 group">
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Products
      </Link>

      <div className="relative glass-card rounded-[3rem] p-10 md:p-16 border-white/10 overflow-hidden mb-16">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none"></div>
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1 space-y-6">
            <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full glass border-blue-500/20 text-blue-400 text-[10px] font-bold uppercase tracking-widest">
              <Trophy className="w-3 h-3" /> Sports & Recreation
            </div>
            <h1 className="text-5xl md:text-7xl font-heading font-bold text-white leading-tight">
              Play Safe. <br />
              <span className="text-blue-400">Stay Covered.</span>
            </h1>
            <p className="text-slate-300 text-lg leading-relaxed max-w-xl">
              Specialized liability, accident, and property coverage for sports organizations. Instant online quotes for teams, leagues, and events.
            </p>
          </div>
          <div className="flex-1 w-full">
             <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-8 rounded-3xl border border-white/10 shadow-2xl space-y-6">
                <div className="flex items-center gap-4">
                   <div className="p-3 bg-blue-500/20 rounded-xl text-blue-400"><Shield className="w-6 h-6" /></div>
                   <div>
                      <h4 className="font-bold text-white">General Liability</h4>
                      <p className="text-slate-400 text-xs">Protection against lawsuits for bodily injury and property damage.</p>
                   </div>
                </div>
                <div className="flex items-center gap-4">
                   <div className="p-3 bg-red-500/20 rounded-xl text-red-400"><Activity className="w-6 h-6" /></div>
                   <div>
                      <h4 className="font-bold text-white">Accident Medical</h4>
                      <p className="text-slate-400 text-xs">Pays medical bills for injured participants, regardless of fault.</p>
                   </div>
                </div>
                <div className="flex items-center gap-4">
                   <div className="p-3 bg-emerald-500/20 rounded-xl text-emerald-400"><Medal className="w-6 h-6" /></div>
                   <div>
                      <h4 className="font-bold text-white">Certificate Issuance</h4>
                      <p className="text-slate-400 text-xs">Instant COIs for field owners, schools, and venues.</p>
                   </div>
                </div>
             </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
        {PROGRAMS.map((prog, idx) => (
          <div key={idx} className={`glass-card p-8 rounded-[2.5rem] border-white/5 hover:border-white/10 transition-all group flex flex-col relative overflow-hidden`}>
            <div className={`absolute top-0 right-0 w-32 h-32 opacity-10 blur-[60px] rounded-full group-hover:opacity-20 transition-all ${prog.color}`}></div>
            
            <div className="relative z-10 flex flex-col h-full">
              <div className="flex justify-between items-start mb-6">
                  <div className={`w-14 h-14 ${prog.color} rounded-2xl flex items-center justify-center text-white shadow-lg`}>
                    <prog.icon className="w-7 h-7" />
                  </div>
                  <div className={`px-3 py-1 rounded-full bg-white/5 border ${prog.borderColor} ${prog.textColor} text-[10px] font-bold uppercase tracking-widest`}>
                      Instant Quote
                  </div>
              </div>
              
              <h3 className="text-2xl font-bold text-white mb-2">{prog.title}</h3>
              <p className="text-slate-400 text-sm mb-6 min-h-[40px]">
                {prog.desc}
              </p>

              <div className="space-y-4 mb-8">
                 <div>
                    <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Ideal For</div>
                    <p className="text-white text-sm font-medium">{prog.examples}</p>
                 </div>
                 <div>
                    <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Includes</div>
                    <div className="flex flex-wrap gap-2">
                        {prog.features.map((feat, i) => (
                        <span key={i} className="text-xs font-bold text-slate-300 bg-white/5 px-2 py-1 rounded border border-white/5">
                            {feat}
                        </span>
                        ))}
                    </div>
                 </div>
              </div>

              <a 
                href={prog.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className={`mt-auto w-full py-4 ${prog.color} hover:brightness-110 text-white rounded-2xl font-bold flex items-center justify-center gap-2 transition-all shadow-xl active:scale-95`}
              >
                Start Application <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Scenarios Section */}
      <div className="space-y-8">
         <h2 className="text-3xl font-heading font-bold text-white text-center">Real-World Coverage</h2>
         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {SCENARIOS.map((item, i) => (
                <div key={i} className="glass-card p-8 rounded-3xl border-white/5 bg-slate-900/50">
                    <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center mb-4 border border-white/10">
                        <AlertCircle className="w-6 h-6 text-slate-300" />
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
                    <p className="text-slate-400 text-sm mb-4 leading-relaxed italic">"{item.desc}"</p>
                    <div className="pt-4 border-t border-white/5">
                        <p className="text-green-400 text-xs font-bold uppercase tracking-widest mb-1 flex items-center gap-2">
                            <CheckCircle2 className="w-3 h-3" /> Coverage Solution
                        </p>
                        <p className="text-slate-300 text-sm leading-relaxed">{item.solution}</p>
                    </div>
                </div>
            ))}
         </div>
      </div>
    </div>
  );
};

export default SportsInsurancePage;
