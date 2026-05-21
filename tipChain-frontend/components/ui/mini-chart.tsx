'use client';

import { motion } from 'framer-motion';
import type { ChartDataPoint } from '@/lib/types';

interface MiniChartProps {
  data: ChartDataPoint[];
  width?: number;
  height?: number;
  color?: string;
}

export default function MiniChart({
  data,
  width = 200,
  height = 60,
  color = '#6D28FF',
}: MiniChartProps) {
  if (!data || data.length < 2) return null;

  const prices = data.map((d) => d.price);
  const min = Math.min(...prices);
  const max = Math.max(...prices);
  const range = max - min || 1;

  const padding = 2;
  const chartWidth = width - padding * 2;
  const chartHeight = height - padding * 2;

  const points = data.map((d, i) => {
    const x = padding + (i / (data.length - 1)) * chartWidth;
    const y = padding + chartHeight - ((d.price - min) / range) * chartHeight;
    return `${x},${y}`;
  });

  const pathD = `M${points.join(' L')}`;

  // Determine if price is up or down
  const isUp = data[data.length - 1].price >= data[0].price;
  const lineColor = isUp ? '#4ADE80' : '#F97316';
  const finalColor = color === 'auto' ? lineColor : color;

  return (
    <motion.svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <defs>
        <linearGradient id={`gradient-${data.length}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={finalColor} stopOpacity={0.15} />
          <stop offset="100%" stopColor={finalColor} stopOpacity={0} />
        </linearGradient>
      </defs>
      {/* Area fill */}
      <path
        d={`${pathD} L${width - padding},${height - padding} L${padding},${height - padding} Z`}
        fill={`url(#gradient-${data.length})`}
      />
      {/* Line */}
      <path
        d={pathD}
        fill="none"
        stroke={finalColor}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </motion.svg>
  );
}
