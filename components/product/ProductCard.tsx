'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Heart, ShoppingBag } from 'lucide-react';

import { BRAND_CONFIG } from '@/config/brand';
import { getProductFallbackImage } from '@/lib/product-presentation';
import { useWishlist } from '@/lib/store';

export default function ProductCard({ product }: { product: any }) {
  const [imageFailed, setImageFailed] = useState(false);
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const inWishlist = isInWishlist(product.slug);

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (inWishlist) {
      removeFromWishlist(product.slug);
    } else {
      addToWishlist(product);
    }
  };

  const price = product.pricing?.finalPrice;
  const hasImage = product.images?.length > 0;
  const stock = product.stock_quantity ?? 0;
  const outOfStock = stock === 0;
  const imageSrc = !imageFailed && hasImage
    ? product.images[0]
    : getProductFallbackImage(product.category);
  const usingFallbackImage = imageFailed || !hasImage;

  const card = (
    <div className="card-hover glow-hover group relative overflow-hidden rounded-lg bg-white shadow-sm">
      {/* Image Container */}
      <div className="img-hover relative aspect-square overflow-hidden bg-gray-50">
        {imageSrc ? (
          <Image
            src={imageSrc}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 50vw, (max-width: 1280px) 33vw, 25vw"
            className={`${
              usingFallbackImage ? 'object-contain p-8 opacity-60' : 'object-cover'
            } ${outOfStock ? 'grayscale opacity-40' : ''}`}
            onError={() => setImageFailed(true)}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-gray-300">
            <ShoppingBag size={48} strokeWidth={1} />
          </div>
        )}

        {/* Badges */}
        <div className="absolute left-3 top-3 flex flex-col gap-2">
          {product.is_featured && !outOfStock && (
            <span className="shimmer rounded-full bg-amber-500 px-3 py-1 text-xs font-semibold text-white">
              Featured
            </span>
          )}
          {outOfStock && (
            <span className="rounded-full bg-gray-900 px-3 py-1 text-xs font-semibold text-white">
              Out of Stock
            </span>
          )}
          {stock > 0 && stock <= 3 && (
            <span className="shimmer rounded-full bg-red-500 px-3 py-1 text-xs font-semibold text-white">
              Only {stock} left
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={handleWishlistToggle}
          className="magnetic-hover absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white shadow-md transition-all hover:bg-gray-50"
          aria-label={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart
            size={18}
            className={inWishlist ? 'fill-red-500 text-red-500' : 'text-gray-600'}
          />
        </button>
      </div>

      {/* Product Info */}
      <div className="p-4">
        <div className="mb-2">
          <span className="text-xs uppercase tracking-wide text-gray-500">
            {product.category || 'Jewellery'}
          </span>
        </div>
        
        <h3 className="mb-2 min-h-[3rem] text-base font-semibold text-gray-900 line-clamp-2">
          {product.name}
        </h3>

        <div className="mb-3 flex items-center gap-2">
          <span className="text-xs text-gray-600">
            {product.gold_weight_grams}g
          </span>
          <span className="text-xs text-gray-400">•</span>
          <span className="text-xs text-gray-600">
            {product.gold_purity || '22K'}
          </span>
          <span className="text-xs text-gray-400">•</span>
          <span className="text-xs text-gray-600">
            BIS Hallmarked
          </span>
        </div>

        {outOfStock ? (
          <div className="text-sm font-semibold text-red-600">
            Currently Unavailable
          </div>
        ) : price ? (
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-bold text-gray-900">
              {BRAND_CONFIG.currency.symbol}{price.toLocaleString(BRAND_CONFIG.currency.locale)}
            </span>
            <span className="text-xs text-gray-500">
              incl. GST
            </span>
          </div>
        ) : (
          <span className="text-sm text-gray-500">Price on request</span>
        )}
      </div>
    </div>
  );

  if (outOfStock) {
    return <div className="cursor-not-allowed">{card}</div>;
  }

  return <Link href={`/products/${product.slug}`}>{card}</Link>;
}
