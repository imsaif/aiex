import { Pattern } from '../../../../types';
import { examples } from './examples';
import { guidelines } from './guidelines';
import { considerations } from './considerations';
import { codeExamples } from './code-examples';
import { figmaPrompt } from './figma-prompt';

export const intentpreview: Pattern = {
  id: "intent-preview",
  title: "Intent Preview",
  slug: "intent-preview",
  status: 'implemented',
  description: "Before any significant action, the agent presents a clear, scannable summary of what it intends to do  -  showing planned steps, reversibility status, and edit controls for user approval.",
  category: "Human-AI Collaboration",
  tags: ["agentic", "preview", "approval", "transparency", "multi-step", "action plan"],
  thumbnail: "/images/examples/claudepropose.gif",
  introduction: "The Intent Preview pattern addresses a core anxiety in agentic AI: users need to understand what will happen BEFORE it happens. Unlike traditional AI where the user explicitly types a prompt and evaluates the response, agentic actions may be initiated proactively or involve consequences that are difficult to reverse  -  sending emails, booking flights, modifying files. This pattern shows a clear, scannable summary of planned actions using plain language (not technical jargon), with each step marked for reversibility and editable by the user. The preview must be sequential for multi-step operations, highlight irreversible actions visually, and never auto-dismiss. This transforms the approval moment from a binary yes/no into a structured review that builds trust and catches misunderstandings before they cause harm.",
  datePublished: "2026-02-16",
  dateModified: "2026-02-16",
  hideFAQ: true,
  content: {
    skillDescription:
      "Use when an agent is about to act and the user should see the plan first: 'show me what it will do before it does it', dry-run summaries, previewing steps and reversibility, approve or edit before execution. Intent Preview earns informed consent for actions.",
    problem: "When an agent is about to take a multi-step action, users need to understand what will happen before it happens. Without an intent preview, users experience anxiety leading to constant monitoring or blind trust that erodes at the first mistake.",
    solution: "Before any significant action, present a clear, scannable preview showing planned steps in plain language, with reversibility indicators, edit controls for individual steps, and explicit approve/reject buttons. Never auto-dismiss the preview.",
    examples,
    guidelines,
    considerations,
    relatedPatterns: [
      "Progressive Disclosure",
      "Human-in-the-Loop",
      "Autonomy Spectrum",
      "Plan Summary"
    ],
    codeExamples,
    figmaPrompt,
    judgmentCall: {
      explainWhen: [
        "The action is consequential or hard to reverse: sending mail, moving money, deleting files, booking, posting. The cost of a wrong action is higher than the cost of a glance.",
        "The agent inferred intent rather than being told step by step. The preview is where you check that the agent understood what you actually meant.",
        "The plan is multi-step and the user can usefully edit it: drop a step, change a recipient, fix an attachment before anything runs."
      ],
      dontWhen: [
        "The action is trivial and reversible. A preview for every autocomplete or draft just trains users to approve on reflex, and a reflex-approval is no approval at all.",
        "You can only show a preview that summarizes the plan but isn't the literal contract the executor runs. A pretty summary stapled to a different execution path is worse than no preview.",
        "The preview would lag the real state. If the agent re-plans after approval, the thing the user signed off on no longer exists, and you've collected consent for a phantom."
      ],
      trap: "The cosmetic preview: a tidy, reassuring summary that doesn't match what actually executes. The diff quietly omits the step that overwrites the file. The summary says 'archive 3 threads' while the job deletes them. 'Email the team' renders as one calm line and fans out to 400 external addresses. The user reads it, it looks reasonable, they approve, and the agent does something they never agreed to. This is worse than no preview, because a preview manufactures consent: now there's a record showing the user said yes to an action they were never actually shown. Real approval requires that the words on the card are the exact instructions that run. If the summary and the execution can drift apart, you didn't build a preview, you built an alibi."
    },
    installPrompt: `You are implementing the Intent Preview design pattern in this codebase.

The pattern in one line: before an agent takes a consequential action, show the user the exact plan that will run, let them edit it, and get an explicit yes.

Apply the following moves wherever this codebase lets an agent take an action with side effects (send, post, pay, delete, move, book, modify external state). DO NOT add a preview to trivial, reversible, no-side-effect actions (drafting, in-place suggestions, read-only queries). A preview there is friction that trains reflex-approval.

1. Make the preview the literal contract, not a summary of one.
   Render the preview from the same plan object the executor consumes. Find any place where a human-facing summary is built separately from the executed instructions and collapse them to one source. If they can drift, that is the bug to fix first.

2. Surface reversibility and blast radius per step.
   For each step, show whether it is reversible, partial, or irreversible, and the real scope (how many recipients, files, dollars, rows). Never let an irreversible or wide-blast step read as one calm line. If you can't determine reversibility for a step, mark it unknown and treat it as irreversible.

3. Make steps editable, and approval explicit and per-plan.
   Let the user remove or modify individual steps before running. Require an explicit approve action; never auto-dismiss or auto-run on a timeout. Approval applies to the plan as shown: if the plan changes after approval, re-prompt. Do not carry a stale yes forward.

4. Persist what was shown alongside what ran.
   When an approved plan executes, record the exact previewed plan and the actual executed actions together. If they diverge, that is an incident to surface, not to swallow. This is how you prove the preview was real and not an alibi.

The trap to avoid: the cosmetic preview. A summary that looks reasonable but isn't what executes manufactures consent for an action the user never agreed to. If the words on the card aren't the instructions that run, you didn't build a preview.

When you're done, output a Markdown report with three sections:
- Surfaces updated: file path + which of the four moves you applied at each
- Surfaces flagged but not updated: file path + why (e.g. trivial/reversible, read-only, summary and executor can't yet be unified)
- New data/fields you added (shared plan object, per-step reversibility, approval audit record) and what still needs human sign-off

Ask before adding dependencies.`,
    takeaways: [
      {
        heading: "The preview must be the thing that runs, not a description of it.",
        body: "Render the card from the same plan the executor consumes. The moment the summary is built separately from the instructions, they can drift, and a preview that can lie is worse than none: it collects consent for an action the user never saw."
      },
      {
        heading: "Preview consequence, not just intent.",
        body: "'Send email' and 'send to 400 external addresses' are the same intent and wildly different actions. Show reversibility and blast radius per step so the irreversible, wide-scope move can't hide inside a calm one-liner."
      },
      {
        heading: "Approval is for the plan as shown, and only that plan.",
        body: "If the agent re-plans after the user approves, the thing they signed off on no longer exists. A stale yes carried forward is a phantom consent. Re-prompt when the plan changes; never auto-run on a timeout."
      },
      {
        heading: "Make it editable, or it's just a confirmation dialog.",
        body: "The value of a preview is catching the misunderstanding before it executes. If the only options are approve and reject, you've reproduced the yes/no you were trying to replace. Let users drop a step or fix a recipient in place."
      },
      {
        heading: "Record what was shown next to what ran.",
        body: "Persist the previewed plan alongside the executed actions. If they ever diverge, that's the incident that proves your preview was honest, or proves it wasn't. Without that record, you can't tell a real approval from an alibi."
      }
    ]
  }
};
