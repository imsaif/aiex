// Compose a "quiet news day -> our updates" daily issue using the SAME house
// email primitives as src/app/api/cron/generate-newsletter/route.ts (generateHTML).
// Usage:
//   node scripts/compose-team-update-issue.mjs                 # preview only -> writes HTML file
//   node scripts/compose-team-update-issue.mjs --insert --env .env.production.local
//
// Insert creates a NewsletterDraft with status 'pending_review' (NOT published,
// emails no one) so it shows up in /admin/newsletter for review -> Copy HTML -> Beehiiv.

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
    weekday: 'long', month: 'long', day: 'numeric', year: 'numeric',
  });
}

// Masthead — mirrors renderMasthead but with a team-update subtitle.
function renderMasthead() {
  return `
<div style="padding: 0 0 28px 0; margin: 0 0 36px 0; border-bottom: 1px solid ${EMAIL_HAIRLINE};">
  <p style="margin: 0 0 10px; font-size: 12px; font-weight: 700; color: ${EMAIL_SUBTLE}; letter-spacing: 2px; text-transform: uppercase;">AI UX DAILY</p>
  <p style="margin: 0 0 4px; font-size: 15px; font-weight: 600; color: ${EMAIL_INK}; letter-spacing: -0.1px;">${issueDate()}</p>
  <p style="margin: 0; font-size: 13px; color: ${EMAIL_MUTED};">From the team · product updates</p>
</div>`.trim();
}

function renderSectionHeader(kicker, title) {
  return `
<p style="margin: 0 0 10px; font-size: 11px; font-weight: 700; color: ${EMAIL_SUBTLE}; letter-spacing: 2px; text-transform: uppercase;">${kicker}</p>
<h2 style="margin: 0 0 40px; font-size: 26px; font-weight: 700; color: ${EMAIL_INK}; letter-spacing: -0.4px; line-height: 1.25;">${ICON_NEWSPAPER}${title}</h2>`.trim();
}

// Update card — same visual language as renderStoryCard, simplified (no source/takeaway).
// links: array of { label, href, primary }
function renderUpdateCard({ kicker, headline, body, links }, isLast) {
  const separator = isLast
    ? ''
    : `\n<div style="text-align: center; margin: 40px 0; color: #64748b; letter-spacing: 12px; font-size: 18px;">· · ·</div>`;
  const linksHtml = links
    .map((l) =>
      l.primary
        ? `<a href="${l.href}" target="_blank" rel="noopener" style="display: inline-block; background-color: transparent; color: ${EMAIL_INK}; padding: 8px 14px; border: 1px solid ${EMAIL_HAIRLINE}; border-radius: 999px; font-size: 12px; font-weight: 500; text-decoration: none; letter-spacing: 0.2px; margin: 0 8px 8px 0;">${l.label} →</a>`
        : `<a href="${l.href}" target="_blank" rel="noopener" style="display: inline-block; font-size: 13px; color: ${EMAIL_INK}; text-decoration: underline; text-underline-offset: 3px; font-weight: 500; margin: 0 8px 8px 0;">${l.label} →</a>`
    )
    .join('');
  return `
<div style="margin: 0; padding: 0;">
  <p style="margin: 0 0 12px; font-size: 11px; color: ${EMAIL_SUBTLE}; font-weight: 600; text-transform: uppercase; letter-spacing: 0.8px;">${kicker}</p>
  <h3 style="margin: 0 0 14px; font-size: 22px; font-weight: 700; color: ${EMAIL_INK}; line-height: 1.35; letter-spacing: -0.2px;">${headline}</h3>
  <p style="margin: 0 0 16px; font-size: 16px; line-height: 1.7; color: ${EMAIL_TEXT};">${body}</p>
  <p style="margin: 0;">${linksHtml}</p>
</div>${separator}`.trim();
}

function renderDarkCallout({ kicker, title, body, cta }) {
  const ctaHTML = cta
    ? `\n  <p style="margin: 20px 0 0;"><a href="${cta.href}" target="_blank" rel="noopener" style="color: ${DARK_LINK}; text-decoration: underline; text-underline-offset: 3px; font-size: 14px; font-weight: 500;">${cta.label} →</a></p>`
    : '';
  return `
<div style="background-color: ${DARK_CANVAS}; padding: 32px; border-radius: 16px; margin: 0 0 32px;">
  <p style="margin: 0 0 14px; font-size: 11px; font-weight: 700; color: rgba(255, 255, 255, 0.6); letter-spacing: 2px; text-transform: uppercase;">${kicker}</p>
  <h2 style="margin: 0 0 16px; font-size: 22px; font-weight: 700; color: ${DARK_STRONG}; letter-spacing: -0.3px; line-height: 1.3;">${title}</h2>
  <p style="margin: 0; font-size: 16px; line-height: 1.7; color: ${DARK_TEXT};">${body}</p>${ctaHTML}
</div>`.trim();
}

function renderFooterCTA() {
  return `
<div style="margin: 56px 0 0; padding: 32px 0 0; border-top: 1px solid ${EMAIL_HAIRLINE}; text-align: center;">
  <p style="margin: 0 0 6px; font-size: 11px; font-weight: 700; color: ${EMAIL_SUBTLE}; letter-spacing: 2px; text-transform: uppercase;">AI UX DAILY</p>
  <p style="margin: 0 0 10px; font-size: 14px; color: ${EMAIL_MUTED};">Curated by Imran at aiuxdesign.guide</p>
  <p style="margin: 0; font-size: 13px;"><a href="${SITE_URL}/news" target="_blank" rel="noopener" style="color: ${EMAIL_INK}; text-decoration: underline; text-underline-offset: 3px; font-weight: 500;">Read past issues →</a></p>
</div>`.trim();
}

function wrapEmailShell(inner) {
  return `<div style="font-family: ${EMAIL_FONT_STACK}; color: ${EMAIL_INK}; max-width: 640px; margin: 0 auto; padding: 0 8px;">
${inner}
</div>`.trim();
}

// --- Content ---
const LEAD = `The AI news wire is quiet today, no major launches or research worth your inbox. So instead of forcing it, here is what we have shipped on aiuxdesign.guide lately.`;

const CARDS = [
  {
    kicker: 'Product · audit',
    headline: 'A redesigned, easier-to-read audit',
    body: 'We rebuilt how your audit results read. Instead of a dense report, you now get a two-column conversational layout that walks you through each UX gap and the specific fix, one point at a time.',
    links: [{ label: 'Run an audit', href: SITE_URL, primary: true }],
  },
  {
    kicker: 'Product',
    headline: 'A dashboard to save and hand off your audits',
    body: 'Save your audits, revisit them anytime, and export one combined developer handoff so your engineers get every fix in a single doc.',
    links: [{ label: 'Open the dashboard', href: `${SITE_URL}/dashboard`, primary: false }],
  },
  {
    kicker: 'New patterns · now 38',
    headline: 'Two new patterns for agentic products',
    body: 'Workspace-Native Agent Integration covers designing agents that live where the work already happens, instead of in a separate tab. Agent Reflection &amp; Learning covers agents that improve from their own outputs and user corrections.',
    links: [
      { label: 'Workspace-Native Agents', href: `${SITE_URL}/patterns/workspace-native-agents`, primary: false },
      { label: 'Agent Reflection &amp; Learning', href: `${SITE_URL}/patterns/agent-reflection-learning`, primary: false },
    ],
  },
];

function buildContent() {
  const cards = CARDS.map((c, i) => renderUpdateCard(c, i === CARDS.length - 1)).join('\n\n');
  const audit = renderDarkCallout({
    kicker: 'Try it',
    title: 'Run a free AI UX audit of your product',
    body: 'Our audit tool now gives you up to 4 free audits, and the whole flow works properly on mobile. Point it at your product and get concrete, pattern-backed UX gaps.',
    cta: { label: 'Run a free audit', href: `${SITE_URL}/audit` },
  });
  const body = `
${renderMasthead()}

<p style="margin: 0 0 48px; font-size: 17px; line-height: 1.7; color: ${EMAIL_TEXT};">${LEAD}</p>

${renderSectionHeader('From our side', 'What we shipped')}

${cards}

<div style="height: 56px; line-height: 56px; font-size: 1px;">&nbsp;</div>

${audit}

${renderFooterCTA()}
  `.trim();
  return wrapEmailShell(body);
}

// --- Main ---
const args = process.argv.slice(2);
const doInsert = args.includes('--insert');
const envIdx = args.indexOf('--env');
const envFile = envIdx >= 0 ? args[envIdx + 1] : null;

const content = buildContent();
const title = 'A quiet news day, so here is what we shipped';
const summary = 'No big AI launches today, so a catch-up from our side: a redesigned, easier-to-read audit, a dashboard to save and hand off your audits, and two new agentic patterns (now 38).';
const slug = `ai-ux-daily-${new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }).replace(' ', '-').toLowerCase()}-team-updates`;

const outFile = path.join(process.cwd(), `newsletter-team-update-${slug}.html`);
fs.writeFileSync(outFile, content, 'utf8');
console.log('Preview HTML written to:', outFile);
console.log('--- Draft metadata ---');
console.log('title  :', title);
console.log('slug   :', slug);
console.log('summary:', summary);
console.log('type   : daily');
console.log('status : pending_review');
console.log('content bytes:', content.length);

if (!doInsert) {
  console.log('\n(no --insert) Preview only. Re-run with --insert --env <file> to write the draft.');
  process.exit(0);
}

// Load DATABASE_URL from the given env file (avoid shell exposure of the secret).
if (!envFile) { console.error('ERROR: --insert requires --env <file>'); process.exit(1); }
const envText = fs.readFileSync(path.join(process.cwd(), envFile), 'utf8');
const dbLine = envText.split('\n').find((l) => l.startsWith('DATABASE_URL='));
if (!dbLine) { console.error('ERROR: no DATABASE_URL in', envFile); process.exit(1); }
const dbUrl = dbLine.slice('DATABASE_URL='.length).trim().replace(/^["']|["']$/g, '');

const { PrismaClient } = await import(path.join(process.cwd(), 'src/generated/prisma/index.js'));
const prisma = new PrismaClient({ datasources: { db: { url: dbUrl } } });
try {
  const existing = await prisma.newsletterDraft.findUnique({ where: { slug } });
  if (existing) {
    console.log(`\nDraft with slug "${slug}" already exists (id ${existing.id}, status ${existing.status}). Not inserting a duplicate.`);
  } else {
    const draft = await prisma.newsletterDraft.create({
      data: { title, slug, summary, content, publishDate: new Date(), status: 'pending_review', type: 'daily' },
    });
    console.log('\nINSERTED draft id:', draft.id, '| status:', draft.status, '| review at /admin/newsletter');
  }
} finally {
  await prisma.$disconnect();
}
