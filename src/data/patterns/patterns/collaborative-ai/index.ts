import { Pattern } from '../../../../types';
import { examples } from './examples';
import { guidelines } from './guidelines';
import { considerations } from './considerations';
import { codeExamples } from './code-examples';
import { figmaPrompt } from './figma-prompt';

export const collaborativeai: Pattern = {
  id: "collaborative-ai",
  title: "Collaborative AI",
  slug: "collaborative-ai",
  description: "Enable effective collaboration between multiple users and AI within shared workflows.",
  category: "Human-AI Collaboration",
  thumbnail: "/images/examples/notion-ai.gif",
  introduction: "Collaborative AI is an AI design pattern where multiple team members work together with AI in shared spaces, maintaining coordination and collective understanding. Instead of each person using AI separately, this pattern lets teams collaborate with AI as a shared resource that understands group context, contributes to discussions, and helps coordinate work. It's perfect for remote teams making group decisions, collaborative documents where multiple people edit together, or project management where AI helps coordinate tasks across team members. Think of how Notion AI helps teams draft documents together, or how Miro's AI assists in collaborative brainstorming sessions with multiple participants.",
  datePublished: "2024-01-15",
  dateModified: "2025-11-18",
  content: {
    problem: "Teams need effective AI collaboration while maintaining coordination, shared understanding, and human relationships.",
    solution: "Create AI interfaces that enhance team collaboration via shared decision-making, context maintenance, and group workflow support.",
    examples,
    guidelines,
    considerations,
    relatedPatterns: [
      "Contextual Assistance",
      "Progressive Disclosure",
      "Human-in-the-Loop",
      "Mixed-Initiative Control"
    ],
    codeExamples,
    figmaPrompt
  }
};
