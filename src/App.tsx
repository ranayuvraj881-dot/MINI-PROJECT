import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { DashboardLayout } from './layouts/DashboardLayout';

// Core Pages
import { DashboardPage } from './pages/DashboardPage';
import { AcademicsPage } from './pages/AcademicsPage';
import { AttendancePage } from './pages/AttendancePage';
import { TimetablePage } from './pages/TimetablePage';
import { MarksPage } from './pages/MarksPage';
import { AssignmentsPage } from './pages/AssignmentsPage';
import { NotesPage } from './pages/NotesPage';
import { PYQsPage } from './pages/PYQsPage';
import { PYQAnalyzerPage } from './pages/PYQAnalyzerPage';
import { CopilotPage } from './pages/CopilotPage';
import { StudyPlannerPage } from './pages/StudyPlannerPage';
import { AcademicRiskPage } from './pages/AcademicRiskPage';
import { ExamsPage } from './pages/ExamsPage';
import { NotificationsPage } from './pages/NotificationsPage';
import { ProfilePage } from './pages/ProfilePage';
import { SettingsPage } from './pages/SettingsPage';
import { FacultyDashboardPage } from './pages/FacultyDashboardPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { LoginPage } from './pages/LoginPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Standalone Login & Role Select */}
        <Route path="/login" element={<LoginPage />} />

        {/* Protected Dashboard Shell with Unified Layout */}
        <Route path="/" element={<DashboardLayout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="academics" element={<AcademicsPage />} />
          <Route path="attendance" element={<AttendancePage />} />
          <Route path="timetable" element={<TimetablePage />} />
          <Route path="marks" element={<MarksPage />} />
          <Route path="assignments" element={<AssignmentsPage />} />
          <Route path="notes" element={<NotesPage />} />
          <Route path="pyqs" element={<PYQsPage />} />
          <Route path="pyq-analyzer" element={<PYQAnalyzerPage />} />
          <Route path="copilot" element={<CopilotPage />} />
          <Route path="study-planner" element={<StudyPlannerPage />} />
          <Route path="academic-risk" element={<AcademicRiskPage />} />
          <Route path="exams" element={<ExamsPage />} />
          <Route path="notifications" element={<NotificationsPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="settings" element={<SettingsPage />} />

          {/* Role-Specific Consoles */}
          <Route path="faculty" element={<FacultyDashboardPage />} />
          <Route path="admin" element={<AdminDashboardPage />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
