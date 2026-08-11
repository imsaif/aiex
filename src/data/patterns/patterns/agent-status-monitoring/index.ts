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
  thumbnail: "/images/examples/devindelegatingandchecking.gif",
  introduction: "When an agent is working on a long-running or multi-step task, users need to know what's happening without being forced to watch constantly. Traditional loading indicators like spinners and progress bars don't work for agentic tasks that may take minutes or hours, involve multiple parallel activities, or require occasional user attention. The design challenge is keeping users informed without demanding their attention. This pattern provides four status layers: ambient status (persistent unobtrusive badge), progress status (glanceable panel available on demand), attention status (interrupting notification when input is needed), and summary status (completion report). The system supports multiple concurrent tasks, provides estimated completion times, and auto-dismisses completed items while keeping them accessible in the audit trail.",
  datePublished: "2026-02-16",
  dateModified: "2026-02-16",
  hideFAQ: true,
  content: {
    skillDescription:
      "Use when users need to follow long-running AI work without watching it: progress for background agents, 'what is the agent doing now', status badges, task dashboards, notifications when input is needed. Agent Status and Monitoring keeps users informed at the right level of attention.",
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
    figmaPrompt,
    judgmentCall: {
      explainWhen: [
        "The task runs long enough that watching it is wasteful: minutes to hours, often in parallel, where the user should be doing something else while it works.",
        "The agent will occasionally need a genuine decision (a confirmation, a missing input, a fork in the plan) and the cost of missing that moment is real.",
        "There is a clear hierarchy of what matters: most updates are 'glance if curious,' a few are 'you must look now,' and the system can tell them apart."
      ],
      dontWhen: [
        "The task finishes in seconds. A spinner says everything a four-layer status system would, with none of the overhead.",
        "Every update is equally urgent in your design, which means none of them are. If you cannot rank what deserves an interrupt, you are not ready to build the interrupting tier.",
        "You are tempted to ping the user on progress milestones (25%, 50%, 75%) because it 'feels responsive.' That is not keeping them informed, that is taxing their attention for no decision."
      ],
      trap: "Over-escalation, the cry-wolf dashboard: every event gets routed to the loud tier because shipping a notification feels like good UX. Within a day the user has learned that your interrupts mean nothing and swipes them all away on reflex, including the one that actually mattered ('about to email the full client list, confirm?'). You spent the whole interrupt budget on 'task 50% done,' so when a real decision arrives there is no attention left to spend. It is worse than no status system at all: a plain spinner never trained the user to ignore you."
    },
    installPrompt: `You are implementing the Agent Status & Monitoring design pattern in this codebase.

The pattern in one line: keep users informed about long-running agent work through layered status, and spend the interrupt budget only when a real decision is at stake.

Apply the following moves wherever this codebase runs a long or multi-step agent task. DO NOT apply to sub-10-second operations: a spinner is the right answer there, and a four-layer status system is overhead. The whole point is earned attention, so do not add notifications to anything the user cannot or need not act on.

1. Tier every status event before you render it.
   Classify each event as ambient (a quiet badge or count, glance if curious), progress (an on-demand panel with detail and estimated time), attention (an interrupt, only when the agent is blocked on a user decision), or summary (a completion report). If an event does not clearly belong to a tier, default it down, never up.

2. Protect the interrupt budget.
   The attention tier is reserved for events where the agent is genuinely blocked and the cost of the user missing it is real. Progress milestones (25%, 50%, done-soon) are ambient or progress, never interrupts. If you find code that fires a notification on a milestone, demote it.

3. Make progress checkable without disrupting the agent.
   The progress panel must be pull, not push: the user opens it when they want detail, and reading it never pauses or interferes with the running task. Treat it as a window to look through, not a door to open.

4. Aggregate and auto-dismiss.
   Support multiple concurrent tasks with one prioritized surface rather than N separate widgets. Auto-dismiss completed items after a brief display, but persist them to the audit trail so nothing the agent did becomes unreviewable.

The trap to avoid: over-escalation, the cry-wolf dashboard. If everything interrupts, the user learns to dismiss everything, and your one real alert dies in the noise. When in doubt, route it down a tier.

When you're done, output a Markdown report with three sections:
- Surfaces updated: file path + which tier each status event now lands in and which of the four moves you applied
- Surfaces flagged but not updated: file path + why (e.g. sub-10s task, no user decision, milestone ping you chose to leave for human review)
- New things you added (status tiers, an aggregation surface, audit-trail persistence, demoted notifications) and what still needs human sign-off

Ask before adding dependencies.`,
    takeaways: [
      {
        heading: "Match the tier to the stakes, not to the event.",
        body: "Most agent activity is 'glance if you care,' a little is 'you must look now.' Ambient badges for the first, an interrupting notification for the second, and never the reverse. The whole design is a sorting rule for how much of the user's attention each event has earned."
      },
      {
        heading: "Guard the interrupt budget like it's finite, because it is.",
        body: "Every notification you fire spends a little of the user's willingness to look at the next one. Blow it on progress milestones and the one alert that matters arrives to a user who has already learned to swipe you away. An interrupt is for a decision, not for a status."
      },
      {
        heading: "Status is a window, not a door.",
        body: "Let users check in on the work without disrupting it: a panel they pull open on demand, never a thing that pauses the agent or demands acknowledgment. If checking progress costs the user a click and the agent a stall, you have rebuilt the spinner with extra steps."
      },
      {
        heading: "Don't make them babysit it.",
        body: "If the user has to keep the status panel open and watch it to feel safe, your ambient layer has failed. The promise of this pattern is that they can walk away and trust they'll be pulled back exactly when, and only when, they're needed."
      },
      {
        heading: "Auto-dismiss the noise, keep the record.",
        body: "Completed tasks should clear themselves so the surface doesn't silt up with finished work. But 'dismissed from view' is not 'gone': everything the agent did belongs in the audit trail, where the user can reconstruct what happened after the badge is long gone."
      }
    ]
  }
};
