import { Pattern } from '../../../../types';
import { examples } from './examples';
import { guidelines } from './guidelines';
import { considerations } from './considerations';
import { codeExamples } from './code-examples';
import { figmaPrompt } from './figma-prompt';

export const progressiveenhancement: Pattern = {
  id: "progressive-enhancement",
  title: "Progressive Enhancement",
  slug: "progressive-enhancement",
  status: 'implemented',
  description: "Provide immediate basic responses then progressively add detail and accuracy.",
  category: "Performance & Efficiency",
  tags: ["performance", "streaming", "incremental", "responsive", "speed", "enhancement"],
  thumbnail: "/api/og/patterns?slug=progressive-enhancement",
  introduction: "Progressive Enhancement provides immediate basic responses then adds detail as processing continues. Instead of waiting for perfect answers, the system streams content in real-time. It's essential for conversational AI or search where perceived speed matters. Examples include ChatGPT streaming word-by-word, Google Search showing instant results then refining, or Perplexity displaying quick answers while gathering citations.",
  datePublished: "2024-11-07",
  dateModified: "2025-11-18",
  content: {
    problem: "AI systems often require significant time to generate high-quality, detailed responses. Users are left waiting with no feedback, leading to frustration and uncertainty about whether the system is working.",
    solution: "Design AI systems that provide immediate basic responses and progressively enhance them with more detail, accuracy, or sophistication. Stream content as it's generated, allowing users to consume information without waiting for complete processing.",
    examples,
    guidelines,
    considerations,
    relatedPatterns: [
      "Intelligent Caching",
      "Confidence Visualization",
      "Graceful Degradation"
    ],
    codeExamples,
    figmaPrompt
  }
};
