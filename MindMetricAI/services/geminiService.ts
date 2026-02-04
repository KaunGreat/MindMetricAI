
import { GoogleGenAI, Type } from "@google/genai";
import { TestResult, CognitiveInsight, WellnessEntry } from "../types";

/**
 * Анализирует паттерны нейронной активности, сопоставляя результаты тестов и данные о самочувствии.
 * Экспортируется первым, чтобы избежать проблем с TDZ (Temporal Dead Zone).
 */
export const analyzeNeuralPatterns = async (
  results: TestResult[], 
  wellness: WellnessEntry[]
): Promise<{ insights: CognitiveInsight[], recommendation: string, circadianPeak: string }> => {
  if (!process.env.API_KEY) {
    return { insights: [], recommendation: 'Uplink unavailable.', circadianPeak: 'Syncing...' };
  }
  
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const context = {
    testHistory: results.slice(-10),
    wellnessLogs: wellness.slice(-5),
    timestamp: new Date().toISOString()
  };

  const prompt = `Analyze the correlation between performance and wellness: ${JSON.stringify(context)}. 
    Return a strategic plan and insights in JSON.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            insights: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  description: { type: Type.STRING },
                  category: { type: Type.STRING },
                  recommendation: { type: Type.STRING }
                }
              }
            },
            recommendation: { type: Type.STRING },
            circadianPeak: { type: Type.STRING }
          },
          required: ["insights", "recommendation", "circadianPeak"]
        }
      }
    });

    return JSON.parse(response.text || '{}');
  } catch (error) {
    console.error("Neural Core Error:", error);
    return { insights: [], recommendation: 'Direct sync failed.', circadianPeak: 'Unknown' };
  }
};

/**
 * FIX: Добавлен экспорт analyzeCognitivePerformance, который требовался в Insights.tsx
 */
export const analyzeCognitivePerformance = async (results: TestResult[]): Promise<CognitiveInsight[]> => {
  const data = await analyzeNeuralPatterns(results, []);
  return data.insights;
};
