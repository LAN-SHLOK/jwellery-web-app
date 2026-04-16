'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingBag, Trash2, ArrowRight, AlertCircle, Minus, Plus } from 'lucide-react';
import { useCart } from '@/lib/store';
import { calculateFinalPrice } from '@/lib/pricing';
import { BRAND_CONFIG } from '@/config/brand';

export default function CartDrawer() {
  const { items, isOpen, setIsOpen, removeItem, updateQuantity, syncPrices } = useCart();
  const [goldRate, setGoldRate] = useState(6500);
  const [rateChanged, setRateChanged] = useState(false);

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
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 z-[200] bg-black/20"
          />

          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="fixed right-0 top-0 z-[300] flex h-screen w-full max-w-md flex-col bg-white shadow-xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
              <div className="flex items-center gap-2">
                <ShoppingBag size={20} className="text-gray-900" />
                <h2 className="text-lg font-medium text-gray-900">Cart</h2>
                {itemCount > 0 && (
                  <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600">
                    {itemCount}
                  </span>
                )}
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            </div>

            {/* Rate Changed Alert */}
            {rateChanged && (
              <div className="flex items-center gap-3 border-b border-amber-200 bg-amber-50 px-6 py-3">
                <AlertCircle size={16} className="text-amber-600" />
                <p className="text-xs font-medium text-amber-700">
                  Gold rate changed — prices updated
                </p>
              </div>
            )}

            {/* Items List */}
            <div className="flex-1 overflow-y-auto">
              {items.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center gap-4 px-8 text-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
                    <ShoppingBag size={24} className="text-gray-400" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Your cart is empty</p>
                    <p className="mt-1 text-sm text-gray-500">Add items to get started</p>
                  </div>
                  <Link
                    href="/collections"
                    onClick={() => setIsOpen(false)}
                    className="text-sm font-medium text-gray-900 underline"
                  >
                    Browse Collections
                  </Link>
                </div>
              ) : (
                <div className="space-y-4 p-6">
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
                      <div key={item.slug} className="flex gap-4">
                        <Link
                          href={`/products/${item.slug}`}
                          onClick={() => setIsOpen(false)}
                          className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100"
                        >
                          {item.image ? (
                            <img
                              src={item.image}
                              alt={item.name}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center text-xs text-gray-400">
                              No image
                            </div>
                          )}
                        </Link>

                        <div className="flex flex-1 flex-col justify-between">
                          <div>
                            <Link href={`/products/${item.slug}`} onClick={() => setIsOpen(false)}>
                              <h3 className="text-sm font-medium text-gray-900 hover:text-gray-700">
                                {item.name}
                              </h3>
                            </Link>
                            <p className="mt-0.5 text-xs text-gray-500">{item.goldWeight}g · {item.goldPurity || '22K'}</p>
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center rounded-lg border border-gray-300">
                              <button
                                onClick={() => updateQuantity(item.slug, -1)}
                                className="flex h-7 w-7 items-center justify-center text-gray-600 hover:bg-gray-50"
                              >
                                <Minus size={12} />
                              </button>
                              <span className="flex h-7 w-8 items-center justify-center border-x border-gray-300 text-xs font-medium">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => updateQuantity(item.slug, 1)}
                                className="flex h-7 w-7 items-center justify-center text-gray-600 hover:bg-gray-50"
                              >
                                <Plus size={12} />
                              </button>
                            </div>

                            <div className="flex items-center gap-3">
                              <span className="text-sm font-medium text-gray-900">
                                {BRAND_CONFIG.currency.symbol}{lineTotal.toLocaleString('en-IN')}
                              </span>
                              <button
                                onClick={() => removeItem(item.slug)}
                                className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-red-600"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t border-gray-200 bg-gray-50 p-6">
                <div className="mb-4 flex justify-between text-xs text-gray-500">
                  <span>Gold Rate (22K)</span>
                  <span>{BRAND_CONFIG.currency.symbol}{goldRate.toLocaleString('en-IN')}/g</span>
                </div>

                <div className="mb-4 flex justify-between">
                  <span className="text-base font-medium text-gray-900">Total</span>
                  <span className="text-xl font-medium text-gray-900">
                    {BRAND_CONFIG.currency.symbol}{bagTotal.toLocaleString('en-IN')}
                  </span>
                </div>

                <Link
                  href="/checkout"
                  onClick={() => setIsOpen(false)}
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-gray-900 px-6 py-3 text-sm font-medium text-white hover:bg-gray-800"
                >
                  Checkout
                  <ArrowRight size={16} />
                </Link>

                <Link
                  href="/cart"
                  onClick={() => setIsOpen(false)}
                  className="mt-3 block text-center text-sm text-gray-600 hover:text-gray-900"
                >
                  View full cart
                </Link>

                <p className="mt-4 text-center text-xs text-gray-500">
                  BIS Hallmarked • Secure Checkout
                </p>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
