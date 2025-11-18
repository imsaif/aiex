/**
 * Product logo mapping using Simple Icons CDN and fallbacks
 * Maps product names to Simple Icons slug names or custom URLs
 * CDN URL format: https://cdn.simpleicons.org/[slug]
 */

export const productLogos: Record<string, string> = {
  // Major AI & Tech Companies
  Google: 'google',
  GitHub: 'github',
  Notion: 'notion',
  Netflix: 'netflix',
  Spotify: 'spotify',
  OpenAI: 'openai',
  Adobe: 'https://cdn.jsdelivr.net/npm/simple-icons@12.0.0/icons/adobe.svg',
  Photoshop: 'https://cdn.jsdelivr.net/npm/simple-icons@12.0.0/icons/adobephotoshop.svg',
  'Adobe Firefly': 'https://cdn.jsdelivr.net/npm/simple-icons@12.0.0/icons/adobe.svg',
  Microsoft: 'https://cdn.jsdelivr.net/npm/simple-icons@12.0.0/icons/microsoft.svg',
  ChatGPT: 'openai',
  Claude: 'anthropic',
  Bing: 'https://upload.wikimedia.org/wikipedia/commons/e/e3/Bing_Fluent_Logo_Text.svg',
  Figma: 'figma',
  Slack: 'slack',
  Discord: 'discord',
  Gmail: 'gmail',
  Copilot: 'github',

  // Voice Assistants
  'Siri': 'apple',
  'Alexa': 'amazon',
  'Cortana': 'https://cdn.jsdelivr.net/npm/simple-icons@12.0.0/icons/microsoft.svg',

  // AI & Productivity Tools (newly added)
  Loom: 'loom',
  Superhuman: '/images/logos/superhumanlogo.png', // Local PNG
  Grammarly: 'grammarly',
  Perplexity: 'https://cdn.jsdelivr.net/npm/simple-icons@12.0.0/icons/perplexity.svg',
  Midjourney: 'https://upload.wikimedia.org/wikipedia/commons/2/24/Midjourney_Emblem.svg', // Official Wikimedia Commons
  'Dall-E': 'openai', // Dall-E is made by OpenAI
  DuckDuckGo: 'duckduckgo',
  Signal: 'signal',
  Anthropic: 'anthropic',

  // Consumer & Enterprise Platforms
  Apple: 'apple',
  Tesla: 'tesla',
  IBM: 'https://upload.wikimedia.org/wikipedia/commons/5/51/IBM_logo.svg', // Official IBM SVG from Wikimedia
  AWS: 'https://upload.wikimedia.org/wikipedia/commons/9/93/Amazon_Web_Services_Logo.svg', // Official AWS SVG from Wikimedia
  Duolingo: 'duolingo',
  'Be': 'https://upload.wikimedia.org/wikipedia/commons/a/af/Logo_BeMyEyes.svg', // Official Be My Eyes SVG from Wikimedia
  GPTZero: 'https://cdn.simpleicons.org/openai', // GPTZero detection tool
  Hugging: 'huggingface', // Hugging Face (truncated product name)

  // Mental Health & Wellness AI
  'Woebot': '/images/logos/woebot_health_logo.png', // Mental health chatbot (local)
  'Crisis': '/images/logos/Crisis_Text_Line_logo.png', // Crisis Text Line (local)
  'Wysa': '/images/logos/wysa_logo.png', // Mental wellness AI (local)
};

/**
 * Get logo URL for a product
 */
export function getProductLogoUrl(productName: string): string {
  const slug = productLogos[productName];
  if (!slug) return '';

  // If slug is already a full URL or local path, return it directly
  if (slug.startsWith('http') || slug.startsWith('/')) {
    return slug;
  }

  // Otherwise build the Simple Icons CDN URL
  return `https://cdn.simpleicons.org/${slug}`;
}

/**
 * Check if a product has a logo available
 */
export function hasProductLogo(productName: string): boolean {
  return productName in productLogos;
}
