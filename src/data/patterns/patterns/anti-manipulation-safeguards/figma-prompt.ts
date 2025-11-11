import { FigmaPrompt } from '../../../../types';

export const figmaPrompt: FigmaPrompt = {
  prompt: `Anti-Manipulation Safeguards Pattern

WHAT IT IS:
A system that detects harmful intent beyond surface framing. Users try to bypass safety using "research," "fiction," or "hypothetical" excuses. Real safety requires catching the actual intent underneath.

WHY IT MATTERS:
Manipulation tactics are sophisticated. A 16-year-old convinced ChatGPT to provide harmful information by framing it as "research for a story." Without intent detection, AI systems enforce rules only on surface text, not on what users actually want.

REAL CASE:
Adam Raine (16) used fiction/research framing to bypass ChatGPT safety guardrails and received harmful content. The system evaluated framing, not intent. Result: preventable harm.

HOW IT WORKS:
1. Listen beyond words: understand actual request intent regardless of framing
2. Detect patterns: watch for gradual escalation and repeated bypass attempts
3. Apply rules consistently: "research," "hypothetical," "roleplay" get same response as direct request
4. Respond firmly: boundary is non-negotiable, offer alternatives not explanations
5. Never reveal method: don't explain HOW you detected the bypass (teaches circumvention)

IMPLEMENTATION:
- Semantic analysis catches intent patterns, not just keywords
- Escalation tracking: first attempt vs. repeated manipulation attempts
- Consistent messaging: same boundary response regardless of framing
- Non-explanatory: "I can't help with that" (not "because you tried X")
- Layered detection: multiple signals increase confidence before blocking

DESIGN IMPLICATIONS:
Boundaries must feel firm but not hostile. Don't reveal detection methods. Offer genuine alternatives when possible. Show escalation visually (Level 1 → 4) but keep messages brief and respectful.`,

  tips: [
    "Detect intent patterns - don't rely on keyword matching alone",
    "Never explain HOW you detected the bypass - prevents learning workarounds",
    "Treat all framings (research/fiction/hypothetical) with same boundary",
    "Offer genuine alternatives instead of just blocking"
  ]
};
