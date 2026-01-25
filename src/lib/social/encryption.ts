import { createCipheriv, createDecipheriv, randomBytes, scryptSync } from 'crypto';

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 16;
const AUTH_TAG_LENGTH = 16;
const SALT_LENGTH = 32;
const KEY_LENGTH = 32;

function getEncryptionKey(): Buffer {
  const secret = process.env.SOCIAL_TOKEN_SECRET;
  if (!secret) {
    throw new Error('SOCIAL_TOKEN_SECRET environment variable is not set');
  }
  // Use a fixed salt derived from the secret itself for deterministic key derivation
  const salt = scryptSync(secret, 'social-token-salt', SALT_LENGTH);
  return scryptSync(secret, salt, KEY_LENGTH);
}

/**
 * Encrypts a plaintext string using AES-256-GCM
 * Returns a base64 encoded string containing: iv + authTag + ciphertext
 */
export function encrypt(plaintext: string): string {
  const key = getEncryptionKey();
  const iv = randomBytes(IV_LENGTH);

  const cipher = createCipheriv(ALGORITHM, key, iv);

  let encrypted = cipher.update(plaintext, 'utf8', 'hex');
  encrypted += cipher.final('hex');

  const authTag = cipher.getAuthTag();

  // Combine iv + authTag + encrypted data
  const combined = Buffer.concat([
    iv,
    authTag,
    Buffer.from(encrypted, 'hex')
  ]);

  return combined.toString('base64');
}

/**
 * Decrypts an encrypted string that was created by the encrypt function
 * Expects a base64 encoded string containing: iv + authTag + ciphertext
 */
export function decrypt(encryptedData: string): string {
  const key = getEncryptionKey();
  const combined = Buffer.from(encryptedData, 'base64');

  // Extract iv, authTag, and encrypted data
  const iv = combined.subarray(0, IV_LENGTH);
  const authTag = combined.subarray(IV_LENGTH, IV_LENGTH + AUTH_TAG_LENGTH);
  const encrypted = combined.subarray(IV_LENGTH + AUTH_TAG_LENGTH);

  const decipher = createDecipheriv(ALGORITHM, key, iv);
  decipher.setAuthTag(authTag);

  let decrypted = decipher.update(encrypted);
  decrypted = Buffer.concat([decrypted, decipher.final()]);

  return decrypted.toString('utf8');
}

/**
 * Safely encrypts a value, returning null if the value is null/undefined
 */
export function encryptIfPresent(value: string | null | undefined): string | null {
  if (!value) return null;
  return encrypt(value);
}

/**
 * Safely decrypts a value, returning null if the value is null/undefined
 */
export function decryptIfPresent(value: string | null | undefined): string | null {
  if (!value) return null;
  return decrypt(value);
}
