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
### Session 2026-04-25 13:28 (MacBook)
- **Pattern:** Audit page redesign — demo-led hero, pinned screenshot results, side-panel chat
- **Status:** ✅ Completed
- **Files Changed:** 11
- **Tests Added/Modified:** 0
- **Notes:** Major restructure of `/audit` flow driven by 0.3% completion baseline + Apr 17 v2 follow-up direction. **(1) Demo-led hero.** Flipped the funnel from "intake hero → product picker → upload → results" to "demo result IS the hero → click Start your audit → upload → results". `audit-client.tsx` initial state now `step: 'demo'` with eagerly-loaded `DEMO_ANALYSIS_RESULTS`/`DEMO_SCREENSHOT_FALLBACK`, fires `audit_demo_viewed` once on mount; `handleStartRealAudit` resets state and jumps to `'screenshot'`. New `AuditStep` includes `'demo'`. Old server-rendered hero (`audit-intake-hero` chip+H1+subtitle) deleted from `page.tsx`; H1 was preserved sr-only initially then promoted into `FullPageResults` demo branch as visible "Free AI UX Audit Tool" (3xl→6xl, var(--text-hero)) + subtitle, matching the brand's prior on-page SEO signal. Demo branch ends with a big rounded-full primary CTA "Start your audit" (no icon). **(2) DemoProductMockup.** New `src/components/audit/DemoProductMockup.tsx` — vendor-neutral PulseMetrics analytics dashboard with KPI cards (Revenue/Orders/Conv./AOV), inline-SVG revenue trend chart with linear-gradient fill, recent-orders table, and an AI Assistant right panel (insight cards in violet, recommendation, failed-forecast error block, mock input footer). Five numbered pins overlaid at fixed coordinates corresponding to the first 5 topGaps: Confidence Visualization (96/32), Human-in-the-Loop (76/11), Error Recovery (78/56), Explainable AI (96/44), Selective Memory (76/21). Active pin scales to 125% with white border + accent fill; inactive pins pulse via `animate-ping`. Replaces the earlier short-lived `DemoChatMockup.tsx` (deleted) — the chat-mockup approach was only on-screen for one iteration before the dashboard pivot. **(3) Side panel for pin clicks.** Both demo and real-audit branches share the same `openPin`/`hoveredPin` state; clicking a pin opens an absolute-positioned aside (full-width on mobile, 420px on desktop sm:) with the matching pattern's `<GapCard>`. Demo banner "Sample audit" + small CTA was first attempt then replaced by the bigger H1+button approach; the demo chat-tab path now empty-states with "Run an audit to chat" instead of auto-firing the chat opener. **(4) Real-audit results mirror demo.** Replaced the old split-view (5/7 grid + tab toggle) with same screenshot+pins+side-panel UX. User's uploaded screenshot rendered inside a fixed device-aware canvas: 880×660 (4:3 aspect) for desktop screenshots, 400×711 (9:16) for mobile (`detectDeviceType()` already plumbed via `screenshotDeviceType` prop from `audit-client.tsx`). Top-5 issues mapped to deterministic `REAL_PIN_POSITIONS` distributed across the screenshot (we don't have AI-detected coordinates yet — pins are spatially generic, the side panel does the actual feedback). 2px CSS blur + 30% white/dark wash overlay on the screenshot so the numbered pins read clearly. **(5) Inline chat side panel.** Chat moved from below-fold tab to a same-row right column. First iteration was a fixed-position drawer with scrim — wrong UX, replaced with in-flow flex layout where screenshot is left and chat aside is right. Chat is locked to the same explicit pixel height as the canvas (`lg:h-[660px]` desktop / `lg:h-[711px]` mobile-shot) so toggling it open/closed never reflows the page. Chat width: `lg:w-[360px]`, total row 880+360+24=1264 fits the bumped `max-w-7xl` (1280) wrapper. Chat content scrolls inside `flex-1 overflow-y-auto` body with `min-h-0` parent. Page wrapper widened from `max-w-6xl` → `max-w-7xl` to accommodate the canvas+chat row; CTA strip / Quick Wins still use narrower `max-w-2xl`/`max-w-3xl` inner constraints. **(6) Inline product-type on upload screen.** Extracted shared `productOptions` constant to `src/components/audit/productOptions.ts` (reused by the previously-deleted `AnchorQuestion.tsx` and the new chip selector). `ScreenshotUpload` now renders product-type as compact pill chips at the top of the column instead of a separate step; Analyze button disabled until both type + ≥1 screenshot are present. Removed the right-side per-product example audit preview (sampleAudits + statusConfig + LetterGrade import) — the new demo dashboard hero supplants that. Single-column layout, `max-w-2xl` centered. Removed `AnchorQuestion.tsx` (now unused). **(7) SocialProof gating.** SocialProof ("What is an AI UX audit?", "How it works", trust strip, Community block) only renders on `step === 'demo'`. Initial DOM-mutation hide via `getElementById` proved fragile on HMR + had a hydration flicker; final fix moves SocialProof rendering into `audit-client.tsx` as `{step === 'demo' && <SocialProof />}` and removes the wrapper from `page.tsx`. SSR still includes it on first paint at `/audit` since initial step is `'demo'` — SEO signal preserved. **(8) Action-bar CTAs (text-only).** Removed icons from the four primary CTAs in the audit flow per user direction: "Email Report" (was EnvelopeIcon), "Run Another Audit" (was ArrowPathIcon), "Analyze Screenshots" (was SparklesIcon), demo-mode "Start your own audit" (was SparklesIcon). Dead imports cleaned up (`SparklesIcon`, `EnvelopeIcon`, `ArrowPathIcon` removed from FullPageResults; `SparklesIcon` removed from ScreenshotUpload). CTA order on results page is now Email Report | Hide/Chat with results | Run Another Audit, sitting above the Quick Wins block. **(9) Score badge gated.** Removed the LetterGrade + product summary cluster from above the post-audit screenshot — at landing/demo time the score is meaningless before the user uploads, and on real-audit the screenshot+pins do the storytelling. Score still computed and used in API context. **(10) Canvas grid background.** Replaced the existing `bg-grain` (film-grain) with new `bg-canvas-grid` utility added to `globals.css` — 24px grid lines using nested linear-gradients, light variant for light mode (rgba(0,0,0,0.05)) and inverted for dark mode. Pattern matched from `src/components/mentor/CanvasView.tsx:144`'s inline grid usage. Applied across all three audit sections (intake hero in page.tsx already removed; remaining wrappers in audit-client.tsx). **(11) Two new analytics events.** `audit_demo_viewed` (fires once on demo step mount) and `audit_demo_start_real_clicked` (fires on Start-your-audit click) added to the `AuditEvent` union in `src/lib/audit/analytics.ts`. Existing `audit_product_type_selected` reused for the inline chip selector. **(12) Performance audit pass.** Verified the new flow against all 13 documented Performance & Web Vitals issues in CLAUDE.md before declaring done — most relevant: `framer-motion` zero usage in any new audit code (Issue #8); fixed a real regression where `FullPageResults` was still imported with `ssr: false` in `audit-client.tsx` even though the H1+mockup hero now lives inside it (Issue #9 + #12) — removed the `ssr: false` so the LCP element renders server-side; `'use client'` boundary correctly limited to `audit-client.tsx` not the whole page; no new media added (all SVG inline); 24px CSS grid bg adds zero JS cost. No `priority` on below-fold images, no `<video>` tags added, no animated webp added. **Verification.** `npx tsc --noEmit` clean on every iteration of every modified file. Did NOT run `npm run build` per `feedback_dont_build_during_dev.md`. Dev server smoke-tested live throughout (`/audit` 200, HMR worked across the whole refactor). Did NOT run LHCI workflow — left for next session once dev iteration stabilizes; real verification against the budget will need a fresh nightly run. **Pending.** (a) Pin coordinates on real audits are spatially generic — the AI doesn't return per-issue regions yet. Worth investigating whether the `/api/patterns/analyze` prompt could be extended to return approximate regions on the screenshot so pins land on relevant areas. (b) Mobile breakpoint behavior of the canvas+chat row needs eyeball-testing on actual narrow viewport (single-column stack with chat below screenshot — should work but unverified). (c) Old `'product-type'` step value retained in `AuditStep` union but no code path renders it; keep until A/B work crystallizes, drop later. (d) `__tests__/ScreenshotUpload.test.tsx` is still stale (was already broken pre-session — references "Upload your screenshot" / `productDescription` which don't exist) — only updated `defaultProps` to add `onProductTypeChange` so the file type-checks; leaving real test fixes for a focused testing session. (e) Worth running an LHCI mobile-preset run against `/audit` once deployed to confirm the SSR fix delivers the expected LCP improvement (Issue #1: lab vs field gap is real; both lab and field should improve since we kept H1 server-rendered).

### Session 2026-04-25 11:50 (MacBook)
- **Pattern:** Newsletter footer CTA — patterns library → guides
- **Status:** ✅ Completed
- **Files Changed:** 1
- **Tests Added/Modified:** 0
- **Notes:** Persisted the manual surgery from 2026-04-22 (Claude Design guide card session) into code. `renderFooterCTA()` in `src/app/api/cron/generate-newsletter/route.ts` now emits heading "Free AI UX learning guides for designers" + button "Explore all guides →" linking to `${SITE_URL}/guides` instead of the previous "All N AI UX patterns in one place" / "Explore the pattern library →" → `/patterns`. User picked the slightly-revised wording over the original surgery wording ("Free learning paths for designers") — explicitly chose "Free AI UX learning guides for designers" to make the AI UX framing more legible. Removed the now-unused `const n = patterns.length` line; `patterns` import remains used at lines 278, 953, 1017, 1086 so left in place. Also patched today's pending-review draft (`cmodri6mw0000ic043561nrb6`) directly via Prisma to apply the new CTA without regenerating items — `?force=true` was offered but user declined ("no need to change anything except the cta") since the existing items + manually-fixed TLDR sourceUrls were already correct after the prior session's surgery. Three precise replacements in `draft.content`: (1) headline regex `/All \d+ AI UX patterns in one place/` → "Free AI UX learning guides for designers", (2) button text "Explore the pattern library →" → "Explore all guides →" (string replace, not regex — single occurrence), (3) the matching anchor's `href` rewritten via anchor-text-anchored regex `/<a href="([^"]+)"[^>]*>Explore all guides →<\/a>/` capturing the URL then `.replace(/\/patterns(\/?)$/, '/guides$1')` so the rewrite is scoped to the footer anchor and won't accidentally hit any in-body `/patterns/<slug>` pattern-card links elsewhere in the HTML. Each replacement guarded with an existence check that aborts if the prior string isn't present. Patch script in `/scripts/` deleted post-run. Did NOT push the next 03:00 UTC cron run trigger — user only wanted today's draft updated; tomorrow's run will pick up the deployed code change automatically. **Verification.** `npx tsc --noEmit` clean on the modified file (same pre-existing line-667 error in unrelated code). Audit-area uncommitted work (~9 files, ~329 insertions) deliberately left in working tree per user's standing instruction from the 11:35 save — to be committed separately. **Outstanding follow-ups.** (a) Watch tomorrow's cron run to confirm the new CTA renders correctly end-to-end. (b) Once Vercel deploys the commit, the CTA fix applies to all future newsletters automatically — no further manual surgery needed for this. (c) Consider adding a structuredData `editedBy` audit-trail entry for the CTA patch on draft `cmodri6mw0000ic043561nrb6` if pattern-tracking compliance matters; not added this session since `content` was the only field touched and it's idempotent (the regex won't re-match itself).

### Session 2026-04-25 11:35 (MacBook)
- **Pattern:** Newsletter — TLDR Design digest scraper (per-story expansion, real source URLs)
- **Status:** ✅ Completed
- **Files Changed:** 1
- **Tests Added/Modified:** 0
- **Notes:** User flagged today's daily (Apr 25, draft `cmodri6mw0000ic043561nrb6`) was rendering two TLDR-attributed items — "ChatGPT Image Generation Now Integrated Directly in Figma" and "Instagram Instants: AI-Powered Quick Photo Sharing" — both pointing at the digest URL `https://tldr.tech/design/2026-04-24` instead of the underlying figma.com release notes / techcrunch articles. **Initial misdiagnosis.** Planned a regex extractor against `item.content` from the TLDR Design RSS feed (per the original plan at `~/.claude/plans/in-todays-newsletter-that-wiggly-lampson.md`), shipped it as a no-op scaffolding, then ran the smoke test and discovered the actual structure: the TLDR Design RSS (`https://tldr.tech/api/rss/design`) has **no `content` or `description` field at all** — each RSS item is a single daily digest with only `title`, `link`, `pubDate`, `creator`, `categories`. The title is just three short tags joined by commas (e.g. "ChatGPT Images in Figma 🎨, Instagram Instants 📸, iPhone Ultra Foldable 📱"). Claude was being fed one such item with empty description + the digest URL, and was **fabricating per-story descriptions and reusing the same digest URL for both** synthesized newsletter items. So the bug was deeper than the user's symptom: not just wrong URLs, but also fabricated copy. **Real fix shipped.** Replaced the scaffolded regex helper with `fetchTldrDigestStories()` — a digest-page HTML scraper that fetches the digest URL with a 5s `AbortController` timeout and a custom `user-agent` (`Mozilla/5.0 aiuxdesign-newsletter-bot`), then iterates `<article class="mt-3">…</article>` blocks via regex. For each block: extracts the outbound URL from the `<a class="font-bold" href="...">` tag, the title from the `<h3>...</h3>` (stripping ` (X minute read)`, ` (Website)`, ` (Product)`, ` (GitHub Repo)`, ` (Video)` suffixes), and the blurb from `<div class="newsletter-html">…</div>` (stripping inner tags + first 500 chars). Skips any anchor pointing back to `tldr.tech` to avoid self-links / sponsor placeholders. Synthesizes a `Parser.Item`-shaped object from the title+blurb, runs it through the existing `scoreRelevance(synth, source.tier)` so TLDR stories get the same `design-pub` baseline (+50) plus keyword scoring as other design publications, drops anything below the 10-point threshold. Added a small `decodeHtmlEntities()` helper covering `&#xNN;`, `&#NN;`, `&amp;`, `&quot;`, `&lt;`, `&gt;`, `&nbsp;` — needed because TLDR's source HTML double-encodes ampersands in URLs (`&amp;amp;` in the figma URL). One pass leaves `&amp;` literal, which the email template's plain-string interpolation at line 1218 then injects into `<a href="...&amp;...">` — the browser then HTML-decodes the attribute on read, so the link works. Wired in by special-casing `source.name === 'TLDR Design'` at the top of the RSS map: take all recent RSS digests in the `lookbackHours` window, scrape each digest URL into per-story `NewsItem`s, then apply the existing `usedUrls` and `isTitleAlreadyUsed` filters against the synthesized items. Restored the original (pre-this-session) RSS mapping for all other sources — no behavior change for them. `MAX_ITEMS_PER_SOURCE = 2` cap at line 683 still applies, so even though one digest expands to ~14 stories, only the top 2 by score reach Claude. **Smoke test verification.** Ran a standalone `node` script that mirrored the helper, fetched today's digest, and confirmed exact mappings the user requested: ChatGPT-in-Figma → `https://www.figma.com/release-notes/?title=chatgpt-images-2-now-available-in-figma&amp;utm_source=tldrdesign` and Instagram Instants → `https://techcrunch.com/2026/04/23/instagram-tests-a-new-instants-app-for-sharing-disappearing-photos/?utm_source=tldrdesign`. Total 14 stories extracted from today's digest with real titles, real blurbs, real outbound URLs. Title cleanup correctly stripped "(1 minute read)", "(Website)" suffixes; sponsored/self-link rows correctly skipped. **Live-issue patches.** Today's draft was already in `pending_review` with the broken URLs. Wrote two throwaway scripts in `scripts/` (deleted after use): one PATCHed `structuredData.items[1].sourceUrl` and `items[3].sourceUrl` directly via Prisma using `DATABASE_URL` from `.env.vercel.prod` (the production env file per CLAUDE.md troubleshooting checklist); the second patched the rendered `content` HTML string by detecting figma-vs-instagram order via `indexOf('ChatGPT Image')` vs `indexOf('Instagram Instants')` and replacing the two `https://tldr.tech/design/2026-04-24` occurrences in order. Initially patched only `structuredData` and missed the rendered `content` field that the admin "Copy HTML" / preview reads from — user reported "I still see the TLDR links" and second pass closed that gap. Both scripts also added an `editedBy: claude-tldr-url-fix-2026-04-25` audit trail entry to `structuredData.editedBy[]` matching the convention from the 2026-04-22 surgery session. **Verification.** `npx tsc --noEmit` clean on the modified file (the only error in this file at line 667 is pre-existing — `RegExpStringIterator` ES2015 target issue in the `usedUrls` extractor I didn't touch). Did NOT run `npm run build` per `feedback_dont_build_during_dev.md`. Dev server smoke-tested briefly to ensure no compilation errors. **Outstanding follow-ups.** (a) Tomorrow's 03:00 UTC daily cron is the first end-to-end test of the new pipeline — watch for whether TLDR-sourced items now have real outbound URLs and properly-attributed descriptions instead of fabricated ones. If `fetchTldrDigestStories()` fails (network timeout, HTML structure change), the function returns `[]` and TLDR Design contributes zero items that day rather than producing broken digest links — design-pub category still has NN/g, Smashing, A List Apart covering the slot. (b) The TLDR digest HTML structure (`<article class="mt-3">`, `<a class="font-bold">`, `<div class="newsletter-html">`, `<h3>`) is parsed via regex, not a real HTML parser — fragile if TLDR refactors. Watch for warnings in cron logs reading `[newsletter] TLDR digest fetch error: ...` and consider switching to cheerio if the regex breaks twice. (c) The audit-area uncommitted work (~9 files, modified `audit-client.tsx`, new `DemoProductMockup.tsx` + `productOptions.ts`, deleted `AnchorQuestion.tsx`) was deliberately left out of this commit per user request — to be committed separately. (d) The decoded `&amp;` literal in URLs works in the email template's plain string interpolation but would double-encode if rendered via React's JSX `<a href={url}>`. The `/news` page renders sourceUrl through the structured data path; if that path uses JSX, the literal `&amp;` in figma's URL would break in-browser. Worth verifying after publish — if broken, the scraper helper should change to fully decode `&amp;` → `&` (i.e., loop the entity decoder until stable).

### Session 2026-04-23 17:03 (MacBook)
- **Pattern:** Newsletter admin — Copy HTML button persists for already-published drafts
- **Status:** ✅ Completed
- **Files Changed:** 1
- **Tests Added/Modified:** 0
- **Notes:** Direct follow-up to the gap explicitly deferred in the 2026-04-23 15:17 session. User reported: "when a newsletter is published I see a button copy html but that goes away once I close and reopen as the state of the newsletter is now published I should be able to use the copy html even after the state of the news is published." Confirmed bug in `src/app/admin/newsletter/admin-newsletter-client.tsx`: the Copy HTML + Open Beehiiv buttons rendered behind a `{publishedAt && ...}` gate, where `publishedAt` is an in-session `useState` flag set only inside `publishDraft()` on a successful publish response. Nothing rehydrates that flag when `fetchFullDraft()` loads a draft that's already persisted as `status: 'published'` — so reopening a published daily (via "Show all" in the sidebar filter, since the default list is `pending_review`) left the admin with no way to grab the HTML for Beehiiv without re-clicking Publish. Re-publishing is status-idempotent (the POST handler just re-fires `revalidatePath` and reuses the existing slug, no duplicate row inserted) but is unintuitive UX and confused the user into thinking the feature was gone. **Fix:** changed the visibility gate from `{publishedAt && ...}` to `{(publishedAt || activeDraft.status === 'published') && ...}` so either condition surfaces the buttons. Also extended the Publish button's `disabled` condition + "Published ✓" label check to honor the same OR, so a persisted-published draft shows the green confirmed state instead of an active Publish button. Draft's `status` field is already on the `NewsletterDraft` interface and populated from the `/api/newsletter/drafts?id=...` GET path, so no API/type changes needed — purely a client-side rehydration fix. **Verification:** `npx tsc --noEmit` clean on the modified file (pre-existing 85 errors elsewhere in repo — test mocks + standalone scripts with divergent tsconfig — unchanged). 3 insertions / 3 deletions, single file. Did NOT run `npm run build` per `feedback_dont_build_during_dev.md`. **Post-deploy verification path:** open `/admin/newsletter`, click "Show all", select any `status: 'published'` draft (e.g., today's `cmo9iffff0000...`), confirm Copy HTML + Open Beehiiv buttons are visible immediately with Publish button showing "Published ✓" disabled. Earlier PATCH-side revalidation fix from 15:17 session still pending push — this commit bundles both.

### Session 2026-04-23 15:17 (MacBook)
- **Pattern:** Newsletter admin — cache revalidation on edit + credit-exhaustion incident
- **Status:** ✅ Completed
- **Files Changed:** 1
- **Tests Added/Modified:** 0
- **Notes:** Two threads. **(1) Daily newsletter didn't appear in admin for Apr 23.** Watchdog email flagged `Retrigger was accepted but no newsletter appeared after 40s — generation likely failed silently`. Initial hypothesis was the Apr 22 `isDesignNativeItem()` widening in commit `69451b5` causing some new false-rejection path, but reading the diff ruled that out — the change only makes the gate more permissive and doesn't appear on the throw path. Real cause surfaced from a separate failure-alert email with the stack trace: `400 {"error":{"type":"invalid_request_error","message":"Your credit balance is too low to access the Anthropic API"}}` from `req_011CaKyBcBUMZFtwfdG65wPE`. Account-level Anthropic billing exhaustion, not a code bug — pipeline was fine, just got hard-rejected at the API. User topped up credits, I re-triggered via `curl -H "Authorization: Bearer $CRON_SECRET" https://www.aiuxdesign.guide/api/cron/generate-newsletter` using the production CRON_SECRET from `.env.vercel.prod` (different from `.env.local` — per the CLAUDE.md troubleshooting checklist). Draft landed 18s later as `cmo9iffff0000...` type=daily status=pending_review title="AI UX Daily: When Design Becomes Engineering, and How to Stay Human". Verified via Prisma query against `DATABASE_URL` from `.env.vercel.prod`. **(2) Edit-already-published gap.** User asked "can we edit published news items?" — code audit showed yes, `PATCH /api/newsletter/drafts` doesn't gate on status and neither does the admin UI Save button; just need to click "Show all" in the list header (defaults to `pending_review`). But flagged a real propagation gap: edits DO save to DB immediately, but PATCH doesn't call `revalidatePath`, so `/news` listing stays stale up to 60s (ISR TTL) and `/news/[slug]` article stays stale up to **1 hour** (the detail page uses `revalidate = 3600`, not 60). For a typo-fix on a published item, 1hr lag is too long. Shipped fix: added `revalidatePath('/news')` + `revalidatePath(\`/news/${draft.slug}\`)` to the PATCH handler at `src/app/api/newsletter/drafts/route.ts`, gated on `draft.status === 'published'` (no point revalidating for pending_review since those slugs 404 on the public route anyway, the `getPublishedDrafts()` filter excludes them). Added `import { revalidatePath } from 'next/cache'`. `npx tsc --noEmit` clean on the file (pre-existing 85 errors elsewhere unchanged per the ongoing test-mock/standalone-script divergence). Did NOT run `npm run build` per `feedback_dont_build_during_dev.md`. **Not shipped (explicit user deferral):** the second UX gap around Copy HTML / Open Beehiiv buttons only appearing when `publishedAt` is set in-session (so if you load a published draft to edit, you can't grab its HTML without clicking Publish again, which works — status-idempotent, re-fires revalidatePath — but is unintuitive). User declined this second fix when offered. Also deferred: a credit-balance-specific error classifier in the cron route's catch block that would let watchdog emails distinguish "billing" vs "bug" upfront (~10 lines, cheap but cosmetic). **Watchdog worked correctly throughout.** It detected the silent failure via the 40s-no-draft check and emailed; separately the cron's `sendAdminNotification` failure path emailed the stack trace. Two-email pattern means the current alerting is already sufficient — the watchdog can't and shouldn't try to classify "billing" vs "pipeline" itself. **Outstanding follow-ups.** (a) Watch cron-job.org execution log for the next few days to confirm daily resumes normal schedule now that credits are live. (b) If credit-exhaustion becomes recurring, add the classifier so the admin email subject reads "Newsletter Generation Failed: Anthropic billing" vs generic "Newsletter Generation Failed". (c) If the "edit a published typo then copy to Beehiiv" flow gets used, revisit the Copy HTML button gating — currently requires re-clicking Publish to surface it. (d) The PATCH revalidation fix needs a commit-and-push to take effect — included in this save. **Verification path post-deploy:** edit any published draft in `/admin/newsletter`, Save, then `curl -I https://www.aiuxdesign.guide/news/<slug>` — `x-nextjs-cache: HIT` on first request after the revalidate should flip to `x-nextjs-cache: MISS` briefly then back, confirming the on-demand revalidation fired. Easier smoke: change the title of a published draft, Save, reload the article page, title should reflect immediately instead of within the hour.

### Session 2026-04-22 17:48 (MacBook)
- **Pattern:** SEO deep-dive — CTR meta rewrites + new seo-review skill + CLAUDE.md SEO Troubleshooting section
- **Status:** ✅ Completed
- **Files Changed:** 4
- **Tests Added/Modified:** 0
- **Notes:** Continuation of the perf/SEO thread from the earlier 16:48 session. **Context.** User pulled two GSC Performance exports from Apr 22: the (1) folder had single-period CSVs (last 28 days only), the (2) folder had comparison CSVs (last 28d vs previous 28d). I initially analyzed (1) and concluded "no improvements" — which was half-wrong because I was reading clicks (127→132, flat) without seeing the 35% impression growth underneath. The (2) export with proper `Last N days / Previous N days` columns flipped the narrative entirely: impressions +35% (19063→25744), clicks +4% (127→132), CTR mechanically dropping because page-2 promotions add impressions at lower-CTR positions. Several patterns showed huge position gains (progressive-enhancement 18.3→7.1, conversational-ui 28.8→18.3, responsible-ai-design 15.6→7.8). Claude Code guide breakout: 3→21 clicks in 28d (+600%), 71→224 imp. **Real bottleneck identified: SERP → click conversion, not indexation/ranking.** Six pattern pages rank on page 1 with <1% CTR and >1000 impressions each — confidence-visualization (3992imp/0.55%), conversational-ui (3396/0.38%), progressive-disclosure (3337/0.12%), trust-calibration (1562/0.26%), privacy-first-design (1541/0%), error-recovery (1312/0.15%). Rewrote their meta in `src/utils/metadata.ts` targeting specific query intent: (a) lead titles with brand anchors (ChatGPT, Claude, Notion, Copilot, Apple Intelligence, Signal, DuckDuckGo) instead of abstract "How to Design…" framings, (b) match exact query language where possible ("How to Show AI Confidence Scores" maps to underwriting-risk query at pos 1.7), (c) "playbook" / "real examples" / "interactive demos" as differentiators, (d) "(2026)" year anchor only on conversational-ui (freshness signal for evergreen content, stays relevant all year), (e) deliberately NO unverified numeric claims ("6 patterns", "10 examples") — these CTR-boost only if delivered, and I hadn't verified counts. 14-21 days until visible CTR delta post-recrawl; best-case read Apr 29, proper read May 6. **Built `.claude/skills/seo-review/` skill.** SKILL.md frontmatter auto-triggers on "check GSC", "SEO review", "GSC performance", "any SEO improvements" etc. Required first actions: (1) read CLAUDE.md → SEO Troubleshooting, (2) confirm comparison-export shape (refuse single-period with a pointer to toggle "Compare" → "Previous period" in GSC), (3) run `node .claude/skills/seo-review/analyze.js <folder>`, (4) cross-reference `gh issue list --label performance` for CWV/CTR overlap, (5) classify problem before interpreting (indexation vs ranking vs CTR vs demand — different playbooks). analyze.js is 258 lines, handles both comparison and single-period export shapes (`detectComparison()` + `detectSingle()` fallback), normalizes the counterintuitive "Last → Previous" column order to chronological `prev → last` in all output. Pattern flag rules: `flagCtrProblem` (pos<11 + imp>=300 + CTR<1%), `flagRankingOpportunity` (imp>=500 + pos 11-25), `flagRegression` (pos delta >=3 OR clicks down >=50% from prev>=3), `flagBreakout` (clicks >=3× prev AND last>=5). Outputs 7 markdown sections: headline totals, 🚀 breakouts, 🎯 CTR problems, 📈 near-page-1 opportunities, ⚠️ regressions, top-15-by-impressions with deltas, new/fading queries, device split. Script explicitly outputs patterns not recommendations — SKILL.md "interpretation is your job" guardrail. **Verification against real data.** Tested on today's (2) export: skill correctly identified 13 CTR-problem pages (I'd manually caught 6 — it surfaced 7 more including adaptive-interfaces, multimodal-interaction, agent-status-monitoring, progressive-enhancement, mixed-initiative-control, context-switching, escalation-pathways), 9 regression pages (biggest miss I had: ambient-intelligence pos 9.4→19.7 dropped a full page), 2 breakouts (Claude Code guide 7×, /about 4.5×), 3 near-page-1 opportunities (conversational-ui, feedback-loops, /audit). The skill genuinely caught things my manual eyeballing missed — confirms it earns its keep. **Added CLAUDE.md "SEO Troubleshooting" section** (~42 lines). 8 documented recurring failure modes with dates, mirroring the Performance & Web Vitals table format. Key lessons recorded: (a) "no SEO improvements" conflates 4 different metrics (indexation, impressions, clicks, position) — ask which one the user means; (b) direction-of-change tax on comparison exports (Last-first / Previous-second is counterintuitive, burned me today); (c) CTR mechanically drops when impressions grow faster than clicks (page-2 promotions add lower-CTR impressions); (d) page-1 rankings with <1% CTR = SERP snippet losing, rewrite meta; (e) "discovered not indexed" is often authority signal not technical bug — adding more content won't fix; (f) intent mismatch on high-impression queries ("privacy first ai" wants products not taxonomies); (g) CWV is a 28-day-rolling ranking signal (today's perf fixes won't show until mid-May); (h) guide lesson queries have tiny search volume (<100/mo per guide = distribution problem not SEO). Plus SEO Troubleshooting Checklist (4 steps), realistic timelines table, Monitoring Setup section (manual GSC export weekly, Coverage report monthly, automated LHCI+Clarity), and pointer to the new skill + Addy Osmani's generic `seo` skill in `~/.claude/skills/`. **Explicit design guardrails for the skill.** Documented 4 hard NOs: won't run autonomously on cron (review cadence is weekly-to-monthly + judgment-heavy), won't pull GSC via API (OAuth overhead > saving 30s of manual export), won't make SEO changes autonomously (meta rewrites at scale = weeks of degraded CTR if wrong), won't generate template recommendations (reasoning > templates). Matches the earlier feedback memory on not adding more unattended jobs after the March newsletter cron incidents. **Verification.** `npx tsc --noEmit` clean on `src/utils/metadata.ts` (pre-existing 85 errors elsewhere unchanged). Skill script tested end-to-end against real GSC data, output formats correctly. **Outstanding for next review (Apr 29 / May 6).** (a) Check CTR on the 6 rewritten pages to see if any moved; revert individual entries if CTR dropped (14-day read is best-case, 21-day read more reliable). (b) Run the skill weekly on fresh GSC exports; skim for new regressions/breakouts. (c) Decide what to do about the 7 additional CTR-problem pages the skill flagged (adaptive-interfaces et al.) — either do another meta-rewrite batch or wait to see if the first 6 confirm the hypothesis. (d) The near-page-1 opportunities (conversational-ui pos 18, feedback-loops pos 13, /audit pos 13) could benefit from content-depth investment per the gist.design experiment conclusion — but not urgent. (e) The 7 regression pages need per-page investigation — could be competitor ranking, content staleness, or Google re-evaluating post-recent-refreshes. (f) Check back in May once the 28d-rolling CWV window catches up to today's perf fixes.

### Session 2026-04-22 16:48 (MacBook)
- **Pattern:** Performance sweep — /news ISR + audit-kit framer-motion + lazy chat-previews + webp re-compress + newsletter QA gate + daily newsletter surgery
- **Status:** ✅ Completed
- **Files Changed:** 9
- **Tests Added/Modified:** 0
- **Notes:** Mixed session with two parallel threads. **Thread 1 — today's daily newsletter review + surgery.** Started from Clarity signal that `cmo9ifoh80000i504c1ju371f` (Apr 22 daily) had flagged `designLightWarning: true` with `designNativeCount: 0/4` despite all 4 picked items (Claude Design launch, Google Ads agentic safety, GPT Image 2, Replit Security Agent) being squarely on-mission for the "what designers need to know across products daily" purpose. Initial diagnosis misfired — I recommended shifting selection toward design-pub think-pieces (Smashing accessibility essay, UX Collective concrete pieces) based on the 48h RSS window showing Smashing had a strong design-native story that scored higher than Claude Design at 65 vs ~40 yet got rejected. User pushed back: the newsletter's purpose is product news for designers, not opinion essays from design pubs. Reframed correctly — today's 4 items ARE on-mission; the QA flag itself is the bug. Real cause: `isDesignNativeItem()` at `src/app/api/cron/generate-newsletter/route.ts:397` defined "design-native" as bigram matches against 14 narrow phrases (`"ui design"`, `"design system"`, `"figma"`, `"prototype"`) which systematically miss (a) design-tool product launches from AI labs ("Claude Design" from Anthropic has tier `ai-lab`, title contains "design" but not the exact bigrams), (b) AI image/mockup/UI-generation news (GPT Image 2), (c) agentic-UX patterns (pre-flight safety, HITL, intent preview). Rewrote: widened `DESIGN_KEYWORDS_SET` 14→30 phrases adding design-tool vocab (`"design tool"`, `"design platform"`, `"visual design"`, `"visual creation"`, `"canvas"`, `"mockup"`, `"handoff"`), mockup/image-model vocab (`"image generation"`, `"image model"`, `"ui generation"`, `"ui rendering"`, `"render ui"`, `"text in images"`), plus `"storyboard"`; added `AGENTIC_UX_TERMS` (7 terms: `agentic`, `agent ui`, `human-in-the-loop`, `pre-flight`, `intent preview`, `plan summary`, `trust calibration`) + `AGENTIC_APPLICATION_TERMS` (5 terms) as a separate co-occurrence check; added `DESIGN_TOOL_PRODUCT_RE` regex `/\b(figma|framer|canva|sketch|penpot|rive)\b|\bdesign\b/` scoped to title-only to catch product-name hits without noise from passing-mention in descriptions. Four pass conditions now: (1) tier=design-pub/design-tool/design-opinion, (2) design-tool product-name in title, (3) 2+ keyword hits across title+description on widened set, (4) agentic-term + application-term co-occurrence. Verified against today's real items: 2/4 pass (Claude Design via product-name, GPT Image 2 via `mockup`+`image model`); Google Ads and Replit Security still fall short because their descriptions lack explicit application terms — acceptable since the flag's job is only to catch genuinely empty issues, and 2/4 flips `designLightWarning` true→false. Verified against synthetic devops-only day (Vercel edge logging, Supabase pooler, GitHub Actions runner, Kubernetes LB): 0/4 pass, flag fires correctly. Then DB surgery on today's draft: rewrote `structuredData.qa.designNativeCount` 0→2, `designLightWarning` true→false so the admin review UI reflects reality. Then content surgery — took the Claude Design guide card HTML from yesterday's published daily (`cmo8o2de90000jp04dvvglijv`, which had an "A small gift from us" 2-guide section via commit-trail `editedBy: claude-manual-surgery-2026-04-21-v2-guide-cards`) and inserted a single-guide version into today's content right under the Claude Design news item (anchored on `Augmented Creation →</a></p>\n</div>` before the `· · ·` separator). Two iterations on copy/styling per user feedback: first pass used a bordered callout box with "From aiuxdesign.guide" uppercase lede (too transactional); second pass dropped the box entirely for a single muted-grey intro paragraph; bumped card outer `border-radius` 16px→20px with softened border (`#e5e7eb`→`#e2e8f0`) + `overflow: hidden` for visible rounded corners. Also rewrote the footer CTA — `"All 36 AI UX patterns in one place"` / `Explore the pattern library →` → `"Free learning paths for designers"` / `Explore all guides →` pointing to `/guides`. Final content: 15,967 → 19,156 chars, single occurrence of `claude-design-learning-path` URL verified. All surgery scripts lived in `/tmp/*.js` or as node eval strings; gated by safety checks (prior block must exist before removal, duplicate prevention, anchor-text must match). **Thread 2 — performance investigation + fixes.** Pulled the Apr 8-22 Clarity smart events CSV + Apr 21 URL performance CSV. Smart events surfaced: audit funnel collapse (19 product-type picks → 13 step completes → 7 gaps found → 7 completions → only 1 paywall_shown, suggesting the threshold=1 auto-open-on-mount paywall is starved of exposure because too few users finish even 1 audit); newsletter subscribes at 6 in 15 days (~2.8/wk — worse than pre-Apr-1 baseline of 11/wk AND worse than the 5/wk post-Apr-1 floor that Apr 16 was supposed to recover); "Retry" is the #1 event at 47 sessions (2.21%), indicating a significant unknown error class; "Upload" fires only 2x vs 19 product-type-selected, so the mid-funnel audit drop is at screenshot upload; "Login" classifier misfiring on 8 sessions (no login exists on site — likely admin panel leaking into prod Clarity metrics). URL-performance CSV revealed 10 Claude Code learning path lessons all at identical metrics to 3 decimals (Score 46, LCP 4.892s, INP 672ms, CLS 0) — same-renderer signal, not 10 independent regressions. Cross-checked with LHCI: 6 consecutive nightly failures since Apr 17 (issues #26, #28, #29, #30, #31, #32 all open, unaddressed). Pulled the failing-assertion log — exactly 2 URLs breach budget: `/news` (LCP > 4500ms) and `/agent-readability-audit-kit` (same). Timing-matched to Apr 17 commits: `a0e0fc8` flipped /news `revalidate=3600` → `dynamic='force-dynamic'` (to fix stale Dec-2025 entries — over-corrected, killed all edge caching, so every request cold-starts serverless + Prisma query), and `a74d5e1` (audit v2 overhaul) re-introduced the "Fully client-rendered page=<Client/>" anti-pattern documented in CLAUDE.md Perf Issue #12 on the audit-kit page. For lesson pages the diagnosis took longer: lesson page.tsx is correctly server-rendered with static params + ISR, H1 in SSR HTML, guides.ts imported by server components only (my initial monolith-size hypothesis was wrong). Real cause: `src/components/ui/LessonRenderer.tsx` is `'use client'` + statically imports `src/components/guides/chat-previews.tsx` (532 lines, also `'use client'`) — every lesson page across all 5 guides ships the chat-previews bundle even though only Conversational UI's 8 `previewId:` sections actually use it. Explains the 672ms INP specifically (heavy hydration) and the borderline LCP (just over 4.5s budget). **Three fixes shipped.** (1) `/news` — flipped `dynamic='force-dynamic'` → `revalidate=60`; publish/route.ts already calls `revalidatePath('/news')` in both POST and GET paths (verified lines 35, 143), so admin publishes still propagate immediately via on-demand revalidation, while hot requests hit the edge cache for up to 60s. Comment explains the over-correction history to prevent future regression. (2) `/agent-readability-audit-kit` — removed `framer-motion` entirely from `audit-kit-client.tsx`. Four edits: dropped the `import { motion } from 'framer-motion'`; converted 3 hero `auditKitItems.map` `motion.div` cards to plain `div`s (removed `initial={{opacity:0, y:10}}` that blocked LCP by keeping cards invisible until framer-motion hydration completed — the documented failure mechanic for this page); converted the success-state `motion.div` to plain `div`. Net: ~85KB framer-motion bundle removed from this page's critical path + no more hydration-gated opacity. (3) Guide lessons — created new `src/components/guides/DynamicPreview.tsx` that wraps `getPreviewComponent()` in `next/dynamic({ ssr: false })` with a skeleton loading state; replaced the static `import { getPreviewComponent }` in LessonRenderer with `import { DynamicPreview }` and swapped the conditional `{PreviewComponent ? <PreviewComponent /> : fallback}` for `<DynamicPreview previewId={section.previewId} />`. Chat-previews now only loads when a lesson renders a `preview` section — i.e., Conversational UI only. Claude Code (23 lessons), Claude Design (12), Cursor, GitHub Copilot, GitHub guides all drop the 532-line chat-previews bundle from their initial JS. **Media recompression.** User flagged two files exceeding CLAUDE.md Perf #6's <1.5MB animated-webp target on the Claude Design guide: `lesson-4/cdlineup6.webp` at 1.47MB (at the ceiling) and `lesson-7/extraction-flow.webp` at 1.69MB (13% over, already flagged in Apr 21 session notes as "revisit if LCP regresses"). Wrote sharp recompression script gated by "must be smaller AND under target" safety check. cdlineup6: w=1200 q=75 → w=1000 q=65 → 1.03MB (30% reduction, well under 1.2MB target). extraction-flow: w=1000 q=60 → tried q=50 (1.57MB, still over), then q=40 (1.42MB, accepted). Both within budget, originals backed up to /tmp/*.bak.webp in case visual fidelity on extraction-flow at q=40 is unacceptable for the 842-frame screen recording. Net 705KB saved across the two files. **Related Patterns block removal.** User questioned the "Related AI Design Patterns" cross-link block on Claude Design lesson pages (Augmented Creation / Collaborative AI / Contextual Assistance showing on Publishing-a-Design-System lesson). Block came from Apr 16 session as SEO link-equity flow, ~200 lesson→pattern links. Reconsidered: equity flow is lesson→pattern which boosts pattern pages (already mostly indexed, 54/152 per GSC), whereas the pages needing indexation help are the 77 pending lesson URLs — and that's served by the reverse "Practice in Guides" block on pattern pages, not this one. Also mechanically guide-level mapped not lesson-level, so all 12 Claude Design lessons show the same 3 patterns regardless of lesson content; competes with stronger "Next Lesson" CTA visually; tangential-feeling blocks are exactly the signal that creates the quick-backs Apr 20 Clarity Score investigation flagged. Removed the entire block (32 lines) + the 2 now-unused imports (`getPatternsForGuide`, `patterns`) from `src/app/guides/[slug]/[lesson]/page.tsx`. Kept "Practice in Guides" block on pattern pages intact — that's where the real SEO value lives. Also flipped Claude Design guide `status: 'work-in-progress'` → `'ready'` per user direction (Apr 21 session had deliberately left it WIP pending L6/L7 review; user confirmed ready to ship). **Verification.** `npx tsc --noEmit` clean on all modified TS files (pre-existing 85 errors elsewhere are test mocks + standalone scripts with different tsconfig — unchanged). Did NOT run `npm run build` per `feedback_dont_build_during_dev.md`. Local dev server smoke test: `/news` 200 in 3.6s cold / then warmed, `/agent-readability-audit-kit` 200 in 242ms, `/guides/claude-code-learning-path/start-your-first-claude-code-session` 200 in 1.3s (compile then cached), plus 5 Claude Design lesson URLs all 200 in 80-120ms. **Outstanding follow-ups.** (a) Field-data verification on Apr 23 04:00 UTC LHCI nightly — if `/news` and `/agent-readability-audit-kit` both clear the 4500ms budget, close issues #26–#32 with a summary pointing to this session's fixes. (b) 7-day Clarity readback on lesson-page INP — expect the 672ms p75 to drop once chat-previews stops shipping to non-Conversational-UI lesson pages. (c) Newsletter signup regression root cause (6/15d = 2.8/wk, worse than 11/wk baseline) — separate investigation, not touched. (d) "Retry" 47-session Clarity signal — needs session recordings to identify the error class; could overlap with newsletter signup regression. (e) "Login" classifier misfire — admin Clarity pollution likely; check if hostname gate has a gap for /admin paths. (f) Audit-tool upload drop-off instrumentation (`audit_screenshot_uploaded` event) — would unblock the 63% mid-funnel drop-off diagnosis.

### Session 2026-04-21 16:04 (MacBook)
- **Pattern:** Claude Design guide — L5-L8 media + L6 Tweaks reframe + L8 publish-flow corrections
- **Status:** ✅ Completed (commit + push pending)
- **Files Changed:** 8 (1 data file + 7 new webp)
- **Tests Added/Modified:** 0
- **Notes:** Second working session on the Claude Design guide (first shipped in commit `83ef755` earlier today as `status: 'work-in-progress'`). Closed out every `image` placeholder in L5–L8 with real media captured by the user inside Claude Design on the ongoing **Lineup** kanban project — continuing the visual continuity from L2/L3/L4. **Media pipeline:** all clips ran through the CLAUDE.md Perf #6 sharp pipeline (`sharp({ animated: true }).resize({ width: 1200 }).webp({ quality: 75, effort: 6 })`). Static screenshots: same pipeline at `quality: 80`. Conversions: **cdlineup7.gif 3.56MB → 1.04MB** (L5, 166 frames, inline-comment attempt), **cdlineup8.gif 1.21MB → 0.31MB** (L5, 158 frames, chat fallback), **cdlineup9.gif 2.14MB → 0.50MB** (L6, 62 frames, Tweaks), **cdlineup10.gif 6.08MB → 1.69MB** (L7, 848 frames, full extraction flow — needed `limitInputPixels: false` because 848×1695×904 exceeds sharp's default 268MP cap; also bumped down to 1000w/q60 to hit the <2MB target since 1200w/q75 produced 2.68MB). Static screenshots (L7 setup form, L8 draft/published states): 382KB→21KB, 406KB→22KB, 384KB→21KB. **L5 — Inline Comments:** placed two clips around the existing "Known quirk" callout telling the documented failure-mode story. User's real-world experience was the comment queued but didn't execute the change; fell back to pasting the same request into chat, which worked. Broadened the callout from the narrower "comment disappears on reload" to cover both failure modes. Removed the empty bottom-of-lesson image placeholder. **L6 — Tweaks reframe (biggest content change):** user flagged that Claude Design has a built-in **Tweaks** toolbar toggle (visible in screenshots beside Comment/Edit/Draw). My original L6 lesson framed sliders as "ask Claude to build one via a prompt" which was factually wrong — Tweaks is the first-class path. Rewrote the whole lesson: title `Custom Sliders for Design Exploration` → `Tweaks: Explore Variations Without Chat`, duration 3min → 2min, dropped the "Build me a slider" prompt code block, added new sections for "Tweaks are design-specific" (Claude picks dimensions per canvas — Lineup gets Theme + Density, a marketing page would get different controls) and "When to use chat instead" (structural changes, dimensions Tweaks didn't surface). The "ask for more tweaks in chat" idea preserved as a callout, not a primary flow. **L7 — Extracting Design System:** added two images — static setup form screenshot as the cold entry point, plus a 28-second clip showing the end-to-end extraction flow for aiuxdesign.guide's design system (form fill → chat follow-ups → asset registration → "Your design system is ready" checklist all checked). Wrote a narrative `text` section between them setting up the clip. Softened the clip's duration caption after first writing "5–10 minutes" (claim without source) to "several minutes, scales with size of sources". **L8 — Publishing (three corrections from screenshots):** user's before/after shots revealed three inaccuracies in my existing copy. (1) My 3-step publish flow claimed "Open the design system (click Open)" as step 2 — wrong, the Publish toggle is inline in the org-settings design-systems list, no Open click needed. (2) I missed the `Make default` button entirely — it's a separate per-system setting from `Published`. Added a new "Published vs. Make default" section explaining the distinction (Published = selectable at project creation, Default = pre-selected in the dropdown; many published, one default). (3) Missed that publishing a system unlocks a `Design system` dropdown in the homescreen's New-prototype sidebar (image #6 has the "Set up design system" CTA, image #7 has the dropdown picker instead) — used that as step 3's self-verification. Replaced the single placeholder with two screenshots side-by-side (draft → published). Also rewrote the `Updating a published system` section to clarify that `Open` is a separate button from the toggle (they live in the same row). **Scope not touched:** L9 (Team & Enterprise Setup), L10 (Prototype), L11 (Pitch Deck), L12 (Handoff to Claude Code) all remain text-only per the earlier shot-list decision — none of these had `image` placeholders in the schema, so nothing renders as broken. Revisit if Clarity shows drop-off on those specific lessons. Guide `status` field remains `'work-in-progress'` — deliberately not flipped yet, want to eyeball the L6 Tweaks rewrite and the L7 extraction clip on production before declaring ready. **Conversion detour worth logging:** sharp threw `Input image exceeds pixel limit` on the first cdlineup10 pass because 848 frames × 1695px × 904px = 1.3 gigapixels, well above sharp's default 268MP safety cap. Fix was `limitInputPixels: false` in the sharp options. Before adding to the memory, CLAUDE.md Perf #6's pipeline snippet should probably be extended with this option for long animated clips — not critical enough to touch this session. **Verification:** `npx tsc --noEmit` clean on every edit round (filtered to just `src/data/guides.ts` since the repo has 85 pre-existing errors in test mocks + standalone scripts with different tsconfig). Did NOT run `npm run build` per `feedback_dont_build_during_dev.md`. Also did NOT run `npm run dev` to browser-verify — explicitly offered the user the eyeball-in-dev path at the end of the session but they went straight to `/save`. Assume visual regression risk on production until the L6/L7/L8 copy is reviewed live. **Outstanding follow-ups after this commit:** (a) browser review of L5–L8 on production, (b) decide whether to record any of L10/L11/L12 media or leave text-only, (c) flip guide `status` to published once satisfied, (d) Clarity readback 14 days after Claude Design guide starts getting traffic, (e) potentially re-compress `extraction-flow.webp` from 1.69MB to <1.5MB if LCP regresses on the L7 page. **Total media added this session:** 7 webp files, ~5.5MB on disk, all under CLAUDE.md Perf #6 targets except L7's extraction flow which is 13% over the 1.5MB target but within reason for an 848-frame full-process clip.

### Session 2026-04-20 19:27 (MacBook)
- **Pattern:** Conversational UI guide — Clarity Score 58 → engagement fix
- **Status:** ✅ Completed (commit + push pending)
- **Files Changed:** 2
- **Tests Added/Modified:** 0
- **Notes:** Acted on a Clarity URL-performance CSV (`Clarity_aiux_URL performance_04-20-2026 06 50 PM.csv`, 2-day window 2026-04-19→20) that flagged all 11 `/guides/conversational-ui-guide/*` URLs at Clarity Score **58** and `/patterns/conversational-ui` at **65.4**, while every other route scored 86–91. **Key diagnostic**: the 11 lesson URLs shared identical metrics to 3 decimal places (LCP 645.764ms, INP 176ms, CLS 0) — all CWV green. The low score is driven by Clarity's UX-quality signals (quick-backs, dead clicks, rage clicks, JS errors), not by performance. This reframed the whole plan — the original hypothesis of "add images + flesh out content depth" got invalidated by a benchmark audit of the Claude Code guide: 23 lessons, **1 image total, zero interactive previews**, succeeds because each lesson intro is 27–39 words answering the slug's implied question directly ("Claude Code needs an API key to connect to the Claude AI service…"). Conversational UI guide's 11 intros were all essay-style warm-ups ("Before building X, you need to understand…", "Now let's build", "You now have all the pieces", "The next frontier is…") that miss the search/LLM-citation intent. **Real lever**: intent-matching first paragraph. Fixed in two surgical passes. **(1) `src/data/guides.ts` — rewrote all 11 conversational UI lesson intros** at the `{ type: 'intro', content: '...' }` blocks (lines ~5639, 5776, 5863, 5944, 6025, 6120, 6238, 6369, 6462, 6557, 6725). Each new intro is 37–42 words, answers the slug's question in sentence one, optionally adds a contrast or stat in sentence two, and tees up what the body delivers — never opens with "Before…" / "Now…" / "This lesson covers…". Examples: L1 ("what-is-conversational-ui-and-what-it-isnt") now opens *"A conversational UI is any interface where users shape outcomes through natural-language turns…"* (was *"Before building a conversational interface, you need to understand the landscape…"*). L6 ("managing-conversation-context") leads with specific numbers — *"Every AI model has a context window — GPT-4 holds ~128K tokens, Claude ~200K — but the design work is deciding what to keep, summarize, or drop without users noticing."* L11 ("agentic-conversational-ui…") cut the abstract "next frontier" framing for concrete stakes — *"An agentic chat doesn't just answer — it sends emails, runs code, or modifies files on the user's behalf."* **(2) `src/components/guides/ConversationalUIBot.tsx` — removed the rage-click trigger from the bot embedded on `/patterns/conversational-ui`** (via `CodeExampleBlock` case `'conversational-ui-guided'`, line 554). Prior behavior: users typed free-form questions (expecting a real AI since the input placeholder said "Ask about building a chat UI…"), got a generic "I'm a guided chatbot, so I work best with the suggested prompts" fallback → rage click / quick back. Fix: updated welcome message to say *"scripted demo of the conversational UI patterns you're here to read about… (no real model)"*, changed input placeholder from `"Ask about building a chat UI..."` → `"Type or pick a topic below (scripted demo)"` to set expectation pre-click, rewrote the fallback response to acknowledge the off-script question + route users to `/audit` (which does hit Claude) + link to the full guide. Adds 2 contextual links to fallback so it's not a dead end. **Ruled out during audit** (Task 1 of plan): shared components (`OnThisPage.tsx`, `GuideSidebar.tsx`, `src/components/ui/LessonRenderer.tsx`) are clean — real `<Link>`/`<a>` everywhere, no hydration risks (no date/time or `window`-gated rendering in shared guide tree), `CopyButton` has `document.execCommand('copy')` fallback, `CodePreviewBlock` tab toggles work. The `image`-type LessonRenderer fallback at lines 666–674 renders a dashed "Image coming soon" placeholder that would be a dead-click magnet if any conversational UI lesson had a `src`-less `image` section — but grep confirmed **zero image sections** exist in lines 5599–7176, so no risk. Prior Explore agent claim of "2 stub lessons" was wrong — awk-counted all 11 lessons have 10–37 sections each, 81–459 lines (L11 is the longest at 459 lines / 37 sections). `ConversationalUIBot` only loads on the pattern page (via dynamic import in `CodeExampleBlock.tsx` line 71–74), confirming why the pattern page scores differently (65.4) than the guide pages (58) — they share no unique components beyond sitewide layout. **Verification**: `npx tsc --noEmit` clean on both modified files (pre-existing 85 errors elsewhere in repo unrelated to this change). `npm run test:patterns` — 5/6 passing, the 1 failing test (`all pattern thumbnails should exist`) is pre-existing on master (verified via `git stash` round-trip), unrelated to this change, and concerns `predictive-anticipation`, `progressive-enhancement`, `privacy-first-design`, `selective-memory`, `session-degradation-prevention` thumbnails. Did NOT run `npm run build` per `feedback_dont_build_during_dev.md`. Dev-server smoke test and human-click dead-click verification left to deploy. **Scope not touched**: Step 4's "add 1 image per lesson" deliberately deferred to optional Step 7 — the Claude Code benchmark (1 image total across 23 lessons, scores well) suggests images aren't the lever, so deferred until the 7-day Clarity recheck proves or disproves that theory. Guide monolith split (`src/data/guides.ts` is 7,176 lines shipping all 5 guides on every lesson page) left out — HTML payload isn't the flagged issue, CWV green confirms it. **Success metric for 2026-04-27 recheck**: pull the same URL performance CSV; target 58 → 80+ across the 11 guide URLs + 65.4 → 80+ on the pattern page. If still red, the next lever is images (Step 7) followed by a deeper Clarity drill-down into the specific UX-quality signals (heatmaps, session recordings) to find the exact dead-click zones. **Plan file**: `/Users/imranmohammed/.claude/plans/twinkly-crafting-zephyr.md` (reviewed approach twice as new evidence came in — first the CSV CWV-green reveal, then the Claude Code benchmark flipping the image hypothesis — plan edited in-place each time). **User-flagged item for future sessions**: the Clarity Score's 2-decimal-place duplication across URLs likely reflects small sample sizes over a 2-day window; revisit with a 14-day or 30-day Clarity window next time to get real per-URL signal.

### Session 2026-04-17 21:53 (MacBook)
- **Pattern:** Homepage audit CTA visual upgrade + gist.design dogfood experiment
- **Status:** ✅ Completed
- **Files Changed:** 1
- **Tests Added/Modified:** 0
- **Notes:** Two-part session. **(1) Homepage audit CTA visual upgrade.** Recent Clarity data showed only 4/1,390 completions and a 0.65% CTR on the tiny "Try the free AI UX audit →" text link sitting between the newsletter hero and the pattern grid on `/`. Replaced `src/components/audit/HeroAuditCTA.tsx` with a full-width (max-w-7xl parent), single-line, entirely-clickable bordered card: animated icon tile on the left (inline SVG of a schematic UI with three content lines + a glowing accent-colored scan bar sweeping top↔bottom on a 2.5s `ease-in-out` keyframe loop, `motion-safe:` gated so reduced-motion users see a still icon, plus a small `animate-pulse` dot in the corner), title + one-line tagline in the middle, arrow on the right that nudges `translate-x-0.5` on group-hover. All colors via existing design tokens (`bg-surface-primary`, `border-border-primary`, `text-accent-primary`, etc.) — no hardcoded hex, dark mode automatic. Preserved the existing `trackAuditEvent('audit_hero_cta_clicked', { source: 'homepage_below_intro' })` event name so Clarity before/after comparison stays clean. Kept the card as a secondary CTA (not a card that "sits in the air" per user direction — single horizontal strip matching the width of the pattern grid below). No new imports → zero bundle impact, which matters for homepage per CLAUDE.md Perf Issue #8 (framer-motion inflates critical path). Went CSS-only intentionally for that reason. Net 67 insertions / 15 deletions, single file. **(2) gist.design dogfood experiment — outcome: kill the 36-file plan.** GitHub issue #25 (P3, open) proposed generating 36 `.gist.design` files, one per pattern, to dogfood gist.design on aiuxdesign.guide. Ran two cheap experiments to decide before investing effort. **Test A (product level)** — 6 positioning questions about aiuxdesign.guide asked cold in ChatGPT + Claude, then again with `public/aiuxdesign.gist.design` (the one existing file, created 2026-03-30) pasted in as context. Cold answers were already substantively correct across both tools on pattern count (36), interactive-demo framing, free/no-signup, competitor differentiation. File-loaded answers added color (e.g., Claude mentioned the "28→36 via 8 agentic patterns added Feb 2026" history, rate limit details) but flipped 0 wrong cold answers to right. **Test B (pattern level, the decisive one)** — unambiguous query "I'm building an AI writing assistant, users want to review AI edits before they're applied, what pattern + UI + cite sources" asked cold in ChatGPT + Claude. Neither cited aiuxdesign.guide. ChatGPT cited LinkedIn + uxstudioteam.com + arXiv. Claude cited Microsoft HAX Toolkit Guideline 9 + Amershi et al. CHI 2019 + VS Code docs + Tiptap + Hygraph + Orwellix + Notion AI. Both produced substantively correct, well-sourced answers — aiuxdesign.guide simply doesn't win retrieval against first-party tool docs + HCI research for pattern-level queries. **Conclusion:** bottleneck is retrieval authority, not content format. A `.gist.design` file the LLM never fetches adds zero value. Per-pattern files would be a detour. Saved `project_aiex_gist_design_experiment.md` to `~/.claude/projects/-Users-imranmohammed/memory/` and linked it from MEMORY.md active follow-ups. **Side artifact:** benchmarked the current `/patterns/human-in-the-loop` page against Claude's cold answer from Test B — structure is present (Problem/Solution/Examples/Guidelines/Considerations/Demo/Related/Guides) but substance is thin: "Real-World Examples" section has the header but only 3 generic products named inline (Grammarly, "content moderation tools", "medical AI") vs. Claude's 6 specific products with links (VS Code, Tiptap, Hygraph, Orwellix, Notion AI, Word Track Changes). Zero research citations vs. Claude's HAX Guideline 9 + Amershi CHI 2019. Doesn't split edit-review (diff/accept-reject) vs. generate-and-insert (Notion AI Replace/Insert) — Claude noted this as worth two entries. Demo is content moderation, narrower than most-searched intent. Proposed A/B: improve HITL + 2 other high-traffic patterns to Claude's benchmark depth (~2–3 hrs each), wait 30 days, check GSC impressions + whether LLMs start citing. If yes, replicate across rest of 36. If no, moat is elsewhere (backlinks, original research) and per-pattern files would have been a detour anyway. **Issue #25 to be closed/parked with rationale** (not closed in this session — left as explicit user action). **Verification:** dev server ran cleanly on port 3000, HMR picked up the component change without errors. Did not run `npm run build` per feedback memory `feedback_dont_build_during_dev.md`. TypeScript check against the modified file only (not full repo) via `tsc --noEmit` filter — clean on HeroAuditCTA.tsx. No other files touched this session. Open items for next pickup: close/park issue #25, start HITL page depth improvements against Claude's answer as the benchmark (fill Real-World Examples with 6 named products + screenshots, add Research & References block with HAX Guideline 9 and Amershi 2019 links, add "Two contexts" callout splitting edit-review from generate-and-insert, consider broadening or swapping the demo).

### Session 2026-04-17 16:27 (MacBook)
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
| **Vercel 60s function timeout** | Mar 2026 | Vercel Hobby max function duration is 60s (set in `vercel.json`). Newsletter generation must complete within this. If timeouts recur: (1) check Claude model is Haiku not Sonnet, (2) check RSS timeout is 3s not 5s, (3) consider reducing RSS_SOURCES count. |
| **Newsletter skewed dev-focused; Vercel kept appearing 2-3x per issue** | Apr 2026 | Pool was 19/20 dev/AI sources with only Figma as design publication; flat `+30` AI_PRODUCT_SOURCES baseline gave Vercel and Figma equal priority; Claude's `max 2 per company` rule was bypassed because it operates on its generated `product` field (Vercel customer cases get attributed to "Zo Computer", "GitBook" etc.). **Fix (Apr 20):** added 7 design publications (NN/g, Smashing, UX Collective, A List Apart, UX Planet, TLDR Design, Lenny's Newsletter) + 1 curator (Latent Space); replaced flat baseline with `SOURCE_TIER_BASELINE` map (design-pub +50 → tech-news +0); added conditional infra-keyword penalty (-15 if no design keyword); pre-Claude `MAX_ITEMS_PER_SOURCE = 2` cap on the pool before Claude sees it; `isDesignNativeItem()` runs at publish time and flags `qa.designLightWarning` on `structuredData` for the admin reviewer. Tightened all 3 prompts (daily, weekly, weekly-compilation) to explicitly target designers and drop strained takeaways. **Sources tried but dropped:** Framer (no public RSS at any standard path — `/blog/rss.xml`, `/blog/feed/`, `/blog/atom.xml` all 404), all 4 candidate Reddit subreddits (r/UXDesign, r/userexperience, r/web_design, r/Figma all return 403 from rss-parser even with descriptive UA — Reddit gates on IP reputation, not just UA). Revisit Reddit via an aggregator (Feedly bridge, RSS.app, or static-feed GitHub Action) if community voice is still missing after a few issues. |
| **Regenerating today's weekly with new logic when daily items are stale** | Apr 2026 | Weekly normally compiles from the past 7 daily newsletters (`getDailyNewsletterItems(7)`). After source/scoring changes, those daily items still reflect the old pipeline. Use `?forceRSS=true` on a weekly run to bypass the compilation path and pull a fresh RSS pool through the new tiered scoring. Combine with `?force=true` to delete an existing draft for today: `curl -H "Authorization: Bearer $CRON_SECRET" "https://www.aiuxdesign.guide/api/cron/generate-newsletter?type=weekly&force=true&forceRSS=true"`. |

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

### SEO Troubleshooting

Recurring failure modes from past SEO review sessions. Consult this before forming hypotheses.

| Issue | Date | Solution |
|-------|------|----------|
| **"No SEO improvements" framing conflates 4 different metrics** | Apr 2026 | "Improvements" can mean: (a) indexed page count, (b) impressions, (c) clicks, (d) average position. The diagnostic path differs for each. Always ask which one the user means. Apr 22 investigation found impressions +35% / clicks +4% over 28d — the "no improvement" read came from watching clicks only, missing that the real problem was a CTR-collapse downstream of successful ranking growth. |
| **Direction-of-change tax on GSC comparison exports** | Apr 2026 | Comparison CSVs order columns as `Last N days Clicks, Previous N days Clicks, ...` — recent-first, older-second. Counterintuitive. `analyze.js` in `.claude/skills/seo-review/` normalizes this to chronological `prev → last` output. When reading raw CSVs by hand, verify column meaning from the header before reasoning about deltas. Apr 22: misread direction on the (1) export, concluded "no growth"; re-checking on the (2) export with clear headers flipped the entire narrative. |
| **CTR appears to drop when impressions grow faster than clicks** | Apr 2026 | When page-2 URLs get promoted to pos 18-22 (e.g., from 28 → 18 on conversational-ui), they add impressions at naturally-lower CTR positions, dragging aggregate CTR down even if per-page CTR is fine. A dropping aggregate CTR isn't a red flag on its own — check per-page to see if specific pages genuinely under-convert their ranking. |
| **Page-1 rankings with <1% CTR are the real leak** | Apr 2026 | Positions 1-10 should have 2-30% CTR depending on rank. If a page sits at pos 5-7 with 0.1-0.5% CTR across 1000+ impressions, the title/description isn't winning against competitors in SERP. Rewrite meta. The Apr 22 skill flagged 13 such pages; manual review caught only 6. Use the skill first. |
| **"Discovered - not indexed" isn't always a bug** | Apr 2026 | Google holds ~30-50% of discovered URLs out of the index for low-authority sites — not a technical problem, a priority signal. 77 such URLs per Apr 16 coverage. Fixing on-page SEO won't move these; backlinks, internal linking, and content quality improvements do. Stop shipping new content until this number decreases. |
| **Intent mismatch on high-impression queries** | Apr 2026 | "privacy first ai" at pos 22 (330 imp, 0 clicks) vs. our "Privacy-First AI Design — Data Protection & User Consent" title. Users searching "privacy first ai" want product recommendations (ProtonAI, DuckDuckGo's AI) or a checklist, not a design-pattern taxonomy. Match query intent, not keyword presence. |
| **CWV field data is a ranking signal on a 28-day lag** | Apr 2026 | Google uses rolling 28-day p75 field Core Web Vitals. After fixing perf regressions (e.g., the Apr 22 `/news` ISR + audit-kit framer-motion + lazy chat-previews fixes), expect ranking signal recovery in 2-3 weeks, not immediately. |
| **Guide lesson queries have tiny search volume** | Apr 2026 | "Claude for designers course" = 62 imp/month. "Claude code for designers course" = 36 imp/month. Even winning these queries cleanly generates <100 clicks/month per guide. Demand ceiling is a distribution problem, not an SEO problem. Stop optimizing meta on guide index pages; ship the lessons and let individual long-tail queries carry them. |

**SEO Troubleshooting Checklist**

When GSC performance "isn't improving":

1. **Run the skill first**: `node .claude/skills/seo-review/analyze.js <folder>` against a GSC comparison export (not a plain single-period export). The skill catches patterns humans miss.

2. **Classify the problem**: indexation (Coverage report) vs. ranking (avg position) vs. CTR (imp/clicks ratio per page) vs. demand (low query volume). Each has a different playbook.

3. **Cross-check CWV**: a page with a ranking regression may be caught in the 28-day CWV window from a perf issue. Check `gh issue list --label performance --state open` to see if the page is in the LHCI breach list.

4. **Check timelines honestly**:
   - Sitemap → crawl: 1-7 days
   - First crawl → indexation: 7-30 days (often longer for thin pages)
   - Indexation → stable ranking: 4-12 weeks of ranking jiggle
   - Content refresh → re-ranking: 2-8 weeks
   - Meta rewrite → visible CTR delta: 14-21 days

5. **If stuck on "discovered not indexed"**: the fix is authority signals (backlinks, internal linking from high-authority pages, original cite-able research) and content quality, not more URLs.

**SEO Monitoring Setup**

- **GSC Performance export (manual, weekly or biweekly)** — Set to comparison mode (toggle "Compare" → "Previous period") before exporting. Drop the folder path to Claude and invoke `/seo-review` or just mention "check GSC".
- **GSC Coverage report (monthly)** — Check indexed page count, "discovered not indexed" bucket, "crawled not indexed" bucket. Manual review in GSC UI.
- **LHCI nightly + Clarity field data** — Automated. See Performance & Web Vitals section above.

**Claude Code skill for SEO work**: this repo has `.claude/skills/seo-review/` which standardizes the GSC comparison CSV diff analysis. Script at `analyze.js`, entrypoint at `SKILL.md`. Auto-triggers on SEO-review phrases. Pairs with Addy Osmani's generic `seo` skill (installed in `~/.claude/skills/` with the other web-quality skills) for keyword research and on-page SEO best practices.

### Adding New Issues

When you encounter a problem, document it here with:
1. **What failed** - Clear description of the issue
2. **Date** - When it was discovered
3. **Solution** - How it was fixed
4. **Category** - Add to appropriate section above
