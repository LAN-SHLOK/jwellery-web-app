'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { ArrowRight, Award, Gem, ShieldCheck, Sparkles, Star, Truck, ChevronDown } from 'lucide-react';

import ProductGrid from '@/components/product/ProductGrid';
import { BRAND_CONFIG } from '@/config/brand';

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

export default function HomePage() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95]);

  useEffect(() => {
    fetch('/api/products')
      .then(res => res.json())
      .then(data => {
        setProducts(data.products || []);
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  }, []);

  return (
    <div className="overflow-x-hidden">
      <motion.section 
        className="relative px-4 pb-16 pt-10 md:px-8 md:pb-24 md:pt-14 min-h-[90vh] flex items-center"
        style={{ opacity, scale }}
      >
        <motion.div 
          className="halo-orb left-[-6rem] top-20 h-64 w-64 bg-[radial-gradient(circle,rgba(215,194,133,0.26)_0%,transparent_72%)]"
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div 
          className="halo-orb right-[-2rem] top-40 h-72 w-72 bg-[radial-gradient(circle,rgba(179,131,93,0.16)_0%,transparent_76%)]"
          animate={{ 
            scale: [1, 1.1, 1],
            opacity: [0.2, 0.4, 0.2]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        />

        <div className="soft-grid absolute inset-0 opacity-60" />

        <div className="relative mx-auto w-full max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center"
          >
            <motion.div 
              className="mb-8 inline-flex items-center gap-3 rounded-full border border-black/8 bg-white/55 px-4 py-2 text-[10px] uppercase tracking-[0.34em] text-brand-text/55"
              whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.75)" }}
              transition={{ duration: 0.2 }}
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              >
                <Star size={12} className="text-brand-accent" />
              </motion.div>
              Hallmark-led luxury storefront
            </motion.div>

            <div className="mx-auto max-w-5xl space-y-7">
              <motion.p 
                className="section-kicker"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                A contemporary Indian jewellery house
              </motion.p>
              
              <motion.h1 
                className="font-serif text-[3.6rem] leading-[0.86] text-brand-primary sm:text-[4.6rem] md:text-[6rem] lg:text-[8rem]"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.8 }}
              >
                Gold designed to
                <motion.span 
                  className="block italic text-[hsl(40,48%,56%)]"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6, duration: 0.8 }}
                >
                  feel collected, not crowded.
                </motion.span>
              </motion.h1>
              
              <motion.p 
                className="mx-auto max-w-2xl text-base leading-8 copy-muted md:text-lg"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
              >
                Built for clients who want a premium buying experience, this storefront pairs live 22K pricing with layered product storytelling, hallmark trust, and a quieter luxury attitude.
              </motion.p>
            </div>

            <motion.div 
              className="mt-10 flex flex-col gap-4 sm:flex-row justify-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
            >
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link href="/collections" className="button-primary inline-flex items-center gap-3">
                  View Signature Pieces
                  <ArrowRight size={14} />
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link href="/about" className="button-secondary inline-flex items-center gap-3">
                  Discover The Heritage
                </Link>
              </motion.div>
            </motion.div>

            <motion.div 
              className="mt-16 grid max-w-3xl mx-auto gap-4 sm:grid-cols-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
            >
              {editorialStats.map((item, index) => (
                <motion.div
                  key={item.label}
                  className="luxury-panel rounded-[1.5rem] px-5 py-5"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.3 + index * 0.1 }}
                  whileHover={{ y: -5, boxShadow: "0 20px 40px rgba(0,0,0,0.1)" }}
                >
                  <p className="font-serif text-3xl text-brand-primary">{item.value}</p>
                  <p className="mt-2 text-[10px] uppercase tracking-[0.28em] text-brand-text/42">{item.label}</p>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          <motion.div
            className="absolute bottom-8 left-1/2 -translate-x-1/2"
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <ChevronDown size={32} className="text-brand-accent/40" />
          </motion.div>
        </div>
      </motion.section>

      <motion.div 
        className="overflow-hidden border-y border-black/6 bg-white/55 py-4"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        <div className="flex animate-marquee whitespace-nowrap">
          {[...marqueeItems, ...marqueeItems].map((item, index) => (
            <div key={`${item}-${index}`} className="mx-8 inline-flex items-center gap-3 text-[10px] uppercase tracking-[0.34em] text-brand-text/48">
              <Sparkles size={11} className="text-brand-accent" />
              {item}
            </div>
          ))}
        </div>
      </motion.div>

      <section className="mx-auto max-w-7xl px-4 py-20 md:px-8 md:py-28">
        <div className="grid gap-8 md:grid-cols-3">
          {trustPillars.map((pillar, index) => (
            <motion.div
              key={pillar.title}
              className="luxury-panel rounded-[1.8rem] p-7 md:p-8"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ delay: index * 0.15, duration: 0.6 }}
              whileHover={{ y: -8, boxShadow: "0 25px 50px rgba(0,0,0,0.12)" }}
            >
              <motion.div 
                className="inline-flex rounded-full border border-black/8 bg-white/60 p-3 text-brand-accent"
                whileHover={{ rotate: 360, scale: 1.1 }}
                transition={{ duration: 0.6 }}
              >
                <pillar.icon size={18} />
              </motion.div>
              <h2 className="mt-6 font-serif text-3xl leading-none text-brand-primary">{pillar.title}</h2>
              <p className="mt-4 text-sm leading-7 copy-muted">{pillar.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-8 md:px-8 md:pb-12">
        <motion.div 
          className="mb-10 flex flex-col gap-5 md:flex-row md:items-end md:justify-between"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div>
            <p className="section-kicker">Featured collections</p>
            <h2 className="mt-4 max-w-3xl font-serif text-4xl leading-none text-brand-primary md:text-6xl">
              Collection stories designed to feel more like curated salons.
            </h2>
          </div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link href="/collections" className="button-secondary inline-flex items-center gap-3">
              Browse all categories
            </Link>
          </motion.div>
        </motion.div>

        <div className="grid gap-5 lg:grid-cols-3">
          {featuredCollections.map((collection, index) => (
            <motion.div
              key={collection.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              whileHover={{ y: -10, scale: 1.02 }}
            >
              <Link
                href={collection.href}
                className={`block luxury-panel rounded-[2rem] bg-gradient-to-br ${collection.accent} p-8`}
              >
                <p className="section-kicker text-brand-text/45">Edit</p>
                <h3 className="mt-4 font-serif text-4xl leading-none text-brand-primary">{collection.title}</h3>
                <p className="mt-5 max-w-sm text-sm leading-7 text-brand-text/60">{collection.description}</p>
                <motion.div 
                  className="mt-8 inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.28em] text-brand-text/48"
                  whileHover={{ x: 5 }}
                >
                  Explore
                  <ArrowRight size={12} />
                </motion.div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-20 md:px-8 md:pb-28">
        <motion.div 
          className="mb-12 flex flex-col gap-5 md:flex-row md:items-end md:justify-between"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <div>
            <p className="section-kicker">Signature edit</p>
            <h2 className="mt-4 max-w-3xl font-serif text-4xl leading-none text-brand-primary md:text-6xl">
              A tighter, more premium curation for rings, bangles, chains, and ceremonial sets.
            </h2>
          </div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link href="/collections" className="button-secondary inline-flex items-center gap-3">
              Shop All Collections
            </Link>
          </motion.div>
        </motion.div>

        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="luxury-panel rounded-[2rem] px-8 py-16 text-center"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="mx-auto w-12 h-12 border-4 border-brand-accent/20 border-t-brand-accent rounded-full"
              />
            </motion.div>
          ) : products.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="luxury-panel rounded-[2rem] px-8 py-16 text-center"
            >
              <p className="section-kicker">Collection loading</p>
              <p className="mt-5 font-serif text-3xl text-brand-primary">Add product images and your hero catalogue will render here automatically.</p>
            </motion.div>
          ) : (
            <motion.div
              key="products"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
            >
              <ProductGrid products={products} />
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      <motion.section 
        className="relative overflow-hidden bg-brand-primary px-4 py-20 text-white md:px-8 md:py-28"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        <motion.div 
          className="halo-orb left-[8%] top-14 h-48 w-48 bg-[radial-gradient(circle,rgba(214,190,118,0.18)_0%,transparent_70%)]"
          animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />
        <div className="relative mx-auto grid max-w-6xl gap-10 md:grid-cols-[1.05fr_0.95fr] md:items-center">
          <motion.div 
            className="space-y-6"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <p className="section-kicker text-brand-accent/90">Why it feels elevated</p>
            <h2 className="font-serif text-4xl leading-none md:text-6xl">
              Product pages should read like private appointments, not crowded marketplaces.
            </h2>
            <p className="max-w-xl text-sm leading-8 text-white/75 md:text-base">
              Each view has been shaped to make hallmark confidence, rate clarity, and the product silhouette feel central. That is what makes jewellery trust-worthy online.
            </p>
          </motion.div>
          <motion.div 
            className="luxury-panel rounded-[2rem] border border-white/10 bg-white/7 p-7 text-white shadow-none"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="grid gap-5 sm:grid-cols-2">
              {[
                { label: 'Pricing', title: 'Live 22K', desc: 'Server-calculated totals with making charges, margin, and GST shown clearly.' },
                { label: 'Trust', title: 'BIS-first', desc: 'Purity, hallmarking, and order-time rate locking remain visible through the whole flow.' }
              ].map((item, index) => (
                <motion.div
                  key={item.label}
                  className="rounded-[1.4rem] border border-white/10 bg-white/5 p-5"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.2 }}
                  whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.1)" }}
                >
                  <p className="text-[10px] uppercase tracking-[0.28em] text-white/45">{item.label}</p>
                  <p className="mt-3 font-serif text-3xl">{item.title}</p>
                  <p className="mt-2 text-sm leading-6 text-white/65">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </motion.section>
    </div>
  );
}
