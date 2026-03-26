/**
 * Lightweight audit analytics — logs to console in dev,
 * can be wired to any analytics service later.
 */

type AuditEvent =
  | 'audit_product_type_selected'
  | 'audit_step_completed'
  | 'audit_gap_found'
  | 'audit_resource_clicked'
  | 'audit_chat_message_sent'
  | 'audit_session_completed';

export function trackAuditEvent(event: AuditEvent, properties?: Record<string, unknown>) {
  if (process.env.NODE_ENV === 'development') {
    console.log(`[Audit Analytics] ${event}`, properties || '');
  }

  // Wire to Clarity, PostHog, or any analytics service here
  // Example: window.clarity?.('event', event, properties);
}
