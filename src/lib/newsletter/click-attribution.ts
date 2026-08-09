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

  // Strip the trailing slash on the parsed pathname itself, before serialising.
  // Scoping the strip to pathname (rather than regex-ing the serialised string)
  // keeps it from ever touching the query string or host: a root path with a
  // surviving query ("https://a.com/?x=1") keeps its path separator instead of
  // becoming "https://a.com?x=1". The URL setter also refuses to drop the
  // leading "/" on a root path, so this is a no-op there, which is correct.
  parsed.pathname = parsed.pathname.replace(/\/$/, '');

  return parsed.toString();
}
