import { FigmaPrompt } from '../../../../types';

export const figmaPrompt: FigmaPrompt = {
  prompt: "Design an error recovery interface inspired by ChatGPT's 'at capacity' error, GitHub Copilot's offline state, or Grammarly's error handling. Show a friendly error state with clear recovery paths. Include: (1) Prominent but non-alarming error message with warm-colored icon (amber/yellow for capacity/service issues), (2) Plain-language explanation of what happened and why, (3) 'Your work is saved' indicator with green checkmark to reduce user anxiety, (4) 2-3 recovery action buttons clearly labeled (e.g., 'Try Again', 'Wait in Queue', 'Use Offline Mode'), (5) Optional: Queue position counter or estimated wait time, (6) Tip or note about premium/priority access if applicable. Style: Calm, transparent, solution-focused. Use amber/yellow for warnings, green for saved state indicators, black/dark buttons for primary actions. Avoid red unless it's a critical system failure. Platform: Modern web application, responsive design.",
  figmaFileUrl: undefined,
  tips: [
    "Model after ChatGPT's capacity error - shows what happened, what's saved, and clear next steps",
    "Like GitHub Copilot offline mode: indicate system state while preserving user workflow",
    "Show what was preserved/saved prominently to reduce user anxiety",
    "Make primary recovery action button most prominent (usually 'Try Again' or 'Wait in Queue')",
    "Use warm colors (amber/yellow) for service capacity issues, not harsh red",
    "Include a helpful tip or note about premium access/alternatives without being pushy",
    "For queue systems: show position number and/or estimated wait time",
    "Ensure all text is plain-language and user-focused, not technical jargon"
  ]
};
