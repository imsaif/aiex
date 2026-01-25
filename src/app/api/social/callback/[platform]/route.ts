import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';
import * as twitter from '@/lib/social/twitter';
import * as linkedin from '@/lib/social/linkedin';
import { timingSafeEqual } from 'crypto';

/**
 * Handles OAuth callback from Twitter or LinkedIn
 * GET /api/social/callback/[platform]
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ platform: string }> }
) {
  const { platform } = await params;
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get('code');
  const state = searchParams.get('state');
  const error = searchParams.get('error');
  const errorDescription = searchParams.get('error_description');

  // Base URL for redirects
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  const adminSocialUrl = `${baseUrl}/admin/social`;

  // Handle OAuth errors
  if (error) {
    console.error(`OAuth error for ${platform}:`, error, errorDescription);
    return NextResponse.redirect(
      `${adminSocialUrl}?error=${encodeURIComponent(errorDescription || error)}`
    );
  }

  if (!code || !state) {
    return NextResponse.redirect(
      `${adminSocialUrl}?error=${encodeURIComponent('Missing authorization code or state')}`
    );
  }

  if (platform !== 'twitter' && platform !== 'linkedin') {
    return NextResponse.redirect(
      `${adminSocialUrl}?error=${encodeURIComponent('Invalid platform')}`
    );
  }

  try {
    const cookieStore = await cookies();

    if (platform === 'twitter') {
      // Verify state
      const storedState = cookieStore.get('twitter_oauth_state')?.value;
      if (!storedState || !secureCompare(state, storedState)) {
        return NextResponse.redirect(
          `${adminSocialUrl}?error=${encodeURIComponent('Invalid state parameter')}`
        );
      }

      // Get code verifier
      const codeVerifier = cookieStore.get('twitter_code_verifier')?.value;
      if (!codeVerifier) {
        return NextResponse.redirect(
          `${adminSocialUrl}?error=${encodeURIComponent('Missing code verifier')}`
        );
      }

      // Exchange code for tokens
      const tokens = await twitter.exchangeCodeForTokens(code, codeVerifier);

      // Get user info
      const user = await twitter.getAuthenticatedUser(tokens.accessToken);

      // Encrypt tokens
      const encryptedTokens = twitter.encryptTokens(tokens);

      // Calculate token expiry
      const tokenExpiry = tokens.expiresIn
        ? new Date(Date.now() + tokens.expiresIn * 1000)
        : null;

      // Upsert social account (update if exists, create if not)
      await prisma.socialAccount.upsert({
        where: {
          id: await getExistingAccountId('twitter', user.id),
        },
        update: {
          accountName: `@${user.username}`,
          accessToken: encryptedTokens.accessToken,
          refreshToken: encryptedTokens.refreshToken,
          tokenExpiry,
          isActive: true,
          updatedAt: new Date(),
        },
        create: {
          platform: 'twitter',
          accountName: `@${user.username}`,
          accessToken: encryptedTokens.accessToken,
          refreshToken: encryptedTokens.refreshToken,
          tokenExpiry,
          platformId: user.id,
          isActive: true,
        },
      });

      // Clear OAuth cookies
      cookieStore.delete('twitter_oauth_state');
      cookieStore.delete('twitter_code_verifier');

      return NextResponse.redirect(
        `${adminSocialUrl}?success=${encodeURIComponent(`Connected @${user.username} on X`)}`
      );
    } else {
      // LinkedIn flow
      // Verify state
      const storedState = cookieStore.get('linkedin_oauth_state')?.value;
      if (!storedState || !secureCompare(state, storedState)) {
        return NextResponse.redirect(
          `${adminSocialUrl}?error=${encodeURIComponent('Invalid state parameter')}`
        );
      }

      // Exchange code for tokens
      const tokens = await linkedin.exchangeCodeForTokens(code);

      // Get user info
      const user = await linkedin.getAuthenticatedUser(tokens.accessToken);

      // Encrypt tokens
      const encryptedTokens = linkedin.encryptTokens(tokens);

      // Calculate token expiry (LinkedIn tokens typically last 60 days)
      const tokenExpiry = tokens.expiresIn
        ? new Date(Date.now() + tokens.expiresIn * 1000)
        : null;

      // Format account name
      const accountName = linkedin.formatAccountName(user);

      // Upsert social account
      await prisma.socialAccount.upsert({
        where: {
          id: await getExistingAccountId('linkedin', user.id),
        },
        update: {
          accountName,
          accessToken: encryptedTokens.accessToken,
          refreshToken: encryptedTokens.refreshToken,
          tokenExpiry,
          isActive: true,
          updatedAt: new Date(),
        },
        create: {
          platform: 'linkedin',
          accountName,
          accessToken: encryptedTokens.accessToken,
          refreshToken: encryptedTokens.refreshToken,
          tokenExpiry,
          platformId: user.id,
          isActive: true,
        },
      });

      // Clear OAuth cookie
      cookieStore.delete('linkedin_oauth_state');

      return NextResponse.redirect(
        `${adminSocialUrl}?success=${encodeURIComponent(`Connected ${accountName} on LinkedIn`)}`
      );
    }
  } catch (error) {
    console.error(`Failed to complete ${platform} OAuth:`, error);
    const errorMessage = error instanceof Error ? error.message : 'Authentication failed';
    return NextResponse.redirect(
      `${adminSocialUrl}?error=${encodeURIComponent(errorMessage)}`
    );
  }
}

/**
 * Helper to get existing account ID for upsert
 */
async function getExistingAccountId(
  platform: string,
  platformId: string
): Promise<string> {
  const existing = await prisma.socialAccount.findFirst({
    where: {
      platform,
      platformId,
    },
    select: { id: true },
  });

  // Return existing ID or a new cuid-like placeholder for create
  return existing?.id || `new-${platform}-${Date.now()}`;
}

/**
 * Timing-safe string comparison
 */
function secureCompare(a: string, b: string): boolean {
  if (a.length !== b.length) {
    return false;
  }
  return timingSafeEqual(Buffer.from(a), Buffer.from(b));
}
