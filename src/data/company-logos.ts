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
  { name: 'Apple', logo: '/images/logos/simple-icons/apple.svg' },
  { name: 'Google', logo: '/images/logos/simple-icons/google.svg' },
  { name: 'GitHub', logo: '/images/logos/simple-icons/github.svg' },
  { name: 'Figma', logo: '/images/logos/simple-icons/figma.svg' },
  { name: 'OpenAI', logo: '/images/logos/simple-icons/openai.svg' },
  { name: 'Anthropic', logo: '/images/logos/simple-icons/anthropic.svg' },
  { name: 'Microsoft', logo: '/images/logos/simple-icons/microsoft.svg' },
  { name: 'Slack', logo: '/images/logos/simple-icons/slack.svg' },
  { name: 'Notion', logo: '/images/logos/simple-icons/notion.svg' },
  { name: 'Adobe', logo: '/images/logos/simple-icons/adobe.svg' },
  { name: 'Tesla', logo: '/images/logos/simple-icons/tesla.svg' },
  { name: 'Netflix', logo: '/images/logos/simple-icons/netflix.svg' },
  { name: 'Duolingo', logo: '/images/logos/simple-icons/duolingo.svg' },
  { name: 'Grammarly', logo: '/images/logos/simple-icons/grammarly.svg' },
  { name: 'Midjourney', logo: '/images/logos/Midjourney_Emblem.svg' },
  { name: 'Perplexity', logo: '/images/logos/simple-icons/perplexity.svg' },
  { name: 'Spotify', logo: '/images/logos/simple-icons/spotify.svg' },
];
