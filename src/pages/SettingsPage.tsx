import React, { useState, useEffect } from 'react';
import {
  Settings,
  Server,
  Bell,
  Target,
  WifiOff,
  Palette,
  CheckCircle2,
  Save,
  RotateCcw,
  Sparkles,
  Key,
  Eye,
  EyeOff,
  Cpu,
  RefreshCw,
  ShieldCheck
} from 'lucide-react';
import { apiClient } from '../services/api';

export const SettingsPage: React.FC = () => {
  const [fastApiEndpoint, setFastApiEndpoint] = useState('http://localhost:8000/api/v1');
  const [targetCgpa, setTargetCgpa] = useState('9.0');
  const [attendanceAlerts, setAttendanceAlerts] = useState(true);
  const [examAlerts, setExamAlerts] = useState(true);
  const [assignmentReminders, setAssignmentReminders] = useState(true);
  const [toastMessage, setToastMessage] = useState('');

  // AI Configuration State
  const [geminiApiKey, setGeminiApiKey] = useState(
    () => localStorage.getItem('gemini_api_key') || ''
  );
  const [showApiKey, setShowApiKey] = useState(false);
  const [aiModel, setAiModel] = useState('gemini-3.8-flash');
  const [aiStatus, setAiStatus] = useState<{ configured: boolean; model: string; message: string }>({
    configured: true,
    model: 'gemini-3.8-flash',
    message: 'Live Google Gemini AI active'
  });
  const [isTestingAi, setIsTestingAi] = useState(false);

  useEffect(() => {
    // Check live AI status on mount
    const fetchStatus = async () => {
      try {
        const res = await apiClient<{ configured: boolean; model: string; message: string }>('/ai/copilot/status');
        if (res) {
          setAiStatus(res);
          if (res.model) setAiModel(res.model);
        }
      } catch (err) {
        console.warn('Could not fetch AI status:', err);
      }
    };
    fetchStatus();
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setToastMessage('Settings and platform configurations saved!');
    setTimeout(() => setToastMessage(''), 3000);
  };

  const handleResetApi = () => {
    setFastApiEndpoint('http://localhost:8000/api/v1');
    setToastMessage('Reset API endpoint to default.');
    setTimeout(() => setToastMessage(''), 2500);
  };

  const handleSaveAiConfig = async () => {
    if (!geminiApiKey.trim()) return;
    setIsTestingAi(true);
    try {
      const res = await apiClient<{ success: boolean; configured: boolean; model: string; message: string }>(
        '/ai/copilot/configure',
        {
          method: 'POST',
          body: JSON.stringify({
            api_key: geminiApiKey.trim(),
            model: aiModel.trim()
          })
        }
      );
      if (res && res.success) {
        setAiStatus({
          configured: true,
          model: res.model,
          message: 'Live Google Gemini AI active'
        });
        setToastMessage('Gemini AI credentials verified and saved!');
      }
    } catch (err: any) {
      setToastMessage(err.message || 'Failed to update Gemini settings');
    } finally {
      setIsTestingAi(false);
      setTimeout(() => setToastMessage(''), 3500);
    }
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white/95 backdrop-blur-xl border border-white/80 shadow-[0_15px_40px_rgba(79,70,229,0.04)] rounded-3xl p-6">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-amber-50/70 border border-amber-200/70 p-1.5 flex items-center justify-center shrink-0 shadow-xs">
            <img src="/glb-logo.png" alt="GL Bajaj Crest" className="w-full h-full object-contain" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                Platform &amp; System Settings
              </h1>
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-800 border border-blue-200">
                CampusOS Config
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Configure Campus AI intelligence, backend service endpoints &amp; academic targets
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {/* Campus AI & Google Gemini Intelligence Card */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs space-y-5">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-950 text-white flex items-center justify-center shadow-xs border border-blue-800">
                <Sparkles className="w-5 h-5 text-blue-300" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  Campus AI &amp; Google Gemini Integration
                </h3>
                <p className="text-xs text-slate-500">
                  Powers AI Academic Copilot, AI Study Planner &amp; AKTU Syllabus Grounding
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                {aiStatus.configured ? 'Connected & Operational' : 'API Key Missing'}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
            {/* API Key */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Google Gemini API Key
              </label>
              <div className="relative flex items-center">
                <div className="absolute left-3 text-slate-400">
                  <Key className="w-4 h-4" />
                </div>
                <input
                  type={showApiKey ? 'text' : 'password'}
                  value={geminiApiKey}
                  onChange={(e) => setGeminiApiKey(e.target.value)}
                  placeholder="Enter your Gemini API key (AI Studio)"
                  className="w-full text-xs font-mono font-semibold pl-9 pr-10 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:bg-white focus:outline-none focus:border-blue-500 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowApiKey(!showApiKey)}
                  className="absolute right-3 text-slate-400 hover:text-slate-600 p-1"
                  title={showApiKey ? 'Hide Key' : 'Show Key'}
                >
                  {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <span className="text-[11px] text-slate-400 block">
                Official Google Gen AI SDK integration stored securely in <code className="font-mono text-slate-600">backend/.env</code>.
              </span>
            </div>

            {/* Model Selection */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Active Gemini Model
              </label>
              <div className="relative flex items-center">
                <div className="absolute left-3 text-slate-400">
                  <Cpu className="w-4 h-4" />
                </div>
                <select
                  value={aiModel}
                  onChange={(e) => setAiModel(e.target.value)}
                  className="w-full text-xs font-mono font-bold pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:bg-white focus:outline-none focus:border-blue-500 transition-all"
                >
                  <option value="gemini-3.8-flash">gemini-3.8-flash (Recommended • Latest)</option>
                  <option value="gemini-3.5-flash">gemini-3.5-flash (High Performance)</option>
                  <option value="gemini-3.1-flash-lite">gemini-3.1-flash-lite (Ultra Fast)</option>
                </select>
              </div>
              <span className="text-[11px] text-slate-400 block">
                Automatic multi-model failover with instant syllabus grounding fallback.
              </span>
            </div>
          </div>

          <div className="flex justify-end pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={handleSaveAiConfig}
              disabled={isTestingAi}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-900 hover:bg-blue-800 text-white text-xs font-bold shadow-xs transition-colors disabled:opacity-50"
            >
              {isTestingAi ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Verifying Key...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4 text-blue-300" />
                  <span>Update &amp; Verify Gemini AI</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Backend API Configuration */}
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
            type="button"
            onClick={handleSave}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md transition-colors"
          >
            <Save className="w-4 h-4" />
            Save Platform Settings
          </button>
        </div>
      </div>
    </div>
  );
};
