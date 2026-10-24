import React, { useState, useEffect } from 'react';
import { aiService } from '../services/aiService';
import { academicService } from '../services/academicService';
import { TopicAnalysis, SubjectItem } from '../types';
import { PYQAnalyzerVisuals } from '../components/pyq/PYQAnalyzerVisuals';
import { LoadingState } from '../components/common/LoadingState';
import { Sparkles, BookOpen } from 'lucide-react';

export const PYQAnalyzerPage: React.FC = () => {
  const [topics, setTopics] = useState<TopicAnalysis[]>([]);
  const [subjects, setSubjects] = useState<SubjectItem[]>([]);
  const [selectedSubject, setSelectedSubject] = useState<string>('Database Management Systems');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSubjects = async () => {
      try {
        const subs = await academicService.getSubjects();
        setSubjects(subs);
        if (subs.length > 0 && !subs.some((s) => s.name === selectedSubject)) {
          setSelectedSubject(subs[0].name);
        }
      } catch (err) {
        console.error('Failed to load subjects:', err);
      }
    };
    loadSubjects();
  }, []);

  useEffect(() => {
    const loadTopics = async () => {
      try {
        setLoading(true);
        const data = await aiService.getPYQTopicFrequency(selectedSubject);
        setTopics(data);
      } finally {
        setLoading(false);
      }
    };
    loadTopics();
  }, [selectedSubject]);

  if (loading && topics.length === 0) {
    return <LoadingState message="Analyzing AKTU Question Archives..." subMessage="Computing topic recurrence and difficulty distributions" />;
  }

  return (
    <div className="space-y-6">
      {/* Subject Selector Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white/95 backdrop-blur-xl border border-white/80 shadow-[0_15px_40px_rgba(79,70,229,0.04)] rounded-3xl p-6">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-amber-50/70 border border-amber-200/70 p-1.5 flex items-center justify-center shrink-0 shadow-xs">
            <img src="/glb-logo.png" alt="GL Bajaj Crest" className="w-full h-full object-contain" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
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
        </div>

        {/* Subject Filter dropdown */}
        <div className="flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-slate-400" />
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="text-xs font-semibold px-3.5 py-2 rounded-xl border border-slate-200 bg-white text-slate-800 focus:outline-none focus:border-blue-500"
          >
            {subjects.map((sub) => (
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
