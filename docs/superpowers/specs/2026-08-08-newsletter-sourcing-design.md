# Newsletter sourcing: measure before widening

**Date:** 2026-08-08
**Status:** design approved, not yet implemented
**Trigger:** general hunch (no observed failure) that the daily newsletter may not be sourcing from good enough sources, and that a daily agent-based sourcing step might find better articles.

## Problem

The daily newsletter draws from a fixed list of 56 RSS feeds. The question is whether that list produces good stories for readers, and whether an agent that searches the open web each day would do better.

There is no observed failure driving this. That matters: it means the work should start by establishing whether a problem exists, not by building a solution to a suspected one.

## Evidence gathered

Measured against the properly attributed window (2026-07-23 to 2026-08-08, when per-item `sourceName`/`sourceTier` injection began), covering 12 published issues and 52 stories:

| Tier | Share |
|---|---|
| design-pub | 31% |
| tech-news | 21% |
| ai-lab | 21% |
| design-tool | 12% |
| designer-voice | 8% |
| curator | 4% |
| dev-platform | 4% |

22 distinct sources across 52 stories, so selection is not collapsing onto a few feeds. Top sources: TLDR Design (10), The Verge (7), OpenAI (4), Claude AI (4), TechCrunch (3), NN/g (3).

Three structural findings:

1. **TLDR Design supplies 19% of published stories.** It is another newsletter, so roughly one story in five is relayed from someone else's curation rather than sourced directly.

2. **10 of the 56 "sources" are Google News search feeds, not first-party publishers**: Claude AI, Cursor, Perplexity, Notion, Linear, Windsurf, Arc, Loom, Mobbin, Raycast. Every item from these arrives as a `news.google.com` redirect that must be resolved before use, and unresolved items are dropped. These 10 include most of the `ai-lab` and `design-tool` names, which are the tiers the product-news floor counts.

3. **The pool is not supply constrained.** Pools run 38 to 51 items and 4 are published, so 8 to 10% is used. Adding supply to a pool being sampled this lightly only helps if the top of that pool is weak. Nothing measured so far establishes that.

## Non-goals

- No change to how stories are selected from the pool. This spec is about supply, not selection.
- No dashboard, scheduled job, or automation in Section A. One script, run by hand.
- No change to the product-news floor or the admin QA strip. Both were settled earlier on 2026-08-08.

## Section A: click attribution

**Purpose:** replace the hunch with evidence about which sources readers actually engage with.

**Inputs**

- A CSV of per-link click counts exported by hand from the Beehiiv dashboard. Beehiiv's free tier has no Posts API, so this cannot be automated.
- The URLs already stored on every draft at `structuredData.items[].sourceUrl`, together with the `sourceName` and `sourceTier` injected alongside them.

**Mechanism**

A standalone script under `scripts/analysis/`. It normalises URLs on both sides before joining: lowercase host, strip a leading `www.`, drop `utm_*` and other tracking params, drop trailing slashes. Rows that fail to join are reported with a count and a sample, never silently discarded, because a high failure rate would itself invalidate the output.

**Output**

A ranked table of clicks by source and by tier, plus clicks per appearance so a source with 10 appearances is not compared unfairly against one with 2.

**Interpretation limits, stated in the output itself**

At 285 subscribers, a single story draws roughly 1 to 3 clicks. Per-story numbers are noise. Aggregated across the published history and grouped by source, the ranking is directional. The script must not present per-story figures as meaningful.

**Attribution coverage caveat**

Only items published from 2026-07-23 onward carry `sourceName`. Earlier items fall back to `product`, which is Claude's label for the story's subject rather than its publisher, and is not a valid source key. The script must therefore either restrict itself to items carrying `sourceName`, or label pre-07-23 rows as unattributed. It must not mix the two.

## Section B: widen the source list

**Purpose:** open up the closed feed universe where cheaply possible.

**Additions, verified live against `rss-parser` on 2026-08-08**

| Feed | URL | 14d | Tier | Rationale |
|---|---|---|---|---|
| Apple Newsroom | `https://www.apple.com/newsroom/rss-feed.rss` | 3 | `ai-lab` | Closes the gap that forced the iOS 27 story to arrive via TLDR Design. `ai-lab` is chosen deliberately so Apple launches count toward the product-news floor, which is the reason for adding it. The feed also carries retail and finance news; the existing relevance threshold is expected to filter that, and this should be checked after a week rather than assumed. |
| Simon Willison | `https://simonwillison.net/atom/everything/` | 30 | `designer-voice` | High-signal AI tooling coverage from a named practitioner. |
| Interconnects | `https://www.interconnects.ai/feed` | 2 | `curator` | Substantive AI analysis, closest in kind to Latent Space. |

**Mechanical requirements**

- Simon Willison publishes near daily. He needs a per-source cap of 1 via `MAX_ITEMS_PER_SOURCE_BY_TIER`, or he will flood the pool. This is the same failure the Jakob Nielsen rotation fix addressed.
- Interconnects is Substack on a custom domain, so the `/p/` ghosthost rule in `isOpinionUrl` would normally block it. Adding it to `RSS_SOURCES` exempts it automatically through `SUBSCRIBED_FEED_HOSTS`, so no separate allowlisting is needed. Verify this rather than assume it.
- **Two of the three additions land in voice tiers, which caps their real effect.** `designer-voice` and `curator` are both in `VOICE_TIERS`, so Simon Willison and Interconnects are subject to the 7-day voice rotation and to the prompt guidance allowing at most one practitioner voice per issue. They enlarge the pool but compete for a single slot, so they will rarely both appear. Only Apple Newsroom adds unconstrained supply. This shrinks Section B's expected effect further than the feed count suggests.

**Verified dead, do not retry without new evidence:** Adobe Blog (404), Google Design (404), Airbnb Design (404, and Medium hosted so it would be opinion-blocked anyway), Spotify Design (not valid RSS), Miro (404), Canva Newsroom (404), Every (malformed XML), Anthropic (404, confirming the existing note that its news page must be scraped).

**Also in scope:** confirm the Google News resolution cut shipped earlier on 2026-08-08 (`budgetMs` 12000 to 6000, `maxResolve` 12 to 8) has not starved the 10 search-feed sources. Those sources produce only redirect links, and unresolved links are dropped, so the cut lands disproportionately on them. Check the next few runs for whether `ai-lab` and `design-tool` items still reach the pool at prior rates. If they have thinned, raise those two values back before anything else.

### Expected effect is small

The original expectation was 8 to 10 viable additions. Three were found. Most company design blogs either publish no feed or are Medium hosted, and Medium is treated as an opinion domain. Section B therefore cannot meaningfully open up the closed universe.

## Deferred: daily agent sourcing

Not in scope for this spec, but the reasoning is recorded so it is not relitigated from scratch.

Because Section B has a low ceiling, a web-search step is the only lever with real headroom for coverage beyond the 56 feeds. The workable shape is a separate scheduled job on a runner with no time limit, for example GitHub Actions, that runs before the 03:10 UTC cron, sweeps the open web, and writes candidates to a table the cron merges into its pool.

**It must not run inside the cron.** The daily route measured 52.7s on 2026-08-08 against a hard 60s Vercel Hobby cap, and a full session was spent recovering 6s of headroom. There is no room for an agent step there.

**Gate for starting it:** Section A shows that stories from the current top of the pool underperform. If clicks show existing top-of-pool stories land well, the bottleneck is selection rather than supply, and more supply will not help.

## Risks

- **Beehiiv export shape is unverified.** The Section A design assumes the dashboard can produce per-link click counts in CSV form. If it cannot, Section A needs rework before any code is written. Confirm the export first.
- **Join rate may be too low to use.** Newsletter platforms commonly rewrite links for click tracking. If Beehiiv reports its own wrapped URLs rather than the destinations, normalisation will not be enough and the join needs a different key. Check a handful of rows by hand before building the full script.
- **285 subscribers is a small base.** Even aggregated, the ranking may not separate mid-table sources. The script should report appearance counts alongside clicks so weak evidence is visible rather than hidden.
