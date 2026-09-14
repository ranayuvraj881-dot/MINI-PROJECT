import React, { useState, useEffect } from 'react';
import { aiService } from '../services/aiService';
import { DayStudyPlan } from '../types';
import { StudyPlanSchedule } from '../components/planner/StudyPlanSchedule';
import { StudyPlanGeneratorModal } from '../components/planner/StudyPlanGeneratorModal';
import { LoadingState } from '../components/common/LoadingState';
import { Sparkles, CalendarDays, RefreshCw, SlidersHorizontal, CheckCircle2 } from 'lucide-react';

export const StudyPlannerPage: React.FC = () => {
  const [plan, setPlan] = useState<DayStudyPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const data = await aiService.getStudyPlan();
        setPlan(data);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleToggleSlot = (slotId: string) => {
    setPlan((prev) =>
      prev.map((day) => ({
        ...day,
        slots: day.slots.map((s) => (s.id === slotId ? { ...s, completed: !s.completed } : s))
      }))
    );
  };

  const handleRegenerate = async (params: {
    examDates: string;
    subjects: string[];
    availableStudyHours: number;
    weakSubjects: string[];
    preferredStudyTime: string;
  }) => {
    setIsGenerating(true);
    try {
      const regenerated = await aiService.generateStudyPlan({
        targetDate: params.examDates,
        subjects: params.subjects,
        hoursPerDay: params.availableStudyHours,
        focusWeakAreas: params.weakSubjects,
        timePreference: params.preferredStudyTime as any
      });
      setPlan(regenerated);
      setToastMessage('AI Study Plan calibrated and updated!');
      setTimeout(() => setToastMessage(''), 3500);
    } finally {
      setIsGenerating(false);
    }
  };

  if (loading) {
    return <LoadingState message="Loading Smart Study Planner..." subMessage="Optimizing session timetable against exam deadlines" />;
  }

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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              Smart Study Planner
            </h1>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-800 border border-blue-200 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-blue-600" />
              Dynamic AI Timetable
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Personalized revision schedules weighted by syllabus priority and AKTU question trends
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs transition-colors"
          >
            <SlidersHorizontal className="w-4 h-4" />
            Reconfigure / Regenerate Plan
          </button>
        </div>
      </div>

      {/* Schedule Component */}
      <StudyPlanSchedule plan={plan} onToggleSlot={handleToggleSlot} />

      {/* Reconfigure Modal */}
      <StudyPlanGeneratorModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onGenerate={handleRegenerate}
        isGenerating={isGenerating}
      />
    </div>
  );
};
