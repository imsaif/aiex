---
name: Test Generation
description: Generate comprehensive test suites, identify coverage gaps, and accelerate progress toward 70% test coverage goal with intelligent test recommendations
---

# Test Generation Skill

This skill helps you dramatically improve test coverage from the current 48% toward the 70% goal by intelligently generating tests where they're needed most and providing coverage analysis.

## When to Use This Skill

Claude will automatically invoke this skill when:
- You ask to "generate tests"
- You request "improve test coverage"
- You want to "add tests for components"
- You say "what tests should we write?"
- You mention "coverage gaps"

## Current Coverage Status

```
📊 Test Coverage Baseline
├── Total Tests: 481
├── Statement Coverage: 47.82%
├── Line Coverage: 48.28%
├── Function Coverage: 39%
├── Branch Coverage: 36.19%
├── Target: 70% (Need +22% improvement)
└── Estimated Untested Components: 15-20
```

## Available Testing Commands

```bash
# Run all tests
npm test

# Run tests in watch mode for development
npm run test:watch

# Generate coverage report (shows gaps)
npm run test:coverage

# Run only pattern data tests
npm run test:patterns

# Run only component tests
npm run test:components

# CI mode with coverage (no watch)
npm run test:ci
```

## Workflow: Generate Missing Tests

### Step 1: Identify Coverage Gaps
```bash
npm run test:coverage
```
Output shows:
- Which files have low coverage
- Which lines are uncovered
- Which branches need testing
- Which functions lack tests

### Step 2: Prioritize Tests by Impact
Tests to prioritize (highest impact first):

1. **UI Components** (high usage, visible impact)
   - Button, Card, Badge variants
   - Layout components (Header, Footer, Sidebar)
   - Form components

2. **Interactive Example Components** (demo components for patterns)
   - All 24 pattern example components
   - Demo interactions and state changes

3. **Context Providers** (critical state management)
   - PatternProvider
   - PatternContext consumers

4. **Custom Hooks** (reusable logic)
   - usePatterns, usePattern
   - usePatternsByCategory
   - useFavorites, useSearch

5. **Utility Functions** (pure logic)
   - Pattern validation helpers
   - Data transformation utilities
   - Filter and sort functions

6. **Edge Cases & Error Handling**
   - Invalid data handling
   - Error boundaries
   - Null/undefined handling

### Step 3: Generate Tests for a Component

For each component without sufficient tests:

#### Example: Generate tests for Button component
```bash
npm run generate-test
```
When prompted, specify:
- Component name: `Button`
- Component path: `src/components/ui/Button.tsx`
- Coverage target: 80%

#### Test File Location
Tests go here: `src/components/ui/__tests__/Button.test.tsx`

#### What to Include in Tests

**1. Rendering Tests**
```typescript
describe('Button', () => {
  it('renders with default props', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByText('Click me')).toBeInTheDocument()
  })

  it('renders with variant prop', () => {
    render(<Button variant="primary">Button</Button>)
    expect(screen.getByRole('button')).toHaveClass('variant-primary')
  })
})
```

**2. Interaction Tests**
```typescript
it('handles click events', () => {
  const handleClick = jest.fn()
  render(<Button onClick={handleClick}>Click</Button>)
  fireEvent.click(screen.getByRole('button'))
  expect(handleClick).toHaveBeenCalledTimes(1)
})
```

**3. Props Variation Tests**
```typescript
it('renders disabled state', () => {
  render(<Button disabled>Disabled</Button>)
  expect(screen.getByRole('button')).toBeDisabled()
})

it('renders loading state', () => {
  render(<Button loading>Loading</Button>)
  expect(screen.getByText('Loading')).toBeInTheDocument()
})
```

**4. Accessibility Tests**
```typescript
it('has proper aria attributes', () => {
  render(<Button aria-label="Close dialog">×</Button>)
  expect(screen.getByRole('button')).toHaveAttribute('aria-label')
})
```

**5. Snapshot Tests**
```typescript
it('matches snapshot', () => {
  const { container } = render(<Button>Button</Button>)
  expect(container).toMatchSnapshot()
})
```

### Step 4: Run Coverage for Component

After creating tests:

```bash
# Test specific component
npm test -- --testPathPattern="Button"

# Check coverage for component
npm run test:coverage -- --testPathPattern="Button"
```

Expected: 80%+ coverage for that component

### Step 5: Generate Tests for Pattern Demo Components

Each of the 24 pattern example components needs tests:

**Pattern Demo Test Template**
```typescript
// src/components/examples/__tests__/[PatternName]Example.test.tsx

describe('[PatternName]Example', () => {
  it('renders without crashing', () => {
    render(<[PatternName]Example />)
    expect(screen.getByTestId('[pattern-name]-demo')).toBeInTheDocument()
  })

  it('demonstrates the pattern correctly', () => {
    render(<[PatternName]Example />)
    // Test pattern-specific behaviors
    // Verify interactive demo works
    // Check all interactive elements
  })

  it('handles user interactions', () => {
    render(<[PatternName]Example />)
    // Test clicks, inputs, etc.
    // Verify state changes
    // Check visual updates
  })

  it('matches snapshot', () => {
    const { container } = render(<[PatternName]Example />)
    expect(container).toMatchSnapshot()
  })
})
```

## Test Generation Best Practices

### ✅ Do's

1. **Test user interactions** - Click buttons, fill forms, navigate
2. **Test state changes** - Props changes, hook updates, re-renders
3. **Test error cases** - Invalid inputs, failures, edge cases
4. **Test accessibility** - ARIA attributes, keyboard navigation, screen readers
5. **Use semantic queries** - getByRole, getByLabelText (not getByTestId)
6. **Test behavior, not implementation** - What user sees/does, not internal details
7. **Mock external dependencies** - Next.js Image, router, API calls, animations
8. **Test one thing per test** - Keep tests focused and descriptive

### ❌ Don'ts

1. **Don't test library code** - Jest, React, Tailwind already tested
2. **Don't test trivial getters** - Simple return statements
3. **Don't ignore accessibility** - Always test ARIA attributes
4. **Don't create brittle tests** - Avoid testing implementation details
5. **Don't skip snapshot tests** - Use for UI consistency verification
6. **Don't forget edge cases** - Empty states, errors, loading, disabled

## Mocking Reference

Your project has mocking infrastructure for:

```javascript
// Mock Next.js components
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props) => <img {...props} />
}))

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: { div: ({ children, ...props }) => <div {...props}>{children}</div> },
  AnimatePresence: ({ children }) => children
}))

// Mock React hooks
jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useContext: jest.fn()
}))
```

## Coverage Gap Analysis

### Current Gaps by Category

| Category | Files | Coverage | Gap |
|----------|-------|----------|-----|
| UI Components | 12 | 65% | +5% |
| Example Components | 24 | 40% | +30% ⚠️ |
| Contexts | 3 | 55% | +15% |
| Hooks | 8 | 50% | +20% |
| Utilities | 15 | 45% | +25% |
| Data Validation | 5 | 83% | +0% ✅ |

**Highest Impact**: Example components (24 files at 40% = 30% gap opportunity)

## Generate All Missing Tests Command

```bash
npm run generate-all-tests
```

This command:
1. Identifies all components without tests
2. Prioritizes by coverage impact
3. Generates test files automatically
4. Runs tests to verify
5. Reports coverage improvements

## Test Coverage Goals

### Phase 1: Quick Wins (48% → 55%)
- Generate tests for high-usage UI components
- Add tests for pattern demo components (top 6)
- Estimated: 5-10 hours

### Phase 2: Comprehensive (55% → 65%)
- Complete remaining pattern demo tests (18 more)
- Add hook tests
- Add utility tests
- Estimated: 15-20 hours

### Phase 3: Target (65% → 70%)
- Edge case and error scenario tests
- Accessibility tests
- Integration tests
- Estimated: 10-15 hours

## Running Tests During Development

```bash
# Watch mode - auto-rerun on changes
npm run test:watch

# Test specific file
npm test -- Button.test.tsx

# Test specific pattern
npm test -- --testPathPattern="adaptive"

# Update snapshots (after intentional UI changes)
npm test -- -u
```

## Commands Reference

```bash
# List components without sufficient tests
npm run list-untested

# Generate tests for specific component
npm run generate-test

# Generate all missing tests
npm run generate-all-tests

# Run all tests with coverage
npm run test:coverage

# CI mode (used in deploy pipeline)
npm run test:ci
```

## Success Metrics

Track progress toward 70% goal:

- ✅ 48% → 55% (Quick Wins phase)
- ✅ 55% → 65% (Comprehensive phase)
- ✅ 65% → 70% (Target phase) 🎉

## Integration with Pattern Development

When working on the 12 patterns requiring updates (via Pattern Development skill):
- Each pattern's demo component needs tests
- Include test generation in checklist
- Tests help validate pattern implementation
- Contributes to overall coverage goal

---

**Goal**: Reach 70% test coverage by systematically testing components with highest impact first, focusing on user interactions and behavior verification.
