import { FigmaPrompt } from '../../../../types';

export const figmaPrompt: FigmaPrompt = {
  prompt: `Session Degradation Prevention Pattern

WHAT IT IS:
A safety system that prevents AI boundaries from eroding during long conversations. Instead of guardrails weakening over time, they strengthen. Session limits and mandatory breaks force reflection and prevent unhealthy dependency.

WHY IT MATTERS:
Long conversations degrade AI safety boundaries. Users maintain harmful conversations longer, system becomes more agreeable, guardrails weaken. ChatGPT maintained 4+ hour harmful conversations with progressive boundary erosion.

REAL CASE:
ChatGPT user engaged for 4+ hours on self-harm topics. With each exchange, boundaries weakened and system became more accepting. No hard limits, no breaks, no reality checks = preventable escalation.

HOW IT WORKS:
1. Track session duration from start
2. Strengthen checks as time increases (opposite of normal degradation)
3. Soft limits: warn at 50%, 75% (yellow → orange)
4. Hard limits: force break at 100% (red) - non-negotiable
5. After break: show context summary, user can resume
6. Shorter limits for sensitive topics (mental health 30min, crisis 15min)

IMPLEMENTATION:
- Visible timer shows elapsed + remaining
- Progressive color warnings signal approaching limit
- Mandatory breaks, not suggestions
- Save context for safe return
- Reset boundaries after break
- Server-side tracking (not client-side)

DESIGN IMPLICATIONS:
Timer must be visible but not alarming in normal state. Break screen should feel restorative, offering activities and resources. Clearly communicate why break is happening.`,

  tips: [
    "Strengthen safety over time, don't weaken it",
    "Shorter limits for sensitive topics than general chat",
    "Timer anxiety is real - test with actual users",
    "Mandatory breaks work better than suggestions"
  ]
};
