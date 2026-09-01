import { test, expect } from '@playwright/test';
import { runOneAudit, seedAuditState } from './helpers';
import { PAYWALL_ENABLED, FREE_AUDIT_LIMIT } from '../src/lib/audit/constants';

test.describe('audit funnel — happy path', () => {
  test('one audit runs end to end and the count persists', async ({ page }) => {
    await seedAuditState(page, { count: 0, unlocked: false });
    await page.goto('/');

    await runOneAudit(page);

    await expect(
      page.getByRole('heading', { name: /your audit results/i })
    ).toBeVisible({ timeout: 10_000 });

    const count = await page.evaluate(() =>
      window.localStorage.getItem('aiux_audit_count')
    );
    expect(count).toBe('1');
  });

  // The gate is off (PAYWALL_ENABLED = false, 2026-08-31). This asserts the
  // NEW contract rather than merely skipping the old one: a returning visitor
  // sitting on the old free limit must still be able to run another audit, and
  // must still see the CTA. Before the switch, this exact state replaced the
  // hero CTA with an email form. If the gate ever comes back by accident, this
  // is the test that catches it.
  test('with the gate off, a user past the old free limit is not blocked', async ({ page }) => {
    test.skip(PAYWALL_ENABLED, 'gate is on — the journey below covers it instead');

    await seedAuditState(page, { count: FREE_AUDIT_LIMIT, unlocked: false });
    await page.goto('/');

    // The CTA is still there, not swapped for the unlock form.
    await expect(
      page.getByRole('button', { name: /get your skills/i }).first()
    ).toBeVisible({ timeout: 10_000 });
    await expect(page.getByRole('heading', { name: /3 more audits/i })).toHaveCount(0);

    // And the audit actually runs.
    await runOneAudit(page);
    await expect(
      page.getByRole('heading', { name: /your audit results/i })
    ).toBeVisible({ timeout: 10_000 });
  });

  // The full gated journey. Kept, not deleted, so flipping PAYWALL_ENABLED back
  // on restores its coverage in the same commit that restores the feature.
  test('1 free audit → unlock modal → 3 more → final-cap modal', async ({ page }) => {
    test.skip(!PAYWALL_ENABLED, 'audit paywall is switched off — see PAYWALL_ENABLED');

    await seedAuditState(page, { count: 0, unlocked: false });

    // Newsletter subscribe is unrelated to the unlock contract; stub it so
    // tests don't depend on Beehiiv/Prisma env wiring.
    await page.route('**/api/newsletter/subscribe', (route) =>
      route.fulfill({ status: 200, contentType: 'application/json', body: '{"ok":true}' })
    );

    await page.goto('/');

    // --- Audit #1 (free) ---------------------------------------------------
    await runOneAudit(page);

    // The redesigned results view deliberately does NOT auto-open the unlock
    // modal — it lets the user explore their results first (see the comment in
    // AuditClient.runAnalysis). First confirm the results rendered.
    await expect(
      page.getByRole('heading', { name: /your audit results/i })
    ).toBeVisible({ timeout: 10_000 });

    // Then attempt a second audit. With the free limit reached (count = 1),
    // "New audit" routes through handleClear, which gates on isPaywalled and
    // surfaces the unlock modal — the paywall's natural trigger point now.
    // "New audit" -> "Run another audit" with the skills repositioning. Matched
    // loosely so the next copy tweak does not fail the funnel spec.
    await page.getByRole('button', { name: /run another audit|new audit/i }).click();
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
    // Sanity check — count must have actually incremented across all 4 runs.
    const finalCount = await page.evaluate(() =>
      window.localStorage.getItem('aiux_audit_count')
    );
    expect(finalCount).toBe('4');

    // After 4 unlocked audits, the hero shows the inline lockout instead of
    // the CTA — no Analyze button should be reachable.
    await page.goto('/');
    await expect(
      page.getByText(/reached the free limit|that.s all|final/i).first()
    ).toBeVisible({ timeout: 10_000 });
    await expect(page.getByRole('button', { name: /^analyze/i })).toHaveCount(0);
  });
});
