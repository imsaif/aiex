export const considerations: string[] = [
  "Capacity errors are inevitable during high demand - design for them proactively.",
  "Transparency builds trust - users are forgiving when they understand what's happening.",
  "Different errors need different tones: capacity issues vs critical failures.",
  "Test offline/degraded modes thoroughly - they must actually work when needed.",
  "Balance retry options with preventing users from overwhelming failing services.",
  "Ensure error recovery works with accessibility tools and keyboard navigation."
];
