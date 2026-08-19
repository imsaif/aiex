import type { ProductType } from '@/types/audit';

/**
 * Guides to surface on an audit result, chosen by the surface that was audited.
 *
 * Slugs and titles are duplicated here rather than imported from
 * `@/data/guides`, which is ~8,000 lines of lesson content and would land in
 * the results bundle (and therefore the homepage, which renders the same
 * component for its LCP element) just to read two strings. The duplication is
 * guarded by a test that asserts every slug below still exists in the real
 * catalogue, so a renamed guide fails in CI rather than shipping a dead link.
 */

export interface RelatedGuide {
  slug: string;
  title: string;
  /** One line on why this guide follows from this particular audit. */
  reason: string;
}

const CONVERSATIONAL: RelatedGuide = {
  slug: 'conversational-ui-guide',
  title: 'Build a Conversational UI',
  reason: 'Chat bubbles, streaming, context and error recovery, with code.',
};

const SKILLS: RelatedGuide = {
  slug: 'ai-ux-skills-guide',
  title: 'Using AI UX Skills with Claude Code',
  reason: 'What a skill is, how to install the pack, and how triggering works.',
};

/**
 * Surface-specific guides. Only mapped where a guide genuinely covers that
 * surface: an unrelated guide dressed up as a recommendation is worse than no
 * recommendation, and teaches people to ignore this block.
 */
const BY_PRODUCT_TYPE: Partial<Record<ProductType, RelatedGuide[]>> = {
  'chat-interface': [CONVERSATIONAL],
  // Agent surfaces are conversational in the same ways that matter here:
  // streaming, interruption, and recovering from a wrong turn.
  'ai-agent': [CONVERSATIONAL],
};

/**
 * Up to two guides for this audit: the surface-specific one when there is one,
 * then the skills guide, which applies to everyone because every audit now ends
 * with a skill pack the reader has to install.
 */
export function relatedGuidesFor(productType: ProductType | null | undefined): RelatedGuide[] {
  const specific = productType ? BY_PRODUCT_TYPE[productType] ?? [] : [];
  const out = [...specific];
  if (!out.some((g) => g.slug === SKILLS.slug)) out.push(SKILLS);
  return out.slice(0, 2);
}

/** Exported for the drift test. */
export const ALL_RELATED_GUIDES: RelatedGuide[] = [CONVERSATIONAL, SKILLS];
