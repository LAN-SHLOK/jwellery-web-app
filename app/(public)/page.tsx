import React from 'react';
import Link from 'next/link';
import { ArrowRight, Award, Gem, ShieldCheck, Sparkles, Star, Truck } from 'lucide-react';
import type { Metadata } from 'next';

import ProductGrid from '@/components/product/ProductGrid';
import { BRAND_CONFIG } from '@/config/brand';
import { calculateFinalPrice } from '@/lib/pricing';
import { supabase } from '@/lib/supabase';

export const metadata: Metadata = {
  title: BRAND_CONFIG.name,
  description: BRAND_CONFIG.tagline,
};

export const revalidate = 60;

type FeaturedProduct = {
  id: string;
  name: string;
  slug: string;
  category: string | null;
  gold_weight_grams: number;
  stock_quantity: number;
  is_featured: boolean;
  images: string[];
  pricing: ReturnType<typeof calculateFinalPrice>;
};

async function getFeaturedProducts(): Promise<FeaturedProduct[]> {
  try {
    const { data: rateRow } = await supabase
      .from('gold_rates')
      .select('rate_per_gram')
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    const rate = Number(rateRow?.rate_per_gram) || 6500;

    const { data: products } = await supabase
      .from('products')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false })
      .limit(9);

    if (!products || products.length === 0) {
      return [];
    }

    const featured = products.filter((product) => product.is_featured);
    const list = (featured.length > 0 ? featured : products).slice(0, 6);

    return list.map((product) => ({
      ...product,
      pricing: calculateFinalPrice({
        goldWeightGrams: product.gold_weight_grams,
        todayRatePerGram: rate,
        makingChargeType: product.making_charge_type as 'fixed' | 'percentage',
        makingChargeValue: product.making_charge_value,
        jewellerMargin: product.jeweller_margin,
      }),
    }));
  } catch {
    return [];
  }
}

const marqueeItems = [
  'BIS Hallmarked',
  '22K Purity',
  'Live Gold Pricing',
  'Insured Delivery',
  'Mumbai Atelier',
  'Well-Prepared Jwelleries',
];

const trustPillars = [
  {
    icon: ShieldCheck,
    title: 'Purity You Can Verify',
    description: 'Every piece is anchored by BIS hallmarking, transparent line pricing, and clearly stated 22K specifications.',
  },
  {
    icon: Gem,
    title: 'Craft That Feels Collected',
    description: 'From broad bangles to fine chains, every design is meant to feel ceremonial, sculptural, and gift-worthy.',
  },
  {
    icon: Truck,
    title: 'White-Glove Fulfilment',
    description: 'Protected packaging, careful handling, and concierge support keep the journey as refined as the product itself.',
  },
];

const featuredCollections = [
  {
    title: 'Bridal Gold',
    description: 'Statement bangles, layered necklaces, and ceremonial silhouettes built for wedding wardrobes.',
    href: '/collections',
    accent: 'from-[#f7e5c2] to-[#f4d9a0]',
  },
  {
    title: 'Daily Icons',
    description: 'Rings, pendants, and light earrings that keep the luxury language softer and more wearable.',
    href: '/collections',
    accent: 'from-[#f0ece6] to-[#dfcfba]',
  },
  {
    title: 'Gift Edit',
    description: 'Pieces chosen for milestone gifting, quiet celebration, and private-appointment buying energy.',
    href: '/collections',
    accent: 'from-[#efe0d0] to-[#dcc0a5]',
  },
];

const editorialStats = [
  { value: '22K', label: 'Single-purity focus' },
  { value: '3%', label: 'GST priced clearly' },
  { value: '24h', label: 'Concierge response window' },
];

export default async function HomePage() {
  const products = await getFeaturedProducts();
  const heroProducts = products.slice(0, 3);

  return (
    <div className="overflow-x-hidden">
      <section className="relative px-4 pb-16 pt-10 md:px-8 md:pb-24 md:pt-14">
        <div className="halo-orb left-[-6rem] top-20 h-64 w-64 bg-[radial-gradient(circle,rgba(215,194,133,0.26)_0%,transparent_72%)]" />
        <div className="halo-orb right-[-2rem] top-40 h-72 w-72 bg-[radial-gradient(circle,rgba(179,131,93,0.16)_0%,transparent_76%)]" />

        <div className="soft-grid absolute inset-0 opacity-60" />

        <div className="relative mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
          <div className="pt-6 md:pt-12">
            <div className="mb-8 inline-flex items-center gap-3 rounded-full border border-black/8 bg-white/55 px-4 py-2 text-[10px] uppercase tracking-[0.34em] text-brand-text/55">
              <Star size={12} className="text-brand-accent" />
              Hallmark-led luxury storefront
            </div>

            <div className="max-w-3xl space-y-7">
              <p className="section-kicker">A contemporary Indian jewellery house</p>
              <h1 className="max-w-3xl font-serif text-[3.6rem] leading-[0.86] text-brand-primary sm:text-[4.6rem] md:text-[6rem] lg:text-[7rem]">
                Gold designed to
                <span className="block italic text-[hsl(40,48%,56%)]">feel collected, not crowded.</span>
              </h1>
              <p className="max-w-xl text-base leading-8 copy-muted md:text-lg">
                Built for clients who want a premium buying experience, this storefront pairs live 22K pricing with layered product storytelling, hallmark trust, and a quieter luxury attitude.
              </p>
            </div>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <Link href="/collections" className="button-primary w-full sm:w-auto">
                View Signature Pieces
                <ArrowRight size={14} />
              </Link>
              <Link href="/about" className="button-secondary w-full sm:w-auto">
                Discover The Heritage
              </Link>
            </div>

            <div className="mt-12 grid max-w-xl gap-4 sm:grid-cols-3">
              {editorialStats.map((item) => (
                <div key={item.label} className="luxury-panel rounded-[1.5rem] px-5 py-5">
                  <p className="font-serif text-3xl text-brand-primary">{item.value}</p>
                  <p className="mt-2 text-[10px] uppercase tracking-[0.28em] text-brand-text/42">{item.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="luxury-panel luxury-outline relative overflow-hidden rounded-[2rem] p-5 md:p-7">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(214,190,118,0.14),transparent_32%)]" />

              <div className="relative grid gap-4 md:grid-cols-[1.05fr_0.95fr]">
                <div className="rounded-[1.5rem] border border-black/6 bg-[linear-gradient(180deg,rgba(43,32,22,0.96)_0%,rgba(63,46,29,0.92)_100%)] p-6 text-white">
                  <p className="section-kicker text-brand-accent/90">House Notes</p>
                  <h2 className="mt-4 font-serif text-3xl leading-none md:text-4xl">The jewellery should feel ceremonial before it ever feels transactional.</h2>
                  <div className="metal-line mt-8 h-px w-full" />
                  <div className="mt-8 space-y-4 text-sm leading-7 text-white/65">
                    <p>Live gold rate updates keep the pricing credible.</p>
                    <p>Concierge support keeps high-value purchases personal.</p>
                    <p>Editorial presentation keeps each piece feeling rare.</p>
                  </div>
                </div>

                <div className="grid gap-4">
                  {heroProducts.length > 0 ? (
                    heroProducts.map((product, index) => (
                      <Link
                        key={product.id}
                        href={`/products/${product.slug}`}
                        className={`luxury-panel group flex items-end justify-between rounded-[1.5rem] border border-black/6 p-5 transition-transform duration-300 hover:-translate-y-1 ${
                          index === 0 ? 'min-h-[14rem]' : 'min-h-[11rem]'
                        }`}
                        style={{
                          background:
                            index === 0
                              ? 'linear-gradient(160deg, rgba(255,249,240,0.95) 0%, rgba(240,229,212,0.78) 100%)'
                              : 'linear-gradient(160deg, rgba(255,255,255,0.8) 0%, rgba(246,239,228,0.9) 100%)',
                        }}
                      >
                        <div className="max-w-[11rem]">
                          <p className="text-[9px] uppercase tracking-[0.28em] text-brand-text/38">{product.category ?? 'Jewellery'}</p>
                          <h3 className="mt-2 font-serif text-2xl leading-none text-brand-primary">{product.name}</h3>
                          <p className="mt-4 text-sm text-brand-text/55">
                            {BRAND_CONFIG.currency.symbol}
                            {product.pricing.finalPrice.toLocaleString(BRAND_CONFIG.currency.locale)}
                          </p>
                        </div>
                        <div className="rounded-full border border-black/8 bg-white/65 p-3 text-brand-accent transition-transform duration-300 group-hover:translate-x-1">
                          <ArrowRight size={14} />
                        </div>
                      </Link>
                    ))
                  ) : (
                    <div className="luxury-panel rounded-[1.5rem] p-6">
                      <p className="section-kicker">Signature selection</p>
                      <p className="mt-4 font-serif text-3xl text-brand-primary">Featured designs will appear here as the collection is published.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="overflow-hidden border-y border-black/6 bg-white/55 py-4">
        <div className="flex animate-marquee whitespace-nowrap">
          {[...marqueeItems, ...marqueeItems].map((item, index) => (
            <div key={`${item}-${index}`} className="mx-8 inline-flex items-center gap-3 text-[10px] uppercase tracking-[0.34em] text-brand-text/48">
              <Sparkles size={11} className="text-brand-accent" />
              {item}
            </div>
          ))}
        </div>
      </div>

      <section className="mx-auto max-w-7xl px-4 py-20 md:px-8 md:py-28">
        <div className="grid gap-8 md:grid-cols-3">
          {trustPillars.map((pillar, index) => (
            <div
              key={pillar.title}
              className="luxury-panel rounded-[1.8rem] p-7 md:p-8 animate-fade-in-up"
              style={{ animationDelay: `${index * 0.08}s` }}
            >
              <div className="inline-flex rounded-full border border-black/8 bg-white/60 p-3 text-brand-accent">
                <pillar.icon size={18} />
              </div>
              <h2 className="mt-6 font-serif text-3xl leading-none text-brand-primary">{pillar.title}</h2>
              <p className="mt-4 text-sm leading-7 copy-muted">{pillar.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-8 md:px-8 md:pb-12">
        <div className="mb-10 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="section-kicker">Featured collections</p>
            <h2 className="mt-4 max-w-3xl font-serif text-4xl leading-none text-brand-primary md:text-6xl">
              Collection stories designed to feel more like curated salons than crowded categories.
            </h2>
          </div>
          <Link href="/collections" className="button-secondary w-full sm:w-auto">
            Browse all categories
          </Link>
        </div>

        <div className="grid gap-5 lg:grid-cols-3">
          {featuredCollections.map((collection) => (
            <Link
              key={collection.title}
              href={collection.href}
              className={`group luxury-panel rounded-[2rem] bg-gradient-to-br ${collection.accent} p-8 transition-transform duration-300 hover:-translate-y-1`}
            >
              <p className="section-kicker text-brand-text/45">Edit</p>
              <h3 className="mt-4 font-serif text-4xl leading-none text-brand-primary">{collection.title}</h3>
              <p className="mt-5 max-w-sm text-sm leading-7 text-brand-text/60">{collection.description}</p>
              <div className="mt-8 inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.28em] text-brand-text/48">
                Explore
                <ArrowRight size={12} className="transition-transform duration-300 group-hover:translate-x-1" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-20 md:px-8 md:pb-28">
        <div className="mb-12 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="section-kicker">Signature edit</p>
            <h2 className="mt-4 max-w-3xl font-serif text-4xl leading-none text-brand-primary md:text-6xl">
              A tighter, more premium curation for rings, bangles, chains, and ceremonial sets.
            </h2>
          </div>
          <Link href="/collections" className="button-secondary w-full sm:w-auto">
            Shop All Collections
          </Link>
        </div>

        {products.length === 0 ? (
          <div className="luxury-panel rounded-[2rem] px-8 py-16 text-center">
            <p className="section-kicker">Collection loading</p>
            <p className="mt-5 font-serif text-3xl text-brand-primary">Add product images and your hero catalogue will render here automatically.</p>
          </div>
        ) : (
          <ProductGrid products={products} />
        )}
      </section>

      <section className="relative overflow-hidden bg-brand-primary px-4 py-20 text-white md:px-8 md:py-28">
        <div className="halo-orb left-[8%] top-14 h-48 w-48 bg-[radial-gradient(circle,rgba(214,190,118,0.18)_0%,transparent_70%)]" />
        <div className="relative mx-auto grid max-w-6xl gap-10 md:grid-cols-[1.05fr_0.95fr] md:items-center">
          <div className="space-y-6">
            <p className="section-kicker text-brand-accent/90">Why it feels elevated</p>
            <h2 className="font-serif text-4xl leading-none md:text-6xl">
              Product pages should read like private appointments, not crowded marketplaces.
            </h2>
            <p className="max-w-xl text-sm leading-8 text-white/62 md:text-base">
              Each view has been shaped to make hallmark confidence, rate clarity, and the product silhouette feel central. That is what makes jewellery trust-worthy online.
            </p>
          </div>
          <div className="luxury-panel rounded-[2rem] border border-white/10 bg-white/7 p-7 text-white shadow-none">
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="rounded-[1.4rem] border border-white/10 bg-white/5 p-5">
                <p className="text-[10px] uppercase tracking-[0.28em] text-white/45">Pricing</p>
                <p className="mt-3 font-serif text-3xl">Live 22K</p>
                <p className="mt-2 text-sm leading-6 text-white/55">Server-calculated totals with making charges, margin, and GST shown clearly.</p>
              </div>
              <div className="rounded-[1.4rem] border border-white/10 bg-white/5 p-5">
                <p className="text-[10px] uppercase tracking-[0.28em] text-white/45">Trust</p>
                <p className="mt-3 font-serif text-3xl">BIS-first</p>
                <p className="mt-2 text-sm leading-6 text-white/55">Purity, hallmarking, and order-time rate locking remain visible through the whole flow.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
