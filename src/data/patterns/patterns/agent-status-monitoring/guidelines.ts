export const guidelines: string[] = [
  "Match the status display to the task duration. Sub-10-second tasks need only a spinner. Multi-minute tasks need a progress panel. Multi-hour tasks need a dashboard.",
  "Allow users to 'check in' on agent activity without disrupting the agent's work. Think of it as looking through a window, not opening a door.",
  "Support multiple concurrent agents or tasks. If the user has 3 agents running, the status system should aggregate and prioritize.",
  "Provide estimated completion times and update them as the agent progresses.",
  "After completion, auto-dismiss the status after a brief display. But keep completed tasks accessible in the Action Audit Trail.",
  "Use escalating attention demands: ambient badge for background work, glanceable panel for progress, interrupting notification only when the agent needs input.",
  "Never use full-screen loading states for agentic tasks  -  users need to continue other work while the agent operates."
];
