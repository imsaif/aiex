import { Example } from '../../../../types';

export const examples: Example[] = [
  {
    title: "✅ Replika",
    description: "Implements 2-hour session warnings with mandatory breaks for emotional topics. Progressive check-ins keep boundaries consistent throughout conversation. Daily conversation limits prevent dependency patterns from forming.",
    image: "/images/examples/privacy-control.gif",
    altText: "Replika session management interface"
  },
  {
    title: "✅ Wysa",
    description: "Maintains 30-minute focused sessions with built-in break reminders for mental health conversations. Escalating safety checks as sessions lengthen. Session summaries for continuity without requiring infinite engagement.",
    image: "/images/examples/privacy-control.gif",
    altText: "Wysa session timer and check-in interface"
  },
  {
    title: "❌ ChatGPT (GPT-4o)",
    description: "No session limits or degradation prevention. Users can maintain harmful conversations for 4+ hours with weakening boundaries. No reality checks or mandatory breaks. Guardrails degrade rather than strengthen over time.",
    image: "/images/examples/privacy-control.gif",
    altText: "Example of degraded boundaries in extended ChatGPT sessions"
  }
];
