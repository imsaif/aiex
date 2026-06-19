# Architecture Overview

> **Why this stack?** This document describes *what* the architecture is. For the
> *why* behind each major choice — and the alternatives considered — see the
> [Architecture Decision Records](./adr/README.md).

## 🏗️ System Architecture

The AI Design Patterns project is built using modern web technologies with a focus on performance, maintainability, and developer experience.

## 📊 High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         Frontend (Next.js 15)                │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌──────────────┐  ┌──────────────────┐  │
│  │   App Router │  │  React 19    │  │  TypeScript      │  │
│  │   (Pages)    │  │  Components  │  │  Type Safety     │  │
│  └─────────────┘  └──────────────┘  └──────────────────┘  │
│                                                              │
│  ┌─────────────┐  ┌──────────────┐  ┌──────────────────┐  │
│  │  Tailwind   │  │ Framer       │  │  React Testing   │  │
│  │  CSS         │  │ Motion       │  │  Library         │  │
│  └─────────────┘  └──────────────┘  └──────────────────┘  │
├─────────────────────────────────────────────────────────────┤
│                     Data Layer                               │
│  ┌─────────────┐  ┌──────────────┐  ┌──────────────────┐  │
│  │  Pattern    │  │  Context     │  │  Local Storage   │  │
│  │  Data       │  │  Providers   │  │  (Preferences)   │  │
│  └─────────────┘  └──────────────┘  └──────────────────┘  │
├─────────────────────────────────────────────────────────────┤
│                    Build & Deploy                            │
│  ┌─────────────┐  ┌──────────────┐  ┌──────────────────┐  │
│  │  Vercel     │  │  GitHub      │  │  CI/CD           │  │
│  │  Hosting    │  │  Actions     │  │  Pipeline        │  │
│  └─────────────┘  └──────────────┘  └──────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

## 🛠️ Technology Stack

### Core Framework
- **Next.js 15**: React framework with App Router
  - Server-side rendering (SSR)
  - Static site generation (SSG)
  - API routes
  - Image optimization
  - Built-in performance optimizations

### Frontend Technologies
- **React 19**: Latest React with concurrent features
- **TypeScript 5**: Type safety and better DX (strict mode)
- **Tailwind CSS v4**: Utility-first styling over an enforced design-token system
- **Framer Motion**: Animation library
- **Heroicons / Lobehub icons**: Icon libraries
- **Fuse.js**: Client-side fuzzy search

### Development Tools
- **Jest + React Testing Library**: Unit/component testing
- **Playwright**: End-to-end testing
- **ESLint**: Code linting
- **Prettier**: Code formatting
- **Husky + lint-staged**: Git hooks (incl. the design-token brand validator)
- **Turbopack**: Dev build tooling
- **Lighthouse / LHCI**: Performance budgets

### Data Management
- **Zod**: Schema validation
- **React Context**: State management for static content
- **Local Storage**: User preferences
- **Static Data (content-as-code)**: Pattern definitions live as typed TS modules ([ADR 0002](./adr/0002-content-as-code-zod.md))

### Persistence & Services (dynamic features)
- **Prisma ORM + Postgres (Neon)**: Newsletter subscribers, drafts, and operational data ([ADR 0005](./adr/0005-prisma-neon-postgres.md))
- **Beehiiv**: Subscriber audience + newsletter delivery ([ADR 0006](./adr/0006-beehiiv-resend-email.md))
- **Resend**: Transactional email (audit reports, admin/cron alerts)
- **Anthropic SDK**: Powers the audit and content-generation tooling
- **cron-job.org**: External scheduler for newsletter/health/vitals jobs ([ADR 0007](./adr/0007-external-cron.md))

## 📁 Project Structure

```
ai-design-patterns/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── layout.tsx          # Root layout
│   │   ├── page.tsx            # Homepage
│   │   ├── patterns/           # Pattern pages
│   │   └── favorites/          # Favorites page
│   │
│   ├── components/             # React components
│   │   ├── ui/                 # Reusable UI components
│   │   ├── examples/           # Interactive demos
│   │   ├── sections/           # Page sections
│   │   ├── layout/             # Layout components
│   │   └── providers/          # Context providers
│   │
│   ├── data/                   # Data layer
│   │   ├── patterns.ts         # Pattern registry
│   │   ├── categories.ts       # Category definitions
│   │   └── patterns/           # Individual patterns
│   │       └── patterns/       # Pattern implementations
│   │
│   ├── contexts/               # React contexts
│   │   └── PatternContext.tsx  # Pattern state management
│   │
│   ├── hooks/                  # Custom React hooks
│   │   ├── usePatterns.ts      # Pattern data hooks
│   │   ├── useFavorites.ts     # Favorites management
│   │   └── useSearch.ts        # Search functionality
│   │
│   ├── schemas/                # Validation schemas
│   │   └── pattern.schema.ts   # Pattern validation
│   │
│   ├── types/                  # TypeScript types
│   │   └── index.ts            # Type definitions
│   │
│   └── utils/                  # Utility functions
│       ├── validation.ts       # Data validation
│       ├── search.ts           # Search algorithms
│       └── performance.ts      # Performance utils
│
├── public/                     # Static assets
│   └── images/                 # Images and media
│       ├── examples/           # Pattern examples
│       └── placeholders/       # Placeholder images
│
├── scripts/                    # Build and dev scripts
│   ├── ai-pattern-generator.js     # AI pattern generation
│   ├── component-testing-agent.js  # Test generation
│   └── optimize-images.js          # Image optimization
│
└── docs/                       # Documentation
    ├── architecture.md         # This file
    ├── patterns-guide.md       # Pattern guide
    └── api.md                  # API documentation
```

## 🔄 Data Flow

### Pattern Data Flow

```
Pattern Files → Pattern Loader → Validation → Context Provider → Components
     ↓              ↓                ↓            ↓                ↓
  index.ts    pattern-loader.ts   Zod Schema  PatternContext   usePattern
```

1. **Pattern Definition**: Static TypeScript files define patterns
2. **Loading**: Pattern loader imports and aggregates patterns
3. **Validation**: Zod schemas validate pattern structure
4. **Context**: PatternContext provides global access
5. **Consumption**: Components use hooks to access data

### User Interaction Flow

```
User Action → Component State → Context Update → Local Storage → UI Update
     ↓              ↓                ↓               ↓              ↓
   Click       useState()      dispatch()      localStorage      Re-render
```

## 🎨 Component Architecture

### Component Hierarchy

```
App
├── Layout
│   ├── Navbar
│   └── Footer
├── Pages
│   ├── HomePage
│   │   ├── Hero
│   │   ├── FeaturedPatterns
│   │   ├── PatternCategories
│   │   └── ContributeSection
│   └── PatternPage
│       ├── PatternHeader
│       ├── PatternContent
│       ├── CodeExamples
│       └── InteractiveDemo
└── Providers
    ├── PatternProvider
    └── AnalyticsProvider
```

### Component Design Principles

1. **Single Responsibility**: Each component has one clear purpose
2. **Composition**: Build complex UIs from simple components
3. **Reusability**: Create generic, configurable components
4. **Type Safety**: Full TypeScript coverage
5. **Testing**: Comprehensive test coverage

## 🚀 Performance Optimizations

### Build-Time Optimizations

- **Static Generation**: Pre-render pattern pages at build time
- **Image Optimization**: Automatic WebP/AVIF conversion
- **Code Splitting**: Automatic chunk optimization
- **Tree Shaking**: Remove unused code

### Runtime Optimizations

- **Lazy Loading**: Components loaded on demand
- **React.memo**: Prevent unnecessary re-renders
- **useMemo/useCallback**: Optimize expensive operations
- **Virtual Scrolling**: For large lists (future)

### Bundle Analysis

```bash
# Analyze bundle size
npm run build
npm run analyze
```

Current bundle metrics:
- First Load JS: ~85kB
- Shared chunks: ~45kB
- Per-page chunks: ~10-20kB

## 🔐 Security Considerations

### Content Security

- **Input Validation**: All user inputs validated
- **XSS Prevention**: React's built-in protection
- **Safe Markdown**: Sanitized rendering
- **HTTPS Only**: Enforced in production

### Dependencies

- **Regular Updates**: Dependabot monitoring
- **Audit**: `npm audit` in CI/CD
- **Lock Files**: Consistent dependency versions

## 🧪 Testing Architecture

### Testing Pyramid

```
        E2E Tests (Future)
       /            \
      /  Integration \
     /     Tests      \
    /                  \
   /    Unit Tests      \
  /______________________\
```

### Test Coverage

- **Unit Tests**: Components, hooks, utilities (48% coverage)
- **Integration Tests**: User flows, data flow
- **E2E Tests**: Critical paths (planned)

### Testing Tools

```typescript
// Component testing
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// Mocking
jest.mock('next/image');
jest.mock('framer-motion');

// Assertions
expect(element).toBeInTheDocument();
expect(element).toHaveTextContent('text');
```

## 🔄 State Management

### Context-Based Architecture

```typescript
// Pattern Context
PatternContext
├── patterns: Pattern[]
├── categories: Category[]
├── loading: boolean
├── error: Error | null
└── methods:
    ├── getPattern(id)
    ├── getPatternsByCategory(id)
    └── searchPatterns(query)
```

### Local State Management

- **Component State**: UI-specific state with useState
- **Form State**: Controlled components
- **URL State**: Query parameters for filters
- **Persistent State**: LocalStorage for preferences

## 🌐 Deployment Architecture

### Vercel Deployment

```
GitHub Push → Vercel Build → Edge Network → Global CDN
     ↓            ↓              ↓            ↓
  main branch   Next.js      Functions    150+ PoPs
               build
```

### Environment Configuration

```bash
# Production
NEXT_PUBLIC_SITE_URL=https://aiuxdesign.guide
NEXT_PUBLIC_GA_ID=GA-XXXXXX

# Development
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

## 📊 Monitoring & Analytics

### Performance Monitoring

- **Core Web Vitals**: LCP, FID, CLS tracking
- **Vercel Analytics**: Real-time performance data
- **Error Tracking**: Console error monitoring

### User Analytics

- **Page Views**: Track popular patterns
- **Interactions**: Monitor demo usage
- **Search Queries**: Understand user needs

## 🔮 Future Architecture Plans

> **Note:** Some items once listed here as "future" already shipped. A
> PostgreSQL database (Prisma + Neon) is in production for the newsletter and
> operational data — see [ADR 0005](./adr/0005-prisma-neon-postgres.md). Pattern
> content remains intentionally code-based rather than CMS-backed; the trade-off
> is documented in [ADR 0002](./adr/0002-content-as-code-zod.md).

### Planned Enhancements

1. **Authentication**: User accounts and favorites
2. **AI Features**: Pattern recommendations
3. **Internationalization**: Multi-language support
4. **CMS Integration**: Only if content authoring moves to non-technical editors (see ADR 0002)

### Scalability Considerations

- **Microservices**: Split into smaller services
- **CDN**: Enhanced static asset delivery
- **Caching**: Redis for API responses
- **Load Balancing**: Multiple server instances

## 🤝 Development Workflow

### Local Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run tests
npm test

# Build for production
npm run build
```

### Git Workflow

```
feature/branch → Pull Request → Review → main → Deploy
      ↓              ↓           ↓        ↓       ↓
   develop      CI checks    approve   merge  Vercel
```

### Code Review Process

1. **Automated Checks**: ESLint, TypeScript, Tests
2. **Manual Review**: Code quality, patterns
3. **Performance Review**: Bundle size, metrics
4. **Approval**: Minimum 1 reviewer
5. **Merge**: Squash and merge

## 📚 Related Documentation

- [Pattern Implementation Guide](./patterns-guide.md)
- [API Documentation](./api.md)
- [Contributing Guidelines](../CONTRIBUTING.md)
- [Testing Strategy](./testing.md)

---

For questions about the architecture, please open a GitHub issue or discussion.