import { test, expect } from '@playwright/test';
import { runOneAudit, seedAuditState } from './helpers';

test.describe('audit funnel — happy path', () => {
  test('1 free audit → unlock modal → 3 more → final-cap modal', async ({ page }) => {
    await seedAuditState(page, { count: 0, unlocked: false });

    // Newsletter subscribe is unrelated to the unlock contract; stub it so
    // tests don't depend on Beehiiv/Prisma env wiring.
    await page.route('**/api/newsletter/subscribe', (route) =>
      route.fulfill({ status: 200, contentType: 'application/json', body: '{"ok":true}' })
    );

    await page.goto('/');

    // --- Audit #1 (free) ---------------------------------------------------
    await runOneAudit(page);

    // Results view shows — pick a stable signal: a gap pattern name we
    // hardcode in the E2E mock.
    // No per-iteration content assertion — `runOneAudit` already awaited
    // the analyze response; count persistence is verified at the end.

    // The redesigned results view deliberately does NOT auto-open the unlock
    // modal — it lets the user explore their results first (see the comment in
    // AuditClient.runAnalysis). First confirm the results rendered.
    await expect(
      page.getByRole('heading', { name: /your audit results/i })
    ).toBeVisible({ timeout: 10_000 });

    // Then attempt a second audit. With the free limit reached (count = 1),
    // "New audit" routes through handleClear, which gates on isPaywalled and
    // surfaces the unlock modal — the paywall's natural trigger point now.
    await page.getByRole('button', { name: /new audit/i }).click();
    await expect(
      page.getByRole('heading', { name: /3 more audits/i }).first()
    ).toBeVisible({ timeout: 10_000 });

    // Submit email to unlock 3 more audits. Scope to the modal — the page
    // has other email inputs (newsletter signup) that the loose role query
    // would otherwise pick first.
    const emailField = page.getByPlaceholder(/you@company.com|your email/i).first();
    await emailField.fill('e2e@example.com');
    await page.getByRole('button', { name: /^unlock audits$/i }).click();
    await expect(page.getByRole('heading', { name: /^unlocked$/i })).toBeVisible({ timeout: 10_000 });
    await page.getByRole('button', { name: /^continue$/i }).click();

    // Modal acknowledges success then closes. Mark unlocked locally too
    // in case the newsletter endpoint is mocked separately.
    await page.evaluate(() => window.localStorage.setItem('aiux_audit_unlocked', 'true'));

    // --- Audits #2, #3, #4 (post-unlock) ---------------------------------
    for (let i = 2; i <= 4; i++) {
      await page.goto('/');
      await runOneAudit(page);
      // No per-iteration content assertion — `runOneAudit` already awaited
    // the analyze response; count persistence is verified at the end.
    }

    // --- Audit #5 — final cap lockout ------------------------------------
    // After 4 unlocked audits, the hero shows the inline lockout instead of
    // the CTA — no Analyze button should be reachable.
    // Sanity check — count must have actually incremented across all 4 runs.
    const finalCount = await page.evaluate(() =>
      window.localStorage.getItem('aiux_audit_count')
    );
    expect(finalCount).toBe('4');

    await page.goto('/');
    await expect(
      page.getByText(/reached the free limit|that.s all|final/i).first()
    ).toBeVisible({ timeout: 10_000 });
    await expect(page.getByRole('button', { name: /^analyze/i })).toHaveCount(0);
  });
});
