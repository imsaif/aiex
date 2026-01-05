import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { isAdminAuthenticated } from '@/lib/admin-auth';

export async function GET(request: NextRequest) {
  if (!(await isAdminAuthenticated(request))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const count = await prisma.subscriber.count({
      where: { active: true },
    });

    return NextResponse.json({ count });
  } catch (error) {
    console.error('Failed to get subscriber count:', error);
    return NextResponse.json({ error: 'Failed to get count' }, { status: 500 });
  }
}
