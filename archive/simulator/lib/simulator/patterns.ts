import type { PatternInfo, Scenario, PatternState } from '@/types/simulator'

export const patternInfo: Record<keyof PatternState, PatternInfo> = {
  explainableAI: {
    name: 'Explainable AI',
    description: 'Shows why AI made specific decisions',
    impact: '+45% user trust'
  },
  confidenceIndicators: {
    name: 'Confidence Indicators',
    description: 'Displays AI certainty levels',
    impact: '+60% appropriate reliance'
  },
  humanInTheLoop: {
    name: 'Human-in-the-Loop',
    description: 'Requires human approval for actions',
    impact: '+90% error prevention'
  },
  progressiveDisclosure: {
    name: 'Progressive Disclosure',
    description: 'Reveals information gradually',
    impact: '-40% cognitive load'
  },
  undoRedo: {
    name: 'Undo/Redo',
    description: 'Allows reversing AI actions',
    impact: '+70% user confidence'
  },
  gracefulDegradation: {
    name: 'Graceful Degradation',
    description: 'Handles failures with fallback options',
    impact: '+55% reliability perception'
  },
  contextualAssistance: {
    name: 'Contextual Assistance',
    description: 'Provides help based on user context',
    impact: '+35% task completion'
  }
}

export const scenarios: Scenario[] = [
  {
    id: 'email-writer',
    title: 'AI Email Writer',
    icon: 'envelope',
    description: 'Compose emails with AI assistance',
    availablePatterns: ['explainableAI', 'confidenceIndicators', 'humanInTheLoop', 'undoRedo']
  },
  {
    id: 'chatbot',
    title: 'Customer Support Bot',
    icon: 'chat',
    description: 'Automated customer service',
    availablePatterns: ['gracefulDegradation', 'confidenceIndicators', 'humanInTheLoop', 'contextualAssistance']
  },
  {
    id: 'recommender',
    title: 'Product Recommender',
    icon: 'shopping',
    description: 'E-commerce recommendations',
    availablePatterns: ['explainableAI', 'confidenceIndicators', 'progressiveDisclosure']
  },
  {
    id: 'content-gen',
    title: 'Content Generator',
    icon: 'document',
    description: 'Blog posts and articles',
    availablePatterns: ['humanInTheLoop', 'confidenceIndicators', 'undoRedo', 'explainableAI']
  },
  {
    id: 'predictor',
    title: 'Predictive Text',
    icon: 'sparkles',
    description: 'Autocomplete and suggestions',
    availablePatterns: ['confidenceIndicators', 'progressiveDisclosure', 'contextualAssistance']
  }
]
