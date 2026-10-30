jest.mock('@anthropic-ai/sdk', () => jest.fn().mockImplementation(() => ({ messages: { create: jest.fn() } })));

import { buildIssueContext, parseNewsletterStructuredData } from '../content-generator';

// Shape of a daily issue's structuredData since the Oct 2026 redesign.
const daily = {
  title: 'AI UX Daily: Figma ships agent mode',
  summary: 'Two launches and one idea.',
  items: [
    {
      product: 'Figma',
      headline: 'Figma ships agent mode',
      description: 'Agents can edit frames.',
      sourceUrl: 'https://figma.com/blog/agent',
      designerTakeaway: 'Show what the agent changed before it saves.',
    },
  ],
  takeaway: { title: 'Preview before commit', body: 'Every agent edit needs a diff.', patternSlug: 'intent-preview' },
  bandSlug: 'intent-preview',
};

describe('parseNewsletterStructuredData', () => {
  it('reads the Oct 2026 idea object instead of stringifying it', () => {
    const data = parseNewsletterStructuredData(daily)!;
    expect(data.idea).toEqual(daily.takeaway);
    expect(data.takeaway).toBeUndefined();
    expect(data.bandSlug).toBe('intent-preview');
  });

  it('still reads an older plain-string takeaway', () => {
    const data = parseNewsletterStructuredData({ ...daily, takeaway: 'Old takeaway' })!;
    expect(data.takeaway).toBe('Old takeaway');
    expect(data.idea).toBeUndefined();
  });
});

describe('buildIssueContext', () => {
  it("includes each story's Designer's Takeaway and Today's Idea", () => {
    const text = buildIssueContext(parseNewsletterStructuredData(daily)!);
    expect(text).toContain("Designer's Takeaway: Show what the agent changed before it saves.");
    expect(text).toContain("Today's Idea: Preview before commit. Every agent edit needs a diff.");
    expect(text).not.toContain('[object Object]');
  });
});
