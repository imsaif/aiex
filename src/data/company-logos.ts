/**
 * Shared Company Logos Data
 *
 * Single source of truth for company logos used across the application.
 * Currently used by:
 * - Homepage: Company logo carousel (social proof)
 * - Handbook: Company logos in hero section
 */

export interface CompanyLogo {
  name: string;
  logo: string;
}

/**
 * Companies featured in the logo carousel
 * These are companies known to use or benefit from the AI design patterns
 */
export const companyLogos: CompanyLogo[] = [
  {
    name: 'Apple',
    logo: 'https://cdn.simpleicons.org/apple/000000',
  },
  {
    name: 'Google',
    logo: 'https://cdn.simpleicons.org/google/000000',
  },
  {
    name: 'GitHub',
    logo: 'https://cdn.simpleicons.org/github/000000',
  },
  {
    name: 'Figma',
    logo: 'https://cdn.simpleicons.org/figma/000000',
  },
  {
    name: 'OpenAI',
    logo: 'https://cdn.simpleicons.org/openai/000000',
  },
  {
    name: 'Anthropic',
    logo: 'https://cdn.simpleicons.org/anthropic/000000',
  },
  {
    name: 'Microsoft',
    logo: 'https://cdn.jsdelivr.net/npm/simple-icons@12.0.0/icons/microsoft.svg',
  },
  {
    name: 'Slack',
    logo: 'https://cdn.simpleicons.org/slack/000000',
  },
  {
    name: 'Notion',
    logo: 'https://cdn.simpleicons.org/notion/000000',
  },
  {
    name: 'Adobe',
    logo: 'https://cdn.jsdelivr.net/npm/simple-icons@12.0.0/icons/adobe.svg',
  },
  {
    name: 'Tesla',
    logo: 'https://cdn.simpleicons.org/tesla/000000',
  },
  {
    name: 'Netflix',
    logo: 'https://cdn.simpleicons.org/netflix/000000',
  },
  {
    name: 'Duolingo',
    logo: 'https://cdn.simpleicons.org/duolingo/000000',
  },
  {
    name: 'Grammarly',
    logo: 'https://cdn.simpleicons.org/grammarly/000000',
  },
  {
    name: 'Midjourney',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/2/24/Midjourney_Emblem.svg',
  },
  {
    name: 'Perplexity',
    logo: 'https://cdn.jsdelivr.net/npm/simple-icons@12.0.0/icons/perplexity.svg',
  },
  {
    name: 'Spotify',
    logo: 'https://cdn.simpleicons.org/spotify/000000',
  },
];
