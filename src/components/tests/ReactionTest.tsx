
import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Zap, RotateCcw, LayoutDashboard, AlertCircle, Timer, TrendingUp, Activity, Target } from 'lucide-react';
import ReactionDistributionChart from '../charts/ReactionDistributionChart.tsx';
import StatCard from '../ui/StatCard.tsx';
import { useUserData } from '../../hooks/useUserData.ts';
import { TestType } from '../../types.ts';

interface ReactionTestProps {
  onComplete: (score: number, metadata?: Record<string, unknown>) => void;
  onCancel: () => void;
}

type TestState = 'waiting' | 'ready' | 'result' | 'too_early' | 'analytics';

const MAX_TRIALS = 5;

const ReactionTest: React.FC<ReactionTestProps> = ({ onComplete, onCancel }) => {
  const { results } = useUserData();
  const [state, setState] = useState<TestState>('waiting');
  const [trials, setTrials] = useState<number[]>([]);
  const [currentReaction, setCurrentReaction] = useState<number | null>(null);
  
  const startTimeRef = useRef<number>(0);
  const timeoutRef = useRef<number | null>(null);

  const startTrial = useCallback(() => {
    setState('waiting');
    setCurrentReaction(null);
    const delay = 1500 + Math.random() * 3500;
    timeoutRef.current = window.setTimeout(() => {
      setState('ready');
      startTimeRef.current = performance.now();
    }, delay);
  }, []);

  useEffect(() => {
    startTrial();
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [startTrial]);

  const handleInteraction = () => {
    if (state === 'waiting') {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      setState('too_early');
    } else if (state === 'ready') {
      const endTime = performance.now();
      const time = Math.round(endTime - startTimeRef.current);
      setCurrentReaction(time);
      
      const newTrials = [...trials, time];
      setTrials(newTrials);
      
      if (newTrials.length >= MAX_TRIALS) {
        setState('analytics');
      } else {
        setState('result');
      }
    }
  };

  const resetAll = () => {
    setTrials([]);
    startTrial();
  };

  // Analytics Calculations
  const analytics = useMemo(() => {
    if (trials.length === 0) return null;
    const avg = Math.round(trials.reduce((a, b) => a + b, 0) / trials.length);
    const best = Math.min(...trials);
    const sd = Math.round(Math.sqrt(trials.map(x => Math.pow(x - avg, 2)).reduce((a, b) => a + b, 0) / trials.length));
    const lapses = trials.filter(t => t > avg * 1.5).length;
    
    // Compare with previous best
    const reactionResults = results.filter(r => r.type === TestType.REACTION);
    const prevBest = reactionResults.length > 0 ? Math.min(...reactionResults.map(r => r.score)) : null;
    const improvement = prevBest ? Math.round(((prevBest - best) / prevBest) * 100) : null;

    return { avg, best, sd, lapses, improvement };
  }, [trials, results]);

  if (state === 'analytics' && analytics) {
    return (
      <div className="w-full max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
        <header className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full text-[10px] font-black uppercase tracking-[0.2em] text-blue-400">
            Performance Analysis Complete
          </div>
          <h2 className="text-4xl font-black text-white">Neural Velocity Report</h2>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Chart */}
          <div className="lg:col-span-7 bg-slate-900/50 border border-slate-800 p-8 rounded-[2.5rem] flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-bold text-white">Reaction Distribution</h3>
                <p className="text-xs text-slate-500">Latency patterns across {MAX_TRIALS} trials</p>
              </div>
              <Activity className="w-5 h-5 text-slate-600" />
            </div>
            <ReactionDistributionChart trials={trials} average={analytics.avg} />
            <div className="mt-auto pt-6 flex items-center gap-4 border-t border-slate-800/50">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-500" />
                <span className="text-[10px] font-bold text-slate-500 uppercase">Optimal</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <span className="text-[10px] font-bold text-slate-500 uppercase">Lapse</span>
              </div>
            </div>
          </div>

          {/* Right Column: Stats & Comparison */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <div className="grid grid-cols-2 gap-4">
              <StatCard 
                label="Average" 
                value={analytics.avg} 
                unit="ms" 
                icon={<Timer className="w-4 h-4" />} 
              />
              <StatCard 
                label="Best Session" 
                value={analytics.best} 
                unit="ms" 
                icon={<Target className="w-4 h-4" />} 
                trend={analytics.improvement !== null ? { value: analytics.improvement, isGood: analytics.improvement > 0 } : undefined}
              />
              <StatCard 
                label="Consistency" 
                value={analytics.sd} 
                unit="±ms" 
                icon={<Activity className="w-4 h-4" />} 
              />
              <StatCard 
                label="Lapses" 
                value={analytics.lapses} 
                unit="count" 
                icon={<AlertCircle className="w-4 h-4" />} 
              />
            </div>

            <div className="p-6 bg-gradient-to-br from-blue-600/10 to-emerald-600/10 border border-blue-500/20 rounded-3xl relative overflow-hidden">
               <TrendingUp className="absolute -right-4 -bottom-4 w-24 h-24 text-blue-500/5 -rotate-12" />
               <h4 className="text-sm font-bold text-white mb-1">Comparative Insight</h4>
               <p className="text-xs text-slate-400 leading-relaxed">
                 {analytics.improvement && analytics.improvement > 0 
                   ? `You've exceeded your historical average by ${analytics.improvement}%. Your neural processing is currently in a high-performance state.`
                   : analytics.improvement && analytics.improvement < 0
                   ? `Current performance is ${Math.abs(analytics.improvement)}% below peak levels. This may indicate cognitive fatigue or divided attention.`
                   : "Initial baseline established. Continue testing to build a comprehensive cognitive velocity profile."
                 }
               </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mt-auto">
              <button 
                onClick={resetAll}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-2xl transition-all active:scale-95"
              >
                <RotateCcw className="w-4 h-4" /> Try Again
              </button>
              <button 
                onClick={() => onComplete(analytics.best, { trials, sd: analytics.sd, lapses: analytics.lapses })}
                className="flex-[1.5] flex items-center justify-center gap-2 px-6 py-4 bg-blue-600 hover:bg-blue-500 text-white font-black uppercase tracking-widest text-xs rounded-2xl transition-all shadow-xl shadow-blue-600/20 active:scale-95"
              >
                Save & Exit
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[500px] w-full animate-in fade-in duration-500">
      <div className="w-full max-w-2xl mb-8 flex items-center justify-between px-4">
         <div className="flex items-center gap-4">
           {Array.from({ length: MAX_TRIALS }).map((_, i) => (
             <div 
               key={i} 
               className={`h-1.5 w-12 rounded-full transition-all duration-500 ${
                 i < trials.length ? 'bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]' : 'bg-slate-800'
               }`} 
             />
           ))}
         </div>
         <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
           Trial {trials.length + (state === 'analytics' ? 0 : 1)} / {MAX_TRIALS}
         </span>
      </div>

      <div 
        onClick={handleInteraction}
        className={`
          relative w-full max-w-2xl aspect-video rounded-[3rem] border-4 flex flex-col items-center justify-center cursor-pointer transition-all duration-300 overflow-hidden
          ${state === 'waiting' ? 'bg-red-500/10 border-red-500/40 shadow-[0_0_50px_rgba(239,68,68,0.1)]' : ''}
          ${state === 'ready' ? 'bg-emerald-500 border-white shadow-[0_0_80px_rgba(16,185,129,0.4)] scale-[1.02]' : ''}
          ${state === 'result' ? 'bg-slate-900 border-slate-800' : ''}
          ${state === 'too_early' ? 'bg-yellow-500/20 border-yellow-500 shadow-[0_0_50px_rgba(234,179,8,0.2)]' : ''}
        `}
      >
        {state === 'waiting' && (
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-red-500 rounded-full mx-auto flex items-center justify-center shadow-lg animate-pulse">
              <Zap className="w-8 h-8 text-white fill-current" />
            </div>
            <h2 className="text-2xl font-black text-white uppercase tracking-tighter">Wait for Green</h2>
          </div>
        )}

        {state === 'ready' && (
          <div className="text-center animate-bounce">
            <h2 className="text-6xl font-black text-white uppercase tracking-widest drop-shadow-lg">CLICK!</h2>
          </div>
        )}

        {state === 'too_early' && (
          <div className="text-center space-y-6 p-8">
            <AlertCircle className="w-16 h-16 text-yellow-500 mx-auto" />
            <h2 className="text-3xl font-black text-white uppercase">Premature Signal</h2>
            <p className="text-slate-400">Response inhibited. Neural synchronization failed. Try again.</p>
            <button 
              onClick={(e) => { e.stopPropagation(); startTrial(); }}
              className="px-8 py-3 bg-yellow-600 hover:bg-yellow-500 text-white font-bold rounded-2xl transition-all"
            >
              Restart Trial
            </button>
          </div>
        )}

        {state === 'result' && (
          <div className="text-center space-y-6">
            <div className="space-y-1">
              <div className="text-sm font-black text-slate-500 uppercase tracking-widest">Reaction Time</div>
              <div className="text-8xl font-black text-white tabular-nums">
                {currentReaction} <span className="text-2xl text-slate-500">ms</span>
              </div>
            </div>
            <button 
               onClick={(e) => { e.stopPropagation(); startTrial(); }}
               className="px-10 py-4 bg-blue-600 hover:bg-blue-500 text-white font-black uppercase tracking-widest text-xs rounded-2xl transition-all shadow-xl shadow-blue-600/20"
            >
              Next Trial
            </button>
          </div>
        )}
      </div>

      <div className="mt-8 flex items-center gap-3 text-slate-500">
         <div className="p-2 bg-slate-900 rounded-lg"><Activity className="w-4 h-4" /></div>
         <p className="text-xs max-w-sm">Complete all {MAX_TRIALS} trials to generate a detailed neural velocity profile.</p>
      </div>
    </div>
  );
};

export default ReactionTest;
