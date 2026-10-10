import fs from 'fs';
import path from 'path';
import { patterns } from '@/data/patterns';
import { BAND_DRAWINGS, BAND_ICONS, DEFAULT_BAND_SLUG, pickBandSlug, bandSlugFromHtml, syncBandIcon } from '../band';
import { monogram, tidyDateLabel, stripIssuePrefix, syncBandTitle, renderDailyEmail } from '../daily-email';

describe('tidyDateLabel', () => {
  it('drops a leading zero from the day', () => {
    expect(tidyDateLabel('Oct 06')).toBe('Oct 6');
  });

  it('leaves other labels alone', () => {
    expect(tidyDateLabel('Oct 16')).toBe('Oct 16');
    expect(tidyDateLabel('via TLDR Design')).toBe('via TLDR Design');
  });
});

describe('band headline', () => {
  it('strips the "AI UX Daily:" prefix', () => {
    expect(stripIssuePrefix('AI UX Daily: Context libraries and agents')).toBe('Context libraries and agents');
    expect(stripIssuePrefix('Microsoft Copilot gets OS access')).toBe('Microsoft Copilot gets OS access');
  });

  const html = renderDailyEmail({
    siteUrl: 'https://example.test',
    dateLabel: 'SAT 10.10.26',
    headline: 'AI UX Daily: Original title',
    idea: { title: 'Idea', body: 'Body.' },
    bandSlug: 'human-in-the-loop',
    bandAlt: 'icon',
    stories: [],
    cta: null,
    pollHtml: '',
  });

  it('renders the stripped title in the band', () => {
    expect(html).toContain('<!--aiux:title-->Original title<!--/aiux:title-->');
  });

  it('rewrites the band headline when the admin retitles the draft', () => {
    const synced = syncBandTitle(html, 'AI UX Daily: Copilot gets OS access & more');
    expect(synced).toContain('<!--aiux:title-->Copilot gets OS access &amp; more<!--/aiux:title-->');
    expect(synced).not.toContain('Original title');
  });

  it('leaves HTML without markers unchanged', () => {
    expect(syncBandTitle('<p>old issue</p>', 'New')).toBe('<p>old issue</p>');
  });
});

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
  it("uses the lead story's pattern first", () => {
    expect(pickBandSlug({ ideaSlug: 'trust-calibration', itemSlugs: ['augmented-creation'] })).toBe('augmented-creation');
  });

  it('skips stories without a pattern', () => {
    expect(pickBandSlug({ itemSlugs: [undefined, 'plan-summary', 'intent-preview'] })).toBe('plan-summary');
  });

  it("falls back to the idea's pattern when no story has one", () => {
    expect(pickBandSlug({ ideaSlug: 'trust-calibration', itemSlugs: [undefined] })).toBe('trust-calibration');
  });

  it('ignores slugs that are not real patterns', () => {
    expect(pickBandSlug({ ideaSlug: 'made-up-pattern', itemSlugs: ['explainable-ai'] })).toBe('explainable-ai');
  });

  it("skips yesterday's icon when another candidate exists", () => {
    expect(
      pickBandSlug({ itemSlugs: ['trust-calibration', 'feedback-loops'], previousSlug: 'trust-calibration' }),
    ).toBe('feedback-loops');
  });

  it("repeats yesterday's drawing rather than show an unrelated one", () => {
    expect(pickBandSlug({ ideaSlug: 'trust-calibration', itemSlugs: [], previousSlug: 'trust-calibration' })).toBe('trust-calibration');
  });

  it('uses the default when nothing in the issue has a pattern', () => {
    expect(pickBandSlug({ itemSlugs: [undefined, undefined] })).toBe(DEFAULT_BAND_SLUG);
  });
});

describe('band icon picker', () => {
  it('names every icon exactly as the pattern registry does', () => {
    const drift = patterns.filter((p) => BAND_ICONS[p.slug] !== p.title).map((p) => `${p.slug}: ${BAND_ICONS[p.slug]} != ${p.title}`);
    expect(drift).toEqual([]);
  });

  const html = renderDailyEmail({
    siteUrl: 'https://example.test',
    dateLabel: 'SAT 10.10.26',
    headline: 'Title',
    idea: { title: 'Idea', body: 'Body.' },
    bandSlug: 'trust-calibration',
    bandAlt: 'Trust Calibration pattern icon',
    stories: [],
    cta: null,
    pollHtml: '',
  });

  it('reads the icon a draft shows', () => {
    expect(bandSlugFromHtml(html)).toBe('trust-calibration');
    expect(bandSlugFromHtml('<p>weekly issue</p>')).toBeNull();
  });

  it('swaps the icon and its alt text', () => {
    const swapped = syncBandIcon(html, 'selective-memory');
    expect(bandSlugFromHtml(swapped)).toBe('selective-memory');
    expect(swapped).toContain('band/selective-memory.png" alt="Selective Memory pattern icon"');
    expect(swapped).not.toContain('trust-calibration');
  });

  it('ignores unknown icons', () => {
    expect(syncBandIcon(html, 'not-a-pattern')).toBe(html);
  });
});
