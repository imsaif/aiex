import { FigmaPrompt } from '../../../../types';

export const figmaPrompt: FigmaPrompt = {
  prompt: "Design a collaborative document interface where a human and AI agent work simultaneously. Include: (1) Two distinct cursors or indicators showing human (blue) and agent (purple) active zones, (2) Parallel editing zones with subtle background tinting to show who is working where, (3) A handoff button that lets the user pass control of a section to the agent, (4) An inline conflict resolution panel when human and agent edits overlap, (5) A non-intrusive agent activity indicator showing what the agent is currently doing. Style: Minimal, focused on the content with subtle collaboration indicators. The editing experience should feel natural, not cluttered with collaboration UI.",
  figmaFileUrl: undefined,
  tips: [
    "Use very subtle background tints (not borders or outlines) to show human vs. agent zones  -  the content should feel unified",
    "Place the agent activity indicator in the margin or gutter, not inline with the text",
    "Show the handoff button as a floating action that appears on hover in the margin of each section",
    "Design the conflict resolution as a slim inline banner, not a modal  -  users should resolve conflicts without leaving the editing flow",
    "Consider a 'ghost cursor' for the agent that moves through the document showing where it's working, similar to Google Docs collaborator cursors",
    "Add a toggle to show/hide attribution markers for who wrote each section"
  ]
};
