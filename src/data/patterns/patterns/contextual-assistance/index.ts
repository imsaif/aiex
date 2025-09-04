import { Pattern } from '../../../../types';
import { examples } from './examples';
import { guidelines } from './guidelines';
import { considerations } from './considerations';
import { codeExamples } from './code-examples';

export const contextualassistance: Pattern = {
  id: "contextual-assistance",
  title: "Contextual Assistance",
  slug: "contextual-assistance",
  description: "Offer timely, proactive help and suggestions based on user context, history, and needs.",
  category: "Human-AI Collaboration",
  tags: ["smart compose", "autocomplete", "proactive help", "AI assistance", "user context", "predictive", "suggestions"],
  thumbnail: "/images/examples/Smart-compose_Taco_Tuesday.gif",
  content: {
    problem: "Users need guidance but often don't know what or when to ask. Traditional help interrupts workflows.",
    solution: "Design intelligent assistance that proactively offers relevant help, suggestions, or information based on user context and behavior. Anticipate needs rather than waiting for explicit requests.",
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
