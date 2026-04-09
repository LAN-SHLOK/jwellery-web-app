'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, StarHalf, CheckCircle, MessageSquare, Send } from 'lucide-react';

type Review = {
  id: string;
  customer_name: string;
  rating: number;
  title: string | null;
  review_text: string;
  verified_purchase: boolean;
  admin_response: string | null;
  created_at: string;
};

type Props = {
  productId: string;
  productSlug: string;
};

export default function ProductReviews({ productId, productSlug }: Props) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    rating: 5,
    title: '',
    reviewText: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    fetchReviews();
  }, [productSlug]);

  async function fetchReviews() {
    try {
      const res = await fetch(`/api/reviews?slug=${productSlug}`);
      const data = await res.json();
      setReviews(data.reviews || []);
    } catch (err) {
      console.error('[ProductReviews] fetch failed:', err);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage(null);

    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId,
          customerName: formData.customerName,
          customerEmail: formData.customerEmail,
          rating: formData.rating,
          title: formData.title || undefined,
          reviewText: formData.reviewText,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit review');
      }

      setMessage({ text: data.message, type: 'success' });
      setFormData({
        customerName: '',
        customerEmail: '',
        rating: 5,
        title: '',
        reviewText: '',
      });
      setShowForm(false);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to submit review';
      setMessage({ text: errorMessage, type: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  }

  const averageRating = reviews.length > 0
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : 0;

  const renderStars = (rating: number, size: number = 16) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={`full-${i}`} size={size} className="fill-brand-accent text-brand-accent" />);
    }
    if (hasHalfStar) {
      stars.push(<StarHalf key="half" size={size} className="fill-brand-accent text-brand-accent" />);
    }
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Star key={`empty-${i}`} size={size} className="text-brand-text/20" />);
    }
    return stars;
  };

  return (
    <div className="space-y-8">
      <motion.div
        className="luxury-panel rounded-[2rem] p-6 md:p-8"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-8">
          <div>
            <p className="section-kicker">Customer reviews</p>
            <h2 className="mt-2 font-serif text-3xl text-brand-primary">What our customers say</h2>
          </div>
          {reviews.length > 0 && (
            <div className="flex items-center gap-4">
              <div className="flex gap-1">{renderStars(averageRating, 20)}</div>
              <div className="text-right">
                <p className="font-serif text-2xl text-brand-primary">{averageRating.toFixed(1)}</p>
                <p className="text-[10px] uppercase tracking-widest opacity-40">{reviews.length} reviews</p>
              </div>
            </div>
          )}
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

        {!showForm && (
          <motion.button
            onClick={() => setShowForm(true)}
            className="button-secondary h-12 rounded-full mb-8"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <MessageSquare size={14} />
            Write a review
          </motion.button>
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
                    <label className="text-[10px] uppercase tracking-widest font-bold opacity-60">Your Name</label>
                    <input
                      type="text"
                      required
                      value={formData.customerName}
                      onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                      className="w-full border-b border-black/10 py-2 focus:border-brand-accent outline-none text-sm transition-colors mt-2"
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase tracking-widest font-bold opacity-60">Email</label>
                    <input
                      type="email"
                      required
                      value={formData.customerEmail}
                      onChange={(e) => setFormData({ ...formData, customerEmail: e.target.value })}
                      className="w-full border-b border-black/10 py-2 focus:border-brand-accent outline-none text-sm transition-colors mt-2"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] uppercase tracking-widest font-bold opacity-60">Rating</label>
                  <div className="flex gap-2 mt-3">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <motion.button
                        key={star}
                        type="button"
                        onClick={() => setFormData({ ...formData, rating: star })}
                        whileHover={{ scale: 1.2 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <Star
                          size={24}
                          className={star <= formData.rating ? 'fill-brand-accent text-brand-accent' : 'text-brand-text/20'}
                        />
                      </motion.button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-[10px] uppercase tracking-widest font-bold opacity-60">Review Title (Optional)</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full border-b border-black/10 py-2 focus:border-brand-accent outline-none text-sm transition-colors mt-2"
                    placeholder="Beautiful craftsmanship"
                  />
                </div>

                <div>
                  <label className="text-[10px] uppercase tracking-widest font-bold opacity-60">Your Review</label>
                  <textarea
                    required
                    value={formData.reviewText}
                    onChange={(e) => setFormData({ ...formData, reviewText: e.target.value })}
                    className="w-full border border-black/10 rounded-[1rem] p-4 focus:border-brand-accent outline-none text-sm transition-colors mt-2 min-h-[120px]"
                    placeholder="Share your experience with this product..."
                  />
                </div>

                <div className="flex gap-3">
                  <motion.button
                    type="submit"
                    disabled={isSubmitting}
                    className="button-primary h-12 rounded-full flex-1"
                    whileHover={!isSubmitting ? { scale: 1.02 } : {}}
                    whileTap={!isSubmitting ? { scale: 0.98 } : {}}
                  >
                    <Send size={14} />
                    {isSubmitting ? 'Submitting...' : 'Submit Review'}
                  </motion.button>
                  <motion.button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="button-secondary h-12 rounded-full px-8"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Cancel
                  </motion.button>
                </div>
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
        ) : reviews.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-sm opacity-50">No reviews yet. Be the first to review this product!</p>
          </div>
        ) : (
          <div className="space-y-6">
            {reviews.map((review, idx) => (
              <motion.div
                key={review.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="rounded-[1.5rem] border border-black/8 bg-white/55 p-6"
              >
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <p className="font-bold text-sm">{review.customer_name}</p>
                      {review.verified_purchase && (
                        <span className="flex items-center gap-1 text-[9px] uppercase tracking-widest text-emerald-600">
                          <CheckCircle size={12} />
                          Verified
                        </span>
                      )}
                    </div>
                    <div className="flex gap-1">{renderStars(review.rating)}</div>
                  </div>
                  <p className="text-[10px] opacity-40">
                    {new Date(review.created_at).toLocaleDateString('en-IN', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </p>
                </div>

                {review.title && (
                  <h4 className="font-bold text-sm mb-2">{review.title}</h4>
                )}
                <p className="text-sm leading-7 text-brand-text/70">{review.review_text}</p>

                {review.admin_response && (
                  <div className="mt-4 rounded-[1rem] border border-brand-accent/20 bg-brand-accent/5 p-4">
                    <p className="text-[9px] uppercase tracking-widest font-bold text-brand-accent mb-2">
                      Response from {process.env.NEXT_PUBLIC_BRAND_NAME || 'Store'}
                    </p>
                    <p className="text-sm leading-7 text-brand-text/70">{review.admin_response}</p>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}
