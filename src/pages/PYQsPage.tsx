import React, { useState, useEffect } from 'react';
import { resourceService } from '../services/resourceService';
import { PYQItem } from '../types';
import { PYQCard } from '../components/pyq/PYQCard';
import { LoadingState } from '../components/common/LoadingState';
import { GraduationCap, Search, Filter, Sparkles, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const PYQsPage: React.FC = () => {
  const navigate = useNavigate();
  const [pyqs, setPyqs] = useState<PYQItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSubject, setSelectedSubject] = useState<string>('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('All');
  const [selectedExamType, setSelectedExamType] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [toastMessage, setToastMessage] = useState<string>('');

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const data = await resourceService.getPYQs();
        setPyqs(data);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handlePractice = (item: PYQItem) => {
    setToastMessage(`Started practice session for question: "${item.question.slice(0, 45)}..."`);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const handleAddToPlan = (item: PYQItem) => {
    setToastMessage(`Added to Smart Study Plan!`);
    setTimeout(() => setToastMessage(''), 3000);
  };

  if (loading) {
    return <LoadingState message="Loading PYQ Database..." subMessage="Fetching AKTU 5-year question archives and occurrence frequency" />;
  }

  const filtered = pyqs.filter((item) => {
    const matchSubject = selectedSubject === 'All' || item.subjectCode === selectedSubject;
    const matchDifficulty = selectedDifficulty === 'All' || item.difficulty === selectedDifficulty;
    const matchExam = selectedExamType === 'All' || item.examType === selectedExamType;
    const matchSearch =
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.subjectName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchSubject && matchDifficulty && matchExam && matchSearch;
  });

  const subjectOptions = ['All', ...new Set(pyqs.map((p) => p.subjectCode))];
  const difficultyOptions = ['All', 'Easy', 'Medium', 'Hard'];
  const examOptions = ['All', 'End-Sem', 'PUT'];

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
              AKTU PYQ Question Bank
            </h1>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-800 border border-blue-200">
              5-Year Archives
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Exam questions tagged with frequency, topic weightage &amp; model answers
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/pyq-analyzer')}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs transition-colors"
          >
            <Sparkles className="w-4 h-4" />
            Launch AI PYQ Analyzer
          </button>
        </div>
      </div>

      {/* Filter Controls */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Search bar */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search questions by keyword, topic or schema..."
              className="w-full text-xs pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 focus:outline-none focus:bg-white focus:border-blue-500"
            />
          </div>

          <span className="text-xs font-bold text-slate-500 shrink-0 self-center">
            {filtered.length} Questions Found
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-3 pt-1">
          {/* Subject options */}
          <div className="flex items-center gap-1.5 overflow-x-auto">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Subject:</span>
            {subjectOptions.map((code) => (
              <button
                key={code}
                onClick={() => setSelectedSubject(code)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedSubject === code
                    ? 'bg-blue-900 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70'
                }`}
              >
                {code}
              </button>
            ))}
          </div>

          {/* Difficulty options */}
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Difficulty:</span>
            {difficultyOptions.map((diff) => (
              <button
                key={diff}
                onClick={() => setSelectedDifficulty(diff)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                  selectedDifficulty === diff
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70'
                }`}
              >
                {diff}
              </button>
            ))}
          </div>

          {/* Exam options */}
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Exam:</span>
            {examOptions.map((ex) => (
              <button
                key={ex}
                onClick={() => setSelectedExamType(ex)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                  selectedExamType === ex
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70'
                }`}
              >
                {ex}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Questions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((item) => (
          <PYQCard
            key={item.id}
            pyq={item}
            onPractice={handlePractice}
            onAddToPlan={handleAddToPlan}
          />
        ))}
      </div>
    </div>
  );
};
