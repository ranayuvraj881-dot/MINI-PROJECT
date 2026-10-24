import React, { useState, useEffect } from 'react';
import { riskService } from '../services/riskService';
import { AcademicRiskReport } from '../types';
import { RiskIndicator } from '../components/common/RiskIndicator';
import { ProgressBar } from '../components/common/ProgressBar';
import { LoadingState } from '../components/common/LoadingState';
import {
  ShieldAlert,
  HelpCircle,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  TrendingDown,
  Sparkles,
  Target,
  Sliders
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const AcademicRiskPage: React.FC = () => {
  const navigate = useNavigate();
  const [report, setReport] = useState<AcademicRiskReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [targetCgpa, setTargetCgpa] = useState<number>(9.0);
  const [recalculating, setRecalculating] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const data = await riskService.getRiskReport();
        setReport(data);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleTargetChange = async (newVal: number) => {
    setTargetCgpa(newVal);
    setRecalculating(true);
    try {
      const updated = await riskService.recalculateRiskWithTarget(newVal);
      setReport(updated);
    } finally {
      setRecalculating(false);
    }
  };

  if (loading || !report) {
    return <LoadingState message="Analyzing Academic Health Indicators..." subMessage="Evaluating attendance vectors, CIE scores, and assignment pacing" />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white/95 backdrop-blur-xl border border-white/80 shadow-[0_15px_40px_rgba(79,70,229,0.04)] rounded-3xl p-6">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-amber-50/70 border border-amber-200/70 p-1.5 flex items-center justify-center shrink-0 shadow-xs">
            <img src="/glb-logo.png" alt="GL Bajaj Crest" className="w-full h-full object-contain" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                Academic Health &amp; Predictive Risk
              </h1>
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                Health Diagnostic
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Multivariate diagnostic of attendance safety margins, internal sessional variance &amp; submission velocity
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-400 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
          <span>Future Endpoint: <code>POST /api/v1/ml/predict-risk</code></span>
        </div>
      </div>

      {/* Main Health Card */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-100">
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Overall Academic Risk Status
            </span>
            <div className="flex items-center gap-4">
              <RiskIndicator level={report.overallRisk} score={report.score} />
            </div>
          </div>

          {/* Interactive Target CGPA Slider */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 min-w-[280px] space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-slate-700 flex items-center gap-1.5">
                <Target className="w-3.5 h-3.5 text-blue-600" /> Target Graduation CGPA:
              </span>
              <span className="font-bold text-blue-900 font-mono text-sm">{targetCgpa.toFixed(1)}</span>
            </div>
            <input
              type="range"
              min={7.5}
              max={9.5}
              step={0.1}
              value={targetCgpa}
              onChange={(e) => handleTargetChange(parseFloat(e.target.value))}
              className="w-full accent-blue-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>7.5 (Good)</span>
              <span>8.5 (Honors)</span>
              <span>9.5 (Distinction)</span>
            </div>
          </div>
        </div>

        {/* Factors Breakdown Matrix */}
        <div>
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">
            Diagnostic Health Factors:
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {report.factors.map((factor, index) => {
              const isWarning = factor.status === 'Needs Attention';
              return (
                <div
                  key={index}
                  className={`p-4 rounded-xl border transition-all ${
                    isWarning
                      ? 'bg-amber-50/50 border-amber-200'
                      : 'bg-slate-50/60 border-slate-200/80'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-800">{factor.name}</span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                        isWarning
                          ? 'bg-amber-100 text-amber-800 border-amber-300'
                          : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      }`}
                    >
                      {factor.status}
                    </span>
                  </div>

                  <p className="text-xl font-black text-slate-900">{factor.score}%</p>
                  <p className="text-[11px] text-slate-500 mt-1">{factor.impact}</p>

                  <div className="mt-2.5">
                    <ProgressBar
                      value={factor.score}
                      threshold={75}
                      size="sm"
                      variant={isWarning ? 'warning' : 'safe'}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Section: "Why?" */}
        <div className="p-5 rounded-xl bg-amber-50/70 border border-amber-200/90 text-amber-950 space-y-2">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-700" />
            <h4 className="text-sm font-bold uppercase tracking-wide text-amber-950">
              Why is this risk level assigned?
            </h4>
          </div>
          <p className="text-xs text-amber-900 leading-relaxed font-medium pl-7">
            {report.whyExplanation}
          </p>
        </div>

        {/* Section: "Recommended Actions" */}
        <div className="space-y-3 pt-2">
          <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
            Prioritized Recommended Actions:
          </h4>
          <div className="space-y-2.5">
            {report.recommendedActions.map((action) => (
              <div
                key={action.step}
                className="flex items-start justify-between p-4 rounded-xl bg-slate-50 border border-slate-200 hover:bg-slate-100/70 transition-colors"
              >
                <div className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-blue-900 text-white font-bold flex items-center justify-center text-xs shrink-0 mt-0.5">
                    {action.step}
                  </span>
                  <div>
                    <h5 className="text-xs font-bold text-slate-900">{action.title}</h5>
                    <p className="text-xs text-slate-600 mt-0.5">{action.details}</p>
                  </div>
                </div>

                <button
                  onClick={() => navigate(action.link)}
                  className="shrink-0 text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 ml-4"
                >
                  Resolve
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 text-xs text-blue-900 flex items-start gap-2.5">
          <Sparkles className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" />
          <div>
            <strong>Architecture Notice:</strong> This diagnostic interface represents frontend service orchestration. It is fully decoupled in <code>src/services/riskService.ts</code> ready to stream predictions from your FastAPI scikit-learn / XGBoost model endpoint when connected.
          </div>
        </div>
      </div>
    </div>
  );
};
