import { Pattern } from '../../../../types';
import { examples } from './examples';
import { guidelines } from './guidelines';
import { considerations } from './considerations';
import { codeExamples } from './code-examples';

export const selectivememory: Pattern = {
  id: "selective-memory",
  title: "Selective Memory",
  slug: "selective-memory",
  status: 'implemented',
  description: "Allow users to control what AI remembers, forgets, or temporarily ignores, with clear mechanisms for viewing, editing, or deleting stored context and preferences.",
  category: "Privacy & Control",
  tags: ["memory", "control", "privacy", "context", "personalization", "user control"],
  thumbnail: "/images/examples/selective-memory.gif",
  content: {
    problem: "AI systems remember information without user visibility or control, risking privacy issues and inappropriate responses based on outdated or sensitive context.",
    solution: "Provide transparent memory controls letting users view, categorize (important/temporary/forget), and understand how stored information influences AI responses.",
    examples,
    guidelines,
    considerations,
    relatedPatterns: [
      "Privacy-First Design",
      "Context Switching",
      "Explainable AI"
    ],
    codeExamples
  }
};
