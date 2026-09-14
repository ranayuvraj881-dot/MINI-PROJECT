import React, { useState } from 'react';
import { Calendar, Clock, AlertCircle, FileCheck, ArrowUpRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const UpcomingDeadlinesCard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'All' | 'Exams' | 'Assignments' | 'Events'>('All');
  const navigate = useNavigate();

  const events = [
    {
      id: '1',
      title: 'Compiler Design LALR(1) Assignment',
      category: 'Assignments',
      date: 'Tomorrow, 11:59 PM',
      priority: 'High',
      tag: 'KCS-603'
    },
    {
      id: '2',
      title: 'DBMS B+ Tree Indexing Assignment',
      category: 'Assignments',
      date: 'March 15, 2026',
      priority: 'High',
      tag: 'KCS-601'
    },
    {
      id: '3',
      title: 'Machine Learning Sessional Exam II',
      category: 'Exams',
      date: 'March 18, 10:00 AM',
      priority: 'High',
      tag: 'KOE-064'
    },
    {
      id: '4',
      title: 'GLBITM Tech Fest Hackathon Registration',
      category: 'Events',
      date: 'March 20, 2026',
      priority: 'Normal',
      tag: 'Campus Event'
    }
  ];

  const filtered = activeTab === 'All' ? events : events.filter((e) => e.category === activeTab);

  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-bold text-slate-900">Upcoming Schedule</h3>
          <p className="text-xs text-slate-500">Exams, submissions &amp; university deadlines</p>
        </div>

        {/* Tab filters */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
          {(['All', 'Exams', 'Assignments', 'Events'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors ${
                activeTab === tab
                  ? 'bg-white text-blue-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2.5">
        {filtered.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between p-3 rounded-xl bg-slate-50/70 border border-slate-200/70 hover:bg-slate-50 transition-colors"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                  item.category === 'Exams'
                    ? 'bg-purple-100 text-purple-700'
                    : item.category === 'Assignments'
                    ? 'bg-amber-100 text-amber-700'
                    : 'bg-blue-100 text-blue-700'
                }`}
              >
                {item.category === 'Exams' ? (
                  <Calendar className="w-4 h-4" />
                ) : item.category === 'Assignments' ? (
                  <FileCheck className="w-4 h-4" />
                ) : (
                  <Clock className="w-4 h-4" />
                )}
              </div>

              <div className="min-w-0">
                <p className="text-xs font-bold text-slate-900 truncate">{item.title}</p>
                <div className="flex items-center gap-2 text-[11px] text-slate-500">
                  <span className="font-mono text-blue-700 font-semibold">{item.tag}</span>
                  <span>•</span>
                  <span>{item.date}</span>
                </div>
              </div>
            </div>

            <div className="shrink-0 pl-2">
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                  item.priority === 'High'
                    ? 'bg-rose-50 text-rose-700 border-rose-200'
                    : 'bg-slate-100 text-slate-700 border-slate-200'
                }`}
              >
                {item.priority === 'High' ? 'Urgent' : 'Normal'}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
