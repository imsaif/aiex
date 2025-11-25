import type { ContextData, InterfaceType, MainConcern } from '@/types/audit';

/**
 * Pattern Detection Prompts for Claude Vision API
 */

// All 28 AI UX patterns to check
const patterns = [
  { id: 'adaptive-interfaces', name: 'Adaptive Interfaces', description: 'Interface adapts to user behavior and preferences' },
  { id: 'ambient-intelligence', name: 'Ambient Intelligence', description: 'Subtle, non-intrusive assistance in the background' },
  { id: 'anti-manipulation', name: 'Anti-Manipulation Safeguards', description: 'Protects users from manipulative design patterns' },
  { id: 'augmented-creation', name: 'Augmented Creation', description: 'AI assists creative process without replacing it' },
  { id: 'collaborative-ai', name: 'Collaborative AI', description: 'AI works alongside humans as a partner' },
  { id: 'confidence-visualization', name: 'Confidence Visualization', description: 'Shows AI certainty/confidence levels' },
  { id: 'context-switching', name: 'Context Switching', description: 'Smooth transitions between different contexts' },
  { id: 'contextual-assistance', name: 'Contextual Assistance', description: 'Help relevant to current task' },
  { id: 'conversational-ui', name: 'Conversational UI', description: 'Natural language interaction' },
  { id: 'crisis-detection', name: 'Crisis Detection & Escalation', description: 'Detects emergencies and escalates appropriately' },
  { id: 'error-recovery', name: 'Error Recovery', description: 'Graceful error handling with recovery options' },
  { id: 'explainable-ai', name: 'Explainable AI', description: 'AI explains its reasoning and decisions' },
  { id: 'feedback-loops', name: 'Feedback Loops', description: 'User feedback improves AI over time' },
  { id: 'graceful-handoff', name: 'Graceful Handoff', description: 'Smooth transition from AI to human support' },
  { id: 'guided-learning', name: 'Guided Learning', description: 'Helps users learn to use AI features' },
  { id: 'human-in-the-loop', name: 'Human-in-the-Loop', description: 'Users review/approve AI actions' },
  { id: 'intelligent-caching', name: 'Intelligent Caching', description: 'Smart caching of AI responses' },
  { id: 'multimodal-interaction', name: 'Multimodal Interaction', description: 'Multiple input/output modalities (text, voice, image)' },
  { id: 'predictive-anticipation', name: 'Predictive Anticipation', description: 'Anticipates user needs proactively' },
  { id: 'privacy-first', name: 'Privacy-First Design', description: 'Privacy controls and transparency' },
  { id: 'progressive-disclosure', name: 'Progressive Disclosure', description: 'Information revealed gradually as needed' },
  { id: 'progressive-enhancement', name: 'Progressive Enhancement', description: 'Graceful degradation when AI unavailable' },
  { id: 'responsible-ai', name: 'Responsible AI Design', description: 'Ethical considerations in AI design' },
  { id: 'safe-exploration', name: 'Safe Exploration', description: 'Users can experiment safely without consequences' },
  { id: 'selective-memory', name: 'Selective Memory', description: 'AI remembers relevant context across sessions' },
  { id: 'session-degradation', name: 'Session Degradation Prevention', description: 'Maintains quality over long sessions' },
  { id: 'universal-access', name: 'Universal Access Patterns', description: 'Accessibility for all users' },
  { id: 'vulnerable-user-protection', name: 'Vulnerable User Protection', description: 'Extra safeguards for vulnerable populations' },
];

// Context-specific priorities
const contextPriorities: Record<InterfaceType, string[]> = {
  chatbot: ['conversational-ui', 'context-switching', 'error-recovery', 'explainable-ai', 'graceful-handoff'],
  content: ['human-in-the-loop', 'confidence-visualization', 'explainable-ai', 'augmented-creation', 'error-recovery'],
  code: ['explainable-ai', 'contextual-assistance', 'safe-exploration', 'error-recovery', 'human-in-the-loop'],
  image: ['augmented-creation', 'safe-exploration', 'feedback-loops', 'multimodal-interaction', 'progressive-disclosure'],
  analytics: ['explainable-ai', 'confidence-visualization', 'progressive-disclosure', 'contextual-assistance', 'error-recovery'],
  other: ['explainable-ai', 'error-recovery', 'contextual-assistance', 'feedback-loops', 'progressive-disclosure'],
};

// Concern-specific recommendations
const concernPriorities: Record<MainConcern, string[]> = {
  trust: ['confidence-visualization', 'explainable-ai', 'human-in-the-loop', 'responsible-ai'],
  errors: ['human-in-the-loop', 'error-recovery', 'confidence-visualization', 'safe-exploration'],
  usability: ['guided-learning', 'contextual-assistance', 'progressive-disclosure', 'conversational-ui'],
  blackbox: ['explainable-ai', 'confidence-visualization', 'feedback-loops', 'progressive-disclosure'],
  consistency: ['feedback-loops', 'session-degradation', 'intelligent-caching', 'error-recovery'],
};

export function buildContextAwarePrompt(context: ContextData): string {
  const priorities = contextPriorities[context.interfaceType] || [];
  const concernPriorities = concernPriorities[context.mainConcern] || [];

  return `You are analyzing an AI interface screenshot. Your task is to detect which of 28 AI UX design patterns are present and evaluate their implementation quality.

**Context:**
- Interface Type: ${context.interfaceType}
- User's Main Concern: ${context.mainConcern}
- Primary Goal: ${context.userGoal}
${context.industry ? `- Industry: ${context.industry}` : ''}
${context.stage ? `- Stage: ${context.stage}` : ''}

**Instructions:**
1. Carefully analyze the screenshot for evidence of each pattern
2. Rate each pattern as:
   - "well-implemented": Clearly present and follows best practices
   - "weak": Present but poorly implemented or incomplete
   - "missing": Not found or critically lacking

3. For each pattern, provide:
   - Specific evidence from the screenshot
   - Priority level (high/medium/low) based on the context
   - Improvement suggestions if weak or missing

**Patterns to Check:**
${patterns.map((p, i) => `${i + 1}. **${p.name}** (${p.id}): ${p.description}`).join('\n')}

**Context-Specific Priorities:**
For ${context.interfaceType} interfaces, these patterns are CRITICAL:
${priorities.map(p => `- ${patterns.find(pt => pt.id === p)?.name}`).join('\n')}

Given the user's concern about "${context.mainConcern}", prioritize:
${concernPriorities.map(p => `- ${patterns.find(pt => pt.id === p)?.name}`).join('\n')}

**Output Format:**
Return a valid JSON object with this exact structure:
{
  "patterns": {
    "adaptive-interfaces": {
      "status": "well-implemented|weak|missing",
      "evidence": "What you observed in the screenshot",
      "priority": "high|medium|low",
      "improvement": "Specific suggestion if weak/missing, empty string otherwise"
    },
    // ... repeat for all 28 patterns
  },
  "summary": "1-2 paragraph summary of overall findings",
  "criticalMissing": ["array", "of", "critical", "missing", "pattern", "ids"],
  "score": 14
}

**Important:**
- Be objective and evidence-based
- Consider the specific interface type and user concern
- Provide actionable improvement suggestions
- Score is the count of well-implemented patterns (max 28)
- Critical missing patterns should align with context priorities`;
}

export function getContextSpecificDescription(patternId: string, context: ContextData): string {
  const contextDescriptions: Record<string, Record<InterfaceType, string>> = {
    'human-in-the-loop': {
      chatbot: 'Users review AI responses before acting on them',
      content: 'Review and approval step before publishing AI-generated content',
      code: 'Code review and approval before applying AI suggestions',
      image: 'Preview and refinement before finalizing AI-generated images',
      analytics: 'Review AI insights before making business decisions',
      other: 'Users can review and modify AI outputs before finalizing',
    },
    'confidence-visualization': {
      chatbot: 'Shows confidence in answers (e.g., "I\'m 80% confident...")',
      content: 'Displays certainty level for generated content',
      code: 'Shows confidence in code suggestions',
      image: 'Indicates quality/confidence of generated images',
      analytics: 'Shows confidence intervals in predictions',
      other: 'Displays AI confidence levels for outputs',
    },
  };

  return contextDescriptions[patternId]?.[context.interfaceType] || '';
}
