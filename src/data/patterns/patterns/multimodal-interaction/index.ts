import { Pattern } from '../../../../types';
import { codeExamples } from './code-examples';

export const multimodalinteraction: Pattern = {
  id: "multimodal-interaction",
  title: "Multimodal Interaction",
  slug: "multimodal-interaction",
  category: "Natural Interaction",
  description: "Combine voice, touch, gesture, text, and visual input for natural interaction.",
  thumbnail: "/images/examples/geminivoicemode.gif",
  introduction: "Multimodal Interaction lets users communicate through voice, touch, gestures, text, and visual input, switching seamlessly by context. Instead of one input method, the system adapts to how users naturally interact. It's essential for accessibility, mobile devices, or environments where certain inputs aren't practical. Examples include Google Assistant combining voice and touch, iPad Pro blending Pencil and voice, or Tesla mixing voice, touch, and automatic responses.",
  datePublished: "2024-01-15",
  dateModified: "2025-11-18",
  hideFAQ: true,
  content: {
    skillDescription:
      "Use when one input mode is not enough: combining voice, touch, text, images, or gesture, 'talk or type or point', accessibility through alternate modes, camera plus chat. Multimodal Interaction lets people interact the way the moment demands.",
    problem: "Single-mode interfaces limit user expression and accessibility. Users need flexible interaction methods that adapt to context and abilities.",
    solution: "Integrate multiple interaction modes (voice, touch, text, gestures), allowing users to switch or combine them based on preferences and situation.",
    examples: [
      {
        title: "Google Assistant Multimodal Queries",
        description: "Combines voice commands with visual elements (e.g., 'show me photos of my trip to Paris') displaying relevant images and allowing touch to refine results.",
        image: "/images/examples/geminivoicemode.gif",
        altText: "Google Assistant responding to multimodal query with voice and visual elements"
      },
      {
        title: "iPad Pro with Apple Pencil",
        description: "Seamlessly combines touch, stylus, voice, and visual feedback. Users can sketch, write, tap, and speak to interact with apps naturally for different tasks.",
        image: "/images/examples/applepencil.gif",
        altText: "iPad Pro multimodal interaction with touch, pencil, and voice"
      },
      {
        title: "Tesla Model S Interface",
        description: "Integrates voice commands, touch controls, steering wheel buttons, and automatic responses based on driver behavior and environmental context for a comprehensive driving experience.",
        image: "/images/examples/tesladashboard.gif",
        altText: "Tesla multimodal car interface combining voice, touch, and contextual automation"
      }
    ],
    codeExamples,
    guidelines: [
      "Allow seamless switching between voice, touch, keyboard, and other input methods.",
      "Provide appropriate feedback for each interaction mode (visual, haptic, audio).",
      "Offer alternative interaction methods for accessibility and diverse user abilities.",
      "Use contextual awareness to suggest the most appropriate interaction mode.",
      "Maintain consistent patterns across modalities while respecting each mode's strengths."
    ],
    considerations: [
      "Consider performance and battery impact of processing multiple input streams.",
      "Address privacy concerns when combining voice, camera, and sensor data.",
      "Account for device capabilities and hardware requirements for different interaction modes.",
      "Consider cultural differences in gesture interpretation and interaction preferences.",
      "Plan fallback strategies when primary interaction modes fail or are unavailable."
    ],
    relatedPatterns: [
      "Conversational UI",
      "Contextual Assistance",
      "Adaptive Interfaces",
      "Progressive Disclosure"
    ],
    figmaPrompt: {
      prompt: `Design a multimodal interface that seamlessly combines voice, touch, and visual interactions:

Create an interaction screen showing:
1. **Voice Input**: Microphone button with visual feedback (sound waves, listening state)
2. **Touch Controls**: Interactive elements that respond to taps, swipes, and gestures
3. **Text Input**: Keyboard option as an alternative to voice
4. **Visual Output**: Results displayed in scannable format (cards, lists, images)
5. **Mode Indicators**: Clear visual cues showing which input mode is active

Show how users can combine modes (e.g., "Show me [touch image] similar to this"). Include accessibility alternatives for each interaction mode.`,
      tips: [
        "Provide visual feedback for voice input (waveforms, listening indicator)",
        "Allow seamless switching between input modes",
        "Show multiple output formats (visual + audio + text)",
        "Include gesture guides for touch interactions",
        "Provide keyboard shortcuts as alternatives"
      ]
    },
    judgmentCall: {
      explainWhen: [
        "The context decides the best input, and it changes mid-task: voice while driving, touch on a phone, keyboard at a desk. Let the user move with the context instead of locking them to one mode.",
        "Each modality does something the others cannot do as well: point at a thing with touch, then refine it with voice (\"more like this, but cheaper\"). The modes combine, they do not just duplicate.",
        "Accessibility demands an alternative path: a user who cannot see the screen, cannot use a mouse, or cannot speak still needs a complete route through the task."
      ],
      dontWhen: [
        "The second modality is strictly worse than the first for the context the user is actually in. A voice button in an open office is slower, louder, and more error-prone than the keyboard already in front of them.",
        "You are adding a mode for the demo reel, not the user: the gesture control that wows once and is never touched again. Novelty is not fit.",
        "You force one modality where the situation rejects it: voice-only in a quiet library, touch-only on a stove-side display covered in flour. If the user cannot switch back out, you have built a trap, not a choice."
      ],
      trap: "The bolt-on modality: a prominent voice or gesture input wired up next to the real one, slower and flakier than typing, useless in the open-plan office or noisy car the user is actually sitting in. It looks like richness in a screenshot. In the wild it is a button nobody taps twice, a promise the product cannot keep, and a second input path you now have to maintain forever. A worse mode added for show is worse than no second mode at all."
    },
    installPrompt: `You are implementing the Multimodal Interaction design pattern in this codebase.

The pattern in one line: let users move between voice, touch, gesture, and text by context, where each mode earns its place and none is forced.

Apply the following moves wherever this codebase offers, or could offer, more than one input modality (search, command entry, content capture, navigation). DO NOT bolt a second modality onto a surface where it would be strictly worse than the existing one for the user's real context; a voice button in an office is friction, not richness.

1. Justify every modality against the context it runs in.
   For each surface, write down the context the user is actually in (hands busy, screen-off, public, noisy, on a phone). Keep only the modalities that beat the alternatives in that context. If a mode is slower and flakier than what is already there, cut it or flag it. Do not keep a mode just because it demos well.

2. Make modalities combine, not just duplicate.
   Where two modes coexist, design at least one interaction that uses both (point/select with touch, refine with voice; type a query, narrow it by gesture). If every mode is just another route to the identical result, you have redundancy, not multimodality.

3. Always allow a clean switch back.
   Every modality must have a visible, one-action exit to another mode. Never trap the user in voice-only or gesture-only with no fallback. Persist in-progress input across the switch so changing modes never discards what they have done.

4. Give every mode honest feedback and an accessible alternative.
   Each modality needs its own confirmation (visual for touch, audio or haptic for voice) and a complete alternative path for users who cannot use it. If any single task can only be completed in one modality, that is an accessibility gap to flag, not ship.

The trap to avoid: the bolt-on modality. A worse, context-blind input added for the screenshot is worse than no second mode at all. If a modality does not beat the alternatives where the user actually is, do not ship it.

When you're done, output a Markdown report with three sections:
- Surfaces updated: file path + which modalities you kept, how they combine, and the switch-back affordance at each
- Surfaces flagged but not updated: file path + why (e.g. bolt-on with no context fit, single-modality task with an accessibility gap, no real combine case)
- New input handlers / fallbacks / accessibility paths you added and what still needs human sign-off

Ask before adding dependencies.`,
    takeaways: [
      {
        heading: "Multimodal means context fit, not a longer toolbar.",
        body: "The win is letting the user move with their situation: voice when their hands are full, touch on a phone, keyboard at a desk. More input buttons is not the goal. The right mode for the moment is."
      },
      {
        heading: "A modality has to beat the alternatives where the user actually is.",
        body: "A voice button in an open office is slower and louder than the keyboard already in front of them. If a mode loses to what is already there for the real context, it is dead weight. Cut it."
      },
      {
        heading: "Make the modes combine, not duplicate.",
        body: "Point at a thing with touch, then refine it with voice beats two separate paths to the same query. If every modality just reaches the identical result a different way, you built redundancy and called it richness."
      },
      {
        heading: "Never trap a user in one mode.",
        body: "Every modality needs a visible, one-action way back out, and switching should never discard work in progress. Voice-only with no fallback in a place you cannot speak is not a feature, it is a corner the user is stuck in."
      },
      {
        heading: "The bolt-on modality is worse than no second mode at all.",
        body: "The gesture control that wows once and is never touched again costs you maintenance, sets a promise the product cannot keep, and clutters the interface. Novelty is not fit. Ship the mode the context needs, not the one that looks good in a screenshot."
      }
    ]
  }
};
