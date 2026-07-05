/**
 * Audit analytics — fires Clarity custom events in production, logs to console
 * in dev, and (in production) also beacons the event to /api/events so it lands
 * in our own Postgres, not just Clarity (which is client-side + sampled).
 */

// Single source of truth for the event names. Exported as a runtime array so the
// server-side /api/events route can allowlist against the exact same set. The
// AuditEvent union is derived from it, so adding an event here keeps both in sync.
export const AUDIT_EVENT_NAMES = [
  'audit_product_type_selected',
  'audit_step_completed',
  'audit_gap_found',
  'audit_resource_clicked',
  'audit_chat_message_sent',
  'audit_session_completed',
  'audit_email_report_sent',
  'audit_remaining_banner_shown',
  'audit_save_nudge_shown',
  'audit_demo_viewed',
  'audit_demo_start_real_clicked',
  'audit_empty_state_shown',
  'audit_empty_state_retry_clicked',
  'audit_intent_submitted',
  'audit_intent_suggestions_returned',
  'audit_intent_suggestions_failed',
  'audit_intent_pattern_clicked',
  'audit_sample_screenshot_clicked',
  'audit_handoff_copied',
  'audit_saved',
  'audit_save_removed',
  'audit_unlock_modal_shown',
  'audit_unlock_submitted',
  'audit_unlock_dismissed',
  'audit_final_cap_shown',
  // Newly instrumented CTAs (previously untracked)
  'audit_inspect_prompt_toggled',
  'audit_screenshot_locations_opened',
  'audit_new_audit_clicked',
  // Paid done-for-you audit service (the /services page + post-audit CTAs)
  'service_page_viewed',
  'service_intake_started',
  'service_intake_submitted',
  'service_cta_clicked',
  // Dashboard: saved-patterns kit + handoff file generation
  'dashboard_pattern_saved',
  'dashboard_pattern_removed',
  'dashboard_kit_cleared',
  'dashboard_handoff_generated',
  'handoff_file_downloaded',
] as const;

export type AuditEvent = (typeof AUDIT_EVENT_NAMES)[number];

declare global {
  interface Window {
    clarity?: (method: string, ...args: unknown[]) => void;
  }
}

// Fire-and-forget beacon to our own event log. Best-effort: never throws into a
// click handler. Mirrors the sendBeacon pattern in WebVitalsReporter.tsx. Only
// runs in production so dev/self-test clicks don't pollute the funnel data.
function beaconEvent(event: AuditEvent, properties?: Record<string, unknown>) {
  if (process.env.NODE_ENV !== 'production') return;
  try {
    let role: string | null = null;
    try {
      role = window.localStorage.getItem('aiux:role');
    } catch {
      /* private mode / blocked storage */
    }
    const sessionId =
      properties && typeof properties.sessionId === 'string' ? properties.sessionId : undefined;
    const payload = JSON.stringify({
      name: event,
      properties: properties ?? null,
      path: window.location.pathname,
      role,
      sessionId,
    });
    if (navigator.sendBeacon) {
      navigator.sendBeacon('/api/events', new Blob([payload], { type: 'application/json' }));
    } else {
      fetch('/api/events', { method: 'POST', body: payload, keepalive: true });
    }
  } catch {
    // Reporting is best-effort; never throw into the interaction path.
  }
}

export function trackAuditEvent(event: AuditEvent, properties?: Record<string, unknown>) {
  if (typeof window === 'undefined') return;

  if (process.env.NODE_ENV === 'development') {
    console.log(`[Audit Analytics] ${event}`, properties || '');
  }

  // Fire Clarity custom event
  if (window.clarity) {
    window.clarity('event', event);

    // Set custom tags for filterable dimensions
    if (properties) {
      Object.entries(properties).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          window.clarity!('set', key, String(value));
        }
      });
    }
  }

  // Also persist to our own DB so the funnel is queryable outside Clarity.
  beaconEvent(event, properties);
}
