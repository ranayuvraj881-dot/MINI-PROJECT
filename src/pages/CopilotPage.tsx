import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { AIChatWindow } from '../components/copilot/AIChatWindow';
import { Sparkles, Bot, ShieldCheck, Database } from 'lucide-react';

export const CopilotPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialPrompt = searchParams.get('prompt') || undefined;
  const initialContext = searchParams.get('context') || 'My Academic Data';

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              AI Academic Copilot
            </h1>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-800 border border-blue-200 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-blue-600" />
              RAG Intelligence
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Grounded in GL Bajaj Institute of Technology &amp; Management course syllabus, notes &amp; AKTU archives
          </p>
        </div>

        <div className="flex items-center gap-3 text-xs text-slate-600">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-100 border border-slate-200 font-mono">
            <Database className="w-3.5 h-3.5 text-blue-600" />
            FastAPI / Vector RAG Ready
          </span>
        </div>
      </div>

      {/* Main Chat Interface */}
      <AIChatWindow
        initialPrompt={initialPrompt}
        initialContext={initialContext}
      />
    </div>
  );
};
