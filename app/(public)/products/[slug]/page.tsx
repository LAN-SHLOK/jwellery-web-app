import React from 'react';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

import { BRAND_CONFIG } from '@/config/brand';
import { calculateFinalPrice } from '@/lib/pricing';
import { supabase } from '@/lib/supabase';
import ProductReviews from '@/components/product/ProductReviews';

import ProductDetailClient from './ProductDetailClient';

export const dynamic = 'force-dynamic';

type Props = {
  params: {
    slug: string;
  };
};

async function getProduct(slug: string) {
  const { data: rateRow } = await supabase
    .from('gold_rates')
    .select('rate_per_gram')
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  const goldRate = Number(rateRow?.rate_per_gram) || 6500;

  const { data: product, error } = await supabase
    .from('products')
    .select('*')
    .eq('slug', slug)
    .eq('is_active', true)
    .single();

  if (error || !product) {
    return null;
  }

  const pricing = calculateFinalPrice({
    goldWeightGrams: product.gold_weight_grams,
    todayRatePerGram: goldRate,
    makingChargeType: product.making_charge_type as 'fixed' | 'percentage',
    makingChargeValue: product.making_charge_value,
    jewellerMargin: product.jeweller_margin,
    goldPurity: product.gold_purity as '18K' | '22K',
  });

  return { product, pricing, goldRate };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const result = await getProduct(params.slug);

  if (!result) {
    return { title: 'Product Not Found' };
  }

  const { product, pricing } = result;
  const image = product.images?.[0];

  return {
    title: product.name,
    description:
      product.description ??
      `${product.name} - ${product.gold_weight_grams}g ${product.gold_purity ?? '22K'} gold. ${BRAND_CONFIG.currency.symbol}${pricing.finalPrice.toLocaleString(BRAND_CONFIG.currency.locale)} incl. GST. BIS Hallmarked.`,
    openGraph: {
      title: product.name,
      description: `${product.gold_weight_grams}g · ${product.gold_purity ?? '22K'} · ${BRAND_CONFIG.currency.symbol}${pricing.finalPrice.toLocaleString(BRAND_CONFIG.currency.locale)}`,
      ...(image ? { images: [{ url: image, width: 800, height: 1000, alt: product.name }] } : {}),
    },
  };
}

export default async function ProductPage({ params }: Props) {
  const result = await getProduct(params.slug);

  if (!result) {
    notFound();
  }

  return (
    <>
      <ProductDetailClient
        product={result.product}
        pricing={result.pricing}
        goldRate={result.goldRate}
      />
      <div className="px-4 pb-24 md:px-8">
        <div className="mx-auto max-w-7xl">
          <ProductReviews productId={result.product.id} productSlug={result.product.slug} />
        </div>
      </div>
    </>
  );
}
