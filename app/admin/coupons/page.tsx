'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit2, Trash2, Tag, X } from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import { BRAND_CONFIG } from '@/config/brand';

type Coupon = {
  id: string;
  code: string;
  description: string | null;
  discount_type: 'percentage' | 'fixed';
  discount_value: number;
  min_order_value: number;
  max_discount_amount: number | null;
  usage_limit: number | null;
  usage_count: number;
  valid_from: string;
  valid_until: string | null;
  is_active: boolean;
  created_at: string;
};

export default function CouponsManagement() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    code: '',
    description: '',
    discountType: 'percentage' as 'percentage' | 'fixed',
    discountValue: '',
    minOrderValue: '',
    maxDiscountAmount: '',
    usageLimit: '',
    validUntil: '',
    isActive: true,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    fetchCoupons();
  }, []);

  async function fetchCoupons() {
    try {
      const res = await fetch('/api/admin/coupons');
      const data = await res.json();
      setCoupons(data.coupons || []);
    } catch (err) {
      console.error('[CouponsManagement] fetch failed:', err);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage(null);

    try {
      const res = await fetch('/api/admin/coupons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: formData.code.toUpperCase(),
          description: formData.description || undefined,
          discountType: formData.discountType,
          discountValue: parseFloat(formData.discountValue),
          minOrderValue: parseFloat(formData.minOrderValue) || 0,
          maxDiscountAmount: formData.maxDiscountAmount ? parseFloat(formData.maxDiscountAmount) : undefined,
          usageLimit: formData.usageLimit ? parseInt(formData.usageLimit) : undefined,
          validUntil: formData.validUntil || undefined,
          isActive: formData.isActive,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to create coupon');
      }

      setMessage({ text: 'Coupon created successfully', type: 'success' });
      setFormData({
        code: '',
        description: '',
        discountType: 'percentage',
        discountValue: '',
        minOrderValue: '',
        maxDiscountAmount: '',
        usageLimit: '',
        validUntil: '',
        isActive: true,
      });
      setShowForm(false);
      fetchCoupons();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create coupon';
      setMessage({ text: errorMessage, type: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleToggleActive(couponId: string, isActive: boolean) {
    try {
      await fetch('/api/admin/coupons', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ couponId, is_active: !isActive }),
      });
      fetchCoupons();
    } catch (err) {
      console.error('[CouponsManagement] toggle failed:', err);
    }
  }

  async function handleDelete(couponId: string) {
    if (!confirm('Are you sure you want to delete this coupon?')) return;

    try {
      await fetch(`/api/admin/coupons?id=${couponId}`, { method: 'DELETE' });
      fetchCoupons();
    } catch (err) {
      console.error('[CouponsManagement] delete failed:', err);
    }
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="luxury-panel rounded-[2rem] p-6 md:p-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-8">
            <div>
              <p className="section-kicker">Coupon Management</p>
              <h1 className="mt-2 text-3xl text-brand-primary">Discount Codes</h1>
            </div>
            <motion.button
              onClick={() => setShowForm(!showForm)}
              className="button-primary h-12 rounded-full"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {showForm ? <X size={14} /> : <Plus size={14} />}
              {showForm ? 'Cancel' : 'Create Coupon'}
            </motion.button>
          </div>

          {message && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`mb-6 rounded-[1.5rem] border px-5 py-4 ${
                message.type === 'success'
                  ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                  : 'border-rose-200 bg-rose-50 text-rose-700'
              }`}
            >
              <p className="text-sm">{message.text}</p>
            </motion.div>
          )}

          <AnimatePresence>
            {showForm && (
              <motion.form
                onSubmit={handleSubmit}
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden mb-8"
              >
                <div className="space-y-6 rounded-[1.5rem] border border-black/8 bg-white/55 p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="text-[10px] uppercase tracking-widest font-bold opacity-60">Coupon Code</label>
                      <input
                        type="text"
                        required
                        value={formData.code}
                        onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                        className="w-full border-b border-black/10 py-2 focus:border-brand-accent outline-none text-sm transition-colors mt-2"
                        placeholder="WELCOME10"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] uppercase tracking-widest font-bold opacity-60">Description</label>
                      <input
                        type="text"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        className="w-full border-b border-black/10 py-2 focus:border-brand-accent outline-none text-sm transition-colors mt-2"
                        placeholder="Welcome discount"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="text-[10px] uppercase tracking-widest font-bold opacity-60">Discount Type</label>
                      <select
                        value={formData.discountType}
                        onChange={(e) => setFormData({ ...formData, discountType: e.target.value as any })}
                        className="w-full border-b border-black/10 py-2 focus:border-brand-accent outline-none text-sm transition-colors mt-2"
                      >
                        <option value="percentage">Percentage</option>
                        <option value="fixed">Fixed Amount</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] uppercase tracking-widest font-bold opacity-60">
                        Discount Value {formData.discountType === 'percentage' ? '(%)' : `(${BRAND_CONFIG.currency.symbol})`}
                      </label>
                      <input
                        type="number"
                        required
                        step="0.01"
                        value={formData.discountValue}
                        onChange={(e) => setFormData({ ...formData, discountValue: e.target.value })}
                        className="w-full border-b border-black/10 py-2 focus:border-brand-accent outline-none text-sm transition-colors mt-2"
                        placeholder="10"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label className="text-[10px] uppercase tracking-widest font-bold opacity-60">Min Order Value</label>
                      <input
                        type="number"
                        step="0.01"
                        value={formData.minOrderValue}
                        onChange={(e) => setFormData({ ...formData, minOrderValue: e.target.value })}
                        className="w-full border-b border-black/10 py-2 focus:border-brand-accent outline-none text-sm transition-colors mt-2"
                        placeholder="0"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] uppercase tracking-widest font-bold opacity-60">Max Discount</label>
                      <input
                        type="number"
                        step="0.01"
                        value={formData.maxDiscountAmount}
                        onChange={(e) => setFormData({ ...formData, maxDiscountAmount: e.target.value })}
                        className="w-full border-b border-black/10 py-2 focus:border-brand-accent outline-none text-sm transition-colors mt-2"
                        placeholder="Optional"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] uppercase tracking-widest font-bold opacity-60">Usage Limit</label>
                      <input
                        type="number"
                        value={formData.usageLimit}
                        onChange={(e) => setFormData({ ...formData, usageLimit: e.target.value })}
                        className="w-full border-b border-black/10 py-2 focus:border-brand-accent outline-none text-sm transition-colors mt-2"
                        placeholder="Unlimited"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] uppercase tracking-widest font-bold opacity-60">Valid Until</label>
                    <input
                      type="datetime-local"
                      value={formData.validUntil}
                      onChange={(e) => setFormData({ ...formData, validUntil: e.target.value })}
                      className="w-full border-b border-black/10 py-2 focus:border-brand-accent outline-none text-sm transition-colors mt-2"
                    />
                  </div>

                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="isActive"
                      checked={formData.isActive}
                      onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                      className="w-4 h-4"
                    />
                    <label htmlFor="isActive" className="text-sm">Active</label>
                  </div>

                  <motion.button
                    type="submit"
                    disabled={isSubmitting}
                    className="button-primary h-12 rounded-full w-full"
                    whileHover={!isSubmitting ? { scale: 1.02 } : {}}
                    whileTap={!isSubmitting ? { scale: 0.98 } : {}}
                  >
                    {isSubmitting ? 'Creating...' : 'Create Coupon'}
                  </motion.button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>

          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="shimmer h-32 rounded-[1.5rem]" />
              ))}
            </div>
          ) : coupons.length === 0 ? (
            <div className="text-center py-16">
              <Tag size={48} className="mx-auto opacity-20 mb-4" />
              <p className="text-sm opacity-50">No coupons created yet</p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {coupons.map((coupon, idx) => (
                <motion.div
                  key={coupon.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="rounded-[1.5rem] border border-black/8 bg-white/55 p-6"
                >
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-bold text-lg font-mono">{coupon.code}</h3>
                        {coupon.is_active ? (
                          <span className="text-[9px] uppercase tracking-widest text-emerald-600 border border-emerald-200 bg-emerald-50 px-2 py-1 rounded-full">
                            Active
                          </span>
                        ) : (
                          <span className="text-[9px] uppercase tracking-widest text-red-600 border border-red-200 bg-red-50 px-2 py-1 rounded-full">
                            Inactive
                          </span>
                        )}
                      </div>
                      {coupon.description && (
                        <p className="text-sm text-brand-text/70 mb-3">{coupon.description}</p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2 text-sm mb-4">
                    <div className="flex justify-between">
                      <span className="opacity-60">Discount:</span>
                      <span className="font-bold">
                        {coupon.discount_type === 'percentage'
                          ? `${coupon.discount_value}%`
                          : `${BRAND_CONFIG.currency.symbol}${coupon.discount_value}`}
                      </span>
                    </div>
                    {coupon.min_order_value > 0 && (
                      <div className="flex justify-between">
                        <span className="opacity-60">Min Order:</span>
                        <span>{BRAND_CONFIG.currency.symbol}{coupon.min_order_value.toLocaleString()}</span>
                      </div>
                    )}
                    {coupon.usage_limit && (
                      <div className="flex justify-between">
                        <span className="opacity-60">Usage:</span>
                        <span>{coupon.usage_count} / {coupon.usage_limit}</span>
                      </div>
                    )}
                    {coupon.valid_until && (
                      <div className="flex justify-between">
                        <span className="opacity-60">Valid Until:</span>
                        <span>{new Date(coupon.valid_until).toLocaleDateString()}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2 pt-4 border-t border-black/5">
                    <button
                      onClick={() => handleToggleActive(coupon.id, coupon.is_active)}
                      className={`flex-1 px-4 py-2 rounded-full text-[10px] uppercase tracking-widest font-bold transition-colors ${
                        coupon.is_active
                          ? 'bg-amber-50 text-amber-700 hover:bg-amber-100'
                          : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                      }`}
                    >
                      {coupon.is_active ? 'Deactivate' : 'Activate'}
                    </button>
                    <button
                      onClick={() => handleDelete(coupon.id)}
                      className="px-4 py-2 bg-red-50 text-red-700 rounded-full text-[10px] uppercase tracking-widest font-bold hover:bg-red-100 transition-colors"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
