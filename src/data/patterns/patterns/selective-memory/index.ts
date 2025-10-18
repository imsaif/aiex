import { Pattern } from '../../../../types';
import { examples } from './examples';
import { guidelines } from './guidelines';
import { considerations } from './considerations';
import { codeExamples } from './code-examples';

export const selectivememory: Pattern = {
  id: "selective-memory",
  title: "Selective Memory",
  slug: "selective-memory",
  status: 'in-progress',
  description: "Allow users to control what AI remembers, forgets, or temporarily ignores, with clear mechanisms for viewing, editing, or deleting stored context and preferences.",
  category: "Privacy & Control",
  tags: ["memory", "control", "privacy", "context", "personalization", "user control"],
  thumbnail: "/images/examples/selective-memory.gif",
  content: {
    problem: "AI systems remember and use information without giving users visibility or control over what's stored. Users can't selectively forget sensitive information or temporarily exclude context that's no longer relevant, leading to privacy concerns and potentially inappropriate responses.",
    solution: "Provide transparent memory management interfaces where users can view all stored information, selectively mark memories as important, temporary, or to be forgotten, and see exactly when and how the AI uses stored context in its responses.",
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
