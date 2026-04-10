/**
 * Lesson URL helpers
 *
 * The site exposes each lesson in each guide as its own indexable URL:
 *   /guides/{course-slug}/{lesson-slug}
 *
 * Lesson slugs are derived from lesson titles (kebab-case) because the raw
 * lesson IDs in `guides.ts` ("lesson-1", "lesson-2", ...) are not SEO-friendly
 * and collide across courses.
 */

import { guides } from '@/data/guides';
import type { Guide, GuideLesson } from '@/types';

/** Convert an arbitrary lesson title into a stable URL slug. */
export function slugifyLessonTitle(title: string): string {
  return title
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '') // strip diacritics
    .replace(/['’"`]/g, '') // strip quotes/apostrophes
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}

/** Every (course, lesson) pair the site should build. */
export interface LessonParamPair {
  course: string;
  lesson: string;
}

export function getAllLessonParams(): LessonParamPair[] {
  const pairs: LessonParamPair[] = [];
  const seen = new Set<string>();
  for (const guide of guides) {
    if (!guide.lessons || guide.lessons.length === 0) continue;
    const perCourse = new Set<string>();
    for (const lesson of guide.lessons) {
      let slug = slugifyLessonTitle(lesson.title);
      // Disambiguate collisions within the same course by appending the order
      if (perCourse.has(slug)) {
        slug = `${slug}-${lesson.order}`;
      }
      perCourse.add(slug);
      const key = `${guide.slug}/${slug}`;
      if (seen.has(key)) continue;
      seen.add(key);
      pairs.push({ course: guide.slug, lesson: slug });
    }
  }
  return pairs;
}

/**
 * Resolve a (course, lesson) param pair back to the underlying guide + lesson.
 * Returns `null` if either the course or the lesson slug is unknown.
 */
export interface ResolvedLesson {
  guide: Guide;
  lesson: GuideLesson;
  lessonSlug: string;
  lessonIndex: number; // 0-based index within the guide's lesson list
}

export function getLessonBySlug(
  courseSlug: string,
  lessonSlug: string
): ResolvedLesson | null {
  const guide = guides.find((g) => g.slug === courseSlug);
  if (!guide || !guide.lessons) return null;

  // Walk with the same disambiguation logic used by getAllLessonParams so the
  // slugs are stable between build-time and request-time.
  const perCourse = new Set<string>();
  for (let i = 0; i < guide.lessons.length; i++) {
    const lesson = guide.lessons[i];
    let slug = slugifyLessonTitle(lesson.title);
    if (perCourse.has(slug)) {
      slug = `${slug}-${lesson.order}`;
    }
    perCourse.add(slug);
    if (slug === lessonSlug) {
      return { guide, lesson, lessonSlug: slug, lessonIndex: i };
    }
  }
  return null;
}

/** Lightweight lesson descriptor used by course overviews + prev/next nav. */
export interface LessonLink {
  title: string;
  url: string;
  duration: number;
  module?: string;
  order: number;
}

/** Enumerate every lesson in a course with its resolved URL. */
export function getLessonsForCourse(courseSlug: string): LessonLink[] {
  const guide = guides.find((g) => g.slug === courseSlug);
  if (!guide || !guide.lessons) return [];

  const perCourse = new Set<string>();
  return guide.lessons.map((lesson) => {
    let slug = slugifyLessonTitle(lesson.title);
    if (perCourse.has(slug)) {
      slug = `${slug}-${lesson.order}`;
    }
    perCourse.add(slug);
    return {
      title: lesson.title,
      url: `/guides/${guide.slug}/${slug}`,
      duration: lesson.duration,
      module: lesson.module,
      order: lesson.order,
    };
  });
}

/** Find the previous/next lesson within the same course (null at boundaries). */
export interface LessonNeighbors {
  previous: LessonLink | null;
  next: LessonLink | null;
}

export function getLessonNeighbors(
  courseSlug: string,
  lessonIndex: number
): LessonNeighbors {
  const lessons = getLessonsForCourse(courseSlug);
  return {
    previous: lessonIndex > 0 ? lessons[lessonIndex - 1] : null,
    next: lessonIndex < lessons.length - 1 ? lessons[lessonIndex + 1] : null,
  };
}
