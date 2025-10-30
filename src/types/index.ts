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
 * Represents a design resource for implementing a pattern
 */
export interface DesignResource {
  title: string;            // Resource title
  description: string;      // Brief description of the resource
  type: 'article' | 'video' | 'tool' | 'library' | 'documentation' | 'case-study' | 'template';
  url: string;              // Link to the resource
  author?: string;          // Optional author/creator
  platform?: string;        // Optional platform (e.g., "Medium", "YouTube", "GitHub")
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
  designResources?: DesignResource[]; // Optional design resources for implementation
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

// ============================================================================
// Designer Guides Type Definitions
// ============================================================================
// Guides for designers to understand how to use AI tools in their workflow

/**
 * Represents a single lesson within a guide
 */
export interface GuideLesson {
  id: string;
  title: string;
  content: string; // HTML or Markdown content for the lesson
  duration: number; // in minutes
  order: number; // Lesson sequence number
  module?: string; // Module grouping: "setup" | "prototype" | "github" | "practices"
  iconType?: string; // Icon identifier for visual representation
}

/**
 * Represents a course with sequential lessons (like Uxcel's course structure)
 */
export interface Course {
  // Core identification
  id: string;
  title: string;
  slug: string;
  description: string;
  excerpt?: string;

  // Categorization and metadata
  skillLevel: 'Beginner' | 'Intermediate' | 'Advanced';
  designDomain: string;

  // Content metadata
  totalDuration: number; // in minutes (sum of all lesson durations)
  author?: string;
  publishedDate: string; // ISO date string
  lastUpdatedDate?: string; // ISO date string

  // Visual representation
  thumbnail?: string;
  tags?: string[];

  // Lesson structure - all lessons in one course
  lessons: GuideLesson[]; // All course lessons

  // Content
  content: string; // Markdown content with course overview

  // Relations
  relatedPatterns?: string[]; // Pattern slugs
}

/**
 * Represents a designer guide for using AI tools (legacy - kept for backward compatibility)
 */
export interface Guide {
  // Core identification
  id: string;
  title: string;
  slug: string;
  description: string;
  excerpt?: string;

  // Categorization and metadata
  tool: 'Claude Code' | 'Cursor' | 'GitHub' | 'Figma' | 'Other';
  useCase: string; // e.g., "Prototyping", "Design Systems", "Collaboration"
  skillLevel: 'Beginner' | 'Intermediate' | 'Advanced';
  designDomain: string; // e.g., "UX Design", "UI Design", "Product Design"

  // Content metadata
  readTime: number; // in minutes
  author?: string;
  publishedDate: string; // ISO date string
  lastUpdatedDate?: string; // ISO date string

  // Visual representation
  thumbnail?: string;
  tags?: string[];

  // Lesson structure (new gamification feature)
  lessons?: GuideLesson[]; // Optional lesson breakdown for gamified learning
  lessonCount?: number; // Cached lesson count for quick access

  // Content
  content: string; // Markdown content

  // Relations
  relatedPatterns?: string[]; // Pattern slugs
  relatedGuides?: string[]; // Guide slugs
}

/**
 * Guide category for organizing guides
 */
export type GuideTool = 'Claude Code' | 'Cursor' | 'GitHub' | 'GitHub Copilot' | 'Replit AI' | 'V0 by Vercel' | 'Figma' | 'Other';
export type GuideSkillLevel = 'Beginner' | 'Intermediate' | 'Advanced';

/**
 * Utility type for guide filtering and searching
 */
export interface GuideFilter {
  tool?: GuideTool;
  skillLevel?: GuideSkillLevel;
  designDomain?: string;
  tags?: string[];
  searchQuery?: string;
}

/**
 * Guide loading and data management interfaces
 */
export interface GuideData {
  guides: Guide[];
  lastUpdated: string;
}

/**
 * React context types for guide data management
 */
export interface GuideContextType {
  guides: Guide[];
  loading: boolean;
  error: string | null;
  lastUpdated: Date | null;
  getGuide: (slug: string) => Guide | null;
  filterGuides: (filter: GuideFilter) => Guide[];
  searchGuides: (query: string) => Guide[];
}

