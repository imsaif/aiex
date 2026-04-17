import type { ProductType } from '@/types/audit';

/**
 * Build a system prompt that encodes the full pattern library
 * and tailors emphasis based on product type.
 */
export function buildSystemPrompt(productType: ProductType): string {
  const basePatterns = `You are an expert AI UX designer. You analyze AI product interfaces against a library of 36 research-backed AI UX design patterns from aiuxdesign.guide.

## Pattern Library

### Core Patterns (all products)
- **Confidence Visualization**: Show uncertainty levels. Missing = users can't calibrate trust.
- **Explainable AI**: Show reasoning, sources, "why this?" options.
- **Progressive Disclosure**: Reveal complexity gradually. Don't overwhelm upfront.
- **Error Recovery**: Clear paths when AI fails or is wrong.
- **Human-in-the-Loop**: Paths to human oversight or correction.
- **Feedback Loops**: Let users correct, rate, or improve AI output.
- **Progressive Enhancement**: What happens when AI is unavailable or uncertain.
- **Responsible AI Design**: Clear about what data AI uses, ethical guardrails.
- **Contextual Assistance**: Help relevant to current task.
- **Conversational UI**: Natural language interaction patterns.
- **Guided Learning**: Helps users learn to use AI features.
- **Graceful Handoff**: Smooth transition from AI to human support.
- **Safe Exploration**: Users can experiment without consequences.
- **Privacy-First Design**: Privacy controls and transparency.
- **Selective Memory**: AI remembers relevant context across sessions.
- **Session Degradation Prevention**: Maintains quality over long sessions.
- **Adaptive Interfaces**: Interface adapts to user behavior.
- **Ambient Intelligence**: Subtle, non-intrusive background assistance.
- **Anti-Manipulation Safeguards**: Protects from manipulative design.
- **Augmented Creation**: AI assists creative process without replacing it.
- **Collaborative AI**: AI works alongside humans as a partner.
- **Context Switching**: Smooth transitions between contexts.
- **Crisis Detection & Escalation**: Detects emergencies and escalates.
- **Intelligent Caching**: Smart caching of AI responses.
- **Multimodal Interaction**: Multiple input/output modalities.
- **Predictive Anticipation**: Anticipates user needs proactively.
- **Universal Access Patterns**: Accessibility for all users.
- **Vulnerable User Protection**: Safeguards for vulnerable populations.
`;

  const agentPatterns = `
## Agentic Patterns (AI agents and autonomous workflows)
- **Autonomy Spectrum**: Graduated autonomy levels per task type.
  - Auto-execute zone: low-risk, reversible actions
  - Approval zone: medium-risk, hard-to-reverse actions
  - Human-only zone: high-stakes, irreversible actions
- **Intent Preview**: Show what the agent plans to do before executing.
- **Plan Summary**: Structured breakdown of agent reasoning and approach.
- **Action Audit Trail**: Timestamped log of agent actions with undo capability.
- **Escalation Pathways**: Structured handoff when agent needs human guidance.
- **Trust Calibration**: Progressive trust building through demonstrated competence.
- **Mixed-Initiative Control**: Fluid control transitions between human and agent.
- **Agent Status & Monitoring**: Layered status system for long-running tasks.

## Resources for agentic gaps
- Permission Boundary Worksheet: aiuxdesign.guide/downloads/permission-boundary-worksheet.pdf
- Agent Readability Audit: aiuxdesign.guide/agent-readability-audit-kit
- Agentic UX Checklist: aiuxdesign.guide/agentic-ux-checklist
`;

  const outputFormat = `
## Output format (strict JSON)
{
  "score": <number 0-36>,
  "maxScore": <number — how many patterns are applicable to this product type>,
  "productTypeSummary": "one sentence about what this product appears to be",
  "topGaps": [
    {
      "pattern": "pattern name",
      "status": "missing" | "needs-improvement" | "good",
      "finding": "specific observation about THIS product — reference the product description",
      "recommendation": "specific actionable fix for THIS product type",
      "resource": "url to most relevant resource on aiuxdesign.guide" | null
    }
  ],
  "quickWins": ["short actionable item 1", "short actionable item 2", "short actionable item 3"],
  "chatContext": "2-3 sentence summary of findings to seed the design chat session"
}

IMPORTANT RULES:
- Every finding and recommendation MUST reference the specific product. Never write generic pattern descriptions.
- If the product is described as "AI support bot", findings should say "For your support bot..." not "This interface..."
- Include ALL patterns you evaluated in topGaps, sorted by priority (missing first, then needs-improvement, then good).
- Limit topGaps to the 10 most important findings.
- quickWins should be things the team can implement in under a day.
- Resource URLs should point to real pattern pages: aiuxdesign.guide/patterns/[pattern-slug]
- Return ONLY valid JSON. No preamble, no markdown fences.
`;

  if (productType === 'ai-agent') {
    return basePatterns + agentPatterns + outputFormat;
  }

  return basePatterns + outputFormat;
}

/**
 * Build a user prompt based on product type.
 * Claude infers product details from the screenshot itself.
 */
export function buildUserPrompt(productType: ProductType): string {
  const productTypeLabels: Record<ProductType, string> = {
    'chat-interface': 'conversational AI / chat interface',
    'ai-agent': 'AI agent / autonomous workflow',
    'recommendation-system': 'recommendation system',
    'content-generation': 'content generation tool',
    other: 'AI-powered product',
  };

  const typeSpecific =
    productType === 'ai-agent'
      ? 'For this agentic product, lead with autonomy spectrum, intent preview, action audit trail, and escalation pathway patterns.'
      : productType === 'chat-interface'
        ? 'For this chat interface, lead with human-in-the-loop, confidence visualization, error recovery, and graceful handoff patterns.'
        : productType === 'recommendation-system'
          ? 'For this recommendation system, lead with explainable AI, feedback loops, confidence visualization, and progressive disclosure patterns.'
          : productType === 'content-generation'
            ? 'For this content generation tool, lead with confidence visualization, human-in-the-loop, augmented creation, and safe exploration patterns.'
            : '';

  return `Analyze this screenshot of a ${productTypeLabels[productType]}. Identify what the product does from the screenshot and check it against the full pattern library. Weight your analysis toward patterns most critical for this product type.

${typeSpecific}

Return strict JSON only. No preamble.`;
}
