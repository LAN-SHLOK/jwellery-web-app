import { NextRequest, NextResponse } from 'next/server';
import { getProductsWithPricing } from '@/lib/catalog';

// disable Next.js route caching — products change when admin adds/deletes
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get('slug');
  const category = searchParams.get('category');

  try {
    if (slug) {
      const { supabase } = await import('@/lib/supabase');
      const { calculateFinalPrice } = await import('@/lib/pricing');

      // Fetch both gold rates
      const { data: goldData } = await supabase
        .from('gold_rates')
        .select('rate_per_gram, rate_18k')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      const rate22K = goldData?.rate_per_gram || 6500;
      const rate18K = goldData?.rate_18k || Math.round(rate22K * 0.75);

      const { data: product, error } = await supabase
        .from('products')
        .select('*')
        .eq('slug', slug)
        .eq('is_active', true)
        .single();

      if (error || !product) {
        return NextResponse.json({ error: 'Product not found' }, { status: 404 });
      }

      const purity = (product.gold_purity as '18K' | '22K') || '22K';
      const currentRate = purity === '18K' ? rate18K : rate22K;

      const pricing = calculateFinalPrice({
        goldWeightGrams: product.gold_weight_grams,
        todayRatePerGram: currentRate,
        makingChargeType: product.making_charge_type as 'fixed' | 'percentage',
        makingChargeValue: product.making_charge_value,
        jewellerMargin: product.jeweller_margin,
        goldPurity: purity,
      });

      return NextResponse.json({ product, pricing, rateUsed: currentRate });
    }

    // filter of product 
    const { products, rateUsed } = await getProductsWithPricing(category);

    return NextResponse.json({ products, rateUsed });

  } catch (err) {
    console.error('[API/Products] Unexpected error:', err);
    return NextResponse.json({ error: 'Server Error' }, { status: 500 });
  }
}
