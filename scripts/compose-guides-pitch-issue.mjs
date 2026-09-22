// Compose a single-subject daily issue pitching the Claude Docs and Claude
// Slides courses, using the SAME house email primitives as
// src/app/api/cron/generate-newsletter/route.ts (generateHTML).
//
// Usage:
//   node scripts/compose-guides-pitch-issue.mjs                        # preview only -> writes HTML file
//   node scripts/compose-guides-pitch-issue.mjs --update <draftId> --env .env.local
//
// --update REPLACES an existing pending_review draft in place rather than
// inserting a second one. That is deliberate: the cron's own duplicate check
// skips any same-day draft, so an insert would be stranded and never reviewed.
// It also rewrites the derived columns (`readMinutes`, `products`,
// `structuredData`), because leaving those carrying the previous issue's four
// stories makes /news render tags and a reading time that belong to a different
// newsletter.
//
// It never publishes and never sends. Status stays pending_review, so the issue
// still goes through /admin/newsletter -> Copy HTML -> beehiiv by hand.

import fs from 'node:fs';
import path from 'node:path';

const SITE_URL = 'https://www.aiuxdesign.guide';
const EMAIL_IMG_BASE = `${SITE_URL}/images/email`;

// --- House design tokens (verbatim from the cron route) ---
const EMAIL_FONT_STACK = `-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif`;
const EMAIL_INK = '#162036';
const EMAIL_TEXT = '#20294C';
const EMAIL_MUTED = '#64748b';
const EMAIL_SUBTLE = '#475569';
const EMAIL_HAIRLINE = '#e5e7eb';
const DARK_CANVAS = '#162036';
const DARK_TEXT = '#cbd5e1';
const DARK_STRONG = '#ffffff';
const DARK_LINK = '#93c5fd';

const ICON_NEWSPAPER = `<img src="${EMAIL_IMG_BASE}/icon-newspaper.png" alt="" width="18" height="18" style="width: 18px; height: 18px; display: inline; vertical-align: -3px; margin-right: 6px;" />`;

function issueDate() {
  return new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

function renderMasthead() {
  return `
<div style="padding: 0 0 28px 0; margin: 0 0 36px 0; border-bottom: 1px solid ${EMAIL_HAIRLINE};">
  <p style="margin: 0 0 10px; font-size: 12px; font-weight: 700; color: ${EMAIL_SUBTLE}; letter-spacing: 2px; text-transform: uppercase;">AI UX DAILY</p>
  <p style="margin: 0 0 4px; font-size: 15px; font-weight: 600; color: ${EMAIL_INK}; letter-spacing: -0.1px;">${issueDate()}</p>
  <p style="margin: 0; font-size: 13px; color: ${EMAIL_MUTED};">Two new courses &middot; 30 minutes end to end</p>
</div>`.trim();
}

function renderSectionHeader(kicker, title) {
  return `
<p style="margin: 0 0 10px; font-size: 11px; font-weight: 700; color: ${EMAIL_SUBTLE}; letter-spacing: 2px; text-transform: uppercase;">${kicker}</p>
<h2 style="margin: 0 0 40px; font-size: 26px; font-weight: 700; color: ${EMAIL_INK}; letter-spacing: -0.4px; line-height: 1.25;">${ICON_NEWSPAPER}${title}</h2>`.trim();
}

// Anthropic's own line art, from public/images/illustrations/anthropic (see the
// README there for provenance). Used instead of our course screenshots because
// a cropped UI grab reads as documentation; the illustration reads as a subject.
//
// The PNG, not the SVG: Gmail strips SVG entirely, so an .svg here renders as
// nothing at all.
//
// The band is white rather than cream. Each illustration carries its own cream
// (#FAF9F5) block inside the linework, and sitting that on a cream band renders
// as two almost-but-not-quite matching creams. On white the block reads as part
// of the drawing, which is what it is.
const ART_SIZE = 168;

function renderArt({ src, alt }) {
  return `
<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="margin: 0 0 24px; background-color: #ffffff; border: 1px solid ${EMAIL_HAIRLINE}; border-radius: 14px;">
  <tr>
    <td align="center" style="padding: 28px 20px;">
      <img src="${SITE_URL}${src}" alt="${alt}" width="${ART_SIZE}" height="${ART_SIZE}" style="width: ${ART_SIZE}px; max-width: 60%; height: auto; display: block; border: 0;" />
    </td>
  </tr>
</table>`.trim();
}

// The lesson list is a table, not a bulleted paragraph. Five numbered rows with
// the duration on the right scan in about two seconds; the same five facts
// written as sentences do not get read at all.
function renderLessonTable(lessons) {
  const rows = lessons
    .map(
      (l, i) => `
    <tr>
      <td width="34" valign="top" style="padding: 10px 0; font-size: 12px; font-weight: 700; color: ${EMAIL_MUTED}; letter-spacing: 0.5px;">${String(i + 1).padStart(2, '0')}</td>
      <td valign="top" style="padding: 10px 0; font-size: 15px; line-height: 1.5; color: ${EMAIL_INK}; font-weight: 500;">${l.title}</td>
      <td width="56" valign="top" align="right" style="padding: 10px 0; font-size: 12px; color: ${EMAIL_MUTED}; white-space: nowrap;">${l.minutes} min</td>
    </tr>`
    )
    .join('');

  return `
<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="margin: 0 0 22px; border-top: 1px solid ${EMAIL_HAIRLINE}; border-bottom: 1px solid ${EMAIL_HAIRLINE};">
  <tbody>${rows}
  </tbody>
</table>`.trim();
}

// Course card. One illustration, one sentence, the lesson list as a table, and
// the button. Nothing else: the lesson titles already say what is inside, and a
// second block of prose underneath them only pushes the button further down.
function renderCourseCard({ kicker, headline, lede, art, lessons, cta }, isLast) {
  const separator = isLast
    ? ''
    : `\n<div style="text-align: center; margin: 44px 0; color: ${EMAIL_MUTED}; letter-spacing: 12px; font-size: 18px;">&middot; &middot; &middot;</div>`;

  return `
<div style="margin: 0; padding: 0;">
  <p style="margin: 0 0 10px; font-size: 11px; color: ${EMAIL_SUBTLE}; font-weight: 600; text-transform: uppercase; letter-spacing: 0.8px;">${kicker}</p>
  <h3 style="margin: 0 0 12px; font-size: 22px; font-weight: 700; color: ${EMAIL_INK}; line-height: 1.35; letter-spacing: -0.2px;">${headline}</h3>
  <p style="margin: 0 0 22px; font-size: 16px; line-height: 1.7; color: ${EMAIL_TEXT};">${lede}</p>
  ${renderArt(art)}
  ${renderLessonTable(lessons)}
  <p style="margin: 0;"><a href="${cta.href}" target="_blank" rel="noopener" style="display: inline-block; background-color: ${EMAIL_INK}; color: #ffffff !important; text-decoration: none !important; padding: 12px 24px; border-radius: 999px; font-size: 14px; font-weight: 600; letter-spacing: -0.1px;"><span style="color: #ffffff !important; text-decoration: none !important;">${cta.label} &rarr;</span></a></p>
</div>${separator}`.trim();
}

function renderDarkCallout({ kicker, title, body, cta }) {
  const ctaHTML = cta
    ? `\n  <p style="margin: 20px 0 0;"><a href="${cta.href}" target="_blank" rel="noopener" style="color: ${DARK_LINK}; text-decoration: underline; text-underline-offset: 3px; font-size: 14px; font-weight: 500;">${cta.label} &rarr;</a></p>`
    : '';
  return `
<div style="background-color: ${DARK_CANVAS}; padding: 32px; border-radius: 16px; margin: 0 0 32px;">
  <p style="margin: 0 0 14px; font-size: 11px; font-weight: 700; color: rgba(255, 255, 255, 0.6); letter-spacing: 2px; text-transform: uppercase;">${kicker}</p>
  <h2 style="margin: 0 0 16px; font-size: 22px; font-weight: 700; color: ${DARK_STRONG}; letter-spacing: -0.3px; line-height: 1.3;">${title}</h2>
  <p style="margin: 0; font-size: 16px; line-height: 1.7; color: ${DARK_TEXT};">${body}</p>${ctaHTML}
</div>`.trim();
}

// The closing CTA points at the courses, not the audit. The whole issue exists
// to get people reading them, so a second competing ask at the bottom would
// split the one click this email is asking for.
function renderFooterCTA() {
  return `
<div style="margin: 56px 0 0; padding: 32px 0 0; border-top: 1px solid ${EMAIL_HAIRLINE}; text-align: center;">
  <p style="margin: 0 0 12px; font-size: 11px; font-weight: 700; color: ${EMAIL_SUBTLE}; letter-spacing: 2px; text-transform: uppercase;">Both courses, free, no signup</p>
  <h2 style="margin: 0 0 12px; font-size: 24px; font-weight: 700; color: ${EMAIL_INK}; letter-spacing: -0.3px; line-height: 1.25;">Thirty minutes, and you stop guessing at three tiles</h2>
  <p style="margin: 0 0 24px; font-size: 16px; line-height: 1.6; color: ${EMAIL_TEXT};">Written from real sessions, including the parts that did not go smoothly.</p>
  <p style="margin: 0;"><a href="${SITE_URL}/guides" target="_blank" rel="noopener" style="display: inline-block; background-color: ${EMAIL_INK}; color: #ffffff !important; text-decoration: none !important; padding: 14px 28px; border-radius: 999px; font-size: 15px; font-weight: 600; letter-spacing: -0.1px;"><span style="color: #ffffff !important; text-decoration: none !important;">Open both courses</span></a></p>
</div>`.trim();
}

function wrapEmailShell(inner) {
  return `<div style="font-family: ${EMAIL_FONT_STACK}; color: ${EMAIL_INK}; max-width: 640px; margin: 0 auto; padding: 0 8px;">
${inner}
</div>`.trim();
}

// --- Content ---
//
// Every claim below is lifted from the courses themselves (src/data/guides.ts),
// not written fresh for the email. If a course changes, this copy is stale.

const LEAD = `Claude Docs and Claude Slides shipped as artifact types, next to Design on the Artifacts page. Both are new enough that the feature list is still the only thing written about them. So today is two courses instead of four stories.`;

const CARDS = [
  {
    kicker: 'New course &middot; 5 lessons &middot; 14 minutes',
    headline: 'Claude Docs: a document you brief by commenting on it',
    lede: 'A chat gives you text you then have to place. A doc is already the place. You point at a line, ask there, and the reply arrives on that same line with the edit already made.',
    art: {
      src: '/images/illustrations/anthropic/writing-on-a-page.png',
      alt: 'Line drawing of a hand writing on a page.',
    },
    lessons: [
      { title: 'What a doc is, and why it is not a chat', minutes: 3 },
      { title: 'The anchored comment: brief it by pointing', minutes: 4 },
      { title: 'Watching it work', minutes: 2 },
      { title: 'Tabs, sharing, and the two names problem', minutes: 2 },
      { title: 'When a doc is the wrong ask', minutes: 3 },
    ],
    cta: { label: 'Start the Docs course', href: `${SITE_URL}/guides/claude-docs-guide` },
  },
  {
    kicker: 'New course &middot; 5 lessons &middot; 16 minutes',
    headline: 'Claude Slides: it asks for a design system before you have a slide',
    lede: 'Slides opens with a question Docs never asks, and the design system picker it shows you will probably be empty. That looks broken. It is not, and the fix is not where you would look for it.',
    art: {
      src: '/images/illustrations/anthropic/presentation-screen.png',
      alt: 'Line drawing of a pull-down presentation screen showing a line chart.',
    },
    lessons: [
      { title: 'The question Slides asks first', minutes: 3 },
      { title: 'The empty picker, and the legacy trap', minutes: 4 },
      { title: 'Skipping the system, and what you get', minutes: 3 },
      { title: 'Editing by comment, on a canvas', minutes: 3 },
      { title: 'The export, inspected', minutes: 3 },
    ],
    cta: { label: 'Start the Slides course', href: `${SITE_URL}/guides/claude-slides-guide` },
  },
];

function buildContent() {
  const cards = CARDS.map((c, i) => renderCourseCard(c, i === CARDS.length - 1)).join('\n\n');

  const whichFirst = renderDarkCallout({
    kicker: 'If you only do one',
    title: 'Start with Docs, then read Slides lessons 2 and 5',
    body: 'The anchored comment is the same interaction in both products, and Docs teaches it in four minutes on something forgiving. Once it is second nature, the rest of Slides is mostly the two traps: lesson 2 is the empty picker and the way out of it, lesson 5 is what the export quietly drops.',
    cta: { label: 'Open the Docs course', href: `${SITE_URL}/guides/claude-docs-guide` },
  });

  const body = `
${renderMasthead()}

<p style="margin: 0 0 48px; font-size: 17px; line-height: 1.7; color: ${EMAIL_TEXT};">${LEAD}</p>

${renderSectionHeader('Today', 'Two courses on the new Claude artifacts')}

${cards}

<div style="height: 56px; line-height: 56px; font-size: 1px;">&nbsp;</div>

${whichFirst}

${renderFooterCTA()}
  `.trim();

  return wrapEmailShell(body);
}

// --- Metadata ---
const content = buildContent();
const title = 'Claude Docs and Claude Slides, both courses in 30 minutes';
const summary =
  'Claude shipped Docs and Slides as artifact types, and the feature list is still the only thing written about them. Two new courses cover both: the anchored comment that is the spine of each product, the empty design system picker that looks broken and is not, and the PowerPoint export unpacked to see what actually survives.';
const monthDay = new Date()
  .toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  .replace(' ', '-')
  .toLowerCase();
const slug = `ai-ux-daily-${monthDay}-claude-docs-and-claude-slides-courses`;

// structuredData is rewritten wholesale. `items` carried the four stories this
// issue replaces, and productsForIssue reads it, so leaving it would tag the
// issue with products that no longer appear anywhere in it.
const structuredData = {
  title,
  summary,
  items: [],
  takeaway: {
    title: 'Ask whether anyone will comment on it',
    body: 'That one question picks the artifact. Comments mean a doc, a screen in front of people means a deck, and nothing to revisit means it was only ever a chat message.',
  },
  composedBy: 'scripts/compose-guides-pitch-issue.mjs',
};

// --- Main ---
const args = process.argv.slice(2);
const updateIdx = args.indexOf('--update');
const draftId = updateIdx >= 0 ? args[updateIdx + 1] : null;
const envIdx = args.indexOf('--env');
const envFile = envIdx >= 0 ? args[envIdx + 1] : null;

const outFile = path.join(process.cwd(), `newsletter-guides-pitch-${slug}.html`);
fs.writeFileSync(outFile, content, 'utf8');
console.log('Preview HTML written to:', outFile);
console.log('--- Draft metadata ---');
console.log('title  :', title);
console.log('slug   :', slug);
console.log('summary:', summary);
console.log('type   : daily');
console.log('status : pending_review (unchanged)');
console.log('content bytes:', content.length);

if (!draftId) {
  console.log('\n(no --update) Preview only. Re-run with --update <draftId> --env <file> to replace the draft.');
  process.exit(0);
}

if (!envFile) {
  console.error('ERROR: --update requires --env <file>');
  process.exit(1);
}

// Read DATABASE_URL from the env file rather than the shell, so the secret is
// never in argv or in shell history.
const envText = fs.readFileSync(path.join(process.cwd(), envFile), 'utf8');
const dbLine = envText.split('\n').find((l) => l.startsWith('DATABASE_URL='));
if (!dbLine) {
  console.error('ERROR: no DATABASE_URL in', envFile);
  process.exit(1);
}
const dbUrl = dbLine.slice('DATABASE_URL='.length).trim().replace(/^["']|["']$/g, '');

// Both derived columns are computed with the SAME helpers the generator uses,
// imported from the .ts source directly (Node strips the types), exactly as
// scripts/newsletter/backfill-issue-metadata.mjs does. Reimplementing either
// one here would let them drift from what the cron writes.
const { PrismaClient } = await import('../src/generated/prisma/index.js');
const { productsForIssue, computeReadMinutes } = await import('../src/lib/newsletter/products.ts');

const prisma = new PrismaClient({ datasources: { db: { url: dbUrl } } });

try {
  const existing = await prisma.newsletterDraft.findUnique({ where: { id: draftId } });
  if (!existing) {
    console.error(`\nERROR: no draft with id ${draftId}`);
    process.exit(1);
  }
  if (existing.status === 'published') {
    console.error(
      `\nERROR: draft ${draftId} is already published ("${existing.title}"). Refusing to rewrite a live issue.`
    );
    process.exit(1);
  }

  console.log(`\nReplacing draft ${draftId}`);
  console.log(`  was: ${existing.title}`);
  console.log(`  now: ${title}`);

  const updated = await prisma.newsletterDraft.update({
    where: { id: draftId },
    data: {
      title,
      slug,
      summary,
      content,
      structuredData,
      // Both are derived from the content that just changed. Left alone, they
      // describe the issue this one replaced: readMinutes would be the old
      // story count's reading time, and products would tag the four products
      // that no longer appear.
      readMinutes: computeReadMinutes(content),
      products: productsForIssue(title, summary, structuredData),
      // status deliberately untouched. This script never publishes.
    },
  });

  console.log(`\nDone. status=${updated.status} slug=${updated.slug} readMinutes=${updated.readMinutes}`);
  console.log(`Review at /admin/newsletter?id=${updated.id}`);
} finally {
  await prisma.$disconnect();
}
