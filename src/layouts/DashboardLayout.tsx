import React, { useState, useEffect } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  BookOpen,
  CalendarCheck,
  Clock,
  Award,
  ClipboardList,
  FileText,
  GraduationCap,
  Calendar,
  Sparkles,
  CalendarDays,
  LineChart,
  ShieldAlert,
  Bell,
  User,
  Settings,
  HelpCircle,
  LogOut,
  Menu,
  X,
  Search,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  School,
  ExternalLink,
  Users,
  Building2,
  AlertTriangle,
  Plus,
  Compass,
  Layers,
  Phone,
  Mail,
  Globe
} from 'lucide-react';
import { CollegeBrand } from '../components/common/CollegeBrand';
import { SearchCommand } from '../components/common/SearchCommand';
import { authService } from '../services/authService';
import { UserProfile } from '../types';

export const DashboardLayout: React.FC = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [unreadCount, setUnreadCount] = useState(3);
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const load = async () => {
      try {
        const user = await authService.getCurrentUser();
        setCurrentUser(user);
      } catch (err) {
        try {
          // Auto-initialize demo student credentials so all sections work immediately
          const user = await authService.login('GLB21CS0892', 'password123', 'student');
          setCurrentUser(user);
        } catch {
          navigate('/login');
        }
      }
    };
    load();
  }, [navigate]);

  // Keyboard shortcut for Cmd/Ctrl + K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const handleRoleChange = async (role: 'student' | 'faculty' | 'admin') => {
    const updated = await authService.switchRole(role);
    setCurrentUser(updated);
    setRoleMenuOpen(false);
    if (role === 'faculty') navigate('/faculty');
    else if (role === 'admin') navigate('/admin');
    else navigate('/dashboard');
  };

  const handleLogout = async () => {
    await authService.logout();
    navigate('/login');
  };

  const currentRole = currentUser?.role || 'student';

  // Navigation Items
  const studentNavItems = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'My Academics', path: '/academics', icon: BookOpen },
    { label: 'Attendance', path: '/attendance', icon: CalendarCheck, badge: '78.4%' },
    { label: 'Timetable', path: '/timetable', icon: Clock },
    { label: 'Marks', path: '/marks', icon: Award },
    { label: 'Assignments', path: '/assignments', icon: ClipboardList, badge: '3 Due' },
    { label: 'Notes', path: '/notes', icon: FileText },
    { label: 'PYQs', path: '/pyqs', icon: GraduationCap },
    { label: 'Exams', path: '/exams', icon: Calendar },
    { section: 'AI Intelligence Suite' },
    { label: 'AI Academic Copilot', path: '/copilot', icon: Sparkles, highlight: true },
    { label: 'AI Study Planner', path: '/study-planner', icon: CalendarDays, highlight: true },
    { label: 'AI PYQ Analyzer', path: '/pyq-analyzer', icon: LineChart, highlight: true },
    { label: 'Academic Risk', path: '/academic-risk', icon: ShieldAlert, badge: 'Medium' },
    { section: 'Account & Settings' },
    { label: 'Notifications', path: '/notifications', icon: Bell, badgeCount: unreadCount },
    { label: 'Profile', path: '/profile', icon: User },
    { label: 'Settings', path: '/settings', icon: Settings }
  ];

  const facultyNavItems = [
    { label: 'Faculty Dashboard', path: '/faculty', icon: LayoutDashboard },
    { label: 'My Classes', path: '/academics', icon: BookOpen },
    { label: 'Attendance', path: '/attendance', icon: CalendarCheck },
    { label: 'Students Roster', path: '/faculty#students', icon: Users },
    { label: 'Marks & Grading', path: '/marks', icon: Award },
    { label: 'Assignments', path: '/assignments', icon: ClipboardList },
    { label: 'Notes Uploads', path: '/notes', icon: FileText },
    { label: 'PYQ Database', path: '/pyqs', icon: GraduationCap },
    { label: 'AI Risk Diagnostics', path: '/academic-risk', icon: Sparkles, highlight: true },
    { section: 'Account' },
    { label: 'Notifications', path: '/notifications', icon: Bell },
    { label: 'Profile', path: '/profile', icon: User },
    { label: 'Settings', path: '/settings', icon: Settings }
  ];

  const adminNavItems = [
    { label: 'Institutional Console', path: '/admin', icon: LayoutDashboard },
    { label: 'Academic Registry', path: '/academics', icon: BookOpen },
    { label: 'Campus Attendance', path: '/attendance', icon: CalendarCheck },
    { label: 'Departments & Courses', path: '/admin', icon: Building2 },
    { label: 'AI Risk Analytics', path: '/admin', icon: Sparkles, highlight: true },
    { label: 'Notifications', path: '/notifications', icon: Bell },
    { label: 'System Settings', path: '/settings', icon: Settings }
  ];

  const activeNavItems =
    currentRole === 'faculty'
      ? facultyNavItems
      : currentRole === 'admin'
      ? adminNavItems
      : studentNavItems;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#EEF2FB] via-[#E8EDFA] to-[#FDF4EA] flex flex-col font-sans text-slate-800 antialiased selection:bg-indigo-600 selection:text-white">
      {/* Topmost Micro-Utility Line (Inspired by modern enterprise OS header) */}
      <div className="hidden md:flex items-center justify-between px-6 py-1.5 text-[11px] font-medium text-slate-500 bg-white/40 backdrop-blur-sm border-b border-slate-200/50">
        <div className="flex items-center gap-4">
          <a
            href="https://glbitm.org"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 hover:text-indigo-600 transition-colors"
          >
            <Globe className="w-3 h-3 text-slate-400" />
            <span>glbitm.org</span>
          </a>
          <span className="text-slate-300">•</span>
          <span className="flex items-center gap-1.5">
            <Mail className="w-3 h-3 text-slate-400" />
            <span>info@glbitm.ac.in</span>
          </span>
          <span className="text-slate-300">•</span>
          <span className="flex items-center gap-1.5">
            <Phone className="w-3 h-3 text-slate-400" />
            <span>+91 120 2323818</span>
          </span>
        </div>

        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-indigo-50/80 text-indigo-700 font-bold border border-indigo-200/60 text-[10px]">
            <Sparkles className="w-2.5 h-2.5 text-indigo-500" /> Assistant v2.6
          </span>
          <span className="text-slate-400">Daily CampusOS</span>
        </div>
      </div>

      {/* Main Glass Header */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-slate-200/80 h-16 flex items-center justify-between px-4 lg:px-6 shadow-[0_4px_20px_-4px_rgba(79,70,229,0.03)]">
        <div className="flex items-center gap-3">
          {/* Mobile menu trigger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-white/80 border border-slate-200/60"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          {/* College Branding with Official Emblem */}
          <CollegeBrand variant="header" />
        </div>

        {/* Global Search Bar (Nixtio style rounded pill) */}
        <div className="hidden md:flex items-center flex-1 max-w-md mx-6">
          <button
            onClick={() => setIsSearchOpen(true)}
            className="w-full flex items-center justify-between px-4 py-2 rounded-full bg-white/80 hover:bg-white border border-slate-200 text-xs text-slate-500 transition-all shadow-[0_2px_8px_rgba(0,0,0,0.02)] hover:border-indigo-300 hover:shadow-xs group"
          >
            <div className="flex items-center gap-2.5">
              <Search className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 transition-colors" />
              <span className="font-medium text-slate-500">Search notes, PYQs, courses, faculty...</span>
            </div>
            <kbd className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 font-semibold border border-slate-200">
              Ctrl + K
            </kbd>
          </button>
        </div>

        {/* Right Actions & Profile */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Mobile Search Button */}
          <button
            onClick={() => setIsSearchOpen(true)}
            className="md:hidden p-2 rounded-xl text-slate-600 hover:bg-white/80 border border-slate-200/60"
            title="Search"
          >
            <Search className="w-5 h-5" />
          </button>

          {/* Quick AI Copilot Action Pill */}
          <button
            onClick={() => navigate('/copilot')}
            className="hidden sm:inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900 text-white hover:bg-slate-800 text-xs font-bold shadow-md hover:shadow-lg transition-all hover:scale-102"
            title="Open Campus AI Copilot"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
            <span>Campus AI</span>
          </button>

          {/* Notifications Shortcut */}
          <button
            onClick={() => navigate('/notifications')}
            className="relative p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-white/80 transition-colors border border-transparent hover:border-slate-200"
            title="Notifications"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-indigo-600 ring-2 ring-white" />
            )}
          </button>

          {/* Role Switcher & User Profile Pill */}
          <div className="relative">
            <button
              onClick={() => setRoleMenuOpen(!roleMenuOpen)}
              className="flex items-center gap-2.5 p-1.5 sm:px-3 sm:py-1.5 rounded-full border border-slate-200/80 bg-white/90 hover:bg-white transition-all shadow-xs"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-600 to-blue-600 text-white font-bold flex items-center justify-center text-xs shadow-xs shrink-0 overflow-hidden">
                <img
                  src="/glb-logo.png"
                  alt="GLB Emblem"
                  className="w-full h-full object-contain p-0.5"
                />
              </div>

              <div className="hidden lg:flex flex-col text-left leading-tight pr-1">
                <span className="text-xs font-bold text-slate-900 truncate max-w-[130px]">
                  {currentUser?.name || 'User'}
                </span>
                <span className="text-[10px] text-indigo-600 font-semibold uppercase tracking-wider">
                  {currentUser?.semester || currentUser?.role}
                </span>
              </div>
            </button>

            {/* Role Switcher Menu */}
            {roleMenuOpen && (
              <div
                className="absolute right-0 mt-2 w-64 bg-white/95 backdrop-blur-xl rounded-2xl shadow-xl border border-slate-200/90 py-2 z-50 animate-in fade-in zoom-in-95 duration-100"
                onClick={() => setRoleMenuOpen(false)}
              >
                <div className="px-4 py-3 border-b border-slate-100 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white p-1 border border-slate-200 shadow-xs shrink-0">
                    <img src="/glb-logo.png" alt="GLB" className="w-full h-full object-contain" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-slate-900 truncate">{currentUser?.name}</p>
                    <p className="text-[11px] text-slate-500 truncate">{currentUser?.email}</p>
                    <span className="inline-block mt-0.5 text-[9px] font-mono px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 font-bold border border-indigo-200">
                      Role: {currentRole.toUpperCase()}
                    </span>
                  </div>
                </div>

                <div className="p-1.5">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 py-1">
                    Switch Active Portal
                  </p>
                  <button
                    onClick={() => handleRoleChange('student')}
                    className={`w-full text-left px-3 py-2 text-xs rounded-xl font-semibold flex items-center justify-between ${
                      currentRole === 'student' ? 'bg-indigo-50 text-indigo-700 font-bold' : 'hover:bg-slate-100 text-slate-700'
                    }`}
                  >
                    <span>Student Experience</span>
                    {currentRole === 'student' && <span className="text-indigo-600 font-bold">✓</span>}
                  </button>
                  <button
                    onClick={() => handleRoleChange('faculty')}
                    className={`w-full text-left px-3 py-2 text-xs rounded-xl font-semibold flex items-center justify-between ${
                      currentRole === 'faculty' ? 'bg-indigo-50 text-indigo-700 font-bold' : 'hover:bg-slate-100 text-slate-700'
                    }`}
                  >
                    <span>Faculty Portal</span>
                    {currentRole === 'faculty' && <span className="text-indigo-600 font-bold">✓</span>}
                  </button>
                  <button
                    onClick={() => handleRoleChange('admin')}
                    className={`w-full text-left px-3 py-2 text-xs rounded-xl font-semibold flex items-center justify-between ${
                      currentRole === 'admin' ? 'bg-indigo-50 text-indigo-700 font-bold' : 'hover:bg-slate-100 text-slate-700'
                    }`}
                  >
                    <span>Admin Institutional View</span>
                    {currentRole === 'admin' && <span className="text-indigo-600 font-bold">✓</span>}
                  </button>
                </div>

                <div className="pt-1 border-t border-slate-100 px-1">
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-xl flex items-center gap-2"
                  >
                    <LogOut className="w-3.5 h-3.5" /> Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main App Layout Shell */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar / Floating Pill Dock (Desktop) */}
        <aside
          className={`hidden lg:flex flex-col bg-white/70 backdrop-blur-xl border-r border-slate-200/80 transition-all duration-300 z-30 shrink-0 ${
            sidebarCollapsed ? 'w-20' : 'w-64'
          }`}
        >
          {/* Quick Create '+' Action (Matches Image 1 top dock button) */}
          <div className="p-3 border-b border-slate-100/80">
            <button
              onClick={() => navigate('/copilot')}
              className={`w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-md hover:shadow-lg transition-all hover:scale-102 ${
                sidebarCollapsed ? 'px-0 h-10 w-10 mx-auto' : ''
              }`}
              title="New AI Copilot Session"
            >
              <Plus className="w-4 h-4 shrink-0 text-white" />
              {!sidebarCollapsed && <span>New Session</span>}
            </button>
          </div>

          {/* Navigation Items List */}
          <div className="flex-1 overflow-y-auto py-3 px-3 space-y-1">
            {activeNavItems.map((item, idx) => {
              if (item.section) {
                if (sidebarCollapsed) return <div key={idx} className="my-2 border-t border-slate-200/80" />;
                return (
                  <p
                    key={idx}
                    className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3 pt-3 pb-1"
                  >
                    {item.section}
                  </p>
                );
              }

              const Icon = item.icon!;
              return (
                <NavLink
                  key={idx}
                  to={item.path!}
                  className={({ isActive }) =>
                    `flex items-center justify-between px-3 py-2 rounded-2xl text-xs font-semibold transition-all group ${
                      isActive
                        ? 'bg-slate-900 text-white shadow-sm'
                        : item.highlight
                        ? 'bg-indigo-50/80 text-indigo-900 hover:bg-indigo-100/90 border border-indigo-200/60 font-bold'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-white/80'
                    } ${sidebarCollapsed ? 'justify-center px-2 py-2.5' : ''}`
                  }
                  title={sidebarCollapsed ? item.label : undefined}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <Icon
                      className={`w-4 h-4 shrink-0 ${
                        item.highlight ? 'text-indigo-600 group-hover:text-indigo-700' : ''
                      }`}
                    />
                    {!sidebarCollapsed && <span className="truncate">{item.label}</span>}
                  </div>

                  {!sidebarCollapsed && item.badge && (
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200/60">
                      {item.badge}
                    </span>
                  )}

                  {!sidebarCollapsed && item.badgeCount && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-600 text-white">
                      {item.badgeCount}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </div>

          {/* Bottom Sidebar Footer */}
          <div className="p-3 border-t border-slate-200/80 space-y-1 bg-white/40">
            <button
              onClick={() => navigate('/settings')}
              className={`w-full flex items-center gap-3 px-3 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-white/80 rounded-xl transition-colors ${
                sidebarCollapsed ? 'justify-center px-2' : ''
              }`}
            >
              <HelpCircle className="w-4 h-4" />
              {!sidebarCollapsed && <span>Help &amp; Settings</span>}
            </button>

            {/* Collapse toggle button */}
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="w-full mt-1 py-1.5 flex items-center justify-center text-slate-400 hover:text-slate-600 rounded-xl hover:bg-white/80 text-xs transition-colors"
              title={sidebarCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
            >
              {sidebarCollapsed ? (
                <ChevronRight className="w-4 h-4" />
              ) : (
                <div className="flex items-center gap-1">
                  <ChevronLeft className="w-4 h-4" />
                  <span className="text-[11px]">Collapse</span>
                </div>
              )}
            </button>
          </div>
        </aside>

        {/* Mobile Slide-over Drawer */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 lg:hidden flex">
            <div
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm"
              onClick={() => setMobileMenuOpen(false)}
            />
            <div className="relative w-72 max-w-[85vw] bg-white h-full flex flex-col z-10 shadow-2xl">
              <div className="p-4 border-b border-slate-200 flex items-center justify-between">
                <CollegeBrand variant="sidebar" />
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1 rounded-xl text-slate-400 hover:text-slate-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-3 space-y-1">
                {activeNavItems.map((item, idx) => {
                  if (item.section) {
                    return (
                      <p
                        key={idx}
                        className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3 pt-3 pb-1"
                      >
                        {item.section}
                      </p>
                    );
                  }
                  const Icon = item.icon!;
                  return (
                    <NavLink
                      key={idx}
                      to={item.path!}
                      onClick={() => setMobileMenuOpen(false)}
                      className={({ isActive }) =>
                        `flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-semibold ${
                          isActive
                            ? 'bg-slate-900 text-white font-bold'
                            : item.highlight
                            ? 'bg-indigo-50 text-indigo-900 font-bold'
                            : 'text-slate-700 hover:bg-slate-100'
                        }`
                      }
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="w-4 h-4" />
                        <span>{item.label}</span>
                      </div>
                      {item.badge && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-bold">
                          {item.badge}
                        </span>
                      )}
                    </NavLink>
                  );
                })}
              </div>

              <div className="p-4 border-t border-slate-200 space-y-2">
                <button
                  onClick={handleLogout}
                  className="w-full py-2 px-3 text-xs font-semibold text-rose-600 bg-rose-50 rounded-xl flex items-center justify-center gap-2"
                >
                  <LogOut className="w-4 h-4" /> Logout
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Content Area - Elevated Frosted Workspace */}
        <main className="flex-1 overflow-y-auto p-3 sm:p-5 lg:p-6 min-h-0">
          <div className="max-w-[1400px] mx-auto pb-12">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Global Command Palette */}
      <SearchCommand isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </div>
  );
};
