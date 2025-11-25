/**
 * Type definitions for Pattern Audit Tool
 */

export type InterfaceType = 'chatbot' | 'content' | 'code' | 'image' | 'analytics' | 'other';

export type UserGoal =
  | 'creating-content'
  | 'getting-answers'
  | 'making-decisions'
  | 'automating-workflows'
  | 'exploring-options'
  | 'analyzing-data';

export type MainConcern = 'trust' | 'errors' | 'usability' | 'blackbox' | 'consistency';

export type Industry =
  | 'healthcare'
  | 'finance'
  | 'education'
  | 'ecommerce'
  | 'developer-tools'
  | 'creative'
  | 'legal'
  | 'enterprise'
  | 'not-specified';

export type ProductStage = 'concept' | 'beta' | 'production' | 'scaling';

export type PatternStatus = 'well-implemented' | 'weak' | 'missing';

export type Priority = 'high' | 'medium' | 'low';

export interface ContextData {
  interfaceType: InterfaceType;
  userGoal: UserGoal;
  mainConcern: MainConcern;
  industry?: Industry;
  stage?: ProductStage;
}

export interface PatternResult {
  id: string;
  name: string;
  status: PatternStatus;
  evidence: string;
  priority: Priority;
  improvement?: string;
  category: string;
}

export interface AnalysisResults {
  id: string;
  context: ContextData;
  score: number; // X out of 28
  patterns: Record<string, PatternResult>;
  summary: string;
  criticalMissing: string[];
  timestamp: string;
}

export interface AuditState {
  context: ContextData | null;
  uploadedImage: string | null;
  analysisResults: AnalysisResults | null;
  currentStep: 'landing' | 'context' | 'upload' | 'analyzing' | 'results';
}

export interface InterfaceTypeOption {
  value: InterfaceType;
  label: string;
  icon: string;
  examples: string;
}

export interface UserGoalOption {
  value: UserGoal;
  label: string;
}

export interface ConcernOption {
  value: MainConcern;
  label: string;
  icon: string;
}
