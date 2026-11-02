/**
 * Company logos for the stories slide. A story's product name is matched to a
 * logo the site already hosts, then to the open Simple Icons set. Anything that
 * does not match (publications, people, unknown brands) returns null and the
 * slide falls back to the story's pattern icon.
 */

const NAVY = '#162036';

/** Logos the site hosts, keyed by the slug a product name normalises to. */
const LOCAL: Record<string, string> = Object.fromEntries(
  [
    'adobe', 'adobephotoshop', 'amazon', 'anthropic', 'apple', 'atlassian', 'aws', 'bing', 'canva',
    'cursor', 'devin', 'discord', 'duckduckgo', 'duolingo', 'figma', 'github', 'githubcopilot',
    'gmail', 'google', 'googlegemini', 'gptzero', 'grammarly', 'granola', 'huggingface', 'ibm',
    'loom', 'meta', 'microsoft', 'midjourney', 'netflix', 'notion', 'openai', 'perplexity', 'reddit',
    'replit', 'signal', 'slack', 'spotify', 'tesla', 'v0', 'vercel', 'zapier',
  ].map((s) => [s, `/images/logos/simple-icons/${s}.svg`]),
);
LOCAL.claude = '/images/logos/claude.svg';

/** Product names whose logo lives under another brand. */
const ALIASES: Record<string, string> = {
  chatgpt: 'openai',
  gemini: 'googlegemini',
  copilot: 'githubcopilot',
  windows: 'microsoft',
  siri: 'apple',
  iphone: 'apple',
  ipad: 'apple',
  macos: 'apple',
  ios: 'apple',
};

/** First words too generic to stand for a brand on their own. */
const STOP_WORDS = new Set(['the', 'a', 'an', 'ux', 'ui', 'ai', 'design', 'pixels', 'new', 'web', 'open']);

const SIMPLE_ICONS_CDN = 'https://cdn.jsdelivr.net/npm/simple-icons@13.21.0/icons';

const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, '');

/** "Microsoft Copilot" → ["microsoftcopilot", "microsoft"]; "Anton Sten / Design Systems" → ["antonsten", "anton"]. */
export function logoCandidates(product: string): string[] {
  const main = product.split(/[/(|]/)[0].trim();
  const words = main.split(/\s+/).filter(Boolean);
  const out = [slug(main)];
  const first = slug(words[0] || '');
  if (words.length > 1 && first.length >= 3 && !STOP_WORDS.has(first)) out.push(first);
  return Array.from(new Set(out.filter(Boolean).map((c) => ALIASES[c] ?? c)));
}

/** Monochrome brand marks come without a fill; paint them navy to match the slide. */
function svgDataUri(svg: string): string {
  const painted = /<svg[^>]*\sfill=/.test(svg) ? svg : svg.replace('<svg', `<svg fill="${NAVY}"`);
  return `data:image/svg+xml;base64,${Buffer.from(painted).toString('base64')}`;
}

const cdnCache = new Map<string, string | null>();

async function fetchSvg(url: string): Promise<string | null> {
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(2500) });
    if (!res.ok) return null;
    const text = await res.text();
    return text.trimStart().startsWith('<svg') ? text : null;
  } catch {
    return null;
  }
}

/** A data URI for the product's logo, or null when no logo matches. Never throws. */
export async function resolveStoryLogo(product: string, origin: string): Promise<string | null> {
  const candidates = logoCandidates(product);

  for (const c of candidates) {
    if (!LOCAL[c]) continue;
    const svg = await fetchSvg(`${origin}${LOCAL[c]}`);
    if (svg) return svgDataUri(svg);
  }

  for (const c of candidates) {
    if (!cdnCache.has(c)) cdnCache.set(c, await fetchSvg(`${SIMPLE_ICONS_CDN}/${c}.svg`));
    const svg = cdnCache.get(c);
    if (svg) return svgDataUri(svg);
  }

  return null;
}
