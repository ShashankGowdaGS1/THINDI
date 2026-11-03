import crypto from 'node:crypto';
import { OrderSessionPayload } from '@/types/tracking';

const SESSION_SECRET =
  process.env.ORDER_SESSION_SECRET ||
  process.env.RAZORPAY_KEY_SECRET ||
  'thindi_secure_session_secret_hassan_2026';

/**
 * Generates a cryptographically strong 6-digit numeric OTP.
 */
export function generateOtpCode(): string {
  const randomNum = crypto.randomInt(100000, 1000000);
  return randomNum.toString();
}

/**
 * Hashes an OTP code with HMAC-SHA256 to ensure plaintext codes are never stored in memory or logs.
 */
export function hashOtpCode(code: string): string {
  return crypto.createHmac('sha256', SESSION_SECRET).update(code.trim()).digest('hex');
}

/**
 * Validates a submitted OTP against the stored hash in constant time.
 */
export function verifyOtpCode(submittedCode: string, storedHash: string): boolean {
  if (!submittedCode || !storedHash) return false;
  const computedHash = hashOtpCode(submittedCode);

  const compBuf = Buffer.from(computedHash, 'utf8');
  const storedBuf = Buffer.from(storedHash, 'utf8');

  if (compBuf.length !== storedBuf.length) {
    return false;
  }

  return crypto.timingSafeEqual(compBuf, storedBuf);
}

/**
 * Generates a tamper-proof signed session token for verified order access.
 * Format: orderReference.expiresAt.signature
 */
export function createOrderSessionToken(
  orderReference: string,
  ttlMs = 2 * 60 * 60 * 1000 // 2 hours validity
): string {
  const normalizedRef = orderReference.trim().toUpperCase();
  const expiresAt = Date.now() + ttlMs;
  const payloadStr = `${normalizedRef}.${expiresAt}`;
  const signature = crypto.createHmac('sha256', SESSION_SECRET).update(payloadStr).digest('hex');

  return `${payloadStr}.${signature}`;
}

/**
 * Validates an order session token against the expected order reference.
 */
export function verifyOrderSessionToken(
  token: string | undefined | null,
  expectedOrderReference: string
): boolean {
  if (!token || typeof token !== 'string') return false;

  const parts = token.split('.');
  if (parts.length !== 3) return false;

  const [ref, expiresAtStr, signature] = parts;
  const normalizedExpected = expectedOrderReference.trim().toUpperCase();

  if (ref.toUpperCase() !== normalizedExpected) {
    return false;
  }

  const expiresAt = parseInt(expiresAtStr, 10);
  if (isNaN(expiresAt) || Date.now() > expiresAt) {
    return false;
  }

  const payloadStr = `${ref}.${expiresAtStr}`;
  const expectedSignature = crypto
    .createHmac('sha256', SESSION_SECRET)
    .update(payloadStr)
    .digest('hex');

  const expSigBuf = Buffer.from(expectedSignature, 'utf8');
  const sigBuf = Buffer.from(signature, 'utf8');

  if (expSigBuf.length !== sigBuf.length) {
    return false;
  }

  return crypto.timingSafeEqual(expSigBuf, sigBuf);
}

// In-memory rate limiting store
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

/**
 * Simple in-memory rate limiter for verification endpoints.
 * Limits key (IP or Email) to maxRequests within windowMs.
 */
export function checkRateLimit(
  key: string,
  maxRequests = 5,
  windowMs = 15 * 60 * 1000
): { allowed: boolean; retryAfterSeconds: number } {
  const now = Date.now();
  const record = rateLimitMap.get(key);

  if (!record || now > record.resetAt) {
    rateLimitMap.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, retryAfterSeconds: 0 };
  }

  if (record.count >= maxRequests) {
    const retryAfterSeconds = Math.ceil((record.resetAt - now) / 1000);
    return { allowed: false, retryAfterSeconds };
  }

  record.count += 1;
  rateLimitMap.set(key, record);
  return { allowed: true, retryAfterSeconds: 0 };
}

