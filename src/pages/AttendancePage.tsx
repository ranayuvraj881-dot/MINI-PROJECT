import React, { useState, useEffect } from 'react';
import { attendanceService } from '../services/attendanceService';
import { SubjectAttendance, AttendanceSummary } from '../types';
import { AttendanceSimulator } from '../components/attendance/AttendanceSimulator';
import { LoadingState } from '../components/common/LoadingState';
import { ProgressBar } from '../components/common/ProgressBar';
import {
  CalendarCheck,
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
  Clock,
  ChevronDown,
  Info,
  ShieldAlert,
  ArrowRight
} from 'lucide-react';

export const AttendancePage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState<AttendanceSummary | null>(null);
  const [subjects, setSubjects] = useState<SubjectAttendance[]>([]);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const [sum, subs] = await Promise.all([
          attendanceService.getAttendanceSummary(),
          attendanceService.getSubjectAttendance()
        ]);
        setSummary(sum);
        setSubjects(subs);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading || !summary) {
    return <LoadingState message="Loading Attendance Registry..." subMessage="Calculating university eligibility margin and threshold buffers" />;
  }

  return (
    <div className="space-y-6">
      {/* Top Banner Overview */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                Attendance Intelligence &amp; Registry
              </h1>
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                Action Required
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500">
              Mandatory AKTU 75.0% threshold applies to all sessional and university examinations.
            </p>
          </div>

          <div className="flex items-center gap-6 self-start lg:self-center">
            <div className="text-right">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                Overall Attendance
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-slate-900">
                  {summary.overallPercentage.toFixed(1)}%
                </span>
                <span className="text-xs font-semibold text-slate-500">
                  ({summary.totalAttendedClasses}/{summary.totalConductedClasses})
                </span>
              </div>
            </div>

            <div className="h-10 w-px bg-slate-200" />

            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                University Threshold
              </span>
              <span className="text-sm font-bold text-slate-800 font-mono">75.0% Min.</span>
              <span className="text-[11px] text-amber-700 block font-semibold">1 Subject at Risk</span>
            </div>
          </div>
        </div>
      </div>

      {/* Subject-Wise Table Card */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs overflow-hidden">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">Subject-Wise Attendance Breakdown</h3>
            <p className="text-xs text-slate-500">Includes margin calculations and recovery targets</p>
          </div>
          <span className="text-xs font-semibold px-3 py-1 rounded-lg bg-slate-100 text-slate-700">
            {subjects.length} Enrolled Courses
          </span>
        </div>

        <div className="overflow-x-auto -mx-6 px-6">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200/80 text-[11px] font-bold text-slate-400 uppercase tracking-wider bg-slate-50/50">
                <th className="py-3 px-3">Subject Code</th>
                <th className="py-3 px-3">Subject Name</th>
                <th className="py-3 px-3 text-center">Attended / Total</th>
                <th className="py-3 px-3 text-center">Percentage</th>
                <th className="py-3 px-3 text-center">Status</th>
                <th className="py-3 px-3">Margin &amp; Recovery Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {subjects.map((sub) => {
                const isAtRisk = sub.percentage < 75.0;
                return (
                  <tr key={sub.subjectCode} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-3 font-mono font-bold text-blue-700">
                      {sub.subjectCode}
                    </td>

                    <td className="py-3.5 px-3">
                      <span className="font-bold text-slate-900 block">{sub.subjectName}</span>
                      <span className="text-[11px] text-slate-400">Class Incharge: {sub.faculty}</span>
                    </td>

                    <td className="py-3.5 px-3 text-center font-semibold text-slate-700 font-mono">
                      {sub.attendedClasses} / {sub.totalClasses}
                    </td>

                    <td className="py-3.5 px-3 text-center">
                      <span
                        className={`text-sm font-bold ${
                          isAtRisk ? 'text-amber-600' : 'text-emerald-700'
                        }`}
                      >
                        {sub.percentage.toFixed(1)}%
                      </span>
                    </td>

                    <td className="py-3.5 px-3 text-center">
                      <span
                        className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full border ${
                          isAtRisk
                            ? 'bg-amber-50 text-amber-700 border-amber-200'
                            : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        }`}
                      >
                        {isAtRisk ? (
                          <AlertTriangle className="w-3 h-3" />
                        ) : (
                          <CheckCircle2 className="w-3 h-3" />
                        )}
                        {sub.status}
                      </span>
                    </td>

                    <td className="py-3.5 px-3">
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-xs font-semibold px-2.5 py-1 rounded-lg ${
                            isAtRisk
                              ? 'bg-rose-50 text-rose-700 border border-rose-200 font-bold'
                              : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {sub.marginAdvice}
                        </span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Attendance Simulator Section */}
      <AttendanceSimulator subjects={subjects} />
    </div>
  );
};
