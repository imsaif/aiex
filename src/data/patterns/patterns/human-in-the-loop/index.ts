import { Pattern } from '../../../../types';
import { codeExamples } from './code-examples';

export const humanintheloop: Pattern = {
  id: "human-in-the-loop",
  title: "Human-in-the-Loop",
  slug: "human-in-the-loop",
  category: "Human-AI Collaboration",
  description: "Balance automation with human oversight for critical decisions, ensuring AI augments human judgment.",
  thumbnail: "/images/examples/grammarly-suggestions.gif",
  content: {
    problem: "Fully automated AI systems risk critical errors and lack transparency. Users need review and override capabilities for safety and trust in high-stakes situations.",
    solution: "Design systems for human intervention, review, or approval of AI outputs, especially for critical decisions. Provide clear handoff points, easy override mechanisms, and transparent explanations for confident AI collaboration.",
    examples: [
      {
        title: "Grammarly Writing Assistant",
        description: "Grammarly suggests grammar, spelling, and style improvements, requiring human approval to maintain user control over the final text.",
        image: "/images/examples/grammarly-suggestions.gif",
        altText: "Grammarly human-in-the-loop suggestions"
      },
      {
        title: "Google Photos Face Detection",
        description: "Google Photos detects faces, but users confirm identities, allowing human verification of AI suggestions.",
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
      "Progressive Disclosure"
    ]
  }
};
