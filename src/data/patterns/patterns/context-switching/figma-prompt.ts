import { FigmaPrompt } from '../../../../types';

export const figmaPrompt: FigmaPrompt = {
  prompt: "Design a context-switching interface similar to Slack's workspace switcher or browser tab management with session restore. Show seamless transitions between different AI contexts or tasks. Include: context carousel or sidebar showing active contexts with thumbnails, quick-switch panel with keyboard shortcuts (Cmd+K style), each context card showing task name, last activity timestamp, and preview thumbnail, auto-save indicator showing context is preserved, visual transition animation when switching (slide/fade), and 'Resume where you left off' messaging. Style: Organized, efficient, minimal cognitive load. Use clear visual separation between contexts, smooth animations (200-300ms), consistent iconography. Platform: Web application, keyboard-friendly.",
  figmaFileUrl: undefined,
  tips: [
    "Show clear visual cues for which context is currently active (bold border, highlight color)",
    "Display recent activity in each context so users know where they left off",
    "Add keyboard shortcuts prominently (show on hover or in a shortcuts panel)",
    "Use thumbnails or icons to make contexts visually scannable at a glance",
    "For mobile: use horizontal swipe gestures to switch between contexts smoothly",
    "Include a 'Close context' option but confirm before discarding unsaved work"
  ]
};
