import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifySession } from '@/lib/auth';

function withSecurityHeaders(res: NextResponse) {
  res.headers.set('X-Content-Type-Options', 'nosniff');
  res.headers.set('X-Frame-Options', 'DENY');
  res.headers.set('X-XSS-Protection', '1; mode=block');
  res.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  
  const csp = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://checkout.razorpay.com",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: https://res.cloudinary.com https://*.razorpay.com",
    "frame-src 'self' https://api.razorpay.com https://checkout.razorpay.com",
    "connect-src 'self' https://api.razorpay.com https://lumberjack.razorpay.com",
    "font-src 'self' data:",
  ].join('; ');
  
  res.headers.set('Content-Security-Policy', csp);
  
  return res;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === '/admin/login' || pathname === '/api/admin/login') {
    return withSecurityHeaders(NextResponse.next());
  }

  if (pathname.startsWith('/admin') || pathname.startsWith('/api/admin')) {
    const cookie = request.cookies.get('admin_session');

    if (!cookie) {
      if (pathname.startsWith('/api')) {
        return withSecurityHeaders(NextResponse.json({ error: 'Unauthorized' }, { status: 401 }));
      }
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }

    const session = await verifySession(cookie.value);

    if (!session) {
      if (pathname.startsWith('/api')) {
        return withSecurityHeaders(NextResponse.json({ error: 'Session expired' }, { status: 401 }));
      }
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }

  return withSecurityHeaders(NextResponse.next());
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*', '/api/:path*'],
};
