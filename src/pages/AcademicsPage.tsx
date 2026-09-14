import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { academicService } from '../services/academicService';
import { SubjectItem } from '../types';
import { LoadingState } from '../components/common/LoadingState';
import { ProgressBar } from '../components/common/ProgressBar';
import { Modal } from '../components/common/Modal';
import {
  BookOpen,
  User,
  Clock,
  FileText,
  GraduationCap,
  Sparkles,
  Search,
  ExternalLink,
  Award,
  CheckCircle2
} from 'lucide-react';

export const AcademicsPage: React.FC = () => {
  const navigate = useNavigate();
  const [subjects, setSubjects] = useState<SubjectItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubjectForSyllabus, setSelectedSubjectForSyllabus] = useState<SubjectItem | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const data = await academicService.getSubjects();
        setSubjects(data);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) {
    return <LoadingState message="Loading Academic Curriculum..." subMessage="Fetching semester subject enrollments & syllabi" />;
  }

  const filtered = subjects.filter(
    (s) =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.faculty.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header & Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              My Academics &amp; Courses
            </h1>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-800 border border-blue-200">
              Semester VI • CSE
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            AKTU Curriculum Structure • 24 Enrolled Credits • GL Bajaj Institute of Technology &amp; Management
          </p>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Filter subjects or faculty..."
            className="w-full text-xs pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 focus:outline-none focus:bg-white focus:border-blue-500"
          />
        </div>
      </div>

      {/* Grid of Subject Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((sub) => {
          const isAtRisk = sub.attendance < 75;
          return (
            <div
              key={sub.code}
              className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs hover:border-blue-300 hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div className="space-y-4">
                {/* Header: Code & Credits */}
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200">
                    {sub.code}
                  </span>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                    {sub.credits} Credits
                  </span>
                </div>

                {/* Title and Faculty */}
                <div>
                  <h3 className="text-base font-bold text-slate-900 line-clamp-1">{sub.name}</h3>
                  <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-1">
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    <span>{sub.faculty}</span>
                  </p>
                </div>

                {/* Progress Indicators */}
                <div className="space-y-3 pt-2 border-t border-slate-100">
                  {/* Attendance */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-500">Attendance</span>
                      <span
                        className={`font-bold ${
                          isAtRisk ? 'text-amber-600' : 'text-emerald-700'
                        }`}
                      >
                        {sub.attendance.toFixed(1)}% {isAtRisk && '(Risk)'}
                      </span>
                    </div>
                    <ProgressBar value={sub.attendance} threshold={75} size="sm" />
                  </div>

                  {/* Syllabus Progress */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-500">Syllabus Progress</span>
                      <span className="font-bold text-slate-900">{sub.syllabusProgress}%</span>
                    </div>
                    <ProgressBar
                      value={sub.syllabusProgress}
                      threshold={100}
                      size="sm"
                      variant="blue"
                    />
                  </div>
                </div>

                {/* Next Class */}
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/70 text-xs text-slate-600 flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                  <span className="truncate">Next: <strong>{sub.nextClass}</strong></span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-2 pt-5 mt-4 border-t border-slate-100">
                <button
                  onClick={() => setSelectedSubjectForSyllabus(sub)}
                  className="px-2.5 py-1.5 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors flex items-center justify-center gap-1"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  Syllabus
                </button>

                <button
                  onClick={() => navigate('/notes')}
                  className="px-2.5 py-1.5 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors flex items-center justify-center gap-1"
                >
                  <FileText className="w-3.5 h-3.5" />
                  Notes
                </button>

                <button
                  onClick={() => navigate('/pyqs')}
                  className="px-2.5 py-1.5 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors flex items-center justify-center gap-1"
                >
                  <GraduationCap className="w-3.5 h-3.5" />
                  PYQs
                </button>

                <button
                  onClick={() =>
                    navigate(
                      `/copilot?prompt=${encodeURIComponent(
                        `I need tutoring on ${sub.name} (${sub.code}). What are the key concepts for Unit 3?`
                      )}&context=My Subjects`
                    )
                  }
                  className="px-2.5 py-1.5 text-xs font-bold rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 transition-colors flex items-center justify-center gap-1"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  AI Tutor
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Syllabus Modal */}
      {selectedSubjectForSyllabus && (
        <Modal
          isOpen={!!selectedSubjectForSyllabus}
          onClose={() => setSelectedSubjectForSyllabus(null)}
          title={`${selectedSubjectForSyllabus.name} — Syllabus`}
          subtitle={`${selectedSubjectForSyllabus.code} • ${selectedSubjectForSyllabus.credits} Credits • Faculty: ${selectedSubjectForSyllabus.faculty}`}
          maxWidth="2xl"
        >
          <div className="space-y-4">
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-900 flex items-center justify-between">
              <span>Overall Syllabus Completed: <strong>{selectedSubjectForSyllabus.syllabusProgress}%</strong></span>
              <span className="font-semibold">AKTU B.Tech 2026 Curriculum</span>
            </div>

            <div className="space-y-3">
              {[
                { unit: 'Unit 1: Introduction, Architecture and Relational Data Models', status: 'Completed (100%)', hours: '8 Hours' },
                { unit: 'Unit 2: SQL, Relational Algebra, Calculus and Integrity Constraints', status: 'Completed (100%)', hours: '10 Hours' },
                { unit: 'Unit 3: Relational Database Design, Functional Dependencies & Normalization (1NF, 2NF, 3NF, BCNF)', status: 'In Progress (75%)', hours: '12 Hours' },
                { unit: 'Unit 4: Transaction Processing, ACID Properties, Schedules & Concurrency Control', status: 'Pending', hours: '10 Hours' },
                { unit: 'Unit 5: Storage Structures, Indexing, B-Trees and B+ Trees, Query Optimization', status: 'Pending', hours: '8 Hours' }
              ].map((item, idx) => (
                <div key={idx} className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/70 text-xs">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-slate-800">{item.unit}</span>
                    <span className="font-mono text-slate-500">{item.hours}</span>
                  </div>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                    item.status.includes('Completed') ? 'bg-emerald-100 text-emerald-800' : item.status.includes('Progress') ? 'bg-amber-100 text-amber-800' : 'bg-slate-200 text-slate-600'
                  }`}>
                    {item.status}
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedSubjectForSyllabus(null)}
                className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-semibold"
              >
                Close Syllabus
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
