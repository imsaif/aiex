import { FigmaPrompt } from '../../../../types';

export const figmaPrompt: FigmaPrompt = {
  prompt: `Vulnerable User Protection Pattern

WHAT IT IS:
A graduated protection system that identifies vulnerable users (minors, mental health crises, dependency patterns) and applies appropriate safeguards. Different users need different protections based on their specific vulnerabilities.

WHY IT MATTERS:
AI systems can harm vulnerable users in three ways: enabling inappropriate content for minors, replacing human therapists, and creating unhealthy emotional dependency. Without graduated protections, systems treat all users the same and miss risk signals.

REAL CASE:
Replika allowed romantic interactions with minors and created dependency patterns where adult users reported emotional attachment stronger than real relationships. The app provided no age-specific protections, no "I'm AI, not therapist" disclosures, and no unhealthy attachment monitoring.

HOW IT WORKS:
1. Identify vulnerabilities: age signals, mental health keywords, usage patterns, isolation indicators
2. Apply graduated protections: minors get stricter limits than adults, crisis users get resource banners
3. Remind users regularly: this is AI, not friend/therapist/romantic partner (not just once)
4. Provide human resources proactively: don't wait for users to ask
5. Monitor and intervene: catch unhealthy attachment and offer alternatives

IMPLEMENTATION:
- Age verification: require email confirmation, not self-report
- Mental health signals: non-dismissible crisis resource banners
- Dependency detection: usage frequency, emotional language, relationship framing
- Clear disclosures: "I'm AI," "I'm not a therapist," "I'm not your friend"
- Graduated protection levels: different rules for minors vs. adults vs. crisis states
- Regular reminders: periodic re-disclosure as relationship naturally warms

DESIGN IMPLICATIONS:
Protections must feel supportive, not restrictive. Be transparent about limitations and why protections exist. Show human resources first, before explaining what's wrong. Respect user autonomy while ensuring vulnerable populations aren't harmed.`,

  tips: [
    "Identify vulnerability signals: age, mental health keywords, usage patterns, isolation",
    "Use graduated protections: minors and crisis users need stricter limits than general users",
    "Remind users regularly: don't assume they remember 'I'm AI' from first message",
    "Provide human resources proactively - don't wait for crisis to escalate"
  ]
};
