import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifySession } from '@/lib/auth';

// Simple in-memory rate limiting (use Redis in production)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

function getRateLimitKey(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const ip = forwarded ? forwarded.split(',')[0] : request.ip || 'unknown';
  return `${ip}:${request.nextUrl.pathname}`;
}

function checkRateLimit(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(key);
  
  // Cleanup old entries inline
  if (rateLimitMap.size > 1000) {
    const entries = Array.from(rateLimitMap.entries());
    for (const [k, r] of entries) {
      if (now > r.resetTime) {
        rateLimitMap.delete(k);
      }
    }
  }
  
  if (!record || now > record.resetTime) {
    rateLimitMap.set(key, { count: 1, resetTime: now + windowMs });
    return true;
  }
  
  if (record.count >= limit) {
    return false;
  }
  
  record.count++;
  return true;
}

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

  // Rate limiting for API routes
  if (pathname.startsWith('/api/')) {
    const key = getRateLimitKey(request);
    let limit = 100; // Default: 100 requests per minute
    let windowMs = 60000; // 1 minute
    
    // Stricter limits for sensitive endpoints
    if (pathname.includes('/checkout')) {
      limit = 5;
      windowMs = 60000;
    } else if (pathname.includes('/contact')) {
      limit = 3;
      windowMs = 60000;
    } else if (pathname.includes('/login')) {
      limit = 5;
      windowMs = 900000; // 15 minutes
    }
    
    if (!checkRateLimit(key, limit, windowMs)) {
      return withSecurityHeaders(
        NextResponse.json(
          { error: 'Too many requests. Please try again later.' },
          { status: 429, headers: { 'Retry-After': '60' } }
        )
      );
    }
  }

  // Allow login page and login API
  if (pathname === '/admin/login' || pathname === '/api/admin/login') {
    const response = withSecurityHeaders(NextResponse.next());
    // Prevent caching of login page
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
    return response;
  }

  // Protect admin routes
  if (pathname.startsWith('/admin') || pathname.startsWith('/api/admin')) {
    const cookie = request.cookies.get('admin_session');

    if (!cookie) {
      if (pathname.startsWith('/api')) {
        return withSecurityHeaders(NextResponse.json({ error: 'Unauthorized' }, { status: 401 }));
      }
      const response = NextResponse.redirect(new URL('/admin/login', request.url));
      response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate');
      return withSecurityHeaders(response);
    }

    const session = await verifySession(cookie.value);

    if (!session) {
      if (pathname.startsWith('/api')) {
        return withSecurityHeaders(NextResponse.json({ error: 'Session expired' }, { status: 401 }));
      }
      const response = NextResponse.redirect(new URL('/admin/login', request.url));
      response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate');
      return withSecurityHeaders(response);
    }
    
    // Add no-cache headers to admin pages
    const response = withSecurityHeaders(NextResponse.next());
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
    return response;
  }

  return withSecurityHeaders(NextResponse.next());
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*', '/api/:path*'],
};
