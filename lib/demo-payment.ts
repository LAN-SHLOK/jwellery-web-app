import { createHmac, timingSafeEqual } from 'crypto';

const DEFAULT_DEMO_PAYMENT_TTL_MS = 30 * 60 * 1000;

function getDemoPaymentSecret() {
  return process.env.DEMO_PAYMENT_SECRET || process.env.JWT_SECRET || 'dev-demo-payment-secret';
}

function toBase64Url(value: string) {
  return Buffer.from(value, 'utf8').toString('base64url');
}

function fromBase64Url(value: string) {
  return Buffer.from(value, 'base64url').toString('utf8');
}

function signPayload(payload: string) {
  return createHmac('sha256', getDemoPaymentSecret()).update(payload).digest('base64url');
}

export function createDemoPaymentToken({
  expiresAt = Date.now() + DEFAULT_DEMO_PAYMENT_TTL_MS,
  orderId,
  phone,
}: {
  expiresAt?: number;
  orderId: string;
  phone: string;
}) {
  const payload = JSON.stringify({ expiresAt, orderId, phone });
  const encodedPayload = toBase64Url(payload);
  const signature = signPayload(encodedPayload);

  return `${encodedPayload}.${signature}`;
}

export function verifyDemoPaymentToken({
  orderId,
  phone,
  token,
}: {
  orderId: string;
  phone: string;
  token: string;
}) {
  const parts = token.split('.');

  if (parts.length !== 2) {
    return false;
  }

  const [encodedPayload, signature] = parts;
  const expectedSignature = signPayload(encodedPayload);

  const received = Buffer.from(signature, 'utf8');
  const expected = Buffer.from(expectedSignature, 'utf8');

  if (received.length !== expected.length || !timingSafeEqual(received, expected)) {
    return false;
  }

  try {
    const parsed = JSON.parse(fromBase64Url(encodedPayload)) as {
      expiresAt: number;
      orderId: string;
      phone: string;
    };

    if (parsed.expiresAt < Date.now()) {
      return false;
    }

    return parsed.orderId === orderId && parsed.phone === phone;
  } catch {
    return false;
  }
}
