import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { isAdminAuthenticated } from '@/lib/admin-auth';
import { NEWSLETTER_SOURCES } from '@/types/newsletter';
import type { NewsletterSource } from '@/types/newsletter';

// GET - List all subscribers (requires admin auth)
export async function GET(request: NextRequest) {
  if (!(await isAdminAuthenticated(request))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const status = searchParams.get('status'); // 'active', 'inactive', or null for all
    const search = searchParams.get('search') || '';

    const where: {
      active?: boolean;
      email?: { contains: string; mode: 'insensitive' };
      emailFrequency?: string | { not: string };
      source?: string | null;
    } = {};

    // status options:
    //   active             → active=true
    //   inactive           → active=false (any reason)
    //   self_unsubscribed  → active=false AND frequency='none' (clicked our /unsubscribe page)
    //   beehiiv_removed    → active=false AND frequency!='none' (Beehiiv dropped via bounce/complaint/footer)
    if (status === 'active') where.active = true;
    if (status === 'inactive') where.active = false;
    if (status === 'self_unsubscribed') {
      where.active = false;
      where.emailFrequency = 'none';
    }
    if (status === 'beehiiv_removed') {
      where.active = false;
      where.emailFrequency = { not: 'none' };
    }
    if (search) where.email = { contains: search, mode: 'insensitive' };

    // Filter by frequency preference (separate from status)
    const frequency = searchParams.get('frequency');
    if (frequency && ['all', 'weekly', 'none'].includes(frequency) && !where.emailFrequency) {
      where.emailFrequency = frequency;
    }

    // Filter by signup surface. 'unknown' selects the pre-2026-08 rows that
    // predate the `source` column.
    const source = searchParams.get('source');
    if (source === 'unknown') where.source = null;
    else if (source && NEWSLETTER_SOURCES.includes(source as NewsletterSource)) where.source = source;

    const [
      subscribers,
      total,
      activeCount,
      inactiveCount,
      selfUnsubscribedCount,
      beehiivRemovedCount,
    ] = await Promise.all([
      prisma.subscriber.findMany({
        where,
        orderBy: { subscribedAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
        select: {
          id: true,
          email: true,
          subscribedAt: true,
          active: true,
          updatedAt: true,
          emailFrequency: true,
          unsubscribeReason: true,
          unsubscribedAt: true,
          source: true,
        },
      }),
      prisma.subscriber.count({ where }),
      prisma.subscriber.count({ where: { active: true } }),
      prisma.subscriber.count({ where: { active: false } }),
      prisma.subscriber.count({ where: { active: false, emailFrequency: 'none' } }),
      prisma.subscriber.count({ where: { active: false, emailFrequency: { not: 'none' } } }),
    ]);

    // Acquisition mix: signups and churn per surface, across the whole list (not
    // the current page or filter). `null` source = rows predating the column.
    const bySourceRaw = await prisma.subscriber.groupBy({
      by: ['source', 'active'],
      _count: { _all: true },
    });
    const bySource: Record<string, { active: number; inactive: number }> = {};
    for (const row of bySourceRaw) {
      const key = row.source ?? 'unknown';
      bySource[key] = bySource[key] || { active: 0, inactive: 0 };
      bySource[key][row.active ? 'active' : 'inactive'] += row._count._all;
    }

    return NextResponse.json({
      subscribers,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
      stats: {
        active: activeCount,
        inactive: inactiveCount,
        selfUnsubscribed: selfUnsubscribedCount,
        beehiivRemoved: beehiivRemovedCount,
        total: activeCount + inactiveCount,
      },
      bySource,
    });
  } catch (error) {
    console.error('Failed to fetch subscribers:', error);
    return NextResponse.json({ error: 'Failed to fetch subscribers' }, { status: 500 });
  }
}

// PATCH - Update subscriber status (requires admin auth)
export async function PATCH(request: NextRequest) {
  if (!(await isAdminAuthenticated(request))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { id, active } = body;

    if (!id) {
      return NextResponse.json({ error: 'Subscriber ID is required' }, { status: 400 });
    }

    if (typeof active !== 'boolean') {
      return NextResponse.json({ error: 'Active status must be a boolean' }, { status: 400 });
    }

    const subscriber = await prisma.subscriber.update({
      where: { id },
      data: { active },
      select: {
        id: true,
        email: true,
        active: true,
      },
    });

    return NextResponse.json({
      success: true,
      subscriber,
      message: `Subscriber ${active ? 'activated' : 'deactivated'} successfully`,
    });
  } catch (error) {
    console.error('Failed to update subscriber:', error);
    return NextResponse.json({ error: 'Failed to update subscriber' }, { status: 500 });
  }
}

// DELETE - Remove subscriber (requires admin auth)
export async function DELETE(request: NextRequest) {
  if (!(await isAdminAuthenticated(request))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Subscriber ID is required' }, { status: 400 });
    }

    await prisma.subscriber.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: 'Subscriber deleted successfully',
    });
  } catch (error) {
    console.error('Failed to delete subscriber:', error);
    return NextResponse.json({ error: 'Failed to delete subscriber' }, { status: 500 });
  }
}
