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
  content: {
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
    }
  }
};
