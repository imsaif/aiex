import type { Guide, GuideLevel } from '@/types';
import { getLessonLinks } from './lesson-urls';
import { getModuleTitle } from './modules';

export interface ResolvedStartPoint {
  level: GuideLevel;
  label: string;
  destination: string; // title of the module the lesson sits in
  url: string;
}

/**
 * The course's "Where are you starting?" choices, each with the URL of the
 * lesson it jumps to and the module that lesson opens. A choice whose lesson
 * was renamed away or deleted is dropped, so the picker never links to a 404.
 */
export function resolveStartPoints(guide: Guide): ResolvedStartPoint[] {
  if (!guide.startPoints?.length || !guide.lessons) return [];

  const links = getLessonLinks(guide);
  const linkById = new Map(guide.lessons.map((lesson, i) => [lesson.id, links[i]]));

  return guide.startPoints.flatMap(({ level, label, lessonId }) => {
    const link = linkById.get(lessonId);
    return link ? [{ level, label, destination: getModuleTitle(link.module), url: link.url }] : [];
  });
}
