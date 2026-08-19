import { Page, expect } from '@playwright/test';

// Smallest valid 1x1 PNG, base64-encoded. Good enough to satisfy the upload
// pipeline; the analyze route is mocked so contents don't matter.
const TINY_PNG_BASE64 =
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNgAAIAAAUAAen63NgAAAAASUVORK5CYII=';

export const TINY_PNG = Buffer.from(TINY_PNG_BASE64, 'base64');

export function makePngFile(name = 'fixture.png') {
  return { name, mimeType: 'image/png', buffer: TINY_PNG };
}

/**
 * Set a scenario header on every /api/patterns/analyze request from this
 * page. Use 'empty' to drive the empty-state branch.
 */
export async function withScenario(page: Page, scenario: 'success' | 'empty' | 'multi') {
  await page.route('**/api/patterns/analyze', async (route, request) => {
    const headers = { ...request.headers(), 'x-e2e-scenario': scenario };
    await route.continue({ headers });
  });
}

/**
 * Pre-seed the localStorage values the audit funnel reads on mount.
 * Must be called BEFORE `page.goto('/')` for the values to be present
 * when AuditClient hydrates.
 */
export async function seedAuditState(
  page: Page,
  state: { count?: number; unlocked?: boolean }
) {
  // addInitScript runs on every navigation; use a sentinel so we only seed
  // once and don't clobber values the app writes during the test.
  await page.addInitScript((s) => {
    if (window.localStorage.getItem('__e2e_seeded__')) return;
    window.localStorage.setItem('__e2e_seeded__', '1');
    if (typeof s.count === 'number') {
      window.localStorage.setItem('aiux_audit_count', String(s.count));
    }
    if (typeof s.unlocked === 'boolean') {
      window.localStorage.setItem('aiux_audit_unlocked', s.unlocked ? 'true' : 'false');
    }
    window.localStorage.setItem('aiux:role', 'test');
  }, state);
}

/**
 * Drive the homepage demo → upload → analyze sequence end-to-end.
 * Returns when the results view is showing (or the unlock modal opens).
 */
export async function runOneAudit(
  page: Page,
  opts: { productLabel?: string; imageCount?: number } = {}
) {
  const productLabel = opts.productLabel ?? 'Chat interface';
  const imageCount = opts.imageCount ?? 1;

  // The hero CTA was renamed "Audit your design" -> "Get your skills" when the
  // audit became a skills handover. Matching both keeps this helper working if
  // the copy moves again, and stops a rename from reading as a broken funnel.
  await page
    .getByRole('button', { name: /get your skills|audit your design/i })
    .first()
    .click();

  // Hidden file input — query directly since it has no accessible name.
  const fileInput = page.locator('input[type="file"]').first();
  await expect(fileInput).toBeAttached();

  const files = Array.from({ length: imageCount }, (_, i) => makePngFile(`fixture-${i}.png`));
  await fileInput.setInputFiles(files);

  // Product type is auto-detected from the first screenshot (auto-detect-first
  // UX, shipped in 5507595). The 8 manual tiles are no longer on screen by
  // default — they live behind `showPicker`, revealed by "Change" once a type
  // has been detected, or by the "pick manually" fallback if detection failed.
  // Clicking a tile directly is what broke this helper from 2026-07-13.
  //
  // Open the panel explicitly rather than relying on the detected value, so the
  // spec controls which type is used and stays honest if the classifier changes.
  // Both reveal controls only render once classification settles, so this also
  // serves as the wait for the "Detecting…" spinner to clear.
  const revealPicker = page
    .getByRole('button', { name: /^change$|pick manually/i })
    .first();
  await expect(revealPicker).toBeVisible();
  await revealPicker.click();

  await page.getByRole('button', { name: new RegExp(productLabel, 'i') }).first().click();

  // Wait for the analyze response so callers can assert against settled state.
  const responsePromise = page.waitForResponse(
    (res) => res.url().includes('/api/patterns/analyze') && res.request().method() === 'POST'
  );
  await page.getByRole('button', { name: /^analyze/i }).click();
  await responsePromise;
}
