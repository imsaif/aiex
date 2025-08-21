import { Pattern } from '../types';

// Dynamic pattern loader function
export async function getPattern(slug: string): Promise<Pattern | null> {
  try {
    const patternModules: Record<string, () => Promise<any>> = {
      'contextual-assistance': () => import('./patterns/patterns/contextual-assistance').then(m => m.contextualassistance),
      'progressive-disclosure': () => import('./patterns/patterns/progressive-disclosure').then(m => m.progressivedisclosure),
      'human-in-the-loop': () => import('./patterns/patterns/human-in-the-loop').then(m => m.humanintheloop),
      'explainable-ai': () => import('./patterns/patterns/explainable-ai').then(m => m.explainableai),
      'conversational-ui': () => import('./patterns/patterns/conversational-ui').then(m => m.conversationalui),
      'adaptive-interfaces': () => import('./patterns/patterns/adaptive-interfaces').then(m => m.adaptiveinterfaces),
      'multimodal-interaction': () => import('./patterns/patterns/multimodal-interaction').then(m => m.multimodalinteraction),
      'guided-learning': () => import('./patterns/patterns/guided-learning').then(m => m.guidedlearning),
    };

    if (patternModules[slug]) {
      return await patternModules[slug]();
    }
    
    return null;
  } catch (error) {
    console.error(`Failed to load pattern ${slug}:`, error);
    return null;
  }
}

// Lightweight pattern metadata only (no heavy code examples)
export const patternMetadata: Omit<Pattern, 'content'>[] = [
  {
    id: "contextual-assistance",
    title: "Contextual Assistance", 
    slug: "contextual-assistance",
    description: "Provide timely help and suggestions based on the user's current task, history, and needs without requiring explicit requests.",
    category: "Contextual Assistance",
    thumbnail: "/images/examples/Smart-compose_Taco_Tuesday.gif"
  },
  {
    id: "progressive-disclosure",
    title: "Progressive Disclosure",
    slug: "progressive-disclosure", 
    description: "Present information and functionality in layers to reduce cognitive load while maintaining access to advanced features.",
    category: "Progressive Disclosure",
    thumbnail: "/images/examples/notion-ai.gif"
  },
  {
    id: "human-in-the-loop",
    title: "Human-in-the-Loop",
    slug: "human-in-the-loop",
    description: "Keep humans involved in AI decision-making processes to ensure accuracy, fairness, and accountability.",
    category: "Human-in-the-Loop", 
    thumbnail: "/images/examples/perplexity-attribution.gif"
  },
  {
    id: "explainable-ai", 
    title: "Explainable AI",
    slug: "explainable-ai",
    description: "Make AI decisions transparent and understandable to users through clear explanations and reasoning.",
    category: "Explainable AI",
    thumbnail: "/images/examples/claude-thinking.gif" 
  },
  {
    id: "conversational-ui",
    title: "Conversational UI", 
    slug: "conversational-ui",
    description: "Enable natural language interactions between users and AI systems through chat interfaces.",
    category: "Conversational UI",
    thumbnail: "/images/examples/siri-conversation.gif"
  },
  {
    id: "adaptive-interfaces",
    title: "Adaptive Interfaces",
    slug: "adaptive-interfaces", 
    description: "Personalize user interfaces based on behavior, preferences, and context.",
    category: "Adaptive Interfaces",
    thumbnail: "/images/examples/spotify-adaptive.gif"
  },
  {
    id: "multimodal-interaction", 
    title: "Multimodal Interaction",
    slug: "multimodal-interaction",
    description: "Support multiple input methods like text, voice, gestures, and images for richer user experiences.",
    category: "Multimodal Interaction", 
    thumbnail: "/images/examples/applepencil.gif"
  },
  {
    id: "guided-learning",
    title: "Guided Learning",
    slug: "guided-learning",
    description: "Help users gradually learn complex systems through structured, progressive experiences.",
    category: "Guided Learning",
    thumbnail: "/images/examples/duolingo-adaptive.gif"
  }
];

// Legacy export for backward compatibility (lightweight version)
export const patterns: Pattern[] = patternMetadata.map(meta => ({
  ...meta,
  content: {
    problem: '',
    solution: '',  
    examples: [],
    guidelines: [],
    considerations: [],
    relatedPatterns: [],
    codeExamples: []
  }
}));

export default patterns;

