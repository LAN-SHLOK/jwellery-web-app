'use client';

import React, { useEffect, useState } from 'react';
import { Sparkles, TrendingDown } from 'lucide-react';

import { BRAND_CONFIG } from '@/config/brand';

export default function Ticker() {
  const [rate, setRate] = useState<number | null>(null);
  const [fomo, setFomo] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showFomo, setShowFomo] = useState(false);

  useEffect(() => {
    const fetchRate = () =>
      fetch('/api/gold-rate')
        .then((response) => response.json())
        .then((data) => {
          if (typeof data.rate === 'number') {
            setRate(data.rate);
          }

          setFomo(Boolean(data.fomoBadge));
          setLoading(false);
        })
        .catch(() => setLoading(false));

    fetchRate();
    const timer = setInterval(fetchRate, 300_000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!fomo) {
      return undefined;
    }

    setShowFomo(true);
    const timer = setTimeout(() => setShowFomo(false), 5000);

    return () => clearTimeout(timer);
  }, [fomo]);

  if (loading) {
    return <div className="h-9 w-28 rounded-full shimmer md:h-10 md:w-36" />;
  }

  return (
    <div className="relative">
      <button
        onClick={() => fomo && setShowFomo((value) => !value)}
        className={`flex items-center gap-2 rounded-full border px-3 py-1.5 text-left transition-colors duration-300 md:gap-3 md:px-4 md:py-2 ${
          fomo ? 'border-emerald-200 bg-emerald-50/80' : 'border-black/10 bg-white/55'
        }`}
      >
        <span className="rounded-full bg-brand-primary/6 p-1 text-brand-accent md:p-1.5">
          <Sparkles size={10} className="md:hidden" />
          <Sparkles size={12} className="hidden md:block" />
        </span>
        <div className="leading-none">
          <p className="text-[8px] font-semibold uppercase tracking-[0.25em] opacity-45 md:text-[9px] md:tracking-[0.3em]">22K Live</p>
          <p className="mt-0.5 font-serif text-xs font-semibold text-brand-primary md:mt-1 md:text-sm">
            {BRAND_CONFIG.currency.symbol}
            {rate?.toLocaleString(BRAND_CONFIG.currency.locale)}
          </p>
        </div>
      </button>

      {showFomo && (
        <div className="absolute right-0 top-full z-50 mt-2 w-[280px] rounded-2xl border border-emerald-200 bg-emerald-700 px-4 py-3 text-white shadow-xl animate-fade-in md:mt-3 md:w-auto">
          <div className="flex items-center gap-2 text-[9px] font-semibold uppercase tracking-[0.2em] md:text-[10px] md:tracking-[0.25em]">
            <TrendingDown size={11} className="md:hidden" />
            <TrendingDown size={12} className="hidden md:block" />
            Gold is softer today
          </div>
          <p className="mt-2 max-w-[14rem] text-[10px] leading-5 text-white/75 md:text-[11px]">
            Today&apos;s rate is below the recent average, which makes this a strong time to place an order.
          </p>
        </div>
      )}
    </div>
  );
}
