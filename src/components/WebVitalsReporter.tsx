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

// Owner/self-test sessions must not pollute field data — the same aiux:role
// flag the audit funnel and Clarity already exclude. (Documented: self-testing
// has twice flipped our value-rate conclusions.)
function isExcludedSession(): boolean {
  try {
    if (typeof navigator !== 'undefined' && navigator.webdriver) return true;
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
