/**
 * Beehiiv API Integration
 *
 * Used for syncing subscribers to Beehiiv for newsletter delivery.
 * Newsletters are sent via Beehiiv dashboard (free tier doesn't support Send API).
 * Transactional emails (welcome, audit reports, etc.) still use Resend.
 */

interface BeehiivOptions {
  utmSource?: string;
}

export async function addSubscriberToBeehiiv(email: string, options?: BeehiivOptions): Promise<void> {
  const apiKey = process.env.BEEHIIV_API_KEY;
  const pubId = process.env.BEEHIIV_PUBLICATION_ID;

  if (!apiKey || !pubId) {
    console.warn('Beehiiv not configured — skipping subscriber sync');
    return;
  }

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
          reactivate_existing: false,
          send_welcome_email: false, // We send our own via Resend
          utm_source: options?.utmSource || 'website',
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
