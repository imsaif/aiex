import { Pattern } from '../../../../types';
import { examples } from './examples';
import { guidelines } from './guidelines';
import { considerations } from './considerations';
import { codeExamples } from './code-examples';
import { figmaPrompt } from './figma-prompt';

export const confidencevisualization: Pattern = {
  id: "confidence-visualization",
  title: "Confidence Visualization",
  slug: "confidence-visualization",
  description: "Display AI certainty levels through visual indicators, helping users understand prediction reliability and decide when to trust or verify outputs.",
  category: "Trustworthy & Reliable AI",
  tags: ["confidence", "transparency", "certainty", "visual indicators", "trust", "reliability"],
  thumbnail: "/images/examples/confidence-visualization.gif",
  content: {
    problem: "Users don't know how much to trust AI predictions, leading to over-reliance on incorrect outputs or unnecessary verification.",
    solution: "Design visual indicators that communicate AI confidence levels. Use intuitive representations like progress bars, color coding, or percentages to help users gauge reliability.",
    examples,
    guidelines,
    considerations,
    relatedPatterns: [
      "Explainable AI",
      "Transparent Feedback",
      "Error Recovery & Graceful Degradation"
    ],
    codeExamples,
    figmaPrompt
  }
};
