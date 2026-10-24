import React, { useState, useEffect } from 'react';
import { resourceService } from '../services/resourceService';
import { authService } from '../services/authService';
import { PYQItem, UserProfile } from '../types';
import { PYQCard } from '../components/pyq/PYQCard';
import { LoadingState } from '../components/common/LoadingState';
import { Modal } from '../components/common/Modal';
import {
  Search,
  Sparkles,
  CheckCircle2,
  Layers,
  Globe,
  ArrowUpRight,
  Plus,
  UploadCloud,
  HelpCircle,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

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

const KNOWN_SUBJECTS: Record<string, { name: string; sem: string }> = {
  'KCS-601': { name: 'Database Management Systems', sem: 'Semester VI' },
  'KCS-602': { name: 'Web Technology', sem: 'Semester VI' },
  'KCS-603': { name: 'Computer Networks', sem: 'Semester VI' },
  'KCS-501': { name: 'Database Management Systems', sem: 'Semester V' },
  'KCS-502': { name: 'Compiler Design', sem: 'Semester V' },
  'KCS-503': { name: 'Design and Analysis of Algorithms', sem: 'Semester V' },
  'KCS-301': { name: 'Data Structures', sem: 'Semester III' },
  'KCS-302': { name: 'Computer Organization and Architecture', sem: 'Semester III' },
  'KCS-303': { name: 'Discrete Structures & Logic', sem: 'Semester III' },
  'KCS-401': { name: 'Operating Systems', sem: 'Semester IV' },
  'KCS-402': { name: 'Theory of Automata & Formal Languages', sem: 'Semester IV' },
  'BAS-103': { name: 'Engineering Mathematics-I', sem: 'Semester I' },
  'BAS-101': { name: 'Engineering Physics', sem: 'Semester I' },
  'BCS-101': { name: 'Programming for Problem Solving', sem: 'Semester I' },
  'BAS-203': { name: 'Engineering Mathematics-II', sem: 'Semester II' },
  'BEC-201': { name: 'Basic Electronics Engineering', sem: 'Semester II' },
  'KCS-701': { name: 'Artificial Intelligence', sem: 'Semester VII' },
  'KCS-702': { name: 'Cloud Computing', sem: 'Semester VII' },
  'KOE-084': { name: 'Introduction to Smart Grid', sem: 'Semester VIII' },
};

export const PYQsPage: React.FC = () => {
  const navigate = useNavigate();
  const [pyqs, setPyqs] = useState<PYQItem[]>([]);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSemester, setSelectedSemester] = useState<string>('All');
  const [selectedSubject, setSelectedSubject] = useState<string>('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('All');
  const [selectedExamType, setSelectedExamType] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [toastMessage, setToastMessage] = useState<string>('');

  // Teacher PYQ upload modal state
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pyqForm, setPyqForm] = useState({
    question: '',
    subjectCode: 'KCS-601',
    subjectName: 'Database Management Systems',
    semester: 'Semester VI',
    year: '2023-24',
    unit: 'Unit 1',
    examType: 'End-Sem',
    difficulty: 'Medium',
    frequency: 3,
    topic: '',
    marksWeightage: 10,
  });

  const isTeacher = currentUser?.role === 'faculty' || currentUser?.role === 'admin';

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const [data, user] = await Promise.all([
          resourceService.getPYQs(),
          authService.getCurrentUser().catch(() => null),
        ]);
        setPyqs(data);
        setCurrentUser(user);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleSubjectChange = (subjectCode: string) => {
    const info = KNOWN_SUBJECTS[subjectCode];
    setPyqForm((prev) => ({
      ...prev,
      subjectCode,
      subjectName: info ? info.name : prev.subjectName,
      semester: info ? info.sem : prev.semester,
    }));
  };

  const handlePractice = (item: PYQItem) => {
    setToastMessage(`Started practice session for question: "${item.question.slice(0, 45)}..."`);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const handleAddToPlan = (item: PYQItem) => {
    setToastMessage(`Added to Smart Study Plan!`);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const handleDeletePYQ = async (item: PYQItem) => {
    if (!confirm(`Are you sure you want to delete this question from the AKTU Question Bank?\n\n"${item.question.slice(0, 70)}..."`)) {
      return;
    }
    try {
      await resourceService.deletePYQ(item.id);
      setPyqs((prev) => prev.filter((p) => p.id !== item.id));
      setToastMessage('Question removed from AKTU Question Bank.');
      setTimeout(() => setToastMessage(''), 3000);
    } catch (err: any) {
      alert(err.message || 'Failed to delete question.');
    }
  };

  const handleUploadPYQSubmit = async () => {
    if (!pyqForm.question.trim() || !pyqForm.topic.trim()) {
      alert('Please fill in both the Question Statement and the Topic.');
      return;
    }
    try {
      setIsSubmitting(true);
      const created = await resourceService.uploadPYQ({
        question: pyqForm.question.trim(),
        subjectCode: pyqForm.subjectCode,
        subjectName: pyqForm.subjectName || 'Database Management Systems',
        semester: pyqForm.semester,
        year: pyqForm.year,
        unit: pyqForm.unit,
        examType: pyqForm.examType,
        difficulty: pyqForm.difficulty,
        frequency: Number(pyqForm.frequency) || 1,
        topic: pyqForm.topic.trim(),
        marksWeightage: Number(pyqForm.marksWeightage) || 10,
      });
      setPyqs((prev) => [created, ...prev]);
      setIsUploadModalOpen(false);
      setToastMessage('AKTU PYQ Question published successfully to students!');
      setTimeout(() => setToastMessage(''), 4000);
      setPyqForm({
        question: '',
        subjectCode: 'KCS-601',
        subjectName: 'Database Management Systems',
        semester: 'Semester VI',
        year: '2023-24',
        unit: 'Unit 1',
        examType: 'End-Sem',
        difficulty: 'Medium',
        frequency: 3,
        topic: '',
        marksWeightage: 10,
      });
    } catch (err: any) {
      alert(err.message || 'Failed to upload PYQ question.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <LoadingState message="Loading PYQ Database..." subMessage="Fetching AKTU 5-year question archives across Semesters 1-8" />;
  }

  const filtered = pyqs.filter((item) => {
    const matchSemester = selectedSemester === 'All' || item.semester === selectedSemester;
    const matchSubject = selectedSubject === 'All' || item.subjectCode === selectedSubject;
    const matchDifficulty = selectedDifficulty === 'All' || item.difficulty === selectedDifficulty;
    const matchExam = selectedExamType === 'All' || item.examType === selectedExamType;
    const matchSearch =
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.subjectName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.subjectCode.toLowerCase().includes(searchQuery.toLowerCase());
    return matchSemester && matchSubject && matchDifficulty && matchExam && matchSearch;
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white/95 backdrop-blur-xl border border-white/80 shadow-[0_15px_40px_rgba(79,70,229,0.04)] rounded-3xl p-6">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-amber-50/70 border border-amber-200/70 p-1.5 flex items-center justify-center shrink-0 shadow-xs">
            <img src="/glb-logo.png" alt="GL Bajaj Crest" className="w-full h-full object-contain" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                AKTU PYQ Question Bank
              </h1>
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-800 border border-blue-200">
                5-Year Archives • Semesters 1-8
              </span>
              {isTeacher && (
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                  Faculty Contributor Mode
                </span>
              )}
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Exam questions tagged with frequency, topic weightage &amp; model answers from NotesGallery and AKTU university papers
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Teacher Upload PYQ Action */}
          {isTeacher && (
            <button
              onClick={() => setIsUploadModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs hover:shadow-md transition-all"
            >
              <Plus className="w-4 h-4" />
              Upload AKTU PYQ
            </button>
          )}

          <a
            href="https://notesgallery.com/b-tech-aktu/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors"
          >
            <Globe className="w-3.5 h-3.5 text-blue-600" />
            <span>NotesGallery AKTU</span>
            <ArrowUpRight className="w-3 h-3 text-slate-400" />
          </a>

          <button
            onClick={() => navigate('/pyq-analyzer')}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-xs transition-colors"
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            Launch AI PYQ Analyzer
          </button>
        </div>
      </div>

      {/* Filter Controls */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-xs space-y-3">
        {/* Semester Filter Bar */}
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

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1 border-t border-slate-100">
          {/* Search bar */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search questions by keyword, topic or subject..."
              className="w-full text-xs pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 focus:outline-none focus:bg-white focus:border-blue-500"
            />
          </div>

          <span className="text-xs font-bold text-slate-500 shrink-0 self-center">
            {filtered.length} Questions Found
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-3 pt-1 border-t border-slate-100">
          {/* Subject options */}
          <div className="flex items-center gap-1.5 overflow-x-auto">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Subject:</span>
            {subjectOptions.slice(0, 8).map((code) => (
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
            {subjectOptions.length > 8 && (
              <select
                value={subjectOptions.slice(0, 8).includes(selectedSubject) ? 'All' : selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="text-xs px-2 py-1 rounded-lg border border-slate-200 bg-slate-50 text-slate-700"
              >
                <option value="All">More Subjects...</option>
                {subjectOptions.slice(8).map((code) => (
                  <option key={code} value={code}>
                    {code}
                  </option>
                ))}
              </select>
            )}
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

          {(selectedSemester !== 'All' || selectedSubject !== 'All' || selectedDifficulty !== 'All' || selectedExamType !== 'All' || searchQuery !== '') && (
            <button
              onClick={() => {
                setSelectedSemester('All');
                setSelectedSubject('All');
                setSelectedDifficulty('All');
                setSelectedExamType('All');
                setSearchQuery('');
              }}
              className="ml-auto text-xs font-semibold text-rose-600 hover:text-rose-700 px-2.5 py-1 bg-rose-50 rounded-lg shrink-0"
            >
              Clear Filters
            </button>
          )}
        </div>
      </div>

      {/* Questions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((item) => (
          <PYQCard
            key={item.id}
            pyq={item}
            isTeacher={isTeacher}
            onPractice={handlePractice}
            onAddToPlan={handleAddToPlan}
            onDelete={handleDeletePYQ}
          />
        ))}
      </div>

      {/* Teacher PYQ Upload Modal */}
      <Modal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        title="Upload AKTU Previous Year Question (PYQ)"
      >
        <div className="space-y-4 pt-2">
          <div className="p-3 bg-blue-50/80 border border-blue-200/80 rounded-2xl flex items-start gap-2.5">
            <HelpCircle className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
            <div className="text-xs text-blue-900 leading-relaxed">
              <span className="font-bold">Faculty Question Bank Contribution:</span> Add high-frequency AKTU end-sem questions, numericals, and PUT problems. This directly feeds into students' AI study plans and exam risk diagnostics.
            </div>
          </div>

          {/* Question Statement */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
              Question Statement *
            </label>
            <textarea
              rows={4}
              placeholder="e.g. Differentiate between conflict serializability and view serializability with suitable schedule examples. Explain how precedence graph detects conflict serializability."
              value={pyqForm.question}
              onChange={(e) => setPyqForm({ ...pyqForm, question: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500 font-medium"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                Subject Code *
              </label>
              <select
                value={pyqForm.subjectCode}
                onChange={(e) => handleSubjectChange(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-800"
              >
                {Object.keys(KNOWN_SUBJECTS).map((code) => (
                  <option key={code} value={code}>
                    {code} - {KNOWN_SUBJECTS[code].name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                Subject Name
              </label>
              <input
                type="text"
                value={pyqForm.subjectName}
                onChange={(e) => setPyqForm({ ...pyqForm, subjectName: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800 font-medium"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                Semester
              </label>
              <select
                value={pyqForm.semester}
                onChange={(e) => setPyqForm({ ...pyqForm, semester: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-800"
              >
                {ALL_SEMESTERS.filter((s) => s !== 'All').map((sem) => (
                  <option key={sem} value={sem}>
                    {sem}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                Exam Year
              </label>
              <select
                value={pyqForm.year}
                onChange={(e) => setPyqForm({ ...pyqForm, year: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-800"
              >
                <option value="2023-24">2023-24</option>
                <option value="2022-23">2022-23</option>
                <option value="2021-22">2021-22</option>
                <option value="2020-21">2020-21</option>
                <option value="2019-20">2019-20</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                Syllabus Unit
              </label>
              <select
                value={pyqForm.unit}
                onChange={(e) => setPyqForm({ ...pyqForm, unit: e.target.value })}
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
                Exam Type
              </label>
              <select
                value={pyqForm.examType}
                onChange={(e) => setPyqForm({ ...pyqForm, examType: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-800"
              >
                <option value="End-Sem">End-Sem</option>
                <option value="PUT">PUT (Pre-University)</option>
                <option value="Sessional">Sessional / Mid-Term</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                Difficulty Level
              </label>
              <select
                value={pyqForm.difficulty}
                onChange={(e) => setPyqForm({ ...pyqForm, difficulty: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-800"
              >
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                Marks Weightage
              </label>
              <input
                type="number"
                min="1"
                max="20"
                value={pyqForm.marksWeightage}
                onChange={(e) => setPyqForm({ ...pyqForm, marksWeightage: Number(e.target.value) })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800 font-bold"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                Frequency (Times Asked)
              </label>
              <input
                type="number"
                min="1"
                max="10"
                value={pyqForm.frequency}
                onChange={(e) => setPyqForm({ ...pyqForm, frequency: Number(e.target.value) })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800 font-bold"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
              Specific Topic Covered *
            </label>
            <input
              type="text"
              placeholder="e.g. Serializability & Locking Protocols"
              value={pyqForm.topic}
              onChange={(e) => setPyqForm({ ...pyqForm, topic: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500 font-medium"
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
              onClick={handleUploadPYQSubmit}
              disabled={isSubmitting}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white rounded-xl text-xs font-bold shadow-xs hover:shadow-md transition-all flex items-center gap-1.5"
            >
              <UploadCloud className="w-4 h-4" />
              {isSubmitting ? 'Publishing...' : 'Publish Question to Students'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

