import { Pattern } from '../../../../types';
import { examples } from './examples';
import { guidelines } from './guidelines';
import { considerations } from './considerations';
import { codeExamples } from './code-examples';

export const errorrecovery: Pattern = {
  id: "error-recovery",
  title: "Error Recovery & Graceful Degradation",
  slug: "error-recovery",
  description: "Design AI interfaces that fail gracefully and provide meaningful recovery paths.",
  category: "Trustworthy & Reliable AI",
  thumbnail: "/images/examples/chatgpt-limitations.png",
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
    codeExamples
  }
};
