#!/usr/bin/env node
/**
 * Manually trigger the pattern-intel pipeline once.
 *
 * pattern-intel is PAUSED by default (see src/app/api/cron/pattern-intel/route.ts)
 * to avoid recurring vision-heavy Anthropic spend from the scheduled cron. This
 * script fires a single on-demand run via the ?run=1 manual override.
 *
 * Usage:
 *   npm run pattern-intel          # run once against production
 *   npm run pattern-intel -- --dry # dry run (no DB writes), still calls the API
 *
 * Reads CRON_SECRET from .env.local. Override the target with SITE_URL.
 */
import { config as loadEnv } from 'dotenv';

loadEnv({ path: '.env.local' });

const SECRET = process.env.CRON_SECRET;
const SITE_URL = process.env.SITE_URL || 'https://www.aiuxdesign.guide';

if (!SECRET) {
  console.error('✗ CRON_SECRET not found (set it in .env.local or the environment).');
  process.exit(1);
}

const dry = process.argv.includes('--dry');
const url = `${SITE_URL}/api/cron/pattern-intel?run=1${dry ? '&dryRun=true' : ''}`;

console.log(`→ Triggering pattern-intel (${dry ? 'dry run' : 'live'}) at ${url}`);

try {
  const res = await fetch(url, {
    method: 'POST',
    headers: { Authorization: `Bearer ${SECRET}` },
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    console.error(`✗ Failed (${res.status}):`, body);
    process.exit(1);
  }
  console.log('✓ Kicked off:', body);
  console.log('\nThe pipeline runs in the background on the server. Watch Vercel logs');
  console.log('for "[pattern-intel] done ..." to see counts and confirm completion.');
} catch (err) {
  console.error('✗ Request error:', err.message);
  process.exit(1);
}
