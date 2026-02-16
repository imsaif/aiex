import { FigmaPrompt } from '../../../../types';

export const figmaPrompt: FigmaPrompt = {
  prompt: "Design a timeline view showing an AI agent's completed actions. Include: (1) Grouped entries by task/goal with expandable detail, (2) Timestamps and duration for each action, (3) Color-coded reversibility badges (green: reversible, amber: partial, red: irreversible), (4) Inline undo buttons for reversible actions, (5) Before/after diff view for document modifications, (6) Filter controls by action type, time range, and status. Style: Clean, log-style with high information density but clear hierarchy. Prioritize scannability.",
  figmaFileUrl: undefined,
  tips: [
    "Use a vertical timeline with task group headers as larger nodes and individual actions as smaller nodes on the timeline",
    "Show undo buttons only on hover for reversible actions to keep the timeline clean but accessible",
    "Use a side panel for diff views rather than inline expansion to preserve the timeline's scannable flow",
    "Include summary statistics at the top: total actions, success rate, items requiring attention",
    "Add a compact/detailed view toggle  -  compact shows one line per action, detailed shows descriptions and diffs",
    "Consider a search bar for finding specific actions in long audit trails"
  ]
};
