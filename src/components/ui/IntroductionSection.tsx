'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface IntroductionSectionProps {
  title: string;
  description: string;
  content: string;
}

export default function IntroductionSection({
  title,
  description,
  content,
}: IntroductionSectionProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  // Extract plain text preview (remove HTML tags)
  const plainTextContent = content.replace(/<[^>]*>/g, '');
  const preview = plainTextContent.substring(0, 120) + (plainTextContent.length > 120 ? '...' : '');

  return (
    <div className="mb-8">
      {/* Introduction Header */}
      <motion.button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full text-left transition-all duration-300"
      >
        <div className="p-5 bg-surface-secondary/50 rounded-lg border border-border-primary hover:border-border-secondary hover:bg-surface-secondary transition-all">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="w-5 h-5 text-accent-primary flex-shrink-0"
                >
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 16v-4M12 8h.01" />
                </svg>
                <h3 className="text-lg font-semibold text-text-primary">Course Overview</h3>
              </div>
              <p className="text-sm text-text-secondary line-clamp-2">{preview}</p>
            </div>

            {/* Expand Icon */}
            <motion.div
              animate={{ rotate: isExpanded ? 180 : 0 }}
              transition={{ duration: 0.3 }}
              className="flex-shrink-0 mt-1"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="w-5 h-5 text-text-secondary"
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </motion.div>
          </div>
        </div>
      </motion.button>

      {/* Expanded Content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="mt-2 rounded-b-lg bg-surface-primary border border-t-0 border-border-primary p-6">
              <div
                className="text-text-primary leading-relaxed space-y-4
                         prose prose-invert max-w-none
                         [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:mt-6 [&_h2]:mb-3
                         [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:mt-4 [&_h3]:mb-2
                         [&_p]:text-base [&_p]:text-text-secondary
                         [&_ul]:list-disc [&_ul]:list-inside [&_ul]:space-y-2
                         [&_li]:text-text-secondary
                         [&_code]:bg-gray-100 [&_code]:dark:bg-gray-800 [&_code]:px-2 [&_code]:py-1 [&_code]:rounded [&_code]:font-mono [&_code]:text-sm
                         [&_code]:text-gray-900 [&_code]:dark:text-gray-100
                         [&_a]:text-accent-primary [&_a]:hover:text-accent-hover [&_a]:transition-colors"
                dangerouslySetInnerHTML={{
                  __html: content || '<p>Content coming soon...</p>',
                }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
