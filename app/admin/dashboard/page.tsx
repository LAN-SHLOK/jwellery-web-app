'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  Calendar,
  IndianRupee,
  Package,
  ShoppingBag,
  TrendingUp,
  TrendingDown,
} from 'lucide-react';

import AdminLayout from '@/components/admin/AdminLayout';
import { BRAND_CONFIG } from '@/config/brand';
import {
  formatIndiaLongDate,
  formatIndiaShortDate,
  toIndiaDayKey,
} from '@/lib/india-date';

const REVENUE_STATUSES = new Set(['pending', 'shipped', 'delivered']);

type TimeRange = 'week' | 'month' | 'year';

type OrderRecord = {
  id: string;
  created_at: string;
  customer_name: string;
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

function formatShortCurrency(value: number) {
  if (value >= 10000000) return `${BRAND_CONFIG.currency.symbol}${(value / 10000000).toFixed(1)}Cr`;
  if (value >= 100000) return `${BRAND_CONFIG.currency.symbol}${(value / 100000).toFixed(1)}L`;
  if (value >= 1000) return `${BRAND_CONFIG.currency.symbol}${(value / 1000).toFixed(1)}K`;
  return formatCurrency(value);
}

function OrderVolumeChart({ 
  data, 
  timeRange 
}: { 
  data: Array<{ label: string; orders: number; date: string }>; 
  timeRange: TimeRange 
}) {
  const maxOrders = Math.max(...data.map(d => d.orders), 1);
  const hasData = data.some(d => d.orders > 0);
  const totalOrders = data.reduce((sum, d) => sum + d.orders, 0);
  
  // Find best performing period
  const sortedData = [...data].sort((a, b) => b.orders - a.orders);
  const bestPeriod = sortedData[0];
  const avgOrders = totalOrders / data.filter(d => d.orders > 0).length || 0;

  if (!hasData) {
    return (
      <div className="flex h-64 items-center justify-center rounded-lg border-2 border-dashed border-gray-200 bg-gray-50">
        <div className="text-center">
          <ShoppingBag size={40} className="mx-auto text-gray-300" />
          <p className="mt-4 text-sm font-medium text-gray-500">No orders yet</p>
          <p className="mt-1 text-xs text-gray-400">Order volume will appear here</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Quick Stats */}
      <div className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-lg bg-gradient-to-br from-orange-50 to-orange-100 p-3 sm:p-4">
          <p className="text-xs font-medium text-orange-600">Total Orders</p>
          <p className="mt-1 text-2xl font-bold text-orange-900 sm:text-3xl">{totalOrders}</p>
          <p className="mt-0.5 text-xs text-orange-700">
            {timeRange === 'week' && 'Last 7 days'}
            {timeRange === 'month' && 'Last 30 days'}
            {timeRange === 'year' && 'Last 5 years'}
          </p>
        </div>
        <div className="rounded-lg bg-gradient-to-br from-teal-50 to-teal-100 p-3 sm:p-4">
          <p className="text-xs font-medium text-teal-600">Peak Day</p>
          <p className="mt-1 text-2xl font-bold text-teal-900 sm:text-3xl">{bestPeriod.orders}</p>
          <p className="mt-0.5 text-xs text-teal-700">{bestPeriod.label}</p>
        </div>
        <div className="rounded-lg bg-gradient-to-br from-indigo-50 to-indigo-100 p-3 sm:p-4">
          <p className="text-xs font-medium text-indigo-600">Daily Average</p>
          <p className="mt-1 text-2xl font-bold text-indigo-900 sm:text-3xl">{avgOrders.toFixed(1)}</p>
          <p className="mt-0.5 text-xs text-indigo-700">Orders per day</p>
        </div>
      </div>

      {/* Enhanced Line Chart */}
      <div className="rounded-xl border border-gray-200 bg-gradient-to-br from-white to-gray-50 p-4 shadow-sm sm:p-6">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Orders Created</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-500">Peak</p>
            <p className="text-lg font-bold text-gray-900">{maxOrders}</p>
          </div>
        </div>
        
        <div className="relative h-56 sm:h-64">
          {/* Y-axis labels */}
          <div className="absolute left-0 top-0 flex h-full flex-col justify-between pr-2 text-xs font-medium text-gray-400">
            <span>{maxOrders}</span>
            <span>{Math.round(maxOrders * 0.75)}</span>
            <span>{Math.round(maxOrders * 0.5)}</span>
            <span>{Math.round(maxOrders * 0.25)}</span>
            <span>0</span>
          </div>
          
          {/* Chart area */}
          <div className="ml-10 h-full">
            <svg className="h-full w-full" preserveAspectRatio="none">
              {/* Grid lines */}
              {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => (
                <line
                  key={i}
                  x1="0"
                  y1={`${ratio * 100}%`}
                  x2="100%"
                  y2={`${ratio * 100}%`}
                  stroke="#e5e7eb"
                  strokeWidth="1"
                  strokeDasharray={ratio === 0 || ratio === 1 ? "0" : "4 4"}
                />
              ))}
              
              {/* Gradient fill under line */}
              <defs>
                <linearGradient id="orderGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.05" />
                </linearGradient>
              </defs>
              
              {/* Area fill */}
              <polygon
                fill="url(#orderGradient)"
                points={`0,100 ${data.map((item, index) => {
                  const x = (index / (data.length - 1)) * 100;
                  const y = 100 - (item.orders / maxOrders) * 100;
                  return `${x},${y}`;
                }).join(' ')} 100,100`}
              />
              
              {/* Line path */}
              <polyline
                fill="none"
                stroke="#f59e0b"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                points={data.map((item, index) => {
                  const x = (index / (data.length - 1)) * 100;
                  const y = 100 - (item.orders / maxOrders) * 100;
                  return `${x}%,${y}%`;
                }).join(' ')}
                className="drop-shadow-sm"
              />
              
              {/* Data points with labels */}
              {data.map((item, index) => {
                const x = (index / (data.length - 1)) * 100;
                const y = 100 - (item.orders / maxOrders) * 100;
                
                return (
                  <g key={index}>
                    {/* Point */}
                    <circle
                      cx={`${x}%`}
                      cy={`${y}%`}
                      r="3"
                      fill="white"
                      stroke="#f59e0b"
                      strokeWidth="2"
                    />
                    
                    {/* Value label above point - only show if there are orders */}
                    {item.orders > 0 && (
                      <text
                        x={`${x}%`}
                        y={`${Math.max(5, y - 5)}%`}
                        fill="#1f2937"
                        fontSize="11"
                        fontWeight="600"
                        textAnchor="middle"
                      >
                        {item.orders}
                      </text>
                    )}
                  </g>
                );
              })}
            </svg>
          </div>
        </div>
        
        {/* X-axis labels */}
        <div className="ml-10 mt-3 flex justify-between">
          {data.map((item, index) => {
            // Show fewer labels for better readability
            const showLabel = timeRange === 'week' 
              ? true 
              : timeRange === 'month' 
              ? index % 6 === 0 || index === data.length - 1
              : true; // Show all years
            
            return (
              <span 
                key={index} 
                className={`text-xs font-medium text-gray-500 ${showLabel ? '' : 'invisible'}`}
              >
                {item.label}
              </span>
            );
          })}
        </div>
        
        {/* Info text */}
        <p className="mt-4 text-center text-xs text-gray-400">
          Order volume trends over time
        </p>
      </div>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  color,
  trend,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  color: string;
  trend?: { value: number; isPositive: boolean };
}) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6">
      <div className="flex items-center justify-between">
        <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${color}`}>
          {icon}
        </div>
        {trend && (
          <div className={`flex items-center gap-1 text-sm font-medium ${trend.isPositive ? 'text-green-600' : 'text-red-600'}`}>
            {trend.isPositive ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
            {Math.abs(trend.value)}%
          </div>
        )}
      </div>
      <p className="mt-4 text-sm font-medium text-gray-600">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-gray-900">{value}</p>
    </div>
  );
}

function VerticalBarChart({ 
  data, 
  timeRange 
}: { 
  data: Array<{ label: string; value: number; orders: number }>; 
  timeRange: TimeRange 
}) {
  const maxValue = Math.max(...data.map(d => d.value), 1);
  const hasData = data.some(d => d.value > 0);
  const totalRevenue = data.reduce((sum, d) => sum + d.value, 0);
  const totalOrders = data.reduce((sum, d) => sum + d.orders, 0);
  const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
  
  // Find best and worst performing periods
  const sortedData = [...data].sort((a, b) => b.value - a.value);
  const bestDay = sortedData[0];
  const avgRevenue = totalRevenue / data.filter(d => d.value > 0).length || 0;

  if (!hasData) {
    return (
      <div className="flex h-80 items-center justify-center rounded-lg border-2 border-dashed border-gray-200 bg-gray-50">
        <div className="text-center">
          <Package size={48} className="mx-auto text-gray-300" />
          <p className="mt-4 text-sm font-medium text-gray-500">No revenue data yet</p>
          <p className="mt-1 text-xs text-gray-400">Data will appear here once orders are placed</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Quick Insights */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl bg-gradient-to-br from-blue-50 via-blue-100 to-blue-50 p-4">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">Total Revenue</p>
            <IndianRupee size={16} className="text-blue-400" />
          </div>
          <p className="mt-3 text-3xl font-bold text-blue-900">{formatShortCurrency(totalRevenue)}</p>
          <div className="mt-2 flex items-center gap-2 text-xs text-blue-700">
            <ShoppingBag size={12} />
            <span>{totalOrders} orders</span>
          </div>
        </div>
        <div className="rounded-xl bg-gradient-to-br from-green-50 via-green-100 to-green-50 p-4">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-wide text-green-600">Best Day</p>
            <TrendingUp size={16} className="text-green-400" />
          </div>
          <p className="mt-3 text-3xl font-bold text-green-900">{formatShortCurrency(bestDay.value)}</p>
          <div className="mt-2 text-xs text-green-700">
            {bestDay.label} • {bestDay.orders} orders
          </div>
        </div>
        <div className="rounded-xl bg-gradient-to-br from-purple-50 via-purple-100 to-purple-50 p-4">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-wide text-purple-600">Avg Order Value</p>
            <Package size={16} className="text-purple-400" />
          </div>
          <p className="mt-3 text-3xl font-bold text-purple-900">{formatShortCurrency(avgOrderValue)}</p>
          <div className="mt-2 text-xs text-purple-700">Per order</div>
        </div>
      </div>

      {/* Enhanced Bar Chart */}
      <div className="rounded-xl border border-gray-200 bg-gradient-to-br from-white to-gray-50 p-4 shadow-sm sm:p-6">
        <div className="flex h-72 items-end justify-between gap-1 sm:gap-2">
          {data.map((item, index) => {
            const heightPercent = (item.value / maxValue) * 100;
            const hasValue = item.value > 0;
            const isAboveAvg = item.value > avgRevenue;
            
            return (
              <div 
                key={index} 
                className="relative flex flex-1 flex-col items-center"
              >
                {/* Bar with performance color */}
                <div className="relative w-full">
                  <div
                    className={`w-full rounded-t-lg ${
                      !hasValue
                        ? 'bg-gray-200'
                        : isAboveAvg
                        ? 'bg-gradient-to-t from-green-500 to-green-400'
                        : 'bg-gradient-to-t from-blue-500 to-blue-400'
                    }`}
                    style={{ 
                      height: hasValue ? `${Math.max(heightPercent, 8)}%` : '6px',
                      minHeight: hasValue ? '24px' : '6px'
                    }}
                  >
                    {/* Value on bar - always show for bars with values */}
                    {hasValue && (
                      <div className="absolute -top-5 left-1/2 -translate-x-1/2 whitespace-nowrap text-[9px] font-bold text-gray-700 sm:text-[10px]">
                        {formatShortCurrency(item.value)}
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Label */}
                <p className="mt-2 text-[10px] font-medium text-gray-600 sm:text-xs">
                  {item.label}
                </p>
                
                {/* Order count below label */}
                {hasValue && (
                  <p className="mt-0.5 text-[9px] text-gray-400 sm:text-[10px]">
                    {item.orders}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center justify-center gap-4 text-xs sm:gap-6 sm:text-sm">
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded bg-gradient-to-t from-green-500 to-green-400 shadow-sm" />
          <span className="font-medium text-gray-600">Above Average</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded bg-gradient-to-t from-blue-500 to-blue-400 shadow-sm" />
          <span className="font-medium text-gray-600">Below Average</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded bg-gray-200" />
          <span className="font-medium text-gray-600">No Sales</span>
        </div>
      </div>
    </div>
  );
}

function getDateRange(range: TimeRange) {
  const now = new Date();
  const dates: string[] = [];

  if (range === 'week') {
    // Last 7 days
    for (let i = 6; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      dates.push(toIndiaDayKey(date));
    }
  } else if (range === 'month') {
    // Last 30 days
    for (let i = 29; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      dates.push(toIndiaDayKey(date));
    }
  } else {
    // Last 5 years - use year format only
    for (let i = 4; i >= 0; i--) {
      const date = new Date(now);
      date.setFullYear(date.getFullYear() - i);
      // Format as YYYY for year grouping
      const year = date.getFullYear().toString();
      dates.push(year);
    }
  }

  return dates;
}

function formatLabel(dateKey: string, range: TimeRange, index: number) {
  if (range === 'week') {
    const date = new Date(dateKey);
    return date.toLocaleDateString('en-IN', { weekday: 'short' });
  } else if (range === 'month') {
    const date = new Date(dateKey);
    // Show date with month for every 5th day
    if (index % 5 === 0 || index === 0) {
      return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
    }
    return date.getDate().toString();
  } else {
    // Year view - just show the year
    return dateKey; // Already in YYYY format
  }
}

function getOrderKey(orderDate: string, range: TimeRange): string {
  const date = new Date(orderDate);
  
  if (range === 'week' || range === 'month') {
    // Use day-level grouping
    return toIndiaDayKey(orderDate);
  } else {
    // Use year-level grouping for year view
    return date.getFullYear().toString();
  }
}

export default function AdminDashboard() {
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [rateHistory, setRateHistory] = useState<RatePoint[]>([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<TimeRange>('week');

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
      if (!REVENUE_STATUSES.has(order.order_status)) return sum;
      return sum + Number(order.total_amount || 0);
    }, 0);
  }, [orders]);

  const ordersToday = useMemo(() => {
    const todayKey = toIndiaDayKey(new Date());
    return orders.filter((order) => toIndiaDayKey(order.created_at) === todayKey).length;
  }, [orders]);

  const latestRate = rateHistory.length ? Number(rateHistory[0].rate_per_gram || 0) : 0;

  const revenueData = useMemo(() => {
    const dates = getDateRange(timeRange);
    const totals = new Map(dates.map((day) => [day, { revenue: 0, orders: 0 }]));

    orders.forEach((order) => {
      if (!REVENUE_STATUSES.has(order.order_status)) return;
      
      const orderKey = getOrderKey(order.created_at, timeRange);
      
      if (totals.has(orderKey)) {
        const current = totals.get(orderKey)!;
        current.revenue += Number(order.total_amount || 0);
        current.orders += 1;
      }
    });

    return dates.map((day, index) => {
      const data = totals.get(day)!;
      return {
        label: formatLabel(day, timeRange, index),
        value: Math.round(data.revenue),
        orders: data.orders,
      };
    });
  }, [orders, timeRange]);

  const orderVolumeData = useMemo(() => {
    const dates = getDateRange(timeRange);
    const totals = new Map(dates.map((day) => [day, 0]));

    // Count ALL orders regardless of status
    orders.forEach((order) => {
      const orderKey = getOrderKey(order.created_at, timeRange);
      
      if (totals.has(orderKey)) {
        totals.set(orderKey, totals.get(orderKey)! + 1);
      }
    });

    return dates.map((day, index) => {
      return {
        label: formatLabel(day, timeRange, index),
        orders: totals.get(day)!,
        date: day,
      };
    });
  }, [orders, timeRange]);

  const recentOrders = orders.slice(0, 5);

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">Dashboard</h1>
          <p className="mt-1 text-sm text-gray-500">Overview of your store performance</p>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            icon={<ShoppingBag size={24} className="text-blue-600" />}
            label="Orders Today"
            value={isLoading ? '...' : ordersToday}
            color="bg-blue-50"
          />
          <StatCard
            icon={<IndianRupee size={24} className="text-green-600" />}
            label="Total Revenue"
            value={isLoading ? '...' : formatCurrency(totalRevenue)}
            color="bg-green-50"
          />
          <StatCard
            icon={<Package size={24} className="text-purple-600" />}
            label="Total Products"
            value={isLoading ? '...' : totalProducts}
            color="bg-purple-50"
          />
          <StatCard
            icon={<TrendingUp size={24} className="text-orange-600" />}
            label="Gold Rate (22K)"
            value={isLoading ? '...' : `${formatCurrency(latestRate)}/g`}
            color="bg-orange-50"
          />
        </div>

        {/* Revenue Chart */}
        <div className="rounded-lg border border-gray-200 bg-white p-4 sm:p-6">
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-bold text-gray-900 sm:text-xl">Sales Performance</h2>
              <p className="mt-1 text-xs text-gray-500 sm:text-sm">
                {timeRange === 'week' && 'Last 7 days'}
                {timeRange === 'month' && 'Last 30 days'}
                {timeRange === 'year' && 'Last 5 years'}
              </p>
            </div>
            
            {/* Time Range Selector */}
            <div className="flex items-center gap-1 rounded-lg border border-gray-200 bg-gray-50 p-1 sm:gap-2">
              <button
                onClick={() => setTimeRange('week')}
                className={`flex items-center gap-1 rounded-md px-3 py-2 text-xs font-medium transition-all sm:gap-2 sm:px-4 sm:text-sm ${
                  timeRange === 'week'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Calendar size={14} className="sm:h-4 sm:w-4" />
                Week
              </button>
              <button
                onClick={() => setTimeRange('month')}
                className={`flex items-center gap-1 rounded-md px-3 py-2 text-xs font-medium transition-all sm:gap-2 sm:px-4 sm:text-sm ${
                  timeRange === 'month'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Calendar size={14} className="sm:h-4 sm:w-4" />
                Month
              </button>
              <button
                onClick={() => setTimeRange('year')}
                className={`flex items-center gap-1 rounded-md px-3 py-2 text-xs font-medium transition-all sm:gap-2 sm:px-4 sm:text-sm ${
                  timeRange === 'year'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Calendar size={14} className="sm:h-4 sm:w-4" />
                Year
              </button>
            </div>
          </div>
          
          {isLoading ? (
            <div className="h-80 animate-pulse rounded-lg bg-gray-100" />
          ) : (
            <VerticalBarChart data={revenueData} timeRange={timeRange} />
          )}
        </div>

        {/* Order Volume Chart */}
        <div className="rounded-lg border border-gray-200 bg-white p-4 sm:p-6">
          <div className="mb-4">
            <h2 className="text-lg font-bold text-gray-900 sm:text-xl">Order Volume</h2>
            <p className="mt-1 text-xs text-gray-500 sm:text-sm">
              Track order trends over time
            </p>
          </div>
          
          {isLoading ? (
            <div className="h-64 animate-pulse rounded-lg bg-gray-100" />
          ) : (
            <OrderVolumeChart data={orderVolumeData} timeRange={timeRange} />
          )}
        </div>

        {/* Recent Orders */}
        <div className="rounded-lg border border-gray-200 bg-white">
          <div className="flex items-center justify-between border-b border-gray-200 px-4 py-4 sm:px-6">
            <div>
              <h2 className="text-lg font-bold text-gray-900">Recent Orders</h2>
              <p className="mt-0.5 text-xs text-gray-500">Latest customer orders</p>
            </div>
            <Link
              href="/admin/orders"
              className="flex items-center gap-2 rounded-lg bg-gray-100 px-3 py-2 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-200 sm:text-sm"
            >
              View All
              <ArrowRight size={14} className="sm:h-4 sm:w-4" />
            </Link>
          </div>
          {isLoading ? (
            <div className="space-y-4 p-4 sm:p-6">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-16 animate-pulse rounded-lg bg-gray-100" />
              ))}
            </div>
          ) : recentOrders.length === 0 ? (
            <div className="px-4 py-12 text-center sm:px-6">
              <ShoppingBag size={40} className="mx-auto text-gray-300" />
              <p className="mt-4 text-sm font-medium text-gray-500">No orders yet</p>
              <p className="mt-1 text-xs text-gray-400">Orders will appear here once customers place them</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {recentOrders.map((order) => (
                <div key={order.id} className="px-4 py-4 transition-colors hover:bg-gray-50 sm:px-6">
                  <div className="flex items-center justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium text-gray-900">{order.customer_name}</p>
                      <p className="mt-1 text-xs text-gray-500 sm:text-sm">
                        {formatIndiaShortDate(order.created_at)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="whitespace-nowrap text-sm font-bold text-gray-900 sm:text-base">
                        {formatCurrency(Number(order.total_amount || 0))}
                      </p>
                      <span className={`mt-1 inline-block rounded-full px-2 py-0.5 text-xs font-medium capitalize ${
                        order.order_status === 'delivered' 
                          ? 'bg-green-100 text-green-700'
                          : order.order_status === 'shipped'
                          ? 'bg-blue-100 text-blue-700'
                          : order.order_status === 'pending'
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}>
                        {order.order_status.replace(/_/g, ' ')}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
