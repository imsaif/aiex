import { FigmaPrompt } from '../../../../types';

export const figmaPrompt: FigmaPrompt = {
  prompt: "Design a human handoff interface similar to chatbot-to-agent transitions or automated support escalation. Show smooth transition from AI to human assistance. Include: AI conversation or task interface, clear indicator that handoff is needed ('Let me connect you with a specialist'), progress indicator showing handoff status (Preparing handoff → Finding specialist → Connected), context summary showing what information will be shared with human, estimated wait time display, option to continue with AI while waiting, and seamless transition screen when human takes over. Style: Smooth, reassuring, professional. Use calming animations, clear status updates, human imagery when appropriate. Platform: Web application, live chat interface.",
  figmaFileUrl: undefined,
  tips: [
    "Make the transition seamless - preserve chat history and context visually",
    "Show a friendly 'handshake' animation or transition effect between AI and human",
    "Display what context is being shared with the human agent for transparency",
    "Add a 'Why am I being transferred?' explanation to manage expectations",
    "For mobile: use a slide-up transition to indicate moving from AI to human assistance",
    "Include a 'Return to AI' option if the wait time is too long and user wants to try AI again"
  ]
};
