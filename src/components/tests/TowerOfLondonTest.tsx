
import React, { useState, useEffect, useCallback } from 'react';
import { GitMerge, RotateCcw, Trophy, ChevronLeft, LayoutDashboard } from 'lucide-react';

interface TowerOfLondonTestProps {
  onComplete: (score: number, metadata?: Record<string, unknown>) => void;
  onCancel: () => void;
}

type BallColor = 'red' | 'green' | 'blue';
type Peg = BallColor[];

const TowerOfLondonTest: React.FC<TowerOfLondonTestProps> = ({ onComplete, onCancel }) => {
  const [gameState, setGameState] = useState<'START' | 'PLAYING' | 'RESULT'>('START');
  const [board, setBoard] = useState<Peg[]>([['red'], ['green'], ['blue']]);
  const [goal, setGoal] = useState<Peg[]>([['blue', 'green', 'red'], [], []]);
  const [selectedBall, setSelectedBall] = useState<{ pegIdx: number, color: BallColor } | null>(null);
  const [moves, setMoves] = useState(0);

  const startTest = () => {
    // Basic setup for 1-level challenge
    setBoard([['red'], ['green'], ['blue']]);
    setGoal([['blue', 'green', 'red'], [], []]);
    setMoves(0);
    setGameState('PLAYING');
  };

  const handlePegClick = (pegIdx: number) => {
    if (gameState !== 'PLAYING') return;

    if (!selectedBall) {
      // Pick up top ball from peg
      const peg = board[pegIdx];
      if (peg.length === 0) return;

      const newPeg = [...peg];
      const color = newPeg.pop() as BallColor;
      const newBoard = [...board];
      newBoard[pegIdx] = newPeg;
      
      setSelectedBall({ pegIdx, color });
      setBoard(newBoard);
    } else {
      // Drop ball on peg
      const peg = board[pegIdx];
      if (peg.length >= 3) return; // Full peg

      const newPeg = [...peg, selectedBall.color];
      const newBoard = [...board];
      newBoard[pegIdx] = newPeg;

      setBoard(newBoard);
      setSelectedBall(null);
      setMoves(prev => prev + 1);

      // Check win condition
      if (checkWin(newBoard, goal)) {
        setTimeout(() => setGameState('RESULT'), 500);
      }
    }
  };

  const checkWin = (b: Peg[], g: Peg[]) => {
    return JSON.stringify(b) === JSON.stringify(g);
  };

  useEffect(() => {
    if (gameState === 'RESULT') {
      onComplete(100 - (moves * 5), { moves });
    }
  }, [gameState, moves, onComplete]);

  const renderPeg = (peg: Peg, idx: number, isInteractive: boolean) => (
    <div 
      key={idx}
      onClick={() => isInteractive && handlePegClick(idx)}
      className={`relative w-16 h-48 bg-slate-800 rounded-t-full flex flex-col-reverse items-center pb-2 cursor-pointer transition-colors ${
        selectedBall && isInteractive ? 'hover:bg-slate-700 ring-2 ring-blue-500/20' : ''
      }`}
    >
      <div className="absolute inset-x-0 bottom-0 h-2 bg-slate-700 rounded-full" />
      {peg.map((color, i) => (
        <div 
          key={i} 
          className={`w-12 h-12 rounded-full mb-1 border-2 border-white/10 shadow-lg ${
            color === 'red' ? 'bg-red-500' : color === 'green' ? 'bg-emerald-500' : 'bg-blue-500'
          }`}
        />
      ))}
    </div>
  );

  return (
    <div className="flex flex-col items-center justify-center min-h-[600px] w-full max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex w-full justify-between items-center px-4">
        <button onClick={onCancel} className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
          <ChevronLeft className="w-4 h-4" /> Back
        </button>
        <div className="text-xs font-black uppercase tracking-widest text-slate-500">Moves: {moves}</div>
      </div>

      <div className="relative w-full bg-slate-900/50 rounded-[3rem] border border-slate-800 shadow-2xl p-12 overflow-hidden">
        {gameState === 'START' && (
          <div className="text-center space-y-6">
            <GitMerge className="w-16 h-16 text-indigo-400 mx-auto" />
            <h2 className="text-3xl font-bold">Tower of London</h2>
            <p className="text-slate-400">Move the balls from your board to match the goal state in the minimum number of moves.</p>
            <button onClick={startTest} className="px-10 py-4 bg-indigo-600 text-white font-bold rounded-2xl">Begin Planning</button>
          </div>
        )}

        {gameState === 'PLAYING' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            {/* Goal Board */}
            <div className="space-y-4">
              <h3 className="text-center text-xs font-black text-slate-500 uppercase">Target State</h3>
              <div className="flex justify-center gap-8 opacity-60 pointer-events-none scale-75">
                {goal.map((p, i) => renderPeg(p, i, false))}
              </div>
            </div>

            {/* User Board */}
            <div className="space-y-4 relative">
              <h3 className="text-center text-xs font-black text-white uppercase">Your Board</h3>
              <div className="flex justify-center gap-8">
                {board.map((p, i) => renderPeg(p, i, true))}
              </div>
              {selectedBall && (
                <div className="absolute -top-12 left-1/2 -translate-x-1/2 flex items-center gap-2 animate-bounce">
                  <div className={`w-8 h-8 rounded-full border-2 border-white/50 ${
                    selectedBall.color === 'red' ? 'bg-red-500' : selectedBall.color === 'green' ? 'bg-emerald-500' : 'bg-blue-500'
                  }`} />
                  <span className="text-[10px] font-black uppercase text-blue-400">Placing...</span>
                </div>
              )}
            </div>
          </div>
        )}

        {gameState === 'RESULT' && (
          <div className="text-center space-y-6">
            <Trophy className="w-16 h-16 text-yellow-500 mx-auto" />
            <h2 className="text-3xl font-black">Plan Executed</h2>
            <div className="text-6xl font-black text-white">{moves} <span className="text-2xl text-slate-500">moves</span></div>
            <button onClick={startTest} className="px-8 py-3 bg-indigo-600 text-white font-bold rounded-xl">Try Another</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TowerOfLondonTest;
