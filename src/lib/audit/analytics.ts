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
  // How the product type came to be set, and the closest thing the log has to
  // "someone actually uploaded a screenshot" — auto-classification only runs
  // after an upload. `source` separates manual picks from auto-detection and
  // sample loads; without it the manual case double-counts against
  // audit_product_type_selected above, which only the picker button fires.
  'audit_product_type_detected',
  // NOTE: `audit_step_completed` (retired 2026-08-31) and `audit_demo_pin_clicked`
  // (added and removed the same day) are both gone. The first conflated demo-pin
  // clicks with product-type changes behind an unread `step` property and caused a
  // false "audits doubled" reading. Splitting it out revealed the honest number —
  // 18 people clicked a demo pin in 30 days — which is not worth carrying, so the
  // pin tracking went too. Historical rows for both names remain queryable.
  'audit_gap_found',
  'audit_resource_clicked',
  'audit_chat_message_sent',
  'audit_session_completed',
  'audit_email_report_sent',
  'audit_remaining_banner_shown',
  'audit_save_nudge_shown',
  'audit_demo_viewed',
  // The homepage's one primary CTA — the "Get your skills" button. Renamed from
  // `audit_demo_start_real_clicked` on 2026-08-31, a name inherited from a
  // button that said "start a real audit" and has not existed for months.
  // Pre-rename history (74 rows all-time) lives under the OLD name; the admin
  // funnel sums both, so the series is continuous across the rename.
  //
  // With `audit_demo_pin_clicked` removed, the homepage now emits exactly two
  // events: `audit_demo_viewed` (the denominator) and this (the numerator).
  // Everything else there ran at 1-6 events a month and measured nothing.
  'audit_get_skills_clicked',
  // Arrival on the upload screen, from any entry point. Since `/audit` shipped,
  // this — not audit_demo_viewed — is "reached the tool": a pattern reader can
  // now land on upload without ever seeing the homepage, so counting homepage
  // views as the funnel entry would miss them entirely (and let later steps
  // exceed 100% of it).
  'audit_upload_viewed',
  // The "Audit My Design" card on pattern pages. Untracked until now, which is
  // why "do pattern readers ignore the CTA, or click it and bounce?" was
  // unanswerable. Carries the pattern slug so we learn which patterns convert.
  'pattern_audit_cta_clicked',
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
  // RETIRED 2026-08-11: the pattern card became a save card, so nothing copies an
  // install command any more. Kept in the allowlist so historical queries by this
  // name keep resolving. Do not fire it from new code.
  'skill_install_command_copied',
  // One SKILL.md hit disk. Fired from more than one surface, so it carries a
  // `source` property ('dashboard' at checkout) rather than being split into a
  // second event name, which would fragment the metric.
  'skill_file_downloaded',
  // The sticky pack bar on pattern routes, clicked through to checkout. This is
  // the event that tests whether the browse-save-checkout model actually works.
  'saved_items_bar_clicked',
  // Dashboard: zipped pack of one skill per saved pattern, plus the audit fixes file.
  'skill_pack_downloaded',
  // Audit results: "save all" on the matching skills, rather than card-by-card.
  // Per-skill saves already fire dashboard_pattern_saved from the kit hook.
  'audit_skills_saved_all',
  // Audit results: left for the dashboard, which is where a pack is downloaded.
  // The step that tells us whether the save-then-download handoff actually holds.
  'audit_dashboard_cta_clicked',
  // Audit results: clicked through to a guide matched to the audited surface.
  // Replaced the services upsell that used to hold this slot, so this is the
  // measurement of whether guide recommendations do better than that did.
  'audit_guide_clicked',
] as const;

export type AuditEvent = (typeof AUDIT_EVENT_NAMES)[number];

declare global {
  interface Window {
    clarity?: (method: string, ...args: unknown[]) => void;
  }
}

// The current audit's session id (= the analysis `results.id`). Set once when a
// real analysis produces results so EVERY subsequent event — CTA clicks, chat,
// per-gap links — is stamped with the same id without each call site threading
// it through `properties`. Cleared when a new audit starts. This fixes the
// funnel bug where `UiEvent.sessionId` was always null (no results-page event
// passed `properties.sessionId`), which made "distinct sessions reaching
// results" and "audits with >=1 chat message" uncomputable.
let currentAuditSessionId: string | null = null;

export function setAuditSessionId(id: string | null) {
  currentAuditSessionId = id;
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
    // Prefer an explicit per-event sessionId; otherwise fall back to the active
    // audit session so results-page events aren't stored with a null sessionId.
    const explicitSessionId =
      properties && typeof properties.sessionId === 'string' ? properties.sessionId : null;
    const sessionId = explicitSessionId ?? currentAuditSessionId ?? undefined;
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
