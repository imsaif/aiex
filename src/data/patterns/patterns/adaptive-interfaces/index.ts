import { Pattern } from '../../../../types';
import { examples } from './examples';
import { guidelines } from './guidelines';
import { considerations } from './considerations';
import { codeExamples } from './code-examples';

export const adaptiveinterfaces: Pattern = {
  id: "adaptive-interfaces",
  title: "Adaptive Interfaces",
  slug: "adaptive-interfaces",
  category: "Adaptive & Intelligent Systems",
  description: "Interfaces that learn user behavior and automatically adjust layout and functionality to match individual usage patterns.",
  thumbnail: "/images/examples/netflix-adaptive.gif",
  introduction: "Adaptive Interfaces are AI-powered interfaces that learn from your behavior and automatically rearrange themselves to match how you actually work. Instead of forcing everyone into the same layout, these interfaces observe which features you use most and bring them to the forefront while hiding rarely-used options. It's ideal for complex tools with many features, power users who develop specific workflows, or apps where different users need different things front and center. Think of how Netflix reorganizes its homepage based on what you watch, or how your phone keyboard learns your typing patterns and suggests words you use frequently.",
  datePublished: "2024-01-15",
  dateModified: "2025-11-18",
  hideFAQ: true,
  content: {
    skillDescription:
      "Use when the UI should adjust to how each person uses it: personalized layouts, reordering features by usage, 'the app should learn what I use most'. Adaptive Interfaces tune layout and functionality to individual behavior.",
    problem: "Static interfaces treat all users identically, leading to inefficient workflows and feature discovery issues.",
    solution: "Design systems that observe user behavior to automatically adapt layout and feature visibility, remaining transparent and user-controllable.",
    examples,
    guidelines,
    considerations,
    relatedPatterns: [
      "Contextual Assistance",
      "Progressive Disclosure",
      "Human-in-the-Loop"
    ],
    codeExamples,
    figmaPrompt: {
      prompt: `Design an adaptive interface that learns from user behavior:

Create a dashboard or workspace showing:
1. **Personalized Layout**: Frequently used features prominently displayed
2. **Smart Widgets**: Modules that reorder based on usage patterns
3. **Adaptation Indicator**: Subtle visual cue showing the interface has learned (e.g., "✨ Customized for you")
4. **Quick Access**: Most-used actions in easy-to-reach locations
5. **Reset Option**: Clear way to revert to default layout or customize manually

Show before/after states to illustrate how the interface adapts over time. Include a settings panel for users to control adaptation preferences.`,
      tips: [
        "Use animations to show layout changes smoothly",
        "Provide visual feedback when interface adapts",
        "Include manual override controls",
        "Show frequency/usage data for transparency",
        "Allow users to lock certain elements in place"
      ]
    },
    judgmentCall: {
      explainWhen: [
        "User needs genuinely diverge over time or across segments, and one static layout forces most people through friction (a feature-dense pro tool, a launcher, a feed).",
        "You can adapt the periphery while the core stays fixed: surface shortcuts and reorder secondary content without moving the controls people have memorized.",
        "The behavioral signal is strong and repeated, so the adaptation is usually right and won't thrash on a single odd session."
      ],
      dontWhen: [
        "The interface is small enough to learn once. Adapting it trades a layout the user can master for one they can never predict.",
        "Users rely on speed and muscle memory (primary nav, toolbars, anything hit dozens of times a day). Moving those is a tax, not a help.",
        "Your signal is thin or noisy. Reorganizing the UI around one accidental session is worse than not adapting at all."
      ],
      trap: "The rug-pull: the interface rearranges itself out from under the user, so the control they reach for by habit is never where they left it. Microsoft's auto-hiding, self-reordering menus are the canonical version. By optimizing for the popular item, they destroyed the spatial memory that made every other item fast. Adaptation the user can't predict costs more in re-scanning than it ever saves in clicks."
    },
    installPrompt: `You are implementing the Adaptive Interfaces design pattern in this codebase.

The pattern in one line: personalize the edges of the UI without moving the anchors people have memorized.

Apply the following moves wherever this codebase adapts layout or feature visibility to user behavior. DO NOT adapt interfaces that are already simple enough to learn once, and never adapt high-frequency controls people hit by reflex.

1. Freeze the anchors.
   Identify the primary navigation and the high-frequency controls (the ones a user hits by habit). Mark them non-adaptive. Adaptation may only touch a designated periphery: a shortcuts rail, secondary lists, feed order. If a change would move an anchor, reject it.

2. Gate adaptation on a stable signal.
   Require repeated use across multiple sessions before moving anything. Never adapt on a single session. If the signal is below threshold, render the default layout. A wrong adaptation is worse than none.

3. Make every adaptation visible and reversible.
   Label a moved or surfaced item with the reason ("here because you use it daily"). Add a one-click revert and a global "stop adapting" control. Persist user overrides so a manual choice always beats the algorithm.

4. Keep a hand-designed default as the floor.
   New and low-signal users get a layout someone designed to work cold. Adaptation is a delta on top of that default, never a replacement for designing one.

5. Ease changes in.
   Stage and animate layout changes; never reshuffle mid-task or mid-session. The ground should shift slowly enough for the user to follow.

The trap to avoid: the rug-pull. If a habitual control moves, you've made the interface slower, not smarter. Adapt only what the user hasn't memorized.

When you're done, output a Markdown report with three sections:
- Surfaces updated: file path + which of the five moves you applied at each
- Surfaces flagged but not updated: file path + why (e.g. simple enough to learn, anchor control, thin signal)
- New mechanisms you added (anchor freeze list, signal threshold, revert / stop-adapting controls, override persistence) and what still needs human sign-off

Ask before adding dependencies.`,
    takeaways: [
      {
        heading: "Adapt the edges, never the anchors.",
        body: "Surface shortcuts, reorder the secondary, personalize the feed. But the primary nav and the controls people hit by reflex must stay put. The moment a user reaches for 'Save' and it has moved, you've made the interface slower, not smarter."
      },
      {
        heading: "Predictability beats optimality.",
        body: "A layout that's the same every time is faster than a 'better' one that's different every time, because the user stops looking and starts reaching. An adaptive UI that wins on paper and loses muscle memory is a net loss."
      },
      {
        heading: "Earn the change with a strong, stable signal.",
        body: "Adapt on repeated, unambiguous behavior, not one session. A single odd afternoon shouldn't reorganize someone's workspace. When the signal is thin, do nothing: a wrong adaptation is more disorienting than no adaptation."
      },
      {
        heading: "Make adaptation visible and reversible.",
        body: "Say what changed and why ('moved up because you use it daily'), and give a one-click 'put it back' and a way to stop adapting. Silent rearrangement feels like the app is broken, even when the change is technically right."
      },
      {
        heading: "Start from a good default, then ease in.",
        body: "Adaptation is a refinement on a layout that already works for a newcomer, not a substitute for designing one. Introduce changes gradually so the ground shifts slowly enough to follow."
      }
    ]
  }
};
