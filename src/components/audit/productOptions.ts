import type { ProductType } from '@/types/audit';
import {
  ChatBubbleLeftRightIcon,
  CpuChipIcon,
  SparklesIcon,
  DocumentTextIcon,
  CubeTransparentIcon,
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
    id: 'other',
    label: 'Something else',
    desc: 'Other AI-powered products',
    icon: CubeTransparentIcon,
    examplePatterns: ['Confidence Visualization', 'Explainable AI', 'Error Recovery'],
  },
];
