import { NextRequest, NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';

import { createDemoPaymentToken } from '@/lib/demo-payment';
import { sendOrderConfirmation } from '@/lib/email';
import { calculateFinalPrice, calculateOrderTotals } from '@/lib/pricing';
import { supabase } from '@/lib/supabase';
import { checkoutSchema } from '@/lib/validation';

type ProductRecord = {
  category: string | null;
  gold_weight_grams: number;
  id: string;
  is_active: boolean;
  jeweller_margin: number;
  making_charge_type: 'fixed' | 'percentage';
  making_charge_value: number;
  name: string;
  slug: string;
  stock_quantity: number;
};

type OrderSnapshotItem = {
  category: string | null;
  goldRateAtOrder: number;
  goldValueAtOrder: number;
  gstAtOrder: number;
  id: string;
  makingChargesAtOrder: number;
  name: string;
  priceAtOrder: number;
  quantity: number;
  slug: string;
  weightAtOrder: number;
};

async function getLatestGoldRate() {
  const { data } = await supabase
    .from('gold_rates')
    .select('rate_per_gram')
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  return Number(data?.rate_per_gram) || 6500;
}

async function getProducts(slugs: string[]) {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .in('slug', slugs);

  if (error || !data) {
    return null;
  }

  return new Map((data as ProductRecord[]).map((product) => [product.slug, product]));
}

function buildOrderSnapshot(
  items: Array<{ quantity: number; slug: string }>,
  products: Map<string, ProductRecord>,
  goldRate: number
) {
  const snapshot: OrderSnapshotItem[] = [];
  let subtotal = 0;

  for (const cartItem of items) {
    const product = products.get(cartItem.slug);

    if (!product || !product.is_active || product.stock_quantity < cartItem.quantity) {
      return {
        error: `${product?.name || cartItem.slug} is no longer available in the requested quantity`,
      };
    }

    const pricing = calculateFinalPrice({
      goldWeightGrams: product.gold_weight_grams,
      todayRatePerGram: goldRate,
      makingChargeType: product.making_charge_type,
      makingChargeValue: product.making_charge_value,
      jewellerMargin: product.jeweller_margin,
    });

    subtotal += pricing.subtotal * cartItem.quantity;

    snapshot.push({
      category: product.category,
      goldRateAtOrder: goldRate,
      goldValueAtOrder: pricing.goldValue,
      gstAtOrder: pricing.gst,
      id: product.id,
      makingChargesAtOrder: pricing.makingCharges,
      name: product.name,
      priceAtOrder: pricing.finalPrice,
      quantity: cartItem.quantity,
      slug: product.slug,
      weightAtOrder: product.gold_weight_grams,
    });
  }

  return { snapshot, subtotal };
}

function buildOrderPayload(
  customerInfo: {
    address: {
      city: string;
      pincode: string;
      state: string;
      street: string;
    };
    email: string;
    name: string;
    phone: string;
  },
  snapshot: OrderSnapshotItem[],
  totals: {
    goldRate: number;
    gstAmount: number;
    subtotal: number;
    total: number;
  },
  paymentMethod: 'cod' | 'razorpay',
  orderStatus: 'failed' | 'pending' | 'pending_payment'
) {
  return {
    address: customerInfo.address,
    customer_email: customerInfo.email,
    customer_name: customerInfo.name,
    customer_phone: customerInfo.phone,
    gold_rate_used: totals.goldRate,
    gst_amount: totals.gstAmount,
    items: snapshot,
    order_status: orderStatus,
    payment_method: paymentMethod,
    payment_status: 'pending',
    subtotal: totals.subtotal,
    total_amount: totals.total,
  };
}

async function createOrder(payload: ReturnType<typeof buildOrderPayload>) {
  const { data, error } = await supabase
    .from('orders')
    .insert([payload])
    .select('id')
    .single();

  if (error || !data) {
    return null;
  }

  return data.id;
}

async function markOrderFailed(orderId: string, reason: string) {
  const { error } = await supabase
    .from('orders')
    .update({ order_status: 'failed' })
    .eq('id', orderId);

  if (error) {
    console.error(`[checkout] failed to mark order ${orderId} as failed after ${reason}:`, error);
  }
}

function revalidateCatalogStock() {
  revalidateTag('catalog');
  revalidateTag('catalog-products');
}

async function createRazorpayOrder({
  amount,
  orderId,
}: {
  amount: number;
  orderId: string;
}) {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keyId || !keySecret) {
    return { mode: 'demo' as const };
  }

  const auth = Buffer.from(`${keyId}:${keySecret}`).toString('base64');
  const response = await fetch('https://api.razorpay.com/v1/orders', {
    method: 'POST',
    headers: {
      Authorization: `Basic ${auth}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      amount: Math.round(amount * 100),
      currency: 'INR',
      receipt: orderId,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('[checkout] Razorpay order creation failed:', errorText);
    return { mode: 'error' as const };
  }

  const data = await response.json();
  return {
    mode: 'razorpay' as const,
    razorpayOrderId: data.id as string,
  };
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = checkoutSchema.safeParse(body);

    if (!parsed.success) {
      const message = parsed.error.issues.map((issue) => issue.message).join(', ');
      return NextResponse.json({ error: message }, { status: 400 });
    }

    const { customerInfo, items, paymentMethod } = parsed.data;
    const goldRate = await getLatestGoldRate();
    const products = await getProducts(items.map((item) => item.slug));

    if (!products) {
      return NextResponse.json({ error: 'Could not verify products' }, { status: 500 });
    }

    const snapshotResult = buildOrderSnapshot(items, products, goldRate);

    if ('error' in snapshotResult) {
      return NextResponse.json({ error: snapshotResult.error }, { status: 400 });
    }

    const orderTotals = calculateOrderTotals(snapshotResult.subtotal);
    const totals = {
      goldRate,
      gstAmount: orderTotals.gst,
      subtotal: orderTotals.subtotal,
      total: orderTotals.total,
    };

    if (paymentMethod === 'razorpay') {
      const orderId = await createOrder(
        buildOrderPayload(customerInfo, snapshotResult.snapshot, totals, 'razorpay', 'pending_payment')
      );

      if (!orderId) {
        console.error('[checkout] order insert failed (online payment)');
        return NextResponse.json({ error: 'Failed to initiate order' }, { status: 500 });
      }

      try {
        const razorpayOrder = await createRazorpayOrder({ amount: totals.total, orderId });

        if (razorpayOrder.mode === 'demo') {
          return NextResponse.json({
            amount: totals.total,
            currency: 'INR',
            demoToken: createDemoPaymentToken({
              orderId,
              phone: customerInfo.phone,
            }),
            orderId,
            paymentMode: 'demo',
          });
        }

        if (razorpayOrder.mode === 'error') {
          await markOrderFailed(orderId, 'razorpay order creation failure');
          return NextResponse.json({ error: 'Could not initiate payment' }, { status: 502 });
        }

        const { error } = await supabase
          .from('orders')
          .update({ razorpay_order_id: razorpayOrder.razorpayOrderId })
          .eq('id', orderId);

        if (error) {
          console.error('[checkout] failed to save Razorpay order id:', error);
          await markOrderFailed(orderId, 'razorpay order id persistence failure');
          return NextResponse.json({ error: 'Could not finalize payment setup' }, { status: 500 });
        }

        return NextResponse.json({
          amount: totals.total,
          currency: 'INR',
          orderId,
          paymentMode: 'razorpay',
          razorpayOrderId: razorpayOrder.razorpayOrderId,
        });
      } catch (error) {
        console.error('[checkout] Razorpay error:', error);
        await markOrderFailed(orderId, 'razorpay request exception');
        return NextResponse.json({ error: 'Payment service unavailable' }, { status: 502 });
      }
    }

    const orderId = await createOrder(
      buildOrderPayload(customerInfo, snapshotResult.snapshot, totals, 'cod', 'pending')
    );

    if (!orderId) {
      console.error('[checkout] order insert failed (cod)');
      return NextResponse.json({ error: 'Failed to place order' }, { status: 500 });
    }

    const stockItems = snapshotResult.snapshot.map((item) => ({
      id: item.id,
      quantity: item.quantity,
    }));
    const { error: stockError } = await supabase.rpc('decrement_stock_batch', { items: stockItems });

    if (stockError) {
      console.error('[checkout] atomic stock decrement failed:', stockError);
      await markOrderFailed(orderId, 'stock decrement failure');
      return NextResponse.json({ error: 'Stock no longer available. Please try again.' }, { status: 400 });
    }

    revalidateCatalogStock();

    if (customerInfo.email) {
      void sendOrderConfirmation(customerInfo.email, {
        customerName: customerInfo.name,
        items: snapshotResult.snapshot.map((item) => ({
          name: item.name,
          price: item.priceAtOrder,
          quantity: item.quantity,
        })),
        orderId,
        total: totals.total,
      }).catch((error) => console.error('[checkout] COD email failed:', error));
    }

    return NextResponse.json({
      amount: totals.total,
      currency: 'INR',
      orderId,
      razorpayOrderId: null,
    });
  } catch (error) {
    console.error('[checkout] unexpected error:', error);
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}
