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
  AlertTriangle
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
      const user = await authService.getCurrentUser();
      setCurrentUser(user);
    };
    load();
  }, []);

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
    { label: 'Assignments', path: '/assignments', icon: ClipboardList, badge: '3 Pending' },
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
    { label: 'Dashboard', path: '/faculty', icon: LayoutDashboard },
    { label: 'My Classes', path: '/academics', icon: BookOpen },
    { label: 'Attendance', path: '/attendance', icon: CalendarCheck },
    { label: 'Students', path: '/faculty#students', icon: Users },
    { label: 'Marks & Grading', path: '/marks', icon: Award },
    { label: 'Assignments', path: '/assignments', icon: ClipboardList },
    { label: 'Notes Uploads', path: '/notes', icon: FileText },
    { label: 'PYQ Database', path: '/pyqs', icon: GraduationCap },
    { label: 'Analytics', path: '/faculty', icon: LineChart },
    { label: 'AI Insights', path: '/academic-risk', icon: Sparkles, highlight: true },
    { section: 'Account' },
    { label: 'Notifications', path: '/notifications', icon: Bell },
    { label: 'Profile', path: '/profile', icon: User },
    { label: 'Settings', path: '/settings', icon: Settings }
  ];

  const adminNavItems = [
    { label: 'Institutional Dashboard', path: '/admin', icon: LayoutDashboard },
    { label: 'Academic Registry', path: '/academics', icon: BookOpen },
    { label: 'Campus Attendance', path: '/attendance', icon: CalendarCheck },
    { label: 'AI Institutional Insights', path: '/admin', icon: Sparkles, highlight: true },
    { label: 'Departments & Courses', path: '/admin', icon: Building2 },
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
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Top Header / Branding Bar */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/90 h-16 flex items-center justify-between px-4 lg:px-6 shadow-2xs">
        <div className="flex items-center gap-3">
          {/* Mobile menu trigger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          {/* College Branding */}
          <CollegeBrand variant="header" />
        </div>

        {/* Global Search Bar */}
        <div className="hidden md:flex items-center flex-1 max-w-md mx-6">
          <button
            onClick={() => setIsSearchOpen(true)}
            className="w-full flex items-center justify-between px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200/70 border border-slate-200/80 text-xs text-slate-500 transition-colors"
          >
            <div className="flex items-center gap-2">
              <Search className="w-4 h-4 text-slate-400" />
              <span>Search notes, PYQs, courses, faculty...</span>
            </div>
            <kbd className="text-[10px] font-mono px-2 py-0.5 rounded bg-white text-slate-500 font-semibold border border-slate-300 shadow-2xs">
              Ctrl + K
            </kbd>
          </button>
        </div>

        {/* Right Actions & Profile */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Mobile Search Button */}
          <button
            onClick={() => setIsSearchOpen(true)}
            className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100"
            title="Search"
          >
            <Search className="w-5 h-5" />
          </button>

          {/* AI Copilot Shortcut */}
          <button
            onClick={() => navigate('/copilot')}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-950 text-blue-100 hover:bg-blue-900 text-xs font-bold shadow-xs border border-blue-800 transition-all hover:scale-102"
            title="Open Campus AI Copilot"
          >
            <Sparkles className="w-3.5 h-3.5 text-blue-300" />
            <span>Campus AI</span>
          </button>

          {/* Notifications Shortcut */}
          <button
            onClick={() => navigate('/notifications')}
            className="relative p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            title="Notifications"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-blue-600 ring-2 ring-white" />
            )}
          </button>

          {/* Role Switcher Dropdown */}
          <div className="relative">
            <button
              onClick={() => setRoleMenuOpen(!roleMenuOpen)}
              className="flex items-center gap-2.5 p-1.5 sm:px-3 sm:py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 transition-colors"
            >
              <div className="w-8 h-8 rounded-lg bg-blue-900 text-white font-bold flex items-center justify-center text-xs overflow-hidden shrink-0">
                {currentUser?.name.charAt(0) || 'U'}
              </div>

              <div className="hidden lg:flex flex-col text-left leading-tight">
                <span className="text-xs font-bold text-slate-900 truncate max-w-[130px]">
                  {currentUser?.name || 'User'}
                </span>
                <span className="text-[10px] text-blue-700 font-semibold uppercase tracking-wider">
                  {currentUser?.semester || currentUser?.role}
                </span>
              </div>
            </button>

            {/* Role Switcher Menu */}
            {roleMenuOpen && (
              <div
                className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in zoom-in-95 duration-100"
                onClick={() => setRoleMenuOpen(false)}
              >
                <div className="px-4 py-2 border-b border-slate-100">
                  <p className="text-xs font-bold text-slate-900">{currentUser?.name}</p>
                  <p className="text-[11px] text-slate-500 truncate">{currentUser?.email}</p>
                  <span className="inline-block mt-1 text-[10px] font-mono px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-semibold border border-blue-200">
                    Role: {currentRole.toUpperCase()}
                  </span>
                </div>

                <div className="p-1.5">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 py-1">
                    Switch Active Portal
                  </p>
                  <button
                    onClick={() => handleRoleChange('student')}
                    className={`w-full text-left px-3 py-2 text-xs rounded-lg font-semibold flex items-center justify-between ${
                      currentRole === 'student' ? 'bg-blue-50 text-blue-700 font-bold' : 'hover:bg-slate-100 text-slate-700'
                    }`}
                  >
                    <span>Student Experience</span>
                    {currentRole === 'student' && <span className="text-blue-600">✓</span>}
                  </button>
                  <button
                    onClick={() => handleRoleChange('faculty')}
                    className={`w-full text-left px-3 py-2 text-xs rounded-lg font-semibold flex items-center justify-between ${
                      currentRole === 'faculty' ? 'bg-blue-50 text-blue-700 font-bold' : 'hover:bg-slate-100 text-slate-700'
                    }`}
                  >
                    <span>Faculty Portal</span>
                    {currentRole === 'faculty' && <span className="text-blue-600">✓</span>}
                  </button>
                  <button
                    onClick={() => handleRoleChange('admin')}
                    className={`w-full text-left px-3 py-2 text-xs rounded-lg font-semibold flex items-center justify-between ${
                      currentRole === 'admin' ? 'bg-blue-50 text-blue-700 font-bold' : 'hover:bg-slate-100 text-slate-700'
                    }`}
                  >
                    <span>Admin Institutional View</span>
                    {currentRole === 'admin' && <span className="text-blue-600">✓</span>}
                  </button>
                </div>

                <div className="pt-1 border-t border-slate-100 px-1">
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-lg flex items-center gap-2"
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
        {/* Left Sidebar (Desktop) */}
        <aside
          className={`hidden lg:flex flex-col bg-white border-r border-slate-200 transition-all duration-200 z-30 shrink-0 ${
            sidebarCollapsed ? 'w-20' : 'w-64'
          }`}
        >
          {/* Navigation Items List */}
          <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
            {activeNavItems.map((item, idx) => {
              if (item.section) {
                if (sidebarCollapsed) return <div key={idx} className="my-3 border-t border-slate-200" />;
                return (
                  <p
                    key={idx}
                    className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3 pt-4 pb-1"
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
                    `flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors group ${
                      isActive
                        ? 'bg-blue-900 text-white shadow-xs'
                        : item.highlight
                        ? 'bg-blue-50/70 text-blue-900 hover:bg-blue-100 border border-blue-200/80 font-bold'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    } ${sidebarCollapsed ? 'justify-center px-2' : ''}`
                  }
                  title={sidebarCollapsed ? item.label : undefined}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <Icon
                      className={`w-4 h-4 shrink-0 ${
                        item.highlight ? 'text-blue-600 group-hover:text-blue-700' : ''
                      }`}
                    />
                    {!sidebarCollapsed && <span className="truncate">{item.label}</span>}
                  </div>

                  {!sidebarCollapsed && item.badge && (
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-slate-200 text-slate-700">
                      {item.badge}
                    </span>
                  )}

                  {!sidebarCollapsed && item.badgeCount && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-600 text-white">
                      {item.badgeCount}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </div>

          {/* Bottom Sidebar Footer */}
          <div className="p-3 border-t border-slate-200 space-y-1 bg-slate-50/50">
            <button
              onClick={() => navigate('/settings')}
              className={`w-full flex items-center gap-3 px-3 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors ${
                sidebarCollapsed ? 'justify-center px-2' : ''
              }`}
            >
              <HelpCircle className="w-4 h-4" />
              {!sidebarCollapsed && <span>Help &amp; Support</span>}
            </button>

            <button
              onClick={handleLogout}
              className={`w-full flex items-center gap-3 px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-xl transition-colors ${
                sidebarCollapsed ? 'justify-center px-2' : ''
              }`}
            >
              <LogOut className="w-4 h-4" />
              {!sidebarCollapsed && <span>Logout</span>}
            </button>

            {/* Collapse toggle button */}
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="w-full mt-2 py-1.5 flex items-center justify-center text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 text-xs transition-colors"
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
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs"
              onClick={() => setMobileMenuOpen(false)}
            />
            <div className="relative w-72 max-w-[85vw] bg-white h-full flex flex-col z-10 shadow-2xl">
              <div className="p-4 border-b border-slate-200 flex items-center justify-between">
                <CollegeBrand variant="sidebar" />
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
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
                        `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold ${
                          isActive
                            ? 'bg-blue-900 text-white font-bold'
                            : item.highlight
                            ? 'bg-blue-50 text-blue-900 font-bold'
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

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-slate-50 min-h-0">
          <div className="max-w-7xl mx-auto pb-12">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Global Command Palette */}
      <SearchCommand isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </div>
  );
};
