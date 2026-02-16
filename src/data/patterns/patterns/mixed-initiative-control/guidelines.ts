export const guidelines: string[] = [
  "Human input always takes precedence. If there's a conflict between human actions and agent plans, the human's action wins.",
  "Show agent activity as a background process, not a modal state. The agent should never block the human from interacting.",
  "Use visual differentiation for agent-generated vs. human-created content  -  but make it toggleable so it doesn't clutter the output.",
  "Provide an easy way to 'hand back' to the agent after manual intervention: 'I've adjusted the intro. Continue from here.'",
  "When the agent is working, show a non-intrusive progress indicator that doesn't steal focus.",
  "Support parallel work zones where human and agent work on different parts of the same artifact simultaneously.",
  "Conflict resolution should be explicit  -  surface conflicts clearly and let the human decide, never silently merge."
];
