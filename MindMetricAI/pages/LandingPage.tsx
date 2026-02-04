
import React from 'react';
import { Link } from 'react-router-dom';
import { Zap, Brain, Target, ShieldCheck, Sparkles, ArrowRight, Activity, Users, Globe } from 'lucide-react';

const LandingPage: React.FC = () => {
  return (
    <div className="flex flex-col gap-24 pb-20 animate-in fade-in duration-1000">
      {/* Hero Section */}
      <section className="relative pt-20 pb-12 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-6xl aspect-square bg-blue-600/10 blur-[120px] rounded-full -z-10" />
        <div className="text-center space-y-8 max-w-4xl mx-auto px-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full text-[10px] font-black uppercase tracking-[0.2em] text-blue-400 animate-bounce">
            <Sparkles className="w-3 h-3" /> Next-Gen Cognitive Lab
          </div>
          <h1 className="text-6xl md:text-8xl font-black text-white tracking-tighter leading-tight">
            Quantify Your <span className="bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">Mind.</span>
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
            The ultimate performance dashboard for the high-achieving mind. Measure neural velocity, track mental wellness, and compete in the cognitive league.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link 
              to="/register" 
              className="px-10 py-5 bg-blue-600 hover:bg-blue-500 text-white font-black uppercase tracking-widest text-sm rounded-2xl transition-all shadow-2xl shadow-blue-600/40 flex items-center gap-3 active:scale-95"
            >
              Start Assessment <ArrowRight className="w-5 h-5" />
            </Link>
            <Link 
              to="/pricing" 
              className="px-10 py-5 bg-slate-900 border border-slate-800 hover:bg-slate-800 text-white font-black uppercase tracking-widest text-sm rounded-2xl transition-all active:scale-95"
            >
              View Pricing
            </Link>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="container mx-auto px-4" id="features">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-3xl font-black text-white uppercase tracking-tighter">Engineered for Performance</h2>
          <p className="text-slate-500 max-w-lg mx-auto">Three core verticals designed to provide a holistic mapping of your daily cognitive architecture.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              title: "Cognitive Lab",
              desc: "Clinical-grade neuro-tests measuring reaction time, spatial memory, and executive inhibitory control with millisecond precision.",
              icon: <Zap className="w-8 h-8" />,
              color: "text-blue-400 bg-blue-400/10 border-blue-400/20",
              tag: "LAB"
            },
            {
              title: "Neural Wellness",
              desc: "Integrated biohacking tools including daily check-ins and guided breathing protocols to optimize your nervous system before testing.",
              icon: <Activity className="w-8 h-8" />,
              color: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
              tag: "ZEN"
            },
            {
              title: "Social League",
              desc: "Climb the global leaderboard, earn achievement badges, and challenge your network to high-stakes neural duels.",
              icon: <Users className="w-8 h-8" />,
              color: "text-purple-400 bg-purple-400/10 border-purple-400/20",
              tag: "PRO"
            }
          ].map((feature, i) => (
            <div key={i} className="p-10 bg-slate-900/50 border border-slate-800 rounded-[3rem] hover:border-slate-700 transition-all group">
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-8 border transition-transform group-hover:scale-110 ${feature.color}`}>
                {feature.icon}
              </div>
              <div className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-2">{feature.tag}</div>
              <h3 className="text-2xl font-bold text-white mb-4">{feature.title}</h3>
              <p className="text-slate-400 leading-relaxed text-sm">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Trust/Tech Section */}
      <section className="bg-slate-900 border-y border-slate-800 py-20 overflow-hidden relative">
        <div className="container mx-auto px-4 relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="space-y-4 text-center md:text-left">
            <h2 className="text-4xl font-black text-white italic">Scientifically Backed.</h2>
            <p className="text-slate-400 max-w-md">Our analytics engine uses advanced neural pattern recognition to find correlations between your wellness logs and cognitive output.</p>
            <div className="flex items-center justify-center md:justify-start gap-4 pt-4 grayscale opacity-50">
               <div className="flex items-center gap-2 font-black text-xs uppercase tracking-widest text-white"><ShieldCheck className="w-4 h-4 text-emerald-500" /> NeuroVerified</div>
               <div className="flex items-center gap-2 font-black text-xs uppercase tracking-widest text-white"><Globe className="w-4 h-4 text-blue-500" /> Global Standards</div>
            </div>
          </div>
          <div className="flex flex-wrap justify-center gap-8">
            <div className="bg-slate-950 px-8 py-4 border border-slate-800 rounded-2xl font-black text-slate-500 uppercase tracking-widest text-xs">
              Powered by Google Gemini
            </div>
            <div className="bg-slate-950 px-8 py-4 border border-slate-800 rounded-2xl font-black text-slate-500 uppercase tracking-widest text-xs">
              Neuroscience Guided
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="container mx-auto px-4 text-center">
        <div className="p-20 bg-gradient-to-br from-blue-600/10 to-emerald-600/10 border border-blue-500/20 rounded-[4rem] relative overflow-hidden">
          <Sparkles className="absolute -top-10 -left-10 w-40 h-40 text-blue-500/10" />
          <h2 className="text-4xl md:text-5xl font-black text-white mb-6">Ready to baseline your brain?</h2>
          <p className="text-slate-400 mb-10 max-w-md mx-auto">Join thousands of strategists using data to unlock their next mental level.</p>
          <Link 
            to="/register" 
            className="inline-flex items-center gap-3 px-12 py-5 bg-white text-slate-950 font-black uppercase tracking-widest text-sm rounded-2xl hover:bg-slate-200 transition-all shadow-2xl"
          >
            Create My Profile <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
