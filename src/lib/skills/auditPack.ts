import { patterns } from '@/data/patterns';
import type { Pattern } from '@/types';
import type { SavedAudit } from '@/hooks/useSavedAudits';
import { resolvePatternSlug } from '@/lib/audit/pattern-link';
import { composeSkillPack, skillPackFilename } from '@/lib/skills/composePack';

/**
 * Builds a downloadable Claude Code skill pack straight from one audit result.
 *
 * The dashboard builds the same pack from patterns a user has saved over time.
 * This is the impatient path: someone who just ran an audit wants the skills for
 * what it found, now, without first saving and then navigating. Both call the
 * same composer, so the two packs cannot drift.
 *
 * **Import this dynamically.** It pulls the zipper and the pack composer, and
 * its only caller is a click handler on the results screen, which the homepage
 * also renders for its LCP element.
 */

export interface AuditGapLike {
  pattern: string;
  resource?: string | null;
}

/**
 * Resolve gap names to real catalogue patterns.
 *
 * Gaps arrive as model-written strings, so some will not match anything —
 * a renamed pattern, or one the model invented. Unmatched gaps are dropped
 * rather than guessed at: a pack containing a skill we cannot source is worse
 * than a smaller pack. Order and uniqueness follow the audit's own ranking.
 */
export function patternsForGaps(gaps: AuditGapLike[]): Pattern[] {
  const seen = new Set<string>();
  const out: Pattern[] = [];
  for (const gap of gaps) {
    const slug = resolvePatternSlug(gap.pattern, gap.resource ?? null);
    if (!slug || seen.has(slug)) continue;
    const match = patterns.find((p) => p.slug === slug);
    if (!match) continue;
    seen.add(slug);
    out.push(match);
  }
  return out;
}

/** Save a blob to disk under `filename`. */
export function saveBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Build and save the pack for one audit: a skill per matched gap, plus the
 * one-shot fixes for this specific product as a task file.
 *
 * The audit is passed in rather than read from storage, so downloading does not
 * require having saved anything first.
 *
 * Throws if no gap resolved to a pattern, or if zipping fails; the caller shows
 * the error and nothing is written. No partial packs.
 */
export async function downloadAuditSkillPack(
  gaps: AuditGapLike[],
  audit: SavedAudit | null,
): Promise<number> {
  const matched = patternsForGaps(gaps);
  if (matched.length === 0) {
    throw new Error('None of these gaps map to a pattern in the library.');
  }
  const files = composeSkillPack(matched, audit ? [audit] : []);
  const { zipSync, strToU8 } = await import('fflate');
  const zippable = Object.fromEntries(
    Object.entries(files).map(([path, contents]) => [path, strToU8(contents)]),
  );
  saveBlob(
    new Blob([zipSync(zippable, { level: 6 }) as BlobPart], { type: 'application/zip' }),
    skillPackFilename(),
  );
  return matched.length;
}
