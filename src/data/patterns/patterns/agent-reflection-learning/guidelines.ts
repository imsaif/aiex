export const guidelines: string[] = [
  "Show a brief retrospective summary after any agent failure, explaining what the agent understood at the time versus what actually happened — keep it under 3 sentences and avoid technical jargon.",
  "Display a per-domain confidence level that visibly adjusts based on recent performance, so users know where the agent is reliable versus still learning.",
  "Distinguish between 'this task failed' and 'the agent learned from this failure' — only show a learning signal when the system has actually updated its behavior, not as a consolation message.",
  "Provide a learning history or changelog that users can browse to understand how the agent's behavior has evolved, especially after significant errors.",
  "Use progressive trust indicators: show users when an agent has successfully completed a task type multiple times after previously failing at it, marking it as a recovered capability.",
  "Never claim the agent 'learned' something unless the underlying model or memory has actually been updated — false learning signals are more damaging to trust than silence.",
  "Allow users to annotate or confirm whether the agent's stated learning matches their own understanding of what went wrong, closing the feedback loop."
];
