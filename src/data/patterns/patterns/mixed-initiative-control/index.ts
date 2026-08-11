import { Pattern } from '../../../../types';
import { examples } from './examples';
import { guidelines } from './guidelines';
import { considerations } from './considerations';
import { codeExamples } from './code-examples';
import { figmaPrompt } from './figma-prompt';

export const mixedinitiativecontrol: Pattern = {
  id: "mixed-initiative-control",
  title: "Mixed-Initiative Control",
  slug: "mixed-initiative-control",
  status: 'implemented',
  description: "Design interaction models where control flows seamlessly between human and agent  -  supporting parallel work zones, interruptible agent activity, and natural handoffs without formal 'take over' actions.",
  category: "Human-AI Collaboration",
  tags: ["agentic", "collaboration", "concurrent editing", "handoff", "co-creation", "real-time"],
  thumbnail: "/api/og/patterns?slug=mixed-initiative-control",
  introduction: "In traditional AI, either the human is in control (typing prompts, making decisions) or the AI is (generating responses). But agentic workflows require fluid back-and-forth  -  the agent works on a task, the human jumps in to adjust, the agent continues from the adjusted state. The challenge is designing interfaces where both human and agent can act without stepping on each other. This is especially difficult in collaborative documents, code editors, and planning tools where both parties might be working on the same artifact simultaneously. Mixed-Initiative Control provides clear control indicators, interrupt-without-disruption capability, parallel work zones, seamless handoffs, and explicit conflict resolution. Human input always takes precedence, and the agent should never block the human from interacting.",
  datePublished: "2026-02-16",
  dateModified: "2026-06-23",
  hideFAQ: true,
  content: {
    skillDescription:
      "Use when human and AI work on the same thing at the same time: co-editing with an agent, interrupting or redirecting mid-task, 'I want to jump in without stopping it', fluid turn-taking. Mixed-Initiative Control lets control flow both ways.",
    problem: "Traditional AI is turn-based  -  either human or AI is in control. Agentic workflows require fluid back-and-forth where both can work simultaneously on the same artifact, with the human able to interrupt and redirect at any point.",
    solution: "Design interfaces with clear control indicators, interruptible agent activity, parallel work zones, seamless handoffs, and explicit conflict resolution. Human input always takes precedence, and agent activity never blocks the human.",
    examples,
    guidelines,
    considerations,
    relatedPatterns: [
      "Human-in-the-Loop",
      "Collaborative AI",
      "Autonomy Spectrum",
      "Agent Status & Monitoring"
    ],
    codeExamples,
    figmaPrompt,
    judgmentCall: {
      explainWhen: [
        "Both parties genuinely need to touch the same artifact: a doc, a canvas, a code file where the agent drafts and the human refines in the same pass.",
        "The agent's work is long-running and the human will want to redirect mid-flight, not wait for it to finish and start over.",
        "Interrupting is the normal case, not the exception. If the human only ever reviews at the end, you want a review gate, not shared control."
      ],
      dontWhen: [
        "A turn-based flow already fits: the human asks, the agent answers, the human asks again. Forcing concurrency onto that just adds cursors nobody needs.",
        "The action is irreversible or destructive. Shared initiative over a 'delete production data' button is a way to lose an argument about who pressed it.",
        "You cannot make ownership of each region visible and atomic. Without that, mixed initiative is not collaboration, it is two editors racing for the same line."
      ],
      trap: "The silent tug-of-war: the human edits a paragraph, the agent's loop wakes up, decides that paragraph is still its job, and overwrites the edit. Or both sides see the cursor sitting there and each assumes the other has the wheel, so nothing moves. Neither field ever has one owner, so every region has two owners or none. This is strictly worse than turn-taking: the human loses work they watched themselves type, and learns the only safe move is to stop the agent entirely. Shared control with unclear ownership does not feel collaborative, it feels haunted."
    },
    installPrompt: `You are implementing the Mixed-Initiative Control design pattern in this codebase.

The pattern in one line: let the human and the agent work the same artifact at once, with ownership of each region always visible, atomic, and reclaimable in one move.

Apply the following moves wherever the agent and the human can act on the same artifact (a document, a canvas, a form, an editor). DO NOT apply this to turn-based flows (ask-then-answer chat), to irreversible or destructive actions, or to any surface where you cannot show who owns each region. Forcing concurrency onto those makes things worse, not collaborative.

1. Give every region exactly one owner, and render it.
   Each editable region (section, field, block) carries an owner: human, agent, or none. Show it: a color, a label, a marker. Never let a region be edited by both at once. If you cannot express single ownership in the data model, stop and fix that before adding any concurrency UI.

2. Human input always wins, and the agent yields instantly.
   The moment the human touches a region the agent is working on, the agent releases it and stops writing there in the same tick. Do not queue the agent's pending change to apply after the human stops. Discard it. The human never loses a keystroke to the agent.

3. Make handback explicit, in both directions.
   "I've adjusted this, continue from here" hands a region back to the agent. The agent finishing a region hands it to none, not silently back to itself. Surface every handoff in a visible activity log so the human can always answer "who changed this, and when".

4. Never silently merge a conflict.
   When the human and the agent both have a claim on the same change, surface it and let the human decide. A silent merge is the tug-of-war: it destroys work the user watched themselves create.

The trap to avoid: the silent tug-of-war. If a region can be owned by both or by neither, the agent will overwrite the human or nothing will move. One owner per region, always visible, always reclaimable.

When you're done, output a Markdown report with three sections:
- Surfaces updated: file path + how you modeled per-region ownership and how the agent yields
- Surfaces flagged but not updated: file path + why (e.g. turn-based, destructive action, ownership not expressible)
- New things you added: ownership/owner fields, yield logic, the activity/handoff log, conflict surfacing, and what still needs human sign-off

Ask before adding dependencies.`,
    takeaways: [
      {
        heading: "One owner per region, and show it.",
        body: "Every editable section, field, or block has exactly one owner at a time: you, the agent, or nobody. Render it as a color or a label so anyone can answer 'who has this right now' at a glance. A region two parties can both edit is not shared, it is contested, and contested regions are where work gets lost."
      },
      {
        heading: "Human input always wins, instantly.",
        body: "The moment you touch a region the agent is writing, the agent releases it and stops in the same tick. It does not queue its change to land after you pause. It discards it. The rule users have to be able to trust is simple: you never lose a keystroke to the agent."
      },
      {
        heading: "Make the handback explicit, both ways.",
        body: "'I fixed this, carry on from here' is a real action the human takes, not something the agent guesses at. And when the agent finishes a region it hands control to nobody, not silently back to itself. Implicit handoffs are how the agent ends up holding a wheel the human thought they had reclaimed."
      },
      {
        heading: "Surface conflicts, never auto-merge.",
        body: "When you and the agent both changed the same thing, show it and let the human decide. A silent merge feels clever until it quietly overwrites the sentence someone watched themselves type. The cost of a visible conflict prompt is seconds. The cost of a silent one is trust."
      },
      {
        heading: "Keep a visible activity log.",
        body: "Mixed initiative without attribution is just confusion with extra cursors. A running 'AI updated the headline / you took over the CTA' log lets the human reconstruct who did what, which is the whole reason shared control is safe to use at all."
      }
    ]
  }
};
