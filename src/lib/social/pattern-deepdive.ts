import Anthropic from '@anthropic-ai/sdk';
import type { Pattern, CodeExample } from '@/types';
import { getSocialHandle } from '@/data/product-social-handles';

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! });

const MODEL = 'claude-sonnet-4-6';
const BRAND_SIGNOFF = 'I break down AI UX patterns at aiuxdesign.guide.';
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.aiuxdesign.guide';

// Markers the model is told to leave in place; we splice real content in deterministically.
const CODE_MARKER = '{{CODE}}';
const PATTERN_URL_MARKER = '{{PATTERN_URL}}';

export interface CompanyToTag {
  product: string;
  /** Exact X handle (no @). Absent when not on file. */
  x?: string;
  /** Display name to search in LinkedIn's native @-mention autocomplete. */
  linkedinName?: string;
  /** True when we have no verified handle — surface in the UI as "verify before tagging". */
  needsHandle: boolean;
}

export interface DeepDiveImage {
  /** Absolute URL to the example image/animation on the live site. */
  url: string;
  /** Human caption (the example title, emoji-stripped). */
  caption: string;
  /** Alt text from the pattern data, when present. */
  alt?: string;
}

export interface PatternDeepDive {
  /** Featured product the article leads with. */
  featuredProduct: string;
  /** Pattern used as the analytical lens. */
  patternTitle: string;
  /** Canonical pattern-page URL the article links back to. */
  patternUrl: string;
  /** Full long-form LinkedIn-ready Markdown article (real code spliced in verbatim). */
  article: string;
  /** Shorter X teaser carrying the single sharpest insight. */
  x: string;
  /** Companies referenced in the article, with handles to tag. */
  companiesToTag: CompanyToTag[];
  /** Example images to attach when publishing. */
  images: DeepDiveImage[];
}

function cleanTitle(title: string): string {
  return title.replace(/^[\s✅❌⚠️🚫]+/g, '').trim();
}

function extractProductName(title: string): string {
  const cleaned = cleanTitle(title);
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
      title: cleanTitle(e.title),
      description: e.description,
    }));
}

function pickCodeExample(pattern: Pattern): CodeExample | null {
  const code = pattern.content.codeExamples?.find((c) => c.code && c.code.trim());
  return code || null;
}

function buildImages(pattern: Pattern): DeepDiveImage[] {
  const out: DeepDiveImage[] = [];
  for (const e of pattern.content.examples || []) {
    const path = e.image || e.imagePath;
    if (!path) continue;
    const url = path.startsWith('http') ? path : `${SITE_URL}${path}`;
    out.push({ url, caption: cleanTitle(e.title || ''), alt: e.altText });
  }
  return out;
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
  featured: DeepDiveExample | null,
  codeExample: CodeExample | null
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
      : (pattern.content.guidelines || []).slice(0, 6).join('\n');

  const pitfalls =
    pattern.content.judgmentCall?.trap?.trim() ||
    (pattern.content.considerations || []).slice(0, 3).join('\n');

  const productSection =
    examples.length > 0
      ? `REAL PRODUCTS doing this (walk through several by name so they can be tagged, use these descriptions as your source of truth):
${examples.map((e, i) => `${i + 1}. ${e.product} — ${e.title}: ${e.description}`).join('\n')}`
      : `No specific product examples are on file for this pattern. Write from the pattern content above. You may name well-known products only where it is genuinely, verifiably true; do NOT invent specific UI claims about a named product.`;

  const hookInstruction = featured
    ? `Open on ${featured.product} (${featured.title}: ${featured.description}). Lead with the concrete product move, not the pattern name. Make a designer stop scrolling.`
    : `Open on the design problem this pattern solves: the tension or failure mode, concretely. Do not open with the pattern name.`;

  const codeSection = codeExample
    ? `CODE SECTION (required): Add a section that shows how to build this in code. Write 1-2 sentences introducing the example titled "${codeExample.title}" (${codeExample.description}; language: ${codeExample.language}). Then put the literal token ${CODE_MARKER} ON ITS OWN LINE where the code block belongs. DO NOT write any code yourself: the ${CODE_MARKER} token will be replaced with a verified, working code example. Never reproduce, paraphrase, or invent the code.`
    : `CODE SECTION: There is no code example on file for this pattern. Do NOT include a code section and do NOT emit a ${CODE_MARKER} token.`;

  return `You are writing a long-form LinkedIn ARTICLE for product designers and builders. It is driven by the PATTERN CONTENT below. Product examples are supporting evidence, not the source of truth.

PATTERN:
Name: ${pattern.title}
What it is: ${pattern.description}
Why it matters: ${pattern.content.problem}
How it's solved: ${pattern.content.solution}

KEY MOVES of this pattern:
${moves}

COMMON PITFALL(S) to warn against:
${pitfalls}

${productSection}

${codeSection}

Write the ARTICLE as Markdown, roughly 800-1400 words, with this structure:
1. A sharp headline as an H1 (a single line starting with "# ").
2. A hook/intro. ${hookInstruction}
3. "How real products handle it" — walk through 2-4 of the named products above using the given descriptions. Name each product so it can be tagged. Use "${pattern.title}" as the analytical lens, named once, naturally.
4. The code section described above (only if a code example exists).
5. "Key takeaways" — a short bulleted list a designer can apply to their own product, grounded in the key moves.
6. "What to avoid" — the pitfall(s) above, made concrete.
7. A final sign-off line: include the token ${PATTERN_URL_MARKER} as a Markdown link to the full breakdown, then this exact line on its own line: "${BRAND_SIGNOFF}"

Voice: sharp, opinionated, specific. You have a point of view. No corporate fluff, no "in today's fast-paced world", no hashtag soup. Do NOT use em dashes (use commas, periods, or colons instead). Use Markdown headings (##), short paragraphs, and bullet lists.

Then write a SHORT version for X (under 280 characters) carrying the single sharpest insight, ending by pointing readers to the full breakdown.

Return ONLY valid JSON, no prose around it:
{
  "article": "the full Markdown article with line breaks as \\n",
  "x": "the X post text"
}`;
}

function parseJsonResponse(text: string): { article: string; x: string } {
  // Tolerate code fences or stray prose around the JSON object.
  const match = text.match(/\{[\s\S]*\}/);
  if (!match) throw new Error('No JSON object found in model response');
  const parsed = JSON.parse(match[0]);
  if (typeof parsed.article !== 'string' || typeof parsed.x !== 'string') {
    throw new Error('Model response missing article/x fields');
  }
  return { article: parsed.article, x: parsed.x };
}

function spliceCode(article: string, codeExample: CodeExample | null): string {
  if (!codeExample) {
    // Defensive: drop any stray marker the model emitted despite instructions.
    return article.replace(new RegExp(`\\s*${CODE_MARKER}\\s*`, 'g'), '\n\n');
  }
  // Scrub em dashes from the title (metadata/prose), but never from the code body — it stays verbatim.
  const title = codeExample.title.replace(/—/g, ', ');
  const block = `**${title}**\n\n\`\`\`${codeExample.language || ''}\n${codeExample.code.trim()}\n\`\`\``;
  if (article.includes(CODE_MARKER)) {
    return article.replace(CODE_MARKER, block);
  }
  // Model dropped the marker: append the code under its own heading so it isn't lost.
  return `${article}\n\n## Build it\n\n${block}`;
}

function applyPatternUrl(article: string, patternUrl: string): string {
  if (article.includes(PATTERN_URL_MARKER)) {
    return article.replace(new RegExp(PATTERN_URL_MARKER, 'g'), patternUrl);
  }
  // Model dropped the marker: append a CTA so the article always links back.
  return `${article}\n\nFull breakdown with interactive examples: ${patternUrl}`;
}

export interface GenerateOptions {
  /** Product name to lead the article with. Defaults to the pattern's first example. */
  featuredProduct?: string;
}

/**
 * Generate a long-form deep-dive article for one pattern. Output is a DRAFT for
 * human review and manual posting (LinkedIn company tags only fire from the
 * native composer), never auto-published. The pattern's real code example is
 * spliced in verbatim so the model can never alter or invent it.
 */
export async function generatePatternDeepDive(
  pattern: Pattern,
  options: GenerateOptions = {}
): Promise<PatternDeepDive> {
  const examples = gatherExamples(pattern);
  const featured: DeepDiveExample | null =
    (options.featuredProduct &&
      examples.find((e) => e.product.toLowerCase() === options.featuredProduct!.toLowerCase())) ||
    examples[0] ||
    null;
  const codeExample = pickCodeExample(pattern);
  const patternUrl = `${SITE_URL}/patterns/${pattern.slug}`;

  const response = await anthropic.messages.create({
    model: MODEL,
    max_tokens: 4096,
    temperature: 0.6,
    system:
      'You are a sharp, opinionated product designer who writes long-form teardowns of how real AI products handle UX. You write for designers and builders. You lead with concrete product detail, never abstract pattern names.',
    messages: [{ role: 'user', content: buildPrompt(pattern, examples, featured, codeExample) }],
  });

  const textBlock = response.content.find((b) => b.type === 'text');
  const raw = textBlock && textBlock.type === 'text' ? textBlock.text : '';
  let { article, x } = parseJsonResponse(raw);

  // Strip em dashes from the model's prose BEFORE splicing verbatim code, so the
  // real code example is never altered.
  article = article.replace(/—/g, ', ');
  x = x.replace(/—/g, ', ');

  article = spliceCode(article, codeExample);
  article = applyPatternUrl(article, patternUrl);

  // The X teaser may also reference the URL marker; replace it there too (no
  // append-fallback — keep the teaser tight under the 280-char limit).
  x = x.replace(new RegExp(PATTERN_URL_MARKER, 'g'), patternUrl).replace(CODE_MARKER, '').trim();

  return {
    featuredProduct: featured?.product ?? '',
    patternTitle: pattern.title,
    patternUrl,
    article,
    x,
    companiesToTag: buildCompaniesToTag(examples.map((e) => e.product)),
    images: buildImages(pattern),
  };
}
