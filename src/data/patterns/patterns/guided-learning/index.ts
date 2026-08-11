import { Pattern } from '../../../../types';
import { codeExamples } from './code-examples';

export const guidedlearning: Pattern = {
  id: "guided-learning",
  title: "Guided Learning",
  slug: "guided-learning",
  category: "Adaptive & Intelligent Systems",
  description: "Break complex tasks into guided steps, adapting to user knowledge levels.",
  thumbnail: "/images/examples/duolingo-adaptive.gif",
  introduction: "Guided Learning is an AI design pattern that breaks complex tasks into manageable step-by-step experiences, adapting to each user's knowledge level and pace. Instead of overwhelming users with all features at once, the system progressively introduces concepts with contextual hints and adjusts difficulty based on performance. It's perfect for onboarding new users to complex tools, educational platforms, or any application with a steep learning curve. Examples include Duolingo adapting language lessons to your skill level, Figma's interactive tutorials highlighting relevant UI elements, or GitHub Codespaces guiding environment setup based on your selections.",
  datePublished: "2024-01-15",
  dateModified: "2025-11-18",
  content: {
    skillDescription:
      "Use when a complex AI feature overwhelms newcomers: step-by-step walkthroughs, wizards, 'users do not know where to start', tutorials that adapt to skill level. Guided Learning breaks the task into steps matched to the user's knowledge.",
    problem: "Complex AI systems overwhelm users with too many options, causing confusion and poor adoption.",
    solution: "Create step-by-step learning experiences with contextual hints and adaptive difficulty to progressively guide users.",
    examples: [
      {
        title: "Figma Interactive Tutorials",
        description: "Interactive tutorials highlighting UI elements with contextual instructions.",
        image: "/images/examples/figma-interactive-tutorial.gif",
        altText: "Figma interactive tutorial demonstrating step-by-step guidance for design features"
      },
      {
        title: "GitHub Codespaces Onboarding",
        description: "Guided environment setup with progressive disclosure based on user selections.",
        image: "/images/examples/github-codespaces-onboarding.gif",
        altText: "GitHub Codespaces onboarding with guided learning prompts and progressive disclosure"
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
