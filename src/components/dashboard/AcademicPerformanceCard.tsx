import React from 'react';
import { SubjectMarks } from '../../types';
import { ArrowUpRight, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface AcademicPerformanceCardProps {
  subjectMarks: SubjectMarks[];
  insights: { id: string; title: string; message: string }[];
}

export const AcademicPerformanceCard: React.FC<AcademicPerformanceCardProps> = ({
  subjectMarks,
  insights
}) => {
  const navigate = useNavigate();

  // Metrics summary
  const internalAvg = 84.5;
  const quizAvg = 88.0;
  const assignmentRate = 92.0;

  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-base font-bold text-slate-900">Academic Performance</h3>
          <p className="text-xs text-slate-500">Continuous internal evaluation, quizzes &amp; practical marks</p>
        </div>
        <button
          onClick={() => navigate('/marks')}
          className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 group"
        >
          View Full Breakdown
          <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>

      {/* 3 Key Metrics Row */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        <div className="p-3 bg-slate-50/80 rounded-xl border border-slate-200/70 text-center">
          <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Internal Marks</span>
          <p className="text-base font-bold text-slate-900 mt-0.5">{internalAvg}%</p>
          <span className="text-[10px] text-emerald-600 font-medium">+3.2% vs Sessional 1</span>
        </div>
        <div className="p-3 bg-slate-50/80 rounded-xl border border-slate-200/70 text-center">
          <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Quiz Score</span>
          <p className="text-base font-bold text-slate-900 mt-0.5">{quizAvg}%</p>
          <span className="text-[10px] text-emerald-600 font-medium">+12% in DBMS</span>
        </div>
        <div className="p-3 bg-slate-50/80 rounded-xl border border-slate-200/70 text-center">
          <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Assignment Comp.</span>
          <p className="text-base font-bold text-slate-900 mt-0.5">{assignmentRate}%</p>
          <span className="text-[10px] text-slate-500 font-medium">6 of 7 submitted</span>
        </div>
      </div>

      {/* Clean SVG Subject Comparison Chart */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs text-slate-500 font-medium mb-1">
          <span>Subject Performance Index</span>
          <span>Aggregate Score</span>
        </div>

        {subjectMarks.slice(0, 4).map((sub) => (
          <div key={sub.subjectCode} className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-700 truncate max-w-[200px]">
                {sub.subjectName}
              </span>
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-900">{sub.currentTotalPercentage}%</span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 font-semibold">
                  Grade {sub.gradeProjected}
                </span>
              </div>
            </div>

            {/* Custom Bar with Sessional 1 vs 2 Segments */}
            <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden flex">
              <div
                className="bg-blue-600 h-2 transition-all duration-300"
                style={{ width: `${sub.currentTotalPercentage}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Performance Insight Highlight */}
      {insights[0] && (
        <div className="mt-5 p-3.5 rounded-xl bg-blue-50/60 border border-blue-200/80 flex items-start gap-2.5">
          <TrendingUp className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" />
          <div className="text-xs">
            <span className="font-bold text-blue-950 mr-1.5">{insights[0].title}:</span>
            <span className="text-blue-900">{insights[0].message}</span>
          </div>
        </div>
      )}
    </div>
  );
};
