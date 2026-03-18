
import { GoogleGenAI } from "@google/genai";
import { TestResult } from '../types';

export interface Message {
  role: 'user' | 'assistant';
  content: string;
}

/**
 * Fix: Replaced backend fetch with direct Gemini SDK call to provide low-latency neural coaching.
 * Uses gemini-3-flash-preview for fast, chat-like responsiveness.
 */
export const getCoachResponse = async (prompt: string, history: TestResult[]): Promise<string> => {
  const token = localStorage.getItem('token');
  
  if (!token) {
    return "Your neural session has expired. Please log in again to sync with my coaching core.";
  }

  if (!import.meta.env.VITE_API_KEY) {
    return "I'm currently disconnected from the MindMetric neural grid. Please check your configuration.";
  }

  try {
    const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_API_KEY });
    
    const context = {
      testHistory: history.slice(-10),
      timestamp: new Date().toISOString()
    };

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `
        You are the MindMetric Neural Coach. 
        User History Context: ${JSON.stringify(context)}
        
        Question: ${prompt}
        
        Provide concise, high-performance coaching advice. Be brief, professional, and data-driven.
      `,
      config: {
        systemInstruction: "You are a specialized neural performance coach. Help users interpret their cognitive metrics and improve their mental focus.",
        temperature: 0.7,
      },
    });

    // response.text is a property, not a method.
    return response.text || "I'm processing your metrics, but couldn't form a response. Let's try another query.";
  } catch (error) {
    console.error("Coach API Error:", error);
    return "I'm currently unable to access your cognitive records due to a synchronization error. Let's try again in a moment.";
  }
};
