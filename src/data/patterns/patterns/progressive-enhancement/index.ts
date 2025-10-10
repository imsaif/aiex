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
  description: "Start with fast, basic AI responses and progressively add detail, accuracy, or sophistication as time allows, ensuring immediate feedback while computing better results.",
  category: "Performance & Efficiency",
  tags: ["performance", "streaming", "incremental", "responsive", "speed", "enhancement"],
  thumbnail: "/images/examples/progressive-enhancement.gif",
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
