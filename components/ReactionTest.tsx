
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Zap, Timer, RotateCcw, LayoutDashboard, ChevronLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ReactionTestProps {
  onComplete: (score: number) => void;
}

type GameState = 'START' | 'WAITING' | 'CLICK_NOW' | 'RESULT' | 'TOO_EARLY';

const ReactionTest: React.FC<ReactionTestProps> = ({ onComplete }) => {
  const [state, setState] = useState<GameState>('START');
  const [reactionTime, setReactionTime] = useState<number | null>(null);
  const startTimeRef = useRef<number>(0);
  const timeoutRef = useRef<number | null>(null);

  const startTest = useCallback(() => {
    setState('WAITING');
    const delay = 2000 + Math.random() * 3000;
    timeoutRef.current = window.setTimeout(() => {
      setState('CLICK_NOW');
      startTimeRef.current = performance.now();
    }, delay);
  }, []);

  const handleClick = () => {
    if (state === 'WAITING') {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      setState('TOO_EARLY');
    } else if (state === 'CLICK_NOW') {
      const endTime = performance.now();
      const time = Math.round(endTime - startTimeRef.current);
      setReactionTime(time);
      setState('RESULT');
      onComplete(time);
    } else if (state === 'START') {
      startTest();
    }
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-[600px] w-full max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex w-full justify-between items-center px-4">
        <Link to="/" className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
          <ChevronLeft className="w-4 h-4" /> Back to Dashboard
        </Link>
        <div className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">Reaction Velocity V1.0</div>
      </div>

      <div 
        onClick={handleClick}
        className="relative w-full aspect-video bg-slate-900/50 rounded-[2.5rem] border border-slate-800 shadow-2xl flex flex-col items-center justify-center cursor-pointer overflow-hidden transition-all duration-300 active:scale-[0.99]"
      >
        {/* The Action Circle */}
        <div 
          className={`
            w-64 h-64 rounded-full flex flex-col items-center justify-center transition-all duration-150 transform
            ${state === 'WAITING' ? 'bg-red-500 shadow-[0_0_60px_rgba(239,68,68,0.4)]' : ''}
            ${state === 'CLICK_NOW' ? 'bg-emerald-500 shadow-[0_0_80px_rgba(16,185,129,0.5)] scale-110' : ''}
            ${state === 'START' || state === 'RESULT' || state === 'TOO_EARLY' ? 'bg-slate-800 border-2 border-slate-700' : ''}
          `}
        >
          {state === 'START' && (
            <div className="text-center p-6 space-y-4">
              <Zap className="w-12 h-12 text-blue-400 mx-auto" />
              <p className="font-bold text-white text-lg">Click to Start</p>
            </div>
          )}

          {state === 'WAITING' && (
            <div className="text-center text-white font-black uppercase tracking-widest text-xl">
              Wait for Green
            </div>
          )}

          {state === 'CLICK_NOW' && (
            <div className="text-center text-white font-black uppercase tracking-[0.2em] text-3xl animate-bounce">
              CLICK NOW!
            </div>
          )}

          {(state === 'RESULT' || state === 'TOO_EARLY') && reactionTime !== null && (
            <div className="text-center">
              {state === 'TOO_EARLY' ? (
                <span className="text-red-400 font-bold uppercase tracking-widest">Too Early!</span>
              ) : (
                <>
                  <div className="text-5xl font-black text-white">{reactionTime}</div>
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Milliseconds</div>
                </>
              )}
            </div>
          )}
        </div>

        {/* Status Message Overlay */}
        <div className="mt-12 text-center max-w-xs">
          {state === 'START' && <p className="text-slate-400 text-sm">Click the circle to begin the neural speed test.</p>}
          {state === 'WAITING' && <p className="text-red-400/80 text-sm font-medium animate-pulse">Stay focused...</p>}
          {state === 'CLICK_NOW' && <p className="text-emerald-400 text-sm font-bold">REACT NOW!</p>}
          {state === 'TOO_EARLY' && <p className="text-slate-400 text-sm">Precision requires patience. Try again.</p>}
          {state === 'RESULT' && <p className="text-slate-400 text-sm">Neural signals processed. See below for options.</p>}
        </div>
      </div>

      {/* Result Actions */}
      {(state === 'RESULT' || state === 'TOO_EARLY') && (
        <div className="flex flex-col sm:flex-row gap-4 animate-in slide-in-from-bottom-4 duration-500">
          <button 
            onClick={(e) => { e.stopPropagation(); startTest(); }}
            className="flex items-center justify-center gap-2 px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-2xl transition-all shadow-xl shadow-blue-600/20 active:scale-95 min-w-[200px]"
          >
            <RotateCcw className="w-5 h-5" /> Try Again
          </button>
          <Link 
            to="/" 
            className="flex items-center justify-center gap-2 px-8 py-4 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-2xl transition-all active:scale-95 min-w-[200px]"
          >
            <LayoutDashboard className="w-5 h-5" /> Dashboard
          </Link>
        </div>
      )}
    </div>
  );
};

export default ReactionTest;
