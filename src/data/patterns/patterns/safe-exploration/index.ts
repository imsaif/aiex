import { Pattern } from '../../../../types';
import { examples } from './examples';
import { guidelines } from './guidelines';
import { considerations } from './considerations';
import { codeExamples } from './code-examples';
import { figmaPrompt } from './figma-prompt';

export const safeexploration: Pattern = {
  id: "safe-exploration",
  title: "Safe Exploration",
  slug: "safe-exploration",
  status: 'completed',
  description: "Design controlled environments for experimenting with AI capabilities without risk.",
  category: "Trustworthy & Reliable AI",
  thumbnail: "/images/examples/huggingfacemodels.gif",
  content: {
    problem: "Users want to experiment with AI capabilities but fear mistakes or unintended consequences.",
    solution: "Provide safe, controlled environments for exploring AI features with sandboxing, undo mechanisms, and clear safe/production boundaries.",
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
