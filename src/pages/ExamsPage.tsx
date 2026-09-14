import React, { useState } from 'react';
import { Calendar, Clock, MapPin, Download, CheckCircle2, AlertCircle, FileText } from 'lucide-react';

export const ExamsPage: React.FC = () => {
  const [downloadToast, setDownloadToast] = useState(false);

  const exams = [
    {
      code: 'KCS-601',
      name: 'Database Management Systems',
      date: 'March 25, 2026',
      time: '09:30 AM – 12:30 PM',
      type: 'Sessional II',
      room: 'Block B - Hall 204',
      seatNumber: 'B-42',
      syllabus: 'Units 1, 2 & 3'
    },
    {
      code: 'KCS-602',
      name: 'Operating Systems',
      date: 'March 27, 2026',
      time: '09:30 AM – 12:30 PM',
      type: 'Sessional II',
      room: 'Block B - Hall 204',
      seatNumber: 'B-42',
      syllabus: 'Units 1, 2, 3 & 4'
    },
    {
      code: 'KCS-603',
      name: 'Compiler Design',
      date: 'March 30, 2026',
      time: '09:30 AM – 12:30 PM',
      type: 'Sessional II',
      room: 'Block B - Hall 205',
      seatNumber: 'B-18',
      syllabus: 'Units 1 & 2'
    },
    {
      code: 'KOE-064',
      name: 'Machine Learning Techniques',
      date: 'April 02, 2026',
      time: '02:00 PM – 05:00 PM',
      type: 'Sessional II',
      room: 'Block A - Audi 1',
      seatNumber: 'A-89',
      syllabus: 'Units 1, 2 & 3'
    }
  ];

  const handleDownloadAdmitCard = () => {
    setDownloadToast(true);
    setTimeout(() => setDownloadToast(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Toast */}
      {downloadToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-xl flex items-center gap-2 text-xs font-semibold animate-in fade-in duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>Admit Card PDF generated &amp; downloaded!</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              Examination Schedules &amp; Hall Tickets
            </h1>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-800 border border-purple-200">
              Odd Sem 2026
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Official GL Bajaj Institute of Technology and Management Exam Controller notifications
          </p>
        </div>

        <button
          onClick={handleDownloadAdmitCard}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs transition-colors shrink-0"
        >
          <Download className="w-4 h-4" />
          Download Hall Ticket / Admit Card
        </button>
      </div>

      {/* Notice box */}
      <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start gap-3">
        <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <strong className="font-bold">AKTU Examination Eligibility Notice:</strong> Students must maintain a minimum of 75% attendance to be eligible for the issuance of university examination admit cards. Mobile phones and smart watches are strictly prohibited in examination blocks.
        </div>
      </div>

      {/* Exam Timetable Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {exams.map((exam) => (
          <div
            key={exam.code}
            className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs space-y-4 hover:border-blue-300 transition-all"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200">
                {exam.code}
              </span>
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200">
                {exam.type}
              </span>
            </div>

            <div>
              <h3 className="text-base font-bold text-slate-900">{exam.name}</h3>
              <p className="text-xs text-slate-500 mt-0.5">Syllabus Scope: {exam.syllabus}</p>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-100 text-xs text-slate-600">
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-blue-600" />
                <span>{exam.date}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-blue-600" />
                <span>{exam.time}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                <span>{exam.room}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-slate-400 font-semibold">Seat:</span>
                <span className="font-mono font-bold text-slate-800">{exam.seatNumber}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
