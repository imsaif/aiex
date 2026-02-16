import { FigmaPrompt } from '../../../../types';

export const figmaPrompt: FigmaPrompt = {
  prompt: "Design a trust calibration dashboard for an AI agent. Include: (1) Per-domain accuracy bars showing the agent's track record in different areas (e.g., Email 96%, Calendar 89%, Finance 72%), (2) A milestone achievement card celebrating a reliability milestone (e.g., '100 tasks completed, 97% accuracy'), (3) An autonomy upgrade prompt suggesting increased autonomy for well-performing domains, (4) A recent errors section showing what went wrong and how the agent adjusted, (5) An overall trust score with trend indicator. Style: Data-rich but approachable, dashboard aesthetic with progress bars, percentages, and subtle celebration elements.",
  figmaFileUrl: undefined,
  tips: [
    "Use horizontal bar charts for per-domain accuracy  -  they're easy to compare across domains at a glance",
    "Make the milestone card feel celebratory but subtle  -  a small confetti animation or gold accent, not overwhelming",
    "Show the autonomy upgrade prompt as an inline suggestion within the relevant domain row, not a separate modal",
    "Include a trend arrow next to accuracy percentages to show whether performance is improving or declining",
    "Use a traffic light system (green/amber/red) for domain trust levels to make assessment instant",
    "Add a 'View error log' expandable section that shows specific mistakes with how the agent course-corrected"
  ]
};
