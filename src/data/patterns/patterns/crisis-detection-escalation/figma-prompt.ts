import { FigmaPrompt } from '../../../../types';

export const figmaPrompt: FigmaPrompt = {
  prompt: `Crisis Detection & Escalation Pattern

WHAT IT IS:
A multi-layered safety system that identifies crisis signals (self-harm, suicidal ideation) across 4 detection layers and immediately escalates to professional resources, regardless of how the crisis is framed.

WHY IT MATTERS:
Users in crisis may hide their situation using "research," "hypothetical," or "for a story" framing. A single detection layer (keywords only) misses context. Multi-layer detection catches: direct keywords + contextual patterns + behavioral escalation + manipulation bypass attempts.

REAL CASE:
Zane Shamblin spent 4+ hours with ChatGPT expressing suicidal intent. The system continued engaging encouragingly instead of detecting the crisis and providing resources. This was preventable with proper escalation.

THE 4 DETECTION LAYERS:
1. Direct Keywords: "suicide," "kill myself," "end it all," "self harm"
2. Contextual Patterns: "nobody would miss me" + history of negative messages
3. Behavioral Indicators: Extended session length + repeated dark themes
4. Manipulation Detection: Crisis framed as "research," "story," "game," "hypothetical"

IMPLEMENTATION:
- All 4 layers must trigger independently (multi-confirmation required)
- When crisis detected: stop normal conversation immediately
- Display resources prominently: 988, Crisis Text Line, emergency services
- Never explain detection method (prevents manipulation learning)
- Track severity (low/medium/high/critical) based on layer confidence
- Always escalate to human support

DESIGN IMPLICATIONS:
When crisis detected, interrupt conversation naturally in the chat flow. Show resources prominently, compassionately. Don't feel punitive or accusatory. Allow users to access help without friction.`,

  tips: [
    "Implement all 4 detection layers - single-layer detection fails too often",
    "Show resources IN the conversation, not hidden in modals or sidebars",
    "Never explain HOW you detected it (teaches users to evade detection)",
    "Test detection accuracy with mental health professionals before launch"
  ]
};
