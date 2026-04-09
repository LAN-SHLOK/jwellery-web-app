'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingBag, Trash2, ArrowRight, ShieldCheck, AlertCircle, Minus, Plus } from 'lucide-react';
import { useCart } from '@/lib/store';
import { calculateFinalPrice } from '@/lib/pricing';
import { BRAND_CONFIG } from '@/config/brand';

export default function CartDrawer() {
  const { items, isOpen, setIsOpen, removeItem, updateQuantity, syncPrices } = useCart();
  const [goldRate, setGoldRate] = useState(6500);
  const [rateChanged, setRateChanged] = useState(false);

  // fresh gold rate fetching
  useEffect(() => {
    if (!isOpen) return;

    let cancelled = false;

    fetch('/api/gold-rate')
      .then(r => r.json())
      .then(data => {
        if (cancelled) return;
        if (typeof data.rate === 'number') setGoldRate(data.rate);
        const { changed } = syncPrices(data.rate);
        setRateChanged(changed);
      })
      .catch(err => console.error('[cart drawer] rate fetch failed:', err));

    return () => { cancelled = true; };
  }, [isOpen, syncPrices]);

  const bagTotal = items.reduce((total, item) => {
    const pricing = calculateFinalPrice({
      goldWeightGrams: item.goldWeight,
      todayRatePerGram: goldRate,
      makingChargeType: item.makingChargeType,
      makingChargeValue: item.makingChargeValue,
      jewellerMargin: item.jewellerMargin,
      goldPurity: item.goldPurity || '22K',
    });
    return total + pricing.finalPrice * item.quantity;
  }, 0);

  const itemCount = items.reduce((n, i) => n + i.quantity, 0);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[200]"
          />

          {/* drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="fixed top-0 right-0 h-screen w-full max-w-[420px] bg-white z-[300] shadow-2xl flex flex-col"
          >
            {/* header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-black/5">
              <div className="flex items-center gap-3">
                <ShoppingBag size={16} className="text-brand-accent" />
                <h2 className="text-sm font-serif tracking-[0.15em] uppercase">My Bag</h2>
                {itemCount > 0 && (
                  <span className="text-[9px] font-bold bg-brand-muted px-2 py-0.5 rounded-full opacity-60">
                    {itemCount}
                  </span>
                )}
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 opacity-50 hover:opacity-100 hover:rotate-90 transition-all duration-300"
              >
                <X size={18} />
              </button>
            </div>

            {/* gold rate changed alert */}
            <AnimatePresence>
              {rateChanged && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="bg-amber-50 border-b border-amber-200 px-6 py-3 flex items-center gap-3">
                    <AlertCircle size={13} className="text-amber-600 shrink-0" />
                    <p className="text-[10px] uppercase font-bold tracking-widest text-amber-700">
                      Gold rate changed — prices updated
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* items list */}
            <div className="flex-1 overflow-y-auto custom-scrollbar">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center gap-5 px-8 text-center">
                  <div className="w-16 h-16 rounded-full bg-brand-muted flex items-center justify-center">
                    <ShoppingBag size={24} className="opacity-20 stroke-1" />
                  </div>
                  <div>
                    <p className="text-sm font-serif mb-1 opacity-50">Your bag is empty</p>
                    <p className="text-[10px] uppercase tracking-widest opacity-30">Add some treasures</p>
                  </div>
                  <Link
                    href="/collections"
                    onClick={() => setIsOpen(false)}
                    className="text-[10px] uppercase tracking-widest text-brand-accent underline underline-offset-4"
                  >
                    Browse Collections
                  </Link>
                </div>
              ) : (
                <div className="px-6 py-6 space-y-6">
                  {items.map((item) => {
                    const pricing = calculateFinalPrice({
                      goldWeightGrams: item.goldWeight,
                      todayRatePerGram: goldRate,
                      makingChargeType: item.makingChargeType,
                      makingChargeValue: item.makingChargeValue,
                      jewellerMargin: item.jewellerMargin,
                      goldPurity: item.goldPurity || '22K',
                    });
                    const lineTotal = pricing.finalPrice * item.quantity;

                    return (
                      <motion.div
                        key={item.slug}
                        layout
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className="flex gap-4 group"
                      >
                        <Link
                          href={`/products/${item.slug}`}
                          onClick={() => setIsOpen(false)}
                          className="w-20 aspect-[4/5] bg-brand-muted shrink-0 overflow-hidden"
                        >
                          {item.image ? (
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center opacity-20 text-[8px] uppercase tracking-widest">
                              No image
                            </div>
                          )}
                        </Link>

                        <div className="flex-1 flex flex-col justify-between min-w-0">
                          <div>
                            <Link href={`/products/${item.slug}`} onClick={() => setIsOpen(false)}>
                              <h3 className="text-xs font-bold uppercase tracking-wide truncate hover:text-brand-accent transition-colors">
                                {item.name}
                              </h3>
                            </Link>
                            <p className="text-[10px] opacity-40 mt-0.5">{item.goldWeight}g · {item.goldPurity || '22K'}</p>
                          </div>

                          <div className="flex items-center justify-between mt-3">
                            <div className="flex items-center border border-black/10">
                              <button
                                onClick={() => updateQuantity(item.slug, -1)}
                                className="w-7 h-7 flex items-center justify-center opacity-40 hover:opacity-100 transition-opacity"
                              >
                                <Minus size={10} />
                              </button>
                              <span className="w-7 h-7 flex items-center justify-center text-[10px] font-bold border-x border-black/10">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => updateQuantity(item.slug, 1)}
                                className="w-7 h-7 flex items-center justify-center opacity-40 hover:opacity-100 transition-opacity"
                              >
                                <Plus size={10} />
                              </button>
                            </div>

                            <div className="flex items-center gap-3">
                              <span className="text-sm font-serif font-bold">
                                {BRAND_CONFIG.currency.symbol}{lineTotal.toLocaleString('en-IN')}
                              </span>
                              <button
                                onClick={() => removeItem(item.slug)}
                                className="p-1 opacity-20 hover:opacity-100 hover:text-red-500 transition-all"
                              >
                                <Trash2 size={13} />
                              </button>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </div>

            {}
            {items.length > 0 && (
              <div className="border-t border-black/5 px-6 py-5 space-y-4 bg-brand-muted/20">
                <div className="flex justify-between text-[9px] uppercase tracking-widest opacity-40">
                  <span>Gold Rate</span>
                  <span>{BRAND_CONFIG.currency.symbol}{goldRate.toLocaleString('en-IN')}/g</span>
                </div>

                <div className="flex justify-between items-baseline">
                  <span className="text-[10px] uppercase tracking-widest font-bold opacity-40">Total</span>
                  <span className="text-xl font-serif font-bold">
                    {BRAND_CONFIG.currency.symbol}{bagTotal.toLocaleString('en-IN')}
                  </span>
                </div>

                <Link
                  href="/checkout"
                  onClick={() => setIsOpen(false)}
                  className="group w-full bg-brand-primary text-white flex items-center justify-center gap-3 text-[10px] uppercase tracking-[0.25em] font-bold hover:bg-brand-accent transition-all duration-500 py-4"
                >
                  Checkout
                  <ArrowRight size={13} className="transition-transform group-hover:translate-x-1" />
                </Link>

                <Link
                  href="/cart"
                  onClick={() => setIsOpen(false)}
                  className="block w-full text-center text-[9px] uppercase tracking-widest opacity-40 hover:opacity-70 transition-opacity py-1"
                >
                  View full bag
                </Link>

                <div className="flex items-center justify-center gap-2 opacity-30 pt-1">
                  <ShieldCheck size={11} />
                  <span className="text-[8px] uppercase tracking-widest font-bold">BIS Hallmarked · Secure Checkout</span>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
