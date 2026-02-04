
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Target, RotateCcw, Trophy, ChevronLeft, LayoutDashboard, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

interface StroopTestProps {
  onComplete: (score: number, metadata?: any) => void;
  onCancel: () => void;
}

const COLORS = [
  { name: 'RED', value: '#ef4444', tailwind: 'bg-red-500' },
  { name: 'BLUE', value: '#3b82f6', tailwind: 'bg-blue-500' },
  { name: 'GREEN', value: '#10b981', tailwind: 'bg-emerald-500' },
  { name: 'YELLOW', value: '#eab308', tailwind: 'bg-yellow-500' },
];

const TOTAL_TRIALS = 20;

type GameState = 'START' | 'PLAYING' | 'RESULT';

interface TrialData {
  congruent: boolean;
  responseTime: number;
}

const StroopTest: React.FC<StroopTestProps> = ({ onComplete, onCancel }) => {
  const [gameState, setGameState] = useState<GameState>('START');
  const [currentTrial, setCurrentTrial] = useState(0);
  const [word, setWord] = useState(COLORS[0]);
  const [fontColor, setFontColor] = useState(COLORS[0]);
  const [trialsData, setTrialsData] = useState<TrialData[]>([]);
  const [startTime, setStartTime] = useState(0);

  const nextTrial = useCallback(() => {
    if (currentTrial >= TOTAL_TRIALS) {
      setGameState('RESULT');
      return;
    }

    const wordIdx = Math.floor(Math.random() * COLORS.length);
    const colorIdx = Math.floor(Math.random() * COLORS.length);
    
    setWord(COLORS[wordIdx]);
    setFontColor(COLORS[colorIdx]);
    setStartTime(performance.now());
  }, [currentTrial]);

  const handleChoice = (selectedColorName: string) => {
    if (gameState !== 'PLAYING') return;

    const endTime = performance.now();
    const rt = endTime - startTime;

    if (selectedColorName === fontColor.name) {
      const isCongruent = word.name === fontColor.name;
      setTrialsData(prev => [...prev, { congruent: isCongruent, responseTime: rt }]);
      setCurrentTrial(prev => prev + 1);
      nextTrial();
    } else {
      // Small penalty or flash for wrong answer, but we proceed
      setCurrentTrial(prev => prev + 1);
      nextTrial();
    }
  };

  const startTest = () => {
    setTrialsData([]);
    setCurrentTrial(0);
    setGameState('PLAYING');
    nextTrial();
  };

  useEffect(() => {
    if (gameState === 'RESULT') {
      const congruent = trialsData.filter(t => t.congruent);
      const incongruent = trialsData.filter(t => !t.congruent);
      
      const avgCongruent = congruent.length > 0 
        ? congruent.reduce((acc, t) => acc + t.responseTime, 0) / congruent.length 
        : 0;
      const avgIncongruent = incongruent.length > 0 
        ? incongruent.reduce((acc, t) => acc + t.responseTime, 0) / incongruent.length 
        : 0;
      
      const interferenceCost = Math.round(avgIncongruent - avgCongruent);
      const overallAvg = Math.round(trialsData.reduce((acc, t) => acc + t.responseTime, 0) / trialsData.length);
      
      onComplete(overallAvg, { interferenceCost, avgCongruent, avgIncongruent });
    }
  }, [gameState, trialsData, onComplete]);

  const stats = (() => {
    const congruent = trialsData.filter(t => t.congruent);
    const incongruent = trialsData.filter(t => !t.congruent);
    const avgCongruent = congruent.length > 0 ? Math.round(congruent.reduce((acc, t) => acc + t.responseTime, 0) / congruent.length) : 0;
    const avgIncongruent = incongruent.length > 0 ? Math.round(incongruent.reduce((acc, t) => acc + t.responseTime, 0) / incongruent.length) : 0;
    return { avgCongruent, avgIncongruent, cost: avgIncongruent - avgCongruent };
  })();

  return (
    <div className="flex flex-col items-center justify-center min-h-[600px] w-full max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex w-full justify-between items-center px-4">
        <button onClick={onCancel} className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
          <ChevronLeft className="w-4 h-4" /> Back
        </button>
        <div className="flex items-center gap-4">
          <div className="h-2 w-48 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
            <div 
              className="h-full bg-emerald-500 transition-all duration-300" 
              style={{ width: `${(currentTrial / TOTAL_TRIALS) * 100}%` }}
            />
          </div>
          <span className="text-xs font-black text-slate-500">{currentTrial}/{TOTAL_TRIALS}</span>
        </div>
      </div>

      <div className="relative w-full aspect-video bg-slate-900/50 rounded-[2.5rem] border border-slate-800 shadow-2xl p-8 flex flex-col items-center justify-center overflow-hidden">
        
        {gameState === 'START' && (
          <div className="text-center space-y-6 max-w-md animate-in zoom-in duration-300">
            <div className="w-20 h-20 bg-emerald-600 rounded-3xl flex items-center justify-center mx-auto shadow-2xl shadow-emerald-500/20">
              <Target className="w-10 h-10 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-bold mb-2">Stroop Test</h2>
              <p className="text-slate-400">Identify the <span className="text-white font-bold underline underline-offset-4 decoration-emerald-500">FONT COLOR</span> of the word, ignoring what the word actually says.</p>
            </div>
            <button 
              onClick={startTest}
              className="px-10 py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-2xl transition-all shadow-xl shadow-emerald-600/20 active:scale-95"
            >
              Start Assessment
            </button>
          </div>
        )}

        {gameState === 'PLAYING' && (
          <div className="flex flex-col items-center justify-between h-full w-full py-12">
             <div className="flex-1 flex items-center justify-center">
                <h1 
                  className="text-8xl font-black tracking-tighter select-none transition-all duration-100"
                  style={{ color: fontColor.value }}
                >
                  {word.name}
                </h1>
             </div>

             <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full max-w-2xl">
                {COLORS.map(c => (
                  <button
                    key={c.name}
                    onClick={() => handleChoice(c.name)}
                    className="group relative h-20 bg-slate-800 border border-slate-700 rounded-2xl flex items-center justify-center transition-all hover:border-white/20 active:scale-95"
                  >
                    <div className={`w-10 h-10 rounded-full ${c.tailwind} shadow-lg`} />
                    <span className="absolute -bottom-6 text-[10px] font-black uppercase text-slate-600 tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                      {c.name}
                    </span>
                  </button>
                ))}
             </div>
          </div>
        )}

        {gameState === 'RESULT' && (
          <div className="inset-0 bg-slate-950/90 backdrop-blur-md flex flex-col items-center justify-center p-8 text-center space-y-8 animate-in fade-in duration-500">
            <Trophy className="w-16 h-16 text-yellow-500" />
            <div>
              <h2 className="text-3xl font-black text-white">Assessment Complete</h2>
              <p className="text-slate-400 text-sm mt-1">Interference Cost Analysis</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-3xl">
              <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Congruent</p>
                <div className="text-3xl font-black text-emerald-400">{stats.avgCongruent}ms</div>
              </div>
              <div className="p-6 bg-slate-900 border border-emerald-500/30 rounded-2xl ring-2 ring-emerald-500/20">
                <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-1">Interference Cost</p>
                <div className="text-3xl font-black text-white">{stats.cost}ms</div>
              </div>
              <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Incongruent</p>
                <div className="text-3xl font-black text-red-400">{stats.avgIncongruent}ms</div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
              <button 
                onClick={startTest}
                className="flex-1 flex items-center justify-center gap-2 px-8 py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-2xl transition-all shadow-xl shadow-emerald-600/20"
              >
                <RotateCcw className="w-5 h-5" /> Retest
              </button>
              <button 
                onClick={onCancel}
                className="flex-1 flex items-center justify-center gap-2 px-8 py-4 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-2xl transition-all"
              >
                <LayoutDashboard className="w-5 h-5" /> Dashboard
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center gap-3 p-4 bg-blue-500/10 border border-blue-500/20 rounded-2xl max-w-lg">
        <Zap className="w-5 h-5 text-blue-400 shrink-0" />
        <p className="text-xs text-blue-300 leading-relaxed">
          The <strong>Interference Cost</strong> measures how much your processing speed slows down when text and color conflict. Lower costs indicate superior inhibitory control and focus.
        </p>
      </div>
    </div>
  );
};

export default StroopTest;
