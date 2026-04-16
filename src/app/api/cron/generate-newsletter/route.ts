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

const parser = new Parser({
  timeout: 3000,
  headers: {
    'User-Agent': 'AIUX-Newsletter-Bot/1.0',
  },
});

// RSS feed sources (verified working)
const RSS_SOURCES = [
  // AI Companies - Direct blogs
  { name: 'OpenAI', url: 'https://openai.com/blog/rss.xml', color: '#10a37f' },
  { name: 'Google AI', url: 'https://blog.google/technology/ai/rss/', color: '#4285f4' },
  { name: 'Microsoft AI', url: 'https://blogs.microsoft.com/ai/feed/', color: '#00a4ef' },

  // AI Coding Tools
  { name: 'Replit', url: 'https://blog.replit.com/feed.xml', color: '#f26207' },

  // Design Tools
  { name: 'Figma', url: 'https://www.figma.com/blog/feed/atom.xml', color: '#f24e1e' },

  // Dev Tools
  { name: 'Vercel', url: 'https://vercel.com/atom', color: '#000000' },
  { name: 'GitHub', url: 'https://github.blog/feed/', color: '#333333' },
  { name: 'Supabase', url: 'https://supabase.com/blog/rss.xml', color: '#3ecf8e' },

  // Tech News (AI focused) - these publish daily
  { name: 'The Verge', url: 'https://www.theverge.com/ai-artificial-intelligence/rss/index.xml', color: '#e5127d' },
  { name: 'TechCrunch', url: 'https://techcrunch.com/category/artificial-intelligence/feed/', color: '#0a9e01' },
  { name: 'Ars Technica', url: 'https://feeds.arstechnica.com/arstechnica/technology-lab', color: '#ff4e00' },
  { name: 'Wired', url: 'https://www.wired.com/feed/tag/ai/latest/rss', color: '#000000' },
  { name: 'MIT Tech Review', url: 'https://www.technologyreview.com/feed/', color: '#a31d35' },
  { name: 'VentureBeat', url: 'https://venturebeat.com/category/ai/feed/', color: '#930c10' },

  // Google News - Product-specific searches (catches news from any publication)
  { name: 'Cursor', url: 'https://news.google.com/rss/search?q=Cursor+AI+editor+OR+Cursor+code+editor&hl=en-US&gl=US&ceid=US:en', color: '#7c3aed' },
  { name: 'Notion', url: 'https://news.google.com/rss/search?q=Notion+AI+OR+Notion+app+update&hl=en-US&gl=US&ceid=US:en', color: '#000000' },
  { name: 'Linear', url: 'https://news.google.com/rss/search?q=Linear+app+OR+Linear+project+management&hl=en-US&gl=US&ceid=US:en', color: '#5e6ad2' },
  { name: 'Perplexity', url: 'https://news.google.com/rss/search?q=Perplexity+AI&hl=en-US&gl=US&ceid=US:en', color: '#20808d' },
  { name: 'Claude AI', url: 'https://news.google.com/rss/search?q=Claude+AI+OR+Anthropic+Claude&hl=en-US&gl=US&ceid=US:en', color: '#d97706' },
  { name: 'Windsurf', url: 'https://news.google.com/rss/search?q=Windsurf+AI+editor+OR+Codeium+Windsurf&hl=en-US&gl=US&ceid=US:en', color: '#09b6a2' },
];

// First 8 sources (direct blogs + dev tools) used for lightweight retry on timeout
const RSS_SOURCES_LITE = RSS_SOURCES.slice(0, 8);

// Scrape Anthropic news (no RSS feed available)
async function scrapeAnthropicNews(): Promise<NewsItem[]> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);
    const response = await fetch('https://www.anthropic.com/news', {
      headers: { 'User-Agent': 'AIUX-Newsletter-Bot/1.0' },
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    const html = await response.text();

    // Extract JSON data embedded in the page
    const matches = [...html.matchAll(/publishedOn":"([^"]+)","slug":\{"_type":"slug","current":"([^"]+)"/g)];
    const items: NewsItem[] = [];

    for (const match of matches) {
      const pubDate = match[1];
      const slug = match[2];
      // Convert slug to title (e.g., "claude-opus-4-5" -> "Claude Opus 4 5")
      const title = slug.split('-').map(word =>
        word.charAt(0).toUpperCase() + word.slice(1)
      ).join(' ');

      items.push({
        source: 'Anthropic',
        sourceColor: '#d97706',
        title,
        description: '', // We don't have description from this extraction
        link: `https://www.anthropic.com/news/${slug}`,
        pubDate,
      });
    }

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
const AI_PRODUCT_SOURCES = [
  'openai', 'anthropic', 'google ai', 'microsoft ai', 'cursor', 'replit',
  'codeium', 'notion', 'linear', 'perplexity', 'figma', 'framer', 'vercel',
  'github', 'supabase'
];

// Score relevance 0-100 based on source + keyword matches
function scoreRelevance(item: Parser.Item, sourceName?: string): number {
  const text = `${item.title || ''} ${item.contentSnippet || ''} ${item.content || ''}`.toLowerCase();
  let score = 0;

  // AI product sources get baseline priority (we want their updates)
  if (sourceName) {
    const sourceNameLower = sourceName.toLowerCase();
    if (AI_PRODUCT_SOURCES.some(s => sourceNameLower.includes(s))) {
      score += 30; // Base score for AI product sources
    }
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

  // Cap at 100
  return Math.min(score, 100);
}

function isRelevant(item: Parser.Item, sourceName?: string): boolean {
  return scoreRelevance(item, sourceName) >= 10; // Minimum threshold
}

function isRecent(item: Parser.Item, hoursAgo = 48): boolean {
  if (!item.pubDate && !item.isoDate) return false;
  const pubDate = new Date(item.pubDate || item.isoDate || '');
  const cutoff = new Date(Date.now() - hoursAgo * 60 * 60 * 1000);
  return pubDate >= cutoff;
}

interface NewsItem {
  source: string;
  sourceColor: string;
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

// Get stemmed word set from a title for comparison
function getStemmedWords(title: string): Set<string> {
  return new Set(
    normalizeTitle(title)
      .split(' ')
      .filter(w => w.length > 2)
      .map(stemWord)
  );
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

async function aggregateNews(lookbackHours = 24, deduplicationDays = 7, { lite = false }: { lite?: boolean } = {}): Promise<NewsItem[]> {
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
          return (feed.items || [])
            .filter((item) => isRecent(item, lookbackHours) && isRelevant(item, source.name))
            .filter((item) => !item.link || !usedUrls.has(item.link)) // Exclude already-used URLs
            .filter((item) => !item.title || !isTitleAlreadyUsed(item.title.trim())) // Exclude similar titles
            .map((item) => ({
              source: source.name,
              sourceColor: source.color,
              title: item.title?.trim() || 'Untitled',
              description: item.contentSnippet?.slice(0, 500) || item.content?.slice(0, 500) || '',
              link: item.link || '',
              pubDate: item.pubDate || item.isoDate || new Date().toISOString(),
              relevanceScore: scoreRelevance(item, source.name),
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

  // Add Anthropic news from scraper (their site doesn't have RSS)
  const cutoff = new Date(Date.now() - lookbackHours * 60 * 60 * 1000);
  for (const item of anthropicNews) {
    const itemDate = new Date(item.pubDate);
    if (itemDate >= cutoff && !usedUrls.has(item.link) && !isTitleAlreadyUsed(item.title)) {
      allItems.push(item);
    }
  }

  // Sort by relevance score first, then by date
  return allItems.sort((a, b) => {
    const scoreA = a.relevanceScore || 0;
    const scoreB = b.relevanceScore || 0;
    if (scoreB !== scoreA) {
      return scoreB - scoreA; // Higher relevance first
    }
    return new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime();
  });
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

  return `You are an AI UX design expert writing a WEEKLY newsletter called "This Week in AIUX" for designers and product managers.

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
1. Select the 5-8 most UX-significant items from the daily newsletters
2. Keep the original descriptions but you may slightly enhance them for the weekly context
3. Add or enhance "Designer's Takeaway" for each item - actionable insight for designers
4. Identify ONE standout feature for "Steal This Week" - a feature other products should copy
5. Identify ONE pattern that appeared multiple times for "Pattern to Know" deep dive
6. Write a weekly takeaway that ties the themes together
7. Create a compelling title and summary

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

  return `You are an AI UX design expert writing a daily newsletter called "AI UX Daily" for designers and product managers.

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
1. Select 4-6 items most relevant to UX/product designers (prioritize AI product updates, design tools, and developer tools that affect design workflows)

   DIVERSITY RULES (strict — these override relevance scoring):
   - Pick items from at least 3 DIFFERENT companies/products. A newsletter where every item is from one company is not useful.
   - Maximum 2 items from any single company or domain. If you have 4 strong OpenAI items and 1 mediocre Figma item, pick 2 OpenAI + 1 Figma rather than 4 OpenAI.
   - If multiple items in the input come from the same product LAUNCH (e.g., 10 sub-pages of one announcement, or 5 lessons of a new course), TREAT THEM AS A SINGLE STORY. Pick the most representative one and skip the rest — do not pad the newsletter with sub-pages of the same launch.
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

  return `You are an AI UX design expert writing a WEEKLY newsletter called "This Week in AIUX" for designers and product managers.

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
1. Select the 5-8 most UX-significant items from this week's news

   DIVERSITY RULES (strict — these override relevance scoring):
   - Pick items from at least 4 DIFFERENT companies/products across the week.
   - Maximum 2 items from any single company or domain.
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
  const n = patterns.length;
  const wordmark = type === 'weekly' ? 'AI UX WEEKLY' : 'AI UX DAILY';
  return `
<div style="text-align: center; padding: 24px 0 0;">
  <p style="margin: 0 0 10px; font-size: 11px; font-weight: 700; color: ${EMAIL_SUBTLE}; letter-spacing: 2px; text-transform: uppercase;">Keep exploring</p>
  <h3 style="margin: 0 0 24px; font-size: 22px; font-weight: 700; color: ${EMAIL_INK}; letter-spacing: -0.2px; line-height: 1.3;">All ${n} AI UX patterns in one place</h3>
  <a href="${SITE_URL}/patterns" target="_blank" rel="noopener" style="display: inline-block; padding: 14px 28px; background-color: ${EMAIL_INK}; color: #f8fafc; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 15px; letter-spacing: 0.2px;">Explore the pattern library →</a>
</div>

<div style="margin: 56px 0 0; padding: 32px 0 0; border-top: 1px solid ${EMAIL_HAIRLINE}; text-align: center;">
  <p style="margin: 0 0 6px; font-size: 11px; font-weight: 700; color: ${EMAIL_SUBTLE}; letter-spacing: 2px; text-transform: uppercase;">${wordmark}</p>
  <p style="margin: 0 0 10px; font-size: 14px; color: ${EMAIL_MUTED};">Curated by Imran at aiuxdesign.guide</p>
  <p style="margin: 0; font-size: 13px;"><a href="${SITE_URL}/news" target="_blank" rel="noopener" style="color: ${EMAIL_INK}; text-decoration: underline; text-underline-offset: 3px; font-weight: 500;">Read past issues →</a></p>
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

  const body = `
${renderMasthead('daily', data.items.length)}

<p style="margin: 0 0 48px; font-size: 17px; line-height: 1.7; color: ${EMAIL_TEXT};">${data.summary}</p>

${renderSectionHeader('The stories', 'Today in AI Products')}

${items}

<div style="height: 56px; line-height: 56px; font-size: 1px;">&nbsp;</div>

${takeaway}

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

  const body = `
${renderMasthead('weekly', data.items.length)}

<p style="margin: 0 0 20px; font-size: 17px; line-height: 1.7; color: ${EMAIL_TEXT};">${data.summary}</p>

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

async function sendAdminNotification(
  draft: { id: string; title: string; summary: string },
  previewUrl: string
) {
  if (!resend || !process.env.ADMIN_EMAIL) {
    return;
  }

  const approveUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/newsletter/publish?id=${draft.id}&secret=${process.env.ADMIN_APPROVE_SECRET}`;

  try {
    await resend.emails.send({
      from: 'AI UX Daily <imran@aiuxdesign.guide>',
      replyTo: 'imranrizom@gmail.com',
      to: process.env.ADMIN_EMAIL,
      subject: `📰 Newsletter Draft Ready: ${draft.title}`,
      html: `
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
      `,
    });
  } catch (error) {
    console.error('Failed to send admin notification:', error);
  }
}

async function sendFailureAlert(type: NewsletterType, error: unknown) {
  if (!resend || !process.env.ADMIN_EMAIL) return;

  const errorMessage = error instanceof Error ? error.message : String(error);
  const errorStack = error instanceof Error ? error.stack : '';

  try {
    await resend.emails.send({
      from: 'AI UX Daily <imran@aiuxdesign.guide>',
      replyTo: 'imranrizom@gmail.com',
      to: process.env.ADMIN_EMAIL,
      subject: `⚠️ Newsletter Generation Failed (${type})`,
      html: `
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
      `,
    });
  } catch (emailErr) {
    console.error('[newsletter] Failed to send failure alert email:', emailErr);
  }
}

// Core generation logic — separated so it can be retried in lite mode on failure
async function runGeneration(type: NewsletterType, lookbackHours: number, deduplicationDays: number, todayStart: Date, tomorrowStart: Date, lite = false): Promise<void> {
  const mode = lite ? 'lite' : 'full';
  console.log(`[newsletter] Starting ${mode} ${type} generation (${lite ? '8 sources' : '20 sources + Anthropic scraper'})`);

  // Step 1: Aggregate news
  const newsItems = await aggregateNews(lookbackHours, deduplicationDays, { lite });

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
        status: 'published',
        sources: [],
      },
    });
    console.log('[newsletter] Quiet day entry created and published');
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
          status: 'published',
          sources: newsItems.map((item) => item.link),
        },
      });
      console.log('[newsletter] Single-source-day entry created and published');
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
    const dailyItems = await getDailyNewsletterItems(7);
    if (dailyItems.length >= 3) {
      console.log(`[newsletter] Weekly: compiling from ${dailyItems.length} daily items`);
      prompt = buildWeeklyCompilationPrompt(dailyItems);
      dailyItemsUsed = dailyItems;
    } else if (newsItems.length > 0) {
      console.log(`[newsletter] Weekly: only ${dailyItems.length} daily items, using ${newsItems.length} RSS items instead`);
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
      structuredData: structuredData as object,
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
async function generateNewsletter(type: NewsletterType, forceRegenerate: boolean, customLookbackHours: string | null) {
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
    await runGeneration(type, lookbackHours, deduplicationDays, todayStart, tomorrowStart);
    await pingHealthcheck(type);
  } catch (error) {
    console.error('[newsletter] Full generation failed, retrying in lite mode:', error);
    try {
      await runGeneration(type, lookbackHours, deduplicationDays, todayStart, tomorrowStart, true);
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

  // Auto-detect Monday: always generate weekly on Mondays, regardless of query param.
  // This prevents the recurring issue where cron-job.org's weekly job fails to fire
  // and the daily job generates a daily newsletter instead of the expected weekly.
  const isMonday = new Date().getUTCDay() === 1;
  const type: NewsletterType = requestedType || (isMonday ? 'weekly' : 'daily');

  // For daily: Skip if a weekly was already published today (quick DB check before responding)
  if (type === 'daily') {
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setUTCDate(tomorrow.getUTCDate() + 1);

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
  }

  // Schedule the heavy work (RSS + Claude + DB) to run AFTER the response is sent.
  // This ensures cron-job.org gets a 200 within seconds, while the actual generation
  // continues in the background for up to 60s (Vercel maxDuration).
  after(() => generateNewsletter(type, forceRegenerate, customLookbackHours));

  return NextResponse.json({
    success: true,
    message: `${type} newsletter generation started in background`,
    type,
    startedAt: new Date().toISOString(),
  });
}
