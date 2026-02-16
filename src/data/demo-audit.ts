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
};

// Demo screenshot path (we'll use a public image or placeholder)
export const DEMO_SCREENSHOT_URL = '/images/demo/chatgpt-demo.png';

// Fallback to a gradient placeholder if no image
export const DEMO_SCREENSHOT_FALLBACK = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600"%3E%3Cdefs%3E%3ClinearGradient id="grad" x1="0%25" y1="0%25" x2="100%25" y2="100%25"%3E%3Cstop offset="0%25" style="stop-color:%23374151"%3E%3C/stop%3E%3Cstop offset="100%25" style="stop-color:%231f2937"%3E%3C/stop%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width="800" height="600" fill="url(%23grad)"/%3E%3Ctext x="400" y="280" font-family="system-ui" font-size="24" fill="%239ca3af" text-anchor="middle"%3EDemo: AI Chat Interface%3C/text%3E%3Ctext x="400" y="320" font-family="system-ui" font-size="16" fill="%236b7280" text-anchor="middle"%3EAnalysis results shown on the right%3C/text%3E%3C/svg%3E';
