'use client';

import { promptTemplates } from '@/data/promptTemplates';
import { PromptTemplate } from '@/types/promptBuilder';
import {
  CubeIcon,
  PaintBrushIcon,
  BugAntIcon,
  ArrowsRightLeftIcon,
  EyeIcon,
  BoltIcon,
  CodeBracketSquareIcon,
  BeakerIcon,
} from '@heroicons/react/24/outline';

interface PromptTemplatesProps {
  onSelectTemplate: (template: PromptTemplate) => void;
}

// Icon mapping
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  'cube': CubeIcon,
  'paint-brush': PaintBrushIcon,
  'bug-ant': BugAntIcon,
  'arrows-right-left': ArrowsRightLeftIcon,
  'eye': EyeIcon,
  'bolt': BoltIcon,
  'code-bracket-square': CodeBracketSquareIcon,
  'beaker': BeakerIcon,
};

export default function PromptTemplates({ onSelectTemplate }: PromptTemplatesProps) {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-semibold text-text-primary mb-1">Quick Start Templates</h3>
        <p className="text-xs text-text-tertiary">
          Choose a template to get started quickly
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {promptTemplates.map((template) => {
          const IconComponent = iconMap[template.icon];
          return (
            <button
              key={template.id}
              type="button"
              onClick={() => onSelectTemplate(template)}
              className="flex items-start gap-3 p-4 rounded-lg border border-gray-200 dark:border-gray-700
                       bg-white dark:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600
                       hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all text-left group"
            >
              <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center">
                {IconComponent && <IconComponent className="w-5 h-5 text-blue-600 dark:text-blue-400" />}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-medium text-text-primary group-hover:text-black dark:group-hover:text-white">
                  {template.name}
                </h4>
                <p className="text-xs text-text-tertiary mt-1 line-clamp-2">
                  {template.description}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
