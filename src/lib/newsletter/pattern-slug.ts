/**
 * Pattern-slug validation for generated newsletter issues.
 *
 * Every `patternSlug` in a generated issue is raw model output. The generation
 * prompts list the valid slugs, but nothing used to check the answer — and the
 * renderer's `getPatternTitle` silently falls back to printing the raw string, so
 * one invented slug shipped a live link to a pattern page that does not exist,
 * inside the /news cluster Google crawls. Same class of bug as the sitemap that
 * advertised a 404 (#105) and the loading.tsx soft-404s.
 *
 * The pattern-intel classifier (src/lib/agents/pattern-intel/classifier.ts) already
 * validates against the real slug set; this is the generator catching up.
 */

import { patterns } from '@/data/patterns';

const VALID_PATTERN_SLUGS = new Set(patterns.map((p) => p.slug));

export function isValidPatternSlug(slug: unknown): slug is string {
  return typeof slug === 'string' && VALID_PATTERN_SLUGS.has(slug);
}

/** Shape this operates on — deliberately minimal so both the daily and weekly
 *  newsletter data types satisfy it without coupling to the route's interfaces. */
export interface PatternSlugCarrier {
  items?: Array<{ headline?: string; patternSlug?: string }>;
  patternToKnow?: { patternSlug?: string };
}

/**
 * Strip any pattern slug the model invented, in place, so no downstream render can
 * emit a broken /patterns/<slug> link. Dropping the slug is deliberate: the story
 * chip and the deep-dive CTA are both optional, so an unmatched item simply ends at
 * its Designer's Takeaway rather than linking somewhere that 404s.
 *
 * Logs every rejection — silent drift in the model's slug output is exactly what let
 * this go unnoticed, and Vercel Hobby keeps only ~1h of logs, so a summary count
 * matters when an odd issue needs diagnosing after the fact.
 *
 * @returns how many slugs were dropped.
 */
export function sanitizePatternSlugs(data: PatternSlugCarrier): number {
  let dropped = 0;

  for (const item of data.items ?? []) {
    if (item.patternSlug !== undefined && !isValidPatternSlug(item.patternSlug)) {
      console.warn(
        `[newsletter] Dropping invalid patternSlug "${item.patternSlug}" on item "${item.headline ?? '(untitled)'}" — not in the pattern catalogue.`
      );
      item.patternSlug = undefined;
      dropped++;
    }
  }

  const deepDive = data.patternToKnow;
  if (deepDive?.patternSlug !== undefined && !isValidPatternSlug(deepDive.patternSlug)) {
    console.warn(
      `[newsletter] Dropping invalid patternToKnow.patternSlug "${deepDive.patternSlug}" — not in the pattern catalogue.`
    );
    deepDive.patternSlug = undefined;
    dropped++;
  }

  if (dropped > 0) {
    console.warn(`[newsletter] Pattern slug validation dropped ${dropped} invalid slug(s).`);
  }
  return dropped;
}
