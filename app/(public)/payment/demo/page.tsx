'use client';

import { Suspense, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { AlertCircle, ArrowLeft, CheckCircle2, CreditCard, ShieldCheck, XCircle } from 'lucide-react';

import { BRAND_CONFIG } from '@/config/brand';
import { useCart } from '@/lib/store';

type OrderItem = {
  name: string;
  priceAtOrder?: number;
  quantity?: number;
};

type OrderData = {
  customer_name: string;
  id: string;
  items?: OrderItem[];
  order_status: string;
  payment_method: string;
  payment_status: string;
  total_amount: number;
};

type DemoOutcome = 'cancelled' | 'failed' | 'success';

function formatCurrency(value: number) {
  return `${BRAND_CONFIG.currency.symbol}${value.toLocaleString(BRAND_CONFIG.currency.locale)}`;
}

function DemoPaymentContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const clearCart = useCart((state) => state.clearCart);

  const orderId = searchParams.get('orderId');
  const phone = searchParams.get('phone');
  const email = searchParams.get('email');
  const token = searchParams.get('token');

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState<DemoOutcome | null>(null);
  const [error, setError] = useState('');
  const [order, setOrder] = useState<OrderData | null>(null);

  useEffect(() => {
    if (!orderId || !phone || !token) {
      setIsLoading(false);
      setError('The payment reference is missing. Please restart checkout.');
      return;
    }

    const currentOrderId = orderId;
    const currentPhone = phone;

    async function loadOrder() {
      try {
        const response = await fetch(
          `/api/orders?id=${encodeURIComponent(currentOrderId)}&phone=${encodeURIComponent(currentPhone)}`,
          { cache: 'no-store' },
        );
        const data = await response.json();

        if (!response.ok || !data.order) {
          setError(data.error || 'Could not load your order.');
          return;
        }

        setOrder(data.order);
      } catch (requestError) {
        console.error('[demo-payment] failed to load order:', requestError);
        setError('Could not load your order.');
      } finally {
        setIsLoading(false);
      }
    }

    void loadOrder();
  }, [orderId, phone, token]);

  const orderTotal = Number(order?.total_amount || 0);
  const lineItems = Array.isArray(order?.items) ? order.items : [];

  async function handleOutcome(outcome: DemoOutcome) {
    if (!orderId || !phone || !token) {
      setError('The payment reference is missing. Please restart checkout.');
      return;
    }

    setIsSubmitting(outcome);
    setError('');

    try {
      const response = await fetch('/api/payments/demo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, outcome, phone, token }),
      });
      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Could not update the payment state.');
        return;
      }

      if (outcome === 'success') {
        clearCart();
      }

      const nextQuery = new URLSearchParams({
        orderId,
        phone,
      });

      if (email) {
        nextQuery.set('email', email);
      }

      router.push(`/order-confirmation?${nextQuery.toString()}`);
    } catch (requestError) {
      console.error('[demo-payment] failed to update order:', requestError);
      setError('Could not update the payment state.');
    } finally {
      setIsSubmitting(null);
    }
  }

  return (
    <div className="min-h-screen px-4 py-10 md:px-8 md:py-16">
      <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:gap-12">
        <section className="luxury-panel rounded-[2rem] p-6 md:p-10">
          <p className="section-kicker">Secure Payment Review</p>
          <h1 className="mt-4 font-serif text-3xl md:text-5xl">Review the online-payment journey before the live gateway is switched on.</h1>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-brand-text/62 md:text-base">
            This step stands in for the final payment gateway so the full online-order journey can still be reviewed cleanly while live gateway access is being completed.
          </p>

          <div className="mt-8 rounded-[1.75rem] border border-brand-text/8 bg-[linear-gradient(135deg,rgba(56,41,28,0.96)_0%,rgba(92,69,41,0.94)_100%)] p-5 text-white md:p-6">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-brand-accent">
                <ShieldCheck size={20} />
              </div>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-white/50">Payment Review</p>
                <p className="mt-3 text-sm leading-6 text-white/76">
                  Use the actions below to review success, decline, and cancellation outcomes before the final gateway goes live.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8 space-y-4">
            <button
              type="button"
              onClick={() => void handleOutcome('success')}
              disabled={isLoading || !!error || isSubmitting !== null}
              className="flex w-full items-center justify-between rounded-[1.75rem] border border-emerald-200 bg-emerald-50 px-5 py-5 text-left transition hover:-translate-y-0.5 hover:border-emerald-300 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
                  <CheckCircle2 size={20} />
                </div>
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-emerald-800">Payment approved</p>
                  <p className="mt-2 text-sm text-emerald-700/85">Continue to confirmation with the order marked as paid.</p>
                </div>
              </div>
              <span className="text-[10px] font-semibold uppercase tracking-[0.24em] text-emerald-700">
                {isSubmitting === 'success' ? 'Processing...' : 'Confirm'}
              </span>
            </button>

            <button
              type="button"
              onClick={() => void handleOutcome('failed')}
              disabled={isLoading || !!error || isSubmitting !== null}
              className="flex w-full items-center justify-between rounded-[1.75rem] border border-amber-200 bg-amber-50 px-5 py-5 text-left transition hover:-translate-y-0.5 hover:border-amber-300 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-100 text-amber-700">
                  <AlertCircle size={20} />
                </div>
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-amber-800">Payment declined</p>
                  <p className="mt-2 text-sm text-amber-700/85">Review how the order behaves when payment does not complete.</p>
                </div>
              </div>
              <span className="text-[10px] font-semibold uppercase tracking-[0.24em] text-amber-700">
                {isSubmitting === 'failed' ? 'Updating...' : 'Fail'}
              </span>
            </button>

            <button
              type="button"
              onClick={() => void handleOutcome('cancelled')}
              disabled={isLoading || !!error || isSubmitting !== null}
              className="flex w-full items-center justify-between rounded-[1.75rem] border border-rose-200 bg-rose-50 px-5 py-5 text-left transition hover:-translate-y-0.5 hover:border-rose-300 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-rose-100 text-rose-700">
                  <XCircle size={20} />
                </div>
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-rose-800">Payment cancelled</p>
                  <p className="mt-2 text-sm text-rose-700/85">Review the path where the customer exits payment before completing it.</p>
                </div>
              </div>
              <span className="text-[10px] font-semibold uppercase tracking-[0.24em] text-rose-700">
                {isSubmitting === 'cancelled' ? 'Updating...' : 'Cancel'}
              </span>
            </button>
          </div>

          {error && (
            <p className="mt-6 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
              {error}
            </p>
          )}

          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/checkout"
              className="inline-flex items-center gap-2 border border-black/10 px-5 py-3 text-[10px] font-semibold uppercase tracking-[0.26em] transition hover:bg-brand-muted"
            >
              <ArrowLeft size={14} />
              Back to Checkout
            </Link>
          </div>
        </section>

        <aside className="luxury-panel rounded-[2rem] p-6 md:p-8 lg:sticky lg:top-32">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-primary text-brand-accent">
              <CreditCard size={18} />
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-brand-text/42">Payment Summary</p>
              <p className="mt-2 text-2xl font-serif text-brand-primary">
                {isLoading ? 'Loading...' : formatCurrency(orderTotal)}
              </p>
            </div>
          </div>

          <div className="mt-8 space-y-4">
            <div className="rounded-[1.5rem] border border-brand-text/8 bg-white/72 px-4 py-4">
              <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-brand-text/40">Order reference</p>
              <p className="mt-2 font-mono text-sm text-brand-primary">{orderId ? orderId.slice(0, 8).toUpperCase() : 'Not available'}</p>
            </div>

            <div className="rounded-[1.5rem] border border-brand-text/8 bg-white/72 px-4 py-4">
              <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-brand-text/40">Customer</p>
              <p className="mt-2 text-sm text-brand-text/74">
                {isLoading ? 'Loading...' : order?.customer_name || 'Not available'}
              </p>
            </div>

            <div className="rounded-[1.5rem] border border-brand-text/8 bg-white/72 px-4 py-4">
              <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-brand-text/40">Current state</p>
              <p className="mt-2 text-sm text-brand-text/74">
                {isLoading
                  ? 'Loading...'
                  : order
                    ? `${order.payment_status} payment / ${order.order_status.replace(/_/g, ' ')}`
                    : 'Not available'}
              </p>
            </div>
          </div>

          <div className="mt-8 border-t border-brand-text/8 pt-6">
            <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-brand-text/42">Items in this order</p>
            <div className="mt-4 space-y-4">
              {isLoading ? (
                <div className="space-y-3">
                  <div className="shimmer h-16 rounded-[1.25rem]" />
                  <div className="shimmer h-16 rounded-[1.25rem]" />
                </div>
              ) : lineItems.length === 0 ? (
                <p className="text-sm text-brand-text/55">No items were found for this order yet.</p>
              ) : (
                lineItems.map((item, index) => (
                  <div key={`${item.name}-${index}`} className="rounded-[1.25rem] border border-brand-text/8 bg-white/72 px-4 py-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold text-brand-primary">{item.name}</p>
                        <p className="mt-1 text-[11px] uppercase tracking-[0.2em] text-brand-text/42">
                          Qty {item.quantity || 1}
                        </p>
                      </div>
                      <p className="text-sm font-semibold text-brand-text/74">
                        {formatCurrency(Number(item.priceAtOrder || 0))}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

function PaymentDemoFallback() {
  return (
    <div className="min-h-screen px-4 py-10 md:px-8 md:py-16">
      <div className="mx-auto max-w-3xl">
        <div className="luxury-panel rounded-[2rem] p-6 md:p-10">
          <div className="shimmer h-12 rounded-2xl" />
          <div className="mt-6 shimmer h-40 rounded-[1.75rem]" />
          <div className="mt-6 space-y-4">
            <div className="shimmer h-20 rounded-[1.75rem]" />
            <div className="shimmer h-20 rounded-[1.75rem]" />
            <div className="shimmer h-20 rounded-[1.75rem]" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function DemoPaymentPage() {
  return (
    <Suspense fallback={<PaymentDemoFallback />}>
      <DemoPaymentContent />
    </Suspense>
  );
}
