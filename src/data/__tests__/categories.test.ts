import categories from '../categories'
import { safeValidateCategories } from '../../schemas/pattern.schema'

describe('Categories Data', () => {
  describe('Data Validation', () => {
    it('should have at least one category', () => {
      expect(categories).toBeDefined()
      expect(Array.isArray(categories)).toBe(true)
      expect(categories.length).toBeGreaterThan(0)
    })

    it('should validate all categories against schema', () => {
      const result = safeValidateCategories(categories)
      
      if (!result.success) {
        console.error('Category validation errors:', result.error.issues)
      }
      
      expect(result.success).toBe(true)
    })

    it('should have unique category IDs', () => {
      const ids = categories.map(category => category.id)
      const uniqueIds = new Set(ids)
      expect(uniqueIds.size).toBe(ids.length)
    })

    it('should have unique category slugs', () => {
      const slugs = categories.map(category => category.slug)
      const uniqueSlugs = new Set(slugs)
      expect(uniqueSlugs.size).toBe(slugs.length)
    })

    it('should have consistent ID and slug format', () => {
      categories.forEach(category => {
        expect(category.id).toMatch(/^[a-z0-9-]+$/)
        expect(category.slug).toMatch(/^[a-z0-9-]+$/)
      })
    })
  })

  describe('Content Quality', () => {
    it('should have meaningful titles', () => {
      categories.forEach(category => {
        expect(category.title.length).toBeGreaterThan(3)
        expect(category.title.length).toBeLessThan(50)
      })
    })

    it('should have meaningful descriptions', () => {
      categories.forEach(category => {
        expect(category.description.length).toBeGreaterThan(10)
        expect(category.description.length).toBeLessThan(300)
      })
    })

    it('should have valid colors', () => {
      categories.forEach(category => {
        expect(category.color).toBeTruthy()
        // Should be a valid CSS color (hex, rgb, or named color)
        expect(category.color).toMatch(/^(#[0-9a-fA-F]{3,6}|rgb\(|rgba\(|[a-z]+)/)
      })
    })

    it('should have valid images', () => {
      categories.forEach(category => {
        expect(category.image).toBeTruthy()
        expect(category.image).toMatch(/\.(jpg|jpeg|png|webp|gif|svg)$/i)
      })
    })
  })

  describe('Individual Category Structure', () => {
    categories.forEach(category => {
      describe(`Category: ${category.title}`, () => {
        it('should have all required fields', () => {
          expect(category.id).toBeTruthy()
          expect(category.title).toBeTruthy()
          expect(category.description).toBeTruthy()
          expect(category.slug).toBeTruthy()
          expect(category.color).toBeTruthy()
          expect(category.image).toBeTruthy()
        })

        it('should have consistent ID and slug', () => {
          expect(category.id).toBe(category.slug)
        })
      })
    })
  })
}) 