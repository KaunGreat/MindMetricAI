
import { TestResult, TestType } from '../types';

export interface DomainScore {
  subject: string;
  score: number;
  fullMark: number;
}

export const calculateProfileScores = (results: TestResult[]): DomainScore[] => {
  const getBest = (type: TestType) => {
    const typeResults = results.filter(r => r.type === type);
    if (typeResults.length === 0) return null;
    
    if (type === TestType.REACTION) {
      return Math.min(...typeResults.map(r => r.score));
    }
    if (type === TestType.STROOP) {
      // Use interference cost if available in metadata, otherwise raw score
      const bestWithMeta = typeResults.reduce((best, current) => {
        const currentCost = current.metadata?.interferenceCost ?? current.score;
        const bestCost = best.metadata?.interferenceCost ?? best.score;
        return currentCost < bestCost ? current : best;
      });
      return bestWithMeta.metadata?.interferenceCost ?? bestWithMeta.score;
    }
    return Math.max(...typeResults.map(r => r.score));
  };

  // Normalization Logics (0-100)
  // Speed (Reaction)
  const bestReaction = getBest(TestType.REACTION);
  const speedScore = bestReaction 
    ? Math.max(10, Math.min(100, 100 - (bestReaction - 180) * (90 / 320))) 
    : 0;

  // Memory (Spatial Span)
  const bestMemory = getBest(TestType.MEMORY);
  const memoryScore = bestMemory 
    ? Math.max(10, Math.min(100, (bestMemory - 2) * (90 / 10) + 10)) 
    : 0;

  // Focus (Stroop Interference Cost)
  const bestFocusCost = getBest(TestType.STROOP);
  const focusScore = bestFocusCost !== null
    ? Math.max(10, Math.min(100, 100 - (bestFocusCost * (90 / 400))))
    : 0;

  // Flexibility (Wisconsin Score)
  const bestFlex = getBest(TestType.WISCONSIN);
  const flexScore = bestFlex
    ? Math.max(10, Math.min(100, (bestFlex - 50) * (90 / 600) + 10))
    : 0;

  // Strategy (Derived or placeholder for future tests)
  // Currently calculated as an aggregate of Focus and Flexibility
  const strategyScore = (focusScore + flexScore) / 2 || 0;

  return [
    { subject: 'Speed', score: Math.round(speedScore), fullMark: 100 },
    { subject: 'Memory', score: Math.round(memoryScore), fullMark: 100 },
    { subject: 'Focus', score: Math.round(focusScore), fullMark: 100 },
    { subject: 'Flexibility', score: Math.round(flexScore), fullMark: 100 },
    { subject: 'Strategy', score: Math.round(strategyScore), fullMark: 100 },
  ];
};
