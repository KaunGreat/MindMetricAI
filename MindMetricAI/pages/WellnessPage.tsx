
import React, { useState, useEffect, useRef } from 'react';
import { Heart, Wind, Moon, Thermometer, Save, CheckCircle2, Play, Pause, RotateCcw, Info } from 'lucide-react';
import { WellnessEntry } from '../types.ts';

const STORAGE_KEY = 'mindmetric_wellness';

const WellnessPage: React.FC = () => {
  // Check-in State
  const [sleep, setSleep] = useState(5);
  const [stress, setStress] = useState(5);
  const [notes, setNotes] = useState('');
  const [lastSaved, setLastSaved] = useState<number | null>(null);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success'>('idle');

  // Breathing State
  const [mode, setMode] = useState<'FOCUS' | 'RELAX'>('FOCUS');
  const [isActive, setIsActive] = useState(false);
  const [phase, setPhase] = useState<'Inhale' | 'Hold' | 'Exhale' | 'Hold_Out'>('Inhale');
  const [timer, setTimer] = useState(0);
  const [sessionTime, setSessionTime] = useState(0);
  
  const breatheRef = useRef<number | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const data: WellnessEntry[] = JSON.parse(saved);
      const today = new Date().toDateString();
      const todayEntry = data.find(e => new Date(e.timestamp).toDateString() === today);
      if (todayEntry) {
        setSleep(todayEntry.sleepQuality);
        setStress(todayEntry.stressLevel);
        setNotes(todayEntry.notes);
        setLastSaved(todayEntry.timestamp);
      }
    }
  }, []);

  const saveEntry = () => {
    setSaveStatus('saving');
    const newEntry: WellnessEntry = {
      id: crypto.randomUUID(),
      timestamp: Date.now(),
      sleepQuality: sleep,
      stressLevel: stress,
      notes
    };

    const saved = localStorage.getItem(STORAGE_KEY);
    let data: WellnessEntry[] = saved ? JSON.parse(saved) : [];
    
    // Remove previous entry for today if exists
    const today = new Date().toDateString();
    data = data.filter(e => new Date(e.timestamp).toDateString() !== today);
    data.push(newEntry);
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    setLastSaved(newEntry.timestamp);
    
    setTimeout(() => {
      setSaveStatus('success');
      setTimeout(() => setSaveStatus('idle'), 2000);
    }, 800);
  };

  // Breathing Logic
  useEffect(() => {
    let interval: number;
    if (isActive) {
      interval = window.setInterval(() => {
        setSessionTime(prev => prev + 1);
        setTimer(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isActive]);

  useEffect(() => {
    const configs = {
      FOCUS: [
        { phase: 'Inhale', duration: 4 },
        { phase: 'Hold', duration: 4 },
        { phase: 'Exhale', duration: 4 },
        { phase: 'Hold_Out', duration: 4 },
      ],
      RELAX: [
        { phase: 'Inhale', duration: 4 },
        { phase: 'Hold', duration: 7 },
        { phase: 'Exhale', duration: 8 },
      ]
    };

    const currentConfig = configs[mode];
    const currentPhaseIdx = currentConfig.findIndex(p => p.phase === phase);
    const maxTime = currentConfig[currentPhaseIdx]?.duration || 4;

    if (timer >= maxTime) {
      const nextIdx = (currentPhaseIdx + 1) % currentConfig.length;
      setPhase(currentConfig[nextIdx].phase as any);
      setTimer(0);
    }
  }, [timer, mode, phase]);

  const toggleBreathing = () => {
    setIsActive(!isActive);
    if (!isActive) {
      setTimer(0);
      setPhase('Inhale');
    }
  };

  const resetBreathing = () => {
    setIsActive(false);
    setTimer(0);
    setSessionTime(0);
    setPhase('Inhale');
  };

  const getCircleScale = () => {
    if (!isActive) return 'scale-100';
    if (phase === 'Inhale') return 'scale-[1.5]';
    if (phase === 'Exhale') return 'scale-100';
    if (phase === 'Hold') return 'scale-[1.5]';
    return 'scale-100';
  };

  return (
    <div className="max-w-5xl mx-auto space-y-12 animate-in fade-in duration-700 pb-20">
      <header className="space-y-2">
        <h1 className="text-4xl font-extrabold text-white flex items-center gap-3">
          <Heart className="w-8 h-8 text-emerald-400" /> Wellness Optimization
        </h1>
        <p className="text-slate-400">Track your physiological state and prime your mind for performance.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Daily Check-in */}
        <section className="bg-slate-900 border border-slate-800 rounded-[2.5rem] p-8 space-y-8 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-600/5 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2" />
          
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-black text-white uppercase tracking-tighter">Daily Check-in</h2>
            {lastSaved && (
              <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                Logged Today
              </span>
            )}
          </div>

          <div className="space-y-8">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-sm font-bold text-slate-300">
                  <Moon className="w-4 h-4 text-blue-400" /> Sleep Quality
                </label>
                <span className="text-lg font-black text-white">{sleep}/10</span>
              </div>
              <input 
                type="range" min="1" max="10" step="1" 
                value={sleep} 
                onChange={(e) => setSleep(parseInt(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-sm font-bold text-slate-300">
                  <Thermometer className="w-4 h-4 text-red-400" /> Stress Level
                </label>
                <span className="text-lg font-black text-white">{stress}/10</span>
              </div>
              <input 
                type="range" min="1" max="10" step="1" 
                value={stress} 
                onChange={(e) => setStress(parseInt(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-red-500"
              />
            </div>

            <div className="space-y-3">
              <label className="text-xs font-black uppercase tracking-widest text-slate-500 ml-1">Daily Notes</label>
              <textarea 
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="How are you feeling? Any specific stressors or wins?"
                className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500/50 rounded-2xl p-4 text-sm text-slate-300 outline-none transition-all h-32 resize-none"
              />
            </div>

            <button 
              onClick={saveEntry}
              disabled={saveStatus !== 'idle'}
              className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-800 text-white font-black uppercase tracking-widest text-xs rounded-2xl transition-all shadow-xl shadow-emerald-600/20 flex items-center justify-center gap-3 active:scale-[0.98]"
            >
              {saveStatus === 'success' ? (
                <><CheckCircle2 className="w-5 h-5" /> Entry Saved</>
              ) : saveStatus === 'saving' ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <><Save className="w-5 h-5" /> Sync Entry</>
              )}
            </button>
          </div>
        </section>

        {/* Breathing Assistant */}
        <section className="bg-slate-900 border border-slate-800 rounded-[2.5rem] p-8 flex flex-col items-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-64 h-64 bg-blue-600/5 blur-[100px] rounded-full -translate-y-1/2 -translate-x-1/2" />
          
          <div className="w-full flex items-center justify-between mb-12">
            <h2 className="text-2xl font-black text-white uppercase tracking-tighter">Breath Work</h2>
            <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest bg-slate-950 px-3 py-1 rounded-full border border-slate-800">
              Session: {Math.floor(sessionTime / 60)}:{(sessionTime % 60).toString().padStart(2, '0')}
            </div>
          </div>

          <div className="relative w-64 h-64 flex items-center justify-center mb-16">
            {/* Outer Glow */}
            <div className={`absolute inset-0 rounded-full bg-emerald-500/5 blur-3xl transition-all duration-1000 ${isActive ? 'opacity-100' : 'opacity-0'}`} />
            
            {/* Main Breathing Circle */}
            <div className={`
              w-32 h-32 rounded-full border-4 border-emerald-500/20 flex items-center justify-center transition-all duration-[4000ms] ease-in-out
              ${getCircleScale()}
              ${isActive ? 'bg-emerald-500/10 shadow-[0_0_50px_rgba(16,185,129,0.2)]' : 'bg-slate-800'}
            `}>
              <div className="text-center animate-in fade-in duration-300">
                <span className={`text-xs font-black uppercase tracking-widest ${isActive ? 'text-emerald-400' : 'text-slate-500'}`}>
                  {isActive ? phase.replace('_', ' ') : 'Ready'}
                </span>
              </div>
            </div>
            
            {/* Timing Text */}
            {isActive && (
              <div className="absolute -bottom-10 text-4xl font-black text-white/20 tabular-nums">
                {timer + 1}
              </div>
            )}
          </div>

          <div className="w-full space-y-6">
            <div className="flex gap-4">
              <button 
                onClick={() => setMode('FOCUS')}
                className={`flex-1 py-3 rounded-xl border font-bold text-xs uppercase tracking-widest transition-all ${
                  mode === 'FOCUS' ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400' : 'bg-slate-950 border-slate-800 text-slate-500 hover:text-slate-300'
                }`}
              >
                Focus (4-4-4)
              </button>
              <button 
                onClick={() => setMode('RELAX')}
                className={`flex-1 py-3 rounded-xl border font-bold text-xs uppercase tracking-widest transition-all ${
                  mode === 'RELAX' ? 'bg-blue-500/10 border-blue-500/40 text-blue-400' : 'bg-slate-950 border-slate-800 text-slate-500 hover:text-slate-300'
                }`}
              >
                Relax (4-7-8)
              </button>
            </div>

            <div className="flex gap-4">
              <button 
                onClick={toggleBreathing}
                className={`flex-[2] py-4 rounded-2xl font-black uppercase tracking-widest text-xs transition-all flex items-center justify-center gap-2 ${
                  isActive ? 'bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20' : 'bg-white text-slate-950 hover:bg-slate-100 shadow-xl'
                }`}
              >
                {isActive ? <><Pause className="w-4 h-4" /> Stop</> : <><Play className="w-4 h-4 fill-current" /> Start Session</>}
              </button>
              <button 
                onClick={resetBreathing}
                className="flex-1 py-4 bg-slate-800 hover:bg-slate-700 text-white rounded-2xl flex items-center justify-center transition-all"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>
        </section>
      </div>

      <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-3xl flex items-start gap-4">
        <div className="p-3 bg-blue-600/10 rounded-2xl border border-blue-500/20">
          <Info className="w-6 h-6 text-blue-400" />
        </div>
        <div className="space-y-2">
          <h4 className="text-sm font-bold text-white uppercase tracking-widest">Why log wellness?</h4>
          <p className="text-xs text-slate-400 leading-relaxed">
            Neural metrics are highly sensitive to physiological states. Higher stress levels typically increase reaction latency, while sleep deprivation significantly reduces working memory capacity (Spatial Span). Our AI Engine analyzes these correlations to provide your personal performance windows.
          </p>
        </div>
      </div>
    </div>
  );
};

export default WellnessPage;
