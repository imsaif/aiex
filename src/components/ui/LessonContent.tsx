'use client';

import { GuideLesson } from '@/types';
import LessonRenderer from './LessonRenderer';
import { LessonSection } from '@/types/lesson';

interface LessonContentProps {
  lesson: GuideLesson;
  guideId: string;
  isCompleted: boolean;
  onToggleComplete: () => void;
}

export default function LessonContent({
  lesson,
  isCompleted,
  onToggleComplete,
}: LessonContentProps) {
  return (
    <div className="p-6 bg-surface-secondary/50">
      {/* Lesson Content */}
      <div className="mb-6 text-text-primary leading-relaxed">
        {lesson.sections && lesson.sections.length > 0 ? (
          // New structured format with LessonRenderer
          <LessonRenderer sections={lesson.sections as LessonSection[]} />
        ) : (
          // Legacy HTML string format
          <div
            className="prose prose-sm dark:prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: lesson.content || '<p>Content coming soon...</p>' }}
          />
        )}
      </div>

      {/* Completion Checkbox */}
      <div className="flex items-center gap-3 pt-6 border-t border-gray-300">
        <button
          onClick={onToggleComplete}
          className="flex items-center gap-3 group cursor-pointer"
        >
          <div
            className={`w-6 h-6 rounded border-2 flex items-center justify-center transition-all ${
              isCompleted
                ? 'bg-green-500 border-green-500'
                : 'border-gray-300 group-hover:border-accent-primary'
            }`}
          >
            {isCompleted && (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="white"
                className="w-4 h-4"
              >
                <polyline points="20 6 9 17 4 12" fill="none" stroke="white" strokeWidth="3" />
              </svg>
            )}
          </div>
          <span className={`text-sm font-medium transition-colors ${
            isCompleted
              ? 'text-green-600 dark:text-green-400'
              : 'text-text-secondary group-hover:text-text-primary'
          }`}>
            {isCompleted ? 'Lesson completed' : 'Mark as complete'}
          </span>
        </button>
      </div>
    </div>
  );
}
