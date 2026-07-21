# Session Log (archive)

> Moved out of `CLAUDE.md` on 2026-06-05 so it stops loading into every session.
> This file is **not** auto-loaded. New sessions append a terse summary here via `.claude/scripts/update-memory.sh`.
> CLAUDE.md is now the lean, durable reference. Read this only when you need historical detail.

---

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

### Session 2026-07-21 16:46 (MacBook)
- **Pattern:** Newsletter title prompt — steer weekly titles toward SEO-searchable topics
- **Status:** ✅ Committed + pushed (deploys to prod; affects the next weekly newsletter generation)
- **Files Changed:** 1 (`src/app/api/cron/generate-newsletter/route.ts`)
- **Tests Added/Modified:** 0
- **Notes:** Pre-existing WIP committed on request as its own focused commit, separate from the guides work. Rewrites the title-generation instruction in both prompt variants (weekly + fallback): keep the "This Week in AIUX:" prefix, then 4–8 concrete searchable words (real pattern names / UX concepts / product categories a designer would type into search, most-searchable term front-loaded); explicitly bans abstract/poetic/alliterative titles ("Cumulative Drift", "Trust and Control") that read well but nobody searches. Same SEO-title intent as the guides pass.

### Session 2026-07-21 15:26 (MacBook)
- **Pattern:** Guides refresh — Claude Code + Claude Design accuracy, shared lesson-hierarchy redesign, em-dash/title sweep
- **Status:** ✅ Local + browser-verified (light + dark); NOT yet deployed
- **Files Changed:** 10 (pre-existing `generate-newsletter/route.ts` WIP left unstaged, out of this commit)
- **Tests Added/Modified:** 0 (verified via live browser screenshots + `tsc`)
- **Notes:** Triggered by GSC showing the two Claude course guides as top organic performers (`claude-code-learning-path` ~105 clicks / 7.7% CTR; `claude-design-learning-path`). **Accuracy pass, all ground-truthed** — Claude Design launched Apr 2026 (post-cutoff) so verified via web + the user's live screenshots. Claude Code guide: API-key onboarding → subscription-login-first (native installer; npm deprecated Jan 2026), retired "Claude 3.5 Sonnet" → model aliases (`sonnet`/`opus`/`haiku`), deprecated `create-react-app` → "ask Claude Code to scaffold Vite+Tailwind" (`npm run dev` / :5173), `/save` is NOT a real command → plain-English git, added a Handy-Commands tip. Claude Design guide: "powered by Opus 4.7" was WRONG — the user's screenshot showed a **Model selector** with the full lineup (Fable 5 / Opus 4.8 / Sonnet 5 / Haiku 4.5 / Sonnet 4.6), "research preview" → "Beta", added `/design-sync`, shared usage pool, export formats, Tweaks-toolbar location + Edit-mode; swapped 4 stale lesson images for current-UI stills (ffmpeg frame-extract from the user's gifs → `cwebp` 23–37KB). **Lesson-hierarchy redesign** on the shared `LessonRenderer.tsx` + both guide page templates (all courses inherit): "floating cards / no hierarchy" → over-corrected to "card soup" → settled on a **restraint** principle (calm content; only tables/callouts contained as soft outlines; sidebars/TOC framed by divider rules, not boxes; no shadows), migrated raw grays → semantic tokens, removed dead code; verified light + dark via a temporary `?v2` gate that was then promoted to default. **Em-dash sweep** per house rule: content + "What you'll learn" bullets (colon) + all page `<title>`s (pipe, `X | Y`) + guides-index body copy (commas). Follow-up left open: em-dashes in simulated chat-demo content (`ConversationalUIBot`, `chat-previews`).

### Session 2026-07-17 12:35 (MacBook)
- **Pattern:** New lead-magnet page — Accessibility Checklist for AI-Generated Designs (`/accessibility-checklist-for-ai-designs`)
- **Status:** ✅ Built + tested end-to-end locally (NOT yet deployed)
- **Files Changed:** 10
- **Tests Added/Modified:** 0 (verified via live browser flow + automated a11y assertions)
- **Notes:** Built a new email-capture download page modeled on `/agentic-ux-checklist`: same split layout (light left / navy right), 4-check preview with a soft blur-gate over the remaining 6, wired to `/api/newsletter/subscribe` with a new `accessibility-checklist` source (added to `NEWSLETTER_SOURCES` + `PDF_DOWNLOAD_SOURCES`). PDF delivered on-page (Option A: no transactional email; only Beehiiv's welcome fires on signup, consistent with every other lead magnet). **"Follow before you preach" a11y pass** since the page's own checklist demands AA: real `<label>` on the email input, `<main>` landmark, correct heading order (verified 1·h1 / no skipped levels via a live DOM assertion), contrast-fixed % chips (deepened `--severity-1` red → `#dc2626` and `--severity-4` indigo → `#4f46e5` so white chip text passes AA; navy text on the warm hues), removed a framer-motion entrance that was leaving cards stuck at opacity 0, honeypot. Added a 7-step `--severity-*` heat-scale token set. **Regenerated the PDF** via Playwright (Satoshi embedded) so its title matches the page headline, em-dashes removed, more breathing space. Added a newsletter **disclosure** to both this page and the agentic page (Option A honesty). Ran a real local end-to-end test (201 → Prisma insert → gate reveal → PDF download; Beehiiv disabled during the test, row deleted after). Also: OG slug config, ResourcesGrid card, brand-validator exemption for the always-dark lead-magnet panels, fixed 3 pre-existing `border-gray-200 dark:border-gray-700` violations in ResourcesGrid, and drafted an on-brand Beehiiv welcome-email HTML at `docs/emails/beehiiv-welcome-email.html` (to replace the plain default; paste-into-Beehiiv, not yet applied). **Beehiiv follow-up:** optionally add an `accessibility-checklist` welcome automation; otherwise the generic welcome fires.

### Session 2026-07-16 13:54 (MacBook)
- **Pattern:** Newsletter practitioner-voice unlock — fixed the `*.substack.com` opinion strip that silently killed the whole curated Substack roster + forced practitioner voices into daily selection
- **Status:** ✅ Code complete (working tree, NOT yet deployed); today's issue regenerated to `pending_review`
- **Files Changed:** 2 (`src/app/api/cron/generate-newsletter/route.ts`, `.claude/rules/newsletter-and-infra.md`)
- **Tests Added/Modified:** 0 (verified via a throwaway deterministic `isOpinionUrl` self-test route, 12 URL cases, + a `dumpPool` diagnostic — both reverted)
- **Notes:** Started from "why did today's daily have only 3 stories?" — traced the real methodology (72h pool → tiered scoring → Sonnet selection with product-news floor / diversity / opinion filter; 3 is a by-design honest-short-issue outcome). A `dumpPool` diagnostic (temporary reversible route branch reusing the real scoring fns) revealed the actual problem: `isOpinionUrl`'s blanket `host.endsWith('.substack.com')` was stripping **every** deliberately-subscribed practitioner Substack before scoring (Jakob Nielsen, Julie Zhuo, Emily Campbell, Design Systems Collective, +6 more) — same class as the Jul-4 Latent Space "structurally dead source" incident but far wider. The highest-scoring recent AI+design item (Nielsen "AI Agents Change Workflows", score 67) was dying upstream, NOT at Claude's audience clause. **Fix:** added `SUBSCRIBED_FEED_HOSTS` (derived from `RSS_SOURCES` so it never drifts) and wired `!SUBSCRIBED_FEED_HOSTS.has(host)` into BOTH the `.substack.com` branch AND the `/p/` ghosthost branch — the advisor caught that custom-domain subscribed Substacks (One Useful Thing, Proof of Concept) hit the second branch and would've stayed dead (the exact too-narrow miss that made the original Latent Space fix insufficient). Removed `*.substack.com` from the two prompt opinion lists. A **soft** "should include a practitioner voice" was IGNORED by Sonnet even with the score-67 Nielsen item present (classic prompt-only-rule-ignored); escalated to a forceful "MUST include one when a relevant one is available, even if you drop a 4th news item" → worked. Added two prod-safe env knobs (`NEWSLETTER_RSS_TIMEOUT_MS`, `NEWSLETTER_GEN_BUDGET_MS`) to escape Vercel's 60s cap on off-Vercel manual runs (mirror the existing `NEWSLETTER_CLAUDE_TIMEOUT_MS` pattern; unset in prod). Retired the two unsent drafts (07-15, 07-16) to `rejected` and regenerated today's issue locally against prod Neon — final `pending_review` issue leads with Figma Make / Spotify / Smashing and now features a **Jakob Nielsen agentic-UX** item (`opinionCount` still 0, proving the whole chain). **NOT deployed** — tomorrow's 3:10 UTC cron runs the OLD logic until this ships.

### Session 2026-07-15 (MacBook)
- **Pattern:** Newsletter source overhaul + paywall guard (feed-rot repair)
- **Files:** `src/app/api/cron/generate-newsletter/route.ts` (+67/-15), committed `ab0fbdb` → master → deployed
- **Notes:** Diagnosed thin newsletter days as feed rot + a dead source tier + a publish gap (Jul 13–15 drafts were generated but sat unpublished/quiet in `pending_review`, not missing — confirmed by reading the prod drafts API with `ADMIN_APPROVE_SECRET` as bearer). Fixed 3 dead feed URLs (Microsoft AI 410, Supabase 404, The Verge 404), removed the dead rss.app/X `designer-voice` tier, and added 26 durable RSS/Substack sources (47→58; designer-voice rebuilt 0→13) found via two multi-agent workflow sweeps and each verified live with rss-parser. Added `isPaywalled()` — drops truncated/gated feed items (body < 400 chars; Substack gates by truncation, not a marker string) so readers are never linked to a paywall. Local generation timed ~8s (well under the 60s Vercel cap). Deployed and prod force-regenerated today's Jul 15 draft from the new sources.
### Session 2026-07-08 12:25 (MacBook)
- **Pattern:** autonomy-spectrum migration + augmented-creation demo polish + agentic badge + live pattern count (migration now 33/38, all merged to master)
- **Status:** ✅ Complete — 4 focused PRs (#56–#59) squash-merged to master
- **Files Changed:** 6 (autonomy-spectrum/index.ts, augmented-creation/index.ts, AugmentedCreationDemo.tsx, pattern-grid.tsx, patterns/[slug]/client-page.tsx, patterns/page.tsx, sitemap.ts)
- **Tests Added/Modified:** 0
- **Notes:** Migrated **autonomy-spectrum** to the value-forward structure (trap = "autonomy creep": the level the user set vs. the freedom the agent takes drift apart; defaults-everyone-high + one-way ratchet that never de-escalates). Polished the **augmented-creation demo** across many rounds of user feedback: tokenized it, moved+de-emphasized session stats to a quiet footer, added a **Reset** control, fixed the tone slider (native range track was an invisible hairline → rebuilt as a custom slider with a visible filled bar + transparent range input underneath for keyboard/aria), swapped the container shadow for an accessible border, and removed the one-click "Continue Writing" (it embodied the ghostwriter trap). Added an **Agentic bot badge** on pattern cards (tiny bot glued to the last word via whitespace-nowrap so it never orphans on wrap), the detail header, and the filter — chose a bot over bolt/sparkles because every pattern is AI so the mark must say *autonomous agent* specifically. Fixed the **/patterns hero "36"→ live `{patterns.length}` (=38)** + made page metadata self-correcting. **Key SEO finding (via seo-review skill on GSC 3-mo comparison):** decided AGAINST prefixing the 8 agentic pattern titles with "Agent" — the pages rank page-1 on their plain concept names (trust-calibration 5,012 impr @ 6.6), and "agent X" queries have ~0 volume; renaming would risk rankings for zero upside. Solved the clarity concern with the badge instead. **Also important:** the audit tool's "36" is a SEPARATE curated 36-pattern detection list (detection-prompts.ts, excludes agentic patterns) — left at 36 on purpose; do NOT bulk-sweep audit "36"→"38". Sorted the accumulated commits into 4 clean per-concern branches off master and merged one-by-one. New standing rules saved to memory: demos need a Reset; demos must pass WCAG AA; never commit/push unless explicitly asked. Next migration: guided-learning (5 left).

### Session 2026-07-07 19:34 (MacBook)
- **Pattern:** augmented-creation migration + demo overhaul (pattern migration now 32/38)
- **Status:** ✅ Complete (5 commits on `pattern-new-structure-migration`, not yet PR'd)
- **Files Changed:** 2 (patterns/augmented-creation/index.ts, examples/AugmentedCreationDemo.tsx)
- **Tests Added/Modified:** 0
- **Notes:** Migrated augmented-creation to the value-forward structure (judgmentCall/takeaways/installPrompt/hideFAQ). Trap = "the ghostwriter" (tool crosses from suggesting in your voice to drafting in its own; you slide from author to approver and ship median-prose under your name). Then reworked the demo across several rounds of user feedback: (1) tokenized it fully (raw purple/blue/green/gray → accent-primary Apply, status-success/error tints, surface/text/border), light+dark verified; (2) moved Session Stats out of the right rail and gave the editor a richer 3-sentence starting draft to kill the empty-box look; (3) on feedback, moved stats below the Preview and de-emphasized to a quiet one-line footer (stats aren't the point); (4) added a **Reset** control (extract INITIAL_CONTENT const + resetDemo(), tokenized top-right button), verified end-to-end via Playwright. NEW STANDING RULE saved to memory: every interactive demo must have a Reset that restores initial state ([[feedback-demos-need-reset]]); most other demos still lack it, retrofit when touched. Left as optional low-priority polish: the one-click "Continue Writing" full-sentence append still leans toward the ghostwriter trap.

### Session 2026-07-04 12:29 (MacBook)
- **Pattern:** anti-manipulation-safeguards migration + demo rebuild (pattern migration now 31/38)
- **Status:** ✅ Complete (12 commits on `pattern-new-structure-migration`, not yet PR'd)
- **Files Changed:** 3 (patterns/anti-manipulation-safeguards/index.ts, examples/AntiManipulationSafeguardsDemo.tsx, ui/CodeExampleBlock.tsx)
- **Tests Added/Modified:** 0
- **Notes:** Resolved the long-held anti-manipulation coherence question by KEEPING the jailbreak/adversarial-intent framing (user manipulates the AI), NOT repurposing to dark patterns; trap = "the keyword blocklist" (block words not intent, the Adam Raine failure). Added the value-forward fields (judgmentCall/takeaways/installPrompt/hideFAQ). Then fully rebuilt the demo across ~10 iterations driven by user feedback: from an auto-playing 3-refusal chat (which rendered an empty white box from two NON-EXISTENT tokens `accent-info`/`accent-warning` under `text-white`) → a blocklist-vs-intent comparison → finally an **intent-only, reply-then-reasoning chat**: you send a request, the assistant replies (Refused/Helped), then "How it read your intent" unfolds as 3 numbered steps below (only step 3, whose account, differs across scenarios = the lesson). Hardened: guided/slow pacing with a visible "sending" beat, chat framing (You avatar + sent animation), Clarity dead-click safe (re-clicking active tab bumps runId; decorative bits `pointer-events-none`), widened to max-w-4xl (moved componentId out of the max-w-2xl bucket in CodeExampleBlock, needed one sanctioned `--no-verify` for pre-existing raw-color debt there), and WCAG AA fixes (text-text-tertiary → secondary; meaningful labels text-xs → text-sm). Flagged but NOT done: no global `prefers-reduced-motion`/`focus-visible` handling. Also this session: earlier non-code work (model/quota strategy on subscription, Beehiiv-is-source-of-truth for subscribers, newsletter lead-ordering watch until ~07-10).

### Session 2026-07-02 18:32 (MacBook)
- **Pattern:** Newsletter outage diagnosis + daily retry time-guard
- **Status:** ✅ Fix shipped (daily); weekly intentionally left on watchdog+manual-regen
- **Files Changed:** 2 (route.ts + newsletter-and-infra.md)
- **Tests Added/Modified:** 0
- **Notes:** **Diagnosed the 2026-06-29 (weekly) + 07-01 (daily) newsletter misses.** Root cause: generation runs in `after()` background under Vercel Hobby's **60s function cap**; heavy runs exceed it and are silently killed **before the DB insert** — no draft, no `sendFailureAlert` (the catch never runs), only a watchdog "accepted but nothing appeared" email + a healthchecks.io DOWN. **Measured locally: weekly ≈ 53s** (compilation path; up to 94s with fresh RSS), so it routinely crosses 60s; dailies mostly fit (~30s) but a day that fires the **selection retry** (2nd sequential Sonnet call) can also cross it (the 07-01 miss). **Live infra findings:** cron-job.org's request timeout is **HARD-CAPPED at 30s** (console-confirmed — so a *synchronous* handler is NOT viable on this trigger; briefly built it, then **reverted** cleanly); there is **no separate weekly cron** — the single daily cron (03:10 UTC / 8:40 AM IST) auto-generates the weekly on Mondays via `isMonday` (`route.ts:2118`), with the watchdog as backup trigger; a green "Successful (4.28s)" on cron-job.org means only that `after()` returned fast, **NOT** that generation completed. **Fix shipped:** time-budgeted the daily selection retry (`genStart`/`retryBudgetMs`, `route.ts` ~1908) — retry only if ≥15s of the 60s budget remains, cap its abort to the remainder (reserving ~8s for HTML+insert), else skip and fall through to the existing auto-quiet backstop (still writes a *visible* draft). **Weekly left as-is** (watchdog + manual regenerate); a GitHub Actions job runner (no time cap) is the real fix if weekly misses start costing something — decision deferred, watch 2-3 Mondays. **Docs:** added incident-log row to `newsletter-and-infra.md`; corrected the stale `feedback_cron_troubleshooting` memory (it claimed Vercel crons were primary + implied 60s settable — both now false).
### Session 2026-07-01 18:29 (MacBook)
- **Pattern:** Demo rebuilds (Layer 2) — ambient-intelligence + crisis-detection-escalation
- **Status:** ✅ Complete — Layer 2 done (5/5 flagged demos rebuilt & merged to master)
- **Files Changed:** 0 (all work committed & merged before /save ran; real diff is in commits b3ae112 + 4e26179)
- **Tests Added/Modified:** 0
- **Notes:** Rebuilt two demos to embody their traps (plain-language, dead-click-safe, tokenized `brand:check` 0, Playwright-verified 0→1→2→reset): **ambient-intelligence** ("surveillance hum" — acting on signals never offered, no trace — vs. ambient that shows its work with an inspectable log + undo + pause) and **crisis-detection-escalation** ("smoke alarm wired to nothing" — detection fires, banner, chat ends — vs. a system that stays present with a verified/open-now resource). Crisis handled with explicit sign-off: soft/non-graphic depiction, viewer never types crisis language (the old demo did). Shipped via two squash-merged PRs: **#45** (collaborative-ai + ambient-intelligence, `b3ae112`) and **#47** (crisis, `4e26179`). **#46 auto-closed** when #45's base branch was deleted on merge — recovered via `git rebase --onto origin/master 91425e8` to peel just the crisis commit onto master, then re-PR'd as #47. Cleaned up merged branches; worktree now on `demo-rebuilds-next` off master. **Parked:** `bemyeyes.svg` 404 on universal-access (pre-existing, out of scope) and the held `anti-manipulation-safeguards/index.ts` (stashed, awaiting coherence decision). **Remaining:** Layer 1 page-structure for 7 patterns (safe-exploration, session-degradation-prevention, guided-learning, plan-summary, augmented-creation, vulnerable-user-protection, autonomy-spectrum).

### Session 2026-06-25 (MacBook)
