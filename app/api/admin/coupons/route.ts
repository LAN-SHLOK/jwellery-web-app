import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { verifyAdminSession } from '@/lib/auth';
import { couponSchema } from '@/lib/validation';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

export async function GET(request: NextRequest) {
  const authResult = await verifyAdminSession(request);
  if (!authResult.valid) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { data, error } = await supabaseAdmin
      .from('coupons')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('[admin/coupons] fetch failed:', error);
      return NextResponse.json({ error: 'Failed to fetch coupons' }, { status: 500 });
    }

    return NextResponse.json({ coupons: data || [] });
  } catch (err) {
    console.error('[admin/coupons] unexpected error:', err);
    return NextResponse.json({ error: 'Server Error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const authResult = await verifyAdminSession(request);
  if (!authResult.valid) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();

    const parsed = couponSchema.safeParse(body);
    if (!parsed.success) {
      const msg = parsed.error.issues.map(i => i.message).join(', ');
      return NextResponse.json({ error: msg }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin
      .from('coupons')
      .insert({
        code: parsed.data.code.toUpperCase(),
        description: parsed.data.description || null,
        discount_type: parsed.data.discountType,
        discount_value: parsed.data.discountValue,
        min_order_value: parsed.data.minOrderValue,
        max_discount_amount: parsed.data.maxDiscountAmount || null,
        usage_limit: parsed.data.usageLimit || null,
        valid_from: parsed.data.validFrom || new Date().toISOString(),
        valid_until: parsed.data.validUntil || null,
        is_active: parsed.data.isActive,
      })
      .select()
      .single();

    if (error) {
      console.error('[admin/coupons] insert failed:', error);
      return NextResponse.json({ error: 'Failed to create coupon' }, { status: 500 });
    }

    return NextResponse.json({ message: 'Coupon created', coupon: data });
  } catch (err) {
    console.error('[admin/coupons] POST error:', err);
    return NextResponse.json({ error: 'Server Error' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  const authResult = await verifyAdminSession(request);
  if (!authResult.valid) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { couponId, ...updates } = body;

    if (!couponId) {
      return NextResponse.json({ error: 'Coupon ID required' }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin
      .from('coupons')
      .update(updates)
      .eq('id', couponId)
      .select()
      .single();

    if (error) {
      console.error('[admin/coupons] update failed:', error);
      return NextResponse.json({ error: 'Failed to update coupon' }, { status: 500 });
    }

    return NextResponse.json({ message: 'Coupon updated', coupon: data });
  } catch (err) {
    console.error('[admin/coupons] PATCH error:', err);
    return NextResponse.json({ error: 'Server Error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const authResult = await verifyAdminSession(request);
  if (!authResult.valid) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const couponId = searchParams.get('id');

    if (!couponId) {
      return NextResponse.json({ error: 'Coupon ID required' }, { status: 400 });
    }

    const { error } = await supabaseAdmin
      .from('coupons')
      .delete()
      .eq('id', couponId);

    if (error) {
      console.error('[admin/coupons] delete failed:', error);
      return NextResponse.json({ error: 'Failed to delete coupon' }, { status: 500 });
    }

    return NextResponse.json({ message: 'Coupon deleted' });
  } catch (err) {
    console.error('[admin/coupons] DELETE error:', err);
    return NextResponse.json({ error: 'Server Error' }, { status: 500 });
  }
}
