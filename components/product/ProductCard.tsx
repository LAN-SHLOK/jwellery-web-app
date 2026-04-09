'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Award, ShoppingBag } from 'lucide-react';

import { BRAND_CONFIG } from '@/config/brand';
import { getProductFallbackImage, getStorefrontAvailability } from '@/lib/product-presentation';

export default function ProductCard({ product }: { product: any }) {
  const [imageFailed, setImageFailed] = useState(false);

  const price = product.pricing?.finalPrice;
  const hasImage = product.images?.length > 0;
  const stock = product.stock_quantity ?? 0;
  const outOfStock = stock === 0;
  const isFeatured = product.is_featured && !outOfStock;
  const availability = getStorefrontAvailability(stock);
  const imageSrc = !imageFailed && hasImage
    ? product.images[0]
    : getProductFallbackImage(product.category);
  const usingFallbackImage = imageFailed || !hasImage;

  const card = (
    <article className={`group flex h-full flex-col ${outOfStock ? 'cursor-not-allowed' : 'cursor-pointer'}`}>
      <div className="luxury-panel relative flex-1 overflow-hidden rounded-[1.8rem] p-3">
        <div className="relative aspect-[4/5] overflow-hidden rounded-[1.35rem] bg-[linear-gradient(180deg,rgba(250,244,235,0.95)_0%,rgba(234,224,210,0.92)_100%)]">
          <div className="absolute inset-x-0 top-0 z-10 flex items-start justify-between p-4">
            <div className="rounded-full border border-white/70 bg-white/75 px-3 py-2 text-[9px] uppercase tracking-[0.26em] text-brand-text/52 shadow-sm backdrop-blur">
              {product.category ?? 'Jewellery'}
            </div>
            <div className="flex flex-col gap-2">
              {isFeatured && (
                <span className="rounded-full bg-brand-primary px-3 py-2 text-[8px] uppercase tracking-[0.28em] text-white">
                  Featured
                </span>
              )}
              {availability.badgeLabel && (
                <span className="rounded-full bg-white/78 px-3 py-2 text-[8px] uppercase tracking-[0.28em] text-amber-700 shadow-sm">
                  {availability.badgeLabel}
                </span>
              )}
            </div>
          </div>

          {imageSrc ? (
            <Image
              src={imageSrc}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 90vw, (max-width: 1280px) 45vw, 30vw"
              className={`transition-transform duration-700 group-hover:scale-[1.06] ${
                usingFallbackImage ? 'object-contain p-10 opacity-80' : 'object-cover'
              } ${outOfStock ? 'grayscale opacity-50' : ''}`}
              onError={() => setImageFailed(true)}
            />
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center gap-3 px-6 text-center text-brand-text/24">
              <Award size={28} strokeWidth={1.2} />
              <p className="text-[9px] uppercase tracking-[0.3em]">Imagery to be added</p>
            </div>
          )}

          <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[rgba(31,21,13,0.68)] via-[rgba(31,21,13,0.14)] to-transparent" />

          <div className="absolute inset-x-0 bottom-0 z-10 p-5">
            <div className="flex items-center justify-between rounded-[1.2rem] border border-white/20 bg-white/12 px-4 py-3 text-white backdrop-blur-md transition-transform duration-300 group-hover:-translate-y-1">
              <div>
                <p className="text-[8px] uppercase tracking-[0.26em] text-white/55">Weight</p>
                <p className="mt-1 text-sm font-semibold">{product.gold_weight_grams}g / 22K</p>
              </div>
              {!outOfStock && (
                <div className="rounded-full border border-white/20 bg-white/10 p-2">
                  <ArrowRight size={13} />
                </div>
              )}
            </div>
          </div>

          {outOfStock && (
            <div className="absolute inset-0 z-20 flex items-center justify-center bg-[rgba(26,19,12,0.34)]">
              <span className="rounded-full border border-white/30 bg-white/85 px-5 py-3 text-[9px] uppercase tracking-[0.3em] text-brand-primary">
                Out of Stock
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="px-2 pt-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className={`font-serif text-2xl leading-none transition-colors duration-300 ${outOfStock ? 'opacity-40' : 'group-hover:text-brand-accent'}`}>
              {product.name}
            </h3>
            <p className="mt-2 text-[10px] uppercase tracking-[0.28em] text-brand-text/38">
              Hallmarked / {product.category ?? 'Jewellery'}
            </p>
          </div>
          <div className="pt-1 text-right">
            {outOfStock ? (
              <span className="text-[10px] uppercase tracking-[0.28em] text-red-500">Unavailable</span>
            ) : price ? (
              <>
                <p className="text-[10px] uppercase tracking-[0.24em] text-brand-text/35">From</p>
                <p className="mt-1 font-serif text-2xl text-brand-primary">
                  {BRAND_CONFIG.currency.symbol}
                  {price.toLocaleString(BRAND_CONFIG.currency.locale)}
                </p>
              </>
            ) : (
              <span className="text-sm italic text-brand-text/35">Price on request</span>
            )}
          </div>
        </div>

        {!outOfStock && (
          <div className="mt-4 flex items-center justify-between border-t border-black/6 pt-4">
            <p className="flex items-center gap-2 text-[10px] uppercase tracking-[0.24em] text-brand-text/42">
              <ShoppingBag size={11} className="text-brand-accent" />
              {availability.cardLabel}
            </p>
            <span className="text-[10px] uppercase tracking-[0.26em] text-brand-text/38">View details</span>
          </div>
        )}
      </div>
    </article>
  );

  if (outOfStock) {
    return <div>{card}</div>;
  }

  return <Link href={`/products/${product.slug}`}>{card}</Link>;
}
