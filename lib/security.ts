/**
 * Security utilities for the application
 * Includes rate limiting, input sanitization, and security headers
 */

import { headers } from 'next/headers';

// Rate limiting configuration
const RATE_LIMITS = {
  // API endpoints
  api: { requests: 100, window: 60 * 1000 }, // 100 requests per minute
  checkout: { requests: 5, window: 60 * 1000 }, // 5 checkouts per minute
  contact: { requests: 3, window: 60 * 1000 }, // 3 contact submissions per minute
  auth: { requests: 5, window: 15 * 60 * 1000 }, // 5 login attempts per 15 minutes
  
  // Public endpoints
  products: { requests: 200, window: 60 * 1000 }, // 200 requests per minute
  goldRate: { requests: 50, window: 60 * 1000 }, // 50 requests per minute
};

// In-memory store for rate limiting (use Redis in production)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

/**
 * Get client identifier (IP address or user ID)
 */
export async function getClientId(): Promise<string> {
  const headersList = await headers();
  
  // Try to get real IP from various headers (for proxies/load balancers)
  const forwardedFor = headersList.get('x-forwarded-for');
  const realIp = headersList.get('x-real-ip');
  const cfConnectingIp = headersList.get('cf-connecting-ip'); // Cloudflare
  
  const ip = forwardedFor?.split(',')[0] || realIp || cfConnectingIp || 'unknown';
  
  return ip;
}

/**
 * Check if request should be rate limited
 */
export async function checkRateLimit(
  identifier: string,
  limit: { requests: number; window: number }
): Promise<{ allowed: boolean; remaining: number; resetTime: number }> {
  const now = Date.now();
  const key = identifier;
  
  const record = rateLimitStore.get(key);
  
  // If no record or window expired, create new record
  if (!record || now > record.resetTime) {
    const resetTime = now + limit.window;
    rateLimitStore.set(key, { count: 1, resetTime });
    
    // Cleanup old entries
    cleanupRateLimitStore();
    
    return {
      allowed: true,
      remaining: limit.requests - 1,
      resetTime,
    };
  }
  
  // Check if limit exceeded
  if (record.count >= limit.requests) {
    return {
      allowed: false,
      remaining: 0,
      resetTime: record.resetTime,
    };
  }
  
  // Increment count
  record.count++;
  rateLimitStore.set(key, record);
  
  return {
    allowed: true,
    remaining: limit.requests - record.count,
    resetTime: record.resetTime,
  };
}

/**
 * Cleanup expired rate limit entries
 */
function cleanupRateLimitStore() {
  const now = Date.now();
  
  for (const [key, record] of Array.from(rateLimitStore.entries())) {
    if (now > record.resetTime) {
      rateLimitStore.delete(key);
    }
  }
}

/**
 * Rate limit middleware for API routes
 */
export async function rateLimit(
  endpoint: keyof typeof RATE_LIMITS = 'api'
): Promise<{ success: true } | { success: false; error: string; retryAfter: number }> {
  const clientId = await getClientId();
  const limit = RATE_LIMITS[endpoint];
  
  const result = await checkRateLimit(clientId, limit);
  
  if (!result.allowed) {
    const retryAfter = Math.ceil((result.resetTime - Date.now()) / 1000);
    
    return {
      success: false,
      error: 'Too many requests. Please try again later.',
      retryAfter,
    };
  }
  
  return { success: true };
}

/**
 * Sanitize user input to prevent XSS
 */
export function sanitizeInput(input: string): string {
  return input
    .replace(/[<>]/g, '') // Remove < and >
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, '') // Remove event handlers
    .trim();
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate phone number (Indian format)
 */
export function isValidPhone(phone: string): boolean {
  const phoneRegex = /^[6-9]\d{9}$/;
  return phoneRegex.test(phone.replace(/[\s\-+()]/g, ''));
}

/**
 * Validate pincode (Indian format)
 */
export function isValidPincode(pincode: string): boolean {
  const pincodeRegex = /^\d{6}$/;
  return pincodeRegex.test(pincode);
}

/**
 * Security headers for API responses
 */
export const SECURITY_HEADERS = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
};

/**
 * CORS headers for API responses
 */
export function getCorsHeaders(origin?: string) {
  const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || [];
  
  if (origin && allowedOrigins.includes(origin)) {
    return {
      'Access-Control-Allow-Origin': origin,
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Max-Age': '86400',
    };
  }
  
  return {};
}

/**
 * Generate CSRF token
 */
export function generateCsrfToken(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

/**
 * Verify CSRF token
 */
export function verifyCsrfToken(token: string, storedToken: string): boolean {
  return token === storedToken;
}

/**
 * Hash sensitive data (for logging/debugging)
 */
export function hashSensitiveData(data: string): string {
  // Simple hash for non-cryptographic purposes
  let hash = 0;
  for (let i = 0; i < data.length; i++) {
    const char = data.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  return hash.toString(36);
}

/**
 * Mask sensitive information
 */
export function maskEmail(email: string): string {
  const [local, domain] = email.split('@');
  if (!local || !domain) return email;
  
  const maskedLocal = local.length > 2 
    ? local[0] + '*'.repeat(local.length - 2) + local[local.length - 1]
    : local;
  
  return `${maskedLocal}@${domain}`;
}

export function maskPhone(phone: string): string {
  if (phone.length < 4) return phone;
  return '*'.repeat(phone.length - 4) + phone.slice(-4);
}

/**
 * Check if request is from a bot
 */
export async function isBot(): Promise<boolean> {
  const headersList = await headers();
  const userAgent = headersList.get('user-agent') || '';
  
  const botPatterns = [
    /bot/i,
    /crawler/i,
    /spider/i,
    /scraper/i,
    /curl/i,
    /wget/i,
  ];
  
  return botPatterns.some(pattern => pattern.test(userAgent));
}

/**
 * Log security event
 */
export function logSecurityEvent(event: {
  type: 'rate_limit' | 'invalid_input' | 'auth_failure' | 'suspicious_activity';
  clientId: string;
  details?: string;
}) {
  // In production, send to logging service
  console.warn('[SECURITY]', {
    timestamp: new Date().toISOString(),
    ...event,
  });
}
