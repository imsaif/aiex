import { FigmaPrompt } from '../../../../types';

export const figmaPrompt: FigmaPrompt = {
  prompt: "Design a workspace-native AI agent integration for a code editor or design tool. Show the agent appearing inline—anchored to a text selection or canvas element—with a compact input field, streaming response area, and Apply/Dismiss actions. Include states for: idle (subtle entry point in toolbar/context menu), active (inline popover open with context shown), streaming response, and applied result with provenance marker. Use the host application's visual language throughout. Show how the agent entry point appears in the command palette and right-click menu.",
  figmaFileUrl: undefined,
  tips: [
  "Design the inline popover to be anchored and directional—it should appear adjacent to the selection, not centered on screen, to reinforce spatial connection to the work.",
  "Use the host application's existing type scale, color tokens, and icon style for all agent UI. The agent should look like it was always part of the tool.",
  "Show the 'workspace context' the agent is using as a subtle, collapsible element in the popover—this builds trust and lets users correct the scope before submitting.",
  "Design the Apply button as a primary action and Dismiss as a ghost/text button to make the desired flow obvious without being pushy.",
  "Include a provenance state—a subtle highlight, badge, or annotation—on content that was written by the agent, so users can distinguish their own work from AI output at a glance.",
  "Prototype the streaming response state: text should appear to type in progressively, and the Apply button should only become active once the response is complete."
],
};
