/**
 * Small automatic audit check: real AI calls, plain rules, exit 1 on any failure.
 * Runs on pull requests that change the audit prompt. Usage: npm run eval:audit:smoke
 */
import './env';
import Anthropic from '@anthropic-ai/sdk';
import { FIXTURES_DIR, callAnalyze, detectMediaType } from './harness';
import { checkSmokeRules, SMOKE_CASES } from './smoke-rules';
import fs from 'fs';
import path from 'path';

async function main() {
  if (!process.env.ANTHROPIC_API_KEY) {
    console.error('ANTHROPIC_API_KEY not set');
    process.exit(1);
  }
  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  let failed = 0;

  for (const smokeCase of SMOKE_CASES) {
    const dir = path.join(FIXTURES_DIR, smokeCase.id);
    const screenshot = fs.readdirSync(dir).find((f) => /^screenshot\./i.test(f));
    if (!screenshot) {
      console.error(`FAIL ${smokeCase.id}: no screenshot`);
      failed++;
      continue;
    }
    const file = path.join(dir, screenshot);
    const result = await callAnalyze({
      client,
      imageBase64: fs.readFileSync(file).toString('base64'),
      mediaType: detectMediaType(file),
      productType: smokeCase.productType,
    });
    const failures = checkSmokeRules(smokeCase.id, result.ok ? result.data : null);
    const applicable = result.ok ? (result.data.applicablePatterns ?? []).join(', ') : `unreadable: ${result.error}`;
    console.log(`${failures.length ? 'FAIL' : 'PASS'} ${smokeCase.id} [${applicable}]`);
    failures.forEach((f) => console.log(`  ${f}`));
    if (failures.length) failed++;
  }

  console.log(`\n${SMOKE_CASES.length - failed} of ${SMOKE_CASES.length} passed`);
  process.exit(failed ? 1 : 0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
