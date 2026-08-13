import { guides, getGuideBySlug } from '@/data/guides';
import { MODULE_TITLES } from '@/lib/guides/modules';
import patterns from '@/data/patterns';

/**
 * Guards the "Using AI UX Skills with Claude Code" guide shipped alongside
 * the /skills and /dashboard cross-links. Catches drift between the guide's
 * declared readTime/lessonCount and its actual lesson data, module keys that
 * don't resolve to a title, and relatedPatterns slugs that don't exist.
 */
describe('ai-ux-skills-guide', () => {
  const guide = getGuideBySlug('ai-ux-skills-guide');

  it('exists in the guides registry', () => {
    expect(guide).not.toBeNull();
  });

  it('has exactly 4 lessons', () => {
    expect(guide?.lessons).toHaveLength(4);
  });

  it('readTime matches the summed lesson durations', () => {
    const total = (guide?.lessons || []).reduce(
      (sum, lesson) => sum + (lesson.duration || 0),
      0
    );
    expect(guide?.readTime).toBe(total);
  });

  it('every lesson module key resolves to a known module title', () => {
    for (const lesson of guide?.lessons || []) {
      expect(Object.keys(MODULE_TITLES)).toContain(lesson.module);
    }
  });

  it('every relatedPatterns slug exists in the pattern registry', () => {
    const patternSlugs = new Set(patterns.map((p) => p.slug));
    for (const slug of guide?.relatedPatterns || []) {
      expect(patternSlugs.has(slug)).toBe(true);
    }
  });

  it('is present in the exported guides array', () => {
    expect(guides.some((g) => g.slug === 'ai-ux-skills-guide')).toBe(true);
  });
});
