'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GuideLesson } from '@/types';
import { useGuideProgress } from '@/hooks/useGuideProgress';
import { getLessonIcon } from '@/utils/lessonIcons';
import LessonContent from './LessonContent';
import StatusBadge from './StatusBadge';

interface ModularLessonCardProps {
  lesson: GuideLesson;
  lessonNumber: number;
  guideId: string;
  totalLessons: number;
}

export default function ModularLessonCard({
  lesson,
  lessonNumber,
  guideId,
  totalLessons,
}: ModularLessonCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const {
    isLessonCompleted,
    markLessonComplete,
    markLessonIncomplete,
  } = useGuideProgress();
  const isCompleted = isLessonCompleted(guideId, lesson.id);

  const handleToggleComplete = () => {
    if (isCompleted) {
      markLessonIncomplete(guideId, lesson.id);
    } else {
      markLessonComplete(guideId, lesson.id);
    }
  };

  const icon = getLessonIcon(lesson.title, lesson.iconType);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
      className="group"
    >
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={`w-full text-left transition-all duration-300 rounded-lg border p-5 ${
          isExpanded
            ? 'bg-surface-primary border-border-secondary shadow-md'
            : 'bg-surface-primary border-border-primary hover:border-border-secondary hover:shadow-md'
        }`}
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
              {isCompleted ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  className="w-5 h-5"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              ) : (
                icon
              )}
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

            <div className="flex items-center gap-4 flex-wrap">
              {/* Status Badge */}
              <StatusBadge status={isCompleted ? 'completed' : 'not-started'} />
            </div>
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
              className="w-5 h-5 text-text-secondary group-hover:text-text-primary transition-colors"
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </motion.div>
        </div>
      </button>

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
            <div className="mt-2 rounded-b-lg bg-surface-primary border border-t-0 border-border-primary">
              <LessonContent
                lesson={lesson}
                guideId={guideId}
                isCompleted={isCompleted}
                onToggleComplete={handleToggleComplete}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
