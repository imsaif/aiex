---
paths:
  - "**/*.test.ts"
  - "**/*.test.tsx"
  - "**/__tests__/**"
  - "jest.config.js"
  - "jest.config.mjs"
  - "jest.setup.js"
  - "tests/**"
---

# Testing Strategy

## Test commands
- `npm test` - Run all tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Run tests with coverage report
- `npm run test:ci` - CI mode tests (no watch, with coverage)
- `npm run test:patterns` - Test pattern data validation only
- `npm run test:components` - Test components only
- `npm run e2e` - Playwright E2E (`npm run e2e:ui` for UI mode, `npm run e2e:install` to install browsers)

## Current Coverage
- **481 comprehensive tests** across all components and utilities
- **48% test coverage** (statements) - significant progress toward 70% target
  - Statements: 47.82% ✅ (nearly 50%)
  - Lines: 48.28% ✅
  - Functions: 39% ✅
  - Branches: 36.19% ✅
- **✅ 38/38 AI design patterns fully completed** with comprehensive content, interactive demos, and code examples
- **100% component test coverage** - every component has comprehensive tests
- Data validation with 83% coverage: Patterns, Categories
- Advanced test infrastructure with proper mocking for Next.js, framer-motion, and browser APIs
- Coverage thresholds set at 70% (major progress from ~20% baseline)

## Testing Tools
- **Jest** with Next.js integration and advanced mocking
- **React Testing Library** for component testing with user event simulation
- **Comprehensive mocking infrastructure**:
  - Next.js components (Image, Link, useRouter)
  - Framer Motion (motion, useMotionValue, useSpring, useTransform)
  - Browser APIs (scrollIntoView, window properties)
- **Zod** for data validation testing (83% coverage)
- **Snapshot testing** for UI consistency
- **Playwright** configured for e2e testing (audit funnel E2E shipped; see `tests/`)

## Test File Locations
- Component tests: `src/components/**/__tests__/` (100% coverage)
- Example tests: `src/components/examples/__tests__/` (all interactive demos)
- UI tests: `src/components/ui/__tests__/` (all reusable components)
- Section tests: `src/components/sections/__tests__/` (all page sections)
- Provider tests: `src/components/providers/__tests__/` (context providers)
- Data tests: `src/data/__tests__/` (pattern validation)
- Utility tests: `src/utils/__tests__/` (helper functions)
- Hook tests: `src/hooks/__tests__/` (custom React hooks)
- Schema tests: `src/schemas/__tests__/` (Zod validation)

## Testing Requirements
- Write tests for all new components
- Use React Testing Library best practices
- Mock external dependencies (Next.js components, APIs)
- Maintain coverage thresholds

## Gotcha: `.gitignore` ignores `**/__tests__/`

`.gitignore` has `**/__tests__/`, `**/*.test.*` and `**/*.spec.*` (only `e2e/**/*.spec.ts` is negated). A new test therefore runs locally, passes, and is then **silently dropped by `git add .`** — it never reaches the repo or CI. Some suites are tracked (`src/lib/audit/__tests__/*`, `src/app/patterns/[slug]/__tests__/*`) because they were force-added; others (`src/data/__tests__/patterns.test.ts`) are local-only.

**Any test that is a safeguard rather than a scratch check must be `git add -f`'d**, and you should confirm it with `git ls-files <path>` before claiming it protects anything. A guard that only exists on one machine is not a guard.

## Component Testing Agent
- Generates comprehensive test suites, follows testing best practices, creates snapshots and interaction tests.
