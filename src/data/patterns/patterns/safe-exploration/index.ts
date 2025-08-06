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
    problem: "Users need to experiment with AI capabilities and learn through trial and error, but fear making mistakes or causing unintended consequences.",
    solution: "Provide safe, controlled environments where users can explore AI features without risk, including sandboxing, undo mechanisms, and clear boundaries between safe and production use.",
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
