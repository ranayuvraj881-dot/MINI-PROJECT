import React from 'react';
import { Sparkles, BookOpen, GraduationCap, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface AIRecommendationCardProps {
  recommendationText?: string;
  subjectCode?: string;
}

export const AIRecommendationCard: React.FC<AIRecommendationCardProps> = ({
  recommendationText = 'Revise DBMS Normalization for 40 minutes and solve 5 related PYQs.',
  subjectCode = 'KCS-601'
}) => {
  const navigate = useNavigate();

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-blue-950 via-indigo-950 to-slate-950 text-white rounded-2xl p-6 shadow-md border border-blue-800/60">
      {/* Subtle glowing ring decoration */}
      <div className="absolute -right-12 -top-12 w-48 h-48 rounded-full bg-blue-500/10 blur-2xl pointer-events-none" />

      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-5">
        <div className="space-y-2 max-w-xl">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold tracking-wide uppercase bg-blue-500/20 text-blue-300 border border-blue-400/30">
              <Sparkles className="w-3.5 h-3.5 text-blue-300 animate-pulse" />
              Campus AI Academic Engine
            </span>
            <span className="text-xs text-blue-200/80 font-mono">Confidence 96%</span>
          </div>

          <h3 className="text-lg font-bold text-white tracking-tight">Your Next Best Action</h3>
          <p className="text-sm text-blue-100/90 leading-relaxed font-medium">
            "{recommendationText}"
          </p>
          <p className="text-xs text-blue-300/70">
            Engineered from AKTU 5-year PYQ frequency matrix + your recent quiz variance.
          </p>
        </div>

        <div className="flex flex-row sm:flex-col gap-2.5 shrink-0">
          <button
            onClick={() => navigate('/notes')}
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-slate-950 bg-white hover:bg-blue-50 shadow-sm transition-all hover:scale-[1.02]"
          >
            <BookOpen className="w-4 h-4 text-blue-700" />
            Start Learning
          </button>
          <button
            onClick={() => navigate('/pyqs')}
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-blue-800/60 hover:bg-blue-700/80 border border-blue-600/40 transition-all"
          >
            <GraduationCap className="w-4 h-4 text-blue-300" />
            View PYQs
          </button>
        </div>
      </div>
    </div>
  );
};
