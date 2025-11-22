'use client';

import { AITool } from '@/types/promptBuilder';
import { SparklesIcon } from '@heroicons/react/24/outline';
import { useEffect, useState } from 'react';

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
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    // Check current theme - handle multiple detection methods
    const checkTheme = () => {
      const html = document.documentElement;
      const theme = html.getAttribute('data-theme');
      const hasClass = html.classList.contains('dark');
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

      // Dark if: data-theme="dark" OR has .dark class OR (no theme set AND prefers dark)
      setIsDark(theme === 'dark' || hasClass || (theme === null && prefersDark));
    };

    checkTheme();

    // Listen for theme changes
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme', 'class']
    });

    // Also listen for system preference changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    mediaQuery.addEventListener('change', checkTheme);

    return () => {
      observer.disconnect();
      mediaQuery.removeEventListener('change', checkTheme);
    };
  }, []);

  // Get logo filter based on selection state and theme
  // Selected: logo should contrast with selected background
  // Non-selected: in dark mode, invert black SVGs to white for visibility
  const getLogoFilter = (isSelected: boolean) => {
    if (isSelected) {
      // Selected bg: white in dark mode, black in light mode
      // So logo needs: no filter in dark (black on white), invert in light (white on black)
      return isDark ? 'none' : 'invert(1)';
    }
    // Non-selected: invert in dark mode to make black SVGs visible
    return isDark ? 'invert(1)' : 'none';
  };

  // Fully JS-controlled selected styles to ensure sync with filter logic
  const getSelectedClasses = () => {
    return isDark
      ? 'border-white bg-white text-black shadow-lg'
      : 'border-black bg-black text-white shadow-lg';
  };

  return (
    <div className="space-y-4">
      <h3 className="text-xs font-bold uppercase tracking-wide text-text-tertiary">
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
              className={`aspect-square flex flex-col items-center justify-center p-4 rounded-xl border transition-all cursor-pointer ${
                isSelected
                  ? getSelectedClasses()
                  : 'border-gray-200 dark:border-gray-700 bg-surface-primary text-text-primary hover:border-gray-300 dark:hover:border-gray-600 hover:bg-background-secondary'
              }`}
            >
              <div className={`mb-2 transition-transform ${isSelected ? 'scale-110' : ''}`}>
                {tool.logo ? (
                  <img
                    src={tool.logo}
                    alt={tool.name}
                    className="h-8 w-8 object-contain"
                    style={{ filter: getLogoFilter(isSelected) }}
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
