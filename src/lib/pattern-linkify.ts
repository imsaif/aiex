/**
 * Pattern auto-linking — wraps pattern title mentions in body prose with
 * links to /patterns/<slug>. Used by the lesson renderer (React) and the
 * news article HTML pipeline so courses + newsletter posts fund pattern
 * pages with internal-link equity.
 *
 * Longer titles are matched first so e.g. "Confidence" doesn't greedily
 * consume "Confidence Visualization."
 */

import { patterns } from '@/data/patterns';

export const PATTERN_TITLES: Array<{ slug: string; title: string }> = patterns
  .map((p) => ({ slug: p.slug, title: p.title }))
  .sort((a, b) => b.title.length - a.title.length);

export const PATTERN_REGEX_SOURCE =
  '\\b(' +
  PATTERN_TITLES.map((p) =>
    p.title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  ).join('|') +
  ')\\b';

/**
 * Walk an HTML string and wrap pattern title mentions in <a href="/patterns/<slug>">.
 * Skips text inside anchors, code, pre, headings, style, and script. Each
 * pattern is linked at most once per article to avoid spammy repetition.
 *
 * Runs in the browser (uses DOMParser) — call from a client component or effect.
 */
export function linkifyPatternsInHtml(html: string): string {
  if (typeof window === 'undefined' || typeof DOMParser === 'undefined') return html;
  const doc = new DOMParser().parseFromString(`<div id="root">${html}</div>`, 'text/html');
  const root = doc.getElementById('root');
  if (!root) return html;

  const linked = new Set<string>();
  const SKIP = new Set([
    'A',
    'CODE',
    'PRE',
    'H1',
    'H2',
    'H3',
    'H4',
    'H5',
    'H6',
    'STYLE',
    'SCRIPT',
  ]);
  const RE = new RegExp(PATTERN_REGEX_SOURCE, 'g');

  const walk = (node: Node) => {
    if (node.nodeType === Node.TEXT_NODE) {
      const text = node.nodeValue ?? '';
      if (!text || text.length < 6) return;
      const parts: Array<string | HTMLAnchorElement> = [];
      let lastIdx = 0;
      let match: RegExpExecArray | null;
      RE.lastIndex = 0;
      while ((match = RE.exec(text)) !== null) {
        const matched = match[0];
        const found = PATTERN_TITLES.find((p) => p.title === matched);
        if (!found || linked.has(found.slug)) continue;
        if (match.index > lastIdx) parts.push(text.slice(lastIdx, match.index));
        const a = doc.createElement('a');
        a.setAttribute('href', `/patterns/${found.slug}`);
        a.textContent = matched;
        parts.push(a);
        linked.add(found.slug);
        lastIdx = match.index + matched.length;
      }
      if (parts.length === 0) return;
      if (lastIdx < text.length) parts.push(text.slice(lastIdx));
      const frag = doc.createDocumentFragment();
      for (const p of parts) {
        frag.appendChild(typeof p === 'string' ? doc.createTextNode(p) : p);
      }
      node.parentNode?.replaceChild(frag, node);
      return;
    }
    if (node.nodeType === Node.ELEMENT_NODE) {
      const el = node as Element;
      if (SKIP.has(el.tagName)) return;
      Array.from(node.childNodes).forEach(walk);
    }
  };

  walk(root);
  return root.innerHTML;
}
