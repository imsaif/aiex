import { FigmaPrompt } from '../../../../types';

export const figmaPrompt: FigmaPrompt = {
  prompt: "Design a progressive enhancement interface similar to image loading on Pinterest or video quality adaptation on YouTube. Show content that starts basic and enhances progressively. Include: initial basic content view (low-res placeholder, skeleton screens), enhancement indicator showing content is upgrading (subtle shimmer or progress), toggle to control enhancement level (Basic/Standard/Enhanced), bandwidth/capability indicator explaining why certain level is selected, settings to prefer speed vs quality, and graceful fallback messaging when enhancement isn't available ('Showing basic version - enhance available on WiFi'). Style: Smooth, adaptive, quality-conscious. Use skeleton screens, smooth transitions between quality levels, clear quality badges. Platform: Web/mobile application, adaptive.",
  figmaFileUrl: undefined,
  tips: [
    "Start with functional content immediately - enhance later rather than blocking users",
    "Use skeleton screens or low-res placeholders that match the final content layout",
    "Add subtle visual indicators when content is enhancing (shimmer, fade-in)",
    "Show quality levels as user choices: 'Fast', 'Balanced', 'Best Quality'",
    "For mobile: default to data-saving mode on cellular, enhance on WiFi automatically",
    "Include a manual 'Enhance Now' button for users who want full quality immediately"
  ]
};
