import { Pattern } from '../../../../types';
import { examples } from './examples';
import { guidelines } from './guidelines';
import { considerations } from './considerations';
import { codeExamples } from './code-examples';

export const responsibleaidesign: Pattern = {
  id: "responsible-ai-design",
  title: "Responsible AI Design",
  slug: "responsible-ai-design",
  description: "Address ethical considerations, bias mitigation, and inclusivity in AI systems",
  category: "Responsible AI Design",
  thumbnail: "/images/examples/linkedin-bias-detection.gif",
  content: {
    problem: "AI systems can perpetuate biases, make unfair decisions, or cause harm without ethical design practices.",
    solution: "Prioritize fairness, transparency, accountability, and user welfare throughout the AI system lifecycle.",
    examples,
    guidelines,
    considerations,
    relatedPatterns: [
      "Contextual Assistance",
      "Progressive Disclosure",
      "Human-in-the-Loop"
    ],
    codeExamples
  }
};
