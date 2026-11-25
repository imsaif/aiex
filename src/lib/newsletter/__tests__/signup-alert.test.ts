const send = jest.fn();
const count = jest.fn();

jest.mock('@/lib/prisma', () => ({ prisma: { subscriber: { count: (...a: unknown[]) => count(...a) } } }));
jest.mock('@/lib/resend', () => ({ getResend: () => ({ emails: { send: (...a: unknown[]) => send(...a) } }) }));

import type { NextRequest } from 'next/server';
import { renderSignupAlert, sendSignupAlert } from '../signup-alert';

const CHROME = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36';

function fakeRequest(userAgent = CHROME): NextRequest {
  return {
    headers: new Headers({ 'user-agent': userAgent }),
    cookies: { get: () => undefined },
  } as unknown as NextRequest;
}

const base = { email: 'ana@example.test', surface: 'homepage-skills-pack', channel: 'LinkedIn', ref: null, rejoined: false, activeCount: 304 };

describe('renderSignupAlert', () => {
  it('puts the bee, the email and the surface in the subject', () => {
    expect(renderSignupAlert(base).subject).toBe('🐝 New subscriber: ana@example.test (homepage skills pack)');
  });

  it('says when someone came back', () => {
    expect(renderSignupAlert({ ...base, rejoined: true }).subject).toContain('🐝 Subscriber came back');
  });

  it('escapes the visitor-supplied values and drops an unknown count', () => {
    const { html } = renderSignupAlert({ ...base, ref: '<img src=x>', activeCount: null });
    expect(html).toContain('LinkedIn (&lt;img src=x&gt;)');
    expect(html).not.toContain('<img');
    expect(html).not.toContain('Active subscribers');
  });
});

describe('sendSignupAlert', () => {
  const originalAdmin = process.env.ADMIN_EMAIL;
  beforeEach(() => {
    send.mockReset().mockResolvedValue({ data: { id: '1' }, error: null });
    count.mockReset().mockResolvedValue(304);
    process.env.ADMIN_EMAIL = 'owner@example.test';
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });
  afterEach(() => jest.restoreAllMocks());
  afterAll(() => {
    if (originalAdmin === undefined) delete process.env.ADMIN_EMAIL;
    else process.env.ADMIN_EMAIL = originalAdmin;
  });

  it('emails the owner', async () => {
    await sendSignupAlert(fakeRequest(), 'ana@example.test', 'footer');
    expect(send).toHaveBeenCalledTimes(1);
    expect(send.mock.calls[0][0]).toMatchObject({ to: 'owner@example.test', subject: '🐝 New subscriber: ana@example.test (footer)' });
  });

  it('still sends when the count fails', async () => {
    count.mockRejectedValue(new Error('db down'));
    await sendSignupAlert(fakeRequest(), 'ana@example.test', 'footer');
    expect(send).toHaveBeenCalledTimes(1);
  });

  it('stays quiet for synthetic traffic and when no owner address is set', async () => {
    await sendSignupAlert(fakeRequest('Mozilla/5.0 HeadlessChrome/140.0.0.0 Safari/537.36'), 'ana@example.test', 'footer');
    delete process.env.ADMIN_EMAIL;
    await sendSignupAlert(fakeRequest(), 'ana@example.test', 'footer');
    expect(send).not.toHaveBeenCalled();
  });

  it('never throws', async () => {
    send.mockRejectedValue(new Error('resend down'));
    await expect(sendSignupAlert(fakeRequest(), 'ana@example.test', 'footer')).resolves.toBeUndefined();
  });
});
