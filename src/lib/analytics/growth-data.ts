import { prisma } from '@/lib/prisma';
import type { Prisma } from '@/generated/prisma';
import { SYNTHETIC_UA_SUBSTRINGS } from './bots';
import { SIGNUP_EVENT } from './signup-event';
import {
  AUDIT_DONE_EVENT,
  SKILL_PACK_EVENTS,
  buildChannelTable,
  buildPostTable,
  emailClickStats,
  pickFocus,
  type ChannelRow,
  type EmailClickStats,
  type Focus,
  type PostRow,
} from './growth';

const DAY = 86_400_000;
const WINDOW_DAYS = 28;

// The eight URLs the nightly speed test loads. Rows written before the robot
// filter shipped (2026-10) can only be told apart by their tell-tale speed:
// pages "loading" in under 80 ms. These age out of the 30-day vitals log.
const SPEED_TEST_PATHS = [
  '/',
  '/audit',
  '/news',
  '/agent-readability-audit-kit',
  '/patterns/conversational-ui',
  '/patterns/graceful-handoff',
  '/patterns/explainable-ai',
  '/patterns/progressive-disclosure',
];

/** Real people only: not the owner, not test sessions, not robots logged before the filter. */
const realPeople: Prisma.UiEventWhereInput = {
  AND: [
    { OR: [{ role: null }, { role: { notIn: ['admin', 'test', 'monitor'] } }] },
    // Server-written rows (signups) have no user agent; a bare NOT would drop
    // them, because NOT (NULL ILIKE ...) is NULL, not true.
    {
      OR: [
        { userAgent: null },
        { NOT: { OR: SYNTHETIC_UA_SUBSTRINGS.map((s) => ({ userAgent: { contains: s, mode: 'insensitive' as const } })) } },
      ],
    },
  ],
};

export interface GrowthData {
  since: Date;
  weeks: Array<{ start: Date; loads: number }>;
  subscribers: { joined: number; left: number; active: number };
  skillPacks: number;
  auditsFinished: number;
  email: EmailClickStats & { subject: string | null; sentAt: Date | null };
  channels: ChannelRow[];
  focus: Focus;
  posts: PostRow[];
  trackingSince: Date | null;
}

export async function getGrowthData(now = new Date()): Promise<GrowthData> {
  const since = new Date(now.getTime() - WINDOW_DAYS * DAY);
  const weekAgo = new Date(now.getTime() - 7 * DAY);

  const [loads, joined, left, active, conversions, pageViews, firstView, lastDelivery] = await Promise.all([
    prisma.webVitalMetric.findMany({
      where: { metric: 'TTFB', createdAt: { gte: since } },
      select: { path: true, value: true, createdAt: true },
    }),
    prisma.subscriber.count({ where: { subscribedAt: { gte: weekAgo } } }),
    prisma.subscriber.count({ where: { unsubscribedAt: { gte: weekAgo } } }),
    prisma.subscriber.count({ where: { active: true } }),
    prisma.uiEvent.findMany({
      where: { ...realPeople, createdAt: { gte: since }, name: { in: [SIGNUP_EVENT, AUDIT_DONE_EVENT, ...SKILL_PACK_EVENTS] } },
      select: { name: true, properties: true },
    }),
    prisma.uiEvent.findMany({
      where: { ...realPeople, createdAt: { gte: since }, name: 'page_viewed' },
      select: { name: true, properties: true },
    }),
    prisma.uiEvent.findFirst({ where: { name: 'page_viewed' }, orderBy: { createdAt: 'asc' }, select: { createdAt: true } }),
    prisma.uiEvent.findFirst({
      where: { name: 'email_delivered', sessionId: { not: null } },
      orderBy: { createdAt: 'desc' },
      select: { sessionId: true, properties: true, createdAt: true },
    }),
  ]);

  const realLoads = loads.filter((l) => !(SPEED_TEST_PATHS.includes(l.path) && l.value < 80));
  const weeks = [3, 2, 1, 0].map((i) => {
    const start = new Date(now.getTime() - (i + 1) * 7 * DAY);
    const end = new Date(now.getTime() - i * 7 * DAY);
    return { start, loads: realLoads.filter((l) => l.createdAt >= start && l.createdAt < end).length };
  });

  let email: GrowthData['email'] = { delivered: 0, clickers: 0, rate: null, subject: null, sentAt: null };
  if (lastDelivery?.sessionId) {
    const events = await prisma.uiEvent.findMany({
      where: { sessionId: lastDelivery.sessionId, name: { in: ['email_delivered', 'email_clicked'] } },
      select: { name: true, properties: true },
    });
    const p = lastDelivery.properties as { subject?: string } | null;
    email = { ...emailClickStats(events), subject: p?.subject ?? null, sentAt: lastDelivery.createdAt };
  }

  const signups = conversions.filter((c) => c.name === SIGNUP_EVENT);
  const channels = buildChannelTable(pageViews, conversions);

  return {
    since,
    weeks,
    subscribers: { joined, left, active },
    skillPacks: conversions.filter((c) => SKILL_PACK_EVENTS.includes(c.name)).length,
    auditsFinished: conversions.filter((c) => c.name === AUDIT_DONE_EVENT).length,
    email,
    channels,
    focus: pickFocus(channels),
    posts: buildPostTable(pageViews, signups).slice(0, 8),
    trackingSince: firstView?.createdAt ?? null,
  };
}
