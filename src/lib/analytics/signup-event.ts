import type { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { isAdminAuthenticated } from '@/lib/admin-auth';
import { isSyntheticUserAgent } from './bots';
import { decodeVisit, VISIT_COOKIE } from './visit-source';

// Server-written, so it never goes through the client allowlist in /api/events
// and cannot be forged from the browser.
export const SIGNUP_EVENT = 'newsletter_subscribed';

/**
 * Record that someone became an active subscriber, with the channel of the
 * visit they signed up in. Call at the same points as sendWelcomeEmail, i.e.
 * only when a subscriber actually becomes active. Never throws.
 */
export async function logSignup(request: NextRequest, surface: string): Promise<void> {
  try {
    if (isSyntheticUserAgent(request.headers.get('user-agent'))) return;
    const visit = decodeVisit(request.cookies.get(VISIT_COOKIE)?.value) ?? { channel: 'direct', ref: null };
    let role: string | null = null;
    try {
      if (await isAdminAuthenticated(request)) role = 'admin';
    } catch {
      /* never lose the row over an auth parse failure */
    }
    await prisma.uiEvent.create({
      data: {
        name: SIGNUP_EVENT,
        properties: { channel: visit.channel, ref: visit.ref, surface },
        role,
      },
    });
  } catch (err) {
    console.error('[signup-event] failed to log signup:', err);
  }
}
