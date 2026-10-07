import fs from 'fs';
import path from 'path';
import { patterns } from '@/data/patterns';
import { BAND_DRAWINGS, DEFAULT_BAND_SLUG, pickBandSlug } from '../band';
import { monogram } from '../daily-email';

describe('monogram', () => {
  it('uses the first letter, upper-cased', () => {
    expect(monogram('Instinct')).toBe('I');
    expect(monogram('design with AI')).toBe('D');
  });

  it('skips leading punctuation', () => {
    expect(monogram('"Quoted" source')).toBe('Q');
  });

  it('falls back to a dot when there is nothing to use', () => {
    expect(monogram('—')).toBe('•');
  });
});

describe('band drawings', () => {
  it('has a drawing for every pattern in the catalogue', () => {
    const missing = patterns.map((p) => p.slug).filter((slug) => !BAND_DRAWINGS.has(slug));
    expect(missing).toEqual([]);
  });

  it('has a PNG on disk for every listed drawing', () => {
    const dir = path.join(process.cwd(), 'public/images/newsletter/band');
    const missing = Array.from(BAND_DRAWINGS).filter((slug) => !fs.existsSync(path.join(dir, `${slug}.png`)));
    expect(missing).toEqual([]);
  });
});

describe('pickBandSlug', () => {
  it("uses the idea's pattern first", () => {
    expect(pickBandSlug({ ideaSlug: 'trust-calibration', itemSlugs: ['augmented-creation'] })).toBe('trust-calibration');
  });

  it("falls back to the stories' patterns when the idea is untagged", () => {
    expect(pickBandSlug({ itemSlugs: [undefined, 'plan-summary', 'intent-preview'] })).toBe('plan-summary');
  });

  it('ignores slugs that are not real patterns', () => {
    expect(pickBandSlug({ ideaSlug: 'made-up-pattern', itemSlugs: ['explainable-ai'] })).toBe('explainable-ai');
  });

  it("skips yesterday's drawing when another candidate exists", () => {
    expect(
      pickBandSlug({ ideaSlug: 'trust-calibration', itemSlugs: ['trust-calibration', 'feedback-loops'], previousSlug: 'trust-calibration' }),
    ).toBe('feedback-loops');
  });

  it("repeats yesterday's drawing rather than show an unrelated one", () => {
    expect(pickBandSlug({ ideaSlug: 'trust-calibration', itemSlugs: [], previousSlug: 'trust-calibration' })).toBe('trust-calibration');
  });

  it('uses the default when nothing in the issue has a pattern', () => {
    expect(pickBandSlug({ itemSlugs: [undefined, undefined] })).toBe(DEFAULT_BAND_SLUG);
  });
});
