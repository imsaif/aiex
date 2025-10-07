import { z } from 'zod'

// Pattern category enum schema - matching TypeScript PatternCategory
const PatternCategorySchema = z.enum([
  'Contextual Assistance',
  'Progressive Disclosure',
  'Human-in-the-Loop',
  'Conversational UI',
  'Explainable AI',
  'Guided Learning',
  'Adaptive Interfaces',
  'Multimodal Interaction',
  'Augmented Creation',
  'Responsible AI Design',
  'Error Recovery',
  'Collaborative AI',
  'Ambient Intelligence',
  'Safe Exploration'
])

// Pattern status enum schema
const PatternStatusSchema = z.enum(['implemented', 'planned', 'in-progress'])

// Pattern priority enum schema  
const PatternPrioritySchema = z.enum(['high', 'medium', 'low'])

// URL validation helper
const urlSchema = z.string().url().optional().or(z.literal(''))

// Image path validation helper - supports relative paths and URLs
const imagePathSchema = z.string().min(1, 'Image path is required').refine(
  (path) => {
    // Allow relative paths starting with / or URLs
    return path.startsWith('/') || path.startsWith('http://') || path.startsWith('https://')
  },
  { message: 'Image path must be a relative path starting with / or a valid URL' }
)

// File extension validation for images
const imageExtensionSchema = z.string().refine(
  (path) => /\.(jpg|jpeg|png|webp|gif|svg)$/i.test(path),
  { message: 'Image must have a valid extension: jpg, jpeg, png, webp, gif, or svg' }
)

// Combined image validation
const validatedImageSchema = imagePathSchema.and(imageExtensionSchema)

// Example schema - matching TypeScript Example interface exactly
export const ExampleSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title must be under 100 characters'),
  description: z.string().min(1, 'Description is required').max(300, 'Description must be under 300 characters'),
  image: validatedImageSchema,
  altText: z.string().min(1, 'Alt text is required for accessibility').max(200, 'Alt text must be under 200 characters'),
  imageCredit: z.string().optional(),
  url: urlSchema,
})

// Code example schema - matching TypeScript CodeExample interface exactly
export const CodeExampleSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title must be under 100 characters'),
  description: z.string().min(1, 'Description is required').max(300, 'Description must be under 300 characters'),
  code: z.string().min(1, 'Code is required'),
  language: z.string().min(1, 'Language is required').regex(/^[a-z]+$/, 'Language must be lowercase'),
  componentId: z.string().optional(),
})

// Figma prompt schema - matching TypeScript FigmaPrompt interface exactly
export const FigmaPromptSchema = z.object({
  prompt: z.string().min(100, 'Prompt must be at least 100 characters').max(800, 'Prompt must be under 800 characters'),
  figmaFileUrl: z.string().url('Must be a valid URL').optional(),
  tips: z.array(z.string().min(1, 'Tip cannot be empty')).min(2, 'At least 2 tips are required').max(6, 'Maximum 6 tips allowed'),
})

// Pattern content schema - matching TypeScript PatternContent interface exactly
export const PatternContentSchema = z.object({
  problem: z.string().min(10, 'Problem description must be at least 10 characters').max(1000, 'Problem description too long'),
  solution: z.string().min(10, 'Solution description must be at least 10 characters').max(1000, 'Solution description too long'),
  overview: z.string().optional(),
  whenToUse: z.array(z.string().min(1)).optional(),
  benefits: z.array(z.string().min(1)).optional(),
  guidelines: z.array(z.string().min(1, 'Guideline cannot be empty')).min(1, 'At least one guideline is required'),
  considerations: z.array(z.string().min(1, 'Consideration cannot be empty')).min(1, 'At least one consideration is required'),
  examples: z.array(ExampleSchema).min(1, 'At least one example is required'),
  codeExamples: z.array(CodeExampleSchema).default([]),
  relatedPatterns: z.array(z.string().min(1)).default([]),
  figmaPrompt: FigmaPromptSchema.optional(),
})

// Main pattern schema - matching TypeScript Pattern interface exactly  
export const PatternSchema = z.object({
  id: z.string().min(1, 'ID is required').regex(/^[a-z0-9-]+$/, 'ID must be lowercase with hyphens only'),
  title: z.string().min(1, 'Title is required').max(100, 'Title must be under 100 characters'),
  slug: z.string().min(1, 'Slug is required').regex(/^[a-z0-9-]+$/, 'Slug must be lowercase with hyphens only'),
  description: z.string().min(20, 'Description must be at least 20 characters').max(200, 'Description must be under 200 characters'),
  category: PatternCategorySchema,
  tags: z.array(z.string().min(1)).optional(),
  thumbnail: validatedImageSchema.optional(),
  status: PatternStatusSchema.optional(),
  priority: PatternPrioritySchema.optional(), 
  complexity: z.number().min(1).max(10).optional(),
  content: PatternContentSchema,
}).refine(
  (pattern) => pattern.id === pattern.slug,
  { message: 'Pattern ID and slug must match', path: ['slug'] }
)

// Category schema - matching TypeScript Category interface exactly
export const CategorySchema = z.object({
  id: z.string().min(1, 'ID is required').regex(/^[a-z0-9-]+$/, 'ID must be lowercase with hyphens only'),
  title: z.string().min(1, 'Title is required').max(100, 'Title must be under 100 characters'),
  description: z.string().min(1, 'Description is required').max(300, 'Description must be under 300 characters'),
  slug: z.string().min(1, 'Slug is required').regex(/^[a-z0-9-]+$/, 'Slug must be lowercase with hyphens only'),
  color: z.string().min(1, 'Color is required').refine(
    (color) => {
      // Accept hex colors
      if (/^#[0-9A-F]{6}$/i.test(color)) return true
      // Accept common color names (Tailwind CSS colors)
      const validColors = [
        'blue', 'green', 'amber', 'purple', 'sky', 'gray', 'indigo', 
        'emerald', 'orange', 'rose', 'violet', 'lime', 'cyan', 'red',
        'yellow', 'teal', 'pink', 'slate', 'zinc', 'neutral', 'stone'
      ]
      return validColors.includes(color.toLowerCase())
    },
    { message: 'Color must be a valid hex color or a common color name' }
  ),
  image: validatedImageSchema,
})

// Array schemas
export const PatternsArraySchema = z.array(PatternSchema)
export const CategoriesArraySchema = z.array(CategorySchema)

// Type exports - importing from types for consistency
import type {
  Example,
  CodeExample, 
  PatternContent,
  Pattern as PatternType,
  Category,
  PatternCategory,
  PatternStatus,
  PatternPriority
} from '../types'

export type {
  Example,
  CodeExample, 
  PatternContent,
  Category,
  PatternCategory,
  PatternStatus,
  PatternPriority
}

export type Pattern = PatternType
export type PatternsArray = z.infer<typeof PatternsArraySchema>
export type CategoriesArray = z.infer<typeof CategoriesArraySchema>

// Enhanced validation functions with better error handling
export const validatePattern = (pattern: unknown): PatternType => {
  try {
    return PatternSchema.parse(pattern)
  } catch (error) {
    console.error('Pattern validation failed:', error)
    throw error
  }
}

export const validatePatterns = (patterns: unknown): PatternType[] => {
  try {
    return PatternsArraySchema.parse(patterns)
  } catch (error) {
    console.error('Patterns array validation failed:', error)
    throw error
  }
}

export const validateCategory = (category: unknown): Category => {
  try {
    return CategorySchema.parse(category)
  } catch (error) {
    console.error('Category validation failed:', error)
    throw error
  }
}

export const validateCategories = (categories: unknown): Category[] => {
  try {
    return CategoriesArraySchema.parse(categories)
  } catch (error) {
    console.error('Categories array validation failed:', error)
    throw error
  }
}

// Safe validation functions that return results instead of throwing
export const safeValidatePattern = (pattern: unknown) => {
  return PatternSchema.safeParse(pattern)
}

export const safeValidatePatterns = (patterns: unknown) => {
  return PatternsArraySchema.safeParse(patterns)
}

export const safeValidateCategory = (category: unknown) => {
  return CategorySchema.safeParse(category)
}

export const safeValidateCategories = (categories: unknown) => {
  return CategoriesArraySchema.safeParse(categories)
}

// Development helper function
export const validatePatternWithDetails = (pattern: unknown) => {
  const result = safeValidatePattern(pattern)
  if (!result.success) {
    console.group('Pattern Validation Errors:')
    result.error.issues.forEach((issue, index) => {
      console.error(`${index + 1}. ${issue.path.join('.')}: ${issue.message}`)
    })
    console.groupEnd()
  }
  return result
} 