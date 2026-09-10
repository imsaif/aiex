import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { zipSync, strToU8 } from 'fflate';
import patterns from '@/data/patterns';
import { composeSkillPack, skillPackFilename } from '@/lib/skills/composePack';
import { composeSingleSkillZipEntries, singleSkillFilename } from '@/lib/skills/composeSingleSkill';
import { resend } from '@/lib/resend';
import { PATTERN_COUNT } from '@/data/pattern-count';

/**
 * Emails the skill pack to someone who just handed over their address.
 *
 * Why this exists: the modal's button said "Send all 38 skills" and its small
 * print said we would send them, while the only thing that actually happened was
 * a browser download. Nothing arrived in anyone's inbox. Either the copy had to
 * come down to match the behaviour, or the behaviour had to rise to match the
 * copy. This is the second.
 *
 * It also removes a real failure mode. The browser download fires on the same
 * tick as the navigation to /audit, and some browsers cancel a blob download when
 * the page navigates immediately. An emailed copy means a person who gives an
 * address always ends up with the files, even if the download never lands.
 *
 * Deliberately a separate endpoint rather than work bolted onto
 * /api/newsletter/subscribe: zipping 39 files and calling Resend should not sit
 * between a subscriber row and its Beehiiv sync, and a failure here must never
 * fail the signup. The caller treats this as best-effort.
 */

const sendSchema = z.object({
  email: z.string().email('Invalid email address'),
  // Mirrors the modal's chooser. 'code' is the project tree for Claude Code;
  // 'claude' is the single skill folder Claude's own uploader accepts.
  target: z.enum(['code', 'claude']).default('code'),
});

export async function POST(request: NextRequest) {
  try {
    const { email, target } = sendSchema.parse(await request.json());

    if (!process.env.RESEND_API_KEY) {
      // Not configured is not an error the visitor should see: they already have
      // the download. Say so plainly in the response so it is greppable in logs.
      console.warn('[skills/send] RESEND_API_KEY missing, skipping email');
      return NextResponse.json({ sent: false, reason: 'not-configured' }, { status: 200 });
    }

    const files =
      target === 'claude'
        ? composeSingleSkillZipEntries(patterns)
        : composeSkillPack(patterns, []);
    const filename = target === 'claude' ? singleSkillFilename() : skillPackFilename();

    const zipped = zipSync(
      Object.fromEntries(Object.entries(files).map(([path, body]) => [path, strToU8(body)])),
      { level: 6 }
    );

    // Brand values, hardcoded because email clients cannot read CSS variables and
    // most strip <style> blocks entirely. These mirror globals.css: navy for
    // headings and the button, near-white for the page, gray-200 for rules.
    const NAVY = '#162036';
    const BODY = '#20294C';
    const PAGE = '#f9f9f9';
    const CARD = '#ffffff';
    const RULE = '#e5e7eb';

    const steps =
      target === 'claude'
        ? [
            'Open Claude and go to Customize &rarr; Skills.',
            'Click <strong>+ Create skill</strong> and upload the attached zip.',
            'Done. Claude Design and the Claude app both pick it up.',
          ]
        : [
            'Unzip the attachment into your project.',
            'The files land in <code style="background:' + PAGE + ';padding:2px 5px;border-radius:4px;">.claude/skills/</code>.',
            'Claude Code reads them on its own. Nothing to remember at the prompt.',
          ];

    const stepsHtml = steps
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

    const packLabel =
      target === 'claude' ? 'Claude Design and the Claude app' : 'Claude Code';

    await resend.emails.send({
      from: 'AI UX Daily <imran@aiuxdesign.guide>',
      replyTo: 'imranrizom@gmail.com',
      to: email,
      subject: `Your ${PATTERN_COUNT} AI UX skills`,
      html: `
<body style="margin:0;padding:0;background:${PAGE};">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${PAGE};padding:32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:${CARD};border:1px solid ${RULE};border-radius:16px;">
          <tr>
            <td style="padding:32px 32px 0;">
              <p style="margin:0 0 20px;font-size:12px;font-weight:700;letter-spacing:0.14em;text-transform:uppercase;color:${NAVY};font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
                aiux
              </p>
              <h1 style="margin:0 0 12px;font-size:26px;line-height:1.2;font-weight:700;color:${NAVY};font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
                Your ${PATTERN_COUNT} AI UX skills
              </h1>
              <p style="margin:0 0 24px;font-size:15px;line-height:1.6;color:${BODY};font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
                They are attached, packaged for <strong style="color:${NAVY};">${packLabel}</strong>.
                Each skill carries the thinking behind one pattern, what it fixes and what to avoid,
                so you stop shipping AI slop and always know why a screen works that way.
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding:0 32px;">
              <div style="height:1px;background:${RULE};"></div>
            </td>
          </tr>
          <tr>
            <td style="padding:24px 32px 8px;">
              <p style="margin:0 0 16px;font-size:13px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:${NAVY};font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
                Setting them up
              </p>
              <table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
                ${stepsHtml}
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding:16px 32px 32px;">
              <a href="https://www.aiuxdesign.guide/patterns"
                 style="display:inline-block;background:${NAVY};color:#ffffff;text-decoration:none;font-size:15px;font-weight:600;padding:13px 26px;border-radius:999px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
                Read the patterns
              </a>
              <p style="margin:16px 0 0;font-size:14px;line-height:1.6;color:${BODY};font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
                Every pattern is written up with real examples from shipped products and the
                reasoning behind each move.
              </p>
            </td>
          </tr>
        </table>
        <p style="max-width:560px;margin:20px auto 0;font-size:12px;line-height:1.6;color:#6b7280;text-align:center;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
          You are also on the daily AI UX newsletter. Every issue has an unsubscribe link.
        </p>
      </td>
    </tr>
  </table>
</body>
      `,
      attachments: [
        {
          filename,
          content: Buffer.from(zipped).toString('base64'),
        },
      ],
    });

    return NextResponse.json({ sent: true }, { status: 200 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }
    // Best-effort by contract: log it, tell the caller it did not send, and let
    // the visitor keep the download they already have.
    console.error('[skills/send] failed:', error);
    return NextResponse.json({ sent: false, reason: 'send-failed' }, { status: 200 });
  }
}
