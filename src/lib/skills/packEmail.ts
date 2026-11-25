import { PATTERN_COUNT } from '@/data/pattern-count';
import { PACK_GUIDES, guidePath, type PackStep, type PackTarget } from '@/lib/skills/packSteps';

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

const stepHtml = ({ text, say, expect, then }: PackStep) =>
  [text, say && `<strong>&ldquo;${say}&rdquo;</strong>`, expect, then].filter(Boolean).join(' ');

function stepsTable(steps: PackStep[]): string {
  const rows = steps
    .map(
      (step, i) => `
          <tr>
            <td style="padding:0 0 14px;vertical-align:top;width:28px;">
              <div style="width:22px;height:22px;border-radius:11px;background:${NAVY};color:#ffffff;font-size:12px;font-weight:700;line-height:22px;text-align:center;">${i + 1}</div>
            </td>
            <td style="padding:0 0 14px 10px;font-size:15px;line-height:1.5;color:${BODY};">${stepHtml(step)}</td>
          </tr>`
    )
    .join('');
  return `<table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;${FONT}">${rows}</table>`;
}

const READ = `You can also read all ${PATTERN_COUNT} patterns at ${link('/patterns', 'aiuxdesign.guide/patterns')}, with nothing to install.`;

// 'unsure' is sent the Claude app zip, the only route with no project and no
// folders, so it gets those steps plus a way to read without installing.
const PARTS: Record<PackTarget, { heading: string; steps: PackStep[]; after: string }> = {
  code: { heading: 'Set them up in Claude Code', steps: PACK_GUIDES.code.steps, after: READ },
  claude: { heading: 'Set them up in the Claude app', steps: PACK_GUIDES.claude.steps, after: READ },
  unsure: {
    heading: 'If you use Claude, the easiest way to try them',
    steps: PACK_GUIDES.claude.steps,
    after: `${READ} Using Claude Code? ${link('/?skills=1', 'Get that version')} and choose Claude Code.`,
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
              <p style="margin:0;font-size:14px;line-height:1.6;color:${BODY};${FONT}">${link(guidePath(target), target === 'unsure' ? 'See an example first' : 'See the full steps and an example')}.<br><br>${after}</p>
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
