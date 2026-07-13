import type { ProductType } from '@/types/audit';
import {
  ChatBubbleLeftRightIcon,
  CpuChipIcon,
  SparklesIcon,
  DocumentTextIcon,
  ChartBarIcon,
  PuzzlePieceIcon,
  MagnifyingGlassIcon,
  DocumentChartBarIcon,
} from '@heroicons/react/24/outline';
import type { ComponentType, SVGProps } from 'react';

export interface ProductOption {
  id: ProductType;
  label: string;
  desc: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  examplePatterns: string[];
}

export const productOptions: ProductOption[] = [
  {
    id: 'chat-interface',
    label: 'Chat interface',
    desc: 'Conversational AI, bots, assistants',
    icon: ChatBubbleLeftRightIcon,
    examplePatterns: ['Confidence Visualization', 'Error Recovery', 'Explainable AI'],
  },
  {
    id: 'ai-agent',
    label: 'AI agent',
    desc: 'Multi-step tasks, automation, actions',
    icon: CpuChipIcon,
    examplePatterns: ['Intent Preview', 'Action Audit Trail', 'Escalation Pathways'],
  },
  {
    id: 'recommendation-system',
    label: 'Recommendations',
    desc: 'Content surfacing, ranking, predictions',
    icon: SparklesIcon,
    examplePatterns: ['Explainable AI', 'Feedback Loops', 'Adaptive Interfaces'],
  },
  {
    id: 'content-generation',
    label: 'Content generation',
    desc: 'Writing, design, code, creation',
    icon: DocumentTextIcon,
    examplePatterns: ['Augmented Creation', 'Safe Exploration', 'Human-in-the-Loop'],
  },
  {
    id: 'dashboard-analytics',
    label: 'Dashboard & analytics',
    desc: 'AI insights, metrics, admin overviews',
    icon: ChartBarIcon,
    examplePatterns: ['Confidence Visualization', 'Explainable AI', 'Progressive Disclosure'],
  },
  {
    id: 'embedded-ai-feature',
    label: 'Embedded AI feature',
    desc: 'AI copilot or assist inside an existing tool',
    icon: PuzzlePieceIcon,
    examplePatterns: ['Workspace-Native Agent Integration', 'Contextual Assistance', 'Ambient Intelligence'],
  },
  {
    id: 'search-discovery',
    label: 'Search & discovery',
    desc: 'AI or semantic search, discovery feeds',
    icon: MagnifyingGlassIcon,
    examplePatterns: ['Explainable AI', 'Feedback Loops', 'Predictive Anticipation'],
  },
  {
    id: 'reports-documents',
    label: 'Reports & documents',
    desc: 'AI-generated reports, extraction, enrichment',
    icon: DocumentChartBarIcon,
    examplePatterns: ['Explainable AI', 'Confidence Visualization', 'Human-in-the-Loop'],
  },
];
