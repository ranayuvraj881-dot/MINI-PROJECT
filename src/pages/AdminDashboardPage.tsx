import React, { useState, useEffect } from 'react';
import { analyticsService } from '../services/analyticsService';
import { AdminInstitutionalStats } from '../types';
import { LoadingState } from '../components/common/LoadingState';
import {
  Building2,
  Users,
  GraduationCap,
  CalendarCheck,
  ShieldAlert,
  Sparkles,
  TrendingUp,
  BarChart3,
  BookOpen,
  Download
} from 'lucide-react';
import { ProgressBar } from '../components/common/ProgressBar';

export const AdminDashboardPage: React.FC = () => {
  const [adminData, setAdminData] = useState<{
    stats: AdminInstitutionalStats;
    departments: any[];
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const res = await analyticsService.getAdminInstitutionalData();
        setAdminData(res);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading || !adminData) {
    return <LoadingState message="Loading Institutional ERP Command..." subMessage="Aggregating department registries, accreditation metrics & risk distributions" />;
  }

  const { stats, departments } = adminData;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                Institutional Executive Console
              </h1>
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-blue-900 text-white">
                GLBITM Central Administration
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Campus-wide academic metrics, NIRF &amp; NBA compliance benchmarks, and retention diagnostics
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-semibold px-3 py-1 rounded-lg bg-slate-100 text-slate-700 border border-slate-200">
              Academic Year 2025–26
            </span>
          </div>
        </div>
      </div>

      {/* 4 Core Summary Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Enrolled</span>
          <p className="text-2xl font-black text-slate-900">{stats.totalStudents.toLocaleString()}</p>
          <span className="text-[11px] text-slate-500">Across B.Tech, MCA &amp; MBA</span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Teaching Faculty</span>
          <p className="text-2xl font-black text-slate-900">{stats.totalFaculty}</p>
          <span className="text-[11px] text-emerald-600 font-semibold">1:15.8 Student-Faculty Ratio</span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Campus Attendance</span>
          <p className="text-2xl font-black text-slate-900">{stats.averageCollegeAttendance}%</p>
          <span className="text-[11px] text-emerald-600 font-semibold">+2.3% YoY Improvement</span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">At-Risk Students</span>
          <p className="text-2xl font-black text-amber-600">
            {stats.academicRiskDistribution.medium + stats.academicRiskDistribution.high}
          </p>
          <span className="text-[11px] text-slate-500 font-medium">Flagged for faculty counseling</span>
        </div>
      </div>

      {/* AI Institutional Insights Banner */}
      <div className="bg-gradient-to-r from-blue-950 via-indigo-950 to-slate-950 text-white rounded-2xl p-6 shadow-md border border-blue-800/80 space-y-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-blue-300 animate-pulse" />
          <h3 className="text-sm font-bold uppercase tracking-wider text-blue-200">
            Campus AI Institutional Intelligence
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
          <div className="p-3.5 rounded-xl bg-blue-900/40 border border-blue-700/50 text-xs text-blue-100">
            <strong className="text-white block mb-1">Attendance Intervention Impact:</strong>
            "CSE Department attendance increased by 2.3% after automated CampusOS attendance warning notifications were enabled."
          </div>
          <div className="p-3.5 rounded-xl bg-blue-900/40 border border-blue-700/50 text-xs text-blue-100">
            <strong className="text-white block mb-1">Curriculum Risk Vector:</strong>
            "3rd year students have the highest failure risk in Compiler Design (KCS-603). 28% scored below 12 marks on Sessional I."
          </div>
        </div>
      </div>

      {/* Risk Spectrum & Department Comparison Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Risk Distribution Card */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-blue-600" />
            <h3 className="text-base font-bold text-slate-900">Risk Spectrum Distribution</h3>
          </div>
          <p className="text-xs text-slate-500">
            Cohort segmentation based on multivariate academic health index
          </p>

          <div className="space-y-4 pt-2">
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 flex justify-between items-center text-xs">
              <div>
                <span className="font-bold text-emerald-900 block">Safe Category (&gt;75% Att &amp; CIE &gt; 18)</span>
                <span className="text-emerald-700 text-[11px]">{stats.academicRiskDistribution.safe} Students</span>
              </div>
              <span className="font-bold text-emerald-900 font-mono text-sm">76.3%</span>
            </div>

            <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 flex justify-between items-center text-xs">
              <div>
                <span className="font-bold text-amber-900 block">Medium Risk (Borderline Attendance)</span>
                <span className="text-amber-700 text-[11px]">{stats.academicRiskDistribution.medium} Students</span>
              </div>
              <span className="font-bold text-amber-900 font-mono text-sm">17.8%</span>
            </div>

            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 flex justify-between items-center text-xs">
              <div>
                <span className="font-bold text-rose-900 block">Critical Risk (&lt;65% Attendance)</span>
                <span className="text-rose-700 text-[11px]">{stats.academicRiskDistribution.high} Students</span>
              </div>
              <span className="font-bold text-rose-900 font-mono text-sm">5.9%</span>
            </div>
          </div>
        </div>

        {/* Department Performance Table */}
        <div className="lg:col-span-2 bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs overflow-hidden space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-blue-600" />
              <h3 className="text-base font-bold text-slate-900">Department Metrics Matrix</h3>
            </div>
            <span className="text-xs font-semibold text-slate-500">All Engineering Departments</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                  <th className="py-2.5 px-3">Department</th>
                  <th className="py-2.5 px-3 text-center">Students</th>
                  <th className="py-2.5 px-3 text-center">Faculty</th>
                  <th className="py-2.5 px-3 text-center">Attendance</th>
                  <th className="py-2.5 px-3 text-center">Avg CGPA</th>
                  <th className="py-2.5 px-3 text-center">At Risk</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {departments.map((dept) => (
                  <tr key={dept.name} className="hover:bg-slate-50">
                    <td className="py-3 px-3 font-bold text-slate-800">{dept.name}</td>
                    <td className="py-3 px-3 text-center font-mono text-slate-700">{dept.students}</td>
                    <td className="py-3 px-3 text-center font-mono text-slate-700">{dept.faculty}</td>
                    <td className="py-3 px-3 text-center">
                      <span className="font-bold text-slate-900">{dept.attendance}%</span>
                    </td>
                    <td className="py-3 px-3 text-center font-mono font-bold text-blue-800">
                      {dept.cgpaAvg}
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span className="font-bold text-rose-600">{dept.atRiskPercentage}%</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
