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
  status: 'implemented',
  description: "Continuous learning mechanisms where user corrections and preferences improve AI performance, creating experiences that evolve with usage.",
  category: "Human-AI Collaboration",
  tags: ["learning", "personalization", "improvement", "user feedback", "adaptation", "continuous learning"],
  thumbnail: "/images/examples/claude-feedback.gif",
  introduction: "Feedback Loops is an AI design pattern where systems continuously learn from user corrections and preferences to improve performance over time. Instead of making the same mistakes repeatedly, the AI captures user feedback, adapts its behavior, and creates increasingly personalized experiences. It's perfect for recommendation systems, content moderation tools, virtual assistants, or any AI that interacts frequently with the same users. Examples include Spotify learning your music taste from skips and likes, Gmail's spam filter improving from your corrections, or smart home devices adapting to your daily routines and preferences.",
  datePublished: "2024-11-02",
  dateModified: "2025-11-18",
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
