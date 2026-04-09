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
    return <div className="h-10 w-36 rounded-full shimmer" />;
  }

  return (
    <div className="relative">
      <button
        onClick={() => fomo && setShowFomo((value) => !value)}
        className={`flex items-center gap-3 rounded-full border px-4 py-2 text-left transition-colors duration-300 ${
          fomo ? 'border-emerald-200 bg-emerald-50/80' : 'border-black/10 bg-white/55'
        }`}
      >
        <span className="rounded-full bg-brand-primary/6 p-1.5 text-brand-accent">
          <Sparkles size={12} />
        </span>
        <div className="leading-none">
          <p className="text-[9px] font-semibold uppercase tracking-[0.3em] opacity-45">22K Live</p>
          <p className="mt-1 font-serif text-sm font-semibold text-brand-primary">
            {BRAND_CONFIG.currency.symbol}
            {rate?.toLocaleString(BRAND_CONFIG.currency.locale)}
          </p>
        </div>
      </button>

      {showFomo && (
        <div className="absolute right-0 top-full z-50 mt-3 rounded-2xl border border-emerald-200 bg-emerald-700 px-4 py-3 text-white shadow-xl animate-fade-in">
          <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.25em]">
            <TrendingDown size={12} />
            Gold is softer today
          </div>
          <p className="mt-2 max-w-[14rem] text-[11px] leading-5 text-white/75">
            Today&apos;s rate is below the recent average, which makes this a strong time to place an order.
          </p>
        </div>
      )}
    </div>
  );
}
