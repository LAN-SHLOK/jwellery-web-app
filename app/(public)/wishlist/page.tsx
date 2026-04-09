'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useWishlist, useCart } from '@/lib/store';
import { calculateFinalPrice } from '@/lib/pricing';
import { BRAND_CONFIG } from '@/config/brand';
import { Heart, ShoppingBag, Trash2, ArrowRight, Sparkles } from 'lucide-react';

export default function WishlistPage() {
  const { items, removeFromWishlist, moveToCart } = useWishlist();
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
        console.error('[WishlistPage] Rate fetch failed:', err);
        setIsLoading(false);
      }
    }
    fetchRate();
  }, []);

  const handleMoveToCart = (item: any) => {
    const pricing = calculateFinalPrice({
      goldWeightGrams: item.goldWeight,
      todayRatePerGram: currentRate,
      makingChargeType: item.makingChargeType,
      makingChargeValue: item.makingChargeValue,
      jewellerMargin: item.jewellerMargin,
      goldPurity: item.goldPurity || '22K',
    });

    moveToCart(item.slug, pricing);
  };

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
          <Heart size={48} className="opacity-20 stroke-1" />
        </motion.div>
        <motion.div
          className="space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h1 className="text-3xl font-serif">Your wishlist is empty</h1>
          <p className="text-sm opacity-50 max-w-sm">
            Save your favorite pieces for later and never lose track of what catches your eye.
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
          <div className="flex items-center gap-3 mb-4">
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Heart size={32} className="text-brand-accent fill-brand-accent" />
            </motion.div>
            <h1 className="text-4xl md:text-6xl font-serif tracking-tight">
              Your Wishlist
            </h1>
          </div>
          <motion.p
            className="text-xs uppercase tracking-widest opacity-40 mt-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            transition={{ delay: 0.3 }}
          >
            {items.length} {items.length === 1 ? 'treasure' : 'treasures'} saved for later
          </motion.p>
        </motion.header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {items.map((item, idx) => {
              const pricing = calculateFinalPrice({
                goldWeightGrams: item.goldWeight,
                todayRatePerGram: currentRate,
                makingChargeType: item.makingChargeType,
                makingChargeValue: item.makingChargeValue,
                jewellerMargin: item.jewellerMargin,
                goldPurity: item.goldPurity || '22K',
              });

              return (
                <motion.div
                  key={item.slug}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: idx * 0.1, duration: 0.5 }}
                  className="luxury-panel rounded-[2rem] overflow-hidden group"
                  whileHover={{ y: -8 }}
                >
                  <Link href={`/products/${item.slug}`} className="block relative aspect-[4/5] bg-brand-muted overflow-hidden">
                    {item.image ? (
                      <motion.img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center opacity-20 text-[9px] uppercase tracking-widest">
                        No image
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </Link>

                  <div className="p-5 space-y-4">
                    <div>
                      <Link href={`/products/${item.slug}`}>
                        <h3 className="text-lg font-serif font-bold hover:text-brand-accent transition-colors">
                          {item.name}
                        </h3>
                      </Link>
                      <p className="text-xs opacity-40 mt-1">{item.goldWeight}g · {item.goldPurity || '22K'} Gold</p>
                    </div>

                    <div className="flex items-baseline justify-between">
                      <span className="text-xs uppercase tracking-widest opacity-40">Current Price</span>
                      <span className="text-xl font-serif font-bold text-brand-primary">
                        {BRAND_CONFIG.currency.symbol}{pricing.finalPrice.toLocaleString()}
                      </span>
                    </div>

                    <div className="flex gap-2">
                      <motion.button
                        onClick={() => handleMoveToCart(item)}
                        className="flex-1 h-11 bg-brand-primary text-white flex items-center justify-center gap-2 text-[10px] uppercase tracking-[0.3em] font-bold hover:bg-brand-accent transition-all duration-500 rounded-full"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <ShoppingBag size={12} />
                        Add to Bag
                      </motion.button>
                      <motion.button
                        onClick={() => removeFromWishlist(item.slug)}
                        className="h-11 w-11 flex items-center justify-center border border-black/10 hover:border-red-300 hover:bg-red-50 hover:text-red-600 transition-all rounded-full"
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        whileTap={{ scale: 0.9 }}
                        aria-label="Remove from wishlist"
                      >
                        <Trash2 size={14} />
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        <motion.div
          className="mt-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Link
            href="/collections"
            className="inline-flex items-center gap-3 text-xs uppercase tracking-[0.3em] font-bold border-b-2 border-brand-accent pb-2 hover:text-brand-accent transition-colors"
          >
            <Sparkles size={14} />
            Discover More Treasures
            <ArrowRight size={14} />
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
