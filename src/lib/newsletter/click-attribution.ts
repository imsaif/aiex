/**
 * Joins Beehiiv per-link click counts to the stories we published, so we can see
 * which SOURCES earn reader attention. Pure functions only: the CLI wrapper lives
 * at scripts/analysis/newsletter-click-attribution.ts.
 *
 * Lives under src/ because Jest only collects tests from src/ tests in __tests__ dirs;
 * logic placed under scripts/ cannot be unit tested.
 */

/** Params that identify a referrer rather than a resource, so two links differing
 *  only by these are the same story. */
const TRACKING_PARAMS = ['ref', 'source', 'fbclid', 'gclid'];

/** Minimal CSV reader. No dependency is added for this on purpose; Beehiiv exports
 *  are small and the only awkward case is a quoted field containing a comma. */
export function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let field = '';
  let row: string[] = [];
  let inQuotes = false;

  for (let i = 0; i < text.length; i += 1) {
    const ch = text[i];

    if (inQuotes) {
      if (ch === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i += 1;
        } else {
          inQuotes = false;
        }
      } else {
        field += ch;
      }
      continue;
    }

    if (ch === '"') {
      inQuotes = true;
    } else if (ch === ',') {
      row.push(field);
      field = '';
    } else if (ch === '\n') {
      row.push(field);
      rows.push(row);
      row = [];
      field = '';
    } else if (ch !== '\r') {
      field += ch;
    }
  }

  if (field !== '' || row.length > 0) {
    row.push(field);
    rows.push(row);
  }
  return rows;
}

/** Canonical join key for a story link. Both sides of the join must pass through
 *  this, or feed-added utm params will make identical stories look distinct. */
export function normaliseUrl(url: string): string {
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return url;
  }

  parsed.hash = '';
  parsed.hostname = parsed.hostname.toLowerCase().replace(/^www\./, '');

  for (const key of Array.from(parsed.searchParams.keys())) {
    if (key.toLowerCase().startsWith('utm_') || TRACKING_PARAMS.includes(key.toLowerCase())) {
      parsed.searchParams.delete(key);
    }
  }

  let out = parsed.toString();
  out = out.replace(/\?$/, '');
  // Drop a trailing slash on the path, but never turn "https://a.com/" into
  // "https://a.com" plus a dangling query.
  out = out.replace(/\/(?=$|\?)/, '');
  return out;
}
