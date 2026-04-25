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
}

export const productOptions: ProductOption[] = [
  { id: 'chat-interface', label: 'Chat interface', desc: 'Conversational AI, bots, assistants', icon: ChatBubbleLeftRightIcon },
  { id: 'ai-agent', label: 'AI agent', desc: 'Multi-step tasks, automation, actions', icon: CpuChipIcon },
  { id: 'recommendation-system', label: 'Recommendations', desc: 'Content surfacing, ranking, predictions', icon: SparklesIcon },
  { id: 'content-generation', label: 'Content generation', desc: 'Writing, design, code, creation', icon: DocumentTextIcon },
  { id: 'other', label: 'Something else', desc: 'Other AI-powered products', icon: CubeTransparentIcon },
];
