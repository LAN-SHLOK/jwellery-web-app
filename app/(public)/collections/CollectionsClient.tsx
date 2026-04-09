'use client';

import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
        <motion.div 
          className="halo-orb right-[6%] top-10 h-64 w-64 bg-[radial-gradient(circle,rgba(214,190,118,0.18)_0%,transparent_72%)]"
          animate={{ 
            scale: [1, 1.3, 1],
            x: [0, 40, 0],
            opacity: [0.2, 0.4, 0.2]
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />

        <div className="relative mx-auto max-w-7xl">
          <motion.div 
            className="luxury-panel rounded-[2rem] px-6 py-8 md:px-10 md:py-12"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="grid gap-8 md:grid-cols-[1.15fr_0.85fr] md:items-end">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
              >
                <p className="section-kicker">Curated catalogue</p>
                <h1 className="mt-4 font-serif text-5xl leading-[0.9] text-brand-primary md:text-7xl">
                  All collections,
                  <motion.span 
                    className="block italic text-[hsl(40,48%,56%)]"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    edited like an atelier floor.
                  </motion.span>
                </h1>
                <motion.p 
                  className="mt-5 max-w-xl text-sm leading-7 copy-muted md:text-base"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                >
                  Browse category-led collections with live 22K pricing, ceremonial silhouettes, and the calmer cadence expected from a premium jewellery house.
                </motion.p>
              </motion.div>

              <motion.div 
                className="grid gap-4 sm:grid-cols-2"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
              >
                {[
                  { label: 'Products shown', value: products.length },
                  { label: 'Rate basis', value: '22K' }
                ].map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    className="rounded-[1.4rem] border border-black/8 bg-white/60 p-5"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 + index * 0.1, type: "spring" }}
                    whileHover={{ y: -5, boxShadow: "0 20px 40px rgba(0,0,0,0.1)" }}
                  >
                    <p className="text-[10px] uppercase tracking-[0.28em] text-brand-text/42">{stat.label}</p>
                    <motion.p 
                      className="mt-3 font-serif text-4xl text-brand-primary"
                      key={stat.value}
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ type: "spring", stiffness: 200 }}
                    >
                      {stat.value}
                    </motion.p>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      <motion.div 
        className="sticky top-20 z-40 border-y border-black/6 bg-[rgba(255,252,246,0.9)] backdrop-blur-xl md:top-[7rem]"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ delay: 0.8, type: "spring", stiffness: 100 }}
      >
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <div className="flex flex-col gap-3 py-4 md:flex-row md:items-center md:justify-between">
            <motion.div 
              className="flex items-center gap-2 text-[10px] uppercase tracking-[0.28em] text-brand-text/42"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              >
                <Filter size={12} className="text-brand-accent" />
              </motion.div>
              Filter by category
            </motion.div>
            <div className="flex items-center gap-1 overflow-x-auto scrollbar-none">
              {CATEGORIES.map((category, index) => {
                const isActive = activeCategory === category.slug;

                return (
                  <motion.button
                    key={String(category.slug)}
                    onClick={() => setActiveCategory(category.slug)}
                    className={`shrink-0 rounded-full border px-4 py-2.5 text-[10px] uppercase tracking-[0.25em] transition-colors ${
                      isActive
                        ? 'border-brand-accent bg-brand-primary text-white'
                        : 'border-black/8 bg-white/58 text-brand-text/56 hover:bg-white hover:text-brand-text'
                    }`}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1 + index * 0.05 }}
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {category.label}
                  </motion.button>
                );
              })}
            </div>
          </div>
        </div>
      </motion.div>

      <div className="mx-auto max-w-7xl px-4 py-12 md:px-8 md:py-16">
        <motion.div 
          className="mb-8 flex flex-col gap-2 md:flex-row md:items-center md:justify-between"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
        >
          <p className="text-[10px] uppercase tracking-[0.28em] text-brand-text/38">
            {activeCategory ? `${products.length} products in ${activeCategory}` : `${products.length} products across the house`}
          </p>
          <p className="flex items-center gap-2 text-[10px] uppercase tracking-[0.28em] text-brand-text/38">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <Sparkles size={11} className="text-brand-accent" />
            </motion.div>
            Prices reflect today&apos;s live 22K gold rate · {BRAND_CONFIG.currency.code}
          </p>
        </motion.div>

        <AnimatePresence mode="wait">
          {products.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="luxury-panel rounded-[2rem] px-8 py-20 text-center"
            >
              <p className="section-kicker">No products here yet</p>
              <p className="mt-5 font-serif text-3xl text-brand-primary">This category is empty right now, but the wider collection is still available.</p>
              <motion.button 
                onClick={() => setActiveCategory(null)} 
                className="button-secondary mt-8"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                View everything
              </motion.button>
            </motion.div>
          ) : (
            <motion.div
              key="products"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <ProductGrid products={products} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
