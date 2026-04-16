'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowRight,
  Check,
  ChevronDown,
  Heart,
  ShieldCheck,
  ShoppingBag,
  Truck,
  Award,
} from 'lucide-react';

import { BRAND_CONFIG, whatsappChatUrl } from '@/config/brand';
import { getProductFallbackImage } from '@/lib/product-presentation';
import { useCart, useWishlist } from '@/lib/store';

type Pricing = {
  goldValue: number;
  makingCharges: number;
  subtotal: number;
  gst: number;
  finalPrice: number;
};

type Product = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  category: string | null;
  gold_weight_grams: number;
  gold_purity: '18K' | '22K';
  available_in_both_purities?: boolean;
  making_charge_type: 'fixed' | 'percentage';
  making_charge_value: number;
  jeweller_margin: number;
  images: string[];
  stock_quantity: number;
  hallmark_number: string | null;
};

type Props = {
  product: Product;
  pricing: Pricing;
  goldRate: number;
};

export default function ProductDetailClient({ product, pricing, goldRate }: Props) {
  const [showBreakdown, setShowBreakdown] = useState(false);
  const [activeImg, setActiveImg] = useState(0);
  const [justAdded, setJustAdded] = useState(false);
  const [imgError, setImgError] = useState<Record<number, boolean>>({});
  const [selectedPurity, setSelectedPurity] = useState<'18K' | '22K'>(product.gold_purity);
  const { addItem } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const inWishlist = isInWishlist(product.slug);

  // Calculate pricing based on selected purity
  const currentPricing = React.useMemo(() => {
    if (selectedPurity === product.gold_purity) {
      return pricing;
    }

    // Recalculate for different purity
    const purityMultipliers = { '18K': 0.75, '22K': 0.9167 };
    const purityMultiplier = purityMultipliers[selectedPurity];
    const pureGoldValue = product.gold_weight_grams * goldRate * purityMultiplier;
    const goldValue = Math.round(pureGoldValue * 100) / 100;

    let makingCharges = 0;
    if (product.making_charge_type === 'fixed') {
      makingCharges = product.making_charge_value;
    } else {
      makingCharges = Math.round((goldValue * product.making_charge_value) / 100);
    }

    const subtotal = goldValue + makingCharges + product.jeweller_margin;
    const gst = Math.round(subtotal * 0.03 * 100) / 100;
    const finalPrice = Math.round(subtotal + gst);

    return {
      goldValue: Math.round(goldValue * 100) / 100,
      makingCharges: Math.round(makingCharges * 100) / 100,
      subtotal: Math.round(subtotal * 100) / 100,
      gst: Math.round(gst * 100) / 100,
      finalPrice,
    };
  }, [selectedPurity, product, pricing, goldRate]);

  const images = product.images ?? [];
  const stock = product.stock_quantity ?? 0;
  const outOfStock = stock === 0;
  const fallbackImage = getProductFallbackImage(product.category);
  const activeImageUrl = images[activeImg] && !imgError[activeImg] ? images[activeImg] : fallbackImage;
  const isFallbackImage = !images[activeImg] || Boolean(imgError[activeImg]);

  function handleAddToCart() {
    addItem(product, currentPricing);
    setJustAdded(true);
    window.setTimeout(() => setJustAdded(false), 1800);
  }

  function handleWishlistToggle() {
    if (inWishlist) {
      removeFromWishlist(product.slug);
    } else {
      addToWishlist(product);
    }
  }

  const enquireUrl =
    whatsappChatUrl(BRAND_CONFIG.contact.whatsapp) +
    `?text=${encodeURIComponent(`Hi, I'm interested in ${product.name}`)}`;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 md:px-8">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Link href="/collections" className="hover:text-gray-900">Collections</Link>
            <span>/</span>
            <span className="capitalize">{product.category || 'Product'}</span>
            <span>/</span>
            <span className="text-gray-900 truncate">{product.name}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 md:px-8 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Left: Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="bg-white rounded-lg overflow-hidden shadow-sm">
              <div className="relative aspect-square bg-gray-50">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`${activeImg}-${activeImageUrl}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="absolute inset-0"
                  >
                    <Image
                      src={activeImageUrl}
                      alt={product.name}
                      fill
                      priority
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      className={isFallbackImage ? 'object-contain p-12 opacity-60' : 'object-cover'}
                      onError={() => setImgError((value) => ({ ...value, [activeImg]: true }))}
                    />
                  </motion.div>
                </AnimatePresence>

                {/* Badges */}
                {stock > 0 && stock <= 3 && (
                  <div className="absolute top-4 left-4">
                    <span className="bg-red-500 text-white text-xs font-semibold px-3 py-1.5 rounded-full">
                      Only {stock} left
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Thumbnail Images */}
            {images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {images.map((image, index) => (
                  <button
                    key={`${image}-${index}`}
                    onClick={() => setActiveImg(index)}
                    className={`relative h-20 w-20 shrink-0 overflow-hidden rounded-lg border-2 transition-all ${
                      index === activeImg ? 'border-gray-900' : 'border-gray-200 hover:border-gray-400'
                    }`}
                  >
                    <Image
                      src={image && !imgError[index] ? image : fallbackImage}
                      alt=""
                      fill
                      sizes="80px"
                      className={image && !imgError[index] ? 'object-cover' : 'object-contain p-2 opacity-60'}
                      onError={() => setImgError((value) => ({ ...value, [index]: true }))}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
                {product.name}
              </h1>
              <p className="text-gray-600 leading-relaxed">
                {product.description || 'Premium quality gold jewellery with BIS hallmark certification.'}
              </p>
            </div>

            {/* Price */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              {/* Purity Selector - Only show if product is available in both purities */}
              {product.available_in_both_purities && (
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-3">Select Purity</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => setSelectedPurity('22K')}
                      className={`px-4 py-3 rounded-lg border-2 font-medium transition-all ${
                        selectedPurity === '22K'
                          ? 'border-gray-900 bg-gray-900 text-white'
                          : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                      }`}
                    >
                      22K Gold
                    </button>
                    <button
                      onClick={() => setSelectedPurity('18K')}
                      className={`px-4 py-3 rounded-lg border-2 font-medium transition-all ${
                        selectedPurity === '18K'
                          ? 'border-gray-900 bg-gray-900 text-white'
                          : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                      }`}
                    >
                      18K Gold
                    </button>
                  </div>
                </div>
              )}

              <div className="flex items-baseline justify-between mb-4">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Price</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {BRAND_CONFIG.currency.symbol}{currentPricing.finalPrice.toLocaleString(BRAND_CONFIG.currency.locale)}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">Inclusive of all taxes</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500 mb-1">Today's Rate</p>
                  <p className="text-xl font-semibold text-gray-900">
                    {BRAND_CONFIG.currency.symbol}{goldRate.toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">{selectedPurity} per gram</p>
                </div>
              </div>

              {/* Price Breakdown */}
              <button
                onClick={() => setShowBreakdown(!showBreakdown)}
                className="w-full flex items-center justify-between py-3 border-t text-sm font-medium text-gray-700 hover:text-gray-900"
              >
                <span>View Price Breakdown</span>
                <ChevronDown className={`transition-transform ${showBreakdown ? 'rotate-180' : ''}`} size={18} />
              </button>

              <AnimatePresence>
                {showBreakdown && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="pt-4 space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Gold Value ({product.gold_weight_grams}g × ₹{goldRate})</span>
                        <span className="font-medium">₹{currentPricing.goldValue.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Making Charges</span>
                        <span className="font-medium">₹{currentPricing.makingCharges.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Jeweller Margin</span>
                        <span className="font-medium">₹{product.jeweller_margin.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">GST (3%)</span>
                        <span className="font-medium">₹{currentPricing.gst.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between pt-3 border-t font-semibold text-base">
                        <span>Total</span>
                        <span>₹{currentPricing.finalPrice.toLocaleString()}</span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Specifications */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-4">Specifications</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Weight</p>
                  <p className="font-medium">{product.gold_weight_grams}g</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Purity</p>
                  <p className="font-medium">{selectedPurity} Gold</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Hallmark</p>
                  <p className="font-medium">{product.hallmark_number || 'BIS Certified'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Category</p>
                  <p className="font-medium capitalize">{product.category || 'Jewellery'}</p>
                </div>
              </div>
            </div>

            {/* Assurance */}
            <div className="bg-blue-50 rounded-lg p-6">
              <div className="flex items-start gap-3 mb-4">
                <ShieldCheck className="text-blue-600 shrink-0 mt-0.5" size={20} />
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Our Assurance</h3>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li className="flex items-start gap-2">
                      <Check size={16} className="text-blue-600 shrink-0 mt-0.5" />
                      <span>Live pricing locked at order time</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check size={16} className="text-blue-600 shrink-0 mt-0.5" />
                      <span>BIS hallmark specification preserved</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check size={16} className="text-blue-600 shrink-0 mt-0.5" />
                      <span>Support available before and after purchase</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              {outOfStock ? (
                <button
                  disabled
                  className="w-full h-14 bg-gray-300 text-gray-600 rounded-lg font-semibold cursor-not-allowed"
                >
                  Out of Stock
                </button>
              ) : (
                <>
                  <button
                    onClick={handleAddToCart}
                    disabled={justAdded}
                    className={`w-full h-14 rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors ${
                      justAdded
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-900 text-white hover:bg-gray-800'
                    }`}
                  >
                    {justAdded ? (
                      <>
                        <Check size={20} />
                        Added to Bag
                      </>
                    ) : (
                      <>
                        <ShoppingBag size={20} />
                        Add to Bag
                      </>
                    )}
                  </button>

                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={handleWishlistToggle}
                      className="h-12 border-2 border-gray-300 rounded-lg font-medium flex items-center justify-center gap-2 hover:border-gray-400 transition-colors"
                    >
                      <Heart
                        size={18}
                        className={inWishlist ? 'fill-red-500 text-red-500' : 'text-gray-600'}
                      />
                      {inWishlist ? 'Saved' : 'Save'}
                    </button>

                    <a
                      href={enquireUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="h-12 border-2 border-gray-300 rounded-lg font-medium flex items-center justify-center gap-2 hover:border-gray-400 transition-colors"
                    >
                      Enquire
                      <ArrowRight size={16} />
                    </a>
                  </div>
                </>
              )}
            </div>

            {/* Delivery Info */}
            <div className="flex items-center gap-3 text-sm text-gray-600 pt-4 border-t">
              <Truck size={18} />
              <span>Free shipping across India • Delivery in 5-7 business days</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
