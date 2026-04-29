import { Example } from '../../../../types';

export const examples: Example[] = [
  {
    title: "GitHub Copilot - Acceptance-Calibrated Suggestions",
    description: "Initial Copilot suggestions stay conservative and well-established. As the developer accepts more inline completions, suggestions grow longer and more opinionated — calibrated to a working trust level inferred from acceptance rate. Rejecting suggestions for similar contexts pulls confidence back down.",
    image: "/images/examples/github-copilot-highlighting.gif",
    altText: "GitHub Copilot showing progression from short conservative completions to longer opinionated suggestions as acceptance rate rises"
  },
  {
    title: "ChatGPT Memory - Trust Built Through Retained Context",
    description: "ChatGPT's Memory feature accumulates user preferences and corrections across sessions. Early answers stay cautious because context is thin; as the model retains more about the user's domain and tone, replies become more direct and assume less. Users can audit and remove memories, recalibrating trust manually.",
    image: "/images/examples/chatgpt-memory.gif",
    altText: "ChatGPT showing retained memory entries growing across conversations and answers becoming more confident as context accumulates"
  },
  {
    title: "Notion AI - Adaptive Suggestion Confidence",
    description: "Notion AI begins with conservative one-line suggestions in unfamiliar workspaces. As the user accepts inline edits and asks for longer-form rewrites, the AI's suggestion length and stylistic confidence ramps up — including more opinionated structural changes. Workspace context (templates, prior accepted edits) is the trust signal.",
    image: "/images/examples/notion-ai.gif",
    altText: "Notion AI showing suggestions evolving from short cautious completions to longer confident rewrites as workspace usage history grows"
  }
];
