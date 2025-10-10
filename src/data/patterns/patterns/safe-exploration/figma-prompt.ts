import { FigmaPrompt } from '../../../../types';

export const figmaPrompt: FigmaPrompt = {
  prompt: "Design a safe exploration interface similar to Figma's branching or Google Docs version history, allowing users to experiment without risk. Show a sandbox environment with safety indicators. Include: main workspace with clear 'Safe Mode' or 'Sandbox' indicator badge, preview area showing results of experimental actions, undo/redo controls prominently displayed, 'Save to Real' or 'Apply Changes' button (disabled by default), comparison view showing before/after or current vs experimental, and safety guardrails (warnings for risky actions, confirmation dialogs). Style: Playful yet safe. Use sandbox/lab imagery, clear boundaries between safe/live areas. Green for safe zone, amber for boundary warnings. Platform: Web application, responsive.",
  figmaFileUrl: undefined,
  tips: [
    "Make the safe/sandbox mode visually distinct - use a colored border or background tint",
    "Add a persistent 'Exit Sandbox' button that's always visible",
    "Show a clear indicator of what's temporary vs permanent (badge, icon, color)",
    "Include an 'Explore More' button to encourage experimentation",
    "For mobile: use bottom sheet for experiment results, swipe to apply or discard",
    "Add micro-interactions that celebrate exploration (confetti, animations when trying new things)"
  ]
};
