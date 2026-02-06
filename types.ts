
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
  type: TestType;
  score: number;
  timestamp: number;
  metadata?: Record<string, any>;
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
