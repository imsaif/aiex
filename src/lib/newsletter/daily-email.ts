/**
 * Daily email layout: navy band carrying Today's Idea, then short story cards.
 *
 * Designed on the "AI UX Daily redesign options" canvas (D2, idea in the band).
 * Lives outside the cron route so the preview script and tests can render it:
 * a Next route file can only export its HTTP handlers.
 *
 * The route resolves everything that needs its own data (publisher badge,
 * digest provenance, product icon, stripped source URL, poll HTML) and passes
 * plain strings in. This module only lays them out.
 *
 * Email constraints that shape the markup:
 * - Tables + inline styles only; Gmail drops most <style> and all web fonts, so
 *   type is the system stack and the band headline is live text (images-off
 *   readers still get it), not a rendered image.
 * - The band drawing is a static PNG on the navy cell (see band.ts).
 * - The band is the issue's one dark block; the audit CTA stays outlined.
 * - beehiiv rewrites <a> colours in its email render pass (see the Aug 2026 row in
 *   .claude/rules/newsletter-and-infra.md), so every link repeats its colour with
 *   !important on the anchor AND a nested span.
 */

import { bandImageUrl } from './band';

const FONT = `-apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif`;
const MONO = `ui-monospace, SFMono-Regular, Menlo, Consolas, monospace`;
// Brand palette (mirrors tokens in src/app/globals.css :root)
const NAVY = '#162036';      // --accent-primary / band surface
const TINT = '#EEF0F6';      // pale navy page behind the cards
const SLATE = '#475569';     // secondary text on white (AA on white and on TINT)
const ON_NAVY = '#cbd5e1';   // body text on navy (AA)
const ON_NAVY_MUTED = '#94a3b8';

export interface DailyEmailStory {
  /** Publisher for voice items, product for news. Plain text. */
  badgeLabel: string;
  /** Pre-built <img> for the product icon, or '' for publisher badges. */
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

function renderBand(input: DailyEmailInput): string {
  const count = input.stories.length;
  const storyLabel = `${count} ${count === 1 ? 'STORY' : 'STORIES'}`;
  const img = bandImageUrl(input.siteUrl, input.bandSlug);
  // Two inline-block columns: side by side at 640px, stacked on a phone, with no
  // media query (Gmail apps ignore them). Text column first so it leads on mobile.
  return `
<tr><td bgcolor="${NAVY}" style="background-color: ${NAVY}; padding: 26px 24px 30px; border-radius: 16px 16px 0 0;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr>
    <td style="font-family: ${FONT}; font-size: 17px; font-weight: 800; letter-spacing: -0.3px; color: #ffffff; padding: 0 0 14px; border-bottom: 1px solid #2c3650;">aiux daily</td>
    <td align="right" style="font-family: ${MONO}; font-size: 11px; letter-spacing: 1px; color: ${ON_NAVY_MUTED}; padding: 0 0 14px; border-bottom: 1px solid #2c3650;">${input.dateLabel} · ${storyLabel}</td>
  </tr></table>
  <div style="font-size: 0; margin: 26px 0 0;">
    <div style="display: inline-block; width: 100%; max-width: 360px; vertical-align: bottom; font-size: 16px;">
      <p style="margin: 0 0 12px; font-family: ${FONT}; font-size: 11px; font-weight: 700; letter-spacing: 2px; color: ${ON_NAVY};">TODAY'S IDEA</p>
      <h1 style="margin: 0 0 16px; font-family: ${FONT}; font-size: 32px; font-weight: 800; line-height: 1.08; letter-spacing: -0.8px; color: #ffffff;">${escapeHtml(input.idea.title)}</h1>
    </div>
    <div style="display: inline-block; width: 100%; max-width: 220px; vertical-align: bottom; font-size: 16px; text-align: right;">
      <img src="${img}" alt="${escapeHtml(input.bandAlt)}" width="200" height="154" style="display: inline-block; width: 200px; max-width: 100%; height: auto; border: 0; margin: 0 0 12px;" />
    </div>
  </div>
  <p style="margin: 0; font-family: ${FONT}; font-size: 15px; line-height: 1.6; color: ${ON_NAVY};">${escapeHtml(input.idea.body)}</p>
</td></tr>`.trim();
}

function renderStory(story: DailyEmailStory, siteUrl: string): string {
  const patternCell = story.pattern
    ? `<td align="right" style="font-family: ${FONT}; font-size: 11px; font-weight: 700; letter-spacing: 0.4px; padding: 0 0 10px;"><a href="${siteUrl}/patterns/${story.pattern.slug}" target="_blank" rel="noopener" style="color: ${SLATE} !important; text-decoration: none !important; font-style: normal !important;"><span style="color: ${SLATE} !important;">${escapeHtml(story.pattern.title)} →</span></a></td>`
    : '';
  return `
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin: 0 0 12px;"><tr><td bgcolor="#ffffff" style="background-color: #ffffff; border-radius: 14px; padding: 20px 22px;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr>
    <td style="font-family: ${FONT}; font-size: 11px; font-weight: 700; letter-spacing: 0.8px; text-transform: uppercase; color: ${NAVY}; padding: 0 0 10px;">${story.badgeIconHtml}${escapeHtml(story.badgeLabel)} <span style="font-weight: 400; color: ${SLATE}; text-transform: none; letter-spacing: 0;">· ${escapeHtml(story.metaLabel)}</span></td>
    ${patternCell}
  </tr></table>
  <h3 style="margin: 0 0 8px; font-family: ${FONT}; font-size: 19px; font-weight: 700; line-height: 1.28; letter-spacing: -0.2px;"><a href="${story.sourceUrl}" target="_blank" rel="noopener" style="color: ${NAVY} !important; text-decoration: none !important; font-style: normal !important;"><span style="color: ${NAVY} !important;">${escapeHtml(story.headline)}</span></a></h3>
  <p style="margin: 0; font-family: ${FONT}; font-size: 15px; line-height: 1.55; color: ${SLATE};">${escapeHtml(story.takeaway)}</p>
</td></tr></table>`.trim();
}

function renderCta(cta: NonNullable<DailyEmailInput['cta']>): string {
  return `
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin: 24px 0 0;"><tr><td style="border: 2px solid ${NAVY}; border-radius: 14px; padding: 20px 22px;">
  <p style="margin: 0 0 4px; font-family: ${FONT}; font-size: 17px; font-weight: 700; color: ${NAVY};">Turn your design into Claude skills</p>
  <p style="margin: 0 0 16px; font-family: ${FONT}; font-size: 14px; line-height: 1.55; color: ${SLATE};">Drop a screenshot, see which of the ${cta.patternCount} patterns you are missing. Free, no signup for the first audit.</p>
  <a href="${cta.href}" target="_blank" rel="noopener" style="display: inline-block; background-color: ${NAVY}; color: #ffffff !important; text-decoration: none !important; padding: 12px 22px; border-radius: 999px; font-family: ${FONT}; font-size: 14px; font-weight: 700;"><span style="color: #ffffff !important; text-decoration: none !important;">Try the free audit →</span></a>
</td></tr></table>`.trim();
}

export function renderDailyEmail(input: DailyEmailInput): string {
  const stories = input.stories.map((s) => renderStory(s, input.siteUrl));
  return `
<div style="font-family: ${FONT}; color: ${NAVY}; max-width: 640px; margin: 0 auto;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="${TINT}" style="background-color: ${TINT}; border-radius: 16px;">
${renderBand(input)}
<tr><td style="padding: 24px 14px 28px;">
  <p style="margin: 0 0 12px 6px; font-family: ${FONT}; font-size: 11px; font-weight: 700; letter-spacing: 2px; color: ${SLATE};">TODAY'S STORIES</p>
  ${stories.join('\n  ')}
  ${input.cta ? renderCta(input.cta) : ''}
</td></tr>
</table>
${input.pollHtml}
</div>`.trim();
}
