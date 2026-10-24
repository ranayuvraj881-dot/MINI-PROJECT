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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white/95 backdrop-blur-2xl border border-white shadow-[0_15px_40px_rgba(79,70,229,0.05)] rounded-3xl p-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-white p-1.5 border border-slate-200/90 shadow-xs shrink-0 flex items-center justify-center">
            <img src="/glb-logo.png" alt="GL Bajaj Crest" className="w-full h-full object-contain" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                AI Academic Copilot
              </h1>
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-800 border border-indigo-200 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-indigo-600 animate-pulse" />
                Assistant v2.6
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Grounded in GL Bajaj Institute of Technology &amp; Management course syllabus, notes &amp; AKTU archives
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-indigo-100 to-blue-50 border border-indigo-200/80 p-1 shadow-xs shrink-0">
            <img src="/mascot.png" alt="Mascot" className="w-full h-full object-contain" />
          </div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900 text-white font-mono text-xs font-semibold shadow-xs">
            <Database className="w-3.5 h-3.5 text-indigo-300" />
            FastAPI • Gemini RAG
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
