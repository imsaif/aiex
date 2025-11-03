# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js 15 application showcasing AI design patterns with TypeScript, React 19, and Tailwind CSS. The project has **24 AI design patterns implemented** across 7 categories, with **15 patterns fully updated** and **9 patterns requiring comprehensive review and updates**.

### Pattern Status Summary
- **Fully Updated (15/24)**: Complete with all details (code, images, text, Figma prompts, demos)
- **Need Review & Update (9/24)**: Patterns exist but require comprehensive updates

### Fully Updated Patterns (15)
- Contextual Assistance
- Progressive Disclosure
- Human-in-the-Loop
- Explainable AI
- Conversational UI
- Adaptive Interfaces
- Predictive Anticipation
- Multimodal Interaction
- Guided Learning
- Augmented Creation
- Responsible AI
- Error Recovery
- Collaborative AI
- Confidence Visualization
- Selective Memory

### Patterns Requiring Update (9)
- Ambient Intelligence
- Safe Exploration
- Feedback Loops
- Graceful Handoff
- Context Switching
- Intelligent Caching
- Progressive Enhancement
- Privacy-First Design
- Universal Access Patterns

### Pattern Categories (7 Total)

#### Adaptive & Intelligent Systems (3 patterns)
  - Adaptive Interfaces
  - Predictive Anticipation
  - Ambient Intelligence

#### Human-AI Collaboration (4 patterns)
  - Human-in-the-Loop
  - Collaborative AI
  - Guided Learning
  - Augmented Creation

#### Trustworthy & Reliable AI (5 patterns)
  - Explainable AI
  - Confidence Visualization
  - Responsible AI Design
  - Error Recovery
  - Safe Exploration

#### Natural Interaction (2 patterns)
  - Conversational UI
  - Multimodal Interaction

#### Performance & Efficiency (5 patterns)
  - Progressive Disclosure
  - Contextual Assistance
  - Feedback Loops
  - Graceful Handoff
  - Context Switching
  - Intelligent Caching
  - Progressive Enhancement

#### Privacy & Control (2 patterns)
  - Privacy-First Design
  - Selective Memory

#### Accessibility & Inclusion (1 pattern)
  - Universal Access Patterns

## Development Commands

### Core Development
- `npm run dev` - Start development server with Turbo (http://localhost:3000)
- `npm run build` - Full production build with image optimization and analysis
- `npm run build:production` - Production build with NODE_ENV=production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

### Testing
- `npm test` - Run all tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Run tests with coverage report
- `npm run test:ci` - CI mode tests (no watch, with coverage)
- `npm run test:patterns` - Test pattern data validation only
- `npm run test:components` - Test components only

### AI-Powered Development Tools
- `npm run generate-pattern` - Generate new AI pattern using AI
- `npm run generate-all-patterns` - Generate all missing patterns
- `npm run list-patterns` - List all pattern statuses
- `npm run generate-test` - Generate tests for components using AI
- `npm run generate-all-tests` - Generate all missing tests
- `npm run list-untested` - List components without tests

### Project Progress & Coordination
- `npm run progress-report` - Comprehensive progress report with agent activities
- `npm run progress-status` - Quick project status summary
- `npm run progress-agents` - Show all AI agent status and recent activities
- `npm run progress-next` - Get next priority actions with agent suggestions
- `npm run progress-update` - Update task status based on agent activities
- `npm run progress-sync` - Synchronize all status files with current state

### Design Consistency Tools
- `npm run design-analyze` - Analyze design consistency
- `npm run design-report` - Generate design consistency report
- `npm run design-style-guide` - Generate style guide
- `npm run design-fix` - Fix single design issue
- `npm run design-fix-all` - Fix all design issues

### Image & Asset Management
- `npm run optimize-images` - Optimize all images (WebP, AVIF, compression)
- `npm run convert-gifs` - Convert GIFs to WebM/MP4 for better performance

### Data Management
- `npm run fix-patterns` - Fix pattern data structure issues

### Newsletter & Email Management
- `npm run send-newsletter` - Send pattern update emails to subscribers (interactive mode)
- See [Newsletter Documentation](docs/NEWSLETTER.md) for complete setup and usage guide

## My Development Workflow

### Pattern Update Workflow (Primary)
**I work on ONE pattern at a time until 100% complete.** Do not move to the next pattern until the current one is finished.

#### Pattern Completion Checklist
When working on a pattern, ensure ALL of these are completed:
- [ ] Review existing pattern content and structure
- [ ] Update/add code examples (working implementations)
- [ ] Add/update images and visual examples
- [ ] Write/improve text content (description, use cases)
- [ ] Write/update guidelines and considerations
- [ ] Create/update Figma design prompts
- [ ] Build/update interactive demo component
- [ ] Add/update component tests for demo
- [ ] Validate pattern with `npm run test:patterns`
- [ ] Review pattern in browser (http://localhost:3000)
- [ ] Ensure all assets are optimized

#### Pattern Development Process
1. **Select Pattern**: Choose one pattern from the 12 requiring updates
2. **Review Current State**: Check what exists and what's missing
3. **Work Through Checklist**: Complete items one by one
4. **Validate**: Run tests and review in browser
5. **Mark Complete**: Only when ALL checklist items are done
6. **Move to Next**: Select the next pattern to update

**⚠️ Important Rule**: Stay focused on ONE pattern. Don't jump to another pattern until current one is 100% complete with all checklist items done.

## Current Work Session

### Active Pattern
**Pattern:** None (Select next pattern to work on)
**Status:** Not Started
**Started:** N/A

### Pattern Checklist Progress
- [ ] Code examples
- [ ] Images
- [ ] Text content
- [ ] Guidelines
- [ ] Considerations
- [ ] Figma prompts
- [ ] Demo component
- [ ] Component tests
- [ ] Validation passed
- [ ] Browser review complete

### Next Patterns in Queue
1. [To be selected from 12 remaining patterns]
2. [Second in queue]
3. [Third in queue]

### Session Notes
[This section is automatically updated by /save command]

## Recent Sessions

_This section tracks the last 10 work sessions across all machines. It's automatically updated by the /save command._
### Session 2025-11-03 19:29 (MacBook)
- **Pattern:** Cursor Learning Path Guide
- **Status:** ✅ Completed
- **Files Changed:** 2
- **Tests Added/Modified:** 0
- **Notes:** Completed comprehensive Cursor Learning Path guide with 12 detailed lessons across 4 modules (Setup, AI Features, Design-to-Code, Advanced). Reorganized overview section to match Claude Code guide's professional structure with visual module cards, progress stats, and module details table. Fixed hardcoded "Get started with Claude Code" text in UI to work for all guides. Added 8 strategic image/GIF placeholders for key workflows and comprehensive designer-focused content emphasizing AI pair programming, design-to-code workflows, and best practices.

### Session 2025-11-02 23:33 (MacBook)
- **Pattern:** Context Switching
- **Status:** ✅ Completed
- **Files Changed:** 6
- **Tests Added/Modified:** 27 (all passing)
- **Notes:** Completed Context Switching pattern with interactive demo, real product images (ChatGPT & Notion AI), and comprehensive test suite. Created ContextSwitchingDemo.tsx with multi-context conversation manager and educational annotations. Registered demo for wide display (max-w-6xl). Optimized layout with improved spacing and visual hierarchy. All 27 component tests passing.


### Session 2025-11-02 (MacBook)
- **Pattern:** Border Standardization & Color Migration
- **Status:** ✅ Completed
- **Files Changed:** 35
- **Tests Added/Modified:** 0
- **Notes:** Completed comprehensive border standardization across entire application. Migrated 20 hardcoded border-blue-500 instances in CodeExampleBlock.tsx to border-accent-primary. Updated 14+ hex color borders in SelectiveMemoryDemo.tsx to Tailwind utilities (gray-900/gray-800). Added custom ESLint rule to prevent future hardcoded border colors. All structural borders now use gray-200/gray-300 design system values consistently across home page, guides page, and detail pages.

### Session 2025-10-30 19:11 (MacBook)
- **Pattern:** Guide Cards UI Refinement
- **Status:** ✅ Completed
- **Files Changed:** 1
- **Tests Added/Modified:** 0
- **Notes:** Simplified guide card badges by removing read time indicator in favor of MVP approach. Kept skill level badge to show guide difficulty level. Removed read time maintenance overhead since calculating accurate totals from lesson durations required constant updates.


### Session 2025-10-30 06:38 (MacBook)
- **Pattern:** Designer Guides UI/Filtering
- **Status:** ✅ Completed
- **Files Changed:** 7
- **Tests Added/Modified:** 0
- **Notes:** Completed icon implementation using @lobehub/icons package with tool-specific brand colors, grayscale+opacity idle state revealing brand colors on hover. Refactored guides page filter bar from left sidebar to horizontal top bar with three custom dropdown components (Tools, Skill Levels, Sort). Removed system UI dropdowns and replaced with button-based custom dropdowns featuring SVG arrows, click-outside detection, and visual selection indicators. Removed Status and Design Domain filters per user requirements.

### Session 2025-10-28 14:13 (MacBook)
- **Pattern:** Designer Guides Navigation
- **Status:** ✅ Completed
- **Files Changed:** 2
- **Tests Added/Modified:** 0
- **Notes:** Completed Designer Guides feature with full sequential navigation. Added helper functions for previous/next guide navigation and progress tracking. Implemented Previous/Next guide links on detail pages with clean three-column layout. Removed progress bar indicator due to styling complexity. All 5 guides now fully navigable in sequence.

### Session 2025-10-28 02:34 (MacBook)
- **Pattern:** General UI/UX improvements
- **Status:** ✅ Completed
- **Files Changed:** 3
- **Tests Added/Modified:** 0
- **Notes:** Fixed auto-scroll issue in Conversational UI demo (prevented page from scrolling to chat on navigation), redesigned code toggle with iOS-style segmented control and black brand colors, replaced gradient heading lines with minimal gray underlines across all pattern pages, fixed button visibility with darker gray-900 background.

### Session 2025-10-27 21:57 (MacBook)
- **Pattern:** Human-in-the-Loop
- **Status:** ✅ Completed
- **Files Changed:** 3
- **Tests Added/Modified:** 0
- **Notes:** Updated Human-in-the-Loop demo components with improved code examples, cleaned up icon references, and enhanced content structure in code-examples module. Refactored demo layout and moderation component for better visual clarity and user experience.

### Session 2025-10-26 19:47 (MacBook)
- **Pattern:** Selective Memory & UI Cleanup
- **Status:** ✅ Completed
- **Files Changed:** 11
- **Tests Added/Modified:** 0
- **Notes:** Removed "I Use This" pattern tracking feature (saved to removed-features/ for later restoration), updated Selective Memory pattern with animated GIF examples for ChatGPT and Claude memory controls, condensed problem/solution text by 40% while maintaining meaning.

### Session 2025-10-21 17:03 (MacBook)
- **Pattern:** Safe Exploration
- **Status:** ✅ Completed
- **Files Changed:** 23
- **Tests Added/Modified:** 1
- **Notes:** Completed Safe Exploration pattern with real product images (OpenAI Playground, GitHub Copilot Labs, Photoshop AI Beta), simplified demo component to 2-column layout emphasizing safety features, removed clutter, enhanced Safety Guards panel with sticky positioning, updated status to 'completed'. Also committed skills directory for future pattern development workflow.

### Session 2025-10-19 16:09 (MacBook)
## Architecture Overview

### Core Architecture
- **Next.js 15 App Router**: Modern routing with app directory structure
- **React 19**: Latest React with concurrent features
- **TypeScript**: Full type safety with strict configuration
- **Tailwind CSS**: Utility-first styling with custom design system

### Key Architectural Patterns

#### 1. Pattern-Centric Data Architecture
- Central pattern registry (`src/data/patterns.ts`) imports from individual pattern modules
- Each pattern follows structured format with content, examples, and code samples
- Zod schema validation ensures data integrity (`src/schemas/pattern.schema.ts`)
- Pattern loading utilities handle dynamic imports and validation

#### 2. Context-Based State Management
- `PatternProvider` (`src/contexts/PatternContext.tsx`) provides global pattern state
- Custom hooks (`usePatterns`, `usePattern`, `usePatternsByCategory`) for data access
- Optimized with memoization for performance
- Error boundaries and loading states handled centrally

#### 5. Usage Tracking & Cost Analysis
- **ccusage** integration for Claude Code token usage analysis
- Commands available for monitoring Claude Code costs and usage patterns:
  - `npm run usage` - General usage analysis
  - `npm run usage:daily` - Daily usage breakdown with costs
  - `npm run usage:weekly` - Weekly usage summary  
  - `npm run usage:monthly` - Monthly usage and cost analysis
  - `npm run usage:session` - Session-based usage tracking
  - `npm run usage:blocks` - Block-level usage analysis
  - `npm run usage:json` - JSON output for integration/scripting
- Automatically analyzes existing Claude Code JSONL logs from `~/.claude/projects/`
- Provides detailed cost breakdowns by model (Sonnet-4, Opus-4, etc.)
- Tracks input/output tokens, cache creation/reading, and total costs in USD

#### 3. Component Architecture
- **UI Components** (`src/components/ui/`): Reusable design system components
- **Section Components** (`src/components/sections/`): Page-specific sections
- **Example Components** (`src/components/examples/`): Interactive pattern demos
- **Layout Components** (`src/components/layout/`): Navigation and structure

#### 4. Type-Safe Schema System
- Zod schemas define all data structures with validation
- TypeScript types exported from schemas for consistency
- Safe and throwing validation functions available
- Development helpers for detailed error reporting

#### 6. Newsletter Subscription System
- **Prisma ORM** with SQLite database for subscriber management
- **Resend** email service integration for transactional emails
- **API Routes** for subscribe, unsubscribe, and send-update operations
- **Email Templates** built-in HTML email templates (welcome & pattern updates)
- **CLI Tool** for sending pattern update notifications (`npm run send-newsletter`)
- **Soft Delete** active/inactive subscriber management
- **Unsubscribe Tokens** for one-click unsubscribe functionality
- **See** [Newsletter Documentation](docs/NEWSLETTER.md) for complete guide

### Directory Structure

#### Source Code (`src/`)
- `app/` - Next.js 15 app router pages and layouts
  - `api/newsletter/` - Newsletter API routes (subscribe, unsubscribe, send-update)
- `components/` - React components organized by type
- `contexts/` - React context providers and hooks
- `data/` - Pattern data, categories, and utilities
- `hooks/` - Custom React hooks (favorites, search, pagination)
- `lib/` - Shared utilities (Prisma client, Resend client)
- `schemas/` - Zod validation schemas
- `types/` - TypeScript type definitions
- `utils/` - Utility functions and helpers
- `generated/` - Auto-generated code (Prisma client)

#### Pattern Data (`src/data/patterns/`)
- `patterns/` - Individual pattern implementations
- `categories/` - Pattern category definitions
- `examples/` - Example implementations
- `utils/` - Pattern-specific utilities

#### Testing (`src/components/**/__tests__/`)
- Component tests co-located with components
- Jest + React Testing Library
- Snapshot testing for UI consistency
- 100% coverage for critical components (Button, CodeBlock)

## Pattern Development Workflow

### Pattern Structure (12/24 Fully Updated)
Pattern implementation follows this structured format:
1. Each pattern has its own directory in `src/data/patterns/patterns/[pattern-name]/`
2. Consistent structure with index.ts, code-examples.ts, considerations.ts, guidelines.ts
3. All patterns imported in `src/data/patterns.ts`
4. Patterns validated with `npm run test:patterns`
5. Interactive demos for completed patterns
6. **Current Status**: 12 patterns fully updated, 12 require comprehensive updates

### Pattern Structure Requirements
- `id` and `slug` must match and use kebab-case
- Minimum 1 example with image, description, and alt text
- Minimum 1 guideline and 1 consideration
- Code examples should include title, description, and working code
- All images must be optimized and use proper formats

## Testing Strategy

### Current Coverage
- **481 comprehensive tests** across all components and utilities
- **48% test coverage** (statements) - significant progress toward 70% target
  - Statements: 47.82% ✅ (nearly 50%)
  - Lines: 48.28% ✅
  - Functions: 39% ✅
  - Branches: 36.19% ✅
- **12/24 AI design patterns fully updated** with comprehensive content and demos
- **12/24 patterns require updates** - work in progress
- **100% component test coverage** - every component has comprehensive tests
- Data validation with 83% coverage: Patterns, Categories
- Advanced test infrastructure with proper mocking for Next.js, framer-motion, and browser APIs
- Coverage thresholds set at 70% (major progress from ~20% baseline)

### Testing Tools
- **Jest** with Next.js integration and advanced mocking
- **React Testing Library** for component testing with user event simulation
- **Comprehensive mocking infrastructure**:
  - Next.js components (Image, Link, useRouter)
  - Framer Motion (motion, useMotionValue, useSpring, useTransform)
  - Browser APIs (scrollIntoView, window properties)
- **Zod** for data validation testing (83% coverage)
- **Snapshot testing** for UI consistency
- **Playwright** configured for e2e testing (not yet implemented)

### Test File Locations
- Component tests: `src/components/**/__tests__/` (100% coverage)
- Example tests: `src/components/examples/__tests__/` (all interactive demos)
- UI tests: `src/components/ui/__tests__/` (all reusable components)
- Section tests: `src/components/sections/__tests__/` (all page sections)
- Provider tests: `src/components/providers/__tests__/` (context providers)
- Data tests: `src/data/__tests__/` (pattern validation)
- Utility tests: `src/utils/__tests__/` (helper functions)
- Hook tests: `src/hooks/__tests__/` (custom React hooks)
- Schema tests: `src/schemas/__tests__/` (Zod validation)

## Build & Performance

### Image Optimization
- Automatic WebP/AVIF generation
- GIF to WebM/MP4 conversion for animations
- Responsive image sizing with Next.js Image
- Aggressive caching (1 year TTL)

### Bundle Optimization
- Custom webpack configuration for chunk splitting
- Separate bundles for: framework, motion, syntax-highlighter, search
- Tree shaking and dead code elimination
- Turbo mode in development

### Performance Monitoring
- Vercel Speed Insights integration
- Build metrics tracked in `build-metrics.json`
- Core Web Vitals optimization

## Development Best Practices

### Working Directory Rules
- **Stay in current directory after `/clear` command** - Do not change directories unless explicitly requested by the user
- Use absolute paths when necessary rather than changing directories
- Maintain context of the current working directory throughout the session

### Code Style
- Use existing component patterns and design system
- Follow TypeScript strict mode requirements
- Validate all data against Zod schemas
- Implement proper error boundaries and loading states

### Pattern Development
- Always validate new patterns with `npm run test:patterns`
- Use the AI pattern generator for consistent structure
- Include interactive demos when possible
- Ensure accessibility compliance (alt text, semantic HTML)

### Testing Requirements
- Write tests for all new components
- Use React Testing Library best practices
- Mock external dependencies (Next.js components, APIs)
- Maintain coverage thresholds

### Performance Considerations
- Optimize images before adding to `public/images/`
- Use Next.js Image component for all images
- Implement lazy loading for heavy components
- Monitor bundle size impact of new dependencies

## AI-Powered Development

This project includes several AI agents for automated development tasks:

### Pattern Generator Agent
- Generates consistent pattern structures
- Creates examples and code samples
- Validates against schemas automatically

### Component Testing Agent
- Generates comprehensive test suites
- Follows testing best practices
- Creates snapshots and interaction tests

### Design Consistency Agent
- Analyzes design system usage
- Generates style guides
- Fixes inconsistencies automatically

### Project Progress Agent (NEW)
- **Monitors all other AI agents** and tracks their outputs
- **Automatically updates task status** when agents complete work
- **Provides intelligent progress reporting** with agent coordination
- **Suggests next priority actions** based on current project state
- **Maintains project status files** (docs/status.md, tasks/tasks.json)
- **Cross-agent communication** - ensures agents work together effectively

#### Agent Integration Features
- **Pattern tracking**: Detects when patterns are updated (12/24 fully updated, 12 in progress)
- **Test monitoring**: Tracks test generation and coverage improvements
- **Design analysis**: Integrates design consistency reports and fixes
- **Build health**: Monitors TypeScript errors and build metrics
- **Smart recommendations**: Suggests optimal sequence of agent execution

These tools are accessible via npm scripts and help maintain code quality and consistency at scale. The Progress Agent acts as a coordination layer that ensures all agents work together effectively and maintains accurate project status.

### Recent Major Achievements (Latest Session)
- **Dramatically improved test coverage from ~20% to 48%**
- **Fixed all major component test failures** with proper mocking infrastructure
- **Generated comprehensive tests for 6+ additional components**
- **Implemented robust test infrastructure** for complex animations and interactions
- **All 481 tests now have proper mocking** for Next.js, framer-motion, and browser APIs
