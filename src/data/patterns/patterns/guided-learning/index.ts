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
  dateModified: "2026-09-07",
  hideFAQ: true,
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
    judgmentCall: {
      explainWhen: [
        "The user's first real task is genuinely multi-step and cannot be shortened, so sequencing is the only way through it.",
        "Getting it wrong is expensive or discouraging enough that people abandon rather than retry.",
        "The steps carry a decision the user has to understand, not just a control they have to find."
      ],
      dontWhen: [
        "The interface is the problem. A tutorial is the cheapest way to avoid fixing a confusing screen, and it has to be maintained forever.",
        "The user only needs the thing once. Ship a sensible default and let them do it.",
        "The task is genuinely exploratory. Guiding it turns a creative surface into a form with extra steps."
      ],
      trap: "The completed tutorial: completion rate becomes the metric, so the walkthrough is tuned to be finished rather than to make anyone capable. Users click Next through eight highlighted buttons, reach a congratulations screen, and still cannot do the task alone, because they were taught where the controls are and never why to choose one."
    },
    installPrompt: `You are implementing the Guided Learning design pattern in this codebase.

The pattern in one line: get the user through their first real task, with the reasoning attached, then get out of the way.

Apply this only where the first real task is genuinely multi-step and cannot be shortened. DO NOT apply it to a screen that is merely confusing. A tutorial that exists to explain bad layout is permanent maintenance debt. Flag those screens instead.

1. Find the first real task, and make the tutorial produce it.
   For each guided flow, identify the actual artifact the user wants (a working project, a first result, a configured environment). The flow must end with that artifact existing in their account, not with a completion screen. If a flow ends in congratulations and nothing else, rewrite it or delete it.

2. Teach the decision, not the control location.
   Every step that highlights a control must also state why this option and not the alternative, in one sentence. If a step has no decision in it, remove the step and do it for the user.

3. Make the exit as easy as the next step.
   Skip and exit controls must be present on every step, equal in prominence to Next, and must preserve everything done so far. A user who leaves at step three keeps the work from steps one and two.

4. Instrument capability, not completion.
   Track whether users who finished the flow later perform the same task unaided, and compare against users who skipped it. Report both numbers. Completion rate alone must not be used to judge the flow.

The trap to avoid: the completed tutorial. Optimising for finish rate produces a walkthrough people complete and learn nothing from.

When you're done, output a Markdown report with three sections:
- Flows updated: file path + the artifact each one now produces
- Screens flagged as needing a fix rather than a tutorial, with why
- Instrumentation added for unaided repeat performance, and what still needs human sign-off

Ask before adding dependencies.`,
    takeaways: [
      {
        heading: "The tutorial should end with something real in their account.",
        body: "Not a congratulations screen. A working project, a first result, a configured setup. If the flow produces nothing but a completion badge, the user has practised clicking Next and learned the product no better than before they started."
      },
      {
        heading: "Teach the decision, not where the button is.",
        body: "Button locations are discoverable. Knowing which option to pick and why is not. Any step that highlights a control without naming the choice behind it should be removed and done for the user instead."
      },
      {
        heading: "A tutorial is often a bug report about the interface.",
        body: "If a screen needs explaining, the cheap move is a walkthrough and the right move is usually fixing the screen. The walkthrough has to be maintained every time the UI changes, and it hides the evidence that something is wrong."
      },
      {
        heading: "Make leaving free.",
        body: "Skip has to be as prominent as Next and has to keep the work done so far. The moment exiting costs progress, people finish the flow to protect their work rather than because it is helping them, and your completion metric stops meaning anything."
      },
      {
        heading: "Measure whether they can do it again alone.",
        body: "The only honest test is unaided repeat performance, compared against people who skipped the tutorial. Completion rate measures how well you built a corridor, not whether anyone can walk without it."
      }
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
