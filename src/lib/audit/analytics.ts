/**
 * Audit analytics — fires Clarity custom events in production,
 * logs to console in dev.
 */

type AuditEvent =
  | 'audit_product_type_selected'
  | 'audit_step_completed'
  | 'audit_gap_found'
  | 'audit_resource_clicked'
  | 'audit_chat_message_sent'
  | 'audit_session_completed'
  | 'audit_email_report_sent'
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
  | 'audit_saved'
  | 'audit_save_removed'
  | 'audit_unlock_modal_shown'
  | 'audit_unlock_submitted'
  | 'audit_unlock_dismissed'
  | 'audit_final_cap_shown'
  // Paid done-for-you audit service (the /services page + post-audit CTAs)
  | 'service_page_viewed'
  | 'service_intake_started'
  | 'service_intake_submitted'
  | 'service_cta_clicked'
  // Dashboard: saved-patterns kit + handoff file generation
  | 'dashboard_pattern_saved'
  | 'dashboard_pattern_removed'
  | 'dashboard_kit_cleared'
  | 'dashboard_handoff_generated';

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
