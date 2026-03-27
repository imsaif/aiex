'use client';

import { FigmaPrompt } from '@/types';
import { useState } from 'react';

interface FigmaPromptCardProps {
  figmaPrompt: FigmaPrompt;
}

export default function FigmaPromptCard({ figmaPrompt }: FigmaPromptCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(figmaPrompt.prompt);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="bg-surface-primary rounded-2xl border-2 border-accent-primary shadow-card overflow-hidden">
      {/* Header */}
      <div className="bg-gray-900 dark:bg-gray-100 px-6 py-4">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <span className="text-xs text-gray-400 dark:text-gray-500 font-medium">Works with:</span>
            {/* Tool Logos with Tooltips */}
            <div className="flex items-center gap-3">
              {/* Figma */}
              <div className="group relative">
                <img
                  src="/images/logos/figma.svg"
                  alt="Figma"
                  width={20}
                  height={20}
                  className="w-5 h-5 opacity-80 group-hover:opacity-100 transition-opacity invert dark:invert-0"
                />
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-2.5 py-1.5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-xs font-medium rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                  Figma
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 border-4 border-transparent border-b-gray-900 dark:border-b-white"></div>
                </div>
              </div>
              {/* Uizard */}
              <div className="group relative">
                <img
                  src="/images/logos/uizard.jpeg"
                  alt="Uizard"
                  width={20}
                  height={20}
                  className="w-5 h-5 opacity-80 group-hover:opacity-100 transition-opacity rounded"
                />
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-2.5 py-1.5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-xs font-medium rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                  Uizard
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 border-4 border-transparent border-b-gray-900 dark:border-b-white"></div>
                </div>
              </div>
              {/* Cursor */}
              <div className="group relative">
                <img
                  src="/images/logos/cursor.svg"
                  alt="Cursor"
                  width={20}
                  height={20}
                  className="w-5 h-5 opacity-80 group-hover:opacity-100 transition-opacity invert dark:invert-0"
                />
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-2.5 py-1.5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-xs font-medium rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                  Cursor
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 border-4 border-transparent border-b-gray-900 dark:border-b-white"></div>
                </div>
              </div>
              {/* Claude */}
              <div className="group relative">
                <img
                  src="/images/logos/claude.svg"
                  alt="Claude"
                  width={20}
                  height={20}
                  className="w-5 h-5 opacity-80 group-hover:opacity-100 transition-opacity invert dark:invert-0"
                />
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-2.5 py-1.5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-xs font-medium rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                  Claude
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 border-4 border-transparent border-b-gray-900 dark:border-b-white"></div>
                </div>
              </div>
              {/* Gemini */}
              <div className="group relative">
                <img
                  src="/images/logos/simple-icons/googlegemini.svg"
                  alt="Gemini"
                  width={20}
                  height={20}
                  className="w-5 h-5 opacity-80 group-hover:opacity-100 transition-opacity invert dark:invert-0"
                />
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-2.5 py-1.5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-xs font-medium rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                  Gemini
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 border-4 border-transparent border-b-gray-900 dark:border-b-white"></div>
                </div>
              </div>
              {/* Galileo AI */}
              <div className="group relative">
                <div className="w-5 h-5 rounded opacity-80 group-hover:opacity-100 transition-opacity bg-indigo-500 flex items-center justify-center">
                  <span className="text-[10px] font-bold text-white">G</span>
                </div>
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-2.5 py-1.5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-xs font-medium rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                  Galileo AI
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 border-4 border-transparent border-b-gray-900 dark:border-b-white"></div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="px-4 py-2 bg-white hover:bg-gray-100 dark:bg-gray-900 dark:hover:bg-gray-800 text-gray-900 dark:text-white text-sm font-medium rounded-full hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2"
            >
              {copied ? (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-green-600">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  Copied!
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
                  </svg>
                  Copy Prompt
                </>
              )}
            </button>
            {figmaPrompt.figmaFileUrl && (
              <a
                href={figmaPrompt.figmaFileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-white hover:bg-gray-100 dark:bg-gray-900 dark:hover:bg-gray-800 text-gray-900 dark:text-white text-sm font-medium rounded-full hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                  <polyline points="7 10 12 15 17 10"/>
                  <line x1="12" y1="15" x2="12" y2="3"/>
                </svg>
                Download .fig
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Prompt Content */}
      <div className="p-8">
        <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-900 dark:text-gray-200 leading-relaxed font-mono">
            {figmaPrompt.prompt}
          </p>
        </div>

        {/* Customization Tips */}
        <div className="mt-6">
          <h4 className="text-sm font-semibold text-text-primary mb-3 flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-gray-900 dark:text-gray-100"
            >
              <path d="M12 20h9"/>
              <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
            </svg>
            Customization Tips
          </h4>
          <ul className="space-y-2">
            {figmaPrompt.tips.map((tip, index) => (
              <li key={index} className="flex items-start gap-2 text-sm text-text-secondary">
                <span className="text-gray-900 dark:text-gray-100 mt-0.5 flex-shrink-0">•</span>
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Usage Instructions */}
        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
          <details className="group">
            <summary className="cursor-pointer text-sm font-medium text-text-secondary hover:text-text-primary flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="transform group-open:rotate-90 transition-transform"
              >
                <polyline points="9 18 15 12 9 6"/>
              </svg>
              How to use this prompt
            </summary>
            <div className="mt-3 pl-6 text-sm text-text-secondary space-y-2">
              <p><strong>In Figma Make:</strong></p>
              <ol className="list-decimal list-inside space-y-1 ml-2">
                <li>Open Figma and click the "Make" button in the toolbar</li>
                <li>Paste the prompt above into the input field</li>
                <li>Click "Generate" and refine as needed</li>
                <li>Customize the components to match your design system</li>
              </ol>
              <p className="mt-3"><strong>In other AI design tools:</strong> Copy the prompt and use it in tools like Uizard, Visily, or Diagram.</p>
            </div>
          </details>
        </div>

      </div>
    </div>
  );
}
