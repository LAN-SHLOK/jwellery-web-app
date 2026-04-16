import { unstable_cache } from 'next/cache';

import { calculateFinalPrice } from './pricing';
import { supabase } from './supabase';

const CATALOG_REVALIDATE_SECONDS = 300;

const getCachedGoldRates = unstable_cache(
  async () => {
    const { data } = await supabase
      .from('gold_rates')
      .select('rate_per_gram, rate_18k')
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    const rate22K = Number(data?.rate_per_gram) || 6500;
    const rate18K = Number(data?.rate_18k) || Math.round(rate22K * 0.75);

    return { rate22K, rate18K };
  },
  ['catalog-gold-rates'],
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
  const rates = await getCachedGoldRates();
  return rates.rate22K; // Return 22K for backward compatibility
}

export async function getProductsWithPricing(category?: string | null) {
  const [rates, products] = await Promise.all([
    getCachedGoldRates(),
    getCachedProducts(category ?? null),
  ]);

  const productsWithPricing = products.map((product) => {
    const purity = (product.gold_purity as '18K' | '22K') || '22K';
    const currentRate = purity === '18K' ? rates.rate18K : rates.rate22K;

    return {
      ...product,
      pricing: calculateFinalPrice({
        goldWeightGrams: product.gold_weight_grams,
        todayRatePerGram: currentRate,
        makingChargeType: product.making_charge_type as 'fixed' | 'percentage',
        makingChargeValue: product.making_charge_value,
        jewellerMargin: product.jeweller_margin,
        goldPurity: purity,
      }),
    };
  });

  return { products: productsWithPricing, rateUsed: rates.rate22K };
}
