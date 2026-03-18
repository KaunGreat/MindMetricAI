
import React, { useState, useEffect, useCallback } from 'react';
import { Smile, RotateCcw, Trophy, ChevronLeft, Eye } from 'lucide-react';

interface EmotionRecognitionTestProps {
  onComplete: (score: number, metadata?: Record<string, unknown>) => void;
  onCancel: () => void;
}

const EMOTIONS = [
  { label: 'Happy', emoji: '😊' },
  { label: 'Sad', emoji: '😢' },
  { label: 'Angry', emoji: '😠' },
  { label: 'Fear', emoji: '😱' },
  { label: 'Surprise', emoji: '😲' },
  { label: 'Disgust', emoji: '🤢' }
];

const TOTAL_TRIALS = 12;

const EmotionRecognitionTest: React.FC<EmotionRecognitionTestProps> = ({ onComplete, onCancel }) => {
  const [gameState, setGameState] = useState<'START' | 'FLASH' | 'CHOICE' | 'RESULT'>('START');
  const [trials, setTrials] = useState(0);
  const [targetEmotion, setTargetEmotion] = useState(EMOTIONS[0]);
  const [correctCount, setCorrectCount] = useState(0);
  const [startTime, setStartTime] = useState(0);
  const [latencies, setLatencies] = useState<number[]>([]);

  const startTrial = useCallback(() => {
    const next = EMOTIONS[Math.floor(Math.random() * EMOTIONS.length)];
    setTargetEmotion(next);
    setGameState('FLASH');
    
    setTimeout(() => {
      setGameState('CHOICE');
      setStartTime(performance.now());
    }, 500);
  }, []);

  const handleChoice = (label: string) => {
    if (gameState !== 'CHOICE') return;
    const rt = performance.now() - startTime;
    setLatencies(prev => [...prev, rt]);

    if (label === targetEmotion.label) {
      setCorrectCount(prev => prev + 1);
    }

    if (trials + 1 >= TOTAL_TRIALS) {
      setGameState('RESULT');
    } else {
      setTrials(prev => prev + 1);
      startTrial();
    }
  };

  useEffect(() => {
    if (gameState === 'RESULT') {
      const avgRt = latencies.length > 0 ? latencies.reduce((a, b) => a + b, 0) / latencies.length : 0;
      onComplete(Math.round((correctCount / TOTAL_TRIALS) * 100), { avgRt });
    }
  }, [gameState, correctCount, latencies, onComplete]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[600px] w-full max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex w-full justify-between items-center px-4">
        <button onClick={onCancel} className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
          <ChevronLeft className="w-4 h-4" /> Back
        </button>
        <div className="text-xs font-black uppercase tracking-widest text-slate-500">Progress: {trials}/{TOTAL_TRIALS}</div>
      </div>

      <div className="relative w-full aspect-video bg-slate-900/50 rounded-[3rem] border border-slate-800 shadow-2xl p-12 flex flex-col items-center justify-center overflow-hidden">
        {gameState === 'START' && (
          <div className="text-center space-y-6 max-w-md">
            <Smile className="w-16 h-16 text-pink-500 mx-auto" />
            <h2 className="text-3xl font-bold">Emotion Recognition</h2>
            <p className="text-slate-400">An emotion will flash briefly. Identify which one it was as quickly as possible.</p>
            <button onClick={() => { setTrials(0); startTrial(); }} className="px-10 py-4 bg-pink-600 text-white font-bold rounded-2xl">Start Scanning</button>
          </div>
        )}

        {gameState === 'FLASH' && (
          <div className="text-[12rem] animate-in zoom-in duration-200">{targetEmotion.emoji}</div>
        )}

        {gameState === 'CHOICE' && (
          <div className="w-full space-y-8 animate-in fade-in duration-300">
             <div className="text-center space-y-2">
                <Eye className="w-8 h-8 text-blue-400 mx-auto animate-pulse" />
                <h3 className="text-xl font-black text-white uppercase tracking-widest">Identify Emotion</h3>
             </div>
             <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {EMOTIONS.map((e) => (
                  <button
                    key={e.label}
                    onClick={() => handleChoice(e.label)}
                    className="py-6 bg-slate-800 border border-slate-700 rounded-2xl text-lg font-bold text-white hover:bg-slate-700 hover:border-pink-500/50 transition-all active:scale-95"
                  >
                    {e.label}
                  </button>
                ))}
             </div>
          </div>
        )}

        {gameState === 'RESULT' && (
          <div className="text-center space-y-8">
            <Trophy className="w-16 h-16 text-yellow-500 mx-auto" />
            <h2 className="text-3xl font-black">Session Over</h2>
            <div className="text-7xl font-black text-white italic">{Math.round((correctCount / TOTAL_TRIALS) * 100)}%</div>
            <p className="text-slate-500 text-sm font-bold uppercase tracking-widest">Facial Intelligence Quotient</p>
            <button onClick={() => { setTrials(0); startTrial(); }} className="px-8 py-3 bg-pink-600 text-white font-bold rounded-xl">Try Again</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmotionRecognitionTest;
