import { Example } from '../../../../types';

export const examples: Example[] = [
  {
    title: "Claude Code — Per-Tool Autonomy Control",
    description: "Each tool the agent can use — file edits, git commands, test runners — can be set to Allow, Ask, or Deny independently. Developers grant full autonomy for low-risk actions while requiring confirmation for destructive operations.",
    image: "/images/examples/autonomy-spectrum/claude-code-autonomy.webp",
    altText: "Claude Code permissions panel showing Allow, Ask, Deny, and Workspace autonomy levels for individual tools"
  },
  {
    title: "Cursor — Agent Mode with Review Panel",
    description: "Agent mode reads the codebase, generates a plan, and writes code across multiple files, but presents all changes in a review panel with Apply All and Undo All controls before anything is committed. Users can switch between Agent, Ask, and manual modes at any time.",
    image: "/images/examples/autonomy-spectrum/cursor-agent-review.jpg",
    altText: "Cursor IDE showing Agent mode with a review panel displaying pending file changes and Apply All and Undo All buttons"
  },
  {
    title: "GitHub Copilot Workspace — Plan-Review-Execute",
    description: "Breaks AI-assisted coding into discrete stages: specification, plan, and implementation. Users can edit the plan, accept or reject individual file changes, and only then let the agent write code. The diff view adds a final review checkpoint.",
    image: "/images/examples/autonomy-spectrum/github-copilot-workspace.webp",
    altText: "GitHub Copilot Workspace showing editable plan with checkboxes per file on the left and code diff on the right"
  }
];
