import { Pattern } from '../../../../types';
import { examples } from './examples';
import { guidelines } from './guidelines';
import { considerations } from './considerations';
import { codeExamples } from './code-examples';
import { figmaPrompt } from './figma-prompt';

export const ambientintelligence: Pattern = {
  id: "ambient-intelligence",
  title: "Ambient Intelligence",
  slug: "ambient-intelligence",
  description: "Create unobtrusive AI that senses context and provides assistance without explicit interaction.",
  category: "Adaptive & Intelligent Systems",
  thumbnail: "/images/examples/siri-conversation.gif",
  introduction: "Ambient Intelligence is an AI design pattern where systems work quietly in the background, sensing context and providing help without being explicitly asked or interrupting your flow. Unlike traditional assistants that wait for commands, ambient AI monitors your environment, understands your situation, and acts automatically when needed. It's perfect for situations where users can't actively interact with devices, environments requiring hands-free assistance, or systems that should enhance rather than interrupt. Examples include smart thermostats adjusting temperature based on your routine, AirPods switching seamlessly between devices, or noise-canceling headphones that pause music when you start speaking.",
  datePublished: "2024-10-17",
  dateModified: "2025-11-18",
  hideFAQ: true,
  content: {
    problem: "Users need intelligent assistance without cognitive overhead, especially when attention is focused elsewhere.",
    solution: "Create AI systems that operate unobtrusively in the background, sensing context and providing assistance without interruption.",
    examples,
    guidelines,
    considerations,
    relatedPatterns: [
      "Contextual Assistance",
      "Progressive Disclosure",
      "Human-in-the-Loop",
      "Agent Status & Monitoring"
    ],
    codeExamples,
    figmaPrompt,
    judgmentCall: {
      explainWhen: [
        "The user genuinely can't act in the moment: hands are busy, attention is elsewhere, the device has no screen. Ambient assistance earns its keep when the alternative is no help at all.",
        "The action is low-stakes and reversible, so acting without asking costs the user nothing if it's wrong: nudging brightness, pausing music, pre-warming a room.",
        "The signal you sense is one the user would expect you to use: they set a wake alarm, so adjusting morning lighting is obviously in scope."
      ],
      dontWhen: [
        "You'd be acting on a signal the user never offered as input. If they didn't think they were telling you something, sensing it and acting on it is surveillance, not assistance.",
        "The action is consequential or hard to reverse. Sending a message, making a purchase, or sharing data should never happen on an inferred signal with no confirmation.",
        "You can't show the user, after the fact, what you sensed and what you changed. Ambient AI with no inspectable trace is a system the user can't audit, correct, or trust."
      ],
      trap: "The surveillance hum: ambient AI that keeps widening what it senses, acting on signals the user never meant as input. Presence, dwell time, who else is in the room, the tone of a conversation it overheard. An explicit assistant only knows what you told it. The surveillance hum knows things you never said, and leaves no trace of what it noticed, so you can't tell what it has learned about you or unsee it. It feels like magic right up until the moment it reacts to something you didn't realize it could see, and then every quiet adjustment reads as a system watching you. Worse than no ambient AI, because it trades a small convenience for the creeping sense that nothing is off the record."
    },
    installPrompt: `You are implementing the Ambient Intelligence design pattern in this codebase.

The pattern in one line: assist quietly from context the user already offered, act only on low-stakes reversible changes, and keep an inspectable trace of what you sensed and changed.

Apply the following moves wherever this codebase senses context and acts without an explicit request (presence, time of day, location, activity, device state). DO NOT apply ambient automation to consequential or hard-to-reverse actions (sending, purchasing, sharing data); those need explicit confirmation, not a background nudge.

1. Sense only what the user offered.
   For each ambient action, name the specific signal it reads and confirm the user would expect that signal to be in scope. If the signal is something the user never meant as input (overheard audio, who else is present, inferred mood), flag the surface and stop. Do not act on it.

2. Gate by stakes, not by capability.
   Just because you can infer it doesn't mean you should act on it. Restrict automatic action to low-stakes, reversible changes. Route anything consequential through an explicit confirmation step. Add a stakes check before any background action fires.

3. Leave a trace the user can inspect.
   Every ambient action must write to a human-readable activity log: what was sensed, what changed, when, and a one-tap undo. Persist the sensed signal alongside the action so a curious user can see why. Never let an adjustment happen with no record of what triggered it.

4. Make the off-switch obvious, not buried.
   Every ambient behavior needs a reachable control to pause or disable it, surfaced near where the behavior shows up, not three settings screens deep. A system the user can't quiet is one they'll resent.

The trap to avoid: the surveillance hum. If you're acting on a signal the user never offered, or you can't show them afterward what you sensed and changed, you've built surveillance wearing the costume of assistance. Narrow the sensing and add the trace.

When you're done, output a Markdown report with three sections:
- Surfaces updated: file path + which of the four moves you applied at each (scoped signal, stakes gate, activity trace, off-switch)
- Surfaces flagged but not updated: file path + why (e.g. consequential action, signal the user never offered, no trace possible)
- New things you added (activity log, undo, stakes check, disable control) and what still needs human sign-off

Ask before adding dependencies.`,
    takeaways: [
      {
        heading: "Sense only what the user offered.",
        body: "An explicit assistant knows what you typed. Ambient AI knows what it can observe, and the temptation is to observe everything. Draw the line at signals the user would expect you to use: they set the alarm, so morning lighting is fair game. Acting on a signal they never meant as input is surveillance, not help."
      },
      {
        heading: "Gate by stakes, not by capability.",
        body: "You can infer a lot. That's not permission to act on it. Reserve silent automatic action for changes that cost nothing if they're wrong: brightness, temperature, pausing audio. Anything consequential or hard to reverse needs a confirmation, not a background nudge."
      },
      {
        heading: "Leave a trace the user can inspect.",
        body: "The thing that turns ambient assistance into the surveillance hum is invisibility: actions happen and there's no record of what was sensed or why. Log what you noticed and what you changed, with a one-tap undo. A user who can see the reasoning can trust it. A user who can't will assume the worst."
      },
      {
        heading: "Make the off-switch obvious.",
        body: "Ambient AI that can't be quieted is a system people learn to resent. Put the pause and disable controls near where the behavior appears, not buried three screens deep. Easy to turn off is what makes it safe to leave on."
      },
      {
        heading: "Quiet is a feature, not the whole pattern.",
        body: "Being unobtrusive is the easy half. The hard half is staying accountable while invisible. The best ambient AI is the one you forget is running and can still, at any moment, ask 'what did you just do and why' and get a straight answer."
      }
    ]
  }
};
