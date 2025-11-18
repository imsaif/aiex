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
    logo: 'https://cdn.jsdelivr.net/npm/simple-icons@12.0.0/icons/apple.svg',
  },
  {
    name: 'Google',
    logo: 'https://cdn.jsdelivr.net/npm/simple-icons@12.0.0/icons/google.svg',
  },
  {
    name: 'GitHub',
    logo: 'https://cdn.jsdelivr.net/npm/simple-icons@12.0.0/icons/github.svg',
  },
  {
    name: 'Figma',
    logo: 'https://cdn.jsdelivr.net/npm/simple-icons@12.0.0/icons/figma.svg',
  },
  {
    name: 'OpenAI',
    logo: 'https://cdn.jsdelivr.net/npm/simple-icons@12.0.0/icons/openai.svg',
  },
  {
    name: 'Anthropic',
    logo: 'https://cdn.jsdelivr.net/npm/simple-icons@12.0.0/icons/anthropic.svg',
  },
  {
    name: 'Microsoft',
    logo: 'https://cdn.jsdelivr.net/npm/simple-icons@12.0.0/icons/microsoft.svg',
  },
  {
    name: 'Slack',
    logo: 'https://cdn.jsdelivr.net/npm/simple-icons@12.0.0/icons/slack.svg',
  },
  {
    name: 'Notion',
    logo: 'https://cdn.jsdelivr.net/npm/simple-icons@12.0.0/icons/notion.svg',
  },
  {
    name: 'Adobe',
    logo: 'https://cdn.jsdelivr.net/npm/simple-icons@12.0.0/icons/adobe.svg',
  },
  {
    name: 'Tesla',
    logo: 'https://cdn.jsdelivr.net/npm/simple-icons@12.0.0/icons/tesla.svg',
  },
  {
    name: 'Netflix',
    logo: 'https://cdn.jsdelivr.net/npm/simple-icons@12.0.0/icons/netflix.svg',
  },
  {
    name: 'Duolingo',
    logo: 'https://cdn.jsdelivr.net/npm/simple-icons@12.0.0/icons/duolingo.svg',
  },
  {
    name: 'Grammarly',
    logo: 'https://cdn.jsdelivr.net/npm/simple-icons@12.0.0/icons/grammarly.svg',
  },
  {
    name: 'Midjourney',
    logo: 'https://cdn.jsdelivr.net/npm/simple-icons@12.0.0/icons/midjourney.svg',
  },
  {
    name: 'Perplexity',
    logo: 'https://cdn.jsdelivr.net/npm/simple-icons@12.0.0/icons/perplexity.svg',
  },
  {
    name: 'Spotify',
    logo: 'https://cdn.jsdelivr.net/npm/simple-icons@12.0.0/icons/spotify.svg',
  },
];
