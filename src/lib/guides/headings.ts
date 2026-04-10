/**
 * Heading slug + extraction helpers for lesson pages.
 *
 * Used by:
 *  - LessonRenderer — to emit `id` attributes on h2/h3/h4 so anchors work
 *  - OnThisPage — to build the right-sidebar TOC pointing at those anchors
 */

import type { LessonSection } from '@/types/lesson';

/** Stable slug from heading text (same shape as lesson-url slugs). */
export function slugifyHeading(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/['’"`]/g, '')
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}

export interface LessonHeading {
  id: string;
  text: string;
  level: 'h2' | 'h3' | 'h4';
}

/**
 * Walk the lesson sections and pull out every heading with its slug id.
 * Disambiguates duplicate headings within the same lesson by appending `-2`,
 * `-3`, etc. so the in-page anchors remain unique.
 */
export function extractHeadings(sections: LessonSection[]): LessonHeading[] {
  const headings: LessonHeading[] = [];
  const seen = new Map<string, number>();

  for (const section of sections) {
    if (section.type !== 'heading') continue;
    const base = slugifyHeading(section.content);
    if (!base) continue;
    const count = seen.get(base) || 0;
    const id = count === 0 ? base : `${base}-${count + 1}`;
    seen.set(base, count + 1);
    headings.push({ id, text: section.content, level: section.level });
  }

  return headings;
}
