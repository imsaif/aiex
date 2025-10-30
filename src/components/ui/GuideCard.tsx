'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Guide } from '@/types';
import { useGuideProgress } from '@/hooks/useGuideProgress';
import StatusBadge from './StatusBadge';
import ProgressBar from './ProgressBar';

interface GuideCardProps {
  guide: Guide;
  index?: number;
  allGuides?: Guide[];
}

export default function GuideCard({ guide, index = 0, allGuides = [] }: GuideCardProps) {
  const { isGuideCompleted, getLessonProgress, getGuideStatus } = useGuideProgress();
  const isCompleted = isGuideCompleted(guide.id);

  // Calculate lesson progress
  const totalLessons = guide.lessons?.length || guide.lessonCount || 0;
  const lessonProgress = totalLessons > 0 ? getLessonProgress(guide.id, totalLessons) : { completed: 0, total: 0, percentage: 0 };
  const guideStatus = totalLessons > 0 ? getGuideStatus(guide.id, totalLessons) : 'not-started';

  // Determine if this is a step guide (part of learning path)
  const isStepGuide = guide.slug !== 'claude-code-learning-path-for-designers' && guide.tool === 'Claude Code';
  const stepNumber = isStepGuide ? allGuides.findIndex((g) => g.slug === guide.slug) : null;
  const totalSteps = allGuides.length > 1 ? allGuides.length : null;

  return (
    <motion.div
      initial={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ delay: index * 0.05 }}
    >
      <Link href={`/guides/${guide.slug}`} className="block group h-full">
        <div
          className="bg-surface-primary rounded-xl border border-border-primary
                    hover:border-border-secondary transition-all duration-300 h-full
                    flex flex-col overflow-hidden shadow-sm hover:shadow-md"
        >
          {/* Thumbnail Section */}
          <div className="relative w-full h-40 bg-gradient-to-br from-accent-primary/10 to-accent-primary/5 overflow-hidden flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              className="w-12 h-12 text-accent-primary/40"
            >
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
            </svg>

            {/* Status Badge */}
            {guideStatus !== 'not-started' && (
              <div className="absolute top-2 right-2">
                <StatusBadge status={guideStatus} size="sm" />
              </div>
            )}

            {/* Legacy Completion Badge (if no lessons) */}
            {isCompleted && totalLessons === 0 && (
              <div className="absolute top-2 right-2 bg-green-500 dark:bg-green-600 rounded-full p-1.5 shadow-lg">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="white"
                  className="w-5 h-5"
                >
                  <polyline points="20 6 9 17 4 12" fill="none" stroke="white" strokeWidth="3" />
                </svg>
              </div>
            )}

            {/* Step Badge */}
            {stepNumber !== null && (
              <div className="absolute top-2 left-2 bg-blue-500 dark:bg-blue-600 rounded-lg px-2.5 py-1 text-white text-xs font-semibold shadow-lg">
                Step {stepNumber}/{totalSteps}
              </div>
            )}
          </div>

          {/* Content Section */}
          <div className="p-5 flex-1 flex flex-col">
            {/* Title */}
            <h3 className="text-lg font-semibold text-text-primary mb-2 group-hover:text-accent-primary transition-colors line-clamp-2">
              {guide.title}
            </h3>

            {/* Description */}
            <p className="text-sm text-text-secondary line-clamp-2 flex-grow mb-4">
              {guide.description}
            </p>

            {/* Metadata Badges */}
            <div className="flex flex-wrap items-center gap-2 pt-4 border-t border-border-primary mb-4">
              {/* Tool Badge */}
              <span className="px-3 py-1 rounded-full text-xs bg-accent-subtle text-accent-primary font-medium">
                {guide.tool}
              </span>

              {/* Skill Level Badge */}
              <span className="px-3 py-1 rounded-full text-xs bg-gray-100 dark:bg-gray-800 text-text-secondary font-medium">
                {guide.skillLevel}
              </span>
            </div>

            {/* Lesson Progress */}
            {guideStatus !== 'not-started' && (
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-text-secondary">
                    {lessonProgress.completed} of {totalLessons} lessons
                  </span>
                  <span className="text-xs text-text-secondary">{lessonProgress.percentage}%</span>
                </div>
                <ProgressBar percentage={lessonProgress.percentage} size="sm" showPercentage={false} />
              </div>
            )}

            {/* Footer Info */}
            <div className="flex items-center gap-1 text-xs text-text-secondary">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="w-4 h-4"
              >
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
              {guide.readTime} min read
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
