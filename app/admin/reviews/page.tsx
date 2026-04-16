'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Star, Check, X, MessageSquare, Trash2 } from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';

type Review = {
  id: string;
  customer_name: string;
  customer_email: string;
  rating: number;
  title: string | null;
  review_text: string;
  verified_purchase: boolean;
  is_approved: boolean;
  admin_response: string | null;
  created_at: string;
  products: { name: string; slug: string };
};

export default function ReviewsManagement() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved'>('all');

  useEffect(() => {
    fetchReviews();
  }, []);

  async function fetchReviews() {
    try {
      const res = await fetch('/api/admin/reviews');
      const data = await res.json();
      setReviews(data.reviews || []);
    } catch (err) {
      console.error('[ReviewsManagement] fetch failed:', err);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleApprove(reviewId: string, isApproved: boolean) {
    try {
      await fetch('/api/admin/reviews', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reviewId, isApproved }),
      });
      fetchReviews();
    } catch (err) {
      console.error('[ReviewsManagement] approve failed:', err);
    }
  }

  async function handleDelete(reviewId: string) {
    if (!confirm('Are you sure you want to delete this review?')) return;

    try {
      await fetch(`/api/admin/reviews?id=${reviewId}`, { method: 'DELETE' });
      fetchReviews();
    } catch (err) {
      console.error('[ReviewsManagement] delete failed:', err);
    }
  }

  const filteredReviews = reviews.filter((r) => {
    if (filter === 'pending') return !r.is_approved;
    if (filter === 'approved') return r.is_approved;
    return true;
  });

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <Star
        key={i}
        size={14}
        className={i < rating ? 'fill-brand-accent text-brand-accent' : 'text-brand-text/20'}
      />
    ));
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="luxury-panel rounded-[2rem] p-6 md:p-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-8">
            <div>
              <p className="section-kicker">Review Management</p>
              <h1 className="mt-2 text-3xl text-brand-primary">Customer Reviews</h1>
            </div>
            <div className="flex gap-2">
              {(['all', 'pending', 'approved'] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-4 py-2 rounded-full text-[10px] uppercase tracking-widest font-bold transition-all ${
                    filter === f
                      ? 'bg-brand-primary text-white'
                      : 'border border-black/10 hover:border-brand-accent'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="shimmer h-40 rounded-[1.5rem]" />
              ))}
            </div>
          ) : filteredReviews.length === 0 ? (
            <div className="text-center py-16">
              <MessageSquare size={48} className="mx-auto opacity-20 mb-4" />
              <p className="text-sm opacity-50">No reviews found</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredReviews.map((review, idx) => (
                <motion.div
                  key={review.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="rounded-[1.5rem] border border-black/8 bg-white/55 p-6"
                >
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <p className="font-bold text-sm">{review.customer_name}</p>
                        {review.verified_purchase && (
                          <span className="text-[9px] uppercase tracking-widest text-emerald-600 border border-emerald-200 bg-emerald-50 px-2 py-1 rounded-full">
                            Verified
                          </span>
                        )}
                        {review.is_approved ? (
                          <span className="text-[9px] uppercase tracking-widest text-brand-accent border border-brand-accent/20 bg-brand-accent/5 px-2 py-1 rounded-full">
                            Approved
                          </span>
                        ) : (
                          <span className="text-[9px] uppercase tracking-widest text-amber-600 border border-amber-200 bg-amber-50 px-2 py-1 rounded-full">
                            Pending
                          </span>
                        )}
                      </div>
                      <div className="flex gap-1 mb-2">{renderStars(review.rating)}</div>
                      <p className="text-[10px] opacity-40 mb-3">
                        {review.products.name} • {new Date(review.created_at).toLocaleDateString()}
                      </p>
                      {review.title && <h4 className="font-bold text-sm mb-2">{review.title}</h4>}
                      <p className="text-sm leading-7 text-brand-text/70">{review.review_text}</p>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-4 border-t border-black/5">
                    {!review.is_approved ? (
                      <button
                        onClick={() => handleApprove(review.id, true)}
                        className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 rounded-full text-[10px] uppercase tracking-widest font-bold hover:bg-emerald-100 transition-colors"
                      >
                        <Check size={12} />
                        Approve
                      </button>
                    ) : (
                      <button
                        onClick={() => handleApprove(review.id, false)}
                        className="flex items-center gap-2 px-4 py-2 bg-amber-50 text-amber-700 rounded-full text-[10px] uppercase tracking-widest font-bold hover:bg-amber-100 transition-colors"
                      >
                        <X size={12} />
                        Unapprove
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(review.id)}
                      className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-700 rounded-full text-[10px] uppercase tracking-widest font-bold hover:bg-red-100 transition-colors"
                    >
                      <Trash2 size={12} />
                      Delete
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
