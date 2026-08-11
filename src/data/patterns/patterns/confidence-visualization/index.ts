import { Pattern } from '../../../../types';
import { examples } from './examples';
import { guidelines } from './guidelines';
import { considerations } from './considerations';
import { codeExamples } from './code-examples';
import { figmaPrompt } from './figma-prompt';

export const confidencevisualization: Pattern = {
  id: "confidence-visualization",
  title: "Confidence Visualization",
  slug: "confidence-visualization",
  status: 'implemented',
  description: "Display AI certainty levels through visual indicators, helping users understand prediction reliability and decide when to trust or verify outputs.",
  category: "Trustworthy & Reliable AI",
  tags: ["confidence", "transparency", "certainty", "visual indicators", "trust", "reliability"],
  thumbnail: "/images/examples/confidence-visualization.png",
  introduction: "Confidence Visualization is an AI design pattern that shows how certain the AI is about its predictions using visual indicators like progress bars, percentages, or color coding. Instead of presenting all AI outputs as equally reliable, this pattern helps users quickly gauge whether to trust a prediction or double-check it. It's essential for high-stakes decisions where incorrect AI outputs have consequences, medical or financial AI systems, or any tool where users need to know when to verify results. Examples include weather apps showing prediction confidence, translation tools indicating certainty levels, or spam filters displaying probability scores so you can decide whether to check the folder.",
  datePublished: "2024-01-15",
  dateModified: "2025-11-18",
  hideFAQ: true,
  content: {
    skillDescription:
      "Use when users need to know how sure the AI is: confidence scores, uncertainty indicators, 'should I trust this answer', flagging low-certainty output, deciding when to verify. Confidence Visualization shows reliability so trust is calibrated.",
    problem: "Users don't know how much to trust AI predictions, leading to over-reliance on incorrect outputs or unnecessary verification.",
    solution: "Design visual indicators that communicate AI confidence levels. Use intuitive representations like progress bars, color coding, or percentages to help users gauge reliability.",
    examples,
    guidelines,
    considerations,
    relatedPatterns: [
      "Explainable AI",
      "Transparent Feedback",
      "Error Recovery & Graceful Degradation",
      "Trust Calibration"
    ],
    codeExamples,
    figmaPrompt,
    judgmentCall: {
      explainWhen: [
        "The user faces a real decision whose cost changes with reliability: act now versus stop and verify. A confidence signal that changes what they do earns its place.",
        "The model's confidence is actually calibrated, meaning '80%' corresponds to being right roughly 80% of the time. The number must map to reality.",
        "Outputs vary meaningfully in reliability case to case, so a single flat trust level would mislead."
      ],
      dontWhen: [
        "The score isn't calibrated. A made-up 87% is worse than nothing: it manufactures trust and shatters the first time a high-confidence answer is wrong.",
        "The user can't act differently on it: no verify path, no alternative. Then the indicator is decoration that just transfers anxiety.",
        "Confidence is uniformly high or the stakes are trivial. A badge on every output becomes wallpaper users stop seeing."
      ],
      trap: "The decorative percentage. A precise-looking '92%' that isn't backed by real calibration reads as rigor but is theater, and it's worse than showing nothing: users calibrate their trust to it and get burned the first time a confident answer is wrong. Precision implies an accuracy you may not have."
    },
    installPrompt: `You are implementing the Confidence Visualization design pattern in this codebase.

The pattern in one line: show how sure the AI is, but only when the number is real and the user can act on it.

Apply the following moves wherever this codebase renders an AI prediction, score, classification, or recommendation. DO NOT badge outputs that are uniformly high-confidence or low-stakes. There, a confidence indicator is noise.

1. Verify calibration before you render a single number.
   Confirm the model's confidence score is calibrated against actual outcomes (a 0.8 is correct ~80% of the time). If you cannot verify calibration, DO NOT render a numeric percentage. Fall back to coarse buckets (high/medium/low) or show nothing. Never surface an uncalibrated number as if it were precise.

2. Bind every confidence level to an action.
   For each surface, define what the user does at high, medium, and low confidence (proceed, verify, choose an alternative). If low confidence leads to no verify path or alternative, add one or remove the indicator. Confidence with no consequence is decoration.

3. Round to actionable resolution.
   Replace raw floats with buckets or rounded bands matched to the decision. Strip false precision: no "92.4%". Humans can't act on a tenth of a percent, and it implies accuracy you don't have.

4. Explain low confidence, don't just color it red.
   When confidence is low, render a short reason and a next step ("Unsure because the source is ambiguous, verify here"), not just a red bar. Visibility without guidance transfers anxiety instead of resolving it.

5. Suppress where it doesn't vary.
   Only render the indicator on surfaces where reliability genuinely varies and the stakes warrant it. Do not put a confidence chip on every output.

The trap to avoid: the decorative percentage. If you can't stand behind the number as calibrated, show a bucket or nothing. A false-precise score is worse than honest silence.

When you're done, output a Markdown report with three sections:
- Surfaces updated: file path + which of the five moves you applied at each
- Surfaces flagged but not updated: file path + why (e.g. uncalibrated score, no user action, uniformly confident)
- New data/actions you added (calibration check, verify paths, bucket mapping, low-confidence reasons) and what still needs human sign-off

Ask before adding dependencies.`,
    takeaways: [
      {
        heading: "Only show confidence the model actually has.",
        body: "A calibrated 70% is gold; a fabricated 92% is a liability. If '80%' doesn't mean right-80%-of-the-time, you aren't visualizing confidence, you're decorating uncertainty with false precision, and users will trust it right up until it burns them."
      },
      {
        heading: "Tie the signal to an action.",
        body: "Confidence should change what the user does: trust it, verify it, or pick an alternative. If nothing changes at any level, the indicator is decoration. Always pair low confidence with a concrete way to check."
      },
      {
        heading: "Round to the resolution people can act on.",
        body: "'92.4%' implies a precision you don't have and a human can't use. Buckets (high / medium / low, or 'likely / uncertain') usually beat a false-precise number. Match the granularity to the size of the decision, not to what the model happens to emit."
      },
      {
        heading: "Make low confidence legible, not just visible.",
        body: "A red bar says 'be careful' but not why or what to do. The most useful uncertainty UI says 'I'm unsure because X, here's how to check.' Visibility without guidance just hands the user anxiety and no exit."
      },
      {
        heading: "Don't badge everything.",
        body: "If most outputs are high-confidence, a chip on each one becomes wallpaper people stop seeing. Surface the signal where reliability actually varies and matters; stay quiet where it doesn't, so the indicator keeps its meaning."
      }
    ]
  }
};
