'use client';

import { Fragment, useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { AlertCircle, ArrowRight, CheckCircle2, Clock, Package, ShieldCheck, XCircle } from 'lucide-react';

import { BRAND_CONFIG } from '@/config/brand';

type OrderData = {
  id: string;
  order_status: string;
  payment_status: string;
  payment_method: string;
  total_amount: number;
  customer_name: string;
};

const POLLABLE_ORDER_STATUSES = new Set(['pending_payment']);

export default function OrderConfirmationClient() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');
  const phone = searchParams.get('phone');
  const email = searchParams.get('email');

  const [order, setOrder] = useState<OrderData | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!orderId || !phone) {
      setLoading(false);
      return undefined;
    }

    const currentOrderId = orderId;
    const currentPhone = phone;
    let isCancelled = false;
    let timeoutId: ReturnType<typeof setTimeout> | null = null;

    async function loadOrder() {
      try {
        const response = await fetch(
          `/api/orders?id=${encodeURIComponent(currentOrderId)}&phone=${encodeURIComponent(currentPhone)}`,
          { cache: 'no-store' },
        );
        const data = await response.json();

        if (!data.order) {
          if (!isCancelled) {
            setNotFound(true);
          }
          return;
        }

        if (isCancelled) {
          return;
        }

        setOrder(data.order);
        setNotFound(false);

        const shouldPoll =
          data.order.payment_method === 'razorpay' &&
          data.order.payment_status !== 'paid' &&
          POLLABLE_ORDER_STATUSES.has(data.order.order_status);

        if (shouldPoll) {
          timeoutId = setTimeout(() => {
            void loadOrder();
          }, 3000);
        }
      } catch {
        if (!isCancelled) {
          setNotFound(true);
        }
      } finally {
        if (!isCancelled) {
          setLoading(false);
        }
      }
    }

    void loadOrder();

    return () => {
      isCancelled = true;
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [orderId, phone]);

  if (!orderId || !phone) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-8 text-center">
        <p className="mb-6 font-serif text-xl opacity-60">No order reference found.</p>
        <Link
          href="/collections"
          className="border-b border-black/30 pb-1 text-xs uppercase tracking-widest transition-colors hover:text-brand-accent"
        >
          Continue shopping
        </Link>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-accent border-t-transparent" />
      </div>
    );
  }

  if (notFound || !order) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-6 px-8 text-center">
        <p className="font-serif text-xl opacity-60">Order not found.</p>
        <p className="max-w-xs text-xs opacity-40">
          If you just placed this order, it may take a moment to appear. Check your email for confirmation.
        </p>
        <Link
          href="/collections"
          className="border-b border-black/30 pb-1 text-xs uppercase tracking-widest transition-colors hover:text-brand-accent"
        >
          Continue shopping
        </Link>
      </div>
    );
  }

  const totalLabel = `${BRAND_CONFIG.currency.symbol}${Number(order.total_amount).toLocaleString(BRAND_CONFIG.currency.locale)}`;
  const isCod = order.payment_method === 'cod';
  const isPaid = order.payment_status === 'paid';
  const needsReview = order.order_status === 'manual_review_required';
  const isCancelled = order.order_status === 'cancelled';
  const isFailed = order.order_status === 'failed';
  const isAwaitingPayment = !isCod && !isPaid && !needsReview && !isCancelled && !isFailed;
  const statusTone = isCancelled || isFailed ? 'text-amber-600' : 'text-green-600';
  const statusKicker = isCancelled ? 'Payment Cancelled' : isFailed ? 'Payment Not Completed' : 'Order Confirmed';
  const heading = isCancelled
    ? 'Your payment was cancelled.'
    : isFailed
      ? 'This payment did not complete.'
      : 'Thank you for your order.';
  const intro = isCancelled
    ? 'The order has been left unpaid, so nothing has been fulfilled yet. You can return to checkout whenever you are ready.'
    : isFailed
      ? 'The payment attempt did not go through. No stock was committed for this order, and you can try again from checkout.'
      : 'Your jewellery is being prepared with care. You will receive updates as it moves through our workshop.';
  const StatusIcon = isCancelled ? XCircle : isFailed ? AlertCircle : CheckCircle2;

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4 py-24">
      <div className={`mb-8 flex h-20 w-20 items-center justify-center rounded-full animate-scale-in ${
        isCancelled || isFailed
          ? 'border border-amber-200 bg-amber-50'
          : 'border border-green-200 bg-green-50'
      }`}>
        <StatusIcon size={36} className={`stroke-[1.5] ${statusTone}`} />
      </div>

      <div className="max-w-md text-center animate-fade-in-up">
        <p className="mb-3 text-[9px] font-bold uppercase tracking-[0.5em] text-brand-accent">{statusKicker}</p>
        <h1 className="mb-4 font-serif text-3xl md:text-4xl">{heading}</h1>
        <p className="mb-8 text-sm leading-relaxed opacity-50">
          {intro}
        </p>

        <div className="mb-8 space-y-4 border border-black/5 bg-brand-muted/40 p-6 text-left md:p-8">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold uppercase tracking-widest opacity-40">Order Reference</span>
            <span className="font-mono text-[11px] opacity-60">{order.id.slice(0, 8).toUpperCase()}</span>
          </div>

          <div className="flex items-center justify-between border-t border-black/5 pt-4 text-xs">
            <span className="font-bold uppercase tracking-widest opacity-40">Order Total</span>
            <span className="font-serif text-base font-bold">{totalLabel}</span>
          </div>

          <div className="flex items-center justify-between border-t border-black/5 pt-4 text-xs">
            <span className="font-bold uppercase tracking-widest opacity-40">Payment Status</span>
            {isPaid ? (
              <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-green-600">
                <CheckCircle2 size={11} />
                Payment Received
              </span>
            ) : isCod ? (
              <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-amber-600">
                <Clock size={11} />
                Cash on Delivery
              </span>
            ) : needsReview ? (
              <span className="text-[10px] font-bold uppercase tracking-widest text-amber-600">
                Payment Received - Under Review
              </span>
            ) : isCancelled ? (
              <span className="text-[10px] font-bold uppercase tracking-widest text-amber-600">
                Payment Cancelled
              </span>
            ) : isFailed ? (
              <span className="text-[10px] font-bold uppercase tracking-widest text-amber-600">
                Payment Failed
              </span>
            ) : (
              <span className="text-[10px] font-bold uppercase tracking-widest italic text-amber-600 opacity-80">
                Awaiting payment
              </span>
            )}
          </div>

          <div className="border-t border-black/5 pt-4">
            <p className="flex items-center gap-2 text-[9px] uppercase tracking-widest opacity-30">
              <ShieldCheck size={11} />
              Price locked at gold rate used at time of order
            </p>
          </div>
        </div>

        {email && (
          <p className="mb-8 text-xs opacity-50">
            Confirmation sent to <span className="font-bold opacity-80">{email}</span>
          </p>
        )}

        {!isCancelled && !isFailed && (
          <div className="mb-10 flex items-center justify-center gap-3 text-[9px] uppercase tracking-widest opacity-40">
            {['Order Placed', 'Processing', 'Shipped', 'Delivered'].map((step, index) => (
              <Fragment key={step}>
                <span className={index === 0 ? 'font-bold text-green-600 opacity-100' : ''}>{step}</span>
                {index < 3 && <span>&middot;</span>}
              </Fragment>
            ))}
          </div>
        )}

        {isAwaitingPayment && (
          <p className="mb-8 text-xs opacity-50">
            We&apos;re waiting for the payment confirmation from Razorpay. This page refreshes automatically.
          </p>
        )}

        {(isCancelled || isFailed) && (
          <p className="mb-8 text-xs opacity-50">
            You can return to checkout and try the payment flow again whenever you&apos;re ready.
          </p>
        )}

        <div className="flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            href="/collections"
            className="group inline-flex items-center justify-center gap-2 bg-brand-primary px-8 py-3.5 text-[10px] font-bold uppercase tracking-[0.25em] text-white transition-colors duration-300 hover:bg-brand-accent"
          >
            Continue Shopping
            <ArrowRight size={12} className="transition-transform group-hover:translate-x-1" />
          </Link>
          <Link
            href={`https://wa.me/${BRAND_CONFIG.contact.whatsapp.replace(/\D/g, '')}?text=Hi, my order reference is ${order.id.slice(0, 8).toUpperCase()}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 border border-black/10 px-8 py-3.5 text-[10px] font-bold uppercase tracking-[0.25em] transition-colors duration-300 hover:bg-brand-muted"
          >
            <Package size={12} />
            Track via WhatsApp
          </Link>
        </div>
      </div>
    </div>
  );
}
