import { Pattern } from '../types';
import { searchPatterns } from './search';

// Keyword mappings to pattern IDs
export const keywordToPatterns: Record<string, string[]> = {
  // Trust and transparency
  'trust': ['explainable-ai', 'human-in-the-loop'],
  'trustworthy': ['explainable-ai', 'human-in-the-loop', 'responsible-ai-design'],
  'transparent': ['explainable-ai'],
  'explain': ['explainable-ai'],
  'understand': ['explainable-ai', 'guided-learning'],
  'why': ['explainable-ai'],
  
  // Communication and conversation
  'chat': ['conversational-ui'],
  'chatbot': ['conversational-ui'],
  'conversation': ['conversational-ui'],
  'talk': ['conversational-ui'],
  'communicate': ['conversational-ui'],
  'dialogue': ['conversational-ui'],
  
  // Assistance and help
  'help': ['contextual-assistance', 'guided-learning'],
  'assist': ['contextual-assistance'],
  'support': ['contextual-assistance', 'guided-learning'],
  'guide': ['guided-learning', 'contextual-assistance'],
  'suggest': ['contextual-assistance', 'augmented-creation'],
  'suggestion': ['contextual-assistance'],
  'recommend': ['contextual-assistance'],
  
  // Errors and problems
  'error': ['error-recovery'],
  'mistake': ['error-recovery'],
  'wrong': ['error-recovery'],
  'fail': ['error-recovery'],
  'broke': ['error-recovery'],
  'fix': ['error-recovery'],
  
  // Complexity and confusion
  'confused': ['progressive-disclosure', 'guided-learning'],
  'confusing': ['progressive-disclosure', 'guided-learning'],
  'overwhelmed': ['progressive-disclosure'],
  'complex': ['progressive-disclosure'],
  'complicated': ['progressive-disclosure'],
  'simple': ['progressive-disclosure'],
  'simplify': ['progressive-disclosure'],
  
  // Control and decision making
  'control': ['human-in-the-loop'],
  'decide': ['human-in-the-loop', 'explainable-ai'],
  'choice': ['human-in-the-loop'],
  'override': ['human-in-the-loop'],
  'manual': ['human-in-the-loop'],
  
  // Creation and generation
  'create': ['augmented-creation'],
  'generate': ['augmented-creation'],
  'write': ['augmented-creation'],
  'compose': ['augmented-creation'],
  'draft': ['augmented-creation'],
  'build': ['augmented-creation'],
  'make': ['augmented-creation'],
  
  // Ethics and responsibility
  'bias': ['responsible-ai-design'],
  'biased': ['responsible-ai-design'],
  'fair': ['responsible-ai-design'],
  'ethical': ['responsible-ai-design'],
  'inclusive': ['responsible-ai-design'],
  'discrimination': ['responsible-ai-design'],
  
  // Learning and onboarding
  'learn': ['guided-learning'],
  'tutorial': ['guided-learning'],
  'onboard': ['guided-learning'],
  'teach': ['guided-learning'],
  'training': ['guided-learning'],
  'beginner': ['guided-learning'],
  
  // Adaptation and personalization
  'adapt': ['adaptive-interfaces'],
  'personalize': ['adaptive-interfaces'],
  'customize': ['adaptive-interfaces'],
  'adjust': ['adaptive-interfaces'],
  'change': ['adaptive-interfaces'],
  
  // Collaboration
  'collaborate': ['collaborative-ai'],
  'team': ['collaborative-ai'],
  'together': ['collaborative-ai'],
  'partner': ['collaborative-ai'],
  
  // Background processing
  'background': ['ambient-intelligence'],
  'behind': ['ambient-intelligence'],
  'automatic': ['ambient-intelligence'],
  'smart': ['ambient-intelligence', 'contextual-assistance'],
  
  // Safe exploration
  'safe': ['safe-exploration'],
  'explore': ['safe-exploration'],
  'try': ['safe-exploration'],
  'experiment': ['safe-exploration'],
  'test': ['safe-exploration'],
  
  // Multimodal
  'voice': ['multimodal-interaction'],
  'speech': ['multimodal-interaction'],
  'image': ['multimodal-interaction'],
  'video': ['multimodal-interaction'],
  'upload': ['multimodal-interaction'],
  'file': ['multimodal-interaction'],
};

// Common phrases to pattern mappings
export const phraseToPatterns: Record<string, string[]> = {
  // Trust related
  'build trust': ['explainable-ai', 'human-in-the-loop'],
  'gain trust': ['explainable-ai', 'responsible-ai-design'],
  'users don\'t trust': ['explainable-ai', 'human-in-the-loop'],
  'black box': ['explainable-ai'],
  'make decisions': ['human-in-the-loop', 'explainable-ai'],
  
  // User experience
  'users are confused': ['progressive-disclosure', 'guided-learning'],
  'too complicated': ['progressive-disclosure'],
  'need help': ['contextual-assistance', 'guided-learning'],
  'overwhelmed with options': ['progressive-disclosure'],
  
  // Specific applications
  'writing assistant': ['augmented-creation', 'contextual-assistance'],
  'content creation': ['augmented-creation'],
  'code assistant': ['augmented-creation', 'contextual-assistance'],
  'customer support': ['conversational-ui', 'contextual-assistance'],
  
  // Problem scenarios
  'ai makes mistakes': ['error-recovery', 'human-in-the-loop'],
  'handle errors': ['error-recovery'],
  'when things go wrong': ['error-recovery'],
  'users get stuck': ['contextual-assistance', 'guided-learning'],
  
  // Feature requests
  'show gradually': ['progressive-disclosure'],
  'step by step': ['progressive-disclosure', 'guided-learning'],
  'learn from user': ['adaptive-interfaces'],
  'work together': ['collaborative-ai'],
  'in background': ['ambient-intelligence'],
};

export interface SmartSearchResult {
  patterns: Pattern[];
  confidence: 'high' | 'medium' | 'low';
  matchedKeywords: string[];
  suggestion?: string;
}

/**
 * Smart search that understands natural language queries
 */
export async function smartSearch(query: string): Promise<SmartSearchResult> {
  if (!query || query.trim().length < 2) {
    return {
      patterns: [],
      confidence: 'low',
      matchedKeywords: [],
    };
  }

  const lowerQuery = query.toLowerCase();
  const matchedPatternIds = new Set<string>();
  const matchedKeywords: string[] = [];
  let confidence: 'high' | 'medium' | 'low' = 'low';

  // First, check for phrase matches (higher confidence)
  for (const [phrase, patterns] of Object.entries(phraseToPatterns)) {
    if (lowerQuery.includes(phrase.toLowerCase())) {
      patterns.forEach(id => matchedPatternIds.add(id));
      matchedKeywords.push(phrase);
      confidence = 'high';
    }
  }

  // Then check individual keywords
  for (const [keyword, patterns] of Object.entries(keywordToPatterns)) {
    if (lowerQuery.includes(keyword.toLowerCase())) {
      patterns.forEach(id => matchedPatternIds.add(id));
      matchedKeywords.push(keyword);
      if (confidence === 'low') confidence = 'medium';
    }
  }

  // If we found matches, get the actual pattern objects
  if (matchedPatternIds.size > 0) {
    // Import patterns dynamically to avoid circular deps
    const patterns = (await import('../data/patterns')).default;
    const matchedPatterns = patterns.filter(p => matchedPatternIds.has(p.id));
    
    return {
      patterns: matchedPatterns,
      confidence,
      matchedKeywords: Array.from(new Set(matchedKeywords)), // Remove duplicates
      suggestion: generateSuggestion(matchedPatterns, lowerQuery),
    };
  }

  // Fallback to fuzzy search
  const fuzzyResults = await searchPatterns(query, { limit: 5, minScore: 0.7 });
  
  return {
    patterns: fuzzyResults.map(r => r.item),
    confidence: fuzzyResults.length > 0 ? 'medium' : 'low',
    matchedKeywords: [],
    suggestion: fuzzyResults.length === 0 ? 
      'Try searching for specific problems like "build trust", "handle errors", or "help users"' : 
      undefined,
  };
}

/**
 * Generate a helpful suggestion based on matched patterns
 */
function generateSuggestion(patterns: Pattern[], query: string): string {
  if (patterns.length === 0) return '';
  
  if (patterns.length === 1) {
    return `${patterns[0].title} is perfect for what you're building!`;
  }
  
  if (patterns.length === 2) {
    return `${patterns[0].title} and ${patterns[1].title} work great together.`;
  }
  
  if (query.includes('trust') || query.includes('explain')) {
    return 'Building trustworthy AI requires combining multiple patterns for the best experience.';
  }
  
  if (query.includes('confus') || query.includes('overwhelm')) {
    return 'Simplifying complex AI features helps users feel more confident and in control.';
  }
  
  if (query.includes('chat') || query.includes('conversation')) {
    return 'Great conversational AI combines natural dialogue with clear explanations.';
  }
  
  return `Found ${patterns.length} patterns that can help with your use case.`;
}

/**
 * Get example queries for display
 */
export const exampleQueries = [
  "How do I build trust in AI?",
  "My users are confused by features",
  "I want to make a chatbot",
  "Help users create content",
  "AI keeps making mistakes",
  "Users need step-by-step guidance",
];