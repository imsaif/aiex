import { Pattern } from '../../../../types';
import { examples } from './examples';
import { guidelines } from './guidelines';
import { considerations } from './considerations';
import { codeExamples } from './code-examples';

export const collaborativeai: Pattern = {
  id: "collaborative-ai",
  title: "Collaborative AI",
  slug: "collaborative-ai",
  description: "Enable effective collaboration between multiple users and AI within shared workflows.",
  category: "Human-AI Collaboration",
  thumbnail: "/images/examples/notion-ai.gif",
  content: {
    problem: "Teams need effective AI collaboration while maintaining coordination, shared understanding, and human relationships.",
    solution: "Create AI interfaces that enhance team collaboration via shared decision-making, context maintenance, and group workflow support.",
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
