import { Pattern } from '../../../../types';
import { examples } from './examples';
import { guidelines } from './guidelines';
import { considerations } from './considerations';
import { codeExamples } from './code-examples';
import { figmaPrompt } from './figma-prompt';

export const intelligentcaching: Pattern = {
  id: "intelligent-caching",
  title: "Intelligent Caching",
  slug: "intelligent-caching",
  status: 'implemented',
  description: "Pre-fetch and cache AI content for instant results, reducing latency.",
  category: "Performance & Efficiency",
  tags: ["caching", "performance", "pre-fetching", "optimization", "speed", "latency"],
  thumbnail: "/images/examples/githubcopilotautocomplete.gif",
  introduction: "Intelligent Caching reduces latency by predicting and storing frequently accessed AI content for instant results. Instead of recomputing common queries, the system caches responses and pre-fetches likely requests. It's critical for high-traffic applications where speed impacts experience. Examples include GitHub Copilot caching code patterns, search engines storing popular results, or Netflix pre-loading recommendations.",
  datePublished: "2024-11-03",
  dateModified: "2026-06-23",
  hideFAQ: true,
  content: {
    problem: "AI systems often require significant computational resources and time to generate responses. Users experience frustrating delays, especially for common or repeated queries that don't need to be recomputed.",
    solution: "Implement intelligent caching strategies that predict and store frequently accessed AI-generated content, with smart invalidation based on content freshness requirements. Pre-fetch likely requests and serve cached results instantly while updating stale content in the background.",
    examples,
    guidelines,
    considerations,
    relatedPatterns: [
      "Predictive Anticipation",
      "Progressive Enhancement",
      "Adaptive Interfaces"
    ],
    codeExamples,
    figmaPrompt,
    judgmentCall: {
      explainWhen: [
        "The query is genuinely repeatable and the underlying truth changes slowly: documentation answers, code explanations, embeddings, summaries of static content. The cheapest correct answer is one you already computed.",
        "You can name the event that makes a cached answer wrong (a source edit, a price change, a new upload) and invalidate on that event, not just on a clock.",
        "Latency or cost is the real bottleneck and a slightly older answer is still a correct answer for the question being asked."
      ],
      dontWhen: [
        "Freshness is the product. Live prices, inventory counts, breaking news, and 'as of right now' answers cannot be served from a cache without a visible timestamp, and often not even then.",
        "You can't detect the invalidating event. A TTL is a guess that the world hasn't changed yet; if you have no signal for when it has, you will serve wrong answers for the full window and never know.",
        "The cache key isn't scoped to who's asking. Caching a personalized or permission-gated answer and replaying it to the next user is a data leak wearing a performance badge."
      ],
      trap: "Phantom freshness: a cached answer served with no age, no timestamp, and full confidence, so it reads as if it were computed just now. The danger isn't that it's old, stale caches are often minutes young. It's that the staleness is invisible. The user acts on yesterday's price, last week's policy, or a since-deleted fact believing it's current, and a system that returns 'I don't know' would have been safer than one that confidently returns the past."
    },
    installPrompt: `You are implementing the Intelligent Caching design pattern in this codebase.

The pattern in one line: reuse AI results to cut latency and cost, but never let a stale answer pass itself off as a fresh one.

Apply the following moves wherever this codebase computes an AI result that gets reused (model responses, embeddings, summaries, recommendations, search results). DO NOT cache surfaces where freshness is the product (live prices, inventory, breaking data) or where you cannot detect the event that invalidates an entry. Speed there buys wrong answers.

1. Decide what invalidates each entry before you cache it.
   For every cacheable result, name the concrete event that makes it wrong (source edited, price changed, new upload, permission revoked). Wire invalidation to that event. A TTL is a fallback for "we couldn't detect the change," not the primary strategy. If you can't name any invalidating event, flag the surface and do not cache it.

2. Scope the cache key to who's asking.
   Any result that depends on user identity, permissions, or private context must include that in the key. Audit existing keys for personalized or permission-gated responses that key only on the query. A replayed personalized answer is a data leak, not a cache hit.

3. Surface the age, don't hide it.
   When a result comes from cache and its freshness could matter, render the age or a timestamp ("Cached 2 min ago", "as of 9:41"). The user must be able to tell a remembered answer from a recomputed one. Never present a cache hit as if it were freshly generated.

4. Refresh stale-but-usable in the background.
   For entries past their freshness window but not yet wrong enough to withhold, serve the cached value immediately and recompute behind it (stale-while-revalidate). Mark it stale in the UI while the refresh is in flight.

The trap to avoid: phantom freshness. A cached answer with no age and full confidence reads as current even when it isn't. If freshness could change the user's decision, show the age or recompute. Confident silence about staleness is the failure.

When you're done, output a Markdown report with three sections:
- Surfaces updated: file path + which moves you applied (invalidation event, key scoping, age display, background refresh)
- Surfaces flagged but not updated: file path + why (freshness is the product, no detectable invalidating event, can't safely key)
- New things you added (invalidation hooks, cache-key fields, freshness indicators, stale-while-revalidate paths) and what still needs human sign-off

Ask before adding dependencies.`,
    takeaways: [
      {
        heading: "A correct cache miss beats a confident cache hit.",
        body: "The point of caching is speed, but speed that returns the wrong answer isn't a win, it's a faster way to be wrong. When freshness is in doubt, recomputing or saying 'I don't know' is the safe move. Optimize hit rate second, correctness first."
      },
      {
        heading: "Invalidate on the event, not on a clock.",
        body: "A TTL is a bet that nothing has changed yet, and you lose that bet silently for the entire window. Wire invalidation to the thing that actually makes the answer wrong: the source edit, the price change, the new upload. Use a TTL only as the backstop for changes you can't detect."
      },
      {
        heading: "Show the age. Let the user tell memory from now.",
        body: "The dangerous cache hit is the invisible one. If freshness could change a decision, render the age or a timestamp so a remembered answer never masquerades as a recomputed one. A small 'cached 2 min ago' is the difference between trust and a confident lie."
      },
      {
        heading: "The cache key is a security boundary.",
        body: "If a result depends on who's asking, the key must too. Caching a personalized or permission-gated answer on the query alone, then replaying it to the next person, is a data leak dressed as a performance optimization. Audit your keys before you audit your hit rate."
      },
      {
        heading: "Serve stale, refresh behind it.",
        body: "When an answer is past its freshness window but not yet wrong, you don't have to choose between slow and stale. Return the cached value instantly, recompute in the background, and mark it stale while you do. The user gets speed now and truth a moment later, and never mistakes one for the other."
      }
    ]
  }
};
