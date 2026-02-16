import { Pattern } from '../../../../types';
import { examples } from './examples';
import { guidelines } from './guidelines';
import { considerations } from './considerations';
import { codeExamples } from './code-examples';
import { figmaPrompt } from './figma-prompt';

export const mixedinitiativecontrol: Pattern = {
  id: "mixed-initiative-control",
  title: "Mixed-Initiative Control",
  slug: "mixed-initiative-control",
  status: 'implemented',
  description: "Design interaction models where control flows seamlessly between human and agent  -  supporting parallel work zones, interruptible agent activity, and natural handoffs without formal 'take over' actions.",
  category: "Human-AI Collaboration",
  tags: ["agentic", "collaboration", "concurrent editing", "handoff", "co-creation", "real-time"],
  thumbnail: "/images/examples/mixed-initiative-control.png",
  introduction: "In traditional AI, either the human is in control (typing prompts, making decisions) or the AI is (generating responses). But agentic workflows require fluid back-and-forth  -  the agent works on a task, the human jumps in to adjust, the agent continues from the adjusted state. The challenge is designing interfaces where both human and agent can act without stepping on each other. This is especially difficult in collaborative documents, code editors, and planning tools where both parties might be working on the same artifact simultaneously. Mixed-Initiative Control provides clear control indicators, interrupt-without-disruption capability, parallel work zones, seamless handoffs, and explicit conflict resolution. Human input always takes precedence, and the agent should never block the human from interacting.",
  datePublished: "2026-02-16",
  dateModified: "2026-02-16",
  content: {
    problem: "Traditional AI is turn-based  -  either human or AI is in control. Agentic workflows require fluid back-and-forth where both can work simultaneously on the same artifact, with the human able to interrupt and redirect at any point.",
    solution: "Design interfaces with clear control indicators, interruptible agent activity, parallel work zones, seamless handoffs, and explicit conflict resolution. Human input always takes precedence, and agent activity never blocks the human.",
    examples,
    guidelines,
    considerations,
    relatedPatterns: [
      "Human-in-the-Loop",
      "Collaborative AI",
      "Autonomy Spectrum",
      "Agent Status & Monitoring"
    ],
    codeExamples,
    figmaPrompt
  }
};
