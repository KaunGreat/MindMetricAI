
import React, { useState, useEffect } from 'react';
import { Landmark, RotateCcw, Trophy, ChevronLeft, ArrowRight, DollarSign } from 'lucide-react';

interface GamblingTaskTestProps {
  onComplete: (score: number, metadata?: any) => void;
  onCancel: () => void;
}

const TOTAL_TRIALS = 40;

const GamblingTaskTest: React.FC<GamblingTaskTestProps> = ({ onComplete, onCancel }) => {
  const [gameState, setGameState] = useState<'START' | 'PLAYING' | 'RESULT'>('START');
  const [cash, setCash] = useState(2000);
  const [trials, setTrials] = useState(0);
  const [lastFeedback, setLastFeedback] = useState<{ gain: number, loss: number } | null>(null);
  const [choiceHistory, setChoiceHistory] = useState<string[]>([]);

  const handleDeckClick = (deck: 'A' | 'B' | 'C' | 'D') => {
    if (gameState !== 'PLAYING') return;

    let gain = 0;
    let loss = 0;

    // Bad Decks (A, B) - High Reward, High Variable Loss
    if (deck === 'A' || deck === 'B') {
      gain = 100;
      loss = Math.random() < 0.2 ? 300 : 0; // High risk
    } else {
      // Good Decks (C, D) - Low Reward, Low Loss
      gain = 50;
      loss = Math.random() < 0.1 ? 50 : 0; // Low risk
    }

    const net = gain - loss;
    setCash(prev => prev + net);
    setTrials(prev => prev + 1);
    setLastFeedback({ gain, loss });
    setChoiceHistory(prev => [...prev, deck]);

    if (trials + 1 >= TOTAL_TRIALS) {
      setTimeout(() => setGameState('RESULT'), 1000);
    }
  };

  useEffect(() => {
    if (gameState === 'RESULT') {
      const goodChoices = choiceHistory.filter(d => d === 'C' || d === 'D').length;
      onComplete(cash, { goodChoiceRatio: goodChoices / TOTAL_TRIALS });
    }
  }, [gameState, cash, choiceHistory, onComplete]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[600px] w-full max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex w-full justify-between items-center px-4">
        <button onClick={onCancel} className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
          <ChevronLeft className="w-4 h-4" /> Back
        </button>
        <div className="flex items-center gap-6">
          <div className="text-xs font-black uppercase text-slate-500">Cash: <span className="text-emerald-400">${cash}</span></div>
          <div className="text-xs font-black uppercase text-slate-500">Round: {trials}/{TOTAL_TRIALS}</div>
        </div>
      </div>

      <div className="relative w-full bg-slate-900/50 rounded-[3rem] border border-slate-800 shadow-2xl p-12 overflow-hidden flex flex-col items-center justify-center min-h-[400px]">
        {gameState === 'START' && (
          <div className="text-center space-y-6 max-w-md">
            <Landmark className="w-16 h-16 text-red-500 mx-auto" />
            <h2 className="text-3xl font-bold">Gambling Task</h2>
            <p className="text-slate-400">Choose from four decks. Some are risky, some are safe. Find the pattern to maximize your bankroll over 40 rounds.</p>
            <button onClick={() => setGameState('PLAYING')} className="px-10 py-4 bg-red-600 text-white font-bold rounded-2xl">Enter Casino</button>
          </div>
        )}

        {gameState === 'PLAYING' && (
          <div className="w-full space-y-12">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 place-items-center">
              {['A', 'B', 'C', 'D'].map((deck) => (
                <button
                  key={deck}
                  onClick={() => handleDeckClick(deck as any)}
                  className="w-32 h-44 bg-slate-800 border-2 border-slate-700 rounded-xl hover:bg-slate-700 hover:border-white/20 transition-all flex flex-col items-center justify-center group active:scale-95"
                >
                  <div className="text-3xl font-black text-slate-600 group-hover:text-white transition-colors">DECK</div>
                  <div className="text-5xl font-black text-slate-500 group-hover:text-blue-400">{deck}</div>
                </button>
              ))}
            </div>

            <div className="h-16 flex items-center justify-center">
              {lastFeedback && (
                <div className="flex items-center gap-8 animate-in slide-in-from-bottom-2">
                  <div className="text-emerald-400 font-black">+ ${lastFeedback.gain}</div>
                  {lastFeedback.loss > 0 && <div className="text-red-500 font-black">- ${lastFeedback.loss}</div>}
                </div>
              )}
            </div>
          </div>
        )}

        {gameState === 'RESULT' && (
          <div className="text-center space-y-8">
            <Trophy className="w-16 h-16 text-yellow-500 mx-auto" />
            <h2 className="text-3xl font-black">Session Over</h2>
            <div className="text-7xl font-black text-white italic">${cash}</div>
            <p className="text-slate-500 text-sm font-bold uppercase tracking-widest">Ending Capital</p>
            <button onClick={() => { setCash(2000); setTrials(0); setGameState('PLAYING'); }} className="px-8 py-3 bg-red-600 text-white font-bold rounded-xl">Try Again</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default GamblingTaskTest;
