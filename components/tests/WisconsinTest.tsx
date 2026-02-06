
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Layers, RotateCcw, Trophy, CheckCircle2, XCircle, ChevronLeft, LayoutDashboard, Info } from 'lucide-react';

interface WisconsinTestProps {
  onComplete: (score: number, metadata?: any) => void;
  onCancel: () => void;
}

type Attribute = 'color' | 'shape' | 'number';
type Color = 'red' | 'green' | 'blue' | 'yellow';
type Shape = 'star' | 'triangle' | 'square' | 'circle';
type NumberVal = 1 | 2 | 3 | 4;

interface Card {
  color: Color;
  shape: Shape;
  number: NumberVal;
}

const COLORS: Color[] = ['red', 'green', 'blue', 'yellow'];
const SHAPES: Shape[] = ['star', 'triangle', 'square', 'circle'];
const NUMBERS: NumberVal[] = [1, 2, 3, 4];
const RULES: Attribute[] = ['color', 'shape', 'number'];

const KEY_CARDS: Card[] = [
  { number: 1, color: 'red', shape: 'star' },
  { number: 2, color: 'green', shape: 'triangle' },
  { number: 3, color: 'yellow', shape: 'square' },
  { number: 4, color: 'blue', shape: 'circle' },
];

const WisconsinTest: React.FC<WisconsinTestProps> = ({ onComplete, onCancel }) => {
  const [gameState, setGameState] = useState<'START' | 'PLAYING' | 'RESULT'>('START');
  const [stimulusCard, setStimulusCard] = useState<Card>(generateRandomCard());
  const [currentRuleIndex, setCurrentRuleIndex] = useState(0);
  const [consecutiveCorrect, setConsecutiveCorrect] = useState(0);
  const [categoriesAchieved, setCategoriesAchieved] = useState(0);
  const [totalTrials, setTotalTrials] = useState(0);
  const [totalCorrect, setTotalCorrect] = useState(0);
  const [perseverativeErrors, setPerseverativeErrors] = useState(0);
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [previousRuleIndex, setPreviousRuleIndex] = useState<number | null>(null);

  const MAX_TRIALS = 60;
  const CORRECT_FOR_SHIFT = 10;

  function generateRandomCard(): Card {
    return {
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      shape: SHAPES[Math.floor(Math.random() * SHAPES.length)],
      number: NUMBERS[Math.floor(Math.random() * NUMBERS.length)],
    };
  }

  const currentRule = RULES[currentRuleIndex];

  const handleSort = (keyCardIndex: number) => {
    if (gameState !== 'PLAYING' || feedback !== null) return;

    const keyCard = KEY_CARDS[keyCardIndex];
    let isCorrect = false;

    if (currentRule === 'color') isCorrect = stimulusCard.color === keyCard.color;
    else if (currentRule === 'shape') isCorrect = stimulusCard.shape === keyCard.shape;
    else if (currentRule === 'number') isCorrect = stimulusCard.number === keyCard.number;

    // Check for Perseverative Error
    // Occurs when user gets it wrong, but would have been right under the PREVIOUS rule
    let isPerseverative = false;
    if (!isCorrect && previousRuleIndex !== null) {
      const prevRule = RULES[previousRuleIndex];
      if (prevRule === 'color') isPerseverative = stimulusCard.color === keyCard.color;
      else if (prevRule === 'shape') isPerseverative = stimulusCard.shape === keyCard.shape;
      else if (prevRule === 'number') isPerseverative = stimulusCard.number === keyCard.number;
    }

    setFeedback(isCorrect ? 'correct' : 'incorrect');
    setTotalTrials(prev => prev + 1);

    if (isCorrect) {
      setTotalCorrect(prev => prev + 1);
      const nextConsecutive = consecutiveCorrect + 1;
      setConsecutiveCorrect(nextConsecutive);

      if (nextConsecutive >= CORRECT_FOR_SHIFT) {
        setPreviousRuleIndex(currentRuleIndex);
        setCurrentRuleIndex(prev => (prev + 1) % RULES.length);
        setConsecutiveCorrect(0);
        setCategoriesAchieved(prev => prev + 1);
      }
    } else {
      setConsecutiveCorrect(0);
      if (isPerseverative) {
        setPerseverativeErrors(prev => prev + 1);
      }
    }

    setTimeout(() => {
      if (totalTrials + 1 >= MAX_TRIALS) {
        setGameState('RESULT');
      } else {
        setStimulusCard(generateRandomCard());
        setFeedback(null);
      }
    }, 600);
  };

  useEffect(() => {
    if (gameState === 'RESULT') {
      const pErrorRate = Math.round((perseverativeErrors / totalTrials) * 100) || 0;
      // Score calculation: Weight categories heavily, then accuracy, penalize perseveration
      const finalScore = (categoriesAchieved * 100) + Math.round((totalCorrect / totalTrials) * 100) - pErrorRate;
      onComplete(Math.max(0, finalScore), {
        categories: categoriesAchieved,
        perseverativeErrors,
        accuracy: Math.round((totalCorrect / totalTrials) * 100),
        pErrorRate
      });
    }
  }, [gameState, categoriesAchieved, totalCorrect, totalTrials, perseverativeErrors, onComplete]);

  const startTest = () => {
    setTotalTrials(0);
    setTotalCorrect(0);
    setConsecutiveCorrect(0);
    setCategoriesAchieved(0);
    setPerseverativeErrors(0);
    setCurrentRuleIndex(0);
    setPreviousRuleIndex(null);
    setStimulusCard(generateRandomCard());
    setGameState('PLAYING');
    setFeedback(null);
  };

  const renderCard = (card: Card, isStimulus = false) => {
    const symbols = Array(card.number).fill(null);
    return (
      <div className={`
        relative rounded-xl border-2 flex items-center justify-center p-2 bg-white transition-all
        ${isStimulus ? 'w-32 h-44 shadow-2xl border-slate-300' : 'w-24 h-32 border-slate-200 group-hover:border-blue-500 group-hover:scale-105'}
      `}>
        <div className={`grid gap-2 items-center justify-center ${card.number > 2 ? 'grid-cols-2' : 'grid-cols-1'}`}>
          {symbols.map((_, i) => (
            <div key={i} className="flex items-center justify-center">
              {renderShape(card.shape, card.color)}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderShape = (shape: Shape, color: Color) => {
    const colorMap: Record<Color, string> = {
      red: '#ef4444',
      green: '#10b981',
      blue: '#3b82f6',
      yellow: '#eab308'
    };
    const fill = colorMap[color];
    const size = 20;

    switch (shape) {
      case 'star':
        return <svg width={size} height={size} viewBox="0 0 24 24" fill={fill}><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>;
      case 'triangle':
        return <svg width={size} height={size} viewBox="0 0 24 24" fill={fill}><path d="M1 21h22L12 2 1 21z"/></svg>;
      case 'square':
        return <div style={{ width: size, height: size, backgroundColor: fill }} />;
      case 'circle':
        return <div style={{ width: size, height: size, backgroundColor: fill, borderRadius: '50%' }} />;
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
              className="h-full bg-pink-500 transition-all duration-300" 
              style={{ width: `${(totalTrials / MAX_TRIALS) * 100}%` }}
            />
          </div>
          <span className="text-xs font-black text-slate-500">{totalTrials}/{MAX_TRIALS}</span>
        </div>
      </div>

      <div className="relative w-full aspect-video bg-slate-900/50 rounded-[2.5rem] border border-slate-800 shadow-2xl p-8 flex flex-col items-center justify-between overflow-hidden">
        
        {gameState === 'START' && (
          <div className="flex-1 flex flex-col items-center justify-center text-center space-y-6 max-w-md animate-in zoom-in duration-300">
            <div className="w-20 h-20 bg-pink-600 rounded-3xl flex items-center justify-center mx-auto shadow-2xl shadow-pink-500/20">
              <Layers className="w-10 h-10 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-bold mb-2">Cognitive Flexibility</h2>
              <p className="text-slate-400">Match the stimulus card to one of the four key cards. The rule changes periodically. Use feedback to deduce the new rule.</p>
            </div>
            <button 
              onClick={startTest}
              className="px-10 py-4 bg-pink-600 hover:bg-pink-500 text-white font-bold rounded-2xl transition-all shadow-xl shadow-pink-600/20 active:scale-95"
            >
              Start Sorting
            </button>
          </div>
        )}

        {gameState === 'PLAYING' && (
          <>
            {/* Top Stimulus Card */}
            <div className="flex flex-col items-center space-y-4">
              <div className="text-xs font-black text-slate-500 uppercase tracking-widest">Match this card</div>
              <div className="relative">
                {renderCard(stimulusCard, true)}
                {feedback && (
                  <div className={`absolute inset-0 rounded-xl flex items-center justify-center animate-in zoom-in duration-200 z-10 bg-slate-950/40 backdrop-blur-[2px]`}>
                    {feedback === 'correct' ? (
                      <CheckCircle2 className="w-16 h-16 text-emerald-500 shadow-xl" />
                    ) : (
                      <XCircle className="w-16 h-16 text-red-500 shadow-xl" />
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Bottom Key Cards */}
            <div className="grid grid-cols-4 gap-6 w-full max-w-3xl">
              {KEY_CARDS.map((card, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSort(idx)}
                  className="group flex flex-col items-center space-y-2 outline-none"
                >
                  {renderCard(card)}
                  <div className="text-[10px] font-black text-slate-600 uppercase tracking-tighter">Pile {idx + 1}</div>
                </button>
              ))}
            </div>
          </>
        )}

        {gameState === 'RESULT' && (
          <div className="inset-0 bg-slate-950/90 backdrop-blur-md flex flex-col items-center justify-center p-8 text-center space-y-8 animate-in fade-in duration-500">
            <Trophy className="w-16 h-16 text-pink-500" />
            <div>
              <h2 className="text-3xl font-black text-white">Assessment Complete</h2>
              <p className="text-slate-400 text-sm mt-1">Rule Deduction & Adaptability Analysis</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-3xl">
              <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Categories Achieved</p>
                <div className="text-3xl font-black text-pink-400">{categoriesAchieved}</div>
              </div>
              <div className="p-6 bg-slate-900 border border-emerald-500/30 rounded-2xl ring-2 ring-emerald-500/20">
                <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-1">Accuracy Rate</p>
                <div className="text-3xl font-black text-white">{Math.round((totalCorrect / totalTrials) * 100)}%</div>
              </div>
              <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Perseverative Errors</p>
                <div className="text-3xl font-black text-red-400">{perseverativeErrors}</div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
              <button 
                onClick={startTest}
                className="flex-1 flex items-center justify-center gap-2 px-8 py-4 bg-pink-600 hover:bg-pink-500 text-white font-bold rounded-2xl transition-all shadow-xl shadow-pink-600/20"
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

      <div className="flex items-center gap-3 p-4 bg-pink-500/10 border border-pink-500/20 rounded-2xl max-w-lg">
        <Info className="w-5 h-5 text-pink-400 shrink-0" />
        <p className="text-xs text-pink-300 leading-relaxed">
          The <strong>WCST</strong> is a standard clinical measure for detecting frontal lobe dysfunction and executive control. It tests your ability to form abstract concepts and shift sets when rules change unexpectedly.
        </p>
      </div>
    </div>
  );
};

export default WisconsinTest;
