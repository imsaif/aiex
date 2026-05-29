import type { Pattern } from '@/types';

/**
 * Builds a Claude Code / Cursor handoff file from a set of saved patterns.
 *
 * This is the SAVED-PATTERNS handoff (dashboard → download a file you drop into
 * your repo so your IDE agent implements the patterns). It is intentionally
 * separate from the audit flow's `src/lib/audit/handoff.ts`, which composes a
 * gaps-based prompt from a screenshot audit. Different inputs, different framing
 * ("implement these patterns I chose" vs. "fix these gaps we found").
 *
 * For each pattern we prefer the authored `installPrompt`. When a pattern has no
 * install prompt yet (most don't), we fall back to the pattern URL plus its key
 * moves (takeaways or guidelines) so the file is still actionable.
 */

const SITE = 'https://aiuxdesign.guide';

function patternMoves(pattern: Pattern): string[] {
  const takeaways = pattern.content.takeaways;
  if (takeaways && takeaways.length > 0) {
    return takeaways.map((t) => {
      const heading = (t as { heading?: string }).heading?.trim();
      const body = (t as { body?: string }).body?.trim();
      if (heading && body) return `${heading}: ${body}`;
      return heading || body || '';
    }).filter(Boolean);
  }
  return (pattern.content.guidelines || []).slice(0, 5);
}

function patternBlock(pattern: Pattern, index: number): string {
  const url = `${SITE}/patterns/${pattern.slug}`;
  const why = (pattern.content.problem || pattern.description || '').trim();
  const install = pattern.content.installPrompt?.trim();

  const lines: string[] = [
    `## ${index + 1}. ${pattern.title}`,
    `Category: ${pattern.category}`,
    `Reference: ${url}`,
    '',
  ];

  if (why) {
    lines.push(`Why it matters: ${why}`, '');
  }

  if (install) {
    lines.push('Implementation instructions:', install);
  } else {
    const moves = patternMoves(pattern);
    lines.push(
      `Read ${url} and apply the same principles in this codebase.`,
    );
    if (moves.length > 0) {
      lines.push('', 'Key moves to implement:');
      moves.forEach((m) => lines.push(`- ${m}`));
    }
  }

  return lines.join('\n');
}

/**
 * Compose the full handoff file (Markdown) for the given saved patterns.
 * Order follows the array passed in (i.e. the order the user saved them).
 */
export function composeHandoffFile(patterns: Pattern[]): string {
  const count = patterns.length;
  const intro = [
    '# AI UX pattern handoff',
    '',
    `Generated from aiuxdesign.guide. This file describes ${count} AI UX pattern${count === 1 ? '' : 's'} to implement in this project.`,
    '',
    'How to use: keep this file in your repo and ask your AI coding agent (Claude Code, Cursor, etc.) to work through it. For each pattern below, follow the implementation instructions where present; otherwise read the linked reference and apply the principles to the relevant surfaces in this codebase. Make the smallest change that genuinely realises each pattern — do not add UI that the product does not need.',
  ].join('\n');

  const blocks = patterns.map((p, i) => patternBlock(p, i));

  const closing = [
    '---',
    '',
    'When you are done, output a short Markdown report with:',
    '- Files you changed (with paths)',
    '- Which pattern each change implements',
    "- Anything you flagged but didn't change, and why",
  ].join('\n');

  const footer = [
    '---',
    '',
    `_These ${count} pattern${count === 1 ? '' : 's'} came from [aiuxdesign.guide](${SITE}) — a library of 36 AI UX patterns with real product examples. Audit your own AI UX against all 36 at ${SITE}._`,
  ].join('\n');

  return [intro, ...blocks, closing, footer].join('\n\n');
}

/** Suggested filename for the downloaded handoff. */
export function handoffFilename(): string {
  return 'aiux-pattern-handoff.md';
}
