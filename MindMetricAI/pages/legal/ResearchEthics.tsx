
import React from 'react';
import { Heart, Microscope, Users, Globe, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

const ResearchEthics: React.FC = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto px-4 py-20 space-y-16"
    >
      <header className="text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-[10px] font-black uppercase tracking-[0.2em] text-emerald-500">
          Our Ethical North Star
        </div>
        <h1 className="text-6xl font-black text-white uppercase tracking-tighter italic">Research <span className="text-emerald-500">Ethics</span></h1>
        <p className="text-slate-400 text-xl max-w-2xl mx-auto leading-relaxed">
          MindMetricAI is built on the intersection of advanced bio-computation and ethical neuroscience.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {[
          {
            title: "Transparency First",
            desc: "We are open about our data processing. Users should always know why a specific 'Archetype' was assigned and which metrics drove the AI insight.",
            icon: <Globe className="w-8 h-8 text-blue-400" />
          },
          {
            title: "Science-Backed",
            desc: "Our test battery is modeled after validated cognitive paradigms (e.g., Stroop, WCST, PAL) used in academic research and clinical neuropsychology.",
            icon: <Microscope className="w-8 h-8 text-emerald-400" />
          },
          {
            title: "No Data Harvesting",
            desc: "We don't sell neural patterns to advertisers. Our business model is based on subscriptions, not on your personal cognitive data profile.",
            icon: <Heart className="w-8 h-8 text-pink-400" />
          },
          {
            title: "User Agency",
            desc: "You have complete control. From deleting records to downloading raw performance metrics, we empower users to own their digital mind.",
            icon: <Users className="w-8 h-8 text-purple-400" />
          }
        ].map((item, i) => (
          <div key={i} className="p-8 bg-slate-900 border border-slate-800 rounded-[3rem] hover:border-slate-700 transition-all space-y-4">
            <div className="p-3 bg-slate-950 rounded-2xl w-fit border border-slate-800">{item.icon}</div>
            <h3 className="text-xl font-bold text-white">{item.title}</h3>
            <p className="text-slate-400 text-sm leading-relaxed">{item.desc}</p>
          </div>
        ))}
      </div>

      <section className="bg-emerald-500/5 border border-emerald-500/10 p-12 rounded-[3.5rem] text-center space-y-6">
        <h2 className="text-2xl font-black text-white uppercase tracking-tight">The Neural Manifesto</h2>
        <p className="text-slate-400 max-w-2xl mx-auto italic">
          "We believe that quantifying the mind is the first step toward universal cognitive longevity. 
          This journey must be taken with absolute privacy and radical honesty."
        </p>
        <div className="flex items-center justify-center gap-2 font-black text-xs uppercase tracking-widest text-emerald-500">
          <CheckCircle2 className="w-4 h-4" /> Committed to Ethical AI
        </div>
      </section>
    </motion.div>
  );
};

export default ResearchEthics;
