import { FigmaPrompt } from '../../../../types';

export const figmaPrompt: FigmaPrompt = {
  prompt: "Design a predictive interface similar to Gmail Smart Reply or Tesla Autopilot, showing AI anticipating user needs. Show proactive suggestions that appear before being asked. Include: main content area with user's current task, predictive suggestion cards appearing at relevant moments (subtle slide-in animation), confidence indicators for each prediction (percentage or visual bars), quick action buttons to accept/dismiss predictions, context panel showing why AI made this prediction, and learning feedback mechanism ('Was this helpful?'). Style: Smart, helpful, not pushy. Use soft blues/purples for AI predictions, smooth animations (300-400ms), ghost buttons for low-confidence suggestions. Platform: Web application, mobile-friendly.",
  figmaFileUrl: undefined,
  tips: [
    "Time the appearance of predictions carefully - not too early, not too late",
    "Show confidence levels visually (solid vs dashed borders, opacity levels)",
    "Make it easy to dismiss predictions with one tap/click without penalty",
    "Add a 'Show me less' option if users find predictions intrusive",
    "For mobile: use swipe gestures for quick accept/dismiss of predictions",
    "Include a settings panel to adjust prediction frequency and types"
  ]
};
