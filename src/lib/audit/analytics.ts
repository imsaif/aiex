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
  | 'audit_email_report_sent';

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
