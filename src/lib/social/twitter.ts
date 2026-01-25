import { encrypt, decrypt } from './encryption';

const TWITTER_API_BASE = 'https://api.twitter.com/2';
const TWITTER_AUTH_BASE = 'https://twitter.com/i/oauth2';

interface TwitterConfig {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
}

interface TwitterTokens {
  accessToken: string;
  refreshToken?: string;
  expiresIn?: number;
}

interface TwitterUser {
  id: string;
  name: string;
  username: string;
}

interface TweetResponse {
  id: string;
  text: string;
}

function getConfig(): TwitterConfig {
  const clientId = process.env.TWITTER_CLIENT_ID;
  const clientSecret = process.env.TWITTER_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error('Twitter API credentials not configured');
  }

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const redirectUri = `${baseUrl}/api/social/callback/twitter`;

  return { clientId, clientSecret, redirectUri };
}

/**
 * Generates the OAuth 2.0 authorization URL for Twitter
 * Twitter uses PKCE (Proof Key for Code Exchange) for OAuth 2.0
 */
export function getAuthorizationUrl(state: string, codeChallenge: string): string {
  const config = getConfig();

  const params = new URLSearchParams({
    response_type: 'code',
    client_id: config.clientId,
    redirect_uri: config.redirectUri,
    scope: 'tweet.read tweet.write users.read offline.access',
    state: state,
    code_challenge: codeChallenge,
    code_challenge_method: 'S256',
  });

  return `${TWITTER_AUTH_BASE}/authorize?${params.toString()}`;
}

/**
 * Exchanges an authorization code for access tokens
 */
export async function exchangeCodeForTokens(
  code: string,
  codeVerifier: string
): Promise<TwitterTokens> {
  const config = getConfig();

  const params = new URLSearchParams({
    grant_type: 'authorization_code',
    code: code,
    redirect_uri: config.redirectUri,
    code_verifier: codeVerifier,
  });

  const credentials = Buffer.from(`${config.clientId}:${config.clientSecret}`).toString('base64');

  const response = await fetch(`${TWITTER_AUTH_BASE}/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${credentials}`,
    },
    body: params.toString(),
  });

  const responseText = await response.text();

  if (!response.ok) {
    console.error('Twitter token exchange failed:', response.status, responseText);
    throw new Error(`Twitter token exchange failed (${response.status}): ${responseText}`);
  }

  let data;
  try {
    data = JSON.parse(responseText);
  } catch (e) {
    console.error('Twitter returned invalid JSON:', responseText);
    throw new Error(`Twitter returned invalid JSON: ${responseText.substring(0, 200)}`);
  }

  return {
    accessToken: data.access_token,
    refreshToken: data.refresh_token,
    expiresIn: data.expires_in,
  };
}

/**
 * Refreshes an expired access token using a refresh token
 */
export async function refreshAccessToken(refreshToken: string): Promise<TwitterTokens> {
  const config = getConfig();

  const params = new URLSearchParams({
    grant_type: 'refresh_token',
    refresh_token: refreshToken,
  });

  const credentials = Buffer.from(`${config.clientId}:${config.clientSecret}`).toString('base64');

  const response = await fetch(`${TWITTER_AUTH_BASE}/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${credentials}`,
    },
    body: params.toString(),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Twitter token refresh failed: ${error}`);
  }

  const data = await response.json();

  return {
    accessToken: data.access_token,
    refreshToken: data.refresh_token,
    expiresIn: data.expires_in,
  };
}

/**
 * Gets the authenticated user's profile information
 */
export async function getAuthenticatedUser(accessToken: string): Promise<TwitterUser> {
  const response = await fetch(`${TWITTER_API_BASE}/users/me`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to get Twitter user: ${error}`);
  }

  const data = await response.json();
  return data.data;
}

/**
 * Posts a single tweet
 */
export async function postTweet(
  accessToken: string,
  text: string,
  replyToId?: string
): Promise<TweetResponse> {
  const body: { text: string; reply?: { in_reply_to_tweet_id: string } } = { text };

  if (replyToId) {
    body.reply = { in_reply_to_tweet_id: replyToId };
  }

  const response = await fetch(`${TWITTER_API_BASE}/tweets`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to post tweet: ${error}`);
  }

  const data = await response.json();
  return {
    id: data.data.id,
    text: data.data.text,
  };
}

/**
 * Posts a thread (multiple tweets in reply to each other)
 * Returns the first tweet's response
 */
export async function postThread(
  accessToken: string,
  tweets: string[]
): Promise<{ firstTweetId: string; tweetIds: string[] }> {
  if (tweets.length === 0) {
    throw new Error('Thread must contain at least one tweet');
  }

  const tweetIds: string[] = [];
  let previousId: string | undefined;

  for (const tweetText of tweets) {
    const response = await postTweet(accessToken, tweetText, previousId);
    tweetIds.push(response.id);
    previousId = response.id;
  }

  return {
    firstTweetId: tweetIds[0],
    tweetIds,
  };
}

/**
 * Generates a code verifier and challenge for PKCE
 */
export function generatePKCE(): { verifier: string; challenge: string } {
  const { randomBytes, createHash } = require('crypto');

  // Generate a random 32-byte verifier
  const verifier = randomBytes(32).toString('base64url');

  // Create SHA-256 hash and encode as base64url
  const hash = createHash('sha256').update(verifier).digest();
  const challenge = hash.toString('base64url');

  return { verifier, challenge };
}

/**
 * Generates a random state parameter for OAuth
 */
export function generateState(): string {
  const { randomBytes } = require('crypto');
  return randomBytes(16).toString('hex');
}

/**
 * Constructs the URL for a tweet
 */
export function getTweetUrl(username: string, tweetId: string): string {
  return `https://twitter.com/${username}/status/${tweetId}`;
}

/**
 * Validates that content fits within Twitter's character limit
 */
export function validateTweetLength(text: string): { valid: boolean; length: number } {
  // Twitter counts URLs as 23 characters regardless of actual length
  // For simplicity, we'll do a basic character count
  const length = text.length;
  return {
    valid: length <= 280,
    length,
  };
}

/**
 * Helper to encrypt tokens for storage
 */
export function encryptTokens(tokens: TwitterTokens): {
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
}): TwitterTokens {
  return {
    accessToken: decrypt(encryptedTokens.accessToken),
    refreshToken: encryptedTokens.refreshToken
      ? decrypt(encryptedTokens.refreshToken)
      : undefined,
  };
}
