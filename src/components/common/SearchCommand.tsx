import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  BookOpen,
  FileText,
  GraduationCap,
  ClipboardList,
  X,
  ArrowRight
} from 'lucide-react';
import { academicService } from '../../services/academicService';
import { resourceService } from '../../services/resourceService';
import { assignmentService } from '../../services/assignmentService';
import { SubjectItem, StudyResource, PYQItem, AssignmentItem } from '../../types';

interface SearchCommandProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SearchCommand: React.FC<SearchCommandProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [subjects, setSubjects] = useState<SubjectItem[]>([]);
  const [notes, setNotes] = useState<StudyResource[]>([]);
  const [pyqs, setPyqs] = useState<PYQItem[]>([]);
  const [assignments, setAssignments] = useState<AssignmentItem[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      // Load live data from backend
      academicService.getSubjects().then(setSubjects).catch(console.error);
      resourceService.getNotes().then(setNotes).catch(console.error);
      resourceService.getPYQs().then(setPyqs).catch(console.error);
      assignmentService.getAssignments().then(setAssignments).catch(console.error);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const q = query.toLowerCase().trim();

  const filteredSubjects = q
    ? subjects.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.code.toLowerCase().includes(q) ||
          (s.shortName && s.shortName.toLowerCase().includes(q))
      )
    : subjects.slice(0, 3);

  const filteredNotes = q
    ? notes.filter(
        (n) =>
          n.title.toLowerCase().includes(q) ||
          n.topic.toLowerCase().includes(q) ||
          n.subjectName.toLowerCase().includes(q)
      )
    : notes.slice(0, 3);

  const filteredPYQs = q
    ? pyqs.filter(
        (p) =>
          p.question.toLowerCase().includes(q) ||
          p.topic.toLowerCase().includes(q) ||
          p.subjectName.toLowerCase().includes(q)
      )
    : pyqs.slice(0, 2);

  const filteredAssignments = q
    ? assignments.filter(
        (a) =>
          a.title.toLowerCase().includes(q) ||
          a.subjectName.toLowerCase().includes(q)
      )
    : assignments.slice(0, 2);

  const handleSelect = (url: string) => {
    navigate(url);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 p-4">
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="relative w-full max-w-2xl bg-white/95 backdrop-blur-2xl rounded-3xl shadow-2xl border border-slate-200/90 overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-150">
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-slate-200/80 gap-3">
          <div className="w-8 h-8 rounded-xl bg-white p-0.5 border border-slate-200 shadow-2xs shrink-0 flex items-center justify-center">
            <img src="/glb-logo.png" alt="GLB" className="w-full h-full object-contain" />
          </div>
          <Search className="w-4 h-4 text-slate-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type to search across notes, PYQs, courses, assignments..."
            className="w-full text-sm font-medium bg-transparent text-slate-900 placeholder:text-slate-400 focus:outline-none"
          />
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results Container */}
        <div className="max-h-[60vh] overflow-y-auto p-3 space-y-4 text-xs">
          {/* Courses / Subjects */}
          {filteredSubjects.length > 0 && (
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3 block mb-1">
                Courses &amp; Subjects
              </span>
              <div className="space-y-0.5">
                {filteredSubjects.map((s) => (
                  <button
                    key={s.code}
                    onClick={() => handleSelect('/academics')}
                    className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-blue-50/70 group text-left transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center font-bold text-xs shrink-0">
                        <BookOpen className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 group-hover:text-blue-900">
                          {s.name}
                        </div>
                        <div className="text-[11px] text-slate-500">
                          {s.code} • {s.credits} Credits • {s.faculty || s.facultyName}
                        </div>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Notes & Learning Handouts */}
          {filteredNotes.length > 0 && (
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3 block mb-1">
                Notes &amp; Learning Handouts
              </span>
              <div className="space-y-0.5">
                {filteredNotes.map((n) => (
                  <button
                    key={n.id}
                    onClick={() => handleSelect('/notes')}
                    className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-blue-50/70 group text-left transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center font-bold text-xs shrink-0">
                        <FileText className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 group-hover:text-blue-900 line-clamp-1">
                          {n.title}
                        </div>
                        <div className="text-[11px] text-slate-500">
                          {n.subjectName} • {n.unit} • {n.type}
                        </div>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* PYQ Archives */}
          {filteredPYQs.length > 0 && (
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3 block mb-1">
                AKTU PYQs &amp; Exam Questions
              </span>
              <div className="space-y-0.5">
                {filteredPYQs.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => handleSelect('/pyqs')}
                    className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-blue-50/70 group text-left transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-700 flex items-center justify-center font-bold text-xs shrink-0">
                        <GraduationCap className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 group-hover:text-blue-900 line-clamp-1">
                          {p.question}
                        </div>
                        <div className="text-[11px] text-slate-500">
                          AKTU {p.year} • {p.subjectName} • {p.marksWeightage} Marks
                        </div>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Assignments */}
          {filteredAssignments.length > 0 && (
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3 block mb-1">
                Course Assignments
              </span>
              <div className="space-y-0.5">
                {filteredAssignments.map((a) => (
                  <button
                    key={a.id}
                    onClick={() => handleSelect('/assignments')}
                    className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-blue-50/70 group text-left transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold text-xs shrink-0">
                        <ClipboardList className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 group-hover:text-blue-900 line-clamp-1">
                          {a.title}
                        </div>
                        <div className="text-[11px] text-slate-500">
                          {a.subjectName} • Due: {a.dueDate}
                        </div>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Empty state */}
          {filteredSubjects.length === 0 &&
            filteredNotes.length === 0 &&
            filteredPYQs.length === 0 &&
            filteredAssignments.length === 0 && (
              <div className="text-center py-8 text-slate-400">
                <Search className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="font-semibold text-xs">No matching academic records found</p>
                <p className="text-[11px] text-slate-400 mt-0.5">Try searching for DBMS, Compiler, or assignments</p>
              </div>
            )}
        </div>

        {/* Footer info */}
        <div className="px-4 py-2.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-400">
          <span>GLBITM Real-Time Academic Index</span>
          <div className="flex items-center gap-2">
            <span>Press</span>
            <kbd className="px-1.5 py-0.5 rounded bg-white border border-slate-300 font-mono text-[10px] text-slate-600">
              ESC
            </kbd>
            <span>to close</span>
          </div>
        </div>
      </div>
    </div>
  );
};
