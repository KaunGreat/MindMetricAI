
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Repeat, RotateCcw, Trophy, Play, ChevronLeft, LayoutDashboard, CheckCircle2, XCircle } from 'lucide-react';

interface NBackTestProps {
  onComplete: (score: number, metadata?: any) => void;
  onCancel: () => void;
}

const ITEMS = ['A', 'B', 'C', 'D', 'E', 'F', 'X', 'Y', 'Z'];
const N = 2; // Fixed to 2-back for this version
const TRIAL_COUNT = 30;

type GameState = 'START' | 'PLAYING' | 'RESULT';

const NBackTest: React.FC<NBackTestProps> = ({ onComplete, onCancel }) => {
  const [gameState, setGameState] = useState<GameState>('START');
  const [sequence, setSequence] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [hits, setHits] = useState(0);
  const [falseAlarms, setFalseAlarms] = useState(0);
  const [misses, setMisses] = useState(0);
  const [feedback, setFeedback] = useState<'hit' | 'miss' | 'fa' | null>(null);
  const [lastActionIdx, setLastActionIdx] = useState(-1);

  const timerRef = useRef<number | null>(null);

  const generateSequence = () => {
    const seq: string[] = [];
    for (let i = 0; i < TRIAL_COUNT; i++) {
      // 30% chance of a match to keep user engaged
      if (i >= N && Math.random() < 0.3) {
        seq.push(seq[i - N]);
      } else {
        seq.push(ITEMS[Math.floor(Math.random() * ITEMS.length)]);
      }
    }
    return seq;
  };

  const nextItem = useCallback(() => {
    setCurrentIndex(prev => {
      const nextIdx = prev + 1;
      if (nextIdx >= TRIAL_COUNT) {
        setGameState('RESULT');
        return prev;
      }
      
      // Auto-count misses if user didn't act on a match
      if (prev >= N && sequence[prev] === sequence[prev - N] && lastActionIdx !== prev) {
        setMisses(m => m + 1);
      }

      setFeedback(null);
      return nextIdx;
    });
  }, [sequence, lastActionIdx]);

  useEffect(() => {
    if (gameState === 'PLAYING') {
      timerRef.current = window.setInterval(nextItem, 2500);
      return () => {
        if (timerRef.current) clearInterval(timerRef.current);
      };
    }
  }, [gameState, nextItem]);

  const handleMatch = () => {
    if (gameState !== 'PLAYING' || lastActionIdx === currentIndex) return;

    setLastActionIdx(currentIndex);
    const isMatch = currentIndex >= N && sequence[currentIndex] === sequence[currentIndex - N];

    if (isMatch) {
      setHits(h => h + 1);
      setFeedback('hit');
    } else {
      setFalseAlarms(fa => fa + 1);
      setFeedback('fa');
    }
  };

  const startTest = () => {
    const newSeq = generateSequence();
    setSequence(newSeq);
    setHits(0);
    setFalseAlarms(0);
    setMisses(0);
    setCurrentIndex(-1);
    setLastActionIdx(-1);
    setGameState('PLAYING');
    setFeedback(null);
    // Kick off immediately
    setTimeout(nextItem, 100);
  };

  useEffect(() => {
    if (gameState === 'RESULT') {
      const accuracy = Math.round((hits / (hits + misses + falseAlarms)) * 100) || 0;
      onComplete(accuracy, { hits, falseAlarms, misses });
    }
  }, [gameState, hits, falseAlarms, misses, onComplete]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[600px] w-full max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex w-full justify-between items-center px-4">
        <button onClick={onCancel} className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
          <ChevronLeft className="w-4 h-4" /> Back
        </button>
        <div className="flex items-center gap-4">
          <div className="h-2 w-48 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
            <div 
              className="h-full bg-orange-500 transition-all duration-300" 
              style={{ width: `${((currentIndex + 1) / TRIAL_COUNT) * 100}%` }}
            />
          </div>
          <span className="text-xs font-black text-slate-500">{currentIndex + 1}/{TRIAL_COUNT}</span>
        </div>
      </div>

      <div className="relative w-full aspect-video bg-slate-900/50 rounded-[3rem] border border-slate-800 shadow-2xl p-8 flex flex-col items-center justify-center overflow-hidden">
        
        {gameState === 'START' && (
          <div className="text-center space-y-6 max-w-md animate-in zoom-in duration-300">
            <div className="w-20 h-20 bg-orange-600 rounded-3xl flex items-center justify-center mx-auto shadow-2xl shadow-orange-500/20">
              <Repeat className="w-10 h-10 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-bold mb-2">2-Back Memory</h2>
              <p className="text-slate-400">Items will appear one by one. Press "MATCH" if the current item is the same as the one shown <strong>2 steps ago</strong>.</p>
            </div>
            <button 
              onClick={startTest}
              className="px-10 py-4 bg-orange-600 hover:bg-orange-500 text-white font-bold rounded-2xl shadow-xl shadow-orange-600/20"
            >
              Initialize Stream
            </button>
          </div>
        )}

        {gameState === 'PLAYING' && (
          <div className="flex flex-col items-center justify-between h-full w-full py-8">
            <div className="flex-1 flex items-center justify-center">
               <div className={`
                 text-9xl font-black transition-all duration-300 transform
                 ${feedback === 'hit' ? 'text-emerald-500 scale-110' : 
                   feedback === 'fa' ? 'text-red-500 scale-90' : 
                   'text-white'}
               `}>
                 {sequence[currentIndex]}
               </div>
            </div>

            <button
              onClick={handleMatch}
              className="w-full max-w-xs py-6 bg-orange-600 hover:bg-orange-500 text-white font-black uppercase tracking-[0.2em] rounded-3xl shadow-xl shadow-orange-600/20 active:scale-95 transition-all text-xl"
            >
              Match Found
            </button>
          </div>
        )}

        {gameState === 'RESULT' && (
          <div className="inset-0 bg-slate-950/90 backdrop-blur-md flex flex-col items-center justify-center p-8 text-center space-y-8 animate-in fade-in duration-500">
            <Trophy className="w-16 h-16 text-yellow-500" />
            <div>
              <h2 className="text-3xl font-black text-white">Stream Complete</h2>
              <p className="text-slate-400 text-sm mt-1">Working Memory Load Analysis</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-3xl">
              <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Hits</p>
                <div className="text-3xl font-black text-emerald-400">{hits}</div>
              </div>
              <div className="p-6 bg-slate-900 border border-orange-500/30 rounded-2xl ring-2 ring-orange-500/20">
                <p className="text-[10px] font-black text-orange-400 uppercase tracking-widest mb-1">Accuracy</p>
                <div className="text-3xl font-black text-white">{Math.round((hits / (hits + misses + falseAlarms)) * 100) || 0}%</div>
              </div>
              <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">False Alarms</p>
                <div className="text-3xl font-black text-red-400">{falseAlarms}</div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
              <button 
                onClick={startTest}
                className="flex-1 flex items-center justify-center gap-2 px-8 py-4 bg-orange-600 hover:bg-orange-500 text-white font-bold rounded-2xl shadow-xl"
              >
                <RotateCcw className="w-5 h-5" /> Retest
              </button>
              <button 
                onClick={onCancel}
                className="flex-1 flex items-center justify-center gap-2 px-8 py-4 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-2xl"
              >
                <LayoutDashboard className="w-5 h-5" /> Dashboard
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center gap-3 p-4 bg-orange-500/10 border border-orange-500/20 rounded-2xl max-w-lg">
        <Repeat className="w-5 h-5 text-orange-400 shrink-0" />
        <p className="text-xs text-orange-300 leading-relaxed">
          N-Back is the gold standard for testing and training <strong>Fluid Intelligence</strong> and Working Memory capacity.
        </p>
      </div>
    </div>
  );
};

export default NBackTest;
