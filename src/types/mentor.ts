/**
 * Type definitions for AI Design Mentor
 * Tools: scan_design, lookup_pattern, generate_annotations, generate_action_items
 */

import type { PatternResult, PatternStatus, Priority, ContextData } from './audit';

// ============================================================================
// Design Tools (for action items generation)
// ============================================================================

export type DesignTool = 'figma' | 'sketch' | 'framer' | 'generic';

export type OutputFormat = 'fix-prompts' | 'checklist' | 'both';

// ============================================================================
// Tool 1: scan_design
// ============================================================================

export interface ScanDesignInput {
  imageBase64: string;
  productType: string;
  userGoal?: string;
  context?: ContextData;
}

export interface ScanDesignOutput {
  sessionId: string;
  patterns: {
    detected: PatternResult[];
    weak: PatternResult[];
    missing: PatternResult[];
  };
  uiElements: string[];
  overallScore: number;
  summary: string;
  timestamp: string;
}

// ============================================================================
// Tool 2: lookup_pattern
// ============================================================================

export interface LookupPatternInput {
  patternId?: string;
  patternName?: string;
}

export interface PatternDetails {
  id: string;
  title: string;
  slug: string;
  category: string;
  description: string;
  problem: string;
  solution: string;
  guidelines: string[];
  considerations: string[];
  examples: {
    title: string;
    description: string;
    image?: string;
  }[];
  codeExamples: {
    title: string;
    description: string;
    code: string;
    language: string;
  }[];
}

export interface LookupPatternOutput {
  found: boolean;
  pattern?: PatternDetails;
  error?: string;
}

// ============================================================================
// Tool 3: generate_annotations
// ============================================================================

export type AnnotationSeverity = 'critical' | 'warning' | 'suggestion';

export interface Annotation {
  id: string;
  // Position (percentage-based for responsiveness)
  x: number;
  y: number;
  width: number;
  height: number;
  // Content
  label: string;
  severity: AnnotationSeverity;
  patternId: string;
  patternName: string;
  description: string;
  // For linking to chat/education
  learnMorePrompt?: string;
}

export interface GenerateAnnotationsInput {
  sessionId: string;
  analysisResults: ScanDesignOutput;
  focusPatterns?: string[]; // Limit to specific patterns
  maxAnnotations?: number; // For free tier limiting
}

export interface GenerateAnnotationsOutput {
  annotations: Annotation[];
  totalIssues: number;
  limitedByTier: boolean; // True if free tier truncated results
}

// ============================================================================
// Tool 4: generate_action_items
// ============================================================================

export interface FixPrompt {
  id: string;
  issue: string;
  patternId: string;
  patternName: string;
  severity: AnnotationSeverity;
  prompt: string; // Ready to copy-paste
  toolSpecific: boolean;
  targetTool?: DesignTool;
}

export interface ChecklistTask {
  id: string;
  title: string;
  description: string;
  patternId: string;
  priority: Priority;
  completed: boolean;
}

export interface GenerateActionItemsInput {
  sessionId: string;
  annotations: Annotation[];
  designTool?: DesignTool;
  outputFormat: OutputFormat;
  maxPrompts?: number; // For free tier limiting
}

export interface GenerateActionItemsOutput {
  fixPrompts: FixPrompt[];
  checklist: {
    markdown: string; // For Notion/docs
    tasks: ChecklistTask[];
  };
  totalItems: number;
  limitedByTier: boolean;
}

// ============================================================================
// Chat & Session Management
// ============================================================================

export type MessageRole = 'user' | 'assistant' | 'system';

export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: string;
  // Tool calls made in this message
  toolCalls?: {
    tool: 'scan_design' | 'lookup_pattern' | 'generate_annotations' | 'generate_action_items';
    input: unknown;
    output: unknown;
  }[];
  // For displaying annotations inline
  annotations?: Annotation[];
  // For displaying fix prompts inline
  fixPrompts?: FixPrompt[];
}

export interface MentorSession {
  id: string;
  // Original upload
  imageBase64: string;
  productType: string;
  // Analysis results
  scanResults?: ScanDesignOutput;
  annotations?: Annotation[];
  actionItems?: GenerateActionItemsOutput;
  // Conversation
  messages: ChatMessage[];
  // Metadata
  createdAt: string;
  updatedAt: string;
  // User tier (for limiting features)
  tier: 'free' | 'premium';
}

// ============================================================================
// Chat API
// ============================================================================

export interface ChatInput {
  sessionId: string;
  message: string;
  // Include image for Vision re-examination
  includeImage?: boolean;
}

export interface ChatOutput {
  message: ChatMessage;
  // Updated session state
  session: MentorSession;
}

// ============================================================================
// API Route Types
// ============================================================================

export interface MentorAPIError {
  error: string;
  code: 'INVALID_INPUT' | 'SESSION_NOT_FOUND' | 'RATE_LIMITED' | 'TIER_LIMIT' | 'INTERNAL_ERROR';
  details?: string;
}

// Free tier limits
export const FREE_TIER_LIMITS = {
  scansPerMonth: 3,
  annotationsPerScan: 3,
  fixPromptsPerScan: 1,
  sessionHistory: 1,
} as const;

// Premium tier limits (effectively unlimited for MVP)
export const PREMIUM_TIER_LIMITS = {
  scansPerMonth: 1000,
  annotationsPerScan: 100,
  fixPromptsPerScan: 100,
  sessionHistory: 100,
} as const;
