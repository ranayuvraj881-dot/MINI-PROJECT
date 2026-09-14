import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingStateProps {
  message?: string;
  subMessage?: string;
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  message = 'Loading academic intelligence...',
  subMessage = 'Connecting to CampusOS data layers'
}) => {
  return (
    <div className="w-full min-h-[260px] flex flex-col items-center justify-center p-8 text-center bg-white/60 rounded-xl border border-slate-200/80">
      <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-700 mb-3 shadow-xs">
        <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
      </div>
      <p className="text-sm font-semibold text-slate-800">{message}</p>
      <p className="text-xs text-slate-400 mt-1">{subMessage}</p>
    </div>
  );
};
