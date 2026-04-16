import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

//Only gives last 30 entries in admin dashboard.
export async function GET() {
  try {
    const { data, error } = await supabase
      .from('gold_rates')
      .select('rate_per_gram, created_at')
      .order('created_at', { ascending: false })
      .limit(30);

    if (error) {
      console.error('[API/GoldRate/History] Fetch failed:', error);
      return NextResponse.json({ history: [] });
    }

    return NextResponse.json({ history: data || [] });
  } catch (err) {
    console.error('[API/GoldRate/History] Unexpected:', err);
    return NextResponse.json({ history: [] });
  }
}
