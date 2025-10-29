'use client';

import { GuideLesson } from '@/types';
import LessonItem from './LessonItem';

interface LessonListProps {
  lessons: GuideLesson[];
  guideId: string;
  guideName: string;
}

export default function LessonList({ lessons, guideId, guideName }: LessonListProps) {
  if (!lessons || lessons.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-text-primary mb-1">Lessons</h2>
          <p className="text-sm text-text-secondary">
            {lessons.length} lesson{lessons.length !== 1 ? 's' : ''} • {lessons.reduce((sum, lesson) => sum + lesson.duration, 0)} minutes total
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {lessons.map((lesson, index) => (
          <LessonItem
            key={lesson.id}
            lesson={lesson}
            lessonNumber={index + 1}
            guideId={guideId}
            totalLessons={lessons.length}
          />
        ))}
      </div>
    </div>
  );
}
