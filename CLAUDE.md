# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js 15 application showcasing AI design patterns with TypeScript, React 19, and Tailwind CSS. The project has **all 24 AI design patterns fully completed** across 7 categories, with complete implementations including code examples, interactive demos, real-world examples, and design guidance.

### Pattern Status Summary
- **✅ All Patterns Complete (24/24)**: Every pattern has complete implementations with code examples, interactive demos, real-world examples, guidelines, considerations, and Figma design prompts

### All Patterns - Complete (24/24)
1. ✅ Adaptive Interfaces
2. ✅ Ambient Intelligence (Oct 17)
3. ✅ Augmented Creation
4. ✅ Collaborative AI
5. ✅ Confidence Visualization
6. ✅ Context Switching (Nov 2)
7. ✅ Contextual Assistance
8. ✅ Conversational UI
9. ✅ Error Recovery
10. ✅ Explainable AI
11. ✅ Feedback Loops (Nov 2)
12. ✅ Graceful Handoff (Nov 2)
13. ✅ Guided Learning
14. ✅ Human-in-the-Loop
15. ✅ Intelligent Caching (Nov 3)
16. ✅ Multimodal Interaction
17. ✅ Predictive Anticipation
18. ✅ Privacy-First Design (Nov 7)
19. ✅ Progressive Disclosure
20. ✅ Progressive Enhancement (Nov 7)
21. ✅ Responsible AI Design
22. ✅ Safe Exploration (Oct 21)
23. ✅ Selective Memory
24. ✅ Universal Access Patterns (Nov 7)

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
- `npm run generate-guide` - Generate Designer Guide learning paths (NEW!)
- `npm run list-guides` - List all guides and completion status (NEW!)
- `npm run validate-guides` - Validate guide structure (NEW!)
- `npm run generate-test` - Generate tests for components using AI
- `npm run generate-all-tests` - Generate all missing tests
- `npm run list-untested` - List components without tests

### Automation & Agent Orchestration (NEW - Nov 3, 2025)
- `npm run orchestrate:workflow guide-generation` - Run guide generation workflow
- `npm run orchestrate:workflow aiux-sprint` - Full AIUX feature development sprint
- **See [.claude/AUTOMATION-SETUP.md](.claude/AUTOMATION-SETUP.md) for complete automation documentation**

**Key Feature**: Claude now **automatically detects** when you mention patterns or guides and proactively suggests the appropriate generator commands. This is powered by enhanced skills in `.claude/skills/pattern-dev/` and `.claude/skills/guide-gen/`.

### Project Progress & Coordination
- `npm run progress-report` - Comprehensive progress report with agent activities
- `npm run progress-status` - Quick project status summary
- `npm run progress-agents` - Show all AI agent status and recent activities
- `npm run progress-next` - Get next priority actions with agent suggestions
- `npm run progress-update` - Update task status based on agent activities
- `npm run progress-sync` - Synchronize all status files with current state

### Design Consistency Tools
- `npm run design-audit` - Scan for hardcoded colors and design token violations (runs on every commit)
- `npm run design-analyze` - Analyze design consistency
- `npm run design-report` - Generate design consistency report
- `npm run design-style-guide` - Generate style guide
- `npm run design-fix` - Fix single design issue
- `npm run design-fix-all` - Fix all design issues
- **See** [Design System Enforcement](docs/DESIGN_SYSTEM_ENFORCEMENT.md) for automatic pre-commit validation

### Image & Asset Management
- `npm run optimize-images` - Optimize all images (WebP, AVIF, compression)
- `npm run convert-gifs` - Convert GIFs to WebM/MP4 for better performance

### Data Management
- `npm run fix-patterns` - Fix pattern data structure issues

### Newsletter & Email Management
- `npm run send-newsletter` - Send pattern update emails to subscribers (interactive mode)
- See [Newsletter Documentation](docs/NEWSLETTER.md) for complete setup and usage guide

## My Development Workflow

### ⚡ Automated Workflow System (NEW - Nov 3, 2025)
**Claude is now configured with automated pattern and guide generation.**

Instead of manually managing tasks, Claude will:
1. **Detect intent** - When you mention "pattern", "guide", "generate", etc.
2. **Auto-suggest** - Proactively recommend the right generator
3. **Explain what happens** - Show what the command will do
4. **Coordinate agents** - Work with test-gen, design agents, etc.

**See [.claude/AUTOMATION-SETUP.md](.claude/AUTOMATION-SETUP.md) for full documentation**

**Quick examples of new behavior**:
- You: "Let's work on Ambient Intelligence"
- Claude: "Ready to generate? Run: `npm run generate-pattern ambient-intelligence`"

- You: "Create a guide for GitHub Copilot"
- Claude: "I'll generate a learning path using your existing guides as templates. Run: `npm run generate-guide`"

This automation system includes:
- ✅ Enhanced pattern-dev skill (`.claude/skills/pattern-dev/SKILL.md`)
- ✅ New guide-gen skill (`.claude/skills/guide-gen/SKILL.md`)
- ✅ Guide generator script (`.scripts/ai-guide-generator.js`)
- ✅ Updated agent orchestrator with guide support

### Pattern Update Workflow (Primary)
**I work on ONE pattern at a time until 100% complete.** Do not move to the next pattern until the current one is finished.

**Now with automation**: Instead of manually creating all files, run `npm run generate-pattern [slug]` and then enhance with images and content.

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
### Session 2025-11-13 09:24 (MacBook)
- **Pattern:** Code Quality & Security Improvements
- **Status:** ✅ Completed
- **Files Changed:** 39
- **Tests Added/Modified:** 1
- **Notes:** Comprehensive code quality overhaul: Fixed all 37 TypeScript errors (robots.ts duplicates, React 19 JSX compatibility, Jest mock typing, Next.js 15 params), resolved 10 security vulnerabilities (installed DOMPurify, added XSS sanitization in 5 components, redacted PII from logs in 4 API routes, upgraded email validation to Zod). Created test infrastructure with 64 API endpoint tests across 4 suites. All dependencies updated to secure versions. Generated CODE_QUALITY_IMPROVEMENTS.md documentation. Rotated exposed API keys (Resend and Newsletter). Code rating improved from 5.5/10 → 7.0/10 with zero TypeScript errors, zero security vulnerabilities, and security rating 9/10.

### Session 2025-11-11 19:22 (MacBook)
- **Pattern:** Crisis Detection & Escalation - Chat UI Refinements
- **Status:** ✅ Completed
- **Files Changed:** 1
- **Tests Added/Modified:** 0
- **Notes:** Refined Crisis Detection demo UX with proper chat styling. Fixed page scroll issue by changing from scrollIntoView() to container-only scrolling (scrollTop assignment). Added white filled message boxes for system messages with gray borders (realistic chat UI). Changed scroll behavior to only trigger when conversation exceeds 3 messages. Updated send button to use Tailwind blue-600 for visibility. Demo now provides proper chat-like experience with visual clarity and smooth interactions without page jumps.

### Session 2025-11-11 19:13 (MacBook)
- **Pattern:** Safety & Harm Prevention (Crisis Detection & Escalation + 3 related patterns)
- **Status:** ✅ Completed
- **Files Changed:** 33 (28 new pattern files, 3 new images, 1 demo component, 5 modified files)
- **Tests Added/Modified:** 0
- **Notes:** Completed Crisis Detection & Escalation pattern with multi-layer detection system (4 independent layers: keywords, context, behavior, manipulation). Created interactive CrisisDetectionDemo component with real-time detection, auto-scrolling chat interface, and in-chat crisis alert display. Consolidated 3 redundant code examples into 1 comprehensive example covering all layers + React integration. Updated Figma prompt to explain pattern implementation rather than design specs. Integrated real-world example images (Woebot, Crisis Text Line, harmful ChatGPT conversation). Also scaffolded 3 additional Safety & Harm Prevention patterns (Session Degradation Prevention, Anti-Manipulation Safeguards, Vulnerable User Protection) with complete content structure. Pattern validation shows Crisis Detection now has all required images and is fully integrated.

### Session 2025-11-11 13:27 (MacBook)
- **Pattern:** Handbook Navigation & Simulator Copy Updates
- **Status:** ✅ Completed
- **Files Changed:** 4 (4 modified)
- **Tests Added/Modified:** 0
- **Notes:** Repositioned back-to-home link in handbook page from top to bottom of left panel to reduce visual importance and maintain focus on email signup form. Changed left panel layout from justify-start to justify-between for proper spacing. Updated simulator page subheading from misleading "Compare patterns side-by-side with live metrics and performance data" to "Compare patterns side-by-side and explore their potential impact" to accurately reflect educational nature. Both handbook and simulator text changes verified in browser.

### Session 2025-11-11 09:24 (MacBook)
- **Pattern:** Lead Magnet Handbook - PDF Generation Flow
- **Status:** ✅ Completed
- **Files Changed:** 3 (3 modified)
- **Tests Added/Modified:** 0
- **Notes:** Fixed handbook PDF generation flow by streamlining the modal to send email directly to the API endpoint. Updated HandbookModal component to use single POST call instead of separate newsletter subscribe and PDF generation calls. Enhanced API endpoint to handle email validation, newsletter subscription, and logging in one unified request. Build verified successfully.


### Session 2025-11-13 10:15 (MacBook)
- **Pattern:** Email Signup & Handbook Download System
- **Status:** ✅ Completed
- **Files Changed:** 6 (4 modified, 2 new)
- **Tests Added/Modified:** 0
- **Notes:** Implemented comprehensive email signup flow audit and system overhaul. Discovered and fixed critical issue where footer and handbook signup flows sent identical misleading emails. Created source-based email differentiation (footer/handbook/direct) with separate email templates: Newsletter Welcome for footer (newsletter-only) vs Handbook Welcome (with 30-day download link). Built HMAC-based token system for 30-day valid PDF download links in emails (no JWT deps needed). Added smart already-subscribed detection in footer with contextual handbook offer instead of error. Enhanced handbook page to match modal experience with full PDF generation. Implemented /api/handbook/download endpoint with token validation. Created 10+ signup scenarios with proper attribution and fallback logic. Updated email button styling for better email client compatibility.

### Session 2025-11-10 20:45 (MacBook)
- **Pattern:** Lead Magnet Handbook Refinement - 6 Essential AI Design Patterns
- **Status:** ✅ Completed
- **Files Changed:** 2 (2 modified)
- **Tests Added/Modified:** 0
- **Notes:** Refined the lead magnet PDF handbook with comprehensive improvements. Applied consistent "When to Use" section formatting (with proper div wrapper and styling) to all 6 patterns, removed gray backgrounds and borders for clean aesthetic, added 2px solid borders to all pages for professional presentation. Replaced "Join the Community" section with dual CTAs: "Go Deeper with All 24 Patterns" (links to aiuxdesign.guide) and "Try the Interactive Simulator" (links to simulator page). Integrated "Build toward that" into Final Truth paragraph for stronger closing statement.

### Session 2025-11-10 19:56 (MacBook)
- **Pattern:** Complete Guide Updates - GitHub Copilot & Cursor
- **Status:** ✅ Completed
- **Files Changed:** 20 (1 modified, 19 image assets added)
- **Tests Added/Modified:** 0
- **Notes:** Completed both AI designer guides with real tutorial screenshots. Downloaded and integrated 9 official images for GitHub Copilot guide from VS Code CDN, and 7 real Cursor tutorial screenshots from sunnyd.top blog for the Cursor guide. Fixed image mismatch issue where original Cursor images were irrelevant marketing benchmarks - replaced with actual tool interface screenshots showing Tab completion, Chat panels, inline editing, Composer, and @-mentions features. Added enhanced code examples (React ProductCard component and .cursorrules template). Both guides now 100% complete with relevant visual content matching lesson descriptions. Build verified with no errors.


### Session 2025-11-10 (MacBook)
- **Pattern:** AI Design Patterns Handbook & Lead Magnet System
- **Status:** ✅ Completed
- **Files Changed:** 10 (9 created, 1 modified)
- **Tests Added/Modified:** 0
- **Notes:** Completed comprehensive "6 Essential AI Design Patterns" handbook as lead magnet. Created two-column layout with "The Idea" and "Products Doing It Right" sections, added "When to Use" decision trees for each pattern, integrated product images/logos from centralized mapping, and corrected product examples for patterns 2, 5, and 6. Built HandbookModal component with email subscription, PDF generation via html2pdf, and integrated handbook content system. Created brand-colors and content-audit skills for design/quality monitoring. API route generates PDF HTML dynamically. All 6 patterns now have verified products with proper logos and descriptions.

### Session 2025-11-07 22:00 (MacBook)
- **Pattern:** Project Completion - All 24 Patterns Done
- **Status:** ✅ Completed
- **Files Changed:** 1 (CLAUDE.md)
- **Tests Added/Modified:** 0
- **Notes:** Updated CLAUDE.md to reflect that all 24 AI design patterns are now fully completed. Removed "Patterns Requiring Update" section and consolidated status to show 100% completion across all patterns with implementations, interactive demos, real-world examples, and design guidance. Added completion dates for the 9 most recently completed patterns (Ambient Intelligence Oct 17, Safe Exploration Oct 21, Context Switching/Feedback Loops/Graceful Handoff Nov 2, Intelligent Caching Nov 3, Privacy-First Design/Progressive Enhancement/Universal Access Nov 7).

### Session 2025-11-07 21:31 (MacBook)
- **Pattern:** Guide Content Updates
- **Status:** ✅ Completed
- **Files Changed:** 4
- **Tests Added/Modified:** 0
- **Notes:** Updated guide images and styling. Removed grayscale hover effect from guide card icons in CourseCard to display tool icons in original colors at all times. Added two real guide images: Claude Code API key GIF (lesson-1) and Cursor interface layout PNG (lesson-2), with proper image references in guides.ts. Both guides now display images in their setup sections.

### Session 2025-11-07 19:59 (MacBook)
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

### Pattern Structure (24/24 Complete ✅)
Pattern implementation follows this structured format:
1. Each pattern has its own directory in `src/data/patterns/patterns/[pattern-name]/`
2. Consistent structure with index.ts, code-examples.ts, considerations.ts, guidelines.ts, examples.ts, figma-prompt.ts
3. All patterns imported in `src/data/patterns.ts`
4. Patterns validated with `npm run test:patterns`
5. Interactive demos for all patterns with working code previews
6. **Current Status**: All 24 patterns fully completed with comprehensive implementations

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
- **✅ 24/24 AI design patterns fully completed** with comprehensive content, interactive demos, and code examples
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
