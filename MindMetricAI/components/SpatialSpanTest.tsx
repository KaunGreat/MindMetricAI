
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Brain, RotateCcw, Trophy, Play, ChevronLeft, LayoutDashboard } from 'lucide-react';
import { Link } from 'react-router-dom';
import { TestType } from '../types';

interface SpatialSpanTestProps {
  onComplete: (score: number) => void;
  onCancel: () => void;
}

type GameState = 'START' | 'SEQUENCE' | 'RECALL' | 'GAME_OVER';

const SpatialSpanTest: React.FC<SpatialSpanTestProps> = ({ onComplete, onCancel }) => {
  const [gameState, setGameState] = useState<GameState>('START');
  const [level, setLevel] = useState(2); // Starting sequence length
  const [sequence, setSequence] = useState<number[]>([]);
  const [userInput, setUserInput] = useState<number[]>([]);
  const [activeBlock, setActiveBlock] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<{ index: number; type: 'correct' | 'wrong' } | null>(null);
  
  const timeoutRefs = useRef<number[]>([]);

  const clearTimeouts = () => {
    timeoutRefs.current.forEach(window.clearTimeout);
    timeoutRefs.current = [];
  };

  const generateSequence = (length: number) => {
    const newSeq: number[] = [];
    for (let i = 0; i < length; i++) {
      newSeq.push(Math.floor(Math.random() * 9));
    }
    return newSeq;
  };

  const playSequence = useCallback((seq: number[]) => {
    setGameState('SEQUENCE');
    setActiveBlock(null);
    
    seq.forEach((blockIndex, i) => {
      const showTimeout = window.setTimeout(() => {
        setActiveBlock(blockIndex);
      }, (i + 1) * 800);
      
      const hideTimeout = window.setTimeout(() => {
        setActiveBlock(null);
        if (i === seq.length - 1) {
          setGameState('RECALL');
          setUserInput([]);
        }
      }, (i + 1) * 800 + 400);
      
      timeoutRefs.current.push(showTimeout, hideTimeout);
    });
  }, []);

  const startTest = () => {
    clearTimeouts();
    const initialLevel = 2;
    const initialSeq = generateSequence(initialLevel);
    setLevel(initialLevel);
    setSequence(initialSeq);
    setGameState('SEQUENCE');
    playSequence(initialSeq);
  };

  const handleBlockClick = (index: number) => {
    if (gameState !== 'RECALL') return;

    const expectedIndex = sequence[userInput.length];
    
    if (index === expectedIndex) {
      const newUserInput = [...userInput, index];
      setUserInput(newUserInput);
      
      // Visual feedback
      setFeedback({ index, type: 'correct' });
      setTimeout(() => setFeedback(null), 200);

      if (newUserInput.length === sequence.length) {
        // Level cleared
        const nextLevel = level + 1;
        const nextSeq = generateSequence(nextLevel);
        setLevel(nextLevel);
        setSequence(nextSeq);
        setGameState('SEQUENCE');
        setTimeout(() => playSequence(nextSeq), 1000);
      }
    } else {
      // Failed
      setFeedback({ index, type: 'wrong' });
      setGameState('GAME_OVER');
      onComplete(level - 1); // Score is the last successfully completed level
    }
  };

  useEffect(() => {
    return () => clearTimeouts();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-[600px] w-full max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex w-full justify-between items-center px-4">
        <button onClick={onCancel} className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
          <ChevronLeft className="w-4 h-4" /> Back to Dashboard
        </button>
        <div className="flex items-center gap-2">
          <div className="px-3 py-1 bg-purple-500/10 border border-purple-500/30 rounded-full">
            <span className="text-xs font-black uppercase tracking-widest text-purple-400">Span Level: {level}</span>
          </div>
        </div>
      </div>

      <div className="relative w-full aspect-square max-w-[500px] bg-slate-900/50 rounded-[2.5rem] border border-slate-800 shadow-2xl p-8 flex flex-col items-center justify-center overflow-hidden">
        
        {/* The 3x3 Grid */}
        <div className="grid grid-cols-3 gap-4 w-full h-full">
          {Array.from({ length: 9 }).map((_, i) => {
            const isActive = activeBlock === i;
            const isCorrect = feedback?.index === i && feedback.type === 'correct';
            const isWrong = feedback?.index === i && feedback.type === 'wrong';
            
            return (
              <button
                key={i}
                disabled={gameState !== 'RECALL'}
                onClick={() => handleBlockClick(i)}
                className={`
                  relative rounded-2xl transition-all duration-150 aspect-square
                  ${isActive ? 'bg-blue-500 shadow-[0_0_30px_rgba(59,130,246,0.6)] scale-95' : 
                    isCorrect ? 'bg-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.5)]' :
                    isWrong ? 'bg-red-500 shadow-[0_0_20px_rgba(239,68,68,0.5)]' :
                    'bg-slate-800 border border-slate-700 hover:bg-slate-700/50'
                  }
                  ${gameState !== 'RECALL' && !isActive ? 'opacity-50' : 'opacity-100'}
                `}
              />
            );
          })}
        </div>

        {/* Overlays */}
        {gameState === 'START' && (
          <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-sm flex flex-col items-center justify-center p-8 text-center space-y-6">
            <div className="w-20 h-20 bg-purple-600 rounded-3xl flex items-center justify-center shadow-2xl shadow-purple-500/20">
              <Brain className="w-10 h-10 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-bold mb-2">Spatial Span Test</h2>
              <p className="text-slate-400 max-w-xs mx-auto">Blocks will light up in a specific order. Tap them back in that exact sequence.</p>
            </div>
            <button 
              onClick={startTest}
              className="px-10 py-4 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-2xl transition-all shadow-xl shadow-purple-600/20 active:scale-95"
            >
              Start Session
            </button>
          </div>
        )}

        {gameState === 'GAME_OVER' && (
          <div className="absolute inset-0 bg-slate-950/95 backdrop-blur-md flex flex-col items-center justify-center p-8 text-center space-y-6">
            <Trophy className="w-16 h-16 text-yellow-500 mb-2" />
            <div>
              <h2 className="text-3xl font-black text-white">Test Complete</h2>
              <p className="text-slate-400 uppercase tracking-widest text-xs font-bold mt-2">Max Spatial Span</p>
              <div className="text-6xl font-black text-white mt-2">{level - 1}</div>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 w-full max-w-xs">
              <button 
                onClick={startTest}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-all"
              >
                <RotateCcw className="w-4 h-4" /> Try Again
              </button>
              <button 
                onClick={onCancel}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl transition-all"
              >
                <LayoutDashboard className="w-4 h-4" /> Exit
              </button>
            </div>
          </div>
        )}

        {gameState === 'SEQUENCE' && (
          <div className="absolute bottom-12 left-1/2 -translate-x-1/2 px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full animate-pulse">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-400">Watching...</span>
          </div>
        )}
        
        {gameState === 'RECALL' && (
          <div className="absolute bottom-12 left-1/2 -translate-x-1/2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-400">Your Turn: {userInput.length} / {sequence.length}</span>
          </div>
        )}
      </div>

      <div className="text-center text-slate-500 text-xs font-medium max-w-sm">
        Difficulty increases as you pass each level. Your max span is a key metric for visuospatial working memory capacity.
      </div>
    </div>
  );
};

export default SpatialSpanTest;
