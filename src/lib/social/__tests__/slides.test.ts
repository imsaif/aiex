jest.mock('@anthropic-ai/sdk', () => jest.fn().mockImplementation(() => ({ messages: { create: jest.fn() } })));

import { buildSlides, clip, cleanIssueTitle, SLIDE_COUNT } from '../slides';
import { parseNewsletterStructuredData } from '../content-generator';

const issue = parseNewsletterStructuredData({
  title: 'AI UX Daily: Figma ships agent mode — and Notion follows',
  summary: 'Two agent launches 🚀 and one idea about previews.',
  items: [
    { product: 'Figma', headline: 'Figma ships agent mode', description: '', sourceUrl: '', designerTakeaway: 'Show the diff.' },
    { product: 'Notion', headline: 'Notion agents edit pages', description: '', sourceUrl: '' },
  ],
  takeaway: { title: 'Preview before commit', body: 'Every agent edit needs a diff the user can reject.' },
})!;

const slides = buildSlides(issue, { dateLabel: 'Oct 30, 2026' });

describe('buildSlides', () => {
  it('makes four slides in order: cover, stories, idea, link', () => {
    expect(slides.map((s) => s.kind)).toEqual(['cover', 'stories', 'idea', 'link']);
    expect(slides).toHaveLength(SLIDE_COUNT);
  });

  it('cleans the copy it shows: no prefix, no em dash, no emoji', () => {
    const cover = slides[0];
    expect(cover.kind === 'cover' && cover.title).toBe('Figma ships agent mode, and Notion follows');
    expect(cover.kind === 'cover' && cover.summary).toBe('Two agent launches and one idea about previews.');
  });

  it("uses Today's Idea on slide 3", () => {
    expect(slides[2]).toMatchObject({ label: "Today's idea", title: 'Preview before commit' });
  });

  it('gives every slide alt text that carries its words', () => {
    for (const slide of slides) expect(slide.alt.length).toBeGreaterThan(20);
    expect(slides[1].alt).toContain('1. Figma: Figma ships agent mode');
    expect(slides[3].alt).toContain('aiuxdesign.guide/news');
  });
});

describe('clip', () => {
  it('cuts at a word, never mid-word', () => {
    expect(clip('Agents need supervision interfaces now', 20)).toBe('Agents need...');
  });

  it('leaves short text alone', () => {
    expect(clip('Short.', 20)).toBe('Short.');
  });
});

describe('cleanIssueTitle', () => {
  it('drops the edition prefix', () => {
    expect(cleanIssueTitle('AI UX Weekly: The agent week')).toBe('The agent week');
  });
});
