import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Sparkles, Calendar, Clock, BookOpen, AlertCircle } from 'lucide-react';
import { mockSubjects } from '../../data/mock/mockSubjects';

interface StudyPlanGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGenerate: (config: {
    examDates: string;
    subjects: string[];
    availableStudyHours: number;
    weakSubjects: string[];
    preferredStudyTime: string;
  }) => void;
  isGenerating?: boolean;
}

export const StudyPlanGeneratorModal: React.FC<StudyPlanGeneratorModalProps> = ({
  isOpen,
  onClose,
  onGenerate,
  isGenerating = false
}) => {
  const [examDate, setExamDate] = useState('2026-03-25');
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([
    'Database Management Systems',
    'Operating Systems',
    'Compiler Design'
  ]);
  const [weakSubjects, setWeakSubjects] = useState<string[]>(['Database Management Systems']);
  const [hoursPerDay, setHoursPerDay] = useState<number>(2.5);
  const [preferredTime, setPreferredTime] = useState<'Morning' | 'Evening' | 'Late Night'>('Evening');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onGenerate({
      examDates: examDate,
      subjects: selectedSubjects,
      availableStudyHours: hoursPerDay,
      weakSubjects,
      preferredStudyTime: preferredTime
    });
    onClose();
  };

  const toggleSubject = (name: string) => {
    if (selectedSubjects.includes(name)) {
      setSelectedSubjects(selectedSubjects.filter((s) => s !== name));
    } else {
      setSelectedSubjects([...selectedSubjects, name]);
    }
  };

  const toggleWeak = (name: string) => {
    if (weakSubjects.includes(name)) {
      setWeakSubjects(weakSubjects.filter((s) => s !== name));
    } else {
      setWeakSubjects([...weakSubjects, name]);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Configure Smart AI Study Planner"
      subtitle="Calibrate target timetable based on exam proximity & current academic risk"
      maxWidth="xl"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Exam Proximity Date */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-blue-600" /> Target Examination Date
          </label>
          <input
            type="date"
            value={examDate}
            onChange={(e) => setExamDate(e.target.value)}
            className="w-full text-xs font-semibold px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-800 focus:outline-none focus:border-blue-500"
          />
        </div>

        {/* Subjects to cover */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
            <BookOpen className="w-4 h-4 text-blue-600" /> Subjects in Scope
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {mockSubjects.map((sub) => {
              const isChecked = selectedSubjects.includes(sub.name);
              return (
                <button
                  type="button"
                  key={sub.code}
                  onClick={() => toggleSubject(sub.name)}
                  className={`p-2.5 rounded-xl text-left border text-xs font-semibold transition-all ${
                    isChecked
                      ? 'bg-blue-50 border-blue-300 text-blue-900 shadow-xs'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <div className="font-bold">{sub.name}</div>
                  <div className="text-[10px] text-slate-500">{sub.code} • {sub.credits} Credits</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Weak subjects */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
            <AlertCircle className="w-4 h-4 text-amber-600" /> Weak or At-Risk Focus Subjects
          </label>
          <div className="flex flex-wrap gap-2">
            {selectedSubjects.map((name) => {
              const isWeak = weakSubjects.includes(name);
              return (
                <button
                  type="button"
                  key={name}
                  onClick={() => toggleWeak(name)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                    isWeak
                      ? 'bg-amber-500 text-white border-amber-500 shadow-xs'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {isWeak ? `★ ${name} (Priority Focus)` : name}
                </button>
              );
            })}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            Weak subjects receive 1.5x session frequency and dedicated AKTU PYQ practice slots.
          </p>
        </div>

        {/* Hours & Preferred Time */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-blue-600" /> Available Daily Hours: {hoursPerDay}h
            </label>
            <input
              type="range"
              min={1}
              max={6}
              step={0.5}
              value={hoursPerDay}
              onChange={(e) => setHoursPerDay(parseFloat(e.target.value))}
              className="w-full accent-blue-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-600 font-semibold mt-1">
              <span>1 hr</span>
              <span>2.5 hrs</span>
              <span>4 hrs</span>
              <span>6 hrs</span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Preferred Study Slot
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['Morning', 'Evening', 'Late Night'] as const).map((time) => (
                <button
                  key={time}
                  type="button"
                  onClick={() => setPreferredTime(time)}
                  className={`py-2 px-1 text-center rounded-xl text-xs font-semibold border transition-all ${
                    preferredTime === time
                      ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {time}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isGenerating}
            className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs flex items-center gap-2 transition-all disabled:opacity-50"
          >
            <Sparkles className="w-4 h-4" />
            {isGenerating ? 'Synthesizing Plan...' : 'Generate Smart Study Plan'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
