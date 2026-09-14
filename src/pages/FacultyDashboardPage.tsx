import React, { useState, useEffect } from 'react';
import { analyticsService } from '../services/analyticsService';
import { FacultyClassOverview, StudentAttentionItem } from '../types';
import { LoadingState } from '../components/common/LoadingState';
import { Modal } from '../components/common/Modal';
import {
  Users,
  CalendarCheck,
  UploadCloud,
  FilePlus,
  TrendingDown,
  AlertTriangle,
  Sparkles,
  BookOpen,
  Clock,
  CheckCircle2,
  Check,
  ChevronRight
} from 'lucide-react';
import { ProgressBar } from '../components/common/ProgressBar';

export const FacultyDashboardPage: React.FC = () => {
  const [data, setData] = useState<{
    classes: FacultyClassOverview[];
    stats: any;
    attentionStudents: StudentAttentionItem[];
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeQuickActionModal, setActiveQuickActionModal] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const res = await analyticsService.getFacultyOverview();
        setData(res);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading || !data) {
    return <LoadingState message="Loading Faculty Portal..." subMessage="Fetching enrolled cohorts, syllabus progress and attendance logs" />;
  }

  const handleActionComplete = (msg: string) => {
    setActiveQuickActionModal(null);
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-xl flex items-center gap-2 text-xs font-semibold animate-in fade-in duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                Faculty Academic Console
              </h1>
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-900 border border-blue-200">
                Dr. Sanjeev Sharma • CSE Dept
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Classroom orchestration, continuous evaluation &amp; cohort risk interventions
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveQuickActionModal('attendance')}
              className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors"
            >
              <CalendarCheck className="w-4 h-4" />
              Mark Attendance
            </button>
            <button
              onClick={() => setActiveQuickActionModal('notes')}
              className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition-colors"
            >
              <UploadCloud className="w-4 h-4" />
              Upload Notes
            </button>
            <button
              onClick={() => setActiveQuickActionModal('assignment')}
              className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition-colors"
            >
              <FilePlus className="w-4 h-4" />
              New Assignment
            </button>
          </div>
        </div>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Students</span>
          <p className="text-2xl font-black text-slate-900">{data.stats.totalStudents}</p>
          <span className="text-[11px] text-slate-500">Across 3 class sections</span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Average Attendance</span>
          <p className="text-2xl font-black text-slate-900">{data.stats.averageAttendance}%</p>
          <span className="text-[11px] text-amber-600 font-semibold">-4% drop this week in 3B</span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Pending Submissions</span>
          <p className="text-2xl font-black text-slate-900">{data.stats.pendingSubmissionsToGrade}</p>
          <span className="text-[11px] text-blue-700 font-semibold">DBMS Normalization</span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">At-Risk Students</span>
          <p className="text-2xl font-black text-rose-600">{data.stats.studentsAtRisk}</p>
          <span className="text-[11px] text-rose-600 font-semibold">Requires faculty attention</span>
        </div>
      </div>

      {/* AI Class Insights Banner */}
      <div className="bg-gradient-to-r from-blue-950 via-indigo-950 to-slate-950 text-white rounded-2xl p-6 shadow-md border border-blue-800/80 space-y-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-blue-300 animate-pulse" />
          <h3 className="text-sm font-bold uppercase tracking-wider text-blue-200">
            Campus AI Classroom Insights
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
          <div className="p-3.5 rounded-xl bg-blue-900/40 border border-blue-700/50 text-xs text-blue-100">
            <strong className="text-white block mb-1">Attendance Anomaly:</strong>
            "Class 3B average attendance dropped by 4% this week following the holi break. 8 students risk falling below 75% before Sessional II."
          </div>
          <div className="p-3.5 rounded-xl bg-blue-900/40 border border-blue-700/50 text-xs text-blue-100">
            <strong className="text-white block mb-1">CIE Question Difficulty Analysis:</strong>
            "34% of students struggled with Question 3 (Lossless BCNF Decomposition) on Sessional 1. Recommended remedial review lecture."
          </div>
        </div>
      </div>

      {/* Classes I Teach Grid */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900">Assigned Cohorts &amp; Classes</h3>
            <p className="text-xs text-slate-500">Current active teaching assignments for Odd Sem 2026</p>
          </div>
          <span className="text-xs font-bold px-3 py-1 rounded-lg bg-slate-100 text-slate-700">
            {data.classes.length} Classes
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {data.classes.map((cls) => (
            <div
              key={cls.id}
              className="p-5 rounded-2xl border border-slate-200/80 bg-slate-50/50 hover:bg-slate-50 transition-all space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                  {cls.subjectCode}
                </span>
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-slate-200 text-slate-700">
                  {cls.section}
                </span>
              </div>

              <div>
                <h4 className="text-sm font-bold text-slate-900">{cls.subjectName}</h4>
                <p className="text-xs text-slate-500 mt-0.5">{cls.totalStudents} Enrolled Students</p>
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-200/60">
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-500">Avg Attendance</span>
                    <span className="font-bold text-slate-900">{cls.averageAttendance}%</span>
                  </div>
                  <ProgressBar value={cls.averageAttendance} threshold={75} size="sm" />
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-500">Syllabus Complete</span>
                    <span className="font-bold text-slate-900">{cls.syllabusCompleted}%</span>
                  </div>
                  <ProgressBar value={cls.syllabusCompleted} threshold={100} size="sm" variant="blue" />
                </div>
              </div>

              <div className="pt-2 text-xs text-slate-600 flex items-center justify-between">
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  Next: {cls.nextClassTime}
                </span>
                <span className="text-blue-600 font-semibold">{cls.room}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Students Requiring Attention Table */}
      <div id="students" className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs overflow-hidden">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-600" />
            <div>
              <h3 className="text-base font-bold text-slate-900">Students Requiring Faculty Attention</h3>
              <p className="text-xs text-slate-500">Critical attendance margin or declining CIE internal marks</p>
            </div>
          </div>
          <span className="text-xs font-bold px-3 py-1 rounded-lg bg-rose-50 text-rose-700 border border-rose-200">
            {data.attentionStudents.length} Flagged
          </span>
        </div>

        <div className="overflow-x-auto -mx-6 px-6">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200/80 text-[11px] font-bold text-slate-400 uppercase tracking-wider bg-slate-50/50">
                <th className="py-3 px-3">Student Name</th>
                <th className="py-3 px-3">Roll Number</th>
                <th className="py-3 px-3">Section</th>
                <th className="py-3 px-3 text-center">Attendance</th>
                <th className="py-3 px-3 text-center">CIE Marks</th>
                <th className="py-3 px-3">Diagnostic Reason</th>
                <th className="py-3 px-3 text-right">Intervention</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {data.attentionStudents.map((st) => (
                <tr key={st.rollNumber} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3.5 px-3 font-bold text-slate-900">{st.name}</td>
                  <td className="py-3.5 px-3 font-mono text-slate-600">{st.rollNumber}</td>
                  <td className="py-3.5 px-3 text-slate-700">{st.section}</td>
                  <td className="py-3.5 px-3 text-center">
                    <span className="font-bold text-rose-600">{st.attendance}%</span>
                  </td>
                  <td className="py-3.5 px-3 text-center font-mono font-semibold text-slate-800">
                    {st.cieMarks} / 30
                  </td>
                  <td className="py-3.5 px-3 text-slate-600 font-medium">{st.reason}</td>
                  <td className="py-3.5 px-3 text-right">
                    <button
                      onClick={() => setToastMessage(`Counseling alert sent to student ${st.name} and mentor.`)}
                      className="px-2.5 py-1 text-xs font-bold text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                    >
                      Send Alert
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Action Modal: Mark Attendance */}
      {activeQuickActionModal === 'attendance' && (
        <Modal
          isOpen={true}
          onClose={() => setActiveQuickActionModal(null)}
          title="Mark Lecture Attendance"
          subtitle="DBMS (KCS-601) • CSE 3B • Today, 10:00 AM"
          maxWidth="lg"
        >
          <div className="space-y-4">
            <p className="text-xs text-slate-600">
              Quickly toggle absent students. Total 68 students present by default.
            </p>
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <div className="flex justify-between text-xs font-semibold">
                <span>Present: 64 Students</span>
                <span className="text-rose-600">Absent: 4 Students</span>
              </div>
              <p className="text-[11px] text-slate-400">
                Absentees flagged: 2201330100042, 2201330100089, 2201330100104, 2201330100118
              </p>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setActiveQuickActionModal(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600"
              >
                Cancel
              </button>
              <button
                onClick={() => handleActionComplete('Attendance submitted for KCS-601 (CSE 3B)!')}
                className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs"
              >
                Confirm &amp; Log to CampusOS
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Quick Action Modal: Upload Notes */}
      {activeQuickActionModal === 'notes' && (
        <Modal
          isOpen={true}
          onClose={() => setActiveQuickActionModal(null)}
          title="Upload Course Resource"
          subtitle="Publish notes, slides, or practical manual to student library"
          maxWidth="lg"
        >
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Resource Title</label>
              <input
                type="text"
                defaultValue="Unit 4: Transaction Processing & ACID Properties"
                className="w-full text-xs font-semibold p-2.5 rounded-xl border border-slate-200"
              />
            </div>
            <div className="border-2 border-dashed border-slate-300 rounded-xl p-6 text-center text-xs text-slate-500">
              Click or drag lecture PDF to upload
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setActiveQuickActionModal(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600"
              >
                Cancel
              </button>
              <button
                onClick={() => handleActionComplete('Notes published to student portal!')}
                className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs"
              >
                Publish Resource
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Quick Action Modal: New Assignment */}
      {activeQuickActionModal === 'assignment' && (
        <Modal
          isOpen={true}
          onClose={() => setActiveQuickActionModal(null)}
          title="Create New Assignment"
          subtitle="Assign problem set and define submission deadline"
          maxWidth="lg"
        >
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Assignment Title</label>
              <input
                type="text"
                defaultValue="Assignment 4: Conflict Serializability & Two-Phase Locking"
                className="w-full text-xs font-semibold p-2.5 rounded-xl border border-slate-200"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Due Date</label>
                <input
                  type="date"
                  defaultValue="2026-03-24"
                  className="w-full text-xs font-semibold p-2.5 rounded-xl border border-slate-200"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Max Marks</label>
                <input
                  type="number"
                  defaultValue={10}
                  className="w-full text-xs font-semibold p-2.5 rounded-xl border border-slate-200"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setActiveQuickActionModal(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600"
              >
                Cancel
              </button>
              <button
                onClick={() => handleActionComplete('Assignment dispatched to class section!')}
                className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs"
              >
                Create Assignment
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
