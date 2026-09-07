import { Pattern } from '../../../../types';
import { examples } from './examples';
import { guidelines } from './guidelines';
import { considerations } from './considerations';
import { codeExamples } from './code-examples';
import { figmaPrompt } from './figma-prompt';

export const plansummary: Pattern = {
  id: "plan-summary",
  title: "Plan Summary",
  slug: "plan-summary",
  status: 'implemented',
  description: "Provide a structured breakdown of the agent's reasoning and approach  -  showing goal interpretation, strategy, subtask checklist, and assumptions  -  so users can evaluate the plan before execution begins.",
  category: "Trustworthy & Reliable AI",
  tags: ["agentic", "planning", "transparency", "reasoning", "strategy", "progress"],
  thumbnail: "/api/og/patterns?slug=plan-summary",
  introduction: "While Intent Preview shows WHAT the agent will do, Plan Summary explains WHY and HOW. When an agent breaks a complex goal into subtasks, users need to understand the agent's reasoning  -  not just its intended actions. This is especially critical for knowledge work where there are multiple valid approaches. 'Research competitor pricing' could mean scraping websites, reading analyst reports, or checking public databases  -  the strategy matters as much as the outcome. The Plan Summary provides goal interpretation, strategy explanation, a subtask checklist that updates in real-time, explicit assumptions the user can correct, and resource and time estimates. This pattern extends explainability from retrospective ('here's why I gave this answer') to prospective ('here's why I'm taking this approach').",
  datePublished: "2026-02-16",
  dateModified: "2026-09-07",
  hideFAQ: true,
  content: {
    skillDescription:
      "Use when users should evaluate an agent's approach before it runs: 'why this plan', goal interpretation, subtask checklists, stated assumptions, strategy review before execution. Plan Summary exposes the reasoning so plans can be judged.",
    problem: "While Intent Preview shows what the agent will do, users also need to understand why and how. When an agent breaks a complex goal into subtasks, users can't evaluate whether the approach is sound without seeing the reasoning and assumptions behind the plan.",
    solution: "Provide a structured plan summary with goal interpretation, strategy explanation, a subtask checklist with real-time progress, explicit editable assumptions, and resource/time estimates. Keep it concise by default with full reasoning available on expansion.",
    examples,
    guidelines,
    considerations,
    relatedPatterns: [
      "Explainable AI",
      "Intent Preview",
      "Action Audit Trail",
      "Autonomy Spectrum"
    ],
    codeExamples,
    figmaPrompt,
    judgmentCall: {
      explainWhen: [
        "The goal is genuinely ambiguous and several valid approaches exist, so the strategy matters as much as the result.",
        "The run is long or expensive enough that discovering a wrong interpretation at the end is costly.",
        "The user holds context the agent cannot have, and a stated assumption is the only place that context can enter."
      ],
      dontWhen: [
        "The task has one obvious approach. Narrating it is ceremony, and users learn to approve without reading.",
        "The run is cheap and reversible. Let it run and show the result. Reviewing a plan costs more than redoing the work.",
        "You cannot let the user change anything. A plan presented for approval with no edit path is a loading screen with extra reading."
      ],
      trap: "The plan with no edit button: a well-structured summary whose only controls are Approve and Cancel. Cancel means starting over, so everyone approves. The assumptions were the valuable part and the interface gave the user no way to touch them, so the plan reads as accountability while functioning as a delay."
    },
    installPrompt: `You are implementing the Plan Summary design pattern in this codebase.

The pattern in one line: show the reasoning behind an agent's approach while the user can still change it.

Apply this to agent runs that are ambiguous, long, or expensive. DO NOT apply it to single-approach tasks or to cheap reversible runs. A plan review there costs more than redoing the work, and it trains users to approve without reading.

1. Surface the interpretation, not just the steps.
   Every plan must open with how the agent read the goal, in one sentence, in the user's own vocabulary. A checklist of subtasks with no stated interpretation hides the exact place these runs go wrong.

2. Make assumptions editable, and treat editing as the primary action.
   Each assumption is a discrete field the user can change in place, and changing one regenerates the affected subtasks. If your plan UI has only Approve and Cancel, this pattern is not implemented. Edit is the point.

3. Rank subtasks by reversibility, and mark the point of no return.
   Every subtask carries a flag for whether its effects can be undone. Render the irreversible ones distinctly and state plainly which step is the last one where stopping is free.

4. Keep the plan live during execution.
   The same plan object updates as steps complete, and any assumption that turns out to be wrong mid-run is surfaced against the step that disproved it. Do not replace the plan with a progress bar once the run starts.

The trap to avoid: the plan with no edit button. Approve and Cancel only, where Cancel means starting over, so everyone approves and the review is theatre.

When you're done, output a Markdown report with three sections:
- Runs given plan summaries: file path + the assumptions now exposed as editable
- Runs deliberately left without one, and why
- Reversibility flags added, and anything that still needs human sign-off

Ask before adding dependencies.`,
    takeaways: [
      {
        heading: "Lead with how the goal was read, not what will be done.",
        body: "'Research competitor pricing' can mean three different jobs. One sentence naming which one the agent chose catches more bad runs than a twelve-item checklist, because that is the step where the misunderstanding actually happens."
      },
      {
        heading: "If the user cannot edit it, it is not a plan.",
        body: "Approve and Cancel is a two-button loading screen. Cancel means losing the work and starting again, so people approve. Make each assumption a field they can change in place, and regenerate the affected steps when they do."
      },
      {
        heading: "Assumptions are the payload. Everything else is packaging.",
        body: "Users cannot judge whether a strategy is optimal, but they can instantly spot 'assumed you meant the UK market' being wrong. Put the assumptions where the eye lands first, not in an expandable section under the checklist."
      },
      {
        heading: "Say which step is the last free exit.",
        body: "Mark the subtasks that cannot be undone and name the point after which stopping costs something. A plan that reads as uniformly safe gets approved with the same attention whether step four sends email to customers or writes to a scratch file."
      },
      {
        heading: "Keep the plan alive while it runs.",
        body: "Replacing it with a progress bar throws away the thing that made it useful. When a step disproves an assumption, show that against the plan, so the user sees the moment the approach stopped matching reality rather than reading it in the summary afterwards."
      }
    ]
  }
};
