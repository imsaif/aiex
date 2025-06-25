import { Pattern } from '../../../../types';
import { codeExamples } from './code-examples';

export const guidedlearning: Pattern = {
  id: "guided-learning",
  title: "Guided Learning",
  slug: "guided-learning",
  category: "Guided Learning",
  description: "Provide structured, progressive learning experiences that adapt to user knowledge levels and guide them through complex tasks step-by-step.",
  thumbnail: "/images/examples/duolingo-guided.gif",
  content: {
    problem: "Complex AI systems and tools can overwhelm users with too many options and features at once. Without proper guidance, users may feel lost, make errors, or fail to discover valuable capabilities, leading to poor adoption and user frustration.",
    solution: "Design progressive learning experiences that break down complex tasks into manageable steps. Use scaffolding techniques, contextual hints, and adaptive difficulty to guide users from basic understanding to advanced proficiency while maintaining engagement.",
    examples: [
      {
        title: "Duolingo Progressive Language Learning",
        description: "Duolingo uses guided learning to teach languages progressively, starting with basic vocabulary and gradually introducing complex grammar through bite-sized lessons with immediate feedback.",
        image: "/images/examples/duolingo-guided.gif",
        altText: "Duolingo progressive learning interface"
      },
      {
        title: "Figma Interactive Tutorials",
        description: "Figma provides step-by-step interactive tutorials that guide users through design tasks, highlighting specific UI elements and providing contextual instructions at each step.",
        image: "/images/examples/figma-tutorial.gif",
        altText: "Figma interactive tutorial walkthrough"
      },
      {
        title: "GitHub Codespaces Onboarding",
        description: "GitHub Codespaces guides new users through setting up development environments with progressive disclosure, showing only relevant options at each step based on user selections.",
        image: "/images/examples/codespaces-onboarding.gif",
        altText: "GitHub Codespaces guided setup process"
      },
      {
        title: "Notion Formula Builder",
        description: "Notion's formula builder guides users through creating complex database formulas by breaking them into logical steps with real-time previews and suggestions.",
        image: "/images/examples/notion-formulas.gif",
        altText: "Notion guided formula creation"
      }
    ],
    codeExamples,
    guidelines: [
      "Start with simple concepts and gradually introduce complexity",
      "Provide clear visual indicators of progress and next steps",
      "Use contextual hints and tooltips to explain unfamiliar concepts",
      "Allow users to skip ahead or revisit previous steps based on their comfort level",
      "Provide immediate feedback and validation for user actions",
      "Use progressive disclosure to avoid overwhelming users with too many options",
      "Include checkpoints and milestones to maintain motivation",
      "Adapt difficulty based on user performance and engagement",
      "Provide multiple learning paths for different user goals and preferences",
      "Include practical exercises and real-world examples",
      "Make help and additional resources easily accessible throughout the journey"
    ],
    considerations: [
      "Balance guidance with user autonomy - avoid being overly prescriptive",
      "Consider different learning styles and paces among users",
      "Ensure the guided experience doesn't become a barrier for expert users",
      "Account for users who may want to jump around or skip steps",
      "Plan for error recovery and getting users back on track",
      "Consider cognitive load and avoid information overload at any step",
      "Ensure guided experiences work across different devices and screen sizes",
      "Plan for localization and cultural differences in learning preferences",
      "Monitor and analyze where users commonly get stuck or drop off",
      "Balance interactive elements with clear documentation for reference",
      "Consider accessibility needs for users with different abilities",
      "Plan for updates and maintenance as the underlying system evolves"
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