import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { askGuidebot, type GuidebotTurn } from '@/lib/guidebot/agent';
import { checkGuidebotLimit, GUIDEBOT_EVENT } from '@/lib/guidebot/limits';
import { hashIp } from '@/lib/audit/sample';
import { isSyntheticUserAgent } from '@/lib/analytics/bots';
import { isAdminAuthenticated } from '@/lib/admin-auth';
import { prisma } from '@/lib/prisma';
import { getResend } from '@/lib/resend';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 60;

const HANDOFF_TO = process.env.GUIDEBOT_HANDOFF_TO ?? 'imranrizom@gmail.com';
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function readHistory(value: unknown): GuidebotTurn[] | null {
  if (value === undefined) return [];
  if (!Array.isArray(value) || value.length > 8) return null;
  const turns: GuidebotTurn[] = [];
  for (const t of value) {
    if (!t || typeof t !== 'object') return null;
    const { role, content } = t as Record<string, unknown>;
    if ((role !== 'user' && role !== 'assistant') || typeof content !== 'string' || content.length > 4000) return null;
    turns.push({ role, content });
  }
  return turns;
}

export async function POST(request: NextRequest) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json({ error: 'ANTHROPIC_API_KEY not configured' }, { status: 500 });
  }
  const userAgent = request.headers.get('user-agent');
  if (isSyntheticUserAgent(userAgent)) {
    return NextResponse.json({ error: 'Not available' }, { status: 403 });
  }

  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }
  const question = typeof body.question === 'string' ? body.question.trim() : '';
  if (question.length < 2 || question.length > 600) {
    return NextResponse.json({ error: 'Ask a question between 2 and 600 characters.' }, { status: 400 });
  }
  const history = readHistory(body.history);
  if (!history) return NextResponse.json({ error: 'Invalid history' }, { status: 400 });

  const ip =
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || request.headers.get('x-real-ip') || 'unknown';
  const ipHash = hashIp(ip);
  // Local runs share the production database, so they are logged as tests,
  // never as visitors, and the daily limit doesn't apply to them.
  let role: string | null = process.env.VERCEL_ENV === 'production' ? null : 'test';
  try {
    if (await isAdminAuthenticated(request)) role = 'admin';
  } catch {
    /* treat as a visitor */
  }

  if (role === null) {
    const limit = await checkGuidebotLimit(ipHash);
    if (!limit.allowed) {
      return NextResponse.json(
        { error: "You've reached today's limit of questions. Guidebot will be back tomorrow." },
        { status: 429 }
      );
    }
  }

  let result;
  try {
    result = await askGuidebot(question, new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY }), history);
  } catch (err) {
    console.error('[guidebot] model call failed:', err);
    return NextResponse.json({ error: 'Guidebot could not answer just now. Please try again.' }, { status: 502 });
  }

  // Every question is kept so answers can be reviewed against the test set.
  try {
    await prisma.uiEvent.create({
      data: {
        name: GUIDEBOT_EVENT,
        path: '/guides',
        ipHash,
        userAgent,
        role,
        properties: {
          question,
          answer: result.answer.slice(0, 4000),
          turn: history.length / 2 + 1,
          tools: result.toolCalls.map((t) => t.name),
          handoff: result.handoffs.length > 0,
          inputTokens: result.inputTokens,
          outputTokens: result.outputTokens,
        },
      },
    });
  } catch (err) {
    console.error('[guidebot] failed to log question:', err);
  }

  for (const h of result.handoffs) {
    try {
      const replyTo = h.visitor_email && EMAIL_RE.test(h.visitor_email) ? h.visitor_email : undefined;
      await getResend().emails.send({
        from: 'Guidebot <imran@aiuxdesign.guide>',
        to: HANDOFF_TO,
        ...(replyTo ? { replyTo } : {}),
        subject: 'Guidebot hand-off',
        text: [
          `Summary: ${h.summary}`,
          `Visitor email: ${h.visitor_email ?? 'not given'}`,
          '',
          `Last question: ${question}`,
          '',
          'Nothing has been refunded or changed. Reply to the visitor directly.',
        ].join('\n'),
      });
    } catch (err) {
      console.error('[guidebot] hand-off email failed:', err);
    }
  }

  return NextResponse.json({ answer: result.answer });
}
