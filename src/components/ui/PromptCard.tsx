'use client';

import { useState } from 'react';
import Link from 'next/link';
import { CheckIcon, ClipboardDocumentIcon, ArrowRightIcon } from '@heroicons/react/24/outline';

interface PromptItem {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: string;
  prompt: string;
}

interface PromptCardProps {
  prompt: PromptItem;
}

export default function PromptCard({ prompt }: PromptCardProps) {
  const [copied, setCopied] = useState(false);

  const handleQuickCopy = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      await navigator.clipboard.writeText(prompt.prompt);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy prompt:', error);
    }
  };

  return (
    <div className="h-full hover:-translate-y-1 transition-transform duration-200">
      <Link
        href={`/prompts/${prompt.slug}`}
        className="block bg-surface-primary rounded-2xl border border-gray-200 dark:border-gray-700
                   shadow-card hover:border-gray-200 dark:hover:border-gray-600 hover:shadow-card-hover
                   transition-all h-full flex flex-col"
      >
        {/* Header */}
        <div className="p-8 pb-4">
          <h3 className="text-lg font-semibold text-text-primary mb-3 hover:text-accent-primary
                       transition-colors">
            {prompt.title}
          </h3>
          <span className="px-3 py-1.5 rounded-full text-sm font-medium bg-surface-secondary text-text-secondary inline-block">
            {prompt.category}
          </span>
        </div>

        {/* Prompt Preview */}
        <div className="px-8 pb-4 flex-grow">
          <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-3 border border-gray-300 dark:border-gray-600">
            <p className="text-sm text-text-secondary line-clamp-3">
              {prompt.prompt}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="p-8 pt-4 border-t border-gray-300 dark:border-gray-600 flex items-center justify-between">
          <button
            onClick={handleQuickCopy}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-gray-100 dark:bg-gray-700/50
                     hover:bg-gray-200 dark:hover:bg-gray-600/50 hover:scale-[1.02] active:scale-[0.98]
                     transition-all text-sm font-medium text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-600"
          >
            {copied ? (
              <>
                <CheckIcon className="w-4 h-4 text-status-success" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <ClipboardDocumentIcon className="w-4 h-4" />
                <span>Quick Copy</span>
              </>
            )}
          </button>

          <span className="flex items-center gap-1 text-sm font-medium text-accent-primary hover:text-accent-hover transition-colors">
            View Full
            <ArrowRightIcon className="w-4 h-4" />
          </span>
        </div>
      </Link>
    </div>
  );
}
