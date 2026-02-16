import { Pattern } from '../../../../types';
import { examples } from './examples';
import { guidelines } from './guidelines';
import { considerations } from './considerations';
import { codeExamples } from './code-examples';
import { figmaPrompt } from './figma-prompt';

export const agentstatusmonitoring: Pattern = {
  id: "agent-status-monitoring",
  title: "Agent Status & Monitoring",
  slug: "agent-status-monitoring",
  status: 'implemented',
  description: "Design a layered status system with escalating attention demands  -  from ambient badges to glanceable progress panels to interrupting notifications  -  so users stay informed about agent activity without being forced to watch.",
  category: "Performance & Efficiency",
  tags: ["agentic", "status", "monitoring", "progress", "notifications", "ambient"],
  thumbnail: "/images/examples/agent-status-monitoring.png",
  introduction: "When an agent is working on a long-running or multi-step task, users need to know what's happening without being forced to watch constantly. Traditional loading indicators like spinners and progress bars don't work for agentic tasks that may take minutes or hours, involve multiple parallel activities, or require occasional user attention. The design challenge is keeping users informed without demanding their attention. This pattern provides four status layers: ambient status (persistent unobtrusive badge), progress status (glanceable panel available on demand), attention status (interrupting notification when input is needed), and summary status (completion report). The system supports multiple concurrent tasks, provides estimated completion times, and auto-dismisses completed items while keeping them accessible in the audit trail.",
  datePublished: "2026-02-16",
  dateModified: "2026-02-16",
  content: {
    problem: "Traditional loading indicators don't work for agentic tasks that take minutes or hours, involve parallel activities, or need occasional user input. Users need to stay informed without being forced to constantly monitor agent activity.",
    solution: "Design a layered status system: ambient badges for background awareness, expandable progress panels for detail, attention notifications only when input is needed, and completion summaries when tasks finish. Support multiple concurrent tasks with estimated times.",
    examples,
    guidelines,
    considerations,
    relatedPatterns: [
      "Ambient Intelligence",
      "Action Audit Trail",
      "Escalation Pathways",
      "Mixed-Initiative Control"
    ],
    codeExamples,
    figmaPrompt
  }
};
