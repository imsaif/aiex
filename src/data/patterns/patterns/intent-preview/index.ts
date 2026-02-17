import { Pattern } from '../../../../types';
import { examples } from './examples';
import { guidelines } from './guidelines';
import { considerations } from './considerations';
import { codeExamples } from './code-examples';
import { figmaPrompt } from './figma-prompt';

export const intentpreview: Pattern = {
  id: "intent-preview",
  title: "Intent Preview",
  slug: "intent-preview",
  status: 'implemented',
  description: "Before any significant action, the agent presents a clear, scannable summary of what it intends to do  -  showing planned steps, reversibility status, and edit controls for user approval.",
  category: "Human-AI Collaboration",
  tags: ["agentic", "preview", "approval", "transparency", "multi-step", "action plan"],
  thumbnail: "/images/examples/claudepropose.gif",
  introduction: "The Intent Preview pattern addresses a core anxiety in agentic AI: users need to understand what will happen BEFORE it happens. Unlike traditional AI where the user explicitly types a prompt and evaluates the response, agentic actions may be initiated proactively or involve consequences that are difficult to reverse  -  sending emails, booking flights, modifying files. This pattern shows a clear, scannable summary of planned actions using plain language (not technical jargon), with each step marked for reversibility and editable by the user. The preview must be sequential for multi-step operations, highlight irreversible actions visually, and never auto-dismiss. This transforms the approval moment from a binary yes/no into a structured review that builds trust and catches misunderstandings before they cause harm.",
  datePublished: "2026-02-16",
  dateModified: "2026-02-16",
  content: {
    problem: "When an agent is about to take a multi-step action, users need to understand what will happen before it happens. Without an intent preview, users experience anxiety leading to constant monitoring or blind trust that erodes at the first mistake.",
    solution: "Before any significant action, present a clear, scannable preview showing planned steps in plain language, with reversibility indicators, edit controls for individual steps, and explicit approve/reject buttons. Never auto-dismiss the preview.",
    examples,
    guidelines,
    considerations,
    relatedPatterns: [
      "Progressive Disclosure",
      "Human-in-the-Loop",
      "Autonomy Spectrum",
      "Plan Summary"
    ],
    codeExamples,
    figmaPrompt
  }
};
