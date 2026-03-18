import { describe, it, expect, vi, beforeEach } from 'vitest';

// Мокаем import.meta.env до импорта сервиса
vi.stubEnv('VITE_API_KEY', '');

// Переопределяем модуль чтобы перехватить вызовы к Gemini
vi.mock('@google/genai', () => ({
  GoogleGenAI: vi.fn().mockImplementation(() => ({
    models: {
      generateContent: vi.fn().mockResolvedValue({ text: 'mocked response' }),
    },
  })),
  Type: { OBJECT: 'OBJECT', ARRAY: 'ARRAY', STRING: 'STRING' },
}));

import { analyzeNeuralPatterns, analyzeCognitivePerformance } from '../services/geminiService';

beforeEach(() => {
  vi.unstubAllEnvs();
});

describe('geminiService — fallback при отсутствии API ключа', () => {
  it('analyzeNeuralPatterns возвращает пустой результат без API ключа', async () => {
    vi.stubEnv('VITE_API_KEY', '');

    const result = await analyzeNeuralPatterns([], []);

    expect(result.insights).toEqual([]);
    expect(result.recommendation).toBeTruthy();
    expect(result.circadianPeak).toBeTruthy();
  });

  it('analyzeCognitivePerformance возвращает пустой массив без API ключа', async () => {
    vi.stubEnv('VITE_API_KEY', '');

    const result = await analyzeCognitivePerformance([]);

    expect(Array.isArray(result)).toBe(true);
    expect(result).toHaveLength(0);
  });
});
