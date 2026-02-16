import { Pattern } from '../../../../types';
import { codeExamples } from './code-examples';

export const humanintheloop: Pattern = {
  id: "human-in-the-loop",
  title: "Human-in-the-Loop",
  slug: "human-in-the-loop",
  category: "Human-AI Collaboration",
  description: "Balance automation with human oversight for critical decisions, ensuring AI augments human judgment.",
  thumbnail: "/images/examples/grammarly-suggestions.gif",
  introduction: "Human-in-the-Loop is an AI design pattern where humans review and approve critical AI decisions before they're finalized. Instead of full automation, this pattern keeps humans as active participants who validate outputs and maintain control. It's essential for high-stakes decisions, situations requiring ethical judgment, or when building trust in new AI systems. Examples include Grammarly suggesting edits that you approve, content moderation tools that flag issues for human review, and medical AI that provides recommendations for doctors to confirm.",
  datePublished: "2024-01-15",
  dateModified: "2025-11-18",
  content: {
    problem: "Fully automated AI systems risk critical errors and lack transparency. Users need review and override capabilities for safety and trust.",
    solution: "Design systems for human intervention, review, or approval of AI outputs. Provide clear handoff points, easy override mechanisms, and transparent explanations.",
    examples: [
      {
        title: "Grammarly Writing Assistant",
        description: "Grammarly suggests grammar, spelling, and style improvements, requiring human approval to maintain control over final text.",
        image: "/images/examples/grammarly-suggestions.gif",
        altText: "Grammarly human-in-the-loop suggestions"
      },
      {
        title: "Google Photos Face Detection",
        description: "Google Photos detects faces, but users confirm identities for verification.",
        image: "/images/examples/google-face-detection.gif",
        altText: "Google Photos face detection"
      },
      {
        title: "OpenAI RLHF",
        description: "OpenAI uses Reinforcement Learning from Human Feedback (RLHF); humans rate AI outputs to train reward models for refinement.",
        image: "/images/examples/openai-human-feedback.png",
        altText: "OpenAI human feedback"
      }
    ],
    codeExamples,
    guidelines: [
      "Clearly indicate when human review is required or possible.",
      "Facilitate easy override, correction, or feedback on AI outputs.",
      "Log interventions for transparency and improvement.",
      "Explain AI decisions to support human judgment.",
      "Design workflows that minimize AI-human handoff friction."
    ],
    considerations: [
      "Balance efficiency with safety; too many interventions can slow workflows.",
      "Avoid overwhelming humans with excessive review requests.",
      "Address potential bias in AI and human decisions.",
      "Provide training and support for users in review roles.",
      "Monitor and refine human-in-the-loop trigger thresholds."
    ],
    relatedPatterns: [
      "Transparent Feedback",
      "Contextual Assistance",
      "Progressive Disclosure",
      "Autonomy Spectrum",
      "Mixed-Initiative Control"
    ],
    figmaPrompt: {
      prompt: `Design an interface where humans can review and approve AI suggestions before they're applied:

Create a review card showing:
1. **AI Suggestion**: Display the AI-generated content/action with a confidence indicator
2. **Action Buttons**: Clear Approve/Reject/Modify options
3. **Context**: Brief explanation of why AI made this suggestion
4. **Override Option**: Allow users to edit or provide their own input

Show visual distinction between AI suggestions (blue/purple) and human-approved items (green).`,
      tips: [
        "Use distinct colors for AI vs human decisions",
        "Include confidence scores to guide review priority",
        "Make approve/reject buttons clear and accessible",
        "Add undo option for quick corrections",
        "Show what happens when user approves/rejects"
      ]
    }
  }
};
