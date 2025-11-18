import { Pattern } from '../../../../types';
import { examples } from './examples';
import { guidelines } from './guidelines';
import { considerations } from './considerations';
import { codeExamples } from './code-examples';
import { figmaPrompt } from './figma-prompt';

export const errorrecovery: Pattern = {
  id: "error-recovery",
  title: "Error Recovery & Graceful Degradation",
  slug: "error-recovery",
  description: "Fail gracefully with clear recovery paths when things go wrong.",
  category: "Trustworthy & Reliable AI",
  thumbnail: "/images/examples/chatgpt-limitations.png",
  introduction: "Error Recovery & Graceful Degradation ensures systems fail gracefully with clear recovery paths instead of confusing errors. Instead of cryptic messages, the AI acknowledges limitations, explains issues, and offers next steps. It's critical for maintaining trust in production systems where failures have consequences. Examples include ChatGPT admitting uncertainty, Google Translate offering alternatives, or voice assistants suggesting different approaches when misunderstanding.",
  datePublished: "2024-01-15",
  dateModified: "2025-11-18",
  content: {
    problem: "AI systems inevitably make mistakes or encounter unhandleable situations, potentially frustrating users.",
    solution: "Design graceful degradation and clear recovery paths to maintain user trust when AI fails.",
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
