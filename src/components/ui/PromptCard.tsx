'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { CheckIcon, ClipboardDocumentIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
import { Pattern } from '@/types';
import categories from '@/data/categories';

interface PromptCardProps {
  pattern: Pattern;
  index?: number;
}

export default function PromptCard({ pattern, index = 0 }: PromptCardProps) {
  const [copied, setCopied] = useState(false);

  const handleQuickCopy = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (pattern.content.figmaPrompt) {
      try {
        await navigator.clipboard.writeText(pattern.content.figmaPrompt.prompt);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (error) {
        console.error('Failed to copy prompt:', error);
      }
    }
  };

  // No longer using colored chips on listing page

  return (
    <motion.div
      initial={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      className="h-full"
    >
      <Link
        href={`/prompts/${pattern.slug}`}
        className="block bg-surface-primary rounded-xl border border-gray-200 dark:border-gray-700
                   shadow-sm hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-md
                   transition-all h-full flex flex-col"
      >
        {/* Header */}
        <div className="p-6 pb-4">
          <h3 className="text-lg font-semibold text-text-primary mb-3 hover:text-blue-600
                       dark:hover:text-blue-400 transition-colors">
            {pattern.title}
          </h3>
          <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 inline-block">
            {pattern.category}
          </span>
        </div>

        {/* Prompt Preview */}
        <div className="px-6 pb-4 flex-grow">
          <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-3 border border-gray-300 dark:border-gray-600">
            <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-3">
              {pattern.content.figmaPrompt?.prompt}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="p-6 pt-4 border-t border-gray-300 dark:border-gray-600 flex items-center justify-between">
          <button
            onClick={handleQuickCopy}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700/50
                     hover:bg-gray-200 dark:hover:bg-gray-600/50 transition-colors text-sm font-medium
                     text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-600"
          >
            {copied ? (
              <>
                <CheckIcon className="w-4 h-4 text-green-600 dark:text-green-400" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <ClipboardDocumentIcon className="w-4 h-4" />
                <span>Quick Copy</span>
              </>
            )}
          </button>

          <span className="flex items-center gap-1 text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors">
            View Full
            <ArrowRightIcon className="w-4 h-4" />
          </span>
        </div>
      </Link>
    </motion.div>
  );
}
