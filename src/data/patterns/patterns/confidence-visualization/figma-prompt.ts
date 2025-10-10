import { FigmaPrompt } from '../../../../types';

export const figmaPrompt: FigmaPrompt = {
  prompt: "Design a confidence indicator interface similar to Grammarly's suggestion confidence or weather app precipitation percentages. Show AI recommendations with clear confidence levels. Include: main recommendation card or suggestion, visual confidence indicator (progress bar, percentage badge, or color-coded icon), tooltip explaining what confidence means, alternative suggestions with lower confidence displayed below, explanation of factors affecting confidence, and threshold indicator showing 'High confidence' (>80%), 'Medium' (50-80%), 'Low' (<50%). Style: Clear, data-driven, trustworthy. Use color gradients (green for high, amber for medium, red for low confidence), clean typography, data visualization elements. Platform: Web application, responsive.",
  figmaFileUrl: undefined,
  tips: [
    "Use multiple visual cues for confidence: color, percentage, and icon to reinforce the message",
    "Make high confidence suggestions more prominent visually (bolder, larger)",
    "Add a 'Why this confidence?' tooltip or expandable section for transparency",
    "Show confidence calibration over time ('Usually 85% accurate')",
    "For mobile: use a horizontal confidence bar that's easy to scan at a glance",
    "Consider using emojis or icons to make confidence levels more approachable (😊 for high, 😐 for medium, 😕 for low)"
  ]
};
