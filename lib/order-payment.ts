import { revalidateTag } from 'next/cache';

import { sendOrderConfirmation } from '@/lib/email';
import { supabase } from '@/lib/supabase';

type OrderSnapshotItem = {
  id: string;
  name: string;
  priceAtOrder: number;
  quantity: number;
};

type PayableOrder = {
  customer_email?: string | null;
  customer_name: string;
  id: string;
  items: unknown;
  payment_status?: string | null;
  total_amount: number;
};

function parseOrderItems(items: unknown) {
  if (!Array.isArray(items)) {
    return [];
  }

  return items
    .map((item) => item as Partial<OrderSnapshotItem>)
    .filter((item) => item.id && item.name && item.quantity && typeof item.priceAtOrder === 'number')
    .map((item) => ({
      id: item.id as string,
      name: item.name as string,
      priceAtOrder: Number(item.priceAtOrder),
      quantity: Number(item.quantity),
    }));
}

function revalidateCatalogStock() {
  revalidateTag('catalog');
  revalidateTag('catalog-products');
}

export async function finalizeOnlinePayment(order: PayableOrder) {
  if (order.payment_status === 'paid') {
    return { nextStatus: 'already_paid' as const };
  }

  const items = parseOrderItems(order.items);
  const stockItems = items.map((item) => ({
    id: item.id,
    quantity: item.quantity,
  }));
  const { error: stockError } = await supabase.rpc('decrement_stock_batch', { items: stockItems });

  if (stockError) {
    console.error(`[payment] stock decrement failed for order ${order.id}:`, stockError);

    const { error: reviewUpdateError } = await supabase
      .from('orders')
      .update({
        payment_status: 'paid',
        order_status: 'manual_review_required',
      })
      .eq('id', order.id);

    if (reviewUpdateError) {
      console.error('[payment] failed to mark order for manual review:', reviewUpdateError);
      throw new Error('Could not update order after stock issue');
    }

    return { nextStatus: 'manual_review_required' as const };
  }

  const { error: updateError } = await supabase
    .from('orders')
    .update({
      payment_status: 'paid',
      order_status: 'pending',
    })
    .eq('id', order.id);

  if (updateError) {
    console.error('[payment] failed to update order after payment:', updateError);
    throw new Error('Could not update paid order');
  }

  revalidateCatalogStock();

  if (order.customer_email) {
    void sendOrderConfirmation(order.customer_email, {
      orderId: order.id,
      customerName: order.customer_name,
      total: Number(order.total_amount || 0),
      items: items.map((item) => ({
        name: item.name,
        price: item.priceAtOrder,
        quantity: item.quantity,
      })),
    }).catch((error) => console.error('[payment] confirmation email failed:', error));
  }

  return { nextStatus: 'paid' as const };
}
