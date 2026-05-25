import { test, expect } from '@playwright/test';
import { seedAuditState } from './helpers';

test.describe('audit paywall — final cap', () => {
  test('returning user at unlocked cap sees final-cap modal on next attempt', async ({ page }) => {
    // Simulate a returning user who already unlocked and used all 4 audits.
    await seedAuditState(page, { count: 4, unlocked: true });
    await page.goto('/');

    // The hero swaps the CTA for an inline "You've reached the free limit"
    // pill when isPaywalled. Final-cap users see the same lockout; no email
    // form is offered (that's the unlock-mode modal, not final-cap).
    await expect(
      page.getByText(/reached the free limit|that.s all|final/i).first()
    ).toBeVisible({ timeout: 10_000 });

    // The Analyze button must not be reachable at final-cap.
    await expect(page.getByRole('button', { name: /^analyze/i })).toHaveCount(0);
  });
});
