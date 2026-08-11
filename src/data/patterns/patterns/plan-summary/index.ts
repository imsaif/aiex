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
  dateModified: "2026-02-16",
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
    figmaPrompt
  }
};
