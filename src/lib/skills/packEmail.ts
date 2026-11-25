import { PATTERN_COUNT } from '@/data/pattern-count';

/**
 * Where someone said they will use the skills.
 *
 *   code   a coding tool: Claude Code, Cursor, GitHub Copilot or Codex
 *   claude the Claude app, which takes one uploaded zip
 *   unsure not sure yet, or uses none of them
 *
 * 'unsure' gets the Claude app zip because it is the only route with no project
 * and no folders, plus a way to read the patterns without installing anything.
 */
export const PACK_TARGETS = ['code', 'claude', 'unsure'] as const;
export type PackTarget = (typeof PACK_TARGETS)[number];

/** The folder a Mac or Windows unzip produces from aiux-skill-pack.zip. */
export const PACK_FOLDER = 'aiux-skill-pack';

/** What to say to a coding tool. Shown in the email, the pack and the site. */
export const INSTALL_PROMPT = `Read START HERE in ${PACK_FOLDER} and install the skills.`;

/**
 * The line an install adds to the project's notes. Without it Claude Code opened
 * a skill in 3 of 6 real edits; with it, 6 of 6 (audit, Nov 2026).
 */
export const NOTES_LINE =
  'When building or changing any AI feature, check the aiux skills first and use the ones that fit.';

/** What a designer can ask with nothing but a screenshot. */
export const REVIEW_PROMPT = "Use the aiux skills to review this screen. What's missing, and why?";
export const MORE_PROMPTS = [
  'Use the aiux skills to compare these two versions.',
  'Show me how to change this.',
  'Write a brief for my developer.',
];

// Email clients cannot read CSS variables and most strip <style> blocks, so the
// brand values are hardcoded. They mirror globals.css.
const NAVY = '#162036';
const BODY = '#20294C';
const PAGE = '#f9f9f9';
const CARD = '#ffffff';
const RULE = '#e5e7eb';
const FONT = `font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;`;
const SITE = 'https://www.aiuxdesign.guide';

const link = (path: string, text: string) =>
  `<a href="${SITE}${path}" style="color:${NAVY};font-weight:600;text-decoration:underline;">${text}</a>`;

const CODE_STEPS = [
  `Open the attached zip. You get a folder called <strong>${PACK_FOLDER}</strong>.`,
  'Drag that folder into your project, the folder you open in Claude Code, Cursor, GitHub Copilot or Codex.',
  `Tell your tool: <strong>&ldquo;${INSTALL_PROMPT}&rdquo;</strong> Say yes when it asks to add the files, and one line in your project notes so it remembers to use them.`,
  `Start a new chat, drag in a screenshot of any AI screen and say: <strong>&ldquo;${REVIEW_PROMPT}&rdquo;</strong>`,
];

const CLAUDE_STEPS = [
  'Keep the attached zip closed. You upload it as it is.',
  'In Claude, open <strong>Customize &rarr; Skills</strong>, press <strong>+</strong>, then <strong>Create skill</strong>, then <strong>Upload a skill</strong>.',
  'Choose the zip. If Claude asks you to turn on code execution, turn it on; skills need it.',
  `Start a new chat, add a screenshot of any AI screen and say: <strong>&ldquo;${REVIEW_PROMPT}&rdquo;</strong>`,
];

function stepsTable(steps: string[]): string {
  const rows = steps
    .map(
      (step, i) => `
          <tr>
            <td style="padding:0 0 14px;vertical-align:top;width:28px;">
              <div style="width:22px;height:22px;border-radius:11px;background:${NAVY};color:#ffffff;font-size:12px;font-weight:700;line-height:22px;text-align:center;">${i + 1}</div>
            </td>
            <td style="padding:0 0 14px 10px;font-size:15px;line-height:1.5;color:${BODY};">${step}</td>
          </tr>`
    )
    .join('');
  return `<table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;${FONT}">${rows}</table>`;
}

const PARTS: Record<PackTarget, { heading: string; steps: string[]; after: string }> = {
  code: {
    heading: 'Set them up in your coding tool',
    steps: CODE_STEPS,
    after: `Prefer to read? Every pattern is written up at ${link('/patterns', 'aiuxdesign.guide/patterns')}, with real examples from shipped products.`,
  },
  claude: {
    heading: 'Set them up in Claude',
    steps: CLAUDE_STEPS,
    after: `Prefer to read? Every pattern is written up at ${link('/patterns', 'aiuxdesign.guide/patterns')}.`,
  },
  unsure: {
    heading: 'The easiest way to try them',
    steps: CLAUDE_STEPS,
    after: `Don't use Claude? You can read all ${PATTERN_COUNT} patterns at ${link('/patterns', 'aiuxdesign.guide/patterns')}, with nothing to install. Using Claude Code, Cursor, GitHub Copilot or Codex? ${link('/?skills=1', 'Get that version')} and choose Coding tool.`,
  },
};

/** The email that carries the skill pack. Pure, so every version is testable. */
export function renderPackEmail(target: PackTarget): { subject: string; html: string } {
  const { heading, steps, after } = PARTS[target];
  return {
    subject: `Your ${PATTERN_COUNT} AI UX skills`,
    html: `
<body style="margin:0;padding:0;background:${PAGE};">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${PAGE};padding:32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:${CARD};border:1px solid ${RULE};border-radius:16px;">
          <tr>
            <td style="padding:32px 32px 0;">
              <p style="margin:0 0 20px;font-size:14px;font-weight:700;color:${NAVY};${FONT}">AIUX Design Guide</p>
              <h1 style="margin:0 0 12px;font-size:26px;line-height:1.2;font-weight:700;color:${NAVY};${FONT}">Your ${PATTERN_COUNT} AI UX skills</h1>
              <p style="margin:0 0 24px;font-size:15px;line-height:1.6;color:${BODY};${FONT}">
                A skill is a short note your AI tool reads while it designs. Each one covers one
                pattern: what it fixes, how to do it and what to avoid. They are attached.
              </p>
            </td>
          </tr>
          <tr><td style="padding:0 32px;"><div style="height:1px;background:${RULE};"></div></td></tr>
          <tr>
            <td style="padding:24px 32px 8px;">
              <p style="margin:0 0 16px;font-size:16px;font-weight:700;color:${NAVY};${FONT}">${heading}</p>
              ${stepsTable(steps)}
            </td>
          </tr>
          <tr>
            <td style="padding:12px 32px 32px;">
              <p style="margin:0;font-size:14px;line-height:1.6;color:${BODY};${FONT}">${after}</p>
            </td>
          </tr>
        </table>
        <p style="max-width:560px;margin:20px auto 0;font-size:12px;line-height:1.6;color:#6b7280;text-align:center;${FONT}">
          You are also on the daily AI UX newsletter. Every issue has an unsubscribe link.
        </p>
      </td>
    </tr>
  </table>
</body>`,
  };
}
