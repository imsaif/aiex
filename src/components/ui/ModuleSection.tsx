'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Cog6ToothIcon,
  LightBulbIcon,
  StarIcon,
  CodeBracketIcon,
  ComputerDesktopIcon,
  ArrowDownTrayIcon,
  UserGroupIcon,
  CheckIcon,
} from '@heroicons/react/24/outline';
import { Github } from '@lobehub/icons';
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
  moduleIcon?: string;
}

const getModuleIcon = (moduleTitle: string, iconType?: string) => {
  const iconProps = { className: 'w-5 h-5', style: { color: '#525252' } };

  // Use provided iconType if available
  if (iconType) {
    switch (iconType) {
      case 'cog':
        return <Cog6ToothIcon {...iconProps} />;
      case 'code':
        return <CodeBracketIcon {...iconProps} />;
      case 'monitor':
        return <ComputerDesktopIcon {...iconProps} />;
      case 'download':
        return <ArrowDownTrayIcon {...iconProps} />;
      case 'user':
        return <UserGroupIcon {...iconProps} />;
      case 'github':
        return <Github size={20} style={{ color: '#525252' }} />;
      case 'check':
        return <CheckIcon {...iconProps} />;
      default:
        break;
    }
  }

  // Fallback to title-based detection
  if (moduleTitle.includes('Setup')) {
    return <Cog6ToothIcon {...iconProps} />;
  } else if (moduleTitle.includes('Prototype')) {
    return <LightBulbIcon {...iconProps} />;
  } else if (moduleTitle.includes('GitHub') || moduleTitle.includes('Git')) {
    return <Github size={20} style={{ color: '#525252' }} />;
  } else if (moduleTitle.includes('Best Practices') || moduleTitle.includes('Practices')) {
    return <StarIcon {...iconProps} />;
  }
  return null;
};

export default function ModuleSection({
  moduleTitle,
  moduleDescription,
  lessons,
  startLessonNumber,
  guideId,
  guideTitle,
  moduleIcon,
}: ModuleSectionProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const {
    getLessonProgress,
  } = useGuideProgress();

  const totalLessons = lessons.length;
  const { completed } = getLessonProgress(guideId, totalLessons);
  const completionPercentage = totalLessons > 0 ? (completed / totalLessons) * 100 : 0;

  return (
    <div className="space-y-4">
      {/* Module Header */}
      <motion.button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full text-left transition-all duration-300"
      >
        <div className="p-5 bg-surface-secondary/50 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 hover:bg-surface-secondary transition-all">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                {getModuleIcon(moduleTitle, moduleIcon) && (
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    {getModuleIcon(moduleTitle, moduleIcon)}
                  </div>
                )}
                <h3 className="text-lg font-semibold text-text-primary">{moduleTitle}</h3>
              </div>
              <p className="text-sm text-text-secondary mb-4">{moduleDescription}</p>

              {/* Module Stats */}
              <div className="flex flex-wrap items-center gap-4">
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
