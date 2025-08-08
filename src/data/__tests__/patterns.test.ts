import { patterns } from '../patterns'
import { safeValidatePatterns } from '../../schemas/pattern.schema'
import { testPatternStructure } from '../../utils/test-utils'

describe('Patterns Data', () => {
  describe('Data Validation', () => {
    it('should have at least one pattern', () => {
      expect(patterns).toBeDefined()
      expect(Array.isArray(patterns)).toBe(true)
      expect(patterns.length).toBeGreaterThan(0)
    })

    it('should validate all patterns against schema', () => {
      const result = safeValidatePatterns(patterns)
      
      if (!result.success) {
        console.error('Pattern validation errors:', result.error.issues)
      }
      
      expect(result.success).toBe(true)
    })

    it('should have unique pattern IDs', () => {
      const ids = patterns.map(pattern => pattern.id)
      const uniqueIds = new Set(ids)
      expect(uniqueIds.size).toBe(ids.length)
    })

    it('should have unique pattern slugs', () => {
      const slugs = patterns.map(pattern => pattern.slug)
      const uniqueSlugs = new Set(slugs)
      expect(uniqueSlugs.size).toBe(slugs.length)
    })

    it('should have consistent ID and slug format', () => {
      patterns.forEach(pattern => {
        expect(pattern.id).toMatch(/^[a-z0-9-]+$/)
        expect(pattern.slug).toMatch(/^[a-z0-9-]+$/)
        expect(pattern.id).toBe(pattern.slug) // They should match in this project
      })
    })
  })

  describe('Content Quality', () => {
    it('should have meaningful descriptions', () => {
      patterns.forEach(pattern => {
        expect(pattern.description.length).toBeGreaterThan(20)
        expect(pattern.description.length).toBeLessThanOrEqual(200)
      })
    })

    it('should have comprehensive content', () => {
      patterns.forEach(pattern => {
        expect(pattern.content.problem.length).toBeGreaterThan(10)
        expect(pattern.content.solution.length).toBeGreaterThan(10)
        expect(pattern.content.guidelines.length).toBeGreaterThan(0)
        expect(pattern.content.considerations.length).toBeGreaterThan(0)
      })
    })

    it('should have valid examples', () => {
      patterns.forEach(pattern => {
        pattern.content.examples.forEach(example => {
          expect(example.title).toBeTruthy()
          expect(example.description).toBeTruthy()
          expect(example.image).toBeTruthy()
          expect(example.altText).toBeTruthy()
          expect(example.image).toMatch(/\.(jpg|jpeg|png|webp|gif)$/i)
        })
      })
    })

    it('should have valid code examples when present', () => {
      patterns.forEach(pattern => {
        if (pattern.content.codeExamples) {
          pattern.content.codeExamples.forEach(codeExample => {
            expect(codeExample.title).toBeTruthy()
            expect(codeExample.description).toBeTruthy()
            expect(codeExample.code).toBeTruthy()
            expect(codeExample.language).toBeTruthy()
          })
        }
      })
    })

    it('should have valid thumbnails', () => {
      patterns.forEach(pattern => {
        expect(pattern.thumbnail).toBeTruthy()
        expect(pattern.thumbnail).toMatch(/\.(jpg|jpeg|png|webp|gif)$/i)
      })
    })
  })

  describe('Individual Pattern Structure', () => {
    patterns.forEach(pattern => {
      describe(`Pattern: ${pattern.title}`, () => {
        testPatternStructure(pattern)
      })
    })
  })

  describe('Cross-Pattern Consistency', () => {
    it('should have consistent category naming', () => {
      const categories = patterns.map(pattern => pattern.category)
      const uniqueCategories = new Set(categories)
      
      // Check that categories follow a consistent format (allow spaces and capital letters)
      uniqueCategories.forEach(category => {
        expect(category).toMatch(/^[A-Z][a-zA-Z\s&-]+$/) // Allow spaces, ampersands, and hyphens
      })
    })

    it('should have valid related pattern references', () => {
      patterns.forEach(pattern => {
        pattern.content.relatedPatterns.forEach(relatedPattern => {
          // Related patterns are stored as display names, not IDs
          expect(relatedPattern).toMatch(/^[A-Z][a-zA-Z\s&-]+$/) // Allow spaces, ampersands, and hyphens
          expect(relatedPattern.length).toBeGreaterThan(0)
        })
      })
    })
  })
}) 