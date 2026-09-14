import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  BookOpen,
  FileText,
  GraduationCap,
  ClipboardList,
  User,
  X,
  ArrowRight
} from 'lucide-react';
import { mockSubjects } from '../../data/mock/mockSubjects';
import { mockStudyResourcesList } from '../../data/mock/mockNotes';
import { mockPYQList } from '../../data/mock/mockPYQs';
import { mockAssignmentsList } from '../../data/mock/mockAssignments';

interface SearchCommandProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SearchCommand: React.FC<SearchCommandProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const q = query.toLowerCase().trim();

  const filteredSubjects = q
    ? mockSubjects.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.code.toLowerCase().includes(q) ||
          s.shortName.toLowerCase().includes(q)
      )
    : mockSubjects.slice(0, 3);

  const filteredNotes = q
    ? mockStudyResourcesList.filter(
        (n) =>
          n.title.toLowerCase().includes(q) ||
          n.topic.toLowerCase().includes(q) ||
          n.subjectName.toLowerCase().includes(q)
      )
    : mockStudyResourcesList.slice(0, 3);

  const filteredPYQs = q
    ? mockPYQList.filter(
        (p) =>
          p.question.toLowerCase().includes(q) ||
          p.topic.toLowerCase().includes(q) ||
          p.subjectName.toLowerCase().includes(q)
      )
    : mockPYQList.slice(0, 2);

  const filteredAssignments = q
    ? mockAssignmentsList.filter(
        (a) =>
          a.title.toLowerCase().includes(q) ||
          a.subjectName.toLowerCase().includes(q)
      )
    : mockAssignmentsList.slice(0, 2);

  const handleSelect = (url: string) => {
    navigate(url);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[80vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Bar Input */}
        <div className="relative flex items-center px-4 py-3.5 border-b border-slate-100 bg-slate-50/70">
          <Search className="w-5 h-5 text-slate-400 mr-3 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search notes, PYQs, subjects, assignments, faculty... (Ctrl + K)"
            className="w-full bg-transparent text-sm text-slate-800 placeholder-slate-400 focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 rounded-md text-slate-400 hover:text-slate-600 mr-2"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="hidden sm:inline-flex text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-slate-200 text-slate-600 font-semibold border border-slate-300">
            ESC
          </kbd>
        </div>

        {/* Results Area */}
        <div className="p-4 overflow-y-auto space-y-5 divide-y divide-slate-100">
          {/* Subjects */}
          {filteredSubjects.length > 0 && (
            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-blue-600" /> Subjects &amp; Courses
              </p>
              <div className="space-y-1">
                {filteredSubjects.map((sub) => (
                  <div
                    key={sub.code}
                    onClick={() => handleSelect(`/academics`)}
                    className="flex items-center justify-between p-2.5 rounded-lg hover:bg-blue-50/70 cursor-pointer group transition-colors"
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-blue-700 font-mono">{sub.code}</span>
                        <span className="text-xs font-semibold text-slate-800 truncate">{sub.name}</span>
                      </div>
                      <span className="text-[11px] text-slate-500">{sub.faculty} • {sub.credits} Credits</span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Notes & Study Material */}
          {filteredNotes.length > 0 && (
            <div className="pt-4">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-emerald-600" /> Notes &amp; Study Materials
              </p>
              <div className="space-y-1">
                {filteredNotes.map((note) => (
                  <div
                    key={note.id}
                    onClick={() => handleSelect(`/notes`)}
                    className="flex items-center justify-between p-2.5 rounded-lg hover:bg-slate-50 cursor-pointer group transition-colors"
                  >
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-slate-800 truncate">{note.title}</p>
                      <p className="text-[11px] text-slate-500">
                        {note.subjectCode} • {note.unit} • {note.type}
                      </p>
                    </div>
                    <span className="text-[10px] font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                      {note.type}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* PYQs */}
          {filteredPYQs.length > 0 && (
            <div className="pt-4">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <GraduationCap className="w-3.5 h-3.5 text-purple-600" /> Previous Year Questions (PYQs)
              </p>
              <div className="space-y-1">
                {filteredPYQs.map((pyq) => (
                  <div
                    key={pyq.id}
                    onClick={() => handleSelect(`/pyqs`)}
                    className="flex items-center justify-between p-2.5 rounded-lg hover:bg-purple-50/40 cursor-pointer group transition-colors"
                  >
                    <div className="min-w-0 pr-3">
                      <p className="text-xs text-slate-800 line-clamp-1">{pyq.question}</p>
                      <p className="text-[11px] text-slate-500">
                        {pyq.subjectCode} • Year {pyq.year} • Asked {pyq.frequency} times
                      </p>
                    </div>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-purple-50 text-purple-700 border border-purple-200 shrink-0">
                      {pyq.examType}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Assignments */}
          {filteredAssignments.length > 0 && (
            <div className="pt-4">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <ClipboardList className="w-3.5 h-3.5 text-amber-600" /> Assignments
              </p>
              <div className="space-y-1">
                {filteredAssignments.map((asg) => (
                  <div
                    key={asg.id}
                    onClick={() => handleSelect(`/assignments`)}
                    className="flex items-center justify-between p-2.5 rounded-lg hover:bg-slate-50 cursor-pointer group transition-colors"
                  >
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-slate-800 truncate">{asg.title}</p>
                      <p className="text-[11px] text-slate-500">{asg.subjectName} • Due {asg.dueDate}</p>
                    </div>
                    <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                      {asg.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="px-4 py-2.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
          <span>Search index covers AKTU curriculum, GLBITM PYQs &amp; faculty notes</span>
          <button
            onClick={onClose}
            className="text-xs font-semibold text-blue-600 hover:text-blue-800"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
