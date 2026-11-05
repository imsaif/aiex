// Monthly review: export kept audits to a local folder. Read-only.
// Usage: npm run audit:export
// Output: ~/Desktop/evals-study/live-YYYY-MM/ with screenshots, one JSON per
// audit (same shape as the study's outputs folders) and summary.txt.
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { config } from 'dotenv';
import { PrismaClient } from '../../src/generated/prisma/index.js';

config({ path: '.env.local', quiet: true });

const prisma = new PrismaClient();
const month = new Date().toISOString().slice(0, 7);
const outDir = path.join(os.homedir(), 'Desktop', 'evals-study', `live-${month}`);
fs.mkdirSync(outDir, { recursive: true });

const tally = (map, key) => map.set(key ?? 'unknown', (map.get(key ?? 'unknown') ?? 0) + 1);
const lines = (title, map) => [title, ...[...map].sort((a, b) => b[1] - a[1]).map(([k, n]) => `  ${k}: ${n}`), ''];

function parseAnswer(raw) {
  if (!raw) return null;
  try {
    return JSON.parse(raw.slice(raw.indexOf('{'), raw.lastIndexOf('}') + 1).replace(/\\'/g, "'"));
  } catch {
    return null;
  }
}

const ids = await prisma.auditRecord.findMany({ select: { id: true }, orderBy: { createdAt: 'asc' } });
const outcomes = new Map();
const types = new Map();
const sources = new Map();
const ratings = new Map();
const toReview = [];

// One at a time: each row carries its screenshots.
for (const { id } of ids) {
  const r = await prisma.auditRecord.findUnique({ where: { id } });
  r.images.forEach((image, i) => {
    const bytes = Buffer.from(image);
    const ext = bytes[0] === 0x89 ? 'png' : bytes[0] === 0x52 ? 'webp' : 'jpg';
    fs.writeFileSync(path.join(outDir, `${id}-${i + 1}.${ext}`), bytes);
  });

  const rated = r.sessionId
    ? await prisma.uiEvent.findMany({
        where: { name: 'audit_gap_rated', sessionId: r.sessionId },
        select: { properties: true, createdAt: true },
        orderBy: { createdAt: 'asc' },
      })
    : [];
  // The last tap on each finding is the answer.
  const answers = new Map(rated.map((e) => [e.properties?.position ?? e.properties?.pattern, e.properties]));
  for (const a of answers.values()) {
    const row = ratings.get(a.pattern) ?? { yes: 0, no: 0 };
    row[a.useful ? 'yes' : 'no']++;
    ratings.set(a.pattern, row);
  }

  const response = parseAnswer(r.rawAnswer);
  fs.writeFileSync(
    path.join(outDir, `${id}.json`),
    JSON.stringify(
      {
        id,
        createdAt: r.createdAt,
        productType: r.productType,
        productTypeSource: r.productTypeSource,
        deviceType: r.deviceType,
        status: r.outcome === 'parse_error' ? 502 : 200,
        outcome: r.outcome,
        response: response ?? {},
        rawAnswer: response ? undefined : r.rawAnswer,
        steps: r.steps,
        ratings: [...answers.values()],
      },
      null,
      2,
    ),
  );

  tally(outcomes, r.outcome);
  tally(types, r.productType);
  tally(sources, r.productTypeSource);
  const ratedNo = [...answers.values()].some((a) => !a.useful);
  if (ratedNo || r.outcome !== 'success') toReview.push(`  ${id} (${r.outcome}${ratedNo ? ', rated No' : ''})`);
}

const summary = [
  `Kept audits: ${ids.length}`,
  '',
  ...lines('Outcome', outcomes),
  ...lines('Product type', types),
  ...lines('How the type was set', sources),
  'Ratings by pattern',
  ...[...ratings].map(([pattern, { yes, no }]) => `  ${pattern}: ${yes} yes, ${no} no`),
  '',
  'Read these first (rated No, empty or failed)',
  ...toReview,
  '',
];
fs.writeFileSync(path.join(outDir, 'summary.txt'), summary.join('\n'));
console.log(`Exported ${ids.length} audits to ${outDir}`);
await prisma.$disconnect();
