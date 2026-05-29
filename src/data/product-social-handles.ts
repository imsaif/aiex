/**
 * Product → social handle map for pattern deep-dive posts.
 *
 * Used by the admin social tool when composing a product teardown so the post
 * tags the right company. Note on how tagging actually works:
 *
 *  - LinkedIn company tags only fire from the NATIVE composer (the API can't
 *    reliably tag company pages). So for LinkedIn we only need the company's
 *    display NAME — the human types "@" in LinkedIn and picks the real page
 *    from autocomplete. `linkedinName` is just the reminder of what to search.
 *  - X (@handle) is plain text in the tweet and DOES create a real mention, so
 *    the `x` handle must be exact. When we're not confident of a handle we omit
 *    it rather than guess (a wrong public @mention is an asymmetric downside).
 *
 * Keep this curated and correct. When a featured product isn't here, the
 * generator falls back to the plain product name (no X mention) and flags it
 * so you can add a verified entry.
 */

export interface SocialHandle {
  /** Exact X/Twitter handle WITHOUT the leading @. Omit if unverified. */
  x?: string;
  /** Display name to search for in LinkedIn's native @-mention autocomplete. */
  linkedinName?: string;
}

export const productSocialHandles: Record<string, SocialHandle> = {
  // AI labs / assistants
  OpenAI: { x: 'OpenAI', linkedinName: 'OpenAI' },
  ChatGPT: { x: 'OpenAI', linkedinName: 'OpenAI' },
  'Dall-E': { x: 'OpenAI', linkedinName: 'OpenAI' },
  Claude: { x: 'AnthropicAI', linkedinName: 'Anthropic' },
  Anthropic: { x: 'AnthropicAI', linkedinName: 'Anthropic' },
  Gemini: { x: 'GoogleDeepMind', linkedinName: 'Google DeepMind' },
  Perplexity: { x: 'perplexity_ai', linkedinName: 'Perplexity' },
  Midjourney: { x: 'midjourney', linkedinName: 'Midjourney' },
  'Hugging Face': { x: 'huggingface', linkedinName: 'Hugging Face' },
  Hugging: { x: 'huggingface', linkedinName: 'Hugging Face' },

  // Big platforms
  Google: { x: 'Google', linkedinName: 'Google' },
  Microsoft: { x: 'Microsoft', linkedinName: 'Microsoft' },
  Copilot: { x: 'github', linkedinName: 'GitHub' },
  GitHub: { x: 'github', linkedinName: 'GitHub' },
  Apple: { x: 'Apple', linkedinName: 'Apple' },
  Adobe: { x: 'Adobe', linkedinName: 'Adobe' },
  'Adobe Firefly': { x: 'Adobe', linkedinName: 'Adobe' },
  Photoshop: { x: 'Photoshop', linkedinName: 'Adobe' },
  AWS: { x: 'awscloud', linkedinName: 'Amazon Web Services (AWS)' },
  IBM: { x: 'IBM', linkedinName: 'IBM' },
  Tesla: { x: 'Tesla', linkedinName: 'Tesla' },
  Netflix: { x: 'netflix', linkedinName: 'Netflix' },
  Spotify: { x: 'Spotify', linkedinName: 'Spotify' },

  // AI & productivity tools
  Notion: { x: 'NotionHQ', linkedinName: 'Notion' },
  Figma: { x: 'figma', linkedinName: 'Figma' },
  Loom: { x: 'loom', linkedinName: 'Loom' },
  Grammarly: { x: 'Grammarly', linkedinName: 'Grammarly' },
  Superhuman: { x: 'Superhuman', linkedinName: 'Superhuman' },
  Slack: { x: 'SlackHQ', linkedinName: 'Slack' },
  Discord: { x: 'discord', linkedinName: 'Discord' },
  Duolingo: { x: 'duolingo', linkedinName: 'Duolingo' },
  Zapier: { x: 'zapier', linkedinName: 'Zapier' },
  Cursor: { x: 'cursor_ai', linkedinName: 'Cursor' },
  Granola: { x: 'meetgranola', linkedinName: 'Granola' },
  Linear: { x: 'linear', linkedinName: 'Linear' },

  // Privacy / search
  DuckDuckGo: { x: 'DuckDuckGo', linkedinName: 'DuckDuckGo' },
  Signal: { x: 'signalapp', linkedinName: 'Signal' },
};

/** Look up a product's social handle. Returns undefined when not on file. */
export function getSocialHandle(productName: string): SocialHandle | undefined {
  if (!productName) return undefined;
  if (productSocialHandles[productName]) return productSocialHandles[productName];
  // Case-insensitive fallback
  const key = Object.keys(productSocialHandles).find(
    (k) => k.toLowerCase() === productName.toLowerCase()
  );
  return key ? productSocialHandles[key] : undefined;
}
