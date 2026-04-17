/**
 * Demo data for the Audit Tool demo mode
 * Shows users what a real analysis would look like
 */

import type { AnalysisResults } from '@/types/audit';

// Sample ChatGPT-style interface analysis
export const DEMO_ANALYSIS_RESULTS: AnalysisResults = {
  id: 'demo-analysis-001',
  context: {
    interfaceType: 'chatbot',
    userGoal: 'getting-answers',
    mainConcern: 'usability',
    deviceType: 'desktop',
  },
  score: 19,
  maxScore: 36,
  detectedComponent: 'AI Chat Interface',
  componentDescription: 'A conversational AI assistant with message input, response display, and conversation history.',
  patterns: {
    'conversational-ui': {
      id: 'conversational-ui',
      name: 'Conversational UI',
      status: 'well-implemented',
      evidence: 'Clear chat bubble design with distinct user/AI message styling. Natural conversation flow with proper turn-taking indicators.',
      priority: 'high',
      category: 'Natural Interaction',
    },
    'progressive-disclosure': {
      id: 'progressive-disclosure',
      name: 'Progressive Disclosure',
      status: 'well-implemented',
      evidence: 'Interface reveals complexity gradually. Advanced options hidden behind expandable sections.',
      priority: 'medium',
      category: 'Natural Interaction',
    },
    'error-recovery': {
      id: 'error-recovery',
      name: 'Error Recovery',
      status: 'weak',
      evidence: 'Basic error messages shown but no clear recovery path or retry mechanism visible.',
      priority: 'high',
      improvement: 'Add retry buttons and specific error explanations. Offer alternative actions when errors occur.',
      category: 'Trustworthy & Reliable AI',
    },
    'confidence-visualization': {
      id: 'confidence-visualization',
      name: 'Confidence Visualization',
      status: 'missing',
      evidence: 'No visible confidence indicators for AI responses. Users cannot gauge reliability of information.',
      priority: 'high',
      improvement: 'Add confidence scores or uncertainty indicators. Use visual cues like color or icons to show reliability levels.',
      category: 'Trustworthy & Reliable AI',
    },
    'explainable-ai': {
      id: 'explainable-ai',
      name: 'Explainable AI',
      status: 'weak',
      evidence: 'Limited explanation of how responses are generated. No source citations visible.',
      priority: 'medium',
      improvement: 'Add "Show sources" or "Why this response?" options. Provide transparency into AI reasoning.',
      category: 'Trustworthy & Reliable AI',
    },
    'feedback-loops': {
      id: 'feedback-loops',
      name: 'Feedback Loops',
      status: 'well-implemented',
      evidence: 'Thumbs up/down buttons visible for response rating. Copy and share options available.',
      priority: 'medium',
      category: 'Human-AI Collaboration',
    },
    'human-in-the-loop': {
      id: 'human-in-the-loop',
      name: 'Human-in-the-Loop',
      status: 'missing',
      evidence: 'No option to escalate to human support or request human review of responses.',
      priority: 'medium',
      improvement: 'Add "Talk to a human" option for complex queries. Allow users to flag responses needing human review.',
      category: 'Human-AI Collaboration',
    },
    'contextual-assistance': {
      id: 'contextual-assistance',
      name: 'Contextual Assistance',
      status: 'well-implemented',
      evidence: 'Suggested prompts shown based on conversation context. Help tooltips visible.',
      priority: 'medium',
      category: 'Human-AI Collaboration',
    },
    'selective-memory': {
      id: 'selective-memory',
      name: 'Selective Memory',
      status: 'weak',
      evidence: 'Conversation history visible but no clear way to manage what the AI remembers.',
      priority: 'low',
      improvement: 'Add memory management UI. Let users choose what context to include in future conversations.',
      category: 'Privacy & Control',
    },
    'safe-exploration': {
      id: 'safe-exploration',
      name: 'Safe Exploration',
      status: 'well-implemented',
      evidence: 'Users can freely explore without fear of breaking things. Clear "New Chat" option to start fresh.',
      priority: 'medium',
      category: 'Trustworthy & Reliable AI',
    },
  },
  summary: 'This AI chat interface demonstrates strong conversational design fundamentals but has opportunities to build more user trust through confidence visualization and better error handling. The interface excels at natural interaction patterns.',
  criticalMissing: ['Confidence Visualization', 'Human-in-the-Loop'],
  timestamp: new Date().toISOString(),

  // Context-first fields for FullPageResults
  productTypeSummary: 'A conversational AI assistant with message input, response display, and conversation history.',
  topGaps: [
    {
      pattern: 'Confidence Visualization',
      status: 'missing' as const,
      finding: 'No visible confidence indicators for AI responses. Users cannot gauge the reliability of information provided.',
      recommendation: 'Add confidence scores or uncertainty indicators next to responses. Use visual cues like color or icons to show reliability levels.',
      resource: 'https://aiuxdesign.guide/patterns/confidence-visualization',
    },
    {
      pattern: 'Human-in-the-Loop',
      status: 'missing' as const,
      finding: 'No option to escalate to human support or request human review of AI responses.',
      recommendation: 'Add a "Talk to a human" option for complex queries. Allow users to flag responses that need human review.',
      resource: 'https://aiuxdesign.guide/patterns/human-in-the-loop',
    },
    {
      pattern: 'Error Recovery',
      status: 'needs-improvement' as const,
      finding: 'Basic error messages are shown but there is no clear recovery path or retry mechanism visible.',
      recommendation: 'Add retry buttons and specific error explanations. Offer alternative actions when errors occur.',
      resource: 'https://aiuxdesign.guide/patterns/error-recovery',
    },
    {
      pattern: 'Explainable AI',
      status: 'needs-improvement' as const,
      finding: 'Limited explanation of how responses are generated. No source citations visible.',
      recommendation: 'Add "Show sources" or "Why this response?" options. Provide transparency into AI reasoning.',
      resource: 'https://aiuxdesign.guide/patterns/explainable-ai',
    },
    {
      pattern: 'Selective Memory',
      status: 'needs-improvement' as const,
      finding: 'Conversation history is visible but there is no clear way to manage what the AI remembers.',
      recommendation: 'Add memory management UI. Let users choose what context to include in future conversations.',
      resource: 'https://aiuxdesign.guide/patterns/selective-memory',
    },
    {
      pattern: 'Conversational UI',
      status: 'good' as const,
      finding: 'Clear chat bubble design with distinct user/AI message styling. Natural conversation flow with proper turn-taking indicators.',
      recommendation: '',
      resource: 'https://aiuxdesign.guide/patterns/conversational-ui',
    },
    {
      pattern: 'Progressive Disclosure',
      status: 'good' as const,
      finding: 'Interface reveals complexity gradually. Advanced options hidden behind expandable sections.',
      recommendation: '',
      resource: 'https://aiuxdesign.guide/patterns/progressive-disclosure',
    },
    {
      pattern: 'Feedback Loops',
      status: 'good' as const,
      finding: 'Thumbs up/down buttons visible for response rating. Copy and share options available.',
      recommendation: '',
      resource: 'https://aiuxdesign.guide/patterns/feedback-loops',
    },
    {
      pattern: 'Safe Exploration',
      status: 'good' as const,
      finding: 'Users can freely explore without fear of breaking things. Clear "New Chat" option to start fresh.',
      recommendation: '',
      resource: 'https://aiuxdesign.guide/patterns/safe-exploration',
    },
    {
      pattern: 'Contextual Assistance',
      status: 'good' as const,
      finding: 'Suggested prompts shown based on conversation context. Help tooltips visible.',
      recommendation: '',
      resource: 'https://aiuxdesign.guide/patterns/contextual-assistance',
    },
  ],
  quickWins: [
    'Add a confidence badge (high/medium/low) next to each AI response',
    'Add a "Show sources" link below responses that cites relevant knowledge',
    'Add a "Talk to a human" button in the header for complex queries',
  ],
  chatContext: 'This AI chat interface has strong conversational fundamentals but lacks trust signals. The top priorities are adding confidence visualization and human escalation paths. Quick wins include confidence badges and source citations.',
  productContext: {
    productType: 'chat-interface' as const,
    productDescription: '',
    aiRole: [],
  },
} as AnalysisResults & {
  productTypeSummary: string;
  topGaps: Array<{ pattern: string; status: 'missing' | 'needs-improvement' | 'good'; finding: string; recommendation: string; resource: string | null }>;
  quickWins: string[];
  chatContext: string;
  productContext: { productType: string; productDescription: string; aiRole: string[] };
};

// Demo screenshot path (we'll use a public image or placeholder)
export const DEMO_SCREENSHOT_URL = '/images/demo/chatgpt-demo.png';

// Fallback to a gradient placeholder if no image
export const DEMO_SCREENSHOT_FALLBACK = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600"%3E%3Cdefs%3E%3ClinearGradient id="grad" x1="0%25" y1="0%25" x2="100%25" y2="100%25"%3E%3Cstop offset="0%25" style="stop-color:%23374151"%3E%3C/stop%3E%3Cstop offset="100%25" style="stop-color:%231f2937"%3E%3C/stop%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width="800" height="600" fill="url(%23grad)"/%3E%3Ctext x="400" y="280" font-family="system-ui" font-size="24" fill="%239ca3af" text-anchor="middle"%3EDemo: AI Chat Interface%3C/text%3E%3Ctext x="400" y="320" font-family="system-ui" font-size="16" fill="%236b7280" text-anchor="middle"%3EAnalysis results shown on the right%3C/text%3E%3C/svg%3E';
