import React, { useState } from 'react';
import { PYQItem } from '../../types';
import { Sparkles, CheckCircle2, Bookmark, Bot, Award, ArrowUpRight, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface PYQCardProps {
  pyq: PYQItem;
  onPractice?: (pyq: PYQItem) => void;
  onAddToPlan?: (pyq: PYQItem) => void;
  onDelete?: (pyq: PYQItem) => void;
  isTeacher?: boolean;
}

export const PYQCard: React.FC<PYQCardProps> = ({ pyq, onPractice, onAddToPlan, onDelete, isTeacher }) => {
  const navigate = useNavigate();
  const [isAddedToPlan, setIsAddedToPlan] = useState(false);
  const [isPracticing, setIsPracticing] = useState(false);

  const getDifficultyBadge = (diff: string) => {
    switch (diff) {
      case 'Easy':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Hard':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      default:
        return 'bg-amber-50 text-amber-700 border-amber-200';
    }
  };

  const handleAskAI = () => {
    // Navigate to copilot with this PYQ pre-seeded
    navigate(`/copilot?prompt=${encodeURIComponent(`Explain model solution and scoring scheme for: ${pyq.question}`)}&context=My PYQs`);
  };

  const handleAddPlan = () => {
    setIsAddedToPlan(true);
    if (onAddToPlan) onAddToPlan(pyq);
  };

  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs hover:border-blue-300 transition-all space-y-3">
      {/* Top Header metadata */}
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
            {pyq.subjectCode}
          </span>
          <span className="text-xs font-semibold text-slate-500">
            {pyq.unit} • {pyq.examType} ({pyq.year})
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${getDifficultyBadge(pyq.difficulty)}`}>
            {pyq.difficulty}
          </span>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200 flex items-center gap-1">
            <Award className="w-3 h-3" /> Asked {pyq.frequency}x
          </span>
        </div>
      </div>

      {/* Question Text */}
      <p className="text-sm font-semibold text-slate-900 leading-relaxed">
        {pyq.question}
      </p>

      {/* Topic & Weightage */}
      <div className="flex items-center justify-between text-xs text-slate-500 pt-1 border-t border-slate-100">
        <span className="font-medium">Topic: <strong className="text-slate-700">{pyq.topic}</strong></span>
        <span className="font-mono font-semibold text-slate-700">{pyq.marksWeightage} Marks</span>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between gap-2 pt-2">
        {isTeacher && onDelete ? (
          <button
            onClick={() => onDelete(pyq)}
            className="p-1.5 rounded-xl text-rose-500 hover:text-rose-700 hover:bg-rose-50 border border-transparent hover:border-rose-200 transition-all"
            title="Delete Question"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        ) : <div />}

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setIsPracticing(!isPracticing);
              if (onPractice) onPractice(pyq);
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
              isPracticing
                ? 'bg-emerald-600 text-white border-emerald-600'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
          >
            {isPracticing ? 'In Practice' : 'Practice'}
          </button>

        <button
          onClick={handleAskAI}
          className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 flex items-center gap-1.5 transition-all"
        >
          <Bot className="w-3.5 h-3.5" />
          Ask AI
        </button>

        <button
          onClick={handleAddPlan}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all flex items-center gap-1.5 ${
            isAddedToPlan
              ? 'bg-slate-100 text-slate-600 border-slate-200 cursor-default'
              : 'bg-slate-900 hover:bg-slate-800 text-white border-slate-900'
          }`}
        >
          <Bookmark className="w-3.5 h-3.5" />
          {isAddedToPlan ? 'In Study Plan' : 'Add to Plan'}
        </button>
        </div>
      </div>
    </div>
  );
};


