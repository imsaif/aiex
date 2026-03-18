import { Example } from '../../../../types';

export const examples: Example[] = [
  {
    title: "GitHub Actions - Workflow Run Logs",
    description: "Step-by-step execution log showing each workflow action with status indicators (completed, in-progress, pending), timing for every step, and searchable logs. Provides a clear sequential audit trail of automated CI/CD processes.",
    image: "/images/examples/githubactions.webp",
    altText: "GitHub Actions workflow showing step-by-step execution log with status indicators and timing for each step"
  },
  {
    title: "Zapier - Zap Execution History",
    description: "Comprehensive history of every automation run with success/failure status, connected app icons, timestamps, and filters by date range, apps, and folders. Users can drill into individual runs to inspect each step's input and output data.",
    image: "/images/examples/zaptrial2.gif",
    altText: "Zapier Zap History showing execution runs with success status, app icons, timestamps, and filterable history"
  },
  {
    title: "Claude Code CLI - Session Action Log",
    description: "Maintains a session log of every file read, edited, or created. Users can review the full sequence of changes and revert individual ones, providing granular control over agent-initiated modifications.",
    image: "/images/examples/claudepropose.gif",
    altText: "Claude Code CLI showing a session log with file operations, approval prompts, and action history"
  }
];
