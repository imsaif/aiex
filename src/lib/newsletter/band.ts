/**
 * Which pattern icon sits in the daily email's navy band.
 *
 * Every pattern has a pre-rendered band image in public/images/newsletter/band/
 * (<slug>.png for the email, <slug>.svg as the source): the grid-and-rings motif
 * from the site's pattern cards with ONE Lucide icon for that pattern. The band
 * shows the issue title, which names the stories, so the icon follows the lead
 * story's pattern; the idea's pattern is the last fallback.
 *
 * Nothing renders per issue: the pick is a lookup, and the PNGs are static files.
 * To change an icon or add a pattern, edit the map in
 * scripts/newsletter/build-band-icons.cjs and re-run it.
 */

import { isValidPatternSlug } from './pattern-slug';
import { BAND_DRAWINGS } from './band-icons';

export { BAND_ICONS, BAND_DRAWINGS, bandImageUrl, bandSlugFromHtml, syncBandIcon } from './band-icons';

/** Used when nothing in the issue carries a usable pattern. */
export const DEFAULT_BAND_SLUG = 'human-in-the-loop';

export interface BandPickInput {
  /** Pattern the model tagged Today's Idea with (already sanitised, may be absent). */
  ideaSlug?: string;
  /** Pattern slugs of the stories, in issue order. */
  itemSlugs: Array<string | undefined>;
  /** Drawing the previous daily issue used, so two days in a row never match. */
  previousSlug?: string | null;
}

/**
 * Order: each story's pattern in issue order (the lead story first), then the
 * idea's pattern, skipping yesterday's icon. If every candidate equals
 * yesterday's, repeating it beats showing an unrelated icon. With no candidates
 * at all, the default.
 */
export function pickBandSlug({ ideaSlug, itemSlugs, previousSlug }: BandPickInput): string {
  const candidates: string[] = [];
  for (const slug of [...itemSlugs, ideaSlug]) {
    if (isValidPatternSlug(slug) && BAND_DRAWINGS.has(slug) && !candidates.includes(slug)) {
      candidates.push(slug);
    }
  }
  return candidates.find((slug) => slug !== previousSlug) ?? candidates[0] ?? DEFAULT_BAND_SLUG;
}
