import React from 'react';
import { DayStudyPlan } from '../../types';
import { CheckCircle2, Circle, Clock, BookOpen, Sparkles, Calendar } from 'lucide-react';
import { ProgressBar } from '../common/ProgressBar';

interface StudyPlanScheduleProps {
  plan: DayStudyPlan[];
  onToggleSlot: (slotId: string) => void;
}

export const StudyPlanSchedule: React.FC<StudyPlanScheduleProps> = ({ plan, onToggleSlot }) => {
  // Calculate completion
  const totalSlots = plan.reduce((acc, day) => acc + day.slots.length, 0);
  const completedSlots = plan.reduce(
    (acc, day) => acc + day.slots.filter((s) => s.completed).length,
    0
  );
  const completionPercentage = totalSlots > 0 ? (completedSlots / totalSlots) * 100 : 0;

  const getTaskBadge = (type: string) => {
    switch (type) {
      case 'PYQ Practice':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'Problem Solving':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Lab Exercise':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      default:
        return 'bg-blue-50 text-blue-700 border-blue-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Progress & Stats Bar */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Smart Study Execution
            </span>
            <div className="flex items-baseline gap-2 mt-0.5">
              <h3 className="text-2xl font-bold text-slate-900">
                {completedSlots} of {totalSlots} Sessions Completed
              </h3>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                {completionPercentage.toFixed(0)}% Done
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs text-slate-600">
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>AI Target: 2.25 hrs/day</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-blue-600" />
              <span>AKTU Sessional Prep</span>
            </div>
          </div>
        </div>

        <ProgressBar
          value={completionPercentage}
          threshold={100}
          showLabel={false}
          size="lg"
          variant="blue"
        />
      </div>

      {/* Days List */}
      <div className="space-y-4">
        {plan.map((dayPlan) => (
          <div
            key={dayPlan.day}
            className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs"
          >
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <span className="text-xs font-extrabold px-3 py-1 rounded-lg bg-blue-900 text-white uppercase tracking-wider">
                  {dayPlan.day}
                </span>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">{dayPlan.focusArea}</h4>
                  <p className="text-[11px] text-slate-500">{dayPlan.date}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
                <Clock className="w-3.5 h-3.5" />
                <span>{dayPlan.targetHours} Hours Scheduled</span>
              </div>
            </div>

            {/* Time Slots */}
            <div className="space-y-3">
              {dayPlan.slots.map((slot) => (
                <div
                  key={slot.id}
                  onClick={() => onToggleSlot(slot.id)}
                  className={`flex items-start justify-between p-4 rounded-xl border transition-all cursor-pointer select-none ${
                    slot.completed
                      ? 'bg-emerald-50/40 border-emerald-200 text-slate-600'
                      : 'bg-slate-50/70 border-slate-200/80 hover:bg-slate-50 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-start gap-3 min-w-0">
                    <button
                      type="button"
                      className="mt-0.5 text-slate-400 hover:text-emerald-600 transition-colors shrink-0"
                    >
                      {slot.completed ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 fill-emerald-100" />
                      ) : (
                        <Circle className="w-5 h-5" />
                      )}
                    </button>

                    <div className="min-w-0 space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-mono font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                          {slot.subjectCode}
                        </span>
                        <h5
                          className={`text-xs font-bold ${
                            slot.completed ? 'line-through text-slate-500' : 'text-slate-900'
                          }`}
                        >
                          {slot.subjectName}
                        </h5>
                        <span
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${getTaskBadge(
                            slot.taskType
                          )}`}
                        >
                          {slot.taskType}
                        </span>
                      </div>
                      <p
                        className={`text-xs ${
                          slot.completed ? 'text-slate-400 line-through' : 'text-slate-700 font-medium'
                        }`}
                      >
                        {slot.topic}
                      </p>
                    </div>
                  </div>

                  <div className="shrink-0 pl-3 flex items-center gap-1.5 text-xs font-mono font-semibold text-slate-500">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>{slot.timeSlot}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
