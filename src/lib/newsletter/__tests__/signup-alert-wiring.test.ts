/**
 * The alert must fire from every route that makes someone a subscriber, and
 * only when they actually become one.
 */
const alert = jest.fn();
const findUnique = jest.fn();

jest.mock('@/lib/newsletter/signup-alert', () => ({ sendSignupAlert: (...a: unknown[]) => alert(...a) }));
jest.mock('@/lib/newsletter/welcome-email', () => ({ sendWelcomeEmail: jest.fn() }));
jest.mock('@/lib/analytics/signup-event', () => ({ logSignup: jest.fn() }));
jest.mock('@/lib/beehiiv', () => ({ addSubscriberToBeehiiv: jest.fn() }));
jest.mock('@/lib/email-validation', () => ({ validateEmailSecurity: () => null }));
jest.mock('@/lib/rate-limit', () => ({
  checkRateLimit: () => ({ allowed: true, resetIn: 0 }),
  RATE_LIMIT_PRESETS: new Proxy({}, { get: () => ({ limit: 10, windowMs: 1000 }) }),
}));
jest.mock('@/lib/prisma', () => ({
  prisma: { subscriber: { findUnique: (...a: unknown[]) => findUnique(...a), create: jest.fn(), update: jest.fn() } },
}));
jest.mock('@/lib/resend', () => ({ resend: { emails: { send: jest.fn().mockResolvedValue({ data: {}, error: null }) } } }));

import type { NextRequest } from 'next/server';
import { POST as subscribe } from '@/app/api/newsletter/subscribe/route';
import { POST as guidePdf } from '@/app/api/guides/download-pdf/route';
import { POST as auditReport } from '@/app/api/audit/send-report/route';

const post = (body: unknown) =>
  ({
    json: async () => body,
    url: 'https://example.test/api',
    nextUrl: new URL('https://example.test/api'),
    headers: new Headers(),
    cookies: { get: () => undefined },
  }) as unknown as NextRequest;
const email = 'ana@example.com';
const auditBody = {
  email,
  productContext: { productType: 'chat-interface', productDescription: 'AI coding assistant', aiRole: ['Chat'] },
  results: {
    id: 'test-001', score: 8, maxScore: 36, detectedComponent: 'Test', componentDescription: 'Test',
    patterns: { 'feedback-loops': { id: 'feedback-loops', name: 'Feedback Loops', status: 'missing', evidence: 'None', priority: 'high', improvement: 'Add thumbs' } },
    summary: 'ok', criticalMissing: [], timestamp: '2026-11-24T00:00:00Z',
    context: { interfaceType: 'chat', userGoal: 'code', mainConcern: 'trust' },
  },
};

describe('signup alert wiring', () => {
  beforeEach(() => {
    alert.mockReset();
    findUnique.mockReset();
    process.env.GUIDE_DOWNLOAD_SECRET ??= 'test';
    process.env.RESEND_API_KEY ??= 'test';
    jest.spyOn(console, 'error').mockImplementation(() => {});
    jest.spyOn(console, 'log').mockImplementation(() => {});
  });
  afterEach(() => jest.restoreAllMocks());

  it('newsletter form: new, rejoining, already subscribed', async () => {
    findUnique.mockResolvedValue(null);
    await subscribe(post({ email, source: 'footer' }));
    expect(alert).toHaveBeenLastCalledWith(expect.anything(), email, 'footer', false);

    findUnique.mockResolvedValue({ email, active: false });
    await subscribe(post({ email, source: 'footer' }));
    expect(alert).toHaveBeenLastCalledWith(expect.anything(), email, 'footer', true);

    alert.mockReset();
    findUnique.mockResolvedValue({ email, active: true });
    await subscribe(post({ email, source: 'footer' }));
    expect(alert).not.toHaveBeenCalled();
  });

  it('guide PDF: new signup alerts, repeat download does not', async () => {
    findUnique.mockResolvedValue(null);
    await guidePdf(post({ email, guideSlug: 'claude-design', guideTitle: 'Claude Design' }));
    expect(alert).toHaveBeenLastCalledWith(expect.anything(), email, 'guides', false);

    alert.mockReset();
    findUnique.mockResolvedValue({ email, active: true });
    await guidePdf(post({ email, guideSlug: 'claude-design', guideTitle: 'Claude Design' }));
    expect(alert).not.toHaveBeenCalled();
  });

  it('audit report: new signup alerts, existing address does not', async () => {
    findUnique.mockResolvedValue(null);
    const res = await auditReport(post(auditBody));
    expect(res.status).toBe(200);
    expect(alert).toHaveBeenLastCalledWith(expect.anything(), email, 'audit-report');

    alert.mockReset();
    findUnique.mockResolvedValue({ email, active: false });
    await auditReport(post(auditBody));
    expect(alert).not.toHaveBeenCalled();
  });
});
