import { Pattern } from '../../../../types';
import { examples } from './examples';
import { guidelines } from './guidelines';
import { considerations } from './considerations';
import { codeExamples } from './code-examples';

export const contextualassistance: Pattern = {
  id: "contextual-assistance",
  title: "Contextual Assistance",
  slug: "contextual-assistance",
  description: "Provide timely help and suggestions based on the user's current task, history, and needs without requiring explicit requests.",
  category: "Contextual Assistance",
  tags: ["smart compose", "autocomplete", "proactive help", "AI assistance", "user context", "predictive", "suggestions"],
  thumbnail: "/images/examples/Smart-compose_Taco_Tuesday.gif",
  content: {
    problem: "Users often need guidance but may not know what to ask for or when to ask. Traditional help systems require users to interrupt their workflow to search for assistance.",
    solution: "Create intelligent assistance that proactively offers relevant help, suggestions, or information based on the user's current context, behavior patterns, and needs. The system should anticipate user requirements rather than waiting for explicit requests.",
    examples,
    guidelines,
    considerations,
    relatedPatterns: [
      "Progressive Disclosure",
      "Transparent Feedback",
      "Adaptive Interfaces"
    ],
    codeExamples
  }
};