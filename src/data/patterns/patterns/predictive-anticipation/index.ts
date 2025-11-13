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
  thumbnail: "/images/examples/predictive-anticipation.gif",
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
