import { Pattern } from '../../../../types';
import { examples } from './examples';
import { guidelines } from './guidelines';
import { considerations } from './considerations';
import { codeExamples } from './code-examples';

export const adaptiveinterfaces: Pattern = {
  id: "adaptive-interfaces",
  title: "Adaptive Interfaces",
  slug: "adaptive-interfaces",
  category: "Adaptive & Intelligent Systems",
  description: "Interfaces that learn user behavior and automatically adjust layout and functionality to match individual usage patterns.",
  thumbnail: "/images/examples/netflix-adaptive.gif",
  content: {
    problem: "Static interfaces treat all users identically, leading to inefficient workflows and feature discovery issues.",
    solution: "Design systems that observe user behavior to automatically adapt layout and feature visibility, remaining transparent and user-controllable.",
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
