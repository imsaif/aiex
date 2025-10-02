import { Example } from '../../../../types';

export const examples: Example[] = [
  {
    title: "GitHub Copilot Code Suggestions",
    description: "Pre-caches common code patterns and frequently used snippets, providing instant suggestions by predicting what developers are likely to need based on context.",
    image: "/images/examples/copilot-caching.gif",
    altText: "GitHub Copilot using intelligent caching for code suggestions"
  },
  {
    title: "Midjourney Image Generation Cache",
    description: "Caches similar prompts and style variations, reusing computation when users generate variations of previous images, dramatically reducing generation time.",
    image: "/images/examples/midjourney-cache.gif",
    altText: "Midjourney caching similar image generations"
  },
  {
    title: "Perplexity AI Search Results",
    description: "Intelligently caches frequently asked questions and trending topics, updating cache based on time-sensitivity while serving instant results for common queries.",
    image: "/images/examples/perplexity-cache.gif",
    altText: "Perplexity AI serving cached search results"
  }
];
