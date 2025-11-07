// Pattern state interface
export interface PatternState {
  explainableAI: boolean
  confidenceIndicators: boolean
  humanInTheLoop: boolean
  progressiveDisclosure: boolean
  undoRedo: boolean
  gracefulDegradation: boolean
  contextualAssistance: boolean
}

// Scenario interface
export interface Scenario {
  id: string
  title: string
  icon: string // Icon type identifier (e.g., 'envelope', 'chat', etc.)
  description: string
  availablePatterns: (keyof PatternState)[]
}

// Pattern info interface
export interface PatternInfo {
  name: string
  description: string
  impact: string
}

// Metrics interface
export interface Metrics {
  trustScore: number
  completionTime: number
  errorRate: number
  userSatisfaction: number
}

// Email writer state
export interface EmailState {
  content: string
  isGenerating: boolean
  confidence: number
  explanations: string[]
}
