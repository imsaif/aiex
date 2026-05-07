import { patterns } from '@/data/patterns';

/**
 * Resolve a pattern slug from an audit gap's `pattern` name and optional
 * `resource` URL. Used to convert audit findings into internal links to
 * /patterns/<slug> so the audit tool funnels equity to pattern pages.
 *
 * Resolution order:
 *   1. If `resource` parses to a /patterns/<slug> path, use that slug.
 *   2. Otherwise, look the pattern name up in the patterns catalogue
 *      (case-insensitive, ignoring punctuation).
 *   3. Otherwise, return null — caller should fall back to the original
 *      external link or omit the link entirely.
 */
export function resolvePatternSlug(patternName: string, resource?: string | null): string | null {
  if (resource) {
    // Match `/patterns/<slug>` regardless of protocol or host prefix.
    const m = resource.match(/\/patterns\/([a-z0-9-]+)/i);
    if (m && m[1]) {
      const slug = m[1].toLowerCase();
      if (patterns.some((p) => p.slug === slug)) return slug;
    }
  }

  const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  const target = norm(patternName);
  const match = patterns.find((p) => norm(p.title) === target || p.slug === target);
  return match?.slug ?? null;
}
