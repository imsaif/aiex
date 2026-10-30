/**
 * The four portrait images that go with each issue's LinkedIn post and X thread,
 * in the newsletter's look (navy band, grid-and-rings icon, aiux mark). This
 * module decides what each slide SAYS and its alt text; the image route
 * (src/app/api/social/slides/route.tsx) only draws it. Kept separate so the
 * copy is testable without rendering.
 *
 * Slides: 1 the issue title, 2 the stories, 3 Today's Idea, 4 where to read it.
 */
import type { NewsletterData } from './content-generator';
import { cleanCopy } from './copy-rules';

/**
 * The newsletter's palette (mirrors src/lib/newsletter/daily-email.ts). Literal
 * values because the image renderer cannot read the site's CSS variables.
 */
export const SLIDE_COLORS = {
  navy: '#162036',
  tint: '#EEF0F6',
  white: '#ffffff',
  slate: '#475569',
  onNavy: '#cbd5e1',
  onNavyMuted: '#94a3b8',
  rule: '#2c3650',
  ideaPanel: '#DCE1EC',
} as const;

export const SLIDE_COUNT = 4;
export const SLIDE_WIDTH = 1080;
export const SLIDE_HEIGHT = 1350;

const MAX_STORIES = 5;
const HEADLINE_MAX = 110;
const IDEA_BODY_MAX = 330;

export type Slide =
  | { kind: 'cover'; label: string; title: string; summary: string; alt: string }
  | { kind: 'stories'; label: string; title: string; stories: { product: string; headline: string }[]; alt: string }
  | { kind: 'idea'; label: string; title: string; body: string; alt: string }
  | { kind: 'link'; label: string; title: string; body: string; url: string; alt: string };

/** "AI UX Daily: Figma ships agents" → "Figma ships agents". The mark already says it. */
export function cleanIssueTitle(title: string): string {
  return title.replace(/^AI UX (Daily|Weekly):\s*/i, '').trim();
}

/** Shortens at a word (or sentence, when one ends late enough) so nothing is cut mid-word. */
export function clip(text: string, max: number): string {
  const clean = cleanCopy(text);
  if (clean.length <= max) return clean;
  const cut = clean.slice(0, max);
  const sentenceEnd = Math.max(cut.lastIndexOf('. '), cut.lastIndexOf('? '), cut.lastIndexOf('! '));
  if (sentenceEnd > max * 0.6) return cut.slice(0, sentenceEnd + 1);
  return `${cut.slice(0, cut.lastIndexOf(' ')).replace(/[,;:]$/, '')}...`;
}

export function buildSlides(data: NewsletterData, opts: { dateLabel: string }): Slide[] {
  const edition = data.type === 'weekly' ? 'AI UX Weekly' : 'AI UX Daily';
  const title = clip(cleanIssueTitle(data.title), 120);
  const summary = clip(data.summary, 220);
  const stories = data.items.slice(0, MAX_STORIES).map((item) => ({
    product: cleanCopy(item.product || ''),
    headline: clip(item.headline || '', HEADLINE_MAX),
  }));

  // Today's Idea, or for older issues the lead story's takeaway, or the plain takeaway string.
  const ideaTitle = data.idea?.title ?? (data.items[0]?.designerTakeaway ? "The designer's takeaway" : 'The takeaway');
  const ideaBody = data.idea?.body ?? data.items[0]?.designerTakeaway ?? data.takeaway ?? data.summary;
  const ideaLabel = data.type === 'weekly' ? "This week's idea" : "Today's idea";
  // The short address: issue slugs run long, and the post itself carries the full link.
  const url = 'aiuxdesign.guide/news';

  return [
    {
      kind: 'cover',
      label: `${edition} · ${opts.dateLabel}`,
      title,
      summary,
      alt: `${edition}, ${opts.dateLabel}. ${title}. ${summary}`,
    },
    {
      kind: 'stories',
      label: `In this issue`,
      title: `${stories.length} ${stories.length === 1 ? 'story' : 'stories'} for designers`,
      stories,
      alt: `The stories in this issue: ${stories.map((s, i) => `${i + 1}. ${s.product}: ${s.headline}`).join(' ')}`,
    },
    {
      kind: 'idea',
      label: ideaLabel,
      title: clip(ideaTitle, 90),
      body: clip(ideaBody, IDEA_BODY_MAX),
      alt: `${ideaLabel}: ${clip(ideaTitle, 90)}. ${clip(ideaBody, IDEA_BODY_MAX)}`,
    },
    {
      kind: 'link',
      label: 'The full issue',
      title: 'Read it free, every morning.',
      body: 'Each story comes with what it means for your design work.',
      url,
      alt: `Read the full issue free at ${url}. Each story comes with what it means for your design work.`,
    },
  ];
}
