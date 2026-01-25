import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { isAdminAuthenticated } from '@/lib/admin-auth';

interface SocialAccountResponse {
  id: string;
  platform: 'twitter' | 'linkedin';
  accountName: string;
  isActive: boolean;
  tokenExpiry: string | null;
  isExpired: boolean;
  createdAt: string;
}

/**
 * Get all connected social accounts
 * GET /api/social/accounts
 */
export async function GET(request: NextRequest) {
  if (!(await isAdminAuthenticated(request))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const accounts = await prisma.socialAccount.findMany({
      select: {
        id: true,
        platform: true,
        accountName: true,
        isActive: true,
        tokenExpiry: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    const response: SocialAccountResponse[] = accounts.map((account) => ({
      id: account.id,
      platform: account.platform as 'twitter' | 'linkedin',
      accountName: account.accountName,
      isActive: account.isActive,
      tokenExpiry: account.tokenExpiry?.toISOString() || null,
      isExpired: account.tokenExpiry ? new Date() > account.tokenExpiry : false,
      createdAt: account.createdAt.toISOString(),
    }));

    return NextResponse.json({ accounts: response });
  } catch (error) {
    console.error('Failed to fetch social accounts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch social accounts' },
      { status: 500 }
    );
  }
}
