'use client';

import Link from 'next/link';
import { ArrowRightIcon } from '@heroicons/react/24/outline';
import { trackAuditEvent } from '@/lib/audit/analytics';
import type { ResolvedStartPoint } from '@/lib/guides/start-points';

interface CourseStartPickerProps {
  courseSlug: string;
  startPoints: ResolvedStartPoint[];
}

/**
 * "Where are you starting?" on a course page: one link per level, each jumping
 * straight to the lesson that level should begin at. Clicks are logged so we
 * can see how many visitors arrive as beginners versus already set up.
 */
export function CourseStartPicker({ courseSlug, startPoints }: CourseStartPickerProps) {
  if (startPoints.length === 0) return null;

  return (
    <section className="mb-12" aria-labelledby="start-here">
      <h2 id="start-here" className="scroll-mt-24 text-2xl md:text-3xl font-bold mb-4">
        Where are you starting?
      </h2>
      <ul className="grid gap-snug sm:grid-cols-3">
        {startPoints.map((point) => (
          <li key={point.level}>
            <Link
              href={point.url}
              onClick={() =>
                trackAuditEvent('course_start_point_clicked', {
                  course: courseSlug,
                  level: point.level,
                })
              }
              className="group flex h-full flex-col rounded-card border border-border-primary bg-surface-primary p-loose transition-colors hover:border-accent-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary focus-visible:ring-offset-2"
            >
              <span className="type-eyebrow text-text-secondary">{point.level}</span>
              <span className="mt-tight font-semibold text-text-primary group-hover:text-accent-primary transition-colors">
                {point.label}
              </span>
              <span className="mt-tight flex-1 text-sm text-text-secondary">
                {point.description}
              </span>
              <ArrowRightIcon
                className="mt-snug h-4 w-4 text-text-secondary group-hover:text-accent-primary transition-colors"
                aria-hidden="true"
              />
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default CourseStartPicker;
