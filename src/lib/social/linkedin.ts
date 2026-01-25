import { encrypt, decrypt } from './encryption';

const LINKEDIN_AUTH_BASE = 'https://www.linkedin.com/oauth/v2';
const LINKEDIN_API_BASE = 'https://api.linkedin.com/v2';

interface LinkedInConfig {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
}

interface LinkedInTokens {
  accessToken: string;
  refreshToken?: string;
  expiresIn?: number;
}

interface LinkedInUser {
  id: string;
  firstName: string;
  lastName: string;
  profileUrl?: string;
}

interface LinkedInPostResponse {
  id: string;
  activity: string;
}

function getConfig(): LinkedInConfig {
  const clientId = process.env.LINKEDIN_CLIENT_ID;
  const clientSecret = process.env.LINKEDIN_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error('LinkedIn API credentials not configured');
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  const redirectUri = `${baseUrl}/api/social/callback/linkedin`;

  return { clientId, clientSecret, redirectUri };
}

/**
 * Generates the OAuth 2.0 authorization URL for LinkedIn
 */
export function getAuthorizationUrl(state: string): string {
  const config = getConfig();

  const params = new URLSearchParams({
    response_type: 'code',
    client_id: config.clientId,
    redirect_uri: config.redirectUri,
    scope: 'openid profile w_member_social',
    state: state,
  });

  return `${LINKEDIN_AUTH_BASE}/authorization?${params.toString()}`;
}

/**
 * Exchanges an authorization code for access tokens
 */
export async function exchangeCodeForTokens(code: string): Promise<LinkedInTokens> {
  const config = getConfig();

  const params = new URLSearchParams({
    grant_type: 'authorization_code',
    code: code,
    redirect_uri: config.redirectUri,
    client_id: config.clientId,
    client_secret: config.clientSecret,
  });

  const response = await fetch(`${LINKEDIN_AUTH_BASE}/accessToken`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: params.toString(),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`LinkedIn token exchange failed: ${error}`);
  }

  const data = await response.json();

  return {
    accessToken: data.access_token,
    refreshToken: data.refresh_token,
    expiresIn: data.expires_in,
  };
}

/**
 * Refreshes an expired access token using a refresh token
 * Note: LinkedIn refresh tokens have limited availability
 */
export async function refreshAccessToken(refreshToken: string): Promise<LinkedInTokens> {
  const config = getConfig();

  const params = new URLSearchParams({
    grant_type: 'refresh_token',
    refresh_token: refreshToken,
    client_id: config.clientId,
    client_secret: config.clientSecret,
  });

  const response = await fetch(`${LINKEDIN_AUTH_BASE}/accessToken`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: params.toString(),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`LinkedIn token refresh failed: ${error}`);
  }

  const data = await response.json();

  return {
    accessToken: data.access_token,
    refreshToken: data.refresh_token,
    expiresIn: data.expires_in,
  };
}

/**
 * Gets the authenticated user's profile information using OpenID userinfo endpoint
 */
export async function getAuthenticatedUser(accessToken: string): Promise<LinkedInUser> {
  // First, get the user's sub (member ID) from userinfo
  const userinfoResponse = await fetch('https://api.linkedin.com/v2/userinfo', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!userinfoResponse.ok) {
    const error = await userinfoResponse.text();
    throw new Error(`Failed to get LinkedIn userinfo: ${error}`);
  }

  const userinfo = await userinfoResponse.json();

  return {
    id: userinfo.sub,
    firstName: userinfo.given_name || '',
    lastName: userinfo.family_name || '',
    profileUrl: userinfo.picture,
  };
}

/**
 * Creates a text post on LinkedIn
 * Uses the Posts API (v2) for creating UGC posts
 */
export async function createPost(
  accessToken: string,
  authorId: string,
  text: string
): Promise<LinkedInPostResponse> {
  const postBody = {
    author: `urn:li:person:${authorId}`,
    lifecycleState: 'PUBLISHED',
    specificContent: {
      'com.linkedin.ugc.ShareContent': {
        shareCommentary: {
          text: text,
        },
        shareMediaCategory: 'NONE',
      },
    },
    visibility: {
      'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC',
    },
  };

  const response = await fetch(`${LINKEDIN_API_BASE}/ugcPosts`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
      'X-Restli-Protocol-Version': '2.0.0',
    },
    body: JSON.stringify(postBody),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to create LinkedIn post: ${error}`);
  }

  const data = await response.json();

  // Extract the activity URN from the response
  const postId = data.id;
  const activityUrn = postId.replace('urn:li:share:', 'urn:li:activity:');

  return {
    id: postId,
    activity: activityUrn,
  };
}

/**
 * Generates a random state parameter for OAuth
 */
export function generateState(): string {
  const { randomBytes } = require('crypto');
  return randomBytes(16).toString('hex');
}

/**
 * Constructs the URL for a LinkedIn post
 * Note: LinkedIn post URLs require the activity ID
 */
export function getPostUrl(activityUrn: string): string {
  // Extract the numeric ID from the activity URN
  const activityId = activityUrn.replace('urn:li:activity:', '');
  return `https://www.linkedin.com/feed/update/urn:li:activity:${activityId}`;
}

/**
 * Validates that content fits within LinkedIn's character limit
 * LinkedIn posts can be up to 3000 characters
 */
export function validatePostLength(text: string): { valid: boolean; length: number } {
  const length = text.length;
  return {
    valid: length <= 3000,
    length,
  };
}

/**
 * Helper to encrypt tokens for storage
 */
export function encryptTokens(tokens: LinkedInTokens): {
  accessToken: string;
  refreshToken: string | null;
} {
  return {
    accessToken: encrypt(tokens.accessToken),
    refreshToken: tokens.refreshToken ? encrypt(tokens.refreshToken) : null,
  };
}

/**
 * Helper to decrypt tokens from storage
 */
export function decryptTokens(encryptedTokens: {
  accessToken: string;
  refreshToken?: string | null;
}): LinkedInTokens {
  return {
    accessToken: decrypt(encryptedTokens.accessToken),
    refreshToken: encryptedTokens.refreshToken
      ? decrypt(encryptedTokens.refreshToken)
      : undefined,
  };
}

/**
 * Formats a display name for a LinkedIn account
 */
export function formatAccountName(user: LinkedInUser): string {
  return `${user.firstName} ${user.lastName}`.trim() || 'LinkedIn User';
}
