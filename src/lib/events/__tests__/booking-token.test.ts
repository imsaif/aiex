import { signBookingToken, verifyBookingToken } from '../booking-token';

const key = 'test-booking-secret';
const slug = 'claude-code-hands-on-oct-10';

describe('booking tokens', () => {
  it('round-trips to the payment id', () => {
    const token = signBookingToken(slug, 'pay_0Nx8f2KqL', key);
    expect(verifyBookingToken(slug, token, key)).toBe('pay_0Nx8f2KqL');
  });

  it('does not work for a different event', () => {
    const token = signBookingToken(slug, 'pay_0Nx8f2KqL', key);
    expect(verifyBookingToken('another-event', token, key)).toBeNull();
  });

  it('rejects a token signed with another key', () => {
    const token = signBookingToken(slug, 'pay_0Nx8f2KqL', 'other-key');
    expect(verifyBookingToken(slug, token, key)).toBeNull();
  });

  it('rejects a swapped payment id', () => {
    const [, sig] = signBookingToken(slug, 'pay_0Nx8f2KqL', key).split('.');
    const forged = `${Buffer.from('pay_someoneElse').toString('base64url')}.${sig}`;
    expect(verifyBookingToken(slug, forged, key)).toBeNull();
  });

  it('rejects junk', () => {
    expect(verifyBookingToken(slug, 'nonsense', key)).toBeNull();
    expect(verifyBookingToken(slug, '', key)).toBeNull();
  });
});
