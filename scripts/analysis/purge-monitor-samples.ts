/**
 * One-time cleanup: delete the synthetic health-monitor rows that the analyze
 * route recorded before the `role !== 'monitor'` guard landed. These are
 * `role: 'monitor'` / `bad_request` pings (was ~98.6% of all AuditSample rows)
 * — already hidden from the admin view, but they bloat the table and skew any
 * raw query.
 *
 * Dry-run (default): prints the count, deletes nothing.
 *   npx tsx scripts/analysis/purge-monitor-samples.ts
 * Apply:
 *   npx tsx scripts/analysis/purge-monitor-samples.ts --apply
 */
import 'dotenv/config';
import { PrismaClient } from '../../src/generated/prisma';

const prisma = new PrismaClient();
const APPLY = process.argv.includes('--apply');

async function main() {
  const count = await prisma.auditSample.count({ where: { role: 'monitor' } });
  console.log(`Found ${count} AuditSample rows with role='monitor'.`);

  if (count === 0) {
    console.log('Nothing to purge.');
    return;
  }

  if (!APPLY) {
    console.log('Dry run — pass --apply to delete these rows.');
    return;
  }

  const { count: deleted } = await prisma.auditSample.deleteMany({ where: { role: 'monitor' } });
  console.log(`Deleted ${deleted} monitor rows.`);
}

main().catch((e) => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
