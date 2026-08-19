import { relatedGuidesFor, ALL_RELATED_GUIDES } from '../relatedGuides';
import { guides } from '@/data/guides';

/**
 * `relatedGuides.ts` duplicates guide slugs and titles to keep the 8,000-line
 * guides catalogue out of the results bundle. This is the guard that makes the
 * duplication safe: rename or remove a guide and this fails, rather than the
 * audit quietly linking somewhere that 404s.
 */
describe('relatedGuides', () => {
  it('every referenced slug exists in the guides catalogue', () => {
    const known = new Set(guides.map((g) => g.slug));
    for (const g of ALL_RELATED_GUIDES) {
      expect(known.has(g.slug)).toBe(true);
    }
  });

  it('titles match the catalogue, so the card does not show a stale name', () => {
    const bySlug = new Map(guides.map((g) => [g.slug, g.title]));
    for (const g of ALL_RELATED_GUIDES) {
      expect(g.title).toBe(bySlug.get(g.slug));
    }
  });

  it('recommends the conversational guide for chat surfaces', () => {
    const slugs = relatedGuidesFor('chat-interface').map((g) => g.slug);
    expect(slugs).toContain('conversational-ui-guide');
  });

  it('recommends the conversational guide for agent surfaces', () => {
    const slugs = relatedGuidesFor('ai-agent').map((g) => g.slug);
    expect(slugs).toContain('conversational-ui-guide');
  });

  // The pack is the output of every audit, so the skills guide is always
  // relevant even when nothing surface-specific matches.
  it('always includes the skills guide', () => {
    for (const type of ['chat-interface', 'dashboard-analytics', 'general', null] as const) {
      const slugs = relatedGuidesFor(type).map((g) => g.slug);
      expect(slugs).toContain('ai-ux-skills-guide');
    }
  });

  it('does not invent a surface-specific match where none exists', () => {
    expect(relatedGuidesFor('reports-documents').map((g) => g.slug)).toEqual(['ai-ux-skills-guide']);
  });

  it('never returns more than two', () => {
    for (const type of ['chat-interface', 'ai-agent', 'general', null] as const) {
      expect(relatedGuidesFor(type).length).toBeLessThanOrEqual(2);
    }
  });

  it('never repeats a guide', () => {
    for (const type of ['chat-interface', 'ai-agent', 'general', null] as const) {
      const slugs = relatedGuidesFor(type).map((g) => g.slug);
      expect(new Set(slugs).size).toBe(slugs.length);
    }
  });
});
