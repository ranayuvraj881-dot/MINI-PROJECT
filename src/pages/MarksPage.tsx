import React, { useState, useEffect } from 'react';
import { academicService } from '../services/academicService';
import { SubjectMarks } from '../types';
import { LoadingState } from '../components/common/LoadingState';
import { Award, TrendingUp, BarChart2, BookOpen, AlertCircle, Sparkles } from 'lucide-react';
import { ProgressBar } from '../components/common/ProgressBar';

export const MarksPage: React.FC = () => {
  const [marks, setMarks] = useState<SubjectMarks[]>([]);
  const [insights, setInsights] = useState<{ id: string; title: string; message: string }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const [mks, ins] = await Promise.all([
          academicService.getSubjectMarks(),
          academicService.getMarksInsights()
        ]);
        setMarks(mks);
        setInsights(ins);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) {
    return <LoadingState message="Loading Examination Marks &amp; Grades..." subMessage="Compiling Continuous Internal Evaluation (CIE) data" />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              Marks &amp; Academic Evaluations
            </h1>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-800 border border-blue-200">
              CIE System
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Continuous Internal Evaluation (Sessional 1, Sessional 2, PUT, Lab Viva &amp; Quizzes)
          </p>
        </div>

        {/* GPA Summary Highlights */}
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-center min-w-[100px]">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Current CGPA</span>
            <p className="text-xl font-black text-slate-900">8.65</p>
          </div>
          <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 text-center min-w-[100px]">
            <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700">Projected SGPA</span>
            <p className="text-xl font-black text-blue-900">8.90</p>
          </div>
        </div>
      </div>

      {/* Internal Evaluation Breakdown Table */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs overflow-hidden">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">Course Assessment Breakdown</h3>
            <p className="text-xs text-slate-500">
              Sessional 1 (30M) • Sessional 2 (30M) • Quizzes (10M) • Assignments (10M) • Lab / Practical (20M)
            </p>
          </div>
        </div>

        <div className="overflow-x-auto -mx-6 px-6">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200/80 text-[11px] font-bold text-slate-400 uppercase tracking-wider bg-slate-50/50">
                <th className="py-3 px-3">Subject</th>
                <th className="py-3 px-3 text-center">Sessional 1 (30)</th>
                <th className="py-3 px-3 text-center">Sessional 2 (30)</th>
                <th className="py-3 px-3 text-center">Quizzes (10)</th>
                <th className="py-3 px-3 text-center">Assign. (10)</th>
                <th className="py-3 px-3 text-center">Lab / Practical</th>
                <th className="py-3 px-3 text-center">Internal Score</th>
                <th className="py-3 px-3 text-center">Projected Grade</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {marks.map((item) => (
                <tr key={item.subjectCode} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3.5 px-3">
                    <span className="font-bold text-slate-900 block">{item.subjectName}</span>
                    <span className="font-mono text-[11px] text-blue-700">{item.subjectCode}</span>
                  </td>

                  <td className="py-3.5 px-3 text-center font-mono font-semibold text-slate-700">
                    {item.internalSessional1?.scored ? `${item.internalSessional1.scored} / 30` : '—'}
                  </td>

                  <td className="py-3.5 px-3 text-center font-mono font-semibold text-slate-700">
                    {item.internalSessional2?.scored ? `${item.internalSessional2.scored} / 30` : 'Scheduled'}
                  </td>

                  <td className="py-3.5 px-3 text-center font-mono font-semibold text-slate-700">
                    {item.quizzes?.scored ? `${item.quizzes.scored} / 20` : '—'}
                  </td>

                  <td className="py-3.5 px-3 text-center font-mono font-semibold text-slate-700">
                    {item.assignments?.scored ? `${item.assignments.scored} / 20` : '—'}
                  </td>

                  <td className="py-3.5 px-3 text-center font-mono font-semibold text-slate-700">
                    {item.practicals?.scored ? `${item.practicals.scored} / 50` : 'N/A'}
                  </td>

                  <td className="py-3.5 px-3 text-center">
                    <span className="text-sm font-extrabold text-blue-900">
                      {item.currentTotalPercentage}%
                    </span>
                  </td>

                  <td className="py-3.5 px-3 text-center">
                    <span className="inline-block px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-blue-50 text-blue-800 border border-blue-200">
                      Grade {item.gradeProjected}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Performance Insights & Grade Trajectory */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs space-y-3">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-blue-600" />
            <h3 className="text-base font-bold text-slate-900">Semester SGPA Trajectory</h3>
          </div>
          <p className="text-xs text-slate-500">
            Historical progression across previous academic cycles
          </p>

          <div className="space-y-3 pt-2">
            {[
              { sem: 'Semester I', sgpa: 8.1, grade: 'A' },
              { sem: 'Semester II', sgpa: 8.35, grade: 'A' },
              { sem: 'Semester III', sgpa: 8.52, grade: 'A+' },
              { sem: 'Semester IV', sgpa: 8.7, grade: 'A+' },
              { sem: 'Semester V', sgpa: 8.82, grade: 'A+' }
            ].map((s) => (
              <div key={s.sem} className="space-y-1">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-700">{s.sem}</span>
                  <span className="text-blue-900 font-mono">{s.sgpa.toFixed(2)} SGPA ({s.grade})</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: `${(s.sgpa / 10) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Performance Insights */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-blue-600" />
            <h3 className="text-base font-bold text-slate-900">Academic Analytics &amp; Advisory</h3>
          </div>

          <div className="space-y-3">
            {insights.map((ins) => (
              <div
                key={ins.id}
                className="p-4 rounded-xl bg-blue-50/60 border border-blue-200 text-xs space-y-1"
              >
                <h4 className="font-bold text-blue-950">{ins.title}</h4>
                <p className="text-blue-900 leading-relaxed font-medium">{ins.message}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
