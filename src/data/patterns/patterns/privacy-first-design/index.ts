import { Pattern } from '../../../../types';
import { examples } from './examples';
import { guidelines } from './guidelines';
import { considerations } from './considerations';
import { codeExamples } from './code-examples';
import { figmaPrompt } from './figma-prompt';

export const privacyfirstdesign: Pattern = {
  id: "privacy-first-design",
  title: "Privacy-First Design",
  slug: "privacy-first-design",
  status: 'implemented',
  description: "Minimize data collection and provide transparent privacy controls.",
  category: "Privacy & Control",
  tags: ["privacy", "data protection", "transparency", "control", "security", "consent"],
  thumbnail: "/images/examples/privacyfirst-apple.webp",
  introduction: "Privacy-First Design prioritizes user privacy by minimizing data collection, processing locally when possible, and providing transparent controls. Instead of collecting everything by default, the system asks for consent and gives users granular control. It's critical for personal assistants, health apps, or systems handling sensitive data. Examples include Apple's on-device Siri, DuckDuckGo's private search, or Signal's encrypted AI features.",
  datePublished: "2024-11-07",
  dateModified: "2026-06-23",
  hideFAQ: true,
  content: {
    problem: "Users are increasingly concerned about AI systems collecting and using their data without clear consent or understanding. Opaque data practices erode trust and create privacy risks, while overly restrictive privacy settings can break functionality.",
    solution: "Design AI systems with privacy as the default, processing data locally when possible, providing granular controls with clear explanations of what each setting means, and making privacy-functionality trade-offs transparent so users can make informed decisions.",
    examples,
    guidelines,
    considerations,
    relatedPatterns: [
      "Selective Memory",
      "Explainable AI",
      "Responsible AI Design"
    ],
    codeExamples,
    figmaPrompt,
    judgmentCall: {
      explainWhen: [
        "You can deliver the feature while collecting less: process on-device, keep raw inputs ephemeral, or store a derived signal instead of the source. Minimization is the product decision, not a settings page.",
        "The data is sensitive and the stakes of a leak are real (health, location, messages, minors), so the safe default has to be collect-nothing until the user opts in for a concrete benefit.",
        "The user can see and reverse the trade-off: turning a feature off actually deletes the data behind it, and the change takes effect immediately, not 'within 30 days.'"
      ],
      dontWhen: [
        "You are adding privacy controls instead of collecting less. A toggle panel moves the work onto the user and lets you keep the firehose default; the right fix is upstream, in what you ingest.",
        "The 'control' is cosmetic: pre-checked by default, buried three screens deep, or it pauses display while collection continues underneath. That is not consent, it is choreography.",
        "Turning a setting off leaves the already-collected data sitting on your servers. An off switch that doesn't delete is a pause button mislabeled as privacy."
      ],
      trap: "The privacy alibi: an elaborate, beautifully designed consent and settings panel bolted on top of a collect-everything default. Every toggle, data-flow diagram, and 'your data, your choice' badge is real, and the real default is still harvest-all. It is worse than shipping no privacy UI, because the controls launder the collection: the user feels in control while you keep the data, and the panel becomes the evidence you cite when challenged. Privacy is what you don't collect, not what you let the user switch off afterward."
    },
    installPrompt: `You are implementing the Privacy-First Design pattern in this codebase.

The pattern in one line: collect less by default, and make any setting that lets the user keep collecting actually delete the data when they turn it off.

Apply the following moves wherever this codebase collects, stores, or transmits user data for an AI feature. DO NOT respond by adding a new settings panel on top of an unchanged collect-everything default. A toggle the user has to find is not privacy; minimizing what you ingest is.

1. Cut collection at the source first.
   For each data flow you find, ask what the feature actually needs. Replace raw inputs with derived signals where possible, prefer on-device processing, and make the storing of sensitive raw data the exception you justify, not the default. Flag every flow you could not minimize and say why.

2. Make off mean deleted.
   For every privacy setting that gates collection, wire the OFF state to delete the data already collected for that setting, not just stop future writes. If deletion cannot be immediate, surface the real timeline. Never leave a switch that pauses display while collection continues.

3. No dark defaults.
   Audit every consent control: nothing data-hungry may be pre-checked, and the privacy-protective choice is the default. Move any privacy control buried more than one click deep up to where the data is actually used.

4. Make the trade-off legible at the toggle.
   Each control states, in plain language, what stops working when it is off and what data it uses when on. No abstract 'improve your experience.' If you cannot name the concrete benefit, the collection is not justified, so remove it.

The trap to avoid: the privacy alibi. A gorgeous consent panel on top of a harvest-all default launders the collection and is worse than no panel. If your change only adds toggles and collects exactly as much as before, you have built the trap.

When you're done, output a Markdown report with three sections:
- Surfaces updated: file path + which of the four moves you applied at each
- Surfaces flagged but not updated: file path + why (e.g. collection required, deletion cannot be immediate, no on-device path)
- New data fields, deletion jobs, or defaults you changed (e.g. on/off-to-delete wiring, flipped defaults) and what still needs human sign-off

Ask before adding dependencies.`,
    takeaways: [
      {
        heading: "Privacy is what you don't collect, not what you let users switch off.",
        body: "The strongest privacy move is upstream: never ingest the data in the first place. A settings page is a fallback for the little that remains, not the strategy. If your privacy work is all toggles and no minimization, you have shipped the trap."
      },
      {
        heading: "Default to collect-nothing, then earn each field.",
        body: "Opt-in beats opt-out, and a privacy-protective default beats a pre-checked box every time. Every piece of data you turn on by default is a decision you made for the user. Make them opt in for a benefit they can name."
      },
      {
        heading: "Off has to mean deleted.",
        body: "A switch that stops future collection but leaves the existing data on your servers is a pause button wearing a privacy label. When a user turns a feature off, the data behind it should go with it, immediately, and if it can't, say so honestly."
      },
      {
        heading: "Process on the device whenever the feature allows it.",
        body: "Data that never leaves the user's machine can't leak, can't be subpoenaed, and can't be repurposed later. On-device is slower for heavy tasks, so reserve the cloud for what genuinely needs it and make that boundary visible, not implied."
      },
      {
        heading: "Name the trade-off at the control, in plain language.",
        body: "'Improve your experience' is not consent, it is cover. State what stops working when a setting is off and exactly what data it uses when on. If you can't name a concrete benefit for collecting something, that's your answer: don't collect it."
      }
    ]
  }
};
