import { Pattern } from '../../../../types';
import { examples } from './examples';
import { guidelines } from './guidelines';
import { considerations } from './considerations';
import { codeExamples } from './code-examples';
import { figmaPrompt } from './figma-prompt';

export const ambientintelligence: Pattern = {
  id: "ambient-intelligence",
  title: "Ambient Intelligence",
  slug: "ambient-intelligence",
  description: "Create unobtrusive AI that senses context and provides assistance without explicit interaction.",
  category: "Adaptive & Intelligent Systems",
  thumbnail: "/images/examples/siri-conversation.gif",
  introduction: "Ambient Intelligence is an AI design pattern where systems work quietly in the background, sensing context and providing help without being explicitly asked or interrupting your flow. Unlike traditional assistants that wait for commands, ambient AI monitors your environment, understands your situation, and acts automatically when needed. It's perfect for situations where users can't actively interact with devices, environments requiring hands-free assistance, or systems that should enhance rather than interrupt. Examples include smart thermostats adjusting temperature based on your routine, AirPods switching seamlessly between devices, or noise-canceling headphones that pause music when you start speaking.",
  datePublished: "2024-10-17",
  dateModified: "2025-11-18",
  content: {
    problem: "Users need intelligent assistance without cognitive overhead, especially when attention is focused elsewhere.",
    solution: "Create AI systems that operate unobtrusively in the background, sensing context and providing assistance without interruption.",
    examples,
    guidelines,
    considerations,
    relatedPatterns: [
      "Contextual Assistance",
      "Progressive Disclosure",
      "Human-in-the-Loop",
      "Agent Status & Monitoring"
    ],
    codeExamples,
    figmaPrompt
  }
};
