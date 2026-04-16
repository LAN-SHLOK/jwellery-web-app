'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useCart } from '@/lib/store';
import { calculateFinalPrice } from '@/lib/pricing';
import { BRAND_CONFIG } from '@/config/brand';
import { ShoppingBag, Trash2, ArrowRight, Minus, Plus } from 'lucide-react';


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
      goldPurity: (item as any).goldPurity || '22K',
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
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-gray-900" />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-6 p-8 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gray-100">
          <ShoppingBag size={32} className="text-gray-400" />
        </div>
        <div>
          <h1 className="font-serif text-2xl font-medium text-gray-900">Your cart is empty</h1>
          <p className="mt-2 text-sm text-gray-600">
            Discover our handcrafted 22K gold collection
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
      <div className="mb-8">
        <h1 className="font-serif text-3xl font-medium text-gray-900 md:text-4xl">
          Shopping Cart
        </h1>
        <p className="mt-2 text-sm text-gray-600">
          {items.length} {items.length === 1 ? 'item' : 'items'} • Prices reflect today's 22K gold rate
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-12">
        {/* Items List */}
        <div className="lg:col-span-8">
          <div className="divide-y divide-gray-200 rounded-lg border border-gray-200 bg-white">
            {cartItems.map((item) => (
              <div key={item.slug} className="flex gap-4 p-4 md:gap-6 md:p-6">
                {/* Product Image */}
                <Link href={`/products/${item.slug}`} className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100 md:h-32 md:w-32">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-full w-full object-cover transition-transform hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-xs text-gray-400">
                      No image
                    </div>
                  )}
                </Link>

                {/* Product Details */}
                <div className="flex flex-1 flex-col justify-between">
                  <div>
                    <Link href={`/products/${item.slug}`}>
                      <h3 className="font-medium text-gray-900 hover:text-gray-700">
                        {item.name}
                      </h3>
                    </Link>
                    <p className="mt-1 text-sm text-gray-500">{item.goldWeight}g · {(item as any).goldPurity || '22K'} Gold</p>
                  </div>

                  <div className="mt-4 flex items-center justify-between">
                    {/* Quantity Controls */}
                    <div className="flex items-center rounded-lg border border-gray-300">
                      <button
                        onClick={() => updateQuantity(item.slug, -1)}
                        className="flex h-8 w-8 items-center justify-center text-gray-600 hover:bg-gray-50"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="flex h-8 w-10 items-center justify-center border-x border-gray-300 text-sm font-medium">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.slug, 1)}
                        className="flex h-8 w-8 items-center justify-center text-gray-600 hover:bg-gray-50"
                      >
                        <Plus size={14} />
                      </button>
                    </div>

                    {/* Price + Remove */}
                    <div className="flex items-center gap-4">
                      <span className="font-medium text-gray-900">
                        {BRAND_CONFIG.currency.symbol}{item.subtotal.toLocaleString()}
                      </span>
                      <button
                        onClick={() => removeItem(item.slug)}
                        className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-red-600"
                        aria-label="Remove item"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Summary Sidebar */}
        <div className="lg:col-span-4">
          <div className="rounded-lg border border-gray-200 bg-white p-6 lg:sticky lg:top-24">
            <h2 className="text-lg font-medium text-gray-900">Order Summary</h2>

            <div className="mt-6 space-y-4 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>{BRAND_CONFIG.currency.symbol}{grandTotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span className="font-medium text-green-600">Free</span>
              </div>
              <div className="flex justify-between text-xs text-gray-500">
                <span>Today's Rate (22K)</span>
                <span>{BRAND_CONFIG.currency.symbol}{currentRate.toLocaleString()}/g</span>
              </div>
            </div>

            <div className="mt-6 flex justify-between border-t border-gray-200 pt-6">
              <span className="text-base font-medium text-gray-900">Total</span>
              <span className="text-xl font-medium text-gray-900">
                {BRAND_CONFIG.currency.symbol}{grandTotal.toLocaleString()}
              </span>
            </div>

            <Link
              href="/checkout"
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg bg-gray-900 px-6 py-3 text-sm font-medium text-white hover:bg-gray-800"
            >
              Proceed to Checkout
              <ArrowRight size={16} />
            </Link>

            <p className="mt-4 text-center text-xs text-gray-500">
              Secure checkout • BIS Hallmarked
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
