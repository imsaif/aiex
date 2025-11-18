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
  status: 'implemented',
  description: "Display AI certainty levels through visual indicators, helping users understand prediction reliability and decide when to trust or verify outputs.",
  category: "Trustworthy & Reliable AI",
  tags: ["confidence", "transparency", "certainty", "visual indicators", "trust", "reliability"],
  thumbnail: "/images/examples/confidence-visualization.png",
  introduction: "Confidence Visualization is an AI design pattern that shows how certain the AI is about its predictions using visual indicators like progress bars, percentages, or color coding. Instead of presenting all AI outputs as equally reliable, this pattern helps users quickly gauge whether to trust a prediction or double-check it. It's essential for high-stakes decisions where incorrect AI outputs have consequences, medical or financial AI systems, or any tool where users need to know when to verify results. Examples include weather apps showing prediction confidence, translation tools indicating certainty levels, or spam filters displaying probability scores so you can decide whether to check the folder.",
  datePublished: "2024-01-15",
  dateModified: "2025-11-18",
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
