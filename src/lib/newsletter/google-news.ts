/**
 * Pulls the publisher URL out of Google News' batchexecute response.
 *
 * The URL sits inside a JSON string nested in another JSON string, so its "="
 * and "&" arrive escaped (`\u003d`, often as `\\u003d`). Stopping at the first
 * backslash cut `story?id=123` down to `story?id` and shipped a 404 (Oct 2026,
 * an ABC News link). Read through the escapes, then decode them.
 */
export function extractPublisherUrl(text: string): string | null {
  const raw = text.match(/https?:\/\/(?!news\.google)(?:[^"\\]|\\+[^"\\])+/)?.[0];
  if (!raw) return null;
  const url = raw
    .replace(/\\+u([0-9a-fA-F]{4})/g, (_, hex: string) => String.fromCharCode(parseInt(hex, 16)))
    .replace(/\\+\//g, '/')
    .replace(/\\+$/, '');
  try {
    return new URL(url).toString();
  } catch {
    return null;
  }
}
