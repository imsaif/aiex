#!/usr/bin/env node

/**
 * Daily News Aggregator
 *
 * Fetches and aggregates news from AI product RSS feeds for newsletter generation.
 * Filters for items published in the last 24-48 hours.
 *
 * Usage:
 *   node scripts/daily-news-aggregator.js
 *
 * Returns structured news items for AI processing.
 */

const Parser = require('rss-parser');

const parser = new Parser({
  timeout: 10000,
  headers: {
    'User-Agent': 'AIUX-Newsletter-Bot/1.0',
  },
});

// RSS feed sources for AI products
const RSS_SOURCES = [
  {
    name: 'OpenAI',
    url: 'https://openai.com/blog/rss.xml',
    color: '#10a37f',
  },
  {
    name: 'Anthropic',
    url: 'https://www.anthropic.com/rss.xml',
    color: '#d97706',
  },
  {
    name: 'Google AI',
    url: 'https://blog.google/technology/ai/rss/',
    color: '#4285f4',
  },
  {
    name: 'Vercel',
    url: 'https://vercel.com/atom',
    color: '#000000',
  },
  {
    name: 'GitHub',
    url: 'https://github.blog/feed/',
    color: '#333333',
  },
];

// Keywords to filter for AI/UX relevant content
const RELEVANCE_KEYWORDS = [
  'ai',
  'artificial intelligence',
  'machine learning',
  'llm',
  'gpt',
  'claude',
  'gemini',
  'copilot',
  'chatbot',
  'assistant',
  'model',
  'agent',
  'ux',
  'user experience',
  'interface',
  'design',
  'feature',
  'update',
  'launch',
  'release',
  'new',
  'announce',
];

/**
 * Check if an item is relevant based on keywords
 */
function isRelevant(item) {
  const text = `${item.title || ''} ${item.contentSnippet || ''} ${item.content || ''}`.toLowerCase();
  return RELEVANCE_KEYWORDS.some((keyword) => text.includes(keyword));
}

/**
 * Check if an item is from the last N hours
 */
function isRecent(item, hoursAgo = 48) {
  if (!item.pubDate && !item.isoDate) return false;
  const pubDate = new Date(item.pubDate || item.isoDate);
  const cutoff = new Date(Date.now() - hoursAgo * 60 * 60 * 1000);
  return pubDate >= cutoff;
}

/**
 * Fetch and parse a single RSS feed
 */
async function fetchFeed(source) {
  try {
    console.log(`📡 Fetching: ${source.name}...`);
    const feed = await parser.parseURL(source.url);

    const items = (feed.items || [])
      .filter((item) => isRecent(item, 48))
      .filter(isRelevant)
      .map((item) => ({
        source: source.name,
        sourceColor: source.color,
        title: item.title?.trim() || 'Untitled',
        description: item.contentSnippet?.slice(0, 500) || item.content?.slice(0, 500) || '',
        link: item.link || '',
        pubDate: item.pubDate || item.isoDate || new Date().toISOString(),
      }));

    console.log(`   ✓ Found ${items.length} relevant items from ${source.name}`);
    return items;
  } catch (error) {
    console.warn(`   ⚠️ Failed to fetch ${source.name}: ${error.message}`);
    return [];
  }
}

/**
 * Aggregate news from all sources
 */
async function aggregateNews() {
  console.log('\n🔄 Starting news aggregation...\n');

  const results = await Promise.allSettled(RSS_SOURCES.map(fetchFeed));

  const allItems = results
    .filter((r) => r.status === 'fulfilled')
    .flatMap((r) => r.value)
    .sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));

  console.log(`\n✅ Aggregation complete: ${allItems.length} total items\n`);

  return {
    fetchedAt: new Date().toISOString(),
    totalItems: allItems.length,
    items: allItems,
  };
}

/**
 * Main function - can be called directly or imported
 */
async function main() {
  const result = await aggregateNews();

  if (result.items.length === 0) {
    console.log('⚠️ No relevant news items found in the last 48 hours.');
    console.log('   This could mean:');
    console.log('   - No new AI/UX announcements');
    console.log('   - RSS feeds are temporarily unavailable');
    console.log('   - Keywords need adjustment');
  } else {
    console.log('📰 News items found:');
    result.items.forEach((item, idx) => {
      console.log(`\n${idx + 1}. [${item.source}] ${item.title}`);
      console.log(`   ${item.description.slice(0, 100)}...`);
      console.log(`   ${item.link}`);
    });
  }

  return result;
}

// Export for use in other modules
module.exports = { aggregateNews, RSS_SOURCES };

// Run if called directly
if (require.main === module) {
  main()
    .then((result) => {
      console.log('\n📋 JSON Output:');
      console.log(JSON.stringify(result, null, 2));
    })
    .catch((error) => {
      console.error('Error:', error);
      process.exit(1);
    });
}
