import { resolvePatternSlug } from '../pattern-link';
import { patterns } from '@/data/patterns';

/**
 * The audit's promise is "these gaps become skills you can save". Every save
 * control on the results screen is gated on this resolver returning a slug, so
 * a regression here silently removes the save button rather than erroring.
 */
describe('resolvePatternSlug', () => {
  const sample = patterns[0];
  const other = patterns[1];

  it('resolves an exact pattern title', () => {
    expect(resolvePatternSlug(sample.title)).toBe(sample.slug);
  });

  it('resolves a slug passed as the name', () => {
    expect(resolvePatternSlug(sample.slug)).toBe(sample.slug);
  });

  it('ignores case and punctuation differences', () => {
    expect(resolvePatternSlug(sample.title.toUpperCase())).toBe(sample.slug);
    expect(resolvePatternSlug(`  ${sample.title}!  `.replace(/\s+/g, ' '))).toBe(sample.slug);
  });

  it('prefers a /patterns/<slug> resource over the name', () => {
    expect(
      resolvePatternSlug(sample.title, `https://www.aiuxdesign.guide/patterns/${other.slug}`),
    ).toBe(other.slug);
  });

  it('falls back to the name when the resource is not a pattern URL', () => {
    expect(resolvePatternSlug(sample.title, 'https://example.com/some-article')).toBe(sample.slug);
  });

  it('ignores a resource pointing at a slug that no longer exists', () => {
    expect(resolvePatternSlug(sample.title, '/patterns/deleted-pattern-xyz')).toBe(sample.slug);
  });

  // A model-invented pattern name must return null so the UI hides the save
  // control rather than offering a save that cannot resolve to a skill.
  it('returns null for a name that matches nothing', () => {
    expect(resolvePatternSlug('Totally Invented Pattern Name')).toBeNull();
  });

  it('returns null for an empty name with no resource', () => {
    expect(resolvePatternSlug('')).toBeNull();
  });
});
