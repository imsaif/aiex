/**
 * Welcome email for new newsletter subscribers, sent through Resend at signup.
 *
 * Why this exists (Oct 2026): welcome emails used to be beehiiv Automations. After
 * the beehiiv downgrade they stopped (a test signup on 2026-10-12 got nothing,
 * and beehiiv's automation list held only an unfinished draft). The site now
 * sends it itself, from every signup path: the newsletter form, course PDF
 * downloads and audit reports.
 *
 * It wears the daily's design (navy band, white cards, light panel, navy CTA,
 * same phone and dark-mode rules) so the first email looks like every one after.
 *
 * Sent only when someone becomes an active subscriber (new or rejoining), never
 * on a repeat signup. Failures are logged and swallowed: a missing welcome must
 * never fail the signup.
 */

import { prisma } from '@/lib/prisma';
import { getResend } from '@/lib/resend';
import { NEWSLETTER_FROM } from './resend-send';
import { emailStyleBlock } from './daily-email';
import { bandImageUrl } from './band-icons';
import { PATTERN_COUNT } from '@/data/pattern-count';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.aiuxdesign.guide';
// Same palette as daily-email.ts.
const FONT = `-apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif`;
const MONO = `ui-monospace, SFMono-Regular, Menlo, Consolas, monospace`;
const NAVY = '#162036';
const TINT = '#EEF0F6';
const SLATE = '#475569';
const PILL = '#d5d9e3';
const IDEA_PANEL = '#DCE1EC';
const ON_NAVY = '#cbd5e1';
const ON_NAVY_MUTED = '#94a3b8';

export const WELCOME_SUBJECT = 'Welcome to AI UX Daily';
// The band icon: an envelope, from the topic set.
const WELCOME_ICON = 'topic-email';

function escapeHtml(text: string): string {
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

export interface WelcomeEmailInput {
  siteUrl: string;
  unsubscribeUrl: string;
  postalAddress: string;
  /** The latest published issue, linked from the CTA. */
  latestIssue: { title: string; url: string } | null;
  patternCount: number;
}

// One "what you'll get" card, built like a story card: a small label, a title,
// one line of copy.
function card(label: string, title: string, body: string): string {
  return `
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin: 0 0 16px;"><tr><td class="aiux-card" bgcolor="#ffffff" style="background-color: #ffffff; border-radius: 14px; padding: 26px 22px 24px;">
  <p class="aiux-sub" style="margin: 0 0 10px; font-family: ${FONT}; font-size: 11px; font-weight: 700; letter-spacing: 1.4px; color: ${SLATE};">${label}</p>
  <h3 class="aiux-ink" style="margin: 0 0 8px; font-family: ${FONT}; font-size: 19px; font-weight: 700; line-height: 1.3; letter-spacing: -0.2px; color: ${NAVY};">${title}</h3>
  <p class="aiux-ink" style="margin: 0; font-family: ${FONT}; font-size: 15px; line-height: 1.6; color: ${NAVY};">${body}</p>
</td></tr></table>`.trim();
}

export function renderWelcomeEmail({ siteUrl, unsubscribeUrl, postalAddress, latestIssue, patternCount }: WelcomeEmailInput): string {
  const grid = `${siteUrl}/images/newsletter/cta-grid.png`;
  const cta = latestIssue
    ? `
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin: 8px 0 0;"><tr><td class="aiux-cta" bgcolor="${NAVY}" background="${grid}" style="background-color: ${NAVY}; background-image: url('${grid}'); background-repeat: no-repeat; background-position: right top; background-size: 300px 200px; border-radius: 14px; padding: 26px 190px 24px 26px;">
  <p style="margin: 0 0 4px; font-family: ${FONT}; font-size: 17px; font-weight: 700; color: #ffffff;">Start with the latest issue</p>
  <p style="margin: 0 0 16px; font-family: ${FONT}; font-size: 14px; line-height: 1.55; color: ${ON_NAVY};">${escapeHtml(latestIssue.title.replace(/^\s*(AI UX Daily|This Week in AIUX)\s*[:\-–]\s*/i, ''))}</p>
  <a href="${latestIssue.url}" target="_blank" rel="noopener" style="display: inline-block; background-color: #ffffff; color: ${NAVY} !important; text-decoration: none !important; padding: 12px 22px; border-radius: 999px; font-family: ${FONT}; font-size: 14px; font-weight: 700;"><span style="color: ${NAVY} !important; text-decoration: none !important;">Read it now →</span></a>
</td></tr></table>`.trim()
    : '';

  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8" /><meta name="viewport" content="width=device-width, initial-scale=1" /><meta name="color-scheme" content="light dark" /><meta name="supported-color-schemes" content="light dark" />
${emailStyleBlock(siteUrl)}
</head>
<body style="margin: 0; padding: 16px 0; background-color: #ffffff;">
<div style="display: none; max-height: 0; overflow: hidden;">What lands in your inbox, and when.</div>
<div style="font-family: ${FONT}; color: ${NAVY}; max-width: 680px; margin: 0 auto;">
<table class="aiux-tint" role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="${TINT}" style="background-color: ${TINT}; border-radius: 16px;">
<tr><td bgcolor="${NAVY}" style="background-color: ${NAVY}; padding: 24px 24px 26px; border-radius: 16px 16px 0 0;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr>
    <td style="padding: 0 0 14px; border-bottom: 1px solid #2c3650; font-family: ${FONT}; font-size: 14px; font-weight: 700; letter-spacing: -0.2px; color: #ffffff;"><img src="${siteUrl}/images/email/aiux-mark.png" alt="aiux" width="26" height="26" style="display: inline-block; width: 26px; height: 26px; border: 0; vertical-align: middle; margin-right: 8px;" />aiux <span style="font-weight: 400; color: ${ON_NAVY};">daily</span></td>
    <td align="right" style="padding: 0 0 14px; border-bottom: 1px solid #2c3650; font-family: ${MONO}; font-size: 11px; letter-spacing: 1px; color: ${ON_NAVY_MUTED};">WELCOME</td>
  </tr></table>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin: 22px 0 0;"><tr>
    <td valign="middle" style="padding: 0 16px 0 0;">
      <h2 class="aiux-idea" style="margin: 0; font-family: ${FONT}; font-size: 30px; font-weight: 800; line-height: 1.12; letter-spacing: -0.8px; color: #ffffff;">You're in. Here's what lands in your inbox.</h2>
    </td>
    <td class="aiux-band-art-cell" valign="middle" width="150" align="right" style="width: 150px;">
      <img class="aiux-band-art" src="${bandImageUrl(siteUrl, WELCOME_ICON)}" alt="Email icon" width="150" height="150" style="display: block; width: 150px; height: auto; border: 0;" />
    </td>
  </tr></table>
</td></tr>
<tr><td style="padding: 20px 6px 24px;">
  <p class="aiux-sub" style="margin: 0 0 12px 8px; font-family: ${FONT}; font-size: 11px; font-weight: 700; letter-spacing: 2px; color: ${SLATE};">WHAT YOU'LL GET</p>
  ${card('EVERY DAY', 'AI UX Daily', 'The AI product news that matters to designers, each story with one takeaway you can act on.')}
  ${card('MONDAYS', 'This Week in AIUX', "The week's stories worth keeping, and one idea that ties them together.")}
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin: 0 0 16px;"><tr><td class="aiux-idea-panel" bgcolor="${IDEA_PANEL}" style="background-color: ${IDEA_PANEL}; border-radius: 14px; padding: 28px 22px 26px;">
    <p class="aiux-sub" style="margin: 0 0 10px; font-family: ${FONT}; font-size: 11px; font-weight: 700; letter-spacing: 2px; color: ${SLATE};">WHERE IT LEADS</p>
    <p class="aiux-ink" style="margin: 0 0 10px; font-family: ${FONT}; font-size: 22px; font-weight: 800; line-height: 1.22; letter-spacing: -0.4px; color: ${NAVY};">Every story links to a design pattern</p>
    <p class="aiux-ink" style="margin: 0; font-family: ${FONT}; font-size: 15px; line-height: 1.6; color: ${NAVY};">So you can go from the news to something you can use in your own product. There are ${patternCount} patterns in the library so far.</p>
    <p style="margin: 16px 0 0;"><a href="${siteUrl}/patterns" target="_blank" rel="noopener" class="aiux-pill aiux-ink" style="display: inline-block; padding: 7px 12px; border: 1px solid ${PILL}; border-radius: 999px; background-color: #ffffff; font-family: ${FONT}; font-size: 12px; font-weight: 600; color: ${NAVY} !important; text-decoration: none !important;"><span style="color: ${NAVY} !important;">Browse the ${patternCount} patterns&nbsp;→</span></a></p>
  </td></tr></table>
  ${cta}
  <p class="aiux-ink" style="margin: 24px 8px 0; font-family: ${FONT}; font-size: 15px; line-height: 1.6; color: ${NAVY};">Reply to this email any time. It comes straight to me.<br /><strong>Imran Mohammed</strong>, aiuxdesign.guide</p>
</td></tr>
</table>
<p style="margin: 0; padding: 24px 24px 32px; text-align: center; font-family: ${FONT}; font-size: 12px; line-height: 1.6; color: ${SLATE};">
  <a href="${unsubscribeUrl}" style="color: ${SLATE} !important; text-decoration: underline;">Unsubscribe</a><br />
  ${escapeHtml(postalAddress)}
</p>
</div>
</body></html>`;
}

/**
 * Sends the welcome email to a subscriber who just became active. Never throws.
 * Awaited by callers: fire-and-forget gets cut off when Vercel suspends the
 * function after the response.
 */
export async function sendWelcomeEmail(email: string): Promise<void> {
  try {
    const subscriber = await prisma.subscriber.findUnique({ where: { email }, select: { active: true, unsubscribeToken: true } });
    if (!subscriber?.active) return;

    const latest = await prisma.newsletterDraft.findFirst({
      where: { status: 'published', content: { not: '' } },
      orderBy: { publishDate: 'desc' },
      select: { title: true, slug: true },
    });
    const unsubscribeUrl = `${SITE_URL}/unsubscribe?token=${subscriber.unsubscribeToken}`;

    const html = renderWelcomeEmail({
      siteUrl: SITE_URL,
      unsubscribeUrl,
      postalAddress: process.env.NEWSLETTER_POSTAL_ADDRESS?.trim() || 'aiuxdesign.guide',
      latestIssue: latest ? { title: latest.title, url: `${SITE_URL}/news/${latest.slug}?utm_source=newsletter&utm_medium=email&utm_campaign=welcome` } : null,
      patternCount: PATTERN_COUNT,
    });

    const { error } = await getResend().emails.send({
      from: NEWSLETTER_FROM,
      to: email,
      replyTo: 'imran@aiuxdesign.guide',
      subject: WELCOME_SUBJECT,
      html,
      headers: { 'List-Unsubscribe': `<${unsubscribeUrl}>` },
    });
    if (error) console.error('[welcome-email] Resend rejected the send:', error.message);
  } catch (err) {
    console.error('[welcome-email] failed:', err);
  }
}
