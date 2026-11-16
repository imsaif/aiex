import { TextEncoder } from 'util';

// jsdom leaves out TextEncoder, which every real browser has; encodeOverrides runs in the browser.
Object.assign(globalThis, { TextEncoder });

import { altText, decodeOverrides, DWIC_ARTICLES, DWIC_IMAGES, encodeOverrides, findArticle, mergeText } from '../dwic';

const empathy = DWIC_ARTICLES[0];

describe('dwic social text', () => {
  it('finds the empathy article by slug and nothing for an unknown one', () => {
    expect(findArticle('building-empathy-in-the-terminal')?.title).toBe('Building empathy in the terminal');
    expect(findArticle('nope')).toBeUndefined();
    expect(findArticle(null)).toBeUndefined();
  });

  it('round-trips edits with non-ASCII text through the URL encoding', () => {
    const edits = { coverTitle: 'Empathy — in the terminal “now”', point1Claim: 'It’s £12 + 50%/month' };
    const encoded = encodeOverrides(edits);
    expect(encoded).not.toMatch(/[+/=]/);
    expect(decodeOverrides(encoded)).toEqual(edits);
  });

  it('treats a malformed or missing edit string as no edits', () => {
    expect(decodeOverrides(null)).toEqual({});
    expect(decodeOverrides('%%%not-base64')).toEqual({});
  });

  it('lays edits over the defaults, ignoring unknown keys and non-strings', () => {
    const merged = mergeText(empathy.text, { coverTitle: 'New title', bogus: 'x', cardTitle: 42 });
    expect(merged.coverTitle).toBe('New title');
    expect(merged.cardTitle).toBe(empathy.text.cardTitle);
    expect(merged).not.toHaveProperty('bogus');
  });

  it('caps an edited field so one paste cannot blow up the image', () => {
    expect(mergeText(empathy.text, { coverBody: 'a'.repeat(5000) }).coverBody).toHaveLength(2000);
  });

  it('writes alt text for every image that reflects the edits', () => {
    for (const img of DWIC_IMAGES) expect(altText(img.id, empathy.text).length).toBeGreaterThan(20);
    expect(altText('1', mergeText(empathy.text, { coverTitle: 'Edited' }))).toContain('Edited');
  });
});
