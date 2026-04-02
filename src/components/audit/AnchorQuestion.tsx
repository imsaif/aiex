'use client';

import type { ProductType } from '@/types/audit';
import { trackAuditEvent } from '@/lib/audit/analytics';
import {
  ChatBubbleLeftRightIcon,
  CpuChipIcon,
  SparklesIcon,
  DocumentTextIcon,
  CubeTransparentIcon,
} from '@heroicons/react/24/outline';
import type { ComponentType, SVGProps } from 'react';

const productOptions: { id: ProductType; label: string; desc: string; icon: ComponentType<SVGProps<SVGSVGElement>> }[] = [
  { id: 'chat-interface', label: 'Chat interface', desc: 'Conversational AI, bots, assistants', icon: ChatBubbleLeftRightIcon },
  { id: 'ai-agent', label: 'AI agent', desc: 'Multi-step tasks, automation, actions', icon: CpuChipIcon },
  { id: 'recommendation-system', label: 'Recommendations', desc: 'Content surfacing, ranking, predictions', icon: SparklesIcon },
  { id: 'content-generation', label: 'Content generation', desc: 'Writing, design, code, creation', icon: DocumentTextIcon },
  { id: 'other', label: 'Something else', desc: 'Other AI-powered products', icon: CubeTransparentIcon },
];

interface AnchorQuestionProps {
  onSelect: (productType: ProductType) => void;
}

export function AnchorQuestion({ onSelect }: AnchorQuestionProps) {
  return (
    <div className="w-full max-w-5xl mx-auto">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
        {productOptions.map((option, index) => {
          const Icon = option.icon;
          const isLast = index === productOptions.length - 1;
          return (
            <button
              key={option.id}
              onClick={() => {
                trackAuditEvent('audit_product_type_selected', { productType: option.id });
                onSelect(option.id);
              }}
              className={`flex flex-col items-center text-center gap-3 p-4 sm:p-5 border border-border-primary rounded-xl bg-background-primary shadow-card hover:bg-accent-subtle hover:-translate-y-0.5 hover:shadow-lg transition-all duration-200 cursor-pointer group ${isLast ? 'col-span-2 sm:col-span-1' : ''}`}
            >
              <div className="w-12 h-12 rounded-xl bg-accent-subtle flex items-center justify-center">
                <Icon className="w-6 h-6 text-accent-primary" />
              </div>
              <div>
                <div className="font-semibold text-text-primary">{option.label}</div>
                <div className="text-sm text-text-secondary mt-1 leading-relaxed">{option.desc}</div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
