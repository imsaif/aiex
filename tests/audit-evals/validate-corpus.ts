#!/usr/bin/env ts-node
import fs from 'fs';
import path from 'path';
import { ExpectedFixtureSchema } from './types';

const FIXTURES_DIR = path.join(__dirname, 'fixtures');
const ALL_PRODUCT_TYPES = [
  'chat-interface', 'ai-agent', 'recommendation-system', 'content-generation',
  'dashboard-analytics', 'embedded-ai-feature', 'search-discovery', 'reports-documents', 'general',
] as const;
const MIN_EMPTY_SURFACE = 2;   // expectEmptyTopGaps fixtures
const MIN_FABRICATION_TRAP = 3; // fixtures whose notes tag them as traps + carry mustNotFindPatterns

function main() {
  const entries = fs.existsSync(FIXTURES_DIR)
    ? fs.readdirSync(FIXTURES_DIR, { withFileTypes: true }).filter((e) => e.isDirectory() && !e.name.startsWith('_'))
    : [];

  const byType = new Map<string, number>();
  let emptyCount = 0;
  let trapCount = 0;
  const problems: string[] = [];

  for (const e of entries) {
    const dir = path.join(FIXTURES_DIR, e.name);
    const files = fs.readdirSync(dir);
    const hasShot = files.some((f) => /^screenshot\.(png|jpe?g|webp|gif)$/i.test(f));
    if (!hasShot) { problems.push(`${e.name}: missing screenshot.*`); continue; }
    let fx;
    try {
      fx = ExpectedFixtureSchema.parse(JSON.parse(fs.readFileSync(path.join(dir, 'expected.json'), 'utf-8')));
    } catch (err) {
      problems.push(`${e.name}: expected.json invalid - ${err instanceof Error ? err.message : 'parse error'}`);
      continue;
    }
    byType.set(fx.productType, (byType.get(fx.productType) ?? 0) + 1);
    if (fx.expectEmptyTopGaps) emptyCount++;
    if (/\btrap\b/i.test(fx.notes) && fx.mustNotFindPatterns.length > 0) trapCount++;
  }

  const missingTypes = ALL_PRODUCT_TYPES.filter((t) => (byType.get(t) ?? 0) === 0);
  if (missingTypes.length) problems.push(`missing product types: ${missingTypes.join(', ')}`);
  if (emptyCount < MIN_EMPTY_SURFACE) problems.push(`need >= ${MIN_EMPTY_SURFACE} empty-surface fixtures, have ${emptyCount}`);
  if (trapCount < MIN_FABRICATION_TRAP) problems.push(`need >= ${MIN_FABRICATION_TRAP} fabrication-trap fixtures, have ${trapCount}`);

  console.log(`[corpus-check] ${entries.length} fixtures; types covered: ${byType.size}/${ALL_PRODUCT_TYPES.length}; empty: ${emptyCount}; traps: ${trapCount}`);
  if (problems.length) {
    console.error('[corpus-check] FAIL:\n  - ' + problems.join('\n  - '));
    process.exit(1);
  }
  console.log('[corpus-check] PASS');
}
main();
