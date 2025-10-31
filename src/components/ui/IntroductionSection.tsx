'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpenIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import LessonRenderer from './LessonRenderer';
import { LessonSection } from '@/types/lesson';

interface IntroductionSectionProps {
  title: string;
  description: string;
  content?: string; // Legacy HTML string format
  sections?: LessonSection[]; // New structured format
}

export default function IntroductionSection({
  title,
  description,
  content,
  sections,
}: IntroductionSectionProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  // Extract plain text preview (remove HTML tags)
  let preview = '';
  if (content) {
    const plainTextContent = content.replace(/<[^>]*>/g, '');
    preview = plainTextContent.substring(0, 120) + (plainTextContent.length > 120 ? '...' : '');
  } else if (sections && sections.length > 0) {
    // For structured sections, get preview from first text section
    const firstText = sections.find(s => s.type === 'text' || s.type === 'intro');
    if (firstText && 'content' in firstText) {
      preview = firstText.content.substring(0, 120) + (firstText.content.length > 120 ? '...' : '');
    }
  }

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
                <BookOpenIcon className="w-5 h-5 text-accent-primary flex-shrink-0" />
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
              <ChevronDownIcon className="w-5 h-5 text-text-secondary" />
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
            <div className="mt-2 rounded-b-lg bg-surface-primary border border-t-0 border-border-primary p-8">
              {/* Visual separator at the top */}
              <div className="h-px bg-gradient-to-r from-accent-primary/0 via-accent-primary/20 to-accent-primary/0 mb-8" />

              {sections ? (
                // New structured format with LessonRenderer
                <div className="space-y-8">
                  <LessonRenderer sections={sections} />
                </div>
              ) : (
                // Legacy HTML string format with improved hierarchy
                <div
                  className="text-text-primary leading-relaxed space-y-8
                           prose prose-invert max-w-none
                           [&_h1]:text-3xl [&_h1]:font-bold [&_h1]:mt-0 [&_h1]:mb-4 [&_h1]:text-accent-primary
                           [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:mt-10 [&_h2]:mb-4 [&_h2]:text-text-primary [&_h2]:border-b [&_h2]:border-border-primary [&_h2]:pb-3
                           [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:mt-8 [&_h3]:mb-3 [&_h3]:text-text-primary
                           [&_h4]:text-lg [&_h4]:font-semibold [&_h4]:mt-6 [&_h4]:mb-2 [&_h4]:text-text-secondary
                           [&_p]:text-base [&_p]:text-text-secondary [&_p]:mb-4 [&_p]:leading-relaxed
                           [&_strong]:font-semibold [&_strong]:text-text-primary
                           [&_em]:italic [&_em]:text-text-secondary
                           [&_ul]:list-disc [&_ul]:list-inside [&_ul]:space-y-3 [&_ul]:my-4 [&_ul]:pl-2
                           [&_ol]:list-decimal [&_ol]:list-inside [&_ol]:space-y-3 [&_ol]:my-4 [&_ol]:pl-2
                           [&_li]:text-text-secondary [&_li]:mb-2
                           [&_blockquote]:border-l-4 [&_blockquote]:border-accent-primary/50 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-text-secondary [&_blockquote]:my-4 [&_blockquote]:py-2
                           [&_code]:bg-gray-100 [&_code]:dark:bg-gray-800 [&_code]:px-2 [&_code]:py-1 [&_code]:rounded [&_code]:font-mono [&_code]:text-sm
                           [&_code]:text-gray-900 [&_code]:dark:text-gray-100 [&_code]:whitespace-nowrap
                           [&_pre]:bg-gray-900 [&_pre]:dark:bg-gray-950 [&_pre]:p-4 [&_pre]:rounded-lg [&_pre]:overflow-x-auto [&_pre]:my-4
                           [&_pre_code]:bg-transparent [&_pre_code]:px-0 [&_pre_code]:py-0 [&_pre_code]:text-gray-200
                           [&_hr]:border-border-primary [&_hr]:my-8
                           [&_table]:w-full [&_table]:border-collapse [&_table]:my-4
                           [&_th]:bg-surface-secondary [&_th]:text-text-primary [&_th]:font-semibold [&_th]:px-4 [&_th]:py-2 [&_th]:text-left [&_th]:border [&_th]:border-border-primary
                           [&_td]:px-4 [&_td]:py-2 [&_td]:border [&_td]:border-border-primary [&_td]:text-text-secondary
                           [&_a]:text-accent-primary [&_a]:hover:text-accent-hover [&_a]:transition-colors [&_a]:underline"
                  dangerouslySetInnerHTML={{
                    __html: content || '<p>Content coming soon...</p>',
                  }}
                />
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
