/**
 * Spine dashboard smoke tests.
 *
 * Covers the two genuinely new behaviours: step-to-step conversion (the number
 * that surfaced an 85% reach→started drop the absolute counts hid) and the
 * guard all-clear/breached split (so a quiet guard reads differently from an
 * unused feature).
 */
import { render, screen, waitFor } from '@testing-library/react';
import AuditSamplesClient from '../samples-client';

const SPINE_LABELS = [
  'Opened the audit',
  'Uploaded a screenshot',
  'Got a real result',
  'Asked a follow-up',
  'Asked for a quote',
];

const STATS = {
  windowDays: 30,
  total: 26,
  byOutcome: { success: 21 },
  successRate: 0.8,
  emptyGapsRate: 0.04,
  errorRate: 0.04,
  avgScore: 7,
  avgMaxScore: 10,
  avgGapCount: 3,
  avgLatencyMs: 12000,
  excludedCount: 0,
  includeTest: false,
};

function funnelPayload(over: Partial<Record<string, unknown>> = {}) {
  return {
    windowDays: 30,
    spine: {
      reached: 264,
      started: 26,
      completedWithValue: 21,
      engaged: 6,
      revenue: 0,
      raw: {
        reachedOpens: 599,
        auditsRun: 26,
        auditsWithValue: 21,
        chatMessages: 9,
        serviceCtaClicked: 3,
      },
    },
    reachDetail: { startRealClicked: 39, productTypeSelected: 5, emptyStateShown: 4 },
    guards: {
      counts: {
        audit_intent_suggestions_failed: 0,
        audit_final_cap_shown: 0,
        audit_empty_state_retry_clicked: 0,
      },
      breached: [],
    },
    outcomes: { success: 21, empty_gaps: 1, no_ai_surface: 3, errors: 1 },
    postResult: { joinableSuccess: 21, successWithAnyAction: 6, actionRate: 6 / 21, byAction: {} },
    ...over,
  };
}

function mockFetch(funnel: unknown) {
  global.fetch = jest.fn((url: RequestInfo | URL) => {
    const u = String(url);
    const body = u.includes('audit-funnel')
      ? funnel
      : u.includes('admin/events')
        ? { events: [{ name: 'audit_demo_viewed', count: 264 }] }
        : { samples: [], stats: STATS };
    return Promise.resolve({ ok: true, json: () => Promise.resolve(body) });
  }) as unknown as typeof fetch;
}

describe('audit spine dashboard', () => {
  afterEach(() => jest.resetAllMocks());

  it('renders all five spine steps', async () => {
    mockFetch(funnelPayload());
    render(<AuditSamplesClient initialAuth />);
    await waitFor(() => expect(screen.getByText('Opened the audit')).toBeInTheDocument());
    for (const label of SPINE_LABELS) {
      expect(screen.getByText(label)).toBeInTheDocument();
    }
  });

  it('shows step-to-step conversion, not just absolute counts', async () => {
    mockFetch(funnelPayload());
    render(<AuditSamplesClient initialAuth />);
    await waitFor(() => expect(screen.getByText('Uploaded a screenshot')).toBeInTheDocument());
    // The conversion line is split across text nodes, so assert on the card's
    // combined textContent rather than a single-node regex match.
    const cardText = (label: string) => screen.getByText(label).parentElement!.textContent ?? '';
    // 26 of 264 people = 9.8%. The leak the absolute counts hid.
    expect(cardText('Uploaded a screenshot')).toContain('9.8% of those who opened the audit');
    // 21 of 26 = 80.8%.
    expect(cardText('Got a real result')).toContain('80.8% of those who uploaded a screenshot');
  });

  it('rates the last two steps against "got a real result", not the card to their left', async () => {
    mockFetch(funnelPayload());
    render(<AuditSamplesClient initialAuth />);
    await waitFor(() => expect(screen.getByText('Asked a follow-up')).toBeInTheDocument());
    const cardText = (label: string) => screen.getByText(label).parentElement!.textContent ?? '';
    // Neither branches off the other: you don't ask a follow-up before requesting
    // a quote. Both are a share of the 21 who got a real result.
    expect(cardText('Asked a follow-up')).toContain('28.6% of those who got a real result');
    expect(cardText('Asked for a quote')).toContain('0.0% of those who got a real result');
    // Specifically NOT chained off the preceding card.
    expect(cardText('Asked for a quote')).not.toContain('asked a follow-up');
  });

  it('renders no conversion line on the first step', async () => {
    mockFetch(funnelPayload());
    render(<AuditSamplesClient initialAuth />);
    await waitFor(() => expect(screen.getByText('Opened the audit')).toBeInTheDocument());
    // Scoped to the first card: "x% of …" is meaningless with no prior step.
    // (A document-wide query would match step 2's own "9.8% of reached" line.)
    // parentElement, not closest('div') — the label itself is a div, so closest
    // would return the label and trivially pass.
    const firstCard = screen.getByText('Opened the audit').parentElement;
    expect(firstCard).not.toBeNull();
    expect(firstCard!.textContent).toContain('264');
    expect(firstCard!.textContent).not.toMatch(/% of /);
  });

  it('shows a dash rather than NaN when the previous step is zero', async () => {
    mockFetch(
      funnelPayload({
        spine: {
          reached: 0,
          started: 0,
          completedWithValue: 0,
          engaged: 0,
          revenue: 0,
          raw: {
            reachedOpens: 0,
            auditsRun: 0,
            auditsWithValue: 0,
            chatMessages: 0,
            serviceCtaClicked: 0,
          },
        },
      })
    );
    render(<AuditSamplesClient initialAuth />);
    await waitFor(() => expect(screen.getByText('Opened the audit')).toBeInTheDocument());
    expect(screen.queryByText(/NaN/)).not.toBeInTheDocument();
    expect(screen.getAllByText(/— of those who/).length).toBeGreaterThan(0);
  });

  it('reports guards all-clear when every guard is zero', async () => {
    mockFetch(funnelPayload());
    render(<AuditSamplesClient initialAuth />);
    await waitFor(() => expect(screen.getByText(/Nothing broke/)).toBeInTheDocument());
  });

  it('names the breached guard when one fires', async () => {
    mockFetch(
      funnelPayload({
        guards: {
          counts: { audit_intent_suggestions_failed: 4, audit_final_cap_shown: 0 },
          breached: ['audit_intent_suggestions_failed'],
        },
      })
    );
    render(<AuditSamplesClient initialAuth />);
    await waitFor(() => expect(screen.getByText(/Something broke/)).toBeInTheDocument());
    expect(screen.getByText(/audit_intent_suggestions_failed: 4/)).toBeInTheDocument();
    expect(screen.queryByText(/Nothing broke/)).not.toBeInTheDocument();
  });

  it('keeps diagnostics collapsed by default', async () => {
    mockFetch(funnelPayload());
    const { container } = render(<AuditSamplesClient initialAuth />);
    await waitFor(() => expect(screen.getByText('Opened the audit')).toBeInTheDocument());
    const details = container.querySelector('details');
    expect(details).not.toBeNull();
    expect(details).not.toHaveAttribute('open');
  });
});
