import React from 'react';
import { Clock, MapPin, User, ArrowUpRight } from 'lucide-react';
import { TimetableSlot } from '../../types';
import { useNavigate } from 'react-router-dom';

interface TodayTimetableCardProps {
  slots: TimetableSlot[];
}

export const TodayTimetableCard: React.FC<TodayTimetableCardProps> = ({ slots }) => {
  const navigate = useNavigate();

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

  const getStatusBadge = (status?: string) => {
    switch (status) {
      case 'Present':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Absent':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      default:
        return 'bg-slate-100 text-slate-600 border-slate-200';
    }
  };

  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-bold text-slate-900">Today's Timetable</h3>
          <p className="text-xs text-slate-500">Scheduled sessions &amp; real-time attendance logging</p>
        </div>
        <button
          onClick={() => navigate('/timetable')}
          className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 group"
        >
          Full Schedule
          <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>

      <div className="space-y-3">
        {slots.slice(0, 4).map((slot, index) => {
          const isCurrentOrNext = index === 1; // highlight current class for realism
          return (
            <div
              key={slot.id}
              className={`p-3.5 rounded-xl border transition-all ${
                isCurrentOrNext
                  ? 'bg-blue-50/40 border-blue-300 shadow-xs'
                  : 'bg-slate-50/60 border-slate-200/80 hover:bg-slate-50'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-bold font-mono text-blue-700 bg-blue-100/80 px-2 py-0.5 rounded">
                      {slot.subjectCode}
                    </span>
                    <h4 className="text-xs font-bold text-slate-900 truncate">
                      {slot.subjectName}
                    </h4>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${getTypeBadge(slot.type)}`}>
                      {slot.type}
                    </span>
                  </div>

                  <div className="flex items-center gap-4 text-xs text-slate-500 flex-wrap">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
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
                      className={`text-[11px] font-semibold px-2.5 py-1 rounded-full border ${getStatusBadge(
                        slot.attendanceStatus
                      )}`}
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
  );
};
