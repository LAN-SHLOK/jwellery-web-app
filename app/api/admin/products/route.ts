import { NextRequest, NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';

import { BRAND_CONFIG } from '@/config/brand';
import { uploadImage } from '@/lib/cloudinary';
import { supabase } from '@/lib/supabase';
import { productSchema, updateProductSchema } from '@/lib/validation';

// this creates  new product by Admin
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // form sends strings, Zod expects numbers — parse before validating
    const parsed = productSchema.safeParse({
      name: body.name,
      slug: body.slug,
      description: body.description || '',
      category: body.category,
      goldWeightGrams: body.gold_weight_grams ? parseFloat(body.gold_weight_grams) : undefined,
      goldPurity: '22K',
      makingChargeType: body.making_charge_type,
      makingChargeValue: body.making_charge_value ? parseFloat(body.making_charge_value) : undefined,
      jewellerMargin: body.jeweller_margin ? parseFloat(body.jeweller_margin) : undefined,
      stockQuantity: body.stock_quantity ? parseInt(body.stock_quantity) : 0,
      hallmarkNumber: body.hallmark_number || '',
      isActive: true,
      isFeatured: false,
    });

    if (!parsed.success) {
      const msg = parsed.error.issues.map(i => i.message).join(', ');
      return NextResponse.json({ error: msg }, { status: 400 });
    }

    const v = parsed.data;

    let imageUrl = '';
    if (body.imageBase64) {
      const uploaded = await uploadImage(body.imageBase64, BRAND_CONFIG.cloudinaryFolder);
      imageUrl = uploaded.url;
    }

    const { data, error } = await supabase
      .from('products')
      .insert([{
        name: v.name,
        slug: v.slug,
        description: v.description,
        category: v.category,
        gold_weight_grams: v.goldWeightGrams,
        gold_purity: '22K',
        making_charge_type: v.makingChargeType,
        making_charge_value: v.makingChargeValue,
        jeweller_margin: v.jewellerMargin,
        stock_quantity: v.stockQuantity ?? 0,
        hallmark_number: v.hallmarkNumber,
        images: imageUrl ? [imageUrl] : [],
        is_active: true,
        is_featured: false,
      }])
      .select()
      .single();

    if (error) {
      console.error('[admin/products] insert failed:', error);
      return NextResponse.json({ error: 'Failed to save product' }, { status: 500 });
    }

    revalidateTag('catalog');
    revalidateTag('catalog-products');

    return NextResponse.json({ success: true, product: data });

  } catch (err) {
    console.error('[admin/products] POST error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

// This method is used for changing existing product details
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, imageBase64, ...fields } = body;

    if (!id) return NextResponse.json({ error: 'Missing product ID' }, { status: 400 });

    // map strings to numbers for Zod validation
    const toValidate: Record<string, any> = {};
    if (fields.name !== undefined)               toValidate.name = fields.name;
    if (fields.slug !== undefined)               toValidate.slug = fields.slug;
    if (fields.description !== undefined)        toValidate.description = fields.description;
    if (fields.category !== undefined)           toValidate.category = fields.category;
    if (fields.gold_weight_grams !== undefined)  toValidate.goldWeightGrams = parseFloat(fields.gold_weight_grams);
    if (fields.making_charge_type !== undefined) toValidate.makingChargeType = fields.making_charge_type;
    if (fields.making_charge_value !== undefined) toValidate.makingChargeValue = parseFloat(fields.making_charge_value);
    if (fields.jeweller_margin !== undefined)    toValidate.jewellerMargin = parseFloat(fields.jeweller_margin);
    if (fields.stock_quantity !== undefined)     toValidate.stockQuantity = parseInt(fields.stock_quantity);
    if (fields.is_active !== undefined)          toValidate.isActive = fields.is_active;
    if (fields.is_featured !== undefined)        toValidate.isFeatured = fields.is_featured;
    if (fields.hallmark_number !== undefined)    toValidate.hallmarkNumber = fields.hallmark_number;

    const parsed = updateProductSchema.safeParse(toValidate);

    if (!parsed.success) {
      const msg = parsed.error.issues.map(i => i.message).join(', ');
      return NextResponse.json({ error: msg }, { status: 400 });
    }

    const v = parsed.data;

    const updates: Record<string, any> = {};
    if (v.name !== undefined)               updates.name = v.name;
    if (v.slug !== undefined)               updates.slug = v.slug;
    if (v.description !== undefined)        updates.description = v.description;
    if (v.category !== undefined)           updates.category = v.category;
    if (v.goldWeightGrams !== undefined)    updates.gold_weight_grams = v.goldWeightGrams;
    if (v.makingChargeType !== undefined)   updates.making_charge_type = v.makingChargeType;
    if (v.makingChargeValue !== undefined)  updates.making_charge_value = v.makingChargeValue;
    if (v.jewellerMargin !== undefined)     updates.jeweller_margin = v.jewellerMargin;
    if (v.stockQuantity !== undefined)      updates.stock_quantity = v.stockQuantity;
    if (v.isActive !== undefined)           updates.is_active = v.isActive;
    if (v.isFeatured !== undefined)         updates.is_featured = v.isFeatured;
    if (v.hallmarkNumber !== undefined)     updates.hallmark_number = v.hallmarkNumber;

    if (imageBase64) {
      const uploaded = await uploadImage(imageBase64, BRAND_CONFIG.cloudinaryFolder);
      updates.images = [uploaded.url];
    }

    const { data, error } = await supabase
      .from('products')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('[admin/products] update failed:', error);
      return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
    }

    revalidateTag('catalog');
    revalidateTag('catalog-products');

    return NextResponse.json({ success: true, product: data });

  } catch (err) {
    console.error('[admin/products] PATCH error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

//This method is used for deleting existing products 
export async function DELETE(request: NextRequest) {
  try {
    const id = new URL(request.url).searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'Missing ID' }, { status: 400 });

    const { error } = await supabase.from('products').delete().eq('id', id);

    if (error) {
      console.error('[admin/products] delete failed:', error);
      return NextResponse.json({ error: 'Failed to delete' }, { status: 500 });
    }

    revalidateTag('catalog');
    revalidateTag('catalog-products');

    return NextResponse.json({ success: true });

  } catch (err) {
    console.error('[admin/products] DELETE error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
