import { Pattern } from '../../../../types';
import { codeExamples } from './code-examples';

export const guidedlearning: Pattern = {
  id: "guided-learning",
  title: "Guided Learning",
  slug: "guided-learning",
  category: "Adaptive & Intelligent Systems",
  description: "Break complex tasks into guided steps, adapting to user knowledge levels.",
  thumbnail: "/images/examples/duolingo-adaptive.gif",
  content: {
    problem: "Complex AI systems overwhelm users with too many options, causing confusion and poor adoption.",
    solution: "Create step-by-step learning experiences with contextual hints and adaptive difficulty to progressively guide users.",
    examples: [
      {
        title: "Figma Interactive Tutorials",
        description: "Interactive tutorials highlighting UI elements with contextual instructions.",
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
      "Start simple; gradually introduce complexity.",
      "Show clear progress indicators and next steps.",
      "Use contextual hints for unfamiliar concepts.",
      "Allow skipping ahead or revisiting steps.",
      "Provide immediate feedback on user actions.",
      "Include checkpoints to maintain motivation.",
      "Adapt difficulty based on user performance."
    ],
    considerations: [
      "Balance guidance with user autonomy.",
      "Support diverse learning styles and paces.",
      "Avoid blocking expert users with mandatory steps.",
      "Allow non-linear content navigation.",
      "Design clear error recovery paths.",
      "Avoid cognitive overload at each step.",
      "Ensure responsive design across devices.",
      "Monitor drop-off points for improvements."
    ],
    relatedPatterns: [
      "Progressive Disclosure",
      "Contextual Assistance",
      "Adaptive Interfaces",
      "Human-in-the-Loop",
      "Onboarding Flow"
    ],
    figmaPrompt: {
      prompt: `Design a guided learning interface that helps users master complex features step by step:

Create a tutorial flow showing:
1. **Progress Tracker**: Visual indicator showing current step and total steps (e.g., "Step 2 of 5")
2. **Highlighted Element**: Spotlight or highlight on the specific UI element being taught
3. **Instruction Card**: Clear, concise explanation with action to take
4. **Next/Skip Controls**: Easy navigation with "Next", "Back", and "Skip tutorial" options
5. **Contextual Help**: Tooltip or hint bubble pointing to relevant interface elements

Show adaptive difficulty with beginner vs. advanced paths. Include a "Try it yourself" interactive moment where users practice the concept.`,
      tips: [
        "Use spotlights or overlays to focus attention",
        "Keep instruction text brief and actionable",
        "Show progress clearly at all times",
        "Allow users to skip or exit anytime",
        "Include interactive practice moments"
      ]
    }
  }
};
