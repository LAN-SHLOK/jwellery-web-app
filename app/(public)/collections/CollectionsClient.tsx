'use client';

import React, { useMemo, useState } from 'react';
import { Filter, Sparkles } from 'lucide-react';

import { BRAND_CONFIG } from '@/config/brand';
import ProductGrid from '@/components/product/ProductGrid';

const CATEGORIES = [
  { slug: null, label: 'Everything' },
  { slug: 'ring', label: 'Rings' },
  { slug: 'chain', label: 'Chains' },
  { slug: 'earring', label: 'Earrings' },
  { slug: 'bangle', label: 'Bangles' },
  { slug: 'pendant', label: 'Pendants' },
  { slug: 'necklace', label: 'Necklaces' },
];

type CollectionsClientProps = {
  initialProducts: any[];
};

export default function CollectionsClient({ initialProducts }: CollectionsClientProps) {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const products = useMemo(() => {
    if (!activeCategory) {
      return initialProducts;
    }

    return initialProducts.filter((product) => product.category === activeCategory);
  }, [activeCategory, initialProducts]);

  return (
    <div className="min-h-screen">
      <section className="relative overflow-hidden px-4 pb-14 pt-12 md:px-8 md:pb-18 md:pt-16">
        <div className="soft-grid absolute inset-0 opacity-60" />
        <div className="halo-orb right-[6%] top-10 h-64 w-64 bg-[radial-gradient(circle,rgba(214,190,118,0.18)_0%,transparent_72%)]" />

        <div className="relative mx-auto max-w-7xl">
          <div className="luxury-panel rounded-[2rem] px-6 py-8 md:px-10 md:py-12">
            <div className="grid gap-8 md:grid-cols-[1.15fr_0.85fr] md:items-end">
              <div>
                <p className="section-kicker">Curated catalogue</p>
                <h1 className="mt-4 font-serif text-5xl leading-[0.9] text-brand-primary md:text-7xl">
                  All collections,
                  <span className="block italic text-[hsl(40,48%,56%)]">edited like an atelier floor.</span>
                </h1>
                <p className="mt-5 max-w-xl text-sm leading-7 copy-muted md:text-base">
                  Browse category-led collections with live 22K pricing, ceremonial silhouettes, and the calmer cadence expected from a premium jewellery house.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-[1.4rem] border border-black/8 bg-white/60 p-5">
                  <p className="text-[10px] uppercase tracking-[0.28em] text-brand-text/42">Products shown</p>
                  <p className="mt-3 font-serif text-4xl text-brand-primary">{products.length}</p>
                </div>
                <div className="rounded-[1.4rem] border border-black/8 bg-white/60 p-5">
                  <p className="text-[10px] uppercase tracking-[0.28em] text-brand-text/42">Rate basis</p>
                  <p className="mt-3 font-serif text-4xl text-brand-primary">22K</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="sticky top-20 z-40 border-y border-black/6 bg-[rgba(255,252,246,0.9)] backdrop-blur-xl md:top-[7rem]">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <div className="flex flex-col gap-3 py-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.28em] text-brand-text/42">
              <Filter size={12} className="text-brand-accent" />
              Filter by category
            </div>
            <div className="flex items-center gap-1 overflow-x-auto scrollbar-none">
              {CATEGORIES.map((category) => {
                const isActive = activeCategory === category.slug;

                return (
                  <button
                    key={String(category.slug)}
                    onClick={() => setActiveCategory(category.slug)}
                    className={`shrink-0 rounded-full border px-4 py-2.5 text-[10px] uppercase tracking-[0.25em] transition-colors ${
                      isActive
                        ? 'border-brand-accent bg-brand-primary text-white'
                        : 'border-black/8 bg-white/58 text-brand-text/56 hover:bg-white hover:text-brand-text'
                    }`}
                  >
                    {category.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-12 md:px-8 md:py-16">
        <div className="mb-8 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <p className="text-[10px] uppercase tracking-[0.28em] text-brand-text/38">
            {activeCategory ? `${products.length} products in ${activeCategory}` : `${products.length} products across the house`}
          </p>
          <p className="flex items-center gap-2 text-[10px] uppercase tracking-[0.28em] text-brand-text/38">
            <Sparkles size={11} className="text-brand-accent" />
            Prices reflect today&apos;s live 22K gold rate · {BRAND_CONFIG.currency.code}
          </p>
        </div>

        {products.length === 0 ? (
          <div className="luxury-panel rounded-[2rem] px-8 py-20 text-center animate-fade-in">
            <p className="section-kicker">No products here yet</p>
            <p className="mt-5 font-serif text-3xl text-brand-primary">This category is empty right now, but the wider collection is still available.</p>
            <button onClick={() => setActiveCategory(null)} className="button-secondary mt-8">
              View everything
            </button>
          </div>
        ) : (
          <div className="animate-fade-in">
            <ProductGrid products={products} />
          </div>
        )}
      </div>
    </div>
  );
}


