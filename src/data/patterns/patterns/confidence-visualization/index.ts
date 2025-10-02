import { Pattern } from '../../../../types';
import { examples } from './examples';
import { guidelines } from './guidelines';
import { considerations } from './considerations';
import { codeExamples } from './code-examples';

export const confidencevisualization: Pattern = {
  id: "confidence-visualization",
  title: "Confidence Visualization",
  slug: "confidence-visualization",
  description: "Display AI's certainty levels through visual indicators, helping users understand prediction reliability and make informed decisions about when to trust or verify AI outputs.",
  category: "Trustworthy & Reliable AI",
  tags: ["confidence", "transparency", "certainty", "visual indicators", "trust", "reliability"],
  thumbnail: "/images/examples/confidence-visualization.gif",
  content: {
    problem: "Users don't know how much to trust AI predictions, leading to either over-reliance on incorrect outputs or unnecessary verification of accurate results.",
    solution: "Design visual indicators that communicate the AI's confidence level in its predictions. Use clear, intuitive representations like progress bars, color coding, or percentage displays to help users gauge reliability.",
    examples,
    guidelines,
    considerations,
    relatedPatterns: [
      "Explainable AI",
      "Transparent Feedback",
      "Error Recovery & Graceful Degradation"
    ],
    codeExamples
  }
};
