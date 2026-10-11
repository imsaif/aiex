/**
 * One-time (and catch-up) import of the local subscriber list into the Resend
 * "AI UX Daily" segment. Uses the same syncSegment() the admin Send button runs,
 * without its per-request write cap: the first import is ~300 contacts at about
 * two Resend calls per second, so it takes a few minutes and can't run inside
 * the site's 60s function limit.
 *
 * Dry run by default; prints what would change.
 *   npm run newsletter:import-resend            # dry run
 *   npm run newsletter:import-resend -- --apply # write
 *
 * Run "Sync from Beehiiv" in /admin/subscribers first, so people who
 * unsubscribed in beehiiv are inactive locally before anyone is imported.
 */

import { config } from 'dotenv';
config({ path: '.env.local', override: true });

import { Resend } from 'resend';
import { PrismaClient } from '../../src/generated/prisma';
import { syncSegment } from '../../src/lib/newsletter/resend-send';

const prisma = new PrismaClient();
const apply = process.argv.includes('--apply');

async function main() {
  if (!process.env.RESEND_API_KEY) throw new Error('RESEND_API_KEY is not set');
  const resend = new Resend(process.env.RESEND_API_KEY);
  const local = await prisma.subscriber.findMany({ select: { email: true, active: true, emailFrequency: true } });
  console.log(`Local list: ${local.length} rows, ${local.filter((s) => s.active && s.emailFrequency === 'all').length} want the daily.`);

  const result = await syncSegment(
    resend,
    local,
    async (emails) => {
      await prisma.subscriber.updateMany({
        where: { email: { in: emails, mode: 'insensitive' } },
        data: { active: false, unsubscribedAt: new Date(), unsubscribeReason: 'Unsubscribed via Resend email' },
      });
    },
    { dryRun: !apply },
  );

  console.log(`${apply ? 'Done' : 'Dry run'}: segment ${result.segmentId}`);
  console.log(`  add ${result.added}, remove ${result.removed}, unsubscribed in Resend ${result.mirroredUnsubscribes.length}`);
  console.log(`  recipients after sync: ${result.recipients}`);
  if (!apply) console.log('Nothing written. Re-run with --apply.');
}

main()
  .catch((err) => {
    console.error(err instanceof Error ? err.message : err);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
