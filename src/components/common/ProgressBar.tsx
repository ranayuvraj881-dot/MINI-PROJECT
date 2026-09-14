import React from 'react';

interface ProgressBarProps {
  value: number; // 0 to 100
  threshold?: number; // e.g. 75
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
  label?: string;
  variant?: 'auto' | 'safe' | 'warning' | 'critical' | 'blue';
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  threshold = 75,
  showLabel = false,
  size = 'md',
  label,
  variant = 'auto'
}) => {
  const clamped = Math.min(100, Math.max(0, value));

  let barColor = 'bg-blue-600';
  if (variant === 'auto') {
    if (clamped >= threshold) {
      barColor = 'bg-emerald-600';
    } else if (clamped >= threshold - 5) {
      barColor = 'bg-amber-500';
    } else {
      barColor = 'bg-rose-500';
    }
  } else if (variant === 'safe') {
    barColor = 'bg-emerald-600';
  } else if (variant === 'warning') {
    barColor = 'bg-amber-500';
  } else if (variant === 'critical') {
    barColor = 'bg-rose-500';
  }

  const heightClass = size === 'sm' ? 'h-1.5' : size === 'lg' ? 'h-3' : 'h-2';

  return (
    <div className="w-full space-y-1.5">
      {(showLabel || label) && (
        <div className="flex items-center justify-between text-xs font-medium text-slate-700">
          <span>{label || 'Progress'}</span>
          <span className="font-semibold">{clamped.toFixed(1)}%</span>
        </div>
      )}
      <div className={`w-full bg-slate-100 rounded-full overflow-hidden ${heightClass} relative`}>
        <div
          className={`${barColor} ${heightClass} rounded-full transition-all duration-300`}
          style={{ width: `${clamped}%` }}
        />
        {threshold && (
          <div
            title={`Required ${threshold}%`}
            style={{ left: `${threshold}%` }}
            className="absolute top-0 bottom-0 w-0.5 bg-slate-400/80 z-10"
          />
        )}
      </div>
    </div>
  );
};
