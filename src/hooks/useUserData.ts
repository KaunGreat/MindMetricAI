import { useState, useEffect } from 'react';
import { TestResult } from '../types';

export const getXPForLevel = (level: number) => Math.pow(level - 1, 2) * 500;

export const getLevelTitle = (level: number) => {
  if (level >= 20) return "Omniscient Strategist";
  if (level >= 15) return "Neural Architect";
  if (level >= 10) return "Grandmaster Analyst";
  if (level >= 5)  return "Senior Specialist";
  return "Neural Novice";
};

const STORAGE_KEY = 'mindmetric_history';

export const useUserData = () => {
  const [history, setHistory] = useState<TestResult[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse history", e);
      }
    }
  }, []);

  const saveResult = (result: Pick<TestResult, 'type' | 'score' | 'details'>) => {
    const newEntry: TestResult = {
      ...result,
      id: Date.now().toString(),
      timestamp: Date.now(),
    };
    const updated = [newEntry, ...history];
    setHistory(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem(STORAGE_KEY);
  };

  const xp = history.length * 50;
  const level = Math.floor(Math.sqrt(xp / 500)) + 1;

  // results — алиас history для обратной совместимости
  return { history, results: history, saveResult, clearHistory, xp, level };
};
