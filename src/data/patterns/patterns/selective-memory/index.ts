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
  description: "Control what AI remembers, forgets, or ignores with transparent settings.",
  category: "Privacy & Control",
  tags: ["memory", "control", "privacy", "context", "personalization", "user control"],
  thumbnail: "/images/examples/selective-memory.gif",
  introduction: "Selective Memory gives users explicit control over what AI remembers, forgets, or ignores. Instead of opaque memory, the system provides transparent controls to view, edit, or delete stored information. It's essential for personal assistants, conversational systems, or tools building context over time. Examples include ChatGPT's memory settings for viewing and deleting memories, Google Assistant's activity controls, or Replika marking conversations as temporary.",
  datePublished: "2024-01-15",
  dateModified: "2025-11-18",
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
