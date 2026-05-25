/**
 * Audit analytics — fires Clarity custom events in production,
 * logs to console in dev.
 */

type AuditEvent =
  | 'audit_hero_cta_clicked'
  | 'audit_product_type_selected'
  | 'audit_step_completed'
  | 'audit_gap_found'
  | 'audit_resource_clicked'
  | 'audit_chat_message_sent'
  | 'audit_session_completed'
  | 'audit_email_report_sent'
  | 'audit_paywall_shown'
  | 'audit_paywall_dismissed'
  | 'audit_paywall_waitlist_signup'
  | 'audit_remaining_banner_shown'
  | 'audit_save_nudge_shown'
  | 'audit_demo_viewed'
  | 'audit_demo_start_real_clicked'
  | 'audit_empty_state_shown'
  | 'audit_empty_state_retry_clicked'
  | 'audit_intent_submitted'
  | 'audit_intent_suggestions_returned'
  | 'audit_intent_suggestions_failed'
  | 'audit_intent_pattern_clicked'
  | 'audit_sample_screenshot_clicked'
  | 'audit_handoff_copied'
  | 'audit_unlock_modal_shown'
  | 'audit_unlock_submitted'
  | 'audit_unlock_dismissed'
  | 'audit_final_cap_shown';

declare global {
  interface Window {
    clarity?: (method: string, ...args: unknown[]) => void;
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
}
