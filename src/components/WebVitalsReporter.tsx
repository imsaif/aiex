'use client';

import { useReportWebVitals } from 'next/web-vitals';
import { usePathname } from 'next/navigation';

// Standard web-vitals rating thresholds. Used as a fallback when the metric
// object doesn't carry `rating` (keeps us decoupled from the lib's type shape).
const THRESHOLDS: Record<string, [number, number]> = {
  LCP: [2500, 4000],
  INP: [200, 500],
  CLS: [0.1, 0.25],
  FCP: [1800, 3000],
  TTFB: [800, 1800],
};

function ratingFor(name: string, value: number): string {
  const t = THRESHOLDS[name];
  if (!t) return 'good';
  if (value <= t[0]) return 'good';
  if (value <= t[1]) return 'needs-improvement';
  return 'poor';
}

// Hosts whose sessions are never real-user traffic: local dev and Vercel
// preview deploys both point at the same Neon DATABASE_URL as production, so
// without this gate their beacons land in the same table the alert cron reads.
// (Same failure mode Clarity hit in Apr 2026 — see .claude/rules/performance.md.)
function isNonProductionHost(): boolean {
  const h = window.location.hostname;
  return (
    h === 'localhost' ||
    h === '127.0.0.1' ||
    h === '::1' ||
    h.endsWith('.local') ||
    h.endsWith('.vercel.app')
  );
}

// Synthetic browsers. `navigator.webdriver` catches Playwright but NOT
// Lighthouse: LHCI drives plain headless Chrome, so every nightly + PR run was
// beaconing lab numbers into the field table, labelled `mobile` because the
// 412px screen emulation trips the innerWidth < 1024 check. Lighthouse marks
// itself in the UA ("Chrome-Lighthouse"), which is the reliable signal.
function isSyntheticAgent(): boolean {
  if (navigator.webdriver) return true;
  const ua = navigator.userAgent || '';
  return /Chrome-Lighthouse|HeadlessChrome|PhantomJS|Puppeteer/i.test(ua);
}

// Owner/self-test sessions must not pollute field data — the same aiux:role
// flag the audit funnel and Clarity already exclude. (Documented: self-testing
// has twice flipped our value-rate conclusions.)
function isExcludedSession(): boolean {
  try {
    if (typeof navigator === 'undefined' || typeof window === 'undefined') return true;
    if (isSyntheticAgent()) return true;
    if (isNonProductionHost()) return true;
    const role = window.localStorage.getItem('aiux:role');
    return role === 'admin' || role === 'test';
  } catch {
    return false;
  }
}

export default function WebVitalsReporter() {
  const pathname = usePathname();

  useReportWebVitals((metric) => {
    if (!THRESHOLDS[metric.name]) return; // only the five CWV we track
    if (isExcludedSession()) return;

    const device = window.innerWidth < 1024 ? 'mobile' : 'desktop';
    const payload = JSON.stringify({
      metric: metric.name,
      value: metric.value,
      rating: (metric as { rating?: string }).rating ?? ratingFor(metric.name, metric.value),
      path: pathname,
      device,
      navigationId: metric.id,
    });

    try {
      if (navigator.sendBeacon) {
        navigator.sendBeacon('/api/vitals', new Blob([payload], { type: 'application/json' }));
      } else {
        fetch('/api/vitals', { method: 'POST', body: payload, keepalive: true });
      }
    } catch {
      // Reporting is best-effort; never throw into the render path.
    }
  });

  return null;
}
