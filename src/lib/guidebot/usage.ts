import { prisma } from '@/lib/prisma';
import { realPeople } from '@/lib/analytics/growth-data';
import { GUIDEBOT_EVENT } from './limits';
import { GUIDEBOT_STARTERS } from './starters';

const DAY = 86_400_000;
const WINDOW_DAYS = 28;

// Haiku 5.5: $0.10 per million input tokens, $0.50 per million output tokens.
const COST_PER_INPUT = 0.1 / 1e6;
const COST_PER_OUTPUT = 0.5 / 1e6;

export interface GuidebotUsage {
  /** People who opened the chat (anonymous visitor id), and total opens. Starters show on every open. */
  openedBy: number;
  opens: number;
  /** Questions that were a starter, per starter, and questions typed by the visitor. */
  starters: Array<{ question: string; picked: number }>;
  typed: number;
  /** People who asked at least one question (hashed IP; the server has no visitor id). */
  askedBy: number;
  questions: number;
  handoffs: number;
  /** People who clicked a link in an answer, and total clicks. */
  clickedBy: number;
  clicks: number;
  costUsd: number;
  recent: Array<{ at: Date; question: string; handoff: boolean }>;
}

type Props = Record<string, unknown> | null;

/** Last 4 weeks, real visitors only (same filter as the rest of the Growth page). */
export async function getGuidebotUsage(now = new Date()): Promise<GuidebotUsage> {
  const since = new Date(now.getTime() - WINDOW_DAYS * DAY);
  const rows = await prisma.uiEvent.findMany({
    where: {
      ...realPeople,
      createdAt: { gte: since },
      name: { in: [GUIDEBOT_EVENT, 'guidebot_opened', 'guidebot_link_clicked'] },
    },
    select: { name: true, ipHash: true, properties: true, createdAt: true },
    orderBy: { createdAt: 'desc' },
  });

  const vid = (p: Props) => (typeof p?.vid === 'string' ? p.vid : null);
  const openers = new Set<string>();
  const askers = new Set<string>();
  const clickers = new Set<string>();
  let questions = 0;
  let opens = 0;
  const picked = new Map<string, number>(GUIDEBOT_STARTERS.map((q) => [q, 0]));
  let handoffs = 0;
  let clicks = 0;
  let inTok = 0;
  let outTok = 0;
  const recent: GuidebotUsage['recent'] = [];

  for (const r of rows) {
    const p = r.properties as Props;
    if (r.name === 'guidebot_opened') {
      opens++;
      const v = vid(p);
      if (v) openers.add(v);
    } else if (r.name === 'guidebot_link_clicked') {
      clicks++;
      const v = vid(p);
      if (v) clickers.add(v);
    } else {
      questions++;
      if (typeof p?.question === 'string' && picked.has(p.question)) {
        picked.set(p.question, (picked.get(p.question) ?? 0) + 1);
      }
      if (r.ipHash) askers.add(r.ipHash);
      if (p?.handoff === true) handoffs++;
      inTok += typeof p?.inputTokens === 'number' ? p.inputTokens : 0;
      outTok += typeof p?.outputTokens === 'number' ? p.outputTokens : 0;
      if (recent.length < 10 && typeof p?.question === 'string') {
        recent.push({ at: r.createdAt, question: p.question, handoff: p?.handoff === true });
      }
    }
  }

  return {
    openedBy: openers.size,
    opens,
    starters: GUIDEBOT_STARTERS.map((q) => ({ question: q, picked: picked.get(q) ?? 0 })),
    typed: questions - Array.from(picked.values()).reduce((a, b) => a + b, 0),
    askedBy: askers.size,
    questions,
    handoffs,
    clickedBy: clickers.size,
    clicks,
    costUsd: inTok * COST_PER_INPUT + outTok * COST_PER_OUTPUT,
    recent,
  };
}
