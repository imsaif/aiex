import { createHmac } from 'crypto';
import { verifyWebhook } from '../verify-webhook';

const rawKey = Buffer.from('test-signing-key-for-dodo-webhooks');
const secret = `whsec_${rawKey.toString('base64')}`;
const body = JSON.stringify({ type: 'payment.succeeded', data: { payment_id: 'pay_1' } });
const now = 1_790_000_000;

const sign = (id: string, ts: number, payload: string) =>
  `v1,${createHmac('sha256', rawKey).update(`${id}.${ts}.${payload}`).digest('base64')}`;

describe('verifyWebhook', () => {
  it('accepts a correctly signed, fresh delivery', () => {
    expect(
      verifyWebhook(secret, body, { id: 'msg_1', timestamp: String(now), signature: sign('msg_1', now, body) }, now)
    ).toBe(true);
  });

  it('accepts when one of several signatures matches', () => {
    const header = `v1,${Buffer.from('wrong').toString('base64')} ${sign('msg_1', now, body)}`;
    expect(verifyWebhook(secret, body, { id: 'msg_1', timestamp: String(now), signature: header }, now)).toBe(true);
  });

  it('rejects a tampered body', () => {
    const sig = sign('msg_1', now, body);
    expect(verifyWebhook(secret, body.replace('pay_1', 'pay_2'), { id: 'msg_1', timestamp: String(now), signature: sig }, now)).toBe(false);
  });

  it('rejects a stale timestamp', () => {
    const old = now - 600;
    expect(verifyWebhook(secret, body, { id: 'msg_1', timestamp: String(old), signature: sign('msg_1', old, body) }, now)).toBe(false);
  });

  it('rejects missing headers', () => {
    expect(verifyWebhook(secret, body, { id: null, timestamp: String(now), signature: 'v1,x' }, now)).toBe(false);
  });
});
