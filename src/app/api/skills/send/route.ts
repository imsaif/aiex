import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { zipSync, strToU8 } from 'fflate';
import patterns from '@/data/patterns';
import { composeSkillPack, skillPackFilename } from '@/lib/skills/composePack';
import { composeSingleSkillZipEntries, singleSkillFilename } from '@/lib/skills/composeSingleSkill';
import { resend } from '@/lib/resend';
import { PACK_TARGETS, renderPackEmail } from '@/lib/skills/packEmail';

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
  // Mirrors the form's chooser; see packEmail.ts for what each one means.
  target: z.enum(PACK_TARGETS).default('unsure'),
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
      target === 'code'
        ? composeSkillPack(patterns, [])
        : composeSingleSkillZipEntries(patterns);
    const filename = target === 'code' ? skillPackFilename() : singleSkillFilename();

    const zipped = zipSync(
      Object.fromEntries(Object.entries(files).map(([path, body]) => [path, strToU8(body)])),
      { level: 6 }
    );

    const { subject, html } = renderPackEmail(target);

    await resend.emails.send({
      from: 'AIUX Design Guide <imran@aiuxdesign.guide>',
      replyTo: 'imranrizom@gmail.com',
      to: email,
      subject,
      html,
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
