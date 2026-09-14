/**
 * Utility functions for GL Bajaj CampusOS
 */

export function formatPercentage(num: number): string {
  return `${num.toFixed(1)}%`;
}

export function getAttendanceStatus(percentage: number): {
  label: 'Safe' | 'At Risk' | 'Critical';
  color: string;
  bg: string;
  badge: string;
  border: string;
} {
  if (percentage >= 75.0) {
    return {
      label: 'Safe',
      color: 'text-emerald-700',
      bg: 'bg-emerald-50',
      badge: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      border: 'border-emerald-200'
    };
  }
  if (percentage >= 70.0) {
    return {
      label: 'At Risk',
      color: 'text-amber-700',
      bg: 'bg-amber-50',
      badge: 'bg-amber-50 text-amber-700 border-amber-200',
      border: 'border-amber-200'
    };
  }
  return {
    label: 'Critical',
    color: 'text-rose-700',
    bg: 'bg-rose-50',
    badge: 'bg-rose-50 text-rose-700 border-rose-200',
    border: 'border-rose-200'
  };
}

export function getPriorityBadge(priority: string): {
  color: string;
  bg: string;
  border: string;
} {
  switch (priority) {
    case 'HIGH PRIORITY':
      return { color: 'text-rose-700', bg: 'bg-rose-50', border: 'border-rose-200' };
    case 'MEDIUM PRIORITY':
      return { color: 'text-amber-700', bg: 'bg-amber-50', border: 'border-amber-200' };
    default:
      return { color: 'text-slate-700', bg: 'bg-slate-100', border: 'border-slate-200' };
  }
}

export function formatDate(dateString: string): string {
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return dateString;
    return d.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  } catch {
    return dateString;
  }
}
