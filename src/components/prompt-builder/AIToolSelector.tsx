'use client';

import { AITool } from '@/types/promptBuilder';
import { motion } from 'framer-motion';
import { SparklesIcon } from '@heroicons/react/24/outline';
import { useThemeFilter } from '@/hooks/useTheme';

interface AIToolSelectorProps {
  selected: AITool | '';
  onChange: (tool: AITool) => void;
}

const tools: { id: AITool; name: string; description: string; logo?: string; icon?: string }[] = [
  {
    id: 'claude',
    name: 'Claude',
    description: 'Anthropic Claude AI',
    logo: '/images/logos/claude.svg',
  },
  {
    id: 'cursor',
    name: 'Cursor',
    description: 'AI-powered editor',
    logo: '/images/logos/cursor.svg',
  },
  {
    id: 'chatgpt',
    name: 'ChatGPT',
    description: 'OpenAI ChatGPT',
    logo: 'https://cdn.jsdelivr.net/npm/simple-icons@12.0.0/icons/openai.svg',
  },
  {
    id: 'copilot',
    name: 'Copilot',
    description: 'GitHub AI assistant',
    logo: 'https://cdn.jsdelivr.net/npm/simple-icons@12.0.0/icons/githubcopilot.svg',
  },
  {
    id: 'figma',
    name: 'Figma',
    description: 'Design tool with AI',
    logo: 'https://cdn.jsdelivr.net/npm/simple-icons@12.0.0/icons/figma.svg',
  },
  {
    id: 'generic',
    name: 'Generic',
    description: 'Any AI tool',
    icon: 'sparkles',
  },
];

export default function AIToolSelector({ selected, onChange }: AIToolSelectorProps) {
  const logoFilter = useThemeFilter('none');

  return (
    <div className="space-y-4">
      <h3 className="text-xs font-bold uppercase tracking-wide text-gray-500 dark:text-gray-400">
        Select AI Tool
      </h3>
      <div className="grid grid-cols-3 lg:grid-cols-6 gap-3">
        {tools.map((tool) => {
          const isSelected = selected === tool.id;

          return (
            <button
              key={tool.id}
              type="button"
              onClick={() => onChange(tool.id)}
              className={`aspect-square flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all cursor-pointer ${
                isSelected
                  ? 'border-black dark:border-white bg-black dark:bg-white text-white dark:text-black shadow-lg'
                  : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white hover:border-gray-300 dark:hover:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              <div className={`mb-2 transition-transform ${isSelected ? 'scale-110' : ''}`}>
                {tool.logo ? (
                  <img
                    src={tool.logo}
                    alt={tool.name}
                    className="h-8 w-8 object-contain"
                    style={{ filter: isSelected ? 'invert(1)' : logoFilter }}
                  />
                ) : tool.icon === 'sparkles' ? (
                  <SparklesIcon className="h-8 w-8" />
                ) : null}
              </div>
              <span className="text-xs font-semibold text-center leading-tight">
                {tool.name}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
