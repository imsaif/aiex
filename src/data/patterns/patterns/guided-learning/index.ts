import { Pattern } from '../../../../types';
import { codeExamples } from './code-examples';

export const guidedlearning: Pattern = {
  id: "guided-learning",
  title: "Guided Learning",
  slug: "guided-learning",
  category: "Guided Learning",
  description: "Break complex tasks into guided steps that adapt to user knowledge levels.",
  thumbnail: "/images/examples/duolingo-adaptive.gif",
  content: {
    problem: "Complex AI systems overwhelm users with too many options, leading to confusion and poor adoption.",
    solution: "Create step-by-step learning experiences with contextual hints and adaptive difficulty to guide users progressively.",
    examples: [
      {
        title: "Figma Interactive Tutorials",
        description: "Interactive tutorials that highlight UI elements with contextual instructions.",
        image: "/images/examples/applepencil.gif",
        altText: "Apple Pencil guided tutorial demonstrating features step by step"
      },
      {
        title: "GitHub Codespaces Onboarding",
        description: "Guided environment setup with progressive disclosure based on user selections.",
        image: "/images/examples/gitautocode.gif",
        altText: "GitHub auto-coding features with guided learning prompts"
      },
      {
        title: "Notion Formula Builder",
        description: "Step-by-step formula creation with real-time previews and suggestions.",
        image: "/images/examples/notion-ai.gif",
        altText: "Notion AI providing guided assistance for content creation"
      }
    ],
    codeExamples,
    guidelines: [
      "Start simple, gradually introduce complexity",
      "Show clear progress indicators and next steps",
      "Use contextual hints for unfamiliar concepts",
      "Allow skipping ahead or revisiting steps",
      "Provide immediate feedback on user actions",
      "Include checkpoints to maintain motivation",
      "Adapt difficulty based on user performance"
    ],
    considerations: [
      "Balance guidance with user autonomy",
      "Support different learning styles and paces",
      "Don't block expert users with mandatory steps",
      "Allow non-linear navigation through content",
      "Design clear error recovery paths",
      "Avoid cognitive overload at each step",
      "Ensure responsive design across devices",
      "Monitor drop-off points for improvements"
    ],
    relatedPatterns: [
      "Progressive Disclosure",
      "Contextual Assistance",
      "Adaptive Interfaces",
      "Human-in-the-Loop",
      "Onboarding Flow"
    ]
  }
}; 