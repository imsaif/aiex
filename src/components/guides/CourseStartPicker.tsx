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
 * "Where are you starting?" on a course page: one row per level, each jumping
 * straight to the lesson that level should begin at. Styled like the lesson
 * rows further down the page so it reads as part of the course, not a banner.
 * Clicks are logged so we can see how many visitors arrive as beginners versus
 * already set up.
 */
export function CourseStartPicker({ courseSlug, startPoints }: CourseStartPickerProps) {
  if (startPoints.length === 0) return null;

  return (
    <section className="mb-12" aria-labelledby="start-here">
      <h2 id="start-here" className="type-eyebrow scroll-mt-24 mb-snug text-text-secondary">
        Where are you starting?
      </h2>
      <ul className="overflow-hidden rounded-card border border-border-primary bg-surface-primary divide-y divide-border-primary">
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
              className="group flex items-center gap-default px-default py-snug transition-colors hover:bg-background-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-accent-primary"
            >
              <span className="type-eyebrow w-28 flex-shrink-0 text-text-secondary">
                {point.level}
              </span>
              <span className="flex-1 text-sm font-medium text-text-primary transition-colors group-hover:text-accent-primary">
                {point.label}
              </span>
              <span className="hidden text-sm text-text-secondary sm:inline">
                {point.destination}
              </span>
              <ArrowRightIcon
                className="h-4 w-4 flex-shrink-0 text-text-secondary transition-colors group-hover:text-accent-primary"
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
