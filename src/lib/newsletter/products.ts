/**
 * Product tagging for /news filter chips.
 *
 * This runs at WRITE time (newsletter generation + the backfill script), not at
 * render time. The accurate signal is `structuredData.items` — the per-story
 * product/title/description the generator already produces — but that column is
 * 6KB/row and deliberately excluded from the /news query for load time. Computing
 * here and storing the small `products` array keeps the list page cheap.
 *
 * History worth knowing: the original filter (Apr 2026) matched only the issue
 * title + summary. That was not a deliberate trade-off — `structuredData` had
 * existed since Jan 2026 and the page fetched whole rows at the time, so the data
 * was already in memory and simply unused. The May 2026 perf projection then
 * dropped `structuredData` from the query, retroactively turning that shortcut
 * into a real constraint. Measured across 60 published issues: title+summary
 * matched nothing on 12 of the last 28 issues (43%); story-level matching drops
 * that to 3 (and those 3 are pre-`structuredData` rows, not a matching failure).
 *
 * Do NOT be tempted to match `content` instead just because /news already fetches
 * it: the audit CTA says "a Claude Code prompt to fix them" in EVERY issue's
 * footer, so Claude would match 28/28 — a chip that matches everything filters
 * nothing.
 */

/**
 * Chip label -> the terms that mean it.
 *
 * Every entry here is matched with word boundaries (see `matches`), which is why
 * short tokens like `v0` are safe. Only products that actually recur in the
 * corpus earn a chip — a chip that returns an empty list reads as broken, so
 * candidates measuring under ~3 issues in 60 were deliberately left out
 * (Cursor, Midjourney, Meta, Notion, Framer, Miro, Windsurf, Lovable and others
 * were all measured and cut on that rule).
 */
export const PRODUCT_KEYWORDS: Record<string, string[]> = {
  Figma: ['Figma'],
  Claude: ['Claude', 'Anthropic'],
  OpenAI: ['OpenAI'],
  ChatGPT: ['ChatGPT'],
  Gemini: ['Gemini'],
  // Gemini is its own chip, so it is NOT listed here — otherwise every Gemini
  // story would light up two chips and Google would stop meaning "Google's other
  // AI surfaces".
  Google: ['Google AI', 'Google DeepMind', 'Google Photos', 'Google Earth', 'Google Labs', 'Google Search'],
  Apple: ['Apple Intelligence', 'Apple'],
  Microsoft: ['Microsoft'],
  Copilot: ['Copilot'],
  GitHub: ['GitHub'],
  Adobe: ['Adobe'],
  Canva: ['Canva'],
  Vercel: ['Vercel'],
  Replit: ['Replit'],
  Perplexity: ['Perplexity'],
  Atlassian: ['Atlassian', 'Jira', 'Confluence'],
  Slack: ['Slack'],
  Reddit: ['Reddit'],
};

// Word-boundary matching, built once at module load. Substring matching was the
// old behaviour and it is subtly wrong: it lets "v0" hit "v0.2", and would let a
// term match inside markup or a URL if this ever ran over HTML.
const PATTERNS: Array<[string, RegExp]> = Object.entries(PRODUCT_KEYWORDS).map(
  ([product, terms]) => [
    product,
    new RegExp(`(?:^|[^A-Za-z0-9])(?:${terms.map(escapeRegExp).join('|')})(?![A-Za-z0-9])`),
  ]
);

function escapeRegExp(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/** Products mentioned anywhere in `text`, in PRODUCT_KEYWORDS order. */
export function extractProducts(text: string): string[] {
  if (!text) return [];
  return PATTERNS.filter(([, re]) => re.test(text)).map(([product]) => product);
}

type StoryItem = { product?: string; title?: string; description?: string };

/**
 * The write-time entry point: title + summary + every story's product, headline
 * and description. `structuredData` is untyped Json, so this tolerates any shape
 * — a row without `items` degrades to title+summary, which is exactly the old
 * behaviour rather than an error.
 */
export function productsForIssue(
  title: string,
  summary: string,
  structuredData: unknown
): string[] {
  const items =
    structuredData && typeof structuredData === 'object' && Array.isArray((structuredData as { items?: unknown }).items)
      ? ((structuredData as { items: StoryItem[] }).items)
      : [];

  const text = [
    title,
    summary,
    ...items.flatMap((i) => [i?.product, i?.title, i?.description]),
  ]
    .filter(Boolean)
    .join(' ');

  return extractProducts(text);
}

/**
 * Reading time in whole minutes, from the rendered newsletter HTML.
 *
 * Stored at write time so /news no longer has to fetch `content` (18KB/row,
 * ~1MB across the 60 listed issues) purely to count words. Returns 0 for empty
 * content, which is also how the list page detects a quiet-day entry — those are
 * written with `content: ''` by the generator's pre-generation skips.
 */
export function computeReadMinutes(content: string | null | undefined): number {
  if (!content || !content.trim()) return 0;
  const words = content
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}
