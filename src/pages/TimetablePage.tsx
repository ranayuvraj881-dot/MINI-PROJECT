import React, { useState, useEffect } from 'react';
import { academicService } from '../services/academicService';
import { TimetableDaySchedule, TimetableSlot } from '../types';
import { LoadingState } from '../components/common/LoadingState';
import { Clock, MapPin, User, Calendar, BookOpen, ChevronRight } from 'lucide-react';

export const TimetablePage: React.FC = () => {
  const [schedule, setSchedule] = useState<TimetableDaySchedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDay, setSelectedDay] = useState<string>('Monday');

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const data = await academicService.getWeeklyTimetable();
        setSchedule(data);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) {
    return <LoadingState message="Loading Timetable..." subMessage="Fetching weekly classroom & lab allocations" />;
  }

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const activeDaySchedule = schedule.find((s) => s.day === selectedDay) || schedule[0];

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'Lab':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'Tutorial':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      default:
        return 'bg-blue-50 text-blue-700 border-blue-200';
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
                Class Schedule &amp; Timetable
              </h1>
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-800 border border-blue-200">
                Odd Semester 2026
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Department of Computer Science &amp; Engineering • Block B Lecture Theatres &amp; CS Labs
            </p>
          </div>
        </div>

        {/* Day Selector Tabs */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl overflow-x-auto">
          {days.map((d) => (
            <button
              key={d}
              onClick={() => setSelectedDay(d)}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all whitespace-nowrap ${
                selectedDay === d
                  ? 'bg-blue-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              {d}
            </button>
          ))}
        </div>
      </div>

      {/* Day Schedule Content */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-blue-600" />
            <h3 className="text-base font-bold text-slate-900">{selectedDay} Schedule</h3>
          </div>
          <span className="text-xs font-semibold text-slate-500">
            {activeDaySchedule?.slots.length || 0} Scheduled Sessions
          </span>
        </div>

        <div className="space-y-3">
          {activeDaySchedule?.slots.map((slot, index) => {
            // Highlight index 1 as current / upcoming for demonstration
            const isCurrentClass = selectedDay === 'Monday' && index === 1;

            return (
              <div
                key={slot.id}
                className={`p-4 rounded-xl border transition-all ${
                  isCurrentClass
                    ? 'bg-blue-50/60 border-blue-400 shadow-xs ring-2 ring-blue-500/20'
                    : 'bg-slate-50/60 border-slate-200/80 hover:bg-slate-50'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1.5 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-mono font-bold text-blue-700 bg-blue-100/70 px-2 py-0.5 rounded">
                        {slot.subjectCode}
                      </span>
                      <h4 className="text-sm font-bold text-slate-900 truncate">
                        {slot.subjectName}
                      </h4>
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${getTypeBadge(
                          slot.type
                        )}`}
                      >
                        {slot.type}
                      </span>
                      {isCurrentClass && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-600 text-white animate-pulse">
                          Current Class
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-4 text-xs text-slate-600 flex-wrap">
                      <span className="flex items-center gap-1 font-semibold text-slate-800">
                        <Clock className="w-3.5 h-3.5 text-blue-600" />
                        {slot.time}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        {slot.room}
                      </span>
                      <span className="flex items-center gap-1">
                        <User className="w-3.5 h-3.5 text-slate-400" />
                        {slot.facultyName}
                      </span>
                    </div>
                  </div>

                  <div className="shrink-0 flex items-center gap-2 self-start sm:self-center">
                    {slot.attendanceStatus && (
                      <span
                        className={`text-xs font-bold px-3 py-1 rounded-full border ${
                          slot.attendanceStatus === 'Present'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : 'bg-rose-50 text-rose-700 border-rose-200'
                        }`}
                      >
                        {slot.attendanceStatus}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
