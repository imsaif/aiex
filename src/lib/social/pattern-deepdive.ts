import Anthropic from '@anthropic-ai/sdk';
import type { Pattern } from '@/types';
import { getSocialHandle } from '@/data/product-social-handles';

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! });

const MODEL = 'claude-sonnet-4-6';
const BRAND_SIGNOFF = 'I break down AI UX patterns at aiuxdesign.guide.';

export interface CompanyToTag {
  product: string;
  /** Exact X handle (no @). Absent when not on file. */
  x?: string;
  /** Display name to search in LinkedIn's native @-mention autocomplete. */
  linkedinName?: string;
  /** True when we have no verified handle — surface in the UI as "verify before tagging". */
  needsHandle: boolean;
}

export interface PatternDeepDive {
  /** Featured product the post leads with. */
  featuredProduct: string;
  /** Pattern used as the analytical lens. */
  patternTitle: string;
  /** Full LinkedIn-native post draft (product-first teardown). */
  linkedin: string;
  /** Shorter X version of the same insight. */
  x: string;
  /** Companies referenced in the post, with handles to tag. */
  companiesToTag: CompanyToTag[];
}

function extractProductName(title: string): string {
  const cleaned = title.replace(/^[\s✅❌⚠️🚫]+/g, '').trim();
  return cleaned.split(' ')[0] || cleaned;
}

interface DeepDiveExample {
  product: string;
  title: string;
  description: string;
}

function gatherExamples(pattern: Pattern): DeepDiveExample[] {
  return (pattern.content.examples || [])
    .filter((e) => e.title && e.description)
    .map((e) => ({
      product: extractProductName(e.title),
      title: e.title,
      description: e.description,
    }));
}

function buildCompaniesToTag(products: string[]): CompanyToTag[] {
  const seen = new Set<string>();
  const out: CompanyToTag[] = [];
  for (const product of products) {
    if (!product || seen.has(product)) continue;
    seen.add(product);
    const handle = getSocialHandle(product);
    out.push({
      product,
      x: handle?.x,
      linkedinName: handle?.linkedinName,
      needsHandle: !handle,
    });
  }
  return out;
}

function buildPrompt(
  pattern: Pattern,
  examples: DeepDiveExample[],
  featured: DeepDiveExample | null
): string {
  const moves =
    pattern.content.takeaways && pattern.content.takeaways.length > 0
      ? pattern.content.takeaways
          .map((t) => {
            const h = (t as { heading?: string }).heading?.trim();
            const b = (t as { body?: string }).body?.trim();
            return [h, b].filter(Boolean).join(': ');
          })
          .filter(Boolean)
          .join('\n')
      : (pattern.content.guidelines || []).slice(0, 5).join('\n');

  const productSection =
    examples.length > 0
      ? `REAL PRODUCTS doing this (use as supporting evidence, reference by name so they can be tagged):
${examples.map((e, i) => `${i + 1}. ${e.product} — ${e.title}: ${e.description}`).join('\n')}`
      : `No specific product examples are on file for this pattern. Write from the pattern content above. You may name well-known products only where it is genuinely, verifiably true; do NOT invent specific UI claims about a named product.`;

  const openingInstruction = featured
    ? `1. Hook: a specific, concrete observation about what ${featured.product} does (${featured.title}: ${featured.description}). Lead with the product and the UI move, not the pattern name. Make a designer stop scrolling.
2. Break down the move: what exactly happens, where, when.
3. Zoom out to WHY it works, using "${pattern.title}" as the lens. Name the pattern once, naturally.
4. Optionally contrast one or two other products from the list doing it differently.`
    : `1. Hook: a sharp, concrete observation about the design problem "${pattern.title}" solves. Make a designer stop scrolling. Open with the tension or failure mode, not the pattern name.
2. Explain what good looks like, grounded in the key moves above.
3. Name "${pattern.title}" once, naturally, as the lens.`;

  return `You are writing a LinkedIn post for an audience of product designers and builders. The post is driven by the PATTERN CONTENT below. Product examples, when present, are supporting evidence, not the source of truth.

PATTERN:
Name: ${pattern.title}
What it is: ${pattern.description}
Why it matters: ${pattern.content.problem}
How it's solved: ${pattern.content.solution}

KEY MOVES of this pattern:
${moves}

${productSection}

Write the post with this structure:
${openingInstruction}
5. A crisp takeaway a designer can apply to their own product.
6. End with this exact sign-off line on its own line: "${BRAND_SIGNOFF}"

Voice: sharp, opinionated, specific. You have a point of view. No corporate fluff, no "in today's fast-paced world", no hashtag soup. Do NOT use em dashes (use commas, periods, or colons instead). LinkedIn formatting: short paragraphs, line breaks between thoughts, no markdown headers.

Then write a SHORTER version for X (under 280 characters) carrying the single sharpest insight.

Return ONLY valid JSON, no prose around it:
{
  "linkedin": "the full LinkedIn post text with line breaks as \\n",
  "x": "the X post text"
}`;
}

function parseJsonResponse(text: string): { linkedin: string; x: string } {
  // Tolerate code fences or stray prose around the JSON object.
  const match = text.match(/\{[\s\S]*\}/);
  if (!match) throw new Error('No JSON object found in model response');
  const parsed = JSON.parse(match[0]);
  if (typeof parsed.linkedin !== 'string' || typeof parsed.x !== 'string') {
    throw new Error('Model response missing linkedin/x fields');
  }
  return { linkedin: parsed.linkedin, x: parsed.x };
}

export interface GenerateOptions {
  /** Product name to lead with. Defaults to the pattern's first example. */
  featuredProduct?: string;
}

/**
 * Generate a product-first deep-dive draft for one pattern. Output is a DRAFT
 * for human review and manual posting (LinkedIn company tags only fire from the
 * native composer), never auto-published.
 */
export async function generatePatternDeepDive(
  pattern: Pattern,
  options: GenerateOptions = {}
): Promise<PatternDeepDive> {
  // Examples are supporting evidence, not a requirement. The post is generated
  // from the pattern content; when no examples exist we degrade to a
  // pattern-insight post with no forced featured product.
  const examples = gatherExamples(pattern);
  const featured: DeepDiveExample | null =
    (options.featuredProduct &&
      examples.find((e) => e.product.toLowerCase() === options.featuredProduct!.toLowerCase())) ||
    examples[0] ||
    null;

  const response = await anthropic.messages.create({
    model: MODEL,
    max_tokens: 2048,
    temperature: 0.6,
    system:
      'You are a sharp, opinionated product designer who writes teardowns of how real AI products handle UX. You write for designers and builders. You lead with the concrete product detail, never the abstract pattern.',
    messages: [{ role: 'user', content: buildPrompt(pattern, examples, featured) }],
  });

  const textBlock = response.content.find((b) => b.type === 'text');
  const raw = textBlock && textBlock.type === 'text' ? textBlock.text : '';
  let { linkedin, x } = parseJsonResponse(raw);

  // Belt-and-suspenders: strip any em dashes the model slipped in.
  linkedin = linkedin.replace(/—/g, ', ');
  x = x.replace(/—/g, ', ');

  return {
    featuredProduct: featured?.product ?? '',
    patternTitle: pattern.title,
    linkedin,
    x,
    companiesToTag: buildCompaniesToTag(examples.map((e) => e.product)),
  };
}
