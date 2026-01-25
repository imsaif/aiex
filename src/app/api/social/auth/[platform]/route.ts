import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { isAdminAuthenticated } from '@/lib/admin-auth';
import * as twitter from '@/lib/social/twitter';
import * as linkedin from '@/lib/social/linkedin';

type Platform = 'twitter' | 'linkedin';

/**
 * Initiates OAuth flow for the specified platform
 * GET /api/social/auth/[platform]
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ platform: string }> }
) {
  // Verify admin authentication
  if (!(await isAdminAuthenticated(request))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { platform } = await params;

  if (platform !== 'twitter' && platform !== 'linkedin') {
    return NextResponse.json(
      { error: 'Invalid platform. Must be "twitter" or "linkedin".' },
      { status: 400 }
    );
  }

  try {
    const cookieStore = await cookies();

    if (platform === 'twitter') {
      // Generate PKCE values and state for Twitter OAuth 2.0
      const { verifier, challenge } = twitter.generatePKCE();
      const state = twitter.generateState();

      // Store verifier and state in cookies for callback verification
      cookieStore.set('twitter_code_verifier', verifier, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 10, // 10 minutes
        path: '/',
      });

      cookieStore.set('twitter_oauth_state', state, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 10, // 10 minutes
        path: '/',
      });

      const authUrl = twitter.getAuthorizationUrl(state, challenge);
      return NextResponse.redirect(authUrl);
    } else {
      // Generate state for LinkedIn OAuth 2.0
      const state = linkedin.generateState();

      // Store state in cookie for callback verification
      cookieStore.set('linkedin_oauth_state', state, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 10, // 10 minutes
        path: '/',
      });

      const authUrl = linkedin.getAuthorizationUrl(state);
      return NextResponse.redirect(authUrl);
    }
  } catch (error) {
    console.error(`Failed to initiate ${platform} OAuth:`, error);
    return NextResponse.json(
      { error: `Failed to initiate ${platform} authentication` },
      { status: 500 }
    );
  }
}
