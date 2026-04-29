import { Pattern } from '../../../../types';
import { examples } from './examples';
import { guidelines } from './guidelines';
import { considerations } from './considerations';
import { codeExamples } from './code-examples';
import { figmaPrompt } from './figma-prompt';

export const actionaudittrail: Pattern = {
  id: "action-audit-trail",
  title: "Action Audit Trail",
  slug: "action-audit-trail",
  status: 'implemented',
  description: "Provide a timestamped, structured log of every action the agent took  -  grouped by task, with reversibility status, selective undo, and diff views  -  so users can review and correct agent behavior after the fact.",
  category: "Trustworthy & Reliable AI",
  tags: ["agentic", "audit", "logging", "undo", "accountability", "compliance"],
  thumbnail: "/api/og/patterns?slug=action-audit-trail",
  introduction: "After an agent has acted  -  especially across multiple steps or over extended periods  -  users need a clear, reviewable record of what happened. This is fundamentally different from traditional undo/redo because agentic actions may span multiple systems, occur asynchronously, and have cascading consequences. A user who discovers their agent has sent 15 emails, rescheduled 3 meetings, and updated a spreadsheet needs to quickly understand what happened, why, and how to reverse specific actions. The Action Audit Trail provides a timestamped log grouped by task with plain-language descriptions, reversibility color-coding (green/amber/red), selective undo capabilities, and before/after diff views for document modifications. This extends source attribution from citing information sources to citing action sources.",
  datePublished: "2026-02-16",
  dateModified: "2026-02-16",
  content: {
    problem: "After an agent has acted across multiple steps or systems, users need a clear, reviewable record of what happened. Traditional undo/redo doesn't work for agentic actions that span multiple systems, occur asynchronously, and have cascading consequences.",
    solution: "Provide a timestamped, structured log of every agent action grouped by task, with plain-language descriptions, reversibility color-coding, selective undo for individual actions, and before/after diff views for modifications.",
    examples,
    guidelines,
    considerations,
    relatedPatterns: [
      "Explainable AI",
      "Error Recovery",
      "Plan Summary",
      "Agent Status & Monitoring"
    ],
    codeExamples,
    figmaPrompt
  }
};
