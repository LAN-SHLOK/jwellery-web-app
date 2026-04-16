import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

import { verifyDemoPaymentToken } from '@/lib/demo-payment';
import { finalizeOnlinePayment } from '@/lib/order-payment';
import { supabase } from '@/lib/supabase';

const demoPaymentSchema = z.object({
  orderId: z.string().uuid('Invalid order ID'),
  outcome: z.enum(['success', 'failed', 'cancelled']),
  phone: z.string().min(6, 'Phone is required'),
  token: z.string().min(20, 'Payment token is required'),
});

function isDemoPaymentEnabled() {
  return !process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET;
}

export async function POST(request: NextRequest) {
  if (!isDemoPaymentEnabled()) {
    return NextResponse.json({ error: 'Demo payment mode is disabled.' }, { status: 403 });
  }

  try {
    const body = await request.json();
    const parsed = demoPaymentSchema.safeParse(body);

    if (!parsed.success) {
      const message = parsed.error.issues.map((issue) => issue.message).join(', ');
      return NextResponse.json({ error: message }, { status: 400 });
    }

    const { orderId, outcome, phone, token } = parsed.data;

    if (!verifyDemoPaymentToken({ orderId, phone, token })) {
      return NextResponse.json({ error: 'This payment session is invalid or has expired.' }, { status: 403 });
    }

    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .eq('customer_phone', phone)
      .eq('payment_method', 'razorpay')
      .maybeSingle();

    if (orderError) {
      console.error('[demo-payment] failed to fetch order:', orderError);
      return NextResponse.json({ error: 'Could not find order.' }, { status: 500 });
    }

    if (!order) {
      return NextResponse.json({ error: 'Order not found.' }, { status: 404 });
    }

    if (order.order_status !== 'pending_payment') {
      return NextResponse.json(
        { error: 'This order is no longer waiting for a payment decision.' },
        { status: 409 }
      );
    }

    if (outcome === 'success') {
      const result = await finalizeOnlinePayment(order);

      return NextResponse.json({
        message: result.nextStatus === 'manual_review_required'
          ? 'Payment recorded and flagged for manual stock review.'
          : 'Payment recorded successfully.',
        orderId,
        orderStatus: result.nextStatus === 'already_paid' ? order.order_status : result.nextStatus,
      });
    }

    const nextStatus = outcome === 'cancelled' ? 'cancelled' : 'failed';

    const { error: updateError } = await supabase
      .from('orders')
      .update({ order_status: nextStatus })
      .eq('id', orderId);

    if (updateError) {
      console.error('[demo-payment] failed to update order outcome:', updateError);
      return NextResponse.json({ error: 'Could not update order.' }, { status: 500 });
    }

    return NextResponse.json({
      message: outcome === 'cancelled' ? 'Payment was cancelled.' : 'Payment attempt was marked as failed.',
      orderId,
      orderStatus: nextStatus,
    });
  } catch (error) {
    console.error('[demo-payment] unexpected error:', error);
    return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ error: 'Not found' }, { status: 404 });
}
