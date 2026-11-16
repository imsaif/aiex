/**
 * Social assets for designwithclaude.com (dwic) articles, in the same design as the aiux
 * newsletter: the four 1080x1350 slides (src/lib/social/slide-render.tsx) and the 1200x630
 * share card (src/lib/social/og-card.tsx). Only the logo, wordmark and band art differ.
 *
 * dwic has no newsletter in this database, so each article's text is written here by hand.
 * Edit it here; the admin picks the article and renders it.
 */
import type { Slide } from './slides';

export type DwicArticle = {
  slug: string;
  title: string;
  url: string;
  /** Short date for the share card, e.g. "Nov 13, 2026". */
  date: string;
  /** Doodle under /public/images/social, white on navy, 116x160. */
  band: string;
  /** Ready-to-paste LinkedIn post. */
  post: string;
  /** Fills the four slides, in the same slots as a newsletter issue. */
  cover: { label: string; title: string; summary: string };
  stories: { label: string; title: string; items: { product: string; headline: string }[] };
  idea: { label: string; title: string; body: string; question?: string; aside?: string };
  link: { label: string; title: string; body: string; url: string };
  /** Rows on the share card, like the newsletter's story list. */
  card: { items: { product: string; headline: string }[]; ctaText: string; ctaButton: string };
};

export const DWIC_ARTICLES: DwicArticle[] = [
  {
    slug: 'building-empathy-in-the-terminal',
    title: 'Building empathy in the terminal',
    url: 'https://www.designwithclaude.com/design-research/building-empathy-in-the-terminal',
    date: 'Nov 13, 2026',
    band: 'dwic-empathy-light',
    post: [
      'AI coding tools let you go from an idea to something live without ever meeting a user.',
      '',
      "Anthropic's AI Fluency for Builders course rates empathy as one of the steps AI is weakest at. So I built a way to put it back inside the terminal, without letting the AI pretend to be the user.",
      '',
      'Three ideas from the essay:',
      '1. Your code already says who you think your users are. A required phone field is a claim about people.',
      '2. Ask about a moment that already happened, not what someone says they would do.',
      '3. Label how you know what you know: observed, reported, public, recalled, assumed.',
      '',
      'Full essay: https://www.designwithclaude.com/design-research/building-empathy-in-the-terminal',
    ].join('\n'),
    cover: {
      label: 'Design Research · Essay',
      title: 'Building empathy in the terminal',
      summary: 'AI coding tools let you go from an idea to something live without ever meeting a user. Here is how to put empathy back into that loop.',
    },
    stories: {
      label: 'Your code already says it',
      title: 'Three lines, read as claims about people',
      items: [
        { product: 'A required phone field', headline: 'Everyone has a phone number, and will give it before seeing anything.' },
        { product: 'Five setup steps', headline: 'People will push through all five before they get any value.' },
        { product: 'An error message', headline: '“You entered an invalid phone number.” When something breaks, it’s the user’s fault.' },
      ],
    },
    idea: {
      label: 'The method',
      title: 'Three questions, then stop',
      body: 'Who, specifically? When did you last see them do it? What did they do instead? If there is still no real person after three, it gets recorded as an assumption, not a fact.',
      question: 'When did you last see someone actually go through this flow?',
      aside: 'A demo you remember counts. It just gets labelled “recalled”, never “observed”.',
    },
    link: {
      label: 'The full essay',
      title: 'Never invent a user.',
      body: 'dwic reads your code for what it assumes about people, and records only what you confirm.',
      url: 'designwithclaude.com/design-research',
    },
    card: {
      items: [
        { product: 'Code', headline: 'A required phone field is a claim about people' },
        { product: 'Questions', headline: 'Ask about a moment that happened, not a wish' },
        { product: 'Evidence', headline: 'Label it: observed, reported, recalled, assumed' },
      ],
      ctaText: 'How dwic puts empathy back into Claude Code',
      ctaButton: 'Read the essay →',
    },
  },
];

export function findArticle(slug: string | null): DwicArticle | undefined {
  return DWIC_ARTICLES.find((a) => a.slug === slug);
}

/** The four slides, in the newsletter's Slide shape so the shared renderer draws them unchanged. */
export function buildDwicSlides(a: DwicArticle): Slide[] {
  return [
    { kind: 'cover', ...a.cover, alt: `${a.cover.label}. ${a.cover.title}. ${a.cover.summary}` },
    {
      kind: 'stories',
      label: a.stories.label,
      title: a.stories.title,
      stories: a.stories.items,
      alt: `${a.stories.title}: ${a.stories.items.map((s, i) => `${i + 1}. ${s.product}: ${s.headline}`).join(' ')}`,
    },
    {
      kind: 'idea',
      ...a.idea,
      alt: `${a.idea.label}: ${a.idea.title}. ${a.idea.body}${a.idea.question ? ` Ask in your next design review: ${a.idea.question}` : ''}${
        a.idea.aside ? ` Hmm. ${a.idea.aside}` : ''
      }`,
    },
    { kind: 'link', ...a.link, alt: `${a.link.title} ${a.link.body} Read it at ${a.link.url}.` },
  ];
}
