import { FigmaPrompt } from '../../../../types';

export const figmaPrompt: FigmaPrompt = {
  prompt: "Design an AI agent interface that shows a plan preview before taking action. Include: (1) A task description showing what the user asked, (2) A sequential step list showing 3-5 planned actions with plain-language descriptions, (3) Visual indicators marking reversible vs. irreversible actions (green vs. amber), (4) Edit controls for each step (modify, remove, reorder), (5) Approve/Reject buttons with a 'Always approve this type' checkbox, (6) An estimated time indicator. Style: Clean, trustworthy, minimal anxiety. Use clear visual hierarchy to draw attention to irreversible actions.",
  figmaFileUrl: undefined,
  tips: [
    "Use green badges for fully reversible actions and amber/orange for irreversible ones to create an immediate visual risk hierarchy",
    "Show the step number and total count (Step 2 of 4) so users can gauge how far along the plan is",
    "Add a subtle collapse/expand animation for step details to reinforce progressive disclosure",
    "Include drag handles for reordering steps, but keep them subtle until hovered",
    "Place the Approve button as a primary CTA and Reject as a secondary  -  the flow should encourage forward motion",
    "Consider a 'dry run' option that simulates the actions without committing them"
  ]
};
