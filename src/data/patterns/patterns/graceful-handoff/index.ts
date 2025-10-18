import { Pattern } from '../../../../types';
import { examples } from './examples';
import { guidelines } from './guidelines';
import { considerations } from './considerations';
import { codeExamples } from './code-examples';
import { figmaPrompt } from './figma-prompt';

export const gracefulhandoff: Pattern = {
  id: "graceful-handoff",
  title: "Graceful Handoff",
  slug: "graceful-handoff",
  status: 'in-progress',
  description: "Seamless transitions between AI automation and human control, allowing users to take over and resume without losing context.",
  category: "Human-AI Collaboration",
  tags: ["handoff", "automation", "human control", "context preservation", "transitions", "takeover"],
  thumbnail: "/images/examples/graceful-handoff.gif",
  content: {
    problem: "Users feel trapped by automation or lose progress when switching between AI and manual control, causing frustration and interruptions.",
    solution: "Design clear mechanisms for smooth transitions between AI assistance and manual control. Preserve context and state across transitions for seamless resumption.",
    examples,
    guidelines,
    considerations,
    relatedPatterns: [
      "Human-in-the-Loop",
      "Error Recovery & Graceful Degradation",
      "Contextual Assistance"
    ],
    codeExamples,
    figmaPrompt
  }
};
