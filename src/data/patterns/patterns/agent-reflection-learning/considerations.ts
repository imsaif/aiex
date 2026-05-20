export const considerations: string[] = [
  "Reflection signals must be grounded in real system state — if your agent doesn't have a mechanism to actually update behavior from errors, showing a 'learning' UI is deceptive and will backfire when the same mistake recurs.",
  "Latency matters: reflection summaries generated synchronously after failure add friction; consider generating them asynchronously and surfacing them at the start of the next session.",
  "Users vary in how much they want to know — power users may want detailed retrospectives while casual users want a simple 'I'll handle this better next time' signal; design for both with progressive disclosure.",
  "Privacy and data retention: learning from user-specific errors may involve storing sensitive workflow data; be explicit about what is retained, for how long, and who can see it.",
  "Avoid the 'apologetic agent' anti-pattern where every interaction is prefaced with disclaimers about past failures — surface learning at appropriate moments, not constantly.",
  "In multi-user environments, clarify whether learning is per-user, per-team, or global — a change that improves behavior for one user's workflow may degrade another's.",
  "Measure whether showing reflection signals actually changes user behavior (task delegation rates, trust scores) rather than assuming visibility equals trust."
];
