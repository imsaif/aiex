#!/usr/bin/env node

/**
 * AI Newsletter Generator
 *
 * Uses Claude to generate daily newsletter content from aggregated RSS news.
 * Matches news items to relevant AI UX patterns and generates formatted HTML.
 *
 * Usage:
 *   node scripts/ai-newsletter-generator.js
 *   node scripts/ai-newsletter-generator.js --dry-run   # Preview without saving
 *
 * Environment Variables:
 *   ANTHROPIC_API_KEY - Required for Claude API
 *   DATABASE_URL - Required for saving drafts
 *   RESEND_API_KEY - Required for admin notifications
 *   ADMIN_EMAIL - Email to receive draft notifications
 */

const Anthropic = require('@anthropic-ai/sdk').default;
const { aggregateNews } = require('./daily-news-aggregator');
const { PrismaClient } = require('../src/generated/prisma');
const { Resend } = require('resend');
const patterns = require('../src/data/patterns').default;

const prisma = new PrismaClient();

// Initialize clients
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

// Product brand colors for newsletter styling
const PRODUCT_COLORS = {
  OpenAI: '#10a37f',
  ChatGPT: '#10a37f',
  Anthropic: '#d97706',
  Claude: '#d97706',
  'Claude Code': '#d97706',
  Google: '#4285f4',
  'Google AI': '#4285f4',
  Gemini: '#4285f4',
  Cursor: '#7c3aed',
  Vercel: '#000000',
  GitHub: '#333333',
};

// Get color for a product
function getProductColor(productName) {
  for (const [key, color] of Object.entries(PRODUCT_COLORS)) {
    if (productName.toLowerCase().includes(key.toLowerCase())) {
      return color;
    }
  }
  return '#64748b'; // Default gray
}

// Get pattern background color (lighter version of product color)
function getPatternBgColor(productColor) {
  const colorMap = {
    '#10a37f': '#ecfdf5', // OpenAI green
    '#d97706': '#fef3c7', // Anthropic orange
    '#4285f4': '#eff6ff', // Google blue
    '#7c3aed': '#f3e8ff', // Cursor purple
    '#000000': '#f8fafc', // Vercel black
    '#333333': '#f1f5f9', // GitHub dark
  };
  return colorMap[productColor] || '#f8fafc';
}

// Build the prompt for Claude
function buildPrompt(newsItems) {
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
    "title": "Key insight title (e.g., 'User control is the next frontier')",
    "body": "2-3 sentences explaining the insight"
  }
}

Important:
- Focus on UX/design implications, not just features
- Use clear, jargon-free language
- Each headline should be compelling and specific
- Only include items that have genuine UX significance
- If no items are UX-relevant, return fewer items or explain in summary`;
}

// Generate HTML content from Claude's response
function generateHTML(data) {
  const itemsHTML = data.items
    .map((item) => {
      const color = getProductColor(item.product);
      const bgColor = getPatternBgColor(color);

      return `
<!-- ${item.product} Update -->
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

<!-- Today's Takeaway -->
<div style="background-color: #1e293b; padding: 32px; border-radius: 12px; margin-bottom: 32px;">
  <h2 style="margin: 0 0 20px; font-size: 22px; font-weight: 700; color: #ffffff; letter-spacing: -0.3px;">🎯 Today's Takeaway</h2>
  <p style="margin: 0 0 20px; font-size: 16px; line-height: 1.7; color: #94a3b8;"><strong style="color: #ffffff;">${data.takeaway.title}</strong></p>
  <p style="margin: 0; font-size: 16px; line-height: 1.7; color: #94a3b8;">${data.takeaway.body}</p>
</div>

<!-- CTA -->
<div style="text-align: center; padding: 24px 0;">
  <p style="margin: 0 0 24px; font-size: 16px; color: #64748b;">Want to learn more about the patterns mentioned today?</p>
  <a href="/" style="display: inline-block; padding: 16px 32px; background-color: #0f172a; color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px;">Explore All 28 Patterns →</a>
</div>
  `.trim();
}

// Get pattern title from slug
function getPatternTitle(slug) {
  const pattern = patterns.find((p) => p.slug === slug);
  return pattern ? pattern.title : slug;
}

// Generate newsletter slug from date
function generateSlug(title) {
  const date = new Date();
  const dateStr = date.toISOString().split('T')[0]; // YYYY-MM-DD
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

// Send admin notification email
async function sendAdminNotification(draft, previewUrl) {
  if (!resend || !process.env.ADMIN_EMAIL) {
    console.log('⚠️ Skipping email notification (RESEND_API_KEY or ADMIN_EMAIL not set)');
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
    console.log('📧 Admin notification sent');
  } catch (error) {
    console.error('⚠️ Failed to send admin notification:', error.message);
  }
}

// Main function
async function generateNewsletter(options = {}) {
  const { dryRun = false } = options;

  console.log('\n🤖 AI Newsletter Generator\n');

  // Step 1: Aggregate news
  console.log('Step 1: Fetching news...');
  const newsData = await aggregateNews();

  if (newsData.items.length === 0) {
    console.log('\n⚠️ No news items found. Skipping newsletter generation.');
    return null;
  }

  console.log(`\nStep 2: Generating newsletter with Claude...`);

  // Step 2: Call Claude to generate newsletter content
  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 4096,
    messages: [
      {
        role: 'user',
        content: buildPrompt(newsData.items),
      },
    ],
  });

  // Parse Claude's response
  const responseText = response.content[0].text;
  let newsletterData;

  try {
    // Extract JSON from response (handle markdown code blocks)
    const jsonMatch = responseText.match(/```json\s*([\s\S]*?)\s*```/) ||
      responseText.match(/```\s*([\s\S]*?)\s*```/) || [null, responseText];
    newsletterData = JSON.parse(jsonMatch[1] || responseText);
  } catch (error) {
    console.error('Failed to parse Claude response:', error);
    console.log('Raw response:', responseText);
    throw new Error('Failed to parse newsletter content from Claude');
  }

  console.log(`\n✅ Generated newsletter: ${newsletterData.title}`);
  console.log(`   Items: ${newsletterData.items.length}`);

  // Step 3: Generate HTML content
  const htmlContent = generateHTML(newsletterData);
  const slug = generateSlug(newsletterData.title);

  // Step 4: Save to database (if not dry run)
  if (dryRun) {
    console.log('\n📋 DRY RUN - Preview:');
    console.log('Title:', newsletterData.title);
    console.log('Summary:', newsletterData.summary);
    console.log('Slug:', slug);
    console.log('\nItems:');
    newsletterData.items.forEach((item, i) => {
      console.log(`  ${i + 1}. [${item.product}] ${item.headline}`);
      console.log(`     Pattern: ${item.patternSlug}`);
    });
    console.log('\nTakeaway:', newsletterData.takeaway.title);
    return newsletterData;
  }

  console.log('\nStep 3: Saving draft to database...');

  const draft = await prisma.newsletterDraft.create({
    data: {
      title: newsletterData.title,
      slug,
      summary: newsletterData.summary,
      content: htmlContent,
      publishDate: new Date(),
      status: 'pending_review',
      sources: newsData.items.map((item) => item.link),
    },
  });

  console.log(`✅ Draft saved: ${draft.id}`);

  // Step 5: Send admin notification
  console.log('\nStep 4: Sending admin notification...');
  const previewUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/admin/newsletter?id=${draft.id}`;
  await sendAdminNotification(draft, previewUrl);

  console.log('\n🎉 Newsletter generation complete!');
  console.log(`   Draft ID: ${draft.id}`);
  console.log(`   Preview: ${previewUrl}`);

  return draft;
}

// Export for use in API route
module.exports = { generateNewsletter };

// Run if called directly
if (require.main === module) {
  const args = process.argv.slice(2);
  const dryRun = args.includes('--dry-run');

  generateNewsletter({ dryRun })
    .then((result) => {
      if (result) {
        console.log('\n✅ Done');
      }
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n❌ Error:', error.message);
      process.exit(1);
    })
    .finally(() => {
      prisma.$disconnect();
    });
}
