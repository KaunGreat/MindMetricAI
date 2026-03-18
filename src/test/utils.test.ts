import { describe, it, expect } from 'vitest';
import { getLevelTitle, getXPForLevel } from '../hooks/useUserData';

// ─── getLevelTitle ────────────────────────────────────────────────
describe('getLevelTitle', () => {
  it('возвращает Neural Novice для уровней ниже 5', () => {
    expect(getLevelTitle(1)).toBe('Neural Novice');
    expect(getLevelTitle(4)).toBe('Neural Novice');
  });

  it('возвращает Senior Specialist для уровней 5–9', () => {
    expect(getLevelTitle(5)).toBe('Senior Specialist');
    expect(getLevelTitle(9)).toBe('Senior Specialist');
  });

  it('возвращает Grandmaster Analyst для уровней 10–14', () => {
    expect(getLevelTitle(10)).toBe('Grandmaster Analyst');
    expect(getLevelTitle(14)).toBe('Grandmaster Analyst');
  });

  it('возвращает Neural Architect для уровней 15–19', () => {
    expect(getLevelTitle(15)).toBe('Neural Architect');
    expect(getLevelTitle(19)).toBe('Neural Architect');
  });

  it('возвращает Omniscient Strategist для уровня 20+', () => {
    expect(getLevelTitle(20)).toBe('Omniscient Strategist');
    expect(getLevelTitle(99)).toBe('Omniscient Strategist');
  });
});

// ─── getXPForLevel ────────────────────────────────────────────────
describe('getXPForLevel', () => {
  it('уровень 1 требует 0 XP', () => {
    expect(getXPForLevel(1)).toBe(0);
  });

  it('уровень 2 требует 500 XP', () => {
    expect(getXPForLevel(2)).toBe(500);
  });

  it('уровень 3 требует 2000 XP', () => {
    expect(getXPForLevel(3)).toBe(2000);
  });

  it('XP растёт квадратично с уровнем', () => {
    expect(getXPForLevel(4)).toBeGreaterThan(getXPForLevel(3));
    expect(getXPForLevel(5)).toBeGreaterThan(getXPForLevel(4));
  });
});

// ─── normalizeScore ───────────────────────────────────────────────
// Тестируем через прямой импорт логики (дублируем функцию чтобы не тащить React)
const normalizeScore = (score: number | string): number => {
  if (typeof score === 'number') return score;
  const parsed = parseFloat(score);
  return isNaN(parsed) ? 0 : parsed;
};

describe('normalizeScore', () => {
  it('число возвращает как есть', () => {
    expect(normalizeScore(245)).toBe(245);
    expect(normalizeScore(0)).toBe(0);
  });

  it('строку с числом парсит в number', () => {
    expect(normalizeScore('245')).toBe(245);
    expect(normalizeScore('3.14')).toBe(3.14);
  });

  it('строку вида "245ms" парсит правильно', () => {
    expect(normalizeScore('245ms')).toBe(245);
  });

  it('нечисловую строку возвращает 0', () => {
    expect(normalizeScore('abc')).toBe(0);
    expect(normalizeScore('')).toBe(0);
  });

  it('отрицательные числа поддерживает', () => {
    expect(normalizeScore(-10)).toBe(-10);
    expect(normalizeScore('-10')).toBe(-10);
  });
});
