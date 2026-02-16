import { FigmaPrompt } from '../../../../types';

export const figmaPrompt: FigmaPrompt = {
  prompt: "Design an AI agent escalation card that appears when the agent needs human input. Include: (1) Context summary showing what the agent was doing, (2) The specific question or decision needed from the user, (3) The agent's recommended action with confidence level, (4) 2-3 action buttons (Approve recommendation, Choose alternative, Provide instruction), (5) A 'Don't ask again for this type' toggle, (6) A visual indicator showing how this pause fits in the overall task progress. Style: Non-alarming, conversational. The card should feel like a helpful colleague asking a question, not an error state.",
  figmaFileUrl: undefined,
  tips: [
    "Use a warm, non-alarming color scheme  -  avoid red borders or error-state styling. This is a collaboration moment, not a failure.",
    "Show the confidence percentage next to the recommended action to help users calibrate their trust in the suggestion",
    "Include a progress bar or step indicator at the top of the card showing where in the overall task this escalation occurred",
    "Make the 'Don't ask again' toggle subtle but accessible  -  it should be discoverable without being pushy",
    "Use a card format that floats over or slides in from the side, not a modal that blocks the entire interface",
    "Consider adding a 'Skip for now' option for non-critical escalations that allows the agent to continue other tasks"
  ]
};
