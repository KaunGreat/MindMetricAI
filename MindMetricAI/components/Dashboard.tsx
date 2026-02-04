
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { TESTS } from '../constants.tsx';
import { motion } from 'framer-motion';
import { 
  ArrowRight, 
  Server, 
  Heart, 
  CheckCircle2, 
  Sparkles, 
  BrainCircuit,
  Bot
} from 'lucide-react';
import { checkApiStatus } from '../utils/api.ts';
import { WellnessEntry } from '../types.ts';
import { useUserData, getLevelTitle } from '../hooks/useUserData.ts';
import NeuralOptimizer from './NeuralOptimizer.tsx';

const Dashboard: React.FC = () => {
  const { t } = useTranslation();
  const [isApiOnline, setIsApiOnline] = useState<boolean | null>(null);
  const [hasCheckedInToday, setHasCheckedInToday] = useState(false);
  const [wellnessData, setWellnessData] = useState<WellnessEntry[]>([]);
  const { xp, level, results } = useUserData();

  useEffect(() => {
    const verifyBackend = async () => {
      const online = await checkApiStatus();
      setIsApiOnline(online);
    };
    verifyBackend();
    
    const saved = localStorage.getItem('mindmetric_wellness');
    if (saved) {
      try {
        const data: WellnessEntry[] = JSON.parse(saved);
        setWellnessData(data);
        const today = new Date().toDateString();
        setHasCheckedInToday(data.some(e => new Date(e.timestamp).toDateString() === today));
      } catch (e) {
        console.error("Error parsing wellness data", e);
      }
    }

    const interval = setInterval(verifyBackend, 30000);
    return () => clearInterval(interval);
  }, []);

  const levelTitle = getLevelTitle(level);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="space-y-12 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Hero Section */}
      <motion.section 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-8 pt-8"
      >
        <div className="flex items-center gap-6">
           <motion.div 
             whileHover={{ scale: 1.05, rotate: 5 }}
             className="relative"
           >
              <div className="w-20 h-20 bg-blue-600 rounded-[2rem] flex items-center justify-center shadow-2xl shadow-blue-600/30">
                 <BrainCircuit className="w-10 h-10 text-white" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-slate-900 border-2 border-slate-800 rounded-full flex items-center justify-center shadow-lg">
                 <span className="text-xs font-black text-white">{level}</span>
              </div>
           </motion.div>
           <div>
              <div className="flex items-center gap-3 mb-1">
                 <h1 className="text-4xl font-black text-white tracking-tighter">Strategist Profile</h1>
                 <span className="px-3 py-1 bg-blue-600/20 text-blue-400 border border-blue-500/20 rounded-full text-[10px] font-black uppercase tracking-widest">{levelTitle}</span>
              </div>
              <p className="text-slate-400 text-sm">Neural sync active. <span className="text-blue-400 font-bold">{xp} XP</span> accumulated.</p>
           </div>
        </div>
        
        <motion.div 
          whileHover={{ scale: 1.02 }}
          className={`flex items-center gap-3 px-5 py-2.5 rounded-2xl border transition-all duration-500 shrink-0 self-start md:self-center ${
            isApiOnline === true 
              ? 'bg-emerald-500/5 border-emerald-500/10 text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.05)]' 
              : isApiOnline === false
              ? 'bg-red-500/5 border-red-500/10 text-red-400 shadow-[0_0_20px_rgba(239,68,68,0.05)]'
              : 'bg-slate-800 border-slate-700 text-slate-500'
          }`}
        >
          <div className={`w-2.5 h-2.5 rounded-full ${
            isApiOnline === true ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.6)] animate-pulse' : 
            isApiOnline === false ? 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.6)]' : 
            'bg-slate-600'
          }`} />
          <Server className="w-4 h-4" />
          <span className="text-[10px] font-black uppercase tracking-[0.2em]">
            Uplink: {
              isApiOnline === true ? "Stable" : 
              isApiOnline === false ? "Severed" : 
              "Syncing"
            }
          </span>
        </motion.div>
      </motion.section>

      {/* AI Neural Optimizer - The "Backend" AI in UI */}
      <motion.div variants={itemVariants} initial="hidden" animate="visible">
        <NeuralOptimizer results={results} wellness={wellnessData} />
      </motion.div>

      {/* Wellness & Progress Row */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 lg:grid-cols-3 gap-6"
      >
        <motion.div variants={itemVariants} className="lg:col-span-2">
          {!hasCheckedInToday ? (
            <Link 
              to="/wellness"
              className="flex items-center justify-between p-8 bg-emerald-500/5 border border-emerald-500/10 rounded-[2.5rem] group hover:bg-emerald-500/10 transition-all hover:border-emerald-500/30 shadow-xl shadow-emerald-500/5 h-full"
            >
              <div className="flex items-center gap-6">
                <div className="p-4 bg-emerald-500 rounded-2xl shadow-lg shadow-emerald-500/20 group-hover:scale-110 group-hover:rotate-6 transition-transform">
                  <Heart className="w-8 h-8 text-white fill-current" />
                </div>
                <div>
                  <h3 className="font-black text-white uppercase tracking-tighter text-xl">Daily Neuro-Log</h3>
                  <p className="text-emerald-400/80 text-sm mt-1">Calibrate performance baselines with a quick check-in.</p>
                </div>
              </div>
              <div className="hidden sm:flex items-center gap-2 px-5 py-2.5 bg-emerald-500 text-slate-950 font-black text-[10px] uppercase rounded-xl tracking-widest group-hover:translate-x-1 transition-transform">
                Check-in <ArrowRight className="w-4 h-4" />
              </div>
            </Link>
          ) : (
            <div className="flex items-center gap-4 p-8 bg-slate-900 border border-slate-800 rounded-[2.5rem] h-full shadow-lg">
              <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center border border-emerald-500/20">
                <CheckCircle2 className="w-6 h-6 text-emerald-500" />
              </div>
              <div>
                <h3 className="font-bold text-white text-lg">System Calibrated</h3>
                <p className="text-slate-400 text-sm">Bio-metrics for today are synchronized.</p>
              </div>
              <Link to="/wellness" className="ml-auto text-xs font-black text-blue-400 uppercase tracking-widest hover:text-blue-300">Update Log</Link>
            </div>
          )}
        </motion.div>

        <motion.div variants={itemVariants}>
          <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] p-8 h-full flex flex-col justify-between shadow-lg hover:border-blue-500/30 transition-all group">
            <div className="flex items-center gap-4 mb-4">
               <div className="p-3 bg-blue-500/10 rounded-2xl border border-blue-500/20 group-hover:scale-110 transition-transform">
                 <Bot className="w-6 h-6 text-blue-400" />
               </div>
               <div>
                 <h4 className="text-sm font-black text-white uppercase tracking-widest">Neural Coach</h4>
                 <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tighter">Ready for Analysis</p>
               </div>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed mb-6">Ask me about your performance patterns or how to improve focus.</p>
            <div className="text-[10px] font-black text-blue-400 uppercase tracking-widest flex items-center gap-2">
               Open Coach <ArrowRight className="w-3 h-3" />
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Cognitive Grid */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
      >
        {TESTS.map((test) => (
          <motion.div
            key={test.id}
            variants={itemVariants}
            whileHover={{ y: -8 }}
            className="group"
          >
            <Link 
              to={test.path}
              className={`block h-full p-8 rounded-[2.5rem] bg-slate-900 border border-slate-800 hover:border-${test.color}-500/40 transition-all shadow-xl hover:shadow-${test.color}-500/5 relative overflow-hidden`}
            >
              <div className={`absolute top-0 right-0 w-24 h-24 bg-${test.color}-500/5 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity`} />
              
              <div className="flex flex-col justify-between h-full relative z-10">
                <div>
                  <div className={`w-14 h-14 bg-${test.color}-500/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                    <test.icon className={`w-7 h-7 text-${test.color}-400`} />
                  </div>
                  <h3 className="text-xl font-black text-white tracking-tight mb-2 group-hover:text-white transition-colors">
                    {t(`tests.${test.id}.title`)}
                  </h3>
                  <p className="text-sm text-slate-400 line-clamp-2 leading-relaxed font-medium">
                    {t(`tests.${test.id}.description`)}
                  </p>
                </div>
                
                <div className="mt-8 flex items-center justify-between">
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] group-hover:text-blue-400 transition-colors">
                    Begin Test
                  </span>
                  <ArrowRight className="w-4 h-4 text-slate-600 group-hover:translate-x-1 group-hover:text-blue-400 transition-all" />
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </motion.div>

      {/* Science & Insights Banner */}
      <motion.section 
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        className="p-12 rounded-[3.5rem] bg-gradient-to-br from-slate-900 via-slate-900 to-blue-900/20 border border-slate-800 relative overflow-hidden group"
      >
        <Sparkles className="absolute top-12 right-12 w-32 h-32 text-blue-500/5 rotate-12 group-hover:scale-125 transition-transform duration-1000" />
        <div className="max-w-3xl relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full text-[10px] font-black uppercase tracking-widest text-blue-400 mb-6">
            Scientific Protocol
          </div>
          <h2 className="text-4xl font-black text-white uppercase tracking-tighter mb-6 leading-tight italic">
            Cognitive <span className="text-blue-500">mapping</span> & fatigue detection.
          </h2>
          <p className="text-slate-400 text-lg leading-relaxed mb-8 font-medium">
            MindMetricAI utilizes validated neuro-paradigms to detect subtle shifts in executive control and neural processing speed.
          </p>
          <div className="flex flex-wrap gap-4">
            <button className="px-10 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all shadow-xl shadow-blue-600/20 active:scale-95">
              Explore Analytics Guide
            </button>
            <Link 
              to="/insights"
              className="px-10 py-4 bg-slate-950 border border-slate-800 hover:border-slate-700 text-slate-300 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all"
            >
              View My Performance
            </Link>
          </div>
        </div>
      </motion.section>
    </div>
  );
};

export default Dashboard;
