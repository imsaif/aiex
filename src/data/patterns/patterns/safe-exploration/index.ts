import { Pattern } from '../../../../types';
import { examples } from './examples';
import { guidelines } from './guidelines';
import { considerations } from './considerations';
import { codeExamples } from './code-examples';
import { figmaPrompt } from './figma-prompt';

export const safeexploration: Pattern = {
  id: "safe-exploration",
  title: "Safe Exploration",
  slug: "safe-exploration",
  status: 'implemented',
  description: "Provide sandbox environments for experimenting with AI without risk.",
  category: "Trustworthy & Reliable AI",
  thumbnail: "/images/examples/huggingface-models.gif",
  introduction: "Safe Exploration provides controlled sandbox environments where users can experiment with AI without fear of mistakes. Instead of learning in production, the system offers clear boundaries between testing and real operations with easy undo. It's critical for creative tools, code generation, or systems where mistakes could be costly. Examples include Hugging Face Spaces for testing models, Figma's AI playground, or GitHub Copilot's preview mode.",
  datePublished: "2024-10-21",
  dateModified: "2025-11-18",
  content: {
    skillDescription:
      "Use when users fear breaking something by trying the AI: sandbox or preview modes, 'let them experiment without consequences', undo-everything trials, test environments. Safe Exploration makes trying risk-free.",
    problem: "Users want to experiment with AI capabilities but fear mistakes or unintended consequences.",
    solution: "Provide safe, controlled environments for exploring AI features with sandboxing, undo mechanisms, and clear safe/production boundaries.",
    examples,
    guidelines,
    considerations,
    relatedPatterns: [
      "Contextual Assistance",
      "Progressive Disclosure",
      "Human-in-the-Loop"
    ],
    codeExamples,
    figmaPrompt
  }
};
