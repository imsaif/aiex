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

  // Get category badge classes
  const getCategoryClasses = (color: string = 'blue') => {
    const colorMap: Record<string, string> = {
      'blue': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
      'green': 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
      'purple': 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
      'orange': 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300',
      'pink': 'bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300',
      'red': 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
      'yellow': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
      'indigo': 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300',
      'teal': 'bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-300',
    };
    return colorMap[color] || colorMap['blue'];
  };

  const category = categories.find(c => c.title === pattern.category);

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
          <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getCategoryClasses(category?.color)}`}>
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
