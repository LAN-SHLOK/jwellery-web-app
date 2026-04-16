import { NextRequest, NextResponse } from 'next/server';

import { verifySession } from '@/lib/auth';
import { supabase } from '@/lib/supabase';
import { orderStatusSchema } from '@/lib/validation';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

async function getAdminSession(request: NextRequest) {
  const cookie = request.cookies.get('admin_session');

  if (!cookie) {
    return null;
  }

  return verifySession(cookie.value);
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const orderId = searchParams.get('id');
  const phone = searchParams.get('phone');

  if (orderId && phone) {
    const { data, error } = await supabase
      .from('orders')
      .select('id, order_status, payment_status, payment_method, total_amount, created_at, items, customer_name')
      .eq('id', orderId)
      .eq('customer_phone', phone)
      .single();

    if (error || !data) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    return NextResponse.json({ order: data });
  }

  const session = await getAdminSession(request);

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data: orders, error } = await supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('[orders] list fetch failed:', error);
    return NextResponse.json({ error: 'DB error' }, { status: 500 });
  }

  return NextResponse.json({ orders });
}

export async function PATCH(request: NextRequest) {
  const session = await getAdminSession(request);

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const parsed = orderStatusSchema.safeParse(body);

  if (!parsed.success) {
    const message = parsed.error.issues.map((issue) => issue.message).join(', ');
    return NextResponse.json({ error: message }, { status: 400 });
  }

  const { orderId, status } = parsed.data;

  const { data: current } = await supabase
    .from('orders')
    .select('order_status')
    .eq('id', orderId)
    .single();

  if (!current) {
    return NextResponse.json({ error: 'Order not found' }, { status: 404 });
  }

  if (current.order_status === status) {
    return NextResponse.json({ message: 'No change needed' });
  }

  const { data: order, error } = await supabase
    .from('orders')
    .update({ order_status: status })
    .eq('id', orderId)
    .select()
    .single();

  if (error) {
    console.error('[orders] status update failed:', error);
    return NextResponse.json({ error: 'Update failed' }, { status: 500 });
  }

  return NextResponse.json({ message: 'Updated', data: order });
}
