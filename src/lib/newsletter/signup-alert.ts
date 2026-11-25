/**
 * Email to the owner when someone becomes an active subscriber.
 *
 * Why this exists (Nov 2026): beehiiv's "🐝 Daily Growth" emails were the only
 * sign that someone had joined, and they stopped after 2026-10-30 while signups
 * carried on. The bee stays in the subject because that is what Imran looks for.
 *
 * Call it at the same points as sendWelcomeEmail, i.e. only when a subscriber
 * actually becomes active. Never throws: a missing alert must never fail a signup.
 */

import type { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getResend } from '@/lib/resend';
import { isSyntheticUserAgent } from '@/lib/analytics/bots';
import { CHANNEL_LABELS, decodeVisit, VISIT_COOKIE } from '@/lib/analytics/visit-source';
import { NEWSLETTER_FROM } from './resend-send';

function escapeHtml(text: string): string {
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

export interface SignupAlertInput {
  email: string;
  /** The signup surface, e.g. "homepage-skills-pack". */
  surface: string;
  /** Where the visit came from, e.g. "LinkedIn". */
  channel: string;
  /** The post or campaign tag on the link, when there was one. */
  ref: string | null;
  /** True when they had unsubscribed before and came back. */
  rejoined: boolean;
  /** Active subscribers including this one; null when it could not be counted. */
  activeCount: number | null;
}

export function renderSignupAlert({ email, surface, channel, ref, rejoined, activeCount }: SignupAlertInput): { subject: string; html: string } {
  const place = surface.replace(/-/g, ' ');
  const rows: [string, string][] = [
    ['Email', email],
    ['Signed up at', place],
    ['Came from', ref ? `${channel} (${ref})` : channel],
  ];
  if (activeCount !== null) rows.push(['Active subscribers', String(activeCount)]);

  const body = rows
    .map(([label, value]) => `<tr><td style="padding: 4px 16px 4px 0; color: #475569;">${label}</td><td style="padding: 4px 0;">${escapeHtml(value)}</td></tr>`)
    .join('');

  return {
    subject: `🐝 ${rejoined ? 'Subscriber came back' : 'New subscriber'}: ${email} (${place})`,
    html: `<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif; font-size: 15px; color: #162036;"><table role="presentation" cellpadding="0" cellspacing="0" border="0">${body}</table></div>`,
  };
}

/**
 * Awaited by callers: fire-and-forget gets cut off when Vercel suspends the
 * function after the response.
 */
export async function sendSignupAlert(request: NextRequest, email: string, surface: string, rejoined = false): Promise<void> {
  try {
    const to = process.env.ADMIN_EMAIL?.trim();
    if (!to) return;
    if (isSyntheticUserAgent(request.headers.get('user-agent'))) return;

    const visit = decodeVisit(request.cookies.get(VISIT_COOKIE)?.value) ?? { channel: 'direct' as const, ref: null };
    let activeCount: number | null = null;
    try {
      activeCount = await prisma.subscriber.count({ where: { active: true } });
    } catch {
      /* the count is a nicety; send the alert without it */
    }

    const { subject, html } = renderSignupAlert({
      email,
      surface,
      channel: CHANNEL_LABELS[visit.channel],
      ref: visit.ref,
      rejoined,
      activeCount,
    });
    const { error } = await getResend().emails.send({ from: NEWSLETTER_FROM, to, subject, html });
    if (error) console.error('[signup-alert] Resend rejected the send:', error.message);
  } catch (err) {
    console.error('[signup-alert] failed:', err);
  }
}
