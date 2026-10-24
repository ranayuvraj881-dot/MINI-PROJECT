import React from 'react';

interface CollegeBrandProps {
  collapsed?: boolean;
  variant?: 'sidebar' | 'header' | 'login' | 'hero';
}

export const CollegeBrand: React.FC<CollegeBrandProps> = ({
  collapsed = false,
  variant = 'sidebar'
}) => {
  if (collapsed) {
    return (
      <div className="flex flex-col items-center justify-center p-1 group" title="GL Bajaj Institute of Technology & Management">
        <div className="w-10 h-10 rounded-2xl bg-white/95 p-1 border border-slate-200/90 shadow-xs flex items-center justify-center group-hover:scale-105 transition-transform overflow-hidden">
          <img
            src="/glb-logo.png"
            alt="GL Bajaj Logo"
            className="w-full h-full object-contain"
          />
        </div>
      </div>
    );
  }

  if (variant === 'login') {
    return (
      <div className="flex flex-col items-center text-center gap-2.5">
        <div className="relative group">
          <div className="absolute -inset-2 bg-gradient-to-r from-amber-400/20 via-indigo-500/20 to-blue-500/20 rounded-3xl blur-lg group-hover:blur-xl transition-all opacity-80" />
          <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-white p-2 border border-slate-200/80 shadow-xl flex items-center justify-center overflow-hidden">
            <img
              src="/glb-logo.png"
              alt="GL Bajaj Official Crest"
              className="w-full h-full object-contain drop-shadow-sm transform hover:scale-105 transition-transform"
            />
          </div>
        </div>
        <div className="flex flex-col items-center">
          <div className="flex items-center gap-2">
            <span className="font-black tracking-tight text-slate-900 text-lg sm:text-xl uppercase font-sans">
              GL BAJAJ
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
              CampusOS
            </span>
          </div>
          <span className="text-xs font-semibold text-slate-600 mt-0.5">
            Institute of Technology &amp; Management
          </span>
          <span className="text-[10px] text-slate-400 font-medium">
            Greater Noida • Affiliated to AKTU
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      {/* Official College Logo Emblem */}
      <div
        id="glb-official-logo-container"
        className="shrink-0 w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-white p-1 border border-slate-200/90 shadow-sm flex items-center justify-center overflow-hidden hover:scale-105 transition-transform"
        title="Official GL Bajaj Institute of Technology & Management Emblem"
      >
        <img
          src="/glb-logo.png"
          alt="GL Bajaj Crest"
          className="w-full h-full object-contain"
        />
      </div>

      {/* College Typography */}
      <div className="flex flex-col min-w-0 leading-tight">
        <div className="flex items-center gap-1.5">
          <span className="font-black tracking-tight text-slate-900 text-sm sm:text-base uppercase font-sans">
            GL BAJAJ
          </span>
          <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded-full bg-indigo-100 text-indigo-800 tracking-wider">
            CampusOS
          </span>
        </div>
        <span className="text-xs font-semibold text-slate-700 truncate">
          Institute of Technology &amp; Management
        </span>
        <span className="text-[10px] text-slate-500 truncate font-medium">
          Greater Noida • Affiliated to AKTU
        </span>
      </div>
    </div>
  );
};
