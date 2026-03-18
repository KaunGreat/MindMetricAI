
import React, { useState, useEffect, useCallback } from 'react';
import { Boxes, RotateCcw, Trophy, Play, ChevronLeft, LayoutDashboard, Star, Moon, Sun, Heart, Cloud, Zap } from 'lucide-react';

interface PALTestProps {
  onComplete: (score: number, metadata?: Record<string, unknown>) => void;
  onCancel: () => void;
}

const ICONS = [
  <Star className="w-6 h-6" />,
  <Moon className="w-6 h-6" />,
  <Sun className="w-6 h-6" />,
  <Heart className="w-6 h-6" />,
  <Cloud className="w-6 h-6" />,
  <Zap className="w-6 h-6" />
];

type GameState = 'START' | 'ENCODING' | 'RETRIEVAL' | 'GAME_OVER';

const PALTest: React.FC<PALTestProps> = ({ onComplete, onCancel }) => {
  const [gameState, setGameState] = useState<GameState>('START');
  const [level, setLevel] = useState(2); // Number of items to remember
  const [associations, setAssociations] = useState<{ boxIdx: number; iconIdx: number }[]>([]);
  const [encodingIdx, setEncodingIdx] = useState(-1);
  const [retrievalIdx, setRetrievalIdx] = useState(0);
  const [shakingBox, setShakingBox] = useState<number | null>(null);

  const startLevel = useCallback((lvl: number) => {
    const boxIndices = Array.from({ length: 8 }, (_, i) => i).sort(() => Math.random() - 0.5);
    const iconIndices = Array.from({ length: ICONS.length }, (_, i) => i).sort(() => Math.random() - 0.5);
    
    const newAssoc = boxIndices.slice(0, lvl).map((boxIdx, i) => ({
      boxIdx,
      iconIdx: iconIndices[i % ICONS.length]
    }));

    setAssociations(newAssoc);
    setGameState('ENCODING');
    setEncodingIdx(0);
  }, []);

  useEffect(() => {
    if (gameState === 'ENCODING' && encodingIdx !== -1) {
      if (encodingIdx < associations.length) {
        const timer = setTimeout(() => {
          setEncodingIdx(prev => prev + 1);
        }, 1200);
        return () => clearTimeout(timer);
      } else {
        setGameState('RETRIEVAL');
        setRetrievalIdx(0);
      }
    }
  }, [gameState, encodingIdx, associations.length]);

  const handleBoxClick = (idx: number) => {
    if (gameState !== 'RETRIEVAL') return;

    const currentTarget = associations[retrievalIdx];
    if (idx === currentTarget.boxIdx) {
      if (retrievalIdx + 1 < associations.length) {
        setRetrievalIdx(prev => prev + 1);
      } else {
        // Level Complete
        const nextLevel = level + 1;
        if (nextLevel > 6) {
          setGameState('GAME_OVER');
          onComplete(6);
        } else {
          setLevel(nextLevel);
          startLevel(nextLevel);
        }
      }
    } else {
      setShakingBox(idx);
      setTimeout(() => setShakingBox(null), 500);
      setGameState('GAME_OVER');
      onComplete(level - 1);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[600px] w-full max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex w-full justify-between items-center px-4">
        <button onClick={onCancel} className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
          <ChevronLeft className="w-4 h-4" /> Back to Dashboard
        </button>
        <div className="flex items-center gap-2">
          <div className="px-3 py-1 bg-blue-500/10 border border-blue-500/30 rounded-full">
            <span className="text-xs font-black uppercase tracking-widest text-blue-400">Memory Load: {level}</span>
          </div>
        </div>
      </div>

      <div className="relative w-full aspect-square max-w-[500px] bg-slate-900/50 rounded-[3rem] border border-slate-800 shadow-2xl p-12 flex flex-col items-center justify-center overflow-hidden">
        
        {/* The 8 Boxes in a Circle */}
        <div className="relative w-full h-full">
          {Array.from({ length: 8 }).map((_, i) => {
            const angle = (i * 45) * (Math.PI / 180);
            const radius = 160; // radius of the circle
            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius;
            
            const isEncoding = gameState === 'ENCODING' && encodingIdx < associations.length && associations[encodingIdx].boxIdx === i;
            const isTargeted = gameState === 'RETRIEVAL';
            const isShaking = shakingBox === i;

            return (
              <button
                key={i}
                disabled={!isTargeted}
                onClick={() => handleBoxClick(i)}
                style={{
                  transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`
                }}
                className={`
                  absolute left-1/2 top-1/2 w-20 h-20 rounded-2xl transition-all duration-300 flex items-center justify-center border-2
                  ${isEncoding ? 'bg-blue-600 border-white scale-110 shadow-lg shadow-blue-500/40' : 
                    isShaking ? 'bg-red-500 border-red-400 animate-shake' :
                    'bg-slate-800 border-slate-700 hover:bg-slate-700 hover:border-slate-600'}
                  ${!isTargeted && !isEncoding ? 'opacity-50' : 'opacity-100'}
                `}
              >
                {isEncoding && ICONS[associations[encodingIdx].iconIdx]}
              </button>
            );
          })}
          
          {gameState === 'RETRIEVAL' && retrievalIdx < associations.length && (
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center animate-in zoom-in duration-300">
               <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-2">Find Location For:</p>
               <div className="w-20 h-20 bg-blue-600/20 border-2 border-blue-500/50 rounded-2xl flex items-center justify-center text-blue-400 scale-125">
                 {ICONS[associations[retrievalIdx].iconIdx]}
               </div>
            </div>
          )}
        </div>

        {/* Start Overlay */}
        {gameState === 'START' && (
          <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-sm flex flex-col items-center justify-center p-8 text-center space-y-6">
            <Boxes className="w-16 h-16 text-blue-500" />
            <div>
              <h2 className="text-3xl font-bold mb-2">Visual Learning (PAL)</h2>
              <p className="text-slate-400 max-w-xs mx-auto text-sm leading-relaxed">
                Patterns will briefly appear in various boxes. Memorize which pattern belongs to which location.
              </p>
            </div>
            <button 
              onClick={() => startLevel(level)}
              className="px-10 py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-2xl shadow-xl shadow-blue-600/20"
            >
              Start Encoding
            </button>
          </div>
        )}

        {/* Game Over Overlay */}
        {gameState === 'GAME_OVER' && (
          <div className="absolute inset-0 bg-slate-950/95 backdrop-blur-md flex flex-col items-center justify-center p-8 text-center space-y-6">
            <Trophy className="w-16 h-16 text-yellow-500 mb-2" />
            <div>
              <h2 className="text-3xl font-black text-white">Learning Complete</h2>
              <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-2">Maximum Load Achieved</div>
              <div className="text-6xl font-black text-white mt-2">{level - 1}</div>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 w-full max-w-xs">
              <button 
                onClick={() => { setLevel(2); startLevel(2); }}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl"
              >
                <RotateCcw className="w-4 h-4" /> Retry
              </button>
              <button 
                onClick={onCancel}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl"
              >
                <LayoutDashboard className="w-4 h-4" /> Exit
              </button>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translate(calc(-50% + ${Math.cos(0)*160}px), calc(-50% + ${Math.sin(0)*160}px)); }
          25% { transform: translate(calc(-50% + ${Math.cos(0)*160}px + 5px), calc(-50% + ${Math.sin(0)*160}px)); }
          75% { transform: translate(calc(-50% + ${Math.cos(0)*160}px - 5px), calc(-50% + ${Math.sin(0)*160}px)); }
        }
        .animate-shake {
          animation: shake 0.1s ease-in-out infinite;
        }
      `}</style>

      <div className="text-center text-slate-500 text-xs font-medium max-w-sm">
        Paired Associates Learning (PAL) is highly sensitive to hippocampal function and early signs of neurodegeneration.
      </div>
    </div>
  );
};

export default PALTest;
