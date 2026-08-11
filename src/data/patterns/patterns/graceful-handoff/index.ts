import { Pattern } from '../../../../types';
import { examples } from './examples';
import { guidelines } from './guidelines';
import { considerations } from './considerations';
import { codeExamples } from './code-examples';
import { figmaPrompt } from './figma-prompt';

export const gracefulhandoff: Pattern = {
  id: "graceful-handoff",
  title: "Graceful Handoff",
  slug: "graceful-handoff",
  status: 'implemented',
  description: "Seamless transitions between AI automation and human control.",
  category: "Human-AI Collaboration",
  tags: ["handoff", "automation", "human control", "context preservation", "transitions", "takeover"],
  thumbnail: "/images/examples/telsaautopilotgif.gif",
  introduction: "Graceful Handoff enables smooth transitions between AI automation and human control without losing progress. Instead of abrupt switches, the system preserves state for seamless takeover or resumption. It's critical for semi-autonomous systems or collaborative workflows alternating between AI and manual work. Examples include Tesla Autopilot takeover, GitHub Copilot switching between suggestions and manual coding, or smart email drafts you can edit.",
  datePublished: "2024-11-02",
  dateModified: "2025-11-18",
  hideFAQ: true,
  content: {
    skillDescription:
      "Use when control passes between AI and human: taking over from automation, 'let me finish this manually', resuming automation after manual edits, no lost progress at the switch. Graceful Handoff makes transitions seamless in both directions.",
    problem: "Users feel trapped by automation or lose progress when switching between AI and manual control, causing frustration and interruptions.",
    solution: "Design clear mechanisms for smooth transitions between AI assistance and manual control. Preserve context and state across transitions for seamless resumption.",
    examples,
    guidelines,
    considerations,
    relatedPatterns: [
      "Human-in-the-Loop",
      "Error Recovery & Graceful Degradation",
      "Contextual Assistance",
      "Escalation Pathways"
    ],
    codeExamples,
    figmaPrompt,
    judgmentCall: {
      explainWhen: [
        "Control genuinely needs to change hands: a safety takeover, the AI hitting the edge of its competence, or the user deciding to step in. A handoff only matters when someone new is actually taking the wheel.",
        "You can transfer the state, not just the controls. The receiver needs what the AI was doing, why, and where it stopped, or they inherit a steering wheel attached to nothing.",
        "There is time to build awareness before responsibility lands. The human gets a heads-up and a beat to orient, instead of a wheel shoved into their hands mid-turn."
      ],
      dontWhen: [
        "You can't give advance warning. A handoff that fires the instant the AI gives up hands control to someone who has no idea what's happening, and that is the failure mode, not the recovery from it.",
        "You can't carry the context across. Dumping control with no record of what the AI was doing leaves the human reconstructing the situation from scratch at the worst possible moment.",
        "Nothing actually changes who is responsible. A 'you're in control now' banner with no real transfer of authority or state is theater, and it makes the human accountable for a state they never saw."
      ],
      trap: "The cliff-edge handoff: the AI disengages the instant it gets confused and dumps full control on a human with no warning and no situational state, like a self-driving car that drops autopilot mid-corner. It is worse than never automating at all, because the human inherits the wheel a half-second before the crash and then gets blamed for it. A handoff that arrives without lead time and without context isn't a handoff, it's an ejection seat."
    },
    installPrompt: `You are implementing the Graceful Handoff design pattern in this codebase.

The pattern in one line: when control passes between AI and a human (or another agent), transfer the state and give warning, so the receiver takes the wheel ready, not mid-corner.

Apply the following moves wherever this codebase passes control across an AI/human (or AI/agent) boundary: takeovers, escalations, "AI gave up" fallbacks, autopilot disengagement, draft-to-edit transitions. DO NOT manufacture a handoff UI where control never actually changes hands; a "you're in control" banner over a state nothing transferred into is theater.

1. Warn before you hand off, never at the moment of.
   For every AI-initiated handoff surface, add lead time between "the AI is about to stop" and "you are now responsible." If the codebase only flips a mode flag the instant the AI fails, that is the cliff-edge trap. Surface an approaching-boundary signal first.

2. Transfer the state, not just the controls.
   At each handoff, package what the AI was doing, why, and where it stopped (current step, inputs, partial output, confidence) and hand that to the receiver. If a surface flips control without carrying this payload, flag it. A wheel with no road context is an ejection seat.

3. Make who-is-in-control unambiguous at all times.
   Render an explicit, persistent mode indicator (AI / human / handing off). No surface should leave the user guessing who is responsible right now. Ambiguous control is how both sides assume the other has it.

4. Make the handoff reversible and resumable.
   The human must be able to hand control back and have the AI resume from the current state, not restart. Preserve the working context across the round trip so nothing is lost on the way back.

5. Pick the moment, don't let the failure pick it.
   Where possible, initiate the handoff at a safe checkpoint (between steps, at a natural pause) rather than at the instant of breakdown. If the only handoff point is the moment of failure, that is a design bug to fix, not a transition to style.

The trap to avoid: the cliff-edge handoff. If control arrives with no warning and no situational state, you have built an ejection seat, not a handoff. Warn early, transfer the state, and let the receiver get ready before they are responsible.

When you're done, output a Markdown report with three sections:
- Surfaces updated: file path + which of the five moves you applied at each
- Surfaces flagged but not updated: file path + why (e.g. control never actually changes hands, no safe checkpoint, no state to transfer)
- New things you added (warning signals, state-transfer payloads, mode indicators, resume paths) and what still needs human sign-off

Ask before adding dependencies.`,
    takeaways: [
      {
        heading: "Warn before the handoff, not at the moment of it.",
        body: "A handoff that fires the instant the AI gives up is an ambush. The human inherits the wheel with no time to orient and gets blamed for whatever happens next. Lead time is the difference between a takeover and a crash."
      },
      {
        heading: "Hand off the state, not just the controls.",
        body: "Passing control without passing context, what the AI was doing, why, and where it stopped, leaves the human reconstructing the situation from scratch at the worst possible time. The state transfer is the handoff. The button is just the trigger."
      },
      {
        heading: "Always make who-is-in-control unambiguous.",
        body: "If the user has to guess whether the AI or they are responsible right now, both sides assume the other has it, and no one does. A persistent, explicit mode indicator is the cheapest way to prevent the most expensive failure."
      },
      {
        heading: "Make it reversible, and resume from state.",
        body: "A good handoff goes both ways: the human can take over and hand back, with the AI resuming from where things actually are, not restarting from zero. A one-way handoff that loses progress on the round trip just teaches users never to take over."
      },
      {
        heading: "Choose the moment, don't let the failure choose it.",
        body: "The best handoffs happen at safe checkpoints, between steps, at natural pauses, not at the instant of breakdown. If the only time you can hand off is the moment the AI fails, that is a design bug to fix, not a transition to polish."
      }
    ]
  }
};
