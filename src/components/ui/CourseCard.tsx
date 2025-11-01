'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Claude, Cursor, Github, Replit, V0, Copilot } from '@lobehub/icons';
import { Course } from '@/types';
import { useGuideProgress } from '@/hooks/useGuideProgress';
import StatusBadge from './StatusBadge';
import ProgressBar from './ProgressBar';

interface CourseCardProps {
  course: Course;
  index?: number;
}

export default function CourseCard({ course, index = 0 }: CourseCardProps) {
  const {
    getLessonProgress,
    getGuideStatus,
    getGuideTotalTimeSpent,
    getTimeSpentDisplay,
  } = useGuideProgress();

  // Calculate course progress based on all lessons
  const totalLessons = course.lessons?.length || 0;
  const lessonProgress = totalLessons > 0 ? getLessonProgress(course.id, totalLessons) : { completed: 0, total: 0, percentage: 0 };
  const courseStatus = totalLessons > 0 ? getGuideStatus(course.id, totalLessons) : 'not-started';

  // Get the appropriate icon for the course
  const getIcon = () => {
    const iconProps = { size: 56 };
    switch (course.tool?.toLowerCase()) {
      case 'claude code':
        return <div style={{ color: '#D97757' }}><Claude {...iconProps} /></div>;
      case 'cursor':
        return <div style={{ color: '#000' }}><Cursor {...iconProps} /></div>;
      case 'github':
        return <div style={{ color: '#000' }}><Github {...iconProps} /></div>;
      case 'github copilot':
        return <Copilot.Color {...iconProps} />;
      case 'replit ai':
      case 'replit':
        return <div style={{ color: '#FD5402' }}><Replit {...iconProps} /></div>;
      case 'v0 by vercel':
      case 'v0':
        return <div style={{ color: '#000' }}><V0 {...iconProps} /></div>;
      default:
        return null;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ delay: index * 0.05 }}
    >
      <Link href={`/guides/${course.slug}`} className="block group h-full">
        <div
          className="bg-surface-primary rounded-xl border border-gray-200 shadow-sm
                    hover:border-gray-300 transition-all duration-300 h-full
                    flex flex-col overflow-hidden hover:shadow-md"
        >
          {/* Thumbnail Section */}
          <div className="relative w-full h-40 bg-gradient-to-br from-accent-primary/10 to-accent-primary/5 overflow-hidden flex items-center justify-center group">
            <div className="grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-300">
              {getIcon()}
            </div>

            {/* Status Badge */}
            {courseStatus !== 'not-started' && (
              <div className="absolute top-2 right-2">
                <StatusBadge status={courseStatus} size="sm" />
              </div>
            )}

          </div>

          {/* Content Section */}
          <div className="p-5 flex-1 flex flex-col">
            {/* Title */}
            <h3 className="text-lg font-semibold text-text-primary mb-2 group-hover:text-accent-primary transition-colors line-clamp-2">
              {course.title}
            </h3>

            {/* Description */}
            <p className="text-sm text-text-secondary line-clamp-2 flex-grow mb-4">
              {course.description}
            </p>

            {/* Metadata Badges */}
            <div className="flex flex-wrap items-center gap-2 pt-4 border-t border-gray-300 mb-4">
              {/* Skill Level Badge */}
              <span className="px-3 py-1 rounded-full text-xs bg-gray-100 dark:bg-gray-800 text-text-secondary font-medium">
                {course.skillLevel}
              </span>
            </div>

            {/* Lesson Progress */}
            {courseStatus !== 'not-started' && (
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

          </div>
        </div>
      </Link>
    </motion.div>
  );
}
