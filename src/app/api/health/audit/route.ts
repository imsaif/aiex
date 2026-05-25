import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { prisma } from '@/lib/prisma';

/**
 * Synthetic monitor for the audit funnel. Designed to be pinged every
 * 5 minutes by cron-job.org with the existing CRON_SECRET header.
 *
 * Catches the failure classes that take down the audit flow:
 *   - Homepage 500s or stops rendering the audit CTA
 *   - /api/patterns/analyze 500s on cold start
 *   - Neon DB unreachable (free-tier quota / connection limit)
 *   - ANTHROPIC_API_KEY missing or rotated without update
 *
 * Does NOT call Anthropic — sends a deliberately invalid POST that the
 * route rejects at 400 before reaching the model. Zero API spend per check.
 *
 * Auth: requires `Authorization: Bearer <CRON_SECRET>` so the response
 * (which leaks env shape) can't be enumerated by a stranger.
 */

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.aiuxdesign.guide';

interface CheckResult {
  name: string;
  ok: boolean;
  latencyMs: number;
  detail?: string;
}

async function timed<T>(name: string, fn: () => Promise<{ ok: boolean; detail?: string }>): Promise<CheckResult> {
  const startedAt = Date.now();
  try {
    const { ok, detail } = await fn();
    return { name, ok, latencyMs: Date.now() - startedAt, detail };
  } catch (err) {
    return {
      name,
      ok: false,
      latencyMs: Date.now() - startedAt,
      detail: err instanceof Error ? err.message : String(err),
    };
  }
}

async function checkHomepage(): Promise<{ ok: boolean; detail?: string }> {
  const res = await fetch(SITE_URL, { cache: 'no-store' });
  if (!res.ok) return { ok: false, detail: `homepage HTTP ${res.status}` };
  const html = await res.text();
  // The audit CTA copy is the load-bearing surface; if this string is gone
  // the hero is broken even if the page returns 200.
  if (!/Audit your design|reached the free limit/i.test(html)) {
    return { ok: false, detail: 'homepage rendered but audit CTA / lockout text missing' };
  }
  return { ok: true };
}

async function checkAnalyzeRoute(): Promise<{ ok: boolean; detail?: string }> {
  // Send a deliberately incomplete body — route returns 400 before any
  // Anthropic call. We're verifying the route is reachable + returns
  // structured JSON, not exercising the model.
  const res = await fetch(`${SITE_URL}/api/patterns/analyze`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({}),
    cache: 'no-store',
  });
  if (res.status !== 400) {
    return { ok: false, detail: `analyze route returned ${res.status}, expected 400 for empty body` };
  }
  return { ok: true };
}

async function checkDatabase(): Promise<{ ok: boolean; detail?: string }> {
  await prisma.$queryRaw`SELECT 1`;
  return { ok: true };
}

function checkEnv(): { ok: boolean; detail?: string } {
  const missing = ['ANTHROPIC_API_KEY', 'DATABASE_URL', 'CRON_SECRET'].filter((k) => !process.env[k]);
  return missing.length === 0
    ? { ok: true }
    : { ok: false, detail: `missing env: ${missing.join(', ')}` };
}

async function sendHealthAlert(failures: CheckResult[], allChecks: CheckResult[]) {
  if (!resend || !process.env.ADMIN_EMAIL) return;
  try {
    const failList = failures
      .map((f) => `<li><strong>${f.name}</strong> (${f.latencyMs}ms): ${f.detail || 'failed'}</li>`)
      .join('');
    const allList = allChecks
      .map((c) => `<li>${c.ok ? '✅' : '❌'} ${c.name} — ${c.latencyMs}ms${c.detail ? ` — ${c.detail}` : ''}</li>`)
      .join('');

    await resend.emails.send({
      from: 'AI UX Daily <imran@aiuxdesign.guide>',
      replyTo: 'imranrizom@gmail.com',
      to: process.env.ADMIN_EMAIL,
      subject: `🚨 Audit health check failed — ${failures.length} of ${allChecks.length} (${new Date().toISOString().slice(11, 16)} UTC)`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="font-size: 22px; color: #dc2626;">Audit health check failed</h1>
          <p>The synthetic monitor on <code>/api/health/audit</code> detected ${failures.length} broken surface(s) on the audit funnel.</p>

          <h2 style="font-size: 16px; margin-top: 24px; color: #dc2626;">Failures</h2>
          <ul style="line-height: 1.6;">${failList}</ul>

          <h2 style="font-size: 16px; margin-top: 24px;">All checks</h2>
          <ul style="line-height: 1.6;">${allList}</ul>

          <p style="margin-top: 20px;">Re-run manually:</p>
          <pre style="background: #f1f5f9; padding: 12px; border-radius: 6px; font-size: 13px; overflow-x: auto;">curl -H "Authorization: Bearer $CRON_SECRET" "${SITE_URL}/api/health/audit"</pre>

          <p style="margin-top: 16px; font-size: 13px; color: #64748b;">
            cron-job.org will keep retrying every 5 min and will email again after the next failure window. Healthy checks are silent.
          </p>
        </div>
      `,
    });
  } catch (err) {
    console.error('[health/audit] Failed to send alert email:', err);
  }
}

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const envCheck = checkEnv();
  const checks: CheckResult[] = [
    { name: 'env', ok: envCheck.ok, latencyMs: 0, detail: envCheck.detail },
    ...(await Promise.all([
      timed('homepage', checkHomepage),
      timed('analyze_route', checkAnalyzeRoute),
      timed('database', checkDatabase),
    ])),
  ];

  const failures = checks.filter((c) => !c.ok);
  const ok = failures.length === 0;

  if (!ok) {
    console.error('[health/audit] failures:', failures);
    // Fire-and-forget — alert delivery shouldn't block the cron response.
    sendHealthAlert(failures, checks).catch(() => {});
  }

  return NextResponse.json(
    {
      ok,
      checkedAt: new Date().toISOString(),
      checks,
    },
    { status: ok ? 200 : 503 }
  );
}
