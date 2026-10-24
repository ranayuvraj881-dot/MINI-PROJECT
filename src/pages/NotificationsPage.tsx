import React, { useState, useEffect } from 'react';
import { notificationService } from '../services/notificationService';
import { AppNotification } from '../types';
import { LoadingState } from '../components/common/LoadingState';
import {
  Bell,
  CheckCircle2,
  Calendar,
  AlertTriangle,
  FileCheck,
  Building2,
  Search,
  CheckCheck
} from 'lucide-react';

export const NotificationsPage: React.FC = () => {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const data = await notificationService.getNotifications();
        setNotifications(data);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleMarkAsRead = async (id: string) => {
    const updated = await notificationService.markAsRead(id);
    setNotifications(updated);
  };

  const handleMarkAllRead = async () => {
    const updated = await notificationService.markAllAsRead();
    setNotifications(updated);
  };

  if (loading) {
    return <LoadingState message="Loading Notifications..." subMessage="Fetching university bulletins and academic alerts" />;
  }

  const categories = ['All', 'Academic', 'Attendance', 'Exams', 'Assignments', 'College Announcements'];

  const filtered = notifications.filter((n) => {
    const matchCategory = activeCategory === 'All' || n.category.toLowerCase() === activeCategory.toLowerCase();
    const matchSearch =
      n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.message.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchSearch;
  });

  const getCategoryIcon = (cat: string) => {
    switch (cat.toLowerCase()) {
      case 'attendance':
        return <AlertTriangle className="w-4 h-4 text-amber-600" />;
      case 'exams':
        return <Calendar className="w-4 h-4 text-purple-600" />;
      case 'assignments':
        return <FileCheck className="w-4 h-4 text-blue-600" />;
      case 'college announcements':
        return <Building2 className="w-4 h-4 text-emerald-600" />;
      default:
        return <Bell className="w-4 h-4 text-blue-600" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white/95 backdrop-blur-xl border border-white/80 shadow-[0_15px_40px_rgba(79,70,229,0.04)] rounded-3xl p-6">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-amber-50/70 border border-amber-200/70 p-1.5 flex items-center justify-center shrink-0 shadow-xs">
            <img src="/glb-logo.png" alt="GL Bajaj Crest" className="w-full h-full object-contain" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                Notifications &amp; Announcements
              </h1>
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-800 border border-blue-200">
                CampusOS Dispatch
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              University bulletins, attendance alerts, exam schedules and departmental notices
            </p>
          </div>
        </div>

        <button
          onClick={handleMarkAllRead}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors"
        >
          <CheckCheck className="w-4 h-4" />
          Mark All as Read
        </button>
      </div>

      {/* Filter Chips & Search Bar */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-xs space-y-3">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search notifications..."
            className="w-full text-xs pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 focus:outline-none focus:bg-white focus:border-blue-500"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pt-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg whitespace-nowrap transition-all ${
                activeCategory === cat
                  ? 'bg-blue-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {filtered.map((item) => (
          <div
            key={item.id}
            onClick={() => handleMarkAsRead(item.id)}
            className={`p-4 rounded-2xl border transition-all cursor-pointer ${
              item.read
                ? 'bg-white border-slate-200/80 text-slate-600'
                : 'bg-blue-50/40 border-blue-200 shadow-xs'
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3 min-w-0">
                <div className="p-2 rounded-xl bg-white border border-slate-200 shrink-0 shadow-2xs mt-0.5">
                  {getCategoryIcon(item.category)}
                </div>

                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className={`text-xs sm:text-sm font-bold ${item.read ? 'text-slate-800' : 'text-slate-900'}`}>
                      {item.title}
                    </h4>
                    {!item.read && (
                      <span className="w-2 h-2 rounded-full bg-blue-600" />
                    )}
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                      {item.category}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed font-medium">
                    {item.message}
                  </p>

                  <span className="text-[10px] text-slate-400 block pt-1 font-mono">
                    {item.timestamp}
                  </span>
                </div>
              </div>

              {!item.read && (
                <button
                  type="button"
                  className="shrink-0 text-xs font-semibold text-blue-600 hover:text-blue-800"
                >
                  Mark Read
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
