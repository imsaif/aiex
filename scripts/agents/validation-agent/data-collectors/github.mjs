/**
 * GitHub Data Collector
 *
 * Collects repository statistics from GitHub API
 */

/**
 * Fetch repository stats from GitHub API
 * @param {string} owner - Repository owner (e.g., 'imsaif')
 * @param {string} repo - Repository name (e.g., 'aiex')
 * @param {string} token - GitHub Personal Access Token (optional, for higher rate limits)
 */
export async function getGitHubStats(owner, repo, token = null) {
  try {
    const headers = {
      'Accept': 'application/vnd.github.v3+json',
      'User-Agent': 'aiux-validation-agent',
    };

    // Add authorization header if token is provided
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`https://api.github.com/repos/${owner}/${repo}`, {
      headers,
    });

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error(`Repository ${owner}/${repo} not found`);
      }
      if (response.status === 403) {
        throw new Error('GitHub API rate limit exceeded. Consider adding a GITHUB_TOKEN.');
      }
      throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    return {
      stars: data.stargazers_count || 0,
      forks: data.forks_count || 0,
      watchers: data.watchers_count || 0,
      openIssues: data.open_issues_count || 0,
      subscribers: data.subscribers_count || 0,
      size: data.size || 0,
      language: data.language || 'Unknown',
      createdAt: data.created_at,
      updatedAt: data.updated_at,
      pushedAt: data.pushed_at,
      defaultBranch: data.default_branch || 'main',
      description: data.description || '',
      topics: data.topics || [],
      homepage: data.homepage || '',
    };
  } catch (error) {
    console.error('Error fetching GitHub stats:', error.message);
    return {
      stars: 0,
      forks: 0,
      watchers: 0,
      openIssues: 0,
      subscribers: 0,
      size: 0,
      language: 'Unknown',
      error: error.message,
    };
  }
}

/**
 * Get contributors list
 * @param {string} owner - Repository owner
 * @param {string} repo - Repository name
 * @param {string} token - GitHub Personal Access Token (optional)
 */
export async function getContributors(owner, repo, token = null) {
  try {
    const headers = {
      'Accept': 'application/vnd.github.v3+json',
      'User-Agent': 'aiux-validation-agent',
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/contributors`,
      { headers }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch contributors: ${response.statusText}`);
    }

    const contributors = await response.json();
    return contributors.map((c) => ({
      username: c.login,
      contributions: c.contributions,
      avatarUrl: c.avatar_url,
      profileUrl: c.html_url,
    }));
  } catch (error) {
    console.error('Error fetching contributors:', error.message);
    return [];
  }
}

/**
 * Get recent activity (commits, issues, PRs)
 * @param {string} owner - Repository owner
 * @param {string} repo - Repository name
 * @param {string} token - GitHub Personal Access Token (optional)
 * @param {number} days - Number of days to look back (default 30)
 */
export async function getRecentActivity(owner, repo, token = null, days = 30) {
  try {
    const headers = {
      'Accept': 'application/vnd.github.v3+json',
      'User-Agent': 'aiux-validation-agent',
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const since = new Date();
    since.setDate(since.getDate() - days);
    const sinceISO = since.toISOString();

    // Fetch commits
    const commitsResponse = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/commits?since=${sinceISO}`,
      { headers }
    );
    const commits = commitsResponse.ok ? await commitsResponse.json() : [];

    // Fetch issues (includes PRs)
    const issuesResponse = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/issues?since=${sinceISO}&state=all`,
      { headers }
    );
    const issues = issuesResponse.ok ? await issuesResponse.json() : [];

    // Separate issues and PRs
    const pullRequests = issues.filter((i) => i.pull_request);
    const pureIssues = issues.filter((i) => !i.pull_request);

    return {
      commits: commits.length,
      issues: pureIssues.length,
      pullRequests: pullRequests.length,
      period: `Last ${days} days`,
    };
  } catch (error) {
    console.error('Error fetching recent activity:', error.message);
    return {
      commits: 0,
      issues: 0,
      pullRequests: 0,
      period: `Last ${days} days`,
      error: error.message,
    };
  }
}

/**
 * Get growth metrics (compare current vs previous period)
 * @param {string} owner - Repository owner
 * @param {string} repo - Repository name
 * @param {string} token - GitHub Personal Access Token (optional)
 * @param {number} days - Period in days (default 30)
 */
export async function getGrowthMetrics(owner, repo, token = null, days = 30) {
  // Note: GitHub API doesn't provide historical star counts directly
  // This is a simplified version that shows current stats
  // For historical data, you'd need to track stats over time in your own database

  const current = await getGitHubStats(owner, repo, token);

  return {
    current: {
      stars: current.stars,
      forks: current.forks,
      watchers: current.watchers,
    },
    // For now, we can't calculate growth without historical data
    // You would need to store previous snapshots
    growth: {
      stars: null,
      forks: null,
      watchers: null,
      note: 'Historical tracking not implemented. Store periodic snapshots to track growth.',
    },
  };
}

/**
 * Get comprehensive GitHub metrics for validation
 * @param {string} owner - Repository owner
 * @param {string} repo - Repository name
 * @param {string} token - GitHub Personal Access Token (optional)
 * @param {number} days - Period for recent activity (default 30)
 */
export async function getGitHubMetrics(owner, repo, token = null, days = 30) {
  const [stats, contributors, activity] = await Promise.all([
    getGitHubStats(owner, repo, token),
    getContributors(owner, repo, token),
    getRecentActivity(owner, repo, token, days),
  ]);

  return {
    repository: {
      owner,
      repo,
      url: `https://github.com/${owner}/${repo}`,
    },
    stats,
    contributors: {
      total: contributors.length,
      list: contributors.slice(0, 5), // Top 5 contributors
    },
    activity,
    period: `Last ${days} days`,
  };
}

/**
 * Check API rate limit
 * @param {string} token - GitHub Personal Access Token (optional)
 */
export async function checkRateLimit(token = null) {
  try {
    const headers = {
      'Accept': 'application/vnd.github.v3+json',
      'User-Agent': 'aiux-validation-agent',
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch('https://api.github.com/rate_limit', { headers });
    const data = await response.json();

    const core = data.resources.core;
    return {
      limit: core.limit,
      remaining: core.remaining,
      reset: new Date(core.reset * 1000),
      percentUsed: ((1 - core.remaining / core.limit) * 100).toFixed(2),
    };
  } catch (error) {
    console.error('Error checking rate limit:', error.message);
    return null;
  }
}

// For testing
if (import.meta.url === `file://${process.argv[1]}`) {
  console.log('Testing GitHub Data Collector...\n');

  const owner = 'imsaif';
  const repo = 'aiex';
  const token = process.env.GITHUB_TOKEN; // Optional

  // Check rate limit first
  const rateLimit = await checkRateLimit(token);
  if (rateLimit) {
    console.log('GitHub API Rate Limit:');
    console.log('─'.repeat(50));
    console.log(`Limit: ${rateLimit.limit} requests/hour`);
    console.log(`Remaining: ${rateLimit.remaining}`);
    console.log(`Percent Used: ${rateLimit.percentUsed}%`);
    console.log(`Resets at: ${rateLimit.reset.toLocaleString()}\n`);
  }

  // Get metrics
  const metrics = await getGitHubMetrics(owner, repo, token, 30);

  console.log('GitHub Metrics:');
  console.log('─'.repeat(50));
  console.log(`Repository: ${metrics.repository.url}`);
  console.log(`\nStats:`);
  console.log(`  Stars: ${metrics.stats.stars}`);
  console.log(`  Forks: ${metrics.stats.forks}`);
  console.log(`  Watchers: ${metrics.stats.watchers}`);
  console.log(`  Open Issues: ${metrics.stats.openIssues}`);
  console.log(`  Language: ${metrics.stats.language}`);

  console.log(`\nContributors: ${metrics.contributors.total}`);
  if (metrics.contributors.list.length > 0) {
    console.log('  Top Contributors:');
    metrics.contributors.list.forEach((c, i) => {
      console.log(`    ${i + 1}. ${c.username} (${c.contributions} contributions)`);
    });
  }

  console.log(`\nRecent Activity (${metrics.period}):`);
  console.log(`  Commits: ${metrics.activity.commits}`);
  console.log(`  Issues: ${metrics.activity.issues}`);
  console.log(`  Pull Requests: ${metrics.activity.pullRequests}`);
}
