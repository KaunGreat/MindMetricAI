
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Hash, RotateCcw, Trophy, ChevronLeft, Send, ArrowRight } from 'lucide-react';

interface DigitSpanTestProps {
  onComplete: (score: number, metadata?: any) => void;
  onCancel: () => void;
}

const DigitSpanTest: React.FC<DigitSpanTestProps> = ({ onComplete, onCancel }) => {
  const [gameState, setGameState] = useState<'START' | 'SHOW' | 'INPUT' | 'RESULT'>('START');
  const [sequence, setSequence] = useState<number[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [userInput, setUserInput] = useState('');
  const [level, setLevel] = useState(3);
  const [score, setScore] = useState(0);

  const timerRef = useRef<number | null>(null);

  const startLevel = useCallback((lvl: number) => {
    const newSeq = Array.from({ length: lvl }, () => Math.floor(Math.random() * 10));
    setSequence(newSeq);
    setGameState('SHOW');
    setCurrentIdx(0);
    setUserInput('');
  }, []);

  useEffect(() => {
    if (gameState === 'SHOW') {
      if (currentIdx < sequence.length) {
        timerRef.current = window.setTimeout(() => {
          setCurrentIdx(prev => prev + 1);
        }, 1200);
      } else {
        setGameState('INPUT');
      }
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [gameState, currentIdx, sequence.length]);

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (gameState !== 'INPUT') return;

    const correctStr = sequence.join('');
    if (userInput === correctStr) {
      setScore(level);
      setLevel(prev => prev + 1);
      setTimeout(() => startLevel(level + 1), 1000);
    } else {
      setGameState('RESULT');
    }
  };

  useEffect(() => {
    if (gameState === 'RESULT') {
      onComplete(score);
    }
  }, [gameState, score, onComplete]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[600px] w-full max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex w-full justify-between items-center px-4">
        <button onClick={onCancel} className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
          <ChevronLeft className="w-4 h-4" /> Back
        </button>
        <div className="text-xs font-black uppercase tracking-widest text-slate-500">Max Span: {score}</div>
      </div>

      <div className="relative w-full aspect-video bg-slate-900/50 rounded-[3rem] border border-slate-800 shadow-2xl p-12 flex flex-col items-center justify-center overflow-hidden">
        {gameState === 'START' && (
          <div className="text-center space-y-6 max-w-md">
            <Hash className="w-16 h-16 text-amber-500 mx-auto" />
            <h2 className="text-3xl font-bold">Digit Span</h2>
            <p className="text-slate-400">Listen (watch) to a sequence of numbers and type them back correctly. The length increases with each success.</p>
            <button onClick={() => { setLevel(3); startLevel(3); }} className="px-10 py-4 bg-amber-600 text-white font-bold rounded-2xl">Begin Seq</button>
          </div>
        )}

        {gameState === 'SHOW' && (
          <div className="text-[12rem] font-black tabular-nums animate-in zoom-in duration-200">
            {currentIdx < sequence.length ? sequence[currentIdx] : ''}
          </div>
        )}

        {gameState === 'INPUT' && (
          <div className="w-full max-w-sm space-y-8 animate-in fade-in duration-300">
             <div className="text-center space-y-2">
                <h3 className="text-xl font-black text-white uppercase tracking-widest">Recall Sequence</h3>
                <p className="text-slate-500 text-xs">Type the numbers in the order they appeared</p>
             </div>
             <form onSubmit={handleSubmit} className="relative">
                <input 
                  autoFocus
                  type="text"
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value.replace(/\D/g, ''))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-2xl py-6 px-4 text-4xl font-black text-center tracking-[0.5em] text-white focus:border-amber-500 outline-none transition-all"
                  placeholder="???"
                />
                <button type="submit" className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-amber-600 rounded-xl text-white">
                  <Send className="w-5 h-5" />
                </button>
             </form>
          </div>
        )}

        {gameState === 'RESULT' && (
          <div className="text-center space-y-8">
            <Trophy className="w-16 h-16 text-yellow-500 mx-auto" />
            <h2 className="text-3xl font-black">Recall Failed</h2>
            <div className="text-8xl font-black text-white italic">{score}</div>
            <p className="text-slate-500 text-sm font-bold uppercase tracking-widest">Verbal Span Score</p>
            <button onClick={() => { setLevel(3); startLevel(3); }} className="px-8 py-3 bg-amber-600 text-white font-bold rounded-xl">Try Again</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DigitSpanTest;
