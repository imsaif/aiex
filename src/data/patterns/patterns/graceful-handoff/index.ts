import { Pattern } from '../../../../types';
import { examples } from './examples';
import { guidelines } from './guidelines';
import { considerations } from './considerations';
import { codeExamples } from './code-examples';

export const gracefulhandoff: Pattern = {
  id: "graceful-handoff",
  title: "Graceful Handoff",
  slug: "graceful-handoff",
  description: "Seamless transitions between AI automation and human control, allowing users to take over when needed and resume automation without losing context or progress.",
  category: "Human-AI Collaboration",
  tags: ["handoff", "automation", "human control", "context preservation", "transitions", "takeover"],
  thumbnail: "/images/examples/graceful-handoff.gif",
  content: {
    problem: "Users feel trapped by automation or lose progress when switching between AI and manual control, creating frustration and workflow interruptions.",
    solution: "Design clear mechanisms for users to smoothly transition between automated AI assistance and manual control. Preserve context, progress, and state across transitions so users can resume seamlessly.",
    examples,
    guidelines,
    considerations,
    relatedPatterns: [
      "Human-in-the-Loop",
      "Error Recovery & Graceful Degradation",
      "Contextual Assistance"
    ],
    codeExamples
  }
};
