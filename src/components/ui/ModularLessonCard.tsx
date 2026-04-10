'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { CheckIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
import { GuideLesson } from '@/types';
import { useGuideProgress } from '@/hooks/useGuideProgress';
import { getLessonIcon } from '@/utils/lessonIcons';
import StatusBadge from './StatusBadge';

interface ModularLessonCardProps {
  lesson: GuideLesson;
  lessonNumber: number;
  guideId: string;
  totalLessons: number;
  /**
   * Target URL for the dedicated lesson page. When provided (the default path
   * going forward), the card navigates to the standalone lesson page so the
   * lesson's full content is indexable at its own URL rather than being
   * collapsed inside an accordion.
   */
  href: string;
}

export default function ModularLessonCard({
  lesson,
  href,
  guideId,
}: ModularLessonCardProps) {
  const { isLessonCompleted } = useGuideProgress();
  const isCompleted = isLessonCompleted(guideId, lesson.id);
  const icon = getLessonIcon(lesson.title, lesson.iconType);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
      className="group"
    >
      <Link
        href={href}
        className="block rounded-lg border p-5 bg-surface-primary border-gray-200 dark:border-gray-700 hover:border-accent-primary/40 hover:shadow-md transition-all duration-300"
      >
        <div className="flex items-start gap-4">
          {/* Icon */}
          <div
            className={`flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center transition-all ${
              isCompleted
                ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
                : 'bg-accent-subtle text-accent-primary'
            }`}
          >
            <div className="w-6 h-6 flex items-center justify-center">
              {isCompleted ? <CheckIcon className="w-5 h-5" /> : icon}
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <h3
              className={`font-semibold text-base transition-colors mb-2 ${
                isCompleted ? 'text-text-secondary line-through' : 'text-text-primary'
              } group-hover:text-accent-primary`}
            >
              {lesson.title}
            </h3>

            <div className="flex items-center gap-4 flex-wrap text-sm text-text-secondary">
              <span>{lesson.duration} min</span>
              <span aria-hidden="true">·</span>
              <StatusBadge status={isCompleted ? 'completed' : 'not-started'} />
            </div>
          </div>

          {/* Forward arrow — signals navigation */}
          <div className="flex-shrink-0 mt-1">
            <ArrowRightIcon className="w-5 h-5 text-text-secondary group-hover:text-accent-primary group-hover:translate-x-0.5 transition-all" />
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
