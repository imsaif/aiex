'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { CheckIcon } from '@heroicons/react/24/outline';
import { markLessonDone, readProgress, subscribeProgress, type ProgressMap } from '@/lib/guides/progress';
import { trackAuditEvent } from '@/lib/audit/analytics';

/**
 * Progress in the reader's browser. Everything here renders nothing on the
 * server and on the first client render, then fills in after mount, so server
 * and client markup always agree (no hydration mismatch) and pages without
 * storage just look like they did before.
 */
function useProgress(): ProgressMap | null {
  const [progress, setProgress] = useState<ProgressMap | null>(null);
  useEffect(() => {
    const load = () => setProgress(readProgress());
    load();
    return subscribeProgress(load);
  }, []);
  return progress;
}

/**
 * Put at the end of a lesson. When the reader scrolls it into view, the lesson
 * counts as finished: reaching the end is the closest honest signal we have
 * without asking them to click a button.
 */
export function LessonDoneMarker({ course, lesson, total }: { course: string; lesson: string; total: number }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;
    const observer = new IntersectionObserver((entries) => {
      if (!entries.some((e) => e.isIntersecting)) return;
      observer.disconnect();
      const updated = markLessonDone(course, lesson);
      if (updated) {
        trackAuditEvent('course_lesson_completed', { course, lesson, done: updated.lessons.length, total });
      }
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, [course, lesson, total]);
  return <div ref={ref} aria-hidden className="h-px" />;
}

/** A tick after a finished lesson's name in the rail. */
export function LessonDoneTick({ course, lesson }: { course: string; lesson: string }) {
  const progress = useProgress();
  const done = Boolean(progress?.[course]?.lessons.includes(lesson));
  if (!done) return null;
  return (
    <span className="ml-auto inline-flex shrink-0 items-center text-text-secondary">
      <CheckIcon className="h-3.5 w-3.5" aria-hidden />
      <span className="sr-only">(finished)</span>
    </span>
  );
}

let progressSeenSent = false;

/**
 * "3 of 12 done" under a course name once the reader has finished a lesson.
 * Sits below the name rather than beside it, so it never forces a wrap.
 */
export function CourseProgressCount({ course, total }: { course: string; total: number }) {
  const progress = useProgress();
  const done = Math.min(progress?.[course]?.lessons.length ?? 0, total);
  useEffect(() => {
    if (done > 0 && !progressSeenSent) {
      progressSeenSent = true;
      trackAuditEvent('course_progress_seen', { course, done, total });
    }
  }, [course, done, total]);
  if (done === 0) return null;
  return (
    <span className="mt-1 flex">
      <span className="rounded-pill bg-background-primary px-tight py-px type-caption leading-snug tabular-nums text-text-secondary shadow-card">
        {done} of {total} done
        <span className="sr-only"> lessons finished</span>
      </span>
    </span>
  );
}

export interface ContinueCourse {
  slug: string;
  title: string;
  lessons: Array<{ slug: string; url: string; title: string }>;
}

/**
 * On the Saved page: courses the reader has started and not finished, each
 * with the next unfinished lesson. Shows nothing until there is progress.
 */
export function ContinueLearning({ courses }: { courses: ContinueCourse[] }) {
  const progress = useProgress();
  const inProgress = courses
    .map((c) => {
      const done = new Set(progress?.[c.slug]?.lessons ?? []);
      const nextLesson = c.lessons.find((l) => !done.has(l.slug));
      return { course: c, done: Math.min(done.size, c.lessons.length), nextLesson, updatedAt: progress?.[c.slug]?.updatedAt ?? 0 };
    })
    .filter((x) => x.done > 0 && x.nextLesson)
    .sort((a, b) => b.updatedAt - a.updatedAt);

  const shownRef = useRef(false);
  useEffect(() => {
    if (inProgress.length > 0 && !shownRef.current) {
      shownRef.current = true;
      trackAuditEvent('course_continue_shown', { courses: inProgress.length });
    }
  }, [inProgress.length]);

  if (!progress || inProgress.length === 0) return null;

  return (
    <section className="rounded-card border border-border-primary bg-background-primary p-loose" aria-labelledby="continue-heading">
      <h2 id="continue-heading" className="type-h3 text-text-primary">Continue where you left off</h2>
      <p className="mt-tight text-sm text-text-secondary">Saved in this browser.</p>
      <ul className="mt-default grid gap-snug sm:grid-cols-2">
        {inProgress.map(({ course, done, nextLesson }) => (
          <li key={course.slug}>
            <Link
              prefetch={false}
              href={nextLesson!.url}
              onClick={() => trackAuditEvent('course_continue_clicked', { course: course.slug, done, total: course.lessons.length })}
              className="group block rounded-card border border-border-primary p-default transition-colors hover:bg-background-secondary"
            >
              <span className="flex items-baseline justify-between gap-snug">
                <span className="font-semibold text-text-primary">{course.title}</span>
                <span className="shrink-0 text-sm tabular-nums text-text-secondary">
                  {done} of {course.lessons.length}
                </span>
              </span>
              <span className="mt-tight block h-1.5 overflow-hidden rounded-pill bg-background-tertiary" aria-hidden>
                <span className="block h-full bg-accent-primary" style={{ width: `${(done / course.lessons.length) * 100}%` }} />
              </span>
              <span className="mt-snug block text-sm text-text-secondary">
                Next: <span className="text-text-primary group-hover:text-accent-primary transition-colors">{nextLesson!.title}</span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
