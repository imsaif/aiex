/**
 * Group AuditSample rows by ipHash + userAgent to see if recent audits all
 * come from one machine (i.e., user self-testing) or distinct visitors.
 *
 * Run: npx tsx scripts/analysis/audit-sample-iphash.ts [days]
 */
import 'dotenv/config';
import { PrismaClient } from '../../src/generated/prisma';

const prisma = new PrismaClient();

async function main() {
  const days = parseInt(process.argv[2] || '14', 10);
  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

  const rows = await prisma.auditSample.findMany({
    where: { createdAt: { gte: since } },
    orderBy: { createdAt: 'desc' },
    select: {
      createdAt: true,
      outcome: true,
      productType: true,
      ipHash: true,
      userAgent: true,
    },
  });

  console.log(`\nLast ${days} days: ${rows.length} rows\n`);

  const byHash = new Map<string, typeof rows>();
  for (const r of rows) {
    const key = r.ipHash ?? 'null';
    if (!byHash.has(key)) byHash.set(key, []);
    byHash.get(key)!.push(r);
  }

  console.log(`Distinct ipHashes: ${byHash.size}\n`);
  for (const [hash, group] of [...byHash.entries()].sort((a, b) => b[1].length - a[1].length)) {
    console.log(`ipHash=${hash}  rows=${group.length}`);
    const uaSet = new Set(group.map(g => g.userAgent ?? 'null'));
    console.log(`  distinct UAs: ${uaSet.size}`);
    for (const ua of uaSet) console.log(`    ${(ua ?? 'null').slice(0, 120)}`);
    for (const r of group) {
      console.log(`    ${r.createdAt.toISOString()} | ${r.outcome} | ${r.productType ?? '-'}`);
    }
    console.log();
  }
}

main().finally(() => prisma.$disconnect());
