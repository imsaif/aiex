import { FigmaPrompt } from '../../../../types';

export const figmaPrompt: FigmaPrompt = {
  prompt: "Design a feedback collection interface similar to Spotify's thumbs up/down or YouTube's recommendation feedback. Show easy ways for users to rate AI suggestions. Include: AI suggestion or output card, quick feedback buttons (thumbs up/down, star rating, or emoji reactions), optional detailed feedback form (expandable), visual confirmation when feedback is submitted ('Thanks! This helps us improve'), feedback impact indicator showing how user feedback improved the system, and settings to view past feedback history. Style: Friendly, encouraging, low-friction. Use cheerful colors, smooth animations on feedback submission, celebratory micro-interactions. Platform: Web/mobile application.",
  figmaFileUrl: undefined,
  tips: [
    "Make feedback buttons large and easy to tap - place them prominently near AI outputs",
    "Use a progressive approach: quick feedback (thumbs) first, detailed feedback optional",
    "Show immediate visual feedback when user rates something (animation, color change)",
    "Add a 'Tell us more' option that expands only when users want to elaborate",
    "For mobile: use swipe gestures for quick feedback (swipe right = good, left = bad)",
    "Periodically show users how their feedback improved the AI to encourage continued engagement"
  ]
};
