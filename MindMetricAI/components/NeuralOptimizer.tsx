
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cpu, Zap, Activity, Clock, Sparkles, ChevronRight, Loader2 } from 'lucide-react';
import { analyzeNeuralPatterns } from '../services/geminiService.ts';
import { TestResult, WellnessEntry, CognitiveInsight } from '../types.ts';

interface NeuralOptimizerProps {
  results: TestResult[];
  wellness: WellnessEntry[];
}

const NeuralOptimizer: React.FC<NeuralOptimizerProps> = ({ results, wellness }) => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<{ insights: CognitiveInsight[], recommendation: string, circadianPeak: string } | null>(null);

  const runOptimization = async () => {
    if (results.length < 2) return;
    setLoading(true);
    const analysis = await analyzeNeuralPatterns(results, wellness);
    setData(analysis);
    setLoading(false);
  };

  return (
    <section className="bg-slate-900 border border-slate-800 rounded-[3rem] p-8 relative overflow-hidden group">
      <div className="absolute top-0 right-0 w-full h-full bg-blue-600/5 pointer-events-none" />
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10">
        <div className="flex items-center gap-5">
          <div className="p-4 bg-blue-600 rounded-[1.5rem] shadow-2xl shadow-blue-600/20">
            <Cpu className={`w-8 h-8 text-white ${loading ? 'animate-spin' : ''}`} />
          </div>
          <div>
            <h2 className="text-2xl font-black text-white uppercase tracking-tighter italic">Neural Core <span className="text-blue-500">Optimizer</span></h2>
            <p className="text-slate-400 text-sm">Cross-referencing bio-metrics with performance tokens.</p>
          </div>
        </div>

        <button 
          onClick={runOptimization}
          disabled={loading || results.length < 3}
          className="px-8 py-4 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 text-white font-black uppercase tracking-widest text-[10px] rounded-2xl transition-all shadow-xl shadow-blue-600/20 flex items-center gap-3 active:scale-95"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Zap className="w-4 h-4" /> Run Deep Sync</>}
        </button>
      </div>

      <AnimatePresence mode="wait">
        {data ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-10 grid grid-cols-1 lg:grid-cols-3 gap-6 relative z-10"
          >
            {/* Circum Peak */}
            <div className="p-6 bg-slate-950/50 border border-slate-800 rounded-3xl space-y-4">
               <div className="flex items-center gap-3 text-blue-400 font-black text-[10px] uppercase tracking-[0.2em]">
                 <Clock className="w-4 h-4" /> Predicted Peak
               </div>
               <div className="text-3xl font-black text-white italic">{data.circadianPeak}</div>
               <p className="text-xs text-slate-500">Your neural latency is statistically lowest during this window.</p>
            </div>

            {/* Strategic Plan */}
            <div className="lg:col-span-2 p-6 bg-blue-600/5 border border-blue-500/20 rounded-3xl flex flex-col justify-between">
               <div className="space-y-2">
                 <div className="flex items-center gap-3 text-emerald-400 font-black text-[10px] uppercase tracking-[0.2em]">
                   <Sparkles className="w-4 h-4" /> Strategic Protocol
                 </div>
                 <p className="text-slate-300 text-sm leading-relaxed italic">"{data.recommendation}"</p>
               </div>
               <div className="mt-4 flex items-center gap-2 text-blue-400 font-black text-[10px] uppercase tracking-widest cursor-pointer hover:translate-x-1 transition-transform">
                 View Full Mapping <ChevronRight className="w-3 h-3" />
               </div>
            </div>
          </motion.div>
        ) : !loading && (
          <div className="mt-8 flex items-center gap-4 p-6 bg-slate-950/30 border border-dashed border-slate-800 rounded-3xl">
             <Activity className="w-5 h-5 text-slate-600" />
             <p className="text-xs text-slate-500 font-medium italic">
               {results.length < 3 
                 ? "Insufficient data tokens. Complete 3 assessments to initialize deep neural sync." 
                 : "Neural Core ready. Initialize sync for performance correlation."}
             </p>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default NeuralOptimizer;
