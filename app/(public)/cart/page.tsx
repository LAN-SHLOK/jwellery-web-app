'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '@/lib/store';
import { calculateFinalPrice } from '@/lib/pricing';
import { BRAND_CONFIG } from '@/config/brand';
import { ShoppingBag, Trash2, ArrowRight, ShieldCheck, Minus, Plus } from 'lucide-react';


export default function CartPage() {
  const { items, removeItem, updateQuantity } = useCart();
  const [currentRate, setCurrentRate] = useState(6500);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchRate() {
      try {
        const res = await fetch('/api/gold-rate');
        const data = await res.json();
        setCurrentRate(data.rate);
        setIsLoading(false);
      } catch (err) {
        console.error('[CartPage] Rate fetch failed, using fallback:', err);
        setIsLoading(false);
      }
    }
    fetchRate();
  }, []);

  // Live Rating
  const cartItems = items.map(item => {
    const freshPricing = calculateFinalPrice({
      goldWeightGrams: item.goldWeight,
      todayRatePerGram: currentRate,
      makingChargeType: item.makingChargeType,
      makingChargeValue: item.makingChargeValue,
      jewellerMargin: item.jewellerMargin,
    });

    return {
      ...item,
      currentPrice: freshPricing.finalPrice,
      subtotal: freshPricing.finalPrice * item.quantity,
    };
  });

  const grandTotal = cartItems.reduce((acc, item) => acc + item.subtotal, 0);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
        <motion.div
          className="absolute top-20 left-[10%] w-64 h-64 rounded-full bg-gradient-to-br from-brand-accent/20 to-transparent blur-3xl"
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 4, repeat: Infinity }}
        />
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="w-12 h-12 border-3 border-brand-accent border-t-transparent rounded-full animate-spin" />
        </motion.div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-8 text-center gap-8 relative overflow-hidden">
        <motion.div
          className="absolute top-1/4 left-[15%] w-72 h-72 rounded-full bg-gradient-to-br from-brand-primary/15 to-transparent blur-3xl"
          animate={{ x: [0, 30, 0], y: [0, -20, 0], scale: [1, 1.1, 1] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-1/4 right-[20%] w-64 h-64 rounded-full bg-gradient-to-br from-brand-accent/15 to-transparent blur-3xl"
          animate={{ x: [0, -25, 0], y: [0, 25, 0], scale: [1, 1.15, 1] }}
          transition={{ duration: 7, repeat: Infinity, delay: 1 }}
        />
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', duration: 0.8 }}
        >
          <ShoppingBag size={48} className="opacity-20 stroke-1" />
        </motion.div>
        <motion.div
          className="space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h1 className="text-3xl font-serif">Your bag is empty</h1>
          <p className="text-sm opacity-50 max-w-sm">
            Discover our handcrafted 22K gold collection and find your next treasure.
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Link
            href="/collections"
            className="px-12 py-4 bg-brand-primary text-white text-xs uppercase tracking-[0.3em] font-bold hover:bg-brand-accent transition-all duration-500 inline-block"
          >
            Explore Collections
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-10 pb-24 px-4 md:px-8 md:pt-14 relative overflow-hidden">
      <motion.div
        className="absolute top-20 right-[10%] w-80 h-80 rounded-full bg-gradient-to-br from-brand-primary/12 to-transparent blur-3xl"
        animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0.6, 0.4] }}
        transition={{ duration: 6, repeat: Infinity }}
      />
      <motion.div
        className="absolute bottom-40 left-[5%] w-72 h-72 rounded-full bg-gradient-to-br from-brand-accent/10 to-transparent blur-3xl"
        animate={{ scale: [1, 1.15, 1], x: [0, 20, 0] }}
        transition={{ duration: 7, repeat: Infinity, delay: 1.5 }}
      />
      <div className="max-w-6xl mx-auto relative z-10">
        <motion.header
          className="mb-12 md:mb-20"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl md:text-6xl font-serif tracking-tight">
            Shopping Bag
          </h1>
          <motion.p
            className="text-xs uppercase tracking-widest opacity-40 mt-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            transition={{ delay: 0.3 }}
          >
            {items.length} {items.length === 1 ? 'treasure' : 'treasures'} &middot; Prices reflect today&rsquo;s 22K gold rate
          </motion.p>
        </motion.header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">

          {/* Items List */}
          <div className="lg:col-span-8 space-y-0">
            {cartItems.map((item, idx) => (
              <motion.div
                key={item.slug}
                className="flex gap-4 md:gap-8 py-8 border-b border-black/5 group"
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1, duration: 0.5 }}
                whileHover={{ x: 4 }}
              >
                {/* Product Image */}
                <Link href={`/products/${item.slug}`} className="w-24 md:w-32 aspect-[4/5] bg-brand-muted shrink-0 overflow-hidden">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center opacity-20 text-[9px] uppercase tracking-widest">
                      No image
                    </div>
                  )}
                </Link>

                {/* Product Details */}
                <div className="flex-1 flex flex-col justify-between py-1">
                  <div>
                    <Link href={`/products/${item.slug}`}>
                      <h3 className="text-sm md:text-base font-serif font-bold hover:text-brand-accent transition-colors">
                        {item.name}
                      </h3>
                    </Link>
                    <p className="text-xs opacity-40 mt-1">{item.goldWeight}g · 22K Gold</p>
                  </div>

                  <div className="flex items-center justify-between mt-4">
                    {/* Quantity Controls */}
                    <div className="flex items-center gap-0 border border-black/10">
                      <motion.button
                        onClick={() => updateQuantity(item.slug, -1)}
                        className="w-10 h-10 flex items-center justify-center opacity-40 hover:opacity-100 transition-opacity"
                        whileTap={{ scale: 0.9 }}
                      >
                        <Minus size={12} />
                      </motion.button>
                      <motion.span
                        className="w-10 h-10 flex items-center justify-center text-[11px] font-bold border-x border-black/10"
                        key={item.quantity}
                        initial={{ scale: 1.3, color: '#D4AF37' }}
                        animate={{ scale: 1, color: '#000000' }}
                        transition={{ duration: 0.3 }}
                      >
                        {item.quantity}
                      </motion.span>
                      <motion.button
                        onClick={() => updateQuantity(item.slug, 1)}
                        className="w-10 h-10 flex items-center justify-center opacity-40 hover:opacity-100 transition-opacity"
                        whileTap={{ scale: 0.9 }}
                      >
                        <Plus size={12} />
                      </motion.button>
                    </div>

                    {/* Price + Remove */}
                    <div className="flex items-center gap-6">
                      <span className="text-sm md:text-base font-serif font-bold">
                        {BRAND_CONFIG.currency.symbol}{item.subtotal.toLocaleString()}
                      </span>
                      <motion.button
                        onClick={() => removeItem(item.slug)}
                        className="p-2 opacity-20 hover:opacity-100 hover:text-red-600 transition-all"
                        aria-label="Remove item"
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <Trash2 size={14} />
                      </motion.button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Summary Sidebar */}
          <div className="lg:col-span-4">
            <motion.div
              className="luxury-panel rounded-[2rem] p-6 md:p-10 lg:sticky lg:top-28"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              <h2 className="text-lg font-serif uppercase tracking-widest mb-8">Summary</h2>

              <div className="space-y-4 mb-8 text-sm">
                <div className="flex justify-between opacity-60">
                  <span>Subtotal</span>
                  <span>{BRAND_CONFIG.currency.symbol}{grandTotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between opacity-60">
                  <span>Shipping</span>
                  <span className="text-brand-accent font-bold">Complimentary</span>
                </div>
                <div className="flex justify-between text-[10px] uppercase tracking-widest opacity-40">
                  <span>Today's Rate (22K)</span>
                  <span>{BRAND_CONFIG.currency.symbol}{currentRate.toLocaleString()}/g</span>
                </div>
              </div>

              <div className="flex justify-between items-baseline pt-6 border-t border-black/10 mb-8">
                <span className="text-[10px] uppercase tracking-widest font-bold opacity-40">Total</span>
                <span className="text-2xl font-serif font-bold">
                  {BRAND_CONFIG.currency.symbol}{grandTotal.toLocaleString()}
                </span>
              </div>

              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Link
                  href="/checkout"
                  className="w-full h-14 md:h-16 bg-brand-primary text-white flex items-center justify-center gap-4 text-xs uppercase tracking-[0.3em] font-bold hover:bg-brand-accent transition-all duration-500"
                >
                  Checkout
                  <motion.div animate={{ x: [0, 4, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
                    <ArrowRight size={14} />
                  </motion.div>
                </Link>
              </motion.div>

              <div className="flex items-center justify-center gap-3 opacity-40 py-6">
                <ShieldCheck size={14} />
                <span className="text-[8px] uppercase tracking-widest font-bold">Encrypted &amp; Hallmark Secured</span>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
