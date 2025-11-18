'use client';

import { motion } from 'framer-motion';

interface TOCItem {
  number: number;
  title: string;
  description: string;
}

const tocItems: TOCItem[] = [
  {
    number: 1,
    title: 'Contextual Assistance',
    description: 'Help users when they\'re actually stuck',
  },
  {
    number: 2,
    title: 'Confidence Visualization',
    description: 'Show certainty levels for AI results',
  },
  {
    number: 3,
    title: 'Error Recovery',
    description: 'Handle AI failures gracefully',
  },
  {
    number: 4,
    title: 'Privacy-First Design',
    description: 'Make users feel safe sharing data',
  },
  {
    number: 5,
    title: 'Explainable AI',
    description: 'Show why AI made each decision',
  },
  {
    number: 6,
    title: 'Progressive Disclosure',
    description: 'Start simple, add power later',
  },
];

export function HandbookTOC() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mb-12"
    >
      {/* Section Header */}
      <p className="text-xs text-text-tertiary font-semibold uppercase tracking-wide mb-6">
        What You'll Get
      </p>

      {/* TOC Content */}
      <div className="space-y-3">
        {/* Patterns List */}
        <div className="space-y-2">
          {tocItems.map((item) => (
            <motion.div
              key={item.number}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: item.number * 0.05 }}
              className="flex items-start gap-3 p-2 hover:bg-gray-800 rounded transition"
            >
              <span className="text-xs font-semibold text-text-tertiary flex-shrink-0">
                {item.number.toString().padStart(2, '0')}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-white truncate">
                  {item.title}
                </p>
                <p className="text-xs text-text-tertiary truncate">
                  {item.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Supporting Content Info */}
        <div className="mt-6 pt-4 border-t border-gray-800 space-y-2 text-xs">
          <div className="flex items-center gap-2 text-text-tertiary">
            <svg className="w-3 h-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>Implementation guidelines for each pattern</span>
          </div>
          <div className="flex items-center gap-2 text-text-tertiary">
            <svg className="w-3 h-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>Real-world examples from Apple, Google, Figma</span>
          </div>
          <div className="flex items-center gap-2 text-text-tertiary">
            <svg className="w-3 h-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>Code examples and Figma design prompts</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
