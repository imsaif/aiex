import { FigmaPrompt } from '../../../../types';

export const figmaPrompt: FigmaPrompt = {
  prompt: "Design an error recovery interface similar to Stripe's error handling or Gmail's offline mode. Show a friendly error state with recovery options. Include: clear error message with friendly icon (not alarming), plain-language explanation of what happened, 2-3 suggested action buttons (Retry, Use Basic Version, Contact Support), 'What we saved' indicator showing preserved work, progress bar if partial results are available, and option to export/download partial data. Style: Calm, helpful, not punishing. Use warm colors (amber/yellow for warnings, green for saved items), friendly illustrations. Platform: Web application, works offline.",
  figmaFileUrl: undefined,
  tips: [
    "Focus on what users can do, not what went wrong",
    "Show what was preserved to reduce anxiety",
    "Make primary action button the most likely fix",
    "Use illustrations or icons to soften the error experience",
    "For mobile: ensure error doesn't block critical actions",
    "Add a 'Learn more' link for technical details without cluttering main message"
  ]
};
