/**
 * Social assets for designwithclaude.com (dwic) articles, made in the aiux admin.
 *
 * Unlike the newsletter slides, dwic has no newsletter in this database: each article's
 * slide text is written here by hand, and the admin can edit any field before rendering.
 * Edits travel to the image route as an override object (see encodeOverrides), so nothing
 * is stored server-side. This module decides what each image SAYS; the route only draws it.
 *
 * Images: a 1200x627 LinkedIn link card, and a four-slide 1080x1350 carousel.
 */

export const DWIC_COLORS = {
  navy: '#162036',
  tint: '#EEF0F6',
  white: '#ffffff',
  slate: '#475569',
  onNavy: '#cbd5e1',
  onNavyMuted: '#94a3b8',
  rule: '#2c3650',
  panel: '#DCE1EC',
} as const;

export const DWIC_SITE = 'designwithclaude.com';
export const CARD_WIDTH = 1200;
export const CARD_HEIGHT = 627;
export const DWIC_SLIDE_COUNT = 4;

/** Every editable piece of text for one article. Flat, so the admin can render one field per key. */
export type DwicText = {
  post: string;
  cardTitle: string;
  cardBody: string;
  coverLabel: string;
  coverTitle: string;
  coverBody: string;
  pointsLabel: string;
  pointsTitle: string;
  point1Code: string;
  point1Claim: string;
  point2Code: string;
  point2Claim: string;
  point3Code: string;
  point3Claim: string;
  stepsLabel: string;
  stepsTitle: string;
  step1Answer: string;
  step1Question: string;
  step2Answer: string;
  step2Question: string;
  step3Answer: string;
  step3Question: string;
  step4Answer: string;
  stepsNote: string;
  linkTitle: string;
  linkBody: string;
  linkUrl: string;
};

export type DwicArticle = {
  slug: string;
  title: string;
  url: string;
  /** Doodle under /public/images/social, without extension. A "-light" twin is used on navy. */
  art: string;
  text: DwicText;
};

export const DWIC_ARTICLES: DwicArticle[] = [
  {
    slug: 'building-empathy-in-the-terminal',
    title: 'Building empathy in the terminal',
    url: 'https://www.designwithclaude.com/design-research/building-empathy-in-the-terminal',
    art: 'dwic-empathy',
    text: {
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
      cardTitle: 'Building empathy in the terminal',
      cardBody: 'AI coding tools let you ship without meeting a user. How to put empathy back into that loop, without inventing one.',
      coverLabel: 'Design Research · Essay',
      coverTitle: 'Building empathy in the terminal',
      coverBody: 'AI coding tools let you go from an idea to something live without ever meeting a user. Here is how to put empathy back into that loop.',
      pointsLabel: 'Your code already says who you think your users are',
      pointsTitle: 'Read a line of code as a sentence about people',
      point1Code: '<input name="phone" required />',
      point1Claim: 'Everyone has a phone number, and will give it before seeing anything.',
      point2Code: 'const STEPS = [5 steps]',
      point2Claim: 'People will push through all five before they get any value.',
      point3Code: '"You entered an invalid phone number."',
      point3Claim: 'When something goes wrong, it is the user’s mistake.',
      stepsLabel: 'Three questions, then stop',
      stepsTitle: 'From a belief to a real moment',
      step1Answer: '“Users want it to be simple.”',
      step1Question: 'Who, specifically?',
      step2Answer: '“Freelancers.”',
      step2Question: 'When did you last see them do it?',
      step3Answer: '“Priya, last Thursday, sending an invoice.”',
      step3Question: 'What did they do instead?',
      step4Answer: '“She gave up and sent it from Word.”',
      stepsNote: 'No real person after three questions? It gets recorded as an assumption, not a fact.',
      linkTitle: 'Never invent a user.',
      linkBody: 'dwic reads your code for what it assumes about people, and records only what you confirm.',
      linkUrl: 'designwithclaude.com/design-research',
    },
  },
];

export function findArticle(slug: string | null): DwicArticle | undefined {
  return DWIC_ARTICLES.find((a) => a.slug === slug);
}

/** Defaults with the admin's edits laid over them. Unknown keys and non-strings are ignored. */
export function mergeText(base: DwicText, overrides: unknown): DwicText {
  const out: DwicText = { ...base };
  if (overrides && typeof overrides === 'object') {
    for (const [k, v] of Object.entries(overrides as Record<string, unknown>)) {
      if (k in out && typeof v === 'string') out[k as keyof DwicText] = v.slice(0, 2000);
    }
  }
  return out;
}

/** Browser-side: the edits as a URL-safe string for the image route's `t` parameter. */
export function encodeOverrides(overrides: Partial<DwicText>): string {
  const json = JSON.stringify(overrides);
  const bytes = new TextEncoder().encode(json);
  let bin = '';
  bytes.forEach((b) => (bin += String.fromCharCode(b)));
  return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

/** Server-side: the inverse of encodeOverrides. Returns {} on anything malformed. */
export function decodeOverrides(t: string | null): Record<string, unknown> {
  if (!t) return {};
  try {
    return JSON.parse(Buffer.from(t, 'base64url').toString('utf8'));
  } catch {
    return {};
  }
}

export type DwicImageId = 'card' | '1' | '2' | '3' | '4';
export const DWIC_IMAGES: { id: DwicImageId; kind: string; label: string }[] = [
  { id: 'card', kind: 'link-card', label: 'LinkedIn link card' },
  { id: '1', kind: 'cover', label: 'Slide 1' },
  { id: '2', kind: 'points', label: 'Slide 2' },
  { id: '3', kind: 'steps', label: 'Slide 3' },
  { id: '4', kind: 'link', label: 'Slide 4' },
];

/** Alt text for each image, ready to paste into LinkedIn's alt text box. */
export function altText(id: DwicImageId, t: DwicText): string {
  switch (id) {
    case 'card':
      return `${t.cardTitle}. ${t.cardBody} ${DWIC_SITE}`;
    case '1':
      return `${t.coverLabel}. ${t.coverTitle}. ${t.coverBody}`;
    case '2':
      return `${t.pointsTitle}. ${t.point1Code} means: ${t.point1Claim} ${t.point2Code} means: ${t.point2Claim} ${t.point3Code} means: ${t.point3Claim}`;
    case '3':
      return `${t.stepsTitle}. ${t.step1Answer} ${t.step1Question} ${t.step2Answer} ${t.step2Question} ${t.step3Answer} ${t.step3Question} ${t.step4Answer} ${t.stepsNote}`;
    case '4':
      return `${t.linkTitle} ${t.linkBody} Read it at ${t.linkUrl}.`;
  }
}
