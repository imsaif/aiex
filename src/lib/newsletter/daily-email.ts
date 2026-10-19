/**
 * Daily email layout (Oct 2026 redesign; "D" on the canvas's Oct 10 polish page).
 *
 * Navy band: aiux mark + date, then the issue title (the subject line the reader
 * just clicked) with the lead story's pattern icon beside it. Then story cards
 * (source, headline, Designer's Takeaway, a quiet Source link and a pattern pill),
 * Today's Idea as a light wrap-up panel, and a navy audit CTA.
 *
 * The band repeats the subject on purpose: beehiiv's own title and subtitle are
 * hidden in the email (a per-post toggle), so the reader lands on exactly what
 * they clicked. The admin can retitle a draft after generation, so the headline
 * sits between markers and syncBandTitle() rewrites it to the current title.
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

import { bandImageUrl } from './band-icons';

const FONT = `-apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif`;
const MONO = `ui-monospace, SFMono-Regular, Menlo, Consolas, monospace`;
// Brand palette (mirrors tokens in src/app/globals.css :root)
const NAVY = '#162036';      // --accent-primary / band + CTA surface
const TINT = '#EEF0F6';      // pale navy page behind the cards
const SLATE = '#475569';     // secondary text on white (AA on white and on TINT)
const HAIR = '#eef0f4';
const PILL = '#d5d9e3';
const PANEL = '#F3F5F9';     // Designer's Takeaway panel: our voice, set apart from the story
const IDEA_PANEL = '#DCE1EC'; // Today's Idea wrap-up panel (navy on it is AAA)
const ON_NAVY = '#cbd5e1';   // body text on navy (AA)
const ON_NAVY_MUTED = '#94a3b8';

// Dark-mode overrides, keyed by class. Light values above stay inline so the
// email is complete without this block.
// On phones the CTA grid sits behind most of the copy, so it swaps to a lighter,
// smaller variant tucked into the bottom corner, and the desktop right-hand gutter
// that keeps copy clear of the grid is released.
export const emailStyleBlock = (siteUrl: string) => `<style>
@media only screen and (max-width: 480px) {
  .aiux-idea { font-size: 26px !important; }
  .aiux-band { padding: 20px 18px 22px !important; }
  .aiux-band-art, .aiux-band-art-cell { display: none !important; width: 0 !important; max-height: 0 !important; overflow: hidden !important; }
  .aiux-band-text { padding: 0 !important; }
  .aiux-phone-hide { display: none !important; }
  .aiux-stories { padding: 16px 0 20px !important; }
  .aiux-stories-label { margin-left: 16px !important; }
  .aiux-card { padding: 24px 16px 22px !important; }
  .aiux-panel { padding: 12px 12px !important; }
  .aiux-idea-panel { padding: 22px 16px 20px !important; }
  .aiux-phone-only { display: inline !important; max-height: none !important; overflow: visible !important; }
  .aiux-pill-label { display: none !important; }
  .aiux-cta { background-image: url('${siteUrl}/images/newsletter/cta-grid-light.png') !important; background-size: 200px 133px !important; background-position: right bottom !important; padding-right: 22px !important; }
}
@media (prefers-color-scheme: dark) {
  .aiux-tint { background-color: #141821 !important; }
  .aiux-card { background-color: #1c2130 !important; }
  .aiux-panel { background-color: #242b3c !important; }
  .aiux-idea-panel { background-color: #262e42 !important; }
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
  /** URL of a known product logo (square PNG), or '' to show a monogram. */
  badgeIconUrl: string;
  /** The story's date, or '' when it has none we trust (digest-scraped items). */
  metaLabel: string;
  headline: string;
  takeaway: string;
  /** Already stripped of feed utm_* params. */
  sourceUrl: string;
  /** Only set when the slug is a real pattern. */
  pattern?: { slug: string; title: string };
}

/** A light wrap-up panel after the stories (Today's Idea; the weekly's three). */
export interface EmailPanel {
  /** Small caps label, e.g. "TODAY'S IDEA". */
  label: string;
  title?: string;
  body: string;
  /** A second, quieter paragraph (the weekly's "when to use"). */
  note?: string;
  /** A pattern pill under the text, same as on the story cards. */
  pattern?: { slug: string; title: string };
}

export interface DailyEmailInput {
  siteUrl: string;
  /** Wordmark beside the logo. Defaults to daily. */
  edition?: 'daily' | 'weekly';
  /** e.g. "WED 07.10.26", or "OCT 5–11" for the weekly. */
  dateLabel: string;
  /** The issue title (subject line). The "AI UX Daily:" / "This Week in AIUX:" prefix is stripped. */
  headline: string;
  /** Today's Idea (daily). Shorthand for a single panel. */
  idea?: { title: string; body: string };
  /** Wrap-up panels after the stories, in order. Rendered after `idea`. */
  panels?: EmailPanel[];
  /** Label above the cards. Defaults to "TODAY'S STORIES". */
  storiesLabel?: string;
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

/** "Oct 06" → "Oct 6". The model writes dates both ways within one issue. */
export function tidyDateLabel(label: string): string {
  return label.replace(/^([A-Za-z]{3,9}) 0(\d)$/, '$1 $2');
}

/** "AI UX Daily: Context libraries…" → "Context libraries…". The logo already says it.
 *  Same for the weekly's "This Week in AIUX:". */
export function stripIssuePrefix(title: string): string {
  return title.replace(/^\s*(AI UX Daily|This Week in AIUX)\s*[:\-–]\s*/i, '').trim();
}

/** The week a Monday weekly covers: the seven days before `runDate`, e.g.
 *  "OCT 5–11", or "SEP 28–OCT 4" across a month boundary. */
export function formatWeekLabel(runDate: Date): string {
  const end = new Date(runDate.getTime() - 24 * 60 * 60 * 1000);
  const start = new Date(runDate.getTime() - 7 * 24 * 60 * 60 * 1000);
  const month = (d: Date) => d.toLocaleDateString('en-US', { month: 'short', timeZone: 'UTC' }).toUpperCase();
  const startLabel = `${month(start)} ${start.getUTCDate()}`;
  const endLabel = month(end) === month(start) ? `${end.getUTCDate()}` : `${month(end)} ${end.getUTCDate()}`;
  return `${startLabel}–${endLabel}`;
}

const TITLE_OPEN = '<!--aiux:title-->';
const TITLE_CLOSE = '<!--/aiux:title-->';

/**
 * Rewrite the band headline to match `title`. The admin edits the title and the
 * HTML separately; without this an edited subject line would not reach the band.
 * HTML without the markers (older issues) is returned unchanged.
 */
export function syncBandTitle(html: string, title: string): string {
  const start = html.indexOf(TITLE_OPEN);
  const end = html.indexOf(TITLE_CLOSE);
  if (start === -1 || end === -1 || end < start) return html;
  return html.slice(0, start + TITLE_OPEN.length) + escapeHtml(stripIssuePrefix(title)) + html.slice(end);
}

/** Short form of a pattern name for the phone pill (whose PATTERN label is
 *  hidden to make room): whole words up to `max`
 *  characters, then "…". "Workspace-Native Agent Integration" → "Workspace-Native…". */
export function shortPatternTitle(title: string, max = 23): string {
  if (title.length <= max) return title;
  const words = title.split(' ');
  let out = '';
  for (const w of words) {
    const next = out ? `${out} ${w}` : w;
    if (next.length > max - 1) break;
    out = next;
  }
  return `${out || title.slice(0, max - 1)}…`;
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
  // Headline and icon sit side by side on desktop (picked on the canvas over
  // stacking). Phones hide the icon: beside it the headline got ~160px and broke
  // into four lines in the Gmail app (reported 2026-10-19). No label and no body: the
  // band is the subject line, and Today's Idea follows the stories.
  return `
<tr><td class="aiux-band" bgcolor="${NAVY}" style="background-color: ${NAVY}; padding: 24px 24px 26px; border-radius: 16px 16px 0 0;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr>
    <td style="padding: 0 0 14px; border-bottom: 1px solid #2c3650; font-family: ${FONT}; font-size: 14px; font-weight: 700; letter-spacing: -0.2px; color: #ffffff; white-space: nowrap;"><img src="${mark}" alt="aiux" width="26" height="26" style="display: inline-block; width: 26px; height: 26px; border: 0; vertical-align: middle; margin-right: 8px;" />aiux <span style="font-weight: 400; color: ${ON_NAVY};">${input.edition === 'weekly' ? 'weekly' : 'daily'}</span></td>
    <td align="right" style="padding: 0 0 14px; border-bottom: 1px solid #2c3650; font-family: ${MONO}; font-size: 11px; letter-spacing: 1px; color: ${ON_NAVY_MUTED}; white-space: nowrap;">${input.dateLabel}<span class="aiux-phone-hide"> · ${storyLabel}</span></td>
  </tr></table>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin: 22px 0 0;"><tr>
    <td class="aiux-band-text" valign="middle" style="padding: 0 16px 0 0;">
      <h2 class="aiux-idea" style="margin: 0; font-family: ${FONT}; font-size: 30px; font-weight: 800; line-height: 1.12; letter-spacing: -0.8px; color: #ffffff;">${TITLE_OPEN}${escapeHtml(stripIssuePrefix(input.headline))}${TITLE_CLOSE}</h2>
    </td>
    <td class="aiux-band-art-cell" valign="middle" width="150" align="right" style="width: 150px;">
      <img class="aiux-band-art" src="${bandImageUrl(input.siteUrl, input.bandSlug)}" alt="${escapeHtml(input.bandAlt)}" width="150" height="150" style="display: block; width: 150px; height: auto; border: 0;" />
    </td>
  </tr></table>
</td></tr>`.trim();
}

// Wrap-up panels after the stories (Today's Idea; the weekly's takeaway, Steal
// this week and Pattern deep-dive): ours, once the reader has the facts. A light
// navy tint, so they read as ours without competing with the navy CTA.
function renderPanel(panel: EmailPanel, siteUrl: string): string {
  const title = panel.title
    ? `<p class="aiux-ink" style="margin: 0 0 10px; font-family: ${FONT}; font-size: 22px; font-weight: 800; line-height: 1.22; letter-spacing: -0.4px; color: ${NAVY};">${escapeHtml(panel.title)}</p>`
    : '';
  const note = panel.note
    ? `<p class="aiux-ink" style="margin: 12px 0 0; font-family: ${FONT}; font-size: 14px; line-height: 1.6; color: ${NAVY};"><span class="aiux-sub" style="font-weight: 700; color: ${SLATE};">When to use: </span>${escapeHtml(panel.note)}</p>`
    : '';
  const pill = panel.pattern
    ? `<p style="margin: 16px 0 0;"><a href="${siteUrl}/patterns/${panel.pattern.slug}" target="_blank" rel="noopener" class="aiux-pill aiux-ink" style="display: inline-block; padding: 7px 12px; border: 1px solid ${PILL}; border-radius: 999px; background-color: #ffffff; font-family: ${FONT}; font-size: 12px; font-weight: 600; color: ${NAVY} !important; text-decoration: none !important; font-style: normal !important;"><span class="aiux-sub" style="font-size: 10px; font-weight: 700; letter-spacing: 1px; color: ${SLATE} !important; margin-right: 6px;">PATTERN</span><span style="color: ${NAVY} !important;">${escapeHtml(panel.pattern.title)}&nbsp;→</span></a></p>`
    : '';
  return `
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin: 0 0 16px;"><tr><td class="aiux-idea-panel" bgcolor="${IDEA_PANEL}" style="background-color: ${IDEA_PANEL}; border-radius: 14px; padding: 28px 22px 26px;">
  <p style="margin: 0 0 10px; font-family: ${FONT}; font-size: 11px; font-weight: 700; letter-spacing: 2px; color: ${SLATE};" class="aiux-sub">${escapeHtml(panel.label)}</p>
  ${title}
  <p class="aiux-ink" style="margin: 0; font-family: ${FONT}; font-size: 15px; line-height: 1.6; color: ${NAVY};">${escapeHtml(panel.body)}</p>
  ${note}
  ${pill}
</td></tr></table>`.trim();
}

// The pill's pattern name: full on desktop, shortened on phones so Source and
// the pill share one row at 360px. The phone span is hidden by default, so a
// client that ignores the media query shows only the full name.
function patternName(title: string): string {
  const full = `${escapeHtml(title)}&nbsp;→`;
  const short = shortPatternTitle(title);
  if (short === title) return `<span style="color: ${NAVY} !important;">${full}</span>`;
  return `<span class="aiux-phone-hide" style="color: ${NAVY} !important;">${full}</span><span class="aiux-phone-only" style="display: none; max-height: 0; overflow: hidden; color: ${NAVY} !important;">${escapeHtml(short)}&nbsp;→</span>`;
}

function renderStory(story: DailyEmailStory, siteUrl: string): string {
  // The logo sits in its own cell, vertically centred against the label: inline
  // images and spans aligned to the text baseline sat a few pixels off. The size
  // is locked (min/max width, no margin): a host page whose styles set
  // img { max-width: 100% } let a long label squeeze the cell and squash the logo.
  const logo = story.badgeIconUrl
    ? `<img src="${story.badgeIconUrl}" alt="" width="16" height="16" style="display: block; width: 16px; min-width: 16px; max-width: none; height: 16px; border: 0;" />`
    : `<span class="aiux-mono" style="display: block; width: 16px; height: 16px; line-height: 16px; border-radius: 4px; background-color: ${NAVY}; color: #ffffff; font-family: ${FONT}; font-size: 9px; font-weight: 800; text-align: center; letter-spacing: 0;">${escapeHtml(monogram(story.badgeLabel))}</span>`;
  const pattern = story.pattern
    ? `<td align="right" style="padding: 0; white-space: nowrap;"><a href="${siteUrl}/patterns/${story.pattern.slug}" target="_blank" rel="noopener" class="aiux-pill aiux-ink" style="display: inline-block; text-align: left; padding: 7px 12px; border: 1px solid ${PILL}; border-radius: 999px; font-family: ${FONT}; font-size: 12px; font-weight: 600; color: ${NAVY} !important; text-decoration: none !important; font-style: normal !important;"><span class="aiux-sub aiux-pill-label" style="font-size: 10px; font-weight: 700; letter-spacing: 1px; color: ${SLATE} !important; margin-right: 6px;">PATTERN</span>${patternName(story.pattern.title)}</a></td>`
    : '';
  return `
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin: 0 0 20px;"><tr><td class="aiux-card" bgcolor="#ffffff" style="background-color: #ffffff; border-radius: 14px; padding: 30px 22px 26px;">
  <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin: 0 0 18px;"><tr>
    <td valign="middle" width="16" style="width: 16px; min-width: 16px; line-height: 0; font-size: 0; padding: 0 8px 0 0;">${logo}</td>
    <td valign="middle" class="aiux-ink" style="font-family: ${FONT}; font-size: 11px; line-height: 16px; font-weight: 700; letter-spacing: 0.8px; text-transform: uppercase; color: ${NAVY};">${escapeHtml(story.badgeLabel)}${story.metaLabel ? ` <span class="aiux-sub" style="font-weight: 400; color: ${SLATE}; text-transform: none; letter-spacing: 0;">· ${escapeHtml(tidyDateLabel(story.metaLabel))}</span>` : ''}</td>
  </tr></table>
  <h3 class="aiux-ink" style="margin: 0 0 14px; font-family: ${FONT}; font-size: 19px; font-weight: 700; line-height: 1.32; letter-spacing: -0.2px; color: ${NAVY};">${escapeHtml(story.headline)}</h3>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td class="aiux-panel" bgcolor="${PANEL}" style="background-color: ${PANEL}; border-radius: 10px; padding: 14px 16px;">
    <p class="aiux-sub" style="margin: 0 0 6px; font-family: ${FONT}; font-size: 10px; font-weight: 700; letter-spacing: 1.4px; color: ${SLATE};">DESIGNER'S TAKEAWAY</p>
    <p class="aiux-ink" style="margin: 0; font-family: ${FONT}; font-size: 15px; line-height: 1.6; font-weight: 500; color: ${NAVY};">${escapeHtml(story.takeaway)}</p>
  </td></tr></table>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin: 24px 0 0;"><tr><td class="aiux-rule" style="padding: 18px 0 0; border-top: 1px solid ${HAIR};">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr>
      <td style="padding: 0 12px 0 0; font-family: ${FONT}; font-size: 13px; font-weight: 500; white-space: nowrap;">${link(story.sourceUrl, 'Source&nbsp;↗', SLATE, '', 'aiux-sub')}</td>
      ${pattern}
    </tr></table>
  </td></tr></table>
</td></tr></table>`.trim();
}

function renderCta(cta: NonNullable<DailyEmailInput['cta']>, siteUrl: string): string {
  // The band's grid and rings as a top-right background, so the email closes on
  // the motif it opens with. Clients that ignore background images (desktop
  // Outlook) show plain navy, which is the intended fallback. The 190px right
  // padding keeps the copy off the graphic on desktop; phones release it.
  const grid = `${siteUrl}/images/newsletter/cta-grid.png`;
  return `
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin: 24px 0 0;"><tr><td class="aiux-cta" bgcolor="${NAVY}" background="${grid}" style="background-color: ${NAVY}; background-image: url('${grid}'); background-repeat: no-repeat; background-position: right top; background-size: 300px 200px; border-radius: 14px; padding: 26px 190px 24px 26px;">
  <p style="margin: 0 0 4px; font-family: ${FONT}; font-size: 17px; font-weight: 700; color: #ffffff;">Turn your design into Claude skills</p>
  <p style="margin: 0 0 16px; font-family: ${FONT}; font-size: 14px; line-height: 1.55; color: ${ON_NAVY};">Drop a screenshot, see which of the ${cta.patternCount} patterns you are missing. Free, no signup for the first audit.</p>
  <a href="${cta.href}" target="_blank" rel="noopener" style="display: inline-block; background-color: #ffffff; color: ${NAVY} !important; text-decoration: none !important; padding: 12px 22px; border-radius: 999px; font-family: ${FONT}; font-size: 14px; font-weight: 700;"><span style="color: ${NAVY} !important; text-decoration: none !important;">Get your design skills →</span></a>
</td></tr></table>`.trim();
}

export function renderDailyEmail(input: DailyEmailInput): string {
  const stories = input.stories.map((s) => renderStory(s, input.siteUrl));
  const panels: EmailPanel[] = [
    ...(input.idea ? [{ label: "TODAY'S IDEA", title: input.idea.title, body: input.idea.body }] : []),
    ...(input.panels ?? []),
  ];
  return `
${emailStyleBlock(input.siteUrl)}
<div style="font-family: ${FONT}; color: ${NAVY}; max-width: 680px; margin: 0 auto;">
<table class="aiux-tint" role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="${TINT}" style="background-color: ${TINT}; border-radius: 16px;">
${renderBand(input)}
<tr><td class="aiux-stories" style="padding: 20px 6px 24px;">
  <p class="aiux-sub aiux-stories-label" style="margin: 0 0 12px 8px; font-family: ${FONT}; font-size: 11px; font-weight: 700; letter-spacing: 2px; color: ${SLATE};">${escapeHtml(input.storiesLabel ?? "TODAY'S STORIES")}</p>
  ${stories.join('\n  ')}
  ${panels.map((p) => renderPanel(p, input.siteUrl)).join('\n  ')}
  ${input.cta ? renderCta(input.cta, input.siteUrl) : ''}
</td></tr>
</table>
${input.pollHtml}
</div>`.trim();
}
