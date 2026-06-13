import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { prisma } from '@/lib/prisma';

// Daily field-CWV regression check. Computes rolling p75 per metric over a
// window and emails the admin when a Core Web Vital breaches its "good"
// threshold. This is the field-data alert LHCI (lab) can't give us — it's what
// turns "Imran notices a bad number in Clarity when he sits down" into a push.
//
// Auth: Bearer CRON_SECRET (same as the other cron-job.org triggers).
// Schedule (add in cron-job.org): GET https://www.aiuxdesign.guide/api/cron/check-web-vitals
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

// Alert when rolling p75 exceeds the "good" boundary for a core metric.
const ALERT_THRESHOLD: Record<string, number> = { LCP: 2500, INP: 200, CLS: 0.1 };
// FCP/TTFB are tracked + reported for context, but don't trigger alerts.
const REPORTED_METRICS = ['LCP', 'INP', 'CLS', 'FCP', 'TTFB'] as const;
// Don't judge a metric until we have enough samples — the entire point is to
// stop single-outlier sessions from driving conclusions.
const MIN_SAMPLES = 20;
const RETENTION_DAYS = 30;

function p75(values: number[]): number | null {
  if (values.length === 0) return null;
  const sorted = [...values].sort((a, b) => a - b);
  return sorted[Math.ceil(0.75 * sorted.length) - 1];
}

function fmt(metric: string, v: number | null): string {
  if (v === null) return 'n/a';
  return metric === 'CLS' ? v.toFixed(3) : `${Math.round(v)}ms`;
}

export async function GET(request: NextRequest) {
  if (request.headers.get('authorization') !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const hours = Math.min(Math.max(Number(new URL(request.url).searchParams.get('hours')) || 72, 1), 720);
  const since = new Date(Date.now() - hours * 60 * 60 * 1000);

  const rows = await prisma.webVitalMetric.findMany({
    where: { createdAt: { gte: since } },
    select: { metric: true, value: true, path: true, device: true },
  });

  // Aggregate p75 per metric (overall + mobile) and find the worst path per metric.
  const summary = REPORTED_METRICS.map((metric) => {
    const all = rows.filter((r) => r.metric === metric);
    const mobile = all.filter((r) => r.device === 'mobile');

    // Worst-offending path (only paths with a meaningful sample).
    const byPath = new Map<string, number[]>();
    for (const r of all) {
      if (!byPath.has(r.path)) byPath.set(r.path, []);
      byPath.get(r.path)!.push(r.value);
    }
    let worstPath: { path: string; p75: number; n: number } | null = null;
    for (const [path, vals] of Array.from(byPath.entries())) {
      if (vals.length < 10) continue;
      const v = p75(vals)!;
      if (!worstPath || v > worstPath.p75) worstPath = { path, p75: v, n: vals.length };
    }

    const overall = p75(all.map((r) => r.value));
    const mobileP75 = p75(mobile.map((r) => r.value));
    const threshold = ALERT_THRESHOLD[metric] ?? null;
    const breached =
      threshold !== null && overall !== null && all.length >= MIN_SAMPLES && overall > threshold;

    return { metric, samples: all.length, overall, mobileP75, threshold, breached, worstPath };
  });

  const breaches = summary.filter((s) => s.breached);

  if (breaches.length > 0) {
    await sendVitalsAlert(breaches, summary, hours).catch((err) =>
      console.error('[check-web-vitals] alert send failed:', err)
    );
  }

  // Bounded retention — keep the table from growing forever.
  prisma.webVitalMetric
    .deleteMany({ where: { createdAt: { lt: new Date(Date.now() - RETENTION_DAYS * 86_400_000) } } })
    .catch(() => {});

  return NextResponse.json({
    ok: breaches.length === 0,
    windowHours: hours,
    totalSamples: rows.length,
    breaches: breaches.map((b) => b.metric),
    summary: summary.map((s) => ({
      metric: s.metric,
      samples: s.samples,
      p75: fmt(s.metric, s.overall),
      p75Mobile: fmt(s.metric, s.mobileP75),
      threshold: s.threshold,
      breached: s.breached,
      worstPath: s.worstPath
        ? { path: s.worstPath.path, p75: fmt(s.metric, s.worstPath.p75), n: s.worstPath.n }
        : null,
    })),
  });
}

type Summary = {
  metric: string;
  samples: number;
  overall: number | null;
  mobileP75: number | null;
  threshold: number | null;
  breached: boolean;
  worstPath: { path: string; p75: number; n: number } | null;
};

async function sendVitalsAlert(breaches: Summary[], all: Summary[], hours: number) {
  if (!resend || !process.env.ADMIN_EMAIL) return;

  const breachList = breaches
    .map(
      (b) =>
        `<li><strong>${b.metric}</strong>: p75 ${fmt(b.metric, b.overall)} (target ≤ ${fmt(
          b.metric,
          b.threshold
        )}, ${b.samples} samples)${
          b.worstPath ? ` — worst: <code>${b.worstPath.path}</code> at ${fmt(b.metric, b.worstPath.p75)}` : ''
        }</li>`
    )
    .join('');

  const allList = all
    .map(
      (s) =>
        `<li>${s.breached ? '❌' : '✅'} ${s.metric} — p75 ${fmt(s.metric, s.overall)} (mobile ${fmt(
          s.metric,
          s.mobileP75
        )}, ${s.samples} samples)</li>`
    )
    .join('');

  await resend.emails.send({
    from: 'AI UX Daily <imran@aiuxdesign.guide>',
    replyTo: 'imranrizom@gmail.com',
    to: process.env.ADMIN_EMAIL,
    subject: `📉 Field Web Vitals regression — ${breaches.map((b) => b.metric).join(', ')} (p75 over ${hours}h)`,
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="font-size: 22px; color: #dc2626;">Real-user Core Web Vitals regressed</h1>
        <p>Rolling <strong>p75</strong> over the last ${hours}h breached the "good" threshold for ${breaches.length} metric(s). This is field data (real users), not a lab run.</p>

        <h2 style="font-size: 16px; margin-top: 24px; color: #dc2626;">Breaches</h2>
        <ul style="line-height: 1.6;">${breachList}</ul>

        <h2 style="font-size: 16px; margin-top: 24px;">All metrics</h2>
        <ul style="line-height: 1.6;">${allList}</ul>

        <p style="margin-top: 24px; color: #6b7280; font-size: 13px;">
          Next steps: open the worst path in Microsoft Clarity for session recordings, and consult
          CLAUDE.md → Known Issues &amp; Learnings → Performance &amp; Web Vitals for documented failure modes.
          Inspect raw aggregates any time via <code>/api/cron/check-web-vitals?hours=24</code> (Bearer CRON_SECRET).
        </p>
      </div>
    `,
  });
}
