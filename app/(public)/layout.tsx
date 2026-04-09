import React from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';

import { BRAND_CONFIG } from '@/config/brand';

const Navbar = dynamic(() => import('@/components/ui/Navbar'), {
  ssr: true,
  loading: () => (
    <div className="fixed left-0 right-0 top-0 z-[100] h-20 border-b border-black/5 bg-[rgba(255,252,246,0.82)] backdrop-blur-xl" />
  ),
});

const CartDrawerRoot = dynamic(() => import('@/components/cart/CartDrawerRoot'), { ssr: false });

const editorialLinks = [
  { label: 'Collections', href: '/collections' },
  { label: 'Our Heritage', href: '/about' },
  { label: 'Contact', href: '/contact' },
  { label: 'Shopping Bag', href: '/cart' },
];

const houseCodes = ['BIS Hallmarked', '22K Gold Only', 'Live Rate Pricing', 'Insured Delivery'];

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-transparent">
      <Navbar />
      <CartDrawerRoot />

      <main className="flex-1">{children}</main>

      <footer className="relative overflow-hidden bg-brand-primary text-white">
        <div className="halo-orb left-[-8rem] top-10 h-64 w-64 bg-[radial-gradient(circle,rgba(214,190,118,0.22)_0%,transparent_70%)]" />
        <div className="halo-orb bottom-[-7rem] right-[-4rem] h-72 w-72 bg-[radial-gradient(circle,rgba(214,190,118,0.16)_0%,transparent_72%)]" />

        <div className="relative mx-auto max-w-7xl px-5 pb-12 pt-20 md:px-8 md:pb-16 md:pt-24">
          <div className="mb-12 grid gap-12 border-b border-white/10 pb-12 md:grid-cols-[1.3fr_0.9fr_1fr]">
            <div className="space-y-6">
              <div className="space-y-3">
                <p className="section-kicker text-brand-accent/90">The House</p>
                <h3 className="max-w-md font-serif text-4xl leading-none md:text-5xl">
                  Jewellery shaped with ceremony, clarity, and quiet confidence.
                </h3>
              </div>
              <p className="max-w-md text-sm leading-7 text-white/55">
                {BRAND_CONFIG.name} brings together hallmark-certified purity, atelier-level finishing, and daily live gold-rate pricing for a client-ready luxury buying experience.
              </p>
              <a
                href={`https://wa.me/${BRAND_CONFIG.contact.whatsapp.replace(/\D/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="button-secondary border-white/20 bg-white/5 text-white hover:bg-white/10"
              >
                Concierge on WhatsApp
              </a>
            </div>

            <div className="space-y-5">
              <p className="section-kicker text-brand-accent/75">Explore</p>
              <ul className="space-y-3">
                {editorialLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm uppercase tracking-[0.28em] text-white/60 transition-colors duration-300 hover:text-brand-accent"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-6">
              <div className="space-y-3">
                <p className="section-kicker text-brand-accent/75">Visit The Atelier</p>
                <div className="space-y-2 text-sm leading-7 text-white/58">
                  <p>{BRAND_CONFIG.contact.address}</p>
                  <p>{BRAND_CONFIG.contact.email}</p>
                  <p>{BRAND_CONFIG.contact.whatsapp}</p>
                </div>
              </div>
              <div className="grid gap-2 text-[11px] uppercase tracking-[0.28em] text-white/35">
                <p>{BRAND_CONFIG.hours.weekdays}</p>
                <p>{BRAND_CONFIG.hours.sunday}</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-wrap gap-3">
              {houseCodes.map((item) => (
                <span
                  key={item}
                  className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-[10px] uppercase tracking-[0.28em] text-white/48"
                >
                  {item}
                </span>
              ))}
            </div>
            <div className="text-[10px] uppercase tracking-[0.28em] text-white/35">
              &copy; {new Date().getFullYear()} {BRAND_CONFIG.name} · Crafted for modern heirlooms
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
