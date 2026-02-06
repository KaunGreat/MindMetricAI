
import React from 'react';
import { 
  Zap,                // Reaction
  BrainCircuit,       // Memory
  Eye,                // Stroop
  Puzzle,             // Wisconsin (Flexibility)
  Library,            // PAL (Visual Learning)
  Hash,               // N-Back
  Search,             // Visual Search
  Sigma,              // Digit Span
  GitMerge,           // Tower of London
  Handshake,          // Gambling Task
  SmilePlus,          // Emotion Recognition
  Target,             // Go/No-Go (Inhibition)
  BarChart3           // Insights
} from 'lucide-react';
import { TestType } from './types';

export const TESTS = [
  {
    id: TestType.REACTION,
    title: 'Reaction Time',
    description: 'Measure your visual response speed.',
    icon: Zap,
    path: '/test/reaction',
    color: 'yellow'
  },
  {
    id: TestType.MEMORY,
    title: 'Spatial Span',
    description: 'Track and recall block sequences of increasing length.',
    icon: BrainCircuit,
    path: '/test/spatial-span',
    color: 'purple'
  },
  {
    id: TestType.STROOP,
    title: 'Stroop Test',
    description: 'Measure executive function and inhibitory control.',
    icon: Eye,
    path: '/test/stroop',
    color: 'emerald'
  },
  {
    id: TestType.WISCONSIN,
    title: 'Cognitive Flexibility',
    description: 'Deduce rules and adapt to shifting requirements.',
    icon: Puzzle,
    path: '/test/wisconsin',
    color: 'rose'
  },
  {
    id: TestType.PAL,
    title: 'Visual Learning (PAL)',
    description: 'Associate locations with specific visual patterns.',
    icon: Library,
    path: '/test/pal',
    color: 'blue'
  },
  {
    id: TestType.NBACK,
    title: 'N-Back Memory',
    description: 'Track items in a continuous stream (Working Memory).',
    icon: Hash,
    path: '/test/nback',
    color: 'orange'
  },
  {
    id: TestType.VISUAL_SEARCH,
    title: 'Visual Search',
    description: 'Identify specific targets among distractors.',
    icon: Search,
    path: '/test/visual-search',
    color: 'cyan'
  },
  {
    id: TestType.TOWER,
    title: 'Tower of London',
    description: 'Measure executive planning and problem solving.',
    icon: GitMerge,
    path: '/test/tower',
    color: 'indigo'
  },
  {
    id: TestType.GAMBLING,
    title: 'Gambling Task',
    description: 'Evaluate decision making under risk and intuition.',
    icon: Handshake,
    path: '/test/gambling',
    color: 'red'
  },
  {
    id: TestType.EMOTION,
    title: 'Emotion Recognition',
    description: 'Assess social intelligence and facial perception.',
    icon: SmilePlus,
    path: '/test/emotion',
    color: 'pink'
  },
  {
    id: TestType.DIGIT_SPAN,
    title: 'Digit Span',
    description: 'Test verbal working memory and sequential recall.',
    icon: Sigma,
    path: '/test/digit-span',
    color: 'amber'
  },
  {
    id: TestType.GONOGO,
    title: 'Go / No-Go',
    description: 'Measure motor inhibition and cognitive control.',
    icon: Target,
    path: '/test/gonogo',
    color: 'rose'
  },
  {
    id: 'insights',
    title: 'Cognitive Insights',
    description: 'AI-powered analysis of your performance.',
    icon: BarChart3,
    path: '/insights',
    color: 'blue'
  }
];
