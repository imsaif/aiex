import Link from 'next/link';
import type { Guide } from '@/types';
import { getLessonsForCourse } from '@/lib/guides/lesson-urls';

interface GuideSidebarProps {
  guide: Guide;
  /** Slug of the currently-open lesson so we can highlight it. */
  currentLessonSlug?: string;
}

// Human-friendly titles for the module keys used in the guides data. Keep in
// sync with the moduleConfig in guides/[slug]/guide-client.tsx.
const MODULE_TITLES: Record<string, string> = {
  setup: 'Setup',
  features: 'Core Features',
  prototype: 'Prototype',
  prototyping: 'Prototyping Workflows',
  collaboration: 'Developer Collaboration',
  github: 'GitHub',
  practices: 'Best Practices',
  figma: 'Figma ↔ Code',
  foundations: 'Foundations',
  building: 'Building',
  advanced: 'Advanced Patterns',
  polish: 'Ship It',
};

/**
 * Left sidebar shown on lesson pages (≥lg breakpoint). Lists every lesson in
 * the course, grouped by module, with the current lesson highlighted. Server
 * component — every link is a real `<a>` so crawlers can follow the whole
 * course structure from any lesson page.
 */
export default function GuideSidebar({
  guide,
  currentLessonSlug,
}: GuideSidebarProps) {
  const lessonLinks = getLessonsForCourse(guide.slug);

  // Group by module in the same order they first appear in the lesson list
  const moduleOrder: string[] = [];
  const lessonsByModule = new Map<string, typeof lessonLinks>();
  for (const link of lessonLinks) {
    const key = link.module || 'lessons';
    if (!lessonsByModule.has(key)) {
      moduleOrder.push(key);
      lessonsByModule.set(key, []);
    }
    lessonsByModule.get(key)!.push(link);
  }

  return (
    <nav
      className="text-sm space-y-6"
      aria-label={`${guide.title} navigation`}
    >
      {/* Course overview link */}
      <div>
        <Link
          href={`/guides/${guide.slug}`}
          className="block font-semibold text-text-primary hover:text-accent-primary transition-colors"
        >
          Overview
        </Link>
      </div>

      {/* Module → lesson list */}
      {moduleOrder.map((moduleKey) => {
        const lessons = lessonsByModule.get(moduleKey) || [];
        const moduleTitle =
          MODULE_TITLES[moduleKey] ||
          moduleKey.charAt(0).toUpperCase() + moduleKey.slice(1);
        return (
          <div key={moduleKey}>
            <p className="text-xs font-semibold uppercase tracking-wide text-text-secondary mb-2">
              {moduleTitle}
            </p>
            <ul className="space-y-1 border-l border-gray-200 dark:border-gray-700">
              {lessons.map((lesson) => {
                const slug = lesson.url.split('/').pop() || '';
                const isCurrent = slug === currentLessonSlug;
                return (
                  <li key={lesson.url}>
                    <Link
                      href={lesson.url}
                      aria-current={isCurrent ? 'page' : undefined}
                      className={`block pl-4 py-1 -ml-px border-l transition-colors ${
                        isCurrent
                          ? 'border-l-accent-primary text-accent-primary font-medium'
                          : 'border-l-transparent text-text-secondary hover:text-text-primary hover:border-l-gray-400'
                      }`}
                    >
                      {lesson.title}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        );
      })}
    </nav>
  );
}
