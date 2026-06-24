import { Pattern } from '../../../../types';
import { examples } from './examples';
import { guidelines } from './guidelines';
import { considerations } from './considerations';
import { codeExamples } from './code-examples';
import { figmaPrompt } from './figma-prompt';

export const progressiveenhancement: Pattern = {
  id: "progressive-enhancement",
  title: "Progressive Enhancement",
  slug: "progressive-enhancement",
  status: 'implemented',
  description: "Provide immediate basic responses then progressively add detail and accuracy.",
  category: "Performance & Efficiency",
  tags: ["performance", "streaming", "incremental", "responsive", "speed", "enhancement"],
  thumbnail: "/api/og/patterns?slug=progressive-enhancement",
  introduction: "Progressive Enhancement provides immediate basic responses then adds detail as processing continues. Instead of waiting for perfect answers, the system streams content in real-time. It's essential for conversational AI or search where perceived speed matters. Examples include ChatGPT streaming word-by-word, Google Search showing instant results then refining, or Perplexity displaying quick answers while gathering citations.",
  datePublished: "2024-11-07",
  dateModified: "2025-11-18",
  hideFAQ: true,
  content: {
    problem: "AI systems often require significant time to generate high-quality, detailed responses. Users are left waiting with no feedback, leading to frustration and uncertainty about whether the system is working.",
    solution: "Design AI systems that provide immediate basic responses and progressively enhance them with more detail, accuracy, or sophistication. Stream content as it's generated, allowing users to consume information without waiting for complete processing.",
    examples,
    guidelines,
    considerations,
    relatedPatterns: [
      "Intelligent Caching",
      "Confidence Visualization",
      "Graceful Degradation"
    ],
    codeExamples,
    figmaPrompt,
    judgmentCall: {
      explainWhen: [
        "The first tier is a real, standalone answer the user can act on, and later tiers only add depth (more detail, citations, edge cases), never reverse the meaning.",
        "Perceived speed is the bottleneck: the full result takes long enough that a blank wait costs you the user, but a useful partial buys their patience.",
        "Enhancement can fail and the baseline still stands on its own. If the model stalls or the upstream times out, the user keeps a complete, if simpler, answer."
      ],
      dontWhen: [
        "The 'basic' tier is a teaser, not an answer. If it only makes sense once the enhancement lands, you shipped a loading state wearing a content costume.",
        "A later tier can contradict an earlier one. Streaming a wrong-then-corrected answer means the user acts on the version that was on screen, not the one you meant.",
        "The result is fast or atomic anyway. Splitting a sub-second response into tiers adds shimmer and reflow for no perceived gain."
      ],
      trap: "The hollow baseline: a first tier that looks like an answer but is really a placeholder dressed up as one, useless until the enhancement arrives. You didn't ship a working baseline and enhance it, you shipped a fancy spinner and called it progressive. It is worse than an honest loading bar because users read the hollow tier as the answer, act on it, and only the enhancement (if it ever lands) reveals it was never standalone. The whole point of the pattern, a usable thing now, quietly inverts into a usable thing later."
    },
    installPrompt: `You are implementing the Progressive Enhancement design pattern in this codebase.

The pattern in one line: ship a real, usable answer immediately, then layer depth on top, so the baseline always stands on its own even if enhancement is slow or never arrives.

Apply the following moves wherever this codebase makes a user wait on a slow or multi-stage AI result (long generations, retrieval-then-answer, multi-model pipelines, anything streamed). DO NOT apply to fast or atomic responses; tiering a sub-second result just adds shimmer and reflow for no gain.

1. Make the first tier a standalone answer, not a teaser.
   For each slow surface, define a minimal response that is complete and actionable on its own. If the basic tier only makes sense once the enhancement lands, it is a loading state, not a tier. Fix the baseline or drop the tiering.

2. Enhancements add, they never contradict.
   Later tiers may add detail, citations, or edge cases, but must not reverse the meaning of an earlier tier. If a later stage could flip the answer (yes to no, safe to unsafe), do not show the early tier as an answer. Show a labeled provisional state instead.

3. Keep the baseline alive when enhancement fails.
   Wrap each enhancement stage so a stall, timeout, or error leaves the user holding the last good tier, clearly marked complete-at-this-level. Never let a failed enhancement blank out or block the baseline the user already had.

4. Make tier and progress legible.
   Label which tier is on screen and whether more is coming (enhancing vs complete). Give the user a control to stop and keep the current tier when it is already enough. Do not let "enhancing" run invisibly or forever.

The trap to avoid: the hollow baseline. A first tier that looks like an answer but is really a placeholder, useless until enhancement arrives, is worse than an honest spinner. If your basic tier cannot stand alone, you are streaming a loading state, not enhancing.

When you're done, output a Markdown report with three sections:
- Surfaces updated: file path + which of the four moves you applied at each
- Surfaces flagged but not updated: file path + why (e.g. fast/atomic response, no standalone baseline possible, enhancement can contradict)
- New fallbacks/states you added (standalone baselines, provisional labels, fail-to-last-good-tier, stop controls) and what still needs human sign-off

Ask before adding dependencies.`,
    takeaways: [
      {
        heading: "The first tier has to be a real answer, not a teaser.",
        body: "Progressive enhancement means a usable thing now, then more. If your 'basic' tier only makes sense once the enhancement lands, you shipped a loading state in a content costume. The test: would the user be okay if enhancement never arrived? If not, it is a spinner."
      },
      {
        heading: "Enhancements add depth, they never reverse meaning.",
        body: "Layering more detail, citations, or nuance on a standing answer is enhancement. Streaming yes and then correcting to no is a bug the user already acted on. If a later stage can flip the answer, don't render the early one as an answer, label it provisional."
      },
      {
        heading: "The baseline must survive a failed enhancement.",
        body: "The payoff of the pattern is resilience: when the model stalls or the upstream times out, the user still holds a complete, simpler answer. If a broken enhancement can blank out or block the baseline, you built a dependency and called it a layer."
      },
      {
        heading: "Speed is the only reason to tier. Respect it.",
        body: "You split a response into stages to trade a blank wait for a useful partial. If the result is already fast or atomic, tiering just buys shimmer and reflow. Tier where the wait is real, and nowhere else."
      },
      {
        heading: "Say which tier the user is looking at.",
        body: "An unlabeled stream leaves people unsure whether the answer is done or still cooking, so they either wait too long or act too early. Mark the current tier, signal when more is coming, and give them a way to stop at 'good enough.'"
      }
    ]
  }
};
