import { NextRequest, NextResponse } from 'next/server';
import { after } from 'next/server';
import { revalidatePath } from 'next/cache';
import Anthropic from '@anthropic-ai/sdk';
import Parser from 'rss-parser';
import { prisma } from '@/lib/prisma';
import { Resend } from 'resend';
import { patterns } from '@/data/patterns';
import { PATTERN_COUNT } from '@/data/pattern-count';
import { AUDIT_PATH } from '@/lib/audit/constants';

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

// RSS per-feed timeout. Hardcoded 3s in prod to fit the 60s Vercel function cap.
// NEWSLETTER_RSS_TIMEOUT_MS lifts it for off-Vercel manual runs (no function cap)
// so slow first-party feeds actually load — mirrors NEWSLETTER_CLAUDE_TIMEOUT_MS.
// Unset in production, so prod behavior is unchanged.
const RSS_TIMEOUT_MS = process.env.NEWSLETTER_RSS_TIMEOUT_MS
  ? parseInt(process.env.NEWSLETTER_RSS_TIMEOUT_MS, 10)
  : 3000;

// Total generation budget that gates the selection retry (protects Vercel's 60s
// function cap). NEWSLETTER_GEN_BUDGET_MS lifts it for off-Vercel manual runs so
// the retry isn't aborted mid-call. Unset in production → prod behavior unchanged.
const GEN_BUDGET_MS = process.env.NEWSLETTER_GEN_BUDGET_MS
  ? parseInt(process.env.NEWSLETTER_GEN_BUDGET_MS, 10)
  : 60000;

const parser = new Parser({
  timeout: RSS_TIMEOUT_MS,
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
  | 'designer-voice'  // individual practitioner X/Twitter feeds via RSS.app bridge
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
  { name: 'Design Systems Collective', url: 'https://designsystemscollective.substack.com/feed', color: '#2563eb', tier: 'design-pub' }, // design systems x AI (added Jul 15 2026)

  // Design opinion — Medium-style think-pieces and strategy essays. Lower
  // baseline (+28) and capped to 1-2 per issue via the prompt: opinion is
  // valuable but should not crowd out concrete news.
  { name: 'UX Collective', url: 'https://uxdesign.cc/feed', color: '#000000', tier: 'design-opinion' },
  { name: 'UX Planet', url: 'https://uxplanet.org/feed', color: '#0066cc', tier: 'design-opinion' },
  { name: "Lenny's Newsletter", url: 'https://www.lennysnewsletter.com/feed', color: '#ff6900', tier: 'design-opinion' },
  { name: 'Jim Nielsen', url: 'https://blog.jim-nielsen.com/feed.xml', color: '#005a9c', tier: 'design-opinion' }, // near-daily design-engineering craft (added Jul 15 2026)
  { name: 'The Looking Glass', url: 'https://lg.substack.com/feed', color: '#7c3aed', tier: 'design-opinion' }, // Julie Zhuo (ex-FB VP Design)
  { name: 'One Useful Thing', url: 'https://www.oneusefulthing.org/feed', color: '#16a34a', tier: 'design-opinion' }, // Ethan Mollick, practical AI
  { name: 'The Shape of AI', url: 'https://shapeofai.substack.com/feed', color: '#db2777', tier: 'design-opinion' }, // Emily Campbell, AI-UX pattern reference

  // Design tools
  // NOTE: Framer has no public RSS feed at any of the standard paths
  // (verified Apr 20 2026: /blog/rss.xml, /blog/feed/, /blog/atom.xml all 404).
  // Revisit if they ship one or via an aggregator.
  { name: 'Figma', url: 'https://www.figma.com/blog/feed/atom.xml', color: '#f24e1e', tier: 'design-tool' },
  // First-party design-tool blogs with real RSS (added Jul 15 2026 to thicken this tier — was Figma-only)
  { name: 'UXPin', url: 'https://www.uxpin.com/studio/feed/', color: '#00c9a7', tier: 'design-tool' }, // AI-native design tool, near-daily
  { name: 'Dovetail', url: 'https://dovetail.com/blog/rss.xml', color: '#6b4eff', tier: 'design-tool' }, // AI UX-research platform

  // Design tools (Google News searches — no direct RSS feeds)
  // Queries are scoped to avoid generic-word collisions (e.g. "arc" → many false hits).
  { name: 'Mobbin', url: 'https://news.google.com/rss/search?q=Mobbin+design+OR+Mobbin+MCP+OR+Mobbin+app&hl=en-US&gl=US&ceid=US:en', color: '#000000', tier: 'design-tool' },
  { name: 'Loom', url: 'https://news.google.com/rss/search?q=%22Loom%22+video+OR+%22Loom%22+AI+OR+%22Loom%22+screen+recording&hl=en-US&gl=US&ceid=US:en', color: '#625df5', tier: 'design-tool' },
  { name: 'Raycast', url: 'https://news.google.com/rss/search?q=Raycast+app+OR+Raycast+AI+OR+Raycast+extension&hl=en-US&gl=US&ceid=US:en', color: '#ff6363', tier: 'design-tool' },
  { name: 'Arc Browser', url: 'https://news.google.com/rss/search?q=%22Arc+browser%22+OR+%22Browser+Company%22+OR+%22Arc+Max%22&hl=en-US&gl=US&ceid=US:en', color: '#fa5b3e', tier: 'design-tool' },

  // AI labs (direct blogs)
  { name: 'OpenAI', url: 'https://openai.com/blog/rss.xml', color: '#10a37f', tier: 'ai-lab' },
  { name: 'Google AI', url: 'https://blog.google/technology/ai/rss/', color: '#4285f4', tier: 'ai-lab' },
  { name: 'Microsoft AI', url: 'https://www.microsoft.com/en-us/ai/blog/feed/', color: '#00a4ef', tier: 'ai-lab' }, // blogs.microsoft.com/ai/feed 410 Gone (Jul 15 2026)
  { name: 'Hugging Face', url: 'https://huggingface.co/blog/feed.xml', color: '#ffd21e', tier: 'ai-lab' }, // very active open-model/product feed (added Jul 15 2026)
  { name: 'Apple Newsroom', url: 'https://www.apple.com/newsroom/rss-feed.rss', color: '#000000', tier: 'ai-lab' }, // added Aug 8 2026: Apple had no feed, so iOS 27 AI features only ever reached us via TLDR Design. `ai-lab` is deliberate: it makes Apple launches count toward the product-news floor. Feed also carries retail/finance items; the relevance threshold is expected to drop those, verify after a week.

  // AI labs (Google News searches for AI products)
  { name: 'Cursor', url: 'https://news.google.com/rss/search?q=Cursor+AI+editor+OR+Cursor+code+editor&hl=en-US&gl=US&ceid=US:en', color: '#7c3aed', tier: 'ai-lab' },
  { name: 'Notion', url: 'https://news.google.com/rss/search?q=Notion+AI+OR+Notion+app+update&hl=en-US&gl=US&ceid=US:en', color: '#000000', tier: 'ai-lab' },
  { name: 'Linear', url: 'https://news.google.com/rss/search?q=Linear+app+OR+Linear+project+management&hl=en-US&gl=US&ceid=US:en', color: '#5e6ad2', tier: 'ai-lab' },
  { name: 'Perplexity', url: 'https://news.google.com/rss/search?q=Perplexity+AI&hl=en-US&gl=US&ceid=US:en', color: '#20808d', tier: 'ai-lab' },
  { name: 'Claude AI', url: 'https://news.google.com/rss/search?q=Claude+AI+OR+Anthropic+Claude&hl=en-US&gl=US&ceid=US:en', color: '#d97706', tier: 'ai-lab' },
  { name: 'Windsurf', url: 'https://news.google.com/rss/search?q=Windsurf+AI+editor+OR+Codeium+Windsurf&hl=en-US&gl=US&ceid=US:en', color: '#09b6a2', tier: 'ai-lab' },

  // Curators / aggregators (do the X-recap and AI-synthesis work for us)
  { name: 'Latent Space', url: 'https://www.latent.space/feed', color: '#7c3aed', tier: 'curator' },
  // Added Jul 15 2026 (verified live via rss-parser) — high signal-per-item design/AI digests
  { name: 'Sidebar', url: 'https://sidebar.io/feed.xml', color: '#0b0b0b', tier: 'curator' }, // daily hand-picked 5-link design digest
  { name: 'TLDR AI', url: 'https://tldr.tech/api/rss/ai', color: '#1a73e8', tier: 'curator' }, // daily AI digest (distinct from TLDR Design)
  { name: 'Import AI', url: 'https://jack-clark.net/feed/', color: '#111111', tier: 'curator' }, // weekly high-signal model/research roundup
  { name: 'Pixels of the Week', url: 'https://stephaniewalter.design/feed/', color: '#d6336c', tier: 'curator' }, // weekly design + a11y + AI digest
  { name: 'Exponential View', url: 'https://www.exponentialview.co/feed', color: '#f59e0b', tier: 'curator' }, // Azeem Azhar, top-tier AI analysis
  { name: 'Interconnects', url: 'https://www.interconnects.ai/feed', color: '#7c3aed', tier: 'curator' }, // added Aug 8 2026: substantive AI analysis, closest in kind to Latent Space. Substack on a custom domain: exempt from the /p/ ghosthost opinion rule automatically via SUBSCRIBED_FEED_HOSTS.

  // Designer voices — the X/Twitter/rss.app bridges were RETIRED Jul 15 2026 (both
  // live bridges went 402, the other 6 handles never bridged). Replaced with durable
  // first-party RSS feeds from named practitioners (verified live via rss-parser
  // Jul 15 2026). These are the AI-meets-craft voices the old tier was meant to carry.
  { name: 'Jakob Nielsen (UX Tigers)', url: 'https://jakobnielsenphd.substack.com/feed', color: '#f57c00', tier: 'designer-voice' }, // NN/g co-founder, now all AI interfaces
  { name: 'LukeW', url: 'https://www.lukew.com/ff/rss.asp', color: '#0a66c2', tier: 'designer-voice' }, // veteran product designer on AI product UX
  { name: 'Addy Osmani', url: 'https://addyosmani.com/rss.xml', color: '#4285f4', tier: 'designer-voice' }, // agentic engineering + AI craft
  { name: 'Amelia Wattenberger', url: 'https://wattenberger.com/rss.xml', color: '#e91e63', tier: 'designer-voice' }, // novel AI UIs / tools-for-thought
  { name: 'Geoffrey Litt', url: 'https://www.geoffreylitt.com/feed.xml', color: '#2d6cdf', tier: 'designer-voice' }, // canonical AI-interface essays
  { name: 'AI/UX Playground', url: 'https://aiuxplayground.substack.com/feed', color: '#7c3aed', tier: 'designer-voice' }, // practical AI-UX patterns
  { name: 'Dive Club', url: 'https://media.rss.com/diveclub/feed.xml', color: '#00b4d8', tier: 'designer-voice' }, // deep product-designer interviews (podcast)
  // Substack practitioner voices (added Jul 15 2026; verified live + predominantly free via rss-parser; paywalled items dropped by isPaywalled)
  { name: 'Proof of Concept', url: 'https://www.proofofconcept.pub/feed', color: '#111111', tier: 'designer-voice' }, // David Hoang, design leader
  { name: 'Behind the Craft', url: 'https://creatoreconomy.so/feed', color: '#ff6b35', tier: 'designer-voice' }, // Peter Yang, product+AI craft
  { name: 'UX + AI', url: 'https://ileanamarcut.substack.com/feed', color: '#6d28d9', tier: 'designer-voice' }, // Ileana Marcut
  { name: 'Design with AI', url: 'https://designwithai.substack.com/feed', color: '#0ea5e9', tier: 'designer-voice' }, // Xinran Ma, ~20k subs
  { name: 'UX Movement', url: 'https://uxmovement.substack.com/feed', color: '#e11d48', tier: 'designer-voice' }, // Anthony Tseng, UX craft
  { name: 'Christine Vallaure', url: 'https://christinevallaure.substack.com/feed', color: '#0891b2', tier: 'designer-voice' }, // Figma-to-code AI
  { name: 'Simon Willison', url: 'https://simonwillison.net/atom/everything/', color: '#ff6600', tier: 'designer-voice' }, // added Aug 8 2026: near-daily AI tooling coverage. `designer-voice` is already capped at 1/day by MAX_ITEMS_PER_SOURCE_BY_TIER, so no extra cap is needed.

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
  { name: 'Supabase', url: 'https://supabase.com/rss.xml', color: '#3ecf8e', tier: 'dev-platform' }, // /blog/rss.xml 404 (Jul 15 2026)

  // Tech news (keyword-only scoring — no source baseline)
  { name: 'The Verge', url: 'https://www.theverge.com/rss/ai-artificial-intelligence/index.xml', color: '#e5127d', tier: 'tech-news' }, // old path 404 (Jul 15 2026)
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
  // Research/news/case studies (NN/g, Smashing, A List Apart, TLDR Design).
  // 50 → 30 (Apr 28) → 25 (May 7), both cuts so product news would outrank
  // design-pub keyword stacking. STAYS AT 25. It was raised to 35 on 2026-08-10
  // and reverted the same day; the reasoning was wrong twice over and the
  // numbers are kept here so nobody re-derives it:
  //
  // (1) design-pub was never being crowded out. Measured across 22 published
  //     dailies (2026-07-05 → 08-09): design-pub is 33% of all stories, appears
  //     in 82% of issues, averaging 1.41 per ~4.2-story issue. The low baseline
  //     is a COUNTERWEIGHT to its keyword-stacking advantage, not suppression —
  //     it gets picked on relevance regardless. Raising it over-corrects back
  //     into the exact problem the Apr/May cuts were made to fix.
  //
  // (2) Source mix cannot move clicks anyway. Measured 82 clicks across 93
  //     stories (0.88/story, 3.7 per issue). If EVERY story were design-pub at
  //     its measured 0.95/story that is 88 clicks, 4.0 per issue, +8%. The
  //     ceiling is set by list size and open rate (205 delivered, ~73 opened,
  //     ~1.3% of openers click any given story), not by tier weighting.
  //
  // Do not re-tune this to chase engagement. The lever is subscriber count, or
  // accepting that this newsletter's value is not measured in story clicks. The
  // audit CTA in renderFooterCTA is where the funnel actually lives.
  'design-pub': 25,
  'design-tool': 35,       // first-party design product news — at parity with ai-lab (May 17) after expanding from 1 → 5 sources to avoid same-day mix swing
  'ai-lab': 35,            // concrete AI product launches — bumped 30→35 (May 7) to compete with design-pub keyword density
  'design-opinion': 28,    // think-pieces — useful but capped to 1-2 per issue via prompt
  curator: 25,             // syntheses
  community: 25,
  'designer-voice': 22,    // X/Twitter from trusted practitioners — lower than curator because tweets are less substantive than synthesized writeups, but above dev-platform
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

// Never link a reader to a paywalled post. Substack (and similar) gate a paid
// post by TRUNCATING its RSS body to a short teaser — it does NOT reliably print
// a marker string (verified Jul 2026: "keep reading with a trial" / "this post
// is for paid subscribers" are usually absent; the body just gets short). So for
// Substack the reliable signal is the length of the full body (`content:encoded`,
// the field carrying the real article — `item.content` is only the subtitle on
// Substack). A very short Substack body means a truncated paywall teaser.
//
// CRITICAL SCOPING (2026-07-23): the length heuristic must apply to Substack ONLY.
// Google News search feeds return a short SNIPPET by design (~60-120 chars), and
// first-party product blogs (OpenAI, Google AI, etc.) publish short RSS SUMMARIES
// (~150 chars) — the full article is free on the source site. Applying the length
// rule to them dropped nearly ALL AI product news before it reached the pool
// (measured: Claude-AI Google-News items 61-116 chars, OpenAI blog 152-172 chars,
// all nuked), leaving issues all-practitioner-voice. Same failure class as the
// curator-dead / substack-blanket-strip incidents: a later guard silently negating
// an earlier source-mix decision. See newsletter-and-infra.md. Explicit markers
// still apply to every source; only the length test is Substack-scoped.
const PAYWALL_MIN_BODY_CHARS = 400;
const PAYWALL_MARKERS = [
  'this post is for paid subscribers',
  'this post is for paying subscribers',
  'this episode is for paid subscribers',
  'keep reading with a',
];
// A short body signals a paywall only on Substack-family feeds. Matches the
// shared host (`*.substack.com`) and custom-domain Substacks (which publish at
// `/p/<slug>` — One Useful Thing, Proof of Concept, Behind the Craft). Same
// signal isOpinionUrl uses.
function isSubstackGatedHost(link: string): boolean {
  try {
    const parsed = new URL(link);
    const host = parsed.hostname.toLowerCase().replace(/^www\./, '');
    if (host === 'substack.com' || host.endsWith('.substack.com')) return true;
    return /^\/p\/[a-z0-9-]+/.test(parsed.pathname);
  } catch {
    return false;
  }
}
function isPaywalled(item: Parser.Item): boolean {
  const bodyHtml =
    (item as unknown as Record<string, string>)['content:encoded'] || item.content || '';
  const bodyText = bodyHtml.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  const lower = bodyText.toLowerCase();
  // Explicit gate markers apply to every source (cheap, reliable).
  if (PAYWALL_MARKERS.some((m) => lower.includes(m))) return true;
  // Body-length heuristic ONLY for Substack-family feeds (see scoping note above).
  if (isSubstackGatedHost(item.link || '') && bodyText.length < PAYWALL_MIN_BODY_CHARS) {
    return true;
  }
  return false;
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
  if (tier === 'design-pub' || tier === 'design-tool' || tier === 'design-opinion' || tier === 'designer-voice') return true;

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

// Does this pool item count as "concrete product news" for the daily's
// product-news floor (`qa.productNewsCount` and its `poolHadProductNews`
// escape hatch)?
//
// `ai-lab` and `design-tool` always count — those feeds are launches by
// definition. `dev-platform` (Vercel, GitHub, Replit, Supabase) counts too,
// MINUS pure-infrastructure posts, because a designer does need to know when
// v0 ships an API that generates UIs; they do not need to know that Vercel
// added project avatars or a new AI Gateway trace drain.
//
// Why the tier alone wasn't enough (2026-08-07): the daily was held with
// `no_product_news` while its own selection carried the v0 API launch. The
// counter only recognised ai-lab/design-tool, so a real launch scored zero and
// the floor fired on an issue that met it. Editorial rule from that session:
// dev-platform counts when it's something a designer would need to know.
//
// The gate is the existing conditional infra penalty (INFRA_KEYWORDS present
// AND no DESIGN_KEYWORDS_SET hit), not `isDesignNativeItem`. Measured against
// the live Vercel feed: `isDesignNativeItem` returns FALSE on the v0 API launch,
// so gating on it would have reproduced the same false hold. The infra test
// admits v0 (it names "design system") and rejects avatars / trace drains /
// marketplace integrations.
//
// This is deliberately permissive on the remaining edge (a GitHub npm-security
// post passes). That's acceptable: this runs over items Claude ALREADY selected,
// not over the pool, so an off-topic pick is a selection failure with its own
// guards (`designNativeCount`, the company cap). Tightening the gate to catch it
// re-creates the false hold, which is the more expensive error.
function isProductNewsItem(item: Pick<NewsItem, 'sourceTier' | 'title' | 'description'>): boolean {
  const tier = item.sourceTier;
  if (tier === 'ai-lab' || tier === 'design-tool') return true;
  if (tier !== 'dev-platform') return false;

  const text = `${item.title} ${item.description}`.toLowerCase();
  const hasInfraKeyword = INFRA_KEYWORDS.some((k) => text.includes(k));
  const hasDesignKeyword = Array.from(DESIGN_KEYWORDS_SET).some((k) => text.includes(k));
  return !(hasInfraKeyword && !hasDesignKeyword);
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
    const urlMatches = Array.from(newsletter.content?.matchAll(/href="([^"]+)"/g) || []);
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

// Practitioner voices featured in recent daily issues, by publication name. Used
// to ROTATE the practitioner slot: a voice source featured within the window is
// excluded from the pool so the same author (e.g. Jakob Nielsen, who publishes
// ~daily) can't land in every issue. Prefers the injected sourceName/sourceTier
// (new drafts); falls back to resolving the article host for older drafts.
async function getRecentlyFeaturedVoices(days = 7): Promise<Set<string>> {
  const cutoffDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
  const recent = await prisma.newsletterDraft.findMany({
    where: {
      status: { in: ['published', 'pending_review'] },
      createdAt: { gte: cutoffDate },
      type: 'daily',
    },
    select: { structuredData: true },
  });
  const voices = new Set<string>();
  for (const nl of recent) {
    if (!nl.structuredData || typeof nl.structuredData !== 'object') continue;
    const data = nl.structuredData as {
      items?: { sourceUrl?: string; sourceName?: string; sourceTier?: SourceTier }[];
    };
    for (const item of data.items || []) {
      let tier = item.sourceTier;
      let name = item.sourceName;
      if (!tier || !name) {
        try {
          const host = new URL(item.sourceUrl || '').hostname.toLowerCase().replace(/^www\./, '');
          tier = tier || HOST_TIER.get(host);
          name = name || HOST_NAME.get(host);
        } catch {
          // unresolvable — skip
        }
      }
      if (tier && VOICE_TIERS.has(tier) && name) voices.add(name);
    }
  }
  return voices;
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
// Weekends have thinner pools (ai-labs + dev-platforms barely publish Sat/Sun),
// so we let each source contribute one extra item to keep Claude's choice set
// from collapsing. design-opinion stays capped at 1 either way.
const MAX_ITEMS_PER_SOURCE_WEEKEND = 3;
const MAX_ITEMS_PER_SOURCE_BY_TIER: Partial<Record<SourceTier, number>> = {
  'design-opinion': 1,
  'designer-voice': 1,  // one tweet per practitioner per day max — keep mix diverse
  'design-tool': 1,     // one item per design tool per day (Jun 26) — Figma's first-party blog routinely landed 2 posts in the pool, both scored top-tier (+35 baseline), and Sonnet picked both, filling 2 of 4 slots with Figma day after day. The company cap (max 2) allowed it, but 2-of-4 reads as over-represented. Capping the source to 1 keeps Figma's strongest item without the double. Note: ignores the weekend +1, which is intended — design-tool stays at 1 even on thin weekends.
};
function isWeekendUTC(now: Date = new Date()): boolean {
  const day = now.getUTCDay();
  return day === 0 || day === 6;
}
function maxItemsForTier(tier?: SourceTier, now: Date = new Date()): number {
  if (tier && MAX_ITEMS_PER_SOURCE_BY_TIER[tier] !== undefined) {
    return MAX_ITEMS_PER_SOURCE_BY_TIER[tier]!;
  }
  return isWeekendUTC(now) ? MAX_ITEMS_PER_SOURCE_WEEKEND : MAX_ITEMS_PER_SOURCE_DEFAULT;
}

interface AggregatedPool {
  items: NewsItem[];
  clippedSources: string[]; // source names that were trimmed by the cap
}

async function aggregateNews(
  lookbackHours = 24,
  deduplicationDays = 7,
  { lite = false, rotateVoices = false }: { lite?: boolean; rotateVoices?: boolean } = {},
): Promise<AggregatedPool> {
  const allItems: NewsItem[] = [];
  const sources = lite ? RSS_SOURCES_LITE : RSS_SOURCES;
  const [usedUrls, usedTitles, recentVoices] = await Promise.all([
    getRecentlyUsedUrls(deduplicationDays),
    getRecentlyUsedTitles(deduplicationDays),
    rotateVoices ? getRecentlyFeaturedVoices(VOICE_ROTATION_DAYS) : Promise.resolve(new Set<string>()),
  ]);
  if (rotateVoices && recentVoices.size > 0) {
    console.log(`[newsletter] Voice rotation: excluding recently-featured voices — ${Array.from(recentVoices).join(', ')}`);
  }

  // Helper: check if an item title is too similar to a previously used title
  const isTitleAlreadyUsed = (title: string): boolean => {
    return usedTitles.some(usedTitle => isSimilarTitle(title, usedTitle));
  };

  // Run RSS feeds and Anthropic scrape in parallel (lite mode skips Anthropic scraper)
  const [rssResults, anthropicNews] = await Promise.all([
    Promise.allSettled(
      sources.map(async (source) => {
        try {
          // Voice rotation: skip a practitioner/opinion/curator source entirely
          // if it was featured within VOICE_ROTATION_DAYS, so the same author
          // (e.g. Jakob Nielsen, who publishes ~daily) can't land in every issue.
          if (rotateVoices && source.tier && VOICE_TIERS.has(source.tier) && recentVoices.has(source.name)) {
            return [];
          }
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
            .filter((item) => !isPaywalled(item)) // never link readers to a paywalled post
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

  // Resolve Google News redirect links to real publisher URLs (bounded), dropping
  // any that won't resolve — so Claude never selects, or titles, a dead link.
  const resolvedPool = await resolvePoolGoogleNewsLinks(capped);

  return { items: resolvedPool, clippedSources: Array.from(clippedSet) };
}

interface NewsletterItem {
  product: string;
  date: string;
  headline: string;
  description: string;
  designerTakeaway: string;
  sourceUrl: string;
  patternSlug: string;
  // Resolved from the pool at generation time (not from Claude). `sourceName` is
  // the true publisher (for the source badge); `sourceTier` drives lead-ordering
  // and the voice-badge decision. Optional because the weekly-compilation path
  // has no pool — those items already carry the fields from their daily run.
  sourceName?: string;
  sourceTier?: SourceTier;
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

// Practitioner/opinion "voice" tiers — first-person essays, analyst takes, and
// digests. Valuable (the practitioner-voice mandate in buildPrompt REQUIRES one),
// but they should not LEAD the issue over concrete product/research news.
// Context (newsletter-and-infra.md, Jul 23 2026): the Jul-16 forced-inclusion
// rule worked but pushed the same near-daily practitioner (Jakob Nielsen, who
// publishes ~daily on AI interfaces) into slot #1 nearly every day. The selection
// prompt already asks Claude to lead with concrete news, but — like every
// prompt-only selection rule in this file (3-Figma, product-news floor,
// max-2-per-company) — it gets ignored, so we GUARANTEE lead position at render.
const VOICE_TIERS: ReadonlySet<SourceTier> = new Set<SourceTier>(['designer-voice', 'design-opinion', 'curator']);

// A practitioner voice featured within this many days is excluded from the pool,
// so no single author (e.g. Jakob Nielsen, who publishes ~daily) repeats issue
// after issue. The roster is large (~25 voice sources), so a 7-day window rotates
// through plenty of variety while guaranteeing no back-to-back repeats.
const VOICE_ROTATION_DAYS = 7;

// feed-host -> tier, for resolving a rendered item's tier from its sourceUrl.
// The voice-tier sources are all direct first-party/Substack feeds, so an
// article's host matches its feed host. (Google-News search feeds — ai-lab /
// design-tool — resolve to a publisher host that won't match, but those are
// never voice tiers, so the only lookups this guard depends on still hold.)
const HOST_TIER: ReadonlyMap<string, SourceTier> = new Map(
  RSS_SOURCES.map((s) => {
    try {
      return [new URL(s.url).hostname.toLowerCase().replace(/^www\./, ''), s.tier] as const;
    } catch {
      return ['', s.tier] as const;
    }
  }).filter(([h]) => h !== ''),
);

// Resolve an item's tier. Prefer the pool-resolved `sourceTier` (authoritative,
// keyed by the real article host at generation time); fall back to mapping the
// feed host for items with no injected tier (weekly compilation from older stored
// dailies). The feed-host fallback misses aggregator-relayed feeds whose article
// host differs from the feed host (e.g. Dive Club), which is exactly why the
// injected `sourceTier` is preferred.
function itemTier(item: NewsletterItem): SourceTier | undefined {
  if (item.sourceTier) return item.sourceTier;
  try {
    return HOST_TIER.get(new URL(item.sourceUrl).hostname.toLowerCase().replace(/^www\./, ''));
  } catch {
    return undefined;
  }
}

function isVoiceItem(item: NewsletterItem): boolean {
  const tier = itemTier(item);
  return tier !== undefined && VOICE_TIERS.has(tier);
}

// Guarantee a concrete product/research item leads the issue. If item #1 is a
// practitioner/opinion voice AND a non-voice item exists later, promote the first
// non-voice item into slot 1; every other item keeps its relative order. Returns
// a new array. No-op when the lead is already concrete or the issue is all-voice
// (a genuinely voice-only day still renders — we never drop the mandated voice).
function enforceLeadPosition(items: NewsletterItem[]): NewsletterItem[] {
  if (items.length < 2 || !isVoiceItem(items[0])) return items;
  const firstConcrete = items.findIndex((it) => !isVoiceItem(it));
  if (firstConcrete <= 0) return items; // all voice → leave as Claude ordered it
  const reordered = [...items];
  const [concrete] = reordered.splice(firstConcrete, 1);
  reordered.unshift(concrete);
  return reordered;
}

// feed-host -> publication name, for correcting a rendered item's SOURCE badge.
// Claude's `product` field is the SUBJECT of the story (e.g. "Claude / Anthropic"
// for a post ABOUT Claude), which misattributes practitioner/opinion posts to the
// company they discuss — e.g. Xinran Ma's "Design with AI" Substack post about
// Claude skills rendered with the Anthropic name + icon (2026-07-23). For
// voice-tier items (first-party practitioner feeds where the publisher IS the
// source), badge the real publication instead. See newsletter-and-infra.md.
const HOST_NAME: ReadonlyMap<string, string> = new Map(
  RSS_SOURCES.map((s) => {
    try {
      return [new URL(s.url).hostname.toLowerCase().replace(/^www\./, ''), s.name] as const;
    } catch {
      return ['', s.name] as const;
    }
  }).filter(([h]) => h !== ''),
);

// The publication name to badge a practitioner/opinion item with, or null if the
// item isn't a voice-tier source (concrete product news keeps Claude's subject
// label, which is what the reader wants for a launch/feature badge). Prefers the
// pool-resolved `sourceName`; falls back to the feed-host map for un-enriched
// (weekly compilation) items.
function voicePublisherLabel(item: NewsletterItem): string | null {
  if (!isVoiceItem(item)) return null;
  if (item.sourceName) return item.sourceName;
  try {
    const host = new URL(item.sourceUrl).hostname.toLowerCase().replace(/^www\./, '');
    return HOST_NAME.get(host) ?? null;
  } catch {
    return null;
  }
}

// Sources whose per-story date is the DIGEST's send-date, NOT the article's true
// publish date. TLDR Design's digest page exposes each story's title/blurb/URL but
// no per-article date, so fetchTldrDigestStories stamps every story with the
// digest's own pubDate (~route.ts:637). Displaying that as the story date is
// misleading: a Jul-21 article featured in the Jul-23 digest reads as "Jul 23",
// and an evergreen piece TLDR re-surfaces reads as today. For these items we show
// provenance ("via TLDR Design") in place of a fabricated date. Only TLDR Design
// uses the digest scraper today; add any future digest-scraped source here.
const DIGEST_DATED_SOURCES: ReadonlySet<string> = new Set<string>(['TLDR Design']);

// The right-cell label for a story card: normally the item's date, but for
// digest-scraped items (see above) the date is not the article's real date, so we
// return "via <digest>" instead. Returns null when the item's own date is trusted.
function digestProvenanceLabel(item: NewsletterItem): string | null {
  return item.sourceName && DIGEST_DATED_SOURCES.has(item.sourceName)
    ? `via ${item.sourceName}`
    : null;
}

// Resolve a selected item's sourceUrl back to its pool NewsItem (exact link, then
// article host). The pool carries the authoritative source name + tier keyed by
// the real ARTICLE host — more reliable than mapping the feed host, which differs
// for aggregator-relayed feeds (e.g. Dive Club: feed media.rss.com, articles
// rss.com). Mirrors buildQABlock's resolveOriginal.
function resolvePoolItem(sourceUrl: string, pool: NewsItem[]): NewsItem | undefined {
  const direct = pool.find((it) => it.link === sourceUrl);
  if (direct) return direct;
  try {
    const host = new URL(sourceUrl).hostname;
    return pool.find((it) => {
      try {
        return new URL(it.link).hostname === host;
      } catch {
        return false;
      }
    });
  } catch {
    return undefined;
  }
}

// Attach the authoritative publisher + tier from the pool onto each selected item,
// so downstream ordering/rendering never depend on Claude's subject label or on
// feed-host guessing. No-op for items we can't resolve (e.g. weekly compilation
// from stored dailies — those already carry the fields from their original run).
function enrichItemsWithSource(items: NewsletterItem[], pool: NewsItem[]): void {
  for (const it of items) {
    const original = resolvePoolItem(it.sourceUrl, pool);
    if (original) {
      it.sourceName = original.source;
      it.sourceTier = original.sourceTier;
    }
  }
}

// Google News RSS links are protobuf-encoded redirect wrappers
// (news.google.com/rss/articles/CBMi...) that dead-end for readers ("this page is
// trying to send you to an invalid web address") — verified 2026-07-23. Resolve to
// the real publisher URL via Google's batchexecute endpoint: fetch the article
// interstitial for its signature + timestamp, then POST to get the destination.
// Returns null on ANY failure — the caller drops the item, because shipping a dead
// link is worse than one fewer story. Fragile (Google can change this), but it
// degrades gracefully: if it breaks, all Google-News items drop and we fall back
// to first-party product feeds (which have clean direct links).
async function resolveGoogleNewsUrl(url: string, timeoutMs = 8000): Promise<string | null> {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const id = url.match(/articles\/([^?]+)/)?.[1];
    if (!id) return null;
    const page = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' }, signal: ctrl.signal });
    const html = await page.text();
    const sig = html.match(/data-n-a-sg="([^"]+)"/)?.[1];
    const ts = html.match(/data-n-a-ts="([^"]+)"/)?.[1];
    if (!sig || !ts) return null;
    const payload = [[['Fbv4je', JSON.stringify(['garturlreq', [['X', 'X', ['X', 'X'], null, null, 1, 1, 'US:en', null, 1, null, null, null, null, null, 0, 1], 'X', 'X', 1, [1, 1, 1], 1, 1, null, 0, 0, null, 0], id, ts, sig])]]];
    const res = await fetch('https://news.google.com/_/DotsSplashUi/data/batchexecute', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8', 'User-Agent': 'Mozilla/5.0' },
      body: 'f.req=' + encodeURIComponent(JSON.stringify(payload)),
      signal: ctrl.signal,
    });
    const text = await res.text();
    return text.match(/https?:\/\/(?!news\.google)[^\\"]+/)?.[0] || null;
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

// Resolve Google News redirect links in the POOL, before Claude selects, so it
// only ever sees working links and its title/summary can't reference a story we
// later drop. Bounded three ways for the Vercel 60s cap: a wall-clock BUDGET, a
// COUNT cap (resolve only the top-scored Google items — the pool is score-sorted),
// and limited CONCURRENCY (avoids bursting Google's endpoint into a rate-limit).
// Any Google item not resolved to a clean, non-opinion URL — failed, un-attempted,
// or resolved onto an opinion domain — is DROPPED. Graceful degradation: if the
// endpoint breaks or times out, Google items fall away and the pool leans on
// first-party feeds (which have clean direct links).
// Budget trimmed 12s→6s and the count cap 12→8 on 2026-08-08 to buy retry
// headroom, NOT because resolution was misbehaving. The 08-08 hold recorded
// `retryOutcome: "errored"` with `retryBudgetLeftMs: 15398` and `elapsedMs: 52653`:
// the first pass burned 36.6s, so the retry's abort was capped at 15.4s against a
// Sonnet call whose measured median is ~18s. It could not finish, and ~16s was
// spent proving that. This 12s stage was the only soft cost in the first pass, so
// halving it lifts the retry budget to ~21s — above the median — and gives the
// retry a real chance to land. Cost: fewer Google items resolve within the window,
// and unresolved ones are DROPPED, so the pool narrows. Accepted deliberately:
// pool size has been 38-51 recently while the floor keeps failing on selection,
// not on supply. If product news dries up, raise these back FIRST.
async function resolvePoolGoogleNewsLinks(
  pool: NewsItem[],
  { budgetMs = 6000, maxResolve = 8, concurrency = 3 }: { budgetMs?: number; maxResolve?: number; concurrency?: number } = {},
): Promise<NewsItem[]> {
  const isGoogle = (it: NewsItem) => {
    try {
      return new URL(it.link).hostname === 'news.google.com';
    } catch {
      return false;
    }
  };
  const googleItems = pool.filter(isGoogle);
  if (googleItems.length === 0) return pool;
  const toResolve = googleItems.slice(0, maxResolve); // top-scored first (pool is sorted)
  const deadline = Date.now() + budgetMs;
  const resolved = new Map<NewsItem, string | null>();
  let idx = 0;
  const worker = async () => {
    while (idx < toResolve.length && Date.now() < deadline) {
      const it = toResolve[idx++];
      resolved.set(it, await resolveGoogleNewsUrl(it.link, Math.min(8000, deadline - Date.now())));
    }
  };
  await Promise.all(Array.from({ length: Math.min(concurrency, toResolve.length) }, worker));

  const googleSet = new Set(googleItems);
  const out: NewsItem[] = [];
  for (const it of pool) {
    if (!googleSet.has(it)) {
      out.push(it);
      continue;
    }
    const real = resolved.get(it); // undefined = un-attempted (cap/budget); null = failed
    if (real && !isOpinionUrl(real)) {
      it.link = real;
      out.push(it);
    }
    // else: drop — never let a raw Google News redirect reach the reader
  }
  const kept = out.length - (pool.length - googleItems.length);
  console.log(`[newsletter] Google News resolution: kept ${kept}/${googleItems.length} (budget ${budgetMs}ms, cap ${maxResolve})`);
  return out;
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

// Hard ceiling on weekly story count. The prompt asks for exactly this many;
// this constant is what actually enforces it at render time. Raising it means
// raising the prompt too, or the model will keep returning this number.
const WEEKLY_MAX_ITEMS = 5;

// Get items from daily newsletters for weekly compilation
async function getDailyNewsletterItems(days = 7): Promise<NewsletterItem[]> {
  const cutoffDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

  const dailyNewsletters = await prisma.newsletterDraft.findMany({
    where: {
      type: 'daily',
      // Only compile from published dailies. pending_review drafts may contain
      // low-quality or rejected content that shouldn't feed into the weekly.
      status: 'published',
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

I have collected items from this week's daily newsletters. Your job is to curate the BEST 5 items and create a tight weekly roundup.

ITEMS FROM THIS WEEK'S DAILY NEWSLETTERS:
${JSON.stringify(dailyItems, null, 2)}

AVAILABLE PATTERNS (for reference):
${patternList}

YOUR TASK:
1. Select the 5 most design-significant items from the daily newsletters. Exactly 5, not more.

   AUDIENCE FILTER (strict):
   - If a daily item turned out to be a pure infrastructure / deployment / devops story (regardless of how it was framed in the daily Designer's Takeaway), DROP IT from the weekly. The weekly is the chance to re-curate, not to compound prior bias. A leaner roundup of 5 design-relevant items beats 8 mixed ones.
   - Prefer concrete news (product launches, feature releases, research findings) over opinion essays and think-pieces. Items originally sourced from uxdesign.cc, uxplanet.org, or lennysnewsletter.com are usually opinion. Include AT MOST 2 opinion pieces in the weekly, and ONLY when each introduces a genuinely new framework or insight that would change how a designer works.
   - Maximum 2 items from any single company or domain. The same source domain (vercel.com, openai.com) counts as one source even if items are attributed to different products.

2. Keep the original descriptions but you may slightly enhance them for the weekly context.
3. Rewrite each "Designer's Takeaway" so it names a concrete designer action (a flow change, a pattern to ship, a study to run). Drop items where you cannot do this honestly.
4. Identify ONE standout feature for "Steal This Week" - a feature other products should copy.
5. Identify ONE pattern that appeared multiple times for "Pattern to Know" deep dive.
6. Write a weekly takeaway that ties the themes together.
7. Create a title and summary. Keep the "This Week in AIUX:" prefix, then follow it with 4-8 words that name the week's concrete topics using terms a designer would actually type into search: real pattern names, UX concepts, or product categories (e.g. "Consent Patterns and Trust in AI Assistants"). Front-load the single most searchable term. Do NOT use abstract, poetic, or alliterative phrases ("Cumulative Drift", "Trust and Control", "Signals and Noise"). They read well but nobody searches them.

RESPOND IN THIS EXACT JSON FORMAT:
{
  "title": "This Week in AIUX: [4-8 searchable words naming the week's real topics: pattern names, UX concepts, or product categories a designer would search for]",
  "summary": "One sentence summary of this week's theme",
  "items": [
    {
      "product": "Product Name",
      "date": "Dec 21",
      "headline": "Short headline",
      "description": "Max 40 words. Tighten the daily description down; do not expand it.",
      "designerTakeaway": "ONE sentence, max 25 words. What a designer should DO differently.",
      "sourceUrl": "Original URL",
      "patternSlug": "pattern-slug"
    }
  ],
  "stealThisWeek": {
    "product": "Product with the standout feature",
    "feature": "Feature name",
    "insight": "ONE sentence, max 25 words. What to copy and why. No preamble."
  },
  "patternToKnow": {
    "patternSlug": "pattern-slug",
    "title": "Why [Pattern Name] dominated this week",
    "explanation": "ONE sentence, max 25 words on why this pattern kept showing up.",
    "whenToUse": "A short fragment, max 12 words. Do not start with the word When; it follows the label Use it when."
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
   - Prefer concrete news (product launches, feature releases, research findings, named studies, version numbers, dated announcements) over opinion essays and think-pieces ("The future of...", "Why X matters", "How to think about Y", "What I learned from Z"). Items from UX Collective (uxdesign.cc), UX Planet (uxplanet.org), Lenny's Newsletter (lennysnewsletter.com), and medium.com are opinion. Count these opinion-source URLs (uxdesign.cc, uxplanet.org, lennysnewsletter.com, medium.com) in your final selection — this count MUST be 0. If you have any candidates from these domains, drop them.
   - PRACTITIONER VOICES (OPTIONAL — quality-gated, never required): The pool may include named practitioners and analysts we curate (e.g. Latent Space, Julie Zhuo, Emily Campbell, AI/UX Playground, Design Systems Collective, Jakob Nielsen). Include AT MOST ONE such voice, and ONLY if it is genuinely standout for designers — a sharp, specific take on AI's impact on design work (agentic UX, AI workflows, AI skills for designers, interface patterns, the design-engineer shift), not a generic think-piece. Concrete product/research news should still make up the bulk of the issue, and a practitioner voice is never required. Including ZERO practitioner voices is completely fine. NEVER include more than one, and never pad the issue with a voice just to have one.

   WHAT EARNS A CLICK (apply when choosing between similarly relevant items):
   - Prefer an item a designer could ACT ON this week over an item that only tells them something happened. A story whose headline already contains the entire point ("X raised $7.9M", "agents use 600x more energy", "iOS 27 adds generative wallpapers") gives a reader no reason to open the source. A story that promises something withheld — a named framework, a numbered list, a method, a measured result, a fix for a problem they recognise — does.
   - This is measured, not a hunch: across 93 stories, items from design-research publications and design tools earned roughly 1.0-1.3 clicks each, while general industry news earned 0.18.
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
      "description": "Max 40 words. What happened, concretely. No preamble.",
      "designerTakeaway": "ONE sentence, max 25 words. What a designer should DO differently.",
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
1. Select the 5 most design-significant items from this week's news. Exactly 5, not more.

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
7. Create a title and summary for the newsletter. Keep the "This Week in AIUX:" prefix, then follow it with 4-8 words that name the week's concrete topics using terms a designer would actually type into search: real pattern names, UX concepts, or product categories (e.g. "Consent Patterns and Trust in AI Assistants"). Front-load the single most searchable term. Do NOT use abstract, poetic, or alliterative phrases ("Cumulative Drift", "Trust and Control", "Signals and Noise"). They read well but nobody searches them.

RESPOND IN THIS EXACT JSON FORMAT:
{
  "title": "This Week in AIUX: [4-8 searchable words naming the week's real topics: pattern names, UX concepts, or product categories a designer would search for]",
  "summary": "One sentence summary of this week's theme",
  "items": [
    {
      "product": "Product Name (e.g., ChatGPT, Claude, Gemini, Cursor)",
      "date": "Dec 21",
      "headline": "Short headline describing the update",
      "description": "Max 40 words. What happened, concretely. No preamble.",
      "designerTakeaway": "ONE sentence, max 25 words. What a designer should DO differently.",
      "sourceUrl": "URL from the news item",
      "patternSlug": "pattern-slug-from-list"
    }
  ],
  "stealThisWeek": {
    "product": "Product name with the standout feature",
    "feature": "Name of the feature to steal",
    "insight": "ONE sentence, max 25 words. What to copy and why. No preamble."
  },
  "patternToKnow": {
    "patternSlug": "pattern-slug-from-list",
    "title": "Why [Pattern Name] dominated this week",
    "explanation": "ONE sentence, max 25 words on why this pattern kept showing up.",
    "whenToUse": "A short fragment, max 12 words. Do not start with the word When; it follows the label Use it when."
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

// Strip the SOURCE FEED's utm_* params off an outbound link before it reaches a
// reader. Curated items keep whatever the feed attached — measured 2026-08-10 on
// a beehiiv Link Clicks export: 16% of clicks carried `utm_source=tldrdesign`
// and 4% `utm_source=rss`, inherited from the feeds we scraped them out of.
//
// The cost is not cosmetic. beehiiv auto-appends its own
// `utm_source=beehiiv&utm_medium=newsletter&utm_campaign=<issue-slug>` ONLY to
// links that arrive untagged; a link that already carries a utm_source is left
// alone. So a passed-through feed UTM SUPPRESSES beehiiv's campaign tagging
// entirely. Those 20% of clicks reached the destination with no utm_campaign at
// all, unattributable to an issue in our analytics or the publisher's, while
// TLDR Design took the referral credit for traffic we sent.
//
// Deliberately NOT `normaliseUrl` from src/lib/newsletter/click-attribution.ts.
// That function is a JOIN KEY builder: it also lowercases the host, drops the
// trailing slash, and strips `ref`/`source`, which are safe when comparing two
// URLs but not when handing one to a reader (`source` and `ref` are meaningful
// query params on some sites, and a trailing slash is significant to some
// servers). This strips utm_* and nothing else.
//
// Fails open: an unparseable href is returned untouched rather than dropped, so
// a malformed URL still renders as a (broken) link instead of vanishing.
function stripFeedUtm(url: string): string {
  try {
    const parsed = new URL(url);
    for (const key of Array.from(parsed.searchParams.keys())) {
      if (key.toLowerCase().startsWith('utm_')) parsed.searchParams.delete(key);
    }
    return parsed.toString();
  } catch {
    return url;
  }
}

function renderStoryCard(item: NewsletterItem, isLast: boolean): string {
  const separator = isLast
    ? ''
    : `\n<div style="text-align: center; margin: 40px 0; color: #64748b; letter-spacing: 12px; font-size: 18px;">· · ·</div>`;

  // Source badge: for practitioner/opinion items, show the real publication
  // (e.g. "Design with AI"), NOT Claude's subject label ("Claude / Anthropic")
  // which would misread as official company content. These carry no product icon
  // (a company icon would reintroduce the same misattribution); the product icon
  // stays only on concrete product-news items where the subject IS the source.
  const publisherLabel = voicePublisherLabel(item);
  const badgeLabel = publisherLabel ?? item.product;
  const badgeIcon = publisherLabel ? '' : getProductIconImg(item.product);

  // Digest-scraped items carry the digest's send-date, not the article's real
  // date — show provenance instead of a misleading date (see digestProvenanceLabel).
  const dateLabel = digestProvenanceLabel(item) ?? item.date;

  return `
<div style="margin: 0; padding: 0;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 12px;"><tr>
    <td style="font-size: 11px; color: ${EMAIL_SUBTLE}; font-weight: 600; text-transform: uppercase; letter-spacing: 0.8px;">${badgeIcon}${badgeLabel}</td>
    <td align="right" style="font-size: 13px; color: ${EMAIL_MUTED};">${dateLabel}</td>
  </tr></table>
  <h3 style="margin: 0 0 14px; font-size: 22px; font-weight: 700; color: ${EMAIL_INK}; line-height: 1.35; letter-spacing: -0.2px;">${item.headline}</h3>
  <p style="margin: 0 0 16px; font-size: 16px; line-height: 1.7; color: ${EMAIL_TEXT};">${item.description}</p>
  <p style="margin: 0 0 24px;"><a href="${stripFeedUtm(item.sourceUrl)}" target="_blank" rel="noopener" style="display: inline-block; font-size: 13px; color: ${EMAIL_INK}; text-decoration: underline; text-underline-offset: 3px; font-weight: 500;">Read the source →</a></p>
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

// Two callouts used to render as identical dark blocks stacked back to back
// ("Steal this week" then "Pattern deep-dive"), which read as one long slab and
// gave the reader no hierarchy. `variant` differentiates them: 'light' is a
// hairline-bordered card on white, 'dark' stays the navy anchor. Only ONE dark
// block per issue — it marks the block that carries the CTA.
function renderCallout(opts: {
  kicker: string;
  title: string;
  body: string;
  subBody?: string;
  cta?: { label: string; href: string };
  variant?: 'dark' | 'light';
}): string {
  const isLight = opts.variant === 'light';
  const canvas = isLight ? '#ffffff' : DARK_CANVAS;
  const border = isLight ? `border: 1px solid ${EMAIL_HAIRLINE};` : '';
  const kickerColor = isLight ? EMAIL_SUBTLE : 'rgba(255, 255, 255, 0.6)';
  const titleColor = isLight ? EMAIL_INK : DARK_STRONG;
  const bodyColor = isLight ? EMAIL_TEXT : DARK_TEXT;
  const linkColor = isLight ? EMAIL_INK : DARK_LINK;

  const subBodyHTML = opts.subBody
    ? `\n  <p style="margin: 14px 0 0; font-size: 15px; line-height: 1.6; color: ${bodyColor};"><strong style="color: ${titleColor};">Use it when:</strong> ${opts.subBody}</p>`
    : '';
  const ctaHTML = opts.cta
    ? `\n  <p style="margin: 20px 0 0;"><a href="${opts.cta.href}" target="_blank" rel="noopener" style="color: ${linkColor} !important; text-decoration: underline; text-underline-offset: 3px; font-size: 14px; font-weight: 500; font-style: normal !important;"><span style="color: ${linkColor} !important; font-style: normal !important;">${opts.cta.label} →</span></a></p>`
    : '';

  return `
<div style="background-color: ${canvas}; ${border} padding: 32px; border-radius: 16px; margin: 0 0 24px;">
  <p style="margin: 0 0 14px; font-size: 11px; font-weight: 700; color: ${kickerColor}; letter-spacing: 2px; text-transform: uppercase;">${opts.kicker}</p>
  <h2 style="margin: 0 0 14px; font-size: 22px; font-weight: 700; color: ${titleColor}; letter-spacing: -0.3px; line-height: 1.3;">${opts.title}</h2>
  <p style="margin: 0; font-size: 16px; line-height: 1.7; color: ${bodyColor};">${opts.body}</p>${subBodyHTML}${ctaHTML}
</div>`.trim();
}

// Points at `/audit`, NOT `/`. The reader has already expressed intent by
// clicking a button that says "Audit your design" — `/audit` renders
// AuditClient with initialStep="screenshot" and drops them straight into
// upload, while `/` opens on the marketing demo step. Every other
// intent-expressing entry point (homepage CTA, both pattern-page
// InlineAuditCTA placements) was migrated to `/audit` when it was added; the
// newsletter was the one that was missed and kept sending readers through the
// demo, which Clarity measured at an ~80% drop to audit-start (Jun 2026).
//
// Measured cost of the miss: this CTA is the single most-clicked link in the
// newsletter (12 verified clicks / 90 days, beehiiv Posts Click Dashboard
// 2026-08-10) and the only monetized destination we link to at all.
//
// Second, quieter reason to keep it off `/`: `/audit` is noindex, so it takes
// no organic search traffic. Newsletter-sourced audit starts are therefore
// cleanly attributable there, where on `/` they are mixed in with the organic
// traffic that page earns for "AI UX audit tool".
function auditUrl(campaign: string): string {
  return `${SITE_URL}${AUDIT_PATH}?utm_source=newsletter&utm_medium=email&utm_campaign=${campaign}`;
}

// Unified sign-off. Absorbs what used to be a separate renderAnnouncementBanner
// block so the email has ONE ending instead of two stacked closing blocks
// (the old order was callout → grey CTA box → footer → beehiiv footer, which
// gave the reader four "this is ending" signals in a row).
//
// The identity block (wordmark / "Curated by Imran" / "Read past issues" /
// permission line) was REMOVED 2026-08-10: it repeated what beehiiv's own
// appended footer already says, and it pushed a second ending below the CTA.
// beehiiv's footer supplies the unsubscribe link and physical postal address,
// which is what CAN-SPAM actually requires — the "you're getting this because"
// line was best-practice, not law, so dropping it is legally safe.
//
// The email now ends on the audit CTA. Set NEWSLETTER_ANNOUNCEMENT=off to drop
// the CTA, which leaves beehiiv's footer as the only ending.
function renderFooterCTA(_type: NewsletterType, campaign: string): string {
  if (process.env.NEWSLETTER_ANNOUNCEMENT === 'off') return '';
  return `
<div style="margin: 56px 0 0; padding: 32px 0 0; border-top: 1px solid ${EMAIL_HAIRLINE}; text-align: center;">
  <p style="margin: 0 0 12px; font-size: 11px; font-weight: 700; color: ${EMAIL_SUBTLE}; letter-spacing: 2px; text-transform: uppercase;">Stop shipping AI slop</p>
  <h2 style="margin: 0 0 12px; font-size: 24px; font-weight: 700; color: ${EMAIL_INK}; letter-spacing: -0.3px; line-height: 1.25;">Audit your AI design against ${PATTERN_COUNT} patterns</h2>
  <p style="margin: 0 0 24px; font-size: 16px; line-height: 1.6; color: ${EMAIL_TEXT};">Drop a screenshot, get specific gaps and a Claude Code prompt to fix them. Free, no signup for the first audit.</p>
  <p style="margin: 0;"><a href="${auditUrl(campaign)}" target="_blank" rel="noopener" style="display: inline-block; background-color: ${EMAIL_INK}; color: #ffffff !important; text-decoration: none !important; font-style: normal !important; padding: 14px 28px; border-radius: 999px; font-size: 15px; font-weight: 600; letter-spacing: -0.1px;"><span style="color: #ffffff !important; text-decoration: none !important; font-style: normal !important;">Audit your design →</span></a></p>
</div>
<!-- POLL SLOT: beehiiv will not let you insert a block INTO pasted HTML, so the
     poll block lands here, after everything. Question: "Was this issue worth your
     time?" with the optional comment box enabled. Read results back via
     GET /v2/publications/{pubId}/polls?expand[]=stats&expand[]=poll_responses -->`.trim();
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

  const takeaway = renderCallout({
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

${renderFooterCTA('daily', 'daily-banner')}
  `.trim();

  return wrapEmailShell(body);
}

function generateWeeklyHTML(data: WeeklyNewsletterData): string {
  const items = data.items
    .map((item, idx) => renderStoryCard(item, idx === data.items.length - 1))
    .join('\n\n');

  const stealThis = renderCallout({
    kicker: 'Steal this week',
    title: `${data.stealThisWeek.product}'s ${data.stealThisWeek.feature}`,
    body: data.stealThisWeek.insight,
    variant: 'light',
  });

  // Stays dark: it's the one block carrying a CTA, so it should be the anchor.
  // CTA label was `Deep dive on ${title}` which restated the heading directly
  // above it word for word.
  const patternToKnow = renderCallout({
    kicker: 'Pattern deep-dive',
    title: getPatternTitle(data.patternToKnow.patternSlug),
    body: data.patternToKnow.explanation,
    subBody: data.patternToKnow.whenToUse,
    cta: {
      label: 'See the pattern',
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

${renderFooterCTA('weekly', 'weekly-banner')}
  `.trim();

  return wrapEmailShell(body);
}

function generateSlug(title: string, type: NewsletterType = 'daily'): string {
  const date = new Date();
  const monthDay = date
    .toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    .replace(' ', '-')
    .toLowerCase();

  // Strip the newsletter prefix from the title before slugifying so the slug
  // doesn't double up the prefix (e.g. "this-week-in-aiux-...-this-week-in-aiux-...").
  const strippedTitle = title
    .replace(/^(this week in aiux|ai ux daily)[:\s-]*/i, '')
    .trim();
  const titleSlug = strippedTitle
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
  sourceCounts: Record<string, number>; // post-Claude final selection, keyed by RSS source
  productCounts: Record<string, number>; // post-Claude final selection, keyed by Claude's product label (company-cap signal)
  designNativeCount: number;            // items from design-pub/design-tool tiers OR with >=2 design keywords
  designLightWarning: boolean;          // true iff designNativeCount === 0
  poolSize: number;                     // items Claude saw after pool-cap filter
  duplicateSourceClipped: string[];     // sources trimmed by MAX_ITEMS_PER_SOURCE
  opinionCount: number;                 // items from opinion domains (uxdesign.cc, uxplanet.org, lennysnewsletter.com, medium.com, non-subscribed *.substack.com); curated practitioner Substacks are exempt (see isOpinionUrl)
  productNewsCount: number;             // items from ai-lab or design-tool tiers (concrete product launches)
  selectionRuleViolation: string | null; // non-null when a hard selection rule failed; triggers auto-quiet
}

// Retry/timing telemetry merged onto the stored qa at insert time (NOT produced by
// buildQABlock, which only sees a selection). Added 2026-08-04: `qa` is reassigned
// only when the retry SUCCEEDS, so a held draft could never tell you whether the
// retry was skipped for budget, ran and failed again, or threw — three different
// bugs with three different fixes. All 9 holds to date are unexplainable for want
// of this. `elapsedMs` is the number the budget guard keys off, so a run of held
// days makes it obvious whether the retry is structurally reachable in production.
interface NewsletterQATelemetry {
  retryOutcome: 'not_needed' | 'no_addendum' | 'skipped_budget' | 'succeeded' | 'still_violating' | 'errored';
  retryBudgetLeftMs: number | null; // GEN_BUDGET_MS - elapsed - 8000 at the guard; null if no violation
  elapsedMs: number;                // wall-clock from generation start to draft insert
}

// Company cap enforced at QA time. The prompt rule "max 2 per company or domain"
// lives only in the prompt and Claude Haiku routinely ignores it (2026-06-25: 3/4
// daily items were all labeled "Figma", one of them sourced from TechCrunch — so
// the source-level pool cap, which keys on the RSS feed, didn't catch it). This is
// the same bypass class as the Apr 2026 Vercel-attribution incident, just on the
// product field instead of the source field. Mirrors the prompt's value of 2.
const MAX_ITEMS_PER_COMPANY = 2;

// Hosts we DELIBERATELY subscribe to (derived from RSS_SOURCES so it never drifts
// out of sync). Used by isOpinionUrl to exempt our curated practitioner Substacks
// (Jakob Nielsen, Julie Zhuo, Emily Campbell, Design Systems Collective, etc.) from
// the blanket *.substack.com opinion strip. Without this, every *.substack.com feed
// we added on purpose is filtered out before scoring — the same structural-dead-source
// failure that killed the curator tier (latent.space) until it was allowlisted. This
// generalizes that one-off exemption: trust what we subscribe to, keep blocking the
// rest. The classic opinion mills (uxdesign.cc, uxplanet.org, lennysnewsletter.com)
// are custom domains caught by the explicit checks below, so they stay blocked even
// though they're in RSS_SOURCES.
const SUBSCRIBED_FEED_HOSTS: ReadonlySet<string> = new Set(
  RSS_SOURCES.map((s) => {
    try {
      return new URL(s.url).hostname.toLowerCase().replace(/^www\./, '');
    } catch {
      return '';
    }
  }).filter(Boolean),
);

// Opinion-domain detection. The prompt already names uxdesign.cc/uxplanet.org/
// lennysnewsletter.com but Claude routinely picks Substack pieces (which slip
// through because they aren't on the named list). Treat Substack and Medium hosts
// as opinion since they're personal-publishing platforms — EXCEPT the practitioner
// Substacks we deliberately curate (see SUBSCRIBED_FEED_HOSTS). Also catch
// custom-domain personal newsletters that use the Substack /p/ path pattern
// (e.g. unknownarts.co/p/how-i-rebuilt-my-portfolio — custom domain, not
// blocked by hostname, but the /p/ path is a Substack ghosthost signal).
function isOpinionUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    const host = parsed.hostname.toLowerCase().replace(/^www\./, '');
    if (host === 'uxdesign.cc' || host === 'uxplanet.org' || host === 'lennysnewsletter.com') return true;
    if (host === 'medium.com' || host.endsWith('.medium.com')) return true;
    if (host === 'substack.com' || host.endsWith('.substack.com')) {
      // Random Substack = opinion; a Substack we deliberately subscribe to is a
      // trusted curated voice (Nielsen, Zhuo, Campbell, DSC, ...), not opinion.
      return !SUBSCRIBED_FEED_HOSTS.has(host);
    }
    // Custom-domain Substack ghosthosts use /p/<slug> path. Block them unless
    // they're a known first-party host we trust (design tools, AI labs, or a
    // curated source we deliberately subscribe to). latent.space is a Substack
    // (/p/ paths) but is our sole `curator`-tier source — without this exemption
    // the ghosthost rule strips 100% of its items before scoring, silently
    // killing the curator tier (see newsletter-and-infra incident log).
    // A subscribed host is trusted whether it's on shared *.substack.com or its
    // own custom domain (e.g. oneusefulthing.org/p/…, proofofconcept.pub/p/…).
    // This subsumes the latent.space special-case (it's in SUBSCRIBED_FEED_HOSTS
    // via its feed URL) and resurrects every custom-domain subscribed Substack.
    const KNOWN_PRODUCT_HOSTS = new Set(['figma.com', 'framer.com', 'vercel.com', 'github.com', 'openai.com', 'anthropic.com', 'latent.space']);
    if (!KNOWN_PRODUCT_HOSTS.has(host) && !SUBSCRIBED_FEED_HOSTS.has(host) && /^\/p\/[a-z0-9-]+/.test(parsed.pathname)) return true;
    return false;
  } catch {
    return false;
  }
}

// One-shot retry directive appended to the original prompt when Claude's first
// pass violates the selection rules but the pool actually contained eligible
// product-news items. Names the URLs explicitly so Claude can't ignore them.
function buildSelectionRetryAddendum(pool: NewsItem[], violation: string): string {
  // company_cap needs its own instruction — the product-news / opinion addendum
  // below is irrelevant to (and would mislead on) a same-company concentration.
  if (violation.startsWith('company_cap')) {
    return `

CRITICAL RETRY — your previous selection violated the rules: ${violation}.

You selected more than ${MAX_ITEMS_PER_COMPANY} stories about the same company or product. Replace the surplus ones so that NO single company or product appears in more than ${MAX_ITEMS_PER_COMPANY} of your selected items. Pick the replacements from DIFFERENT companies already present in the pool you were given — do not invent items. Return the same JSON shape as before.`;
  }
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

You MUST exclude all opinion-source URLs (uxdesign.cc, uxplanet.org, lennysnewsletter.com, medium.com) from your final selection — opinion count MUST be 0. Curated practitioner voices (e.g. Jakob Nielsen, Julie Zhuo) are NOT opinion-source URLs and may stay, but include AT MOST ONE and only if genuinely standout — zero is fine. Return the same JSON shape as before.`;
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
  // Company-cap signal: count by Claude's own product label, normalized. This is
  // the dimension sourceCounts misses — an item sourced from TechCrunch but
  // labeled "Figma" counts toward TechCrunch in sourceCounts yet reads to the
  // subscriber as another Figma story. Exact-normalized match is deliberately
  // conservative: identical label ⇒ genuinely the same company, so it never
  // wrongly quiets a diverse issue; it can only miss a label-splitting dodge
  // ("Figma" / "Figma Make"), which isn't happening yet. Harden with token
  // extraction only if Claude starts gaming the field.
  const productCounts: Record<string, number> = {};
  const productDisplay: Record<string, string> = {};
  let designNativeCount = 0;
  let opinionCount = 0;
  let productNewsCount = 0;
  for (const sel of selectedItems) {
    const original = resolveOriginal(sel.sourceUrl);
    // Prefer the upstream RSS source name; fall back to Claude's product label
    // when we can't resolve back (e.g. compilation path from daily items).
    const sourceLabel = original?.source || sel.product || 'Unknown';
    sourceCounts[sourceLabel] = (sourceCounts[sourceLabel] || 0) + 1;
    const productKey = (sel.product || 'Unknown').trim().toLowerCase();
    productCounts[productKey] = (productCounts[productKey] || 0) + 1;
    if (!productDisplay[productKey]) productDisplay[productKey] = (sel.product || 'Unknown').trim();
    if (original && isDesignNativeItem(original, original.sourceTier)) {
      designNativeCount += 1;
    }
    if (isOpinionUrl(sel.sourceUrl)) {
      opinionCount += 1;
    }
    // Concrete product news — see isProductNewsItem. Keyed on the POOL item, not
    // Claude's product label, so we can't be fooled by a hand-tagged "OpenAI"
    // item that's actually a Medium opinion piece.
    if (original && isProductNewsItem(original)) {
      productNewsCount += 1;
    }
  }

  // Hard selection rules for daily issues. Violations route to auto-quiet so
  // we don't ship opinion-heavy filler when the pool can't support real news.
  // Two violation types:
  //   1) productNewsCount < 1 → no concrete launch in the issue at all.
  //   2) opinionCount > 0 → any opinion item disqualifies the issue.
  // Pool-aware escape hatch: if the pool genuinely contained zero product-news
  // items, rule (1) doesn't fire — there's nothing better Claude could have
  // picked, and shipping 4 design-pub items is acceptable.
  //
  // MUST use the same predicate as the counter above. When the numerator and
  // this hatch disagree, a day whose pool carries product news ONLY from the
  // tier one side recognises slips through un-guarded.
  const poolProductNews = pool.filter(isProductNewsItem);
  const poolHadProductNews = poolProductNews.length > 0;
  // Company-cap violation: any single product label appears more than twice.
  let companyCapViolation: string | null = null;
  for (const [key, count] of Object.entries(productCounts)) {
    if (count > MAX_ITEMS_PER_COMPANY) {
      companyCapViolation = `company_cap (${productDisplay[key]}: ${count}, max ${MAX_ITEMS_PER_COMPANY})`;
      break;
    }
  }

  let selectionRuleViolation: string | null = null;
  if (productNewsCount < 1 && poolHadProductNews) {
    selectionRuleViolation = `no_product_news (pool had ${poolProductNews.length} product-news items but Claude picked 0)`;
  } else if (opinionCount > 0) {
    selectionRuleViolation = `opinion_present (${opinionCount} opinion items, max 0)`;
  } else if (companyCapViolation) {
    selectionRuleViolation = companyCapViolation;
  }

  return {
    sourceCounts,
    productCounts,
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
  const genStart = Date.now(); // wall-clock budget anchor for the 60s Vercel cap (used to time-guard the selection retry)
  console.log(`[newsletter] Starting ${mode} ${type} generation (${lite ? `${RSS_SOURCES_LITE.length} sources` : `${RSS_SOURCES.length} sources + Anthropic scraper`})${forceRSS ? ' [forceRSS]' : ''}`);

  // Step 1: Aggregate news
  const { items: newsItems, clippedSources } = await aggregateNews(lookbackHours, deduplicationDays, { lite, rotateVoices: type === 'daily' });

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
  // Sonnet 4.6 (not Haiku) for the selection call — Haiku was a latency pick for
  // the 60s Vercel cap, but it routinely ignored the multi-constraint selection
  // rules (max-2-per-company, max-1-opinion, product-news floor). Sonnet follows
  // them far better. Measured median ~18s on a representative daily prompt vs the
  // budget below (Haiku was ~4.5s), so timeouts are bumped from 25s/45s to give
  // headroom while staying under the 60s function cap. One call/day, so the cost
  // delta is negligible.
  // Local manual-regen escape hatch: when running generation off-Vercel (no 60s
  // function cap), NEWSLETTER_CLAUDE_TIMEOUT_MS lifts the abort so the slower
  // weekly compile call can finish. Unset in production → defaults are unchanged.
  // See the "Manual weekly regeneration" runbook in newsletter-and-infra.md.
  const claudeTimeoutMs = Number(process.env.NEWSLETTER_CLAUDE_TIMEOUT_MS) || (type === 'weekly' ? 50000 : 40000);
  const claudeTimeout = setTimeout(() => claudeController.abort(), claudeTimeoutMs);
  let response;
  try {
    response = await anthropic.messages.create({
      model: 'claude-sonnet-4-6',
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
    // Render-level guarantee, same class as enforceLeadPosition above. The
    // prompt says "Exactly 5, not more", but EVERY prompt-only selection rule
    // in this route's history has eventually been ignored by the model (the
    // 3-Figma incident, the product-news floor, the soft practitioner voice).
    // Cap BEFORE generateWeeklyHTML so the email HTML and the stored
    // structuredData that /news renders can never disagree.
    if (weeklyData.items.length > WEEKLY_MAX_ITEMS) {
      console.log(
        `[newsletter] Weekly: capping ${weeklyData.items.length} selected items to ${WEEKLY_MAX_ITEMS}`
      );
      weeklyData.items = weeklyData.items.slice(0, WEEKLY_MAX_ITEMS);
    }
    htmlContent = generateWeeklyHTML(weeklyData);
    title = weeklyData.title;
    summary = weeklyData.summary;
    structuredData = weeklyData;
  } else {
    const dailyData = parsedData as NewsletterData;
    // Attach authoritative publisher + tier from the pool (fixes source badges +
    // makes lead-ordering reliable), then guarantee concrete news leads a voice.
    enrichItemsWithSource(dailyData.items, newsItems);
    dailyData.items = enforceLeadPosition(dailyData.items);
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
  // Why the retry did or didn't rescue the issue. Persisted onto the stored qa so a
  // held day is diagnosable after the fact. Without this, "the retry never ran" and
  // "the retry ran and Sonnet ignored it again" are indistinguishable in the DB —
  // `qa` is only reassigned on retry SUCCESS — and Vercel Hobby keeps ~1h of logs,
  // so all 9 holds from 2026-05-09 to 2026-08-04 are permanently unexplained. These
  // are two very different bugs with two different fixes; stop guessing which one.
  let retryOutcome:
    | 'not_needed'          // first pass was clean, no retry required
    | 'no_addendum'         // violation had no actionable retry prompt (empty product-news pool)
    | 'skipped_budget'      // time-guard fired: not enough of the 60s budget left
    | 'succeeded'           // retry produced a compliant selection
    | 'still_violating'     // retry ran, Sonnet broke the same or another rule again
    | 'errored'             // retry threw or aborted
    = 'not_needed';
  let retryBudgetLeftMs: number | null = null;

  if (type === 'daily' && qa.selectionRuleViolation) {
    const addendum = buildSelectionRetryAddendum(newsItems, qa.selectionRuleViolation);
    // Time-budget the retry: it's a second sequential Sonnet call. On a slow first
    // pass (main call + RSS already elapsed), a full 40s retry can push past Vercel's
    // 60s maxDuration and get the function hard-killed mid-run — the silent 2026-07-01
    // daily miss. Only retry if enough of the 60s budget remains, and cap the retry's
    // own abort to what's left (reserving ~8s for HTML render + DB insert). Too little
    // left → skip and fall through to the auto-quiet backstop below, which still
    // writes a visible draft instead of dying on the cap.
    const retryBudgetMs = GEN_BUDGET_MS - (Date.now() - genStart) - 8000;
    retryBudgetLeftMs = retryBudgetMs;
    if (!addendum) {
      retryOutcome = 'no_addendum';
    }
    // Floor raised 15000→20000 on 2026-08-08. At 15s the guard was admitting
    // retries it could not fund: the abort below is capped at the remaining
    // budget, and Sonnet's measured median on this prompt is ~18s, so any run
    // landing between 15s and 18s of headroom started a call that was certain to
    // abort. That is exactly what the 08-08 hold recorded (budget 15398ms,
    // `errored` ~16s later). Skipping is strictly better than aborting: same
    // outcome, ~16s of the 60s cap handed back. Keep this floor ABOVE the
    // selection model's median latency — if the model or prompt changes, re-measure
    // and move it, don't leave it stale.
    if (addendum && retryBudgetMs < 20000) {
      retryOutcome = 'skipped_budget';
      console.warn(`[newsletter] Skipping selection retry — only ${retryBudgetMs}ms of the 60s budget left (elapsed ${Date.now() - genStart}ms). Falling through to auto-quiet.`);
    } else if (addendum) {
      console.warn(`[newsletter] Selection rule violated on first pass: ${qa.selectionRuleViolation}. Retrying with hardened prompt (${retryBudgetMs}ms budget left).`);
      const retryController = new AbortController();
      const retryTimeout = setTimeout(() => retryController.abort(), Math.min(40000, retryBudgetMs));
      try {
        const retryResponse = await anthropic.messages.create({
          model: 'claude-sonnet-4-6',
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
          retryOutcome = 'succeeded';
          console.log(`[newsletter] Retry succeeded — productNews=${retryQA.productNewsCount}, opinion=${retryQA.opinionCount}`);
          enrichItemsWithSource(retryParsed.items, newsItems);
          retryParsed.items = enforceLeadPosition(retryParsed.items);
          structuredData = retryParsed;
          htmlContent = generateHTML(retryParsed);
          title = retryParsed.title;
          summary = retryParsed.summary;
          qa = retryQA;
        } else {
          retryOutcome = 'still_violating';
          console.warn(`[newsletter] Retry still violating: ${retryQA.selectionRuleViolation}. Falling through to auto-quiet.`);
        }
      } catch (retryError) {
        retryOutcome = 'errored';
        console.warn(`[newsletter] Retry failed: ${(retryError as Error).message}. Falling through to auto-quiet.`);
      } finally {
        clearTimeout(retryTimeout);
      }
    }
  }

  // Selection-rule guard (daily only): a violation that survives the retry is now
  // FLAGGED, not suppressed. The draft keeps its real title, summary, slug and HTML
  // and falls through to the normal create path below.
  //
  // Why this stopped being a "hold" (2026-08-08). The branch was written to stop
  // filler reaching subscribers, but nothing here ever reached a subscriber: BOTH
  // paths write `status: 'pending_review'` and a human clicks Publish in
  // `/admin/newsletter` and then pastes into Beehiiv. Once `8251845` made the held
  // branch keep its rendered HTML, suppression bought nothing and cost four things:
  // it overwrote the real title and summary (so the reviewer could not tell what the
  // issue actually was), used an off-pattern `-held` slug, skipped
  // `sendAdminNotification` so nobody was told a draft existed, and skipped the
  // `revalidatePath` calls plus the concurrent-trigger `duplicateCheck` that the
  // normal path runs. Net effect: a guard whose whole job was already done by the
  // human gate, which made the drafts it touched HARDER to review.
  //
  // The evidence it was miscalibrated, not just redundant: across every hold ever
  // generated (2026-05-09 → 2026-08-08) `no_product_news` fired every time and
  // `opinion_present` never did, and the rule only fires when the pool DID carry
  // product news — so it has never once fired on a genuinely quiet day. It fires on
  // selection failure. And it is wrong often: 07-31 and 08-07 both held on launches
  // the tier list didn't recognise (fixed 08-07), and 08-08 held an issue carrying an
  // Airbnb AI-search rollout and iOS 27 AI features that the user then published
  // as-is.
  //
  // This is also why `productNewsCount` stays a feed-tier proxy instead of growing a
  // story-level keyword classifier. Chasing "iOS 27 adds AI photo extension" while
  // excluding "NN/g publishes the PROVE framework" is a heuristic with real false
  // positives, and it is not worth building now that a miscount costs a review banner
  // instead of an issue. Do not re-open that unless the banner starts crying wolf.
  //
  // `qa.selectionRuleViolation` still lands in `structuredData` and IS rendered in
  // the admin QA strip. If that banner is ever removed, this guard goes silent — the
  // flag and its display are one feature.
  if (type === 'daily' && qa.selectionRuleViolation) {
    console.warn(`[newsletter] Selection rule violated: ${qa.selectionRuleViolation}. Flagging for review (draft still created) [retry=${retryOutcome}, budgetLeft=${retryBudgetLeftMs}ms, elapsed=${Date.now() - genStart}ms]`);
  }

  const structuredDataWithQA = { ...structuredData, qa: { ...qa, retryOutcome, retryBudgetLeftMs, elapsedMs: Date.now() - genStart } };

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
