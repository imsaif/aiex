/**
 * Product logo mapping using self-hosted Simple Icons
 * All logos are stored locally in /public/images/logos/simple-icons/
 */

const SI = '/images/logos/simple-icons';

export const productLogos: Record<string, string> = {
  // Major AI & Tech Companies
  Google: `${SI}/google.svg`,
  GitHub: `${SI}/github.svg`,
  Notion: `${SI}/notion.svg`,
  Netflix: `${SI}/netflix.svg`,
  Spotify: `${SI}/spotify.svg`,
  OpenAI: `${SI}/openai.svg`,
  Adobe: `${SI}/adobe.svg`,
  Photoshop: `${SI}/adobephotoshop.svg`,
  'Adobe Firefly': `${SI}/adobe.svg`,
  Microsoft: `${SI}/microsoft.svg`,
  ChatGPT: `${SI}/openai.svg`,
  Claude: `${SI}/anthropic.svg`,
  Bing: `${SI}/bing.svg`,
  Figma: `${SI}/figma.svg`,
  Slack: `${SI}/slack.svg`,
  Discord: `${SI}/discord.svg`,
  Gmail: `${SI}/gmail.svg`,
  Copilot: `${SI}/github.svg`,

  // Voice Assistants
  'Siri': `${SI}/apple.svg`,
  'Alexa': `${SI}/amazon.svg`,
  'Cortana': `${SI}/microsoft.svg`,

  // AI & Productivity Tools
  Loom: `${SI}/loom.svg`,
  Superhuman: '/images/logos/superhumanlogo.webp',
  Grammarly: `${SI}/grammarly.svg`,
  Perplexity: `${SI}/perplexity.svg`,
  Midjourney: `${SI}/midjourney.svg`,
  'Dall-E': `${SI}/openai.svg`,
  DuckDuckGo: `${SI}/duckduckgo.svg`,
  Signal: `${SI}/signal.svg`,
  Anthropic: `${SI}/anthropic.svg`,

  // Consumer & Enterprise Platforms
  Apple: `${SI}/apple.svg`,
  Tesla: `${SI}/tesla.svg`,
  IBM: `${SI}/ibm.svg`,
  AWS: `${SI}/aws.svg`,
  Duolingo: `${SI}/duolingo.svg`,
  'Be': '/images/logos/simple-icons/bemyeyes.svg',
  GPTZero: `${SI}/openai.svg`,
  Hugging: `${SI}/huggingface.svg`,

  // AI Development Tools
  Cursor: '/images/logos/cursor.svg',
  Devin: '/images/logos/devin_ai_logo.webp',

  // Mental Health & Wellness AI
  'Woebot': '/images/logos/woebot_health_logo.webp',
  'Crisis': '/images/logos/Crisis_Text_Line_logo.webp',
  'Wysa': '/images/logos/wysa_logo.webp',
};

/**
 * Get logo URL for a product
 */
export function getProductLogoUrl(productName: string): string {
  return productLogos[productName] || '';
}

/**
 * Check if a product has a logo available
 */
export function hasProductLogo(productName: string): boolean {
  return productName in productLogos;
}
