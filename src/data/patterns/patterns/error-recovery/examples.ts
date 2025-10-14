import { Example } from '../../../../types';

export const examples: Example[] = [
  {
    title: "ChatGPT Capacity Error Recovery",
    description: "When servers are overloaded, ChatGPT displays clear 'at capacity' messages with options to retry, explaining the issue without losing user context. Users can wait and retry or upgrade to ChatGPT Plus for priority access during high-demand periods.",
    image: "/images/examples/chatgpt-capacity-error.png",
    altText: "ChatGPT displaying service capacity error with clear recovery options"
  },
  {
    title: "GitHub Copilot Offline Fallback",
    description: "When network connectivity fails, GitHub Copilot gracefully displays 'temporarily unreachable' status and preserves user work. The IDE continues functioning with local code completion while AI features wait for reconnection, preventing workflow disruption.",
    image: "/images/examples/github-copilot-offline.jpg",
    altText: "GitHub Copilot showing offline state and graceful degradation to local features"
  },
  {
    title: "Grammarly Error Handling",
    description: "When AI writing assistance encounters errors, Grammarly shows specific messages like 'Something went wrong' or 'Can't help with this text' with retry options. Basic grammar checking continues to work even when advanced AI features are unavailable.",
    image: "/images/examples/grammarly-error-recovery.png",
    altText: "Grammarly displaying error state with fallback to basic functionality"
  }
];
