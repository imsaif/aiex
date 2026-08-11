import { Pattern } from '../../../../types';
import { examples } from './examples';
import { guidelines } from './guidelines';
import { considerations } from './considerations';
import { codeExamples } from './code-examples';
import { figmaPrompt } from './figma-prompt';

export const escalationpathways: Pattern = {
  id: "escalation-pathways",
  title: "Escalation Pathways",
  slug: "escalation-pathways",
  status: 'implemented',
  description: "Design structured escalation triggers and handoff mechanisms so agents can pause and ask for human guidance when they encounter ambiguity, conflicts, or decisions beyond their authorization  -  without breaking workflow or losing context.",
  category: "Human-AI Collaboration",
  tags: ["agentic", "escalation", "handoff", "confidence", "decision-making", "collaboration"],
  thumbnail: "/api/og/patterns?slug=escalation-pathways",
  introduction: "Agents will encounter situations they can't handle  -  ambiguous instructions, conflicting information, high-stakes decisions they're not authorized to make, or tasks that exceed their capabilities. The agent needs a structured way to escalate to the human without breaking the workflow, losing context, or creating anxiety. This is different from simple error recovery because the agent hasn't failed  -  it's recognized its own limitations. The pattern defines four escalation types: confidence-based (uncertainty threshold), permission-based (authorization limits), conflict-based (contradictory information), and capability-based (task exceeds abilities). Each escalation preserves full context, includes a recommended action with confidence level, and allows the agent to continue from where it paused after the user responds.",
  datePublished: "2026-02-16",
  dateModified: "2026-06-23",
  hideFAQ: true,
  content: {
    skillDescription:
      "Use when an agent should stop and ask a human: 'the agent should check with me when unsure', handoff on ambiguity or missing permissions, approval requests mid-task, avoiding both constant interruptions and silent guessing. Escalation Pathways structure when and how agents ask for guidance.",
    problem: "Agents encounter situations they can't handle  -  ambiguity, conflicts, authorization limits, or capability gaps. Poor escalation design either interrupts users too frequently (escalation fatigue) or too rarely (the agent guesses wrong on high-stakes decisions).",
    solution: "Design structured escalation triggers with context preservation, recommended actions with confidence levels, and multiple response options. Batch non-urgent escalations, learn from repeated answers, and let users set escalation sensitivity.",
    examples,
    guidelines,
    considerations,
    relatedPatterns: [
      "Graceful Handoff",
      "Confidence Visualization",
      "Autonomy Spectrum",
      "Trust Calibration"
    ],
    codeExamples,
    figmaPrompt,
    judgmentCall: {
      explainWhen: [
        "The decision is above the agent's pay grade: it is high-stakes, irreversible, or outside the authorization you granted, and a wrong guess costs more than a pause.",
        "The agent's own signals say it is out of depth: confidence is below threshold, the inputs conflict, or the task needs a capability it doesn't have.",
        "A human can actually resolve it faster than the agent can flail. The handoff buys a real answer, not just a place to park the problem."
      ],
      dontWhen: [
        "The agent can recover on its own: retry, re-read, or pick the obvious default. Escalating a decision you could have made is just offloading work onto the user.",
        "There is no human on the other end who can act, or they have no more context than the agent. A handoff into an empty room is worse than a guess.",
        "The cost of being wrong is trivial and reversible. Interrupting someone to confirm a low-stakes, undoable action is how you train them to ignore the next escalation that matters."
      ],
      trap: "The escalation to nowhere. The agent throws up its hands, drops the user into a ticket queue, a closed support form, or worse, loops them straight back to the same bot, and discards everything it knew. The human now starts from zero: re-explaining the problem the agent already understood, re-supplying context the agent already had. A handoff that loses state isn't an escalation, it's an eviction. It is worse than the agent guessing, because at least a guess keeps moving. Just as bad is escalating too late, after the agent has already sent the email, deleted the files, or charged the card, and the 'should I proceed?' arrives as a postmortem."
    },
    installPrompt: `You are implementing the Escalation Pathways design pattern in this codebase.

The pattern in one line: when the agent is out of its depth, hand off to a human before acting, carry the full context across, and let the agent resume from where it paused.

Apply the following moves wherever this codebase runs an agent that can take consequential actions (sending, deleting, charging, publishing, routing, scheduling). DO NOT add escalation to recoverable or trivially reversible steps the agent can just retry or default; gating those only trains users to dismiss escalations.

1. Define the escalation triggers explicitly, before the action fires.
   For each agent action, classify why it would stop: low confidence (below a named threshold), missing permission (outside granted authorization), conflicting inputs, or a capability gap. The trigger must fire BEFORE the irreversible step, not as a postmortem after it. If you can't name a trigger for a high-stakes action, that's a gap to close, not a reason to let it run unsupervised.

2. Escalate WITH context, never WITH a blank ticket.
   Every handoff must carry the full state: what the agent was doing, what it already completed, the specific decision needed, the inputs in conflict, and a recommended action with a confidence level. The human must be able to answer without re-asking the user anything the agent already knew. Persist this payload so the resolver sees exactly what the agent saw.

3. Make the handoff a real path, not a dead queue.
   The escalation target must be a person or surface that can actually resolve it. Do not route to a closed form, an unmonitored inbox, or back to the same model that just gave up. If no live resolver exists for a trigger, flag the surface; do not ship a 'talk to a human' button that goes nowhere.

4. Resume from the pause, don't restart.
   After the human responds, the agent continues the original task from where it stopped, applying the decision, not from the top. Record the resolution so repeated identical answers can be offered as an automation ('you've routed this to Legal 3 times, automate it?').

The trap to avoid: the escalation to nowhere. A handoff that drops context, dumps the user in a dead queue, or loops back to the same bot is worse than a guess, because a guess at least keeps moving. If you can't carry state across the handoff to a resolver who can act, you haven't built an escalation.

When you're done, output a Markdown report with three sections:
- Surfaces updated: file path + the trigger you defined and which of the four moves you applied at each
- Surfaces flagged but not updated: file path + why (e.g. recoverable action, no live resolver, no context to carry)
- New triggers / handoff targets / context payloads you added (escalation types, resolver routing, persisted state, resume logic) and what still needs human sign-off

Ask before adding dependencies.`,
    takeaways: [
      {
        heading: "Escalation is not failure. It's the agent knowing its own edges.",
        body: "Error recovery is for when the agent broke. Escalation is for when it didn't: the task is just above its authority, its confidence, or its capability. Frame the handoff as a competent colleague asking a question, not an error state apologizing. An agent that never escalates isn't confident, it's reckless."
      },
      {
        heading: "Pause before the irreversible step, not after it.",
        body: "An escalation that arrives after the email is sent or the card is charged isn't a decision point, it's a confession. The whole value is catching the high-stakes action while it can still be redirected. If 'should I proceed?' shows up as a postmortem, you escalated too late and the pattern bought you nothing."
      },
      {
        heading: "A handoff that loses context is an eviction, not an escalation.",
        body: "The single thing that makes escalation worth more than a guess is continuity. Carry the full state across: what the agent did, what it completed, the decision needed, the recommended action. If the human has to re-ask the user what the agent already knew, you've just added a worse middleman than no agent at all."
      },
      {
        heading: "Send the recommendation, not a blank question.",
        body: "'What should I do?' makes the user do the agent's thinking. 'I'd route this to Legal, 62% confident. Approve, or tell me otherwise' makes the decision a one-tap confirmation. The recommendation plus a confidence number is what turns an interruption into a quick yes."
      },
      {
        heading: "Tune the volume, and learn from the answers.",
        body: "Too many escalations and users rubber-stamp everything, including the one that mattered. Too few and the agent guesses wrong on the stakes. Let users set sensitivity, batch the non-urgent ones, and when the same answer comes back three times, offer to automate it. An escalation you never stop asking is a decision you failed to learn."
      }
    ]
  }
};
