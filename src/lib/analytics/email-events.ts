import { createHash } from 'crypto';

// Resend delivery/click events, stored as UiEvent rows (name `email_<kind>`)
// so no new table is needed. Opens are deliberately not stored: open tracking
// is off for the newsletter, and Apple Mail fakes opens anyway.

export const EMAIL_EVENT_KINDS = ['delivered', 'clicked', 'bounced', 'complained'] as const;
export type EmailEventKind = (typeof EMAIL_EVENT_KINDS)[number];

export type EmailDevice = 'phone' | 'tablet' | 'desktop' | 'unknown';

/** Phone, tablet or desktop from a browser user agent. */
export function deviceFromUserAgent(ua: string | undefined | null): EmailDevice {
  if (!ua) return 'unknown';
  if (/iPad|Tablet|Android(?!.*Mobile)/i.test(ua)) return 'tablet';
  if (/iPhone|iPod|Android.*Mobile|Mobile Safari|Windows Phone|Mobile\b/i.test(ua)) return 'phone';
  return 'desktop';
}

export interface ResendEmailWebhook {
  type?: string;
  created_at?: string;
  data?: {
    broadcast_id?: string | null;
    email_id?: string;
    created_at?: string;
    to?: string[];
    subject?: string;
    click?: { link?: string; timestamp?: string; userAgent?: string };
  };
}

export interface EmailEventRow {
  name: `email_${EmailEventKind}`;
  sessionId: string | null; // the broadcast id, so a send's events group together
  properties: {
    recipient: string; // salted hash, never the address
    emailId: string | null;
    subject: string | null;
    link?: string;
    /** Seconds from the email being created to the click. Link scanners click within a few seconds. */
    secondsAfterSend?: number;
    /** From the click's user agent. Opens carry no device, and Gmail proxies images, so clicks are the only device signal. */
    device?: EmailDevice;
  };
}

export function hashRecipient(email: string): string {
  const salt = process.env.AUDIT_SAMPLE_IP_SALT || process.env.HANDBOOK_TOKEN_SECRET || 'aiux';
  return createHash('sha256').update(`${salt}:email:${email.trim().toLowerCase()}`).digest('hex').slice(0, 16);
}

/** Turn a verified webhook payload into the row to store, or null to ignore it. */
export function toEmailEventRow(event: ResendEmailWebhook): EmailEventRow | null {
  const kind = (event.type || '').replace(/^email\./, '') as EmailEventKind;
  if (!(EMAIL_EVENT_KINDS as readonly string[]).includes(kind)) return null;
  const data = event.data;
  const to = data?.to?.[0];
  if (!data || !to) return null;

  const row: EmailEventRow = {
    name: `email_${kind}`,
    sessionId: data.broadcast_id || null,
    properties: {
      recipient: hashRecipient(to),
      emailId: data.email_id || null,
      subject: data.subject ? data.subject.slice(0, 140) : null,
    },
  };

  if (kind === 'clicked') {
    const link = data.click?.link || '';
    // The unsubscribe link is not interest in the issue.
    if (!link || /unsubscribe/i.test(link)) return null;
    row.properties.link = link.slice(0, 300);
    row.properties.device = deviceFromUserAgent(data.click?.userAgent);
    const sent = Date.parse(data.created_at || '');
    const clicked = Date.parse(data.click?.timestamp || '');
    if (Number.isFinite(sent) && Number.isFinite(clicked)) {
      row.properties.secondsAfterSend = Math.max(0, Math.round((clicked - sent) / 1000));
    }
  }
  return row;
}
