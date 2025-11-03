import { Example } from '../../../../types';

export const examples: Example[] = [
  {
    title: "GitHub Copilot Code Suggestions",
    description: "Pre-caches common code patterns and frequently used snippets, providing instant suggestions by predicting what developers are likely to need based on context.",
    image: "/images/examples/githubcopilotautocomplete.gif",
    altText: "GitHub Copilot using intelligent caching for code suggestions"
  },
  {
    title: "Midjourney Image Generation Cache",
    description: "Caches similar prompts and style variations, reusing computation when users generate variations of previous images, dramatically reducing generation time.",
    image: "/images/examples/midjourneyimagecache.gif",
    altText: "Midjourney caching similar image generations"
  }
];
