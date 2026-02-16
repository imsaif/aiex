import { Example } from '../../../../types';

export const examples: Example[] = [
  {
    title: "Zapier / Make - Automation Execution History",
    description: "Execution history shows every step of an automation with success/failure status, input/output data, and timestamps. Users can inspect individual steps to understand exactly what happened at each stage.",
    image: "/images/examples/action-audit-trail.png",
    altText: "Zapier execution history showing automation steps with success status, timestamps, and expandable detail"
  },
  {
    title: "GitHub Actions - Workflow Run Logs",
    description: "Complete logs of every step in a workflow, with expandable detail, timing, and the ability to re-run individual steps. Provides comprehensive traceability for automated processes.",
    image: "/images/examples/action-audit-trail-github.png",
    altText: "GitHub Actions workflow showing step-by-step logs with timing, status indicators, and re-run controls"
  },
  {
    title: "Claude Code CLI - Session Action Log",
    description: "Maintains a session log of every file read, edited, or created. Users can review the full sequence of changes and revert individual ones, providing granular control over agent-initiated modifications.",
    image: "/images/examples/action-audit-trail-claude.png",
    altText: "Claude Code CLI showing a session log with file operations, timestamps, and revert controls"
  },
  {
    title: "Linear AI - Auto-Triage Decision Log",
    description: "When the AI auto-triages issues, it logs the rationale for each categorization decision. Users can override individual decisions, and the system learns from corrections over time.",
    image: "/images/examples/action-audit-trail-linear.png",
    altText: "Linear AI showing auto-triage decisions with rationale, confidence scores, and override controls"
  }
];
