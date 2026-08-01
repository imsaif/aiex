/**
 * Guard: every `source` literal the app sends must exist in NEWSLETTER_SOURCES.
 *
 * The subscribe route validates with `z.enum(NEWSLETTER_SOURCES)`. An unlisted
 * value throws a ZodError before any other logic runs, so the caller gets a 400
 * whose message is "Invalid email address" on a valid email. Callers that gate
 * on success (the audit paywall) then never unlock.
 *
 * Regression: `audit-unlock` shipped 2026-05-25 without an enum entry. The audit
 * paywall captured 0 emails across 31 real-user modal views before this was found.
 * A route-level test would not have caught it — nothing sent `audit-unlock` in a
 * test. Only scanning the real call sites does.
 */

// NOTE: this test deliberately does NOT live in `src/types/__tests__/` —
// tsconfig lists `./src/types` in `typeRoots`, so any subdirectory there is
// treated as an implicit type library and `tsc` fails with TS2688.

import { readFileSync, readdirSync, statSync } from 'fs';
import { join } from 'path';
import { NEWSLETTER_SOURCES } from '../../types/newsletter';

const SRC = join(__dirname, '..', '..');
const SKIP_DIRS = new Set(['node_modules', 'generated', '__tests__', '.next']);

function walk(dir: string, out: string[] = []): string[] {
  for (const entry of readdirSync(dir)) {
    if (SKIP_DIRS.has(entry)) continue;
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) walk(full, out);
    else if (/\.tsx?$/.test(entry)) out.push(full);
  }
  return out;
}

/** `source: 'x'` in a JSON body, and `source="x"` as a JSX prop. */
const SOURCE_LITERAL = /\bsource\s*[:=]\s*['"]([a-z0-9-]+)['"]/g;

/**
 * Only files that actually talk to the subscribe endpoint, directly or by
 * rendering a component that does. Keeps unrelated `source:` fields (ServiceLead,
 * PatternIntent, UiEvent properties) out of the assertion.
 */
function isSubscribeCaller(text: string): boolean {
  return (
    text.includes('/api/newsletter/subscribe') ||
    text.includes('InlineNewsletterSignup') ||
    text.includes('addSubscriberToBeehiiv')
  );
}

describe('NEWSLETTER_SOURCES covers every source the app sends', () => {
  const allowed = new Set<string>(NEWSLETTER_SOURCES);
  const found = new Map<string, string[]>();

  beforeAll(() => {
    for (const file of walk(SRC)) {
      const text = readFileSync(file, 'utf8');
      if (!isSubscribeCaller(text)) continue;
      // Array.from, not spread — tsconfig targets below es2015 downlevelIteration.
      for (const match of Array.from(text.matchAll(SOURCE_LITERAL))) {
        const value = match[1];
        if (!found.has(value)) found.set(value, []);
        found.get(value)!.push(file.slice(SRC.length + 1));
      }
    }
  });

  it('finds source literals to check (guard against a silently empty scan)', () => {
    expect(found.size).toBeGreaterThan(5);
  });

  it('has no source literal missing from the enum', () => {
    const missing = Array.from(found.entries())
      .filter(([value]) => !allowed.has(value))
      .map(([value, files]) => `  '${value}' sent from: ${files.join(', ')}`);

    expect(missing.join('\n')).toBe('');
  });

  it('includes audit-unlock, the source the audit paywall sends', () => {
    expect(allowed.has('audit-unlock')).toBe(true);
  });

  it('keeps PDF_DOWNLOAD_SOURCES a subset of NEWSLETTER_SOURCES', () => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { PDF_DOWNLOAD_SOURCES } = require('../../types/newsletter');
    for (const source of PDF_DOWNLOAD_SOURCES) {
      expect(allowed.has(source)).toBe(true);
    }
  });
});
