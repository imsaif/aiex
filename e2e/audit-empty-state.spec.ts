import { test, expect } from '@playwright/test';
import { runOneAudit, seedAuditState, withScenario } from './helpers';

test.describe('audit empty state', () => {
  test('non-AI screenshot shows empty state and does not decrement count', async ({ page }) => {
    await seedAuditState(page, { count: 0, unlocked: false });
    await withScenario(page, 'empty');
    await page.goto('/');

    await runOneAudit(page);

    // Empty-state copy lives in EmptyAuditState — assert on the leading line
    // shipped in the May 20 audit overhaul.
    await expect(
      page.getByText(/we scanned for 36 ai ux patterns|doesn.t look like an ai/i).first()
    ).toBeVisible({ timeout: 10_000 });

    // The reassurance line that the run didn't burn a credit.
    await expect(page.getByText(/didn.t count|free audit/i).first()).toBeVisible();

    // Count must still be 0 — empty runs do not decrement.
    const count = await page.evaluate(() => window.localStorage.getItem('aiux_audit_count'));
    expect(count === null || count === '0').toBe(true);

    // No unlock modal should auto-open for an empty run.
    await expect(page.getByRole('heading', { name: /unlock/i })).toHaveCount(0);
  });
});
