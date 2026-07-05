/**
 * Type definitions for Pattern Audit Tool
 */

import { z } from 'zod';

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

export type AuditStep = 'demo' | 'product-type' | 'screenshot' | 'results';

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
  /** Quote of the visible UI element this finding is grounded in. Required for honest findings. */
  evidence?: string;
  /** 1-based index of the screenshot this finding refers to (when multiple were uploaded). */
  screenshotIndex?: number;
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

// --- Zod schemas for runtime validation of Claude's analyze response ---
//
// The analyze prompt asks Claude to return a strict JSON shape (see
// src/lib/audit/prompts.ts). We validate the parsed JSON against this schema
// so that broken responses (missing fields, wrong types, hallucinated extras)
// surface as typed errors instead of silently propagating through the UI.
//
// Kept deliberately permissive on `applicablePatterns`, `quickWins`, and
// `score`/`maxScore` because the route already tolerates absent fields, but
// strict on `topGaps[].pattern/status/finding` since those are user-visible
// and the documented Apr 28 regression class is bad findings shape.

export const TopGapSchema = z.object({
  pattern: z.string().min(1),
  status: z.enum(['missing', 'needs-improvement', 'good']),
  finding: z.string().min(1),
  evidence: z.string().optional(),
  recommendation: z.string().optional().default(''),
  resource: z.string().nullable().optional(),
  screenshotIndex: z.number().int().positive().optional(),
});

export const ClaudeAnalysisResponseSchema = z.object({
  score: z.number().nullable().optional(),
  maxScore: z.number().nullable().optional(),
  productTypeSummary: z.string().optional().default(''),
  surfaceDescription: z.string().optional().default(''),
  applicablePatterns: z.array(z.string()).optional().default([]),
  topGaps: z.array(TopGapSchema).optional().default([]),
  quickWins: z.array(z.string()).optional().default([]),
  // Plain-language general UX observations, populated when the screenshot is NOT
  // an AI product interface (0 applicable patterns) so the run still returns value
  // instead of a blank "0 gaps". See the no_ai_surface handling in the analyze route.
  generalObservations: z.array(z.string()).optional().default([]),
  chatContext: z.string().optional().default(''),
  // Legacy fields the route still passes through for backward compat
  detectedComponent: z.string().optional(),
  componentDescription: z.string().optional(),
  patterns: z.record(z.string(), z.unknown()).optional(),
  summary: z.string().optional(),
  criticalMissing: z.array(z.string()).optional(),
});

export type ClaudeAnalysisResponse = z.infer<typeof ClaudeAnalysisResponseSchema>;
