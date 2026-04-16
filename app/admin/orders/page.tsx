'use client';

import { type ReactNode, useEffect, useMemo, useState } from 'react';
import {
  AlertTriangle,
  Calendar,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Clock3,
  IndianRupee,
  MapPin,
  Search,
  ShoppingBag,
  Truck,
} from 'lucide-react';

import AdminLayout from '@/components/admin/AdminLayout';
import HoverTrendChart, { type TrendPoint } from '@/components/admin/HoverTrendChart';
import { BRAND_CONFIG } from '@/config/brand';

type OrderRecord = {
  address?: {
    city?: string;
    pincode?: string;
    street?: string;
  };
  created_at: string;
  customer_name: string;
  customer_phone: string;
  id: string;
  items?: Array<{
    name: string;
    priceAtOrder: number;
    quantity: number;
  }>;
  order_status: string;
  payment_status: string;
  total_amount: number;
};

const STATUS_TRANSITIONS: Record<string, string[]> = {
  cancelled: [],
  delivered: [],
  failed: [],
  manual_review_required: ['pending', 'cancelled'],
  pending: ['shipped', 'cancelled'],
  pending_payment: ['cancelled'],
  shipped: ['delivered'],
};

const ATTENTION_STATUSES = new Set(['pending', 'pending_payment', 'manual_review_required']);
const REVENUE_STATUSES = new Set(['pending', 'shipped', 'delivered']);

function formatStatusLabel(status: string) {
  if (status === 'pending_payment') {
    return 'Awaiting Payment';
  }

  if (status === 'manual_review_required') {
    return 'Needs Review';
  }

  return status.replace(/_/g, ' ');
}

function formatCurrency(value: number) {
  return `${BRAND_CONFIG.currency.symbol}${Number(value || 0).toLocaleString(BRAND_CONFIG.currency.locale)}`;
}

function formatDate(value?: string) {
  if (!value) {
    return '-';
  }

  return new Date(value).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    timeZone: 'Asia/Kolkata',
    year: 'numeric',
  });
}

function shortDate(value: string) {
  return new Date(value).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    timeZone: 'Asia/Kolkata',
  });
}

function toIndiaDayKey(value: string | Date) {
  return new Intl.DateTimeFormat('en-CA', {
    day: '2-digit',
    month: '2-digit',
    timeZone: 'Asia/Kolkata',
    year: 'numeric',
  }).format(new Date(value));
}

function getStatusTone(status: string) {
  switch (status) {
    case 'pending':
      return 'bg-orange-100 text-orange-700';
    case 'pending_payment':
      return 'bg-yellow-100 text-yellow-700';
    case 'manual_review_required':
      return 'bg-amber-100 text-amber-700';
    case 'shipped':
      return 'bg-indigo-100 text-indigo-700';
    case 'delivered':
      return 'bg-emerald-100 text-emerald-700';
    case 'cancelled':
      return 'bg-rose-100 text-rose-700';
    case 'failed':
      return 'bg-slate-200 text-slate-700';
    default:
      return 'bg-slate-100 text-slate-700';
  }
}

function getPaymentTone(paymentStatus: string) {
  return paymentStatus === 'paid' ? 'bg-emerald-100 text-emerald-700' : 'bg-yellow-100 text-yellow-700';
}

function getOrderNotice(order: OrderRecord) {
  if (order.order_status === 'manual_review_required') {
    return 'Payment was received, but stock needs manual review before fulfilment.';
  }

  if (order.order_status === 'pending_payment') {
    return 'Waiting for the temporary online-payment flow to resolve or for the customer to choose COD.';
  }

  if (order.order_status === 'failed') {
    return 'This order did not complete successfully.';
  }

  return null;
}

function OrdersPanel({
  children,
  className = '',
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <section
      className={`luxury-panel admin-surface animate-fade-in-up rounded-[30px] p-6 md:p-8 ${className}`}
      style={{ animationDelay: `${delay}s` }}
    >
      {children}
    </section>
  );
}

function StatCard({
  icon,
  label,
  note,
  tone,
  value,
}: {
  icon: ReactNode;
  label: string;
  note: string;
  tone: string;
  value: string;
}) {
  return (
    <div className="luxury-panel admin-hover-card admin-surface rounded-[28px] p-5 md:p-6">
      <div className="flex items-start justify-between gap-4">
        <div className={`flex h-12 w-12 items-center justify-center rounded-2xl border border-black/5 ${tone}`}>
          {icon}
        </div>
        <span className="admin-chip rounded-full border border-brand-text/8 bg-white/65 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.28em] text-brand-text/42">
          Live
        </span>
      </div>

      <p className="mt-6 text-3xl font-semibold tracking-[-0.03em] text-brand-primary">{value}</p>
      <p className="mt-2 text-[11px] font-semibold uppercase tracking-[0.3em] text-brand-text/40">{label}</p>
      <p className="mt-3 text-sm leading-6 text-brand-text/62">{note}</p>
    </div>
  );
}

export default function OrderManagement() {
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'attention' | 'pending' | 'shipped' | 'delivered' | 'cancelled' | 'failed'>('all');

  useEffect(() => {
    void fetchOrders();
  }, []);

  async function fetchOrders() {
    setIsLoading(true);

    try {
      const response = await fetch('/api/orders');

      if (!response.ok) {
        throw new Error('Failed to fetch orders.');
      }

      const data = await response.json();
      setOrders(data.orders || []);
    } catch (error) {
      console.error('[admin/orders] failed to fetch:', error);
    } finally {
      setIsLoading(false);
    }
  }

  async function updateStatus(orderId: string, status: string) {
    setUpdatingId(orderId);

    try {
      const response = await fetch('/api/orders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, status }),
      });

      if (!response.ok) {
        throw new Error('Update failed');
      }

      await fetchOrders();
    } catch (error) {
      console.error('[admin/orders] status update failed:', error);
      alert('Failed to update order status. Please try again.');
    } finally {
      setUpdatingId(null);
    }
  }

  const totalRevenue = useMemo(() => {
    return orders.reduce((sum, order) => {
      if (!REVENUE_STATUSES.has(order.order_status)) {
        return sum;
      }

      return sum + Number(order.total_amount || 0);
    }, 0);
  }, [orders]);

  const attentionCount = useMemo(() => {
    return orders.filter((order) => ATTENTION_STATUSES.has(order.order_status)).length;
  }, [orders]);

  const deliveredCount = useMemo(() => {
    return orders.filter((order) => order.order_status === 'delivered').length;
  }, [orders]);

  const ordersToday = useMemo(() => {
    const today = toIndiaDayKey(new Date());
    return orders.filter((order) => toIndiaDayKey(order.created_at) === today).length;
  }, [orders]);

  const filteredOrders = useMemo(() => {
    const search = searchQuery.trim().toLowerCase();

    return orders.filter((order) => {
      const matchesSearch =
        !search ||
        order.customer_name?.toLowerCase().includes(search) ||
        order.customer_phone?.includes(search) ||
        order.id.toLowerCase().includes(search);

      let matchesStatus = true;

      if (statusFilter === 'attention') {
        matchesStatus = ATTENTION_STATUSES.has(order.order_status);
      } else if (statusFilter !== 'all') {
        matchesStatus = order.order_status === statusFilter;
      }

      return matchesSearch && matchesStatus;
    });
  }, [orders, searchQuery, statusFilter]);

  const orderVolumeData = useMemo<TrendPoint[]>(() => {
    const days = Array.from({ length: 7 }, (_, index) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - index));
      return toIndiaDayKey(date);
    });
    const totals = new Map(days.map((day) => [day, 0]));

    orders.forEach((order) => {
      const day = toIndiaDayKey(order.created_at);
      if (totals.has(day)) {
        totals.set(day, (totals.get(day) ?? 0) + 1);
      }
    });

    return days.map((day) => ({
      helper: 'Orders created',
      label: shortDate(day),
      value: totals.get(day) ?? 0,
    }));
  }, [orders]);

  const filterChips = [
    { label: 'All orders', value: 'all' },
    { label: 'Needs attention', value: 'attention' },
    { label: 'Pending', value: 'pending' },
    { label: 'Shipped', value: 'shipped' },
    { label: 'Delivered', value: 'delivered' },
    { label: 'Cancelled', value: 'cancelled' },
    { label: 'Failed', value: 'failed' },
  ] as const;

  return (
    <AdminLayout>
      <div className="space-y-6 md:space-y-8">
        <OrdersPanel delay={0.04}>
          <div className="grid gap-6 xl:grid-cols-[1.45fr_0.95fr]">
            <div>
              <p className="section-kicker">Order Desk</p>
              <h2 className="mt-4 max-w-3xl text-3xl text-brand-primary md:text-[3rem] md:leading-[1.02]">
                A fulfilment view that is easier to read, easier to triage, and calmer during busy days.
              </h2>
              <p className="mt-4 max-w-2xl text-base leading-7 text-brand-text/62">
                Review what came in today, what needs action, and what is already moving through the pipeline
                without forcing yourself through a crowded table first.
              </p>
            </div>

            <div className="rounded-[28px] border border-brand-text/8 bg-[linear-gradient(135deg,rgba(56,41,28,0.96)_0%,rgba(92,69,41,0.94)_100%)] p-6 text-white">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-brand-accent">
                  <AlertTriangle size={20} />
                </div>
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.34em] text-white/45">Queue summary</p>
                  <h3 className="mt-2 text-2xl">What needs eyes first</h3>
                </div>
              </div>

              <div className="mt-6 space-y-3">
                {[
                  {
                    title: 'Attention queue',
                    text: attentionCount > 0 ? `${attentionCount} orders still need payment, review, or fulfilment movement.` : 'Nothing is waiting for immediate intervention right now.',
                  },
                  {
                    title: 'Delivered so far',
                    text: `${deliveredCount} completed deliveries are already recorded in the system.`,
                  },
                  {
                    title: 'Orders today',
                    text: `${ordersToday} orders have been placed since midnight India time.`,
                  },
                ].map((item) => (
                  <div key={item.title} className="admin-hover-card rounded-[22px] border border-white/10 bg-white/6 px-4 py-4">
                    <p className="text-sm font-semibold">{item.title}</p>
                    <p className="mt-2 text-sm leading-6 text-white/72">{item.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </OrdersPanel>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <StatCard
            icon={<ShoppingBag size={20} className="text-sky-700" />}
            label="Orders Today"
            note="New order activity since midnight India time."
            tone="bg-sky-50"
            value={isLoading ? '...' : String(ordersToday)}
          />
          <StatCard
            icon={<IndianRupee size={20} className="text-emerald-700" />}
            label="Booked Revenue"
            note="Revenue tied to valid order states and locked order snapshots."
            tone="bg-emerald-50"
            value={isLoading ? '...' : formatCurrency(totalRevenue)}
          />
          <StatCard
            icon={<Clock3 size={20} className="text-amber-700" />}
            label="Needs Attention"
            note="Orders waiting on payment, manual review, or next movement."
            tone="bg-amber-50"
            value={isLoading ? '...' : String(attentionCount)}
          />
          <StatCard
            icon={<Truck size={20} className="text-violet-700" />}
            label="Delivered"
            note="Orders already completed and closed out in the system."
            tone="bg-violet-50"
            value={isLoading ? '...' : String(deliveredCount)}
          />
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.2fr_0.95fr]">
          <OrdersPanel delay={0.1}>
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="section-kicker">Order Volume</p>
                <h3 className="mt-2 text-2xl text-brand-primary">Hover each day to inspect activity</h3>
              </div>
              <span className="admin-chip rounded-full border border-brand-text/8 bg-white/75 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.26em] text-brand-text/44">
                Last 7 days
              </span>
            </div>

            {isLoading ? (
              <div className="shimmer h-[22rem] rounded-[26px]" />
            ) : (
              <HoverTrendChart
                accentClassName="fill-[hsl(42,55%,62%)]"
                data={orderVolumeData}
                emptyLabel="Orders will appear here once storefront activity begins."
                valueFormatter={(value) => `${value} order${value === 1 ? '' : 's'}`}
              />
            )}
          </OrdersPanel>

          <OrdersPanel delay={0.14}>
            <div className="mb-6">
              <p className="section-kicker">How to read the queue</p>
              <h3 className="mt-2 text-2xl text-brand-primary">Simple operational cues</h3>
            </div>

            <div className="space-y-3">
              {[
                {
                  label: 'Pending',
                  note: 'Order is valid and ready for the next fulfilment action.',
                  tone: 'bg-orange-500',
                },
                {
                  label: 'Awaiting Payment',
                  note: 'Customer selected the temporary online flow and payment is not finished yet.',
                  tone: 'bg-yellow-500',
                },
                {
                  label: 'Needs Review',
                  note: 'Payment was received but the order still needs a manual stock or fulfilment check.',
                  tone: 'bg-amber-600',
                },
                {
                  label: 'Delivered',
                  note: 'Order has been completed and no further action is required.',
                  tone: 'bg-emerald-500',
                },
              ].map((item) => (
                <div key={item.label} className="admin-hover-card rounded-[24px] border border-brand-text/8 bg-white/72 px-5 py-5">
                  <div className="flex items-center gap-3">
                    <span className={`h-3 w-3 rounded-full ${item.tone}`} />
                    <p className="text-sm font-semibold text-brand-primary">{item.label}</p>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-brand-text/62">{item.note}</p>
                </div>
              ))}

              <div className="admin-hover-card rounded-[24px] border border-brand-text/8 bg-brand-muted/35 px-5 py-5">
                <div className="flex items-center gap-3">
                  <CheckCircle2 size={18} className="text-emerald-600" />
                  <p className="text-sm font-semibold text-brand-primary">Snapshot pricing stays locked</p>
                </div>
                <p className="mt-3 text-sm leading-6 text-brand-text/62">
                  Every order retains the gold rate and final price captured at the moment the order was placed.
                </p>
              </div>
            </div>
          </OrdersPanel>
        </div>

        <OrdersPanel delay={0.18} className="overflow-hidden p-0">
          <div className="border-b border-brand-text/8 px-6 py-5 md:px-8">
            <div className="grid gap-4 lg:grid-cols-[1fr_auto]">
              <div className="relative">
                <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-text/30" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder="Search by customer, phone, or order id..."
                  className="h-14 w-full rounded-full border border-brand-text/8 bg-white/80 pl-11 pr-4 text-sm outline-none transition focus:border-brand-accent/40"
                />
              </div>

              <div className="flex flex-wrap gap-2">
                {filterChips.map((chip) => {
                  const isActive = statusFilter === chip.value;
                  return (
                    <button
                      key={chip.value}
                      type="button"
                      onClick={() => setStatusFilter(chip.value)}
                      className={`admin-chip rounded-full px-4 py-3 text-[10px] font-semibold uppercase tracking-[0.24em] transition ${
                        isActive
                          ? 'bg-brand-primary text-white shadow-[0_12px_28px_rgba(31,24,17,0.16)]'
                          : 'border border-brand-text/10 bg-white/72 text-brand-text/48 hover:border-brand-accent/30 hover:text-brand-accent'
                      }`}
                    >
                      {chip.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="px-6 py-6 md:px-8">
            {isLoading ? (
              <div className="space-y-4">
                {Array.from({ length: 4 }).map((_, index) => (
                  <div key={index} className="shimmer h-48 rounded-[28px]" />
                ))}
              </div>
            ) : filteredOrders.length === 0 ? (
              <div className="rounded-[28px] border border-dashed border-brand-text/10 bg-white/40 px-6 py-20 text-center">
                <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-brand-text/38">
                  No orders match this view
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredOrders.map((order, index) => {
                  const isExpanded = expandedId === order.id;
                  const nextActions = STATUS_TRANSITIONS[order.order_status] || [];
                  const notice = getOrderNotice(order);

                  return (
                    <article
                      key={order.id}
                      className="admin-hover-card animate-fade-in-up rounded-[28px] border border-brand-text/8 bg-white/78 px-5 py-5 shadow-[0_18px_38px_rgba(31,24,17,0.06)]"
                      style={{ animationDelay: `${index * 0.04}s` }}
                    >
                      <div className="grid gap-5 xl:grid-cols-[1.15fr_0.9fr_0.9fr]">
                        <div>
                          <div className="flex flex-wrap items-center gap-3">
                            <span className="admin-chip rounded-full border border-brand-text/8 bg-brand-muted/35 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-brand-text/48">
                              #{order.id.slice(0, 8)}
                            </span>
                            <div className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-brand-text/40">
                              <Calendar size={13} />
                              {formatDate(order.created_at)}
                            </div>
                          </div>

                          <h4 className="mt-4 text-xl font-semibold text-brand-primary">{order.customer_name || 'Guest order'}</h4>
                          <div className="mt-3 flex flex-wrap gap-3 text-sm text-brand-text/60">
                            <span>{order.customer_phone}</span>
                            <span className="inline-flex items-center gap-1">
                              <MapPin size={13} />
                              {order.address?.city || 'City not shared'}
                            </span>
                          </div>

                          {notice && (
                            <div className="mt-4 rounded-[20px] border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                              {notice}
                            </div>
                          )}
                        </div>

                        <div className="grid gap-3 text-sm">
                          <div className="rounded-[22px] border border-brand-text/8 bg-brand-background/80 px-4 py-4">
                            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-brand-text/34">Order value</p>
                            <p className="mt-2 text-lg font-semibold text-brand-primary">{formatCurrency(order.total_amount)}</p>
                          </div>

                          <div className="rounded-[22px] border border-brand-text/8 bg-brand-background/80 px-4 py-4">
                            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-brand-text/34">Ship to</p>
                            <p className="mt-2 text-sm leading-6 text-brand-text/62">
                              {order.address?.street || 'Address not shared'}
                              {order.address?.pincode ? `, ${order.address.pincode}` : ''}
                            </p>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <div className="flex flex-wrap gap-2">
                            <span className={`admin-chip rounded-full px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.22em] ${getPaymentTone(order.payment_status)}`}>
                              {order.payment_status || 'pending'}
                            </span>
                            <span className={`admin-chip rounded-full px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.22em] ${getStatusTone(order.order_status)}`}>
                              {formatStatusLabel(order.order_status)}
                            </span>
                          </div>

                          <div className="flex flex-wrap gap-2">
                            {nextActions.map((nextStatus) => (
                              <button
                                key={nextStatus}
                                type="button"
                                onClick={() => updateStatus(order.id, nextStatus)}
                                disabled={updatingId === order.id}
                                className="admin-chip rounded-full border border-brand-text/10 bg-white/72 px-4 py-3 text-[10px] font-semibold uppercase tracking-[0.24em] text-brand-text/48 transition hover:border-brand-accent/30 hover:text-brand-accent disabled:cursor-not-allowed disabled:opacity-50"
                              >
                                {updatingId === order.id ? 'Updating' : `Mark ${formatStatusLabel(nextStatus)}`}
                              </button>
                            ))}

                            <button
                              type="button"
                              onClick={() => setExpandedId(isExpanded ? null : order.id)}
                              className="admin-chip inline-flex items-center gap-2 rounded-full border border-brand-text/10 px-4 py-3 text-[10px] font-semibold uppercase tracking-[0.24em] text-brand-text/48 transition hover:border-brand-accent/30 hover:text-brand-accent"
                            >
                              {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                              {isExpanded ? 'Hide items' : 'View items'}
                            </button>
                          </div>
                        </div>
                      </div>

                      {isExpanded && (
                        <div className="mt-5 rounded-[24px] border border-brand-text/8 bg-brand-muted/28 px-4 py-4">
                          <p className="text-[10px] font-semibold uppercase tracking-[0.26em] text-brand-text/40">Items in this order</p>
                          <div className="mt-4 space-y-3">
                            {Array.isArray(order.items) && order.items.length > 0 ? (
                              order.items.map((item, itemIndex) => (
                                <div
                                  key={`${order.id}-${itemIndex}`}
                                  className="admin-hover-card flex flex-wrap items-center justify-between gap-3 rounded-[20px] border border-brand-text/8 bg-white/72 px-4 py-4"
                                >
                                  <div>
                                    <p className="text-sm font-semibold text-brand-primary">{item.name}</p>
                                    <p className="mt-1 text-[11px] uppercase tracking-[0.2em] text-brand-text/40">
                                      Qty {item.quantity}
                                    </p>
                                  </div>
                                  <p className="text-sm font-semibold text-brand-primary">
                                    {formatCurrency(item.priceAtOrder)} each
                                  </p>
                                </div>
                              ))
                            ) : (
                              <p className="text-sm text-brand-text/50">No item details available.</p>
                            )}
                          </div>
                        </div>
                      )}
                    </article>
                  );
                })}
              </div>
            )}
          </div>
        </OrdersPanel>
      </div>
    </AdminLayout>
  );
}
