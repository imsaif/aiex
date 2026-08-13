import type { Pattern } from '@/types';
import { companyLogos } from '@/data/company-logos';

export interface UsedByProduct {
  name: string;
  logo?: string;
}

const LOGO_DIR = '/images/logos/simple-icons';

/**
 * Products that appear in example titles under a name companyLogos doesn't
 * carry (ChatGPT vs OpenAI, Claude vs Anthropic) or that only exist as a logo
 * file. Checked before companyLogos, more specific names first, on word
 * boundaries so 'Meta' never matches inside 'metadata'.
 */
const PRODUCT_LOGO_ALIASES: { name: string; logo: string }[] = [
  { name: 'GitHub Copilot', logo: `${LOGO_DIR}/githubcopilot.svg` },
  { name: 'Hugging Face', logo: `${LOGO_DIR}/huggingface.svg` },
  { name: 'DuckDuckGo', logo: `${LOGO_DIR}/duckduckgo.svg` },
  { name: 'Photoshop', logo: `${LOGO_DIR}/adobephotoshop.svg` },
  { name: 'ChatGPT', logo: `${LOGO_DIR}/openai.svg` },
  { name: 'DALL-E', logo: `${LOGO_DIR}/openai.svg` },
  { name: 'Copilot', logo: `${LOGO_DIR}/githubcopilot.svg` },
  { name: 'Claude', logo: `${LOGO_DIR}/claude-design.svg` },
  { name: 'Gemini', logo: `${LOGO_DIR}/googlegemini.svg` },
  { name: 'Zapier', logo: `${LOGO_DIR}/zapier.svg` },
  { name: 'Cursor', logo: `${LOGO_DIR}/cursor.svg` },
  { name: 'Discord', logo: `${LOGO_DIR}/discord.svg` },
  { name: 'Signal', logo: `${LOGO_DIR}/signal.svg` },
  { name: 'Amazon', logo: `${LOGO_DIR}/amazon.svg` },
  { name: 'Gmail', logo: `${LOGO_DIR}/gmail.svg` },
  { name: 'Loom', logo: `${LOGO_DIR}/loom.svg` },
  { name: 'Meta', logo: `${LOGO_DIR}/meta.svg` },
  { name: 'Bing', logo: `${LOGO_DIR}/bing.svg` },
  { name: 'AWS', logo: `${LOGO_DIR}/aws.svg` },
  { name: 'IBM', logo: `${LOGO_DIR}/ibm.svg` },
  { name: 'Crisis Text Line', logo: `${LOGO_DIR}/crisistextline.png` },
  { name: 'PinwheelGPT', logo: `${LOGO_DIR}/pinwheel.png` },
  { name: 'Superhuman', logo: `${LOGO_DIR}/superhuman.webp` },
  { name: 'Pinwheel', logo: `${LOGO_DIR}/pinwheel.png` },
  { name: 'GPTZero', logo: `${LOGO_DIR}/gptzero.svg` },
  { name: 'Granola', logo: `${LOGO_DIR}/granola.svg` },
  { name: 'Woebot', logo: `${LOGO_DIR}/woebot.png` },
  { name: 'Devin', logo: `${LOGO_DIR}/devin.svg` },
  { name: 'Wysa', logo: `${LOGO_DIR}/wysa.jpg` },
];

function matchAlias(title: string): { name: string; logo: string } | undefined {
  return PRODUCT_LOGO_ALIASES.find((alias) =>
    new RegExp(`\\b${alias.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i').test(title)
  );
}

/**
 * Example titles read "Product - Feature Being Shown"; only the product half
 * belongs in a Used-by cell.
 */
function productNameFromTitle(title: string): string {
  const cleaned = title.replace(/^[^\p{L}\p{N}]+/u, '');
  return cleaned.split(/\s+[—–:-]\s+|:\s+/)[0].trim() || cleaned || title;
}

/**
 * Derives the "Used by" products for a pattern from its real-world examples.
 * A known company name appearing in an example title gets its self-hosted
 * logo; anything else degrades to a text-only name. Must never throw: the
 * directory renders one row per pattern regardless of example data quality.
 */
export function exampleProducts(pattern: Pattern, limit = 4): UsedByProduct[] {
  const examples = pattern.content.examples ?? [];
  const seen = new Set<string>();
  const products: UsedByProduct[] = [];
  for (const example of examples) {
    const title = (example.title ?? '').trim();
    if (!title) continue;
    const match =
      matchAlias(title) ??
      companyLogos.find((company) => title.toLowerCase().includes(company.name.toLowerCase()));
    const name = match ? match.name : productNameFromTitle(title);
    if (seen.has(name)) continue;
    seen.add(name);
    products.push(match ? { name, logo: match.logo } : { name });
    if (products.length >= limit) break;
  }
  return products;
}
