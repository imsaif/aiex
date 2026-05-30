import type { Pattern } from '@/types';
import type { SavedAudit } from '@/hooks/useSavedAudits';
import { gapBlock, productTypeLabel } from '@/lib/audit/handoff';
import { patternBlock, SITE } from '@/lib/handoff/composeHandoff';
import { resolvePatternSlug } from '@/lib/audit/pattern-link';

/**
 * Combined handoff: ONE markdown file the user hands to Claude Code / Cursor,
 * built from the audits + patterns they selected on the dashboard.
 *
 * Two intents are merged:
 *   - Part 1 — fixes for gaps we found in the user's OWN product (from audits)
 *   - Part 2 — reference patterns the user wants to implement
 *
 * Reuses the exact per-item block builders from the two single-source composers
 * (`gapBlock`, `patternBlock`) so formatting stays identical.
 *
 * Dedup: a pattern that already appears as a gap's pattern in a selected audit
 * is dropped from Part 2 — the audit carries the user's specific finding, so
 * that context wins.
 *
 * Heading hierarchy is load-bearing: `gapBlock`/`patternBlock` hardcode `##`
 * item headers (shared with the audit-results page), so parts use `#` and the
 * per-audit context is a bold line, never `###` (which would render smaller than
 * the `##` blocks beneath it).
 */

const CLOSING = [
  '---',
  '',
  'When you are done, output a short Markdown report with:',
  '- Files you changed (with paths)',
  '- Which item each change implements',
  "- Anything you flagged but didn't change, and why",
].join('\n');

function footer(): string {
  return [
    '---',
    '',
    `_From [aiuxdesign.guide](${SITE}): a library of 36 AI UX patterns with real product examples, plus a free audit tool. Audit your own AI UX at ${SITE}._`,
  ].join('\n');
}

/** Build one audit's Part-1 sub-section: bold context line + product/surface lines + its gap blocks. */
function auditSection(audit: SavedAudit): string {
  const head = [
    `**From your audit: ${audit.productLabel}**`,
    `I'm building ${productTypeLabel(audit.productType)}.`,
    audit.surfaceDescription ? `What's on screen: ${audit.surfaceDescription.trim()}` : '',
  ]
    .filter(Boolean)
    .join('\n');

  const blocks = audit.gaps.map((g, i) => gapBlock(g, i)).join('\n\n');
  return [head, blocks].join('\n\n');
}

export function composeCombinedHandoff(audits: SavedAudit[], patterns: Pattern[]): string {
  // Dedup: any pattern resolved from a selected audit's gaps is excluded from Part 2.
  const coveredSlugs = new Set<string>();
  audits.forEach((a) =>
    a.gaps.forEach((g) => {
      const slug = resolvePatternSlug(g.pattern, g.resource);
      if (slug) coveredSlugs.add(slug);
    }),
  );
  const patternsForPart2 = patterns.filter((p) => !coveredSlugs.has(p.slug));

  const auditsWithGaps = audits.filter((a) => a.gaps.length > 0);
  const nAudits = auditsWithGaps.length;
  const nPatterns = patternsForPart2.length;
  const both = nAudits > 0 && nPatterns > 0;

  if (nAudits === 0 && nPatterns === 0) {
    return 'Nothing to hand off. The selected items contain no actionable gaps or patterns.';
  }

  // Intro adapts to which parts are present.
  let summary: string;
  let howTo: string;
  if (both) {
    summary = `This file covers ${nAudits} audit${nAudits === 1 ? '' : 's'} of your product and ${nPatterns} reference pattern${nPatterns === 1 ? '' : 's'} to implement.`;
    howTo =
      'How to use: work through both parts in this repo. Part 1 lists gaps we found in your product; fix each in the relevant files. Part 2 lists patterns to implement; follow the install instructions where present, otherwise read the linked reference and apply the principles. Make the smallest change that genuinely realises each item; do not add UI the product does not need.';
  } else if (nAudits > 0) {
    summary = `This file covers ${nAudits} audit${nAudits === 1 ? '' : 's'} of your product.`;
    howTo =
      'How to use: address each gap below by editing the relevant files in this repo. Follow the pattern-install instructions where present; otherwise read the linked reference and apply the principles. Make the smallest change that genuinely realises each fix.';
  } else {
    summary = `This file describes ${nPatterns} AI UX pattern${nPatterns === 1 ? '' : 's'} to implement in this project.`;
    howTo =
      'How to use: for each pattern below, follow the implementation instructions where present; otherwise read the linked reference and apply the principles to the relevant surfaces in this codebase. Make the smallest change that genuinely realises each pattern; do not add UI the product does not need.';
  }

  const intro = ['# AI UX handoff', '', `Generated from aiuxdesign.guide. ${summary}`, '', howTo].join('\n');

  const sections: string[] = [intro];

  if (nAudits > 0) {
    if (both) sections.push('# Part 1: Fixes from your audits');
    auditsWithGaps.forEach((a) => sections.push(auditSection(a)));
  }

  if (nPatterns > 0) {
    if (both) sections.push('# Part 2: Patterns to implement');
    patternsForPart2.forEach((p, i) => sections.push(patternBlock(p, i)));
  }

  sections.push(CLOSING, footer());
  return sections.join('\n\n');
}

/** Suggested filename for the combined handoff download. */
export function combinedHandoffFilename(): string {
  return 'aiux-handoff.md';
}
