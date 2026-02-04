
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { AlertCircle, RotateCcw, Trophy, ChevronLeft, Circle, Square } from 'lucide-react';

interface GoNoGoTestProps {
  onComplete: (score: number, metadata?: any) => void;
  onCancel: () => void;
}

const TOTAL_TRIALS = 30;
const TRIAL_INTERVAL = 900;

const GoNoGoTest: React.FC<GoNoGoTestProps> = ({ onComplete, onCancel }) => {
  const [gameState, setGameState] = useState<'START' | 'PLAYING' | 'RESULT'>('START');
  const [currentTrial, setCurrentTrial] = useState(0);
  const [shape, setShape] = useState<'GO' | 'NOGO' | null>(null);
  const [hits, setHits] = useState(0);
  const [falseAlarms, setFalseAlarms] = useState(0);
  const [misses, setMisses] = useState(0);
  const [hasActed, setHasActed] = useState(false);

  const timerRef = useRef<number | null>(null);

  const startTrial = useCallback(() => {
    if (currentTrial >= TOTAL_TRIALS) {
      setGameState('RESULT');
      return;
    }

    setHasActed(false);
    const isGo = Math.random() < 0.75;
    setShape(isGo ? 'GO' : 'NOGO');

    timerRef.current = window.setTimeout(() => {
      // Evaluation after trial duration
      setShape(null);
      setCurrentTrial(prev => prev + 1);
    }, TRIAL_INTERVAL);
  }, [currentTrial]);

  useEffect(() => {
    if (gameState === 'PLAYING') {
      startTrial();
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [gameState, currentTrial, startTrial]);

  const handleInteraction = () => {
    if (gameState !== 'PLAYING' || hasActed || !shape) return;

    setHasActed(true);
    if (shape === 'GO') {
      setHits(prev => prev + 1);
    } else {
      setFalseAlarms(prev => prev + 1);
    }
  };

  useEffect(() => {
    // If trial ended and it was a GO but user didn't act
    if (shape === null && currentTrial > 0 && !hasActed) {
      // This is a bit tricky with state updates, better handled in the eval logic
    }
  }, [shape, currentTrial, hasActed]);

  useEffect(() => {
    if (gameState === 'RESULT') {
      const accuracy = Math.round((hits / (hits + falseAlarms + misses)) * 100) || 0;
      onComplete(accuracy, { hits, falseAlarms });
    }
  }, [gameState, hits, falseAlarms, misses, onComplete]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[600px] w-full max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex w-full justify-between items-center px-4">
        <button onClick={onCancel} className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
          <ChevronLeft className="w-4 h-4" /> Back
        </button>
        <div className="text-xs font-black uppercase tracking-widest text-slate-500">Trial: {currentTrial}/{TOTAL_TRIALS}</div>
      </div>

      <div 
        onClick={handleInteraction}
        className="relative w-full aspect-video bg-slate-900/50 rounded-[3rem] border border-slate-800 shadow-2xl p-12 flex flex-col items-center justify-center cursor-pointer overflow-hidden transition-all duration-150 active:scale-[0.99]"
      >
        {gameState === 'START' && (
          <div className="text-center space-y-6 max-w-md">
            <AlertCircle className="w-16 h-16 text-rose-500 mx-auto" />
            <h2 className="text-3xl font-bold">Go / No-Go</h2>
            <p className="text-slate-400">Tap for <span className="text-emerald-400 font-bold">Green Circles</span>. Do <span className="text-red-500 font-bold">NOTHING</span> for Red Squares.</p>
            <button onClick={() => { setHits(0); setFalseAlarms(0); setCurrentTrial(0); setGameState('PLAYING'); }} className="px-10 py-4 bg-rose-600 text-white font-bold rounded-2xl">Start Inhibitor</button>
          </div>
        )}

        {gameState === 'PLAYING' && shape && (
          <div className="animate-in zoom-in duration-100">
             {shape === 'GO' ? (
               <div className="w-48 h-48 bg-emerald-500 rounded-full shadow-[0_0_50px_rgba(16,185,129,0.5)] flex items-center justify-center">
                 <Circle className="w-24 h-24 text-white fill-white" />
               </div>
             ) : (
               <div className="w-48 h-48 bg-red-500 rounded-3xl shadow-[0_0_50px_rgba(239,68,68,0.5)] flex items-center justify-center">
                 <Square className="w-24 h-24 text-white fill-white" />
               </div>
             )}
          </div>
        )}

        {gameState === 'RESULT' && (
          <div className="text-center space-y-8">
            <Trophy className="w-16 h-16 text-yellow-500 mx-auto" />
            <h2 className="text-3xl font-black">Inhibition Analysis</h2>
            <div className="grid grid-cols-2 gap-8 mb-8">
               <div className="p-4 bg-slate-800 rounded-2xl">
                  <div className="text-xs font-black text-slate-500 uppercase">Hits</div>
                  <div className="text-4xl font-black text-emerald-400">{hits}</div>
               </div>
               <div className="p-4 bg-slate-800 rounded-2xl">
                  <div className="text-xs font-black text-slate-500 uppercase">Impulses</div>
                  <div className="text-4xl font-black text-red-500">{falseAlarms}</div>
               </div>
            </div>
            <button onClick={() => { setHits(0); setFalseAlarms(0); setCurrentTrial(0); setGameState('PLAYING'); }} className="px-8 py-3 bg-rose-600 text-white font-bold rounded-xl">Try Again</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default GoNoGoTest;
