import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import Parser from 'rss-parser';
import { prisma } from '@/lib/prisma';
import { Resend } from 'resend';
import { patterns } from '@/data/patterns';
import { generateSocialContent } from '@/lib/social/content-generator';

// Initialize clients
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

// Base URL for absolute links in emails
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.aiuxdesign.guide';

const parser = new Parser({
  timeout: 10000,
  headers: {
    'User-Agent': 'AIUX-Newsletter-Bot/1.0',
  },
});

// RSS feed sources
const RSS_SOURCES = [
  // AI Companies
  { name: 'OpenAI', url: 'https://openai.com/blog/rss.xml', color: '#10a37f' },
  { name: 'Google AI', url: 'https://blog.google/technology/ai/rss/', color: '#4285f4' },
  { name: 'Microsoft AI', url: 'https://blogs.microsoft.com/ai/feed/', color: '#00a4ef' },
  // Design Tools
  { name: 'Figma', url: 'https://www.figma.com/blog/feed/atom.xml', color: '#f24e1e' },
  // Dev Tools
  { name: 'Vercel', url: 'https://vercel.com/atom', color: '#000000' },
  { name: 'GitHub', url: 'https://github.blog/feed/', color: '#333333' },
  { name: 'Supabase', url: 'https://supabase.com/blog/rss.xml', color: '#3ecf8e' },
];

// Scrape Anthropic news (no RSS feed available)
async function scrapeAnthropicNews(): Promise<NewsItem[]> {
  try {
    const response = await fetch('https://www.anthropic.com/news', {
      headers: { 'User-Agent': 'AIUX-Newsletter-Bot/1.0' },
    });
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

// Keywords for relevance filtering
const RELEVANCE_KEYWORDS = [
  // AI terms
  'ai',
  'artificial intelligence',
  'machine learning',
  'llm',
  'gpt',
  'claude',
  'gemini',
  'copilot',
  'model',
  'agent',
  // Design terms
  'ux',
  'user experience',
  'interface',
  'design',
  'figma',
  'prototype',
  'component',
  // Product terms
  'feature',
  'update',
  'launch',
  'release',
  'announcement',
];

// Product brand colors
const PRODUCT_COLORS: Record<string, string> = {
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
  Figma: '#f24e1e',
  Cursor: '#7c3aed',
  Vercel: '#000000',
  GitHub: '#333333',
  Supabase: '#3ecf8e',
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
    '#000000': '#f8fafc', // Vercel black
    '#333333': '#f1f5f9', // GitHub gray
    '#3ecf8e': '#ecfdf5', // Supabase green
  };
  return colorMap[productColor] || '#f8fafc';
}

function getPatternTitle(slug: string): string {
  const pattern = patterns.find((p) => p.slug === slug);
  return pattern ? pattern.title : slug;
}

function isRelevant(item: Parser.Item): boolean {
  const text = `${item.title || ''} ${item.contentSnippet || ''} ${item.content || ''}`.toLowerCase();
  return RELEVANCE_KEYWORDS.some((keyword) => text.includes(keyword));
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

async function aggregateNews(lookbackHours = 24, deduplicationDays = 7): Promise<NewsItem[]> {
  const allItems: NewsItem[] = [];
  const usedUrls = await getRecentlyUsedUrls(deduplicationDays);

  const results = await Promise.allSettled(
    RSS_SOURCES.map(async (source) => {
      try {
        const feed = await parser.parseURL(source.url);
        return (feed.items || [])
          .filter((item) => isRecent(item, lookbackHours) && isRelevant(item))
          .filter((item) => !item.link || !usedUrls.has(item.link)) // Exclude already-used URLs
          .map((item) => ({
            source: source.name,
            sourceColor: source.color,
            title: item.title?.trim() || 'Untitled',
            description: item.contentSnippet?.slice(0, 500) || item.content?.slice(0, 500) || '',
            link: item.link || '',
            pubDate: item.pubDate || item.isoDate || new Date().toISOString(),
          }));
      } catch {
        return [];
      }
    })
  );

  for (const result of results) {
    if (result.status === 'fulfilled') {
      allItems.push(...result.value);
    }
  }

  // Add Anthropic news from scraper (no RSS feed available)
  const anthropicNews = await scrapeAnthropicNews();
  const cutoff = new Date(Date.now() - lookbackHours * 60 * 60 * 1000);
  for (const item of anthropicNews) {
    const itemDate = new Date(item.pubDate);
    if (itemDate >= cutoff && !usedUrls.has(item.link)) {
      allItems.push(item);
    }
  }

  return allItems.sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime());
}

interface NewsletterItem {
  product: string;
  date: string;
  headline: string;
  description: string;
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

I have collected items from this week's daily newsletters. Your job is to curate the BEST 5-8 items and create a comprehensive weekly roundup.

ITEMS FROM THIS WEEK'S DAILY NEWSLETTERS:
${JSON.stringify(dailyItems, null, 2)}

AVAILABLE PATTERNS (for reference):
${patternList}

YOUR TASK:
1. Select the 5-8 most UX-significant items from the daily newsletters
2. Keep the original descriptions but you may slightly enhance them for the weekly context
3. Identify ONE standout feature for "Steal This Week" - a feature other products should copy
4. Identify ONE pattern that appeared multiple times for "Pattern to Know" deep dive
5. Write a weekly takeaway that ties the themes together
6. Create a compelling title and summary

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

function buildPrompt(newsItems: NewsItem[]): string {
  const patternList = patterns.map((p) => `- ${p.slug}: ${p.title}`).join('\n');

  return `You are an AI UX design expert writing a daily newsletter called "AI UX Daily" for designers and product managers.

Given these recent AI product news items, create a newsletter update:

NEWS ITEMS:
${JSON.stringify(newsItems, null, 2)}

AVAILABLE PATTERNS (use these slugs for pattern matching):
${patternList}

YOUR TASK:
1. Select the 2-4 most UX-significant items from the news
2. For each selected item, write a short description focused on the UX implications
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
      "description": "2-3 sentences explaining what happened and why it matters for UX",
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

function buildWeeklyPrompt(newsItems: NewsItem[]): string {
  const patternList = patterns.map((p) => `- ${p.slug}: ${p.title}`).join('\n');

  return `You are an AI UX design expert writing a WEEKLY newsletter called "This Week in AIUX" for designers and product managers.

Given these AI product news items from the past week, create a comprehensive weekly roundup:

NEWS ITEMS:
${JSON.stringify(newsItems, null, 2)}

AVAILABLE PATTERNS (use these slugs for pattern matching):
${patternList}

YOUR TASK:
1. Select the 5-8 most UX-significant items from this week's news
2. For each selected item, write a description focused on the UX implications
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
      "description": "2-3 sentences explaining what happened and why it matters for UX",
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
      const color = getProductColor(item.product);
      const bgColor = getPatternBgColor(color);

      return `
<div style="margin: 0 0 32px; border-left: 3px solid ${color}; padding-left: 20px;">
  <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
    <span style="font-size: 11px; color: ${color}; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;">${item.product}</span>
    <span style="font-size: 12px; color: #94a3b8;">${item.date}</span>
  </div>
  <p style="margin: 0 0 12px; font-size: 18px; font-weight: 600; color: #0f172a; line-height: 1.4;">${item.headline}</p>
  <p style="margin: 0 0 16px; font-size: 15px; line-height: 1.65; color: #555555;">${item.description} <a href="${item.sourceUrl}" style="color: #94a3b8; font-size: 12px; text-decoration: none; margin-left: 4px;">Source →</a></p>
  <p style="margin: 0; font-size: 14px; color: #0f172a;"><strong>Pattern:</strong> <a href="${SITE_URL}/patterns/${item.patternSlug}" style="background: ${bgColor}; color: ${color}; padding: 3px 10px; border-radius: 4px; font-size: 13px; text-decoration: none; font-weight: 500;">${getPatternTitle(item.patternSlug)}</a></p>
</div>`;
    })
    .join('\n');

  return `
<p style="margin: 0 0 40px; font-size: 17px; line-height: 1.7; color: #334155;">${data.summary}</p>

<div style="border-top: 1px solid #e2e8f0; margin-bottom: 40px;"></div>

<h2 style="margin: 0 0 32px; font-size: 22px; font-weight: 700; color: #0f172a; letter-spacing: -0.3px;">📱 Today in AI Products</h2>

${itemsHTML}

<div style="background-color: #1e293b; padding: 32px; border-radius: 12px; margin-bottom: 32px;">
  <h2 style="margin: 0 0 20px; font-size: 22px; font-weight: 700; color: #ffffff; letter-spacing: -0.3px;">🎯 Today's Takeaway</h2>
  <p style="margin: 0 0 20px; font-size: 16px; line-height: 1.7; color: #94a3b8;"><strong style="color: #ffffff;">${data.takeaway.title}</strong></p>
  <p style="margin: 0; font-size: 16px; line-height: 1.7; color: #94a3b8;">${data.takeaway.body}</p>
</div>

<div style="text-align: center; padding: 24px 0;">
  <p style="margin: 0 0 24px; font-size: 16px; color: #64748b;">Want to learn more about the patterns mentioned today?</p>
  <a href="${SITE_URL}/" style="display: inline-block; padding: 16px 32px; background-color: #0f172a; color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px;">Explore All 28 Patterns →</a>
</div>
  `.trim();
}

function generateWeeklyHTML(data: WeeklyNewsletterData): string {
  const itemsHTML = data.items
    .map((item) => {
      const color = getProductColor(item.product);
      const bgColor = getPatternBgColor(color);

      return `
<div style="margin: 0 0 32px; border-left: 3px solid ${color}; padding-left: 20px;">
  <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
    <span style="font-size: 11px; color: ${color}; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;">${item.product}</span>
    <span style="font-size: 12px; color: #94a3b8;">${item.date}</span>
  </div>
  <p style="margin: 0 0 12px; font-size: 18px; font-weight: 600; color: #0f172a; line-height: 1.4;">${item.headline}</p>
  <p style="margin: 0 0 16px; font-size: 15px; line-height: 1.65; color: #555555;">${item.description} <a href="${item.sourceUrl}" style="color: #94a3b8; font-size: 12px; text-decoration: none; margin-left: 4px;">Source →</a></p>
  <p style="margin: 0; font-size: 14px; color: #0f172a;"><strong>Pattern:</strong> <a href="${SITE_URL}/patterns/${item.patternSlug}" style="background: ${bgColor}; color: ${color}; padding: 3px 10px; border-radius: 4px; font-size: 13px; text-decoration: none; font-weight: 500;">${getPatternTitle(item.patternSlug)}</a></p>
</div>`;
    })
    .join('\n');

  return `
<p style="margin: 0 0 20px; font-size: 17px; line-height: 1.7; color: #334155;">${data.summary}</p>

<p style="margin: 0 0 40px; font-size: 17px; line-height: 1.7; color: #334155;">${data.weeklyTakeaway}</p>

<div style="border-top: 1px solid #e2e8f0; margin-bottom: 40px;"></div>

<h2 style="margin: 0 0 32px; font-size: 22px; font-weight: 700; color: #0f172a; letter-spacing: -0.3px;">📱 This Week in AI Products</h2>

${itemsHTML}

<div style="background-color: #1e293b; padding: 32px; border-radius: 12px; margin-bottom: 32px;">
  <h2 style="margin: 0 0 20px; font-size: 22px; font-weight: 700; color: #ffffff; letter-spacing: -0.3px;">🎯 Steal This Week</h2>
  <p style="margin: 0 0 20px; font-size: 16px; line-height: 1.7; color: #94a3b8;"><strong style="color: #ffffff;">${data.stealThisWeek.product}'s ${data.stealThisWeek.feature}</strong></p>
  <p style="margin: 0; font-size: 16px; line-height: 1.7; color: #94a3b8;">${data.stealThisWeek.insight}</p>
</div>

<div style="background-color: #0f172a; padding: 32px; border-radius: 12px; margin-bottom: 32px;">
  <h2 style="margin: 0 0 20px; font-size: 22px; font-weight: 700; color: #ffffff; letter-spacing: -0.3px;">📚 Pattern to Know</h2>
  <h3 style="margin: 0 0 16px; font-size: 20px; font-weight: 600; color: #ffffff;">${getPatternTitle(data.patternToKnow.patternSlug)}</h3>
  <p style="margin: 0 0 20px; font-size: 16px; line-height: 1.7; color: #cbd5e1;">${data.patternToKnow.explanation}</p>
  <p style="margin: 0 0 24px; font-size: 16px; line-height: 1.7; color: #cbd5e1;"><strong style="color: #ffffff;">When to use it:</strong> ${data.patternToKnow.whenToUse}</p>
  <p style="margin: 0;"><a href="${SITE_URL}/patterns/${data.patternToKnow.patternSlug}" style="color: #60a5fa; text-decoration: none; font-size: 15px; font-weight: 500;">Deep dive on ${getPatternTitle(data.patternToKnow.patternSlug)} →</a></p>
</div>

<div style="text-align: center; padding: 24px 0;">
  <p style="margin: 0 0 24px; font-size: 16px; color: #64748b;">Want the full breakdown on any pattern mentioned above?</p>
  <a href="${SITE_URL}/" style="display: inline-block; padding: 16px 32px; background-color: #0f172a; color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px;">Explore All 28 Patterns →</a>
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
      from: 'AI UX Daily <noreply@aiuxdesign.guide>',
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

export async function GET(request: NextRequest) {
  // Verify cron secret
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Parse newsletter type from query params
    const url = new URL(request.url);
    const type = (url.searchParams.get('type') || 'daily') as NewsletterType;

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
        return NextResponse.json({
          success: true,
          message: 'Skipped daily - weekly newsletter already exists for today',
          weeklyId: weeklyToday.id,
          weeklyTitle: weeklyToday.title,
        });
      }
    }

    // Get lookback hours from query param (for custom catch-up periods)
    const customLookbackHours = url.searchParams.get('lookbackHours');

    // Configure based on type
    // Daily uses 72h lookback to catch content from companies that don't post daily
    // Weekly uses 7 days (168h) for comprehensive roundup
    const lookbackHours = customLookbackHours
      ? parseInt(customLookbackHours, 10)
      : (type === 'weekly' ? 168 : 72); // 7 days for weekly, 3 days for daily
    const deduplicationDays = type === 'weekly' ? 30 : 7;

    // Step 1: Aggregate news
    const newsItems = await aggregateNews(lookbackHours, deduplicationDays);

    // Handle quiet days with a creative message (only for daily)
    if (newsItems.length === 0) {
      if (type === 'weekly') {
        return NextResponse.json({
          success: false,
          message: 'No news items found for weekly newsletter. Try a longer lookback period.',
          newsItemsFound: 0,
        });
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

      // Check if we already have a quiet day entry for today
      const existingQuietDay = await prisma.newsletterDraft.findFirst({
        where: { slug },
      });

      if (existingQuietDay) {
        return NextResponse.json({
          success: true,
          message: 'Quiet day entry already exists for today',
          draftCreated: false,
        });
      }

      // Create and auto-publish quiet day entry
      const draft = await prisma.newsletterDraft.create({
        data: {
          title: `AI UX Daily: ${randomMessage.title}`,
          slug,
          summary: randomMessage.message,
          content: '', // Empty content - will show inline only
          publishDate: new Date(),
          status: 'published', // Auto-publish quiet days
          sources: [],
        },
      });

      return NextResponse.json({
        success: true,
        message: 'Quiet day entry created and published',
        draftId: draft.id,
        title: draft.title,
        isQuietDay: true,
      });
    }

    // Step 2: Generate newsletter with Claude
    let prompt: string;
    let structuredData: NewsletterData | WeeklyNewsletterData | null = null;
    let dailyItemsUsed: NewsletterItem[] = [];

    if (type === 'weekly') {
      // Weekly: Try to compile from daily newsletters first
      const dailyItems = await getDailyNewsletterItems(7);

      if (dailyItems.length >= 3) {
        // Have enough daily content to compile
        prompt = buildWeeklyCompilationPrompt(dailyItems);
        dailyItemsUsed = dailyItems;
      } else {
        // Fall back to fresh RSS (for initial setup or sparse weeks)
        prompt = buildWeeklyPrompt(newsItems);
      }
    } else {
      prompt = buildPrompt(newsItems);
    }

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4096,
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

    try {
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
        structuredData = dailyData; // Store for weekly compilation
      }
    } catch {
      return NextResponse.json(
        { error: 'Failed to parse newsletter content from Claude', rawResponse: responseText.slice(0, 500) },
        { status: 500 }
      );
    }

    // Step 3: Check if we already have a newsletter for today (prevent duplicates)
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
      return NextResponse.json({
        success: true,
        message: `${type} newsletter already exists for today`,
        existingId: existingNewsletter.id,
        existingTitle: existingNewsletter.title,
        skipped: true,
      });
    }

    // Step 4: Generate slug and save draft
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

    // Step 5: Generate social posts for the newsletter
    let socialPostsGenerated = false;
    if (structuredData && structuredData.items && structuredData.items.length > 0) {
      try {
        const newsletterUrl = `${SITE_URL}/news/${slug}`;

        // Extract stealThisWeek and map insight to description if needed
        let stealThisWeekData: { product: string; feature: string; description?: string; insight?: string } | undefined;
        if ('stealThisWeek' in structuredData && structuredData.stealThisWeek) {
          const stw = structuredData.stealThisWeek as { product: string; feature: string; insight?: string };
          stealThisWeekData = {
            product: stw.product,
            feature: stw.feature,
            insight: stw.insight,
          };
        }

        const socialContent = await generateSocialContent(
          {
            title: structuredData.title,
            summary: structuredData.summary,
            type: type as 'daily' | 'weekly',
            items: structuredData.items,
            takeaway: 'takeaway' in structuredData ? (structuredData.takeaway as { title: string; body: string })?.body : undefined,
            stealThisWeek: stealThisWeekData,
            patternToKnow: 'patternToKnow' in structuredData
              ? {
                  name: (structuredData.patternToKnow as { title: string; patternSlug: string; explanation: string })?.title || '',
                  description: (structuredData.patternToKnow as { title: string; patternSlug: string; explanation: string })?.explanation || '',
                  slug: (structuredData.patternToKnow as { title: string; patternSlug: string; explanation: string })?.patternSlug || '',
                }
              : undefined,
          },
          newsletterUrl
        );

        // Get default accounts for each platform
        const twitterAccount = await prisma.socialAccount.findFirst({
          where: { platform: 'twitter', isActive: true },
          select: { id: true },
        });

        const linkedInAccount = await prisma.socialAccount.findFirst({
          where: { platform: 'linkedin', isActive: true },
          select: { id: true },
        });

        // Create Twitter post
        await prisma.socialPost.create({
          data: {
            newsletterId: draft.id,
            platform: 'twitter',
            content: socialContent.twitter.content,
            threadContent: socialContent.twitter.threadContent || undefined,
            hashtags: socialContent.twitter.hashtags,
            status: 'draft',
            accountId: twitterAccount?.id || null,
          },
        });

        // Create LinkedIn post
        await prisma.socialPost.create({
          data: {
            newsletterId: draft.id,
            platform: 'linkedin',
            content: socialContent.linkedin.content,
            hashtags: socialContent.linkedin.hashtags,
            status: 'draft',
            accountId: linkedInAccount?.id || null,
          },
        });

        socialPostsGenerated = true;
        console.log(`Social posts generated for newsletter ${draft.id}`);
      } catch (socialError) {
        console.error('Failed to generate social posts:', socialError);
        // Don't fail the whole request if social post generation fails
      }
    }

    // Step 6: Send admin notification (fire-and-forget, don't block response)
    const previewUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/admin/newsletter?id=${draft.id}`;
    sendAdminNotification(draft, previewUrl).catch((err) =>
      console.error('Admin notification failed:', err)
    );

    return NextResponse.json({
      success: true,
      type,
      draftId: draft.id,
      title: draft.title,
      previewUrl,
      newsItemsProcessed: newsItems.length,
      lookbackHours,
      socialPostsGenerated,
      // Weekly-specific info
      ...(type === 'weekly' && {
        compiledFromDaily: dailyItemsUsed.length > 0,
        dailyItemsUsed: dailyItemsUsed.length,
      }),
    });
  } catch (error) {
    console.error('Newsletter generation failed:', error);
    return NextResponse.json(
      { error: 'Newsletter generation failed', details: String(error) },
      { status: 500 }
    );
  }
}
