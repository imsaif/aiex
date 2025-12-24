import { NextRequest, NextResponse } from 'next/server';
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

async function getRecentlyUsedUrls(): Promise<Set<string>> {
  // Get URLs from newsletters published in the last 7 days
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const recentNewsletters = await prisma.newsletterDraft.findMany({
    where: {
      status: { in: ['published', 'pending_review'] },
      createdAt: { gte: sevenDaysAgo },
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

async function aggregateNews(): Promise<NewsItem[]> {
  const allItems: NewsItem[] = [];
  const usedUrls = await getRecentlyUsedUrls();

  const results = await Promise.allSettled(
    RSS_SOURCES.map(async (source) => {
      try {
        const feed = await parser.parseURL(source.url);
        return (feed.items || [])
          .filter((item) => isRecent(item, 24) && isRelevant(item))
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
  const cutoff = new Date(Date.now() - 24 * 60 * 60 * 1000);
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
  <p style="margin: 0; font-size: 14px; color: #0f172a;"><strong>Pattern:</strong> <a href="/patterns/${item.patternSlug}" style="background: ${bgColor}; color: ${color}; padding: 3px 10px; border-radius: 4px; font-size: 13px; text-decoration: none; font-weight: 500;">${getPatternTitle(item.patternSlug)}</a></p>
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
  <a href="/" style="display: inline-block; padding: 16px 32px; background-color: #0f172a; color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px;">Explore All 28 Patterns →</a>
</div>
  `.trim();
}

function generateSlug(title: string): string {
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

  return `ai-ux-daily-${monthDay}-${titleSlug}`;
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
    // Step 1: Aggregate news
    const newsItems = await aggregateNews();

    // Handle quiet days with a creative message
    if (newsItems.length === 0) {
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
    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4096,
      messages: [
        {
          role: 'user',
          content: buildPrompt(newsItems),
        },
      ],
    });

    const responseText =
      response.content[0].type === 'text' ? response.content[0].text : '';

    // Parse Claude's response
    let newsletterData: NewsletterData;
    try {
      const jsonMatch =
        responseText.match(/```json\s*([\s\S]*?)\s*```/) ||
        responseText.match(/```\s*([\s\S]*?)\s*```/) || [null, responseText];
      newsletterData = JSON.parse(jsonMatch[1] || responseText);
    } catch {
      return NextResponse.json(
        { error: 'Failed to parse newsletter content from Claude' },
        { status: 500 }
      );
    }

    // Step 3: Generate HTML and save draft
    const htmlContent = generateHTML(newsletterData);
    const slug = generateSlug(newsletterData.title);

    const draft = await prisma.newsletterDraft.create({
      data: {
        title: newsletterData.title,
        slug,
        summary: newsletterData.summary,
        content: htmlContent,
        publishDate: new Date(),
        status: 'pending_review',
        sources: newsItems.map((item) => item.link),
      },
    });

    // Step 4: Send admin notification
    const previewUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/admin/newsletter?id=${draft.id}`;
    await sendAdminNotification(draft, previewUrl);

    return NextResponse.json({
      success: true,
      draftId: draft.id,
      title: draft.title,
      previewUrl,
    });
  } catch (error) {
    console.error('Newsletter generation failed:', error);
    return NextResponse.json(
      { error: 'Newsletter generation failed', details: String(error) },
      { status: 500 }
    );
  }
}
