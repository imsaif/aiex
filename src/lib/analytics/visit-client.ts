import { classifyVisit, decodeVisit, encodeVisit, VISIT_COOKIE, type VisitSource } from './visit-source';

// Browser half of visit attribution. The visit's source lives in a session
// cookie (not sessionStorage) so the server can read it when someone signs up.
// Worked out once per hard page load: an external arrival replaces it, an
// internal navigation or a plain reload keeps it.

let resolved: VisitSource | null = null;

function readCookie(name: string): string | null {
  const match = document.cookie.split('; ').find((c) => c.startsWith(`${name}=`));
  return match ? match.slice(name.length + 1) : null;
}

export function currentVisit(): VisitSource {
  if (resolved) return resolved;
  const existing = decodeVisit(readCookie(VISIT_COOKIE));
  const landing = classifyVisit(document.referrer, window.location.search, window.location.host);
  // A bare direct load (no referrer, no tag) is usually a reload or a restored
  // tab, so it never overwrites a known source.
  const isRealArrival = landing && (landing.channel !== 'direct' || landing.ref);
  resolved = (isRealArrival ? landing : existing) ?? landing ?? { channel: 'direct', ref: null };
  try {
    document.cookie = `${VISIT_COOKIE}=${encodeVisit(resolved)}; path=/; SameSite=Lax; Secure`;
  } catch {
    /* blocked cookies: attribution falls back to direct server-side */
  }
  return resolved;
}

/** Anonymous per-browser id, so visitors are counted once, not per page. */
export function visitorId(): string | null {
  try {
    let id = window.localStorage.getItem('aiux:vid');
    if (!id) {
      id = Math.random().toString(36).slice(2, 12) + Date.now().toString(36);
      window.localStorage.setItem('aiux:vid', id);
    }
    return id;
  } catch {
    return null;
  }
}
