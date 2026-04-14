/**
 * Beehiiv API Integration
 *
 * Syncs subscribers to Beehiiv on signup. Beehiiv handles the welcome email
 * (via publication-level welcome emails + source-keyed Automations).
 *
 * Newsletter broadcast delivery: admin publishes a draft in /admin/newsletter,
 * then copies the HTML into a new Beehiiv post manually (Beehiiv Posts API is
 * Enterprise-only — not available on free/Launch tier).
 *
 * Transactional email (audit reports, admin watchdog alerts): see `src/lib/resend.ts`.
 */

interface BeehiivOptions {
  utmSource?: string;
  /**
   * Value for the `signup_source` custom field in Beehiiv. Used by Automation
   * branches to pick the right welcome email per signup surface (handbook,
   * audit-kit, news, direct, etc.).
   */
  signupSource?: string;
}

export async function addSubscriberToBeehiiv(email: string, options?: BeehiivOptions): Promise<void> {
  const apiKey = process.env.BEEHIIV_API_KEY;
  const pubId = process.env.BEEHIIV_PUBLICATION_ID;

  if (!apiKey || !pubId) {
    console.warn('Beehiiv not configured — skipping subscriber sync');
    return;
  }

  const customFields = options?.signupSource
    ? [{ name: 'signup_source', value: options.signupSource }]
    : undefined;

  try {
    const response = await fetch(
      `https://api.beehiiv.com/v2/publications/${pubId}/subscriptions`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          email,
          reactivate_existing: true,
          send_welcome_email: true,
          utm_source: options?.utmSource || 'website',
          ...(customFields && { custom_fields: customFields }),
        }),
      }
    );

    if (!response.ok) {
      const body = await response.text();
      console.error('Beehiiv API error:', { status: response.status, body });
    }
  } catch (error) {
    console.error('Failed to sync subscriber to Beehiiv:', error instanceof Error ? error.message : error);
  }
}
