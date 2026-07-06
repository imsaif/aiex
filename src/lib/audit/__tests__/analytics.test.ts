/**
 * Regression tests for the audit funnel session-id stamping.
 *
 * Bug (fixed 2026-07-06): every UiEvent row had sessionId=null because the
 * beacon only read properties.sessionId, which no results-page event passed —
 * making "distinct sessions reaching results" and "audits with >=1 chat
 * message" uncomputable. setAuditSessionId() now stamps the active audit's id
 * onto every subsequent event.
 */
import { trackAuditEvent, setAuditSessionId } from '../analytics';

// beaconEvent only runs in production and posts via navigator.sendBeacon, else
// fetch. We force the fetch path and read the JSON body it would have sent.
const ORIGINAL_NODE_ENV = process.env.NODE_ENV;

function lastBeaconPayload(fetchMock: jest.Mock): Record<string, unknown> | null {
  if (fetchMock.mock.calls.length === 0) return null;
  const [, init] = fetchMock.mock.calls[fetchMock.mock.calls.length - 1];
  return JSON.parse((init as RequestInit).body as string);
}

describe('audit analytics session id', () => {
  let fetchMock: jest.Mock;

  beforeEach(() => {
    (process.env as { NODE_ENV?: string }).NODE_ENV = 'production';
    setAuditSessionId(null);
    // Force the fetch branch (no sendBeacon) and capture the payload.
    (navigator as unknown as { sendBeacon?: unknown }).sendBeacon = undefined;
    fetchMock = jest.fn(() => Promise.resolve({ ok: true } as Response));
    global.fetch = fetchMock as unknown as typeof fetch;
    // Avoid the Clarity branch and localStorage noise.
    (window as unknown as { clarity?: unknown }).clarity = undefined;
  });

  afterEach(() => {
    (process.env as { NODE_ENV?: string }).NODE_ENV = ORIGINAL_NODE_ENV;
    setAuditSessionId(null);
    jest.restoreAllMocks();
  });

  it('omits sessionId when none is set (the pre-fix behavior, without the fix)', () => {
    trackAuditEvent('audit_session_completed', { score: 20, gapsFound: 5 });
    const payload = lastBeaconPayload(fetchMock);
    expect(payload).not.toBeNull();
    expect(payload!.name).toBe('audit_session_completed');
    expect(payload!.sessionId).toBeUndefined();
  });

  it('stamps the active audit session id onto events that carry no explicit sessionId', () => {
    setAuditSessionId('audit_abc123');
    trackAuditEvent('audit_handoff_copied', { gapCount: 5 });
    const payload = lastBeaconPayload(fetchMock);
    expect(payload!.sessionId).toBe('audit_abc123');
  });

  it('prefers an explicit per-event sessionId over the active session', () => {
    setAuditSessionId('audit_active');
    trackAuditEvent('audit_chat_message_sent', { messageCount: 1, sessionId: 'audit_explicit' });
    const payload = lastBeaconPayload(fetchMock);
    expect(payload!.sessionId).toBe('audit_explicit');
  });

  it('clears the session id when the audit resets', () => {
    setAuditSessionId('audit_abc123');
    setAuditSessionId(null);
    trackAuditEvent('audit_demo_viewed', { source: 'homepage' });
    const payload = lastBeaconPayload(fetchMock);
    expect(payload!.sessionId).toBeUndefined();
  });
});
