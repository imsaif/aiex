import { Pattern } from '../../../../types';
import { examples } from './examples';
import { guidelines } from './guidelines';
import { considerations } from './considerations';
import { codeExamples } from './code-examples';
import { figmaPrompt } from './figma-prompt';

export const contextualassistance: Pattern = {
  id: "contextual-assistance",
  title: "Contextual Assistance",
  slug: "contextual-assistance",
  description: "Offer timely, proactive help and suggestions based on user context, history, and needs.",
  category: "Human-AI Collaboration",
  tags: ["smart compose", "autocomplete", "proactive help", "AI assistance", "user context", "predictive", "suggestions"],
  thumbnail: "/images/examples/Smart-compose_Taco_Tuesday.gif",
  introduction: "Contextual Assistance is an AI design pattern where systems proactively offer help based on user context and behavior, without waiting to be asked. Instead of interrupting workflows with generic tips, this pattern analyzes what users are doing right now and suggests relevant actions at the perfect moment. It's most effective for repetitive tasks, complex applications, and situations where AI can learn from patterns to predict needs. Examples include Gmail's Smart Compose finishing your sentences, search autocomplete guessing your query, and Notion suggesting relevant pages as you type.",
  datePublished: "2024-01-15",
  dateModified: "2025-11-18",
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
    codeExamples,
    figmaPrompt
  }
};
