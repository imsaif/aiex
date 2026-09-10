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

    const install =
      target === 'claude'
        ? `<li>Open Claude, go to <strong>Customize &rarr; Skills</strong>, click <strong>+ Create skill</strong> and upload the zip.</li>
           <li>That is it. Claude Design and the Claude app both pick it up.</li>`
        : `<li>Unzip it into your project. The files land in <code>.claude/skills/</code>.</li>
           <li>Claude Code reads them on its own. Nothing to remember at the prompt.</li>`;

    await resend.emails.send({
      from: 'AI UX Daily <imran@aiuxdesign.guide>',
      replyTo: 'imranrizom@gmail.com',
      to: email,
      subject: `Your ${PATTERN_COUNT} AI UX skills`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; color: #1a1a1a;">
          <h1 style="font-size: 22px; margin: 0 0 12px;">Your ${PATTERN_COUNT} AI UX skills</h1>
          <p style="font-size: 15px; line-height: 1.6; margin: 0 0 16px;">
            Attached. Each skill carries the thinking behind one pattern, what it fixes and what to
            avoid, so you stop shipping AI slop and always know why a screen works that way.
          </p>
          <ol style="font-size: 15px; line-height: 1.7; margin: 0 0 20px; padding-left: 20px;">
            ${install}
          </ol>
          <p style="font-size: 15px; line-height: 1.6; margin: 0 0 16px;">
            Every pattern is written up at
            <a href="https://www.aiuxdesign.guide/patterns" style="color: #1a1a1a;">aiuxdesign.guide/patterns</a>,
            with real examples and the reasoning behind each move.
          </p>
          <p style="font-size: 13px; line-height: 1.6; color: #666; margin: 24px 0 0;">
            You are also on the daily AI UX newsletter. Every issue has an unsubscribe link.
          </p>
        </div>
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
