import { FigmaPrompt } from '../../../../types';

export const figmaPrompt: FigmaPrompt = {
  prompt: "Design an agent learning indicator component. Include a correction acknowledgement state that names the specific behavior change, a session summary card capped at three learned items, a toggle to mark corrections as permanent or one-time, and an editable learning history panel. Use subtle, non-intrusive visual weight.",
  figmaFileUrl: undefined,
  tips: [
  "Use a distinct but low-contrast chip or tag to mark 'learned' states near affected actions.",
  "Session summary cards should cap at 3 lines, add a 'see all' link, never expand inline.",
  "Permanent vs. one-time corrections need a clear visual distinction: icon or label, not just color.",
  "Editable history items need a delete affordance visible on hover, not buried in overflow menus.",
  "Correction confirmations should appear inline, not as a toast that disappears before users read it."
],
};
