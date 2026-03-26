import type { ProductType } from '@/types/audit';

export interface ContextAwareGap {
  pattern: string;
  status: 'missing' | 'needs-improvement' | 'good';
  finding: string;
  recommendation: string;
  resource: string | null;
}

export interface ContextAwareAnalysis {
  score: number;
  maxScore: number;
  productTypeSummary: string;
  topGaps: ContextAwareGap[];
  quickWins: string[];
  chatContext: string;
}

export interface ContextAwareRequest {
  productType: ProductType;
  productDescription: string;
  aiRole: string[];
}
