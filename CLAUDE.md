# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js 15 application showcasing AI design patterns with TypeScript, React 19, and Tailwind CSS. The project has **all 28 AI design patterns fully completed** across 8 categories, with complete implementations including code examples, interactive demos, real-world examples, and design guidance.

### Pattern Status Summary
- **✅ All Patterns Complete (28/28)**: Every pattern has complete implementations with code examples, interactive demos, real-world examples, guidelines, considerations, and Figma design prompts

### All Patterns - Complete (28/28)
1. ✅ Adaptive Interfaces
2. ✅ Ambient Intelligence (Oct 17)
3. ✅ Anti-Manipulation Safeguards (Nov 11)
4. ✅ Augmented Creation
5. ✅ Collaborative AI
6. ✅ Confidence Visualization
7. ✅ Context Switching (Nov 2)
8. ✅ Contextual Assistance
9. ✅ Conversational UI
10. ✅ Crisis Detection & Escalation (Nov 11)
11. ✅ Error Recovery
12. ✅ Explainable AI
13. ✅ Feedback Loops (Nov 2)
14. ✅ Graceful Handoff (Nov 2)
15. ✅ Guided Learning
16. ✅ Human-in-the-Loop
17. ✅ Intelligent Caching (Nov 3)
18. ✅ Multimodal Interaction
19. ✅ Predictive Anticipation
20. ✅ Privacy-First Design (Nov 7)
21. ✅ Progressive Disclosure
22. ✅ Progressive Enhancement (Nov 7)
23. ✅ Responsible AI Design
24. ✅ Safe Exploration (Oct 21)
25. ✅ Selective Memory
26. ✅ Session Degradation Prevention (Nov 11)
27. ✅ Universal Access Patterns (Nov 7)
28. ✅ Vulnerable User Protection (Nov 11)

### Pattern Categories (8 Total)

#### Accessibility & Inclusion (1 pattern)
  - Universal Access Patterns

#### Adaptive & Intelligent Systems (4 patterns)
  - Adaptive Interfaces
  - Ambient Intelligence
  - Guided Learning
  - Predictive Anticipation

#### Human-AI Collaboration (6 patterns)
  - Augmented Creation
  - Collaborative AI
  - Contextual Assistance
  - Feedback Loops
  - Graceful Handoff
  - Human-in-the-Loop

#### Natural Interaction (4 patterns)
  - Context Switching
  - Conversational UI
  - Multimodal Interaction
  - Progressive Disclosure

#### Performance & Efficiency (2 patterns)
  - Intelligent Caching
  - Progressive Enhancement

#### Privacy & Control (2 patterns)
  - Privacy-First Design
  - Selective Memory

#### Safety & Harm Prevention (4 patterns)
  - Anti-Manipulation Safeguards
  - Crisis Detection & Escalation
  - Session Degradation Prevention
  - Vulnerable User Protection

#### Trustworthy & Reliable AI (5 patterns)
  - Confidence Visualization
  - Error Recovery
  - Explainable AI
  - Responsible AI Design
  - Safe Exploration

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
### Session 2025-12-02 16:49 (MacBook)
- **Pattern:** Audit Results - Product Examples & Chat Fix
- **Status:** ✅ Completed
- **Files Changed:** 2
- **Tests Added/Modified:** 0
- **Notes:** Added product examples to pattern audit analysis results. Each detected pattern now shows up to 2 real-world product examples (ChatGPT, Notion, etc.) with images from the pattern database. Fixed chat panel auto-scroll issue where the entire page was scrolling when messages arrived; now only the messages container scrolls using scrollTop instead of scrollIntoView.

### Session 2025-12-02 16:07 (MacBook)
- **Pattern:** Dark Mode Fixes - Pattern Demo Components
- **Status:** ✅ Completed
- **Files Changed:** 13
- **Tests Added/Modified:** 0
- **Notes:** Comprehensive dark mode fixes across pattern demo components. Fixed 5 interactive demos (Progressive Disclosure, Human-in-the-Loop, Multimodal Search, Ambient Intelligence, Predictive Anticipation) with proper dark mode classes for backgrounds, text, borders, and gradients. Fixed hero section backgrounds to use brand navy (#162036) in dark mode. Added dark mode support to logo carousel with white filter. Fixed CodeExampleBlock Preview/Code toggle with inverted color scheme (dark button on light, white button on dark) for proper visibility in both modes.

### Session 2025-12-02 15:14 (MacBook)
- **Pattern:** Design System Refinements - Navbar & Guides Page
- **Status:** ✅ Completed
- **Files Changed:** 3
- **Tests Added/Modified:** 0
- **Notes:** Increased navbar text size from text-sm to text-base for better readability on MacBook screens. Added proper spacing (pt-12 md:pt-16) between guides page hero section and filter content to match prompts/patterns pages. Updated BRAND_GUIDELINES.md with comprehensive documentation including text colors, hero backgrounds, Satoshi font, card patterns, navigation anti-shift techniques, and logo carousel CSS.

### Session 2025-12-02 12:05 (MacBook)
- **Pattern:** Design System Typography & Layout Refinements
- **Status:** ✅ Completed
- **Files Changed:** 11
- **Tests Added/Modified:** 0
- **Notes:** Refined text colors inspired by Fold.money with navy headings (#162036) and readable slate body text (#20294C). Updated company logo carousel to use navy tint filter with hover-to-reveal original colors. Fixed navbar layout shift by adding invisible bold text spacer and always-present transparent border. Aligned prompt/pattern page structures for consistent navbar positioning. Standardized card typography (text-lg font-semibold titles, text-sm py-1.5 category badges). Added proper spacing between hero sections and content areas across prompts and guides pages.

### Session 2025-11-26 18:03 (MacBook)
- **Pattern:** Design System Color Refresh - Navy Aesthetic
- **Status:** ✅ Completed
- **Files Changed:** 37
- **Tests Added/Modified:** 0
- **Notes:** Comprehensive design system update replacing all black colors with sophisticated navy (#1e293b, slate-800). Simplified navigation by removing sticky positioning, reducing padding (py-5→py-3→py-5), and implementing minimal active states with bottom borders and bold text. Updated hero heading to extrabold with larger size and new --text-hero token. Replaced entire color system: --text-primary, --accent-primary, all button colors (bg-black→bg-accent-primary), shadow system (rgba black→rgba navy), and --accent-hover (#262626→#475569). Fixed 24+ components and inline buttons across app to use design tokens instead of hardcoded colors. Added cursor-pointer to newsletter button and theme toggle. Result: Softer, more sophisticated aesthetic with 12.6:1 contrast (AAA), consistent navy throughout text/buttons/shadows, and improved visual hierarchy.

### Session 2025-11-26 14:56 (MacBook)
- **Pattern:** Pattern Detail Page Newsletter Integration
- **Status:** ✅ Completed
- **Files Changed:** 2
- **Tests Added/Modified:** 0
- **Notes:** Added email collection to pattern detail pages with contextual "Want More Patterns Like This?" messaging. Enhanced InlineNewsletterSignup component with pattern-detail variant, localStorage-based hiding after subscription, and custom heading/subheading props. Placed newsletter section after Guidelines & Considerations for optimal conversion timing. Removed Related Guides section to reduce clutter. All newsletter CTAs (hero, pattern detail, footer) now use same API with 'handbook' source sending PDF + newsletter signup, and hide across all pages once user subscribes via localStorage check.

### Session 2025-11-26 14:20 (MacBook)
- **Pattern:** Homepage Newsletter & Logo Carousel Improvements
- **Status:** ✅ Completed
- **Files Changed:** 5
- **Tests Added/Modified:** 0
- **Notes:** Created inline newsletter signup component to replace modal-only approach, improving conversion from 0.23% toward 5-10% target. Simplified hero section by removing "28 AI Patterns" chip, "or download handbook" link, and increasing spacing (mb-6→mb-9, mb-10→mb-16) for minimal aesthetic. Moved company logo carousel below email form as social proof. Fixed logo carousel by switching from CSS animation to Framer Motion with right-to-left scroll (animate={{ x: [-2000, 0] }}), ensuring all 17 logos display continuously. Added Midjourney logo to local assets. Slowed carousel duration from 30s to 100s for very slow, ambient animation. Newsletter form now sends handbook PDF immediately upon signup using 'handbook' source.

### Session 2025-11-25 10:53 (MacBook)
- **Pattern:** Pattern Audit Tool - WIP Chip
- **Status:** ✅ Completed
- **Files Changed:** 1
- **Tests Added/Modified:** 0
- **Notes:** Added "Work in Progress" chip to the audit landing page hero section. The chip displays above the main heading with a construction emoji (🚧), pill-shaped design, and accent-subtle background to clearly indicate the feature is under development.

### Session 2025-11-25 10:06 (MacBook)
- **Pattern:** Pattern Audit Tool Implementation
- **Status:** ✅ Completed
- **Files Changed:** 15
- **Tests Added/Modified:** 0
- **Notes:** Built complete AI UX Pattern Audit tool with Claude Vision API integration. Implemented 5-page flow (landing, context form, upload, analyze, results) that analyzes design screenshots against all 28 AI UX patterns. Created context-aware pattern detection with priority mapping for different interface types (chatbot, content generator, code assistant, etc.). Replaced /prompt-builder with /audit tool including full design system compliance (black/white minimal aesthetic), Heroicons integration, and Navbar/Footer navigation. Added API endpoint with Anthropic SDK, TypeScript types, pattern detection prompts, PatternCard component, and sessionStorage-based state management. Tool provides actionable recommendations showing which patterns are well-implemented, weak, or missing with specific improvement suggestions.

### Session 2025-11-24 19:01 (MacBook)
- **Pattern:** Design System & AI Prompt Section Updates
- **Status:** ✅ Completed
- **Files Changed:** 20
- **Tests Added/Modified:** 0
- **Notes:** Fixed Tailwind v4 dark mode by adding @config directive to globals.css. Updated all border-gray-100 to border-gray-200 across 16 files for better visibility (inspired by Vercel). Redesigned FigmaPromptCard to "AI Design Prompt" with multi-tool support showing logos for Figma, Uizard, Cursor, Claude, Gemini, and Galileo AI. Added polished custom tooltips for tool logos. Removed card hover text lightening effect. Used black/white brand colors for prompt section header.

### Session 2025-11-24 09:07 (MacBook)
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
