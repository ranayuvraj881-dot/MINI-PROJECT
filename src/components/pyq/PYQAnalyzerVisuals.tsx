import React, { useState } from 'react';
import { TopicAnalysis } from '../../types';
import { aiService } from '../../services/aiService';
import {
  Sparkles,
  BarChart3,
  PieChart,
  CheckCircle2,
  TrendingUp,
  Award,
  Layers,
  HelpCircle,
  Lightbulb,
  ArrowRight
} from 'lucide-react';
import { ProgressBar } from '../common/ProgressBar';

interface PYQAnalyzerVisualsProps {
  topics: TopicAnalysis[];
  selectedSubject: string;
}

export const PYQAnalyzerVisuals: React.FC<PYQAnalyzerVisualsProps> = ({
  topics,
  selectedSubject
}) => {
  const [strategy, setStrategy] = useState<{
    strategyTitle: string;
    keyTakeaway: string;
    focusUnits: number[];
    recommendedHours: number;
    steps: string[];
  } | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateStrategy = async () => {
    setIsGenerating(true);
    try {
      const res = await aiService.generatePYQStrategy(selectedSubject);
      setStrategy(res);
    } finally {
      setIsGenerating(false);
    }
  };

  const getImportanceBadge = (importance: string) => {
    switch (importance) {
      case 'HIGH IMPORTANCE':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'MEDIUM/HIGH':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      default:
        return 'bg-blue-50 text-blue-700 border-blue-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Hero Banner */}
      <div className="relative overflow-hidden bg-slate-900 text-white rounded-2xl p-8 border border-slate-800 shadow-md">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-500/20 text-blue-300 border border-blue-400/30">
              <Sparkles className="w-3.5 h-3.5 text-blue-300" />
              AKTU Exam Intelligence Engine
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Understand what your exams actually ask.
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              Derived from 5 consecutive academic cycles (2020–2024) across End-Sem and PUT question archives for GLBITM.
            </p>
          </div>

          <div className="shrink-0">
            <button
              onClick={handleGenerateStrategy}
              disabled={isGenerating}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-md transition-all hover:scale-102 disabled:opacity-50"
            >
              <Lightbulb className="w-4 h-4 text-amber-300" />
              {isGenerating ? 'Synthesizing Strategy...' : 'Generate Preparation Strategy'}
            </button>
          </div>
        </div>
      </div>

      {/* Generated Strategy Card if available */}
      {strategy && (
        <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 border border-blue-200 rounded-2xl p-6 shadow-xs animate-in fade-in duration-300">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-xs">
              <Sparkles className="w-5 h-5" />
            </div>
            <div className="space-y-3 flex-1">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <h4 className="text-base font-bold text-slate-900">{strategy.strategyTitle}</h4>
                <span className="text-xs font-mono font-semibold px-2.5 py-1 rounded-full bg-blue-100 text-blue-800">
                  Target: {strategy.recommendedHours} Study Hours
                </span>
              </div>
              <p className="text-xs text-slate-700 font-medium leading-relaxed bg-white/80 p-3 rounded-xl border border-blue-100">
                <strong>Key Examination Insight:</strong> {strategy.keyTakeaway}
              </p>

              <div className="space-y-2 pt-1">
                <p className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Tactical Action Plan:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {strategy.steps.map((step, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-2 p-2.5 rounded-xl bg-white/90 border border-slate-200/80 text-xs text-slate-800"
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{step}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Most Repeated Topics Frequency Table */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="text-base font-bold text-slate-900">High-Recurrence Topic Matrix</h3>
            <p className="text-xs text-slate-500">
              Exam occurrence count and relative weightage distribution
            </p>
          </div>
          <span className="text-xs font-bold px-3 py-1 rounded-lg bg-slate-100 text-slate-700">
            {topics.length} Indexed Topics
          </span>
        </div>

        <div className="space-y-3">
          {topics.map((topic, index) => {
            const percentage = Math.round((topic.frequency / 8) * 100);
            return (
              <div
                key={index}
                className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/50 hover:bg-slate-50 transition-colors"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-mono font-bold text-blue-700 bg-blue-100/70 px-2 py-0.5 rounded">
                        {topic.unit}
                      </span>
                      <h4 className="text-xs font-bold text-slate-900">{topic.topic}</h4>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getImportanceBadge(topic.importance)}`}>
                        {topic.importance}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500">
                      {topic.subjectName} ({topic.subjectCode}) • Last asked in {topic.lastAskedYear}
                    </p>
                  </div>

                  <div className="shrink-0 flex items-center gap-3">
                    <span className="text-xs font-bold text-purple-700 bg-purple-50 px-2.5 py-1 rounded-lg border border-purple-200">
                      Asked {topic.frequency} times
                    </span>
                    <span className="text-xs font-mono font-semibold text-slate-600">
                      ~{topic.averageMarks} Marks
                    </span>
                  </div>
                </div>

                <ProgressBar value={percentage} threshold={60} size="sm" variant="auto" />
              </div>
            );
          })}
        </div>
      </div>

      {/* Grid of 3 Insight Visual Cards: Unit Distribution, Difficulty Breakdown, Trend */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Unit-wise distribution */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center gap-2 mb-4">
            <Layers className="w-4 h-4 text-blue-600" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">
              Unit-wise Weightage
            </h4>
          </div>
          <div className="space-y-3">
            {[
              { unit: 'Unit 3 (Normalization)', percent: 28, color: 'bg-blue-600' },
              { unit: 'Unit 4 (Transactions & Concurrency)', percent: 24, color: 'bg-indigo-600' },
              { unit: 'Unit 2 (Relational Model & SQL)', percent: 20, color: 'bg-emerald-600' },
              { unit: 'Unit 5 (B+ Trees & Indexing)', percent: 16, color: 'bg-amber-600' },
              { unit: 'Unit 1 (Intro & ER Diagrams)', percent: 12, color: 'bg-slate-400' }
            ].map((u, i) => (
              <div key={i} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-slate-700">{u.unit}</span>
                  <span className="font-bold text-slate-900">{u.percent}%</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className={`${u.color} h-2 rounded-full`} style={{ width: `${u.percent}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Difficulty Distribution */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center gap-2 mb-4">
            <PieChart className="w-4 h-4 text-purple-600" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">
              Difficulty Spectrum
            </h4>
          </div>
          <div className="space-y-4">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70 text-center">
              <div className="text-2xl font-extrabold text-slate-900">55%</div>
              <span className="text-xs text-amber-700 font-semibold">Medium Complexity</span>
              <p className="text-[11px] text-slate-500 mt-0.5">Algorithm derivations &amp; schemas</p>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-center">
                <div className="text-lg font-bold text-emerald-800">25%</div>
                <span className="text-[10px] font-semibold text-emerald-700">Direct / Easy</span>
              </div>
              <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-center">
                <div className="text-lg font-bold text-rose-800">20%</div>
                <span className="text-[10px] font-semibold text-rose-700">Hard / Numerical</span>
              </div>
            </div>
          </div>
        </div>

        {/* Previous Year Trends */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-4 h-4 text-emerald-600" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">
              AKTU Question Trend Shift
            </h4>
          </div>
          <div className="space-y-2.5 text-xs text-slate-600 leading-relaxed">
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
              <span className="font-bold text-slate-900 block mb-0.5">Numerical Orientation:</span>
              AKTU has transitioned from pure definitions to numerical 3NF/BCNF decomposition and B+ Tree order 4 splits since 2022.
            </div>
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
              <span className="font-bold text-slate-900 block mb-0.5">Conflict Serializability:</span>
              Tested in 4 out of the last 5 End-Sem examinations with 3-transaction schedules.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
