export enum TestType {
  REACTION = 'REACTION',
  MEMORY = 'MEMORY',
  SEQUENCE = 'SEQUENCE',
  STROOP = 'STROOP',
  WISCONSIN = 'WISCONSIN',
  PAL = 'PAL',
  NBACK = 'NBACK',
  VISUAL_SEARCH = 'VISUAL_SEARCH',
  TOWER = 'TOWER',
  GAMBLING = 'GAMBLING',
  EMOTION = 'EMOTION',
  DIGIT_SPAN = 'DIGIT_SPAN',
  GONOGO = 'GONOGO'
}

export interface TestResult {
  id: string;
  type: string;           // строка для совместимости с URL-параметрами (/test/reaction)
  score: number;          // всегда число — форматирование только в UI
  timestamp: number;      // unix ms — единый формат для сортировки
  details?: Record<string, unknown>; // типизированные метаданные вместо any
}

export interface WellnessEntry {
  id: string;
  timestamp: number;
  sleepQuality: number;
  stressLevel: number;
  notes: string;
}

export interface UserProfile {
  name: string;
  history: TestResult[];
  wellnessHistory: WellnessEntry[];
}

export interface CognitiveInsight {
  title: string;
  description: string;
  category: 'Focus' | 'Memory' | 'Agility';
  recommendation: string;
}
