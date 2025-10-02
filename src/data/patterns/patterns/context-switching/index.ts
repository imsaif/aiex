import { Pattern } from '../../../../types';
import { examples } from './examples';
import { guidelines } from './guidelines';
import { considerations } from './considerations';
import { codeExamples } from './code-examples';

export const contextswitching: Pattern = {
  id: "context-switching",
  title: "Context Switching",
  slug: "context-switching",
  description: "Enable smooth transitions between different tasks, topics, or interaction modes while maintaining conversation continuity and remembering relevant context across sessions.",
  category: "Natural Interaction",
  tags: ["context", "memory", "sessions", "conversation", "continuity", "multi-tasking"],
  thumbnail: "/images/examples/context-switching.gif",
  content: {
    problem: "Users frequently switch between different tasks, topics, or projects when working with AI systems, but lose context and have to repeat information each time they switch. This creates friction and reduces productivity.",
    solution: "Implement intelligent context management that tracks multiple conversation threads, remembers relevant information for each context, and provides seamless transitions between different topics while maintaining continuity within each context.",
    examples,
    guidelines,
    considerations,
    relatedPatterns: [
      "Selective Memory",
      "Conversational UI",
      "Adaptive Interfaces"
    ],
    codeExamples
  }
};
