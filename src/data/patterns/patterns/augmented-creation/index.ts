import { Pattern } from '../../../../types';
import { examples } from './examples';
import { guidelines } from './guidelines';
import { considerations } from './considerations';
import { codeExamples } from './code-examples';

export const augmentedcreation: Pattern = {
  id: "augmented-creation",
  title: "Augmented Creation",
  slug: "augmented-creation",
  description: "Empower users to create content with AI as a collaborative partner.",
  category: "Human-AI Collaboration",
  thumbnail: "/images/examples/github-copilot-highlighting.gif",
  content: {
    problem: "Content creation is often time-consuming and challenging, especially with creative blocks or the need for efficient, high-quality output.",
    solution: "Provide AI tools that collaborate with users in the creative process, offering suggestions, improvements, and assistance while maintaining human creative control and authorship.",
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
