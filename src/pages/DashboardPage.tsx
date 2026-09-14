import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CalendarCheck,
  Award,
  Clock,
  ClipboardList,
  ShieldAlert,
  Sparkles,
  BookOpen,
  FileText,
  GraduationCap,
  Calculator,
  ArrowRight,
  TrendingUp,
  AlertTriangle,
  HelpCircle
} from 'lucide-react';
import { StatCard } from '../components/common/StatCard';
import { RiskIndicator } from '../components/common/RiskIndicator';
import { TodayTimetableCard } from '../components/dashboard/TodayTimetableCard';
import { AttendanceHealthCard } from '../components/dashboard/AttendanceHealthCard';
import { AcademicPerformanceCard } from '../components/dashboard/AcademicPerformanceCard';
import { AIRecommendationCard } from '../components/dashboard/AIRecommendationCard';
import { UpcomingDeadlinesCard } from '../components/dashboard/UpcomingDeadlinesCard';
import { LoadingState } from '../components/common/LoadingState';

import { attendanceService } from '../services/attendanceService';
import { academicService } from '../services/academicService';
import { riskService } from '../services/riskService';
import { authService } from '../services/authService';
import {
  AttendanceSummary,
  SubjectAttendance,
  TimetableSlot,
  SubjectMarks,
  AcademicRiskReport,
  UserProfile
} from '../types';

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [attendanceSummary, setAttendanceSummary] = useState<AttendanceSummary | null>(null);
  const [subjectAttendance, setSubjectAttendance] = useState<SubjectAttendance[]>([]);
  const [todayClasses, setTodayClasses] = useState<TimetableSlot[]>([]);
  const [marks, setMarks] = useState<SubjectMarks[]>([]);
  const [performanceInsights, setPerformanceInsights] = useState<{ id: string; title: string; message: string }[]>([]);
  const [riskReport, setRiskReport] = useState<AcademicRiskReport | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [u, attSumm, attSubs, tt, mks, mksInsights, risk] = await Promise.all([
          authService.getCurrentUser(),
          attendanceService.getAttendanceSummary(),
          attendanceService.getSubjectAttendance(),
          academicService.getTodayClasses(),
          academicService.getSubjectMarks(),
          academicService.getMarksInsights(),
          riskService.getRiskReport()
        ]);

        setUser(u);
        setAttendanceSummary(attSumm);
        setSubjectAttendance(attSubs);
        setTodayClasses(tt);
        setMarks(mks);
        setPerformanceInsights(mksInsights);
        setRiskReport(risk);
      } catch (err) {
        console.error('Error loading dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading || !attendanceSummary || !riskReport) {
    return <LoadingState message="Loading GL Bajaj CampusOS Dashboard..." subMessage="Syncing attendance metrics and academic records" />;
  }

  return (
    <div className="space-y-6">
      {/* Top Welcome & Context Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              Welcome back, {user?.name.split(' ')[0]} 👋
            </h1>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-800 border border-blue-200">
              {user?.semester}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Department of {user?.department} • Roll No: {user?.rollNumber}
          </p>
        </div>

        <div className="flex items-center gap-3 self-start sm:self-center">
          <div className="text-right hidden sm:block">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Academic Standing
            </span>
            <span className="text-xs font-bold text-emerald-700">Good Standing (78.4% Attendance)</span>
          </div>
          <RiskIndicator level={riskReport.overallRisk} compact />
        </div>
      </div>

      {/* 6 Summary Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        <StatCard
          id="stat-attendance"
          title="Attendance"
          value={`${attendanceSummary.overallPercentage.toFixed(1)}%`}
          subtitle="45 / 58 Sessions"
          icon={CalendarCheck}
          badgeText="At Risk"
          badgeVariant="warning"
          onClick={() => navigate('/attendance')}
        />

        <StatCard
          id="stat-cgpa"
          title="Cumulative CGPA"
          value={user?.cgpa ? user.cgpa.toFixed(2) : '8.65'}
          subtitle="SGPA: 8.82 (Sem V)"
          icon={Award}
          badgeText="Top 10%"
          badgeVariant="safe"
          onClick={() => navigate('/marks')}
        />

        <StatCard
          id="stat-classes"
          title="Today's Classes"
          value="4"
          subtitle="Next: DBMS at 10:00 AM"
          icon={Clock}
          badgeText="1 Completed"
          badgeVariant="neutral"
          onClick={() => navigate('/timetable')}
        />

        <StatCard
          id="stat-assignments"
          title="Pending Tasks"
          value="3"
          subtitle="1 Due Tomorrow"
          icon={ClipboardList}
          badgeText="Action Req."
          badgeVariant="critical"
          onClick={() => navigate('/assignments')}
        />

        <StatCard
          id="stat-risk"
          title="Academic Risk"
          value={riskReport.overallRisk}
          subtitle="Index: 42 / 100"
          icon={ShieldAlert}
          badgeText="Attendance Risk"
          badgeVariant="warning"
          onClick={() => navigate('/academic-risk')}
        />

        <StatCard
          id="stat-credits"
          title="Earned Credits"
          value="118 / 160"
          subtitle="24 in Current Sem"
          icon={GraduationCap}
          badgeText="AKTU Track"
          badgeVariant="accent"
          onClick={() => navigate('/academics')}
        />
      </div>

      {/* AI Recommendation Engine Card */}
      <AIRecommendationCard
        recommendationText="Revise DBMS Normalization for 40 minutes and solve 5 related PYQs."
        subjectCode="KCS-601"
      />

      {/* Quick Action Shortcuts Bar */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-xs">
        <div className="flex items-center justify-between mb-3 px-1">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Quick Action Shortcuts
          </span>
          <span className="text-[11px] text-slate-400">Direct student workflows</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
          <button
            onClick={() => navigate('/copilot')}
            className="flex items-center gap-2 p-2.5 rounded-xl bg-blue-50/70 hover:bg-blue-100/70 border border-blue-200 text-xs font-bold text-blue-900 transition-all text-left"
          >
            <Sparkles className="w-4 h-4 text-blue-600 shrink-0" />
            <span className="truncate">Ask AI Copilot</span>
          </button>

          <button
            onClick={() => navigate('/notes')}
            className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs font-bold text-slate-800 transition-all text-left"
          >
            <FileText className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="truncate">Download Notes</span>
          </button>

          <button
            onClick={() => navigate('/pyqs')}
            className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs font-bold text-slate-800 transition-all text-left"
          >
            <GraduationCap className="w-4 h-4 text-purple-600 shrink-0" />
            <span className="truncate">View AKTU PYQs</span>
          </button>

          <button
            onClick={() => navigate('/timetable')}
            className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs font-bold text-slate-800 transition-all text-left"
          >
            <Clock className="w-4 h-4 text-amber-600 shrink-0" />
            <span className="truncate">Open Timetable</span>
          </button>

          <button
            onClick={() => navigate('/attendance')}
            className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs font-bold text-slate-800 transition-all text-left"
          >
            <Calculator className="w-4 h-4 text-blue-600 shrink-0" />
            <span className="truncate">Attendance Simulator</span>
          </button>
        </div>
      </div>

      {/* Grid: Today's Timetable & Attendance Health */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TodayTimetableCard slots={todayClasses} />
        <AttendanceHealthCard summary={attendanceSummary} subjects={subjectAttendance} />
      </div>

      {/* Grid: Academic Performance & Upcoming Deadlines */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AcademicPerformanceCard subjectMarks={marks} insights={performanceInsights} />
        <UpcomingDeadlinesCard />
      </div>
    </div>
  );
};
