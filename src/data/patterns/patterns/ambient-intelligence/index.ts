import { Pattern } from '../../../../types';
import { examples } from './examples';
import { guidelines } from './guidelines';
import { considerations } from './considerations';
import { codeExamples } from './code-examples';
import { figmaPrompt } from './figma-prompt';

export const ambientintelligence: Pattern = {
  id: "ambient-intelligence",
  title: "Ambient Intelligence",
  slug: "ambient-intelligence",
  description: "Create unobtrusive AI that senses context and provides assistance without explicit interaction.",
  category: "Adaptive & Intelligent Systems",
  thumbnail: "/images/examples/siri-conversation.gif",
  content: {
    problem: "Users need intelligent assistance without cognitive overhead, especially when attention is focused elsewhere.",
    solution: "Create AI systems that operate unobtrusively in the background, sensing context and providing assistance without interruption.",
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
