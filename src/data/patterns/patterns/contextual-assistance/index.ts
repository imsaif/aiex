import { Pattern } from '../../../../types';
import { examples } from './examples';
import { guidelines } from './guidelines';
import { considerations } from './considerations';
import { codeExamples } from './code-examples';
import { figmaPrompt } from './figma-prompt';

export const contextualassistance: Pattern = {
  id: "contextual-assistance",
  title: "Contextual Assistance",
  slug: "contextual-assistance",
  description: "Offer timely, proactive help and suggestions based on user context, history, and needs.",
  category: "Human-AI Collaboration",
  tags: ["smart compose", "autocomplete", "proactive help", "AI assistance", "user context", "predictive", "suggestions"],
  thumbnail: "/images/examples/Smart-compose_Taco_Tuesday.gif",
  introduction: "Contextual Assistance is an AI design pattern where systems proactively offer help based on user context and behavior, without waiting to be asked. Instead of interrupting workflows with generic tips, this pattern analyzes what users are doing right now and suggests relevant actions at the perfect moment. It's most effective for repetitive tasks, complex applications, and situations where AI can learn from patterns to predict needs. Examples include Gmail's Smart Compose finishing your sentences, search autocomplete guessing your query, and Notion suggesting relevant pages as you type.",
  datePublished: "2024-01-15",
  dateModified: "2026-06-23",
  hideFAQ: true,
  content: {
    skillDescription:
      "Use when help should arrive at the moment of need: proactive tips, inline suggestions, 'users do not know what to ask', onboarding hints, help without interrupting the workflow. Contextual Assistance offers timely guidance from context.",
    problem: "Users need guidance but often don't know what or when to ask. Traditional help interrupts workflows.",
    solution: "Design intelligent assistance that proactively offers relevant help, suggestions, or information based on user context and behavior. Anticipate needs rather than waiting for explicit requests.",
    examples,
    guidelines,
    considerations,
    relatedPatterns: [
      "Progressive Disclosure",
      "Transparent Feedback",
      "Adaptive Interfaces"
    ],
    codeExamples,
    figmaPrompt,
    judgmentCall: {
      explainWhen: [
        "The user is mid-task and a suggestion saves a step they were already about to take: finishing a sentence, completing a path, surfacing the file they're clearly reaching for.",
        "The signal is strong and specific. You can name exactly what the user is doing and what they need next, not just that they're 'active'.",
        "The help is glanceable and ignorable: ghost text, an inline chip, a quiet panel the user opts into with one key, never a thing that grabs focus."
      ],
      dontWhen: [
        "The signal is weak. 'The user opened a document' is not a reason to offer help; it's a reason to get out of the way.",
        "The suggestion interrupts: a popup that steals focus, a modal mid-keystroke, a tooltip that covers the thing the user is looking at.",
        "You're firing to look helpful, not because you're confident. Coverage metrics ('we suggested something on 90% of sessions') are how this pattern rots."
      ],
      trap: "The Clippy reflex: help that fires on near-zero signal to prove it's working. 'It looks like you're writing a letter' interrupted everyone who opened a document, confident and useless. The math is asymmetric and most teams get it backwards: a suggestion you withhold costs nothing because the user just keeps working, but a wrong or ill-timed one costs attention even when it's dismissed, because the user still had to stop, read it, and decide it was noise. Optimizing for suggestion volume optimizes for the one cost that compounds. The discipline of the pattern is staying silent until you're sure, and a system that can't stay silent has betrayed it."
    },
    installPrompt: `You are implementing the Contextual Assistance design pattern in this codebase.

The pattern in one line: offer help the user was already reaching for, at a moment that doesn't interrupt, and stay silent the rest of the time.

Apply the following moves wherever this codebase surfaces a proactive suggestion (autocomplete, smart compose, "you might want to", inline tips, recommended next actions). DO NOT add suggestions to surfaces where the signal is weak (page load, generic activity) or where the help would steal focus. Silence is the default, not the failure state.

1. Require a strong, named signal before suggesting.
   For each suggestion surface, write down the specific user action that triggers it (ended a known phrase, opened a file of a known type, repeated a manual step). If the trigger is just "the user is active" or "the page loaded", remove the suggestion. Do not fire on ambient presence.

2. Make every suggestion glanceable and ignorable.
   Render suggestions as ghost text, inline chips, or a quiet panel. Never a modal, never a focus-stealing popup, never anything that covers what the user is currently reading or moves the element they're about to click. Accepting must be one deliberate action (Tab, click); ignoring must require nothing.

3. Measure withheld suggestions, not just shown ones.
   Add an accept-rate metric per surface (accepted / shown). If a surface shows many suggestions and few are accepted, that is noise to cut, not coverage to celebrate. Do not optimize for suggestion volume. Flag any surface below a sane accept-rate threshold for removal.

4. Give the user a volume control.
   Every suggestion stream needs a way to turn it down or off (per-surface setting, "stop suggesting this", a global frequency dial). Persist the preference. A user who dismisses the same suggestion repeatedly is telling you to stop; honor it without making them hunt for the switch.

The trap to avoid: the Clippy reflex. Help that fires on weak signal to look useful costs the user attention every time it's wrong, even when ignored. If you can't name a strong reason to suggest, suggest nothing.

When you're done, output a Markdown report with three sections:
- Surfaces updated: file path + which of the four moves you applied at each
- Surfaces flagged but not updated: file path + why (e.g. weak signal, focus-stealing, no accept-rate data)
- New metrics / settings you added (accept-rate tracking, frequency controls, dismiss-to-mute) and what still needs human sign-off

Ask before adding dependencies.`,
    takeaways: [
      {
        heading: "Silence is the default, not the failure state.",
        body: "A suggestion you withhold costs nothing: the user just keeps working. A wrong one costs attention even when it's dismissed, because they had to stop, read it, and decide it was noise. When in doubt, say nothing. The best contextual assistance is invisible most of the time."
      },
      {
        heading: "Fire on a strong signal, not on presence.",
        body: "'The user opened a document' is not a reason to help; it's a reason to get out of the way. You earn the right to suggest by naming exactly what the user is doing and what they need next. If the trigger is just 'they're active', you don't have a signal, you have an excuse."
      },
      {
        heading: "Glanceable and ignorable, or it isn't assistance.",
        body: "Ghost text, an inline chip, a quiet panel: help that sits beside the work and waits. The moment a suggestion steals focus or covers what the user is reading, it stops being help and becomes an interruption you dressed up as one."
      },
      {
        heading: "Measure what you withhold, not just what you show.",
        body: "Accept-rate per surface is the honest metric. Coverage ('we suggested something 90% of the time') is how this pattern rots: it rewards volume, which is exactly the cost that compounds. A surface with many shows and few accepts is noise to cut, not a win to report."
      },
      {
        heading: "Let the user turn it down.",
        body: "Someone who dismisses the same suggestion three times is telling you to stop. Give every stream a volume control and persist it. A learning system that can't be told 'enough' isn't assisting, it's nagging with a model attached."
      }
    ]
  }
};
