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

export type DeviceType = 'mobile' | 'desktop';

export type PatternStatus = 'well-implemented' | 'weak' | 'missing' | 'not-applicable';

export type Priority = 'high' | 'medium' | 'low' | 'none';

export interface ContextData {
  interfaceType: InterfaceType;
  userGoal: UserGoal;
  mainConcern: MainConcern;
  industry?: Industry;
  stage?: ProductStage;
  deviceType?: DeviceType;
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
  score: number;
  maxScore: number; // Dynamic based on detected UI component
  detectedComponent: string; // What type of UI was detected
  componentDescription: string; // Brief description
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

// --- Context-First Audit Flow Types ---

export type ProductType =
  | 'chat-interface'
  | 'ai-agent'
  | 'recommendation-system'
  | 'content-generation'
  | 'other';

export type AuditStep = 'product-type' | 'product-detail' | 'screenshot' | 'results';

export interface ProductContext {
  productType: ProductType;
  productDescription: string;
  aiRole: string[];
}

export interface TopGap {
  pattern: string;
  status: 'missing' | 'needs-improvement' | 'good';
  finding: string;
  recommendation: string;
  resource: string | null;
}

export interface ContextAwareResults {
  id: string;
  score: number;
  maxScore: number;
  productTypeSummary: string;
  topGaps: TopGap[];
  quickWins: string[];
  chatContext: string;
  productContext: ProductContext;
  timestamp: string;
}
