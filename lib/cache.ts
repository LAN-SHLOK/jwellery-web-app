/**
 * Caching utilities for improved performance
 * Uses Next.js built-in caching with custom strategies
 */

import { unstable_cache } from 'next/cache';

// Cache durations in seconds
export const CACHE_DURATIONS = {
  products: 300, // 5 minutes
  goldRate: 60, // 1 minute
  categories: 600, // 10 minutes
  reviews: 300, // 5 minutes
  staticContent: 3600, // 1 hour
};

// Cache tags for selective revalidation
export const CACHE_TAGS = {
  products: 'products',
  goldRate: 'gold-rate',
  categories: 'categories',
  reviews: 'reviews',
  orders: 'orders',
  coupons: 'coupons',
};

/**
 * Create a cached function with automatic revalidation
 */
export function createCachedFunction<T extends (...args: any[]) => Promise<any>>(
  fn: T,
  options: {
    key: string;
    tags: string[];
    revalidate: number;
  }
): T {
  return unstable_cache(fn, [options.key], {
    revalidate: options.revalidate,
    tags: options.tags,
  }) as T;
}

/**
 * In-memory cache for frequently accessed data
 * Use for data that changes rarely and is accessed often
 */
class MemoryCache {
  private cache = new Map<string, { data: any; expires: number }>();
  
  set(key: string, data: any, ttl: number) {
    const expires = Date.now() + ttl * 1000;
    this.cache.set(key, { data, expires });
    
    // Cleanup expired entries periodically
    this.cleanup();
  }
  
  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    
    if (!entry) return null;
    
    if (Date.now() > entry.expires) {
      this.cache.delete(key);
      return null;
    }
    
    return entry.data as T;
  }
  
  delete(key: string) {
    this.cache.delete(key);
  }
  
  clear() {
    this.cache.clear();
  }
  
  private cleanup() {
    const now = Date.now();
    
    for (const [key, entry] of Array.from(this.cache.entries())) {
      if (now > entry.expires) {
        this.cache.delete(key);
      }
    }
  }
}

export const memoryCache = new MemoryCache();

/**
 * Cache wrapper with memory cache fallback
 */
export async function getCached<T>(
  key: string,
  fetcher: () => Promise<T>,
  ttl: number = 300
): Promise<T> {
  // Try memory cache first
  const cached = memoryCache.get<T>(key);
  if (cached !== null) {
    return cached;
  }
  
  // Fetch fresh data
  const data = await fetcher();
  
  // Store in memory cache
  memoryCache.set(key, data, ttl);
  
  return data;
}

/**
 * Invalidate cache by tag
 */
export async function invalidateCache(tags: string[]) {
  try {
    const { revalidateTag } = await import('next/cache');
    
    for (const tag of tags) {
      revalidateTag(tag);
    }
  } catch (error) {
    console.error('Failed to invalidate cache:', error);
  }
  
  // Also clear memory cache for these tags
  for (const tag of tags) {
    memoryCache.delete(tag);
  }
}

/**
 * Cache key generators
 */
export const cacheKeys = {
  products: (category?: string) => 
    category ? `products:${category}` : 'products:all',
  
  product: (slug: string) => 
    `product:${slug}`,
  
  goldRate: () => 
    'gold-rate:latest',
  
  goldRateHistory: (days: number) => 
    `gold-rate:history:${days}`,
  
  reviews: (productId: string) => 
    `reviews:${productId}`,
  
  coupon: (code: string) => 
    `coupon:${code}`,
};

/**
 * Response caching headers
 */
export function getCacheHeaders(maxAge: number, staleWhileRevalidate: number = 60) {
  return {
    'Cache-Control': `public, s-maxage=${maxAge}, stale-while-revalidate=${staleWhileRevalidate}`,
  };
}

/**
 * No-cache headers for sensitive data
 */
export const NO_CACHE_HEADERS = {
  'Cache-Control': 'private, no-cache, no-store, must-revalidate',
  'Pragma': 'no-cache',
  'Expires': '0',
};
