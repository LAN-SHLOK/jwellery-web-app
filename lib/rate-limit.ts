const MAX_ATTEMPTS = 5;
const LOCKOUT_MS   = 15 * 60 * 1000; // 15 min lockout after MAX_ATTEMPTS failures
const WINDOW_MS    = 60 * 60 * 1000; // sliding window resets after 1 hour of no activity

type Attempt = {
  count: number;
  firstAt: number;
  lockedUntil?: number;
};

type RateLimitResult =
  | { allowed: true;  remainingAttempts: number; lockoutMinutes?: never }
  | { allowed: false; remainingAttempts: 0;      lockoutMinutes: number };

const store = new Map<string, Attempt>();

export function checkRateLimit(key: string): RateLimitResult {
  const now = Date.now();
  const rec = store.get(key);

  if (!rec) return { allowed: true, remainingAttempts: MAX_ATTEMPTS };

  if (rec.lockedUntil) {
    if (now < rec.lockedUntil) {
      const lockoutMinutes = Math.ceil((rec.lockedUntil - now) / 60000);
      return { allowed: false, remainingAttempts: 0, lockoutMinutes };
    }
    store.delete(key);
    return { allowed: true, remainingAttempts: MAX_ATTEMPTS };
  }

  if (now - rec.firstAt > WINDOW_MS) {
    store.delete(key);
    return { allowed: true, remainingAttempts: MAX_ATTEMPTS };
  }

  const remaining = Math.max(0, MAX_ATTEMPTS - rec.count);

  if (remaining === 0) {
    rec.lockedUntil = now + LOCKOUT_MS;
    return { allowed: false, remainingAttempts: 0, lockoutMinutes: 15 };
  }

  return { allowed: true, remainingAttempts: remaining };
}

export function recordFailedAttempt(key: string): void {
  const now = Date.now();
  const rec = store.get(key);

  if (!rec) {
    store.set(key, { count: 1, firstAt: now });
    return;
  }

  rec.count++;

  if (rec.count >= MAX_ATTEMPTS) {
    rec.lockedUntil = now + LOCKOUT_MS;
    console.warn(`[rate-limit] locked: ${key}`);
  }
}

export function clearAttempts(key: string): void {
  store.delete(key);
}
