# API Documentation

Complete API reference for components, hooks, contexts, and utilities in the AI Design Patterns project.

## 📑 Table of Contents

- [Components](#components)
  - [UI Components](#ui-components)
  - [Example Components](#example-components)
  - [Section Components](#section-components)
- [Hooks](#hooks)
- [Contexts](#contexts)
- [Types](#types)
- [Utilities](#utilities)

## Components

### UI Components

#### Button

A reusable button component with multiple variants.

```typescript
import { Button } from '@/components/ui/Button';

interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
  className?: string;
}
```

**Usage:**
```tsx
<Button 
  variant="primary" 
  size="md" 
  onClick={handleClick}
>
  Click Me
</Button>
```

#### Card

Container component with consistent styling.

```typescript
interface CardProps {
  children: React.ReactNode;
  className?: string;
  hoverable?: boolean;
  onClick?: () => void;
}
```

**Usage:**
```tsx
<Card hoverable className="p-6">
  <h3>Card Title</h3>
  <p>Card content</p>
</Card>
```

#### CodeBlock

Syntax-highlighted code display component.

```typescript
interface CodeBlockProps {
  code: string;
  language?: string;
  showLineNumbers?: boolean;
  highlightLines?: number[];
  title?: string;
  copyable?: boolean;
}
```

**Usage:**
```tsx
<CodeBlock
  code={sampleCode}
  language="typescript"
  showLineNumbers
  copyable
  title="Example Implementation"
/>
```

#### SearchBar

Advanced search component with filtering capabilities.

```typescript
interface SearchBarProps {
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  onSearch?: (query: string) => void;
  suggestions?: string[];
  showFilters?: boolean;
}
```

**Usage:**
```tsx
<SearchBar
  placeholder="Search patterns..."
  onChange={setSearchQuery}
  suggestions={recentSearches}
/>
```

#### SkeletonLoader

Loading placeholder component.

```typescript
interface SkeletonLoaderProps {
  variant?: 'text' | 'card' | 'image' | 'pattern';
  count?: number;
  className?: string;
}
```

**Usage:**
```tsx
<SkeletonLoader variant="card" count={3} />
```

### Example Components

#### ContextualAssistanceDemo

Interactive demo for contextual assistance pattern.

```typescript
interface ContextualAssistanceDemoProps {
  title: string;
  description: string;
  showHints?: boolean;
  onInteraction?: (action: string) => void;
}
```

#### ConversationalUiDemo

Chat interface demonstration component.

```typescript
interface ConversationalUiDemoProps {
  title: string;
  description: string;
  messages?: Message[];
  onSendMessage?: (message: string) => void;
}
```

### Section Components

#### Hero

Homepage hero section.

```typescript
interface HeroProps {
  title?: string;
  subtitle?: string;
  showSearch?: boolean;
  backgroundImage?: string;
}
```

#### FeaturedPatterns

Display featured AI patterns.

```typescript
interface FeaturedPatternsProps {
  patterns?: Pattern[];
  limit?: number;
  showViewAll?: boolean;
}
```

## Hooks

### usePatterns

Access all pattern data.

```typescript
function usePatterns(): {
  patterns: Pattern[];
  loading: boolean;
  error: Error | null;
}
```

**Usage:**
```tsx
const { patterns, loading, error } = usePatterns();

if (loading) return <Loader />;
if (error) return <Error message={error.message} />;

return <PatternList patterns={patterns} />;
```

### usePattern

Get a specific pattern by ID.

```typescript
function usePattern(id: string): {
  pattern: Pattern | null;
  loading: boolean;
  error: Error | null;
}
```

**Usage:**
```tsx
const { pattern, loading } = usePattern('contextual-assistance');
```

### useFavorites

Manage user's favorite patterns.

```typescript
function useFavorites(): {
  favorites: string[];
  addFavorite: (id: string) => void;
  removeFavorite: (id: string) => void;
  toggleFavorite: (id: string) => void;
  isFavorite: (id: string) => boolean;
}
```

**Usage:**
```tsx
const { favorites, toggleFavorite, isFavorite } = useFavorites();

<Button onClick={() => toggleFavorite(pattern.id)}>
  {isFavorite(pattern.id) ? 'Remove' : 'Add'} Favorite
</Button>
```

### usePatternSearch

Search and filter patterns.

```typescript
function usePatternSearch(): {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  searchResults: Pattern[];
  filters: FilterOptions;
  setFilters: (filters: FilterOptions) => void;
}
```

**Usage:**
```tsx
const { searchQuery, setSearchQuery, searchResults } = usePatternSearch();
```

### useRecentPatterns

Get recently viewed patterns.

```typescript
function useRecentPatterns(limit?: number): {
  recentPatterns: Pattern[];
  addToRecent: (patternId: string) => void;
  clearRecent: () => void;
}
```

### useSmoothScroll

Smooth scrolling functionality.

```typescript
function useSmoothScroll(): {
  scrollTo: (target: string | HTMLElement) => void;
  scrollToTop: () => void;
}
```

## Contexts

### PatternContext

Global pattern data provider.

```typescript
interface PatternContextValue {
  patterns: Pattern[];
  categories: Category[];
  loading: boolean;
  error: Error | null;
  getPattern: (id: string) => Pattern | undefined;
  getPatternsByCategory: (categoryId: string) => Pattern[];
  searchPatterns: (query: string) => Pattern[];
}
```

**Usage:**
```tsx
// Wrap app with provider
<PatternProvider>
  <App />
</PatternProvider>

// Use in components
const { patterns, getPattern } = useContext(PatternContext);
```

## Types

### Pattern

Core pattern type definition.

```typescript
interface Pattern {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: string;
  examples: Example[];
  guidelines: string[] | Guideline[];
  considerations: string[] | Consideration[];
  codeExamples?: CodeExample[];
  relatedPatterns?: string[];
  metrics?: PatternMetrics;
}
```

### Example

Pattern example structure.

```typescript
interface Example {
  title: string;
  description: string;
  image: string;
  altText: string;
  features?: string[];
  link?: string;
}
```

### CodeExample

Code sample structure.

```typescript
interface CodeExample {
  title: string;
  description?: string;
  language: string;
  code: string;
  highlightLines?: number[];
}
```

### Category

Pattern category definition.

```typescript
interface Category {
  id: string;
  name: string;
  description: string;
  icon?: string;
  patterns: string[];
}
```

### PatternMetrics

Pattern implementation metrics.

```typescript
interface PatternMetrics {
  implementationEffort: 'low' | 'medium' | 'high';
  userImpact: 'low' | 'medium' | 'high';
  maintenanceOverhead: 'low' | 'medium' | 'high';
}
```

## Utilities

### Validation

Data validation utilities.

```typescript
// Validate pattern data
function validatePattern(data: unknown): Pattern {
  return patternSchema.parse(data);
}

// Safe validation with error handling
function safeValidatePattern(data: unknown): {
  success: boolean;
  data?: Pattern;
  error?: ZodError;
}
```

### Search

Search and filtering utilities.

```typescript
// Search patterns by query
function searchPatterns(
  patterns: Pattern[], 
  query: string
): Pattern[]

// Filter patterns by category
function filterByCategory(
  patterns: Pattern[], 
  categoryId: string
): Pattern[]

// Sort patterns
function sortPatterns(
  patterns: Pattern[], 
  sortBy: 'title' | 'category' | 'date'
): Pattern[]
```

### Performance

Performance optimization utilities.

```typescript
// Debounce function calls
function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): T

// Throttle function calls
function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): T

// Memoize expensive computations
function memoize<T extends (...args: any[]) => any>(
  func: T
): T
```

### User Preferences

Local storage management.

```typescript
// Get user preference
function getPreference(key: string): any

// Set user preference
function setPreference(key: string, value: any): void

// Clear all preferences
function clearPreferences(): void

// Preference keys
enum PreferenceKeys {
  FAVORITES = 'favorites',
  RECENT_PATTERNS = 'recentPatterns',
  THEME = 'theme',
  VIEW_MODE = 'viewMode'
}
```

## Component Props Reference

### Common Props

Most components accept these common props:

```typescript
interface CommonProps {
  className?: string;      // Additional CSS classes
  style?: CSSProperties;   // Inline styles
  id?: string;            // HTML id attribute
  'data-testid'?: string; // Testing identifier
}
```

### Event Handlers

Standard event handler props:

```typescript
interface EventHandlers {
  onClick?: (event: MouseEvent) => void;
  onFocus?: (event: FocusEvent) => void;
  onBlur?: (event: FocusEvent) => void;
  onKeyDown?: (event: KeyboardEvent) => void;
  onMouseEnter?: (event: MouseEvent) => void;
  onMouseLeave?: (event: MouseEvent) => void;
}
```

## Error Handling

### Error Boundaries

Wrap components with error boundaries:

```tsx
<ErrorBoundary fallback={<ErrorFallback />}>
  <YourComponent />
</ErrorBoundary>
```

### Error Types

```typescript
class PatternNotFoundError extends Error {
  constructor(patternId: string) {
    super(`Pattern with id "${patternId}" not found`);
  }
}

class ValidationError extends Error {
  constructor(message: string, errors: ZodError) {
    super(message);
    this.errors = errors;
  }
}
```

## Testing Utilities

### Test Helpers

```typescript
// Render with providers
function renderWithProviders(
  ui: ReactElement,
  options?: RenderOptions
): RenderResult

// Mock pattern data
function mockPattern(overrides?: Partial<Pattern>): Pattern

// Wait for async updates
async function waitForLoadingToFinish(): Promise<void>
```

### Test IDs

Common test IDs used in components:

```typescript
const TestIds = {
  PATTERN_CARD: 'pattern-card',
  SEARCH_INPUT: 'search-input',
  FILTER_BUTTON: 'filter-button',
  FAVORITE_BUTTON: 'favorite-button',
  CODE_BLOCK: 'code-block',
  DEMO_CONTAINER: 'demo-container'
};
```

## Performance Considerations

### Lazy Loading

Components that support lazy loading:

```typescript
const PatternDemo = lazy(() => import('./PatternDemo'));
const CodeEditor = lazy(() => import('./CodeEditor'));
const Analytics = lazy(() => import('./Analytics'));
```

### Memoization

Components using React.memo:

```typescript
const PatternCard = memo(PatternCardComponent);
const SearchResults = memo(SearchResultsComponent);
const CodeBlock = memo(CodeBlockComponent);
```

## Accessibility

### ARIA Attributes

Required ARIA attributes for components:

```typescript
interface AriaProps {
  'aria-label'?: string;
  'aria-labelledby'?: string;
  'aria-describedby'?: string;
  'aria-hidden'?: boolean;
  'aria-expanded'?: boolean;
  'aria-selected'?: boolean;
  role?: string;
}
```

### Keyboard Navigation

Components supporting keyboard navigation:

- `SearchBar`: Arrow keys for suggestions
- `PatternGrid`: Tab navigation
- `Modal`: Escape to close
- `Dropdown`: Arrow keys for options

## Migration Guide

### v1 to v2 (Future)

```typescript
// Old API
<Pattern data={pattern} />

// New API
<PatternCard pattern={pattern} />
```

## Examples

### Complete Pattern Page

```tsx
import { usePattern } from '@/hooks/usePattern';
import { PatternHeader } from '@/components/PatternHeader';
import { CodeExamples } from '@/components/CodeExamples';
import { InteractiveDemo } from '@/components/InteractiveDemo';

export function PatternPage({ id }: { id: string }) {
  const { pattern, loading, error } = usePattern(id);

  if (loading) return <SkeletonLoader variant="pattern" />;
  if (error) return <ErrorMessage error={error} />;
  if (!pattern) return <NotFound />;

  return (
    <div>
      <PatternHeader pattern={pattern} />
      <CodeExamples examples={pattern.codeExamples} />
      <InteractiveDemo pattern={pattern} />
    </div>
  );
}
```

---

For more examples and detailed usage, check the [Pattern Implementation Guide](./patterns-guide.md) or browse the source code.