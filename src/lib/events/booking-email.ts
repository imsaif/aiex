import { formatEventDate, googleCalendarUrl, type EventItem } from '@/data/events';

/**
 * The "you are booked" email sent the moment Dodo reports a payment. It has to
 * stand on its own: someone who closed the tab before the redirect landed only
 * has this and Dodo's receipt, so it carries the date, the venue and the setup
 * steps that are also on /events/<slug>/booked.
 *
 * Brand values are hardcoded because email clients cannot read CSS variables and
 * most strip <style> blocks. They mirror globals.css, as in /api/skills/send.
 */
const NAVY = '#162036';
const BODY = '#20294C';
const PAGE = '#f9f9f9';
const CARD = '#ffffff';
const RULE = '#e5e7eb';
const FONT = "-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif";

const escape = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/**
 * `assetBase` is where images are served from. Live emails need the public site;
 * the local preview script passes a file path instead.
 */
export function bookingEmail(
  event: EventItem,
  customerName: string,
  assetBase = 'https://www.aiuxdesign.guide',
  /** Signed booking token; adds a "View your booking" link that works on any device. */
  bookingToken?: string
) {
  const { day, weekday, timeRange } = formatEventDate(event);
  const first = escape(customerName.trim().split(/\s+/)[0] || 'there');
  const site = 'https://www.aiuxdesign.guide';
  const bookedUrl = `${site}/events/${event.slug}/booked`;
  const viewUrl = bookingToken ? `${site}/events/${event.slug}?booking=${encodeURIComponent(bookingToken)}` : '';
  const where =
    event.format === 'online'
      ? `Online${event.platform ? `, on ${escape(event.platform)}` : ''}. The link comes once your setup check is done.`
      : `${escape(event.venue?.name ?? '')}, ${escape(event.venue?.area ?? '')}. I will send the exact address before the day.`;

  const steps = [
    `Install Claude Code. The install lesson is in the free course at <a href="${site}/guides/claude-code-learning-path" style="color:${NAVY};">aiuxdesign.guide</a>. On Windows, open a new PowerShell window after installing.`,
    'Run <code>claude</code> in a terminal and sign in with your paid Claude plan, or your own Anthropic API key.',
    `Ask Claude Code anything, then reply to this email with a screenshot of its answer.`,
  ];

  const subject = `Seat confirmed: ${event.title}, ${day}`;

  const html = `
<body style="margin:0;padding:0;background:${PAGE};">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${PAGE};padding:32px 16px;">
    <tr><td align="center">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:${CARD};border:1px solid ${RULE};border-radius:16px;font-family:${FONT};">
        ${
          event.emailBanner
            ? `<tr><td style="padding:0;"><img src="${assetBase}${event.emailBanner}" width="560" alt="" style="display:block;width:100%;height:auto;border:0;border-radius:16px 16px 0 0;" /></td></tr>`
            : ''
        }
        <tr><td style="padding:32px 32px 8px;">
          <h1 style="margin:0 0 12px;font-size:24px;line-height:1.25;color:${NAVY};">See you on ${escape(weekday)}, ${first}.</h1>
          <p style="margin:0 0 20px;font-size:15px;line-height:1.6;color:${BODY};">Your seat at <strong style="color:${NAVY};">${escape(event.title)}</strong> is confirmed.</p>
          <table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;font-size:15px;line-height:1.6;color:${BODY};">
            <tr><td style="padding:0 0 6px;width:64px;color:${NAVY};font-weight:700;">When</td><td style="padding:0 0 6px;">${escape(day)}, ${escape(timeRange)}</td></tr>
            <tr><td style="padding:0;width:64px;color:${NAVY};font-weight:700;vertical-align:top;">Where</td><td style="padding:0;">${where}</td></tr>
          </table>
          <p style="margin:20px 0 0;">
            <a href="${googleCalendarUrl(event)}" style="display:inline-block;padding:10px 18px;border-radius:10px;background:${NAVY};color:#ffffff;text-decoration:none;font-size:14px;font-weight:600;">Add to Google Calendar</a>
            ${
              viewUrl
                ? `<a href="${viewUrl}" style="display:inline-block;margin-left:8px;padding:9px 17px;border-radius:10px;border:1px solid ${RULE};color:${NAVY};text-decoration:none;font-size:14px;font-weight:600;">View your booking</a>`
                : ''
            }
          </p>
        </td></tr>
        <tr><td style="padding:24px 32px 0;"><div style="height:1px;background:${RULE};"></div></td></tr>
        <tr><td style="padding:24px 32px 8px;">
          <h2 style="margin:0 0 8px;font-size:17px;color:${NAVY};">One thing to do before the day</h2>
          <p style="margin:0 0 16px;font-size:15px;line-height:1.6;color:${BODY};">Get Claude Code running on your own account, so the session goes on building rather than setup.</p>
          <ol style="margin:0;padding-left:20px;font-size:15px;line-height:1.6;color:${BODY};">
            ${steps.map((s) => `<li style="margin:0 0 10px;">${s}</li>`).join('')}
          </ol>
        </td></tr>
        <tr><td style="padding:16px 32px 32px;">
          <p style="margin:0;font-size:14px;line-height:1.6;color:${BODY};">Stuck on setup? Reply with the error message and I will help you fix it before the session. These steps are also at <a href="${bookedUrl}" style="color:${NAVY};">your booking page</a>.</p>
          <p style="margin:16px 0 0;font-size:14px;color:${BODY};">${escape(event.host.name.split(' ')[0])}</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>`;

  const text = [
    `See you on ${weekday}, ${customerName.trim().split(/\s+/)[0] || 'there'}.`,
    `Your seat at ${event.title} is confirmed.`,
    '',
    `${event.title}`,
    `When: ${day}, ${timeRange}`,
    `Where: ${where.replace(/<[^>]+>/g, '')}`,
    `Add to calendar: ${googleCalendarUrl(event)}`,
    ...(viewUrl ? [`View your booking: ${viewUrl}`] : []),
    '',
    'Before the day, get Claude Code running on your own account:',
    '1. Install Claude Code (install lesson: https://www.aiuxdesign.guide/guides/claude-code-learning-path).',
    '2. Run `claude` in a terminal and sign in with your paid Claude plan or your own API key.',
    '3. Ask it anything and reply to this email with a screenshot of its answer.',
    '',
    `These steps are also at ${bookedUrl}`,
  ].join('\n');

  return { subject, html, text };
}

/** Short heads-up to the host for every booking, which doubles as a seat count. */
export function hostNotification(
  event: EventItem,
  customer: { name: string; email: string },
  paymentId: string,
  ref?: string,
  /** What was charged, e.g. '₹599.00'. Falls back to the event's listed price. */
  amountLabel?: string
) {
  return {
    subject: `New booking: ${customer.name} for ${event.title}${ref ? ` (via ${ref})` : ''}`,
    text: [
      `${customer.name} <${customer.email}> booked ${event.title}.`,
      `Paid: ${amountLabel || event.priceLabel}`,
      `Payment: ${paymentId}`,
      `Came from: ${ref || 'direct or untagged link'}`,
      `Confirmation email sent. Watch for their setup screenshot.`,
    ].join('\n'),
  };
}
