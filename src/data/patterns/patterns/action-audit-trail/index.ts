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
  dateModified: "2026-06-23",
  hideFAQ: true,
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
    figmaPrompt,
    judgmentCall: {
      explainWhen: [
        "The agent acts on the user's behalf across systems (sends, schedules, edits, deletes) and the user wasn't watching each step. A trail is how they catch up.",
        "Actions are consequential and at least some are reversible: the point of the log is letting a user find the one bad move and undo just that one.",
        "You operate in a context where 'what did it do to this record, and why' is a question someone will eventually have to answer: compliance, support escalations, shared workspaces."
      ],
      dontWhen: [
        "Every action is trivial and reversible by other means. A log of 'opened a file, scrolled, opened another' is noise that buries the one entry that matters.",
        "You're logging to cover yourself rather than to serve the user. A trail built for the legal team and unreadable by the person whose data got changed is an alibi, not accountability.",
        "You can't actually answer questions against the log. If the only operation is 'scroll', you have storage, not an audit trail."
      ],
      trap: "The write-only log: a complete, append-only, immaculately timestamped record that nobody can actually query, filter, or read at the moment something breaks. It captures everything and surfaces nothing. When a user asks 'what did the agent do to this invoice, and why,' the honest answer is 'it's in there somewhere, scroll for it.' Technically logged, practically unaccountable. It feels like diligence and ships like a checkbox, and you only discover it's useless during the incident you built it for, which is the worst possible moment to learn your audit trail is unauditable."
    },
    installPrompt: `You are implementing the Action Audit Trail design pattern in this codebase.

The pattern in one line: give the user a readable, queryable record of what the agent did, grouped by goal, so they can review one action and reverse just that one.

Apply the following moves wherever an agent (or automation) takes actions on the user's behalf: sends, edits, deletes, schedules, moves data across systems. DO NOT build an audit trail for trivial, self-reversing interactions (navigation, reads, draft autosaves the user can already see). A log of non-events buries the entries that matter.

1. Group by task, not by timestamp.
   Find where actions are recorded and attach a goal/task id to each one. Render the default view grouped by what the agent was trying to do, not a raw chronological dump. Users think in goals; the timeline is secondary.

2. Make every entry answer "what changed, and why."
   For modifications, store and show a before/after diff, not "edited file.docx". For any action, persist the reason or trigger the agent acted on. If an entry can't say what changed or why, it is a log line, not an audit entry; fix the recording, don't ship the gap.

3. Make the log queryable, or it isn't a trail.
   Add filtering by action type, time range, and affected system, plus search. The acceptance test: a user can find "what did the agent do to record X" in seconds, during an incident, without scrolling. If the only operation your UI offers is scroll, you have storage, not accountability.

4. Color-code by reversibility and support selective undo.
   Tag each action reversible / partial / irreversible and show it. Let the user reverse a single action without unwinding the whole chain. When undoing one step invalidates later steps, say so before they confirm; do not silently cascade.

The trap to avoid: the write-only log. A complete record nobody can read or query at the moment it matters. If a user can't answer "what did it do to this thing, and why" from the trail in seconds, it is an alibi, not accountability. Build it to be read during the incident, not just written before it.

When you're done, output a Markdown report with three sections:
- Surfaces updated: file path + which of the four moves you applied at each
- Surfaces flagged but not updated: file path + why (e.g. trivial/self-reversing actions, no goal context to group by, missing diff data)
- New endpoints / data fields you added (e.g. task id on actions, before/after snapshots, reversibility status, /api/audit query route) and what still needs human sign-off

Ask before adding dependencies.`,
    takeaways: [
      {
        heading: "Group by goal, not by clock.",
        body: "A raw chronological feed makes the user reconstruct intent from timestamps. Group entries by what the agent was trying to accomplish, so 'reorganized my inbox' reads as one reviewable unit instead of forty scattered moves. The timeline is the secondary axis, not the primary one."
      },
      {
        heading: "Every entry answers 'what changed, and why.'",
        body: "'Edited spreadsheet' is a receipt, not an audit entry. Show the before/after diff and the reason the agent acted. If a row can't say what changed or what triggered it, you logged the fact that something happened and nothing useful about it."
      },
      {
        heading: "If you can't query it, it isn't an audit trail.",
        body: "The whole value shows up during an incident, when someone asks 'what did the agent do to this record.' A log you can only scroll fails exactly then. Filter, search, and jump-to-record are not nice-to-haves; they are the difference between accountability and an append-only pile."
      },
      {
        heading: "Reversibility is information the user needs before they act.",
        body: "Color-code reversible, partial, and irreversible so the user knows what's recoverable at a glance, and let them undo one action without unwinding the whole chain. When undoing step three breaks steps four and five, warn them before they confirm. Selective undo with honest cascade warnings is what makes review actionable."
      },
      {
        heading: "Build the log to be read, not just written.",
        body: "The failure mode is the write-only log: perfectly complete, perfectly unreadable. Diligence at write time means nothing if the trail collapses under the one question it exists to answer. Test it the way it'll be used: hand someone the incident and a deadline, and see if the trail helps or just proves you stored something."
      }
    ]
  }
};
