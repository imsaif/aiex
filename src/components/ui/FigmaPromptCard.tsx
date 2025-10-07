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
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div className="bg-purple-100 dark:bg-purple-900/30 p-2 rounded-lg">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-purple-600 dark:text-purple-400"
              >
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                <path d="M7 7h10"/>
                <path d="M7 12h10"/>
                <path d="M7 17h10"/>
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Design This Pattern
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Copy this prompt to use in Figma Make or other AI design tools
              </p>
            </div>
          </div>
          {figmaPrompt.figmaFileUrl && (
            <a
              href={figmaPrompt.figmaFileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium rounded-lg transition-colors flex items-center gap-2"
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

      {/* Prompt Content */}
      <div className="p-6">
        <div className="relative">
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 pr-12 border border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
              {figmaPrompt.prompt}
            </p>
          </div>
          <button
            onClick={handleCopy}
            className="absolute top-2 right-2 p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors group"
            title="Copy to clipboard"
          >
            {copied ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-green-600"
              >
                <polyline points="20 6 9 17 4 12"/>
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-gray-500 group-hover:text-gray-700 dark:text-gray-400 dark:group-hover:text-gray-200"
              >
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
              </svg>
            )}
          </button>
        </div>

        {/* Customization Tips */}
        <div className="mt-6">
          <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
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
              className="text-blue-600 dark:text-blue-400"
            >
              <path d="M12 20h9"/>
              <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
            </svg>
            Customization Tips
          </h4>
          <ul className="space-y-2">
            {figmaPrompt.tips.map((tip, index) => (
              <li key={index} className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
                <span className="text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0">•</span>
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Usage Instructions */}
        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
          <details className="group">
            <summary className="cursor-pointer text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 flex items-center gap-2">
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
            <div className="mt-3 pl-6 text-sm text-gray-600 dark:text-gray-400 space-y-2">
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
