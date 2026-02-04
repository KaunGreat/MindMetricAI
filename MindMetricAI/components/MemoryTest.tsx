
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Brain, RotateCcw, Trophy, Play, LayoutDashboard } from 'lucide-react';
import { TestType } from '../types';

interface MemoryTestProps {
  onComplete: (score: number) => void;
  onCancel: () => void;
}

type GameStatus = 'IDLE' | 'SHOWING' | 'PLAYING' | 'GAME_OVER' | 'SUCCESS';

const MemoryTest: React.FC<MemoryTestProps> = ({ onComplete, onCancel }) => {
  const [gridSize, setGridSize] = useState(3); // 3x3 initially
  const [level, setLevel] = useState(1);
  const [sequence, setSequence] = useState<number[]>([]);
  const [userSequence, setUserSequence] = useState<number[]>([]);
  const [status, setStatus] = useState<GameStatus>('IDLE');
  const [activeTile, setActiveTile] = useState<number | null>(null);
  const [feedbackTile, setFeedbackTile] = useState<{ index: number; type: 'correct' | 'wrong' } | null>(null);

  const timerRef = useRef<number | null>(null);

  const startLevel = useCallback((lvl: number) => {
    const newGridSize = lvl > 5 ? 4 : 3;
    setGridSize(newGridSize);
    
    // Generate random sequence of length lvl + 2
    const seqLength = lvl + 2;
    const newSequence: number[] = [];
    for (let i = 0; i < seqLength; i++) {
      newSequence.push(Math.floor(Math.random() * (newGridSize * newGridSize)));
    }
    
    setSequence(newSequence);
    setUserSequence([]);
    setStatus('SHOWING');
    setLevel(lvl);
  }, []);

  // Effect to show sequence
  useEffect(() => {
    if (status === 'SHOWING' && sequence.length > 0) {
      let i = 0;
      const interval = setInterval(() => {
        if (i < sequence.length) {
          setActiveTile(sequence[i]);
          setTimeout(() => setActiveTile(null), 400);
          i++;
        } else {
          clearInterval(interval);
          setStatus('PLAYING');
        }
      }, 800);
      return () => clearInterval(interval);
    }
  }, [status, sequence]);

  const handleTileClick = (index: number) => {
    if (status !== 'PLAYING') return;

    const expectedIndex = sequence[userSequence.length];
    
    if (index === expectedIndex) {
      const newUserSequence = [...userSequence, index];
      setUserSequence(newUserSequence);
      setFeedbackTile({ index, type: 'correct' });
      setTimeout(() => setFeedbackTile(null), 200);

      if (newUserSequence.length === sequence.length) {
        setStatus('SUCCESS');
        setTimeout(() => {
          startLevel(level + 1);
        }, 1000);
      }
    } else {
      setFeedbackTile({ index, type: 'wrong' });
      setStatus('GAME_OVER');
      onComplete(level); // Use level as the score
    }
  };

  const resetGame = () => {
    startLevel(1);
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-8 animate-in fade-in zoom-in duration-500">
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-600/20 rounded-lg">
            <Brain className="w-6 h-6 text-purple-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold">Pattern Memory</h2>
            <p className="text-xs text-slate-500 uppercase tracking-widest font-bold">Level {level}</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-xs text-slate-500 uppercase font-bold">Score</div>
          <div className="text-2xl font-black text-white">{level - 1}</div>
        </div>
      </div>

      <div className="relative aspect-square w-full max-w-md mx-auto bg-slate-900/50 p-4 rounded-3xl border border-slate-800 shadow-2xl">
        <div 
          className="grid gap-3 h-full w-full"
          style={{ gridTemplateColumns: `repeat(${gridSize}, 1fr)` }}
        >
          {Array.from({ length: gridSize * gridSize }).map((_, i) => {
            const isShowing = activeTile === i;
            const isCorrect = feedbackTile?.index === i && feedbackTile.type === 'correct';
            const isWrong = feedbackTile?.index === i && feedbackTile.type === 'wrong';

            return (
              <button
                key={i}
                disabled={status !== 'PLAYING'}
                onClick={() => handleTileClick(i)}
                className={`
                  relative rounded-xl transition-all duration-200 aspect-square
                  ${isShowing ? 'bg-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.5)] scale-95' : 
                    isCorrect ? 'bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)]' :
                    isWrong ? 'bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.5)]' :
                    'bg-slate-800 hover:bg-slate-700 active:scale-95'
                  }
                `}
              />
            );
          })}
        </div>

        {status === 'IDLE' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950/80 backdrop-blur-sm rounded-3xl p-8 text-center space-y-6">
            <div className="w-16 h-16 bg-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/20">
              <Play className="w-8 h-8 text-white fill-current" />
            </div>
            <div>
              <h3 className="text-2xl font-bold mb-2">Memory Matrix</h3>
              <p className="text-slate-400 text-sm">Watch the tiles light up and repeat the sequence exactly.</p>
            </div>
            <button 
              onClick={resetGame}
              className="px-8 py-3 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl transition-all hover:scale-105 active:scale-95"
            >
              Begin Test
            </button>
          </div>
        )}

        {status === 'GAME_OVER' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950/90 backdrop-blur-md rounded-3xl p-8 text-center space-y-6 animate-in fade-in zoom-in duration-300">
            <div className="w-16 h-16 bg-red-600/20 rounded-2xl flex items-center justify-center border border-red-500/50">
              <Trophy className="w-8 h-8 text-red-500" />
            </div>
            <div>
              <h3 className="text-2xl font-bold mb-1">Sequence Broken</h3>
              <p className="text-slate-400 text-sm">You reached level {level}.</p>
            </div>
            <div className="text-4xl font-black text-white">{level - 1} Points</div>
            <div className="flex flex-col sm:flex-row gap-4">
              <button 
                onClick={resetGame}
                className="flex items-center gap-2 px-8 py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl transition-all"
              >
                <RotateCcw className="w-5 h-5" /> Try Again
              </button>
              <button 
                onClick={onCancel}
                className="flex items-center gap-2 px-8 py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl transition-all border border-slate-700"
              >
                <LayoutDashboard className="w-5 h-5" /> Dashboard
              </button>
            </div>
          </div>
        )}

        {status === 'SHOWING' && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-blue-600/20 border border-blue-500/30 rounded-full">
            <span className="text-xs font-bold text-blue-400 uppercase tracking-widest">Memorize...</span>
          </div>
        )}

        {status === 'PLAYING' && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-emerald-600/20 border border-emerald-500/30 rounded-full">
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">Repeat sequence</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-3 gap-4 text-center">
        <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl">
          <div className="text-[10px] text-slate-500 uppercase font-black mb-1">Focus</div>
          <div className="text-lg font-bold text-blue-400">High</div>
        </div>
        <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl">
          <div className="text-[10px] text-slate-500 uppercase font-black mb-1">Grid</div>
          <div className="text-lg font-bold text-purple-400">{gridSize}x{gridSize}</div>
        </div>
        <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl">
          <div className="text-[10px] text-slate-500 uppercase font-black mb-1">Length</div>
          <div className="text-lg font-bold text-emerald-400">{sequence.length || '-'}</div>
        </div>
      </div>
    </div>
  );
};

export default MemoryTest;
