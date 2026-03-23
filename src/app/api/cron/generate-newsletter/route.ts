import { NextRequest, NextResponse } from 'next/server';
import { waitUntil } from '@vercel/functions';
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
  timeout: 5000,
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

// Scrape Anthropic news (no RSS feed available)
async function scrapeAnthropicNews(): Promise<NewsItem[]> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
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

function getProductColor(productName: string): string {
  for (const [key, color] of Object.entries(PRODUCT_COLORS)) {
    if (productName.toLowerCase().includes(key.toLowerCase())) {
      return color;
    }
  }
  return '#64748b';
}

function getPatternBgColor(productColor: string): string {
  const colorMap: Record<string, string> = {
    '#10a37f': '#ecfdf5', // OpenAI green
    '#d97706': '#fef3c7', // Anthropic amber
    '#4285f4': '#eff6ff', // Google blue
    '#00a4ef': '#e0f2fe', // Microsoft blue
    '#f24e1e': '#fef2f2', // Figma red
    '#7c3aed': '#f3e8ff', // Cursor purple
    '#000000': '#f8fafc', // Black (Vercel, Notion)
    '#333333': '#f1f5f9', // GitHub gray
    '#3ecf8e': '#ecfdf5', // Supabase green
    '#f26207': '#fff7ed', // Replit orange
    '#09b6a2': '#ecfdf5', // Codeium teal
    '#5e6ad2': '#eef2ff', // Linear indigo
    '#20808d': '#ecfeff', // Perplexity cyan
    '#0055ff': '#eff6ff', // Framer blue
    '#c41230': '#fef2f2', // NN Group red
    '#e85c41': '#fff7ed', // Smashing orange
    '#e5127d': '#fdf2f8', // The Verge pink
    '#0a9e01': '#ecfdf5', // TechCrunch green
    '#ff4e00': '#fff7ed', // Ars Technica orange
  };
  return colorMap[productColor] || '#f8fafc';
}

function getPatternTitle(slug: string): string {
  const pattern = patterns.find((p) => p.slug === slug);
  return pattern ? pattern.title : slug;
}

// Email-safe icon helpers (hosted PNGs, since email clients strip inline SVGs)
const EMAIL_IMG_BASE = `${SITE_URL}/images/email`;

const ICON_NEWSPAPER = `<img src="${EMAIL_IMG_BASE}/icon-newspaper.png" alt="" width="18" height="18" style="width: 18px; height: 18px; display: inline; vertical-align: -3px; margin-right: 6px;" />`;
const ICON_CURSOR_CLICK = `<img src="${EMAIL_IMG_BASE}/icon-cursor-click.png" alt="" width="18" height="18" style="width: 18px; height: 18px; display: inline; vertical-align: -3px; margin-right: 6px;" />`;
const ICON_ACADEMIC_CAP = `<img src="${EMAIL_IMG_BASE}/icon-academic-cap.png" alt="" width="18" height="18" style="width: 18px; height: 18px; display: inline; vertical-align: -3px; margin-right: 6px;" />`;

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

async function aggregateNews(lookbackHours = 24, deduplicationDays = 7): Promise<NewsItem[]> {
  const allItems: NewsItem[] = [];
  const [usedUrls, usedTitles] = await Promise.all([
    getRecentlyUsedUrls(deduplicationDays),
    getRecentlyUsedTitles(deduplicationDays),
  ]);

  // Helper: check if an item title is too similar to a previously used title
  const isTitleAlreadyUsed = (title: string): boolean => {
    return usedTitles.some(usedTitle => isSimilarTitle(title, usedTitle));
  };

  // Run RSS feeds and Anthropic scrape in parallel
  const [rssResults, anthropicNews] = await Promise.all([
    Promise.allSettled(
      RSS_SOURCES.map(async (source) => {
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
        } catch {
          return [];
        }
      })
    ),
    scrapeAnthropicNews(),
  ]);

  for (const result of rssResults) {
    if (result.status === 'fulfilled') {
      allItems.push(...result.value);
    }
  }

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

function generateHTML(data: NewsletterData): string {
  const itemsHTML = data.items
    .map((item) => {
      return `
<div style="margin: 0 0 40px; padding: 0 0 32px 0; border-bottom: 1px solid #e2e8f0;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 6px;"><tr>
    <td style="font-size: 11px; color: #475569; font-weight: 600; text-transform: uppercase; letter-spacing: 0.8px;">${getProductIconImg(item.product)}${item.product}</td>
    <td align="right" style="font-size: 14px; color: #475569;">${item.date}</td>
  </tr></table>
  <p style="margin: 0 0 20px; font-size: 20px; font-weight: 600; color: #0f172a; line-height: 1.4;">${item.headline}</p>
  <p style="margin: 0 0 12px; font-size: 16px; line-height: 1.75; color: #334155;">${item.description} <a href="${item.sourceUrl}" style="color: #475569; font-size: 14px; text-decoration: none; margin-left: 4px;">Source →</a></p>
  <div style="margin: 28px 0 24px 0;">
    <p style="margin: 0; font-size: 15px; line-height: 1.5; color: #334155;"><strong>Designer's Takeaway:</strong> ${item.designerTakeaway}</p>
  </div>
  <p style="margin: 20px 0 0 0; font-size: 14px; color: #0f172a;"><strong>Pattern:</strong> <a href="${SITE_URL}/patterns/${item.patternSlug}" style="background: #f1f5f9; color: #0f172a; padding: 3px 10px; border-radius: 4px; font-size: 14px; text-decoration: none; font-weight: 500;">${getPatternTitle(item.patternSlug)}</a></p>
</div>`;
    })
    .join('\n');

  return `
<p style="margin: 0 0 40px; font-size: 17px; line-height: 1.7; color: #334155;">${data.summary}</p>

<div style="border-top: 1px solid #e2e8f0; margin-bottom: 40px;"></div>

<h2 style="margin: 0 0 32px; font-size: 22px; font-weight: 700; color: #0f172a; letter-spacing: -0.3px;">${ICON_NEWSPAPER}Today in AI Products</h2>

${itemsHTML}

<div style="background-color: #1e293b; padding: 32px; border-radius: 12px; margin-bottom: 32px;">
  <h2 style="margin: 0 0 20px; font-size: 22px; font-weight: 700; color: #f8fafc; letter-spacing: -0.3px;">${ICON_CURSOR_CLICK}Today's Takeaway</h2>
  <p style="margin: 0 0 20px; font-size: 16px; line-height: 1.7; color: #f1f5f9;"><strong style="color: #f8fafc;">${data.takeaway.title}</strong></p>
  <p style="margin: 0; font-size: 16px; line-height: 1.7; color: #f1f5f9;">${data.takeaway.body}</p>
</div>

<div style="text-align: center; padding: 24px 0;">
  <p style="margin: 0 0 24px; font-size: 16px; color: #64748b;">Want to learn more about the patterns mentioned today?</p>
  <a href="${SITE_URL}/" style="display: inline-block; padding: 16px 32px; background-color: #0f172a; color: #f8fafc; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px;">Explore All 28 Patterns →</a>
</div>
  `.trim();
}

function generateWeeklyHTML(data: WeeklyNewsletterData): string {
  const itemsHTML = data.items
    .map((item) => {
      return `
<div style="margin: 0 0 40px; padding: 0 0 32px 0; border-bottom: 1px solid #e2e8f0;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 6px;"><tr>
    <td style="font-size: 11px; color: #475569; font-weight: 600; text-transform: uppercase; letter-spacing: 0.8px;">${getProductIconImg(item.product)}${item.product}</td>
    <td align="right" style="font-size: 14px; color: #475569;">${item.date}</td>
  </tr></table>
  <p style="margin: 0 0 20px; font-size: 20px; font-weight: 600; color: #0f172a; line-height: 1.4;">${item.headline}</p>
  <p style="margin: 0 0 12px; font-size: 16px; line-height: 1.75; color: #334155;">${item.description} <a href="${item.sourceUrl}" style="color: #475569; font-size: 14px; text-decoration: none; margin-left: 4px;">Source →</a></p>
  <div style="margin: 28px 0 24px 0;">
    <p style="margin: 0; font-size: 15px; line-height: 1.5; color: #334155;"><strong>Designer's Takeaway:</strong> ${item.designerTakeaway}</p>
  </div>
  <p style="margin: 20px 0 0 0; font-size: 14px; color: #0f172a;"><strong>Pattern:</strong> <a href="${SITE_URL}/patterns/${item.patternSlug}" style="background: #f1f5f9; color: #0f172a; padding: 3px 10px; border-radius: 4px; font-size: 14px; text-decoration: none; font-weight: 500;">${getPatternTitle(item.patternSlug)}</a></p>
</div>`;
    })
    .join('\n');

  return `
<p style="margin: 0 0 20px; font-size: 17px; line-height: 1.7; color: #334155;">${data.summary}</p>

<p style="margin: 0 0 40px; font-size: 17px; line-height: 1.7; color: #334155;">${data.weeklyTakeaway}</p>

<div style="border-top: 1px solid #e2e8f0; margin-bottom: 40px;"></div>

<h2 style="margin: 0 0 32px; font-size: 22px; font-weight: 700; color: #0f172a; letter-spacing: -0.3px;">${ICON_NEWSPAPER}This Week in AI Products</h2>

${itemsHTML}

<div style="background-color: #1e293b; padding: 32px; border-radius: 12px; margin-bottom: 32px;">
  <h2 style="margin: 0 0 20px; font-size: 22px; font-weight: 700; color: #f8fafc; letter-spacing: -0.3px;">${ICON_CURSOR_CLICK}Steal This Week</h2>
  <p style="margin: 0 0 20px; font-size: 16px; line-height: 1.7; color: #f1f5f9;"><strong style="color: #f8fafc;">${data.stealThisWeek.product}'s ${data.stealThisWeek.feature}</strong></p>
  <p style="margin: 0; font-size: 16px; line-height: 1.7; color: #f1f5f9;">${data.stealThisWeek.insight}</p>
</div>

<div style="background-color: #0f172a; padding: 32px; border-radius: 12px; margin-bottom: 32px;">
  <h2 style="margin: 0 0 20px; font-size: 22px; font-weight: 700; color: #f8fafc; letter-spacing: -0.3px;">${ICON_ACADEMIC_CAP}Pattern to Know</h2>
  <h3 style="margin: 0 0 16px; font-size: 20px; font-weight: 600; color: #f8fafc;">${getPatternTitle(data.patternToKnow.patternSlug)}</h3>
  <p style="margin: 0 0 20px; font-size: 16px; line-height: 1.7; color: #f1f5f9;">${data.patternToKnow.explanation}</p>
  <p style="margin: 0 0 24px; font-size: 16px; line-height: 1.7; color: #f1f5f9;"><strong style="color: #f8fafc;">When to use it:</strong> ${data.patternToKnow.whenToUse}</p>
  <p style="margin: 0;"><a href="${SITE_URL}/patterns/${data.patternToKnow.patternSlug}" style="color: #2563eb; text-decoration: none; font-size: 15px; font-weight: 500;">Deep dive on ${getPatternTitle(data.patternToKnow.patternSlug)} →</a></p>
</div>

<div style="text-align: center; padding: 24px 0;">
  <p style="margin: 0 0 24px; font-size: 16px; color: #64748b;">Want the full breakdown on any pattern mentioned above?</p>
  <a href="${SITE_URL}/" style="display: inline-block; padding: 16px 32px; background-color: #0f172a; color: #f8fafc; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px;">Explore All 28 Patterns →</a>
</div>
  `.trim();
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

          <p style="color: #94a3b8; font-size: 14px;">This draft will not be published until you approve it.</p>
        </div>
      `,
    });
  } catch (error) {
    console.error('Failed to send admin notification:', error);
  }
}

// The heavy lifting: RSS aggregation + Claude API + DB write
// Runs in the background via waitUntil so cron-job.org gets an immediate 200
async function generateNewsletter(type: NewsletterType, forceRegenerate: boolean, customLookbackHours: string | null): Promise<void> {
  try {
    // For daily: Skip if a weekly was already published today (avoid redundancy)
    if (type === 'daily') {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      const weeklyToday = await prisma.newsletterDraft.findFirst({
        where: {
          type: 'weekly',
          status: { in: ['published', 'pending_review'] },
          createdAt: { gte: today, lt: tomorrow },
        },
      });

      if (weeklyToday) {
        console.log(`Skipped daily - weekly newsletter already exists for today: ${weeklyToday.title}`);
        return;
      }
    }

    // Early duplicate check: prevent wasting time on RSS + Claude if newsletter already exists today
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const tomorrowStart = new Date(todayStart);
    tomorrowStart.setDate(tomorrowStart.getDate() + 1);

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
        console.log(`${type} newsletter already exists for today: ${existingNewsletter.title}`);
        return;
      }
    }

    // Configure based on type
    const lookbackHours = customLookbackHours
      ? parseInt(customLookbackHours, 10)
      : (type === 'weekly' ? 168 : 72);
    const deduplicationDays = type === 'weekly' ? 30 : 7;

    // Step 1: Aggregate news
    const newsItems = await aggregateNews(lookbackHours, deduplicationDays);

    // Handle quiet days with a creative message (only for daily)
    if (newsItems.length === 0) {
      if (type === 'weekly') {
        console.log('No news items found for weekly newsletter.');
        return;
      }

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

      const existingQuietDay = await prisma.newsletterDraft.findFirst({
        where: { slug },
      });

      if (existingQuietDay) {
        console.log('Quiet day entry already exists for today');
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

      console.log(`Quiet day entry created: ${randomMessage.title}`);
      return;
    }

    // Step 2: Fetch recently used headlines for semantic deduplication in Claude's prompt
    const recentHeadlines = await getRecentlyUsedTitles(deduplicationDays);

    // Step 3: Generate newsletter with Claude
    let prompt: string;
    let structuredData: NewsletterData | WeeklyNewsletterData | null = null;
    let dailyItemsUsed: NewsletterItem[] = [];

    if (type === 'weekly') {
      const dailyItems = await getDailyNewsletterItems(7);

      if (dailyItems.length >= 3) {
        prompt = buildWeeklyCompilationPrompt(dailyItems);
        dailyItemsUsed = dailyItems;
      } else {
        prompt = buildWeeklyPrompt(newsItems, recentHeadlines);
      }
    } else {
      prompt = buildPrompt(newsItems, recentHeadlines);
    }

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: type === 'weekly' ? 4096 : 2048,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    const responseText =
      response.content[0].type === 'text' ? response.content[0].text : '';

    // Parse Claude's response
    let htmlContent: string;
    let title: string;
    let summary: string;

    const jsonMatch =
      responseText.match(/```json\s*([\s\S]*?)\s*```/) ||
      responseText.match(/```\s*([\s\S]*?)\s*```/) || [null, responseText];
    const parsedData = JSON.parse(jsonMatch[1] || responseText);

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

    // Save draft
    const slug = generateSlug(title, type);

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

    console.log(`Newsletter generated successfully: [${type}] ${draft.title} (${newsItems.length} items)`);
  } catch (error) {
    console.error(`Background newsletter generation failed [${type}]:`, error);
  }
}

export async function GET(request: NextRequest) {
  // Verify cron secret
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Parse params before returning — these are fast
  const url = new URL(request.url);
  const type = (url.searchParams.get('type') || 'daily') as NewsletterType;
  const forceRegenerate = url.searchParams.get('force') === 'true';
  const customLookbackHours = url.searchParams.get('lookbackHours');

  // Debug mode: run synchronously to see errors. Use ?debug=true
  const debug = url.searchParams.get('debug') === 'true';

  if (debug) {
    try {
      await generateNewsletter(type, forceRegenerate, customLookbackHours);
      return NextResponse.json({
        success: true,
        message: `${type} newsletter generated synchronously (debug mode)`,
        type,
      });
    } catch (error) {
      return NextResponse.json({
        success: false,
        error: String(error),
        stack: error instanceof Error ? error.stack : undefined,
      }, { status: 500 });
    }
  }

  // Production mode: run in background so cron-job.org doesn't time out
  waitUntil(generateNewsletter(type, forceRegenerate, customLookbackHours));

  return NextResponse.json({
    success: true,
    message: `${type} newsletter generation started in background`,
    type,
    forceRegenerate,
  });
}
