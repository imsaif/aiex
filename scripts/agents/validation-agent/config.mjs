/**
 * Validation Agent Configuration
 *
 * Configuration for the AI-powered product validation agent
 * that helps track and validate aiuxdesign.guide
 */

import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default {
  // Project information
  project: {
    name: 'aiux - AI Design Patterns',
    website: 'aiuxdesign.guide',
    launchDate: '2025-10-19', // Update this with actual launch date
  },

  // GitHub repository
  github: {
    owner: 'imsaif',
    repo: 'aiex',
    // Optional: Add GitHub Personal Access Token in .env.local
    // GITHUB_TOKEN=your_token_here (for higher API rate limits)
  },

  // Validation document paths
  validation: {
    docPath: join(__dirname, '../../../docs/product/VALIDATION_STRATEGY.md'),
    reportsDir: join(__dirname, '../../../docs/product/reports'),
    checkpointInterval: 30, // days between checkpoints
  },

  // AI configuration (Claude API)
  ai: {
    model: 'claude-3-5-sonnet-20241022',
    maxTokens: 2000,
    temperature: 0.7,
    // API key from environment variable
    // ANTHROPIC_API_KEY=your_key_here in .env.local
  },

  // Monthly targets by month
  targets: {
    month1: {
      visitors: { min: 100, max: 200 },
      subscribers: { min: 5, max: 10 },
      githubStars: { min: 5 },
      avgSession: { min: 2 }, // minutes
      bounceRate: { max: 70 }, // percentage
      conversionRate: { min: 5, max: 10 }, // percentage
    },
    month2: {
      visitors: { min: 300, max: 500 },
      subscribers: { min: 15, max: 30 },
      githubStars: { min: 10 },
      avgSession: { min: 2.5 },
      bounceRate: { max: 65 },
      conversionRate: { min: 5, max: 10 },
    },
    month3: {
      visitors: { min: 500, max: 1000 },
      subscribers: { min: 30, max: 50 },
      githubStars: { min: 20 },
      avgSession: { min: 3 },
      bounceRate: { max: 60 },
      conversionRate: { min: 5, max: 10 },
      organicTraffic: { min: 25 }, // percentage
    },
    month6: {
      visitors: { min: 2000, max: 5000 },
      subscribers: { min: 100, max: 200 },
      githubStars: { min: 50 },
      avgSession: { min: 3.5 },
      bounceRate: { max: 55 },
      conversionRate: { min: 5, max: 10 },
      organicTraffic: { min: 30 },
    },
  },

  // Success thresholds for decision making
  decision: {
    // Strong validation - Continue and scale
    strong: {
      visitorMultiplier: 1.5, // 150% of target
      subscriberMultiplier: 2, // 200% of target
      organicGrowth: true,
      positiveFeedback: 5,
    },
    // Moderate - Continue but refine
    moderate: {
      visitorMultiplier: 0.75, // 75% of target
      subscriberMultiplier: 0.5, // 50% of target
      organicGrowth: false,
      positiveFeedback: 2,
    },
    // Weak - Consider pivot
    weak: {
      visitorMultiplier: 0.5, // <50% of target
      subscriberMultiplier: 0.2, // <20% of target
      noEngagement: true,
    },
  },

  // Data collection intervals
  collection: {
    newsletterCheck: 'realtime', // Check Prisma DB in real-time
    githubCheck: 'api', // Use GitHub API
    analyticsCheck: 'manual', // Manual input from Vercel Analytics
  },

  // Output formatting
  output: {
    colors: true,
    emoji: true,
    verbose: false,
  },

  // Alert settings
  alerts: {
    checkpointReminder: true,
    emailAlerts: false, // Future: send email alerts
    slackAlerts: false, // Future: Slack integration
  },
};
