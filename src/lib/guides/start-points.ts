import type { Guide, GuideLevel } from '@/types';
import { getLessonLinks } from './lesson-urls';

export interface ResolvedStartPoint {
  level: GuideLevel;
  label: string;
  description: string;
  url: string;
}

/**
 * The course's "Where are you starting?" choices, each with the URL of the
 * lesson it jumps to. A choice whose lesson was renamed away or deleted is
 * dropped, so the picker never links to a 404.
 */
export function resolveStartPoints(guide: Guide): ResolvedStartPoint[] {
  if (!guide.startPoints?.length || !guide.lessons) return [];

  const links = getLessonLinks(guide);
  const urlById = new Map(guide.lessons.map((lesson, i) => [lesson.id, links[i]?.url]));

  return guide.startPoints.flatMap(({ level, label, description, lessonId }) => {
    const url = urlById.get(lessonId);
    return url ? [{ level, label, description, url }] : [];
  });
}
