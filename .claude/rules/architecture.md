---
paths:
  - "src/**"
  - "scripts/**"
---

# Architecture Overview

## Core Architecture
- **Next.js 15 App Router**: Modern routing with app directory structure
- **React 19**: Latest React with concurrent features
- **TypeScript**: Full type safety with strict configuration
- **Tailwind CSS**: Utility-first styling with custom design system

## Key Architectural Patterns

### 1. Pattern-Centric Data Architecture
- Central pattern registry (`src/data/patterns.ts`) imports from individual pattern modules
- Each pattern follows structured format with content, examples, and code samples
- Zod schema validation ensures data integrity (`src/schemas/pattern.schema.ts`)
- Pattern loading utilities handle dynamic imports and validation

### 2. Context-Based State Management
- `PatternProvider` (`src/contexts/PatternContext.tsx`) provides global pattern state
- Custom hooks (`usePatterns`, `usePattern`, `usePatternsByCategory`) for data access
- Optimized with memoization for performance
- Error boundaries and loading states handled centrally

### 3. Component Architecture
- **UI Components** (`src/components/ui/`): Reusable design system components
- **Section Components** (`src/components/sections/`): Page-specific sections
- **Example Components** (`src/components/examples/`): Interactive pattern demos
- **Layout Components** (`src/components/layout/`): Navigation and structure

### 4. Type-Safe Schema System
- Zod schemas define all data structures with validation
- TypeScript types exported from schemas for consistency
- Safe and throwing validation functions available
- Development helpers for detailed error reporting

### 5. Usage Tracking & Cost Analysis
- **ccusage** integration for Claude Code token usage analysis
- Commands: `npm run usage` (general), `:daily`, `:weekly`, `:monthly`, `:session`, `:blocks`, `:json`
- Automatically analyzes existing Claude Code JSONL logs from `~/.claude/projects/`
- Provides detailed cost breakdowns by model (Sonnet-4, Opus-4, etc.)
- Tracks input/output tokens, cache creation/reading, and total costs in USD

### 6. Newsletter Subscription System
- Prisma ORM (Postgres on Neon) for subscribers, mirrored to Beehiiv; Resend for transactional email. **Full details + troubleshooting in `.claude/rules/newsletter-and-infra.md`.**

## Directory Structure

### Source Code (`src/`)
- `app/` - Next.js 15 app router pages and layouts
  - `api/newsletter/` - Newsletter API routes (subscribe, unsubscribe, publish, send-update)
- `components/` - React components organized by type
- `contexts/` - React context providers and hooks
- `data/` - Pattern data, categories, and utilities
- `hooks/` - Custom React hooks (favorites, search, pagination)
- `lib/` - Shared utilities (Prisma client, Resend client)
- `schemas/` - Zod validation schemas
- `types/` - TypeScript type definitions
- `utils/` - Utility functions and helpers
- `generated/` - Auto-generated code (Prisma client)

### Pattern Data (`src/data/patterns/`)
- `patterns/` - Individual pattern implementations
- `categories/` - Pattern category definitions
- `examples/` - Example implementations
- `utils/` - Pattern-specific utilities

### Testing (`src/components/**/__tests__/`)
- Component tests co-located with components
- Jest + React Testing Library
- Snapshot testing for UI consistency
- 100% coverage for critical components (Button, CodeBlock)

## Automation & Agent Orchestration

- `npm run orchestrate:workflow guide-generation` - Run guide generation workflow
- `npm run orchestrate:workflow aiux-sprint` - Full AIUX feature development sprint
- `npm run progress-report` / `progress-status` / `progress-agents` / `progress-next` / `progress-update` / `progress-sync` - project progress + agent coordination
- **See [.claude/AUTOMATION-SETUP.md](../AUTOMATION-SETUP.md) for complete automation documentation**

This project includes several AI agents for automated development tasks:
- **Pattern Generator Agent** — generates consistent pattern structures, examples, and code samples; validates against schemas.
- **Component Testing Agent** — generates comprehensive test suites and snapshots.
- **Design Consistency Agent** — analyzes design-system usage, generates style guides, fixes inconsistencies.
- **Project Progress Agent** — monitors other agents, updates task status, maintains `docs/status.md` / `tasks/tasks.json`, suggests next priority actions.

These tools are accessible via npm scripts and help maintain code quality and consistency at scale.
