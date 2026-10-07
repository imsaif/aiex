/**
 * Which pattern icon sits in the daily email's navy band.
 *
 * Every pattern has a pre-rendered band image in public/images/newsletter/band/
 * (<slug>.png for the email, <slug>.svg as the source): the grid-and-rings motif
 * from the site's pattern cards with ONE Lucide icon for that pattern. The band
 * shows Today's Idea, so the icon follows the idea's pattern first; the stories'
 * patterns are the fallback for an idea the model left untagged.
 *
 * Nothing renders per issue: the pick is a lookup, and the PNGs are static files.
 * To change an icon or add a pattern, edit the map in
 * scripts/newsletter/build-band-icons.cjs and re-run it.
 */

import { isValidPatternSlug } from './pattern-slug';

/** Slugs that have a drawing on disk. A pattern added to the catalogue without a
 *  drawing is simply skipped by the picker instead of shipping a broken image;
 *  band.test.ts fails until the drawing exists. */
export const BAND_DRAWINGS: ReadonlySet<string> = new Set([
  'action-audit-trail', 'adaptive-interfaces', 'agent-reflection-learning', 'agent-status-monitoring',
  'ambient-intelligence', 'anti-manipulation-safeguards', 'augmented-creation', 'autonomy-spectrum',
  'collaborative-ai', 'confidence-visualization', 'context-switching', 'contextual-assistance',
  'conversational-ui', 'crisis-detection-escalation', 'error-recovery', 'escalation-pathways',
  'explainable-ai', 'feedback-loops', 'graceful-handoff', 'guided-learning', 'human-in-the-loop',
  'intelligent-caching', 'intent-preview', 'mixed-initiative-control', 'multimodal-interaction',
  'plan-summary', 'predictive-anticipation', 'privacy-first-design', 'progressive-disclosure',
  'progressive-enhancement', 'responsible-ai-design', 'safe-exploration', 'selective-memory',
  'session-degradation-prevention', 'trust-calibration', 'universal-access-patterns',
  'vulnerable-user-protection', 'workspace-native-agents',
]);

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
 * Order: the idea's pattern, then each story's pattern, skipping yesterday's
 * drawing. If every candidate equals yesterday's, repeating it beats showing an
 * unrelated drawing. With no candidates at all, the default.
 */
export function pickBandSlug({ ideaSlug, itemSlugs, previousSlug }: BandPickInput): string {
  const candidates: string[] = [];
  for (const slug of [ideaSlug, ...itemSlugs]) {
    if (isValidPatternSlug(slug) && BAND_DRAWINGS.has(slug) && !candidates.includes(slug)) {
      candidates.push(slug);
    }
  }
  return candidates.find((slug) => slug !== previousSlug) ?? candidates[0] ?? DEFAULT_BAND_SLUG;
}

export function bandImageUrl(siteUrl: string, slug: string): string {
  return `${siteUrl}/images/newsletter/band/${slug}.png`;
}
