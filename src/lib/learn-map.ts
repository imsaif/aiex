/**
 * Resolves Learn Map references to renderable data.
 *
 * SERVER ONLY — this module pulls in the full pattern registry (38 modules) and
 * `src/data/guides.ts` (421 KB). It must never appear in a module graph reachable
 * from a `'use client'` boundary. Map components carry no `'use client'`
 * directive; any client leaf receives resolved primitives as props, never a
 * `Pattern`, `Guide` or `LearnSection` object. Copy that quotes a pattern count
 * uses `PATTERN_COUNT` from `@/data/pattern-count`, never `patterns.length`.
 *
 * Unresolvable references THROW rather than rendering a placeholder card. /guides
 * is statically generated, so a dead slug fails the build with the slug named.
 */

import { guides, getGuideBySlug } from '@/data/guides';
import patterns from '@/data/patterns';
import type { LearnItemRef, LearnSection } from '@/data/learn-map';

export interface ResolvedLearnItem {
  href: string;
  title: string;
  description: string;
  /** 'Course' | 'Pattern' | 'Kit' | 'Checklist' */
  badge: string;
  /**
   * Minutes. Usually absent: only Guide.readTime and GuideLesson.duration exist
   * in the data. Patterns have no read time and inventing one would be exactly
   * the drift that reference-by-slug exists to prevent.
   */
  readTime?: number;
  /** Lesson count, courses only. */
  lessonCount?: number;
}

export interface ResolvedLearnSection extends Omit<LearnSection, 'items'> {
  items: ResolvedLearnItem[];
}

export function resolveLearnItem(ref: LearnItemRef): ResolvedLearnItem {
  if (ref.kind === 'resource') {
    return {
      href: ref.href,
      title: ref.title,
      description: ref.blurb,
      badge: ref.badge,
    };
  }

  if (ref.kind === 'course') {
    const guide = getGuideBySlug(ref.slug);
    if (!guide) {
      throw new Error(`learn-map: unknown course slug "${ref.slug}"`);
    }
    return {
      href: `/guides/${guide.slug}`,
      title: guide.title,
      description: ref.blurb ?? guide.excerpt ?? guide.description,
      badge: 'Course',
      readTime: guide.readTime,
      lessonCount: guide.lessonCount ?? guide.lessons?.length,
    };
  }

  const pattern = patterns.find((p) => p.slug === ref.slug);
  if (!pattern) {
    throw new Error(`learn-map: unknown pattern slug "${ref.slug}"`);
  }
  return {
    href: `/patterns/${pattern.slug}`,
    title: pattern.title,
    description: ref.blurb ?? pattern.description,
    badge: 'Pattern',
  };
}

export function resolveLearnSection(section: LearnSection): ResolvedLearnSection {
  return { ...section, items: section.items.map(resolveLearnItem) };
}

/** Every course, for the "All courses" section below the map. */
export function allCourses() {
  return guides;
}
