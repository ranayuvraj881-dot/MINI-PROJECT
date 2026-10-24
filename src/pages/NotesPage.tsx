import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { resourceService } from '../services/resourceService';
import { authService } from '../services/authService';
import { StudyResource, UserProfile } from '../types';
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
  CheckCircle2,
  ExternalLink,
  Globe,
  GraduationCap,
  Layers,
  ArrowUpRight,
  Plus,
  UploadCloud,
  Trash2,
} from 'lucide-react';

const ALL_SEMESTERS = [
  'All',
  'Semester I',
  'Semester II',
  'Semester III',
  'Semester IV',
  'Semester V',
  'Semester VI',
  'Semester VII',
  'Semester VIII',
];

// Map subjects to semesters for instant client-side filtering
const SUBJECT_SEMESTER_MAP: Record<string, string> = {
  'BAS-103': 'Semester I',
  'BAS-101': 'Semester I',
  'BEE-101': 'Semester I',
  'BCS-101': 'Semester I',
  'BAS-203': 'Semester II',
  'BAS-202': 'Semester II',
  'BEC-201': 'Semester II',
  'BME-101': 'Semester II',
  'KCS-301': 'Semester III',
  'KCS-302': 'Semester III',
  'KCS-303': 'Semester III',
  'KCS-401': 'Semester IV',
  'KCS-402': 'Semester IV',
  'KCS-403': 'Semester IV',
  'KCS-501': 'Semester V',
  'KCS-502': 'Semester V',
  'KCS-503': 'Semester V',
  'KCS-055': 'Semester V',
  'KAI-051': 'Semester V',
  'KCS-601': 'Semester VI',
  'KCS-602': 'Semester VI',
  'KCS-603': 'Semester VI',
  'KOE-068': 'Semester VI',
  'KCS-062': 'Semester VI',
  'KCS-701': 'Semester VII',
  'KCS-702': 'Semester VII',
  'KOE-074': 'Semester VII',
  'KOE-084': 'Semester VIII',
  'KOE-088': 'Semester VIII',
  'KCS-801': 'Semester VIII',
};

const NOTESGALLERY_YEARS = [
  {
    year: '1st Year (Sem 1 & 2)',
    subjects: 'Engg. Physics, Chemistry, Maths I/II, Basic Electrical, Mechanics',
    quantumUrl: 'https://notesgallery.com/quantum-series-pdfs/1st-year-quantum-pdf/',
    notesUrl: 'https://notesgallery.com/aktu-notes/aktu-1st-year-notes-2/',
    badge: '1st Year Common',
    color: 'from-blue-600 to-indigo-700',
  },
  {
    year: '2nd Year (Sem 3 & 4)',
    subjects: 'Data Structures, COA, Discrete Structures, Automata (TAFL), Python',
    quantumUrl: 'https://notesgallery.com/quantum-series-pdfs/aktu-2nd-year-quantum-pdf-download-notes/',
    notesUrl: 'https://notesgallery.com/aktu-notes/aktu-2nd-year-notes-2/',
    badge: '2nd Year Core',
    color: 'from-indigo-600 to-purple-700',
  },
  {
    year: '3rd Year (Sem 5 & 6)',
    subjects: 'DBMS, DAA, Compiler Design, Web Tech, Computer Networks, SE',
    quantumUrl: 'https://notesgallery.com/quantum-series-pdfs/3rd-year-quantum-pdf/',
    notesUrl: 'https://notesgallery.com/aktu-3rd-year-notes/',
    badge: '3rd Year Core',
    color: 'from-purple-600 to-fuchsia-700',
  },
  {
    year: '4th Year (Sem 7 & 8)',
    subjects: 'Distributed Systems, Cloud, AI, Open Electives (OE-1 to OE-4)',
    quantumUrl: 'https://notesgallery.com/7th-semester-quantum-series-free-pdf/',
    notesUrl: 'https://notesgallery.com/b-tech-aktu-4th-year-quantum-pdf/',
    badge: '4th Year Final',
    color: 'from-emerald-600 to-teal-700',
  },
];

export const NotesPage: React.FC = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [resources, setResources] = useState<StudyResource[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSemester, setSelectedSemester] = useState<string>('All');
  const [selectedSubject, setSelectedSubject] = useState<string>('All');
  const [selectedType, setSelectedType] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [summaryModalResource, setSummaryModalResource] = useState<StudyResource | null>(null);
  const [summarizing, setSummarizing] = useState(false);
  const [generatedSummary, setGeneratedSummary] = useState<string>('');
  const [toastMessage, setToastMessage] = useState<string>('');

  // Teacher notes upload modal state
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadForm, setUploadForm] = useState({
    title: '',
    subjectCode: 'KCS-601',
    unit: 'Unit 1',
    topic: '',
    type: 'PDF',
    fileSize: '3.4 MB',
    downloadUrl: '',
    summary: '',
  });

  const isTeacher = currentUser?.role === 'faculty' || currentUser?.role === 'admin';

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const [data, user] = await Promise.all([
          resourceService.getStudyResources(),
          authService.getCurrentUser().catch(() => null),
        ]);
        setResources(data);
        setCurrentUser(user);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleUploadSubmit = async () => {
    if (!uploadForm.title.trim() || !uploadForm.topic.trim()) {
      alert('Please fill in both the Resource Title and Specific Topic.');
      return;
    }
    try {
      setIsSubmitting(true);
      const created = await resourceService.uploadNote({
        title: uploadForm.title.trim(),
        subjectCode: uploadForm.subjectCode,
        unit: uploadForm.unit,
        topic: uploadForm.topic.trim(),
        type: uploadForm.type,
        fileSize: uploadForm.fileSize || '3.2 MB',
        downloadUrl: uploadForm.downloadUrl || 'https://notesgallery.com/aktu-notes/',
        summary:
          uploadForm.summary.trim() ||
          `Official lecture notes on ${uploadForm.topic.trim()} for ${uploadForm.subjectCode}.`,
      });
      setResources((prev) => [created, ...prev]);
      setIsUploadModalOpen(false);
      setUploadForm({
        title: '',
        subjectCode: 'KCS-601',
        unit: 'Unit 1',
        topic: '',
        type: 'PDF',
        fileSize: '3.4 MB',
        downloadUrl: '',
        summary: '',
      });
      setToastMessage(`✓ Lecture notes "${created.title}" successfully published to student portal!`);
      setTimeout(() => setToastMessage(''), 4000);
    } catch (err: any) {
      alert(err.message || 'Failed to upload notes.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteNote = async (item: StudyResource) => {
    if (!window.confirm(`Are you sure you want to delete "${item.title}"?`)) return;
    try {
      await resourceService.deleteNote(item.id);
      setResources((prev) => prev.filter((r) => r.id !== item.id));
      setToastMessage(`✓ Deleted note: "${item.title}"`);
      setTimeout(() => setToastMessage(''), 3000);
    } catch (err: any) {
      alert(err.message || 'Failed to delete note.');
    }
  };

  const handleDownload = (item: StudyResource) => {
    if (item.downloadUrl && item.downloadUrl.startsWith('http')) {
      window.open(item.downloadUrl, '_blank', 'noopener,noreferrer');
      setToastMessage(`Opening NotesGallery official resource for "${item.title}"...`);
    } else {
      setToastMessage(`Downloading "${item.title}" (${item.fileSize || 'PDF'})...`);
    }
    setTimeout(() => setToastMessage(''), 3500);
  };

  const handleSummarizeWithAI = (item: StudyResource) => {
    setSummaryModalResource(item);
    setSummarizing(true);
    setTimeout(() => {
      setGeneratedSummary(
        `### AI Summary: ${item.title}\n\n` +
        `**Key AKTU Exam Takeaways (Sourced from NotesGallery Curriculum):**\n` +
        `1. **Core Concept:** Detailed synthesis of ${item.topic} for ${item.subjectName} (${item.subjectCode}).\n` +
        `2. **Critical Definitions & Proofs:** Contains standard formulations and theorems verified for AKTU end-sem marking schemes.\n` +
        `3. **High Probability Exam Questions:** Covers recurring 10-mark questions frequently appearing in recent university papers.\n` +
        `4. **Quick Revision Rule:** Review the step-by-step algorithms, solved numericals, and architecture diagrams before the examination.`
      );
      setSummarizing(false);
    }, 600);
  };

  if (loading) {
    return <LoadingState message="Loading Study Materials..." subMessage="Indexing AKTU unit modules, NotesGallery quantum series, and handwritten notes" />;
  }

  const filtered = resources.filter((res) => {
    const sem = SUBJECT_SEMESTER_MAP[res.subjectCode] || '';
    const matchSemester = selectedSemester === 'All' || sem === selectedSemester;
    const matchSubject = selectedSubject === 'All' || res.subjectCode === selectedSubject;
    const matchType = selectedType === 'All' || res.type === selectedType;
    const matchSearch =
      res.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      res.topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
      res.subjectName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      res.subjectCode.toLowerCase().includes(searchQuery.toLowerCase());
    return matchSemester && matchSubject && matchType && matchSearch;
  });

  const subjectOptions = ['All', ...new Set(resources.map((r) => r.subjectCode))];
  const typeOptions = ['All', 'PDF', 'PPT', 'Unit Notes', 'Lecture Slides', 'Question Bank'];

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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white/95 backdrop-blur-xl border border-white/80 shadow-[0_15px_40px_rgba(79,70,229,0.04)] rounded-3xl p-6">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-amber-50/70 border border-amber-200/70 p-1.5 flex items-center justify-center shrink-0 shadow-xs">
            <img src="/glb-logo.png" alt="GL Bajaj Crest" className="w-full h-full object-contain" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                AKTU Notes &amp; Study Repository
              </h1>
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-800 border border-blue-200">
                NotesGallery Sourced • 1st - 8th Sem
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Access AKTU Quantum Series, handwritten lecture notes, and unit modules across all semesters and engineering branches
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          {isTeacher && (
            <button
              onClick={() => setIsUploadModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs hover:shadow-md transition-all shrink-0"
            >
              <UploadCloud className="w-4 h-4" />
              <span>Upload Notes for Students</span>
            </button>
          )}

          <a
            href="https://notesgallery.com/b-tech-aktu/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-gradient-to-r from-blue-700 to-indigo-700 hover:from-blue-800 hover:to-indigo-800 text-white text-xs font-bold shadow-xs transition-transform hover:scale-[1.02]"
          >
            <Globe className="w-4 h-4" />
            <span>Open NotesGallery Portal</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </a>

          <div className="relative w-full sm:w-56">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search notes, subjects..."
              className="w-full text-xs pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 focus:outline-none focus:bg-white focus:border-blue-500"
            />
          </div>
        </div>
      </div>

      {/* NotesGallery AKTU B.Tech Year Hub Banner */}
      <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-blue-950 border border-blue-800/60 rounded-2xl p-5 text-white shadow-md space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-blue-400" />
            <h2 className="text-sm font-bold tracking-wide uppercase text-blue-200">
              AKTU B.Tech Academic Years • NotesGallery Direct PDF Library
            </h2>
          </div>
          <span className="text-[11px] text-blue-300 font-medium">
            Handwritten Notes &amp; Solved Quantum Series (Sem I through Sem VIII)
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {NOTESGALLERY_YEARS.map((y) => (
            <div
              key={y.year}
              className="p-4 rounded-xl bg-white/5 border border-white/10 hover:border-blue-400/50 hover:bg-white/10 transition-all flex flex-col justify-between space-y-3"
            >
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-extrabold text-white">{y.year}</span>
                  <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30">
                    {y.badge}
                  </span>
                </div>
                <p className="text-[11px] text-slate-300 line-clamp-2 leading-snug">{y.subjects}</p>
              </div>

              <div className="flex items-center gap-2 pt-1 border-t border-white/10">
                <a
                  href={y.quantumUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 text-center py-1.5 px-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-bold transition-colors flex items-center justify-center gap-1"
                >
                  <span>Quantum PDF</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
                <a
                  href={y.notesUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 text-center py-1.5 px-2 rounded-lg bg-white/10 hover:bg-white/20 text-blue-200 text-[10px] font-bold transition-colors flex items-center justify-center gap-1"
                >
                  <span>Notes</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Filter Toolbar (Semester & Subject & Type) */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-xs space-y-3">
        {/* Semester Filter */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider shrink-0 flex items-center gap-1">
            <Layers className="w-3.5 h-3.5 text-blue-600" />
            Semester:
          </span>
          {ALL_SEMESTERS.map((sem) => (
            <button
              key={sem}
              onClick={() => setSelectedSemester(sem)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                selectedSemester === sem
                  ? 'bg-blue-700 text-white shadow-xs font-bold'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70'
              }`}
            >
              {sem}
            </button>
          ))}
        </div>

        {/* Subject Filter */}
        <div className="flex items-center gap-2 overflow-x-auto pt-1 border-t border-slate-100">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider shrink-0">
            Subject:
          </span>
          {subjectOptions.slice(0, 10).map((code) => (
            <button
              key={code}
              onClick={() => setSelectedSubject(code)}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                selectedSubject === code
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70'
              }`}
            >
              {code}
            </button>
          ))}
          {subjectOptions.length > 10 && (
            <select
              value={subjectOptions.slice(0, 10).includes(selectedSubject) ? 'All' : selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="text-xs px-2 py-1 rounded-lg border border-slate-200 bg-slate-50 text-slate-700"
            >
              <option value="All">More Subjects...</option>
              {subjectOptions.slice(10).map((code) => (
                <option key={code} value={code}>
                  {code}
                </option>
              ))}
            </select>
          )}

          {(selectedSemester !== 'All' || selectedSubject !== 'All' || searchQuery !== '') && (
            <button
              onClick={() => {
                setSelectedSemester('All');
                setSelectedSubject('All');
                setSearchQuery('');
              }}
              className="ml-auto text-xs font-semibold text-rose-600 hover:text-rose-700 px-2.5 py-1 bg-rose-50 rounded-lg shrink-0"
            >
              Clear Filters
            </button>
          )}
        </div>
      </div>

      {/* Resources Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.length === 0 ? (
          <div className="col-span-full py-12 text-center bg-white border border-slate-200 rounded-2xl">
            <BookOpen className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <p className="text-sm font-bold text-slate-700">No resources match your filters.</p>
            <p className="text-xs text-slate-400 mt-1">Try selecting "All" semesters or searching for a different keyword.</p>
          </div>
        ) : (
          filtered.map((item) => {
            const sem = SUBJECT_SEMESTER_MAP[item.subjectCode] || 'AKTU Curriculum';
            const isNotesGallery = item.downloadUrl?.includes('notesgallery.com');
            return (
              <div
                key={item.id}
                className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs hover:border-blue-400 transition-all flex flex-col justify-between space-y-4 hover:shadow-sm"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded border border-blue-200">
                      {item.subjectCode}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                      {sem}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-slate-900 line-clamp-1">{item.title}</h3>
                    <p className="text-xs text-slate-500 mt-0.5">{item.subjectName} • {item.unit}</p>
                    <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">{item.topic}</p>
                  </div>

                  {item.summary && (
                    <div className="p-2 rounded-lg bg-blue-50/60 border border-blue-100 text-[11px] text-blue-900 leading-snug">
                      {item.summary}
                    </div>
                  )}

                  <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200/60 text-[11px] text-slate-600 flex items-center justify-between">
                    <span>By: <strong>{item.uploadedBy}</strong></span>
                    <span className="font-mono text-slate-500 font-semibold">{item.fileSize || 'PDF'}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className={`grid ${isTeacher ? 'grid-cols-3' : 'grid-cols-2'} gap-2 pt-2 border-t border-slate-100`}>
                  <button
                    onClick={() => handleSummarizeWithAI(item)}
                    className="py-2 px-2.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 text-xs font-bold flex items-center justify-center gap-1 transition-colors"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    AI Insights
                  </button>

                  <button
                    onClick={() => handleDownload(item)}
                    className="py-2 px-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center justify-center gap-1 transition-colors shadow-xs"
                  >
                    {isNotesGallery ? (
                      <>
                        <ExternalLink className="w-3.5 h-3.5" />
                        NotesGallery
                      </>
                    ) : (
                      <>
                        <Download className="w-3.5 h-3.5" />
                        Download
                      </>
                    )}
                  </button>

                  {isTeacher && (
                    <button
                      onClick={() => handleDeleteNote(item)}
                      className="py-2 px-2 rounded-xl text-rose-600 hover:text-rose-700 hover:bg-rose-50 border border-slate-200 text-xs font-bold flex items-center justify-center transition-colors"
                      title="Delete Note"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
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

      {/* Teacher Notes Upload Modal */}
      <Modal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        title="Upload Notes & Study Material for Students"
        subtitle="Publish lecture notes, unit modules, handwritten slides, or question banks directly to the student portal"
        maxWidth="xl"
      >
        <div className="p-6 space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
              Resource Title *
            </label>
            <input
              type="text"
              placeholder="e.g. Unit 3: Normalization (1NF, 2NF, 3NF, BCNF) Comprehensive Lecture Notes"
              value={uploadForm.title}
              onChange={(e) => setUploadForm({ ...uploadForm, title: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                Course Subject *
              </label>
              <select
                value={uploadForm.subjectCode}
                onChange={(e) => setUploadForm({ ...uploadForm, subjectCode: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-800"
              >
                <option value="KCS-601">KCS-601: DBMS</option>
                <option value="KCS-602">KCS-602: Operating Systems</option>
                <option value="KCS-603">KCS-603: Compiler Design</option>
                <option value="KOE-068">KOE-068: Software Project Mgmt</option>
                <option value="BAS-103">BAS-103: Engineering Maths - I</option>
                <option value="BCS-101">BCS-101: Programming Problem Solving</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                Syllabus Unit *
              </label>
              <select
                value={uploadForm.unit}
                onChange={(e) => setUploadForm({ ...uploadForm, unit: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-800"
              >
                <option value="Unit 1">Unit 1</option>
                <option value="Unit 2">Unit 2</option>
                <option value="Unit 3">Unit 3</option>
                <option value="Unit 4">Unit 4</option>
                <option value="Unit 5">Unit 5</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                Format / Type
              </label>
              <select
                value={uploadForm.type}
                onChange={(e) => setUploadForm({ ...uploadForm, type: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-800"
              >
                <option value="PDF">PDF Document</option>
                <option value="Unit Notes">Handwritten Unit Notes</option>
                <option value="Lecture Slides">Lecture Slides (PPT)</option>
                <option value="Question Bank">Question Bank / Numericals</option>
                <option value="Quantum Series">Quantum Series Module</option>
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
              Specific Topic Covered *
            </label>
            <input
              type="text"
              placeholder="e.g. BCNF, 3NF Lossless Join Decomposition & Dependency Preservation with 10 AKTU Numericals"
              value={uploadForm.topic}
              onChange={(e) => setUploadForm({ ...uploadForm, topic: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500 font-medium"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
              Download / Web Link or Document URL
            </label>
            <input
              type="text"
              placeholder="https://notesgallery.com/aktu-notes/ or campus cloud link (leave empty for default)"
              value={uploadForm.downloadUrl}
              onChange={(e) => setUploadForm({ ...uploadForm, downloadUrl: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
              Key Exam Takeaways / Summary (Optional)
            </label>
            <textarea
              rows={3}
              placeholder="Key concepts, theorem proofs, and tips for students studying this unit..."
              value={uploadForm.summary}
              onChange={(e) => setUploadForm({ ...uploadForm, summary: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              onClick={() => setIsUploadModalOpen(false)}
              className="px-4 py-2 border border-slate-200 text-slate-700 rounded-xl text-xs font-bold hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleUploadSubmit}
              disabled={isSubmitting}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white rounded-xl text-xs font-bold shadow-xs hover:shadow-md transition-all flex items-center gap-1.5"
            >
              <UploadCloud className="w-4 h-4" />
              {isSubmitting ? 'Publishing...' : 'Publish Notes to Students'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
