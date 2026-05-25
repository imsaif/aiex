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

  await page.getByRole('button', { name: /audit your design/i }).first().click();

  // Hidden file input — query directly since it has no accessible name.
  const fileInput = page.locator('input[type="file"]').first();
  await expect(fileInput).toBeAttached();

  const files = Array.from({ length: imageCount }, (_, i) => makePngFile(`fixture-${i}.png`));
  await fileInput.setInputFiles(files);

  await page.getByRole('button', { name: new RegExp(productLabel, 'i') }).first().click();

  // Wait for the analyze response so callers can assert against settled state.
  const responsePromise = page.waitForResponse(
    (res) => res.url().includes('/api/patterns/analyze') && res.request().method() === 'POST'
  );
  await page.getByRole('button', { name: /^analyze/i }).click();
  await responsePromise;
}
