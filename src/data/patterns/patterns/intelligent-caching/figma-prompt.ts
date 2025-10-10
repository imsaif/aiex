import { FigmaPrompt } from '../../../../types';

export const figmaPrompt: FigmaPrompt = {
  prompt: "Design a smart caching interface similar to Spotify's offline downloads or Google Maps offline areas. Show AI that pre-loads content intelligently based on usage patterns. Include: main content area with seamless loading (no spinners for cached content), cached content indicator (small offline icon or badge), settings panel to configure cache preferences (storage limit, what to cache), cache status dashboard showing storage used, what's cached, and cache hit rate, smart suggestions for what to cache based on usage ('Cache your frequently used items?'), and background sync indicator when updating cached content. Style: Subtle, behind-the-scenes, efficient. Use minimal UI, subtle badges, progress indicators only when necessary. Platform: Web/mobile application, works offline.",
  figmaFileUrl: undefined,
  tips: [
    "Make caching invisible when working - show indicators only when relevant (offline mode)",
    "Use a small cloud/offline icon to show cache status without being intrusive",
    "Add a cache management screen accessible from settings for power users",
    "Show cache benefits with metrics: 'Loaded 3x faster' or 'Saved 50MB of data'",
    "For mobile: prominently show storage savings and data usage reduction",
    "Include auto-cache suggestions based on user patterns ('You often use this, cache it?')"
  ]
};
