import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { isAdminAuthenticated } from '@/lib/admin-auth';

/**
 * Delete (disconnect) a social account
 * DELETE /api/social/accounts/[id]
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAdminAuthenticated(request))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;

  if (!id) {
    return NextResponse.json({ error: 'Account ID is required' }, { status: 400 });
  }

  try {
    // Check if account exists
    const account = await prisma.socialAccount.findUnique({
      where: { id },
      select: { id: true, platform: true, accountName: true },
    });

    if (!account) {
      return NextResponse.json({ error: 'Account not found' }, { status: 404 });
    }

    // Delete the account (cascades to related posts via onDelete: Cascade)
    await prisma.socialAccount.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: `Disconnected ${account.accountName} from ${account.platform}`,
    });
  } catch (error) {
    console.error('Failed to delete social account:', error);
    return NextResponse.json(
      { error: 'Failed to disconnect social account' },
      { status: 500 }
    );
  }
}

/**
 * Toggle account active status
 * PATCH /api/social/accounts/[id]
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAdminAuthenticated(request))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;

  if (!id) {
    return NextResponse.json({ error: 'Account ID is required' }, { status: 400 });
  }

  try {
    const body = await request.json();
    const { isActive } = body;

    if (typeof isActive !== 'boolean') {
      return NextResponse.json(
        { error: 'isActive must be a boolean' },
        { status: 400 }
      );
    }

    const account = await prisma.socialAccount.update({
      where: { id },
      data: { isActive },
      select: {
        id: true,
        platform: true,
        accountName: true,
        isActive: true,
      },
    });

    return NextResponse.json({
      success: true,
      account,
    });
  } catch (error) {
    console.error('Failed to update social account:', error);
    return NextResponse.json(
      { error: 'Failed to update social account' },
      { status: 500 }
    );
  }
}
