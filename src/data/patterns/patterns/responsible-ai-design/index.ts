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
    problem: "AI systems can perpetuate biases, make unfair decisions, or cause harm if not designed with ethical considerations and inclusive practices in mind.",
    solution: "Implement design practices that prioritize fairness, transparency, accountability, and user welfare throughout the AI system lifecycle, from development to deployment.",
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
