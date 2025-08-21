import { Pattern } from '../../../../types';
import { codeExamples } from './code-examples';

export const multimodalinteraction: Pattern = {
  id: "multimodal-interaction",
  title: "Multimodal Interaction",
  slug: "multimodal-interaction",
  category: "Multimodal Interaction",
  description: "Combine multiple input and output modes (voice, touch, gesture, text, visual) to create more natural, accessible, and efficient user experiences.",
  thumbnail: "/images/examples/geminivoicemode.gif",
  content: {
    problem: "Single-mode interfaces limit user expression and accessibility. Users need flexible interaction methods that adapt to their context and abilities.",
    solution: "Integrate multiple interaction modes (voice, touch, text, gestures) allowing users to switch or combine them based on their preferences and situation.",
    examples: [
      {
        title: "Google Assistant Multimodal Queries",
        description: "Allows users to combine voice commands with visual elements - like saying 'show me photos of my trip to Paris' while displaying relevant images and allowing touch interactions to refine results.",
        image: "/images/examples/geminivoicemode.gif",
        altText: "Google Assistant responding to multimodal query with voice and visual elements"
      },
      {
        title: "iPad Pro with Apple Pencil",
        description: "Seamlessly combines touch, stylus input, voice commands, and visual feedback. Users can sketch, write, tap, and speak to interact with apps in ways that feel natural for different tasks.",
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
      "Allow seamless switching between voice, touch, keyboard, and other input methods",
      "Provide appropriate feedback for each interaction mode (visual, haptic, audio)",
      "Offer alternative interaction methods for accessibility and different user abilities",
      "Use contextual awareness to suggest the most appropriate interaction mode",
      "Maintain consistent patterns across modalities while respecting each mode's strengths"
    ],
    considerations: [
      "Performance and battery impact of processing multiple input streams simultaneously",
      "Privacy concerns when combining voice, camera, and sensor data",
      "Device capabilities and hardware requirements for different interaction modes",
      "Cultural differences in gesture interpretation and interaction preferences",
      "Fallback strategies when primary interaction modes fail or are unavailable"
    ],
    relatedPatterns: [
      "Conversational UI",
      "Contextual Assistance",
      "Adaptive Interfaces",
      "Progressive Disclosure"
    ]
  }
}; 