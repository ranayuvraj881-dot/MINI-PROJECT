import React, { useState } from 'react';
import {
  Settings,
  Server,
  Bell,
  Target,
  WifiOff,
  Palette,
  CheckCircle2,
  Save,
  RotateCcw
} from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const [fastApiEndpoint, setFastApiEndpoint] = useState('http://localhost:8000/api/v1');
  const [targetCgpa, setTargetCgpa] = useState('9.0');
  const [attendanceAlerts, setAttendanceAlerts] = useState(true);
  const [examAlerts, setExamAlerts] = useState(true);
  const [assignmentReminders, setAssignmentReminders] = useState(true);
  const [offlineCapability, setOfflineCapability] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setToastMessage('Settings and API configuration saved!');
    setTimeout(() => setToastMessage(''), 3000);
  };

  const handleResetApi = () => {
    setFastApiEndpoint('http://localhost:8000/api/v1');
    setToastMessage('Reset API endpoint to default.');
    setTimeout(() => setToastMessage(''), 2500);
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              Platform &amp; System Settings
            </h1>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-800 border border-blue-200">
              CampusOS Config
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Configure backend service endpoints, academic targets &amp; notification triggers
          </p>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Backend API Configuration (FastAPI Integration Ready) */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2">
            <Server className="w-5 h-5 text-blue-600" />
            <h3 className="text-base font-bold text-slate-900">Backend API Connectivity</h3>
          </div>
          <p className="text-xs text-slate-500">
            GL Bajaj CampusOS frontend service abstraction connects directly to this base URL for all queries.
          </p>

          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              FastAPI Gateway Base URL
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={fastApiEndpoint}
                onChange={(e) => setFastApiEndpoint(e.target.value)}
                className="flex-1 text-xs font-mono font-semibold px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-800 focus:outline-none focus:border-blue-500"
                placeholder="http://localhost:8000/api/v1"
              />
              <button
                type="button"
                onClick={handleResetApi}
                className="px-3 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1 transition-colors"
                title="Reset to default"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Reset
              </button>
            </div>
            <span className="text-[11px] text-slate-400 block">
              Toggle between mock data fallback and active FastAPI container seamlessly.
            </span>
          </div>
        </div>

        {/* Academic Target Configuration */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5 text-blue-600" />
            <h3 className="text-base font-bold text-slate-900">Academic Target &amp; Benchmark</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Target CGPA Goal
              </label>
              <input
                type="number"
                step="0.05"
                min="6.0"
                max="10.0"
                value={targetCgpa}
                onChange={(e) => setTargetCgpa(e.target.value)}
                className="w-full text-xs font-mono font-bold px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-800 focus:outline-none focus:border-blue-500"
              />
              <span className="text-[11px] text-slate-400 mt-1 block">
                Calibrates AI Study Planner intensity and risk thresholds.
              </span>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Minimum Attendance Safety Margin
              </label>
              <input
                type="text"
                disabled
                defaultValue="75.0% (AKTU Statutory Minimum)"
                className="w-full text-xs font-semibold px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-100 text-slate-500 cursor-not-allowed"
              />
            </div>
          </div>
        </div>

        {/* Notification Preferences */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-blue-600" />
            <h3 className="text-base font-bold text-slate-900">Notification Triggers</h3>
          </div>

          <div className="space-y-3">
            <label className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 cursor-pointer">
              <div>
                <span className="text-xs font-bold text-slate-800 block">
                  Critical Attendance Warnings
                </span>
                <span className="text-[11px] text-slate-500">
                  Notify when any course attendance drops below 76%
                </span>
              </div>
              <input
                type="checkbox"
                checked={attendanceAlerts}
                onChange={(e) => setAttendanceAlerts(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded accent-blue-600"
              />
            </label>

            <label className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 cursor-pointer">
              <div>
                <span className="text-xs font-bold text-slate-800 block">
                  Upcoming Exam Reminders
                </span>
                <span className="text-[11px] text-slate-500">
                  Receive alerts 48h prior to Sessional / PUT sessions
                </span>
              </div>
              <input
                type="checkbox"
                checked={examAlerts}
                onChange={(e) => setExamAlerts(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded accent-blue-600"
              />
            </label>

            <label className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 cursor-pointer">
              <div>
                <span className="text-xs font-bold text-slate-800 block">
                  Assignment Due Reminders
                </span>
                <span className="text-[11px] text-slate-500">
                  Daily reminder for submissions due within 24 hours
                </span>
              </div>
              <input
                type="checkbox"
                checked={assignmentReminders}
                onChange={(e) => setAssignmentReminders(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded accent-blue-600"
              />
            </label>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md transition-colors"
          >
            <Save className="w-4 h-4" />
            Save Platform Settings
          </button>
        </div>
      </form>
    </div>
  );
};
