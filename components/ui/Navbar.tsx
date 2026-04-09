import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, Settings, X, Heart } from 'lucide-react';

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
      <div className="fixed left-0 right-0 top-0 z-[110] hidden border-b border-black/5 bg-brand-primary text-white/70 md:block">
        <div className="mx-auto flex h-9 max-w-[1440px] items-center justify-between px-8 text-[10px] uppercase tracking-[0.28em]">
          <p>Insured shipping across India</p>
          <p>Hallmark-certified 22K pricing updated daily</p>
        </div>
      </div>

      <nav
        className={`fixed left-0 right-0 top-0 z-[100] transition-all duration-500 md:top-9 ${
          scrolled
            ? 'border-b border-black/5 bg-[rgba(255,252,246,0.92)] shadow-[0_12px_32px_rgba(45,32,20,0.06)] backdrop-blur-xl'
            : 'bg-[rgba(255,252,246,0.78)] backdrop-blur-xl'
        }`}
      >
        <div className="mx-auto flex h-20 max-w-[1440px] items-center justify-between px-4 md:px-8">
          <div className="flex flex-1 items-center gap-8">
            <motion.button
              onClick={() => setOpen(true)}
              className="rounded-full border border-black/8 bg-white/60 p-2.5 opacity-75 transition-opacity hover:opacity-100 md:hidden"
              aria-label="Open menu"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Menu size={18} />
            </motion.button>

            <div className="hidden items-center gap-8 md:flex">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;

                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`group relative text-[10px] uppercase tracking-[0.28em] transition-colors duration-300 ${
                      isActive ? 'text-brand-primary' : 'text-brand-text/55 hover:text-brand-text'
                    }`}
                  >
                    {link.name}
                    <span
                      className={`absolute -bottom-2 left-0 h-px bg-brand-accent transition-all duration-300 ${
                        isActive ? 'w-full' : 'w-0 group-hover:w-full'
                      }`}
                    />
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="flex flex-1 justify-center">
            <Link href="/" className="group flex flex-col items-center text-center">
              <motion.div
                whileHover={{ scale: 1.05, rotate: 5 }}
                transition={{ duration: 0.3 }}
              >
                <Image
                  src={BRAND_CONFIG.logo.url}
                  alt={`${BRAND_CONFIG.name} logo`}
                  width={BRAND_CONFIG.logo.width}
                  height={BRAND_CONFIG.logo.height}
                  className="mb-1 h-6 w-auto opacity-80 transition-opacity duration-300 group-hover:opacity-100 md:h-7"
                />
              </motion.div>
              <span className="font-serif text-xl uppercase tracking-[0.22em] text-brand-primary transition-all duration-300 group-hover:tracking-[0.3em] md:text-3xl">
                {BRAND_CONFIG.name}
              </span>
              <span className="hidden text-[8px] uppercase tracking-[0.42em] text-brand-text/35 md:block">
                Modern heirlooms in 22K gold
              </span>
            </Link>
          </div>

          <div className="flex flex-1 items-center justify-end gap-3 md:gap-5">
            <div className="hidden lg:block">
              <Ticker />
            </div>
            <Link
              href="/wishlist"
              className="relative rounded-full border border-black/8 bg-white/55 p-2.5 text-brand-text/35 transition-colors hover:text-brand-accent hover:border-brand-accent/30"
              title="Wishlist"
              aria-label="Wishlist"
            >
              <Heart size={15} className={wishlistItems.length > 0 ? 'fill-brand-accent text-brand-accent' : ''} />
              {wishlistItems.length > 0 && (
                <motion.span
                  className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-brand-accent text-[9px] font-bold text-white"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', duration: 0.5 }}
                >
                  {wishlistItems.length}
                </motion.span>
              )}
            </Link>
            <Link
              href="/admin/dashboard"
              className="hidden rounded-full border border-black/8 bg-white/55 p-2.5 text-brand-text/35 transition-colors hover:text-brand-text/70 md:flex"
              title="Admin Panel"
              aria-label="Admin Panel"
            >
              <Settings size={15} />
            </Link>
            <CartBadge />
          </div>
        </div>
      </nav>

      <div className="h-20 md:h-[7rem]" />

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              className="fixed inset-0 z-[200] bg-black/45 backdrop-blur-sm md:hidden"
              onClick={() => setOpen(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            />
            <motion.div
              className="fixed left-0 top-0 z-[210] flex h-screen w-80 flex-col bg-[rgba(255,251,245,0.98)] shadow-2xl md:hidden"
              initial={{ x: -320 }}
              animate={{ x: 0 }}
              exit={{ x: -320 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            >
            <div className="border-b border-black/6 px-6 pb-5 pt-6">
              <div className="mb-6 flex items-center justify-between">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <p className="font-serif text-2xl tracking-[0.18em] text-brand-primary">{BRAND_CONFIG.name}</p>
                  <p className="mt-1 text-[9px] uppercase tracking-[0.32em] text-brand-text/40">Luxury 22K collection</p>
                </motion.div>
                <motion.button
                  onClick={() => setOpen(false)}
                  className="rounded-full border border-black/8 bg-white/60 p-2 transition-transform duration-300"
                  aria-label="Close menu"
                  whileHover={{ rotate: 90, scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  initial={{ opacity: 0, rotate: -90 }}
                  animate={{ opacity: 1, rotate: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <X size={16} />
                </motion.button>
              </div>
              <Ticker />
            </div>

            <nav className="flex-1 px-4 py-6">
              <div className="space-y-1">
                {navLinks.map((link, idx) => {
                  const isActive = pathname === link.href;

                  return (
                    <motion.div
                      key={link.href}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 + idx * 0.05 }}
                    >
                      <Link
                        href={link.href}
                        className={`block rounded-2xl px-4 py-4 text-[11px] uppercase tracking-[0.28em] transition-colors ${
                          isActive
                            ? 'bg-brand-primary text-white'
                            : 'text-brand-text/60 hover:bg-brand-muted hover:text-brand-text'
                        }`}
                      >
                        {link.name}
                      </Link>
                    </motion.div>
                  );
                })}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + navLinks.length * 0.05 }}
                >
                  <Link
                    href="/cart"
                    className="block rounded-2xl px-4 py-4 text-[11px] uppercase tracking-[0.28em] text-brand-text/60 transition-colors hover:bg-brand-muted hover:text-brand-text"
                  >
                    Shopping Bag
                  </Link>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + (navLinks.length + 1) * 0.05 }}
                >
                  <Link
                    href="/wishlist"
                    className="block rounded-2xl px-4 py-4 text-[11px] uppercase tracking-[0.28em] text-brand-text/60 transition-colors hover:bg-brand-muted hover:text-brand-text"
                  >
                    Wishlist {wishlistItems.length > 0 && `(${wishlistItems.length})`}
                  </Link>
                </motion.div>
              </div>
            </nav>

            <motion.div
              className="border-t border-black/6 bg-brand-muted/50 px-6 py-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <p className="text-[9px] uppercase tracking-[0.28em] text-brand-text/38">Private Viewings</p>
              <p className="mt-2 text-sm text-brand-text/68">{BRAND_CONFIG.contact.whatsapp}</p>
              <Link
                href="/admin/login"
                className="mt-5 inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.24em] text-brand-text/32"
              >
                <Settings size={12} />
                Admin
              </Link>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
    </>
  );
}
