'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Grid3x3, Heart, ShoppingBag, User } from 'lucide-react';
import { motion } from 'framer-motion';
import { useCart, useWishlist } from '@/lib/store';

const navItems = [
  { href: '/', icon: Home, label: 'Home' },
  { href: '/collections', icon: Grid3x3, label: 'Shop' },
  { href: '/wishlist', icon: Heart, label: 'Wishlist' },
  { href: '/cart', icon: ShoppingBag, label: 'Cart' },
  { href: '/about', icon: User, label: 'About' },
];

export default function MobileBottomNav() {
  const pathname = usePathname();
  const cartItems = useCart((state) => state.items);
  const wishlistItems = useWishlist((state) => state.items);

  // Hide on admin pages and checkout
  if (pathname.startsWith('/admin') || pathname.startsWith('/checkout') || pathname.startsWith('/payment')) {
    return null;
  }

  const getBadgeCount = (href: string) => {
    if (href === '/cart') return cartItems.length;
    if (href === '/wishlist') return wishlistItems.length;
    return 0;
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-black/5 bg-[rgba(255,252,246,0.95)] backdrop-blur-xl md:hidden">
      <div className="flex items-center justify-around px-2 py-2 safe-area-inset-bottom">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          const badgeCount = getBadgeCount(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className="relative flex flex-col items-center gap-1 px-4 py-2"
            >
              <motion.div
                className="relative"
                whileTap={{ scale: 0.9 }}
              >
                <Icon
                  size={22}
                  className={`transition-colors ${
                    isActive ? 'text-brand-accent' : 'text-brand-text/40'
                  }`}
                />
                {badgeCount > 0 && (
                  <motion.span
                    className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-brand-accent text-[9px] font-bold text-white"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', duration: 0.3 }}
                  >
                    {badgeCount}
                  </motion.span>
                )}
              </motion.div>
              <span
                className={`text-[9px] font-semibold uppercase tracking-wider transition-colors ${
                  isActive ? 'text-brand-accent' : 'text-brand-text/40'
                }`}
              >
                {item.label}
              </span>
              {isActive && (
                <motion.div
                  className="absolute -top-0.5 left-1/2 h-0.5 w-8 -translate-x-1/2 rounded-full bg-brand-accent"
                  layoutId="activeTab"
                  transition={{ type: 'spring', duration: 0.5 }}
                />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
