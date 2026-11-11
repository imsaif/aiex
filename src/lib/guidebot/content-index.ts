/**
 * Guidebot's view of the site: every pattern, course, lesson and event as a
 * plain-text page with its public URL. Built from the same data files the
 * pages render from, so Guidebot can only answer from what the site says.
 */
import { patterns } from '@/data/patterns';
import { guides } from '@/data/guides';
import { EVENTS } from '@/data/events';
import { slugifyLessonTitle } from '@/lib/guides/lesson-urls';

export const SITE = 'https://www.aiuxdesign.guide';

export type PageKind = 'pattern' | 'course' | 'lesson' | 'event' | 'page';

export interface SitePage {
  url: string;
  kind: PageKind;
  title: string;
  /** One or two lines shown in search results. */
  summary: string;
  /** Everything Guidebot may quote from, as plain text. */
  text: string;
}

const clean = (s: unknown): string =>
  typeof s === 'string' ? s.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim() : '';

/** Pull every string out of a nested value (lesson sections, pattern content). */
function strings(value: unknown, out: string[] = [], depth = 0): string[] {
  if (depth > 6 || value == null) return out;
  if (typeof value === 'string') {
    const s = clean(value);
    if (s.length > 2 && !/^(text|heading|intro|callout|info|h2|h3|tip|warning|code)$/.test(s)) out.push(s);
  } else if (Array.isArray(value)) {
    for (const v of value) strings(v, out, depth + 1);
  } else if (typeof value === 'object') {
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
      // Code, images and prompts to paste are not explanations a visitor needs.
      if (/^(code|codeExamples|image|images|src|thumbnail|icon|installPrompt|figmaPrompt|alt)$/i.test(k)) continue;
      strings(v, out, depth + 1);
    }
  }
  return out;
}

function buildPages(): SitePage[] {
  const pages: SitePage[] = [];

  for (const p of patterns) {
    const c = p.content;
    pages.push({
      url: `${SITE}/patterns/${p.slug}`,
      kind: 'pattern',
      title: `${p.title} (AI UX pattern)`,
      summary: clean(p.description),
      text: [
        clean(p.description),
        clean(p.introduction),
        clean(c.problem),
        clean(c.solution),
        clean(c.overview),
        ...strings(c.whenToUse),
        ...strings(c.benefits),
        ...strings(c.judgmentCall),
        ...strings(c.takeaways),
        ...strings(c.guidelines),
        ...strings(c.considerations),
        ...strings(c.examples),
      ]
        .filter(Boolean)
        .join('\n'),
    });
  }

  for (const g of guides) {
    if (g.status && g.status !== 'ready') continue;
    pages.push({
      url: `${SITE}/guides/${g.slug}`,
      kind: 'course',
      title: `${g.title} (course)`,
      summary: clean(g.description),
      text: [clean(g.description), clean(g.excerpt), ...(g.lessons ?? []).map((l) => `Lesson: ${l.title}`)].join('\n'),
    });
    const seen = new Set<string>();
    for (const l of g.lessons ?? []) {
      let slug = slugifyLessonTitle(l.title);
      if (seen.has(slug)) slug = `${slug}-${l.order}`;
      seen.add(slug);
      const body = strings((l as unknown as { sections?: unknown }).sections);
      pages.push({
        url: `${SITE}/guides/${g.slug}/${slug}`,
        kind: 'lesson',
        title: `${l.title} (lesson in ${g.title})`,
        summary: body[0]?.slice(0, 220) ?? '',
        text: body.join('\n'),
      });
    }
  }

  for (const e of EVENTS) {
    pages.push({
      url: `${SITE}/events/${e.slug}`,
      kind: 'event',
      title: `${e.title} (event)`,
      summary: clean(e.tagline),
      text: [
        clean(e.tagline),
        `Starts: ${e.start}. Ends: ${e.end}. Format: ${e.format}.`,
        `Price: ${e.priceLabel}.`,
        ...strings(e.about),
        ...strings(e.whoFor),
        ...strings(e.bring),
        ...strings(e.finePrint),
        `Contact: ${e.contactEmail}`,
      ].join('\n'),
    });
  }

  pages.push({
    url: `${SITE}/audit`,
    kind: 'page',
    title: 'AI UX audit',
    summary: 'Upload a screenshot and see which AI UX patterns your design is missing.',
    text: `Upload a screenshot, see which of ${patterns.length} AI UX patterns your design is missing, and download them as Claude skills. Free, no signup.`,
  });

  return pages;
}

export const SITE_PAGES: SitePage[] = buildPages();

const tokenize = (s: string) => s.toLowerCase().match(/[a-z0-9]+/g) ?? [];
const STOP = new Set('a an and are as at be by can do does for from how i in is it of on or the to what when which with you your my me this that'.split(' '));

/** Simple keyword search: title words count most, then summary, then body. */
export function searchSite(query: string, limit = 5): SitePage[] {
  const terms = Array.from(new Set(tokenize(query).filter((t) => !STOP.has(t))));
  if (terms.length === 0) return [];
  const scored = SITE_PAGES.map((page) => {
    const title = tokenize(page.title);
    const summary = tokenize(page.summary);
    const body = tokenize(page.text);
    let score = 0;
    for (const t of terms) {
      score += title.filter((w) => w.startsWith(t)).length * 6;
      score += summary.filter((w) => w.startsWith(t)).length * 2;
      score += Math.min(body.filter((w) => w.startsWith(t)).length, 8) * 0.5;
    }
    return { page, score };
  });
  return scored
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((s) => s.page);
}

export function getPage(url: string): SitePage | undefined {
  const path = url.replace(/^https?:\/\/(www\.)?aiuxdesign\.guide/, '').replace(/\/$/, '');
  return SITE_PAGES.find((p) => p.url === `${SITE}${path}`);
}
