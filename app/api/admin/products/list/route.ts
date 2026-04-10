import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { calculateFinalPrice } from '@/lib/pricing';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

// It is for admin panel use only just for admin 

export async function GET() {
  try {
    // Get latest gold rate
    const { data: goldData } = await supabase
      .from('gold_rates')
      .select('rate_per_gram')
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    const currentRate = goldData?.rate_per_gram || 6500;

    // Fetch ALL products — admin needs to see inactive ones too
    const { data: products, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('[API/Admin/Products/List] DB Error:', error);
      return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
    }

    const productsWithPricing = (products || []).map((p) => ({
      ...p,
      pricing: calculateFinalPrice({
        goldWeightGrams: p.gold_weight_grams,
        todayRatePerGram: currentRate,
        makingChargeType: p.making_charge_type as 'fixed' | 'percentage',
        makingChargeValue: p.making_charge_value,
        jewellerMargin: p.jeweller_margin,
        goldPurity: p.gold_purity as '18K' | '22K',
      }),
    }));

    return NextResponse.json({ products: productsWithPricing });
  } catch (err) {
    console.error('[API/Admin/Products/List] Unexpected:', err);
    return NextResponse.json({ error: 'Server Error' }, { status: 500 });
  }
}
