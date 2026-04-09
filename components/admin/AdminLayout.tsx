'use client';

import { type ReactNode, useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowUpRight,
  ExternalLink,
  LayoutDashboard,
  type LucideIcon,
  LogOut,
  Menu,
  Package,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  TrendingUp,
  X,
} from 'lucide-react';

import { BRAND_CONFIG } from '@/config/brand';

type AdminLayoutProps = {
  children: ReactNode;
};

type NavLink = {
  href: string;
  icon: LucideIcon;
  name: string;
  note: string;
};

const NAV_LINKS: NavLink[] = [
  {
    href: '/admin/dashboard',
    icon: LayoutDashboard,
    name: 'Dashboard',
    note: 'Pulse and performance',
  },
  {
    href: '/admin/gold-rate',
    icon: TrendingUp,
    name: 'Gold Rate',
    note: 'Daily pricing control',
  },
  {
    href: '/admin/products',
    icon: Package,
    name: 'Products',
    note: 'Catalogue and imagery',
  },
  {
    href: '/admin/orders',
    icon: ShoppingBag,
    name: 'Orders',
    note: 'Fulfilment desk',
  },
];

function formatSectionName(pathname: string) {
  const activeLink = NAV_LINKS.find((link) => pathname.startsWith(link.href));

  if (activeLink) {
    return activeLink.name;
  }

  return 'Admin';
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const sectionName = formatSectionName(pathname);

  // Prevent body scroll when sidebar is open on mobile
  useEffect(() => {
    if (sidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [sidebarOpen]);

  async function handleLogout() {
    await fetch('/api/admin/logout', { method: 'POST' });
    window.location.href = '/admin/login';
  }

  const SidebarContent = () => (
    <div className="flex h-full flex-col">
      <div className="border-b border-white/10 px-4 py-4 sm:px-6 sm:py-5">
        <div className="flex items-start justify-between gap-4">
          <Link
            href="/admin/dashboard"
            onClick={() => setSidebarOpen(false)}
            className="flex min-w-0 items-center gap-3"
          >
            <div className="relative flex h-11 w-11 items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-white/10 sm:h-12 sm:w-12">
              <Image
                src={BRAND_CONFIG.logo.url}
                alt={BRAND_CONFIG.name}
                fill
                sizes="48px"
                className="object-contain p-2"
                priority
              />
            </div>
            <div className="min-w-0">
              <p className="truncate font-serif text-base tracking-[0.18em] text-white uppercase sm:text-lg sm:tracking-[0.28em]">
                {BRAND_CONFIG.name}
              </p>
              <p className="mt-1 text-[9px] font-semibold uppercase tracking-[0.26em] text-white/45 sm:text-[10px] sm:tracking-[0.34em]">
                Private Client Console
              </p>
            </div>
          </Link>

          <button
            onClick={() => setSidebarOpen(false)}
            className="rounded-full border border-white/10 p-2 text-white/60 transition hover:border-white/20 hover:text-white md:hidden"
            aria-label="Close navigation"
          >
            <motion.div
              whileHover={{ rotate: 90 }}
              transition={{ duration: 0.3 }}
            >
              <X size={16} />
            </motion.div>
          </button>
        </div>

        <div className="mt-4 rounded-[24px] border border-white/10 bg-white/5 px-4 py-3.5 sm:mt-5 sm:rounded-[26px] sm:py-4">
          <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.34em] text-white/55">
            <ShieldCheck size={14} className="text-brand-accent" />
            Secure Workspace
          </div>
          <p className="mt-2 text-[13px] leading-5 text-white/72 sm:hidden">
            Pricing, catalogue, and orders in one calm workspace.
          </p>
          <p className="mt-3 hidden text-sm leading-6 text-white/78 sm:block">
            Review pricing, catalogue, and orders from one calm control room built for daily store operations.
          </p>
        </div>
      </div>

      <div className="custom-scrollbar flex-1 overflow-y-auto px-3 py-4 sm:px-5 sm:py-5">
        <div className="mb-4 flex items-center gap-2 px-2 text-[10px] font-semibold uppercase tracking-[0.34em] text-white/38">
          <Sparkles size={12} className="text-brand-accent" />
          Command Deck
        </div>

        <nav className="space-y-2">
          {NAV_LINKS.map((link, index) => {
            const isActive = pathname.startsWith(link.href);
            const Icon = link.icon;

            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setSidebarOpen(false)}
                className={[
                  'group relative flex items-center gap-3 overflow-hidden rounded-[22px] border px-3.5 py-3.5 transition-all duration-300 sm:rounded-[24px] sm:px-4 sm:py-4',
                  'animate-fade-in-up',
                  isActive
                    ? 'border-brand-accent/40 bg-gradient-to-r from-white/16 via-white/10 to-transparent text-white shadow-[0_18px_45px_rgba(9,8,7,0.24)]'
                    : 'border-white/8 bg-white/[0.03] text-white/72 hover:border-white/14 hover:bg-white/[0.07] hover:text-white',
                ].join(' ')}
                style={{ animationDelay: `${index * 0.06}s` }}
              >
                <div
                  className={[
                    'flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border transition-colors sm:h-11 sm:w-11',
                    isActive
                      ? 'border-brand-accent/40 bg-brand-accent/12 text-brand-accent'
                      : 'border-white/8 bg-white/6 text-white/60 group-hover:text-white',
                  ].join(' ')}
                >
                  <Icon size={18} />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold tracking-[0.02em]">{link.name}</p>
                  <p className="mt-1 hidden text-[11px] text-white/42 transition-colors group-hover:text-white/55 sm:block">
                    {link.note}
                  </p>
                </div>

                <ArrowUpRight
                  size={15}
                  className={[
                    'shrink-0 transition-all duration-300',
                    isActive ? 'translate-x-0 opacity-100 text-brand-accent' : 'translate-x-1 opacity-0 group-hover:translate-x-0 group-hover:opacity-100',
                  ].join(' ')}
                />

                {isActive && (
                  <div className="absolute inset-y-4 left-0 w-px bg-gradient-to-b from-transparent via-brand-accent to-transparent" />
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="border-t border-white/10 px-4 py-4 sm:px-5 sm:py-5">
        <div className="rounded-[24px] border border-white/10 bg-gradient-to-br from-white/[0.08] to-white/[0.02] p-4 sm:rounded-[28px]">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.34em] text-white/42">
                Live Storefront
              </p>
              <p className="mt-2 text-[13px] leading-5 text-white/60 sm:hidden">
                Open the store view or sign out.
              </p>
              <p className="mt-2 hidden text-sm text-white/72 sm:block">
                Step out of the admin and review the client-facing experience in context.
              </p>
            </div>
            <ExternalLink size={16} className="mt-0.5 text-brand-accent" />
          </div>

          <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-1">
            <Link
              href="/"
              className="inline-flex items-center justify-between rounded-2xl border border-white/10 bg-white/7 px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.24em] text-white transition hover:border-brand-accent/40 hover:text-brand-accent"
            >
              View Store
              <ExternalLink size={14} />
            </Link>

            <button
              onClick={handleLogout}
              className="inline-flex items-center justify-between rounded-2xl border border-white/10 px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.24em] text-white/72 transition hover:border-white/18 hover:text-white"
            >
              Sign Out
              <LogOut size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-[#1c160f] via-[#241b13] to-[#f8f4ee] text-brand-text">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(244,214,153,0.12),transparent_28%)]" />
      <div className="pointer-events-none absolute inset-0 soft-grid opacity-[0.18]" />
      <motion.div
        className="halo-orb absolute left-[-8rem] top-24 h-52 w-52 bg-brand-accent/15"
        animate={{ scale: [1, 1.2, 1], opacity: [0.15, 0.25, 0.15] }}
        transition={{ duration: 8, repeat: Infinity }}
      />
      <motion.div
        className="halo-orb absolute right-[-6rem] top-72 h-44 w-44 bg-white/30"
        animate={{ scale: [1, 1.15, 1], x: [0, -20, 0] }}
        transition={{ duration: 7, repeat: Infinity, delay: 1.5 }}
      />
      <motion.div
        className="halo-orb absolute bottom-[-4rem] left-1/2 h-64 w-64 bg-brand-accent/8"
        animate={{ scale: [1, 1.1, 1], y: [0, 20, 0] }}
        transition={{ duration: 9, repeat: Infinity, delay: 3 }}
      />

      <aside className="fixed inset-y-0 left-0 z-50 hidden w-[19rem] overflow-hidden border-r border-white/6 bg-[linear-gradient(180deg,rgba(24,18,12,0.98)_0%,rgba(31,24,17,0.98)_100%)] text-white shadow-[28px_0_90px_rgba(10,8,6,0.22)] md:block">
        <SidebarContent />
      </aside>

      <div className="fixed inset-x-0 top-0 z-[90] border-b border-white/8 bg-[linear-gradient(180deg,rgba(24,18,12,0.95)_0%,rgba(31,24,17,0.88)_100%)] px-4 py-4 text-white shadow-lg backdrop-blur md:hidden">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="truncate font-serif text-base uppercase tracking-[0.24em]">{BRAND_CONFIG.name}</p>
            <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.32em] text-white/45">
              {sectionName}
            </p>
          </div>

          <motion.button
            onClick={() => setSidebarOpen(true)}
            className="rounded-full border border-white/10 p-2.5 text-white/75 transition hover:border-white/20 hover:text-white"
            aria-label="Open navigation"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Menu size={18} />
          </motion.button>
        </div>
      </div>

      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              className="fixed inset-0 z-[95] bg-black/60 backdrop-blur-sm md:hidden"
              onClick={() => setSidebarOpen(false)}
              aria-label="Close navigation overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            />
            <motion.aside
              className="fixed inset-y-0 left-0 z-[100] w-[18rem] overflow-y-auto border-r border-white/10 bg-[linear-gradient(180deg,rgba(24,18,12,0.99)_0%,rgba(31,24,17,0.99)_100%)] text-white shadow-[30px_0_90px_rgba(10,8,6,0.4)] sm:w-[19rem] md:hidden"
              initial={{ x: -320 }}
              animate={{ x: 0 }}
              exit={{ x: -320 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            >
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <main className="relative min-h-screen bg-gradient-to-b from-transparent via-[#f8f4ee]/50 to-[#f8f4ee] md:ml-[19rem]">
        <div className="mx-auto max-w-7xl px-4 pb-10 pt-24 sm:px-6 sm:pt-28 md:px-8 md:pb-14 md:pt-10">
          <div className="mb-6 flex flex-col gap-4 rounded-[28px] border border-white/50 bg-white/80 px-5 py-4 shadow-[0_18px_45px_rgba(31,24,17,0.07)] backdrop-blur md:flex-row md:items-center md:justify-between md:px-7">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.36em] text-brand-accent">
                Operations Suite
              </p>
              <h1 className="mt-2 font-serif text-2xl text-brand-primary md:text-[2rem]">
                {sectionName}
              </h1>
            </div>

            <div className="flex flex-wrap items-center gap-3 text-[11px] uppercase tracking-[0.24em] text-brand-text/60">
              <span className="inline-flex items-center gap-2 rounded-full border border-brand-text/10 bg-white/90 px-4 py-2 shadow-sm">
                <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
                Admin Online
              </span>
              <Link
                href="/"
                className="inline-flex items-center gap-2 rounded-full border border-brand-text/10 bg-white/70 px-4 py-2 transition hover:border-brand-accent/40 hover:bg-white/90 hover:text-brand-accent hover:shadow-sm"
              >
                Store Preview
                <ExternalLink size={14} />
              </Link>
            </div>
          </div>

          {children}
        </div>
      </main>
    </div>
  );
}
