/**
 * Analytics Input Helper
 *
 * Simple helper to collect analytics data manually from Vercel Analytics
 * (No external dependencies - uses built-in readline)
 */

import readline from 'readline';

/**
 * Create readline interface
 */
function createInterface() {
  return readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
}

/**
 * Ask a question and get user input
 * @param {string} question - Question to ask
 * @param {string} defaultValue - Default value if user presses enter
 */
function askQuestion(rl, question, defaultValue = '') {
  return new Promise((resolve) => {
    const prompt = defaultValue
      ? `${question} (default: ${defaultValue}): `
      : `${question}: `;

    rl.question(prompt, (answer) => {
      resolve(answer.trim() || defaultValue);
    });
  });
}

/**
 * Collect analytics data from user input
 * Prompts for all key metrics from Vercel Analytics
 */
export async function collectAnalyticsData() {
  const rl = createInterface();

  console.log('\n📊 ANALYTICS DATA COLLECTION');
  console.log('─'.repeat(50));
  console.log('Please enter data from Vercel Analytics Dashboard\n');

  try {
    const uniqueVisitors = await askQuestion(
      rl,
      'Unique visitors (this month)',
      '0'
    );

    const pageViews = await askQuestion(
      rl,
      'Total page views (this month)',
      '0'
    );

    const avgSessionMinutes = await askQuestion(
      rl,
      'Average session duration (minutes)',
      '0'
    );

    const bounceRate = await askQuestion(
      rl,
      'Bounce rate (%)',
      '0'
    );

    const returnVisitors = await askQuestion(
      rl,
      'Return visitors',
      '0'
    );

    // Traffic sources
    console.log('\nTraffic Sources (as percentages):');
    const directTraffic = await askQuestion(rl, '  Direct (%)', '0');
    const socialTraffic = await askQuestion(rl, '  Social media (%)', '0');
    const referralTraffic = await askQuestion(rl, '  Referral (%)', '0');
    const organicTraffic = await askQuestion(rl, '  Organic search (%)', '0');

    // Top pages
    console.log('\nTop 3 Most Viewed Pages/Patterns:');
    const topPage1 = await askQuestion(rl, '  1st most viewed', 'N/A');
    const topPage2 = await askQuestion(rl, '  2nd most viewed', 'N/A');
    const topPage3 = await askQuestion(rl, '  3rd most viewed', 'N/A');

    rl.close();

    return {
      visitors: {
        unique: parseInt(uniqueVisitors) || 0,
        pageViews: parseInt(pageViews) || 0,
        avgSessionMinutes: parseFloat(avgSessionMinutes) || 0,
        bounceRate: parseFloat(bounceRate) || 0,
        returnVisitors: parseInt(returnVisitors) || 0,
      },
      traffic: {
        direct: parseFloat(directTraffic) || 0,
        social: parseFloat(socialTraffic) || 0,
        referral: parseFloat(referralTraffic) || 0,
        organic: parseFloat(organicTraffic) || 0,
      },
      topPages: [topPage1, topPage2, topPage3].filter((p) => p !== 'N/A'),
      collectedAt: new Date().toISOString(),
    };
  } catch (error) {
    rl.close();
    console.error('Error collecting analytics data:', error);
    return null;
  }
}

/**
 * Quick analytics input (fewer questions)
 */
export async function collectQuickAnalytics(includeNewsletter = false) {
  const rl = createInterface();

  console.log('\n📊 QUICK ANALYTICS CHECK');
  console.log('─'.repeat(50));

  try {
    const uniqueVisitors = await askQuestion(
      rl,
      'Unique visitors (this month)',
      '0'
    );

    const avgSessionMinutes = await askQuestion(
      rl,
      'Average session duration (minutes)',
      '0'
    );

    const bounceRate = await askQuestion(
      rl,
      'Bounce rate (%)',
      '0'
    );

    let newsletterSubs = 0;
    if (includeNewsletter) {
      console.log('\n📧 Newsletter Data:');
      newsletterSubs = await askQuestion(
        rl,
        'Newsletter subscribers (total)',
        '0'
      );
    }

    rl.close();

    return {
      uniqueVisitors: parseInt(uniqueVisitors) || 0,
      avgSessionMinutes: parseFloat(avgSessionMinutes) || 0,
      bounceRate: parseFloat(bounceRate) || 0,
      newsletterSubscribers: parseInt(newsletterSubs) || 0,
      collectedAt: new Date().toISOString(),
    };
  } catch (error) {
    rl.close();
    console.error('Error collecting quick analytics:', error);
    return null;
  }
}

/**
 * Display analytics summary
 */
export function displayAnalyticsSummary(data) {
  if (!data) {
    console.log('❌ No analytics data available');
    return;
  }

  console.log('\n📊 ANALYTICS SUMMARY');
  console.log('─'.repeat(50));
  console.log(`Unique Visitors: ${data.visitors.unique.toLocaleString()}`);
  console.log(`Page Views: ${data.visitors.pageViews.toLocaleString()}`);
  console.log(`Avg Session: ${data.visitors.avgSessionMinutes.toFixed(1)} min`);
  console.log(`Bounce Rate: ${data.visitors.bounceRate}%`);
  console.log(`Return Visitors: ${data.visitors.returnVisitors}`);

  console.log('\nTraffic Sources:');
  console.log(`  Direct: ${data.traffic.direct}%`);
  console.log(`  Social: ${data.traffic.social}%`);
  console.log(`  Referral: ${data.traffic.referral}%`);
  console.log(`  Organic: ${data.traffic.organic}%`);

  if (data.topPages.length > 0) {
    console.log('\nTop Pages:');
    data.topPages.forEach((page, i) => {
      console.log(`  ${i + 1}. ${page}`);
    });
  }
}

// For testing
if (import.meta.url === `file://${process.argv[1]}`) {
  console.log('Testing Analytics Input Helper...\n');

  const data = await collectAnalyticsData();

  if (data) {
    displayAnalyticsSummary(data);
  }
}
