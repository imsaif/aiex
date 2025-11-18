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
  status: 'implemented',
  description: "Seamless transitions between AI automation and human control.",
  category: "Human-AI Collaboration",
  tags: ["handoff", "automation", "human control", "context preservation", "transitions", "takeover"],
  thumbnail: "/images/examples/telsaautopilotgif.gif",
  introduction: "Graceful Handoff enables smooth transitions between AI automation and human control without losing progress. Instead of abrupt switches, the system preserves state for seamless takeover or resumption. It's critical for semi-autonomous systems or collaborative workflows alternating between AI and manual work. Examples include Tesla Autopilot takeover, GitHub Copilot switching between suggestions and manual coding, or smart email drafts you can edit.",
  datePublished: "2024-11-02",
  dateModified: "2025-11-18",
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
