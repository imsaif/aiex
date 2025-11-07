import { Example } from '../../../../types';

export const examples: Example[] = [
  {
    title: "Claude Streaming Responses",
    description: "Starts displaying AI responses immediately as they're generated, progressively building complete answers while users can read early content without waiting.",
    image: "/images/examples/claudeprogressiveenhancement.gif",
    altText: "Claude progressively streaming responses"
  },
  {
    title: "Perplexity Progressive Attribution",
    description: "Shows instant search results first, then progressively loads citations and sources, giving users quick answers while detailed information continues to enhance the response.",
    image: "/images/examples/perplexity-attribution.gif",
    altText: "Perplexity progressively loading sources and attribution"
  },
  {
    title: "Dall-E Progressive Rendering",
    description: "Shows low-resolution preview images immediately, then progressively enhances to full detail, allowing users to evaluate concepts before final render completes.",
    image: "/images/examples/dalle-progressive.gif",
    altText: "Dall-E progressively rendering images"
  }
];
