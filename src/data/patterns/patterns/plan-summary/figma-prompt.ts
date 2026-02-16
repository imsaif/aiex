import { FigmaPrompt } from '../../../../types';

export const figmaPrompt: FigmaPrompt = {
  prompt: "Design an AI agent plan summary interface for a research task. Include: (1) A goal interpretation header restating the user's request, (2) A strategy explanation section with the agent's chosen approach and why, (3) A subtask checklist with progress indicators showing completed, in-progress, and remaining steps, (4) An editable assumptions section where users can correct the agent's assumptions, (5) Resource and time estimates, (6) A 'Save as template' option. Style: Structured, professional, easy to scan. Use a clear visual hierarchy with indented subtasks, progress bars, and status icons.",
  figmaFileUrl: undefined,
  tips: [
    "Use a top-to-bottom flow: goal interpretation first, then strategy, then subtasks  -  this mirrors how users read and validate a plan",
    "Make assumptions visually distinct (e.g., highlighted background, edit icon) so users immediately see what they can correct",
    "Use checkmark animations for completed steps to provide satisfying progress feedback",
    "Show the estimated vs. actual time for completed steps to calibrate user expectations",
    "Add a collapse/expand control for the strategy section  -  power users want detail, most users want the checklist",
    "Consider a side-by-side layout: plan on the left, live results on the right as the agent works"
  ]
};
