import { createClient } from '@supabase/supabase-js';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

if (!url || !key) {
  console.warn('[supabase] missing env vars — DB calls will fail');
}

export const supabase = createClient(url, key);

export type ProductRow = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  category: string | null;
  gold_weight_grams: number;
  gold_purity: string;
  making_charge_type: 'fixed' | 'percentage';
  making_charge_value: number;
  jeweller_margin: number;
  images: string[];
  stock_quantity: number;
  is_active: boolean;
  is_featured: boolean;
  hallmark_number: string | null;
  created_at: string;
};

export type GoldRateRow = {
  id: number;
  rate_per_gram: number;
  entered_by: string | null;
  created_at: string;
};

export type OrderRow = {
  id: string;
  customer_name: string;
  customer_phone: string;
  customer_email: string | null;
  address: Record<string, string>;
  items: any[];
  gold_rate_used: number;
  subtotal: number;
  gst_amount: number;
  total_amount: number;
  payment_method: 'razorpay' | 'cod';
  payment_status: string;
  order_status: string;
  razorpay_order_id: string | null;
  created_at: string;
};
