'use client';

import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: string;
  change?: number;
  icon?: React.ReactNode;
  accentColor?: string;
}

export default function StatCard({
  label,
  value,
  change,
  icon,
  accentColor = '#6D28FF',
}: StatCardProps) {
  const isPositive = change !== undefined && change >= 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-[#111113] border-2 border-[#27272A] p-5 transition-all hover:translate-x-[-2px] hover:translate-y-[-2px]"
      style={{ '--accent': accentColor } as React.CSSProperties}
      whileHover={{
        boxShadow: `4px 4px 0px 0px ${accentColor}`,
      }}
    >
      <div className="flex items-start justify-between mb-3">
        <span className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#A1A1AA]">
          {label}
        </span>
        {icon && (
          <div className="text-[#A1A1AA]">{icon}</div>
        )}
      </div>
      <div className="flex items-end justify-between">
        <span className="text-2xl font-black text-[#F5F5F5] tabular-nums tracking-tight">
          {value}
        </span>
        {change !== undefined && (
          <span
            className={`flex items-center gap-1 text-xs font-bold tabular-nums ${
              isPositive ? 'text-[#4ADE80]' : 'text-[#F97316]'
            }`}
          >
            {isPositive ? (
              <TrendingUp className="h-3 w-3" />
            ) : (
              <TrendingDown className="h-3 w-3" />
            )}
            {isPositive ? '+' : ''}
            {change.toFixed(1)}%
          </span>
        )}
      </div>
    </motion.div>
  );
}
