'use client';

import React, { useEffect, useState } from 'react';
import { TrendingDown } from 'lucide-react';

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
    return <div className="h-9 w-28 animate-pulse rounded-lg bg-gray-100 md:h-10 md:w-36" />;
  }

  return (
    <div className="relative">
      <button
        onClick={() => fomo && setShowFomo((value) => !value)}
        className={`flex items-center gap-2 rounded-lg border px-3 py-1.5 text-left transition-colors md:gap-3 md:px-4 md:py-2 ${
          fomo ? 'border-green-200 bg-green-50' : 'border-gray-200 bg-white'
        }`}
      >
        <div className="leading-none">
          <p className="text-xs font-medium text-gray-500">22K Gold</p>
          <p className="mt-0.5 font-medium text-gray-900">
            {BRAND_CONFIG.currency.symbol}
            {rate?.toLocaleString(BRAND_CONFIG.currency.locale)}
          </p>
        </div>
      </button>

      {showFomo && (
        <div className="absolute right-0 top-full z-50 mt-2 w-[280px] rounded-lg border border-green-200 bg-green-600 px-4 py-3 text-white shadow-xl md:mt-3 md:w-auto">
          <div className="flex items-center gap-2 text-xs font-medium">
            <TrendingDown size={16} />
            Gold is softer today
          </div>
          <p className="mt-2 max-w-[14rem] text-xs text-white/90">
            Today's rate is below the recent average, making this a good time to order.
          </p>
        </div>
      )}
    </div>
  );
}
