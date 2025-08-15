import { Pattern } from '../../../../types';
import { examples } from './examples';
import { guidelines } from './guidelines';
import { considerations } from './considerations';
import { codeExamples } from './code-examples';

export const safeexploration: Pattern = {
  id: "safe-exploration",
  title: "Safe Exploration",
  slug: "safe-exploration",
  description: "Design controlled environments for experimenting with AI capabilities without risk",
  category: "Safe Exploration",
  thumbnail: "/images/examples/openai-playground.gif",
  content: {
    problem: "Users want to experiment with AI capabilities but fear making mistakes or causing unintended consequences.",
    solution: "Provide safe, controlled environments for exploring AI features with sandboxing, undo mechanisms, and clear safe/production boundaries.",
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
