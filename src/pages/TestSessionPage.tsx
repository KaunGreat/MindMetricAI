import React, { useState, useCallback } from 'react';
import { useParams, useNavigate, Navigate } from 'react-router-dom';
import ReactionTest from '../components/tests/ReactionTest.tsx';
import SpatialSpanTest from '../components/SpatialSpanTest.tsx';
import StroopTest from '../components/StroopTest.tsx';
import MemoryTest from '../components/MemoryTest.tsx';
import WisconsinTest from '../components/tests/WisconsinTest.tsx';
import PALTest from '../components/tests/PALTest.tsx';
import NBackTest from '../components/tests/NBackTest.tsx';
import VisualSearchTest from '../components/tests/VisualSearchTest.tsx';
import TowerOfLondonTest from '../components/tests/TowerOfLondonTest.tsx';
import GamblingTaskTest from '../components/tests/GamblingTaskTest.tsx';
import EmotionRecognitionTest from '../components/tests/EmotionRecognitionTest.tsx';
import DigitSpanTest from '../components/tests/DigitSpanTest.tsx';
import GoNoGoTest from '../components/tests/GoNoGoTest.tsx';
import { useUserData } from '../hooks/useUserData.ts';
import { Sparkles } from 'lucide-react';

/** Нормализует score к числу. Строки вида "245ms" → 245. */
const normalizeScore = (score: number | string): number => {
  if (typeof score === 'number') return score;
  const parsed = parseFloat(score);
  return isNaN(parsed) ? 0 : parsed;
};

const TestSessionPage: React.FC = () => {
  const { testId } = useParams<{ testId: string }>();
  const navigate = useNavigate();
  const { saveResult } = useUserData();
  const [isCompleted, setIsCompleted] = useState(false);

  const handleComplete = useCallback((score: number | string, metadata?: Record<string, unknown>) => {
    saveResult({
      type: testId ?? 'unknown',
      score: normalizeScore(score),
      details: metadata,
    });
    setIsCompleted(true);
    setTimeout(() => navigate('/profile'), 1500);
  }, [testId, saveResult, navigate]);

  const handleCancel = useCallback(() => navigate('/dashboard'), [navigate]);

  const renderTest = () => {
    switch (testId) {
      case 'reaction':      return <ReactionTest onComplete={handleComplete} onCancel={handleCancel} />;
      case 'spatial-span':  return <SpatialSpanTest onComplete={handleComplete} onCancel={handleCancel} />;
      case 'memory':        return <MemoryTest onComplete={handleComplete} onCancel={handleCancel} />;
      case 'stroop':        return <StroopTest onComplete={handleComplete} onCancel={handleCancel} />;
      case 'wisconsin':     return <WisconsinTest onComplete={handleComplete} onCancel={handleCancel} />;
      case 'pal':           return <PALTest onComplete={handleComplete} onCancel={handleCancel} />;
      case 'nback':         return <NBackTest onComplete={handleComplete} onCancel={handleCancel} />;
      case 'visual-search': return <VisualSearchTest onComplete={handleComplete} onCancel={handleCancel} />;
      case 'tower':         return <TowerOfLondonTest onComplete={handleComplete} onCancel={handleCancel} />;
      case 'gambling':      return <GamblingTaskTest onComplete={handleComplete} onCancel={handleCancel} />;
      case 'emotion':       return <EmotionRecognitionTest onComplete={handleComplete} onCancel={handleCancel} />;
      case 'digit-span':    return <DigitSpanTest onComplete={handleComplete} onCancel={handleCancel} />;
      case 'gonogo':        return <GoNoGoTest onComplete={handleComplete} onCancel={handleCancel} />;
      default:              return <Navigate to="/dashboard" replace />;
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 flex flex-col items-center min-h-[80vh] justify-center pt-20">
      <div className="w-full max-w-4xl flex flex-col items-center relative">
        {renderTest()}

        {isCompleted && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-slate-900 border border-slate-800 p-8 rounded-[2.5rem] text-center max-w-md w-full shadow-2xl">
              <Sparkles className="w-12 h-12 text-blue-400 mx-auto mb-4 animate-pulse" />
              <h3 className="text-2xl font-black text-white uppercase tracking-tighter">Session Recorded</h3>
              <p className="text-slate-400 mt-2">Your cognitive data has been synchronized. Redirecting to your profile...</p>
              <div className="mt-6 flex justify-center">
                <div className="w-8 h-8 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TestSessionPage;
