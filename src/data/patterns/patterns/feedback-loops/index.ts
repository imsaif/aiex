import { Pattern } from '../../../../types';
import { examples } from './examples';
import { guidelines } from './guidelines';
import { considerations } from './considerations';
import { codeExamples } from './code-examples';
import { figmaPrompt } from './figma-prompt';

export const feedbackloops: Pattern = {
  id: "feedback-loops",
  title: "Feedback Loops",
  slug: "feedback-loops",
  status: 'completed',
  description: "Continuous learning mechanisms where user corrections and preferences improve AI performance, creating experiences that evolve with usage.",
  category: "Human-AI Collaboration",
  tags: ["learning", "personalization", "improvement", "user feedback", "adaptation", "continuous learning"],
  thumbnail: "/images/examples/claude-feedback.gif",
  content: {
    problem: "AI systems remain static despite user interactions, failing to learn from corrections and preferences, causing repeated mistakes and generic experiences.",
    solution: "Implement feedback mechanisms that capture user corrections, preferences, and interactions to improve AI performance. Make learning visible and allow users to shape AI behavior.",
    examples,
    guidelines,
    considerations,
    relatedPatterns: [
      "Adaptive Interfaces",
      "Human-in-the-Loop",
      "Contextual Assistance"
    ],
    codeExamples,
    figmaPrompt
  }
};
