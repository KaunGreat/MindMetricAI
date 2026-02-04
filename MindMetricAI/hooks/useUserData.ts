
import { useState, useEffect } from 'react';

export interface TestResult {
  id: string;
  type: string; // 'reaction', 'memory', 'stroop', etc.
  score: number | string;
  date: string;
  details?: any;
}

// Added export for getXPForLevel to fix "Module has no exported member 'getXPForLevel'" in LevelProgress.tsx
export const getXPForLevel = (level: number) => Math.pow(level - 1, 2) * 500;

// Added export for getLevelTitle to fix "Module has no exported member 'getLevelTitle'" in Dashboard.tsx and LevelProgress.tsx
export const getLevelTitle = (level: number) => {
  if (level >= 20) return "Omniscient Strategist";
  if (level >= 15) return "Neural Architect";
  if (level >= 10) return "Grandmaster Analyst";
  if (level >= 5) return "Senior Specialist";
  return "Neural Novice";
};

export const useUserData = () => {
  const [history, setHistory] = useState<TestResult[]>([]);

  // Load from LocalStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('mindmetric_history');
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse history", e);
      }
    }
  }, []);

  // Save new result
  const saveResult = (result: Omit<TestResult, 'id' | 'date'>) => {
    const newEntry: TestResult = {
      ...result,
      id: Date.now().toString(),
      date: new Date().toISOString()
    };

    const updatedHistory = [newEntry, ...history];
    setHistory(updatedHistory);
    localStorage.setItem('mindmetric_history', JSON.stringify(updatedHistory));
    console.log("✅ Result Saved:", newEntry);
  };

  // Clear history
  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem('mindmetric_history');
  };

  // Keep these for backward compatibility with components that might still reference them for UI
  const xp = history.length * 50;
  const level = Math.floor(Math.sqrt(xp / 500)) + 1;

  // Fix: added 'results' as an alias for 'history' to resolve "Property 'results' does not exist" errors in Dashboard.tsx, ReactionTest.tsx, and SocialPage.tsx.
  return { history, results: history, saveResult, clearHistory, xp, level };
};
