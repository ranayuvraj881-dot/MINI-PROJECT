import React, { useState, useEffect, useMemo } from 'react';
import { academicService } from '../services/academicService';
import {
  facultyService,
  StudentStrengthDiagnosisItem,
  ClassMarksAnalyticsResponse,
  MarksAiDiagnosisResponse,
  AtRiskStudentDiagnosis,
  FacultyStudentItem,
} from '../services/facultyService';
import { authService } from '../services/authService';
import { SubjectMarks, UserProfile } from '../types';
import { LoadingState } from '../components/common/LoadingState';
import { Modal } from '../components/common/Modal';
import {
  Award,
  TrendingUp,
  BarChart2,
  BookOpen,
  AlertCircle,
  Sparkles,
  UploadCloud,
  FileSpreadsheet,
  Search,
  Filter,
  Plus,
  Edit2,
  CheckCircle2,
  AlertTriangle,
  Check,
  RefreshCw,
  X,
  ArrowUpRight,
  ArrowDownRight,
  Eye,
  Send,
  Users,
  ChevronRight,
  ShieldAlert,
  ClipboardList,
  GraduationCap,
  Download,
  Info
} from 'lucide-react';
import { ProgressBar } from '../components/common/ProgressBar';

const AVAILABLE_SUBJECTS = [
  { code: 'KCS-601', name: 'Database Management Systems', credits: 4, sem: 'Semester VI' },
  { code: 'KCS-602', name: 'Operating Systems', credits: 4, sem: 'Semester VI' },
  { code: 'KCS-603', name: 'Compiler Design', credits: 4, sem: 'Semester VI' },
  { code: 'KOE-068', name: 'Software Project Management', credits: 3, sem: 'Semester VI' },
];

export const MarksPage: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'facultyConsole' | 'studentPreview'>('facultyConsole');

  // Faculty state
  const [selectedSubject, setSelectedSubject] = useState<string>('KCS-601');
  const [selectedSection, setSelectedSection] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [strengthFilter, setStrengthFilter] = useState<'ALL' | 'STRONG' | 'MODERATE' | 'WEAK'>('ALL');
  const [classAnalytics, setClassAnalytics] = useState<ClassMarksAnalyticsResponse | null>(null);
  const [enrolledStudents, setEnrolledStudents] = useState<FacultyStudentItem[]>([]);
  const [toastMessage, setToastMessage] = useState<string>('');

  // Modals state
  const [modalType, setModalType] = useState<
    'uploadSingle' | 'uploadBulk' | 'aiDiagnostic' | 'studentDetails' | 'sendAlert' | null
  >(null);
  const [selectedStudent, setSelectedStudent] = useState<StudentStrengthDiagnosisItem | null>(null);

  // Single upload form state
  const [singleForm, setSingleForm] = useState({
    rollNumber: '',
    studentId: '',
    studentName: '',
    subjectCode: 'KCS-601',
    sessional1: 24,
    sessional2: 24,
    quizzes: 8,
    assignments: 9,
    practicals: 18,
  });
  const [rollSearchSuggestions, setRollSearchSuggestions] = useState<FacultyStudentItem[]>([]);

  // Bulk upload form state
  const [bulkCsvText, setBulkCsvText] = useState<string>('');
  const [bulkParsedRecords, setBulkParsedRecords] = useState<
    {
      rollNumber: string;
      studentName: string;
      sessional1: number;
      sessional2: number;
      quizzes: number;
      assignments: number;
      practicals: number;
      isValid: boolean;
      error?: string;
    }[]
  >([]);

  // AI Diagnostic state
  const [aiDiagnostic, setAiDiagnostic] = useState<MarksAiDiagnosisResponse | null>(null);
  const [aiLoading, setAiLoading] = useState(false);

  // Alert form state
  const [alertForm, setAlertForm] = useState({
    title: 'Academic Performance Advisory: CIE Marks',
    message: '',
    type: 'warning' as 'warning' | 'info' | 'urgent',
  });

  // Student perspective state
  const [studentMarks, setStudentMarks] = useState<SubjectMarks[]>([]);
  const [studentInsights, setStudentInsights] = useState<{ id: string; title: string; message: string }[]>([]);

  const isTeacherOrAdmin = currentUser?.role === 'faculty' || currentUser?.role === 'admin';

  // Load initial data
  useEffect(() => {
    const init = async () => {
      try {
        setLoading(true);
        const user = await authService.getCurrentUser().catch(() => null);
        setCurrentUser(user);

        if (user?.role === 'faculty' || user?.role === 'admin') {
          setActiveTab('facultyConsole');
          await loadFacultyMarks(selectedSubject, selectedSection);
        } else {
          setActiveTab('studentPreview');
          await loadStudentMarks();
        }
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  // Reload faculty marks when subject or section changes
  useEffect(() => {
    if (isTeacherOrAdmin && activeTab === 'facultyConsole') {
      loadFacultyMarks(selectedSubject, selectedSection);
    }
  }, [selectedSubject, selectedSection, activeTab]);

  const loadFacultyMarks = async (subjectCode: string, section?: string) => {
    try {
      const [analytics, students] = await Promise.all([
        facultyService.getClassMarksAnalytics(subjectCode, section),
        facultyService.getStudents(section === 'All' ? undefined : section).catch(() => []),
      ]);
      setClassAnalytics(analytics);
      setEnrolledStudents(students);
    } catch (err) {
      console.error('Failed to load faculty marks analytics:', err);
    }
  };

  const loadStudentMarks = async () => {
    try {
      const [mks, ins] = await Promise.all([
        academicService.getSubjectMarks().catch(() => []),
        academicService.getMarksInsights().catch(() => []),
      ]);
      setStudentMarks(mks);
      setStudentInsights(ins);
    } catch (err) {
      console.error('Failed to load student marks:', err);
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 4500);
  };

  // Filter students in faculty table
  const filteredStudents = useMemo(() => {
    if (!classAnalytics?.students) return [];
    return classAnalytics.students.filter((item) => {
      const matchesSearch =
        searchQuery.trim() === '' ||
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.rollNumber.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStrength =
        strengthFilter === 'ALL' || item.strengthStatus === strengthFilter;

      return matchesSearch && matchesStrength;
    });
  }, [classAnalytics, searchQuery, strengthFilter]);

  // Handle Roll Number autocomplete for single upload
  const handleRollNumberChange = (val: string) => {
    setSingleForm((prev) => ({ ...prev, rollNumber: val }));
    if (val.trim().length >= 2) {
      const matched = enrolledStudents.filter(
        (s) =>
          s.rollNumber.toLowerCase().includes(val.toLowerCase()) ||
          s.name.toLowerCase().includes(val.toLowerCase())
      );
      setRollSearchSuggestions(matched.slice(0, 5));

      const exact = enrolledStudents.find(
        (s) => s.rollNumber.toLowerCase() === val.trim().toLowerCase()
      );
      if (exact) {
        setSingleForm((prev) => ({
          ...prev,
          rollNumber: exact.rollNumber,
          studentId: exact.id,
          studentName: exact.name,
        }));
      }
    } else {
      setRollSearchSuggestions([]);
    }
  };

  const selectStudentFromSuggestion = (stu: FacultyStudentItem) => {
    setSingleForm((prev) => ({
      ...prev,
      rollNumber: stu.rollNumber,
      studentId: stu.id,
      studentName: stu.name,
    }));
    setRollSearchSuggestions([]);
  };

  // Open modal for single student marks edit
  const openSingleUploadModal = (student?: StudentStrengthDiagnosisItem) => {
    if (student) {
      setSingleForm({
        rollNumber: student.rollNumber,
        studentId: student.studentId,
        studentName: student.name,
        subjectCode: selectedSubject,
        sessional1: student.sessional1 || 24,
        sessional2: student.sessional2 || 24,
        quizzes: student.quizzes || 8,
        assignments: student.assignments || 9,
        practicals: student.practicals || 18,
      });
    } else {
      // New / quick entry
      const first = enrolledStudents[0];
      setSingleForm({
        rollNumber: first ? first.rollNumber : '',
        studentId: first ? first.id : '',
        studentName: first ? first.name : '',
        subjectCode: selectedSubject,
        sessional1: 24,
        sessional2: 24,
        quizzes: 8,
        assignments: 9,
        practicals: 18,
      });
    }
    setRollSearchSuggestions([]);
    setModalType('uploadSingle');
  };

  // Submit single student marks
  const handleSaveSingleMarks = async () => {
    if (!singleForm.rollNumber && !singleForm.studentId) {
      alert('Please specify a student Roll Number.');
      return;
    }
    try {
      const res = await facultyService.recordMarks({
        rollNumber: singleForm.rollNumber,
        studentId: singleForm.studentId || undefined,
        subjectCode: selectedSubject,
        sessional1: Number(singleForm.sessional1),
        sessional2: Number(singleForm.sessional2),
        quizzes: Number(singleForm.quizzes),
        assignments: Number(singleForm.assignments),
        practicals: Number(singleForm.practicals),
      });

      showToast(`✓ Marks successfully recorded for ${res.studentName} (Roll: ${res.rollNumber})! Status: ${res.strengthStatus}`);
      setModalType(null);
      await loadFacultyMarks(selectedSubject, selectedSection);
    } catch (err: any) {
      alert(err.message || 'Failed to save student marks.');
    }
  };

  // Parse CSV text for batch upload
  const handleCsvTextChange = (text: string) => {
    setBulkCsvText(text);
    const lines = text.trim().split('\n');
    const parsed: any[] = [];

    lines.forEach((line) => {
      const clean = line.trim();
      if (!clean || clean.toLowerCase().startsWith('roll')) return; // Skip headers or empty lines
      const parts = clean.split(',').map((p) => p.trim());
      if (parts.length >= 2) {
        const roll = parts[0];
        const s1 = parseFloat(parts[1]) || 0;
        const s2 = parseFloat(parts[2]) || 0;
        const q = parseFloat(parts[3]) || 0;
        const asg = parseFloat(parts[4]) || 0;
        const prac = parseFloat(parts[5]) || 0;

        const matchedStudent = enrolledStudents.find(
          (s) => s.rollNumber.toLowerCase() === roll.toLowerCase()
        );

        const isValid = s1 <= 30 && s2 <= 30 && q <= 10 && asg <= 10 && prac <= 20;
        let error = '';
        if (!matchedStudent) error = 'Roll No not in enrolled roster';
        else if (!isValid) error = 'Values exceed maximum CIE marks allowed';

        parsed.push({
          rollNumber: roll,
          studentName: matchedStudent ? matchedStudent.name : 'Unknown Student',
          sessional1: s1,
          sessional2: s2,
          quizzes: q,
          assignments: asg,
          practicals: prac,
          isValid: Boolean(matchedStudent && isValid),
          error,
        });
      }
    });

    setBulkParsedRecords(parsed);
  };

  // Submit bulk batch marks
  const handleSaveBulkMarks = async () => {
    if (bulkParsedRecords.length === 0) {
      alert('No valid student marks detected to upload.');
      return;
    }
    const validRows = bulkParsedRecords.filter((r) => r.isValid);
    if (validRows.length === 0) {
      alert('All parsed entries have errors. Please correct the roll numbers or mark values.');
      return;
    }

    try {
      const payload = {
        subjectCode: selectedSubject,
        records: validRows.map((r) => ({
          rollNumber: r.rollNumber,
          subjectCode: selectedSubject,
          sessional1: r.sessional1,
          sessional2: r.sessional2,
          quizzes: r.quizzes,
          assignments: r.assignments,
          practicals: r.practicals,
        })),
      };

      const res = await facultyService.recordBulkMarks(payload);
      showToast(`✓ Batch Upload Complete: Successfully updated marks for ${res.updatedCount} students!`);
      setModalType(null);
      setBulkCsvText('');
      setBulkParsedRecords([]);
      await loadFacultyMarks(selectedSubject, selectedSection);
    } catch (err: any) {
      alert(err.message || 'Failed to execute batch upload.');
    }
  };

  // Trigger AI Strength & Weakness Diagnostic
  const handleRunAiDiagnostic = async () => {
    try {
      setAiLoading(true);
      setModalType('aiDiagnostic');
      const res = await facultyService.getMarksAiDiagnostic(selectedSubject, selectedSection);
      setAiDiagnostic(res);
    } catch (err) {
      console.error('Failed to run AI diagnostic:', err);
    } finally {
      setAiLoading(false);
    }
  };

  // Send Academic Alert to Student
  const handleSendAlert = async () => {
    if (!selectedStudent) return;
    try {
      await facultyService.sendStudentAlert({
        studentId: selectedStudent.studentId,
        title: alertForm.title,
        message: alertForm.message || `Your current CIE standing in ${selectedStudent.subjectName} is evaluated at ${selectedStudent.totalPercentage}%. Please attend upcoming remedial counseling.`,
        type: alertForm.type,
      });
      showToast(`✓ Academic counseling alert delivered to ${selectedStudent.name}!`);
      setModalType(null);
    } catch (err: any) {
      alert(err.message || 'Failed to dispatch alert.');
    }
  };

  // Live calculation preview in single upload modal
  const liveTotalScored =
    Number(singleForm.sessional1 || 0) +
    Number(singleForm.sessional2 || 0) +
    Number(singleForm.quizzes || 0) +
    Number(singleForm.assignments || 0) +
    Number(singleForm.practicals || 0);
  const livePercentage = Math.round((liveTotalScored / 100) * 100);
  const liveGrade =
    livePercentage >= 85 ? 'Grade A+' : livePercentage >= 75 ? 'Grade A' : livePercentage >= 65 ? 'Grade B+' : livePercentage >= 50 ? 'Grade B' : 'Grade C';
  const liveStrength =
    livePercentage >= 75 ? 'STRONG' : livePercentage < 60 ? 'WEAK' : 'MODERATE';

  if (loading) {
    return (
      <LoadingState
        message="Loading Examination Marks &amp; Academic Grading Console..."
        subMessage="Retrieving Continuous Internal Evaluation (CIE) records from database"
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-slate-900/95 text-white px-5 py-3.5 rounded-2xl shadow-2xl border border-slate-700/80 backdrop-blur-md animate-in slide-in-from-bottom-4 duration-300">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-xs sm:text-sm font-semibold">{toastMessage}</span>
          <button onClick={() => setToastMessage('')} className="text-slate-400 hover:text-white ml-2">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Header Banner */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white/95 backdrop-blur-xl border border-white/80 shadow-[0_15px_40px_rgba(79,70,229,0.04)] rounded-3xl p-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-50/70 border border-amber-200/70 p-1.5 flex items-center justify-center shrink-0 shadow-xs">
            <img src="/glb-logo.png" alt="GL Bajaj Crest" className="w-full h-full object-contain" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Marks &amp; Academic Evaluations
              </h1>
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-800 border border-blue-200">
                CIE System
              </span>
              {isTeacherOrAdmin && (
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-800 border border-purple-200">
                  Faculty Grading Console
                </span>
              )}
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Continuous Internal Evaluation (Sessional 1, Sessional 2, Quizzes, Assignments &amp; Lab Practical Vivas)
            </p>
          </div>
        </div>

        {/* Console Controls / Role Switcher */}
        {isTeacherOrAdmin ? (
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200/80">
              <button
                onClick={() => setActiveTab('facultyConsole')}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                  activeTab === 'facultyConsole'
                    ? 'bg-white text-blue-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Teacher Grading Console
              </button>
              <button
                onClick={() => {
                  setActiveTab('studentPreview');
                  loadStudentMarks();
                }}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                  activeTab === 'studentPreview'
                    ? 'bg-white text-blue-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Student View Preview
              </button>
            </div>

            <button
              onClick={() => loadFacultyMarks(selectedSubject, selectedSection)}
              className="p-2.5 rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors shadow-xs"
              title="Refresh marks data"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-center min-w-[100px]">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Current CGPA</span>
              <p className="text-xl font-black text-slate-900">8.65</p>
            </div>
            <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 text-center min-w-[100px]">
              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700">Projected SGPA</span>
              <p className="text-xl font-black text-blue-900">8.90</p>
            </div>
          </div>
        )}
      </div>

      {/* FACULTY GRADING CONSOLE VIEW */}
      {isTeacherOrAdmin && activeTab === 'facultyConsole' && (
        <div className="space-y-6">
          {/* Subject & Section Selector Controls */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-3">
              <div className="space-y-1">
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                  Course Subject
                </label>
                <select
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                  className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs sm:text-sm font-bold text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                >
                  {AVAILABLE_SUBJECTS.map((sub) => (
                    <option key={sub.code} value={sub.code}>
                      {sub.code}: {sub.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                  Cohort Section
                </label>
                <select
                  value={selectedSection}
                  onChange={(e) => setSelectedSection(e.target.value)}
                  className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs sm:text-sm font-bold text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                >
                  <option value="All">All Sections (Entire Cohort)</option>
                  <option value="CSE-3B">Section CSE-3B (Primary)</option>
                  <option value="CSE-3A">Section CSE-3A</option>
                  <option value="CSE-1A">Section CSE-1A</option>
                </select>
              </div>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex items-center gap-2.5 flex-wrap">
              <button
                onClick={() => openSingleUploadModal()}
                className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs hover:shadow-md transition-all"
              >
                <Plus className="w-4 h-4" />
                Upload Marks by Roll No
              </button>

              <button
                onClick={() => {
                  setBulkCsvText('');
                  setBulkParsedRecords([]);
                  setModalType('uploadBulk');
                }}
                className="flex items-center gap-2 px-3.5 py-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all shadow-xs"
              >
                <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                CSV / Batch Upload
              </button>

              <button
                onClick={handleRunAiDiagnostic}
                className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-xl text-xs font-bold shadow-xs hover:shadow-md transition-all"
              >
                <Sparkles className="w-4 h-4" />
                AI Diagnostic: Check What is Strong or Not
              </button>
            </div>
          </div>

          {/* Academic Strength & CIE Health Diagnostic Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Total Students Evaluated */}
            <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs relative overflow-hidden">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total Enrolled</span>
                <span className="p-2 rounded-xl bg-blue-50 text-blue-700">
                  <Users className="w-4 h-4" />
                </span>
              </div>
              <p className="text-2xl font-black text-slate-900 mt-2">
                {classAnalytics?.totalEnrolled || 0}
              </p>
              <p className="text-xs text-slate-500 mt-1">
                {classAnalytics?.evaluatedCount || 0} evaluated in {classAnalytics?.subjectCode}
              </p>
            </div>

            {/* Strong Students */}
            <div className="bg-white border border-emerald-200/90 rounded-2xl p-5 shadow-xs relative overflow-hidden bg-emerald-50/20">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800">
                  Strong Mastery (&ge; 75%)
                </span>
                <span className="p-2 rounded-xl bg-emerald-100 text-emerald-800">
                  <CheckCircle2 className="w-4 h-4" />
                </span>
              </div>
              <div className="flex items-baseline gap-2 mt-2">
                <p className="text-2xl font-black text-emerald-950">
                  {classAnalytics?.strongCount || 0}
                </p>
                <span className="text-xs font-bold text-emerald-700">
                  ({classAnalytics?.strongPercentage || 0}%)
                </span>
              </div>
              <p className="text-xs text-emerald-700 mt-1 font-medium">
                Grade A / A+ &bull; Conceptual leaders
              </p>
            </div>

            {/* Steady / Moderate */}
            <div className="bg-white border border-amber-200/90 rounded-2xl p-5 shadow-xs relative overflow-hidden bg-amber-50/20">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800">
                  Steady / Moderate (60&ndash;74%)
                </span>
                <span className="p-2 rounded-xl bg-amber-100 text-amber-800">
                  <BarChart2 className="w-4 h-4" />
                </span>
              </div>
              <div className="flex items-baseline gap-2 mt-2">
                <p className="text-2xl font-black text-amber-950">
                  {classAnalytics?.moderateCount || 0}
                </p>
                <span className="text-xs font-bold text-amber-700">
                  ({classAnalytics?.moderatePercentage || 0}%)
                </span>
              </div>
              <p className="text-xs text-amber-700 mt-1 font-medium">
                Grade B / B+ &bull; Ready for distinction push
              </p>
            </div>

            {/* Weak / At-Risk */}
            <div className="bg-white border border-rose-200/90 rounded-2xl p-5 shadow-xs relative overflow-hidden bg-rose-50/20">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-rose-800">
                  Weak / At-Risk (&lt; 60%)
                </span>
                <span className="p-2 rounded-xl bg-rose-100 text-rose-800">
                  <AlertTriangle className="w-4 h-4" />
                </span>
              </div>
              <div className="flex items-baseline gap-2 mt-2">
                <p className="text-2xl font-black text-rose-950">
                  {classAnalytics?.weakCount || 0}
                </p>
                <span className="text-xs font-bold text-rose-700">
                  ({classAnalytics?.weakPercentage || 0}%)
                </span>
              </div>
              <p className="text-xs text-rose-700 mt-1 font-medium">
                Needs Remedial Classes &amp; PYQ Revision
              </p>
            </div>
          </div>

          {/* Component Performance Benchmark Strip */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-5 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Component Averages Benchmark ({selectedSubject})
                </h3>
                <p className="text-xs text-slate-700 font-semibold mt-0.5">
                  Class Overall CIE Average: <span className="text-blue-900 font-black">{classAnalytics?.classAveragePercentage || 78.5}%</span> &bull; Health: <span className="text-emerald-700 font-bold">{classAnalytics?.overallHealth || 'Healthy'}</span>
                </p>
              </div>
              <button
                onClick={handleRunAiDiagnostic}
                className="text-xs font-bold text-indigo-700 hover:text-indigo-900 flex items-center gap-1 self-start sm:self-auto"
              >
                <Sparkles className="w-3.5 h-3.5" />
                View AI Diagnostic Breakdown &rarr;
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-1">
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 text-center">
                <span className="text-[10px] font-bold text-slate-400 block uppercase">Sessional 1 (30)</span>
                <p className="text-sm font-black text-slate-800 mt-0.5">{classAnalytics?.averageSessional1 || 0} / 30</p>
                <span className="text-[10px] font-semibold text-slate-500">{Math.round(((classAnalytics?.averageSessional1 || 0) / 30) * 100)}%</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 text-center">
                <span className="text-[10px] font-bold text-slate-400 block uppercase">Sessional 2 (30)</span>
                <p className="text-sm font-black text-slate-800 mt-0.5">{classAnalytics?.averageSessional2 || 0} / 30</p>
                <span className="text-[10px] font-semibold text-slate-500">{Math.round(((classAnalytics?.averageSessional2 || 0) / 30) * 100)}%</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 text-center">
                <span className="text-[10px] font-bold text-slate-400 block uppercase">Quizzes (10)</span>
                <p className="text-sm font-black text-slate-800 mt-0.5">{classAnalytics?.averageQuizzes || 0} / 10</p>
                <span className="text-[10px] font-semibold text-slate-500">{Math.round(((classAnalytics?.averageQuizzes || 0) / 10) * 100)}%</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 text-center">
                <span className="text-[10px] font-bold text-slate-400 block uppercase">Assignments (10)</span>
                <p className="text-sm font-black text-slate-800 mt-0.5">{classAnalytics?.averageAssignments || 0} / 10</p>
                <span className="text-[10px] font-semibold text-slate-500">{Math.round(((classAnalytics?.averageAssignments || 0) / 10) * 100)}%</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 text-center col-span-2 sm:col-span-1">
                <span className="text-[10px] font-bold text-slate-400 block uppercase">Lab / Practical (20)</span>
                <p className="text-sm font-black text-emerald-800 mt-0.5">{classAnalytics?.averagePracticals || 0} / 20</p>
                <span className="text-[10px] font-semibold text-emerald-700">{Math.round(((classAnalytics?.averagePracticals || 0) / 20) * 100)}%</span>
              </div>
            </div>
          </div>

          {/* Roster Table with "Check What is Strong or Not" Diagnostics */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs overflow-hidden">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-5">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Student Assessment &amp; Strength Diagnostics Sheet
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Input marks by Student Roll Number &bull; Evaluate strength and at-risk performance in real time
                </p>
              </div>

              {/* Filters & Search */}
              <div className="flex flex-wrap items-center gap-2.5">
                {/* Search */}
                <div className="relative min-w-[200px]">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search Roll No or Name..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500 font-medium"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Filter Tabs */}
                <div className="flex bg-slate-100 p-0.5 rounded-xl border border-slate-200 text-xs font-bold">
                  <button
                    onClick={() => setStrengthFilter('ALL')}
                    className={`px-2.5 py-1 rounded-lg transition-colors ${
                      strengthFilter === 'ALL' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                    }`}
                  >
                    All ({classAnalytics?.students?.length || 0})
                  </button>
                  <button
                    onClick={() => setStrengthFilter('STRONG')}
                    className={`px-2.5 py-1 rounded-lg transition-colors ${
                      strengthFilter === 'STRONG' ? 'bg-emerald-600 text-white shadow-xs' : 'text-emerald-800 hover:text-emerald-950'
                    }`}
                  >
                    Strong ({classAnalytics?.strongCount || 0})
                  </button>
                  <button
                    onClick={() => setStrengthFilter('MODERATE')}
                    className={`px-2.5 py-1 rounded-lg transition-colors ${
                      strengthFilter === 'MODERATE' ? 'bg-amber-500 text-white shadow-xs' : 'text-amber-800 hover:text-amber-950'
                    }`}
                  >
                    Steady ({classAnalytics?.moderateCount || 0})
                  </button>
                  <button
                    onClick={() => setStrengthFilter('WEAK')}
                    className={`px-2.5 py-1 rounded-lg transition-colors ${
                      strengthFilter === 'WEAK' ? 'bg-rose-600 text-white shadow-xs' : 'text-rose-700 hover:text-rose-900'
                    }`}
                  >
                    Weak ({classAnalytics?.weakCount || 0})
                  </button>
                </div>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto -mx-6 px-6">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200/80 text-[11px] font-bold text-slate-400 uppercase tracking-wider bg-slate-50/50">
                    <th className="py-3 px-3">Student Details &amp; Roll No</th>
                    <th className="py-3 px-3 text-center">Sessional 1 (30)</th>
                    <th className="py-3 px-3 text-center">Sessional 2 (30)</th>
                    <th className="py-3 px-3 text-center">Quizzes (10)</th>
                    <th className="py-3 px-3 text-center">Assign. (10)</th>
                    <th className="py-3 px-3 text-center">Lab / Practical (20)</th>
                    <th className="py-3 px-3 text-center">Total Score</th>
                    <th className="py-3 px-3 text-center">Grade</th>
                    <th className="py-3 px-3 text-center">Strength Status</th>
                    <th className="py-3 px-3">What is Strong / What is Weak</th>
                    <th className="py-3 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {filteredStudents.length === 0 ? (
                    <tr>
                      <td colSpan={11} className="py-8 text-center text-slate-400">
                        No students found matching your filters.
                      </td>
                    </tr>
                  ) : (
                    filteredStudents.map((item) => (
                      <tr key={item.studentId} className="hover:bg-slate-50/80 transition-colors">
                        {/* Student Name & Roll Number */}
                        <td className="py-3.5 px-3">
                          <span className="font-bold text-slate-900 block">{item.name}</span>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <span className="font-mono text-[11px] font-bold text-blue-800 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200">
                              {item.rollNumber}
                            </span>
                            <span className="text-[10px] text-slate-400">{item.section}</span>
                          </div>
                        </td>

                        {/* Sessional 1 */}
                        <td className="py-3.5 px-3 text-center font-mono font-semibold">
                          <span
                            className={
                              (item.sessional1 || 0) >= 22.5
                                ? 'text-emerald-700 font-bold'
                                : (item.sessional1 || 0) < 16.5
                                ? 'text-rose-700 font-bold'
                                : 'text-slate-700'
                            }
                          >
                            {item.sessional1 !== null && item.sessional1 !== undefined ? item.sessional1 : '—'}
                          </span>
                        </td>

                        {/* Sessional 2 */}
                        <td className="py-3.5 px-3 text-center font-mono font-semibold">
                          <span
                            className={
                              (item.sessional2 || 0) >= 22.5
                                ? 'text-emerald-700 font-bold'
                                : (item.sessional2 || 0) < 16.5
                                ? 'text-rose-700 font-bold'
                                : 'text-slate-700'
                            }
                          >
                            {item.sessional2 !== null && item.sessional2 !== undefined ? item.sessional2 : '—'}
                          </span>
                        </td>

                        {/* Quizzes */}
                        <td className="py-3.5 px-3 text-center font-mono font-semibold text-slate-700">
                          {item.quizzes !== null && item.quizzes !== undefined ? item.quizzes : '—'}
                        </td>

                        {/* Assignments */}
                        <td className="py-3.5 px-3 text-center font-mono font-semibold text-slate-700">
                          {item.assignments !== null && item.assignments !== undefined ? item.assignments : '—'}
                        </td>

                        {/* Lab / Practical */}
                        <td className="py-3.5 px-3 text-center font-mono font-semibold text-slate-700">
                          {item.practicals !== null && item.practicals !== undefined ? item.practicals : '—'}
                        </td>

                        {/* Total percentage */}
                        <td className="py-3.5 px-3 text-center">
                          <span className="text-sm font-extrabold text-blue-900 block font-mono">
                            {item.totalPercentage}%
                          </span>
                        </td>

                        {/* Grade */}
                        <td className="py-3.5 px-3 text-center">
                          <span className="inline-block px-2 py-0.5 rounded-md text-[11px] font-mono font-bold bg-slate-100 text-slate-800 border border-slate-200">
                            {item.gradeProjected}
                          </span>
                        </td>

                        {/* Strength Status Badge ("Strong or Not") */}
                        <td className="py-3.5 px-3 text-center">
                          {item.strengthStatus === 'STRONG' ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-black bg-emerald-50 text-emerald-800 border border-emerald-200 shadow-2xs">
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                              STRONG
                            </span>
                          ) : item.strengthStatus === 'WEAK' ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-black bg-rose-50 text-rose-800 border border-rose-200 animate-pulse">
                              <AlertTriangle className="w-3 h-3 text-rose-600" />
                              WEAK / RISK
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                              STEADY
                            </span>
                          )}
                        </td>

                        {/* What is Strong / What is Weak Breakdown */}
                        <td className="py-3.5 px-3 max-w-[260px]">
                          <div className="space-y-1">
                            {item.strongComponents && item.strongComponents.length > 0 && (
                              <div className="flex items-center gap-1 flex-wrap">
                                <span className="text-[10px] font-bold text-emerald-800 uppercase shrink-0">
                                  Strong:
                                </span>
                                {item.strongComponents.map((sc, i) => (
                                  <span
                                    key={i}
                                    className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-900 border border-emerald-200 font-medium"
                                  >
                                    {sc}
                                  </span>
                                ))}
                              </div>
                            )}

                            {item.weakComponents && item.weakComponents.length > 0 ? (
                              <div className="flex items-center gap-1 flex-wrap">
                                <span className="text-[10px] font-bold text-rose-800 uppercase shrink-0">
                                  Weak:
                                </span>
                                {item.weakComponents.map((wc, i) => (
                                  <span
                                    key={i}
                                    className="text-[10px] px-1.5 py-0.5 rounded bg-rose-50 text-rose-900 border border-rose-200 font-medium"
                                  >
                                    {wc}
                                  </span>
                                ))}
                              </div>
                            ) : (
                              item.strongComponents.length > 0 && (
                                <span className="text-[10px] text-slate-400 italic">
                                  No critical weaknesses detected
                                </span>
                              )
                            )}
                          </div>
                        </td>

                        {/* Actions */}
                        <td className="py-3.5 px-3 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => openSingleUploadModal(item)}
                              className="p-1.5 rounded-lg text-slate-500 hover:text-blue-700 hover:bg-blue-50 transition-colors"
                              title="Edit Marks"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => {
                                setSelectedStudent(item);
                                setModalType('studentDetails');
                              }}
                              className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-700 hover:bg-indigo-50 transition-colors"
                              title="View Strength Diagnosis & Advisory"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => {
                                setSelectedStudent(item);
                                setAlertForm({
                                  title: `Academic Alert: ${item.subjectName}`,
                                  message: `Your Continuous Internal Evaluation marks in ${item.subjectName} are currently at ${item.totalPercentage}% (${item.strengthStatus}). Please attend remedial sessions.`,
                                  type: item.strengthStatus === 'WEAK' ? 'urgent' : 'warning',
                                });
                                setModalType('sendAlert');
                              }}
                              className="p-1.5 rounded-lg text-slate-500 hover:text-rose-700 hover:bg-rose-50 transition-colors"
                              title="Send Academic Alert"
                            >
                              <Send className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* STUDENT PREVIEW / STUDENT ROLE VIEW */}
      {(!isTeacherOrAdmin || activeTab === 'studentPreview') && (
        <div className="space-y-6">
          {/* Internal Evaluation Breakdown Table */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">Course Assessment Breakdown</h3>
                <p className="text-xs text-slate-500">
                  Sessional 1 (30M) &bull; Sessional 2 (30M) &bull; Quizzes (10M) &bull; Assignments (10M) &bull; Lab / Practical (20M)
                </p>
              </div>
            </div>

            <div className="overflow-x-auto -mx-6 px-6">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200/80 text-[11px] font-bold text-slate-400 uppercase tracking-wider bg-slate-50/50">
                    <th className="py-3 px-3">Subject</th>
                    <th className="py-3 px-3 text-center">Sessional 1 (30)</th>
                    <th className="py-3 px-3 text-center">Sessional 2 (30)</th>
                    <th className="py-3 px-3 text-center">Quizzes (10)</th>
                    <th className="py-3 px-3 text-center">Assign. (10)</th>
                    <th className="py-3 px-3 text-center">Lab / Practical</th>
                    <th className="py-3 px-3 text-center">Internal Score</th>
                    <th className="py-3 px-3 text-center">Projected Grade</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {studentMarks.map((item) => (
                    <tr key={item.subjectCode} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3.5 px-3">
                        <span className="font-bold text-slate-900 block">{item.subjectName}</span>
                        <span className="font-mono text-[11px] text-blue-700">{item.subjectCode}</span>
                      </td>

                      <td className="py-3.5 px-3 text-center font-mono font-semibold text-slate-700">
                        {item.internalSessional1?.scored ? `${item.internalSessional1.scored} / 30` : '—'}
                      </td>

                      <td className="py-3.5 px-3 text-center font-mono font-semibold text-slate-700">
                        {item.internalSessional2?.scored ? `${item.internalSessional2.scored} / 30` : 'Scheduled'}
                      </td>

                      <td className="py-3.5 px-3 text-center font-mono font-semibold text-slate-700">
                        {item.quizzes?.scored ? `${item.quizzes.scored} / 20` : '—'}
                      </td>

                      <td className="py-3.5 px-3 text-center font-mono font-semibold text-slate-700">
                        {item.assignments?.scored ? `${item.assignments.scored} / 20` : '—'}
                      </td>

                      <td className="py-3.5 px-3 text-center font-mono font-semibold text-slate-700">
                        {item.practicals?.scored ? `${item.practicals.scored} / 50` : 'N/A'}
                      </td>

                      <td className="py-3.5 px-3 text-center">
                        <span className="text-sm font-extrabold text-blue-900">
                          {item.currentTotalPercentage}%
                        </span>
                      </td>

                      <td className="py-3.5 px-3 text-center">
                        <span className="inline-block px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-blue-50 text-blue-800 border border-blue-200">
                          Grade {item.gradeProjected}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Performance Insights & Grade Trajectory */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs space-y-3">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-blue-600" />
                <h3 className="text-base font-bold text-slate-900">Semester SGPA Trajectory</h3>
              </div>
              <p className="text-xs text-slate-500">
                Historical progression across previous academic cycles
              </p>

              <div className="space-y-3 pt-2">
                {[
                  { sem: 'Semester I', sgpa: 8.1, grade: 'A' },
                  { sem: 'Semester II', sgpa: 8.35, grade: 'A' },
                  { sem: 'Semester III', sgpa: 8.52, grade: 'A+' },
                  { sem: 'Semester IV', sgpa: 8.7, grade: 'A+' },
                  { sem: 'Semester V', sgpa: 8.82, grade: 'A+' },
                ].map((s) => (
                  <div key={s.sem} className="space-y-1">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-slate-700">{s.sem}</span>
                      <span className="text-blue-900 font-mono">
                        {s.sgpa.toFixed(2)} SGPA ({s.grade})
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${(s.sgpa / 10) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Performance Insights */}
            <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs space-y-4">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-blue-600" />
                <h3 className="text-base font-bold text-slate-900">Academic Analytics &amp; Advisory</h3>
              </div>

              <div className="space-y-3">
                {studentInsights.map((ins) => (
                  <div
                    key={ins.id}
                    className="p-4 rounded-xl bg-blue-50/60 border border-blue-200 text-xs space-y-1"
                  >
                    <h4 className="font-bold text-blue-950">{ins.title}</h4>
                    <p className="text-blue-900 leading-relaxed font-medium">{ins.message}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL 1: SINGLE STUDENT MARKS ENTRY / UPLOAD BY ROLL NUMBER */}
      {/* ============================================================== */}
      <Modal
        isOpen={modalType === 'uploadSingle'}
        onClose={() => setModalType(null)}
        title="Upload Marks of Student by Roll No"
        subtitle={`Entering Continuous Internal Evaluation (CIE) for ${selectedSubject}`}
        maxWidth="xl"
      >
        <div className="p-6 space-y-5">
          {/* Roll Number Lookup Input */}
          <div className="relative space-y-1.5">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
              Student Roll Number *
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="Type Roll Number (e.g. 2101920100142 or 2101920100018)..."
                value={singleForm.rollNumber}
                onChange={(e) => handleRollNumberChange(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl font-mono text-sm font-bold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
              />
              <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* Suggestions list */}
            {rollSearchSuggestions.length > 0 && (
              <div className="absolute z-20 left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden divide-y divide-slate-100">
                {rollSearchSuggestions.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => selectStudentFromSuggestion(s)}
                    className="w-full px-4 py-2 text-left hover:bg-blue-50 flex items-center justify-between transition-colors text-xs"
                  >
                    <div>
                      <span className="font-bold text-slate-900">{s.name}</span>
                      <span className="font-mono text-blue-700 ml-2">({s.rollNumber})</span>
                    </div>
                    <span className="text-[10px] text-slate-400">{s.section} &bull; {s.branch}</span>
                  </button>
                ))}
              </div>
            )}

            {/* Student name preview pill */}
            {singleForm.studentName && (
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-blue-50/70 border border-blue-200 text-xs">
                <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                <span className="text-blue-950 font-bold">Matched Student: {singleForm.studentName}</span>
                <span className="text-blue-700 font-mono text-[11px]">[{singleForm.rollNumber}]</span>
              </div>
            )}
          </div>

          {/* Assessment Marks Inputs */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block">
                Sessional 1 (Max 30)
              </label>
              <input
                type="number"
                min="0"
                max="30"
                step="0.5"
                value={singleForm.sessional1}
                onChange={(e) => setSingleForm({ ...singleForm, sessional1: Number(e.target.value) })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-mono text-sm font-bold text-slate-900"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block">
                Sessional 2 (Max 30)
              </label>
              <input
                type="number"
                min="0"
                max="30"
                step="0.5"
                value={singleForm.sessional2}
                onChange={(e) => setSingleForm({ ...singleForm, sessional2: Number(e.target.value) })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-mono text-sm font-bold text-slate-900"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block">
                Quizzes (Max 10)
              </label>
              <input
                type="number"
                min="0"
                max="10"
                step="0.5"
                value={singleForm.quizzes}
                onChange={(e) => setSingleForm({ ...singleForm, quizzes: Number(e.target.value) })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-mono text-sm font-bold text-slate-900"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block">
                Assignments (Max 10)
              </label>
              <input
                type="number"
                min="0"
                max="10"
                step="0.5"
                value={singleForm.assignments}
                onChange={(e) => setSingleForm({ ...singleForm, assignments: Number(e.target.value) })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-mono text-sm font-bold text-slate-900"
              />
            </div>

            <div className="space-y-1 col-span-2 sm:col-span-1">
              <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block">
                Lab / Practical (Max 20)
              </label>
              <input
                type="number"
                min="0"
                max="20"
                step="0.5"
                value={singleForm.practicals}
                onChange={(e) => setSingleForm({ ...singleForm, practicals: Number(e.target.value) })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-mono text-sm font-bold text-slate-900"
              />
            </div>
          </div>

          {/* Real-Time Strength Diagnostic Preview Card */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/90 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Live Score &amp; Strength Diagnostic Preview
              </span>
              <span
                className={`text-xs font-black px-2.5 py-0.5 rounded-full ${
                  liveStrength === 'STRONG'
                    ? 'bg-emerald-100 text-emerald-800'
                    : liveStrength === 'WEAK'
                    ? 'bg-rose-100 text-rose-800'
                    : 'bg-amber-100 text-amber-800'
                }`}
              >
                {liveStrength}
              </span>
            </div>

            <div className="flex items-center gap-4">
              <div className="space-y-0.5">
                <span className="text-[10px] text-slate-400 block font-bold uppercase">Aggregate Score</span>
                <p className="text-lg font-black text-blue-900 font-mono">
                  {liveTotalScored} / 100 ({livePercentage}%)
                </p>
              </div>
              <div className="space-y-0.5">
                <span className="text-[10px] text-slate-400 block font-bold uppercase">Projected Grade</span>
                <p className="text-lg font-black text-slate-800 font-mono">{liveGrade}</p>
              </div>
            </div>

            {/* Quick check: What is strong or weak */}
            <div className="text-xs pt-1 border-t border-slate-200/70 space-y-1">
              <p className="text-slate-600">
                <strong className="text-slate-800">Diagnostic Verdict:</strong>{' '}
                {liveStrength === 'STRONG'
                  ? '🌟 Strong conceptual mastery across all Continuous Internal Evaluation components.'
                  : liveStrength === 'WEAK'
                  ? '⚠️ Student is flagged At-Risk (< 60%). Mandatory remedial assignment will be recommended.'
                  : '⚡ Steady performance with potential to reach Grade A through revision.'}
              </p>
            </div>
          </div>

          {/* Modal Actions */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              onClick={() => setModalType(null)}
              className="px-4 py-2 border border-slate-200 text-slate-700 rounded-xl text-xs font-bold hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveSingleMarks}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs hover:shadow-md transition-all flex items-center gap-1.5"
            >
              <UploadCloud className="w-4 h-4" />
              Upload &amp; Save Marks
            </button>
          </div>
        </div>
      </Modal>

      {/* ============================================================== */}
      {/* MODAL 2: BULK CSV / SPREADSHEET MARKS UPLOAD */}
      {/* ============================================================== */}
      <Modal
        isOpen={modalType === 'uploadBulk'}
        onClose={() => setModalType(null)}
        title="Batch Upload Marks by Student Roll Numbers"
        subtitle={`Paste or import spreadsheet data for ${selectedSubject}`}
        maxWidth="2xl"
      >
        <div className="p-6 space-y-4">
          <div className="bg-blue-50/70 border border-blue-200 p-3.5 rounded-xl text-xs text-blue-900 space-y-1">
            <p className="font-bold">Instructions for CSV Format:</p>
            <p className="font-mono text-[11px] bg-white/70 p-2 rounded border border-blue-200/60">
              RollNumber, Sessional1(30), Sessional2(30), Quizzes(10), Assignments(10), Practicals(20)
            </p>
            <p className="text-[11px] text-blue-800">
              Example: <span className="font-mono">2101920100142, 26, 27, 9, 9, 18</span>
            </p>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                Paste CSV Lines or Sheet Data
              </label>
              <button
                onClick={() => {
                  const sample = `2101920100142, 27, 28, 9, 10, 19\n2101920100018, 15, 16, 5, 6, 17\n2101920100095, 23, 24, 8, 8, 18\n2101920100114, 25, 26, 8, 9, 19`;
                  handleCsvTextChange(sample);
                }}
                className="text-[11px] font-bold text-blue-700 hover:text-blue-900 underline"
              >
                Insert Sample Batch Data
              </button>
            </div>
            <textarea
              rows={5}
              placeholder="Paste student roll numbers and marks here..."
              value={bulkCsvText}
              onChange={(e) => handleCsvTextChange(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl font-mono text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Validation & Preview Table */}
          {bulkParsedRecords.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-700">
                  Parsed Records Preview ({bulkParsedRecords.length} Students)
                </span>
                <span className="text-emerald-700 font-semibold text-[11px]">
                  {bulkParsedRecords.filter((r) => r.isValid).length} Valid &bull;{' '}
                  {bulkParsedRecords.filter((r) => !r.isValid).length} Flagged
                </span>
              </div>

              <div className="max-h-48 overflow-y-auto border border-slate-200 rounded-xl">
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="bg-slate-50 border-b border-slate-200 text-[10px] uppercase font-bold text-slate-500 sticky top-0">
                    <tr>
                      <th className="py-2 px-3">Roll No</th>
                      <th className="py-2 px-3">Student Name</th>
                      <th className="py-2 px-2 text-center">S1 (30)</th>
                      <th className="py-2 px-2 text-center">S2 (30)</th>
                      <th className="py-2 px-2 text-center">Quiz</th>
                      <th className="py-2 px-2 text-center">Asg</th>
                      <th className="py-2 px-2 text-center">Prac</th>
                      <th className="py-2 px-3 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {bulkParsedRecords.map((r, i) => (
                      <tr key={i} className={r.isValid ? 'hover:bg-slate-50/70' : 'bg-rose-50/40'}>
                        <td className="py-2 px-3 font-mono font-bold text-blue-900">{r.rollNumber}</td>
                        <td className="py-2 px-3 text-slate-800 font-medium">{r.studentName}</td>
                        <td className="py-2 px-2 text-center font-mono">{r.sessional1}</td>
                        <td className="py-2 px-2 text-center font-mono">{r.sessional2}</td>
                        <td className="py-2 px-2 text-center font-mono">{r.quizzes}</td>
                        <td className="py-2 px-2 text-center font-mono">{r.assignments}</td>
                        <td className="py-2 px-2 text-center font-mono">{r.practicals}</td>
                        <td className="py-2 px-3 text-right">
                          {r.isValid ? (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700">
                              <Check className="w-3 h-3" /> Ready
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-rose-700" title={r.error}>
                              <AlertCircle className="w-3 h-3" /> {r.error || 'Error'}
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              onClick={() => setModalType(null)}
              className="px-4 py-2 border border-slate-200 text-slate-700 rounded-xl text-xs font-bold hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveBulkMarks}
              disabled={bulkParsedRecords.filter((r) => r.isValid).length === 0}
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 text-white rounded-xl text-xs font-bold shadow-xs hover:shadow-md transition-all flex items-center gap-1.5"
            >
              <UploadCloud className="w-4 h-4" />
              Confirm &amp; Upload {bulkParsedRecords.filter((r) => r.isValid).length} Records
            </button>
          </div>
        </div>
      </Modal>

      {/* ============================================================== */}
      {/* MODAL 3: AI DIAGNOSTIC - "CHECK WHAT IS STRONG OR NOT" */}
      {/* ============================================================== */}
      <Modal
        isOpen={modalType === 'aiDiagnostic'}
        onClose={() => setModalType(null)}
        title="AI Pedagogical Strength & Weakness Diagnostic"
        subtitle={`Grounded Google Gemini evaluation for ${selectedSubject} (${selectedSection || 'CSE-3B'})`}
        maxWidth="2xl"
      >
        <div className="p-6 space-y-6">
          {aiLoading ? (
            <div className="py-12 text-center space-y-3">
              <Sparkles className="w-8 h-8 text-indigo-600 animate-spin mx-auto" />
              <h4 className="text-base font-bold text-slate-900">
                Synthesizing Marks Data &amp; Diagnosing Strengths &amp; Weaknesses...
              </h4>
              <p className="text-xs text-slate-500">
                Running multi-component regression on Sessionals, Quizzes, Assignments, and Lab Vivas
              </p>
            </div>
          ) : aiDiagnostic ? (
            <div className="space-y-5">
              {/* Executive Summary */}
              <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-200/80 space-y-1.5">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-indigo-600" />
                  <h4 className="text-xs font-black text-indigo-950 uppercase tracking-wider">
                    Executive Health Diagnosis
                  </h4>
                </div>
                <p className="text-xs sm:text-sm text-indigo-900 leading-relaxed font-medium">
                  {aiDiagnostic.executiveSummary}
                </p>
              </div>

              {/* Strengths & Weaknesses 2-Column Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* What is Strong */}
                <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200 space-y-2.5">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <h5 className="text-xs font-black text-emerald-950 uppercase tracking-wider">
                      🌟 What is Strong (Mastery Areas)
                    </h5>
                  </div>
                  <ul className="space-y-1.5">
                    {aiDiagnostic.classStrengths.map((str, i) => (
                      <li key={i} className="text-xs text-emerald-900 flex items-start gap-2 leading-relaxed">
                        <span className="text-emerald-600 font-bold mt-0.5">&bull;</span>
                        <span>{str}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* What is Weak / At Risk */}
                <div className="p-4 rounded-2xl bg-rose-50/60 border border-rose-200 space-y-2.5">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-rose-600" />
                    <h5 className="text-xs font-black text-rose-950 uppercase tracking-wider">
                      ⚠️ What is Weak (Learning Gaps)
                    </h5>
                  </div>
                  <ul className="space-y-1.5">
                    {aiDiagnostic.criticalWeaknesses.map((weak, i) => (
                      <li key={i} className="text-xs text-rose-900 flex items-start gap-2 leading-relaxed">
                        <span className="text-rose-600 font-bold mt-0.5">&bull;</span>
                        <span>{weak}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* At-Risk Students Flagged by Roll Number */}
              {aiDiagnostic.atRiskStudents && aiDiagnostic.atRiskStudents.length > 0 && (
                <div className="p-4 rounded-2xl bg-white border border-rose-200 shadow-2xs space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-rose-900 uppercase tracking-wider flex items-center gap-1.5">
                      <ShieldAlert className="w-4 h-4 text-rose-600" />
                      At-Risk Roll Numbers Requiring Interventions ({aiDiagnostic.atRiskStudents.length})
                    </span>
                  </div>

                  <div className="divide-y divide-slate-100">
                    {aiDiagnostic.atRiskStudents.map((st, i) => (
                      <div key={i} className="py-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                        <div>
                          <span className="font-bold text-slate-900">{st.name}</span>
                          <span className="font-mono text-blue-700 ml-2 font-bold">[{st.rollNumber}]</span>
                          <span className="text-rose-700 ml-2 font-black font-mono">({st.totalPercentage}%)</span>
                          <p className="text-[11px] text-slate-500 mt-0.5">
                            Weak In: {st.weakAreas.join(', ')}
                          </p>
                        </div>
                        <span className="text-[11px] font-semibold text-rose-800 bg-rose-50 px-2.5 py-1 rounded-lg border border-rose-200 shrink-0">
                          {st.suggestedAction}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Remedial Action Plan */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <h5 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <ClipboardList className="w-4 h-4 text-blue-600" />
                  Recommended Faculty Action Plan
                </h5>
                <ol className="list-decimal list-inside space-y-1 text-xs text-slate-700 font-medium">
                  {aiDiagnostic.remedialActionPlan.map((act, i) => (
                    <li key={i} className="leading-relaxed">
                      {act}
                    </li>
                  ))}
                </ol>
                <div className="pt-2 text-[11px] text-slate-500 border-t border-slate-200 flex items-center gap-1.5">
                  <GraduationCap className="w-3.5 h-3.5 text-blue-600" />
                  <span>
                    <strong>AKTU Exam Readiness:</strong> {aiDiagnostic.examReadinessForecast}
                  </span>
                </div>
              </div>

              {/* Close Button */}
              <div className="flex justify-end pt-2">
                <button
                  onClick={() => setModalType(null)}
                  className="px-5 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-colors"
                >
                  Done &bull; Close Diagnostic
                </button>
              </div>
            </div>
          ) : null}
        </div>
      </Modal>

      {/* ============================================================== */}
      {/* MODAL 4: INDIVIDUAL STUDENT DETAILS & ADVISORY */}
      {/* ============================================================== */}
      <Modal
        isOpen={modalType === 'studentDetails' && Boolean(selectedStudent)}
        onClose={() => setModalType(null)}
        title="Student CIE Strength & Weakness Dossier"
        subtitle={selectedStudent ? `${selectedStudent.name} (Roll: ${selectedStudent.rollNumber})` : ''}
        maxWidth="lg"
      >
        {selectedStudent && (
          <div className="p-6 space-y-5">
            {/* Student Header Card */}
            <div className="flex items-center justify-between p-4 rounded-2xl bg-blue-50/60 border border-blue-200">
              <div>
                <h4 className="text-base font-black text-blue-950">{selectedStudent.name}</h4>
                <div className="flex items-center gap-2 mt-0.5 text-xs">
                  <span className="font-mono font-bold text-blue-800">Roll: {selectedStudent.rollNumber}</span>
                  <span className="text-slate-400">&bull;</span>
                  <span className="text-slate-600">{selectedStudent.section}</span>
                  <span className="text-slate-400">&bull;</span>
                  <span className="text-slate-600">{selectedStudent.semester}</span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-bold text-slate-400 uppercase">CIE Aggregate</span>
                <p className="text-xl font-black text-blue-900 font-mono">
                  {selectedStudent.totalPercentage}%
                </p>
                <span className="text-xs font-bold text-slate-700 font-mono">
                  Grade {selectedStudent.gradeProjected}
                </span>
              </div>
            </div>

            {/* Assessment Breakdown */}
            <div className="space-y-2">
              <h5 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Assessment Scores Breakdown
              </h5>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs">
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] text-slate-400 font-bold block uppercase">Sessional 1</span>
                  <p className="text-sm font-bold text-slate-800 font-mono mt-0.5">
                    {selectedStudent.sessional1} / 30
                  </p>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] text-slate-400 font-bold block uppercase">Sessional 2</span>
                  <p className="text-sm font-bold text-slate-800 font-mono mt-0.5">
                    {selectedStudent.sessional2} / 30
                  </p>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] text-slate-400 font-bold block uppercase">Quizzes</span>
                  <p className="text-sm font-bold text-slate-800 font-mono mt-0.5">
                    {selectedStudent.quizzes} / 10
                  </p>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] text-slate-400 font-bold block uppercase">Assignments</span>
                  <p className="text-sm font-bold text-slate-800 font-mono mt-0.5">
                    {selectedStudent.assignments} / 10
                  </p>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 col-span-2 sm:col-span-1">
                  <span className="text-[10px] text-slate-400 font-bold block uppercase">Lab / Practical</span>
                  <p className="text-sm font-bold text-slate-800 font-mono mt-0.5">
                    {selectedStudent.practicals} / 20
                  </p>
                </div>
              </div>
            </div>

            {/* Strengths & Weaknesses Detailed Badges */}
            <div className="space-y-3">
              <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 space-y-1.5">
                <span className="text-xs font-bold text-emerald-950 uppercase flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  Strong Evaluation Areas
                </span>
                {selectedStudent.strongComponents.length > 0 ? (
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {selectedStudent.strongComponents.map((sc, i) => (
                      <span key={i} className="text-xs px-2 py-0.5 rounded-md bg-white border border-emerald-300 text-emerald-900 font-semibold font-mono">
                        {sc}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-emerald-800">No components currently at high-distinction threshold.</p>
                )}
              </div>

              <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 space-y-1.5">
                <span className="text-xs font-bold text-rose-950 uppercase flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                  Areas Requiring Immediate Remediation
                </span>
                {selectedStudent.weakComponents.length > 0 ? (
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {selectedStudent.weakComponents.map((wc, i) => (
                      <span key={i} className="text-xs px-2 py-0.5 rounded-md bg-white border border-rose-300 text-rose-900 font-semibold font-mono">
                        {wc}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-emerald-700 font-medium">✓ No critical weaknesses. Student is performing steadily.</p>
                )}
              </div>
            </div>

            {/* Teacher Recommendation */}
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1">
              <span className="font-bold text-slate-800 block">Pedagogical Recommendation:</span>
              <p className="text-slate-600 leading-relaxed">{selectedStudent.recommendation}</p>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-between pt-2">
              <button
                onClick={() => {
                  setAlertForm({
                    title: `Academic Performance Alert: ${selectedStudent.subjectName}`,
                    message: `Dear ${selectedStudent.name}, your continuous assessment score in ${selectedStudent.subjectName} stands at ${selectedStudent.totalPercentage}%. Please connect for remedial counseling.`,
                    type: selectedStudent.strengthStatus === 'WEAK' ? 'urgent' : 'warning',
                  });
                  setModalType('sendAlert');
                }}
                className="px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                Dispatch Counseling Alert
              </button>

              <button
                onClick={() => setModalType(null)}
                className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-colors"
              >
                Close Dossier
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* ============================================================== */}
      {/* MODAL 5: DISPATCH ACADEMIC COUNSELING ALERT */}
      {/* ============================================================== */}
      <Modal
        isOpen={modalType === 'sendAlert' && Boolean(selectedStudent)}
        onClose={() => setModalType(null)}
        title="Dispatch Academic Counseling Alert"
        subtitle={selectedStudent ? `Recipient: ${selectedStudent.name} (${selectedStudent.rollNumber})` : ''}
        maxWidth="md"
      >
        {selectedStudent && (
          <div className="p-6 space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                Alert Title
              </label>
              <input
                type="text"
                value={alertForm.title}
                onChange={(e) => setAlertForm({ ...alertForm, title: e.target.value })}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                Urgency Level
              </label>
              <select
                value={alertForm.type}
                onChange={(e) => setAlertForm({ ...alertForm, type: e.target.value as any })}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
              >
                <option value="warning">Warning / Low Marks Alert</option>
                <option value="urgent">Urgent / Remedial Attendance Required</option>
                <option value="info">Informative / Performance Note</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                Message Content
              </label>
              <textarea
                rows={4}
                value={alertForm.message}
                onChange={(e) => setAlertForm({ ...alertForm, message: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setModalType(null)}
                className="px-4 py-2 border border-slate-200 text-slate-700 rounded-xl text-xs font-bold hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSendAlert}
                className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold shadow-xs hover:shadow-md transition-all flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                Send Alert
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
