import { createHmac, timingSafeEqual } from 'crypto';
import { NextRequest, NextResponse } from 'next/server';

import { finalizeOnlinePayment } from '@/lib/order-payment';
import { supabase } from '@/lib/supabase';

const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET ?? '';

function isValidSignature(rawBody: string, signature: string): boolean {
  if (!webhookSecret) {
    console.error('[webhook] RAZORPAY_WEBHOOK_SECRET not set');
    return false;
  }

  const expected = createHmac('sha256', webhookSecret)
    .update(rawBody, 'utf8')
    .digest('hex');

  try {
    const signatureBuffer = Buffer.from(signature, 'hex');
    const expectedBuffer = Buffer.from(expected, 'hex');

    if (signatureBuffer.length !== expectedBuffer.length) {
      return false;
    }

    return timingSafeEqual(signatureBuffer, expectedBuffer);
  } catch {
    return false;
  }
}

async function findOrder(rzpOrderId?: string, rzpReceipt?: string) {
  if (rzpOrderId) {
    const { data } = await supabase
      .from('orders')
      .select('*')
      .eq('razorpay_order_id', rzpOrderId)
      .maybeSingle();

    if (data) {
      return data;
    }
  }

  if (rzpReceipt) {
    const { data } = await supabase
      .from('orders')
      .select('*')
      .eq('id', rzpReceipt)
      .maybeSingle();

    if (data) {
      return data;
    }
  }

  return null;
}

export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.text();
    const signature = request.headers.get('x-razorpay-signature');

    if (!signature) {
      return NextResponse.json({ error: 'Missing signature' }, { status: 400 });
    }

    if (!isValidSignature(rawBody, signature)) {
      console.error('[webhook] invalid signature - possible fraud attempt');
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    const event = JSON.parse(rawBody);

    if (event.event === 'payment.captured' || event.event === 'order.paid') {
      const payload = event.payload;
      const rzpOrderId = payload.order?.entity?.id || payload.payment?.entity?.order_id;
      const rzpReceipt = payload.order?.entity?.receipt || payload.payment?.entity?.receipt;

      if (!rzpOrderId && !rzpReceipt) {
        console.error('[webhook] could not extract mapping identifiers:', event.event);
        return NextResponse.json({ received: true });
      }

      const order = await findOrder(rzpOrderId, rzpReceipt);

      if (!order) {
        console.error(`[webhook] order not found for RZP ID: ${rzpOrderId}, Receipt: ${rzpReceipt}`);
        return NextResponse.json({ received: true });
      }

      if (order.payment_status === 'paid') {
        return NextResponse.json({ received: true });
      }

      await finalizeOnlinePayment(order);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('[webhook] error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ error: 'Not found' }, { status: 404 });
}
