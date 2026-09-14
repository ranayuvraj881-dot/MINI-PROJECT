import React, { useState, useEffect } from 'react';
import { aiService } from '../services/aiService';
import { TopicAnalysis } from '../types';
import { PYQAnalyzerVisuals } from '../components/pyq/PYQAnalyzerVisuals';
import { LoadingState } from '../components/common/LoadingState';
import { Sparkles, BookOpen, Layers } from 'lucide-react';
import { mockSubjects } from '../data/mock/mockSubjects';

export const PYQAnalyzerPage: React.FC = () => {
  const [topics, setTopics] = useState<TopicAnalysis[]>([]);
  const [selectedSubject, setSelectedSubject] = useState<string>('Database Management Systems');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const data = await aiService.getPYQTopicFrequency(selectedSubject);
        setTopics(data);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [selectedSubject]);

  if (loading) {
    return <LoadingState message="Analyzing AKTU Question Archives..." subMessage="Computing topic recurrence and difficulty distributions" />;
  }

  return (
    <div className="space-y-6">
      {/* Subject Selector Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              AI PYQ Analyzer
            </h1>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-800 border border-blue-200 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-blue-600" />
              Pattern Recognition
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Exam intelligence synthesized across 5 years of AKTU &amp; GLBITM examination papers
          </p>
        </div>

        {/* Subject Filter dropdown */}
        <div className="flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-slate-400" />
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="text-xs font-semibold px-3.5 py-2 rounded-xl border border-slate-200 bg-white text-slate-800 focus:outline-none focus:border-blue-500"
          >
            {mockSubjects.map((sub) => (
              <option key={sub.code} value={sub.name}>
                {sub.name} ({sub.code})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Analyzer Visuals Component */}
      <PYQAnalyzerVisuals topics={topics} selectedSubject={selectedSubject} />
    </div>
  );
};
