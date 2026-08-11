import { Pattern } from '../../../../types';
import { examples } from './examples';
import { guidelines } from './guidelines';
import { considerations } from './considerations';
import { codeExamples } from './code-examples';
import { figmaPrompt } from './figma-prompt';

export const errorrecovery: Pattern = {
  id: "error-recovery",
  title: "Error Recovery & Graceful Degradation",
  slug: "error-recovery",
  description: "Fail gracefully with clear recovery paths when things go wrong.",
  category: "Trustworthy & Reliable AI",
  thumbnail: "/images/examples/chatgpt-limitations.png",
  introduction: "Error Recovery & Graceful Degradation ensures systems fail gracefully with clear recovery paths instead of confusing errors. Instead of cryptic messages, the AI acknowledges limitations, explains issues, and offers next steps. It's critical for maintaining trust in production systems where failures have consequences. Examples include ChatGPT admitting uncertainty, Google Translate offering alternatives, or voice assistants suggesting different approaches when misunderstanding.",
  datePublished: "2024-01-15",
  dateModified: "2025-11-18",
  hideFAQ: true,
  content: {
    skillDescription:
      "Use when the AI fails or hits something it cannot handle: error states, fallbacks, 'what happens when the model is wrong or down', retry paths, degraded modes. Error Recovery and Graceful Degradation fails clearly with a way forward.",
    problem: "AI systems inevitably make mistakes or encounter unhandleable situations, potentially frustrating users.",
    solution: "Design graceful degradation and clear recovery paths to maintain user trust when AI fails.",
    examples,
    guidelines,
    considerations,
    relatedPatterns: [
      "Contextual Assistance",
      "Progressive Disclosure",
      "Human-in-the-Loop"
    ],
    codeExamples,
    figmaPrompt,
    judgmentCall: {
      explainWhen: [
        "The failure is something the user can act on: retry with a change, rephrase, switch modes, or escalate. A recovery path only matters when there is a path.",
        "Failures are expected and consequential: production AI will hit ambiguity, timeouts, and unsupported requests, where a raw error breaks trust.",
        "The system can degrade partially instead of failing wholesale: a cached answer, a simpler fallback, or a partial result with the gap flagged."
      ],
      dontWhen: [
        "The 'error' is really a normal state you're dressing up. Inventing a recovery flow for something that should just work hides a bug instead of fixing it.",
        "The failure is silent and safe and the user has nothing to do. A modal apologizing for something invisible just manufactures anxiety.",
        "You're catching the error only to show a friendlier message while swallowing the real failure. A prettier dead-end is still a dead-end."
      ],
      trap: "The dead-end apology: a polite 'Something went wrong, please try again' with no diagnosis, no alternative, and nothing different on retry. It feels considerate but leaves the user exactly as stuck, and 'try again' on an unchanged input just reproduces the failure. Empathy without a path is theater."
    },
    installPrompt: `You are implementing the Error Recovery & Graceful Degradation design pattern in this codebase.

The pattern in one line: when the AI fails, fail into a path forward, not a polite dead-end.

Apply the following moves at every AI failure surface (timeout, low confidence, unsupported request, upstream/API error). DO NOT manufacture recovery UI for non-errors or silent-and-safe failures the user can't act on; that just creates anxiety.

1. Give every failure an action.
   For each failure surface, define the user's concrete next step: retry-with-a-change, switch mode, accept a partial result, or escalate to a human. If a surface has no possible next step, that's a bug to fix, not a message to prettify.

2. Prefer graceful degradation over hard failure.
   Where possible, return a fallback (cached value, simpler model, partial result with the missing part flagged) instead of an error state. Make the degradation visible. Do not present a degraded answer as if it were complete.

3. Translate errors into the user's language.
   Replace raw error codes and stack traces shown to users with a plain-language statement of what happened and, where known, why. Keep the technical detail in logs, not on screen.

4. Make retry meaningful.
   A retry control must change something (re-prompt, adjusted params, a different route) or tell the user what to change. Never wire a "Try again" button that re-sends the identical failing request.

5. Recover in the UI, surface in telemetry.
   In every catch block that renders a friendly message, also log the real error with context. A graceful UI must never become a silent failure your monitoring can't see.

The trap to avoid: the dead-end apology. If "try again" doesn't change anything, it isn't recovery. Offer a different path or tell the user exactly what to change.

When you're done, output a Markdown report with three sections:
- Surfaces updated: file path + which of the five moves you applied at each
- Surfaces flagged but not updated: file path + why (e.g. non-error, silent-and-safe, no user action)
- New fallbacks/paths you added (cached degradation, partial results, escalation, error logging) and what still needs human sign-off

Ask before adding dependencies.`,
    takeaways: [
      {
        heading: "Every error needs an exit, not just an apology.",
        body: "'Something went wrong' is where bad UIs stop. The useful move is the next action: retry with a change, switch modes, use a partial result, or reach a human. An error message with no path is a dead-end with manners."
      },
      {
        heading: "Degrade, don't collapse.",
        body: "When the best answer isn't available, return the next-best one: a cached result, a simpler model, a partial answer with the gap flagged, instead of failing wholesale. Partial and honest beats nothing, as long as you don't pass it off as the full answer."
      },
      {
        heading: "Say what happened in the user's terms.",
        body: "A stack trace or 'Error 500' just transfers your problem to the user. Name the issue in their language and, where you can, why, so they can actually decide what to do next. Keep the technical detail in your logs."
      },
      {
        heading: "Make 'try again' actually different.",
        body: "Retry on an unchanged input only reproduces the failure. Either change something (rephrase, adjust, route differently) or tell the user what to change. A button that repeats the same error is a trap dressed as a lifeline."
      },
      {
        heading: "Catch the error, don't swallow it.",
        body: "A friendlier message that hides the real failure from your logs is worse than the raw error: the user is still stuck and now you're blind to it. Recover gracefully on screen and surface the truth to monitoring."
      }
    ]
  }
};
