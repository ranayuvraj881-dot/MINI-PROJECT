import React from 'react';

interface CollegeBrandProps {
  collapsed?: boolean;
  variant?: 'sidebar' | 'header' | 'login';
}

export const CollegeBrand: React.FC<CollegeBrandProps> = ({
  collapsed = false,
  variant = 'sidebar'
}) => {
  if (collapsed) {
    return (
      <div className="flex flex-col items-center justify-center p-2 group" title="GL Bajaj Institute of Technology & Management">
        <div className="w-10 h-10 rounded-lg bg-blue-900 border border-blue-700 flex items-center justify-center text-white font-bold shadow-sm group-hover:scale-105 transition-transform">
          <span className="text-xs tracking-tighter font-extrabold text-blue-100">GLB</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-3 ${variant === 'login' ? 'flex-col sm:flex-row text-center sm:text-left' : ''}`}>
      {/* Official College Logo Placeholder Component */}
      <div 
        id="glb-official-logo-container" 
        className="shrink-0 flex items-center justify-center rounded-lg bg-blue-950 border border-blue-800 text-white px-2 py-1.5 shadow-sm"
        title="Official GL Bajaj Institute of Technology & Management Emblem"
      >
        <div className="flex flex-col items-center justify-center text-center">
          <span className="text-[10px] uppercase font-mono tracking-widest text-blue-300 font-semibold">[GL BAJAJ LOGO]</span>
          <span className="text-[9px] font-sans font-bold tracking-tight text-blue-100 uppercase">GLBITM</span>
        </div>
      </div>

      {/* College Typography */}
      <div className="flex flex-col min-w-0 leading-tight">
        <div className="flex items-center gap-1.5">
          <span className="font-extrabold tracking-tight text-slate-900 text-sm md:text-base uppercase font-sans">
            GL BAJAJ
          </span>
          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-100 text-blue-800 tracking-wider">
            CampusOS
          </span>
        </div>
        <span className="text-xs font-semibold text-slate-700 truncate">
          Institute of Technology &amp; Management
        </span>
        <span className="text-[10px] text-slate-600 truncate font-medium">
          Greater Noida, Uttar Pradesh, India
        </span>
      </div>
    </div>
  );
};
