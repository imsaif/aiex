'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GuideLesson } from '@/types';
import { useGuideProgress } from '@/hooks/useGuideProgress';
import ModularLessonCard from './ModularLessonCard';

interface ModuleSectionProps {
  moduleTitle: string;
  moduleDescription: string;
  lessons: GuideLesson[];
  startLessonNumber: number;
  guideId: string;
  guideTitle: string;
}

export default function ModuleSection({
  moduleTitle,
  moduleDescription,
  lessons,
  startLessonNumber,
  guideId,
  guideTitle,
}: ModuleSectionProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const {
    getLessonProgress,
    getLessonEngagement,
    getTimeSpentDisplay,
  } = useGuideProgress();

  const totalLessons = lessons.length;
  const { completed } = getLessonProgress(guideId, totalLessons);
  const totalDuration = lessons.reduce((sum, lesson) => sum + lesson.duration, 0);
  const completionPercentage = totalLessons > 0 ? (completed / totalLessons) * 100 : 0;

  // Calculate total time spent in this module
  const moduleTotalTimeSpent = lessons.reduce((sum, lesson) => {
    const engagement = getLessonEngagement(guideId, lesson.id);
    return sum + (engagement?.totalTimeSpent || 0);
  }, 0);

  return (
    <div className="space-y-4">
      {/* Module Header */}
      <motion.button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full text-left transition-all duration-300"
      >
        <div className="p-5 bg-surface-secondary/50 rounded-lg border border-border-primary hover:border-border-secondary hover:bg-surface-secondary transition-all">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-semibold text-text-primary mb-2">{moduleTitle}</h3>
              <p className="text-sm text-text-secondary mb-4">{moduleDescription}</p>

              {/* Module Stats */}
              <div className="flex flex-wrap items-center gap-4">

                <div className="flex items-center gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className={`w-4 h-4 ${
                      moduleTotalTimeSpent > 0 ? 'text-accent-primary' : 'text-text-secondary'
                    }`}
                  >
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                  <span className={`text-xs ${
                    moduleTotalTimeSpent > 0
                      ? 'text-accent-primary font-medium'
                      : 'text-text-secondary'
                  }`}>
                    {moduleTotalTimeSpent > 0
                      ? getTimeSpentDisplay(moduleTotalTimeSpent)
                      : `${totalDuration} min`}
                  </span>
                </div>

                {completionPercentage > 0 && (
                  <div className="flex items-center gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      className="w-4 h-4 text-green-600 dark:text-green-400"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <span className="text-xs font-medium text-green-600 dark:text-green-400">
                      {Math.round(completionPercentage)}% complete
                    </span>
                  </div>
                )}
              </div>

              {/* Progress Bar */}
              {completionPercentage > 0 && (
                <div className="mt-3 h-1 bg-surface-primary rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${completionPercentage}%` }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                    className="h-full bg-green-500 dark:bg-green-600"
                  />
                </div>
              )}
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

      {/* Module Lessons */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden space-y-3"
          >
            {lessons.map((lesson, index) => (
              <ModularLessonCard
                key={lesson.id}
                lesson={lesson}
                lessonNumber={startLessonNumber + index}
                guideId={guideId}
                totalLessons={totalLessons}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
