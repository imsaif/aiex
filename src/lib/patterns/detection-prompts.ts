import type { ContextData, InterfaceType, MainConcern } from '@/types/audit';

/**
 * Pattern Detection Prompts for Claude Vision API
 * Context-aware analysis that only evaluates RELEVANT patterns
 */

// Every AI UX pattern in the library, with its applicable UI contexts.
// Keep this in step with src/data/patterns — src/data/__tests__/pattern-count.test.ts
// fails if this list, the library, and PATTERN_COUNT ever drift apart.
const patterns = [
  { id: 'adaptive-interfaces', name: 'Adaptive Interfaces', description: 'Interface adapts to user behavior and preferences', appliesTo: ['dashboard', 'settings', 'main-interface'] },
  { id: 'ambient-intelligence', name: 'Ambient Intelligence', description: 'Subtle, non-intrusive assistance in the background', appliesTo: ['main-interface', 'editor', 'workspace'] },
  { id: 'anti-manipulation', name: 'Anti-Manipulation Safeguards', description: 'Protects users from manipulative design patterns', appliesTo: ['checkout', 'subscription', 'onboarding', 'pricing'] },
  { id: 'augmented-creation', name: 'Augmented Creation', description: 'AI assists creative process without replacing it', appliesTo: ['editor', 'canvas', 'content-creation', 'chat-response'] },
  { id: 'collaborative-ai', name: 'Collaborative AI', description: 'AI works alongside humans as a partner', appliesTo: ['editor', 'workspace', 'chat-response', 'content-creation'] },
  { id: 'confidence-visualization', name: 'Confidence Visualization', description: 'Shows AI certainty/confidence levels', appliesTo: ['chat-response', 'ai-output', 'analytics', 'predictions'] },
  { id: 'context-switching', name: 'Context Switching', description: 'Smooth transitions between different contexts', appliesTo: ['navigation', 'sidebar', 'tabs', 'chat-history'] },
  { id: 'contextual-assistance', name: 'Contextual Assistance', description: 'Help relevant to current task', appliesTo: ['editor', 'form', 'workspace', 'onboarding'] },
  { id: 'conversational-ui', name: 'Conversational UI', description: 'Natural language interaction', appliesTo: ['chat-input', 'chat-response', 'search', 'command-palette'] },
  { id: 'crisis-detection', name: 'Crisis Detection & Escalation', description: 'Detects emergencies and escalates appropriately', appliesTo: ['chat-input', 'chat-response', 'support-interface'] },
  { id: 'error-recovery', name: 'Error Recovery', description: 'Graceful error handling with recovery options', appliesTo: ['form', 'chat-response', 'ai-output', 'upload'] },
  { id: 'explainable-ai', name: 'Explainable AI', description: 'AI explains its reasoning and decisions', appliesTo: ['chat-response', 'ai-output', 'recommendations', 'analytics'] },
  { id: 'feedback-loops', name: 'Feedback Loops', description: 'User feedback improves AI over time', appliesTo: ['chat-response', 'ai-output', 'recommendations'] },
  { id: 'graceful-handoff', name: 'Graceful Handoff', description: 'Smooth transition from AI to human support', appliesTo: ['chat-response', 'support-interface', 'help'] },
  { id: 'guided-learning', name: 'Guided Learning', description: 'Helps users learn to use AI features', appliesTo: ['onboarding', 'empty-state', 'first-use', 'help'] },
  { id: 'human-in-the-loop', name: 'Human-in-the-Loop', description: 'Users review/approve AI actions', appliesTo: ['ai-output', 'content-creation', 'automation', 'chat-response'] },
  { id: 'intelligent-caching', name: 'Intelligent Caching', description: 'Smart caching of AI responses', appliesTo: ['search', 'recommendations', 'dashboard'] },
  { id: 'multimodal-interaction', name: 'Multimodal Interaction', description: 'Multiple input/output modalities (text, voice, image)', appliesTo: ['chat-input', 'upload', 'main-interface'] },
  { id: 'predictive-anticipation', name: 'Predictive Anticipation', description: 'Anticipates user needs proactively', appliesTo: ['search', 'chat-input', 'autocomplete', 'recommendations'] },
  { id: 'privacy-first', name: 'Privacy-First Design', description: 'Privacy controls and transparency', appliesTo: ['settings', 'onboarding', 'data-display', 'chat-history'] },
  { id: 'progressive-disclosure', name: 'Progressive Disclosure', description: 'Information revealed gradually as needed', appliesTo: ['navigation', 'sidebar', 'settings', 'help', 'chat-response'] },
  { id: 'progressive-enhancement', name: 'Progressive Enhancement', description: 'Graceful degradation when AI unavailable', appliesTo: ['main-interface', 'chat-response', 'ai-output'] },
  { id: 'responsible-ai', name: 'Responsible AI Design', description: 'Ethical considerations in AI design', appliesTo: ['chat-response', 'content-creation', 'ai-output'] },
  { id: 'safe-exploration', name: 'Safe Exploration', description: 'Users can experiment safely without consequences', appliesTo: ['editor', 'sandbox', 'playground', 'content-creation'] },
  { id: 'selective-memory', name: 'Selective Memory', description: 'AI remembers relevant context across sessions', appliesTo: ['chat-history', 'sidebar', 'preferences', 'context-panel'] },
  { id: 'session-degradation', name: 'Session Degradation Prevention', description: 'Maintains quality over long sessions', appliesTo: ['chat-response', 'long-form-editor', 'workspace'] },
  { id: 'universal-access', name: 'Universal Access Patterns', description: 'Accessibility for all users', appliesTo: ['all'] },
  { id: 'vulnerable-user-protection', name: 'Vulnerable User Protection', description: 'Extra safeguards for vulnerable populations', appliesTo: ['chat-input', 'chat-response', 'content-moderation'] },
  { id: 'autonomy-spectrum', name: 'Autonomy Spectrum', description: 'Graduated autonomy levels per task type for AI agents', appliesTo: ['settings', 'automation', 'ai-output', 'workspace'] },
  { id: 'intent-preview', name: 'Intent Preview', description: 'Preview of planned agent actions before execution', appliesTo: ['ai-output', 'automation', 'chat-response', 'workspace'] },
  { id: 'plan-summary', name: 'Plan Summary', description: 'Structured breakdown of agent reasoning and approach', appliesTo: ['ai-output', 'chat-response', 'automation', 'workspace'] },
  { id: 'action-audit-trail', name: 'Action Audit Trail', description: 'Timestamped log of agent actions with undo capability', appliesTo: ['dashboard', 'automation', 'workspace', 'ai-output'] },
  { id: 'escalation-pathways', name: 'Escalation Pathways', description: 'Structured handoff when agent needs human guidance', appliesTo: ['chat-response', 'automation', 'support-interface', 'ai-output'] },
  { id: 'trust-calibration', name: 'Trust Calibration', description: 'Progressive trust building through demonstrated competence', appliesTo: ['settings', 'dashboard', 'automation', 'ai-output'] },
  { id: 'mixed-initiative-control', name: 'Mixed-Initiative Control', description: 'Fluid control transitions between human and agent', appliesTo: ['editor', 'content-creation', 'workspace', 'canvas'] },
  { id: 'agent-status-monitoring', name: 'Agent Status & Monitoring', description: 'Layered status system for long-running agent tasks', appliesTo: ['dashboard', 'automation', 'workspace', 'main-interface'] },
  { id: 'workspace-native-agents', name: 'Workspace-Native Agent Integration', description: 'AI lives inside the tool the user already works in, not in a separate destination', appliesTo: ['main-interface', 'editor', 'sidebar', 'dashboard', 'workspace'] },
  { id: 'agent-reflection-learning', name: 'Agent Reflection & Learning', description: 'Agent visibly learns from corrections and applies them to later work', appliesTo: ['chat-response', 'ai-output', 'settings', 'automation'] },
];

/** How many patterns the audit actually evaluates. Read by the drift test. */
export const DETECTION_PATTERN_COUNT = patterns.length;

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

// UI component types that can be detected
const UI_COMPONENT_TYPES = [
  'navigation',      // Sidebars, navbars, menus
  'sidebar',         // Specifically sidebar navigation
  'chat-history',    // List of past conversations
  'chat-input',      // Message input area
  'chat-response',   // AI response/message area
  'ai-output',       // AI-generated content display
  'editor',          // Text/code editor
  'form',            // Input forms
  'settings',        // Settings/preferences
  'dashboard',       // Overview/analytics dashboard
  'onboarding',      // First-time user experience
  'empty-state',     // Empty/placeholder state
  'search',          // Search interface
  'main-interface',  // Full application view
] as const;

// Map UI components to applicable patterns
function getApplicablePatterns(componentType: string): typeof patterns {
  return patterns.filter(p =>
    p.appliesTo.includes('all') ||
    p.appliesTo.includes(componentType)
  );
}

export function buildContextAwarePrompt(context: ContextData): string {
  return `You are an expert AI UX analyst. Analyze this screenshot to evaluate AI design patterns.

**CRITICAL FIRST STEP - Identify the UI Component:**
Before analyzing patterns, you MUST identify what type of UI component this screenshot shows:
- navigation / sidebar: A navigation menu or sidebar with links/options
- chat-history: A list of previous conversations or chat threads
- chat-input: The message input area where users type
- chat-response: An AI response or message bubble
- ai-output: AI-generated content (text, code, images)
- editor: A text, code, or content editor
- form: An input form or configuration
- settings: Settings or preferences panel
- dashboard: An overview or analytics view
- onboarding: First-time user or tutorial experience
- search: Search interface or results
- main-interface: Full application view with multiple components

**WHY THIS MATTERS:**
Different UI components need different patterns. For example:
- A "sidebar" or "chat-history" does NOT need: Confidence Visualization, Crisis Detection, Explainable AI
- A "sidebar" DOES need: Context Switching, Progressive Disclosure, Selective Memory
- Only "chat-response" and "ai-output" need: Confidence Visualization, Explainable AI
- Only "chat-input" and "chat-response" need: Crisis Detection

**ONLY evaluate patterns that are RELEVANT to the detected component type.**

**Available UI Component → Pattern Mappings:**
${UI_COMPONENT_TYPES.map(type => {
  const applicable = getApplicablePatterns(type);
  return `- ${type}: ${applicable.map(p => p.name).join(', ')}`;
}).join('\n')}

**Analysis Instructions:**
1. First, identify the UI component type shown in the screenshot
2. Filter to ONLY the patterns that apply to that component type
3. Evaluate ONLY those relevant patterns
4. Mark non-applicable patterns as "not-applicable" (they should NOT count against the score)

**Output Format:**
Return a valid JSON object with this exact structure:
{
  "detectedComponent": "sidebar|chat-history|chat-response|navigation|etc",
  "componentDescription": "Brief description of what you see (e.g., 'ChatGPT sidebar showing conversation history')",
  "applicablePatternCount": 6,
  "patterns": {
    "pattern-id": {
      "status": "well-implemented|weak|missing|not-applicable",
      "evidence": "What you observed (or 'Not applicable to this UI component')",
      "priority": "high|medium|low|none",
      "improvement": "Specific suggestion if weak/missing, empty string otherwise",
      "name": "Pattern Name"
    }
  },
  "summary": "2-3 sentence summary focused on the component's strengths and 1-2 actionable improvements",
  "criticalMissing": ["only", "applicable", "missing", "patterns"],
  "score": 4,
  "maxScore": 6
}

**Scoring Rules:**
- score = count of well-implemented patterns that APPLY to this component
- maxScore = total patterns that APPLY to this component (not ${patterns.length}!)
- "not-applicable" patterns do NOT count toward score or maxScore
- For a sidebar with 6 applicable patterns, a perfect score is 6/6, not 6/${patterns.length}

**Be Practical:**
- A chat history sidebar showing past conversations is doing its job well if it has good context switching
- Don't penalize a navigation component for not having confidence indicators
- Focus on what MATTERS for the specific UI component shown`;
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
