import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { reviewSchema } from '@/lib/validation';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('productId');
    const slug = searchParams.get('slug');

    let query = supabaseAdmin
      .from('product_reviews')
      .select('*, products!inner(slug)')
      .eq('is_approved', true)
      .order('created_at', { ascending: false });

    if (productId) {
      query = query.eq('product_id', productId);
    } else if (slug) {
      query = query.eq('products.slug', slug);
    }

    const { data, error } = await query;

    if (error) {
      console.error('[reviews] fetch failed:', error);
      return NextResponse.json({ error: 'Failed to fetch reviews' }, { status: 500 });
    }

    return NextResponse.json({ reviews: data || [] });
  } catch (err) {
    console.error('[reviews] unexpected error:', err);
    return NextResponse.json({ error: 'Server Error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const parsed = reviewSchema.safeParse(body);
    if (!parsed.success) {
      const msg = parsed.error.issues.map(i => i.message).join(', ');
      return NextResponse.json({ error: msg }, { status: 400 });
    }

    const { productId, orderId, customerName, customerEmail, rating, title, reviewText } = parsed.data;

    let verifiedPurchase = false;
    if (orderId) {
      const { data: order } = await supabaseAdmin
        .from('orders')
        .select('id')
        .eq('id', orderId)
        .eq('customer_email', customerEmail)
        .single();

      verifiedPurchase = !!order;
    }

    const { data, error } = await supabaseAdmin
      .from('product_reviews')
      .insert({
        product_id: productId,
        order_id: orderId || null,
        customer_name: customerName,
        customer_email: customerEmail,
        rating,
        title: title || null,
        review_text: reviewText,
        verified_purchase: verifiedPurchase,
        is_approved: false,
      })
      .select()
      .single();

    if (error) {
      console.error('[reviews] insert failed:', error);
      return NextResponse.json({ error: 'Failed to submit review' }, { status: 500 });
    }

    return NextResponse.json({
      message: 'Review submitted successfully. It will be visible after admin approval.',
      review: data,
    });
  } catch (err) {
    console.error('[reviews] POST error:', err);
    return NextResponse.json({ error: 'Server Error' }, { status: 500 });
  }
}
