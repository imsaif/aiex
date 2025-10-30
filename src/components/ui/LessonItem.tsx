'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GuideLesson } from '@/types';
import { useGuideProgress } from '@/hooks/useGuideProgress';
import StatusBadge from './StatusBadge';
import LessonContent from './LessonContent';

interface LessonItemProps {
  lesson: GuideLesson;
  lessonNumber: number;
  guideId: string;
  totalLessons: number;
}

export default function LessonItem({
  lesson,
  lessonNumber,
  guideId,
  totalLessons,
}: LessonItemProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const { isLessonCompleted, markLessonComplete, markLessonIncomplete } = useGuideProgress();
  const isCompleted = isLessonCompleted(guideId, lesson.id);

  const handleToggleComplete = () => {
    if (isCompleted) {
      markLessonIncomplete(guideId, lesson.id);
    } else {
      markLessonComplete(guideId, lesson.id);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="bg-surface-primary rounded-lg border border-border-primary transition-all duration-300 hover:border-border-secondary hover:shadow-md"
    >
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full text-left p-4 flex items-center justify-between group"
      >
        <div className="flex items-center gap-4 flex-1">
          {/* Completion Indicator */}
          <div className="flex-shrink-0">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm transition-all ${
                isCompleted
                  ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                  : 'bg-accent-subtle'
              }`}
            >
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
                <div className="w-2 h-2 rounded-full bg-accent-primary"></div>
              )}
            </div>
          </div>

          {/* Lesson Info */}
          <div className="flex-1 min-w-0">
            <h3
              className={`font-semibold text-base transition-colors ${
                isCompleted ? 'text-text-secondary line-through' : 'text-text-primary'
              } group-hover:text-accent-primary`}
            >
              {lesson.title}
            </h3>
            <div className="flex items-center gap-3 mt-1">
              <span className="text-xs text-text-secondary flex items-center gap-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="w-3.5 h-3.5"
                >
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
                {lesson.duration} min
              </span>
            </div>
          </div>

          {/* Status Badge */}
          <div className="flex-shrink-0">
            <StatusBadge status={isCompleted ? 'completed' : 'not-started'} />
          </div>
        </div>

        {/* Expand/Collapse Icon */}
        <motion.div
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.3 }}
          className="ml-4 flex-shrink-0"
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
      </button>

      {/* Expanded Content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden border-t border-border-primary"
          >
            <LessonContent
              lesson={lesson}
              guideId={guideId}
              isCompleted={isCompleted}
              onToggleComplete={handleToggleComplete}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
