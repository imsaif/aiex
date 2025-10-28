/**
 * Product logo mapping using Simple Icons CDN and fallbacks
 * Maps product names to Simple Icons slug names or custom URLs
 * CDN URL format: https://cdn.simpleicons.org/[slug]
 */

export const productLogos: Record<string, string> = {
  Google: 'google',
  GitHub: 'github',
  Notion: 'notion',
  Netflix: 'netflix',
  Spotify: 'spotify',
  OpenAI: 'openai',
  Photoshop: 'https://cdn.jsdelivr.net/npm/simple-icons@12.0.0/icons/adobephotoshop.svg',
  Microsoft: 'https://cdn.jsdelivr.net/npm/simple-icons@12.0.0/icons/microsoft.svg',
  ChatGPT: 'openai', // ChatGPT is part of OpenAI
  Claude: 'anthropic',
  Figma: 'figma',
  Slack: 'slack',
  Discord: 'discord',
  Gmail: 'gmail',
  Copilot: 'github',
  'Siri': 'apple',
  'Alexa': 'amazon',
  'Cortana': 'https://cdn.jsdelivr.net/npm/simple-icons@12.0.0/icons/microsoft.svg',
};

/**
 * Get logo URL for a product
 */
export function getProductLogoUrl(productName: string): string {
  const slug = productLogos[productName];
  if (!slug) return '';

  // If slug is already a full URL, return it directly
  if (slug.startsWith('http')) {
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
