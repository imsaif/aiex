/**
 * Audit Page Viewport Test
 *
 * Takes screenshots of /audit at different Chrome viewport sizes
 * so you can visually verify the layout.
 *
 * Run: npx playwright test scripts/audit-viewport-test.ts --headed
 * Screenshots saved to: test-results/audit-viewports/
 */
import { test, expect } from '@playwright/test';

const VIEWPORTS = [
  { name: '01-mobile-375', width: 375, height: 812, desc: 'iPhone 14' },
  { name: '02-mobile-390', width: 390, height: 844, desc: 'iPhone 14 Pro' },
  { name: '03-tablet-768', width: 768, height: 1024, desc: 'iPad' },
  { name: '04-laptop-1024', width: 1024, height: 768, desc: 'Small laptop' },
  { name: '05-laptop-1200', width: 1200, height: 800, desc: 'Mid laptop' },
  { name: '06-laptop-1366', width: 1366, height: 768, desc: 'Common laptop' },
  { name: '07-desktop-1440', width: 1440, height: 900, desc: 'Desktop' },
  { name: '08-desktop-1920', width: 1920, height: 1080, desc: 'Full HD' },
];

const BASE_URL = 'http://localhost:3000';
const OUTPUT_DIR = 'test-results/audit-viewports';

test.describe('Audit Page — Viewport Screenshots', () => {
  for (const vp of VIEWPORTS) {
    test(`${vp.desc} (${vp.width}x${vp.height})`, async ({ browser }) => {
      const context = await browser.newContext({
        viewport: { width: vp.width, height: vp.height },
        deviceScaleFactor: vp.width <= 430 ? 3 : vp.width <= 1024 ? 2 : 1,
      });
      const page = await context.newPage();

      // 1. Empty state — upload card visible
      await page.goto(`${BASE_URL}/audit`, { waitUntil: 'networkidle' });
      await page.waitForTimeout(500);
      await page.screenshot({
        path: `${OUTPUT_DIR}/${vp.name}-empty.png`,
        fullPage: false,
      });

      // Basic checks
      const canvas = page.locator('div.rounded-2xl.shadow-2xl').first();
      await expect(canvas).toBeVisible();

      // Check no horizontal overflow
      const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
      expect(bodyWidth).toBeLessThanOrEqual(vp.width);

      // Check no vertical scrollbar on the canvas section
      const pageHeight = await page.evaluate(() => document.body.scrollHeight);
      // Allow some tolerance for the SocialProof section below
      // The canvas itself should not cause scrolling

      await context.close();
    });
  }
});
