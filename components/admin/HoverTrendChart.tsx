'use client';

import { useId, useState } from 'react';

export type TrendPoint = {
  helper?: string;
  label: string;
  value: number;
};

type HoverTrendChartProps = {
  accentClassName: string;
  data: TrendPoint[];
  emptyLabel: string;
  valueFormatter: (value: number) => string;
};

export default function HoverTrendChart({
  accentClassName,
  data,
  emptyLabel,
  valueFormatter,
}: HoverTrendChartProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const gradientId = useId().replace(/:/g, '');

  if (!data.length) {
    return (
      <div className="rounded-[26px] border border-dashed border-brand-text/10 bg-white/40 px-6 py-16 text-center">
        <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-brand-text/38">
          {emptyLabel}
        </p>
      </div>
    );
  }

  const width = 640;
  const height = 240;
  const padding = 22;
  const max = Math.max(...data.map((point) => point.value), 1);
  const min = Math.min(...data.map((point) => point.value), 0);
  const range = Math.max(max - min, 1);
  const points = data.map((point, index) => {
    const x = padding + (index * (width - padding * 2)) / Math.max(data.length - 1, 1);
    const y = height - padding - ((point.value - min) / range) * (height - padding * 2);
    return { ...point, x, y };
  });

  const polyline = points.map((point) => `${point.x},${point.y}`).join(' ');
  const areaPath = `M ${points[0].x} ${height - padding} ${points
    .map((point) => `L ${point.x} ${point.y}`)
    .join(' ')} L ${points[points.length - 1].x} ${height - padding} Z`;
  const activePoint = hoveredIndex === null ? points[points.length - 1] : points[hoveredIndex];

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-brand-text/40">
            {activePoint.helper || 'Latest point'}
          </p>
          <p className="mt-2 text-3xl font-semibold tracking-[-0.03em] text-brand-primary">
            {valueFormatter(activePoint.value)}
          </p>
        </div>
        <div className="rounded-full border border-brand-text/8 bg-white/75 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.26em] text-brand-text/44">
          {activePoint.label}
        </div>
      </div>

      <div
        className="admin-chart-shell relative rounded-[28px] border border-brand-text/8 bg-white/70 px-4 py-6 md:px-5"
        onMouseLeave={() => setHoveredIndex(null)}
      >
        {activePoint && (
          <div
            className="pointer-events-none absolute z-10 hidden rounded-2xl bg-brand-primary px-4 py-3 text-white shadow-[0_20px_40px_rgba(30,22,15,0.24)] md:block animate-fade-in"
            style={{
              left: `clamp(1rem, calc(${((activePoint.x / width) * 100).toFixed(2)}% - 3.5rem), calc(100% - 8rem))`,
              top: '1rem',
            }}
          >
            <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-white/55">
              {activePoint.label}
            </p>
            <p className="mt-2 text-sm font-semibold text-brand-accent">
              {valueFormatter(activePoint.value)}
            </p>
          </div>
        )}

        <svg viewBox={`0 0 ${width} ${height}`} className="h-64 w-full">
          <defs>
            <linearGradient id={gradientId} x1="0%" x2="0%" y1="0%" y2="100%">
              <stop offset="0%" stopColor="rgba(214,190,118,0.28)" />
              <stop offset="100%" stopColor="rgba(214,190,118,0.03)" />
            </linearGradient>
          </defs>

          {Array.from({ length: 4 }).map((_, index) => {
            const y = padding + ((height - padding * 2) / 3) * index;
            return (
              <line
                key={index}
                x1={padding}
                x2={width - padding}
                y1={y}
                y2={y}
                stroke="rgba(49, 35, 23, 0.08)"
                strokeDasharray="4 8"
              />
            );
          })}

          <path d={areaPath} fill={`url(#${gradientId})`} />
          <polyline
            points={polyline}
            fill="none"
            stroke="rgba(48, 34, 20, 0.86)"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="3"
          />

          {points.map((point, index) => {
            const isActive = hoveredIndex === index || (hoveredIndex === null && index === points.length - 1);

            return (
              <g key={`${point.label}-${index}`}>
                <line
                  x1={point.x}
                  x2={point.x}
                  y1={height - padding}
                  y2={point.y}
                  stroke="rgba(48, 34, 20, 0.08)"
                  strokeDasharray="3 6"
                />
                <circle
                  cx={point.x}
                  cy={point.y}
                  r={isActive ? 6 : 4}
                  className={`${accentClassName} cursor-pointer transition-all duration-200 ${isActive ? 'animate-pulse-soft' : ''}`}
                  onMouseEnter={() => setHoveredIndex(index)}
                />
              </g>
            );
          })}
        </svg>

        <div className="mt-2 flex justify-between gap-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-brand-text/36">
          {points.map((point, index) => (
            <span key={`${point.label}-${index}`}>{point.label}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
