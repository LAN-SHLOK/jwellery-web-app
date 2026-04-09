'use client';

import { type ReactNode, useEffect, useMemo, useState } from 'react';
import {
  AlertTriangle,
  CalendarDays,
  RefreshCcw,
  Save,
  ShieldCheck,
  Sparkles,
  TrendingDown,
  TrendingUp,
} from 'lucide-react';

import AdminLayout from '@/components/admin/AdminLayout';
import HoverTrendChart, { type TrendPoint } from '@/components/admin/HoverTrendChart';
import { BRAND_CONFIG } from '@/config/brand';
import {
  formatIndiaLongDate,
  formatIndiaShortDate,
  getLatestEntryPerIndiaDay,
} from '@/lib/india-date';

type GoldRatePoint = {
  created_at: string;
  rate_per_gram: number;
};

function formatCurrency(value: number) {
  return `${BRAND_CONFIG.currency.symbol}${value.toLocaleString(BRAND_CONFIG.currency.locale)}`;
}

function GoldPanel({
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

export default function GoldRateManagement() {
  const [currentRate, setCurrentRate] = useState(0);
  const [newRate, setNewRate] = useState('');
  const [rateHistory, setRateHistory] = useState<GoldRatePoint[]>([]);
  const [fomoBadge, setFomoBadge] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    async function loadRateDesk() {
      setIsLoading(true);

      try {
        const [latestResponse, historyResponse] = await Promise.all([
          fetch('/api/gold-rate'),
          fetch('/api/gold-rate/history'),
        ]);

        const latestData = await latestResponse.json();
        const historyData = historyResponse.ok ? await historyResponse.json() : { history: [] };
        const rate = Number(latestData.rate || 0);

        setCurrentRate(rate);
        setNewRate(rate > 0 ? String(rate) : '');
        setFomoBadge(Boolean(latestData.fomoBadge));
        setRateHistory(historyData.history || []);
      } catch (error) {
        console.error('[Admin/GoldRate] Failed to fetch gold rate data:', error);
      } finally {
        setIsLoading(false);
      }
    }

    void loadRateDesk();
  }, []);

  const sortedHistory = useMemo(() => {
    return [...rateHistory].sort(
      (left, right) => new Date(right.created_at).getTime() - new Date(left.created_at).getTime(),
    );
  }, [rateHistory]);

  const rateDelta = sortedHistory.length > 1 ? currentRate - Number(sortedHistory[1].rate_per_gram || 0) : 0;
  const latestEntry = sortedHistory[0];
  const historyData = useMemo<TrendPoint[]>(() => {
    return getLatestEntryPerIndiaDay(sortedHistory, 7).map((entry) => ({
        helper: formatIndiaLongDate(entry.created_at),
        label: formatIndiaShortDate(entry.created_at),
        value: Number(entry.rate_per_gram || 0),
    }));
  }, [sortedHistory]);

  const historyDirection = rateDelta === 0 ? 'Steady' : rateDelta > 0 ? 'Up today' : 'Cooling';
  const historyDirectionNote =
    rateDelta === 0
      ? 'No movement versus the previous logged rate.'
      : `${Math.abs(rateDelta).toLocaleString('en-IN')} points ${rateDelta > 0 ? 'higher' : 'lower'} than the previous update.`;

  async function handleUpdate(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsUpdating(true);
    setMessage(null);

    const parsedRate = Number.parseFloat(newRate);

    if (!Number.isFinite(parsedRate) || parsedRate <= 0) {
      setMessage({ text: 'Please enter a valid gold rate before saving.', type: 'error' });
      setIsUpdating(false);
      return;
    }

    try {
      const response = await fetch('/api/gold-rate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ratePerGram: parsedRate }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update gold rate.');
      }

      const latestResponse = await fetch('/api/gold-rate');
      const latestData = await latestResponse.json();
      const historyResponse = await fetch('/api/gold-rate/history');
      const historyDataResponse = historyResponse.ok ? await historyResponse.json() : { history: [] };

      setCurrentRate(Number(latestData.rate || parsedRate));
      setNewRate(String(Number(latestData.rate || parsedRate)));
      setFomoBadge(Boolean(latestData.fomoBadge));
      setRateHistory(historyDataResponse.history || []);
      setMessage({
        text: `Gold rate updated to ${formatCurrency(parsedRate)} per gram. Public pricing is now refreshed.`,
        type: 'success',
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update gold rate.';
      setMessage({ text: errorMessage, type: 'error' });
    } finally {
      setIsUpdating(false);
    }
  }

  return (
    <AdminLayout>
      <div className="space-y-6 md:space-y-8">
        <GoldPanel delay={0.04}>
          <div className="grid gap-6 xl:grid-cols-[1.45fr_0.95fr]">
            <div>
              <p className="section-kicker">Rate Desk</p>
              <h2 className="mt-4 max-w-3xl text-3xl text-brand-primary md:text-[3rem] md:leading-[1.02]">
                A quieter market screen for the one number that moves every price in the store.
              </h2>
              <p className="mt-4 max-w-2xl text-base leading-7 text-brand-text/62">
                Update the live 22K rate, review the last few entries, and see instantly whether the
                storefront is signalling a better-than-average buying window.
              </p>

              <div className="mt-8 grid gap-4 md:grid-cols-3">
                <div className="admin-hover-card rounded-[26px] border border-brand-text/8 bg-white/75 px-5 py-5">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-brand-text/38">Current rate</p>
                  <p className="mt-3 text-3xl font-semibold tracking-[-0.03em] text-brand-primary">
                    {isLoading || currentRate <= 0 ? '...' : formatCurrency(currentRate)}
                  </p>
                  <p className="mt-2 text-sm text-brand-text/58">Per gram for 22K pricing</p>
                </div>

                <div className="admin-hover-card rounded-[26px] border border-brand-text/8 bg-white/75 px-5 py-5">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-brand-text/38">Last update</p>
                  <p className="mt-3 text-lg font-semibold text-brand-primary">{formatIndiaLongDate(latestEntry?.created_at)}</p>
                  <p className="mt-2 text-sm text-brand-text/58">Logged in India Standard Time</p>
                </div>

                <div className="admin-hover-card rounded-[26px] border border-brand-text/8 bg-white/75 px-5 py-5">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-brand-text/38">Badge state</p>
                  <p className="mt-3 text-lg font-semibold text-brand-primary">{fomoBadge ? 'FOMO active' : 'No badge today'}</p>
                  <p className="mt-2 text-sm text-brand-text/58">Based on the 7-day comparison rule</p>
                </div>
              </div>
            </div>

            <div className="rounded-[28px] border border-brand-text/8 bg-[linear-gradient(135deg,rgba(56,41,28,0.96)_0%,rgba(92,69,41,0.94)_100%)] p-6 text-white">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-brand-accent">
                  <Sparkles size={20} />
                </div>
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.34em] text-white/45">Market notes</p>
                  <h3 className="mt-2 text-2xl">What this update changes</h3>
                </div>
              </div>

              <div className="mt-6 space-y-3">
                {[
                  {
                    title: 'Live recalculation',
                    text: 'Every public product price refreshes against the latest saved rate.',
                  },
                  {
                    title: 'Order integrity',
                    text: 'Placed orders keep their original snapshot and do not shift with new rates.',
                  },
                  {
                    title: 'FOMO indicator',
                    text: fomoBadge
                      ? 'Today is below the 7-day average, so the store can surface the buying-window badge.'
                      : 'Today is not below the recent average, so the badge stays hidden.',
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
        </GoldPanel>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <StatCard
            icon={<TrendingUp size={20} className="text-emerald-700" />}
            label="Active Rate"
            note="The amount used for storefront calculations right now."
            tone="bg-emerald-50"
            value={isLoading || currentRate <= 0 ? '...' : formatCurrency(currentRate)}
          />
          <StatCard
            icon={rateDelta >= 0 ? <TrendingUp size={20} className="text-amber-700" /> : <TrendingDown size={20} className="text-sky-700" />}
            label={historyDirection}
            note={historyDirectionNote}
            tone={rateDelta >= 0 ? 'bg-amber-50' : 'bg-sky-50'}
            value={isLoading ? '...' : rateDelta === 0 ? 'Stable' : `${rateDelta > 0 ? '+' : '-'}${formatCurrency(Math.abs(rateDelta))}`}
          />
          <StatCard
            icon={<CalendarDays size={20} className="text-violet-700" />}
            label="History Entries"
            note="Saved rate updates available for trend inspection."
            tone="bg-violet-50"
            value={isLoading ? '...' : `${sortedHistory.length}`}
          />
          <StatCard
            icon={<ShieldCheck size={20} className="text-brand-primary" />}
            label="Store Signal"
            note="Whether the storefront is currently showing the incentive badge."
            tone="bg-[rgba(214,190,118,0.18)]"
            value={isLoading ? '...' : fomoBadge ? 'Badge on' : 'Badge off'}
          />
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.35fr_0.95fr]">
          <GoldPanel delay={0.1}>
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="section-kicker">Rate Movement</p>
                <h3 className="mt-2 text-2xl text-brand-primary">Hover to inspect each day&apos;s latest update</h3>
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
                data={historyData}
                emptyLabel="Add more market updates to unlock the trend view."
                valueFormatter={formatCurrency}
              />
            )}
          </GoldPanel>

          <GoldPanel delay={0.14}>
            <p className="section-kicker">Update the desk</p>
            <h3 className="mt-3 text-2xl text-brand-primary">Set today&apos;s 22K rate</h3>
            <p className="mt-3 max-w-xl text-sm leading-6 text-brand-text/60">
              Enter the current per-gram value once it is confirmed. This is the only pricing input your
              catalogue needs for a daily refresh.
            </p>

            <form className="mt-8 space-y-6" onSubmit={handleUpdate}>
              <div className="admin-surface rounded-[28px] border border-brand-text/8 bg-white/78 p-5">
                <label className="text-[10px] font-semibold uppercase tracking-[0.3em] text-brand-text/40">
                  Price per gram ({BRAND_CONFIG.currency.code})
                </label>
                <div className="relative mt-4">
                  <span className="absolute left-5 top-1/2 -translate-y-1/2 text-2xl font-serif text-brand-text/35">
                    {BRAND_CONFIG.currency.symbol}
                  </span>
                  <input
                    type="number"
                    step="0.01"
                    min="1000"
                    max="50000"
                    value={newRate}
                    onChange={(event) => setNewRate(event.target.value)}
                    className="h-20 w-full rounded-[24px] border border-brand-text/8 bg-brand-background pl-12 pr-6 text-3xl font-serif outline-none transition focus:border-brand-accent/50 focus:ring-0"
                    placeholder="6500.00"
                    required
                  />
                </div>
              </div>

              <button
                disabled={isUpdating}
                type="submit"
                className="button-primary admin-chip w-full justify-center rounded-full py-4 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isUpdating ? <RefreshCcw className="animate-spin" size={16} /> : <Save size={16} />}
                Save market rate
              </button>
            </form>

            {message && (
              <div
                className={`mt-6 rounded-[24px] border px-5 py-4 ${
                  message.type === 'success'
                    ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                    : 'border-rose-200 bg-rose-50 text-rose-700'
                }`}
              >
                <div className="flex items-start gap-3">
                  {message.type === 'success' ? (
                    <TrendingUp size={16} className="mt-0.5 shrink-0" />
                  ) : (
                    <AlertTriangle size={16} className="mt-0.5 shrink-0" />
                  )}
                  <p className="text-sm leading-6">{message.text}</p>
                </div>
              </div>
            )}

            <div className="mt-6 rounded-[26px] border border-amber-200/70 bg-amber-50/80 px-5 py-5">
              <div className="flex items-start gap-3">
                <AlertTriangle size={16} className="mt-0.5 shrink-0 text-amber-700" />
                <p className="text-sm leading-6 text-amber-800">
                  Updating the rate recalculates all public prices immediately. Existing orders stay locked to
                  the price and gold rate captured at the time they were placed.
                </p>
              </div>
            </div>
          </GoldPanel>
        </div>

        <GoldPanel delay={0.18}>
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="section-kicker">Recent History</p>
              <h3 className="mt-2 text-2xl text-brand-primary">Latest entries in order</h3>
            </div>
            <span className="admin-chip rounded-full border border-brand-text/8 bg-white/75 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.26em] text-brand-text/44">
              {sortedHistory.length} total entries
            </span>
          </div>

          {isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="shimmer h-20 rounded-[24px]" />
              ))}
            </div>
          ) : sortedHistory.length === 0 ? (
            <div className="rounded-[26px] border border-dashed border-brand-text/10 bg-white/40 px-6 py-16 text-center">
              <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-brand-text/38">
                No rate history yet
              </p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {sortedHistory.slice(0, 8).map((entry, index) => (
                <div key={`${entry.created_at}-${index}`} className="admin-hover-card rounded-[24px] border border-brand-text/8 bg-white/72 px-5 py-5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-[0.26em] text-brand-text/38">
                        Entry {String(index + 1).padStart(2, '0')}
                      </p>
                      <p className="mt-2 text-xl font-semibold text-brand-primary">
                        {formatCurrency(Number(entry.rate_per_gram || 0))}
                      </p>
                    </div>
                    <span className="admin-chip rounded-full border border-brand-text/8 bg-brand-muted/45 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-brand-text/44">
                      22K
                    </span>
                  </div>
                  <p className="mt-4 text-sm text-brand-text/58">{formatIndiaLongDate(entry.created_at)}</p>
                </div>
              ))}
            </div>
          )}
        </GoldPanel>
      </div>
    </AdminLayout>
  );
}
