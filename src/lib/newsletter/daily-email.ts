/**
 * Daily email layout (Oct 2026 redesign, "version 2" on the redesign canvas).
 *
 * Navy band: aiux mark + date, Today's Idea as the headline, and one pattern
 * icon on a grid-and-rings image beside it. Then story cards (source, headline,
 * one-line takeaway, a quiet Source link and a pattern pill), and a navy audit CTA.
 *
 * Lives outside the cron route so the preview script and tests can render it:
 * a Next route file can only export its HTTP handlers. The route resolves the
 * pieces that need its own data (publisher badge, digest provenance, product
 * icon, stripped URL, poll HTML) and passes plain strings in.
 *
 * Email constraints that shape the markup:
 * - Tables + inline styles. Gmail drops web fonts, so type is the system stack
 *   and the idea headline is live text (images-off readers still get it).
 * - Images are static hosted PNGs: the band icon (band.ts) and the aiux mark.
 * - The <style> block only ADDS things: phone sizing and dark mode for clients
 *   that honour prefers-color-scheme (Apple Mail, iOS Mail, Outlook for Mac).
 *   Everything still renders correctly if a client or beehiiv strips it; the
 *   Gmail apps ignore it and apply their own dark recolouring.
 * - beehiiv rewrites <a> colours in its email render pass (see the Aug 2026 row
 *   in .claude/rules/newsletter-and-infra.md), so every link repeats its colour
 *   with !important on the anchor AND a nested span.
 */

import { bandImageUrl } from './band';

const FONT = `-apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif`;
const MONO = `ui-monospace, SFMono-Regular, Menlo, Consolas, monospace`;
// Brand palette (mirrors tokens in src/app/globals.css :root)
const NAVY = '#162036';      // --accent-primary / band + CTA surface
const TINT = '#EEF0F6';      // pale navy page behind the cards
const SLATE = '#475569';     // secondary text on white (AA on white and on TINT)
const HAIR = '#eef0f4';
const PILL = '#d5d9e3';
const ON_NAVY = '#cbd5e1';   // body text on navy (AA)
const ON_NAVY_MUTED = '#94a3b8';

// Dark-mode overrides, keyed by class. Light values above stay inline so the
// email is complete without this block.
const STYLE_BLOCK = `<style>
@media only screen and (max-width: 480px) {
  .aiux-idea { font-size: 23px !important; }
  .aiux-band-art { width: 88px !important; }
}
@media (prefers-color-scheme: dark) {
  .aiux-tint { background-color: #141821 !important; }
  .aiux-card { background-color: #1c2130 !important; }
  .aiux-ink, .aiux-ink span { color: #f1f5f9 !important; }
  .aiux-sub, .aiux-sub span { color: #a7b0c0 !important; }
  .aiux-rule { border-color: #2a3142 !important; }
  .aiux-pill { border-color: #3a4357 !important; }
  .aiux-mono { background-color: #2c3650 !important; }
}
</style>`;

export interface DailyEmailStory {
  /** Publisher for voice items, product for news. Plain text. */
  badgeLabel: string;
  /** Pre-built <img> for a known product logo, or '' to show a monogram. */
  badgeIconHtml: string;
  /** Date, or "via TLDR Design" for digest-scraped items. */
  metaLabel: string;
  headline: string;
  takeaway: string;
  /** Already stripped of feed utm_* params. */
  sourceUrl: string;
  /** Only set when the slug is a real pattern. */
  pattern?: { slug: string; title: string };
}

export interface DailyEmailInput {
  siteUrl: string;
  /** e.g. "WED 07.10.26" */
  dateLabel: string;
  idea: { title: string; body: string };
  bandSlug: string;
  bandAlt: string;
  stories: DailyEmailStory[];
  /** null hides the CTA (NEWSLETTER_ANNOUNCEMENT=off). */
  cta: { href: string; patternCount: number } | null;
  /** Rendered poll block, passed through untouched. */
  pollHtml: string;
}

export function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export function formatBandDate(date: Date): string {
  const day = date.toLocaleDateString('en-US', { weekday: 'short', timeZone: 'UTC' }).toUpperCase();
  const dd = String(date.getUTCDate()).padStart(2, '0');
  const mm = String(date.getUTCMonth() + 1).padStart(2, '0');
  const yy = String(date.getUTCFullYear()).slice(-2);
  return `${day} ${dd}.${mm}.${yy}`;
}

/** First letter or digit of a source name, for sources with no known logo. */
export function monogram(label: string): string {
  const match = label.match(/[A-Za-z0-9]/);
  return match ? match[0].toUpperCase() : '•';
}

function link(href: string, label: string, color: string, extraStyle = '', className = ''): string {
  const cls = className ? ` class="${className}"` : '';
  return `<a href="${href}" target="_blank" rel="noopener"${cls} style="color: ${color} !important; text-decoration: none !important; font-style: normal !important;${extraStyle}"><span style="color: ${color} !important;">${label}</span></a>`;
}

function renderBand(input: DailyEmailInput): string {
  const count = input.stories.length;
  const storyLabel = `${count} ${count === 1 ? 'STORY' : 'STORIES'}`;
  const mark = `${input.siteUrl}/images/email/aiux-mark.png`;
  // Headline and icon sit side by side at every width (picked on the canvas over
  // stacking); the phone media query only shrinks both.
  return `
<tr><td bgcolor="${NAVY}" style="background-color: ${NAVY}; padding: 24px 24px 28px; border-radius: 16px 16px 0 0;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr>
    <td style="padding: 0 0 14px; border-bottom: 1px solid #2c3650; font-family: ${FONT}; font-size: 14px; font-weight: 700; letter-spacing: -0.2px; color: #ffffff;"><img src="${mark}" alt="aiux" width="26" height="26" style="width: 26px; height: 26px; border: 0; vertical-align: middle; margin-right: 8px;" />aiux <span style="font-weight: 400; color: ${ON_NAVY};">daily</span></td>
    <td align="right" style="padding: 0 0 14px; border-bottom: 1px solid #2c3650; font-family: ${MONO}; font-size: 11px; letter-spacing: 1px; color: ${ON_NAVY_MUTED};">${input.dateLabel} · ${storyLabel}</td>
  </tr></table>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin: 22px 0 0;"><tr>
    <td valign="middle" style="padding: 0 16px 0 0;">
      <p style="margin: 0 0 12px; font-family: ${FONT}; font-size: 11px; font-weight: 700; letter-spacing: 2px; color: ${ON_NAVY};">TODAY'S IDEA</p>
      <h2 class="aiux-idea" style="margin: 0; font-family: ${FONT}; font-size: 30px; font-weight: 800; line-height: 1.1; letter-spacing: -0.8px; color: #ffffff;">${escapeHtml(input.idea.title)}</h2>
    </td>
    <td valign="middle" width="150" align="right" style="width: 150px;">
      <img class="aiux-band-art" src="${bandImageUrl(input.siteUrl, input.bandSlug)}" alt="${escapeHtml(input.bandAlt)}" width="150" height="150" style="display: block; width: 150px; height: auto; border: 0;" />
    </td>
  </tr></table>
  <p style="margin: 18px 0 0; font-family: ${FONT}; font-size: 15px; line-height: 1.6; color: ${ON_NAVY};">${escapeHtml(input.idea.body)}</p>
</td></tr>`.trim();
}

function renderStory(story: DailyEmailStory, siteUrl: string): string {
  const logo = story.badgeIconHtml
    || `<span class="aiux-mono" style="display: inline-block; width: 16px; height: 16px; line-height: 16px; border-radius: 4px; background-color: ${NAVY}; color: #ffffff; font-size: 9px; font-weight: 800; text-align: center; letter-spacing: 0; vertical-align: -3px; margin-right: 6px;">${escapeHtml(monogram(story.badgeLabel))}</span>`;
  const pattern = story.pattern
    ? `<td align="right" class="aiux-rule" style="padding: 16px 0 0; border-top: 1px solid ${HAIR};"><a href="${siteUrl}/patterns/${story.pattern.slug}" target="_blank" rel="noopener" class="aiux-pill aiux-ink" style="display: inline-block; padding: 7px 12px; border: 1px solid ${PILL}; border-radius: 999px; font-family: ${FONT}; font-size: 12px; font-weight: 600; color: ${NAVY} !important; text-decoration: none !important; font-style: normal !important;"><span class="aiux-sub" style="font-size: 10px; font-weight: 700; letter-spacing: 1px; color: ${SLATE} !important; margin-right: 6px;">PATTERN</span><span style="color: ${NAVY} !important;">${escapeHtml(story.pattern.title)} →</span></a></td>`
    : '';
  return `
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin: 0 0 16px;"><tr><td class="aiux-card" bgcolor="#ffffff" style="background-color: #ffffff; border-radius: 14px; padding: 26px 26px 22px;">
  <p class="aiux-ink" style="margin: 0 0 14px; font-family: ${FONT}; font-size: 11px; font-weight: 700; letter-spacing: 0.8px; text-transform: uppercase; color: ${NAVY};">${logo}${escapeHtml(story.badgeLabel)} <span class="aiux-sub" style="font-weight: 400; color: ${SLATE}; text-transform: none; letter-spacing: 0;">· ${escapeHtml(story.metaLabel)}</span></p>
  <h3 class="aiux-ink" style="margin: 0 0 12px; font-family: ${FONT}; font-size: 19px; font-weight: 700; line-height: 1.32; letter-spacing: -0.2px; color: ${NAVY};">${escapeHtml(story.headline)}</h3>
  <p class="aiux-sub" style="margin: 0; font-family: ${FONT}; font-size: 15px; line-height: 1.6; color: ${SLATE};">${escapeHtml(story.takeaway)}</p>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin: 20px 0 0;"><tr>
    <td class="aiux-rule" style="padding: 16px 0 0; border-top: 1px solid ${HAIR}; font-family: ${FONT}; font-size: 13px; font-weight: 500;">${link(story.sourceUrl, 'Source →', SLATE, '', 'aiux-sub')}</td>
    ${pattern}
  </tr></table>
</td></tr></table>`.trim();
}

function renderCta(cta: NonNullable<DailyEmailInput['cta']>): string {
  return `
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin: 24px 0 0;"><tr><td bgcolor="${NAVY}" style="background-color: ${NAVY}; border: 1px solid #2c3650; border-radius: 14px; padding: 26px 26px 24px;">
  <p style="margin: 0 0 4px; font-family: ${FONT}; font-size: 17px; font-weight: 700; color: #ffffff;">Turn your design into Claude skills</p>
  <p style="margin: 0 0 16px; font-family: ${FONT}; font-size: 14px; line-height: 1.55; color: ${ON_NAVY};">Drop a screenshot, see which of the ${cta.patternCount} patterns you are missing. Free, no signup for the first audit.</p>
  <a href="${cta.href}" target="_blank" rel="noopener" style="display: inline-block; background-color: #ffffff; color: ${NAVY} !important; text-decoration: none !important; padding: 12px 22px; border-radius: 999px; font-family: ${FONT}; font-size: 14px; font-weight: 700;"><span style="color: ${NAVY} !important; text-decoration: none !important;">Try the free audit →</span></a>
</td></tr></table>`.trim();
}

export function renderDailyEmail(input: DailyEmailInput): string {
  const stories = input.stories.map((s) => renderStory(s, input.siteUrl));
  return `
${STYLE_BLOCK}
<div style="font-family: ${FONT}; color: ${NAVY}; max-width: 640px; margin: 0 auto;">
<table class="aiux-tint" role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="${TINT}" style="background-color: ${TINT}; border-radius: 16px;">
${renderBand(input)}
<tr><td style="padding: 24px 14px 28px;">
  <p class="aiux-sub" style="margin: 0 0 12px 6px; font-family: ${FONT}; font-size: 11px; font-weight: 700; letter-spacing: 2px; color: ${SLATE};">TODAY'S STORIES</p>
  ${stories.join('\n  ')}
  ${input.cta ? renderCta(input.cta) : ''}
</td></tr>
</table>
${input.pollHtml}
</div>`.trim();
}
