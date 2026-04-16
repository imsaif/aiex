# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js 15 application showcasing AI design patterns with TypeScript, React 19, and Tailwind CSS. The project has **all 36 AI design patterns fully completed** across 8 categories, with complete implementations including code examples, interactive demos, real-world examples, and design guidance.

### Pattern Status Summary
- **✅ All Patterns Complete (36/36)**: Every pattern has complete implementations with code examples, interactive demos, real-world examples, guidelines, considerations, and Figma design prompts

### All Patterns - Complete (36/36)
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
29. ✅ Autonomy Spectrum (Feb 16) 🤖
30. ✅ Intent Preview (Feb 16) 🤖
31. ✅ Plan Summary (Feb 16) 🤖
32. ✅ Action Audit Trail (Feb 16) 🤖
33. ✅ Escalation Pathways (Feb 16) 🤖
34. ✅ Trust Calibration (Feb 16) 🤖
35. ✅ Mixed-Initiative Control (Feb 16) 🤖
36. ✅ Agent Status & Monitoring (Feb 16) 🤖

### Pattern Categories (8 Total)

#### Accessibility & Inclusion (1 pattern)
  - Universal Access Patterns

#### Adaptive & Intelligent Systems (4 patterns)
  - Adaptive Interfaces
  - Ambient Intelligence
  - Guided Learning
  - Predictive Anticipation

#### Human-AI Collaboration (10 patterns)
  - Augmented Creation
  - Collaborative AI
  - Contextual Assistance
  - Feedback Loops
  - Graceful Handoff
  - Human-in-the-Loop
  - Autonomy Spectrum 🤖
  - Intent Preview 🤖
  - Escalation Pathways 🤖
  - Mixed-Initiative Control 🤖

#### Natural Interaction (4 patterns)
  - Context Switching
  - Conversational UI
  - Multimodal Interaction
  - Progressive Disclosure

#### Performance & Efficiency (3 patterns)
  - Intelligent Caching
  - Progressive Enhancement
  - Agent Status & Monitoring 🤖

#### Privacy & Control (2 patterns)
  - Privacy-First Design
  - Selective Memory

#### Safety & Harm Prevention (4 patterns)
  - Anti-Manipulation Safeguards
  - Crisis Detection & Escalation
  - Session Degradation Prevention
  - Vulnerable User Protection

#### Trustworthy & Reliable AI (8 patterns)
  - Confidence Visualization
  - Error Recovery
  - Explainable AI
  - Responsible AI Design
  - Safe Exploration
  - Plan Summary 🤖
  - Action Audit Trail 🤖
  - Trust Calibration 🤖

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
- `npm run send-newsletter` — generate a pattern-update HTML blob that admin pastes into a new Beehiiv post
- Newsletter broadcasts via **Beehiiv (manual compose)**: admin clicks Publish in our admin UI → post goes live on /news → admin clicks "Copy HTML" → pastes into a new Beehiiv post → Beehiiv sends to subscribers. Beehiiv free/Launch tier has no Posts API, so delivery is intentionally manual.
- Welcome emails via **Beehiiv Automations** (keyed on `signup_source` custom field, triggered by subscriber sync).
- Transactional emails (audit reports, admin watchdog alerts, cron failure alerts) via **Resend free tier** — ~150 emails/month, well under the 3,000/month cap.
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
### Session 2026-04-16 23:34 (MacBook)
- **Pattern:** Project prioritization + homepage hero + SEO + AI discoverability
- **Status:** ✅ Completed (3 commits, push pending)
- **Files Changed:** 6
- **Tests Added/Modified:** 0
- **Notes:** Set up GitHub Projects board ("aiex Roadmap") with priority fields (P0-P3) and status columns. Seeded board from memory follow-ups: 8 issues total, closed 5 duplicate LHCI regression issues. Analyzed Clarity CSV export (Apr 2-16): confirmed INP fix worked (1,100ms→224ms, closed #19), audit funnel has only 4/50 completions (too early for gating), identified React #418 hydration error (7 sessions) and setProductFilter bug (2 sessions). Fixed /news page CLS (0.1045→should pass): rewrote isToday()/isNew() to use UTC consistently eliminating hydration gate, enabled SSR for InlineNewsletterSignup and fixed placeholder height mismatch (48px→152px), fixed setProductFilter typo. Bumped LHCI workflow Node.js 20→22. Restored newsletter signup to homepage hero as primary CTA — data showed signups dropped 55% (11/wk→5/wk) after Apr 1 switch to audit CTA. Audit CTA demoted to subtle text link below intro. SEO paragraph moved below pattern grid. Optimized meta titles/descriptions for 8 high-impression zero-click patterns from GSC data (progressive-disclosure pos 5.85, adaptive-interfaces pos 4.92, context-switching pos 4.96, etc.) — rewrote to match exact search query language. Created /llms.txt with all 36 patterns, 5 guides, tools, and resources for AI tool discoverability (site already gets traffic from ChatGPT 32, Perplexity 29, Gemini 14, Claude 13 sessions). Created #25 for .gist.design dogfood experiment (P3).

### Session 2026-04-16 19:44 (MacBook)
- **Pattern:** Dynamic OG image generation for all page types
- **Status:** ✅ Completed (1 commit, push pending)
- **Files Changed:** 11
- **Tests Added/Modified:** 0
- **Notes:** Built dynamic Open Graph image generation system to fix missing GSC thumbnails. GSC Insights showed ~15 pages with no thumbnail previews — root cause was either empty `thumbnail` fields (6 agentic patterns) or product screenshot GIFs/PNGs at wrong dimensions being rejected by Google/social platforms. Created 3 OG API routes following the existing newsletter OG pattern (`@vercel/og` ImageResponse + Satori): **(1) `/api/og/patterns?slug=...`** — 36 pattern pages, each with category-specific Lucide icon (Brain, Shield, MessageCircle, Zap, Lock, Heart, Users, ShieldAlert) centered in concentric rings over a straight wireframe grid mesh. **(2) `/api/og/guides?slug=...`** — 5 guide pages, each with actual brand logo SVG (Anthropic "A" for Claude Code, Cursor hexagon, GitHub Copilot visor, GitHub octocat, MessageCircle for Conversational UI) using fill-based rendering. **(3) `/api/og/page?slug=...`** — 5 standalone pages (news, handbook, agent-readability-audit-kit, agentic-ux-checklist, prompts), each with a relevant Lucide icon (Newspaper, BookOpen, ClipboardCheck, CheckSquare, Sparkles). All cards share identical design: black bg (#0a0a0a), Satoshi font (TTF loaded for Satori), WCAG AAA accessible text hierarchy (#ffffff title 19.4:1, #d4d4d4 body 12.1:1, #b0b0b0 tertiary 8.5:1), straight wireframe grid on right side, concentric rings + large 80px icon, divider + branded footer. Consulted dwc color-specialist MCP for accessibility — original grays (#555555, #888888) failed WCAG AA; fixed all text to AAA. Brand color validated as navy #162036 (not purple) — too dark for accent on dark OG bg, so went monochrome white-on-black matching the PDF handbook aesthetic. Shared utilities extracted to `src/app/api/og/shared.ts` (colors, icons, grid generator, font loader). Metadata wired: `src/utils/metadata.ts` (patterns), `src/app/guides/[slug]/page.tsx` (guides), plus 5 individual page files. All routes return 200, zero new TS errors. Cache headers set to 7-day edge cache. **Coverage:** 46 pages now have unique branded OG cards (36 patterns + 5 guides + 5 standalone), newsletter articles already had dynamic OG, 6 index/landing pages use static og-home.png (appropriate), 2 noindex pages skipped.

### Session 2026-04-16 14:05 (MacBook)
- **Pattern:** GSC coverage fixes + guide↔pattern cross-linking
- **Status:** ✅ Completed (1 commit, push pending)
- **Files Changed:** 13
- **Tests Added/Modified:** 0
- **Notes:** Analyzed GSC coverage export (Apr 16) showing 54 indexed / 98 not-indexed pages. Impressions healthy at 5x growth (200→1,000+/day). The 98 not-indexed broke down into 7 categories; implemented fixes for the 4 actionable ones. **(1) 404 fixes:** Added 3 redirects in `next.config.mjs` for deleted audit sub-routes (`/audit/context`, `/audit/upload`, `/audit/analyze` → `/audit`). Deleted orphaned `/prompt-builder/` directory (88 LOC — redirect in next.config.mjs already handled it, the page file was dead weight). Added `dynamicParams = false` to 4 static routes (`patterns/[slug]`, `patterns/category/[slug]`, `guides/[slug]`, `guides/[slug]/[lesson]`) so unknown slugs return proper 404 instead of attempting to render and producing soft 404s. **(2) Soft 404 fixes:** Updated `robots.ts` to block `/audit/results/`, `/handbook/preview`, `/download/` — session-dependent pages that render empty for Googlebot (top candidate for the 2 soft 404s in GSC). **(3) Crawled-not-indexed cleanup:** Added `robots: 'noindex, follow'` to `/privacy` and `/terms` metadata. Removed `/privacy`, `/terms`, and `/aiuxdesign.gist.design` (a static file, not a page) from `sitemap.ts` — frees crawl budget for the 77 discovered-but-not-yet-indexed lesson pages. **(4) Cross-linking for indexing acceleration:** Created `src/lib/cross-links.ts` with bidirectional mapping of 5 guide courses to ~36 related pattern slugs (semantically curated, much richer than the sparse 2-3 pattern `relatedPatterns` arrays on each guide). Added "Practice in Guides" section to pattern pages (`client-page.tsx`) — shows 1-5 linked guide course cards between "More in Category" and "Newsletter Signup". Added "Related Patterns" section to lesson pages — shows 3 linked pattern cards between the lesson body and newsletter CTA. This creates ~180 new internal links from indexed pattern pages to guide courses, plus ~200 links from lesson pages back to pattern pages — bidirectional link equity that helps Google discover and crawl the 77 pending lesson URLs faster. **Issues left as-is:** 4 "page with redirect" (old URLs naturally draining from index, no action needed), 1 "excluded by noindex" (intentional — likely `/unsubscribe`), 1 "alternate with canonical" (expected canonicalization behavior), 77 "discovered - not indexed" (will self-resolve in 2-4 weeks as Google crawls, now accelerated by cross-linking). **Next steps:** After deploy, validate fixes in GSC → Coverage → click each issue type → "Validate Fix". Check back in 1-2 weeks for indexing progress on the 77 lesson pages.
0

### Session 2026-04-16 12:12 (MacBook)
- **Pattern:** Newsletter email template redesign
- **Status:** ✅ Completed (1 commit, push pending)
- **Files Changed:** 3 (route.ts, globals.css, .gitignore)
- **Tests Added/Modified:** 0
- **Notes:** Completed the newsletter UI polish that was left uncommitted from a previous session. Refactored both daily and weekly email HTML rendering from hardcoded inline strings into modular helper functions (`renderMasthead`, `renderStoryCard`, `renderDarkCallout`, `renderFooterCTA`, `wrapEmailShell`) with a brand-aligned color palette mapped to design tokens (`EMAIL_INK #162036`, `EMAIL_TEXT #20294C`, `EMAIL_MUTED #64748b`, dark mode variants with WCAG AA contrast on navy). Visual changes: Designer's Takeaway restyled as blockquote with curly quotes and "— Designer's Takeaway" attribution label; pattern links changed from filled badges to outlined pill chips with "PATTERN" small-caps kicker; story separators bumped from 14px/#94a3b8 to 18px/#64748b for visibility; dark callouts use 16px border-radius; footer adds "Curated by Imran" byline + "Read past issues" link; both daily ("Today's Idea") and weekly ("Steal this week" + "Pattern deep-dive") callouts use shared `renderDarkCallout()` helper. Dark mode CSS fixes in globals.css: added overrides for inline links (`a[style*="color: #162036"]` → `#93c5fd`) and table cells (`td[style]` → `#94a3b8`), updated pattern chip selector from `a[href^="/patterns"]` to `a[href*="/patterns/"]` for outlined style, updated CTA button color from `#0f172a` to `#162036`; all applied to both `html[data-theme="dark"]` and `@media (prefers-color-scheme: dark)` blocks. Dead code removed: `getProductColor()` (34 lines), `getPatternBgColor()` (23 lines), `EMAIL_TINT` constant — all unused after template refactor. Also removed `ICON_CURSOR_CLICK` and `ICON_ACADEMIC_CAP` constants (replaced by shared section headers). Generated full daily + weekly preview HTML files (gitignored) for visual QA. User confirmed custom font (Satoshi) not worth adding to email — system font stack is correct since Gmail/Outlook strip `@font-face`. Net: +196/-116 lines across 3 files. All future newsletter generations (daily cron at 3 AM UTC, weekly Monday 2 AM UTC) will automatically use the new design.

### Session 2026-04-14 22:02 (MacBook)
- **Pattern:** Paywall funnel — instrumentation, threshold drop to 1, hydration fix, auto-open on mount
- **Status:** ✅ Completed (2 commits, both pushed)
- **Files Changed:** 3 (this commit) + 6 (prior commit 54fa53a)
- **Tests Added/Modified:** 0
- **Notes:** Implemented the paywall fix documented in `/Users/imranmohammed/Desktop/aiuxpaywall/aiux-paywall-funnel-fix.md`. Spec claimed the fake-door paywall was "not wired up" — reading the code disproved that: modal, `audit_paywall_shown` event, waitlist API + Beehiiv sync all already existed and fired correctly. Real problem was *under-exposure* — `FREE_AUDIT_LIMIT=3` meant the wall fires on audit #4, and Clarity showed only 4 `audit_session_completed` events across ~1,390 sessions over Apr 5–14. Nobody was reaching it. Two commits shipped. **(1) `54fa53a` — Instrumentation + copy derivation (no behavior change).** Created `src/lib/audit/constants.ts` so the threshold can be imported by both the server `page.tsx` and the client `useAuditCount` hook without dragging `'use client'` into the server component. Typed as `: number` to prevent TS literal-narrowing killing `=== 1` / `> 1` guards. Added `audit_paywall_dismissed` to the `AuditEvent` union. `PaywallModal`: new optional `auditCountAtTrigger` prop; `audit_paywall_shown` now fires with `{ audit_count_at_trigger }` metadata so we can distinguish the threshold=3 era from threshold=1 era in Clarity; new `handleDismiss` wraps `onClose` and fires `audit_paywall_dismissed` unless `success === true`, wired to backdrop/X/Escape but not to the success-screen "Got it" (no false rejection signal after conversion). Copy made limit-agnostic: Free tier TIERS description derived from constant (`${N} lifetime audit${s}`), paywall heading changed to "You've used all your free audits". `audit-client.tsx`: nudge conditions (`RemainingAuditsBanner`, `SaveReportNudge`) short-circuited with `FREE_AUDIT_LIMIT > 1 && auditCount === FREE_AUDIT_LIMIT - 1` — self-adjusts if threshold is later tuned back up, and skips entirely at threshold=1 where the paywall *is* the nudge. FAQ JSON-LD in `page.tsx` reworded from "daily limit of 3 analyses" to a limit-agnostic phrasing. **(2) Commit 2 (this save) — Lower threshold to 1 + marketing chip + SSR hydration fix + auto-open on mount.** Flipped the constant 3→1. Discovered a runtime `NotFoundError: Failed to execute 'removeChild' on 'Node'` during local testing — my Commit 1 had replaced the hardcoded chip string with interpolated JSX (`{FREE_AUDIT_LIMIT} free audit{FREE_AUDIT_LIMIT === 1 ? '' : 's'} included`), which React's JSX transform emits as four children. At SSR, that rendered as multiple text nodes separated by `<!-- -->` comment markers (confirmed via curl). At threshold=1 the ternary also produced an empty text node sandwiched between comment markers. The client effect in `audit-client.tsx` does `chipEl.textContent = ...` which wipes all children including the markers; React's fiber tree still held references to the original nodes, so on next reconciliation (HMR/parent state change) `parent.removeChild(trackedChild)` threw because the node was no longer a child. Fix: pre-compute the label as a single server-side string and pass as one JSX expression, restoring the single-text-node invariant. User then flagged the chip copy as "transactional" — pushed for marketing-toned phrasing. Replaced the whole state model: pre-audit → "Claim your free audit" (singular at N=1, "Claim your N free audits" at N>1); partially used → "{remaining} free audit{s} left"; exhausted → hide the chip entirely via `style.display = 'none'`. User also correctly flagged the original funnel UX as bad: forcing an already-exhausted returning user through product type → description → upload → Analyze → paywall wastes their time. Added a useRef-gated `useEffect` in `audit-client` that auto-opens the paywall modal once per mount when `isPaywalled && step === 'product-type' && !isDemoMode`. Dismissal remains free — after X/backdrop/Escape, the ref stays set and the modal doesn't re-pop, so the user can browse the site. Existing analyze-button gates still fire if they try to audit anyway. Fresh page mount = fresh ref = modal re-opens. **Recognition model noted**: entirely `localStorage['aiux_audit_count']`, browser-local. No auth. A user with DevTools or incognito gets unlimited resets. Intentional for a fake-door test — building real per-user enforcement costs weeks and tells us nothing beyond "does the wall convert." Server-side `/api/patterns/analyze` has an IP-based 1/min rate limit independent of this counter. **Analytics tradeoff recorded**: three events (`shown` with `audit_count_at_trigger` metadata, `dismissed`, `waitlist_signup`) all fire across both commits. Clarity-derived "saw paywall but didn't submit in this session" gives us the rejection signal equivalent. `shown` event volume now has a different meaning than before — used to fire only after 3 intake steps + Analyze click (high-intent), now also fires on page-load auto-open for all exhausted returning visitors. Counts will jump; segment by `audit_count_at_trigger` in Clarity to isolate engaged-flow vs entry-gated exposures. **Verification**: `npx tsc --noEmit` clean on all modified files (0 new errors, 85 pre-existing elsewhere are test mocks + standalone scripts with different tsconfig + widened unions with stale consumers). Local dev server (port 3001) served `/audit` with 200; curl verified SSR chip renders as a single-text-node `>Claim your free audit</span>` with no comment markers. Interactive browser walkthrough handed to user — they confirmed reset flow works (`localStorage.setItem('aiux_audit_count','1'); location.reload()` gives them the exhausted state), saw the "new chip" (aka the auto-opened paywall + hidden chip), and surfaced the bad-UX concern that drove the auto-open-on-mount change. **Still pending from spec**: homepage audit CTA diagnosis (Task 3 of the spec — CTR 0.65% vs checklist form 16 submits; spec says flag, don't change in this PR). Also pre-existing `paywall-waitlist` not in `NEWSLETTER_SOURCES` enum in `src/types/newsletter.ts` — Zod doesn't catch it at runtime but TS doesn't flag it at build — surfaced during exploration, out of scope for this PR. **Success metrics to watch at 7 days post-deploy**: `audit_paywall_shown` volume (pre-deploy was ~0 functional exposures; post-deploy expect substantial jump); `dismissed/shown` ratio (expect 60–80% industry baseline); `waitlist_signup/shown` (target >20% per spec); Beehiiv `paywall-waitlist` tag count should match `waitlist_signup` ±1. If `shown` stays single-digits even at threshold=1, problem is homepage CTA, not threshold.

### Session 2026-04-14 20:13 (MacBook)
- **Pattern:** /audit page LCP fix — SSR the intake hero
- **Status:** ✅ Completed (shipped locally, push pending)
- **Files Changed:** 6
- **Tests Added/Modified:** 0
- **Notes:** Targeted fix for the Clarity-reported regression on `/audit` (LCP 8.1s, CLS 0.14, dead clicks 12.82% across 39 sessions / 2 perf samples in the last 7 days). The root cause matched CLAUDE.md Issue #12 ("Fully client-rendered 'page = `<Client />`' pattern has catastrophic LCP") — the H1 "Free AI UX Audit Tool" + subtitle + info chip all lived inside `AuditClient` which is `'use client'`, so the LCP element only painted after JS parse + hydrate. The misleading `loading.tsx` compounded it: the skeleton showed the *results-view* layout (dark gradient + upload area) even though users land on the *intake-view* (light bg + H1 + product-type cards), so navigations from elsewhere on the site flashed the wrong shape before settling into the real hero. User pushed back with a good strategic question — "what if every step is a url on its own?" — and I walked through the tradeoffs: URL-per-step would win on bundle-per-step + browser back/forward + funnel analytics + dead-click window, but it doesn't actually fix step-1 LCP (which is the landing page's problem regardless), would introduce sessionStorage or URL-param state fragility (the exact failure mode the legacy `/audit/{context,upload,analyze}` pages shipped with — they exist in the repo as dead code from an earlier rewrite attempt), and the 2-pageview Clarity sample isn't enough signal to justify the refactor scope. We aligned on the smaller pragmatic fix. **Changes made:** (1) `src/app/audit/page.tsx` — added SSR'd `<section id="audit-intake-hero">` above `<AuditClient />` containing the chip (`id="audit-intake-chip"`, defaulting to "3 free audits included"), H1 ("Free AI UX Audit Tool"), and subtitle. All three render as plain server HTML text nodes now, before any client JS touches the page. (2) `src/app/audit/audit-client.tsx` — removed the duplicate chip/H1/subtitle markup from the step-1 render branch; added two effects: `useEffect([step])` that hides `#audit-intake-hero` via `style.display = 'none'` when `step !== 'product-type'` and restores it on back-navigation, plus `useEffect([auditCount, auditsRemaining])` that rewrites the chip's `textContent` post-hydration for return visitors whose localStorage shows prior audits (`"${auditsRemaining} of 3 free audits remaining"` vs the default). Top padding on the client step-1 section shrunk from `pt-8 sm:pt-12 md:pt-16` → `pt-4 sm:pt-6 md:pt-8` since the hero above now owns the top breathing room; step-2/3 keep the original larger padding since the hero is hidden. (3) `src/app/audit/loading.tsx` — complete rewrite from the dark-gradient results-view skeleton to an intake-hero skeleton (light bg, chip placeholder, H1 placeholder, subtitle lines, 5 card placeholders in the 2/3/5-col grid matching `AnchorQuestion.tsx`, demo link placeholder). Navbar skeleton kept. (4) Deleted three legacy pages: `src/app/audit/context/page.tsx` (260 lines), `src/app/audit/upload/page.tsx` (179 lines), `src/app/audit/analyze/page.tsx` (135 lines). All three used the old `ProductType` enum (`chatbot | content | code | image | analytics | other`) not the current one (`chat-interface | ai-agent | recommendation-system | content-generation | other`), relied on sessionStorage for cross-page state, and had zero external inbound links (verified via grep — only the three files referenced each other, plus one mention in `docs/pattern-audit-claudecode-guide.md` describing the old architecture, untouched). Sitemap (`src/app/sitemap.ts`) only lists `/audit`, so no SEO impact from deletion. **Net churn:** 91 insertions, 635 deletions across 6 files — dominated by the 574 lines of legacy-page deletion. **Verification:** TypeScript check (`npx tsc --noEmit`) — 3 new errors in `.next/types/validator.ts` pointing at the deleted `page.js` stubs (stale Next.js cache, regenerates on next build), all other errors pre-existing. Dev server (port 3001, since port 3000 was held by a prior session's process — user has "kill localhost dev server" on their to-do from earlier today) served `/audit` with 200. Did NOT open a browser to interactively test — left that to the user. **Architectural notes for future sessions:** (a) The DOM-manipulation pattern for hiding server-rendered content (`document.getElementById('audit-intake-hero').style.display = 'none'`) mirrors the existing approach for `#audit-social-proof` in the same file — consistent with local conventions, but imperative. If this scales further, a context-provider pattern with conditional rendering would be cleaner. (b) There's one frame of potential double-content visibility when transitioning from step 'product-type' → 'product-detail' (state updates → re-render → paint → useEffect fires → hero hides), but in practice it's imperceptible on a user-initiated click. Used `useEffect` not `useLayoutEffect` to avoid SSR warnings. (c) The chip's post-hydration text update is done via `textContent` mutation rather than React state — chosen specifically to avoid a hydration mismatch, since React will never diff server-rendered content against a client render (the chip is outside `AuditClient`'s React tree). (d) URL-per-step remains a valid future direction if dead clicks stay high after measurement — deferred with justification, not rejected. **Not touched:** INP 260ms (separate concern, needs profiling), the interactive cards themselves (`AnchorQuestion` still client-only), modals/results/paywall (already correctly lazy-loaded via `dynamic()`), `SocialProof` (already server-rendered). **Measurement plan:** wait 5-7 days after deploy for a larger Clarity sample before declaring fixed — 2 pageviews is too noisy to trust. Expected field LCP recovery: 8.1s → somewhere in the 2-4s range on mobile, limited by font load + the `bg-grain` background + 51% ChromeMobile traffic on slower devices. CLS should drop sharply since the main shift source (skeleton→intake swap) is gone.

### Session 2026-04-14 17:58 (MacBook)
- **Pattern:** Resend → Beehiiv newsletter migration + signup UX cleanup
- **Status:** ✅ Completed (code shipped, push + Resend downgrade pending)
- **Files Changed:** 17
- **Tests Added/Modified:** 0
- **Notes:** Long migration session driven by the goal to stop paying the monthly Resend bill. Shipped as 3 local commits (not yet pushed). **(1) `947d127` — Newsletter delivery migrated to Beehiiv (manual compose).** Subscriber list + draft newsletters still live in Prisma/Postgres. Welcome emails handled by Beehiiv's publication-level welcome + optional source-keyed automations (decided against building per-source automations given how subtle the variance would be; single universal welcome covers it). Newsletter broadcasts go through Beehiiv's compose UI — admin publishes draft in `/admin/newsletter` which marks published + revalidates `/news`, then clicks "Copy HTML" + "Open Beehiiv" to paste into a new Beehiiv post and send. Beehiiv's Posts API is Enterprise-only, so API-driven delivery wasn't an option on the Launch tier. Resend stays for 4 transactional routes (audit-report, watchdog, generate-newsletter admin notification + failure alert) at ~150 emails/month — well under Resend free tier's 3,000/month cap. Pivoted away from AWS SES mid-session after user pushed back on AWS setup complexity; SES scaffolding was written (`src/lib/ses.ts`, `@aws-sdk/client-sesv2`, `beehiiv-posts.ts`) and then fully reverted once volume math showed Resend free tier suffices. Net ~1,100 LOC deleted (5 inline-HTML welcome email templates in `subscribe/route.ts` collapsed it from 509 → 98 LOC, Resend batch-send loop in `publish/route.ts`). **(2) `e62da87` — Await Beehiiv subscriber sync instead of fire-and-forget.** Debugged for several rounds why `imrantest1@gmail.com` + `imran+apr14test@gmail.com` + `imran+apr14v2@gmail.com` all showed up in Prisma but not in Beehiiv's dashboard. Initially suspected `reactivate_existing: false` silently dropping previously-seen emails (true, was a bug, flipped to `true`). Then direct Beehiiv API query revealed all 3 test emails were marked `status: "invalid"` by Beehiiv's anti-spam (correctly flagging "test" substring + plus-aliases). `misaif20@gmail.com` was actually `active` since Feb 11 — user had a date filter hiding it. Real emails sync fine; the 188 historical subscribers are all `active`. But the fire-and-forget pattern (`addSubscriberToBeehiiv(...).catch(() => {})`) was genuinely unreliable in Vercel — when the function suspends after sending the HTTP response, in-flight fetches get cancelled. Changed 3 routes (subscribe, audit/send-report, guides/download-pdf) to `await` the Beehiiv call inline. Adds ~500ms per signup but guarantees sync completion. Also added explicit `[beehiiv]` log prefixes + success log for future observability. Verified the fix with direct Beehiiv API query — delete from both Prisma + Beehiiv, re-subscribe, confirmed subscriber landed as `active` with correct `signup_source` custom field. **(3) `79fc8d1` — Newsletter signup UX cleanup.** Four fixes surfaced after the migration: (a) `page.tsx` was passing `source="homepage"` but that's not in `NEWSLETTER_SOURCES` enum — Zod was silently 400-ing every homepage signup (pre-existing TS error that was never acted on). Changed to `source="direct"`. (b) Added compact site-wide newsletter form to `Footer.tsx` — originally put it as a large centered section at the top of the footer, user rightly called it "crowded" stacked against the existing homepage form, moved it into the `aiux` branding column below the "Have an idea? Share feedback" button with stacked layout + small heading "Get daily AI UX news". Anchor `id="newsletter"` on new placement so existing footer nav link still works. (c) Removed `isHidden` / `localStorage.newsletter_subscribed` logic from `InlineNewsletterSignup`. The hide-after-subscribe behavior was leaving empty bordered cards on pattern pages (wrapper div rendered + inner component returned null = floating empty rectangle between related patterns and previous/next nav). Standard newsletter UX on Substack/Medium keeps forms visible; users ignore what they don't want. (d) Stripped PDF/checklist copy from all newsletter CTAs. The component defaults referenced "Get the Checklist", "checklist PDF", "One-page PDF for design reviews" — all misleading post-migration since PDF delivery is now on-page (`/handbook`, `/agent-readability-audit-kit`, `/agentic-ux-checklist` all trigger download in browser at signup). Updated component defaults + explicit pattern page override to pure newsletter copy ("Daily AI UX news and pattern insights", "Subscribe", "You're in! Check your inbox for a welcome email"). **External state:** Beehiiv `signup_source` custom field (Text type) created by user during session. Publication-level welcome email already designed + toggled on by user earlier. 188/2,500 subs on Launch (free) tier — 2,312 slots of runway. Dual-write confirmed working historically (all 188 have `utm_channel: "api"` acquisition source from our dual-write). **Remaining user to-dos (blocked on user action, not code):** (1) `git push origin master` to deploy the 3 local commits to Vercel → live-site smoke test with a real-looking email to confirm sync end-to-end in prod → (2) Resend dashboard → Billing → downgrade to Free plan (monthly bill drops to $0) → (3) kill the localhost dev server started earlier in session. Memory saved at `project_aiex_resend_migration.md` capturing the final architecture + the Beehiiv-Posts-API-is-Enterprise-only surprise for future reference.

### Session 2026-04-13 23:13 (MacBook)
- **Pattern:** /guides surface refinement + Conversational UI guide multi-article integration
- **Status:** ✅ Completed
- **Files Changed:** 8
- **Tests Added/Modified:** 0
- **Notes:** Long session across three distinct workstreams, all landing under one commit. **(1) /guides index overhaul** — attempted a full docs-style rewrite first (bordered hero card + sidebar), user rejected it ("I like the previous version, I just wanted to refine"), reverted and did a lighter refinement keeping the existing bg-grain hero but scaling up typography to match homepage hierarchy (`text-5xl md:text-6xl lg:text-7xl font-extrabold` with `var(--text-hero)`, `text-2xl md:text-3xl` subtitle, `pt-16 md:pt-20 pb-16 md:pb-20`). Removed the intro prose block then user flagged narrow-column misalignment with the wider cards above — moved intro below cards into a max-w-7xl outer / max-w-3xl inner left-aligned, then `mx-auto`-centered per follow-up. Renamed intro heading from "About these guides" → "Why guides" per user. Added a 3-up benefit row (AcademicCapIcon, ClockIcon, BookmarkIcon) reinforcing prose claims; centered cells + broadened copy from "shipping prototypes" to "designer empowerment" framing. Wired per-guide icon tiles on the 5 cards (anthropic.svg, cursor.svg, githubcopilot.svg, github.svg, heroicons ChatBubbleLeftRightIcon for conversational UI) with 48×48 neutral bordered tiles, `dark:invert` for theme-aware brand SVGs. FAQ h2 + answers bumped one tier for readability. **(2) Newsletter CTA restoration** — earlier session had stripped all /guides signup CTAs; this session added 2 high-ROI placements: one `InlineNewsletterSignup` (variant pattern-detail) at the bottom of each of the 5 course overview pages in its own bordered card with `mt-24` top spacing to disambiguate from the "Start the course" CTA (initially glued to it, user flagged, fixed), and one on the last lesson of each course (`!next` gate) wrapped in a bordered card. Copy says "daily AI UX patterns" after user corrected an initial "weekly" draft (saved as feedback memory `project_aiex_newsletter_cadence.md`). New `'guides'` source added to NEWSLETTER_SOURCES in `src/types/newsletter.ts` for analytics attribution. Total 10 new signup surfaces (5 overview + 5 last-lesson), down from the 141 that were removed on 2026-04-11. **(3) Conversational UI guide massive content integration** — pulled four Medium articles (AI learning to shut up, Who is designing the boundary for AI, Your design is invisible now, AI learned to shut up/forgot to say what it was doing) and mapped their artifacts into Lessons 1, 2, 5, 6, 7, 10, 11. Lesson 1 roughly doubled in size: new "Conversation is overhead, not value" thesis reframe, "Intent-Clarity Spectrum" (4-tier: one-click / structured / guided / open chat with product examples), "Should this even be conversational?" 5-question decision checklist, "Three patterns that quietly ruin conversational UX" warning callout (accordion effect / articulation barrier / context-switching tax with 40%/23-min figures). Lesson 2 added "Disclosure surface" as a 6th essential component (replacing 5-component text with a 6-row `table`). Lesson 5 added "Prompts as articulation bridge" section. Lesson 6 added "Selective memory" heading + 3-row visibility `table` (Notion vs Copilot vs Meta) + "Silent Context Retention" warning callout. Lesson 7 added "When the AI doesn't know what it doesn't know" + 3-row failure `table` (competitor blending / narrative recycling / confident falsification) + "Honest Uncertainty" tip callout. Lesson 10 added "Pre-launch questions" with two checklists (4 boundary-design questions from Article 2 + 3 disclosure questions from Article 4). Lesson 11 got a major expansion with 6 new conceptual blocks between "What Makes Agentic UI Different" and "The Five Agentic Design Patterns": Destination-vs-Ambient `table`, Permission Spectrum 3-row `table` (human decides / shared / AI decides), Three conditions for safe autonomy `table` (scope / stakes / reversibility), Designed-vs-Patched boundaries `table`, Disclosure Layer Framework 4-row `table` (Before / During / Controls / After), "Consent Theater" warning callout. Every expanded lesson ends with a `further-reading` card linking to the relevant Medium article(s) — 10 cards total across the guide. Durations updated: L1 3→6, L2 4→5, L5 3→4, L6 4→5, L7 3→4, L10 3→5, L11 4→8. Total guide time 39→55 min. **(4) LessonRenderer rewrite — three new primitives shipped:** *`renderRichText` helper* that parses `\n\n` paragraph boundaries + detects bulleted (`•`/`-`/`*`) and numbered (`1.`/`1)`) lists with optional intro lines, coalesces consecutive same-type list blocks (handles the "1. Foo\n\n2. Bar" pattern in Claude Code lessons that previously rendered as separate single-item `<ol>` elements), falls back to `whitespace-pre-line` `<p>` for definition-style content. `text` case now uses it, and I extended the `callout` case to also use it so multi-paragraph warnings inside callouts format correctly. Then *new `table` section type* — semantic `<dl>/<dt>/<dd>` rendered as a responsive 2-column grid with `minmax(180px, 2fr)_minmax(0, 3fr)` columns, bordered container with row dividers, stacks single-column on mobile. All 10+ spectrums/frameworks/comparisons in the conversational UI guide use it. Then *new `further-reading` section type* with `ResourceLink[]` structure — bordered card with BookOpenIcon header + divided rows of clickable `<a target="_blank">` link rows showing title + source + description + external-link arrow, hover transitions title to accent-primary. Replaced the Lesson 1 "Further reading" callout with the new structured type. **(5) Callout redesign** — user flagged the colored background variants (amber/purple/blue) as inconsistent with the site's brand. Dropped all per-type background colors; now every callout uses one shared neutral card (`rounded-xl border bg-surface-primary`) with an auto-picked icon tile on the left (info→InformationCircleIcon, warning→ExclamationTriangleIcon, success→CheckCircleIcon, error→XCircleIcon, tip→LightBulbIcon which I added as a new IconType entry + heroicon import). Site-wide change — every callout across all 5 guides inherits the new style. **(6) Course overview hero hierarchy fix** — user flagged the conversational UI course hero as weak: "OTHER COURSE" kicker (because tool: 'Other' produced "Other Course"), 67-char H1 wrapping 4 lines in a 428px-wide column, `font-semibold` not punchy enough. Fixed: `tool: 'Other'` → `'Conversational UI'` (required adding to `GuideTool` union in `src/types/index.ts`), shortened title "Build a Conversational UI - Complete Design & Implementation Guide" → "Build a Conversational UI" (kept the descriptor in description + excerpt for SEO), H1 styling → `text-4xl md:text-5xl lg:text-6xl font-extrabold` with `textWrap: 'balance'` style for even wrapping + `leading-[1.1]`, excerpt bumped to `text-lg md:text-xl`, 2-column hero grid breakpoint changed from `md` to `lg` so stat tiles stack below at tablet widths instead of crushing the title. **(7) Stat tile + CTA fixes** — user flagged "Intermediate" overflowing its 104px-wide tile in the 2×2 grid. Removed the 4th (Level) tile entirely since skill level already appears in the meta chip row; Modules tile now uses `col-span-2` to fill the bottom row cleanly. CTA text also bloated into 2 lines when "Start Learning: What Is Conversational UI? (And What It Isn't)" used the full lesson title — trimmed to just "Start Learning" + arrow with `whitespace-nowrap`. **Pending items not touched this session:** per-guide custom metadata (audit #8), cross-linking guides↔patterns (audit #10), `ssr:false` on LazyGuideIcon/ConversationalUIBot (audit #12), visible breadcrumb on course overview (audit #15), GSC indexing check due 2026-04-18 (on follow-up). **Known learnings saved as memories:** `feedback_dont_build_during_dev.md` (running `npm run build` while dev server is up clobbers `.next/` cache — I did this twice this session and had to kill+clear+restart both times; switched to `npx tsc --noEmit` for type verification which is dev-safe) and `project_aiex_newsletter_cadence.md` (daily, not weekly — got it wrong initially in CTA copy).

### Session 2026-04-11 21:20 (MacBook)
- **Pattern:** Newsletter Diversity Guard + Guides Visual Polish + Claude Code Content Overhaul
- **Status:** ✅ Completed
- **Files Changed:** 9 (1 newsletter route + 8 guides files)
- **Tests Added/Modified:** 0
- **Notes:** Three distinct workstreams across the day, landed as two clean commits. **(1) Newsletter lopsided-pool guard:** user noticed today's draft (`cmntrcoor0000jm040i99fchr`) shipped 5/5 OpenAI items and asked whether something broke. Pulled the draft from Neon, found the candidate pool was 27 openai.com URLs + 2 github.blog URLs (29 total, 93% from one source). Root cause: OpenAI Academy launched today and the OpenAI RSS feed dumped ~25 academy sub-pages as if they were distinct news items. Pure relevance scoring then surfaced them all to the top, and Claude obediently picked the highest-scoring 5. Fix in `src/app/api/cron/generate-newsletter/route.ts`: added `findDominantSource()` helper that detects when one RSS source represents >70% of a pool of 5+ items, plus a "Single-Source Day" skip path in `runGeneration()` (daily-only — weekly compiles from already-curated daily items so it's structurally protected). My first attempt keyed on URL hostname and over-triggered on yesterday's healthy pool because Google News searches all return news.google.com URLs even though they represent distinct product feeds (Cursor, Notion, Linear, Perplexity, Claude AI, Windsurf). Switched to keying on `item.source` which correctly distinguishes the search slots — re-validated against today's pool (triggers correctly) and a simulated yesterday's pool (correctly does not trigger). Also added explicit diversity rules to both `buildPrompt` and `buildWeeklyPrompt` (max 2 items per company, treat sub-pages of one launch as a single story, prefer short honest newsletter over padded one). Marked today's draft as `rejected` so tomorrow's dedup won't see it. **(2) Phase 1 visual polish on guides (chrome):** five changes that benefit all 5 guides at once. *1.1* Course overview hero rebuilt as bordered two-column card — left has kicker + H1 + chipified meta + CTA, right has 2x2 stat tile grid (lessons / minutes / modules / level) using pure typography on tokens, no icon library. *1.2* "All lessons" section rebuilt as bordered module cards instead of plain numbered ol — header row with pretty title from MODULE_TITLES + lesson count chip + total minutes + module description, then divided lesson rows with hover state, tabular numbers, duration chips, right-arrow affordance. *1.3* Lesson page header rebuilt with accent divider + module chip in `bg-accent-primary/10` (pulls pretty name from MODULE_TITLES — fixes a real visible bug where the raw module key 'figma'/'setup'/'github' was leaking) + "Lesson N of M" counter chip + iconified meta pill row using ClockIcon, BookOpenIcon, ArrowPathIcon from heroicons. Confirmed the figma-mcp lesson now renders "Figma ↔ Code" as the chip instead of literal "figma". *1.4* One-line contrast fix in `LessonRenderer.tsx`: text-gray-500 dark:text-gray-400 → text-text-secondary on the `text` section renderer. Affects 55 paragraph blocks just in Claude Code, plus every text section in every other guide. Old gray was borderline WCAG and inconsistent with `intro` blocks which already used the token. *1.5* Defused the `@lobehub/icons` landmine: removed the `import { Github }` from LessonRenderer (replaced with heroicons CodeBracketIcon — `getHeadingIcon` never matched in Claude Code lesson bodies anyway, so zero behavior change), then deleted two dead files that also imported the banned package: `src/app/guides/[slug]/guide-icon.tsx` (30 LOC, dead) and `src/components/ui/CourseCard.tsx` (163 LOC, dead — verified via grep). The package itself is still in `package.json`; uninstalling it is a separate housekeeping commit. **Refactor bonus**: extracted `MODULE_TITLES`, `MODULE_DESCRIPTIONS`, and `getModuleTitle()` to a new `src/lib/guides/modules.ts` instead of duplicating the maps a third time when 1.3 needed them in the lesson page. Now the overview, lesson page, and GuideSidebar all import from one source (was Phase 3.2 in the original plan, did it now to avoid scope creep). **(3) Copy button bug fix:** user reported the Copy button on code blocks "doesn't work throughout the guide." Investigated `LessonRenderer.tsx` line ~340 — the original implementation called `navigator.clipboard.writeText(section.code)` and that was it. No `useState`, no visible feedback, no try/catch. The copy was actually succeeding silently and the user had no way to know. Extracted the button into a proper `CopyButton` sub-component with its own useState (each code block confirms its own click independently), visible "Copied" text + heroicons CheckIcon for 2 seconds, `document.execCommand('copy')` fallback for insecure contexts, try/catch with `console.error`, `type="button"`, and dynamic aria-label that switches between "Copy code to clipboard" and "Copied to clipboard" for screen readers. User initially saw a green flash and asked me to remove it ("just change the text to Copied with check is fine") — kept the dark background in both states, only the label changes. **(4) Phase 2 Claude Code content overhaul:** added `intro` and `completion` blocks to all 23 lessons in the Claude Code guide. Was 6 intros + 5 completions before this work. Now 23/23 intros + 23/23 completions. Did it as a pilot first — 3 setup lessons (4 new typed blocks total: lesson 1 add completion, lesson 2 convert leading text→intro and trailing success-callout→completion, lesson 3 convert leading text→intro). User reviewed the pilot, said "they look good proceed", then I batched the remaining 20 lessons across the other 4 modules. Tally: Figma (0 intros — already had all 5 — + 4 completions for L19-22, L23 keeps its module-recap), Prototype (5 intros + 4 completions, L8 keeps its module-recap), GitHub (5 intros + 4 completions, L13 keeps its module-recap), Practices (5 intros + 4 completions, L18 keeps its module-recap). Total 31 new typed blocks added in this session. Voice pattern I held throughout: intros are 1-2 sentences in second-person with designer-empathetic framing ("If you've never installed it before, that's fine — most designers haven't"), completions have a punchy past-tense title like "Frame to code, working" or "Save loop, internalized", three noun-phrase bullets describing what the reader did, and a transition message naming the next lesson topic. Icons selected from the existing IconType union (`terminal`, `code`, `cog`, `monitor`, `github`, `info`, `download`, `key`, `check`, `user`, `warning`) — no new icon dependencies. For 6 lessons across the modules, the leading text paragraph was upgraded in-place to an `intro` section type rather than stacking a redundant card on top. Pre-existing module-recap completions at L3, L8, L13, L18, L23 left untouched so each module still has its bigger "module complete" moment at the end. **Things deliberately NOT touched (worth knowing for tomorrow):** the redundant H2 sections on every Prototype/GitHub/Practices lesson — each starts with `{ type: 'heading', level: 'h2', content: '<lesson title>' }` that duplicates the page H1. Adding intro cards above them creates a slightly awkward sequence (intro card → redundant H2 → first H3) but it's not broken. Stripping all 14 of them is a follow-up the user can opt into separately. Also still in `package.json`: `@lobehub/icons` (zero source references after this commit, ready to uninstall as a housekeeping step). **Brand validator warnings to address:** the `text-[11px]` class on the new stat tile labels in the course overview hero (4 uses) is flagged as an arbitrary font size — should use a token from the design scale (smallest is text-xs at 12px). Pre-existing arbitrary sizes also flagged in LessonRenderer (`text-[1.75rem]`, `text-[1.375rem]`, `text-[1.125rem]` on heading cases) — not from this session, ignore. The data/guides.ts warnings about "button missing accessible label" and "missing dark mode variant" are false positives — the validator is scanning string literals inside `code` section content that happen to look like JSX. **Build / verification:** dev server stayed clean throughout, all 23 Claude Code lesson pages return 200, type-check on modified files reports zero new errors (3 pre-existing downlevelIteration warnings in LessonRenderer at lines 78/85/406 are unrelated). Two clean commits landed: `e4385e3` (newsletter pool guard, 1 file +85 lines) and `1df382f` (guides chrome + content, 8 files +528/-343). User explicitly deferred the `/guides` index page visual overhaul to tomorrow ("looks very stale and generic vibe... lets pick up phase 2.3 later"). **Pending for tomorrow:** (a) overhaul `/guides` index page to match the polished course overview look — plan presented and approved in concept, six labeled changes A-F, all single-file edits to `src/app/guides/page.tsx`. (b) Phase 2.3 — build 3 interactive `code-preview` components for the Claude Code guide (terminal session, Figma↔code split-pane, vague-vs-specific prompt comparison). (c) Optional: strip the 14 redundant H2 sections in Claude Code lessons. (d) Optional: uninstall `@lobehub/icons` from package.json now that no source references it.

### Session 2026-04-11 01:23 (MacBook)
- **Pattern:** Course Overview Refactor + CTA Cleanup + Route Fix
- **Status:** ✅ Completed
- **Files Changed:** 14
- **Tests Added/Modified:** 0
- **Notes:** Follow-up to the earlier SEO refactor (commit effa024) after the user reviewed the deployed output and flagged two UX issues: (1) the `/guides/[slug]` course overview was still using the old list-with-accordion layout while lesson pages used the new three-column docs layout — jarring mode switch between entering a course and reading a lesson, and (2) too many newsletter signup CTAs across the site (I'd added ~141 email prompts across 66 lessons + 8 category pages + 2 index pages earlier). **Course overview refactor:** rewrote `src/app/guides/[slug]/page.tsx` from scratch as a server-rendered three-column layout matching `/guides/[slug]/[lesson]` exactly. Left sidebar reuses `GuideSidebar` with a new `currentIsOverview` prop that highlights the "Overview" item; middle column renders breadcrumb + course hero (tool label, H1, description, `{totalLessons} lessons · {totalMinutes} min total · {skillLevel}` metadata) + a primary "Start Learning: {first lesson title}" CTA button + "About this course" section + "What you'll learn" bulleted list derived from `MODULE_DESCRIPTIONS` constant + "All lessons" grouped-by-module numbered list with durations + a secondary "Start the course" CTA at the bottom; right sidebar reuses `OnThisPage` with three synthetic `LessonHeading` entries (`#about`, `#what-youll-learn`, `#all-lessons`) so scroll spy works on the overview page too. All headings get `id` attributes + `scroll-mt-24`. **Newsletter CTA cleanup:** stripped `InlineNewsletterSignup` from 5 locations I'd added in earlier batches — inline mid-lesson CTA (previously on lessons with 6+ sections), bottom CTA on every lesson page, bottom CTA on all 8 category pages, bottom CTA on `/patterns` index, bottom CTA on `/guides` index. Removed the `splitAt`/`firstHalf`/`secondHalf` section-splitting logic from the lesson page since without the mid-lesson CTA there's no reason to split. Site now asks for email in 3 places only: homepage hero (pre-existing), footer (site-wide), and pattern detail pages (pre-existing) — down from ~141 prompts to ~40 across the site. **Dead code sweep:** after the refactor made them all unreachable, deleted 8 orphaned components (~1,000 LOC): `guides/[slug]/guide-client.tsx` (277 lines — the old client-rendered course overview), `components/ui/IntroductionSection.tsx`, `components/ui/ModuleSection.tsx` (the accordion that was hiding lesson content from crawlers), `components/ui/ModularLessonCard.tsx`, `components/ui/LessonList.tsx`, `components/ui/LessonItem.tsx`, `components/ui/LessonContent.tsx`, `components/ui/LessonModuleOverview.tsx`. Verified each deletion against the import graph first — all 8 were internal to their own component chain with zero external consumers. **Bundle bloat debugging saga:** my first attempt at adding module icons to `GuideSidebar` imported `{ Github }` from `@lobehub/icons`, following the pattern already in the codebase. Build succeeded but `/guides/[slug]` and `/guides/[slug]/[lesson]` First Load JS exploded from ~132 kB to **914 kB** (+780 kB regression) — confirmed culprit by looking at the other routes at ~116 kB. Root cause: `@lobehub/icons` doesn't tree-shake — importing a single named export drags in the entire brand-icon set. Attempted fix with an inline SVG GitHub mark; user interrupted and said "remove icons for now". Rewrote `GuideSidebar` as a text-only nav (no heroicons imports, no inline SVG, no `@lobehub/icons`); bundles returned to **112 kB and 131 kB** respectively. Saved a feedback memory `feedback_lobehub_icons_bundle_bloat.md` so future sessions don't repeat the mistake. **Next.js routing fix:** dev server refused to start with `Error: You cannot use different slug names for the same dynamic path ('course' !== 'slug')` — I'd placed sibling dynamic segments `[slug]` and `[course]` under `src/app/guides/` with different param names, which Next.js treats as a routing conflict even though the prod build was silently accepting it (meaning one of the two routes was actually shadowing the other in prod and users hitting `/guides/[course]/[lesson]/...` URLs may have been served the wrong handler). Moved `src/app/guides/[course]/[lesson]/page.tsx` → `src/app/guides/[slug]/[lesson]/page.tsx`, renamed the route param from `course` to `slug`, and mapped `getAllLessonParams()` output in the new `generateStaticParams` (`{ course, lesson } → { slug: course, lesson }`) so the internal `LessonParamPair` type stays semantically named while matching the Next.js file-system convention. Route tree now: `/guides/[slug]/page.tsx` (course overview) + `/guides/[slug]/[lesson]/page.tsx` (lesson) — both share `[slug]` at the same level, valid. **User flagged `/patterns` hero visual inconsistency:** the new `/patterns` index page I shipped in the earlier batch used a full-bleed tinted-background homepage-style hero copied from `src/app/page.tsx` (bg-grain, max-w-4xl centered, large padding) which reads as a landing page rather than a section page. Drafted a compact left-aligned header replacement but user said "no need that's okay" and moved on — left as-is. Homepage at `src/app/page.tsx` is completely untouched this session; only difference users see is that `/patterns` is now a real destination instead of a 308 redirect to `/`. **Build verification:** `npm run build` clean, 204 static pages pre-rendered unchanged, zero errors, zero warnings. Route sizes: `/guides/[slug]` 2.58 kB/112 kB, `/guides/[slug]/[lesson]` 19.1 kB/131 kB, `/guides` 129 B/111 kB, `/patterns` 186 B/116 kB, `/patterns/category/[slug]` 129 B/111 kB. Shipped 5 patterns audit items + 9 guides audit items in the earlier commit, this follow-up closes the three remaining visible issues: layout inconsistency, CTA fatigue, and the hidden routing conflict. Still pending (tracked in project_aiex_seo_followup.md): per-guide custom metadata, cross-linking patterns↔guides, pattern body copy expansion, OG image PNG conversion, and the GSC re-check on 2026-04-18.

### Session 2026-04-11 00:13 (MacBook)
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
- **Prisma ORM** (Postgres on Neon) for subscriber management (local source of truth, mirrored to Beehiiv)
- **Beehiiv free tier** for subscriber sync + welcome emails (via Automations keyed on `signup_source` custom field) + newsletter delivery (admin composes in Beehiiv dashboard by pasting HTML from our admin UI — Beehiiv Posts API is Enterprise-only)
- **Resend free tier** for transactional emails — audit reports (per-user HTML), admin watchdog alerts, cron failure alerts, "newsletter draft ready" admin pings. ~150 emails/month, well under the 3,000/month cap.
- **No direct transactional sends to subscribers**: every subscriber-facing email is a Beehiiv Automation welcome or a Beehiiv-delivered broadcast. Tokenized PDF downloads happen on-page (no email link).
- **API Routes**: `/api/newsletter/subscribe` (Prisma + Beehiiv sync + `signup_source` custom field), `/api/newsletter/publish` (marks as published + revalidates — admin then copies HTML into Beehiiv), `/api/newsletter/send-update` (returns pattern-update HTML for manual Beehiiv paste), `/api/newsletter/unsubscribe`
- **Soft Delete** active/inactive subscriber management
- **Unsubscribe Tokens** for one-click unsubscribe functionality on our own `/unsubscribe` page; Beehiiv posts use Beehiiv's native unsubscribe footer
- **See** [Newsletter Documentation](docs/NEWSLETTER.md) for complete guide

### Directory Structure

#### Source Code (`src/`)
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

### Pattern Structure (36/36 Complete ✅)
Pattern implementation follows this structured format:
1. Each pattern has its own directory in `src/data/patterns/patterns/[pattern-name]/`
2. Consistent structure with index.ts, code-examples.ts, considerations.ts, guidelines.ts, examples.ts, figma-prompt.ts
3. All patterns imported in `src/data/patterns.ts`
4. Patterns validated with `npm run test:patterns`
5. Interactive demos for all patterns with working code previews
6. **Current Status**: All 36 patterns fully completed with comprehensive implementations

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
- **✅ 36/36 AI design patterns fully completed** with comprehensive content, interactive demos, and code examples
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

## Known Issues & Learnings

This section documents issues we've encountered and their solutions, so Claude remembers them in future sessions.

### Cron Jobs & Scheduled Tasks

| Issue | Date | Solution |
|-------|------|----------|
| **Vercel Hobby cron doesn't execute** | Jan 2026 | Vercel free/hobby tier cron jobs don't reliably trigger. Use **cron-job.org** (free) as external trigger instead. `vercel.json` must NOT have `crons` — removed Mar 29 2026. |
| **cron-job.org timeout kills newsletter generation** | Mar 2026 | Newsletter route fetches RSS + calls Claude API. **Fix (Mar 29):** switched Claude model from Sonnet to Haiku (5-10x faster), reduced RSS timeouts from 5s to 3s. Generation now fits well within 60s. Uses `after()` to respond instantly to cron-job.org while running generation in background. |
| **Duplicate cron runs from dual triggers** | Mar 2026 | **Root cause of "every other day" failures.** Vercel Hobby crons in `vercel.json` fired ~50% of days, racing with cron-job.org and causing silent failures via the `after()` race window. **Fix (Mar 29):** removed `crons` from `vercel.json` entirely — cron-job.org is the SOLE trigger. Also added duplicate re-check before DB insert as safety net. **DO NOT re-add crons to vercel.json.** |
| **Vercel 60s function timeout** | Mar 2026 | Vercel Hobby max function duration is 60s (set in `vercel.json`). Newsletter generation must complete within this. If timeouts recur: (1) check Claude model is Haiku not Sonnet, (2) check RSS timeout is 3s not 5s, (3) consider reducing RSS_SOURCES count (currently 20). |

**cron-job.org Setup:**
- Daily newsletter: `0 3 * * *` (3 AM UTC / 8:30 AM IST) → `https://www.aiuxdesign.guide/api/cron/generate-newsletter`
- Weekly newsletter: `0 2 * * 1` (2 AM UTC / 7:30 AM IST Mon) → `https://www.aiuxdesign.guide/api/cron/generate-newsletter?type=weekly`
- Requires `Authorization: Bearer <CRON_SECRET>` header

**Newsletter Troubleshooting Checklist:**

When newsletter doesn't run or emails don't send:

1. **Check cron-job.org has correct CRON_SECRET**
   - Must use the PRODUCTION value from Vercel environment variables
   - NOT the local `.env.local` value (they're different!)

2. **Check cron schedule is correct**
   - Daily: `0 3 * * *` (3 AM UTC = 8:30 AM IST)
   - Weekly: `0 2 * * 1` (2 AM UTC Monday = 7:30 AM IST)

3. **Check database for recent newsletters**
   ```bash
   # Query last 5 newsletters
   DATABASE_URL="..." node -e '
   const { PrismaClient } = require("./src/generated/prisma");
   const prisma = new PrismaClient();
   prisma.newsletterDraft.findMany({ orderBy: { createdAt: "desc" }, take: 5 })
     .then(n => n.forEach(x => console.log(x.createdAt, x.type, x.status, x.title.slice(0,40))))
     .finally(() => prisma.$disconnect());
   '
   ```

4. **Manual trigger (use production CRON_SECRET)**
   ```bash
   curl -H "Authorization: Bearer $CRON_SECRET" \
     "https://www.aiuxdesign.guide/api/cron/generate-newsletter"
   ```

5. **Check Resend dashboard** for transactional email logs (audit reports, admin alerts): https://resend.com/emails

6. **Check Beehiiv dashboard** for subscriber sync + newsletter delivery: https://app.beehiiv.com

7. **Common issues:**
   - 401 Unauthorized → Wrong CRON_SECRET in cron-job.org
   - No newsletter created → Check if "quiet day" (no news) or duplicate prevention blocked it
   - Vercel Runtime Timeout → Claude model must be Haiku (not Sonnet), RSS timeout must be 3s. Check `route.ts` lines ~20 and ~1034
   - "Every other day" failures → Someone re-added `crons` to `vercel.json`. Remove them — cron-job.org is the sole trigger
   - Transactional emails not sent → Check `RESEND_API_KEY` is set + valid. Resend free tier caps at 100/day + 3,000/month — at normal volumes we use ~5%.
   - Subscriber not synced to Beehiiv → Check BEEHIIV_API_KEY and BEEHIIV_PUBLICATION_ID
   - Admin clicks Publish but newsletter doesn't email subscribers → That's expected. Admin must click "Copy HTML" then paste into a new Beehiiv post and send from Beehiiv. Beehiiv free tier has no Posts API for automation.
   - Welcome email not arriving after signup → Beehiiv publication-level welcome emails must be enabled + Automations keyed on `signup_source` custom field must be configured (values: `direct`, `handbook`, `audit`, `audit-kit`, `news`, `guides`, `agentic-checklist`).

### Deployment & Infrastructure

| Issue | Date | Solution |
|-------|------|----------|
| *Add future issues here* | - | - |

### API & External Services

| Issue | Date | Solution |
|-------|------|----------|
| **Anthropic has no RSS feed** | Dec 2025 | Scrape `anthropic.com/news` page directly instead of using RSS parser |

### Performance & Web Vitals

The recurring class of issue. Every entry below is a real incident we hit and fixed — consult this table FIRST during any perf investigation, before forming new hypotheses.

| Issue | Date | Solution |
|-------|------|----------|
| **Lab vs field gap is real** | Feb 2026, Apr 2026 | Lighthouse lab scores routinely diverge from real-user experience on this codebase. Case study: `/agent-readability-audit-kit` showed **100/100 Performance, 0.5s LCP on LHCI desktop preset**; the same page on **LHCI mobile preset** showed **83/100, 4.57s LCP** (9x delta); Microsoft Clarity real-user data for the same URL and day showed **63/100, 106s LCP** (a further 23x delta vs lab mobile). Three lessons: (1) **Always run Lighthouse with mobile preset** — desktop hides CSR/hydration issues. (2) Lab tests use ideal hardware/network; real users don't. (3) **Always cross-check field data (Vercel Speed Insights tab + Microsoft Clarity URL export) before declaring a perf fix successful.** A green lab score is necessary but not sufficient. |
| **`adjustFontFallback: false` causes site-wide CLS** | Apr 2026 | With `display: swap`, the fallback font's metrics didn't match Satoshi → text reflowed when Satoshi loaded. Set `adjustFontFallback: 'Arial'` in the `next/font/local` config so Next generates a size-adjusted `@font-face` that matches Satoshi metrics — eliminates layout shift on swap site-wide. **Never set this to `false`.** |
| **Manual `<link rel="preload">` conflicts with `next/font` `preload: true`** | Apr 2026 | `next/font/local` with `preload: true` already emits scoped preloads on the pages that use each weight. Manual `<link rel="preload">` tags in `layout.tsx` preload globally even when unused, triggering "preloaded but not used within a few seconds" console warnings and wasting header bytes. **Don't double-preload fonts.** |
| **Carousel `priority={current === 0}` mis-promotes below-fold media to LCP** | Apr 2026 | `Carousel.tsx` had `priority={current === 0}` which made the first slide (often a 4-16MB MP4) eager-load even though the carousel sits well below the Problem/Solution sections on pattern pages. Browser then mis-promoted the carousel video to LCP candidate. **Drop `priority` on below-fold carousels.** Rely on the existing `IntersectionObserver` in `OptimizedMedia.tsx` to gate rendering until scrolled into view. |
| **`<video autoPlay>` without `preload="metadata"` downloads full file eagerly** | Apr 2026 | Even when not yet visible, autoplay videos default to `preload="auto"` which fetches the entire file. Set `preload="metadata"` on every `<video>` so only container/codec info loads until autoplay actually starts. Saved ~10MB on initial paint per pattern page. |
| **Oversized carousel media in `public/images/examples/`** | Apr 2026 | 10 MP4s were 4-16MB each (raw exports at 2772×1454). Re-encode with `ffmpeg -vf "scale='min(1200,iw)':-2" -c:v libx264 -crf 30 -preset slow -pix_fmt yuv420p -movflags +faststart -an` for ~90% reduction. Animated `.webp` files: re-compress with `sharp({ animated: true }).webp({ quality: 75, effort: 6 })`. **Always run media through this pipeline before committing.** Keep the original `.gif` files in place as `<video onError>` fallbacks — `OptimizedMedia.tsx` checks for them. |
| **Microsoft Clarity dev/preview pollution masks real issues** | Apr 2026 | Clarity tag was firing on `localhost:3000`, polluting production metrics with dev sessions. Gate with `{process.env.NODE_ENV === 'production' && <ClarityScript />}` AND a runtime hostname check excluding `localhost`, `127.0.0.1`, `*.local`, `*.vercel.app`. To clean up existing dev sessions in the dashboard: Clarity → Filters → URL `does not contain "localhost"`, save as default segment. |
| **framer-motion creeps into the homepage critical-path bundle** | Mar 2026 | A single `motion.div` import in any component reachable from the homepage (e.g., `InlineNewsletterSignup`, `UnifiedSearchBar`, `FilterPills`) pulls the full ~85KB framer-motion library into the initial JS bundle. CSS transitions are sufficient for hero/social-proof areas. **Audit the homepage component tree before adding framer-motion to anything reachable from `src/app/page.tsx`.** Use `npm run build:analyze` to verify bundle impact. |
| **`ssr: false` on above-fold dynamic imports empties the hero on first paint** | Apr 2026 | `dynamic(() => import('./CompanyLogoCarousel'), { ssr: false })` left a hole where the LCP element should be, killing the homepage LCP. Re-enable SSR for above-fold dynamic imports — only use `ssr: false` for genuinely interactive-only widgets below the fold. |
| **Hydration mismatch from date-based conditionals (React error #418)** | Apr 2026 | `isToday(date)` evaluates differently on server vs client (server is UTC, client is user's TZ), causing React hydration error #418 on the news page. The whole subtree re-renders, blocking interactivity. Defer date-based UI behind a `hydrated` state flag set in `useEffect(() => setHydrated(true), [])`. |
| **Missing ISR on dynamic routes hits cold serverless every request** | Mar 2026 | `/patterns/[slug]/page.tsx` had no `revalidate` export, so every request cold-started a serverless function. Add `export const revalidate = 3600` to all content pages. Results land in the edge cache and field TTFB drops dramatically. |
| **Fully client-rendered "page = `<Client />`" pattern has catastrophic LCP** | Apr 2026 | `/agent-readability-audit-kit/page.tsx` returned only `<AuditKitClient />` — no SSR'd content. Real users saw 106s LCP because nothing renders until JS parses, hydrates, and framer-motion completes its initial-state transitions. **Always SSR the hero/title/H1 in the server `page.tsx`. Only the interactive widget needs `'use client'`.** Same fix applies to news article pages (`/news/[slug]`). |
| **Animated `.webp` can be 15MB** | Apr 2026 | `ada-health.webp` (animated, 1074×602) was 15MB raw. Sharp recompress: `sharp(src, { animated: true }).webp({ quality: 75, effort: 6 })` → 649KB. **Treat animated webp like video — needs aggressive compression, never raw export.** |

**Performance Troubleshooting Checklist**

When perf scores drop or a Speed Insights / Clarity metric regresses:

1. **Check the daily LHCI workflow first** — GitHub → Actions → "Performance" → latest run.
   If there's an open issue tagged `performance`, start there. The issue body links to the LHCI report and tells you which URL+metric breached.

2. **Cross-check lab vs field**:
   - Lab: GH Actions LHCI artifact + `npm run perf-audit -- --compare`
   - Field: Vercel dashboard → Speed Insights tab + Microsoft Clarity URL performance export
   - **Lab green + field red** → real-user issue (slow networks, mobile devices, font rendering variance)
   - **Both red** → structural issue, easier to reproduce

3. **Consult the Performance & Web Vitals table above** — chances are it's a recurring failure mode with a documented fix. The Apr 10 incident took an hour to investigate from scratch; with this table, it should take 10 minutes next time.

4. **Look for the usual suspects** in this order:
   - New media asset under `public/images/examples/`? Check size with `ls -lh`. Anything >2MB needs the ffmpeg/sharp pipeline (see Issue #6 above).
   - framer-motion imported into a homepage-reachable component? (Issue #8)
   - `'use client'` added to a page that renders the LCP element? (Issue #12)
   - `adjustFontFallback` changed? (Issue #2)
   - `priority` added to `<Image>` / `OptimizedMedia` below the fold? (Issue #4)
   - New `<video>` tag without `preload="metadata"`? (Issue #5)
   - `dynamic()` import with `ssr: false` on above-fold content? (Issue #9)

5. **If genuinely new** (not in the table above), fix it, then **add the new lesson to the Performance & Web Vitals table before closing the investigation**. This is the contract — every new failure mode gets documented so the next investigation starts smarter.

**Performance Monitoring Setup**

Three layers run automatically:

- **Vercel Speed Insights** — wired in `src/app/layout.tsx` via `<SpeedInsights />` from `@vercel/speed-insights/next`. Automatic p75 mobile/desktop Core Web Vitals per route. No env var, no config. Dashboard: Vercel project → Speed Insights tab.

- **Lighthouse CI** — `.github/workflows/perf.yml` runs nightly at 04:00 UTC (after the newsletter cron at 03:00) and on every PR that touches `src/`, `public/`, `next.config.*`, or the LHCI configs. Audits 8 representative URLs against `budget.json`. On schedule failure, opens a GitHub issue tagged `performance` with a link to the LHCI report and a pointer back to this section. Manual trigger: Actions → "Performance" → "Run workflow".

- **Microsoft Clarity** — already wired (production-only, gated against dev/preview hosts). Use for session recordings and ad-hoc URL performance exports when investigating specific incidents.

**Adjusting budgets**: edit `budget.json` at the repo root and commit. LHCI picks it up on the next run. Tighten budgets gradually as the site improves; loosen them only with a written justification (in the commit message, ideally).

**Claude Code skills for perf work**: this repo has a project-specific `.claude/skills/perf-check/` skill that auto-triggers on perf-related phrases and points Claude at this section of CLAUDE.md. Generic perf expertise comes from [Addy Osmani's web-quality-skills](https://github.com/addyosmani/web-quality-skills) installed in `~/.claude/skills/` (6 skills: `web-quality-audit`, `performance`, `core-web-vitals`, `accessibility`, `seo`, `best-practices`). Install with `git clone https://github.com/addyosmani/web-quality-skills ~/.claude/skills/addyosmani-web-quality`.

### Adding New Issues

When you encounter a problem, document it here with:
1. **What failed** - Clear description of the issue
2. **Date** - When it was discovered
3. **Solution** - How it was fixed
4. **Category** - Add to appropriate section above
