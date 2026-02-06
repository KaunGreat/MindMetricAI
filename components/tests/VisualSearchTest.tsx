
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Search, RotateCcw, Trophy, Play, ChevronLeft, LayoutDashboard, Target, Zap, Circle, Square, Triangle } from 'lucide-react';

interface VisualSearchTestProps {
  onComplete: (score: number, metadata?: any) => void;
  onCancel: () => void;
}

const COLORS = ['#ef4444', '#3b82f6', '#10b981', '#eab308', '#ec4899', '#8b5cf6'];
const SHAPES = ['circle', 'square', 'triangle', 'star'];

interface ShapeItem {
  id: string;
  color: string;
  shape: string;
}

const TOTAL_TRIALS = 15;

const VisualSearchTest: React.FC<VisualSearchTestProps> = ({ onComplete, onCancel }) => {
  const [gameState, setGameState] = useState<'START' | 'PLAYING' | 'RESULT'>('START');
  const [target, setTarget] = useState<ShapeItem | null>(null);
  const [grid, setGrid] = useState<ShapeItem[]>([]);
  const [trialCount, setTrialCount] = useState(0);
  const [responseTimes, setResponseTimes] = useState<number[]>([]);
  const [startTime, setStartTime] = useState(0);

  const generateGrid = useCallback(() => {
    const newTarget: ShapeItem = {
      id: 'target',
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      shape: SHAPES[Math.floor(Math.random() * SHAPES.length)]
    };
    
    setTarget(newTarget);
    
    const newGrid: ShapeItem[] = [newTarget];
    for (let i = 0; i < 35; i++) {
      let color = COLORS[Math.floor(Math.random() * COLORS.length)];
      let shape = SHAPES[Math.floor(Math.random() * SHAPES.length)];
      
      // Ensure distractor is not exactly the target
      if (color === newTarget.color && shape === newTarget.shape) {
        color = COLORS[(COLORS.indexOf(color) + 1) % COLORS.length];
      }
      
      newGrid.push({ id: `distractor-${i}`, color, shape });
    }
    
    setGrid(newGrid.sort(() => Math.random() - 0.5));
    setStartTime(performance.now());
  }, []);

  const handleChoice = (item: ShapeItem) => {
    if (gameState !== 'PLAYING') return;

    if (item.id === 'target') {
      const endTime = performance.now();
      const rt = Math.round(endTime - startTime);
      setResponseTimes(prev => [...prev, rt]);
      
      if (trialCount + 1 >= TOTAL_TRIALS) {
        setGameState('RESULT');
      } else {
        setTrialCount(prev => prev + 1);
        generateGrid();
      }
    } else {
      // Small penalty if wrong
      setStartTime(prev => prev - 500);
    }
  };

  const startTest = () => {
    setTrialCount(0);
    setResponseTimes([]);
    setGameState('PLAYING');
    generateGrid();
  };

  useEffect(() => {
    if (gameState === 'RESULT') {
      const avg = Math.round(responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length);
      onComplete(avg, { responseTimes });
    }
  }, [gameState, responseTimes, onComplete]);

  const renderShape = (shape: string, color: string) => {
    const props = { style: { color }, className: "w-8 h-8 filter drop-shadow-sm" };
    switch (shape) {
      case 'circle': return <Circle {...props} />;
      case 'square': return <Square {...props} />;
      case 'triangle': return <Triangle {...props} />;
      case 'star': return (
        <svg {...props} viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
        </svg>
      );
      default: return null;
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[600px] w-full max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex w-full justify-between items-center px-4">
        <button onClick={onCancel} className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
          <ChevronLeft className="w-4 h-4" /> Back
        </button>
        <div className="flex items-center gap-4">
          <div className="h-2 w-48 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
            <div 
              className="h-full bg-cyan-500 transition-all duration-300" 
              style={{ width: `${(trialCount / TOTAL_TRIALS) * 100}%` }}
            />
          </div>
          <span className="text-xs font-black text-slate-500">{trialCount}/{TOTAL_TRIALS}</span>
        </div>
      </div>

      <div className="relative w-full aspect-video bg-slate-900/50 rounded-[3rem] border border-slate-800 shadow-2xl p-8 flex flex-col items-center justify-between overflow-hidden">
        
        {gameState === 'START' && (
          <div className="flex-1 flex flex-col items-center justify-center text-center space-y-6 max-w-md animate-in zoom-in duration-300">
            <div className="w-20 h-20 bg-cyan-600 rounded-3xl flex items-center justify-center mx-auto shadow-2xl shadow-cyan-500/20">
              <Search className="w-10 h-10 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-bold mb-2">Visual Search</h2>
              <p className="text-slate-400 text-sm">Find and click the specific <strong>Target Item</strong> shown at the top as quickly as possible.</p>
            </div>
            <button 
              onClick={startTest}
              className="px-10 py-4 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-2xl shadow-xl shadow-cyan-600/20 active:scale-95"
            >
              Start Search
            </button>
          </div>
        )}

        {gameState === 'PLAYING' && target && (
          <>
            <div className="w-full flex flex-col items-center space-y-4">
               <div className="px-4 py-2 bg-slate-950 border border-slate-800 rounded-2xl flex items-center gap-4 animate-in slide-in-from-top-4">
                 <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Target:</span>
                 {renderShape(target.shape, target.color)}
               </div>
            </div>

            <div className="grid grid-cols-6 sm:grid-cols-9 gap-4 w-full h-full p-4 overflow-hidden place-items-center">
               {grid.map((item, idx) => (
                 <button
                    key={item.id}
                    onClick={() => handleChoice(item)}
                    className="hover:scale-125 active:scale-90 transition-transform"
                 >
                   {renderShape(item.shape, item.color)}
                 </button>
               ))}
            </div>
          </>
        )}

        {gameState === 'RESULT' && (
          <div className="inset-0 bg-slate-950/90 backdrop-blur-md flex flex-col items-center justify-center p-8 text-center space-y-8 animate-in fade-in duration-500">
            <Trophy className="w-16 h-16 text-cyan-400" />
            <div>
              <h2 className="text-3xl font-black text-white">Search Complete</h2>
              <p className="text-slate-400 text-sm mt-1">Selective Attention Analysis</p>
            </div>

            <div className="p-10 bg-slate-900 border border-cyan-500/30 rounded-[2.5rem] shadow-2xl relative overflow-hidden group">
               <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 blur-[50px] rounded-full" />
               <p className="text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Mean Search Speed</p>
               <div className="text-6xl font-black text-white italic">{Math.round(responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length)} <span className="text-2xl text-slate-500">ms</span></div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
              <button 
                onClick={startTest}
                className="flex-1 flex items-center justify-center gap-2 px-8 py-4 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-2xl shadow-xl shadow-cyan-600/20"
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

      <div className="flex items-center gap-3 p-4 bg-cyan-500/10 border border-cyan-500/20 rounded-2xl max-w-lg">
        <Target className="w-5 h-5 text-cyan-400 shrink-0" />
        <p className="text-xs text-cyan-300 leading-relaxed">
          Visual search performance correlates with <strong>Selective Attention</strong> and visual processing speed in the occipital and parietal lobes.
        </p>
      </div>
    </div>
  );
};

export default VisualSearchTest;
