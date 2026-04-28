import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { isAdminAuthenticated } from '@/lib/admin-auth';

interface BeehiivSubscription {
  id: string;
  email: string;
  status: string;
}

async function fetchAllBeehiivSubscriptions(
  apiKey: string,
  pubId: string,
  status: 'active' | 'inactive'
): Promise<BeehiivSubscription[]> {
  const all: BeehiivSubscription[] = [];
  let page = 1;
  const limit = 100;

  while (true) {
    const url = `https://api.beehiiv.com/v2/publications/${pubId}/subscriptions?status=${status}&limit=${limit}&page=${page}`;
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${apiKey}` },
    });

    if (!res.ok) {
      const body = await res.text();
      throw new Error(`Beehiiv API ${res.status}: ${body.slice(0, 300)}`);
    }

    const json = (await res.json()) as { data?: BeehiivSubscription[]; total_results?: number };
    const batch = json.data || [];
    all.push(...batch);

    if (batch.length < limit) break;
    page += 1;
    if (page > 50) break;
  }

  return all;
}

export async function POST(request: NextRequest) {
  if (!(await isAdminAuthenticated(request))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const apiKey = process.env.BEEHIIV_API_KEY;
  const pubId = process.env.BEEHIIV_PUBLICATION_ID;

  if (!apiKey || !pubId) {
    return NextResponse.json(
      { error: 'Beehiiv not configured (missing BEEHIIV_API_KEY or BEEHIIV_PUBLICATION_ID)' },
      { status: 500 }
    );
  }

  try {
    const beehiivActive = await fetchAllBeehiivSubscriptions(apiKey, pubId, 'active');
    const beehiivActiveEmails = new Set(beehiivActive.map((s) => s.email.toLowerCase()));

    const localAll = await prisma.subscriber.findMany({
      select: { id: true, email: true, active: true },
    });
    const localByEmail = new Map(localAll.map((s) => [s.email.toLowerCase(), s]));

    // Pass 1: Beehiiv-active emails → ensure local row exists + active=true
    let createdCount = 0;
    let reactivatedCount = 0;
    for (const sub of beehiivActive) {
      const lower = sub.email.toLowerCase();
      const local = localByEmail.get(lower);
      if (!local) {
        try {
          await prisma.subscriber.create({
            data: { email: sub.email, active: true, emailFrequency: 'all' },
          });
          createdCount += 1;
        } catch (err) {
          console.warn('[reconcile] failed to create local row for', sub.email, err);
        }
      } else if (!local.active) {
        await prisma.subscriber.update({
          where: { id: local.id },
          data: { active: true, unsubscribeReason: null, unsubscribedAt: null },
        });
        reactivatedCount += 1;
      }
    }

    // Pass 2: local active emails not in Beehiiv-active → mark inactive
    const localActive = localAll.filter((s) => s.active);
    const stale = localActive.filter((s) => !beehiivActiveEmails.has(s.email.toLowerCase()));
    let markedInactive = 0;
    if (stale.length > 0) {
      const result = await prisma.subscriber.updateMany({
        where: { id: { in: stale.map((s) => s.id) } },
        data: {
          active: false,
          unsubscribeReason: 'beehiiv-removed (reconciled)',
          unsubscribedAt: new Date(),
        },
      });
      markedInactive = result.count;
    }

    const [activeCount, inactiveCount] = await Promise.all([
      prisma.subscriber.count({ where: { active: true } }),
      prisma.subscriber.count({ where: { active: false } }),
    ]);

    return NextResponse.json({
      success: true,
      beehiivActive: beehiivActive.length,
      localActiveBefore: localActive.length,
      createdFromBeehiiv: createdCount,
      reactivated: reactivatedCount,
      markedInactive,
      staleEmails: stale.map((s) => s.email),
      stats: {
        active: activeCount,
        inactive: inactiveCount,
        total: activeCount + inactiveCount,
      },
    });
  } catch (error) {
    console.error('[reconcile] failed:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Reconcile failed' },
      { status: 500 }
    );
  }
}
