'use client';

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Heart } from 'lucide-react';

import { BRAND_CONFIG } from '@/config/brand';
import { useWishlist } from '@/lib/store';

const CartBadge = dynamic(() => import('@/components/ui/CartBadge'), { ssr: false });
const Ticker = dynamic(() => import('@/components/ui/Ticker'), { ssr: false });

const navLinks = [
  { name: 'Collections', href: '/collections' },
  { name: 'Heritage', href: '/about' },
  { name: 'Contact', href: '/contact' },
];

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const wishlistItems = useWishlist((state) => state.items);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 36);
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <>
      <div className="fixed left-0 right-0 top-0 z-[110] hidden border-b border-gray-200 bg-gray-50 text-gray-600 md:block">
        <div className="mx-auto flex h-9 max-w-[1440px] items-center justify-between px-8 text-xs">
          <p>Insured shipping across India</p>
          <p>BIS Hallmarked • 22K Gold • Live Pricing</p>
        </div>
      </div>

      <nav
        className={`fixed left-0 right-0 top-0 z-[100] transition-all duration-300 md:top-9 ${
          scrolled
            ? 'border-b border-black/5 bg-white shadow-sm'
            : 'bg-white'
        }`}
      >
        <div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between gap-4 px-4 md:h-20 md:px-8">
          {/* Left section - Logo */}
          <div className="flex items-center gap-2">
            <motion.button
              onClick={() => setOpen(true)}
              className="rounded-lg p-2 text-gray-600 hover:bg-gray-100 md:hidden"
              aria-label="Open menu"
              whileTap={{ scale: 0.95 }}
            >
              <Menu size={20} />
            </motion.button>

            <Link href="/" className="flex items-center">
              <Image
                src={BRAND_CONFIG.logo.url}
                alt={`${BRAND_CONFIG.name} logo`}
                width={BRAND_CONFIG.logo.width}
                height={BRAND_CONFIG.logo.height}
                className="h-8 w-auto md:h-10"
                priority
              />
            </Link>
          </div>

          {/* Center section - Navigation links */}
          <div className="hidden flex-1 items-center justify-center gap-8 md:flex">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm font-medium transition-colors ${
                    isActive ? 'text-gray-900' : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </div>

          {/* Right section - Icons */}
          <div className="flex items-center gap-3">
            <div className="hidden md:block">
              <Ticker />
            </div>
            <Link
              href="/wishlist"
              className="relative rounded-lg p-2 text-gray-600 hover:bg-gray-100"
              title="Wishlist"
              aria-label="Wishlist"
            >
              <Heart size={20} className={wishlistItems.length > 0 ? 'fill-gray-900 text-gray-900' : ''} />
              {wishlistItems.length > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-gray-900 text-xs font-medium text-white">
                  {wishlistItems.length}
                </span>
              )}
            </Link>
            <CartBadge />
          </div>
        </div>
      </nav>

      <div className="h-16 md:h-[6.25rem]" />

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              className="fixed inset-0 z-[200] bg-black/20 md:hidden"
              onClick={() => setOpen(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />
            <motion.div
              className="fixed left-0 top-0 z-[210] flex h-screen w-80 flex-col bg-white shadow-xl md:hidden"
              initial={{ x: -320 }}
              animate={{ x: 0 }}
              exit={{ x: -320 }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            >
            <div className="border-b border-gray-200 px-6 py-5">
              <div className="mb-4 flex items-center justify-between">
                <Link href="/" className="flex items-center">
                  <Image
                    src={BRAND_CONFIG.logo.url}
                    alt={`${BRAND_CONFIG.name} logo`}
                    width={BRAND_CONFIG.logo.width}
                    height={BRAND_CONFIG.logo.height}
                    className="h-8 w-auto"
                  />
                </Link>
                <button
                  onClick={() => setOpen(false)}
                  className="rounded-lg p-2 text-gray-600 hover:bg-gray-100"
                  aria-label="Close menu"
                >
                  <X size={20} />
                </button>
              </div>
              <Ticker />
            </div>

            <nav className="flex-1 overflow-y-auto px-4 py-6">
              <div className="space-y-1">
                {navLinks.map((link) => {
                  const isActive = pathname === link.href;

                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={`block rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
                        isActive
                          ? 'bg-gray-900 text-white'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {link.name}
                    </Link>
                  );
                })}
                <Link
                  href="/cart"
                  className="block rounded-lg px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-100"
                >
                  Shopping Bag
                </Link>
                <Link
                  href="/wishlist"
                  className="block rounded-lg px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-100"
                >
                  Wishlist {wishlistItems.length > 0 && `(${wishlistItems.length})`}
                </Link>
              </div>
            </nav>

            <div className="border-t border-gray-200 bg-gray-50 px-6 py-5">
              <p className="text-xs font-medium text-gray-500">Contact</p>
              <p className="mt-2 text-sm text-gray-900">{BRAND_CONFIG.contact.whatsapp}</p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
    </>
  );
}
