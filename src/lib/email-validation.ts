/**
 * Email security validation for bot protection
 * - Disposable email domain blocking
 * - Honeypot field detection
 */

// ~50 most common disposable/throwaway email domains
// Does NOT include privacy relays (duck.com, simplelogin.co, etc.)
const DISPOSABLE_EMAIL_DOMAINS = new Set([
  'example.com',
  'test.com',
  'mailinator.com',
  'guerrillamail.com',
  'guerrillamail.de',
  'grr.la',
  'guerrillamail.net',
  'temp-mail.org',
  'tempmail.com',
  'yopmail.com',
  'yopmail.fr',
  '10minutemail.com',
  '10minute.email',
  'throwaway.email',
  'throwaway.com',
  'trashmail.com',
  'trashmail.me',
  'trashmail.net',
  'dispostable.com',
  'mailnesia.com',
  'maildrop.cc',
  'fakeinbox.com',
  'sharklasers.com',
  'guerrillamailblock.com',
  'tempail.com',
  'tempr.email',
  'temp-mail.io',
  'mohmal.com',
  'burnermail.io',
  'mailtemp.net',
  'emailondeck.com',
  'getnada.com',
  'mintemail.com',
  'tempinbox.com',
  'mytemp.email',
  'harakirimail.com',
  'jetable.org',
  'spamgourmet.com',
  'mailcatch.com',
  'discard.email',
  'disposableemailaddresses.emailmiser.com',
  'mailexpire.com',
  'tempmailo.com',
  'tempmailaddress.com',
  'crazymailing.com',
  'trash-mail.com',
  'wegwerfmail.de',
  'wegwerfmail.net',
  'binkmail.com',
  'safetymail.info',
  'filzmail.com',
]);

export function isDisposableEmail(email: string): boolean {
  const domain = email.split('@')[1]?.toLowerCase();
  if (!domain) return false;
  return DISPOSABLE_EMAIL_DOMAINS.has(domain);
}

export const HONEYPOT_FIELD_NAME = 'website_url';

export function isHoneypotTriggered(body: Record<string, unknown>): boolean {
  const value = body[HONEYPOT_FIELD_NAME];
  return typeof value === 'string' && value.length > 0;
}

/**
 * Single entry point for email security validation.
 * Returns an error message string if validation fails, or null if OK.
 */
export function validateEmailSecurity(
  email: string,
  body: Record<string, unknown>
): string | null {
  if (isHoneypotTriggered(body)) {
    return 'Invalid request';
  }

  if (isDisposableEmail(email)) {
    return 'Please use a permanent email address';
  }

  return null;
}
