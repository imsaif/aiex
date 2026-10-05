import { getGuideBySlug } from '@/data/guides';
import { MODULE_TITLES } from '@/lib/guides/modules';
import { resolveStartPoints } from '@/lib/guides/start-points';
import type { Guide } from '@/types';

const lesson = (id: string, title: string, order: number, module = 'setup') => ({
  id,
  title,
  duration: 1,
  order,
  module,
  sections: [],
});

const baseGuide = {
  id: 'g',
  slug: 'demo-course',
  title: 'Demo',
  description: '',
  tool: 'Claude Code',
  useCase: '',
  skillLevel: 'Beginner',
  designDomain: '',
  readTime: 3,
  publishedDate: '2026-01-01',
  status: 'ready',
  content: '',
  lessons: [lesson('lesson-1', 'Sign In', 1), lesson('lesson-7', 'Set Up Figma', 2, 'figma')],
} as unknown as Guide;

describe('resolveStartPoints', () => {
  it('returns nothing for a course without start points', () => {
    expect(resolveStartPoints(baseGuide)).toEqual([]);
  });

  it('links each choice to its lesson URL', () => {
    const guide = {
      ...baseGuide,
      startPoints: [
        { level: 'Beginner', label: 'New', description: 'd1', lessonId: 'lesson-1' },
        { level: 'Intermediate', label: 'Figma', description: 'd2', lessonId: 'lesson-7' },
      ],
    } as Guide;
    expect(resolveStartPoints(guide)).toEqual([
      { level: 'Beginner', label: 'New', description: 'd1', url: '/guides/demo-course/sign-in' },
      {
        level: 'Intermediate',
        label: 'Figma',
        description: 'd2',
        url: '/guides/demo-course/set-up-figma',
      },
    ]);
  });

  it('drops a choice whose lesson no longer exists rather than linking nowhere', () => {
    const guide = {
      ...baseGuide,
      startPoints: [{ level: 'Advanced', label: 'Gone', description: 'd', lessonId: 'lesson-99' }],
    } as Guide;
    expect(resolveStartPoints(guide)).toEqual([]);
  });
});

describe('Claude Code course start points', () => {
  const guide = getGuideBySlug('claude-code-learning-path');

  it('offers all three levels, in order', () => {
    expect(guide?.startPoints?.map((p) => p.level)).toEqual([
      'Beginner',
      'Intermediate',
      'Advanced',
    ]);
  });

  it('every choice resolves to a real lesson', () => {
    expect(resolveStartPoints(guide!)).toHaveLength(guide!.startPoints!.length);
  });

  it('tags every module the course uses, and only those', () => {
    const used = new Set((guide?.lessons || []).map((l) => l.module));
    expect(new Set(Object.keys(guide?.moduleLevels || {}))).toEqual(used);
    for (const key of used) expect(Object.keys(MODULE_TITLES)).toContain(key);
  });
});
