'use client';

import { type ReactNode, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  Clock3,
  Gem,
  IndianRupee,
  Package,
  ShoppingBag,
  Sparkles,
  TrendingUp,
} from 'lucide-react';

import AdminLayout from '@/components/admin/AdminLayout';
import HoverTrendChart, { type TrendPoint } from '@/components/admin/HoverTrendChart';
import { BRAND_CONFIG } from '@/config/brand';
import {
  formatIndiaLongDate,
  formatIndiaShortDate,
  getLatestEntryPerIndiaDay,
  toIndiaDayKey,
} from '@/lib/india-date';

const REVENUE_STATUSES = new Set(['pending', 'shipped', 'delivered']);
const ATTENTION_STATUSES = new Set(['pending', 'pending_payment', 'manual_review_required']);

type OrderRecord = {
  id: string;
  address?: { city?: string };
  created_at: string;
  customer_name: string;
  items?: Array<{ name: string; priceAtOrder?: number; quantity?: number }>;
  order_status: string;
  total_amount: number | string;
};

type RatePoint = {
  created_at: string;
  rate_per_gram: number | string;
};

function formatCurrency(value: number) {
  return `${BRAND_CONFIG.currency.symbol}${value.toLocaleString(BRAND_CONFIG.currency.locale)}`;
}

function formatStatus(status: string) {
  if (status === 'pending_payment') {
    return 'Awaiting Payment';
  }

  if (status === 'manual_review_required') {
    return 'Needs Review';
  }

  return status.replace(/_/g, ' ');
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

function DashboardPanel({
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
  value: string | number;
}) {
  return (
    <div className="luxury-panel admin-hover-card admin-surface rounded-[26px] p-6">
      <div className="flex items-center gap-3">
        <div className={`flex h-11 w-11 items-center justify-center rounded-xl border border-black/5 ${tone}`}>
          {icon}
        </div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-brand-text/40">
          {label}
        </p>
      </div>

      <p className="mt-5 text-3xl font-semibold tracking-[-0.02em] text-brand-primary">
        {value}
      </p>
    </div>
  );
}

function ActionTile({
  href,
  label,
  note,
}: {
  href: string;
  label: string;
  note: string;
}) {
  return (
    <Link
      href={href}
      className="group admin-hover-card rounded-[24px] border border-brand-text/10 bg-white/72 px-4 py-4 transition duration-300 hover:-translate-y-0.5 hover:border-brand-accent/35 hover:shadow-[0_16px_34px_rgba(36,27,19,0.08)]"
    >
      <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-brand-text/42">
        {label}
      </p>
      <p className="mt-2 text-sm leading-6 text-brand-text/68">
        {note}
      </p>
      <span className="mt-4 inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.24em] text-brand-accent">
        Open
        <ArrowRight size={13} className="transition-transform duration-300 group-hover:translate-x-1" />
      </span>
    </Link>
  );
}

export default function AdminDashboard() {
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [rateHistory, setRateHistory] = useState<RatePoint[]>([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadDashboard() {
      try {
        const [ordersResponse, historyResponse, productsResponse] = await Promise.all([
          fetch('/api/orders'),
          fetch('/api/gold-rate/history'),
          fetch('/api/admin/products/list'),
        ]);

        const ordersData = await ordersResponse.json();
        const historyData = await historyResponse.json();
        const productsData = await productsResponse.json();

        setOrders(ordersData.orders || []);
        setRateHistory(historyData.history || []);
        setTotalProducts((productsData.products || []).length);
      } catch (error) {
        console.error('[dashboard] failed to load:', error);
      } finally {
        setIsLoading(false);
      }
    }

    void loadDashboard();
  }, []);

  const totalRevenue = useMemo(() => {
    return orders.reduce((sum, order) => {
      if (!REVENUE_STATUSES.has(order.order_status)) {
        return sum;
      }

      return sum + Number(order.total_amount || 0);
    }, 0);
  }, [orders]);

  const deliveredOrders = useMemo(() => {
    return orders.filter((order) => order.order_status === 'delivered').length;
  }, [orders]);

  const attentionCount = useMemo(() => {
    return orders.filter((order) => ATTENTION_STATUSES.has(order.order_status)).length;
  }, [orders]);

  const ordersToday = useMemo(() => {
    const todayKey = toIndiaDayKey(new Date());
    return orders.filter((order) => toIndiaDayKey(order.created_at) === todayKey).length;
  }, [orders]);

  const latestRate = rateHistory.length ? Number(rateHistory[0].rate_per_gram || 0) : 0;
  const rateUpdatedToday = rateHistory.length > 0 && toIndiaDayKey(rateHistory[0].created_at) === toIndiaDayKey(new Date());

  const revenueData = useMemo<TrendPoint[]>(() => {
    const days = Array.from({ length: 7 }, (_, index) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - index));
      return toIndiaDayKey(date);
    });
    const totals = new Map(days.map((day) => [day, 0]));

    orders.forEach((order) => {
      if (!REVENUE_STATUSES.has(order.order_status)) {
        return;
      }

      const key = toIndiaDayKey(order.created_at);
      if (totals.has(key)) {
        totals.set(key, (totals.get(key) ?? 0) + Number(order.total_amount || 0));
      }
    });

    return days.map((day) => ({
      helper: 'Revenue booked',
      label: formatIndiaShortDate(day),
      value: Math.round(totals.get(day) ?? 0),
    }));
  }, [orders]);

  const rateData = useMemo<TrendPoint[]>(() => {
    return getLatestEntryPerIndiaDay(rateHistory, 7).map((point) => ({
        helper: formatIndiaLongDate(point.created_at),
        label: formatIndiaShortDate(point.created_at),
        value: Number(point.rate_per_gram || 0),
    }));
  }, [rateHistory]);

  const topProducts = useMemo(() => {
    const productMap = new Map<string, { count: number; name: string; revenue: number }>();

    orders.forEach((order) => {
      if (!REVENUE_STATUSES.has(order.order_status) || !Array.isArray(order.items)) {
        return;
      }

      order.items.forEach((item) => {
        const name = item.name || 'Unnamed piece';
        const current = productMap.get(name) ?? { count: 0, name, revenue: 0 };
        const quantity = item.quantity || 1;

        current.count += quantity;
        current.revenue += Number(item.priceAtOrder || 0) * quantity;
        productMap.set(name, current);
      });
    });

    return Array.from(productMap.values()).sort((left, right) => right.count - left.count).slice(0, 4);
  }, [orders]);

  const statusSummary = useMemo(() => {
    return [
      { label: 'Pending', tone: 'bg-orange-500', value: orders.filter((order) => order.order_status === 'pending').length },
      { label: 'Awaiting Payment', tone: 'bg-yellow-500', value: orders.filter((order) => order.order_status === 'pending_payment').length },
      { label: 'Needs Review', tone: 'bg-amber-600', value: orders.filter((order) => order.order_status === 'manual_review_required').length },
      { label: 'Delivered', tone: 'bg-emerald-500', value: orders.filter((order) => order.order_status === 'delivered').length },
    ].filter((item) => item.value > 0);
  }, [orders]);

  const recentOrders = orders.slice(0, 5);
  const topProductMaxCount = Math.max(...topProducts.map((product) => product.count), 1);

  return (
    <AdminLayout>
      <div className="space-y-6 md:space-y-8">
        <DashboardPanel delay={0.04}>
          <div className="grid gap-8 xl:grid-cols-[1.5fr_0.9fr]">
            <div>
              <p className="section-kicker">Store Pulse</p>
              <h2 className="mt-5 max-w-3xl text-3xl text-brand-primary md:text-[2.5rem] md:leading-[1.1]">
                Your dashboard overview
              </h2>
              <p className="mt-5 max-w-2xl text-base leading-8 text-brand-text/62">
                Quick access to pricing, orders, and key metrics.
              </p>

              <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
                <ActionTile href="/admin/gold-rate" label="Rate Desk" note="Update gold rate" />
                <ActionTile href="/admin/orders" label="Order Desk" note="Manage orders" />
                <ActionTile href="/admin/products" label="Product Studio" note="Edit products" />
                <ActionTile href="/admin/coupons" label="Coupons" note="Create & manage coupons" />
                <ActionTile href="/admin/reviews" label="Reviews" note="Approve customer reviews" />
              </div>
            </div>

            <div className="rounded-[28px] border border-brand-accent/20 bg-gradient-to-br from-amber-50 to-orange-50/60 p-7">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-100 text-brand-primary">
                  <Gem size={20} />
                </div>
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.34em] text-brand-text/50">
                    Today
                  </p>
                  <h3 className="mt-2 text-xl text-brand-primary">Quick Status</h3>
                </div>
              </div>

              <div className="mt-6 space-y-3">
                {[
                  {
                    text: rateUpdatedToday ? 'Today’s gold rate is already updated.' : 'Today’s gold rate still needs to be entered.',
                    title: 'Gold rate',
                    tone: rateUpdatedToday ? 'bg-emerald-400' : 'bg-amber-400',
                  },
                  {
                    text: attentionCount === 0 ? 'No orders need immediate action.' : `${attentionCount} orders need attention.`,
                    title: 'Attention queue',
                    tone: attentionCount === 0 ? 'bg-emerald-400' : 'bg-amber-400',
                  },
                  {
                    text: `${ordersToday} orders came in today. ${deliveredOrders} have already been delivered overall.`,
                    title: 'Store movement',
                    tone: 'bg-brand-accent',
                  },
                ].map((item) => (
                  <div key={item.title} className="admin-hover-card rounded-[22px] border border-brand-text/10 bg-white px-4 py-4">
                    <div className="flex items-start gap-3">
                      <span className={`mt-1 h-3 w-3 rounded-full ${item.tone}`} />
                      <div>
                        <p className="text-sm font-semibold text-brand-primary">{item.title}</p>
                        <p className="mt-2 text-sm leading-6 text-brand-text/70">{item.text}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </DashboardPanel>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          <StatCard
            icon={<ShoppingBag size={18} className="text-sky-700" />}
            label="Orders Today"
            note=""
            tone="bg-sky-50"
            value={isLoading ? '...' : ordersToday}
          />
          <StatCard
            icon={<IndianRupee size={18} className="text-emerald-700" />}
            label="Revenue"
            note=""
            tone="bg-emerald-50"
            value={isLoading ? '...' : formatCurrency(totalRevenue)}
          />
          <StatCard
            icon={<Clock3 size={18} className="text-amber-700" />}
            label="Attention"
            note=""
            tone="bg-amber-50"
            value={isLoading ? '...' : attentionCount}
          />
          <StatCard
            icon={<Package size={18} className="text-violet-700" />}
            label="Products"
            note=""
            tone="bg-violet-50"
            value={isLoading ? '...' : totalProducts}
          />
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.55fr_0.95fr]">
          <DashboardPanel delay={0.1}>
            <div className="mb-7 flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="section-kicker">Revenue</p>
                <h3 className="mt-3 text-xl text-brand-primary">Last 7 days</h3>
              </div>
            </div>

            {isLoading ? (
              <div className="shimmer h-[22rem] rounded-[26px]" />
            ) : (
              <HoverTrendChart
                accentClassName="fill-[hsl(42,55%,62%)]"
                data={revenueData}
                emptyLabel="Revenue will appear here as orders come in."
                valueFormatter={formatCurrency}
              />
            )}
          </DashboardPanel>

          <DashboardPanel delay={0.14}>
            <div className="mb-7 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-700">
                <Sparkles size={16} />
              </div>
              <div>
                <p className="section-kicker">Status</p>
                <h3 className="mt-2 text-xl text-brand-primary">Order breakdown</h3>
              </div>
            </div>

            {isLoading ? (
              <div className="space-y-3">
                {Array.from({ length: 4 }).map((_, index) => (
                  <div key={index} className="shimmer h-16 rounded-[22px]" />
                ))}
              </div>
            ) : statusSummary.length === 0 ? (
              <div className="rounded-[24px] border border-dashed border-brand-text/10 bg-white/40 px-6 py-16 text-center">
                <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-brand-text/38">
                  No order activity yet
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {statusSummary.map((status) => (
                  <div key={status.label} className="admin-hover-card rounded-[24px] border border-brand-text/8 bg-white/68 px-4 py-4">
                    <div className="flex items-center gap-3">
                      <span className={`h-3 w-3 rounded-full ${status.tone}`} />
                      <span className="flex-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-brand-text/52">
                        {status.label}
                      </span>
                      <span className="text-lg font-semibold text-brand-primary">{status.value}</span>
                    </div>
                  </div>
                ))}

                <div className="admin-hover-card rounded-[24px] border border-brand-text/8 bg-brand-muted/35 px-4 py-4">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.26em] text-brand-text/40">
                    Quick jump
                  </p>
                  <div className="mt-4 grid gap-2">
                    <ActionTile href="/admin/orders" label="Orders" note="Open the fulfilment view." />
                    <ActionTile href="/admin/gold-rate" label="Gold Rate" note="Refresh the live pricing base." />
                  </div>
                </div>
              </div>
            )}
          </DashboardPanel>
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.15fr_1fr]">
          <DashboardPanel delay={0.18}>
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="section-kicker">Gold Rate Movement</p>
                <h3 className="mt-2 text-2xl text-brand-primary">Hover to inspect each update</h3>
              </div>
              <Link
                href="/admin/gold-rate"
                className="admin-chip inline-flex items-center gap-2 rounded-full border border-brand-text/10 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.26em] text-brand-text/44 transition hover:border-brand-accent/40 hover:text-brand-accent"
              >
                Update Rate
                <ArrowRight size={13} />
              </Link>
            </div>

            {isLoading ? (
              <div className="shimmer h-[20rem] rounded-[26px]" />
            ) : (
              <HoverTrendChart
                accentClassName="fill-[hsl(26,28%,15%)]"
                data={rateData}
                emptyLabel="Add gold-rate updates on different days to unlock the trend view."
                valueFormatter={formatCurrency}
              />
            )}

            {!isLoading && (
              <div className="mt-6 flex flex-wrap gap-3">
                <span className={`admin-chip rounded-full px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.26em] ${rateUpdatedToday ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                  {rateUpdatedToday ? 'Updated today' : 'Update pending'}
                </span>
                <span className="admin-chip rounded-full border border-brand-text/8 bg-white/75 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.26em] text-brand-text/44">
                  Latest {latestRate > 0 ? formatCurrency(latestRate) : 'Not set'}
                </span>
              </div>
            )}
          </DashboardPanel>

          <DashboardPanel delay={0.22}>
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="section-kicker">Top Pieces</p>
                <h3 className="mt-2 text-2xl text-brand-primary">Best sellers</h3>
              </div>
              <Link
                href="/admin/products"
                className="admin-chip inline-flex items-center gap-2 rounded-full border border-brand-text/10 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.26em] text-brand-text/44 transition hover:border-brand-accent/40 hover:text-brand-accent"
              >
                Manage Products
                <ArrowRight size={13} />
              </Link>
            </div>

            <div className="space-y-4">
              {isLoading ? (
                Array.from({ length: 4 }).map((_, index) => (
                  <div key={index} className="shimmer h-24 rounded-[24px]" />
                ))
              ) : topProducts.length === 0 ? (
                <div className="rounded-[24px] border border-dashed border-brand-text/10 bg-white/40 px-6 py-16 text-center">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-brand-text/38">
                    Sales will appear here once orders start coming in
                  </p>
                </div>
              ) : (
                topProducts.map((product) => (
                  <div key={product.name} className="admin-hover-card rounded-[24px] border border-brand-text/8 bg-white/68 px-5 py-5">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold text-brand-primary">{product.name}</p>
                        <p className="mt-1 text-[11px] uppercase tracking-[0.2em] text-brand-text/42">
                          {product.count} sold
                        </p>
                      </div>
                      <p className="text-sm font-semibold text-brand-text/70">{formatCurrency(product.revenue)}</p>
                    </div>

                    <div className="mt-4 h-2 rounded-full bg-brand-muted/75">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-brand-accent via-[#d9c389] to-brand-primary"
                        style={{ width: `${(product.count / topProductMaxCount) * 100}%` }}
                      />
                    </div>
                  </div>
                ))
              )}
            </div>
          </DashboardPanel>
        </div>

        <DashboardPanel delay={0.26} className="p-0 overflow-hidden">
          <div className="border-b border-brand-text/8 px-6 py-5 md:px-8">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="section-kicker">Recent Orders</p>
                <h3 className="mt-2 text-2xl text-brand-primary">Readable at a glance</h3>
              </div>
              <Link
                href="/admin/orders"
                className="admin-chip inline-flex items-center gap-2 rounded-full border border-brand-text/10 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.26em] text-brand-text/44 transition hover:border-brand-accent/40 hover:text-brand-accent"
              >
                Review All
                <ArrowRight size={13} />
              </Link>
            </div>
          </div>

          {isLoading ? (
            <div className="space-y-3 px-6 py-6 md:px-8">
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="shimmer h-20 rounded-[24px]" />
              ))}
            </div>
          ) : recentOrders.length === 0 ? (
            <div className="px-6 py-16 text-center md:px-8">
              <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-brand-text/38">
                No orders yet
              </p>
            </div>
          ) : (
            <div className="divide-y divide-brand-text/6">
              {recentOrders.map((order) => (
                <div
                  key={order.id}
                  className="grid gap-4 px-6 py-5 transition-all duration-300 hover:bg-white/55 hover:translate-x-1 md:grid-cols-[1.2fr_0.8fr_0.8fr_0.8fr] md:px-8"
                >
                  <div>
                    <p className="text-sm font-semibold text-brand-primary">{order.customer_name}</p>
                    <p className="mt-1 text-[11px] uppercase tracking-[0.2em] text-brand-text/42">
                      {formatIndiaLongDate(order.created_at)}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.26em] text-brand-text/34">
                      Value
                    </p>
                    <p className="mt-2 text-sm font-semibold text-brand-primary">
                      {formatCurrency(Number(order.total_amount || 0))}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.26em] text-brand-text/34">
                      Status
                    </p>
                    <span className={`mt-2 inline-flex rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] ${getStatusTone(order.order_status)}`}>
                      {formatStatus(order.order_status)}
                    </span>
                  </div>
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.26em] text-brand-text/34">
                      City
                    </p>
                    <p className="mt-2 text-sm text-brand-text/62">{order.address?.city || 'Not shared'}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </DashboardPanel>
      </div>
    </AdminLayout>
  );
}
