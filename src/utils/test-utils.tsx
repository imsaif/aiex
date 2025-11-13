import React, { ReactElement } from 'react'
import { render, RenderOptions } from '@testing-library/react'
import { Pattern, Example, CodeExample } from '../schemas/pattern.schema'

// Custom render function that includes providers
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <div data-testid="test-wrapper">
      {children}
    </div>
  )
}

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>,
) => render(ui, { wrapper: AllTheProviders, ...options })

export * from '@testing-library/react'
export { customRender as render }

// Mock data factories for testing - updated to match existing structure
export const createMockExample = (overrides: Partial<Example> = {}): Example => ({
  title: 'Test Example',
  description: 'This is a test example description',
  image: '/images/test-example.webp',
  altText: 'Test example image',
  url: 'https://example.com',
  ...overrides,
})

export const createMockCodeExample = (overrides: Partial<CodeExample> = {}): CodeExample => ({
  code: 'const test = "hello world";',
  language: 'javascript',
  title: 'Test Code Example',
  description: 'This is a test code example',
  componentId: 'test-component',
  ...overrides,
})

export const createMockPattern = (overrides: Partial<Pattern> = {}): Pattern => ({
  id: 'test-pattern',
  title: 'Test Pattern',
  slug: 'test-pattern',
  category: 'Performance & Efficiency',
  description: 'This is a test pattern for unit testing purposes',
  thumbnail: '/images/test-thumbnail.webp',
  content: {
    problem: 'This is a test problem description',
    solution: 'This is a test solution description',
    examples: [createMockExample()],
    codeExamples: [createMockCodeExample()],
    guidelines: ['Write clear tests', 'Use descriptive names'],
    considerations: ['Test coverage', 'Performance impact'],
    relatedPatterns: ['related-pattern-1', 'related-pattern-2'],
  },
  ...overrides,
})

// Async test helpers
export const waitForElementToAppear = async (getByTestId: (id: string) => HTMLElement, testId: string) => {
  const element = await new Promise<HTMLElement>((resolve) => {
    const checkElement = () => {
      try {
        const el = getByTestId(testId)
        if (el) resolve(el)
      } catch {
        setTimeout(checkElement, 100)
      }
    }
    checkElement()
  })
  return element
}

// Mock intersection observer for components that use it
export const mockIntersectionObserver = () => {
  const mockIntersectionObserver = jest.fn()
  mockIntersectionObserver.mockReturnValue({
    observe: () => null,
    unobserve: () => null,
    disconnect: () => null,
  })
  window.IntersectionObserver = mockIntersectionObserver
}

// Mock resize observer for components that use it
export const mockResizeObserver = () => {
  const mockResizeObserver = jest.fn()
  mockResizeObserver.mockReturnValue({
    observe: () => null,
    unobserve: () => null,
    disconnect: () => null,
  })
  window.ResizeObserver = mockResizeObserver
}

// Test data validation helpers
export const validateTestPattern = (pattern: Pattern) => {
  expect(pattern.id).toBeTruthy()
  expect(pattern.title).toBeTruthy()
  expect(pattern.slug).toBeTruthy()
  expect(pattern.category).toBeTruthy()
  expect(pattern.description).toBeTruthy()
  expect(pattern.thumbnail).toBeTruthy()
  expect(pattern.content).toBeTruthy()
}

// Common test scenarios - updated to match existing structure
export const testPatternStructure = (pattern: Pattern) => {
  describe('Pattern Structure', () => {
    it('should have required fields', () => {
      validateTestPattern(pattern)
    })

    it('should have valid content structure', () => {
      expect(pattern.content.problem).toBeTruthy()
      expect(pattern.content.solution).toBeTruthy()
      expect(Array.isArray(pattern.content.examples)).toBe(true)
      expect(Array.isArray(pattern.content.guidelines)).toBe(true)
      expect(Array.isArray(pattern.content.considerations)).toBe(true)
      expect(Array.isArray(pattern.content.relatedPatterns)).toBe(true)
    })

    it('should have at least one example', () => {
      expect(pattern.content.examples.length).toBeGreaterThan(0)
    })

    it('should have valid examples structure', () => {
      pattern.content.examples.forEach(example => {
        expect(example.title).toBeTruthy()
        expect(example.description).toBeTruthy()
        expect(example.image).toBeTruthy()
        expect(example.altText).toBeTruthy()
      })
    })

    if (pattern.content.codeExamples) {
      it('should have valid code examples structure', () => {
        pattern.content.codeExamples!.forEach(codeExample => {
          expect(codeExample.title).toBeTruthy()
          expect(codeExample.description).toBeTruthy()
          expect(codeExample.code).toBeTruthy()
          expect(codeExample.language).toBeTruthy()
        })
      })
    }
  })
} 