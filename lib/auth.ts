import { cookies } from 'next/headers';
import { SignJWT, jwtVerify } from 'jose';

if (!process.env.JWT_SECRET && process.env.NODE_ENV === 'production') {
  throw new Error('JWT_SECRET is required in production');
}

const secret = new TextEncoder().encode(
  process.env.JWT_SECRET || 'fallback-dev-secret-change-in-prod'
);

export async function createSession(userId: string) {
  const token = await new SignJWT({ userId })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('24h')
    .sign(secret);

  cookies().set('admin_session', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
    sameSite: 'lax',
    path: '/',
  });
}

export async function verifySession(token: string) {
  try {
    const { payload } = await jwtVerify(token, secret);
    return payload;
  } catch {
    return null;
  }
}

export async function deleteSession() {
  cookies().set('admin_session', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 0,
    sameSite: 'lax',
    path: '/',
  });
}

export async function verifyAdminSession(request: Request) {
  const cookieHeader = request.headers.get('cookie');
  if (!cookieHeader) {
    return { valid: false };
  }

  const token = cookieHeader
    .split(';')
    .find((c) => c.trim().startsWith('admin_session='))
    ?.split('=')[1];

  if (!token) {
    return { valid: false };
  }

  const payload = await verifySession(token);
  if (!payload) {
    return { valid: false };
  }

  return { valid: true, userId: payload.userId as string };
}
