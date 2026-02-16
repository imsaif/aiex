import { FigmaPrompt } from '../../../../types';

export const figmaPrompt: FigmaPrompt = {
  prompt: "Design a multi-task agent status monitoring widget with escalating attention levels. Include: (1) An ambient status badge showing the number of active agent tasks (small, corner-positioned), (2) An expandable panel showing 3-4 tasks at different states (running, paused, completed), (3) Per-task progress bars with estimated completion times, (4) An attention-level notification card for when the agent needs user input, (5) A completion summary view showing results after task finishes. Style: Layered from minimal (badge) to detailed (panel). The ambient state should be barely noticeable; the attention state should be prominent but not alarming.",
  figmaFileUrl: undefined,
  tips: [
    "Design three distinct visual states: a tiny badge (ambient), a slide-out panel (progress), and a toast/card (attention) to show the escalation hierarchy",
    "Use a subtle pulse animation on the ambient badge when tasks are actively running  -  it provides 'alive' feedback without stealing focus",
    "Show different task states with distinct icons: spinning for running, pause icon for waiting, checkmark for completed",
    "Include a 'Quiet mode' toggle that suppresses all but critical attention notifications",
    "For multiple concurrent tasks, stack progress bars vertically with the most relevant task at the top",
    "Add elapsed time alongside estimated time to help users gauge accuracy of predictions"
  ]
};
