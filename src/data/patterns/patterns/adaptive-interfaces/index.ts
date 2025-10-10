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
  content: {
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
    }
  }
};
