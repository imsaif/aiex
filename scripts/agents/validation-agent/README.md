# Product Validation Agent (MVP)

An AI-powered validation agent that helps you track and validate the success of aiuxdesign.guide through automated data collection and smart recommendations.

## Overview

This agent automatically:
- 📧 Collects newsletter subscriber metrics from your database
- ⭐ Fetches GitHub repository statistics (stars, forks, contributors)
- 📊 Prompts for analytics data from Vercel Analytics
- 🎯 Compares metrics against monthly targets
- 📋 Provides clear recommendations (Continue/Refine/Pivot)

## Quick Start

```bash
# Run validation (includes all data collection and analysis)
npm run validate
```

## What It Does

### 1. Automated Data Collection

**Newsletter Metrics** (from Prisma database):
- Total active subscribers
- New subscribers this month
- Growth rate
- Churn rate

**GitHub Metrics** (from GitHub API):
- Repository stars, forks, watchers
- Number of contributors
- Recent commits, issues, PRs
- Activity trends

**Analytics Data** (manual input):
- Unique visitors
- Average session duration
- Bounce rate

### 2. Target Comparison

The agent automatically determines which month you're in (based on launch date) and compares your metrics against the appropriate targets from the validation strategy:

| Month | Visitors | Subscribers | GitHub Stars | Avg Session |
|-------|----------|-------------|--------------|-------------|
| 1     | 100-200  | 5-10        | 5+           | 2+ min      |
| 2     | 300-500  | 15-30       | 10+          | 2.5+ min    |
| 3     | 500-1000 | 30-50       | 20+          | 3+ min      |
| 6     | 2000-5000| 100-200     | 50+          | 3.5+ min    |

### 3. Smart Recommendations

Based on your performance, the agent recommends:

**✅ CONTINUE** (75%+ of targets met)
- Strong performance
- Keep current strategy
- Focus on scaling

**⚠️ REFINE** (50-75% of targets met)
- Moderate performance
- Identify weak areas
- Test improvements

**❌ PIVOT** (<50% of targets met)
- Below targets
- Review strategy
- Consider major changes

## Usage

### Basic Validation

```bash
npm run validate
```

This will:
1. Fetch newsletter data automatically
2. Fetch GitHub stats automatically
3. Prompt you for analytics data
4. Generate a comprehensive report
5. Provide actionable recommendations

### Manual Testing

You can test individual data collectors:

```bash
# Test newsletter collector
node scripts/agents/validation-agent/data-collectors/newsletter.mjs

# Test GitHub collector
node scripts/agents/validation-agent/data-collectors/github.mjs

# Test analytics input
node scripts/agents/validation-agent/data-collectors/analytics.mjs
```

## Configuration

### Update Launch Date

Edit `config.mjs` and set your actual launch date:

```javascript
project: {
  launchDate: '2025-10-19', // Update this!
}
```

### GitHub API Token (Optional)

For higher rate limits, add a GitHub Personal Access Token:

1. Create token at: https://github.com/settings/tokens
2. Add to `.env.local`:
   ```
   GITHUB_TOKEN=your_token_here
   ```

Without a token, you're limited to 60 requests/hour. With a token: 5000 requests/hour.

### Custom Targets

You can adjust monthly targets in `config.mjs`:

```javascript
targets: {
  month1: {
    visitors: { min: 100, max: 200 },
    subscribers: { min: 5, max: 10 },
    // ... more targets
  },
}
```

## Example Output

```
╔════════════════════════════════════════════════════════════╗
║           PRODUCT VALIDATION REPORT                        ║
╚════════════════════════════════════════════════════════════╝

Project: aiux - AI Design Patterns
Website: aiuxdesign.guide
Days Since Launch: 15 days
Current Month: Month 1

📧 NEWSLETTER METRICS
────────────────────────────────────────────────────────────
Subscribers: 8 ✅ (Target: 5-10)
New This Month: 8
Growth Rate: 0%

⭐ GITHUB METRICS
────────────────────────────────────────────────────────────
Stars: 6 ✅ (Target: 5+)
Forks: 2
Contributors: 1
Recent Commits: 15

📊 ANALYTICS METRICS
────────────────────────────────────────────────────────────
Unique Visitors: 127 ✅ (Target: 100-200)
Avg Session: 2.3 min ✅ (Target: 2+ min)
Bounce Rate: 65% ✅ (Target: <70%)
Conversion Rate: 6.30% ✅ (Target: 5-10%)

📋 RECOMMENDATION
────────────────────────────────────────────────────────────
CONTINUE ✅
Strong performance! You're meeting or exceeding targets.

🎯 NEXT STEPS
────────────────────────────────────────────────────────────
• Continue current strategy
• Complete most-viewed patterns
• Scale distribution channels
• Consider feature expansion
```

## File Structure

```
validation-agent/
├── validate.mjs              # Main validation script
├── config.mjs                # Configuration and targets
├── data-collectors/
│   ├── newsletter.mjs        # Prisma DB queries
│   ├── github.mjs           # GitHub API integration
│   └── analytics.mjs        # Manual analytics input
└── README.md                # This file
```

## Roadmap (Future Enhancements)

### Phase 2: Auto-Report Generation
- [ ] Automatically update VALIDATION_STRATEGY.md
- [ ] Generate monthly checkpoint reports
- [ ] Track historical data over time

### Phase 3: AI-Powered Insights
- [ ] Claude API integration
- [ ] Strategic recommendations
- [ ] Trend analysis and predictions
- [ ] Content strategy suggestions

### Phase 4: Advanced Features
- [ ] Automated email alerts
- [ ] Slack/Discord notifications
- [ ] Interactive dashboard
- [ ] Scheduled monthly runs

## Troubleshooting

### Database Connection Issues

If you get Prisma errors:

```bash
# Regenerate Prisma client
npm run postinstall

# Check database connection
npx prisma db push
```

### GitHub API Rate Limit

If you hit rate limits:

1. Add a GITHUB_TOKEN to `.env.local`
2. Wait for rate limit reset (shown in error message)
3. Reduce validation frequency

### No Newsletter Subscribers

If subscriber count is 0 but you have subscribers:

1. Check database: `npx prisma studio`
2. Verify `active = true` in Subscriber table
3. Check database connection in `.env.local`

## Monthly Workflow

**Recommended schedule:**

1. **Week 1:** Run validation, review metrics
2. **Week 2-3:** Implement recommendations
3. **Week 4:** Run validation again, prepare for next month
4. **End of Month:** Complete checkpoint in VALIDATION_STRATEGY.md

## Support

For issues or questions:
- Check the main VALIDATION_STRATEGY.md document
- Review configuration in config.mjs
- Test individual collectors separately
- Verify environment variables in .env.local

## Version

**Current Version:** MVP 1.0
**Last Updated:** October 19, 2025
**Status:** Production Ready

---

Built with ☕ for aiux - AI Design Patterns
