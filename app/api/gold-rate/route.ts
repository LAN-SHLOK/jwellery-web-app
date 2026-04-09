import { NextRequest, NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';
import { createClient } from '@supabase/supabase-js';
import { shouldShowFomoBadge } from '@/lib/pricing';
import { goldRateSchema } from '@/lib/validation';

// Use service role key to bypass RLS
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from('gold_rates')
      .select('rate_per_gram, created_at')
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error || !data) {
      // no rate set yet — return fallback so the site doesn't crash
      console.error('[gold-rate] fetch failed:', error);
      return NextResponse.json({ rate: 6500, isFallback: true, fomoBadge: false });
    }

    const todayRate = Number(data.rate_per_gram);

    // FOMO Calc
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const { data: history } = await supabaseAdmin
      .from('gold_rates')
      .select('rate_per_gram')
      .gte('created_at', sevenDaysAgo.toISOString());

    const recentRates = history?.map(r => Number(r.rate_per_gram)).filter(Boolean) ?? [];

    const sevenDayAvg = recentRates.length > 0
      ? recentRates.reduce((a, b) => a + b, 0) / recentRates.length
      : null;

    return NextResponse.json({
      rate: data.rate_per_gram,
      lastUpdated: data.created_at,
      sevenDayAverage: sevenDayAvg,
      fomoBadge: shouldShowFomoBadge(todayRate, recentRates),
    });

  } catch (err) {
    console.error('[gold-rate] unexpected error:', err);
    return NextResponse.json({ error: 'Server Error' }, { status: 500 });
  }
}

// Admin rate updation
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const parsed = goldRateSchema.safeParse(body);
    if (!parsed.success) {
      const msg = parsed.error.issues.map(i => i.message).join(', ');
      return NextResponse.json({ error: msg }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin
      .from('gold_rates')
      .insert([{ rate_per_gram: parsed.data.ratePerGram }])
      .select()
      .single();

    if (error) {
      console.error('[gold-rate] insert failed:', error);
      return NextResponse.json({ error: 'Failed to save rate' }, { status: 500 });
    }

    revalidateTag('catalog');
    revalidateTag('catalog-rate');

    return NextResponse.json({ message: 'Rate updated', data });

  } catch (err) {
    console.error('[gold-rate] POST error:', err);
    return NextResponse.json({ error: 'Server Error' }, { status: 500 });
  }
}
