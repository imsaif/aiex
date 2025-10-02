import { Example } from '../../../../types';

export const examples: Example[] = [
  {
    title: "Claude Streaming Responses",
    description: "Starts displaying AI responses immediately as they're generated, progressively building complete answers while users can read early content without waiting.",
    image: "/images/examples/claude-streaming.gif",
    altText: "Claude progressively streaming responses"
  },
  {
    title: "Google Bard Quick Answers",
    description: "Provides instant basic answers first, then progressively enhances with detailed explanations, sources, and related information as computation completes.",
    image: "/images/examples/bard-progressive.gif",
    altText: "Google Bard showing progressive enhancement"
  },
  {
    title: "Dall-E Progressive Rendering",
    description: "Shows low-resolution preview images immediately, then progressively enhances to full detail, allowing users to evaluate concepts before final render completes.",
    image: "/images/examples/dalle-progressive.gif",
    altText: "Dall-E progressively rendering images"
  }
];
