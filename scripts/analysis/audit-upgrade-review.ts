/**
 * Audit upgrade review — pulls the full picture from prod to answer:
 * "Do we have enough data to inform the next round of audit improvements?"
 *
 * Run: npx tsx scripts/analysis/audit-upgrade-review.ts [days]
 */
import 'dotenv/config';
import { PrismaClient } from '../../src/generated/prisma';

const prisma = new PrismaClient();

const WINDOWS = [Number(process.argv[2]) || 30, 90];

function pct(n: number, d: number) {
  return d ? ((n / d) * 100).toFixed(1) + '%' : '-';
}

async function analyzeWindow(days: number) {
  const since = new Date(Date.now() - days * 864e5);
  // Real users = role is null OR not one of the synthetic roles.
  // NOTE: Prisma `{ not: x }` / `{ notIn: [...] }` EXCLUDE nulls, so we must OR-in null explicitly.
  const NON_REAL = ['admin', 'test', 'monitor'];
  const realWhere = {
    createdAt: { gte: since },
    OR: [{ role: null }, { role: { notIn: NON_REAL } }],
  };

  const [byOutcome, successAgg, byProduct, byRole, intents, events, eventRoles] = await Promise.all([
    prisma.auditSample.groupBy({
      by: ['outcome'],
      where: realWhere,
      _count: { _all: true },
      _avg: { applicablePatternCount: true, gapCount: true, criticalMissingCount: true, imageCount: true, latencyMs: true, score: true },
    }),
    prisma.auditSample.aggregate({
      where: { ...realWhere, outcome: 'success' },
      _avg: { score: true, maxScore: true, gapCount: true, applicablePatternCount: true },
    }),
    prisma.auditSample.groupBy({
      by: ['productType'],
      where: realWhere,
      _count: { _all: true },
      orderBy: { _count: { productType: 'desc' } },
      take: 15,
    }),
    prisma.auditSample.groupBy({
      by: ['role'],
      where: { createdAt: { gte: since } },
      _count: { _all: true },
    }),
    prisma.patternIntent.findMany({
      where: { createdAt: { gte: since } },
      orderBy: { createdAt: 'desc' },
      // Redacted: pull only lengths/counts, never the raw user free-text.
      select: { productType: true, suggestedPatterns: true, intent: true },
    }),
    prisma.uiEvent.groupBy({
      by: ['name'],
      where: { createdAt: { gte: since }, OR: [{ role: null }, { role: { notIn: NON_REAL } }] },
      _count: { _all: true },
    }),
    prisma.uiEvent.groupBy({
      by: ['role'],
      where: { createdAt: { gte: since } },
      _count: { _all: true },
    }),
  ]);

  const total = byOutcome.reduce((s, r) => s + r._count._all, 0);

  console.log(`\n${'='.repeat(70)}\n  WINDOW: last ${days} days (since ${since.toISOString().slice(0,10)})\n${'='.repeat(70)}`);
  console.log(`\nTotal real-user audit samples: ${total}`);

  console.log('\n--- Outcome distribution ---');
  console.log('  outcome'.padEnd(20), 'n'.padEnd(5), 'pct'.padEnd(8), 'avgPat', 'avgGap', 'avgCrit', 'avgImg', 'latency');
  for (const r of byOutcome.sort((a, b) => b._count._all - a._count._all)) {
    console.log(
      '  ' + r.outcome.padEnd(18),
      String(r._count._all).padEnd(5),
      pct(r._count._all, total).padEnd(8),
      (r._avg.applicablePatternCount ?? 0).toFixed(1).padStart(6),
      (r._avg.gapCount ?? 0).toFixed(1).padStart(6),
      (r._avg.criticalMissingCount ?? 0).toFixed(1).padStart(7),
      (r._avg.imageCount ?? 0).toFixed(1).padStart(6),
      Math.round(r._avg.latencyMs ?? 0).toString().padStart(7),
    );
  }

  console.log('\n--- Success-row quality ---');
  console.log(`  avg score: ${successAgg._avg.score?.toFixed(1) ?? 'n/a'} / ${successAgg._avg.maxScore?.toFixed(1) ?? 'n/a'}`);
  console.log(`  avg gaps: ${successAgg._avg.gapCount?.toFixed(1) ?? 'n/a'} | avg applicable patterns: ${successAgg._avg.applicablePatternCount?.toFixed(1) ?? 'n/a'}`);

  console.log('\n--- Product types uploaded (real users) ---');
  for (const r of byProduct) {
    console.log('  ' + (r.productType ?? '(none)').padEnd(24), String(r._count._all).padStart(4), pct(r._count._all, total));
  }

  console.log('\n--- Role split (incl admin/test) ---');
  for (const r of byRole) console.log('  ' + (r.role ?? '(real)').padEnd(12), r._count._all);

  console.log(`\n--- PatternIntent (empty-state "what are you building?") — ${intents.length} entries (free-text REDACTED) ---`);
  // Aggregate by productType + whether suggestions were returned. No raw intent text printed.
  const byIntentProduct = new Map<string, number>();
  let zeroSug = 0, someSug = 0, totalLen = 0;
  for (const i of intents) {
    const key = i.productType ?? '(none)';
    byIntentProduct.set(key, (byIntentProduct.get(key) ?? 0) + 1);
    let sug: string[] = [];
    try { sug = JSON.parse(i.suggestedPatterns); } catch {}
    if (sug.length === 0) zeroSug++; else someSug++;
    totalLen += (i.intent?.length ?? 0);
  }
  console.log(`  suggestions returned: ${someSug} | returned ZERO suggestions: ${zeroSug}`);
  console.log(`  avg intent length: ${intents.length ? Math.round(totalLen / intents.length) : 0} chars`);
  console.log('  by product type:');
  for (const [k, v] of Array.from(byIntentProduct.entries()).sort((a, b) => b[1] - a[1])) {
    console.log('    ' + k.padEnd(24), v);
  }

  console.log('\n--- UiEvent role split (all events, incl synthetic) ---');
  for (const r of eventRoles) console.log('  ' + (r.role ?? '(real/null)').padEnd(14), r._count._all);

  console.log('\n--- Funnel / CTA events (real users) ---');
  const evMap = new Map(events.map(e => [e.name, e._count._all]));
  const order = [...events].sort((a, b) => b._count._all - a._count._all);
  for (const e of order) console.log('  ' + e.name.padEnd(38), e._count._all);
  // Key funnel ratios
  const started = evMap.get('audit_product_type_selected') ?? 0;
  const completed = evMap.get('audit_session_completed') ?? 0;
  const resourceClicks = evMap.get('audit_resource_clicked') ?? 0;
  const handoff = evMap.get('audit_handoff_copied') ?? 0;
  const newAudit = evMap.get('audit_new_audit_clicked') ?? 0;
  const serviceCta = evMap.get('service_cta_clicked') ?? 0;
  const emptyShown = evMap.get('audit_empty_state_shown') ?? 0;
  console.log('\n  Key ratios:');
  console.log(`   completed / started: ${completed}/${started} = ${pct(completed, started)}`);
  console.log(`   resource_clicked (any post-result engagement): ${resourceClicks}`);
  console.log(`   handoff_copied: ${handoff} | new_audit: ${newAudit} | service_cta: ${serviceCta}`);
  console.log(`   empty_state_shown: ${emptyShown}`);
}

async function main() {
  for (const d of WINDOWS) await analyzeWindow(d);
  console.log('\n');
}

main().catch(e => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
