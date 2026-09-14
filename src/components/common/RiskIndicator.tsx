import React from 'react';
import { AlertTriangle, CheckCircle2, ShieldAlert } from 'lucide-react';

interface RiskIndicatorProps {
  level: 'SAFE' | 'MEDIUM' | 'HIGH';
  score?: number;
  showText?: boolean;
  compact?: boolean;
}

export const RiskIndicator: React.FC<RiskIndicatorProps> = ({
  level,
  score,
  showText = true,
  compact = false
}) => {
  const config = {
    SAFE: {
      label: 'Low Risk / Healthy',
      badge: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      icon: CheckCircle2,
      accent: 'text-emerald-600',
      barColor: 'bg-emerald-500'
    },
    MEDIUM: {
      label: 'Medium Risk',
      badge: 'bg-amber-50 text-amber-700 border-amber-200',
      icon: AlertTriangle,
      accent: 'text-amber-600',
      barColor: 'bg-amber-500'
    },
    HIGH: {
      label: 'High Academic Risk',
      badge: 'bg-rose-50 text-rose-700 border-rose-200',
      icon: ShieldAlert,
      accent: 'text-rose-600',
      barColor: 'bg-rose-500'
    }
  }[level];

  const Icon = config.icon;

  if (compact) {
    return (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${config.badge}`}>
        <Icon className="w-3.5 h-3.5" />
        {config.label}
      </span>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${config.badge}`}>
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold text-slate-900">{level}</span>
          {score !== undefined && (
            <span className="text-xs font-mono text-slate-500">(Index {score}/100)</span>
          )}
        </div>
        {showText && <p className="text-xs text-slate-600">{config.label}</p>}
      </div>
    </div>
  );
};
