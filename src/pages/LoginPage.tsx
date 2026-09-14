import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import { CollegeBrand } from '../components/common/CollegeBrand';
import { ShieldCheck, User, Sparkles, ArrowRight, BookOpen, Building2 } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState<'student' | 'faculty' | 'admin'>('student');
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const handleLogin = async (roleToUse?: 'student' | 'faculty' | 'admin') => {
    const role = roleToUse || selectedRole;
    setIsAuthenticating(true);
    try {
      await authService.switchRole(role);
      if (role === 'faculty') navigate('/faculty');
      else if (role === 'admin') navigate('/admin');
      else navigate('/dashboard');
    } finally {
      setIsAuthenticating(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col justify-center items-center p-4 sm:p-6 text-slate-800">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-100 p-8 space-y-6">
        {/* Brand */}
        <div className="flex flex-col items-center text-center space-y-3">
          <CollegeBrand variant="login" />
          <div className="pt-2">
            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
              Sign In to CampusOS
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Academic ERP &amp; AI Intelligence Workspace
            </p>
          </div>
        </div>

        {/* Demo Quick Role Switcher */}
        <div className="space-y-3 pt-2">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block text-center">
            Select Role Experience
          </span>

          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => setSelectedRole('student')}
              className={`p-3 rounded-2xl border text-center transition-all ${
                selectedRole === 'student'
                  ? 'bg-blue-50 border-blue-600 text-blue-900 shadow-xs'
                  : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
            >
              <User className="w-5 h-5 mx-auto mb-1 text-blue-600" />
              <span className="text-xs font-bold block">Student</span>
              <span className="text-[10px] text-slate-500">Aarav Patel</span>
            </button>

            <button
              type="button"
              onClick={() => setSelectedRole('faculty')}
              className={`p-3 rounded-2xl border text-center transition-all ${
                selectedRole === 'faculty'
                  ? 'bg-blue-50 border-blue-600 text-blue-900 shadow-xs'
                  : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
            >
              <BookOpen className="w-5 h-5 mx-auto mb-1 text-purple-600" />
              <span className="text-xs font-bold block">Faculty</span>
              <span className="text-[10px] text-slate-500">Dr. Sharma</span>
            </button>

            <button
              type="button"
              onClick={() => setSelectedRole('admin')}
              className={`p-3 rounded-2xl border text-center transition-all ${
                selectedRole === 'admin'
                  ? 'bg-blue-50 border-blue-600 text-blue-900 shadow-xs'
                  : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Building2 className="w-5 h-5 mx-auto mb-1 text-amber-600" />
              <span className="text-xs font-bold block">Admin</span>
              <span className="text-[10px] text-slate-500">Dean Office</span>
            </button>
          </div>
        </div>

        {/* Primary Login Button */}
        <button
          type="button"
          onClick={() => handleLogin()}
          disabled={isAuthenticating}
          className="w-full py-3.5 px-4 rounded-xl bg-blue-900 hover:bg-blue-800 text-white text-xs font-bold shadow-md flex items-center justify-center gap-2 transition-all hover:scale-[1.01] disabled:opacity-50"
        >
          <span>{isAuthenticating ? 'Connecting...' : `Enter as ${selectedRole.toUpperCase()}`}</span>
          <ArrowRight className="w-4 h-4" />
        </button>

        <div className="pt-2 text-center">
          <p className="text-[11px] text-slate-400">
            GL Bajaj Institute of Technology &amp; Management • Greater Noida, Uttar Pradesh, India
          </p>
        </div>
      </div>
    </div>
  );
};
