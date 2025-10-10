import { FigmaPrompt } from '../../../../types';

export const figmaPrompt: FigmaPrompt = {
  prompt: "Design an ambient intelligence interface similar to Google Nest or Apple HomeKit, showing AI that works quietly in the background. Show a dashboard with subtle indicators and automatic adjustments. Include: ambient status display with minimal visual elements (small badges, soft glows), environmental sensors visualization (temperature, motion, light), automatic action history showing what AI changed without user input, contextual cards that appear only when relevant, quiet notification system (no intrusive alerts), and manual override controls that appear on hover. Style: Minimal, calm, unobtrusive. Use soft colors, subtle animations, lots of white space. Avoid bright alerts unless critical. Platform: Web/mobile app, works on tablets and smart displays.",
  figmaFileUrl: undefined,
  tips: [
    "Design for minimal attention - users should glance and understand in 2 seconds",
    "Use subtle visual cues like glowing dots or soft color shifts instead of notifications",
    "Show AI actions transparently but quietly in a log or timeline",
    "Make manual controls hidden by default but easy to access when needed",
    "For mobile: design for one-handed use, place critical info in thumb-reach zone",
    "Use progressive disclosure: show summary by default, details on tap"
  ]
};
