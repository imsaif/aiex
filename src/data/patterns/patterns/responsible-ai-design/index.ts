import { Pattern } from '../../../../types';
import { examples } from './examples';
import { guidelines } from './guidelines';
import { considerations } from './considerations';
import { codeExamples } from './code-examples';
import { figmaPrompt } from './figma-prompt';

export const responsibleaidesign: Pattern = {
  id: "responsible-ai-design",
  title: "Responsible AI Design",
  slug: "responsible-ai-design",
  description: "Address ethical considerations, mitigate bias, and ensure inclusivity in AI systems.",
  category: "Trustworthy & Reliable AI",
  thumbnail: "/images/examples/openai-human-feedback.png",
  content: {
    problem: "AI systems can perpetuate biases, make unfair decisions, or cause harm without ethical design.",
    solution: "Prioritize fairness, transparency, accountability, and user welfare throughout the AI system lifecycle.",
    examples,
    guidelines,
    considerations,
    relatedPatterns: [
      "Contextual Assistance",
      "Progressive Disclosure",
      "Human-in-the-Loop"
    ],
    codeExamples,
    figmaPrompt
  }
};
