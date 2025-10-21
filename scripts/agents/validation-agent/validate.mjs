#!/usr/bin/env node

/**
 * Product Validation Agent (MVP)
 *
 * Simple validation tool to track product metrics and make data-driven decisions
 * Usage: npm run validate
 */

// Load environment variables
import { config as dotenvConfig } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load .env first, then .env.local (which will override)
dotenvConfig({ path: join(__dirname, '../../../.env') });
dotenvConfig({ path: join(__dirname, '../../../.env.local') });

import config from './config.mjs';
import { getNewsletterMetrics, closeConnection } from './data-collectors/newsletter.mjs';
import { getGitHubMetrics } from './data-collectors/github.mjs';
import { collectQuickAnalytics } from './data-collectors/analytics.mjs';

/**
 * Calculate days since launch
 */
function daysSinceLaunch() {
  const launch = new Date(config.project.launchDate);
  const now = new Date();
  const diff = now - launch;
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

/**
 * Determine which month we're in (for targets)
 */
function getCurrentMonth() {
  const days = daysSinceLaunch();
  if (days < 30) return 1;
  if (days < 60) return 2;
  if (days < 90) return 3;
  if (days < 180) return 6;
  return 6; // Cap at month 6 targets
}

/**
 * Get targets for current month
 */
function getCurrentTargets() {
  const month = getCurrentMonth();
  return config.targets[`month${month}`] || config.targets.month1;
}

/**
 * Check if metric meets target
 */
function checkTarget(value, target) {
  if (typeof target === 'object') {
    if (target.min && target.max) {
      return value >= target.min && value <= target.max;
    }
    if (target.min) {
      return value >= target.min;
    }
    if (target.max) {
      return value <= target.max;
    }
  }
  return false;
}

/**
 * Get status emoji
 */
function getStatusEmoji(value, target) {
  if (!target) return '⚪';
  const meetsTarget = checkTarget(value, target);
  return meetsTarget ? '✅' : '❌';
}

/**
 * Make decision based on metrics
 */
function makeDecision(metrics, targets) {
  const scores = {
    visitors: checkTarget(metrics.visitors, targets.visitors) ? 1 : 0,
    subscribers: checkTarget(metrics.subscribers, targets.subscribers) ? 1 : 0,
    conversionRate: checkTarget(metrics.conversionRate, targets.conversionRate) ? 1 : 0,
    githubStars: checkTarget(metrics.githubStars, targets.githubStars) ? 1 : 0,
  };

  const totalScore = Object.values(scores).reduce((a, b) => a + b, 0);
  const percentage = (totalScore / 4) * 100;

  if (percentage >= 75) {
    return {
      decision: 'CONTINUE ✅',
      status: 'strong',
      message: 'Strong performance! You\'re meeting or exceeding targets.',
      color: '\x1b[32m', // Green
    };
  } else if (percentage >= 50) {
    return {
      decision: 'REFINE ⚠️',
      status: 'moderate',
      message: 'Moderate performance. Focus on improving weak areas.',
      color: '\x1b[33m', // Yellow
    };
  } else {
    return {
      decision: 'PIVOT ❌',
      status: 'weak',
      message: 'Below targets. Consider pivoting strategy or approach.',
      color: '\x1b[31m', // Red
    };
  }
}

/**
 * Display validation report
 */
function displayReport(newsletter, github, analytics, targets) {
  const reset = '\x1b[0m';
  const bold = '\x1b[1m';
  const cyan = '\x1b[36m';

  console.clear();
  console.log(`${bold}${cyan}`);
  console.log('╔════════════════════════════════════════════════════════════╗');
  console.log('║           PRODUCT VALIDATION REPORT                        ║');
  console.log('╚════════════════════════════════════════════════════════════╝');
  console.log(reset);

  // Project info
  console.log(`${bold}Project:${reset} ${config.project.name}`);
  console.log(`${bold}Website:${reset} ${config.project.website}`);
  console.log(`${bold}Days Since Launch:${reset} ${daysSinceLaunch()} days`);
  console.log(`${bold}Current Month:${reset} Month ${getCurrentMonth()}`);
  console.log();

  // Newsletter Metrics
  console.log(`${bold}📧 NEWSLETTER METRICS${reset}`);
  console.log('─'.repeat(60));
  const subsEmoji = getStatusEmoji(newsletter.totalSubscribers, targets.subscribers);
  console.log(
    `Subscribers: ${newsletter.totalSubscribers} ${subsEmoji} (Target: ${targets.subscribers.min}-${targets.subscribers.max})`
  );
  console.log(`New This Month: ${newsletter.newSubscribers}`);
  console.log(`Growth Rate: ${newsletter.growthRate}%`);
  console.log();

  // GitHub Metrics
  console.log(`${bold}⭐ GITHUB METRICS${reset}`);
  console.log('─'.repeat(60));
  const starsEmoji = getStatusEmoji(github.stats.stars, targets.githubStars);
  console.log(
    `Stars: ${github.stats.stars} ${starsEmoji} (Target: ${targets.githubStars.min}+)`
  );
  console.log(`Forks: ${github.stats.forks}`);
  console.log(`Contributors: ${github.contributors.total}`);
  console.log(`Recent Commits: ${github.activity.commits}`);
  console.log();

  // Analytics Metrics
  if (analytics) {
    console.log(`${bold}📊 ANALYTICS METRICS${reset}`);
    console.log('─'.repeat(60));
    const visitorsEmoji = getStatusEmoji(analytics.uniqueVisitors, targets.visitors);
    console.log(
      `Unique Visitors: ${analytics.uniqueVisitors} ${visitorsEmoji} (Target: ${targets.visitors.min}-${targets.visitors.max})`
    );
    const sessionEmoji = getStatusEmoji(analytics.avgSessionMinutes, targets.avgSession);
    console.log(
      `Avg Session: ${analytics.avgSessionMinutes} min ${sessionEmoji} (Target: ${targets.avgSession.min}+ min)`
    );
    const bounceEmoji =
      analytics.bounceRate <= (targets.bounceRate?.max || 70) ? '✅' : '❌';
    console.log(
      `Bounce Rate: ${analytics.bounceRate}% ${bounceEmoji} (Target: <${targets.bounceRate.max}%)`
    );

    // Calculate conversion rate
    const conversionRate =
      analytics.uniqueVisitors > 0
        ? ((newsletter.newSubscribers / analytics.uniqueVisitors) * 100).toFixed(2)
        : 0;
    const convEmoji = getStatusEmoji(parseFloat(conversionRate), targets.conversionRate);
    console.log(
      `Conversion Rate: ${conversionRate}% ${convEmoji} (Target: ${targets.conversionRate.min}-${targets.conversionRate.max}%)`
    );
    console.log();
  }

  // Decision
  const metrics = {
    visitors: analytics?.uniqueVisitors || 0,
    subscribers: newsletter.totalSubscribers,
    conversionRate: analytics
      ? parseFloat(
          ((newsletter.newSubscribers / analytics.uniqueVisitors) * 100).toFixed(2)
        )
      : 0,
    githubStars: github.stats.stars,
  };

  const decision = makeDecision(metrics, targets);

  console.log(`${bold}${decision.color}📋 RECOMMENDATION${reset}`);
  console.log('─'.repeat(60));
  console.log(`${decision.color}${bold}${decision.decision}${reset}`);
  console.log(decision.message);
  console.log();

  // Next Steps
  console.log(`${bold}🎯 NEXT STEPS${reset}`);
  console.log('─'.repeat(60));

  if (decision.status === 'strong') {
    console.log('• Continue current strategy');
    console.log('• Complete most-viewed patterns');
    console.log('• Scale distribution channels');
    console.log('• Consider feature expansion');
  } else if (decision.status === 'moderate') {
    console.log('• Identify and fix weak areas');
    console.log('• Improve conversion rate');
    console.log('• Test different distribution channels');
    console.log('• Gather more user feedback');
  } else {
    console.log('• Review core value proposition');
    console.log('• Interview potential users');
    console.log('• Consider major changes to approach');
    console.log('• Test different positioning');
  }

  console.log();
  console.log('─'.repeat(60));
  console.log(`Report generated: ${new Date().toLocaleString()}`);
  console.log();
}

/**
 * Main validation function
 */
async function runValidation() {
  try {
    console.log('🔍 Collecting validation data...\n');

    // Get newsletter data
    console.log('📧 Fetching newsletter metrics...');
    let newsletter;
    try {
      newsletter = await getNewsletterMetrics(30);
    } catch (error) {
      // Fallback: If database connection fails, use manual input
      console.log('⚠️  Database connection failed. Using manual input...');
      newsletter = {
        totalSubscribers: 0,
        newSubscribers: 0,
        monthlyGrowth: [],
        growthRate: 0,
        churnRate: 0,
        inactiveCount: 0,
        period: 'Last 30 days',
      };
    }

    // Get GitHub data
    console.log('⭐ Fetching GitHub metrics...');
    const githubToken = process.env.GITHUB_TOKEN;
    const github = await getGitHubMetrics(
      config.github.owner,
      config.github.repo,
      githubToken,
      30
    );

    // Get analytics data (manual input)
    console.log('📊 Collecting analytics data...\n');
    const needsNewsletterInput = newsletter.totalSubscribers === 0;
    const analytics = await collectQuickAnalytics(needsNewsletterInput);

    // Update newsletter data if it was manually entered
    if (needsNewsletterInput && analytics.newsletterSubscribers > 0) {
      newsletter.totalSubscribers = analytics.newsletterSubscribers;
    }

    // Get current targets
    const targets = getCurrentTargets();

    // Display report
    displayReport(newsletter, github, analytics, targets);

    // Cleanup
    await closeConnection();
  } catch (error) {
    console.error('❌ Error running validation:', error);
    process.exit(1);
  }
}

// Run validation
runValidation();
