import { Pattern } from '../../../../types';
import { examples } from './examples';
import { guidelines } from './guidelines';
import { considerations } from './considerations';
import { codeExamples } from './code-examples';

export const errorrecovery: Pattern = {
  id: "error-recovery",
  title: "Error Recovery & Graceful Degradation",
  slug: "error-recovery",
  description: "Design AI interfaces that fail gracefully and provide meaningful recovery paths",
  category: "Error Recovery",
  thumbnail: "/images/examples/google-assistant-fallback.gif",
  content: {
    problem: "AI systems inevitably make mistakes or encounter situations they cannot handle, potentially frustrating users or causing system failures.",
    solution: "Design graceful degradation mechanisms and clear recovery paths that maintain user trust while providing alternative solutions when AI fails.",
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
