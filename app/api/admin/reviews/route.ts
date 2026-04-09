import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { verifyAdminSession } from '@/lib/auth';

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
      .from('product_reviews')
      .select('*, products(name, slug)')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('[admin/reviews] fetch failed:', error);
      return NextResponse.json({ error: 'Failed to fetch reviews' }, { status: 500 });
    }

    return NextResponse.json({ reviews: data || [] });
  } catch (err) {
    console.error('[admin/reviews] unexpected error:', err);
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
    const { reviewId, isApproved, adminResponse } = body;

    if (!reviewId) {
      return NextResponse.json({ error: 'Review ID required' }, { status: 400 });
    }

    const updateData: any = {};
    if (typeof isApproved === 'boolean') {
      updateData.is_approved = isApproved;
    }
    if (adminResponse !== undefined) {
      updateData.admin_response = adminResponse;
    }

    const { data, error } = await supabaseAdmin
      .from('product_reviews')
      .update(updateData)
      .eq('id', reviewId)
      .select()
      .single();

    if (error) {
      console.error('[admin/reviews] update failed:', error);
      return NextResponse.json({ error: 'Failed to update review' }, { status: 500 });
    }

    return NextResponse.json({ message: 'Review updated', review: data });
  } catch (err) {
    console.error('[admin/reviews] PATCH error:', err);
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
    const reviewId = searchParams.get('id');

    if (!reviewId) {
      return NextResponse.json({ error: 'Review ID required' }, { status: 400 });
    }

    const { error } = await supabaseAdmin
      .from('product_reviews')
      .delete()
      .eq('id', reviewId);

    if (error) {
      console.error('[admin/reviews] delete failed:', error);
      return NextResponse.json({ error: 'Failed to delete review' }, { status: 500 });
    }

    return NextResponse.json({ message: 'Review deleted' });
  } catch (err) {
    console.error('[admin/reviews] DELETE error:', err);
    return NextResponse.json({ error: 'Server Error' }, { status: 500 });
  }
}
