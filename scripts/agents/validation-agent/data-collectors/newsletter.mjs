/**
 * Newsletter Data Collector
 *
 * Collects newsletter subscriber metrics from the Prisma database
 */

// Load environment variables
import { config as dotenvConfig } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load .env and .env.local
dotenvConfig({ path: join(__dirname, '../../../../.env') });
dotenvConfig({ path: join(__dirname, '../../../../.env.local') });

import { PrismaClient } from '../../../../src/generated/prisma/index.js';

const prisma = new PrismaClient();

/**
 * Get total number of active subscribers
 */
export async function getTotalSubscribers() {
  try {
    const count = await prisma.subscriber.count({
      where: {
        active: true,
      },
    });
    return count;
  } catch (error) {
    console.error('Error fetching total subscribers:', error);
    return 0;
  }
}

/**
 * Get number of new subscribers in the last N days
 * @param {number} days - Number of days to look back
 */
export async function getNewSubscribers(days = 30) {
  try {
    const date = new Date();
    date.setDate(date.getDate() - days);

    const count = await prisma.subscriber.count({
      where: {
        active: true,
        subscribedAt: {
          gte: date,
        },
      },
    });
    return count;
  } catch (error) {
    console.error(`Error fetching new subscribers (last ${days} days):`, error);
    return 0;
  }
}

/**
 * Get subscriber growth by month
 * Returns an array of { month, count, newSubscribers }
 */
export async function getMonthlyGrowth() {
  try {
    const subscribers = await prisma.subscriber.findMany({
      where: {
        active: true,
      },
      orderBy: {
        subscribedAt: 'asc',
      },
      select: {
        subscribedAt: true,
      },
    });

    // Group by month
    const monthlyData = {};
    subscribers.forEach((sub) => {
      const monthKey = sub.subscribedAt.toISOString().slice(0, 7); // YYYY-MM
      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = 0;
      }
      monthlyData[monthKey]++;
    });

    // Convert to array with cumulative count
    let cumulative = 0;
    const growth = Object.entries(monthlyData).map(([month, newSubs]) => {
      cumulative += newSubs;
      return {
        month,
        newSubscribers: newSubs,
        totalSubscribers: cumulative,
      };
    });

    return growth;
  } catch (error) {
    console.error('Error fetching monthly growth:', error);
    return [];
  }
}

/**
 * Get subscriber conversion rate
 * @param {number} totalVisitors - Total unique visitors in period
 * @param {number} days - Period in days (default 30)
 */
export async function getConversionRate(totalVisitors, days = 30) {
  if (!totalVisitors || totalVisitors === 0) {
    return 0;
  }

  const newSubscribers = await getNewSubscribers(days);
  return ((newSubscribers / totalVisitors) * 100).toFixed(2);
}

/**
 * Get subscriber stats for a specific period
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date (defaults to now)
 */
export async function getSubscriberStats(startDate, endDate = new Date()) {
  try {
    // Ensure dates are valid
    const validStartDate = startDate instanceof Date && !isNaN(startDate) ? startDate : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const validEndDate = endDate instanceof Date && !isNaN(endDate) ? endDate : new Date();

    const [total, newInPeriod, inactive] = await Promise.all([
      // Total active subscribers
      prisma.subscriber.count({ where: { active: true } }),

      // New subscribers in period
      prisma.subscriber.count({
        where: {
          active: true,
          subscribedAt: {
            gte: validStartDate,
            lte: validEndDate,
          },
        },
      }),

      // Inactive (unsubscribed) count
      prisma.subscriber.count({ where: { active: false } }),
    ]);

    // Calculate growth rate
    const previousTotal = total - newInPeriod;
    const growthRate =
      previousTotal > 0 ? ((newInPeriod / previousTotal) * 100).toFixed(2) : 0;

    return {
      total,
      newInPeriod,
      inactive,
      growthRate: parseFloat(growthRate),
      churnRate: total > 0 ? ((inactive / (total + inactive)) * 100).toFixed(2) : 0,
    };
  } catch (error) {
    console.error('Error fetching subscriber stats:', error);
    return {
      total: 0,
      newInPeriod: 0,
      inactive: 0,
      growthRate: 0,
      churnRate: 0,
    };
  }
}

/**
 * Get all newsletter metrics for validation
 * @param {number} days - Period to analyze (default 30 days)
 */
export async function getNewsletterMetrics(days = 30) {
  const startDate = new Date();
  startDate.setDate(startDate.setDate() - days);

  const [totalSubs, newSubs, monthlyGrowth, stats] = await Promise.all([
    getTotalSubscribers(),
    getNewSubscribers(days),
    getMonthlyGrowth(),
    getSubscriberStats(startDate),
  ]);

  // If all values are 0 or default, it means database connection failed
  if (totalSubs === 0 && newSubs === 0 && monthlyGrowth.length === 0) {
    throw new Error('Database connection failed. All metrics returned 0.');
  }

  return {
    totalSubscribers: totalSubs,
    newSubscribers: newSubs,
    monthlyGrowth,
    growthRate: stats.growthRate,
    churnRate: stats.churnRate,
    inactiveCount: stats.inactive,
    period: `Last ${days} days`,
  };
}

/**
 * Close Prisma connection
 */
export async function closeConnection() {
  await prisma.$disconnect();
}

// For testing
if (import.meta.url === `file://${process.argv[1]}`) {
  console.log('Testing Newsletter Data Collector...\n');

  const metrics = await getNewsletterMetrics(30);
  console.log('Newsletter Metrics (Last 30 days):');
  console.log('─'.repeat(50));
  console.log(`Total Subscribers: ${metrics.totalSubscribers}`);
  console.log(`New Subscribers: ${metrics.newSubscribers}`);
  console.log(`Growth Rate: ${metrics.growthRate}%`);
  console.log(`Churn Rate: ${metrics.churnRate}%`);
  console.log(`Inactive Count: ${metrics.inactiveCount}`);
  console.log('\nMonthly Growth:');
  metrics.monthlyGrowth.forEach((m) => {
    console.log(`  ${m.month}: +${m.newSubscribers} (Total: ${m.totalSubscribers})`);
  });

  await closeConnection();
}
