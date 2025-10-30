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
          <h2 className="text-2xl font-bold text-text-primary">Lessons</h2>
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
