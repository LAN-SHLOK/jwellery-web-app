import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

export type CouponValidationResult = {
  valid: boolean;
  error?: string;
  discount?: number;
  coupon?: any;
};

export async function validateCoupon(
  code: string,
  orderTotal: number,
  customerEmail: string
): Promise<CouponValidationResult> {
  try {
    const { data: coupon, error } = await supabaseAdmin
      .from('coupons')
      .select('*')
      .eq('code', code.toUpperCase())
      .eq('is_active', true)
      .single();

    if (error || !coupon) {
      return { valid: false, error: 'Invalid coupon code' };
    }

    const now = new Date();
    const validFrom = coupon.valid_from ? new Date(coupon.valid_from) : null;
    const validUntil = coupon.valid_until ? new Date(coupon.valid_until) : null;

    if (validFrom && now < validFrom) {
      return { valid: false, error: 'Coupon not yet valid' };
    }

    if (validUntil && now > validUntil) {
      return { valid: false, error: 'Coupon has expired' };
    }

    if (coupon.min_order_value && orderTotal < coupon.min_order_value) {
      return {
        valid: false,
        error: `Minimum order value of ₹${coupon.min_order_value.toLocaleString()} required`,
      };
    }

    if (coupon.usage_limit && coupon.usage_count >= coupon.usage_limit) {
      return { valid: false, error: 'Coupon usage limit reached' };
    }

    let discount = 0;
    if (coupon.discount_type === 'percentage') {
      discount = (orderTotal * coupon.discount_value) / 100;
      if (coupon.max_discount_amount) {
        discount = Math.min(discount, coupon.max_discount_amount);
      }
    } else {
      discount = coupon.discount_value;
    }

    discount = Math.round(discount);

    return {
      valid: true,
      discount,
      coupon,
    };
  } catch (err) {
    console.error('[validateCoupon] error:', err);
    return { valid: false, error: 'Failed to validate coupon' };
  }
}

export async function applyCouponToOrder(
  couponId: string,
  orderId: string,
  customerEmail: string,
  discountAmount: number
): Promise<boolean> {
  try {
    await supabaseAdmin.from('coupon_usage').insert({
      coupon_id: couponId,
      order_id: orderId,
      customer_email: customerEmail,
      discount_amount: discountAmount,
    });

    await supabaseAdmin.rpc('increment', {
      table_name: 'coupons',
      row_id: couponId,
      column_name: 'usage_count',
    });

    return true;
  } catch (err) {
    console.error('[applyCouponToOrder] error:', err);
    return false;
  }
}

export function calculateDiscountedTotal(orderTotal: number, discount: number): number {
  return Math.max(0, orderTotal - discount);
}
