'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowRight,
  Award,
  Check,
  ChevronDown,
  Heart,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
} from 'lucide-react';

import { BRAND_CONFIG, whatsappChatUrl } from '@/config/brand';
import { getProductFallbackImage, getStorefrontAvailability } from '@/lib/product-presentation';
import { useCart, useWishlist } from '@/lib/store';

type Pricing = {
  goldValue: number;
  makingCharges: number;
  subtotal: number;
  gst: number;
  finalPrice: number;
};

type Product = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  category: string | null;
  gold_weight_grams: number;
  gold_purity: '18K' | '22K';
  making_charge_type: 'fixed' | 'percentage';
  making_charge_value: number;
  jeweller_margin: number;
  images: string[];
  stock_quantity: number;
  hallmark_number: string | null;
};

type Props = {
  product: Product;
  pricing: Pricing;
  goldRate: number;
};

const assurancePoints = [
  'Live 22K pricing locked at order time',
  'BIS hallmark specification preserved on the receipt',
  'Concierge support available before and after purchase',
];

export default function ProductDetailClient({ product, pricing, goldRate }: Props) {
  const [showBreakdown, setShowBreakdown] = useState(false);
  const [activeImg, setActiveImg] = useState(0);
  const [justAdded, setJustAdded] = useState(false);
  const [imgError, setImgError] = useState<Record<number, boolean>>({});
  const { addItem } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const inWishlist = isInWishlist(product.slug);

  const images = product.images ?? [];
  const stock = product.stock_quantity ?? 0;
  const outOfStock = stock === 0;
  const availability = getStorefrontAvailability(stock);
  const fallbackImage = getProductFallbackImage(product.category);
  const activeImageUrl = images[activeImg] && !imgError[activeImg] ? images[activeImg] : fallbackImage;
  const isFallbackImage = !images[activeImg] || Boolean(imgError[activeImg]);

  function handleAddToCart() {
    addItem(product, pricing);
    setJustAdded(true);
    window.setTimeout(() => setJustAdded(false), 1800);
  }

  function handleWishlistToggle() {
    if (inWishlist) {
      removeFromWishlist(product.slug);
    } else {
      addToWishlist(product);
    }
  }

  const enquireUrl =
    whatsappChatUrl(BRAND_CONFIG.contact.whatsapp) +
    `?text=${encodeURIComponent(`Hi, I'm interested in ${product.name}`)}`;

  return (
    <div className="px-4 pb-24 pt-10 md:px-8 md:pb-28 md:pt-12 relative overflow-hidden">
      <motion.div
        className="absolute top-40 right-[5%] w-96 h-96 rounded-full bg-gradient-to-br from-brand-primary/8 to-transparent blur-3xl"
        animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 8, repeat: Infinity }}
      />
      <motion.div
        className="absolute bottom-60 left-[8%] w-80 h-80 rounded-full bg-gradient-to-br from-brand-accent/10 to-transparent blur-3xl"
        animate={{ scale: [1, 1.2, 1], x: [0, 20, 0] }}
        transition={{ duration: 7, repeat: Infinity, delay: 1.5 }}
      />
      <div className="mx-auto max-w-7xl relative z-10">
        <motion.div
          className="mb-8 flex flex-wrap items-center gap-3 text-[10px] uppercase tracking-[0.28em] text-brand-text/42"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Link href="/collections" className="transition-colors hover:text-brand-text">
            Collections
          </Link>
          <span>/</span>
          <span>{product.category ?? 'Jewellery'}</span>
          <span>/</span>
          <span>{product.gold_purity || '22K'} Gold</span>
        </motion.div>

        <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:gap-16">
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.55, ease: 'easeOut' }}
            className="space-y-4"
          >
            <div className="luxury-panel overflow-hidden rounded-[2rem] p-3 md:p-4">
              <div className="relative aspect-[4/5] overflow-hidden rounded-[1.6rem] bg-[linear-gradient(180deg,rgba(250,244,235,0.96)_0%,rgba(233,224,208,0.9)_100%)]">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`${activeImg}-${activeImageUrl}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="absolute inset-0"
                  >
                    <Image
                      src={activeImageUrl}
                      alt={product.name}
                      fill
                      priority
                      sizes="(max-width: 1024px) 100vw, 48vw"
                      className={isFallbackImage ? 'object-contain p-12 opacity-80' : 'object-cover'}
                      onError={() => setImgError((value) => ({ ...value, [activeImg]: true }))}
                    />
                  </motion.div>
                </AnimatePresence>

                <div className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-[rgba(29,20,13,0.68)] via-[rgba(29,20,13,0.18)] to-transparent" />

                <div className="absolute left-5 top-5 z-10 flex flex-wrap gap-2">
                  <span className="rounded-full border border-white/65 bg-white/70 px-3 py-2 text-[9px] uppercase tracking-[0.28em] text-brand-text/55 backdrop-blur">
                    {product.category ?? 'Jewellery'}
                  </span>
                  {availability.badgeLabel && (
                    <span className="rounded-full bg-amber-50/95 px-3 py-2 text-[9px] uppercase tracking-[0.28em] text-amber-700">
                      {availability.badgeLabel}
                    </span>
                  )}
                </div>

                <div className="absolute bottom-5 left-5 right-5 z-10 md:bottom-6 md:left-6 md:right-6">
                  <div className="grid gap-3 md:grid-cols-[1fr_auto]">
                    <div className="rounded-[1.3rem] border border-white/18 bg-white/12 px-4 py-4 text-white backdrop-blur-md">
                      <p className="text-[9px] uppercase tracking-[0.28em] text-white/55">Certified hallmark</p>
                      <div className="mt-2 flex items-center gap-2">
                        <Award size={14} className="text-brand-accent" />
                        <p className="text-sm font-semibold">{product.hallmark_number || 'BIS certified purity'}</p>
                      </div>
                    </div>
                    <div className="rounded-[1.3rem] border border-white/18 bg-white/12 px-4 py-4 text-white backdrop-blur-md">
                      <p className="text-[9px] uppercase tracking-[0.28em] text-white/55">Live price</p>
                      <p className="mt-2 font-serif text-2xl">
                        {BRAND_CONFIG.currency.symbol}
                        {pricing.finalPrice.toLocaleString(BRAND_CONFIG.currency.locale)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-none">
                {images.map((image, index) => (
                  <button
                    key={`${image}-${index}`}
                    onClick={() => setActiveImg(index)}
                    className={`relative h-24 w-20 shrink-0 overflow-hidden rounded-[1.1rem] border p-1 transition-all ${
                      index === activeImg ? 'border-brand-accent bg-white/70' : 'border-black/8 bg-white/40'
                    }`}
                    aria-label={`View product image ${index + 1}`}
                  >
                    <div className="relative h-full w-full overflow-hidden rounded-[0.9rem] bg-brand-muted">
                      <Image
                        src={image && !imgError[index] ? image : fallbackImage}
                        alt=""
                        fill
                        sizes="80px"
                        className={image && !imgError[index] ? 'object-cover' : 'object-contain p-2 opacity-70'}
                        onError={() => setImgError((value) => ({ ...value, [index]: true }))}
                      />
                    </div>
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.55, ease: 'easeOut', delay: 0.08 }}
            className="space-y-8"
          >
            <div className="space-y-4">
              <p className="section-kicker">Private viewing</p>
              <h1 className="font-serif text-5xl leading-[0.92] text-brand-primary md:text-7xl">{product.name}</h1>
              <p className="max-w-2xl text-sm leading-7 copy-muted md:text-base">
                {product.description ??
                  'A hallmark-led 22K gold design created to balance ceremonial richness with a cleaner, modern wardrobe sensibility.'}
              </p>
            </div>

            <motion.div
              className="luxury-panel rounded-[2rem] p-6 md:p-8"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.28em] text-brand-text/38">Final price</p>
                  <div className="mt-3 flex items-end gap-3">
                    <motion.span
                      className="font-serif text-4xl leading-none text-brand-primary md:text-5xl"
                      initial={{ scale: 0.8, opacity: 0 }}
                      whileInView={{ scale: 1, opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ type: 'spring', duration: 0.8 }}
                    >
                      {BRAND_CONFIG.currency.symbol}
                      {pricing.finalPrice.toLocaleString(BRAND_CONFIG.currency.locale)}
                    </motion.span>
                    <span className="pb-2 text-[10px] uppercase tracking-[0.28em] text-brand-text/38">GST included</span>
                  </div>
                </div>
                <motion.div
                  className="rounded-[1.4rem] border border-black/8 bg-white/55 px-5 py-4"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                >
                  <p className="text-[10px] uppercase tracking-[0.28em] text-brand-text/38">Today&apos;s {product.gold_purity || '22K'} rate</p>
                  <p className="mt-2 font-serif text-3xl text-brand-primary">
                    {BRAND_CONFIG.currency.symbol}
                    {goldRate.toLocaleString(BRAND_CONFIG.currency.locale)}
                  </p>
                </motion.div>
              </div>

              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                {[
                  { label: 'Gold weight', value: `${product.gold_weight_grams}g` },
                  { label: 'Purity', value: `${product.gold_purity || '22K'} Gold` },
                  { label: 'Hallmark', value: product.hallmark_number || 'BIS Certified' },
                  { label: 'Category', value: product.category || 'Jewellery' },
                ].map((item, idx) => (
                  <motion.div
                    key={item.label}
                    className="rounded-[1.3rem] border border-black/8 bg-white/58 px-5 py-5"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                    whileHover={{ scale: 1.03, boxShadow: '0 10px 30px rgba(0,0,0,0.08)' }}
                  >
                    <p className="text-[10px] uppercase tracking-[0.28em] text-brand-text/38">{item.label}</p>
                    <p className="mt-3 font-serif text-2xl leading-none text-brand-primary">{item.value}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <div className="grid gap-5 md:grid-cols-[1fr_0.88fr]">
              <motion.div
                className="luxury-panel rounded-[2rem] p-6 md:p-7"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
              >
                <button
                  onClick={() => setShowBreakdown((value) => !value)}
                  className="flex w-full items-center justify-between"
                  aria-expanded={showBreakdown}
                >
                  <div>
                    <p className="section-kicker">Transparent pricing</p>
                    <p className="mt-2 font-serif text-3xl leading-none text-brand-primary">View full breakdown</p>
                  </div>
                  <motion.div animate={{ rotate: showBreakdown ? 180 : 0 }} transition={{ duration: 0.2 }}>
                    <ChevronDown size={16} />
                  </motion.div>
                </button>

                <AnimatePresence initial={false}>
                  {showBreakdown && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="mt-6 space-y-4 border-t border-black/6 pt-6 text-[11px] uppercase tracking-[0.22em] text-brand-text/52">
                        <div className="flex justify-between gap-4">
                          <span>
                            Gold value ({product.gold_weight_grams}g {product.gold_purity || '22K'} x {BRAND_CONFIG.currency.symbol}
                            {goldRate.toLocaleString(BRAND_CONFIG.currency.locale)})
                          </span>
                          <span>
                            {BRAND_CONFIG.currency.symbol}
                            {pricing.goldValue.toLocaleString(BRAND_CONFIG.currency.locale)}
                          </span>
                        </div>
                        <div className="flex justify-between gap-4">
                          <span>Making charges</span>
                          <span>
                            {BRAND_CONFIG.currency.symbol}
                            {pricing.makingCharges.toLocaleString(BRAND_CONFIG.currency.locale)}
                          </span>
                        </div>
                        <div className="flex justify-between gap-4">
                          <span>Jeweller margin</span>
                          <span>
                            {BRAND_CONFIG.currency.symbol}
                            {product.jeweller_margin.toLocaleString(BRAND_CONFIG.currency.locale)}
                          </span>
                        </div>
                        <div className="flex justify-between gap-4">
                          <span>GST (3%)</span>
                          <span>
                            {BRAND_CONFIG.currency.symbol}
                            {pricing.gst.toLocaleString(BRAND_CONFIG.currency.locale)}
                          </span>
                        </div>
                        <div className="flex justify-between gap-4 border-t border-black/6 pt-4 text-sm font-semibold text-brand-primary">
                          <span>Total</span>
                          <span>
                            {BRAND_CONFIG.currency.symbol}
                            {pricing.finalPrice.toLocaleString(BRAND_CONFIG.currency.locale)}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>

              <motion.div
                className="luxury-panel rounded-[2rem] p-6 md:p-7"
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
              >
                <p className="section-kicker">Assurance</p>
                <div className="mt-4 space-y-4">
                  {assurancePoints.map((point, idx) => (
                    <motion.div
                      key={point}
                      className="flex items-start gap-3 text-sm leading-7 text-brand-text/60"
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: idx * 0.1 }}
                    >
                      <ShieldCheck size={15} className="mt-1 shrink-0 text-brand-accent" />
                      <span>{point}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              {outOfStock ? (
                <motion.div
                  className="flex h-14 items-center justify-center rounded-full border border-black/8 bg-black/4 text-[10px] uppercase tracking-[0.3em] text-brand-text/38"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  Currently unavailable
                </motion.div>
              ) : (
                <motion.button
                  onClick={handleAddToCart}
                  disabled={justAdded}
                  className={`button-primary h-14 rounded-full ${
                    justAdded ? 'bg-[linear-gradient(135deg,#165f3f_0%,#218a5a_100%)] hover:translate-y-0' : ''
                  }`}
                  whileHover={!justAdded ? { scale: 1.02 } : {}}
                  whileTap={!justAdded ? { scale: 0.98 } : {}}
                  animate={justAdded ? { scale: [1, 1.05, 1] } : {}}
                >
                  {justAdded ? (
                    <>
                      <motion.div
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ type: 'spring', duration: 0.5 }}
                      >
                        <Check size={14} />
                      </motion.div>
                      Added to bag
                    </>
                  ) : (
                    <>
                      <ShoppingBag size={14} />
                      Add to bag
                    </>
                  )}
                </motion.button>
              )}

              <motion.button
                onClick={handleWishlistToggle}
                className={`button-secondary h-14 rounded-full ${
                  inWishlist ? 'border-brand-accent bg-brand-accent/10' : ''
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <motion.div
                  animate={inWishlist ? { scale: [1, 1.3, 1] } : {}}
                  transition={{ duration: 0.3 }}
                >
                  <Heart size={14} className={inWishlist ? 'fill-brand-accent text-brand-accent' : ''} />
                </motion.div>
                {inWishlist ? 'Saved' : 'Save for Later'}
              </motion.button>
            </div>

            <motion.a
              href={enquireUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="button-secondary h-14 rounded-full w-full"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Sparkles size={14} />
              Enquire on WhatsApp
            </motion.a>

            <motion.div
              className="luxury-panel rounded-[2rem] p-6 md:p-7"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="section-kicker">Styling note</p>
                  <p className="mt-3 font-serif text-3xl leading-none text-brand-primary">Designed for private gifting, bridal layering, and statement-led daily wear.</p>
                </div>
                <motion.div
                  className="rounded-full border border-black/8 bg-white/55 p-3 text-brand-accent"
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  <Sparkles size={18} />
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-black/8 bg-[rgba(255,252,246,0.94)] p-3 backdrop-blur-xl lg:hidden">
        <div className="mx-auto flex max-w-7xl items-center gap-3">
          <div className="min-w-0 flex-1">
            <p className="truncate font-serif text-lg text-brand-primary">{product.name}</p>
            <p className={`text-[10px] uppercase tracking-[0.24em] ${outOfStock ? 'text-red-500' : 'text-brand-text/46'}`}>
              {outOfStock
                ? 'Unavailable'
                : `${BRAND_CONFIG.currency.symbol}${pricing.finalPrice.toLocaleString(BRAND_CONFIG.currency.locale)}`}
            </p>
          </div>
          {outOfStock ? (
            <div className="rounded-full border border-black/8 px-5 py-3 text-[10px] uppercase tracking-[0.28em] text-brand-text/38">
              Unavailable
            </div>
          ) : (
            <button onClick={handleAddToCart} disabled={justAdded} className="button-primary rounded-full px-5 py-3">
              {justAdded ? (
                <>
                  <Check size={12} />
                  Added
                </>
              ) : (
                <>
                  <ArrowRight size={12} />
                  Add
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
