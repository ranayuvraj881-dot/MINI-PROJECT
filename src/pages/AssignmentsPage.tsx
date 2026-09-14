import React, { useState, useEffect } from 'react';
import { assignmentService } from '../services/assignmentService';
import { AssignmentItem } from '../types';
import { LoadingState } from '../components/common/LoadingState';
import { Modal } from '../components/common/Modal';
import {
  ClipboardList,
  Clock,
  CheckCircle2,
  AlertCircle,
  UploadCloud,
  FileCheck,
  Calendar,
  Sparkles
} from 'lucide-react';

export const AssignmentsPage: React.FC = () => {
  const [assignments, setAssignments] = useState<AssignmentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'All' | 'Pending' | 'Submitted' | 'Evaluated'>('Pending');
  const [selectedForSubmission, setSelectedForSubmission] = useState<AssignmentItem | null>(null);
  const [uploadedFileName, setUploadedFileName] = useState<string>('');
  const [submitting, setSubmitting] = useState(false);
  const [toastMessage, setToastMessage] = useState<string>('');

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const data = await assignmentService.getAssignments();
        setAssignments(data);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploadedFileName(e.target.files[0].name);
    }
  };

  const handleSubmitAssignment = async () => {
    if (!selectedForSubmission) return;
    setSubmitting(true);
    try {
      const updatedList = await assignmentService.submitAssignment(
        selectedForSubmission.id,
        uploadedFileName || 'Assignment_Submission.pdf'
      );
      setAssignments(updatedList);
      setSelectedForSubmission(null);
      setUploadedFileName('');
      setToastMessage('Assignment submitted successfully!');
      setTimeout(() => setToastMessage(''), 3500);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <LoadingState message="Loading Assignments..." subMessage="Fetching course assignments and evaluation statuses" />;
  }

  const filtered = activeTab === 'All' ? assignments : assignments.filter((a) => a.status === activeTab);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Submitted':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Evaluated':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      default:
        return 'bg-amber-50 text-amber-700 border-amber-200';
    }
  };

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
              Assignments &amp; Submissions
            </h1>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
              3 Pending Action
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Track deadline windows, upload submissions, and inspect faculty feedback
          </p>
        </div>

        {/* Tab Filters */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
          {(['Pending', 'Submitted', 'Evaluated', 'All'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                activeTab === tab
                  ? 'bg-blue-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Assignments List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((item) => (
          <div
            key={item.id}
            className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs hover:border-blue-300 transition-all flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-mono font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                  {item.subjectCode}
                </span>
                <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${getStatusBadge(item.status)}`}>
                  {item.status}
                </span>
              </div>

              <div>
                <h3 className="text-sm font-bold text-slate-900">{item.title}</h3>
                <p className="text-xs text-slate-500 mt-0.5">{item.subjectName}</p>
              </div>

              <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                {item.description}
              </p>

              <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-slate-100">
                <div className="flex items-center gap-1.5 text-slate-500">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span>Due: <strong className="text-slate-700">{item.dueDate}</strong></span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-500 justify-end">
                  <span>Max Marks: <strong className="text-slate-800">{item.maxMarks}</strong></span>
                </div>
              </div>

              {/* Evaluation score if present */}
              {item.obtainedMarks !== undefined && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs space-y-1">
                  <div className="flex justify-between font-bold text-emerald-900">
                    <span>Evaluated Score:</span>
                    <span className="font-mono">{item.obtainedMarks} / {item.maxMarks} Marks</span>
                  </div>
                  {item.feedback && (
                    <p className="text-emerald-800 text-[11px]">Feedback: {item.feedback}</p>
                  )}
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="pt-2">
              {item.status === 'Pending' ? (
                <button
                  onClick={() => setSelectedForSubmission(item)}
                  className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs flex items-center justify-center gap-2 transition-all"
                >
                  <UploadCloud className="w-4 h-4" />
                  Submit Assignment
                </button>
              ) : (
                <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
                  <span className="flex items-center gap-1 text-emerald-600 font-semibold">
                    <CheckCircle2 className="w-4 h-4" /> Submitted File
                  </span>
                  <span className="font-mono text-[11px] text-slate-600">{item.submissionFile || 'Submission.pdf'}</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Submission Modal */}
      {selectedForSubmission && (
        <Modal
          isOpen={!!selectedForSubmission}
          onClose={() => {
            setSelectedForSubmission(null);
            setUploadedFileName('');
          }}
          title={`Submit Assignment: ${selectedForSubmission.title}`}
          subtitle={`${selectedForSubmission.subjectName} (${selectedForSubmission.subjectCode}) • Due ${selectedForSubmission.dueDate}`}
          maxWidth="lg"
        >
          <div className="space-y-4">
            <p className="text-xs text-slate-600 leading-relaxed">
              {selectedForSubmission.description}
            </p>

            {/* Drag and Drop Upload Area */}
            <label className="border-2 border-dashed border-slate-300 hover:border-blue-500 rounded-2xl p-6 flex flex-col items-center justify-center text-center cursor-pointer bg-slate-50/50 hover:bg-blue-50/30 transition-all">
              <UploadCloud className="w-8 h-8 text-blue-600 mb-2" />
              <span className="text-xs font-bold text-slate-800">
                {uploadedFileName ? uploadedFileName : 'Click to select or drag & drop PDF/ZIP'}
              </span>
              <span className="text-[11px] text-slate-400 mt-1">
                Accepted: .pdf, .zip, .docx up to 25 MB
              </span>
              <input
                type="file"
                className="hidden"
                accept=".pdf,.zip,.docx,.doc"
                onChange={handleFileChange}
              />
            </label>

            <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-100">
              <button
                onClick={() => {
                  setSelectedForSubmission(null);
                  setUploadedFileName('');
                }}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitAssignment}
                disabled={submitting}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs flex items-center gap-2"
              >
                {submitting ? 'Uploading to CampusOS...' : 'Confirm Submission'}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
