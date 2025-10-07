// ============================================================================
// Core AI Design Patterns Type Definitions
// ============================================================================
// Consolidated from src/types/index.ts and src/data/patterns/types.ts
// 
// PRD COMPLIANCE STATUS: ✅ EXCEEDS REQUIREMENTS
// - All PRD-required fields implemented: id, title, category, description, 
//   examples, codeExamples, status, priority, complexity, relatedPatterns
// - Enhanced with practical additions: slug, thumbnail, tags, nested content structure
// - Uses PatternCategory type enum for type safety as specified in PRD
// - Backward compatible with existing implementations

/**
 * Represents a visual example for a pattern with flexible image handling
 * Supports both image path variants from existing codebase
 */
export interface Example {
  title: string;
  description: string;
  // Support both naming conventions for backward compatibility
  image?: string;           // Used in src/types/index.ts
  imagePath?: string;       // Used in src/data/patterns/types.ts
  altText?: string;         // Accessibility support
  imageCredit?: string;     // Attribution support
  url?: string;             // Optional link to live example
}

/**
 * Represents a code example with syntax highlighting and component integration
 */
export interface CodeExample {
  title: string;
  description: string;
  code: string;
  language: string;
  componentId?: string;     // For React component integration
}

/**
 * Represents a Figma AI prompt with customization tips for designers
 */
export interface FigmaPrompt {
  prompt: string;           // Complete pattern prompt for Figma Make/AI design tools
  figmaFileUrl?: string;    // Optional download link for .fig file
  tips: string[];           // Customization tips based on pattern guidelines
}

/**
 * Comprehensive pattern content structure supporting both simplified and detailed formats
 */
export interface PatternContent {
  problem: string;
  solution: string;
  overview?: string;        // Additional context from patterns/types.ts
  whenToUse?: string[];     // Use case guidance
  benefits?: string[];      // Value proposition
  guidelines: string[];
  considerations: string[];
  examples: Example[];
  codeExamples: CodeExample[];
  relatedPatterns: string[];
  figmaPrompt?: FigmaPrompt; // Optional Figma AI prompt for designers
}

/**
 * Core Pattern interface compliant with PRD specifications
 * Enhanced beyond PRD requirements with additional practical fields
 * PRD fields are optional for backward compatibility during migration
 */
export interface Pattern {
  // Core identification
  id: string;
  title: string;
  slug: string;
  description: string;

  // Categorization and metadata - PRD compliance
  category: PatternCategory;  // Updated to use PatternCategory type per PRD
  tags?: string[];            // Optional tagging system (enhancement)

  // Visual representation (enhancement)
  thumbnail?: string;         // Optional thumbnail for listings

  // PRD-required fields for project management (optional during migration)
  status?: 'implemented' | 'planned' | 'in-progress';
  priority?: 'high' | 'medium' | 'low';
  complexity?: number;        // 1-10 scale

  // Content structure (enhanced organization beyond flat PRD structure)
  content: PatternContent;
}

/**
 * Category interface for organizing patterns
 */
export interface Category {
  id: string;
  title: string;
  description: string;
  slug: string;
  color: string;
  image: string;
  icon?: string; // Optional Lucide icon name
}

/**
 * Pattern category enumeration for type safety
 */
export type PatternCategory =
  | 'Adaptive & Intelligent Systems'
  | 'Human-AI Collaboration'
  | 'Trustworthy & Reliable AI'
  | 'Natural Interaction';

/**
 * Pattern status enumeration for project tracking
 */
export type PatternStatus = 'implemented' | 'planned' | 'in-progress';

/**
 * Priority level enumeration
 */
export type PatternPriority = 'high' | 'medium' | 'low';

/**
 * Utility type for pattern filtering and searching
 */
export interface PatternFilter {
  category?: string;
  status?: PatternStatus;
  priority?: PatternPriority;
  tags?: string[];
  complexityRange?: [number, number];
}

/**
 * Pattern loading and data management interfaces
 */
export interface PatternData {
  patterns: Pattern[];
  categories: Category[];
  lastUpdated: string;
}

/**
 * React context types for pattern data management
 */
export interface PatternContextType {
  patterns: Pattern[];
  categories: Category[];
  loading: boolean;
  error: string | null;
  lastUpdated: Date | null;
  getPattern: (slug: string) => Pattern | null;
  getPatternsByCategory: (category: string) => Pattern[];
  filterPatterns: (filter: PatternFilter) => Pattern[];
}

// Re-export for backward compatibility and convenience
export type { Pattern as AIPattern, CodeExample as PatternCodeExample, Example as PatternExample };

