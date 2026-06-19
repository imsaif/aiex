import { Pattern } from '../../../../types';
import { examples } from './examples';
import { guidelines } from './guidelines';
import { considerations } from './considerations';
import { codeExamples } from './code-examples';
import { figmaPrompt } from './figma-prompt';

export const predictiveanticipation: Pattern = {
  id: "predictive-anticipation",
  title: "Predictive Anticipation",
  slug: "predictive-anticipation",
  status: 'implemented',
  description: "AI that predicts user needs before they're expressed, pre-loading content and suggesting next actions based on behavioral patterns.",
  category: "Adaptive & Intelligent Systems",
  tags: ["prediction", "pre-loading", "anticipation", "behavioral patterns", "proactive", "smart recommendations"],
  thumbnail: "/api/og/patterns?slug=predictive-anticipation",
  introduction: "Predictive Anticipation is an AI design pattern where systems predict what you'll need next based on behavioral patterns, pre-loading content and suggesting actions before you even ask. Instead of waiting for explicit requests, the AI learns from your habits to prepare resources and recommendations proactively. It's perfect for productivity tools, content platforms, navigation apps, or any system where predicting next steps saves time. Examples include Google Maps pre-loading your commute route at typical departure times, Spotify creating Discover Weekly before you search, or email apps drafting smart replies as you read messages.",
  datePublished: "2024-01-15",
  dateModified: "2025-11-18",
  content: {
    problem: "Users waste time waiting for content or searching for next actions. Systems react instead of anticipating needs.",
    solution: "Design AI that learns from behavior patterns to predict next actions. Pre-load content, suggest next steps, and gather resources before users request them.",
    examples,
    guidelines,
    considerations,
    relatedPatterns: [
      "Contextual Assistance",
      "Adaptive Interfaces",
      "Intelligent Caching"
    ],
    codeExamples,
    figmaPrompt
  }
};
