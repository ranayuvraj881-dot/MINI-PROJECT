import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  id?: string;
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  badgeText?: string;
  badgeVariant?: 'safe' | 'warning' | 'critical' | 'neutral' | 'accent';
  trend?: {
    direction: 'up' | 'down' | 'neutral';
    text: string;
  };
  onClick?: () => void;
}

export const StatCard: React.FC<StatCardProps> = ({
  id,
  title,
  value,
  subtitle,
  icon: Icon,
  badgeText,
  badgeVariant = 'neutral',
  trend,
  onClick
}) => {
  const getBadgeStyle = () => {
    switch (badgeVariant) {
      case 'safe':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'warning':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'critical':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'accent':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div
      id={id}
      onClick={onClick}
      className={`relative bg-white border border-slate-200/90 rounded-xl p-5 shadow-xs transition-all duration-200 ${
        onClick ? 'cursor-pointer hover:border-blue-300 hover:shadow-md' : ''
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{title}</p>
          <div className="flex items-baseline gap-2">
            <h3 className="text-2xl font-bold tracking-tight text-slate-900">{value}</h3>
            {badgeText && (
              <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${getBadgeStyle()}`}>
                {badgeText}
              </span>
            )}
          </div>
          {subtitle && <p className="text-xs text-slate-500 leading-normal">{subtitle}</p>}
        </div>

        <div className="w-10 h-10 rounded-lg bg-blue-50/80 border border-blue-100 flex items-center justify-center text-blue-700 shrink-0">
          <Icon className="w-5 h-5" />
        </div>
      </div>

      {trend && (
        <div className="mt-3 pt-3 border-t border-slate-100 flex items-center gap-1.5 text-xs text-slate-600">
          <span
            className={`font-semibold ${
              trend.direction === 'up'
                ? 'text-emerald-600'
                : trend.direction === 'down'
                ? 'text-rose-600'
                : 'text-slate-500'
            }`}
          >
            {trend.direction === 'up' ? '↑' : trend.direction === 'down' ? '↓' : '•'} {trend.text}
          </span>
        </div>
      )}
    </div>
  );
};
