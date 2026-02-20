import { Pattern } from '../../../../types';
import { examples } from './examples';
import { guidelines } from './guidelines';
import { considerations } from './considerations';
import { codeExamples } from './code-examples';
import { figmaPrompt } from './figma-prompt';

export const autonomyspectrum: Pattern = {
  id: "autonomy-spectrum",
  title: "Autonomy Spectrum",
  slug: "autonomy-spectrum",
  status: 'implemented',
  description: "Provide a spectrum of autonomy levels  -  from passive suggestions to full autonomy  -  that users can adjust per task type, enabling granular control over how independently an AI agent operates.",
  category: "Human-AI Collaboration",
  tags: ["agentic", "autonomy", "control", "delegation", "trust", "agent settings"],
  thumbnail: "",
  introduction: "The Autonomy Spectrum pattern replaces binary AI controls (on/off, assist/don't assist) with a graduated range of independence levels. Traditional AI interactions are either fully manual or fully automated, but agentic workflows demand nuance. A user might want their email agent to auto-sort messages without asking, but require explicit approval before sending any reply. This pattern provides four core levels  -  Observe & Suggest, Propose & Confirm, Act & Notify, and Full Autonomy  -  adjustable per task type. The key insight is that trust isn't global: users develop different comfort levels for different domains based on the agent's track record. By making autonomy granular and visible, this pattern prevents the all-or-nothing dynamic where a single bad experience causes users to abandon the agent entirely.",
  datePublished: "2026-02-16",
  dateModified: "2026-02-16",
  content: {
    problem: "Traditional AI controls are binary  -  the AI is either on or off. But agents operate across a wide range of independence, and users need granular control over how much freedom the agent has per task type. Without this, a single bad experience at high autonomy causes users to abandon the agent entirely.",
    solution: "Provide a spectrum of autonomy levels (Observe & Suggest, Propose & Confirm, Act & Notify, Full Autonomy) that users can adjust per task or domain. Default to lower autonomy for new users and let trust build through demonstrated reliability before offering higher levels.",
    examples,
    guidelines,
    considerations,
    relatedPatterns: [
      "Human-in-the-Loop",
      "Trust Calibration",
      "Intent Preview",
      "Mixed-Initiative Control"
    ],
    codeExamples,
    figmaPrompt
  }
};
