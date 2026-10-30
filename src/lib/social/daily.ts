/**
 * The daily habit: opening the admin Social tab lands on the newest published
 * issue, and if that issue is fresh and has no posts yet, its drafts are written
 * on the spot. Done on open rather than from the newsletter cron on purpose: the
 * cron already runs close to Vercel's 60s cap and has a long incident history
 * (.claude/rules/newsletter-and-infra.md), so it stays untouched.
 */

/** Only issues this recent get drafts written automatically. Older ones wait for the button. */
export const AUTO_DRAFT_WINDOW_HOURS = 36;

export interface IssueSummary {
  id: string;
  createdAt: string;
}

/** Newest issue first, whatever order the list arrived in. */
export function newestIssue<T extends IssueSummary>(issues: T[]): T | null {
  return issues.reduce<T | null>(
    (best, issue) => (!best || Date.parse(issue.createdAt) > Date.parse(best.createdAt) ? issue : best),
    null
  );
}

/** Whether to write drafts for an issue without being asked. */
export function shouldAutoDraft(issue: IssueSummary, postCount: number, now: Date = new Date()): boolean {
  if (postCount > 0) return false;
  const ageHours = (now.getTime() - Date.parse(issue.createdAt)) / 3_600_000;
  return ageHours >= 0 && ageHours <= AUTO_DRAFT_WINDOW_HOURS;
}
