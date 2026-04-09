import { NextRequest, NextResponse } from 'next/server';
import { validateCoupon } from '@/lib/coupons';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { code, orderTotal, customerEmail } = body;

    if (!code || typeof orderTotal !== 'number' || !customerEmail) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }

    const result = await validateCoupon(code, orderTotal, customerEmail);

    if (!result.valid) {
      return NextResponse.json({ valid: false, error: result.error }, { status: 200 });
    }

    return NextResponse.json({
      valid: true,
      discount: result.discount,
      coupon: {
        code: result.coupon.code,
        description: result.coupon.description,
        discountType: result.coupon.discount_type,
        discountValue: result.coupon.discount_value,
      },
    });
  } catch (err) {
    console.error('[coupons/validate] error:', err);
    return NextResponse.json({ error: 'Server Error' }, { status: 500 });
  }
}
