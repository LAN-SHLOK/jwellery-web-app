'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useWishlist } from '@/lib/store';
import { calculateFinalPrice } from '@/lib/pricing';
import { BRAND_CONFIG } from '@/config/brand';
import { Heart, ShoppingBag, Trash2 } from 'lucide-react';

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
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-gray-900" />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-6 p-8 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gray-100">
          <Heart size={32} className="text-gray-400" />
        </div>
        <div>
          <h1 className="font-serif text-2xl font-medium text-gray-900">Your wishlist is empty</h1>
          <p className="mt-2 text-sm text-gray-600">
            Save your favorite pieces for later
          </p>
        </div>
        <Link
          href="/collections"
          className="inline-flex items-center gap-2 rounded-lg bg-gray-900 px-6 py-3 text-sm font-medium text-white hover:bg-gray-800"
        >
          Shop Collections
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 md:px-8 md:py-16">
      <div className="mb-8 flex items-center gap-3">
        <Heart size={28} className="fill-gray-900 text-gray-900" />
        <div>
          <h1 className="font-serif text-3xl font-medium text-gray-900 md:text-4xl">
            Your Wishlist
          </h1>
          <p className="mt-1 text-sm text-gray-600">
            {items.length} {items.length === 1 ? 'item' : 'items'} saved
          </p>
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => {
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
              className="overflow-hidden rounded-lg border border-gray-200 bg-white"
            >
              <Link href={`/products/${item.slug}`} className="block aspect-square overflow-hidden bg-gray-100">
                {item.image ? (
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-full w-full object-cover transition-transform hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-sm text-gray-400">
                    No image
                  </div>
                )}
              </Link>

              <div className="p-4">
                <Link href={`/products/${item.slug}`}>
                  <h3 className="font-medium text-gray-900 hover:text-gray-700">
                    {item.name}
                  </h3>
                </Link>
                <p className="mt-1 text-sm text-gray-500">{item.goldWeight}g · {item.goldPurity || '22K'} Gold</p>

                <div className="mt-4 flex items-baseline justify-between">
                  <span className="text-xs text-gray-500">Current Price</span>
                  <span className="font-medium text-gray-900">
                    {BRAND_CONFIG.currency.symbol}{pricing.finalPrice.toLocaleString()}
                  </span>
                </div>

                <div className="mt-4 flex gap-2">
                  <button
                    onClick={() => handleMoveToCart(item)}
                    className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
                  >
                    <ShoppingBag size={16} />
                    Add to Cart
                  </button>
                  <button
                    onClick={() => removeFromWishlist(item.slug)}
                    className="flex items-center justify-center rounded-lg border border-gray-300 px-3 py-2 text-gray-600 hover:bg-gray-50 hover:text-red-600"
                    aria-label="Remove from wishlist"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
