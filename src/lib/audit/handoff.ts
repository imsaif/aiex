import type { TopGap } from '@/types/audit';
import { patterns } from '@/data/patterns';
import { resolvePatternSlug } from './pattern-link';

const PRODUCT_TYPE_LABELS: Record<string, string> = {
  'chat-interface': 'a chat interface',
  'ai-agent': 'an AI agent',
  'recommendation-system': 'a recommendation system',
  'content-generation': 'a content-generation tool',
  other: 'an AI product',
};

export function productTypeLabel(productType?: string | null): string {
  if (!productType) return 'an AI product';
  return PRODUCT_TYPE_LABELS[productType] || 'an AI product';
}

/** Filename for a downloaded audit handoff prompt (.md), namespaced + dated. */
export function auditHandoffFilename(productType?: string | null): string {
  const slug = (productType || 'audit').replace(/[^a-z0-9]+/gi, '-').toLowerCase();
  return `aiux-audit-${slug}-handoff.md`;
}

interface ComposeInput {
  surfaceDescription?: string | null;
  productType?: string | null;
  gaps: TopGap[];
}

/**
 * Build a single gap's markdown block. Exported so the combined-handoff
 * composer (src/lib/handoff/composeCombined.ts) can reuse the exact per-gap
 * format without duplicating the installPrompt/URL fallback logic.
 */
export function gapBlock(gap: TopGap, index: number): string {
  const slug = resolvePatternSlug(gap.pattern, gap.resource);
  const matched = slug ? patterns.find((p) => p.slug === slug) : null;
  const installPrompt = matched?.content?.installPrompt?.trim();
  const url = slug ? `https://aiuxdesign.guide/patterns/${slug}` : null;

  const installSection = installPrompt
    ? `Pattern install instructions:\n${installPrompt}`
    : url
      ? `Pattern reference: ${url}\nRead this page and apply the same principles in code.`
      : `Pattern reference: search aiuxdesign.guide for "${gap.pattern}" and apply the principles.`;

  return [
    `## Gap ${index + 1}: ${gap.pattern}`,
    `What we saw: ${gap.evidence?.trim() || '(no specifics captured in this finding)'}`,
    `Finding: ${gap.finding.trim()}`,
    `Recommended fix: ${gap.recommendation.trim()}`,
    '',
    installSection,
  ].join('\n');
}

export function composeHandoffPrompt({ surfaceDescription, productType, gaps }: ComposeInput): string {
  const productLine = `I'm building ${productTypeLabel(productType)}.`;
  const surfaceLine = surfaceDescription ? `What's on screen: ${surfaceDescription.trim()}` : '';

  const intro = [
    productLine,
    surfaceLine,
    '',
    `An AI UX audit flagged ${gaps.length} gap${gaps.length === 1 ? '' : 's'} on my surface. Address each below by editing the relevant files in this repo. For each gap, follow the pattern-install instructions verbatim where present; for patterns without instructions, read the linked aiuxdesign.guide URL and apply the principles.`,
  ]
    .filter(Boolean)
    .join('\n');

  const gapBlocks = gaps.map((gap, i) => gapBlock(gap, i));

  const closing = [
    'When done, output a Markdown report with:',
    '- Surfaces updated (file paths)',
    '- Patterns added or improved',
    "- Anything you flagged but didn't change, and why",
  ].join('\n');

  return [intro, ...gapBlocks, closing].join('\n\n');
}
