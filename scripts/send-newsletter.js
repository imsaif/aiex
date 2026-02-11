#!/usr/bin/env node

/**
 * Newsletter Update Script
 *
 * Sends pattern update emails to all active subscribers.
 *
 * Usage:
 *   npm run send-newsletter                                # Interactive mode
 *   npm run send-newsletter -- --patterns pattern-slug-1   # Single pattern
 *   npm run send-newsletter -- --patterns pattern-1,pattern-2  # Multiple patterns
 *
 * Examples:
 *   npm run send-newsletter
 *   npm run send-newsletter -- --patterns contextual-assistance
 *   npm run send-newsletter -- --patterns adaptive-interfaces,explainable-ai
 */

const readline = require('readline');
const patterns = require('../src/data/patterns').default;

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function question(query) {
  return new Promise((resolve) => rl.question(query, resolve));
}

function findPattern(slug) {
  return patterns.find((p) => p.slug === slug);
}

async function sendNewsletterUpdate(patternSlugs) {
  const selectedPatterns = patternSlugs
    .map((slug) => {
      const pattern = findPattern(slug);
      if (!pattern) {
        console.warn(`⚠️  Pattern not found: ${slug}`);
        return null;
      }
      return {
        id: pattern.id,
        title: pattern.title,
        description: pattern.description,
        slug: pattern.slug,
        category: pattern.category,
      };
    })
    .filter(Boolean);

  if (selectedPatterns.length === 0) {
    console.error('❌ No valid patterns found');
    process.exit(1);
  }

  console.log('\n📧 Sending newsletter update...');
  console.log(`Patterns: ${selectedPatterns.map((p) => p.title).join(', ')}\n`);

  const apiKey = process.env.NEWSLETTER_API_KEY;
  if (!apiKey || apiKey === 'your_secure_api_key_here') {
    console.error('❌ NEWSLETTER_API_KEY is not configured in .env.local');
    console.error('   Please set a secure API key in your .env.local file');
    process.exit(1);
  }

  try {
    const response = await fetch('http://localhost:3000/api/newsletter/send-update', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        patterns: selectedPatterns,
        apiKey,
      }),
    });

    const data = await response.json();

    if (response.ok) {
      console.log('✅ Newsletter sent successfully!\n');
      console.log(`   Total subscribers: ${data.totalSubscribers}`);
      console.log(`   ✓ Sent: ${data.successCount}`);
      if (data.failureCount > 0) {
        console.log(`   ✗ Failed: ${data.failureCount}`);
      }
    } else {
      console.error('❌ Failed to send newsletter:', data.error);
      process.exit(1);
    }
  } catch (error) {
    console.error('❌ Error sending newsletter:', error.message);
    console.error('   Make sure your dev server is running: npm run dev');
    process.exit(1);
  }
}

async function interactiveMode() {
  console.log('\n📧 Newsletter Update Tool\n');
  console.log('Available patterns:');
  patterns.forEach((p, idx) => {
    console.log(`  ${idx + 1}. ${p.title} (${p.slug})`);
  });
  console.log('');

  const input = await question(
    'Enter pattern slugs (comma-separated) or numbers: '
  );

  const items = input.split(',').map((s) => s.trim());
  const patternSlugs = items
    .map((item) => {
      // Check if it's a number
      const num = parseInt(item, 10);
      if (!isNaN(num) && num > 0 && num <= patterns.length) {
        return patterns[num - 1].slug;
      }
      return item;
    })
    .filter(Boolean);

  const confirm = await question(
    `\nSend newsletter for ${patternSlugs.length} pattern(s)? (yes/no): `
  );

  rl.close();

  if (confirm.toLowerCase() !== 'yes' && confirm.toLowerCase() !== 'y') {
    console.log('Cancelled.');
    process.exit(0);
  }

  await sendNewsletterUpdate(patternSlugs);
}

async function main() {
  const args = process.argv.slice(2);

  // Check if --patterns flag is provided
  const patternsIndex = args.indexOf('--patterns');
  if (patternsIndex !== -1 && args[patternsIndex + 1]) {
    const patternSlugs = args[patternsIndex + 1].split(',').map((s) => s.trim());
    await sendNewsletterUpdate(patternSlugs);
  } else {
    // Interactive mode
    await interactiveMode();
  }
}

main().catch((error) => {
  console.error('Error:', error);
  process.exit(1);
});
