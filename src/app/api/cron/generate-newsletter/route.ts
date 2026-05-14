import { NextRequest, NextResponse } from 'next/server';
import { after } from 'next/server';
import { revalidatePath } from 'next/cache';
import Anthropic from '@anthropic-ai/sdk';
import Parser from 'rss-parser';
import { prisma } from '@/lib/prisma';
import { Resend } from 'resend';
import { patterns } from '@/data/patterns';

// Initialize clients
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

// Base URL for absolute links in emails
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.aiuxdesign.guide';

// Descriptive User-Agent. Reddit's .rss endpoints throttle generic UAs from
// datacenter IPs; an identifying UA with contact info gets through reliably.
const FEED_USER_AGENT =
  'AIUX-Newsletter-Bot/1.0 (+https://www.aiuxdesign.guide; contact: misaif20@gmail.com)';

const parser = new Parser({
  timeout: 3000,
  headers: {
    'User-Agent': FEED_USER_AGENT,
  },
});

// Source tiers drive the relevance baseline (see SOURCE_TIER_BASELINE below).
// Adding a new tier? Update the baseline map AND the DESIGN_NATIVE_TIERS list.
type SourceTier =
  | 'design-pub'      // research / news / case studies (NN/g, Smashing, A List Apart, TLDR Design)
  | 'design-opinion'  // think-piece / opinion essays (UX Collective, UX Planet, Lenny's). Worth less per item — see prompt cap.
  | 'design-tool'     // companies whose product IS the designer's tool (Figma, Framer)
  | 'ai-lab'          // AI model/product companies (OpenAI, Anthropic, Google AI)
  | 'curator'         // synthesis/aggregator newsletters (Latent Space)
  | 'community'       // user-voice forums (Reddit subs)
  | 'dev-platform'    // infra/devtool companies (Vercel, GitHub, Supabase)
  | 'tech-news';      // generic tech news (The Verge, TechCrunch, etc.)

interface RssSource {
  name: string;
  url: string;
  color: string;
  tier: SourceTier;
}

// RSS feed sources. Source budget note: ~30 concurrent fetches at a 3s timeout
// fit well within the 25s Claude window via Promise.allSettled. Don't 5x this
// list without re-checking timing.
const RSS_SOURCES: RssSource[] = [
  // Design publications — research / news / case studies (URLs verified against
  // rss-parser locally Apr 20 2026). These get the +50 baseline because their
  // items are concrete and actionable.
  { name: 'Nielsen Norman Group', url: 'https://www.nngroup.com/feed/rss/', color: '#ffcc02', tier: 'design-pub' },
  { name: 'Smashing Magazine', url: 'https://www.smashingmagazine.com/feed/', color: '#d33a2c', tier: 'design-pub' },
  { name: 'A List Apart', url: 'https://alistapart.com/main/feed/', color: '#bf3f3f', tier: 'design-pub' },
  { name: 'TLDR Design', url: 'https://tldr.tech/api/rss/design', color: '#1a73e8', tier: 'design-pub' },

  // Design opinion — Medium-style think-pieces and strategy essays. Lower
  // baseline (+28) and capped to 1-2 per issue via the prompt: opinion is
  // valuable but should not crowd out concrete news.
  { name: 'UX Collective', url: 'https://uxdesign.cc/feed', color: '#000000', tier: 'design-opinion' },
  { name: 'UX Planet', url: 'https://uxplanet.org/feed', color: '#0066cc', tier: 'design-opinion' },
  { name: "Lenny's Newsletter", url: 'https://www.lennysnewsletter.com/feed', color: '#ff6900', tier: 'design-opinion' },

  // Design tools
  // NOTE: Framer has no public RSS feed at any of the standard paths
  // (verified Apr 20 2026: /blog/rss.xml, /blog/feed/, /blog/atom.xml all 404).
  // Revisit if they ship one or via an aggregator.
  { name: 'Figma', url: 'https://www.figma.com/blog/feed/atom.xml', color: '#f24e1e', tier: 'design-tool' },

  // AI labs (direct blogs)
  { name: 'OpenAI', url: 'https://openai.com/blog/rss.xml', color: '#10a37f', tier: 'ai-lab' },
  { name: 'Google AI', url: 'https://blog.google/technology/ai/rss/', color: '#4285f4', tier: 'ai-lab' },
  { name: 'Microsoft AI', url: 'https://blogs.microsoft.com/ai/feed/', color: '#00a4ef', tier: 'ai-lab' },

  // AI labs (Google News searches for AI products)
  { name: 'Cursor', url: 'https://news.google.com/rss/search?q=Cursor+AI+editor+OR+Cursor+code+editor&hl=en-US&gl=US&ceid=US:en', color: '#7c3aed', tier: 'ai-lab' },
  { name: 'Notion', url: 'https://news.google.com/rss/search?q=Notion+AI+OR+Notion+app+update&hl=en-US&gl=US&ceid=US:en', color: '#000000', tier: 'ai-lab' },
  { name: 'Linear', url: 'https://news.google.com/rss/search?q=Linear+app+OR+Linear+project+management&hl=en-US&gl=US&ceid=US:en', color: '#5e6ad2', tier: 'ai-lab' },
  { name: 'Perplexity', url: 'https://news.google.com/rss/search?q=Perplexity+AI&hl=en-US&gl=US&ceid=US:en', color: '#20808d', tier: 'ai-lab' },
  { name: 'Claude AI', url: 'https://news.google.com/rss/search?q=Claude+AI+OR+Anthropic+Claude&hl=en-US&gl=US&ceid=US:en', color: '#d97706', tier: 'ai-lab' },
  { name: 'Windsurf', url: 'https://news.google.com/rss/search?q=Windsurf+AI+editor+OR+Codeium+Windsurf&hl=en-US&gl=US&ceid=US:en', color: '#09b6a2', tier: 'ai-lab' },

  // Curators / aggregators (do the X-recap and AI-synthesis work for us)
  { name: 'Latent Space', url: 'https://www.latent.space/feed', color: '#7c3aed', tier: 'curator' },

  // NOTE: Reddit dropped Apr 20 2026. All 4 candidate subreddits
  // (r/UXDesign, r/userexperience, r/web_design, r/Figma) returned 403 from
  // rss-parser even with a descriptive User-Agent. Reddit's bot detection
  // gates on IP reputation as well as UA, and Vercel egress is datacenter.
  // Revisit via an aggregator (Feedly bridge, RSS.app, or a static-feed
  // GitHub Action) — file follow-up if community voice is still missing.

  // Dev platforms (kept but down-tiered: their posts are mostly infra/DX)
  { name: 'Replit', url: 'https://blog.replit.com/feed.xml', color: '#f26207', tier: 'dev-platform' },
  { name: 'Vercel', url: 'https://vercel.com/atom', color: '#000000', tier: 'dev-platform' },
  { name: 'GitHub', url: 'https://github.blog/feed/', color: '#333333', tier: 'dev-platform' },
  { name: 'Supabase', url: 'https://supabase.com/blog/rss.xml', color: '#3ecf8e', tier: 'dev-platform' },

  // Tech news (keyword-only scoring — no source baseline)
  { name: 'The Verge', url: 'https://www.theverge.com/ai-artificial-intelligence/rss/index.xml', color: '#e5127d', tier: 'tech-news' },
  { name: 'TechCrunch', url: 'https://techcrunch.com/category/artificial-intelligence/feed/', color: '#0a9e01', tier: 'tech-news' },
  { name: 'Ars Technica', url: 'https://feeds.arstechnica.com/arstechnica/technology-lab', color: '#ff4e00', tier: 'tech-news' },
  { name: 'Wired', url: 'https://www.wired.com/feed/tag/ai/latest/rss', color: '#000000', tier: 'tech-news' },
  { name: 'MIT Tech Review', url: 'https://www.technologyreview.com/feed/', color: '#a31d35', tier: 'tech-news' },
  { name: 'VentureBeat', url: 'https://venturebeat.com/category/ai/feed/', color: '#930c10', tier: 'tech-news' },
];

// Lightweight fallback when the full pull times out. Favors design + a couple
// of AI labs so a degraded run still produces a designer-relevant issue
// (the previous lite slice was Vercel/GitHub/Supabase-heavy).
const RSS_SOURCES_LITE: RssSource[] = RSS_SOURCES.filter((s) =>
  ['Nielsen Norman Group', 'Smashing Magazine', 'UX Collective', 'A List Apart',
   'TLDR Design', 'Figma', 'OpenAI', 'Google AI'].includes(s.name)
);

// Scrape Anthropic news (no RSS feed available). Anthropic posts first-party
// product launches here (e.g. "Claude Design by Anthropic Labs" Apr 17 2026,
// "Claude Opus 4.7" Apr 16 2026) — high signal for designers.
//
// Anthropic moved away from the embedded Sanity JSON (which our old regex
// targeted) to plain server-rendered HTML in 2026. Each news card is now an
// <a href="/news/SLUG"> wrapping a title, a <time> with text like
// "Apr 17, 2026", and a body <p>. We parse those directly. If the structure
// changes again the loop returns whatever it could parse rather than crashing.
async function scrapeAnthropicNews(): Promise<NewsItem[]> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);
    const response = await fetch('https://www.anthropic.com/news', {
      headers: { 'User-Agent': FEED_USER_AGENT },
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    const html = await response.text();

    // Match each <a href="/news/SLUG" ...>...</a> card. Lazy match on </a>.
    const cardRe = /<a href="\/news\/([a-z0-9-]+)"[^>]*>([\s\S]*?)<\/a>/g;
    const items: NewsItem[] = [];
    const seenSlugs = new Set<string>();

    let cardMatch: RegExpExecArray | null;
    while ((cardMatch = cardRe.exec(html)) !== null) {
      const slug = cardMatch[1];
      const inner = cardMatch[2];
      // Same slug appears multiple times on the page (featured + grid). Keep
      // the first occurrence with the richest inner content; skip dupes.
      if (seenSlugs.has(slug)) continue;

      // Title: try h2/h3/h4 in order. Strip any nested tags.
      const titleMatch =
        inner.match(/<h2[^>]*>([\s\S]*?)<\/h2>/) ||
        inner.match(/<h3[^>]*>([\s\S]*?)<\/h3>/) ||
        inner.match(/<h4[^>]*>([\s\S]*?)<\/h4>/);
      const realTitle = titleMatch ? titleMatch[1].replace(/<[^>]+>/g, '').trim() : null;

      // Date: text content of <time>...</time>, e.g. "Apr 17, 2026"
      const dateMatch = inner.match(/<time[^>]*>([^<]+)<\/time>/);
      const dateText = dateMatch ? dateMatch[1].trim() : null;
      const parsedDate = dateText ? new Date(dateText) : null;
      const pubDate = parsedDate && !isNaN(parsedDate.getTime())
        ? parsedDate.toISOString()
        : new Date().toISOString();

      // Description: first <p>...</p> inside the card
      const descMatch = inner.match(/<p[^>]*>([\s\S]*?)<\/p>/);
      const description = descMatch
        ? descMatch[1].replace(/<[^>]+>/g, '').replace(/&#x27;/g, "'").replace(/&amp;/g, '&').trim().slice(0, 500)
        : '';

      // Fall back to slug-derived title if we couldn't find a real one
      // (happens for the featured-card variant where the title sits outside
      // the <a> tag in some layouts).
      const title = realTitle || slug.split('-').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

      // Score with the ai-lab tier baseline so Anthropic launches sort
      // alongside OpenAI/Google AI items rather than landing at score 0.
      const fakeRssItem = {
        title,
        contentSnippet: description || slug.replace(/-/g, ' '),
        content: description || slug.replace(/-/g, ' '),
      } as Parser.Item;
      const relevanceScore = scoreRelevance(fakeRssItem, 'ai-lab');

      items.push({
        source: 'Anthropic',
        sourceColor: '#d97706',
        sourceTier: 'ai-lab',
        title,
        description,
        link: `https://www.anthropic.com/news/${slug}`,
        pubDate,
        relevanceScore,
      });
      seenSlugs.add(slug);
    }

    console.log(`[newsletter] Anthropic scraper extracted ${items.length} items`);
    return items;
  } catch (error) {
    console.error('Failed to scrape Anthropic news:', error);
    return [];
  }
}


// Keywords for relevance filtering - prioritized by UX significance
const HIGH_RELEVANCE_KEYWORDS = [
  // AI + UX specific
  'ai assistant', 'ai agent', 'conversational ui', 'chat interface', 'prompt',
  'ai-powered', 'generative ai', 'llm', 'copilot', 'autocomplete',
  // UX specific
  'user experience', 'ux design', 'ui design', 'interaction design',
  'usability', 'accessibility', 'a11y', 'user research', 'user testing',
  'onboarding', 'personalization', 'adaptive', 'contextual',
  // Product design
  'design system', 'component library', 'figma', 'prototype', 'wireframe',
  'collaboration', 'real-time', 'workflow',
];

const MEDIUM_RELEVANCE_KEYWORDS = [
  // AI terms
  'ai', 'artificial intelligence', 'machine learning', 'gpt', 'claude', 'gemini',
  'model', 'agent', 'neural', 'transformer',
  // Design terms
  'interface', 'design', 'component', 'layout', 'responsive',
  // Product terms
  'feature', 'update', 'launch', 'release', 'announcement', 'beta',
];


// Product brand colors
const PRODUCT_COLORS: Record<string, string> = {
  // AI Companies
  OpenAI: '#10a37f',
  ChatGPT: '#10a37f',
  Anthropic: '#d97706',
  Claude: '#d97706',
  'Claude Code': '#d97706',
  Google: '#4285f4',
  'Google AI': '#4285f4',
  Gemini: '#4285f4',
  Microsoft: '#00a4ef',
  Copilot: '#00a4ef',
  // AI Coding Tools
  Cursor: '#7c3aed',
  Replit: '#f26207',
  Codeium: '#09b6a2',
  Windsurf: '#09b6a2',
  // AI Products
  Notion: '#000000',
  Linear: '#5e6ad2',
  Perplexity: '#20808d',
  // Design Tools
  Figma: '#f24e1e',
  Framer: '#0055ff',
  // Dev Tools
  Vercel: '#000000',
  GitHub: '#333333',
  Supabase: '#3ecf8e',
  // UX & Design
  'NN Group': '#c41230',
  'Nielsen Norman': '#c41230',
  'Smashing Magazine': '#e85c41',
  'UX Collective': '#000000',
  // Tech News
  'The Verge': '#e5127d',
  TechCrunch: '#0a9e01',
  'Ars Technica': '#ff4e00',
};

function getPatternTitle(slug: string): string {
  const pattern = patterns.find((p) => p.slug === slug);
  return pattern ? pattern.title : slug;
}

// Email-safe icon helpers (hosted PNGs, since email clients strip inline SVGs)
const EMAIL_IMG_BASE = `${SITE_URL}/images/email`;

const ICON_NEWSPAPER = `<img src="${EMAIL_IMG_BASE}/icon-newspaper.png" alt="" width="18" height="18" style="width: 18px; height: 18px; display: inline; vertical-align: -3px; margin-right: 6px;" />`;

// Product logo image names (match filenames in /public/images/email/)
const PRODUCT_ICON_NAMES: string[] = [
  'openai', 'vercel', 'figma', 'github', 'google', 'microsoft',
  'supabase', 'replit', 'claude', 'anthropic', 'cursor', 'notion', 'linear', 'perplexity',
  'ubereats', 'posthog',
];

function getProductIconImg(productName: string): string {
  const name = productName.toLowerCase();
  const nameNoSpaces = name.replace(/\s+/g, '');
  for (const key of PRODUCT_ICON_NAMES) {
    if (name.includes(key) || nameNoSpaces.includes(key)) {
      return `<img src="${EMAIL_IMG_BASE}/${key}.png" alt="" width="14" height="14" style="width: 14px; height: 14px; display: inline; vertical-align: -2px; margin-right: 5px;" />`;
    }
  }
  return `<img src="${EMAIL_IMG_BASE}/fallback.png" alt="" width="14" height="14" style="width: 14px; height: 14px; display: inline; vertical-align: -2px; margin-right: 5px;" />`;
}

// Primary AI product sources - these get priority
// Source-tier baseline scores. First-guess weights — tune after 3-5 issues
// under the new system if the source mix still skews dev. Higher tiers crowd
// out lower ones for a given keyword profile, so the gaps matter as much as
// the absolute values.
const SOURCE_TIER_BASELINE: Record<SourceTier, number> = {
  'design-pub': 25,        // research/news/case studies — narrowed 50→30 (Apr 28) and 30→25 (May 7) so concrete product news outranks design-pub keyword stacking
  'design-tool': 40,       // first-party design product news
  'ai-lab': 35,            // concrete AI product launches — bumped 30→35 (May 7) to compete with design-pub keyword density
  'design-opinion': 28,    // think-pieces — useful but capped to 1-2 per issue via prompt
  curator: 25,             // syntheses
  community: 25,
  'dev-platform': 20,
  'tech-news': 0,
};

// Subset of HIGH_RELEVANCE_KEYWORDS that signal genuine design substance.
// Used by both the infra-penalty conditional (so a "Figma launches deployment
// workflow" item doesn't get penalized) and isDesignNative() (the publish-time
// design-light gate). Keep in sync with HIGH_RELEVANCE_KEYWORDS above.
const DESIGN_KEYWORDS_SET: ReadonlySet<string> = new Set([
  // Classic design vocabulary
  'user experience', 'ux design', 'ui design', 'interaction design',
  'usability', 'accessibility', 'a11y', 'user research', 'user testing',
  'design system', 'component library', 'figma', 'prototype', 'wireframe',
  'storyboard',
  // Design-tool / visual-creation vocabulary
  'design tool', 'design platform', 'visual design', 'visual creation',
  'canvas', 'mockup', 'handoff', 'design workflow',
  // Image-model / UI-generation vocabulary (designers care about mockup quality)
  'image generation', 'image model', 'ui generation', 'ui rendering',
  'render ui', 'text in images',
]);

// Agentic-UX pattern terms — separate from DESIGN_KEYWORDS_SET because they
// need a co-occurring application term (ui/interface/workflow/user/product)
// to count as design-native. Used only by isDesignNativeItem().
const AGENTIC_UX_TERMS: readonly string[] = [
  'agentic', 'agent ui', 'human-in-the-loop', 'pre-flight',
  'intent preview', 'plan summary', 'trust calibration',
];
const AGENTIC_APPLICATION_TERMS: readonly string[] = [
  'ui', 'interface', 'workflow', 'user', 'product',
];

// Matches design-tool product names when they appear in the item title.
// Captures "Claude Design", "Figma X", "Framer Y" etc. without forcing a
// bigram-keyword match. Intentionally narrow: only these brand names.
const DESIGN_TOOL_PRODUCT_RE = /\b(figma|framer|canva|sketch|penpot|rive)\b|\bdesign\b/;

// Pure-infrastructure markers. We penalize items containing these UNLESS the
// item also mentions a design keyword (so cross-cutting stories like "Figma
// launches deployment workflow" survive). The penalty's job is to suppress
// pure-infra posts that get a baseline boost just because they came from
// e.g. Vercel's blog.
const INFRA_KEYWORDS = [
  'deployment', 'devops', 'infrastructure', 'backend', 'database',
  'kubernetes', 'serverless function', 'ci/cd', 'observability',
  'load balancer', 'data warehouse', 'rest api', 'graphql',
];

// Score relevance 0-100 based on source tier + keyword matches.
function scoreRelevance(item: Parser.Item, sourceTier?: SourceTier): number {
  const text = `${item.title || ''} ${item.contentSnippet || ''} ${item.content || ''}`.toLowerCase();
  let score = 0;

  // Tier baseline — replaces the old flat +30 for AI_PRODUCT_SOURCES, which
  // gave Vercel the same priority as Figma. design-pub > design-tool > ai-lab
  // > curator/community > dev-platform > tech-news (keyword-only).
  if (sourceTier) {
    score += SOURCE_TIER_BASELINE[sourceTier];
  }

  // High relevance keywords
  for (const keyword of HIGH_RELEVANCE_KEYWORDS) {
    if (text.includes(keyword)) {
      score += 10;
    }
  }

  // Medium relevance keywords
  for (const keyword of MEDIUM_RELEVANCE_KEYWORDS) {
    if (text.includes(keyword)) {
      score += 3;
    }
  }

  // Bonus for title matches
  const title = (item.title || '').toLowerCase();
  for (const keyword of HIGH_RELEVANCE_KEYWORDS) {
    if (title.includes(keyword)) {
      score += 5;
    }
  }

  // Conditional infra penalty: only if no design keyword in the same item.
  // Suppresses pure-infra posts (Vercel deployment howto, Supabase backend
  // tutorial) without nuking cross-cutting design+infra stories.
  const hasInfraKeyword = INFRA_KEYWORDS.some((k) => text.includes(k));
  const hasDesignKeyword = Array.from(DESIGN_KEYWORDS_SET).some((k) => text.includes(k));
  if (hasInfraKeyword && !hasDesignKeyword) {
    score -= 15;
  }

  // Cap at 100, floor at 0
  return Math.max(0, Math.min(score, 100));
}

function isRelevant(item: Parser.Item, sourceTier?: SourceTier): boolean {
  return scoreRelevance(item, sourceTier) >= 10; // Minimum threshold
}

// Code-side design-native check (not a Claude self-report). Passes when the
// item matters to a product/UX designer, by any of these signals:
//   1. Source tier is design-pub / design-tool / design-opinion.
//   2. Title names a design-tool brand or contains "design" (e.g. "Claude
//      Design launches..."). Scoped to title only so a Vercel post that
//      mentions "design" in passing doesn't pass.
//   3. 2+ hits from DESIGN_KEYWORDS_SET across title+description.
//   4. An agentic-UX term co-occurs with an application term — catches
//      "agentic safety in the UI", "human-in-the-loop workflow" etc.
function isDesignNativeItem(item: NewsItem, tier?: SourceTier): boolean {
  if (tier === 'design-pub' || tier === 'design-tool' || tier === 'design-opinion') return true;

  const title = item.title.toLowerCase();
  if (DESIGN_TOOL_PRODUCT_RE.test(title)) return true;

  const text = `${item.title} ${item.description}`.toLowerCase();
  let hits = 0;
  for (const k of Array.from(DESIGN_KEYWORDS_SET)) {
    if (text.includes(k)) {
      hits += 1;
      if (hits >= 2) return true;
    }
  }

  const hasAgentic = AGENTIC_UX_TERMS.some((k) => text.includes(k));
  const hasApplication = AGENTIC_APPLICATION_TERMS.some((k) => text.includes(k));
  if (hasAgentic && hasApplication) return true;

  return false;
}

function isRecent(item: Parser.Item, hoursAgo = 48): boolean {
  if (!item.pubDate && !item.isoDate) return false;
  const pubDate = new Date(item.pubDate || item.isoDate || '');
  const cutoff = new Date(Date.now() - hoursAgo * 60 * 60 * 1000);
  return pubDate >= cutoff;
}

// TLDR's RSS feed gives one item per daily digest with title + link only — no
// per-story description and no outbound source URLs. The digest *page* however
// has a clean structure: each story is an <article class="mt-3"> with a
// font-bold <a href> to the source, an <h3> title, and a
// <div class="newsletter-html"> blurb. We scrape the digest URL to expand a
// single RSS digest into per-story NewsItems with real source URLs and real
// blurbs (instead of letting Claude fabricate descriptions and reuse the
// digest URL as the link).
function decodeHtmlEntities(s: string): string {
  return s
    .replace(/&#x([0-9a-f]+);/gi, (_, hex) => String.fromCodePoint(parseInt(hex, 16)))
    .replace(/&#(\d+);/g, (_, dec) => String.fromCodePoint(parseInt(dec, 10)))
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&nbsp;/g, ' ');
}

async function fetchTldrDigestStories(
  digestUrl: string,
  source: { name: string; color: string; tier?: SourceTier },
  pubDate: string
): Promise<NewsItem[]> {
  let html: string;
  try {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 5000);
    const res = await fetch(digestUrl, {
      signal: ctrl.signal,
      headers: { 'user-agent': 'Mozilla/5.0 aiuxdesign-newsletter-bot' },
    });
    clearTimeout(timer);
    if (!res.ok) {
      console.warn(`[newsletter] TLDR digest fetch failed: ${digestUrl} → ${res.status}`);
      return [];
    }
    html = await res.text();
  } catch (err) {
    console.warn(`[newsletter] TLDR digest fetch error: ${digestUrl} → ${(err as Error).message}`);
    return [];
  }

  const stories: NewsItem[] = [];
  const articleRe = /<article class="mt-3">([\s\S]*?)<\/article>/g;
  let m: RegExpExecArray | null;
  while ((m = articleRe.exec(html)) !== null) {
    const block = m[1];
    const hrefMatch = block.match(/<a [^>]*class="font-bold"[^>]*href="([^"]+)"/);
    const titleMatch = block.match(/<h3>([\s\S]*?)<\/h3>/);
    const blurbMatch = block.match(/<div class="newsletter-html">([\s\S]*?)<\/div>/);
    if (!hrefMatch || !titleMatch) continue;
    const link = decodeHtmlEntities(hrefMatch[1]);
    if (/(^|\/\/)([^/]+\.)?tldr\.tech\b/i.test(link)) continue; // skip self-links / sponsor placeholders
    const rawTitle = decodeHtmlEntities(titleMatch[1].replace(/<[^>]+>/g, '')).trim();
    const title = rawTitle.replace(/\s*\((?:\d+\s+minute\s+read|Website|Product|GitHub Repo|Video)\)\s*$/i, '').trim();
    if (!title) continue;
    const blurbHtml = blurbMatch?.[1] ?? '';
    const blurb = decodeHtmlEntities(blurbHtml.replace(/<[^>]+>/g, '')).trim().slice(0, 500);

    const synth = { title, contentSnippet: blurb, content: blurb } as Parser.Item;
    const score = scoreRelevance(synth, source.tier);
    if (score < 10) continue;

    stories.push({
      source: source.name,
      sourceColor: source.color,
      sourceTier: source.tier,
      title,
      description: blurb,
      link,
      pubDate,
      relevanceScore: score,
    });
  }
  return stories;
}

interface NewsItem {
  source: string;
  sourceColor: string;
  sourceTier?: SourceTier;
  title: string;
  description: string;
  link: string;
  pubDate: string;
  relevanceScore?: number;
}

// Basic word stemming — reduces common suffixes so "compares" matches "compare", etc.
function stemWord(word: string): string {
  if (word.length <= 3) return word;
  // Order matters: check longer suffixes first
  if (word.endsWith('ies') && word.length > 4) return word.slice(0, -3) + 'y';
  if (word.endsWith('ing') && word.length > 5) return word.slice(0, -3);
  if (word.endsWith('tion') && word.length > 5) return word.slice(0, -4);
  if (word.endsWith('es') && word.length > 4) return word.slice(0, -2);
  if (word.endsWith('ed') && word.length > 4) return word.slice(0, -2);
  if (word.endsWith('ly') && word.length > 4) return word.slice(0, -2);
  if (word.endsWith('s') && !word.endsWith('ss') && word.length > 3) return word.slice(0, -1);
  // Strip trailing 'e' to normalize base forms (compare → compar, response → respons)
  if (word.endsWith('e') && word.length > 4) return word.slice(0, -1);
  return word;
}

// Normalize a title for fuzzy deduplication comparison
// Strips Google News source suffix, common prefixes, punctuation, and lowercases
function normalizeTitle(title: string): string {
  return title
    .toLowerCase()
    .replace(/\s+-\s+[a-z0-9\s.]+$/i, '') // Strip " - SourceName" suffix (Google News)
    .replace(/^(breaking|exclusive|update|new|report|review|analysis):\s*/i, '')
    .replace(/[^a-z0-9\s]/g, '') // Remove punctuation
    .replace(/\s+/g, ' ')
    .trim();
}

// Generic announcement verbs and filler words that inflate dedup overlap
// without carrying topic meaning. Without this stoplist, "Introducing Claude
// Design by Anthropic Labs" matches "Claude introduces scheduled tasks
// feature" at 40% overlap (claud + introduc) because both stem to the same
// shared words. Strip them so dedup only counts content terms.
// Entries must equal stemWord(themselves) — the lookup is always against stems,
// so inflected forms like 'launching' would never match (input gets stemmed to 'launch' first).
const DEDUP_STOPWORDS_STEMMED: ReadonlySet<string> = new Set([
  // Announcement verbs (stems)
  'introduc', 'launch', 'announc', 'unveil', 'reveal',
  'add', 'bring', 'roll', 'ship', 'debut',
  // Time/availability
  'avail', 'now', 'today', 'week',
  // Generic action verbs (stems)
  'get', 'use', 'using', 'make', 'start', 'help',
  // Filler
  'new', 'first', 'next', 'just', 'how', 'why', 'what', 'with', 'for', 'and', 'the',
  'into', 'from', 'over', 'under', 'after',
]);

// Get stemmed word set from a title for comparison
function getStemmedWords(title: string): Set<string> {
  const stems = normalizeTitle(title)
    .split(' ')
    .filter(w => w.length > 2)
    .map(stemWord)
    .filter(s => !DEDUP_STOPWORDS_STEMMED.has(s));
  return new Set(stems);
}

// Known product/brand names for entity-aware deduplication
const KNOWN_ENTITIES = [
  'perplexity', 'chatgpt', 'openai', 'claude', 'anthropic', 'gemini', 'google',
  'cursor', 'windsurf', 'codeium', 'replit', 'notion', 'linear', 'figma',
  'copilot', 'microsoft', 'github', 'vercel', 'supabase', 'framer',
];

// Extract known product/brand entities from a title
function getEntities(title: string): string[] {
  const lower = normalizeTitle(title);
  return KNOWN_ENTITIES.filter(e => lower.includes(e));
}

// Check if two titles are similar enough to be considered duplicates
function isSimilarTitle(title1: string, title2: string): boolean {
  const norm1 = normalizeTitle(title1);
  const norm2 = normalizeTitle(title2);

  // Exact match after normalization
  if (norm1 === norm2) return true;

  // One title contains the other (handles cases like "X launches Y" vs "X launches Y: details")
  if (norm1.length > 10 && norm2.length > 10) {
    if (norm1.includes(norm2) || norm2.includes(norm1)) return true;
  }

  const words1 = getStemmedWords(title1);
  const words2 = getStemmedWords(title2);

  if (words1.size >= 3 && words2.size >= 3) {
    const overlap = Array.from(words1).filter(w => words2.has(w)).length;
    const smaller = Math.min(words1.size, words2.size);

    // Standard threshold: 60% stemmed word overlap
    if (overlap / smaller >= 0.6) return true;

    // Entity-aware: if titles share a specific product/brand name,
    // use a lower threshold (35%) since they likely cover the same story.
    // e.g. "Perplexity removes ads" vs "Perplexity drops advertising"
    const entities1 = getEntities(title1);
    const entities2 = getEntities(title2);
    const sharedEntities = entities1.filter(e => entities2.includes(e));
    if (sharedEntities.length > 0 && overlap / smaller >= 0.35) return true;
  }

  return false;
}

async function getRecentlyUsedUrls(deduplicationDays = 7, excludeWeekly = true): Promise<Set<string>> {
  // Get URLs from newsletters published in the last N days
  // Only check daily newsletters for deduplication (weekly compiles from daily, so shouldn't compete)
  const cutoffDate = new Date(Date.now() - deduplicationDays * 24 * 60 * 60 * 1000);
  const recentNewsletters = await prisma.newsletterDraft.findMany({
    where: {
      status: { in: ['published', 'pending_review'] },
      createdAt: { gte: cutoffDate },
      ...(excludeWeekly && { type: 'daily' }), // Only check daily newsletters
    },
    select: { content: true },
  });

  const usedUrls = new Set<string>();
  for (const newsletter of recentNewsletters) {
    // Extract URLs from href attributes in the content
    const urlMatches = newsletter.content?.matchAll(/href="([^"]+)"/g) || [];
    for (const match of urlMatches) {
      usedUrls.add(match[1]);
    }
  }
  return usedUrls;
}

async function getRecentlyUsedTitles(deduplicationDays = 7, excludeWeekly = true): Promise<string[]> {
  // Extract headlines from structuredData of recent newsletters for title-based dedup
  const cutoffDate = new Date(Date.now() - deduplicationDays * 24 * 60 * 60 * 1000);
  const recentNewsletters = await prisma.newsletterDraft.findMany({
    where: {
      status: { in: ['published', 'pending_review'] },
      createdAt: { gte: cutoffDate },
      ...(excludeWeekly && { type: 'daily' }),
    },
    select: { structuredData: true },
  });

  const usedTitles: string[] = [];
  for (const newsletter of recentNewsletters) {
    if (newsletter.structuredData && typeof newsletter.structuredData === 'object') {
      const data = newsletter.structuredData as { items?: { headline?: string }[] };
      if (Array.isArray(data.items)) {
        for (const item of data.items) {
          if (item.headline) {
            usedTitles.push(item.headline);
          }
        }
      }
    }
  }
  return usedTitles;
}

// Detect a pool dominated by a single RSS source. Returns the dominant source if
// its share of the pool exceeds `threshold` AND the pool has at least `minPoolSize`
// items (small pools are noisy and handled by the existing quiet-day path).
//
// We key on `item.source` (the RSS feed name like "OpenAI" or "Cursor") rather
// than URL hostname because Google News search feeds all return news.google.com
// URLs but represent distinct product searches (Cursor, Notion, Linear, etc.) —
// so URL-parsing would falsely flag a healthy diverse pool as single-source.
//
// Real-world trigger (Apr 11 2026): OpenAI Academy launch caused the OpenAI RSS
// feed to dump 27 sub-pages into a 29-item pool (93% from one source), producing
// a newsletter where 5/5 items linked to openai.com. We'd rather skip the day.
function findDominantSource(
  items: NewsItem[],
  threshold = 0.7,
  minPoolSize = 5,
): { source: string; count: number; share: number } | null {
  if (items.length < minPoolSize) return null;
  const counts = new Map<string, number>();
  for (const item of items) {
    if (!item.source) continue;
    counts.set(item.source, (counts.get(item.source) || 0) + 1);
  }
  let topSource = '';
  let topCount = 0;
  counts.forEach((count, source) => {
    if (count > topCount) {
      topCount = count;
      topSource = source;
    }
  });
  const share = topCount / items.length;
  return share > threshold ? { source: topSource, count: topCount, share } : null;
}

// Pool diversity cap: max items kept from any single RSS source after sorting.
// This is the fix for the "Vercel attributed as Zo Computer / GitBook" bypass:
// Claude's `max 2 per company` prompt rule operates on its own product field,
// which it derives from the post body — Vercel customer case studies routed
// through that rule as 3 different "products". Capping at the source level
// before Claude sees the pool closes that gap. Belt-and-suspenders: keep the
// prompt-side rule too.
// Per-tier pool cap. design-opinion is capped at 1 because two opinion pieces
// from the same publication (e.g. UX Collective) can crowd out concrete AI-lab
// product news when both score similarly on keyword density. The prompt rule
// "AT MOST 1 opinion piece per issue" was being ignored by Claude Haiku
// (2026-05-06: 2/4 daily items were uxdesign.cc), so we enforce it at the pool
// level. Other tiers stay at 2 — the previous behaviour.
const MAX_ITEMS_PER_SOURCE_DEFAULT = 2;
const MAX_ITEMS_PER_SOURCE_BY_TIER: Partial<Record<SourceTier, number>> = {
  'design-opinion': 1,
};
function maxItemsForTier(tier?: SourceTier): number {
  if (tier && MAX_ITEMS_PER_SOURCE_BY_TIER[tier] !== undefined) {
    return MAX_ITEMS_PER_SOURCE_BY_TIER[tier]!;
  }
  return MAX_ITEMS_PER_SOURCE_DEFAULT;
}

interface AggregatedPool {
  items: NewsItem[];
  clippedSources: string[]; // source names that were trimmed by the cap
}

async function aggregateNews(
  lookbackHours = 24,
  deduplicationDays = 7,
  { lite = false }: { lite?: boolean } = {},
): Promise<AggregatedPool> {
  const allItems: NewsItem[] = [];
  const sources = lite ? RSS_SOURCES_LITE : RSS_SOURCES;
  const [usedUrls, usedTitles] = await Promise.all([
    getRecentlyUsedUrls(deduplicationDays),
    getRecentlyUsedTitles(deduplicationDays),
  ]);

  // Helper: check if an item title is too similar to a previously used title
  const isTitleAlreadyUsed = (title: string): boolean => {
    return usedTitles.some(usedTitle => isSimilarTitle(title, usedTitle));
  };

  // Run RSS feeds and Anthropic scrape in parallel (lite mode skips Anthropic scraper)
  const [rssResults, anthropicNews] = await Promise.all([
    Promise.allSettled(
      sources.map(async (source) => {
        try {
          const feed = await parser.parseURL(source.url);

          // TLDR Design: each RSS item is a daily digest with no body. Expand
          // it by scraping the digest page for per-story sections.
          if (source.name === 'TLDR Design') {
            const recentDigests = (feed.items || []).filter((item) => isRecent(item, lookbackHours));
            const all: NewsItem[] = [];
            for (const digest of recentDigests) {
              if (!digest.link) continue;
              const stories = await fetchTldrDigestStories(
                digest.link,
                { name: source.name, color: source.color, tier: source.tier },
                digest.pubDate || digest.isoDate || new Date().toISOString()
              );
              all.push(...stories);
            }
            return all
              .filter((s) => !usedUrls.has(s.link))
              .filter((s) => !isTitleAlreadyUsed(s.title));
          }

          return (feed.items || [])
            .filter((item) => isRecent(item, lookbackHours) && isRelevant(item, source.tier))
            .filter((item) => !item.link || !usedUrls.has(item.link))
            .filter((item) => !item.title || !isTitleAlreadyUsed(item.title.trim()))
            .map((item) => ({
              source: source.name,
              sourceColor: source.color,
              sourceTier: source.tier,
              title: item.title?.trim() || 'Untitled',
              description: item.contentSnippet?.slice(0, 500) || item.content?.slice(0, 500) || '',
              link: item.link || '',
              pubDate: item.pubDate || item.isoDate || new Date().toISOString(),
              relevanceScore: scoreRelevance(item, source.tier),
            }));
        } catch (err) {
          console.warn(`[newsletter] RSS fetch failed for ${source.name}: ${(err as Error).message}`);
          return [];
        }
      })
    ),
    lite ? Promise.resolve([]) : scrapeAnthropicNews(),
  ]);

  const succeededFeeds = rssResults.filter(r => r.status === 'fulfilled').length;
  const failedFeeds = rssResults.filter(r => r.status === 'rejected').length;

  for (const result of rssResults) {
    if (result.status === 'fulfilled') {
      allItems.push(...result.value);
    }
  }

  console.log(`[newsletter] RSS results: ${succeededFeeds}/${sources.length} succeeded, ${failedFeeds} rejected, ${allItems.length} items after RSS`);

  // Add Anthropic news from scraper (their site doesn't have RSS).
  //
  // First-party Anthropic launches (Claude Design, Claude Opus N) often get
  // covered by third parties first, which then poisons our title-similarity
  // dedup pool. By the time the authoritative Anthropic post is scraped,
  // dedup blocks it as a "duplicate" of the third-party coverage. Skip the
  // title-similarity check for Anthropic items — the URL-based dedup still
  // catches exact repeats, and Claude's prompt rule caps Anthropic at 2
  // selected items so we won't flood. Documented tradeoff: Anthropic posts
  // get a slight bypass advantage as authoritative source.
  const cutoff = new Date(Date.now() - lookbackHours * 60 * 60 * 1000);
  let anthropicAdded = 0;
  for (const item of anthropicNews) {
    const itemDate = new Date(item.pubDate);
    if (itemDate >= cutoff && !usedUrls.has(item.link)) {
      allItems.push(item);
      anthropicAdded += 1;
    }
  }
  console.log(`[newsletter] Anthropic items added to pool: ${anthropicAdded}/${anthropicNews.length}`);

  // Sort by relevance score first, then by date
  const sorted = allItems.sort((a, b) => {
    const scoreA = a.relevanceScore || 0;
    const scoreB = b.relevanceScore || 0;
    if (scoreB !== scoreA) {
      return scoreB - scoreA; // Higher relevance first
    }
    return new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime();
  });

  // Pre-filter: drop any item whose URL is on an opinion domain regardless of
  // which feed surfaced it. TLDR Design and similar curated feeds syndicate
  // Substack/Medium pieces; isOpinionUrl looks at the final URL host so we
  // strip them here before Claude ever sees the pool.
  const opinionFiltered = sorted.filter((item) => !isOpinionUrl(item.link));
  const opinionDropped = sorted.length - opinionFiltered.length;
  if (opinionDropped > 0) {
    console.log(`[newsletter] Pool opinion filter dropped ${opinionDropped} item(s) from substack/medium/etc.`);
  }

  // Pool-level diversity cap: walk top-down, keep at most MAX_ITEMS_PER_SOURCE
  // from each source. Track which sources got clipped for the QA telemetry.
  const perSourceCount = new Map<string, number>();
  const clippedSet = new Set<string>();
  const capped: NewsItem[] = [];
  for (const item of opinionFiltered) {
    const seen = perSourceCount.get(item.source) || 0;
    if (seen >= maxItemsForTier(item.sourceTier)) {
      clippedSet.add(item.source);
      continue;
    }
    perSourceCount.set(item.source, seen + 1);
    capped.push(item);
  }
  if (clippedSet.size > 0) {
    console.log(
      `[newsletter] Pool diversity cap clipped ${sorted.length - capped.length} item(s) from sources: ${Array.from(clippedSet).join(', ')}`,
    );
  }

  return { items: capped, clippedSources: Array.from(clippedSet) };
}

interface NewsletterItem {
  product: string;
  date: string;
  headline: string;
  description: string;
  designerTakeaway: string;
  sourceUrl: string;
  patternSlug: string;
}

interface NewsletterData {
  title: string;
  summary: string;
  items: NewsletterItem[];
  takeaway: {
    title: string;
    body: string;
  };
}

// Weekly newsletter specific interfaces
interface WeeklyNewsletterData {
  title: string;
  summary: string;
  items: NewsletterItem[];
  stealThisWeek: {
    product: string;
    feature: string;
    insight: string;
  };
  patternToKnow: {
    patternSlug: string;
    title: string;
    explanation: string;
    whenToUse: string;
  };
  weeklyTakeaway: string;
}

type NewsletterType = 'daily' | 'weekly';

// Get items from daily newsletters for weekly compilation
async function getDailyNewsletterItems(days = 7): Promise<NewsletterItem[]> {
  const cutoffDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

  const dailyNewsletters = await prisma.newsletterDraft.findMany({
    where: {
      type: 'daily',
      status: { in: ['published', 'pending_review'] },
      createdAt: { gte: cutoffDate },
    },
    orderBy: { createdAt: 'desc' },
    select: { structuredData: true, title: true },
  });

  const allItems: NewsletterItem[] = [];

  for (const newsletter of dailyNewsletters) {
    if (newsletter.structuredData && typeof newsletter.structuredData === 'object') {
      const data = newsletter.structuredData as { items?: NewsletterItem[] };
      if (data.items && Array.isArray(data.items)) {
        allItems.push(...data.items);
      }
    }
  }

  return allItems;
}

// Build prompt for weekly compilation from daily items
function buildWeeklyCompilationPrompt(dailyItems: NewsletterItem[]): string {
  const patternList = patterns.map((p) => `- ${p.slug}: ${p.title}`).join('\n');

  return `You are writing the "This Week in AIUX" weekly newsletter EXCLUSIVELY for product and UX designers, not engineers. A story belongs in this roundup only if a designer can act on it in their work — change a flow, ship a pattern, run a study, rethink a screen.

WRITING STYLE:
- Write naturally and conversationally
- NEVER use em dashes (—). Use commas, periods, or "and" instead
- Avoid overused AI phrases like "dive into", "delve", "game-changer", "revolutionize"
- Be specific and concrete, not vague or hyperbolic

I have collected items from this week's daily newsletters. Your job is to curate the BEST 5-8 items and create a comprehensive weekly roundup.

ITEMS FROM THIS WEEK'S DAILY NEWSLETTERS:
${JSON.stringify(dailyItems, null, 2)}

AVAILABLE PATTERNS (for reference):
${patternList}

YOUR TASK:
1. Select the 5-8 most design-significant items from the daily newsletters.

   AUDIENCE FILTER (strict):
   - If a daily item turned out to be a pure infrastructure / deployment / devops story (regardless of how it was framed in the daily Designer's Takeaway), DROP IT from the weekly. The weekly is the chance to re-curate, not to compound prior bias. A leaner roundup of 5 design-relevant items beats 8 mixed ones.
   - Prefer concrete news (product launches, feature releases, research findings) over opinion essays and think-pieces. Items originally sourced from uxdesign.cc, uxplanet.org, or lennysnewsletter.com are usually opinion. Include AT MOST 2 opinion pieces in the weekly, and ONLY when each introduces a genuinely new framework or insight that would change how a designer works.
   - Maximum 2 items from any single company or domain. The same source domain (vercel.com, openai.com) counts as one source even if items are attributed to different products.

2. Keep the original descriptions but you may slightly enhance them for the weekly context.
3. Rewrite each "Designer's Takeaway" so it names a concrete designer action (a flow change, a pattern to ship, a study to run). Drop items where you cannot do this honestly.
4. Identify ONE standout feature for "Steal This Week" - a feature other products should copy.
5. Identify ONE pattern that appeared multiple times for "Pattern to Know" deep dive.
6. Write a weekly takeaway that ties the themes together.
7. Create a compelling title and summary.

RESPOND IN THIS EXACT JSON FORMAT:
{
  "title": "This Week in AIUX: [3-4 word summary of key themes]",
  "summary": "One sentence summary of this week's theme",
  "items": [
    {
      "product": "Product Name",
      "date": "Dec 21",
      "headline": "Short headline",
      "description": "Description from daily newsletter (keep or enhance)",
      "designerTakeaway": "Actionable insight for designers",
      "sourceUrl": "Original URL",
      "patternSlug": "pattern-slug"
    }
  ],
  "stealThisWeek": {
    "product": "Product with the standout feature",
    "feature": "Feature name",
    "insight": "2-3 sentences on why this matters and is worth copying"
  },
  "patternToKnow": {
    "patternSlug": "pattern-slug",
    "title": "Why [Pattern Name] dominated this week",
    "explanation": "2-3 sentences on why this pattern appeared multiple times",
    "whenToUse": "When to apply this pattern"
  },
  "weeklyTakeaway": "One sentence theme tying everything together"
}`;
}

function buildPrompt(newsItems: NewsItem[], recentHeadlines: string[] = []): string {
  const patternList = patterns.map((p) => `- ${p.slug}: ${p.title}`).join('\n');

  const deduplicationBlock = recentHeadlines.length > 0
    ? `\nRECENTLY COVERED TOPICS (from the past 7 days of newsletters — DO NOT repeat these):
${recentHeadlines.map(h => `- ${h}`).join('\n')}

IMPORTANT: Do NOT select any news item that covers the same topic or story as the headlines above, even if the wording is different. For example, if "Perplexity removes ads" was already covered, skip any new article about Perplexity and ads. Pick genuinely NEW stories instead.\n`
    : '';

  return `You are writing the "AI UX Daily" newsletter EXCLUSIVELY for product and UX designers, not engineers. A story belongs in this newsletter only if a designer can act on it in the next month — change a flow, ship a pattern, run a study, rethink a screen. If you cannot articulate that action in one sentence, the story does not belong.

WRITING STYLE:
- Write naturally and conversationally
- NEVER use em dashes (—). Use commas, periods, or "and" instead
- Avoid overused AI phrases like "dive into", "delve", "game-changer", "revolutionize"
- Be specific and concrete, not vague or hyperbolic

Given these recent AI product news items, create a newsletter update:
${deduplicationBlock}
NEWS ITEMS:
${JSON.stringify(newsItems, null, 2)}

AVAILABLE PATTERNS (use these slugs for pattern matching):
${patternList}

YOUR TASK:
1. Select 4-6 items most relevant to UX/product designers.

   AUDIENCE FILTER (strict — this overrides everything else):
   - If a story is purely about infrastructure, deployment, backend reliability, devops, or developer ergonomics with no clear design implication, DROP IT. Do not write a strained Designer's Takeaway to bolt design relevance onto a dev story. Returning 3 strong design-relevant items is better than 5 mixed items.
   - Prefer concrete news (product launches, feature releases, research findings, named studies, version numbers, dated announcements) over opinion essays and think-pieces ("The future of...", "Why X matters", "How to think about Y", "What I learned from Z"). Items from UX Collective (uxdesign.cc), UX Planet (uxplanet.org), Lenny's Newsletter, *.substack.com, and medium.com are opinion. Count opinion-source URLs (uxdesign.cc, uxplanet.org, lennysnewsletter.com, *.substack.com, medium.com) in your final selection — this count MUST be 0. If you have any candidates from these domains, drop them; do not include any opinion items.
   - Prefer items from design-research publications (Nielsen Norman, Smashing Magazine, A List Apart, TLDR Design) and design tools (Figma, Framer) over dev platforms (Vercel, GitHub, Supabase, Replit) when both are present at similar relevance scores.

   PRODUCT-NEWS FLOOR (strict — overrides relevance scoring):
   - At least 1 of your selected items MUST be concrete product news from an AI lab or design tool (e.g., OpenAI, Anthropic/Claude, Google AI, Microsoft AI, Perplexity, Cursor, Notion, Linear, Windsurf, Figma, Framer). A "concrete product news" item announces a launch, feature, version, or dated change — not an opinion piece about that company.
   - If the pool genuinely contains zero such items, return fewer total items rather than padding with opinion/articles. A 3-item issue with 1 product launch beats a 4-item all-opinion issue.

   DIVERSITY RULES (strict — these override relevance scoring):
   - Pick items from at least 3 DIFFERENT companies/products. A newsletter where every item is from one company is not useful.
   - Maximum 2 items from any single company or domain. Cross-check: items where the source URL is on the same domain (vercel.com, openai.com) count as the same source even if the story is attributed to a different product (e.g., a Vercel customer case study about "Zo Computer" still counts toward the Vercel cap).
   - If multiple items come from the same product LAUNCH (e.g., 10 sub-pages of one announcement, or 5 lessons of a new course), TREAT THEM AS A SINGLE STORY. Pick the most representative one and skip the rest — do not pad the newsletter with sub-pages of the same launch.
   - If after applying these rules you have fewer than 3 items left, return only what survives. A short honest newsletter is better than a padded one.

2. For each selected item:
   - Write a short description of what happened
   - Write a "Designer's Takeaway" - actionable insight for UX/product designers (1-2 sentences starting with a verb like "Consider...", "Notice how...", "Apply this by...")
3. Match each item to one of the available patterns (use the slug exactly)
4. Write a "Today's Takeaway" insight summarizing the key theme
5. Create a title and summary for the newsletter

RESPOND IN THIS EXACT JSON FORMAT:
{
  "title": "AI UX Daily: [Key items summary]",
  "summary": "One sentence summary of today's newsletter",
  "items": [
    {
      "product": "Product Name (e.g., ChatGPT, Claude, Gemini)",
      "date": "Dec 21",
      "headline": "Short headline describing the update",
      "description": "2-3 sentences explaining what happened",
      "designerTakeaway": "Actionable insight for designers - what can they learn or apply from this?",
      "sourceUrl": "URL from the news item",
      "patternSlug": "pattern-slug-from-list"
    }
  ],
  "takeaway": {
    "title": "Key insight title",
    "body": "2-3 sentences explaining the insight"
  }
}`;
}

function buildWeeklyPrompt(newsItems: NewsItem[], recentHeadlines: string[] = []): string {
  const patternList = patterns.map((p) => `- ${p.slug}: ${p.title}`).join('\n');

  const deduplicationBlock = recentHeadlines.length > 0
    ? `\nRECENTLY COVERED TOPICS (from the past 30 days — avoid repeating the same stories):
${recentHeadlines.map(h => `- ${h}`).join('\n')}\n`
    : '';

  return `You are writing the "This Week in AIUX" weekly newsletter EXCLUSIVELY for product and UX designers, not engineers. A story belongs in this roundup only if a designer can act on it in their work — change a flow, ship a pattern, run a study, rethink a screen. If you cannot articulate that action in one sentence, the story does not belong.

WRITING STYLE:
- Write naturally and conversationally
- NEVER use em dashes (—). Use commas, periods, or "and" instead
- Avoid overused AI phrases like "dive into", "delve", "game-changer", "revolutionize"
- Be specific and concrete, not vague or hyperbolic

Given these AI product news items from the past week, create a comprehensive weekly roundup:
${deduplicationBlock}
NEWS ITEMS:
${JSON.stringify(newsItems, null, 2)}

AVAILABLE PATTERNS (use these slugs for pattern matching):
${patternList}

YOUR TASK:
1. Select the 5-8 most design-significant items from this week's news.

   AUDIENCE FILTER (strict — overrides everything else):
   - If a story is purely about infrastructure, deployment, backend reliability, devops, or developer ergonomics with no clear design implication, DROP IT. Do not bolt design relevance onto a dev story with a strained Designer's Takeaway. A leaner roundup of 5 strong design stories beats 8 mixed ones.
   - Prefer concrete news (product launches, feature releases, research findings, named studies, version numbers, dated announcements) over opinion essays and think-pieces ("The future of...", "Why X matters", "How to think about Y", "What I learned from Z"). Items from UX Collective (uxdesign.cc), UX Planet (uxplanet.org), and Lenny's Newsletter are usually opinion. Count opinion-source URLs (uxdesign.cc, uxplanet.org, lennysnewsletter.com) in your final selection — this count MUST be ≤2 in a weekly roundup. If you have more than 2 candidates from these domains, pick the strongest and drop the rest.
   - Prefer items from design-research publications (Nielsen Norman, Smashing Magazine, A List Apart, TLDR Design) and design tools (Figma, Framer) over dev platforms (Vercel, GitHub, Supabase, Replit) when both are present at similar relevance scores.

   PRODUCT-NEWS FLOOR (strict — overrides relevance scoring):
   - At least 2 of your selected items MUST be concrete product news from an AI lab or design tool (e.g., OpenAI, Anthropic/Claude, Google AI, Microsoft AI, Perplexity, Cursor, Notion, Linear, Windsurf, Figma, Framer). A "concrete product news" item announces a launch, feature, version, or dated change — not an opinion piece about that company.
   - If the pool genuinely contains fewer such items, return fewer total items rather than padding with opinion/articles.

   DIVERSITY RULES (strict — these override relevance scoring):
   - Pick items from at least 4 DIFFERENT companies/products across the week.
   - Maximum 2 items from any single company or domain. Cross-check: items where the source URL is on the same domain (vercel.com, openai.com) count as the same source even if the story is attributed to a different product (e.g., a Vercel customer case study about "Zo Computer" still counts toward the Vercel cap).
   - If multiple items come from the same product LAUNCH (e.g., several sub-pages of one announcement), TREAT THEM AS A SINGLE STORY and pick the most representative one.
   - Better to ship 5 diverse items than 8 lopsided ones.

2. For each selected item:
   - Write a description of what happened
   - Write a "Designer's Takeaway" - actionable insight for UX/product designers
3. Match each item to one of the available patterns (use the slug exactly)
4. Write "Steal This Week" - highlight ONE standout feature that other products should copy
5. Write "Pattern to Know" - deep dive on one pattern that appeared multiple times this week
6. Write a weekly takeaway that ties the theme together
7. Create a title and summary for the newsletter

RESPOND IN THIS EXACT JSON FORMAT:
{
  "title": "This Week in AIUX: [3-4 word summary of key themes]",
  "summary": "One sentence summary of this week's theme",
  "items": [
    {
      "product": "Product Name (e.g., ChatGPT, Claude, Gemini, Cursor)",
      "date": "Dec 21",
      "headline": "Short headline describing the update",
      "description": "2-3 sentences explaining what happened",
      "designerTakeaway": "Actionable insight for designers - what can they learn or apply from this?",
      "sourceUrl": "URL from the news item",
      "patternSlug": "pattern-slug-from-list"
    }
  ],
  "stealThisWeek": {
    "product": "Product name with the standout feature",
    "feature": "Name of the feature to steal",
    "insight": "2-3 sentences on why this matters for UX and what makes it worth copying"
  },
  "patternToKnow": {
    "patternSlug": "pattern-slug-from-list",
    "title": "Why [Pattern Name] dominated this week",
    "explanation": "2-3 sentences explaining why this pattern appeared multiple times",
    "whenToUse": "When designers should apply this pattern in their own products"
  },
  "weeklyTakeaway": "One sentence theme that ties everything together this week"
}`;
}

// ============================================================
// Email HTML rendering helpers
// ============================================================

const EMAIL_FONT_STACK = `-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif`;
// Brand palette (mirrors tokens in src/app/globals.css :root)
const EMAIL_INK = '#162036';       // --text-primary / --accent-primary (brand navy)
const EMAIL_TEXT = '#20294C';      // --text-secondary (navy-slate body)
const EMAIL_MUTED = '#64748b';     // --text-tertiary (slate-500)
const EMAIL_SUBTLE = '#475569';    // slate-600, sits between body and muted
const EMAIL_HAIRLINE = '#e5e7eb';  // --border-primary (gray-200)
const DARK_CANVAS = '#162036';     // brand navy as dark surface
const DARK_TEXT = '#cbd5e1';       // slate-300 on navy (WCAG AA)
const DARK_STRONG = '#ffffff';
const DARK_LINK = '#93c5fd';       // blue-300 on navy (WCAG AA)

function formatIssueDate(type: NewsletterType): string {
  const date = new Date();
  if (type === 'weekly') {
    return `Week of ${date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}`;
  }
  return date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
}

function renderMasthead(type: NewsletterType, itemCount: number): string {
  const wordmark = type === 'weekly' ? 'AI UX WEEKLY' : 'AI UX DAILY';
  const dateStr = formatIssueDate(type);
  const itemLabel = itemCount === 1 ? 'story' : 'stories';

  return `
<div style="padding: 0 0 28px 0; margin: 0 0 36px 0; border-bottom: 1px solid ${EMAIL_HAIRLINE};">
  <p style="margin: 0 0 10px; font-size: 12px; font-weight: 700; color: ${EMAIL_SUBTLE}; letter-spacing: 2px; text-transform: uppercase;">${wordmark}</p>
  <p style="margin: 0 0 4px; font-size: 15px; font-weight: 600; color: ${EMAIL_INK}; letter-spacing: -0.1px;">${dateStr}</p>
  <p style="margin: 0; font-size: 13px; color: ${EMAIL_MUTED};">${itemCount} ${itemLabel} · curated for designers</p>
</div>`.trim();
}

function renderSectionHeader(kicker: string, title: string): string {
  return `
<p style="margin: 0 0 10px; font-size: 11px; font-weight: 700; color: ${EMAIL_SUBTLE}; letter-spacing: 2px; text-transform: uppercase;">${kicker}</p>
<h2 style="margin: 0 0 40px; font-size: 26px; font-weight: 700; color: ${EMAIL_INK}; letter-spacing: -0.4px; line-height: 1.25;">${ICON_NEWSPAPER}${title}</h2>`.trim();
}

function renderStoryCard(item: NewsletterItem, isLast: boolean): string {
  const separator = isLast
    ? ''
    : `\n<div style="text-align: center; margin: 40px 0; color: #64748b; letter-spacing: 12px; font-size: 18px;">· · ·</div>`;

  return `
<div style="margin: 0; padding: 0;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 12px;"><tr>
    <td style="font-size: 11px; color: ${EMAIL_SUBTLE}; font-weight: 600; text-transform: uppercase; letter-spacing: 0.8px;">${getProductIconImg(item.product)}${item.product}</td>
    <td align="right" style="font-size: 13px; color: ${EMAIL_MUTED};">${item.date}</td>
  </tr></table>
  <h3 style="margin: 0 0 14px; font-size: 22px; font-weight: 700; color: ${EMAIL_INK}; line-height: 1.35; letter-spacing: -0.2px;">${item.headline}</h3>
  <p style="margin: 0 0 16px; font-size: 16px; line-height: 1.7; color: ${EMAIL_TEXT};">${item.description}</p>
  <p style="margin: 0 0 24px;"><a href="${item.sourceUrl}" target="_blank" rel="noopener" style="display: inline-block; font-size: 13px; color: ${EMAIL_INK}; text-decoration: underline; text-underline-offset: 3px; font-weight: 500;">Read the source →</a></p>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin: 0 0 24px;">
    <tr>
      <td valign="top" style="width: 32px; padding: 0; font-size: 40px; line-height: 1; color: ${EMAIL_INK}; font-weight: 700; font-family: Georgia, 'Times New Roman', serif;">&ldquo;</td>
      <td valign="top" style="padding: 2px 0 0 4px;">
        <p style="margin: 0 0 8px; font-size: 16px; line-height: 1.6; color: ${EMAIL_INK}; font-style: italic;">${item.designerTakeaway}</p>
        <p style="margin: 0; font-size: 11px; font-weight: 600; color: ${EMAIL_SUBTLE}; letter-spacing: 0.8px; text-transform: uppercase;">— Designer's Takeaway</p>
      </td>
    </tr>
  </table>
  <p style="margin: 0;"><a href="${SITE_URL}/patterns/${item.patternSlug}" target="_blank" rel="noopener" style="display: inline-block; background-color: transparent; color: ${EMAIL_INK}; padding: 8px 14px; border: 1px solid ${EMAIL_HAIRLINE}; border-radius: 999px; font-size: 12px; font-weight: 500; text-decoration: none; letter-spacing: 0.2px;"><span style="color: ${EMAIL_MUTED}; font-weight: 600; text-transform: uppercase; letter-spacing: 0.8px; font-size: 10px; margin-right: 6px;">Pattern</span>${getPatternTitle(item.patternSlug)} →</a></p>
</div>${separator}`.trim();
}

function renderDarkCallout(opts: {
  kicker: string;
  title: string;
  body: string;
  subBody?: string;
  cta?: { label: string; href: string };
}): string {
  const subBodyHTML = opts.subBody
    ? `\n  <p style="margin: 16px 0 0; font-size: 16px; line-height: 1.7; color: ${DARK_TEXT};"><strong style="color: ${DARK_STRONG};">When to use it:</strong> ${opts.subBody}</p>`
    : '';
  const ctaHTML = opts.cta
    ? `\n  <p style="margin: 20px 0 0;"><a href="${opts.cta.href}" target="_blank" rel="noopener" style="color: ${DARK_LINK}; text-decoration: underline; text-underline-offset: 3px; font-size: 14px; font-weight: 500;">${opts.cta.label} →</a></p>`
    : '';

  return `
<div style="background-color: ${DARK_CANVAS}; padding: 32px; border-radius: 16px; margin: 0 0 32px;">
  <p style="margin: 0 0 14px; font-size: 11px; font-weight: 700; color: rgba(255, 255, 255, 0.6); letter-spacing: 2px; text-transform: uppercase;">${opts.kicker}</p>
  <h2 style="margin: 0 0 16px; font-size: 22px; font-weight: 700; color: ${DARK_STRONG}; letter-spacing: -0.3px; line-height: 1.3;">${opts.title}</h2>
  <p style="margin: 0; font-size: 16px; line-height: 1.7; color: ${DARK_TEXT};">${opts.body}</p>${subBodyHTML}${ctaHTML}
</div>`.trim();
}

function renderFooterCTA(type: NewsletterType): string {
  const wordmark = type === 'weekly' ? 'AI UX WEEKLY' : 'AI UX DAILY';
  return `
<div style="margin: 56px 0 0; padding: 32px 0 0; border-top: 1px solid ${EMAIL_HAIRLINE}; text-align: center;">
  <p style="margin: 0 0 6px; font-size: 11px; font-weight: 700; color: ${EMAIL_SUBTLE}; letter-spacing: 2px; text-transform: uppercase;">${wordmark}</p>
  <p style="margin: 0 0 10px; font-size: 14px; color: ${EMAIL_MUTED};">Curated by Imran at aiuxdesign.guide</p>
  <p style="margin: 0; font-size: 13px;"><a href="${SITE_URL}/news" target="_blank" rel="noopener" style="color: ${EMAIL_INK}; text-decoration: underline; text-underline-offset: 3px; font-weight: 500;">Read past issues →</a></p>
</div>`.trim();
}

// Announcement banner — top-of-issue marketing block. Toggle by setting
// NEWSLETTER_ANNOUNCEMENT=off in env to disable, or remove the call site
// in generateHTML when this campaign ends.
function renderAnnouncementBanner(): string {
  if (process.env.NEWSLETTER_ANNOUNCEMENT === 'off') return '';
  // Grain canvas + white inner card mirrors the homepage section pattern
  // (Footer / SocialProof "Keep exploring"): bg-background-grain wrapper with
  // a bg-background-primary card lifted on top.
  const GRAIN_BG = '#F0F1F5';
  return `
<div style="background-color: ${GRAIN_BG}; padding: 28px; border-radius: 20px; margin: 0 0 40px;">
  <div style="background-color: #ffffff; padding: 32px; border-radius: 14px; border: 1px solid ${EMAIL_HAIRLINE};">
    <p style="margin: 0 0 14px; font-size: 11px; font-weight: 700; color: ${EMAIL_SUBTLE}; letter-spacing: 2px; text-transform: uppercase;">Three things new at aiuxdesign.guide</p>
    <h2 style="margin: 0 0 24px; font-size: 22px; font-weight: 700; color: ${EMAIL_INK}; letter-spacing: -0.3px; line-height: 1.3;">Free AI UX audit, Courses, and a dedicated Patterns page</h2>

    <p style="margin: 0 0 16px; font-size: 16px; line-height: 1.65; color: ${EMAIL_TEXT};"><strong style="color: ${EMAIL_INK};">1. Free AI UX audit on the homepage.</strong> Paste a screenshot of any AI interface, drop your email, and get pattern-grounded findings instantly. <a href="${SITE_URL}/" target="_blank" rel="noopener" style="color: ${EMAIL_INK}; text-decoration: underline; text-underline-offset: 3px; font-weight: 500;">Try the audit →</a></p>

    <p style="margin: 0 0 16px; font-size: 16px; line-height: 1.65; color: ${EMAIL_TEXT};"><strong style="color: ${EMAIL_INK};">2. Guides are now Courses.</strong> The Claude Code Course gets updated every time Anthropic ships — same goes for Cursor, GitHub Copilot, and Claude Design. <a href="${SITE_URL}/guides" target="_blank" rel="noopener" style="color: ${EMAIL_INK}; text-decoration: underline; text-underline-offset: 3px; font-weight: 500;">Browse all courses →</a></p>

    <p style="margin: 0 0 28px; font-size: 16px; line-height: 1.65; color: ${EMAIL_TEXT};"><strong style="color: ${EMAIL_INK};">3. Patterns has its own page.</strong> All 36 AI UX patterns now live at <a href="${SITE_URL}/patterns" target="_blank" rel="noopener" style="color: ${EMAIL_INK}; text-decoration: underline; text-underline-offset: 3px; font-weight: 500;">/patterns</a> with search and category filters.</p>

    <div style="border-top: 1px solid ${EMAIL_HAIRLINE}; padding-top: 22px;">
      <p style="margin: 0 0 8px; font-size: 11px; font-weight: 700; color: ${EMAIL_SUBTLE}; letter-spacing: 2px; text-transform: uppercase;">Want unlimited audits?</p>
      <p style="margin: 0; font-size: 15px; line-height: 1.65; color: ${EMAIL_TEXT};">We're looking for a small group of designers to run repeated audits and tell us where the tool's weak — what it misses, what it gets wrong, where the UX trips up. Hit reply with the word <strong style="color: ${EMAIL_INK};">volunteer</strong> and we'll set you up with unlimited audit access in exchange for honest feedback.</p>
    </div>
  </div>
</div>`.trim();
}

function wrapEmailShell(inner: string): string {
  return `<div style="font-family: ${EMAIL_FONT_STACK}; color: ${EMAIL_INK}; max-width: 640px; margin: 0 auto; padding: 0 8px;">
${inner}
</div>`.trim();
}

function generateHTML(data: NewsletterData): string {
  const items = data.items
    .map((item, idx) => renderStoryCard(item, idx === data.items.length - 1))
    .join('\n\n');

  const takeaway = renderDarkCallout({
    kicker: "Today's Idea",
    title: data.takeaway.title,
    body: data.takeaway.body,
  });

  // Note: data.summary is intentionally NOT rendered in the email body. It
  // already lives in the page <title>/meta description, the email subject
  // line preview, and the admin review header — repeating it as the lead
  // paragraph was redundant. The "Today's Idea" callout at the bottom
  // (data.takeaway) carries the editorial framing instead.
  const body = `
${renderMasthead('daily', data.items.length)}

${renderSectionHeader('The stories', 'Today in AI Products')}

${items}

<div style="height: 56px; line-height: 56px; font-size: 1px;">&nbsp;</div>

${takeaway}

${renderAnnouncementBanner()}

${renderFooterCTA('daily')}
  `.trim();

  return wrapEmailShell(body);
}

function generateWeeklyHTML(data: WeeklyNewsletterData): string {
  const items = data.items
    .map((item, idx) => renderStoryCard(item, idx === data.items.length - 1))
    .join('\n\n');

  const stealThis = renderDarkCallout({
    kicker: 'Steal this week',
    title: `${data.stealThisWeek.product}'s ${data.stealThisWeek.feature}`,
    body: data.stealThisWeek.insight,
  });

  const patternToKnow = renderDarkCallout({
    kicker: 'Pattern deep-dive',
    title: getPatternTitle(data.patternToKnow.patternSlug),
    body: data.patternToKnow.explanation,
    subBody: data.patternToKnow.whenToUse,
    cta: {
      label: `Deep dive on ${getPatternTitle(data.patternToKnow.patternSlug)}`,
      href: `${SITE_URL}/patterns/${data.patternToKnow.patternSlug}`,
    },
  });

  // Note: data.summary is intentionally NOT rendered in the email body. It
  // already lives in the page <title>/meta description, the email subject
  // line preview, and the admin review header. data.weeklyTakeaway carries
  // the editorial framing of the week and stays as the lead paragraph.
  const body = `
${renderMasthead('weekly', data.items.length)}

<p style="margin: 0 0 48px; font-size: 17px; line-height: 1.7; color: ${EMAIL_TEXT};">${data.weeklyTakeaway}</p>

${renderSectionHeader('The stories', 'This Week in AI Products')}

${items}

<div style="height: 56px; line-height: 56px; font-size: 1px;">&nbsp;</div>

${stealThis}

${patternToKnow}

${renderFooterCTA('weekly')}
  `.trim();

  return wrapEmailShell(body);
}

function generateSlug(title: string, type: NewsletterType = 'daily'): string {
  const date = new Date();
  const monthDay = date
    .toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    .replace(' ', '-')
    .toLowerCase();

  const titleSlug = title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 60);

  const prefix = type === 'weekly' ? 'this-week-in-aiux' : 'ai-ux-daily';
  return `${prefix}-${monthDay}-${titleSlug}`;
}

async function sendAdminEmail(subject: string, html: string) {
  if (!resend || !process.env.ADMIN_EMAIL) return;
  try {
    await resend.emails.send({
      from: 'AI UX Daily <imran@aiuxdesign.guide>',
      replyTo: 'imranrizom@gmail.com',
      to: process.env.ADMIN_EMAIL,
      subject,
      html,
    });
  } catch (error) {
    console.error('[newsletter] Failed to send admin email:', error);
  }
}

async function sendAdminNotification(
  draft: { id: string; title: string; summary: string },
  previewUrl: string
) {
  const approveUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/newsletter/publish?id=${draft.id}&secret=${process.env.ADMIN_APPROVE_SECRET}`;
  await sendAdminEmail(
    `📰 Newsletter Draft Ready: ${draft.title}`,
    `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="font-size: 24px; color: #0f172a;">Newsletter Draft Ready</h1>

        <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h2 style="margin: 0 0 10px; font-size: 18px;">${draft.title}</h2>
          <p style="margin: 0; color: #64748b;">${draft.summary}</p>
        </div>

        <p>A new AI UX Daily newsletter has been generated and is waiting for your review.</p>

        <div style="margin: 30px 0;">
          <a href="${previewUrl}" style="display: inline-block; padding: 12px 24px; background: #0f172a; color: #fff; text-decoration: none; border-radius: 6px; margin-right: 10px;">Preview & Edit</a>
          <a href="${approveUrl}" style="display: inline-block; padding: 12px 24px; background: #10b981; color: #fff; text-decoration: none; border-radius: 6px;">Quick Approve</a>
        </div>

        <p style="color: #94a3b8; font-size: 14px;">Approving publishes on-site. You'll then copy the HTML from the admin dashboard and paste it into Beehiiv to send.</p>
      </div>
    `
  );
}

async function sendFailureAlert(type: NewsletterType, error: unknown) {
  const errorMessage = error instanceof Error ? error.message : String(error);
  const errorStack = error instanceof Error ? error.stack : '';
  await sendAdminEmail(
    `⚠️ Newsletter Generation Failed (${type})`,
    `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="font-size: 24px; color: #dc2626;">Newsletter Generation Failed</h1>
        <p>The <strong>${type}</strong> newsletter failed to generate at ${new Date().toISOString()}.</p>

        <div style="background: #fef2f2; border: 1px solid #fecaca; padding: 16px; border-radius: 8px; margin: 20px 0;">
          <p style="margin: 0 0 8px; font-weight: 600; color: #991b1b;">Error:</p>
          <pre style="margin: 0; font-size: 13px; color: #991b1b; white-space: pre-wrap; word-break: break-word;">${errorMessage}</pre>
          ${errorStack ? `<details style="margin-top: 12px;"><summary style="cursor: pointer; color: #991b1b; font-size: 13px;">Stack trace</summary><pre style="margin-top: 8px; font-size: 12px; color: #6b7280; white-space: pre-wrap;">${errorStack}</pre></details>` : ''}
        </div>

        <p>You can trigger it manually:</p>
        <pre style="background: #f1f5f9; padding: 12px; border-radius: 6px; font-size: 13px; overflow-x: auto;">curl -H "Authorization: Bearer $CRON_SECRET" \\
"${SITE_URL}/api/cron/generate-newsletter${type === 'weekly' ? '?type=weekly' : ''}"</pre>
      </div>
    `
  );
}

// Compute the QA telemetry block stashed on NewsletterDraft.structuredData.qa.
// Read by the admin review screen so a human can see source mix and the
// design-light flag at a glance before clicking Publish.
interface NewsletterQA {
  sourceCounts: Record<string, number>; // post-Claude final selection
  designNativeCount: number;            // items from design-pub/design-tool tiers OR with >=2 design keywords
  designLightWarning: boolean;          // true iff designNativeCount === 0
  poolSize: number;                     // items Claude saw after pool-cap filter
  duplicateSourceClipped: string[];     // sources trimmed by MAX_ITEMS_PER_SOURCE
  opinionCount: number;                 // items from known opinion domains (uxdesign.cc, uxplanet.org, lennysnewsletter.com, *.substack.com, medium.com)
  productNewsCount: number;             // items from ai-lab or design-tool tiers (concrete product launches)
  selectionRuleViolation: string | null; // non-null when a hard selection rule failed; triggers auto-quiet
}

// Opinion-domain detection. The prompt already names uxdesign.cc/uxplanet.org/
// lennysnewsletter.com but Claude routinely picks Substack pieces (which slip
// through because they aren't on the named list). Treat all Substack and Medium
// hosts as opinion since they're personal-publishing platforms.
function isOpinionUrl(url: string): boolean {
  try {
    const host = new URL(url).hostname.toLowerCase().replace(/^www\./, '');
    if (host === 'uxdesign.cc' || host === 'uxplanet.org' || host === 'lennysnewsletter.com') return true;
    if (host === 'medium.com' || host.endsWith('.medium.com')) return true;
    if (host === 'substack.com' || host.endsWith('.substack.com')) return true;
    return false;
  } catch {
    return false;
  }
}

// One-shot retry directive appended to the original prompt when Claude's first
// pass violates the selection rules but the pool actually contained eligible
// product-news items. Names the URLs explicitly so Claude can't ignore them.
function buildSelectionRetryAddendum(pool: NewsItem[], violation: string): string {
  const productNewsItems = pool
    .filter((it) => it.sourceTier === 'ai-lab' || it.sourceTier === 'design-tool')
    .slice(0, 12);
  if (productNewsItems.length === 0) return '';
  const lines = productNewsItems
    .map((it) => `- ${it.source}: ${it.title} (${it.link})`)
    .join('\n');
  return `

CRITICAL RETRY — your previous selection violated the rules: ${violation}.

You MUST include AT LEAST ONE item from this list of concrete product-news sources that were in the pool. Pick the most designer-relevant one:

${lines}

You MUST exclude all opinion-source URLs (uxdesign.cc, uxplanet.org, lennysnewsletter.com, *.substack.com, medium.com) from your final selection — opinion count MUST be 0. Return the same JSON shape as before.`;
}

function buildQABlock(
  selectedItems: NewsletterItem[],
  pool: NewsItem[],
  clippedSources: string[],
): NewsletterQA {
  // Index the pool by link AND by hostname. The hostname index handles cases
  // where Claude's reproduced sourceUrl doesn't byte-match the pool link
  // (tracking params, redirect URLs, trailing slashes) — without it we miss
  // most non-AI-lab items and undercount design-native.
  const poolByLink = new Map<string, NewsItem>();
  const poolByHost = new Map<string, NewsItem>();
  for (const item of pool) {
    if (item.link) {
      poolByLink.set(item.link, item);
      try {
        const host = new URL(item.link).hostname;
        // Don't overwrite a richer match — first item per host wins for the
        // fallback. Real per-source tier is uniform within a feed anyway.
        if (!poolByHost.has(host)) poolByHost.set(host, item);
      } catch {
        // ignore malformed URLs
      }
    }
  }

  const resolveOriginal = (sourceUrl: string): NewsItem | undefined => {
    const direct = poolByLink.get(sourceUrl);
    if (direct) return direct;
    try {
      return poolByHost.get(new URL(sourceUrl).hostname);
    } catch {
      return undefined;
    }
  };

  const sourceCounts: Record<string, number> = {};
  let designNativeCount = 0;
  let opinionCount = 0;
  let productNewsCount = 0;
  for (const sel of selectedItems) {
    const original = resolveOriginal(sel.sourceUrl);
    // Prefer the upstream RSS source name; fall back to Claude's product label
    // when we can't resolve back (e.g. compilation path from daily items).
    const sourceLabel = original?.source || sel.product || 'Unknown';
    sourceCounts[sourceLabel] = (sourceCounts[sourceLabel] || 0) + 1;
    if (original && isDesignNativeItem(original, original.sourceTier)) {
      designNativeCount += 1;
    }
    if (isOpinionUrl(sel.sourceUrl)) {
      opinionCount += 1;
    }
    // Concrete product news = items from an ai-lab or design-tool feed. The
    // prompt names these as the eligible "product launch" sources. Use the
    // pool's tier rather than Claude's product label so we can't be fooled
    // by a hand-tagged "OpenAI" item that's actually a Medium opinion piece.
    if (original && (original.sourceTier === 'ai-lab' || original.sourceTier === 'design-tool')) {
      productNewsCount += 1;
    }
  }

  // Hard selection rules for daily issues. Violations route to auto-quiet so
  // we don't ship opinion-heavy filler when the pool can't support real news.
  // Two violation types:
  //   1) productNewsCount < 1 → no concrete launch in the issue at all.
  //   2) opinionCount > 0 → any opinion item disqualifies the issue.
  // Pool-aware escape hatch: if the pool genuinely contained zero ai-lab or
  // design-tool items, rule (1) doesn't fire — there's nothing better Claude
  // could have picked, and shipping 4 design-pub items is acceptable.
  const poolHadProductNews = pool.some(
    (it) => it.sourceTier === 'ai-lab' || it.sourceTier === 'design-tool',
  );
  let selectionRuleViolation: string | null = null;
  if (productNewsCount < 1 && poolHadProductNews) {
    selectionRuleViolation = `no_product_news (pool had ${pool.filter((it) => it.sourceTier === 'ai-lab' || it.sourceTier === 'design-tool').length} product-news items but Claude picked 0)`;
  } else if (opinionCount > 0) {
    selectionRuleViolation = `opinion_present (${opinionCount} opinion items, max 0)`;
  }

  return {
    sourceCounts,
    designNativeCount,
    designLightWarning: designNativeCount === 0,
    poolSize: pool.length,
    duplicateSourceClipped: clippedSources,
    opinionCount,
    productNewsCount,
    selectionRuleViolation,
  };
}

// Core generation logic — separated so it can be retried in lite mode on failure.
// forceRSS: when true on a weekly run, bypass the daily-compilation path and
// pull a fresh RSS pool through the new tiered scoring instead. Used for one-off
// regeneration after sources/scoring changes, when prior daily items are stale.
async function runGeneration(
  type: NewsletterType,
  lookbackHours: number,
  deduplicationDays: number,
  todayStart: Date,
  tomorrowStart: Date,
  lite = false,
  forceRSS = false,
): Promise<void> {
  const mode = lite ? 'lite' : 'full';
  console.log(`[newsletter] Starting ${mode} ${type} generation (${lite ? `${RSS_SOURCES_LITE.length} sources` : `${RSS_SOURCES.length} sources + Anthropic scraper`})${forceRSS ? ' [forceRSS]' : ''}`);

  // Step 1: Aggregate news
  const { items: newsItems, clippedSources } = await aggregateNews(lookbackHours, deduplicationDays, { lite });

  // Handle quiet days (only for daily — weekly falls through to daily compilation)
  if (newsItems.length === 0 && type === 'daily') {
    const quietDayMessages = [
      { title: 'A Quiet Day in AI', message: 'No major AI updates today. Perfect time to explore a new pattern or refine your designs.' },
      { title: 'The AI World Takes a Breath', message: 'Nothing groundbreaking today. Why not revisit a pattern you haven\'t explored yet?' },
      { title: 'Slow News Day', message: 'The AI feeds are quiet. A good day to focus on craft over chaos.' },
      { title: 'Design Day', message: 'No AI news to distract you. Go design something beautiful.' },
      { title: 'All Quiet on the AI Front', message: 'Major players are silent today. Time to catch up on patterns you bookmarked.' },
    ];

    const randomMessage = quietDayMessages[Math.floor(Math.random() * quietDayMessages.length)];
    const date = new Date();
    const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    const slug = `ai-ux-daily-${dateStr.replace(' ', '-').toLowerCase()}-quiet-day`;

    const existingQuietDay = await prisma.newsletterDraft.findFirst({ where: { slug } });
    if (existingQuietDay) {
      console.log('[newsletter] Quiet day entry already exists for today');
      return;
    }

    await prisma.newsletterDraft.create({
      data: {
        title: `AI UX Daily: ${randomMessage.title}`,
        slug,
        summary: randomMessage.message,
        content: '',
        publishDate: new Date(),
        status: 'pending_review',
        sources: [],
      },
    });
    console.log('[newsletter] Quiet day entry created (pending_review)');
    return;
  }

  // Lopsided-pool guard (daily only): if one source dominates the candidate pool,
  // skip rather than ship a newsletter where every item links to the same publisher.
  // Weekly compiles from already-curated daily items, so this guard doesn't apply.
  if (type === 'daily') {
    const dominant = findDominantSource(newsItems);
    if (dominant) {
      console.warn(
        `[newsletter] Lopsided pool detected: ${dominant.count}/${newsItems.length} items (${Math.round(dominant.share * 100)}%) from ${dominant.source}. Skipping rather than shipping single-source coverage.`,
      );

      const date = new Date();
      const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      const slug = `ai-ux-daily-${dateStr.replace(' ', '-').toLowerCase()}-single-source-day`;

      const existingSkip = await prisma.newsletterDraft.findFirst({ where: { slug } });
      if (existingSkip) {
        console.log('[newsletter] Single-source-day entry already exists for today');
        return;
      }

      await prisma.newsletterDraft.create({
        data: {
          title: 'AI UX Daily: Single-Source Day',
          slug,
          summary: `Today's news pool was dominated by a single source (${dominant.source}). Rather than ship lopsided coverage, we're sitting this one out. Back tomorrow with broader updates.`,
          content: '',
          publishDate: new Date(),
          status: 'pending_review',
          sources: newsItems.map((item) => item.link),
        },
      });
      console.log('[newsletter] Single-source-day entry created (pending_review)');
      return;
    }
  }

  // Step 2: Fetch recently used headlines for deduplication
  const recentHeadlines = await getRecentlyUsedTitles(deduplicationDays);

  // Step 3: Generate newsletter with Claude
  let prompt: string;
  let structuredData: NewsletterData | WeeklyNewsletterData | null = null;
  let dailyItemsUsed: NewsletterItem[] = [];

  if (type === 'weekly') {
    const dailyItems = forceRSS ? [] : await getDailyNewsletterItems(7);
    if (dailyItems.length >= 3) {
      console.log(`[newsletter] Weekly: compiling from ${dailyItems.length} daily items`);
      prompt = buildWeeklyCompilationPrompt(dailyItems);
      dailyItemsUsed = dailyItems;
    } else if (newsItems.length > 0) {
      console.log(`[newsletter] Weekly: ${forceRSS ? 'forceRSS=true, bypassing daily compilation' : `only ${dailyItems.length} daily items`}, using ${newsItems.length} RSS items instead`);
      prompt = buildWeeklyPrompt(newsItems, recentHeadlines);
    } else {
      throw new Error(`Weekly newsletter had 0 usable content — ${dailyItems.length} daily items (need 3+), 0 RSS items`);
    }
  } else {
    prompt = buildPrompt(newsItems, recentHeadlines);
  }

  const claudeController = new AbortController();
  const claudeTimeoutMs = type === 'weekly' ? 45000 : 25000;
  const claudeTimeout = setTimeout(() => claudeController.abort(), claudeTimeoutMs);
  let response;
  try {
    response = await anthropic.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: type === 'weekly' ? 4096 : 2048,
      messages: [{ role: 'user', content: prompt }],
    }, { signal: claudeController.signal });
  } finally {
    clearTimeout(claudeTimeout);
  }

  const responseText =
    response.content[0].type === 'text' ? response.content[0].text : '';

  // Parse Claude's response
  let htmlContent: string;
  let title: string;
  let summary: string;

  let parsedData;
  try {
    const jsonMatch =
      responseText.match(/```json\s*([\s\S]*?)\s*```/) ||
      responseText.match(/```\s*([\s\S]*?)\s*```/) || [null, responseText];
    parsedData = JSON.parse(jsonMatch[1] || responseText);
  } catch (parseError) {
    throw new Error(`Failed to parse Claude response as JSON: ${(parseError as Error).message}\nResponse preview: ${responseText.slice(0, 200)}`);
  }

  if (type === 'weekly') {
    const weeklyData = parsedData as WeeklyNewsletterData;
    htmlContent = generateWeeklyHTML(weeklyData);
    title = weeklyData.title;
    summary = weeklyData.summary;
    structuredData = weeklyData;
  } else {
    const dailyData = parsedData as NewsletterData;
    htmlContent = generateHTML(dailyData);
    title = dailyData.title;
    summary = dailyData.summary;
    structuredData = dailyData;
  }

  // Compute QA telemetry from the final selection. For weekly compilation runs,
  // the selected items came from prior daily NewsletterItems (no NewsItem pool
  // to map back to), so source/tier resolution falls through to Claude's
  // product label and tier-based design-native check is skipped for those.
  let qa = buildQABlock(structuredData.items, newsItems, clippedSources);
  if (qa.designLightWarning) {
    console.warn(`[newsletter] Design-light: 0 design-native items in final selection (pool: ${qa.poolSize}). Routing to admin review.`);
  }
  console.log(`[newsletter] QA: ${qa.designNativeCount}/${structuredData.items.length} design-native, opinion=${qa.opinionCount}, productNews=${qa.productNewsCount}, sources: ${JSON.stringify(qa.sourceCounts)}`);

  // One-shot retry on selection-rule violation (daily only). Claude routinely
  // ignores the prompt's product-news floor / opinion cap on first pass even
  // when the pool has eligible items. Re-prompting once with explicit URLs
  // typically fixes it; falling through to auto-quiet stays the backstop.
  if (type === 'daily' && qa.selectionRuleViolation) {
    const addendum = buildSelectionRetryAddendum(newsItems, qa.selectionRuleViolation);
    if (addendum) {
      console.warn(`[newsletter] Selection rule violated on first pass: ${qa.selectionRuleViolation}. Retrying with hardened prompt.`);
      const retryController = new AbortController();
      const retryTimeout = setTimeout(() => retryController.abort(), 25000);
      try {
        const retryResponse = await anthropic.messages.create({
          model: 'claude-haiku-4-5-20251001',
          max_tokens: 2048,
          messages: [{ role: 'user', content: prompt + addendum }],
        }, { signal: retryController.signal });
        const retryText = retryResponse.content[0].type === 'text' ? retryResponse.content[0].text : '';
        const retryMatch =
          retryText.match(/```json\s*([\s\S]*?)\s*```/) ||
          retryText.match(/```\s*([\s\S]*?)\s*```/) || [null, retryText];
        const retryParsed = JSON.parse(retryMatch[1] || retryText) as NewsletterData;
        const retryQA = buildQABlock(retryParsed.items, newsItems, clippedSources);
        if (!retryQA.selectionRuleViolation) {
          console.log(`[newsletter] Retry succeeded — productNews=${retryQA.productNewsCount}, opinion=${retryQA.opinionCount}`);
          structuredData = retryParsed;
          htmlContent = generateHTML(retryParsed);
          title = retryParsed.title;
          summary = retryParsed.summary;
          qa = retryQA;
        } else {
          console.warn(`[newsletter] Retry still violating: ${retryQA.selectionRuleViolation}. Falling through to auto-quiet.`);
        }
      } catch (retryError) {
        console.warn(`[newsletter] Retry failed: ${(retryError as Error).message}. Falling through to auto-quiet.`);
      } finally {
        clearTimeout(retryTimeout);
      }
    }
  }

  // Selection-rule guard (daily only): if Claude ignored its own counted rules
  // for opinion/product-news mix even after retry, auto-quiet the day instead
  // of shipping filler. Weekly compilations re-pick from already-curated daily
  // items, so the rule doesn't apply there.
  if (type === 'daily' && qa.selectionRuleViolation) {
    console.warn(`[newsletter] Selection rule violated: ${qa.selectionRuleViolation}. Auto-quieting today.`);
    const date = new Date();
    const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    const slug = `ai-ux-daily-${dateStr.replace(' ', '-').toLowerCase()}-opinion-heavy-day`;

    const existing = await prisma.newsletterDraft.findFirst({ where: { slug } });
    if (existing) {
      console.log('[newsletter] Opinion-heavy-day entry already exists for today');
      return;
    }

    const summaryMsg = qa.productNewsCount < 1
      ? "Today's pool didn't surface a concrete AI product launch worth your inbox. We're sitting this one out — back tomorrow with real news."
      : "Today's mix leaned heavily on opinion pieces over product news. Rather than circulate filler, we're sitting this one out.";

    await prisma.newsletterDraft.create({
      data: {
        title: 'AI UX Daily: Quiet Day — Opinion-Heavy Pool',
        slug,
        summary: summaryMsg,
        content: '',
        publishDate: new Date(),
        status: 'pending_review',
        type: 'daily',
        sources: newsItems.map((item) => item.link),
        structuredData: { ...structuredData, qa } as object,
      },
    });
    console.log('[newsletter] Opinion-heavy-day entry created (pending_review)');
    return;
  }

  const structuredDataWithQA = { ...structuredData, qa };

  // Save draft (re-check for duplicates to guard against race conditions from concurrent triggers)
  const slug = generateSlug(title, type);
  const duplicateCheck = await prisma.newsletterDraft.findFirst({
    where: {
      type,
      createdAt: { gte: todayStart, lt: tomorrowStart },
      status: { in: ['published', 'pending_review'] },
    },
  });
  if (duplicateCheck) {
    console.log(`[newsletter] Skipped: ${type} newsletter was created by a concurrent request (${duplicateCheck.id})`);
    return;
  }

  const draft = await prisma.newsletterDraft.create({
    data: {
      title,
      slug,
      summary,
      content: htmlContent,
      publishDate: new Date(),
      status: 'pending_review',
      type,
      sources: type === 'weekly' && dailyItemsUsed.length > 0
        ? dailyItemsUsed.map((item) => item.sourceUrl)
        : newsItems.map((item) => item.link),
      structuredData: structuredDataWithQA as object,
    },
  });

  // Send admin notification
  const previewUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/admin/newsletter?id=${draft.id}`;
  await sendAdminNotification(draft, previewUrl).catch((err) =>
    console.error('Admin notification failed:', err)
  );

  revalidatePath('/news');
  revalidatePath(`/news/${draft.slug}`);
  console.log(`[newsletter] Generated ${type} newsletter: "${draft.title}" (${draft.id})`);
}

// Background generation logic — runs inside after() so the HTTP response is sent immediately
async function generateNewsletter(type: NewsletterType, forceRegenerate: boolean, customLookbackHours: string | null, forceRSS = false) {
  console.log(`[newsletter] Config: ANTHROPIC_API_KEY=${!!process.env.ANTHROPIC_API_KEY}, RESEND_API_KEY=${!!process.env.RESEND_API_KEY}, BEEHIIV=${!!process.env.BEEHIIV_API_KEY}, HEALTHCHECK_DAILY=${!!process.env.HEALTHCHECK_PING_URL_DAILY}, HEALTHCHECK_WEEKLY=${!!process.env.HEALTHCHECK_PING_URL_WEEKLY}`);

  const todayStart = new Date();
  todayStart.setUTCHours(0, 0, 0, 0);
  const tomorrowStart = new Date(todayStart);
  tomorrowStart.setUTCDate(tomorrowStart.getUTCDate() + 1);

  const existingNewsletter = await prisma.newsletterDraft.findFirst({
    where: {
      type,
      createdAt: { gte: todayStart, lt: tomorrowStart },
      status: { in: ['published', 'pending_review'] },
    },
  });

  if (existingNewsletter) {
    if (forceRegenerate) {
      await prisma.newsletterDraft.delete({ where: { id: existingNewsletter.id } });
    } else {
      console.log(`[newsletter] Skipped: ${type} newsletter already exists for today (${existingNewsletter.id})`);
      await pingHealthcheck(type);
      return;
    }
  }

  const lookbackHours = customLookbackHours
    ? parseInt(customLookbackHours, 10)
    : (type === 'weekly' ? 168 : 72);
  const deduplicationDays = type === 'weekly' ? 30 : 7;

  try {
    await runGeneration(type, lookbackHours, deduplicationDays, todayStart, tomorrowStart, false, forceRSS);
    await pingHealthcheck(type);
  } catch (error) {
    console.error('[newsletter] Full generation failed, retrying in lite mode:', error);
    try {
      await runGeneration(type, lookbackHours, deduplicationDays, todayStart, tomorrowStart, true, forceRSS);
      await pingHealthcheck(type);
    } catch (retryError) {
      console.error('[newsletter] Lite retry also failed:', retryError);
      await pingHealthcheck(type, true);
      await sendFailureAlert(type, retryError);
    }
  }
}

// Ping Healthchecks.io dead man's switch after newsletter generation.
// If the ping doesn't arrive on schedule, Healthchecks sends an alert.
// Set HEALTHCHECK_PING_URL_DAILY and HEALTHCHECK_PING_URL_WEEKLY in env.
async function pingHealthcheck(type: NewsletterType, failed = false) {
  const envKey = type === 'weekly' ? 'HEALTHCHECK_PING_URL_WEEKLY' : 'HEALTHCHECK_PING_URL_DAILY';
  const pingUrl = process.env[envKey];
  if (!pingUrl) return;

  try {
    await fetch(failed ? `${pingUrl}/fail` : pingUrl, { method: 'GET' });
  } catch (err) {
    // Non-critical — don't let monitoring failure break newsletter generation
    console.error('[newsletter] Healthcheck ping failed:', err);
  }
}

export async function GET(request: NextRequest) {
  // Verify cron secret
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const url = new URL(request.url);
  const requestedType = url.searchParams.get('type') as NewsletterType | null;
  const forceRegenerate = url.searchParams.get('force') === 'true';
  const customLookbackHours = url.searchParams.get('lookbackHours');
  // forceRSS=true on a weekly run bypasses the daily-compilation path and pulls
  // a fresh RSS pool through the new tiered scoring. Use after sources/scoring
  // changes when prior daily items are still from the old pipeline.
  const forceRSS = url.searchParams.get('forceRSS') === 'true';

  // Auto-detect Monday: always generate weekly on Mondays, regardless of query param.
  // This prevents the recurring issue where cron-job.org's weekly job fails to fire
  // and the daily job generates a daily newsletter instead of the expected weekly.
  const isMonday = new Date().getUTCDay() === 1;
  const type: NewsletterType = requestedType || (isMonday ? 'weekly' : 'daily');

  // For daily: Skip if a weekly was already published today (quick DB check before responding).
  // If the DB call throws (e.g., Neon cold-start + Vercel cold-start combo seen Apr 21 2026
  // → 500 in 6.5s → lost a day's issue), log and fall through. The duplicate guard inside
  // generateNewsletter (line ~1555) handles races safely; skipping the shortcut at worst
  // does one extra pass of RSS work that gets deduped later.
  if (type === 'daily') {
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setUTCDate(tomorrow.getUTCDate() + 1);

    try {
      const weeklyToday = await prisma.newsletterDraft.findFirst({
        where: {
          type: 'weekly',
          status: { in: ['published', 'pending_review'] },
          createdAt: { gte: today, lt: tomorrow },
        },
      });

      if (weeklyToday) {
        return NextResponse.json({
          success: true,
          message: 'Skipped daily - weekly newsletter already exists for today',
          weeklyId: weeklyToday.id,
          weeklyTitle: weeklyToday.title,
        });
      }
    } catch (err) {
      console.error('[newsletter] Pre-response weekly-dedup query failed, proceeding anyway:', err);
    }
  }

  // Schedule the heavy work (RSS + Claude + DB) to run AFTER the response is sent.
  // This ensures cron-job.org gets a 200 within seconds, while the actual generation
  // continues in the background for up to 60s (Vercel maxDuration).
  after(() => generateNewsletter(type, forceRegenerate, customLookbackHours, forceRSS));

  return NextResponse.json({
    success: true,
    message: `${type} newsletter generation started in background`,
    type,
    startedAt: new Date().toISOString(),
  });
}
