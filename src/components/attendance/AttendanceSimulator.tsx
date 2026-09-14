import React, { useState, useEffect } from 'react';
import { attendanceService, AttendanceSimulationResult } from '../../services/attendanceService';
import { SubjectAttendance } from '../../types';
import { Calculator, CheckCircle2, AlertTriangle, RefreshCw, ArrowRight } from 'lucide-react';
import { ProgressBar } from '../common/ProgressBar';

interface AttendanceSimulatorProps {
  subjects: SubjectAttendance[];
}

export const AttendanceSimulator: React.FC<AttendanceSimulatorProps> = ({ subjects }) => {
  const [selectedSubjectCode, setSelectedSubjectCode] = useState<string>(
    subjects.find((s) => s.percentage < 75)?.subjectCode || subjects[0]?.subjectCode || ''
  );
  const [upcomingClasses, setUpcomingClasses] = useState<number>(6);
  const [plannedToAttend, setPlannedToAttend] = useState<number>(5);
  const [result, setResult] = useState<AttendanceSimulationResult | null>(null);
  const [isCalculating, setIsCalculating] = useState<boolean>(false);

  const currentSubject = subjects.find((s) => s.subjectCode === selectedSubjectCode) || subjects[0];

  useEffect(() => {
    if (!currentSubject) return;

    let isMounted = true;
    const runCalc = async () => {
      setIsCalculating(true);
      try {
        const res = await attendanceService.calculateSimulation(
          currentSubject.attendedClasses,
          currentSubject.totalClasses,
          upcomingClasses,
          plannedToAttend
        );
        if (isMounted) setResult(res);
      } finally {
        if (isMounted) setIsCalculating(false);
      }
    };

    runCalc();
    return () => {
      isMounted = false;
    };
  }, [currentSubject, upcomingClasses, plannedToAttend]);

  if (!currentSubject) return null;

  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs">
      <div className="flex items-center gap-2.5 mb-2">
        <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center">
          <Calculator className="w-4 h-4" />
        </div>
        <div>
          <h3 className="text-base font-bold text-slate-900">Interactive Attendance Simulator</h3>
          <p className="text-xs text-slate-500">
            Model upcoming lecture attendance scenarios to safeguard 75% university examination eligibility
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
        {/* Controls Column */}
        <div className="lg:col-span-6 space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Select Target Subject
            </label>
            <select
              value={selectedSubjectCode}
              onChange={(e) => setSelectedSubjectCode(e.target.value)}
              className="w-full text-xs font-semibold px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            >
              {subjects.map((sub) => (
                <option key={sub.subjectCode} value={sub.subjectCode}>
                  {sub.subjectName} ({sub.subjectCode}) — Currently {sub.percentage.toFixed(1)}% ({sub.status})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Upcoming Classes
              </label>
              <input
                type="number"
                min={1}
                max={30}
                value={upcomingClasses}
                onChange={(e) => {
                  const val = Math.max(1, parseInt(e.target.value) || 1);
                  setUpcomingClasses(val);
                  if (plannedToAttend > val) setPlannedToAttend(val);
                }}
                className="w-full text-xs font-semibold px-3.5 py-2 rounded-xl border border-slate-200 bg-white text-slate-800 focus:outline-none focus:border-blue-500"
              />
              <span className="text-[10px] text-slate-600 font-medium">Scheduled in next 2 weeks</span>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                I Plan to Attend
              </label>
              <input
                type="number"
                min={0}
                max={upcomingClasses}
                value={plannedToAttend}
                onChange={(e) => {
                  const val = Math.min(upcomingClasses, Math.max(0, parseInt(e.target.value) || 0));
                  setPlannedToAttend(val);
                }}
                className="w-full text-xs font-semibold px-3.5 py-2 rounded-xl border border-slate-200 bg-white text-slate-800 focus:outline-none focus:border-blue-500"
              />
              <span className="text-[10px] text-slate-600 font-medium">
                (Will miss: {upcomingClasses - plannedToAttend} classes)
              </span>
            </div>
          </div>

          {/* Quick Scenario Buttons */}
          <div>
            <span className="block text-xs font-bold text-slate-600 mb-1.5">Quick Scenarios:</span>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => {
                  setUpcomingClasses(4);
                  setPlannedToAttend(4);
                }}
                className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700"
              >
                Attend Next 4 / 4 (100%)
              </button>
              <button
                type="button"
                onClick={() => {
                  setUpcomingClasses(5);
                  setPlannedToAttend(3);
                }}
                className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700"
              >
                Attend 3, Miss 2
              </button>
              <button
                type="button"
                onClick={() => {
                  setUpcomingClasses(2);
                  setPlannedToAttend(2);
                }}
                className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold"
              >
                Next 2 Classes (Reach 75%)
              </button>
            </div>
          </div>
        </div>

        {/* Projection Output Column */}
        <div className="lg:col-span-6 bg-slate-50/80 rounded-xl p-5 border border-slate-200/90 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Simulation Projection
              </span>
              {isCalculating ? (
                <span className="text-xs text-blue-600 flex items-center gap-1 font-semibold">
                  <RefreshCw className="w-3 h-3 animate-spin" /> Calculating...
                </span>
              ) : (
                <span
                  className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${
                    result?.isSafe
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : 'bg-amber-50 text-amber-700 border-amber-200'
                  }`}
                >
                  {result?.isSafe ? 'Safe Eligibility' : 'At Risk'}
                </span>
              )}
            </div>

            {/* Current vs Projected comparison */}
            <div className="grid grid-cols-2 gap-4 py-2 border-y border-slate-200/80 my-3">
              <div>
                <span className="text-[11px] text-slate-500 font-medium">Current Standing</span>
                <p className="text-xl font-extrabold text-slate-800">
                  {currentSubject.percentage.toFixed(1)}%
                </p>
                <span className="text-[11px] text-slate-500">
                  {currentSubject.attendedClasses} / {currentSubject.totalClasses} classes
                </span>
              </div>

              <div>
                <span className="text-[11px] text-slate-500 font-medium">Projected Attendance</span>
                <div className="flex items-baseline gap-1.5">
                  <p
                    className={`text-2xl font-extrabold ${
                      result?.isSafe ? 'text-emerald-600' : 'text-amber-600'
                    }`}
                  >
                    {result?.projectedPercentage ?? '--'}%
                  </p>
                  <span className="text-xs font-semibold text-slate-500">
                    ({result?.statusChange})
                  </span>
                </div>
                <span className="text-[11px] text-slate-500">
                  {result?.projectedAttended} / {result?.projectedTotal} total classes
                </span>
              </div>
            </div>

            <div className="mt-4">
              <ProgressBar
                value={result?.projectedPercentage || 0}
                threshold={75}
                showLabel={true}
                label="Simulated Projected Percentage"
                size="md"
              />
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-200/80">
            <p className="text-xs text-slate-700 font-medium leading-relaxed">
              {result?.summaryMessage}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
