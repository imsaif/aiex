import { Pattern } from '../../../../types';
import { examples } from './examples';
import { guidelines } from './guidelines';
import { considerations } from './considerations';
import { codeExamples } from './code-examples';
import { figmaPrompt } from './figma-prompt';

export const feedbackloops: Pattern = {
  id: "feedback-loops",
  title: "Feedback Loops",
  slug: "feedback-loops",
  status: 'implemented',
  description: "Continuous learning mechanisms where user corrections and preferences improve AI performance, creating experiences that evolve with usage.",
  category: "Human-AI Collaboration",
  tags: ["learning", "personalization", "improvement", "user feedback", "adaptation", "continuous learning"],
  thumbnail: "/images/examples/claude-feedback.gif",
  introduction: "Feedback Loops is an AI design pattern where systems continuously learn from user corrections and preferences to improve performance over time. Instead of making the same mistakes repeatedly, the AI captures user feedback, adapts its behavior, and creates increasingly personalized experiences. It's perfect for recommendation systems, content moderation tools, virtual assistants, or any AI that interacts frequently with the same users. Examples include Spotify learning your music taste from skips and likes, Gmail's spam filter improving from your corrections, or smart home devices adapting to your daily routines and preferences.",
  datePublished: "2024-11-02",
  dateModified: "2025-11-18",
  hideFAQ: true,
  content: {
    problem: "AI systems remain static despite user interactions, failing to learn from corrections and preferences, causing repeated mistakes and generic experiences.",
    solution: "Implement feedback mechanisms that capture user corrections, preferences, and interactions to improve AI performance. Make learning visible and allow users to shape AI behavior.",
    examples,
    guidelines,
    considerations,
    relatedPatterns: [
      "Adaptive Interfaces",
      "Human-in-the-Loop",
      "Contextual Assistance"
    ],
    codeExamples,
    figmaPrompt,
    judgmentCall: {
      explainWhen: [
        "A correction can actually change what the same user sees next time. There is a real path from a thumbs-down to a different output, not just a row in a table.",
        "The same user returns to the same surface often (recommendations, assistants, filters), so the learning compounds and they can feel it improving.",
        "The cost of a wrong output lands on the person who can correct it. Their feedback is the highest-signal training data you will ever get for free."
      ],
      dontWhen: [
        "You have no pipeline to consume the signal. A button that writes somewhere no model reads is a suggestion box, not a loop. Don't ship the button.",
        "The interaction is one-shot. If the user never returns, the learning never pays back to the person who taught it, so the ask is pure tax.",
        "Acting on one user's feedback would degrade everyone else: overfitting to the loudest voice or building a filter bubble. Personalization without guardrails is its own failure."
      ],
      trap: "Feedback theater: the thumbs up/down that fires a 'Thanks, we're learning!' toast and changes nothing. The same user makes the same correction next week. It's worse than no button, because it promises a loop, delivers a suggestion box nailed shut, and trains your most engaged users to stop bothering."
    },
    installPrompt: `You are implementing the Feedback Loops design pattern in this codebase.

The pattern in one line: capture user corrections and turn them into a visible change the same user sees next time, or don't ask.

Apply the following moves wherever this codebase collects user feedback on AI output (thumbs up/down, ratings, corrections, accept/reject, dismissals). DO NOT add feedback controls to one-shot surfaces the user never returns to, or anywhere you have no pipeline to act on the signal. An unconsumed button is theater, not a loop.

1. Verify the loop closes before you render the control.
   For each feedback control you find or add, trace where the signal goes. If nothing downstream reads it to change a future output, flag the surface. Remove the control or build the consumer. Do not ship a button that writes to a dead table.

2. Show the user their own dent in the system.
   Replace generic "Thanks for your feedback" confirmations with the consequence: "Got it, you'll see fewer like this." If you can't state what changed, that's a signal the loop isn't closing. Do not fabricate a change you didn't make.

3. Make correcting cheaper than tolerating the error.
   The correction path should be one interaction (a tap, an inline edit), not a form. Measure the cost: if giving feedback is more work than living with the wrong output, users will live with it and your signal dries up.

4. Give learned behavior an undo.
   Every preference the system infers needs a user-visible reset ("forget this", "show me everything again"). Persist what was learned and from which signals, so a reset is auditable. Adaptation with no exit is a trap: one bad day of clicks and the model misreads the user indefinitely.

5. Decide whose feedback counts, and guard the input.
   Before wiring feedback into behavior, define how it's weighted and aggregated. Protect against one loud user overfitting the model, filter-bubble collapse, and deliberate poisoning. A naive loop learns the wrong lesson confidently.

The trap to avoid: feedback theater. A thumbs up/down that fires a thank-you toast and changes nothing is worse than no button. If the loop doesn't close, don't promise that it does.

When you're done, output a Markdown report with three sections:
- Surfaces updated: file path + which of the five moves you applied at each
- Surfaces flagged but not updated: file path + why (e.g. one-shot, no consumer pipeline, no undo path)
- New pipelines / data fields you added (e.g. feedback consumer, learned-preference store with reset, weighting/aggregation) and what still needs human sign-off

Ask before adding dependencies.`,
    takeaways: [
      {
        heading: "Close the loop, or don't open it.",
        body: "If a thumbs-down can't change what the same user sees next time, the button is a lie. Collecting feedback you can't act on isn't humility, it's theater. Build the pipeline first and the control second, not the other way around."
      },
      {
        heading: "Show the user their own dent in the system.",
        body: "'Thanks for your feedback' is a receipt, not a loop. The proof is a changed output the user can see: 'Got it, fewer like this.' Learning the user can't observe is learning they won't believe, and won't keep feeding."
      },
      {
        heading: "Make correcting cheaper than tolerating the error.",
        body: "One tap to correct, and the result visible where they'll notice it. If giving feedback costs more than living with the wrong answer, people live with the wrong answer and your highest-signal data never arrives."
      },
      {
        heading: "Let users undo what the system learned.",
        body: "Adaptation with no reset is its own trap: one odd day of clicks and the model misreads someone for good. A visible 'forget this' is what makes a learning system safe to opt into instead of something to fight."
      },
      {
        heading: "Decide whose feedback counts before you wire it up.",
        body: "Naive loops overfit to the loudest user, build filter bubbles, and reward deliberate poisoning. Weight it, aggregate it, and guard the input, or your loop will learn the wrong lesson with total confidence."
      }
    ]
  }
};
