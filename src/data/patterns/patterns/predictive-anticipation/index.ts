import { Pattern } from '../../../../types';
import { examples } from './examples';
import { guidelines } from './guidelines';
import { considerations } from './considerations';
import { codeExamples } from './code-examples';
import { figmaPrompt } from './figma-prompt';

export const predictiveanticipation: Pattern = {
  id: "predictive-anticipation",
  title: "Predictive Anticipation",
  slug: "predictive-anticipation",
  status: 'implemented',
  description: "AI that predicts user needs before they're expressed, pre-loading content and suggesting next actions based on behavioral patterns.",
  category: "Adaptive & Intelligent Systems",
  tags: ["prediction", "pre-loading", "anticipation", "behavioral patterns", "proactive", "smart recommendations"],
  thumbnail: "/api/og/patterns?slug=predictive-anticipation",
  introduction: "Predictive Anticipation is an AI design pattern where systems predict what you'll need next based on behavioral patterns, pre-loading content and suggesting actions before you even ask. Instead of waiting for explicit requests, the AI learns from your habits to prepare resources and recommendations proactively. It's perfect for productivity tools, content platforms, navigation apps, or any system where predicting next steps saves time. Examples include Google Maps pre-loading your commute route at typical departure times, Spotify creating Discover Weekly before you search, or email apps drafting smart replies as you read messages.",
  datePublished: "2024-01-15",
  dateModified: "2026-06-23",
  hideFAQ: true,
  content: {
    problem: "Users waste time waiting for content or searching for next actions. Systems react instead of anticipating needs.",
    solution: "Design AI that learns from behavior patterns to predict next actions. Pre-load content, suggest next steps, and gather resources before users request them.",
    examples,
    guidelines,
    considerations,
    relatedPatterns: [
      "Contextual Assistance",
      "Adaptive Interfaces",
      "Intelligent Caching"
    ],
    codeExamples,
    figmaPrompt,
    judgmentCall: {
      explainWhen: [
        "The next need is highly probable and the prediction only prepares, not commits: pre-fetch the route, warm the cache, draft the reply but leave the send to the user.",
        "Being ready a beat early is the whole value: a map that has tomorrow's commute loaded before you ask, a playlist built before you go looking.",
        "A wrong guess costs nothing. The user ignores the prepared thing and reaches for what they actually wanted, with no penalty and no cleanup."
      ],
      dontWhen: [
        "Acting on the prediction would do something the user has to notice and undo. Prepare the action, never commit it on a guess.",
        "Your confidence is mediocre and you'd surface the prediction anyway. A loud wrong guess is worse than staying quiet.",
        "The prediction narrows the world to what the user already does. Pre-loading only the familiar is a filter bubble wearing a convenience badge."
      ],
      trap: "The silent autopilot: the system is so sure of your next move that it just does it, no prompt, no confirmation. Then the guess is wrong, and now there's a sent email, a moved file, a committed route you didn't ask for, and you only find out by tripping over the mess. Prediction that prepares is a head start. Prediction that acts is a stranger making decisions in your account, and the cost isn't a suggestion you ignore, it's work you have to detect and reverse."
    },
    installPrompt: `You are implementing the Predictive Anticipation design pattern in this codebase.

The pattern in one line: predict the user's next need and prepare for it, but never commit an action on a guess.

Apply the following moves wherever this codebase can anticipate a likely next step (pre-fetch, pre-compute, draft, suggest). DO NOT auto-execute anything the user would have to notice and undo (send, delete, move, purchase, irreversible writes); a prediction prepares, the user commits.

1. Separate "prepare" from "commit" at every prediction surface.
   For each place you anticipate a next action, prepare it silently (warm the cache, pre-fetch the route, draft the content) and leave the committing action to an explicit user gesture. If a code path acts on a prediction without a user gesture, flag it. That is the trap, not the pattern.

2. Gate on real confidence, and stay quiet below the bar.
   Predictions must carry a confidence score. Set a threshold; below it, prepare invisibly or do nothing, never surface a low-confidence guess as a recommendation. A wrong guess the user has to see and reject costs more than no guess.

3. Make a wrong prediction free.
   Pre-loaded or suggested content the user ignores must impose zero penalty: no lost state, no extra clicks to get back to what they actually wanted, no "are you sure you don't want this." Verify the unhappy path is as cheap as the happy one.

4. Show your work when a prediction shapes the UI.
   When an anticipation changes what the user sees (a reordered list, a surfaced suggestion), say briefly why ("because you watched 3 action films") and give a one-click way to dismiss or turn it down. Silent reshaping erodes trust.

5. Budget the prediction itself.
   Pre-loading has a cost (bandwidth, battery, compute). Skip low-value predictions, cap how much you speculatively fetch, and never let anticipation degrade the experience for the request the user actually made.

The trap to avoid: the silent autopilot. If a prediction commits an action the user has to detect and reverse, you have not anticipated their need, you have made a decision for them. Prepare, surface, let them commit.

When you're done, output a Markdown report with three sections:
- Surfaces updated: file path + which moves you applied at each (prepare/commit split, confidence gate, free-miss, explanation, budget)
- Surfaces flagged but not updated: file path + why (e.g. auto-executes on a guess, no confidence signal, irreversible action)
- New things you added (confidence thresholds, pre-fetch budgets, dismiss affordances, "why this" labels) and what still needs human sign-off

Ask before adding dependencies.`,
    takeaways: [
      {
        heading: "Prepare the next step. Don't take it.",
        body: "The whole pattern lives in the gap between getting ready and acting. Pre-fetch the route, draft the reply, warm the cache, then hand the commit to the user. A prediction that acts on its own isn't anticipation, it's a decision made in your name."
      },
      {
        heading: "A wrong guess must cost nothing.",
        body: "If the user can ignore your prediction and reach for what they actually wanted with no penalty, predict freely. The moment a miss costs them lost state or extra clicks to undo, your confidence bar was too low. Make the unhappy path as cheap as the happy one."
      },
      {
        heading: "Below the confidence bar, stay quiet.",
        body: "A loud wrong guess is worse than no guess: it interrupts, it has to be rejected, and it teaches the user to distrust the next one. Prepare invisibly when you're unsure. Only surface a prediction when being right is likely enough to earn the interruption."
      },
      {
        heading: "If a prediction reshapes the screen, say why.",
        body: "Reordering a list or surfacing a suggestion without explanation feels like the product moving on its own. One short reason ('because you watched 3 action films') plus a one-click way to turn it down keeps anticipation feeling like help, not manipulation."
      },
      {
        heading: "Anticipating the familiar is a filter bubble.",
        body: "Predict only what the user already does and you slowly wall them inside their own past. Leave room for the unexpected, and treat 'I never want this prediction again' as a first-class control, not a buried setting."
      }
    ]
  }
};
