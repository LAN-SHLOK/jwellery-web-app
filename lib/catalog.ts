import { unstable_cache } from 'next/cache';

import { calculateFinalPrice } from './pricing';
import { supabase } from './supabase';

const CATALOG_REVALIDATE_SECONDS = 300;

const getCachedGoldRate = unstable_cache(
  async () => {
    const { data } = await supabase
      .from('gold_rates')
      .select('rate_per_gram')
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    return Number(data?.rate_per_gram) || 6500;
  },
  ['catalog-gold-rate'],
  {
    revalidate: CATALOG_REVALIDATE_SECONDS,
    tags: ['catalog', 'catalog-rate'],
  },
);

const getCachedProducts = unstable_cache(
  async (category?: string | null) => {
    let query = supabase
      .from('products')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (category) {
      query = query.eq('category', category);
    }

    const { data: products, error } = await query;

    if (error || !products) {
      console.error('[catalog] fetch failed:', error);
      return [];
    }

    return products;
  },
  ['catalog-products'],
  {
    revalidate: CATALOG_REVALIDATE_SECONDS,
    tags: ['catalog', 'catalog-products'],
  },
);

export async function getGoldRate() {
  return getCachedGoldRate();
}

export async function getProductsWithPricing(category?: string | null) {
  const [currentRate, products] = await Promise.all([
    getCachedGoldRate(),
    getCachedProducts(category ?? null),
  ]);

  const productsWithPricing = products.map((product) => ({
    ...product,
    pricing: calculateFinalPrice({
      goldWeightGrams: product.gold_weight_grams,
      todayRatePerGram: currentRate,
      makingChargeType: product.making_charge_type as 'fixed' | 'percentage',
      makingChargeValue: product.making_charge_value,
      jewellerMargin: product.jeweller_margin,
    }),
  }));

  return { products: productsWithPricing, rateUsed: currentRate };
}
