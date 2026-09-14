import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { resourceService } from '../services/resourceService';
import { StudyResource } from '../types';
import { LoadingState } from '../components/common/LoadingState';
import { Modal } from '../components/common/Modal';
import {
  FileText,
  Download,
  Sparkles,
  Eye,
  Filter,
  Search,
  BookOpen,
  FileCheck,
  Tag,
  CheckCircle2
} from 'lucide-react';

export const NotesPage: React.FC = () => {
  const navigate = useNavigate();
  const [resources, setResources] = useState<StudyResource[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSubject, setSelectedSubject] = useState<string>('All');
  const [selectedType, setSelectedType] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [summaryModalResource, setSummaryModalResource] = useState<StudyResource | null>(null);
  const [summarizing, setSummarizing] = useState(false);
  const [generatedSummary, setGeneratedSummary] = useState<string>('');
  const [toastMessage, setToastMessage] = useState<string>('');

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const data = await resourceService.getStudyResources();
        setResources(data);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleDownload = (item: StudyResource) => {
    setToastMessage(`Downloading "${item.title}" (${item.fileSize})...`);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const handleSummarizeWithAI = (item: StudyResource) => {
    setSummaryModalResource(item);
    setSummarizing(true);
    setTimeout(() => {
      setGeneratedSummary(
        `### AI Summary: ${item.title}\n\n` +
        `**Key AKTU Exam Takeaways:**\n` +
        `1. **Core Concept:** Detailed synthesis of ${item.topic} for ${item.subjectName}.\n` +
        `2. **Critical Definitions:** Contains standard diagrams and formulations verified by ${item.uploadedBy}.\n` +
        `3. **High Probability Exam Questions:** Covers 10-mark long questions frequently asked in 2022 & 2023.\n` +
        `4. **Quick Revision Rule:** Review the 4-step algorithm provided on Page 12 before entering the examination hall.`
      );
      setSummarizing(false);
    }, 600);
  };

  if (loading) {
    return <LoadingState message="Loading Study Materials..." subMessage="Indexing unit lecture slides, lab manuals, and notes" />;
  }

  const filtered = resources.filter((res) => {
    const matchSubject = selectedSubject === 'All' || res.subjectCode === selectedSubject;
    const matchType = selectedType === 'All' || res.type === selectedType;
    const matchSearch =
      res.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      res.topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
      res.subjectName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchSubject && matchType && matchSearch;
  });

  const subjectOptions = ['All', ...new Set(resources.map((r) => r.subjectCode))];
  const typeOptions = ['All', 'Unit Notes', 'Lecture Slides', 'Question Bank', 'Practical Manual', 'Handwritten'];

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
              Course Notes &amp; Study Repository
            </h1>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-800 border border-blue-200">
              Verified by GLBITM Faculty
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Access unit modules, lecture decks, question banks, and lab manuals
          </p>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search notes, topics..."
            className="w-full text-xs pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 focus:outline-none focus:bg-white focus:border-blue-500"
          />
        </div>
      </div>

      {/* Filter Chips Bar */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Subject Filter */}
        <div className="flex items-center gap-2 overflow-x-auto">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider shrink-0">
            Subject:
          </span>
          {subjectOptions.map((code) => (
            <button
              key={code}
              onClick={() => setSelectedSubject(code)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                selectedSubject === code
                  ? 'bg-blue-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70'
              }`}
            >
              {code}
            </button>
          ))}
        </div>

        {/* Type Filter */}
        <div className="flex items-center gap-2 overflow-x-auto">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider shrink-0">
            Type:
          </span>
          {typeOptions.map((type) => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                selectedType === type
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Resources Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((item) => (
          <div
            key={item.id}
            className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs hover:border-blue-300 transition-all flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded border border-blue-200">
                  {item.subjectCode}
                </span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                  {item.type}
                </span>
              </div>

              <div>
                <h3 className="text-sm font-bold text-slate-900 line-clamp-1">{item.title}</h3>
                <p className="text-xs text-slate-500 mt-0.5">{item.subjectName} • {item.unit}</p>
              </div>

              <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200/60 text-[11px] text-slate-600 flex items-center justify-between">
                <span>By: <strong>{item.uploadedBy}</strong></span>
                <span className="font-mono text-slate-400">{item.fileSize}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => handleSummarizeWithAI(item)}
                className="py-2 px-3 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5" />
                Summarize AI
              </button>

              <button
                onClick={() => handleDownload(item)}
                className="py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-xs"
              >
                <Download className="w-3.5 h-3.5" />
                Download
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* AI Summary Modal */}
      {summaryModalResource && (
        <Modal
          isOpen={!!summaryModalResource}
          onClose={() => setSummaryModalResource(null)}
          title={`AI Summary: ${summaryModalResource.title}`}
          subtitle={`${summaryModalResource.subjectName} (${summaryModalResource.subjectCode}) • ${summaryModalResource.unit}`}
          maxWidth="xl"
        >
          <div className="space-y-4">
            {summarizing ? (
              <div className="py-8 flex flex-col items-center justify-center text-center">
                <Sparkles className="w-8 h-8 text-blue-600 animate-spin mb-2" />
                <p className="text-xs font-semibold text-slate-700">Synthesizing key exam points with Campus AI...</p>
              </div>
            ) : (
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-800 whitespace-pre-line leading-relaxed">
                {generatedSummary}
              </div>
            )}

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                onClick={() => setSummaryModalResource(null)}
                className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-semibold"
              >
                Done
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
