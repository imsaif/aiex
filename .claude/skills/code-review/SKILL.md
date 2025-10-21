---
name: Code Quality & Review
description: Enforce code standards, validate against project patterns, review code quality, and maintain consistent TypeScript strict mode compliance across all components
---

# Code Quality & Review Skill

This skill systematically reviews code against your project's high standards, ensures TypeScript strict mode compliance, validates Zod schema usage, and maintains consistency across all patterns and components.

## When to Use This Skill

Claude will automatically invoke this skill when:
- You ask to "review this code"
- You request "code quality check"
- You want to "verify code standards"
- You say "validate implementation"
- You mention "type safety review"

## Code Standards Your Project Follows

```
🎯 Project Code Standards
├── TypeScript
│   ├── Strict mode enabled (strict: true)
│   ├── No implicit any types
│   ├── All imports properly typed
│   ├── Return types explicitly declared
│   └── Generic types parameterized
├── React Best Practices
│   ├── Functional components only
│   ├── Custom hooks for logic
│   ├── Proper hook dependencies
│   ├── Memoization where needed
│   └── Error boundaries for sections
├── Component Patterns
│   ├── Single responsibility principle
│   ├── Props interfaces defined
│   ├── Default props documented
│   ├── PropTypes or TypeScript validation
│   └── Accessibility compliance
├── Data Validation
│   ├── Zod schemas for all data
│   ├── Safe parsing functions
│   ├── Error handling for invalid data
│   └── Type inference from schemas
├── Styling
│   ├── Tailwind CSS only (no inline CSS)
│   ├── Design system colors/spacing
│   ├── Dark mode support (dark: prefix)
│   ├── Responsive design
│   └── Consistent component styling
├── Testing Requirements
│   ├── Unit tests for components
│   ├── Interaction tests for demos
│   ├── Snapshot tests for UI
│   ├── 80%+ coverage per component
│   └── Accessibility tests included
├── Naming Conventions
│   ├── Components: PascalCase
│   ├── Hooks: camelCase (use prefix)
│   ├── Utilities: camelCase
│   ├── Constants: UPPER_SNAKE_CASE
│   ├── Files: kebab-case or match export
│   └── Directories: kebab-case
├── Import Organization
│   ├── React imports first
│   ├── Next.js imports second
│   ├── Third-party imports third
│   ├── Local imports last
│   ├── Absolute paths from @/
│   └── Alphabetically sorted
└── Documentation
    ├── JSDoc comments for complex logic
    ├── Type annotations for clarity
    ├── Example usage in comments
    ├── TODO comments for known issues
    └── Component purpose documented
```

## Code Review Workflow

### Step 1: Understand Project Architecture

Key architectural patterns:

```typescript
// Pattern 1: Pattern-Centric Data Architecture
src/data/patterns/patterns/[pattern-slug]/
├── index.ts                    // Main pattern data
├── code-examples.ts           // Working code examples
├── guidelines.ts              // Best practices
└── considerations.ts          // Trade-offs

// Pattern 2: Context-Based State Management
src/contexts/PatternContext.tsx // Global state
+ usePatterns hooks            // Custom hooks

// Pattern 3: Component Organization
src/components/
├── ui/                         // Design system
├── examples/                   // Pattern demos
├── sections/                   // Page sections
├── layout/                     // Layout components
└── providers/                  // Context providers

// Pattern 4: Type-Safe Schemas
src/schemas/
└── pattern.schema.ts           // Zod validation
```

### Step 2: Review TypeScript Type Safety

```typescript
// ❌ BAD - Implicit any, no return type
const processPattern = (data) => {
  return data.map(p => p.name)
}

// ✅ GOOD - Explicit types, return type
interface Pattern {
  id: string
  name: string
  slug: string
}

const processPattern = (data: Pattern[]): string[] => {
  return data.map((p) => p.name)
}
```

**Type Safety Checklist:**
- [ ] All parameters have explicit types
- [ ] All functions have return types
- [ ] No implicit `any` types
- [ ] Generic types are parameterized
- [ ] Union types properly narrowed
- [ ] Optional properties use `?`
- [ ] Readonly where appropriate

### Step 3: Review Component Quality

```typescript
// ❌ BAD - God component, unclear props, no types
const PatternCard = ({ data, onClick, show }) => {
  if (show === undefined) show = true

  return (
    <div className="p-4" onClick={onClick}>
      {data.title}
      {data.description}
    </div>
  )
}

// ✅ GOOD - Single responsibility, typed, documented
interface PatternCardProps {
  pattern: Pattern
  isVisible: boolean
  onSelect: (id: string) => void
}

/**
 * Displays a single AI design pattern as a card
 * @param pattern - The pattern to display
 * @param isVisible - Whether card is visible
 * @param onSelect - Callback when pattern is selected
 */
export const PatternCard: React.FC<PatternCardProps> = ({
  pattern,
  isVisible,
  onSelect,
}) => {
  if (!isVisible) return null

  return (
    <div
      className="space-y-2 rounded-lg border border-gray-200 bg-white p-4 transition hover:shadow-md dark:border-gray-700 dark:bg-gray-800"
      onClick={() => onSelect(pattern.id)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          onSelect(pattern.id)
        }
      }}
    >
      <h3 className="font-semibold text-gray-900 dark:text-white">
        {pattern.title}
      </h3>
      <p className="text-sm text-gray-600 dark:text-gray-400">
        {pattern.description}
      </p>
    </div>
  )
}
```

**Component Quality Checklist:**
- [ ] Single responsibility (one job)
- [ ] Props interface defined
- [ ] Props well-documented
- [ ] Default props specified
- [ ] Error boundary wrapper
- [ ] Accessibility attributes (ARIA, keyboard nav)
- [ ] Dark mode support
- [ ] Responsive design
- [ ] Loading/error states handled
- [ ] No console.log in production

### Step 4: Review Data Validation

```typescript
// ❌ BAD - No validation
const getPatterns = async (data) => {
  return data.patterns.map(p => ({
    name: p.name,
    examples: p.examples || []
  }))
}

// ✅ GOOD - Zod validation
import { z } from 'zod'

const PatternSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  slug: z.string().min(1),
  examples: z.array(ExampleSchema),
})

type Pattern = z.infer<typeof PatternSchema>

const getPatterns = async (data: unknown): Promise<Pattern[]> => {
  const validated = z.array(PatternSchema).parse(data)
  return validated.map(p => ({
    name: p.name,
    examples: p.examples
  }))
}
```

**Data Validation Checklist:**
- [ ] All external data validated with Zod
- [ ] Safe parsing used for user input
- [ ] Type inference from schemas
- [ ] Error messages user-friendly
- [ ] Required fields explicitly marked
- [ ] Enum types for fixed values
- [ ] Array lengths validated if needed

### Step 5: Review React Patterns

```typescript
// ❌ BAD - Missing dependencies, stale closures
const PatternList = () => {
  const [patterns, setPatterns] = useState([])

  useEffect(() => {
    fetchPatterns(searchTerm)  // ⚠️ searchTerm not in dependencies
  }, [])

  const handleSelect = (id) => {
    // ⚠️ Stale searchTerm reference
    console.log('Selected with search:', searchTerm)
  }

  return <div>{patterns.map(p => <div key={p.id}>{p.name}</div>)}</div>
}

// ✅ GOOD - Proper dependencies, hooks organized
interface PatternListProps {
  searchTerm: string
}

export const PatternList: React.FC<PatternListProps> = ({ searchTerm }) => {
  const [patterns, setPatterns] = useState<Pattern[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadPatterns = async () => {
      setIsLoading(true)
      try {
        const data = await fetchPatterns(searchTerm)
        setPatterns(data)
        setError(null)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error')
      } finally {
        setIsLoading(false)
      }
    }

    loadPatterns()
  }, [searchTerm])  // ✅ Correct dependency

  const handleSelect = useCallback((id: string) => {
    console.log('Selected with search:', searchTerm)
  }, [searchTerm])  // ✅ Memoized with correct dependency

  if (isLoading) return <Skeleton />
  if (error) return <ErrorMessage message={error} />

  return (
    <div className="space-y-2">
      {patterns.map(p => (
        <PatternCard
          key={p.id}
          pattern={p}
          onSelect={handleSelect}
        />
      ))}
    </div>
  )
}
```

**React Patterns Checklist:**
- [ ] Correct useEffect dependencies
- [ ] useCallback for callbacks (with dependencies)
- [ ] useMemo for expensive computations
- [ ] Loading states handled
- [ ] Error states handled
- [ ] No side effects in render
- [ ] Keys correct in lists
- [ ] Custom hooks extracted when needed

### Step 6: Review Styling & Design System

```typescript
// ❌ BAD - Inline styles, hardcoded colors, no dark mode
<div style={{
  padding: '10px',
  backgroundColor: '#3b82f6',
  color: 'white',
  borderRadius: '4px'
}}>
  Button
</div>

// ✅ GOOD - Tailwind + design system + dark mode
<button className="rounded-md bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800">
  Button
</button>
```

**Styling Checklist:**
- [ ] Tailwind CSS only (no CSS-in-JS)
- [ ] Design system colors used
- [ ] Design system spacing used
- [ ] Dark mode support (dark: prefix)
- [ ] Responsive design (sm:, md:, lg: prefixes)
- [ ] Hover states defined
- [ ] Focus states for accessibility
- [ ] Disabled states handled
- [ ] Smooth transitions included

### Step 7: Review Accessibility

```typescript
// ❌ BAD - Not accessible
<div onClick={handleClick} className="cursor-pointer">
  Click me
</div>

// ✅ GOOD - Accessible
<button
  onClick={handleClick}
  className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
  aria-label="Open pattern details"
>
  Click me
</button>
```

**Accessibility Checklist:**
- [ ] Semantic HTML elements used
- [ ] ARIA labels for interactive elements
- [ ] Images have alt text
- [ ] Keyboard navigation works
- [ ] Focus visible on interactive elements
- [ ] Color not only way to convey info
- [ ] Sufficient color contrast (WCAG AA)
- [ ] Form labels associated with inputs

### Step 8: Review Testing

```typescript
// ❌ BAD - Tests implementation details
it('sets state correctly', () => {
  const { getByTestId } = render(<Counter />)
  const button = getByTestId('increment-button')  // ⚠️ Testing ID
  fireEvent.click(button)
  expect(getByTestId('count-display')).toHaveTextContent('1')
})

// ✅ GOOD - Tests user behavior
it('increments counter when button clicked', async () => {
  const user = userEvent.setup()
  render(<Counter />)

  const button = screen.getByRole('button', { name: /increment/ })
  await user.click(button)

  expect(screen.getByText('Count: 1')).toBeInTheDocument()
})
```

**Testing Checklist:**
- [ ] Tests user behavior, not implementation
- [ ] Uses semantic queries (getByRole, getByLabelText)
- [ ] Tests interactions (userEvent, not fireEvent)
- [ ] Tests error states
- [ ] Tests loading states
- [ ] Tests accessibility
- [ ] Snapshot tests included
- [ ] 80%+ coverage

### Step 9: Run Quality Checks

Execute automated quality tools:

```bash
# TypeScript type checking
npx tsc --noEmit

# ESLint code style
npm run lint

# Test suite
npm run test:coverage

# Pattern validation
npm run test:patterns

# Design consistency
npm run design-analyze

# TypeScript guardian
npm run ts-guardian
```

### Step 10: Document Review Findings

Create a summary of issues found:

```markdown
## Code Review Summary

### Critical Issues ⚠️
- [ ] TypeScript error on line X in FileA.tsx
- [ ] Missing type annotation on function Y

### Quality Issues 🔍
- [ ] Unused import in FileB.tsx
- [ ] Missing accessibility attributes in Component

### Suggestions 💡
- [ ] Consider extracting to custom hook
- [ ] Could use design system spacing variable

### Approved ✅
- Code follows all project standards
- Tests adequate and passing
- No critical issues found
```

## Code Review Checklist

Apply this checklist to every component or feature:

**TypeScript & Types**
- [ ] No `any` types (unless justified)
- [ ] All parameters typed
- [ ] All return types explicit
- [ ] Generic types parameterized
- [ ] No implicit any errors

**React Quality**
- [ ] Single responsibility principle
- [ ] Props interface defined
- [ ] Proper hook usage
- [ ] useEffect dependencies correct
- [ ] No prop drilling (use context if needed)

**Styling**
- [ ] Tailwind CSS only
- [ ] Design system colors/spacing
- [ ] Dark mode support
- [ ] Responsive design
- [ ] Consistent with other components

**Accessibility**
- [ ] Semantic HTML
- [ ] ARIA labels where needed
- [ ] Keyboard navigation
- [ ] Color contrast adequate
- [ ] Focus states visible

**Testing**
- [ ] Unit tests written
- [ ] Interaction tests included
- [ ] Coverage 80%+
- [ ] Accessibility tests
- [ ] Snapshot tests

**Data Handling**
- [ ] Zod validation used
- [ ] Error handling included
- [ ] Type-safe operations
- [ ] No unsafe casts

**Documentation**
- [ ] JSDoc comments
- [ ] Component purpose clear
- [ ] Complex logic explained
- [ ] Examples included
- [ ] TODOs documented

## Common Code Review Issues

### Issue 1: Implicit Any Types

```typescript
// ❌ WRONG
const sortPatterns = (items) => items.sort()

// ✅ CORRECT
const sortPatterns = (items: Pattern[]): Pattern[] => items.sort()
```

### Issue 2: Missing Error Handling

```typescript
// ❌ WRONG
const data = await fetch(url).then(r => r.json())

// ✅ CORRECT
const data = await fetch(url)
  .then(r => {
    if (!r.ok) throw new Error(`HTTP ${r.status}`)
    return r.json()
  })
  .catch(err => {
    console.error('Failed to fetch:', err)
    throw err
  })
```

### Issue 3: Stale Closures in Effects

```typescript
// ❌ WRONG
useEffect(() => {
  handleSearch(query)
}, [])  // Missing query dependency

// ✅ CORRECT
useEffect(() => {
  handleSearch(query)
}, [query])  // Query included
```

### Issue 4: Missing Accessibility

```typescript
// ❌ WRONG
<div onClick={handleClick}>Click here</div>

// ✅ CORRECT
<button onClick={handleClick}>Click here</button>
```

## Integration with Other Skills

**Code Quality & Review integrates with:**
- **Pattern Development**: Validate pattern code meets quality standards
- **Pattern Demo Generator**: Review generated demos for quality
- **Build & Deployment**: Part of pre-deployment quality gates
- **Test Generation**: Suggest tests needed for coverage
- **Design Consistency**: Validate design system usage

## Commands Reference

```bash
# Type checking
npx tsc --noEmit

# Code style linting
npm run lint

# Run tests with coverage
npm run test:coverage

# Validate patterns
npm run test:patterns

# Analyze design
npm run design-analyze

# TypeScript guardian
npm run ts-guardian

# All-in-one quality check
npm run fix-all
```

## Quality Metrics to Track

| Metric | Target | Current |
|--------|--------|---------|
| TypeScript Errors | 0 | - |
| ESLint Warnings | 0 | - |
| Test Pass Rate | 100% | - |
| Coverage | 70% | 48% |
| Accessibility Issues | 0 | - |
| Design Deviations | 0 | - |

---

**Goal**: Maintain exceptional code quality through systematic reviews, enforcing TypeScript strict mode, ensuring accessibility compliance, and validating adherence to project patterns and best practices.
