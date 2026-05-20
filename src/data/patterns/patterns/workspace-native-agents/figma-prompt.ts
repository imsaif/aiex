import { FigmaPrompt } from '../../../../types';

export const figmaPrompt: FigmaPrompt = {
  prompt: "Design a workspace-native AI agent component for a document editor. Show the agent triggered by text selection, with an inline action toolbar appearing adjacent to the selection. Include an output state where suggested text appears inline with accept and dismiss controls. No separate panels or modal overlays.",
  figmaFileUrl: undefined,
  tips: [
  "Use a popover anchored to the selection, not a fixed sidebar, to keep agent output contextual.",
  "Limit inline toolbar to 3-4 actions max, more choices increase decision cost at trigger point.",
  "Show agent output in a visually distinct but inline style: subtle background, same font, same column.",
  "Design the dismiss interaction first, it signals how interruptive the agent actually is.",
  "Test at 80% zoom to catch layout collisions between inline output and existing UI chrome."
],
};
