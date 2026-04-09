'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-brand-accent border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-8 text-center gap-8">
        <ShoppingBag size={48} className="opacity-20 stroke-1" />
        <div className="space-y-4">
          <h1 className="text-3xl font-serif">Your bag is empty</h1>
          <p className="text-sm opacity-50 max-w-sm">
            Discover our handcrafted 22K gold collection and find your next treasure.
          </p>
        </div>
        <Link
          href="/collections"
          className="px-12 py-4 bg-brand-primary text-white text-xs uppercase tracking-[0.3em] font-bold hover:bg-brand-accent transition-all duration-500"
        >
          Explore Collections
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-10 pb-24 px-4 md:px-8 md:pt-14">
      <div className="max-w-6xl mx-auto">
        <header className="mb-12 md:mb-20">
          <h1 className="text-4xl md:text-6xl font-serif tracking-tight animate-fade-in-up">
            Shopping Bag
          </h1>
          <p className="text-xs uppercase tracking-widest opacity-40 mt-4">
            {items.length} {items.length === 1 ? 'treasure' : 'treasures'} &middot; Prices reflect today&rsquo;s 22K gold rate
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">

          {/* Items List */}
          <div className="lg:col-span-8 space-y-0">
            {cartItems.map((item, idx) => (
              <div
                key={item.slug}
                className="flex gap-4 md:gap-8 py-8 border-b border-black/5 group animate-fade-in-up"
                style={{ animationDelay: `${idx * 0.04}s` }}
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
                      <button
                        onClick={() => updateQuantity(item.slug, -1)}
                        className="w-10 h-10 flex items-center justify-center opacity-40 hover:opacity-100 transition-opacity"
                      >
                        <Minus size={12} />
                      </button>
                      <span className="w-10 h-10 flex items-center justify-center text-[11px] font-bold border-x border-black/10">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.slug, 1)}
                        className="w-10 h-10 flex items-center justify-center opacity-40 hover:opacity-100 transition-opacity"
                      >
                        <Plus size={12} />
                      </button>
                    </div>

                    {/* Price + Remove */}
                    <div className="flex items-center gap-6">
                      <span className="text-sm md:text-base font-serif font-bold">
                        {BRAND_CONFIG.currency.symbol}{item.subtotal.toLocaleString()}
                      </span>
                      <button
                        onClick={() => removeItem(item.slug)}
                        className="p-2 opacity-20 hover:opacity-100 hover:text-red-600 transition-all"
                        aria-label="Remove item"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Summary Sidebar */}
          <div className="lg:col-span-4">
            <div className="luxury-panel rounded-[2rem] p-6 md:p-10 lg:sticky lg:top-28">
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

              <Link
                href="/checkout"
                className="w-full h-14 md:h-16 bg-brand-primary text-white flex items-center justify-center gap-4 text-xs uppercase tracking-[0.3em] font-bold hover:bg-brand-accent transition-all duration-500"
              >
                Checkout
                <ArrowRight size={14} />
              </Link>

              <div className="flex items-center justify-center gap-3 opacity-40 py-6">
                <ShieldCheck size={14} />
                <span className="text-[8px] uppercase tracking-widest font-bold">Encrypted &amp; Hallmark Secured</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
